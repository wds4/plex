import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConcept_leftNav2.js';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import sendAsync from '../../../../renderer.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

const populateConceptFields = async (currentConceptTableName,wordsqlid) => {
    var sql = " SELECT * FROM "+currentConceptTableName+" WHERE id='"+wordsqlid+"' ";
    console.log("sql: "+sql)
    sendAsync(sql).then((result) => {
        var oConceptData = result[0];
        var currConceptSlug = oConceptData.slug;
        var currConceptRawFile = oConceptData.rawFile;
        var oConceptData = JSON.parse(currConceptRawFile);
        var conceptNameSingular = "";
        var conceptNamePlural = "";
        var conceptDescription = "";
        try {
            var conceptNameSingular = oConceptData.conceptData.name.singular;
        }
        catch (e) {}
        try {
            var conceptNamePlural = oConceptData.conceptData.name.plural;
        }
        catch (e) {}
        try {
            var conceptDescription = oConceptData.conceptData.description;
        }
        catch (e) {}

        jQuery("#currentConceptSqlIdField").html(wordsqlid);
        jQuery("#currentConceptSingularField").val(conceptNameSingular);
        jQuery("#currentConceptPluralField").val(conceptNamePlural);
        jQuery("#currentConceptDescriptionField").val(conceptDescription);
        jQuery("#currentConceptRawFileField").val(currConceptRawFile);
    })
}

export default class SingleConceptMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptSqlID: null,
            conceptGraphTableSqlID: null,
            conceptGraphTableName: null
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var conceptSqlID = this.props.match.params.conceptsqlid
        if (conceptSqlID=="current") {
            conceptSqlID = window.currentConceptSqlID;
        } else {
            window.currentConceptSqlID = conceptSqlID;
        }

        this.setState({conceptSqlID: conceptSqlID } )

        var tableID = window.currentConceptGraphSqlID;
        var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[tableID].tableName;

        this.setState({conceptGraphTableSqlID: tableID } )
        this.setState({conceptGraphTableName: conceptGraphTableName } )

        console.log("about to populateConceptFields; tableID: "+tableID+"; conceptGraphTableName: "+conceptGraphTableName+"; conceptSqlID: "+conceptSqlID)
        populateConceptFields(conceptGraphTableName,conceptSqlID);

        jQuery("#updateCurrentConceptButton").click(function(){
            console.log("updateCurrentConceptButton")
            // var thisTableName = this.state.conceptGraphTableName;
            var wordsqlid = jQuery("#currentConceptSqlIdField").html();
            var conceptNameSingular = jQuery("#currentConceptSingularField").val();
            var conceptNamePlural = jQuery("#currentConceptPluralField").val();
            var conceptDescription = jQuery("#currentConceptDescriptionField").val();
            var conceptRawFile = jQuery("#currentConceptRawFileField").val();
            var sql = "";
            sql += " UPDATE "+conceptGraphTableName;
            sql += " SET ";
            sql += " rawFile='"+conceptRawFile+"' ";
            sql += " WHERE id='"+wordsqlid+"' "
            console.log("sql: "+sql)
            sendAsync(sql).then((result) => {
            });
        })
        jQuery("#deleteCurrentConceptButton").click(function(){
            console.log("deleteCurrentConceptButton; currently not yet implemented")
        })
        MiscFunctions.updateMastheadBar();
        jQuery("#allInputFieldsContainer").change(function(){
            console.log("allInputFieldsContainer")
            var conceptNameSingular = jQuery("#currentConceptSingularField").val();
            var conceptNamePlural = jQuery("#currentConceptPluralField").val();
            var conceptDescription = jQuery("#currentConceptDescriptionField").val();
            var conceptRawFile = jQuery("#currentConceptRawFileField").val();
            var oConcept = JSON.parse(conceptRawFile);
            oConcept.conceptData.name.singular = conceptNameSingular;
            oConcept.conceptData.name.plural = conceptNamePlural;
            oConcept.conceptData.description = conceptDescription;
            var conceptRawFile_updated = JSON.stringify(oConcept,null,4);
            jQuery("#currentConceptRawFileField").val(conceptRawFile_updated);
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
                        <div class="h2">Show / Edit Concept General Info</div>
                        <div id="allInputFieldsContainer" style={{marginTop:"20px"}} >
                            <div id="updateCurrentConceptButton" className="doSomethingButton" style={{marginLeft:"700px"}}>update this Concept</div>
                            <div id="deleteCurrentConceptButton" className="doSomethingButton" style={{marginLeft:"20px"}}>delete this Concept (not yet functional)</div>

                            <br/>

                            <div className="makeNewLeftPanel">sql ID</div>
                            <div id="currentConceptSqlIdField" className="makeNewRightPanel" style={{backgroundColor:"#EFEFEF"}}>
                            </div>

                            <br/>

                            <div className="makeNewLeftPanel" >singular</div>
                            <textarea id="currentConceptSingularField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >plural</div>
                            <textarea id="currentConceptPluralField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >description</div>
                            <textarea id="currentConceptDescriptionField" className="makeNewRightPanel" style={{height:"50px"}}>
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel" >rawFile</div>
                            <textarea id="currentConceptRawFileField" className="makeNewRightPanel" style={{height:"500px"}}>
                            </textarea>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
