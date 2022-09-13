import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");

export default class AllSchemas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">All Concepts!</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div className="standardDoubleColumn" style={{fontSize:"12px",width:"650px"}} >
                            <center>Concepts</center>

                            <div className="singleItemContainer" >
                                <div className="leftColumnLeftPanel" >
                                    a
                                </div>
                                <div className="leftColumnRightPanel" >
                                    b
                                </div>
                            </div>
                        </div>

                        <div className="standardDoubleColumn" style={{fontSize:"12px"}} >
                            <textarea id="rightColumnTextarea" style={{width:"80%",height:"700px"}}>
                                rightColumnTextarea
                            </textarea>
                            <br/>
                            <div id="updateWordButton" className="doSomethingButton">UPDATE</div>
                        </div>

                    </div>

                </fieldset>
            </>
        );
    }
}
