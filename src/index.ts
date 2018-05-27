import * as d3 from 'd3';
import { getC, hues, shades } from './pallete';
import * as firebase from './lib/firebase/index';
import { recordSetup, recordFrame } from './capture';
// @ts-ignore
import interpolate from 'b-spline';

// @ts-ignore
let p = new p5((s: p5) => true);
const pointNumber = 150;
interface followPoint {
  p: [number, number];
  neighbours: followPoint[];
}
let activeSites: number[];
let vor: d3.VoronoiLayout<[number, number]>;
let points: [number, number][];
let recorder: CCapture;
p.setup = function() {
  p.createCanvas(640, 480);
  recorder = recordSetup();
  vor = d3.voronoi().extent([[-20, -20], [p.width + 20, p.height + 20]]);
  points = d3
    .range(pointNumber)
    .map(
      () =>
        [p.random(20, p.width - 20), p.random(20, p.height - 20)] as [
          number,
          number
        ]
    );

  let diagram = vor([...points]);
  diagram.polygons().map((poly, i) => {
    if (i > points.length) return;
    points[i] = d3.polygonCentroid(poly);
  });
  diagram = vor([...points]);
  let groupingOne: followPoint[] = [];
  activeSites = [];
  let polygonList = diagram.polygons();
  polygonList.map((pl, i) => {
    if (i >= points.length) return;
    let poly = pl.slice();
    if (
      p.abs(points[i][0] - p.width / 2) < 75 &&
      p.abs(points[i][1] - p.height / 2) < 75
    ) {
      activeSites.push(i);
      p.fill(getC(hues.reds, 5).hex);

      p.stroke(getC(hues.reds, 6).hex);
      p.strokeWeight(3);
    }
  });
  polygonList.map((pl, i) => {
    if (i > points.length) return;
    p.noFill();
    p.beginShape();
    pl.map(x => {
      p.vertex(x[0], x[1]);
    });
    p.endShape(p.CLOSE);
  });

  for (let [i, x] of diagram.edges.entries()) {
    if (!x) continue;
    if (!x.left || !x.right) continue;
    let [l, r] = [x.left.index, x.right.index];
    if (!activeSites.includes(l) && !activeSites.includes(r)) continue;
    if (activeSites.includes(l) && activeSites.includes(r)) continue;
    let pt = groupingOne.find(value => x[0] === value.p);
    if (!pt) {
      pt = { p: x[0], neighbours: [] };
      groupingOne.push(pt);
    }
    let pt2 = groupingOne.find(value => x[1] === value.p);
    if (!pt2) {
      pt2 = { p: x[1], neighbours: [] };
      groupingOne.push(pt2);
    }
    if (!pt.neighbours.includes(pt2)) {
      pt.neighbours.push(pt2);
    }
    if (!pt2.neighbours.includes(pt)) {
      pt2.neighbours.push(pt);
    }
    p.noStroke();
    p.fill(0);
    p.ellipse(x[0][0], x[0][1], 12);
    groupingOne.push();
    p.fill(255, 0, 0);
    p.fill(0);
    p.ellipse(x[1][0], x[1][1], 12);
    p.fill(255, 0, 0);
  }

  let b = p.color(getC(hues.blues, 5).hex);
  b.setAlpha(120);
  p.fill(b);
};
p.draw = function() {
  p.background(255);
  points[pointNumber] = [p.mouseX, p.mouseY];
  // if (!activeSites.includes(pointNumber)) activeSites.push(pointNumber);
  let t = 0;
  let vDiagram = vor(points);
  let polygons = vDiagram.polygons();
  let blobs = getBlob(activeSites, vDiagram);
  if (blobs.length > 1) {
  }
  for (let blobShape of blobs) {
    blobShape = [
      ...blobShape,
      ...blobShape.slice(0, Math.min(blobShape.length, 4))
    ];
    p.fill(getC(hues.greens, 4).hex);
    p.noStroke();
    p.beginShape();
    for (let t = 0; t < 1; t += 0.0005) {
      let [x, y] = interpolate(t, 4, blobShape);
      p.curveVertex(x, y);
    }
    p.endShape();
  }
  p.noFill();
  p.stroke(getC(hues.neutrals, 6).hex);
  p.strokeWeight(3);
  polygons.map((poly, i) => {
    if (activeSites.includes(i)) {
      p.fill(getC(hues.neutrals, 6).hex);
      let w = getMinDist(poly);
      let [x, y] = d3.polygonCentroid(poly);
      p.ellipse(x, y, w + 3);
    }
    if (i !== pointNumber) points[i] = d3.polygonCentroid(poly);
  });
  recordFrame(p, recorder, 250);
};

const sketch = (p: p5) => {
  p.setup = setup;
  p.draw = draw;
};

function getBlob(
  sites: number[],
  diagram: d3.VoronoiDiagram<[number, number]>
): [number, number][][] {
  let blobs: [number, number][][] = [];
  const activeSites = sites;
  let firstPass: followPoint[] = [];
  for (let [i, x] of diagram.edges.entries()) {
    if (!x) continue;
    if (!x.left || !x.right) continue;
    let [l, r] = [x.left.index, x.right.index];
    if (!activeSites.includes(l) && !activeSites.includes(r)) continue;
    if (activeSites.includes(l) && activeSites.includes(r)) continue;
    let pt = firstPass.find(value => x[0] === value.p);
    if (!pt) {
      pt = { p: x[0], neighbours: [] };
      firstPass.push(pt);
    }
    let pt2 = firstPass.find(value => x[1] === value.p);
    if (!pt2) {
      pt2 = { p: x[1], neighbours: [] };
      firstPass.push(pt2);
    }
    if (!pt.neighbours.includes(pt2)) {
      pt.neighbours.push(pt2);
    }
    if (!pt2.neighbours.includes(pt)) {
      pt2.neighbours.push(pt);
    }
  }
  let isAllBlobs = false;
  let blobCount = 0;
  let sortedParts: followPoint[][] = [];
  while (!isAllBlobs) {
    sortedParts.push([]);
    let partSorter = (part: followPoint, sParts: followPoint[]): void => {
      sParts.push(part);
      if (part.neighbours[0] != null && part.neighbours[1] != null) {
        if (!sParts.includes(part.neighbours[0])) {
          partSorter(part.neighbours[0], sParts);
        } else if (!sParts.includes(part.neighbours[1])) {
          partSorter(part.neighbours[1], sParts);
        }
      }
    };

    let isDone;
    let flatenedParts: followPoint[] = [];
    let emptyParts: followPoint[] = [];
    sortedParts.map(v => v.map(b => flatenedParts.push(b)));
    for (let part of firstPass) {
      if (!flatenedParts.includes(part)) {
        emptyParts.push(part);
      }
    }
    partSorter(emptyParts[0], sortedParts[blobCount]);
    flatenedParts = [];
    emptyParts = [];
    sortedParts.map(v => v.map(b => flatenedParts.push(b)));
    for (let part of firstPass) {
      if (!flatenedParts.includes(part)) {
        emptyParts.push(part);
      }
    }
    if (emptyParts.length < 1) isAllBlobs = true;
    let splineParts = sortedParts[blobCount].map(
      (v: followPoint, i: number) => {
        return [v.p[0], v.p[1]] as [number, number];
      }
    );
    blobs.push(splineParts);
    blobCount++;
  }
  if (blobCount > 3) isAllBlobs = true;
  return blobs;
}
