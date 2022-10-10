import React from 'react';
import { Chart } from "react-google-charts";
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import sendAsync from '../../renderer.js'

// https://developers.google.com/chart/interactive/docs/gallery/linechart
// Discussion of how to update data using react hooks:
// https://blog.logrocket.com/use-google-charts-react/


const jQuery = require("jquery");

export const data = [
  ["Task", "Hours per Day"],
  ["Work", 11],
  ["Eat", 2],
  ["Commute", 2],
  ["Watch TV", 2],
  ["Sleep", 7],
];
export const options = {
  title: "My Daily Activities",
};


export const data2 = [
  ['Year', 'Sales', 'Expenses'],
  ['2004',  1000,      400],
  ['2005',  1170,      460],
  ['2006',  660,       1120],
  ['2007',  1030,      540]
];
export const options2 = {
  title: "My Daily Activities",
};

export default class HelloWorldGoogleCharts extends React.Component {
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
                        <div class="h2">Hello World: Google Charts</div>

                        <Chart
                          chartType="PieChart"
                          data={data}
                          options={options}
                          width={"400px"}
                          height={"200px"}
                        />

                        <Chart
                          chartType="LineChart"
                          data={data2}
                          options={options2}
                          width={"400px"}
                          height={"200px"}
                        />

                    </div>
                </fieldset>
            </>
        );
    }
}
