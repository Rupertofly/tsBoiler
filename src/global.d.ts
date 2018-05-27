///<reference path="./lib/p5.d.ts" />
///<reference path="./lib/p5.play.d.ts" />
declare interface p5 {
  allSprites: p5.Group;
  createSprite(x: number, y: number, width: number, height: number): p5.Sprite;
  drawSprites(): void;
  drawSprite(sprite: p5.Sprite): void;
  animation(anim: p5.Animation, x: number, y: number): void;
  getSprites(): p5.Sprite[];
  removeSprite(sprite: p5.Sprite): void;
  updateSprites(updating: boolean): void;
}
declare class CCapture {
  constructor(opts: object);
  capture(canvas: HTMLElement): void;
  stop(): void;
  save(): void;
  start(): void;
}
declare function checkNested(...obj: string[]): boolean;

declare function distToSegment(
  p: [number, number],
  v: [number, number],
  w: [number, number]
): number;
/**
 * Returns the max radius of an inscribed circle
 *
 * @param {[number, number][]} polygon to inscribe
 * @returns {number} max radius
 */
declare function getMinDist(poly: [number, number][]): number;

declare type pt = [number, number];

declare interface Number {
  bwtn(lowerBound: number, upperBound: number, inclusive: boolean): boolean;
}
