import React from "react";
import * as Constants from './conceptGraphMasthead.js';
import LeftNavbarHelloWorld from './LeftNavbar_HelloWorld';

export default class HelloWorldPages extends React.Component {
  render() {
    return (
      <>
        <fieldset className="mainBody" >
            <LeftNavbarHelloWorld />
            <div className="mainPanel" >
                {Constants.conceptGraphMasthead}
                <div class="h2">Hello World pages</div>
            </div>
        </fieldset>
      </>
    );
  }
}
