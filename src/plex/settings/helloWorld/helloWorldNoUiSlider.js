import React, { useCallback, useState } from 'react';
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import sendAsync from '../../renderer.js'
import Nouislider from "nouislider-react";
import nouislider from "nouislider";
import "nouislider/distribute/nouislider.min.css";

const COLORS = ["red", "green", "blue"];
var colors = [];
class Colorpicker extends React.Component {
  state = {
    color: "rgb(127, 127, 127)"
  };

  onUpdate = index => (render, handle, value, un, percent) => {
        colors[index] = value[0];
        this.setState({ color: `rgb(${colors.join(",")})` });
  };

  render() {
    const { color } = this.state;
    return (
      <div className="slider" id="colorpicker">
        {COLORS.map((item, index) => (
          <Nouislider
            key={item}
            id={item}
            start={127}
            connect={[true, false]}
            orientation="vertical"
            range={{
              min: 0,
              max: 255
            }}
            onUpdate={this.onUpdate(index)}
          />
        ))}
        <div id="result" style={{ background: color, color }} />
      </div>
    );
  }
}

class Vertical extends React.Component {

  render() {

    return (
      <div className="slider" id="colorpicker">
        {COLORS.map((item, index) => (
          <Nouislider

            id={item}
            start={127}
            connect={[true, false]}
            orientation="vertical"
            range={{
              min: 0,
              max: 255
            }}
          />
      ))}

      </div>
    );
  }
}

class NonLinearSlider extends React.Component {
    state = {
      textValue: null,
      percent: null
    };

    onSlide = (render, handle, value, un, percent) => {
      this.setState({
        textValue: value[0].toFixed(2),
        percent: percent[0].toFixed(2)
      });
    };

    render() {
      const { textValue, percent } = this.state;
      return (
        <div className="slider" >
          <Nouislider
            connect
            start={[500, 4000]}
            behaviour="tap"
            range={{
              min: [0],
              "10%": [500, 500],
              "50%": [4000, 1000],
              max: [10000]
            }}
            onSlide={this.onSlide}
          />
          {textValue && percent && (
            <div>
              Value: {textValue}, {percent} %
            </div>
          )}
        </div>
      );
    }
  }

const Slider2 = () => (
    <Nouislider
        connect
        range={{ min: 0, max: 100 }}
        start={[20, 80]}
        pips={{ mode: "count", values: 5 }}
        clickablePips
    />
);

const Slider1 = () => (
    <Nouislider
        connect
        range={{ min: 0, max: 100 }}
        start={[20]}
        pips={{ mode: "count", values: 5 }}
        clickablePips
    />
);

const processSlider = (render, handle, value, un, percent) => {
    console.log("processSlider; value: "+value+"; percent: "+percent)
}
const Slider3 = () => (
    <Nouislider
        connect
        range={{ min: 0, max: 100 }}
        start={[20]}
        pips={{ mode: "count", values: 5 }}
        clickablePips
        onSlide={processSlider}
        step={5}
    />
);

const jQuery = require("jquery");

const Slider0 = () => (
    <Nouislider range={{ min: 0, max: 100 }} start={[20, 80]} connect />
);

function NoUISliderComponent() {
    const [minValue, setMinValue] = useState('30');

    const displayMin = (event) => {
        setMinValue(event[0]);
    }
    const Slider = () => (
        <Nouislider
            range={{ min: 0, max: 100 }} start={[30, 80]}
            connect onChange={displayMin} />
    );

    return (
        <div>
            {Slider()}
            <center>
                <div style={{ display: 'inline', padding: '2%' }}>
                    <h3>Min Value</h3>
                    <br></br>
                    <div style={{ background: 'green',
                                  color: 'white',
                                  display: 'inline',
                                  padding: '1%' }}>
                        {minValue}
                    </div>
                </div>
            </center>
        </div>
    )
}

export default class HelloWorldNoUiSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var verticalSlider = document.getElementById('slider-vertical');
        nouislider.create(verticalSlider, {
            start: 40,
            orientation: 'vertical',
            range: {
                'min': 0,
                'max': 100
            },
            pips: { mode: "count", values: 5 },
            clickablePips: true
        });
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Hello World: NoUiSlider</div>
                        <div>
                            <Vertical />

                            <div style={{marginBottom:"20px"}}>
                                <div id="slider-vertical" style={{height:"400px",marginBottom:"10px",backgroundColor:"orange"}} ></div>
                                <div id="sliderVerticalValueContainer" style={{border:"1px solid black",display:"inline-block",padding:"5px"}} >sliderVerticalValueContainer</div>
                            </div>

                            <div style={{width:"500px",height:"100px"}} >
                                <Slider0 />
                            </div>

                            <div style={{width:"500px",height:"100px"}} >
                                <Slider1 />
                            </div>

                            <div style={{width:"500px",height:"100px"}} >
                                <Slider2 />
                            </div>

                            <div style={{width:"500px",height:"100px"}} >
                                <Slider3 />
                            </div>

                            <div style={{marginLeft:"100px",border:"1px dashed grey",width:"500px",height:"100px"}} >
                                <NonLinearSlider />
                            </div>

                            <div style={{width:"700px",height:"200px"}} >
                                <NoUISliderComponent />
                            </div>

                            <Colorpicker />


                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
