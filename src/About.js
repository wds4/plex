import React from "react";
import * as Constants from './conceptGraphMasthead.js';
// import LeftNavbar from './LeftNavbar';
import LeftNavbarHelloWorld from './LeftNavbar_HelloWorld';
// import * as MiscFunctions from './lib/miscFunctions.js';
import { sortGlobalDynamicData } from './views/globalDynamicData/globalDynamicDataFunctions.js';
const jQuery = require("jquery");

export default class About extends React.Component {
    componentDidMount() {
        var words_obj = {};
        var words_updated_obj = sortGlobalDynamicData(words_obj);
        var words_updated_str = JSON.stringify(words_updated_obj)
        jQuery("#testElement").html(words_updated_str)
    }
    render() {
        return (
          <>
            <fieldset className="mainBody" >
                <LeftNavbarHelloWorld />
                <div className="mainPanel" >
                    {Constants.conceptGraphMasthead}
                    <div class="h2">This is my About page</div>
                    <div id="testElement">test element</div>
                </div>
            </fieldset>
          </>
        );
    }
}
