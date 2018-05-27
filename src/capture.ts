// For Recording

/**
 * Adds A frame to the recording and saves if at end
 *
 */
export function recordFrame(p: p5, recorder: CCapture, lastFrame: number) {
  if (p.frameCount <= lastFrame) {
    recorder.capture(document.getElementById('defaultCanvas0')!);
    if (p.frameCount === lastFrame) {
      recorder.stop();
      recorder.save();
    }
  }
}
/**
 * Set's up Recording
 *
 */
export function recordSetup() {
  let recorder = new CCapture({
    format: 'webm',
    framerate: 30
  });
  let canvasObject = document.getElementById('defaultCanvas0');
  recorder.start();
  return recorder;
}
