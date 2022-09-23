import React from 'react';
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import sendAsync from '../../renderer.js'
// let p5 = require("p5");

const jQuery = require("jquery");

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//Imports P5. Instantiates the sketch at the bottom of this file.
const p5 = require('p5');
//Imports our custom function to decide what color the fill shall be.
// const { getFillColor } = require('./js/src/colorController');

//Starting out sketch and
//injecting p5, as the param p, into our sketch function.
const sketch = (p) => {

  p.setup = () => {
    // Create the canvas
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    // let fillColor = getFillColor(p.mouseIsPressed);
    let fillColor = "purple";
    p.fill(fillColor)

    p.ellipse(p.mouseX, p.mouseY, 80, 80);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  }
}

//Instantiates P5 sketch to keep it out of the global scope.
const app = new p5(sketch);

export default class HelloWorldP5 extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef()
        this.state = {}
    }

    Sketch = (p) => {
        /*
        let x = 100;
        let y = 100;

        p.setup = () => {
           p.createCanvas(200, 200);
        }

        p.draw = () => {
           p.background(0);
           p.fill(255);
           p.rect(x,y,50,50);
        }
        */


        p.setup = () => {
          // Create the canvas
          p.createCanvas(p.windowWidth, p.windowHeight);
        };

        p.draw = () => {
          // let fillColor = getFillColor(p.mouseIsPressed);
          let fillColor = "purple";
          p.fill(fillColor)

          p.ellipse(p.mouseX, p.mouseY, 80, 80);
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
        }
        
    }

    componentDidMount() {
        this.myP5 = new p5(this.Sketch, this.myRef.current)
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Hello World: P5</div>

                        <a target='_blank' href='https://p5js.org' >p5.js</a>

                        <div ref={this.myRef}></div>
                    </div>
                </fieldset>
            </>
        );
    }
}
