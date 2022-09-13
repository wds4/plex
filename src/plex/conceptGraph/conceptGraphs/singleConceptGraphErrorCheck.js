import React from "react";
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

export default class SingleConceptGraphErrorCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptGraphSqlID: null
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
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <ConceptGraphMasthead />
                        <div class="h2">Single Concept Graph Error Check</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div style={{fontSize:"12px",marginLeft:"10px"}}>

                            <div className="rowContainerStyleE">
                                <div className="leftColStyleE" >
                                SQL ID
                                </div>
                                <div id="conceptGraphTableNameContainer" className="rightColStyleE" >
                                {window.currentConceptGraphSqlID}
                                </div>
                            </div>

                            <div className="rowContainerStyleE">
                                <div className="leftColStyleE" >
                                expected tableName (per SQL)
                                </div>
                                <div id="conceptGraphTableNameContainer" className="rightColStyleE" >
                                {window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName}
                                </div>
                            </div>

                            <div className="rowContainerStyleE">
                                <div className="leftColStyleE" >
                                does concept graph table exist?
                                </div>
                                <div className="rightColStyleE" >
                                ?
                                </div>
                            </div>

                            <div className="rowContainerStyleE">
                                <div className="leftColStyleE" >
                                does mainSchema exist?
                                </div>
                                <div className="rightColStyleE" >
                                ?
                                </div>
                            </div>

                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
