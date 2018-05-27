import 'd3';
import { getC } from './pallete';
import * as firebase from './lib/firebase/index';
import { recordSetup, recordFrame } from './capture';
// @ts-ignore

// @ts-ignore
let p = new p5((s: p5) => true);
p.setup = function() {
  p.createCanvas(500, 500);
};
p.draw = function() {
  p.background(p.frameCount % 255);
};

const sketch = (p: p5) => {
  p.setup = setup;
  p.draw = draw;
};
