import React from 'react';
import { render } from "react-dom";
import { VictoryPie, VictoryChart, VictoryLine, VictoryScatter } from "victory";
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import sendAsync from '../../renderer.js'
let c2 = require("c2.js");
let p5 = require("p5");

const jQuery = require("jquery");

const PieChart = () => {
    return <VictoryPie />;
};




const data = [
  { x: 0, y: 0 },
  { x: 1, y: 2 },
  { x: 2, y: 1 },
  { x: 3, y: 4 },
  { x: 4, y: 3 },
  { x: 5, y: 5 }
];

const cartesianInterpolations = [
  "basis",
  "bundle",
  "cardinal",
  "catmullRom",
  "linear",
  "monotoneX",
  "monotoneY",
  "natural",
  "step",
  "stepAfter",
  "stepBefore"
];

const polarInterpolations = [
  "basis",
  "cardinal",
  "catmullRom",
  "linear"
];

const InterpolationSelect = ({ currentValue, values, onChange }) => (
  <select onChange={onChange} value={currentValue} style={{ width: 75 }}>
    {values.map(
      (value) => <option value={value} key={value}>{value}</option>
    )}
  </select>
);




export default class HelloWorldVictory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            interpolation: "linear",
            polar: false
        }
    }

    componentDidMount() {

    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Hello World: Victory</div>

                        <div style={{width:"200px",height:"200px"}} >
                            <PieChart />
                        </div>






                        <div style={{width:"400px",height:"400px"}} >
                          <InterpolationSelect
                            currentValue={this.state.interpolation}
                            values={this.state.polar ? polarInterpolations : cartesianInterpolations }
                            onChange={(event) => this.setState({ interpolation: event.target.value })}
                          />
                          <input
                            type="checkbox"
                            id="polar"
                            value={this.state.polar}
                            onChange={
                              (event) => this.setState({
                                polar: event.target.checked,
                                interpolation: "linear"
                              })
                            }
                            style={{ marginLeft: 25, marginRight: 5 }}
                          />
                          <label htmlFor="polar">polar</label>
                          <VictoryChart polar={this.state.polar} height={390}>
                            <VictoryLine
                              interpolation={this.state.interpolation} data={data}
                              style={{ data: { stroke: "#c43a31" } }}
                            />
                            <VictoryScatter data={data}
                              size={5}
                              style={{ data: { fill: "#c43a31" } }}
                            />
                          </VictoryChart>
                        </div>



                    </div>
                </fieldset>
            </>
        );
    }
}
