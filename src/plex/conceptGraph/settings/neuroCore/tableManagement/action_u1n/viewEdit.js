import React from "react";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/neuroCore_actions_u1n_leftNav2.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

const actionTableName = "conceptGraphActions_u1n";

const populateActionFields = async (actionTableName,actionSqlID) => {
    // var sql = " SELECT * FROM "+actionTableName+" WHERE id='"+actionSqlID+"' ";
    var sql = " SELECT * FROM "+actionTableName+" WHERE actionName='"+actionSqlID+"' ";
    console.log("sql: "+sql)
    sendAsync(sql).then((result) => {
        if (result.length == 1) {
            console.log("result.length == 1")
            var oActionData = result[0];

            var actionSqlID = oActionData.id;
            var actionName = oActionData.actionName;
            var opCodesB = oActionData.opCodesB;
            var patternsList = oActionData.patternsList;
            var description = oActionData.description;
            var javascript = oActionData.javascript;

            var actionNameSlug_ified = actionName.replaceAll(".","_").toLowerCase();

            var actionFunctions = "";
            var aOpCodesB = opCodesB.split(",");
            if (jQuery.inArray("a",aOpCodesB) > -1) {
                actionFunctions += "Loki pathway<br>";
            }
            if (jQuery.inArray("b",aOpCodesB) > -1) {
                actionFunctions += "Property tree<br>";
            }
            if (jQuery.inArray("c",aOpCodesB) > -1) {
                actionFunctions += "Concept structure<br>";
            }
            if (jQuery.inArray("rV0",aOpCodesB) > -1) {
                actionFunctions += "Restricts Value of property (0)<br>";
            }
            if (jQuery.inArray("rV1",aOpCodesB) > -1) {
                actionFunctions += "Restricts Value of property (1)<br>";
            }
        }

        jQuery("#currentActionFunctionsField").html(actionFunctions);

        jQuery("#currentActionSqlIdField").html(actionSqlID);
        jQuery("#currentActionNameField").val(actionName);
        jQuery("#currentActionOpCodesBField").val(opCodesB);
        jQuery("#currentActionPatternsListField").val(patternsList);
        jQuery("#currentActionJavascriptField").val(javascript);
        jQuery("#currentActionDescriptionField").val(description);

        var actionImage = "/assets/img/"+actionNameSlug_ified+".png";
        // var actionImage = "/assets/img/a_b_u1n_01.png;

        var actionImageHTML = "<img src='"+actionImage+"' style=width:800px; />";

        jQuery("#thisActionImageContainer").html(actionImageHTML)

    })
}

export default class ViewEditActionUpdateSingleNode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            actionSqlID: null
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var actionSqlID = this.props.match.params.actionsqlid;
        this.setState({actionSqlID: actionSqlID } )

        populateActionFields(actionTableName,actionSqlID);

        jQuery("#updateCurrentActionButton").click(function(){
            console.log("updateCurrentActionButton")
            // var thisTableName = this.state.conceptGraphTableName;
            var actionsqlid = jQuery("#currentActionSqlIdField").html();

            var actionName = jQuery("#currentActionNameField").val();
            var opCodesB = jQuery("#currentActionOpCodesBField").val();
            var patternsList = jQuery("#currentActionPatternsListField").val();
            var description = jQuery("#currentActionDescriptionField").val();
            var javascript = jQuery("#currentActionJavascriptField").val();

            var name = jQuery("#currentActionNameField").val();
            var sql = "";
            sql += " UPDATE "+actionTableName;
            sql += " SET ";
            sql += " actionName='"+name+"', ";
            sql += " opCodesB='"+opCodesB+"', ";
            sql += " patternsList='"+patternsList+"', ";
            sql += " description='"+description+"', ";
            sql += " javascript='"+javascript+"' ";

            sql += " WHERE id='"+actionsqlid+"' "
            // console.log("sql: "+sql)
            sendAsync(sql);
        })
        jQuery("#deleteCurrentActionButton").click(function(){
            console.log("deleteCurrentActionButton; currently not yet implemented")
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
                        <div class="h2">View Edit Action: Single Node</div>
                        <div id="allInputFieldsContainer" style={{marginTop:"20px"}} >

                            <div className="makeNewLeftPanel">action name (search):</div>
                            <div className="makeNewRightPanel" style={{backgroundColor:"#EFEFEF"}}>
                            {this.state.actionSqlID}
                            </div>

                            <br/><br/>

                            <center></center>

                            <div className="makeNewLeftPanel"></div>
                            <div className="makeNewRightPanel" style={{backgroundColor:"#EFEFEF",fontSize:"16px"}}>
                            in SQL database: (if blank, then above action name is not yet created)
                            </div>

                            <br/><br/>

                            <div className="makeNewLeftPanel">functions</div>
                            <div id="currentActionFunctionsField" className="makeNewRightPanel" style={{backgroundColor:"#EFEFEF"}}>
                            </div>

                            <br/>

                            <div className="makeNewLeftPanel">sql ID</div>
                            <div id="currentActionSqlIdField" className="makeNewRightPanel" style={{backgroundColor:"#EFEFEF"}}>
                            </div>

                            <br/>

                            <div className="makeNewLeftPanel" >actionName</div>
                            <textarea id="currentActionNameField" className="makeNewRightPanel">
                            </textarea>

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
                            <textarea id="currentActionDescriptionField" className="makeNewRightPanel" style={{height:"150px"}} >
                            </textarea>

                            <br/>

                            <div >javascript:</div>
                            <textarea id="currentActionJavascriptField" style={{height:"500px",width:"70%"}}>
                            </textarea>

                            <br/>

                            <div id="updateCurrentActionButton" className="doSomethingButton" >update this Action</div>
                            <br/>
                            <div id="deleteCurrentActionButton" className="doSomethingButton" >delete this Action (not yet functional)</div>
                            <br/>
                            <div id="thisActionImageContainer">thisActionImageContainer</div>
                            <br/>
                            <pre>
                            purpose is to update oRFL.updated with lines like:<br/>
                            oRFL.updated[nT_slug] = oNodeTo;<br/>
                            oRFL.new[newWord_slug] = oNewWord;<br/><br/>

                            available variables for javascript:<br/>
                            aCurrentSlugs, aUpdatedSlugs, aNewSlugs, aAllSlugs, which are arrays of slugs<br/>
                            oRFL, which includes oRFL.current and oRFL.updated<br/>
                            oAuxiliaryData, which:<br/>
                            for actions triggered by s1r patterns consists of: oAuxiliaryData.relationship, and from which have already been extracted:<br/>
                            <li>nF_slug, nT_slug</li>
                            <li>oNodeFrom, oNodeTo</li>
                            <br/>
                            for actions triggered by s1n patterns consists of: oAuxiliaryData.node, and from which have already been extracted:<br/>
                            <li>node_slug</li>
                            <li>oNode</li>
                            <li>nextPatternCode, e.g.: P.rV11.s1n.00 (h5lpvx_restrictsValue_0rhze6) </li>
                            <li>nextUniqueID, e.g.: h5lpvx_restrictsValue_0rhze6</li>
                            <br/>

                            available functions include:<br/>
                            MiscFunctions<br/>
                            <li>oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNewRel,oRFL.current)</li>
                            <li>.pushIfNotAlreadyThere</li>
                            <li>.pushIfNotAlreadyThere_arrayToArray</li>
                            <li>.cloneObj</li>
                            <li>await MiscFunctions.timeout(200)</li>
                            <li>var oNewWord = await MiscFunctions.createNewWordByTemplate(wordType)</li>
                            <br/>
                            ConceptGraphFunctions<br/>
                            <li>.translateSlugsToUniquePropertyValues</li>
                            <br/>
                            NeuroCoreFunctions<br/>
                            <li>oWord = NeuroCoreFunctions.fetchNewestRawFile(wordSlug,oRFL)</li>
                            </pre>

                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
