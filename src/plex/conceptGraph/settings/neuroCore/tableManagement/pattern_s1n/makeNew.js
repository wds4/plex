import React from "react";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/neuroCore_patterns_s1n_leftNav2.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

const patternTableName = "conceptGraphPatterns_s1n";

export default class MakeNewPatternSingleNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        jQuery("#makeNewPatternButton").click(function(){
            console.log("makeNewPatternButton")

            var patternName = jQuery("#currentPatternNameField").val();
            var opCodesB = jQuery("#currentPatternOpCodesBField").val();
            var opCodeD = jQuery("#currentPatternOpCodeDField").val();
            var actionsList = jQuery("#currentPatternActionsListField").val();
            var description = jQuery("#currentPatternDescriptionField").val();
            var sql = "";
            sql += "INSERT OR IGNORE INTO " + patternTableName;
            sql += " (patternName, opCodesB, opCodeD, actionsList, description) ";
            sql += " VALUES(";
            sql += " '"+patternName+"', ";
            sql += " '"+opCodesB+"', ";
            sql += " '"+opCodeD+"', ";
            sql += " '"+actionsList+"', ";
            sql += " '"+description+"' ";
            sql += " )";

            console.log("sql: "+sql)
            sendAsync(sql).then((result) => { });
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Make New Pattern: Single Node</div>

                        <div id="allInputFieldsContainer" style={{marginTop:"20px"}} >

                            <div className="makeNewLeftPanel" >patternName</div>
                            <textarea id="currentPatternNameField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >opCodesB</div>
                            <textarea id="currentPatternOpCodesBField" className="makeNewRightPanel">
                            </textarea>a

                            <br/>

                            <div className="makeNewLeftPanel" >opCodeD</div>
                            <textarea id="currentPatternOpCodeDField" className="makeNewRightPanel">
                            </textarea>01

                            <br/>

                            <div className="makeNewLeftPanel" >actionsList</div>
                            <textarea id="currentPatternActionsListField" className="makeNewRightPanel">
                            </textarea>A.a.u1n.01,A.c.u1n.01

                            <br/>

                            <div className="makeNewLeftPanel" >description</div>
                            <textarea id="currentPatternDescriptionField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div id="makeNewPatternButton" className="doSomethingButton" style={{marginLeft:"320px"}}>make new Pattern</div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
