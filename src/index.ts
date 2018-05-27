import 'd3';
import { getC } from './pallete';
import * as firebase from './lib/firebase/index';
import { recordSetup, recordFrame } from './capture';
// @ts-ignore

// @ts-ignore
const config = {
  apiKey: 'AIzaSyCZh7bDhcHYesPc0FeKxriL7EZ2Kopk2us',
  authDomain: 'awesomesaucerupert.firebaseapp.com',
  databaseURL: 'https://awesomesaucerupert.firebaseio.com',
  projectId: 'awesomesaucerupert',
  storageBucket: 'awesomesaucerupert.appspot.com',
  messagingSenderId: '465094389233'
};
const myApp = firebase.initializeApp(config);
console.log(myApp);
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
