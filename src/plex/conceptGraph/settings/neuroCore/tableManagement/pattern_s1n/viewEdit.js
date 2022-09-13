import React from "react";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/neuroCore_patterns_s1n_leftNav2.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

const patternTableName = "conceptGraphPatterns_s1n";

const populatePatternFields = async (patternTableName,patternName) => {
    var sql = " SELECT * FROM "+patternTableName+" WHERE patternName='"+patternName+"' ";
    console.log("sql: "+sql)
    sendAsync(sql).then((result) => {
        var oPatternData = result[0];

        var patternSqlID = oPatternData.id;

        var patternName = oPatternData.patternName;

        var opCodesB = oPatternData.opCodesB;
        var opCodeD = oPatternData.opCodeD;

        var actionsList = oPatternData.actionsList;
        var description = oPatternData.description;

        var javascript = oPatternData.javascript;

        jQuery("#currentPatternSqlIdField").html(patternSqlID);
        jQuery("#currentPatternNameField").val(patternName);

        jQuery("#currentPatternOpCodesBField").val(opCodesB);
        jQuery("#currentPatternOpCodeDField").val(opCodeD);

        jQuery("#currentPatternActionsListField").val(actionsList);
        jQuery("#currentPatternDescriptionField").val(description);

        jQuery("#currentPatternJavascriptField").val(javascript);
    })
}

export default class ViewEditPatternSingleNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patternSqlID: null
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var patternSqlID = this.props.match.params.patternsqlid;
        this.setState({patternSqlID: patternSqlID } )

        populatePatternFields(patternTableName,patternSqlID);

        jQuery("#updateCurrentPatternButton").click(function(){
            console.log("updateCurrentPatternButton")
            // var thisTableName = this.state.conceptGraphTableName;
            var patternsqlid = jQuery("#currentPatternSqlIdField").html();

            var name = jQuery("#currentPatternNameField").val();
            var opCodesB = jQuery("#currentPatternOpCodesBField").val();
            var opCodeD = jQuery("#currentPatternOpCodeDField").val();
            var actionsList = jQuery("#currentPatternActionsListField").val();
            var description = jQuery("#currentPatternDescriptionField").val();
            var javascript = jQuery("#currentPatternJavascriptField").val();
            var sql = "";
            sql += " UPDATE "+patternTableName;
            sql += " SET ";
            sql += " patternName='"+name+"', ";
            sql += " opCodesB='"+opCodesB+"', ";
            sql += " opCodeD='"+opCodeD+"', ";
            sql += " actionsList='"+actionsList+"', ";
            sql += " description='"+description+"', ";
            sql += " javascript='"+javascript+"' ";
            sql += " WHERE id='"+patternsqlid+"' "
            console.log("sql: "+sql)
            sendAsync(sql).then((result) => { });
        })
        jQuery("#deleteCurrentPatternButton").click(function(){
            console.log("deleteCurrentPatternButton; currently not yet implemented")
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
                        <div class="h2">View Edit Pattern: Single Node</div>
                        <div id="allInputFieldsContainer" style={{marginTop:"20px"}} >

                            <div className="makeNewLeftPanel">sql ID</div>
                            <div id="currentPatternSqlIdField" className="makeNewRightPanel" style={{backgroundColor:"#EFEFEF"}}>
                            </div>

                            <br/>

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

                            <div >javascript:</div>
                            <textarea id="currentPatternJavascriptField" style={{height:"300px",width:"50%"}}>
                            </textarea>

                            <br/>

                            <div id="updateCurrentPatternButton" className="doSomethingButton" style={{marginLeft:"320px"}}>update this Pattern</div>
                            <br/>
                            <div id="deleteCurrentPatternButton" className="doSomethingButton" style={{marginLeft:"320px"}}>delete this Pattern (not yet functional)</div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
