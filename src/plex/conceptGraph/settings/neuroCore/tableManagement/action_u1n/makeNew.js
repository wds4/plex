import React from "react";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/neuroCore_actions_u1n_leftNav2.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

const actionTableName = "conceptGraphActions_u1n";

export default class MakeNewActionUpdateSingleNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        jQuery("#makeNewActionButton").click(function(){
            console.log("makeNewActionButton")

            var actionName = jQuery("#currentActionNameField").val();
            var opCodesB = jQuery("#currentActionOpCodesBField").val();
            var patternsList = jQuery("#currentActionPatternsListField").val();
            var description = jQuery("#currentActionDescriptionField").val();
            var javascript = jQuery("#currentActionJavascriptField").val();

            var sql = "";
            sql += "INSERT OR IGNORE INTO " + actionTableName;
            sql += " (actionName, opCodesB, patternsList, description, javascript) ";
            sql += " VALUES(";
            sql += " '"+actionName+"', ";
            sql += " '"+opCodesB+"', ";
            sql += " '"+patternsList+"', ";
            sql += " '"+description+"', ";
            sql += " '"+javascript+"' ";
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
                        <div class="h2">Make New Action: Update Single Node</div>

                        <div id="allInputFieldsContainer" style={{marginTop:"20px"}} >

                            <div className="makeNewLeftPanel" >actionName</div>
                            <textarea id="currentActionNameField" className="makeNewRightPanel">
                            </textarea>A.b.u1n.01

                            <br/>

                            <div className="makeNewLeftPanel" >opCodesB</div>
                            <textarea id="currentActionOpCodesBField" className="makeNewRightPanel">
                            </textarea>b

                            <br/>

                            <div className="makeNewLeftPanel" >patternsList</div>
                            <textarea id="currentActionPatternsListField" className="makeNewRightPanel">
                            </textarea>A.a.u1n.01,A.c.u1n.01

                            <br/>

                            <div className="makeNewLeftPanel" >description</div>
                            <textarea id="currentActionDescriptionField" className="makeNewRightPanel" style={{height:"100px"}}>
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >javascript</div>
                            <textarea id="currentActionJavascriptField" className="makeNewRightPanel" style={{height:"200px"}}>
                            </textarea>var arr1 = blahBlah

                            <br/>

                            <div id="makeNewActionButton" className="doSomethingButton" style={{marginLeft:"320px"}}>make new Action</div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
