import React from "react";
import IpfsHttpClient from 'ipfs-http-client';
import sendAsync from '../../renderer';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph } from '../addANewConcept';
import Type3ModuleB from './propertyType3ModuleB';
import * as MiscFunctions from '../../lib/miscFunctions.js';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

function updateRelationship(relationshipnumber) {
    var updatedRel_obj = {};
    updatedRel_obj.nodeFrom = {};
    updatedRel_obj.relationshipType = {};
    updatedRel_obj.nodeTo = {};
    // var schemaSlug = jQuery("#schemaSlug_"+relationshipnumber).data("schemaslug");
    // updatedRel_obj.nodeFrom.slug=schemaSlug

    var nF_slug = jQuery("#nF_slug_"+relationshipnumber).data("nodefromslug");
    updatedRel_obj.nodeFrom.slug=nF_slug

    var rT_slug = jQuery("#rT_slug_"+relationshipnumber).data("reltypeslug");
    updatedRel_obj.relationshipType.slug=rT_slug
    var relData = rT_slug+"Data";
    updatedRel_obj.relationshipType[relData] = {};
    var rT_field = jQuery("#rT_field_"+relationshipnumber).val();
    updatedRel_obj.relationshipType[relData].field = rT_field;

    var rT_dep = jQuery("#rT_dependencies_"+relationshipnumber+" option:selected").val();
    if (rT_dep=="true") {
        var rT_dep_boolean = true;
    }
    if (rT_dep=="false") {
        var rT_dep_boolean = false;
    }
    updatedRel_obj.relationshipType[relData].dependencies = rT_dep_boolean;

    var nT_slug = jQuery("#nT_slug_"+relationshipnumber).data("nodetoslug");
    updatedRel_obj.nodeTo.slug=nT_slug

    var updatedRel_str = JSON.stringify(updatedRel_obj,null,4);
    jQuery("#rel_new_"+relationshipnumber).html(updatedRel_str)
    jQuery("#rel_new_"+relationshipnumber).val(updatedRel_str)
}

function updateSchemaWithEnumRel_enum(schema_slug,relnumber) {
    var schema_rF_obj = lookupRawFileBySlug_obj[schema_slug];
    var oldRel_str = jQuery("#rel_old_"+relnumber).val();
    var newRel_str = jQuery("#rel_new_"+relnumber).val();
    // console.log("oldRel_str: "+oldRel_str)
    // console.log("newRel_str: "+newRel_str)
    var oldRel_obj = JSON.parse(oldRel_str);
    var newRel_obj = JSON.parse(newRel_str);
    schema_rF_obj = MiscFunctions.removeRelFromSchema(schema_rF_obj,oldRel_obj)
    schema_rF_obj = MiscFunctions.updateSchemaWithNewRel(schema_rF_obj,newRel_obj,lookupRawFileBySlug_obj);
    // schema_rF_obj.wordData.foo = "barr";
    var schema_rF_str = JSON.stringify(schema_rF_obj,null,4);
    jQuery("#schema_edited_rawFile").html(schema_rF_str)
    jQuery("#schema_edited_rawFile").val(schema_rF_str)
}

function updateEnumerationRelationships_enum() {
    var enumeration_slug = jQuery("#enumerationSelector_enum option:selected").data("slug");
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");

    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;

    sendAsync(sql).then((words_arr) => {
        var activeRelsHTML = "";
        var numWords = words_arr.length;
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
            var nextWord_ipns = nextWord_obj.metaData.ipns;

            lookupRawFileBySlug_obj[nextWord_slug] = nextWord_obj;
            lookupRawFileBySlug_obj.edited[nextWord_slug] = nextWord_obj;

            if (jQuery.inArray("schema",nextWord_wordTypes) > -1) {
                var rels_arr = nextWord_obj.schemaData.relationships;
                var numRels = rels_arr.length;
                for (var r=0;r<numRels;r++) {
                    var nextRel_obj = rels_arr[r];
                    if (nextRel_obj.nodeFrom.slug==enumeration_slug) {
                        var nextRel_str = JSON.stringify(nextRel_obj,null,4);
                        activeRelsHTML += "<div data-relationshipnumber="+r+" class='basicContainer_small activeRelContainer' style=background-color:#DFDFDF; >";
                            activeRelsHTML += "<div class=leftCol_enum >";
                            activeRelsHTML += "schema";
                            activeRelsHTML += "</div>";
                            activeRelsHTML += "<div id=schemaSlug_"+r+" data-schemaslug="+nextWord_slug+" class=rightCol_enum >";
                            activeRelsHTML += nextWord_slug;
                            activeRelsHTML += "</div>";

                            activeRelsHTML += "<br>";

                            activeRelsHTML += "show schema (far right): ";
                            activeRelsHTML += "<div class='doSomethingButton_small showOldSchemaButton' data-relnumber="+r+" data-schema="+nextWord_slug+" id=showOldSchemaButton >old</div>";
                            activeRelsHTML += "<div class='doSomethingButton_small showNewSchemaButton' data-relnumber="+r+" data-schema="+nextWord_slug+" id=showNewSchemaButton >new</div>";
                            // activeRelsHTML += "<div class='doSomethingButton_small updateSchemaButton' data-relnumber="+r+" data-schema="+nextWord_slug+" >UPDATE in SQL</div>";

                            activeRelsHTML += "<br>";

                            var nF_slug = nextRel_obj.nodeFrom.slug;
                            activeRelsHTML += "<div class=leftCol_enum >";
                            activeRelsHTML += "nodeFrom";
                            activeRelsHTML += "</div>";
                            activeRelsHTML += "<div id=nF_slug_"+r+" data-nodefromslug="+nF_slug+" class=rightCol_enum >";
                            activeRelsHTML += nF_slug;
                            activeRelsHTML += "</div>";

                            activeRelsHTML += "<br>";

                            var rT_slug = nextRel_obj.relationshipType.slug
                            activeRelsHTML += "<div class=leftCol_enum >";
                            activeRelsHTML += "relType";
                            activeRelsHTML += "</div>";
                            activeRelsHTML += "<div id=rT_slug_"+r+" data-reltypeslug="+rT_slug+" class=rightCol_enum >";
                            activeRelsHTML += rT_slug;
                            activeRelsHTML += "</div>";

                            activeRelsHTML += "<br>";
                            var rT_field = "";
                            if (nextRel_obj.relationshipType.hasOwnProperty("addToConceptGraphPropertiesData")) {
                                if (nextRel_obj.relationshipType.addToConceptGraphPropertiesData.hasOwnProperty("field")) {
                                    rT_field = nextRel_obj.relationshipType.addToConceptGraphPropertiesData.field;
                                }
                            }

                            activeRelsHTML += "<div class=leftCol_enum >";
                            activeRelsHTML += "field";
                            activeRelsHTML += "</div>";
                            activeRelsHTML += "<div class=rightCol_enum >";
                            activeRelsHTML += "<textarea id=rT_field_"+r+" style='width:300px;height:25px;' >";
                            activeRelsHTML += rT_field;
                            activeRelsHTML += "</textarea >";
                            activeRelsHTML += "</div>";

                            activeRelsHTML += "<br>";

                            activeRelsHTML += "<div class=leftCol_enum >";
                            activeRelsHTML += "dependencies";
                            activeRelsHTML += "</div>";
                            activeRelsHTML += "<div id=rT_dependencies_"+r+" class=rightCol_enum >";
                                var dep = false;
                                if (nextRel_obj.relationshipType.hasOwnProperty("addToConceptGraphPropertiesData")) {
                                    dep = nextRel_obj.relationshipType.addToConceptGraphPropertiesData.dependencies;
                                }
                                activeRelsHTML += "<select>";
                                    activeRelsHTML += "<option ";
                                    if (dep==true) { activeRelsHTML += "selected"; }
                                    activeRelsHTML += " >";
                                    activeRelsHTML += true;
                                    activeRelsHTML += "</option>";
                                    activeRelsHTML += "<option ";
                                    if (dep==false) { activeRelsHTML += "selected"; }
                                    activeRelsHTML += " >";
                                    activeRelsHTML += false;
                                    activeRelsHTML += "</option>";
                                activeRelsHTML += "</select>";
                            activeRelsHTML += "</div>";

                            activeRelsHTML += "<br>";

                            var nT_slug = nextRel_obj.nodeTo.slug;
                            activeRelsHTML += "<div class=leftCol_enum >";
                            activeRelsHTML += "nodeTo";
                            activeRelsHTML += "</div>";
                            activeRelsHTML += "<div id=nT_slug_"+r+" data-nodetoslug="+nT_slug+" class=rightCol_enum >";
                            activeRelsHTML += nT_slug;
                            activeRelsHTML += "</div>";

                            activeRelsHTML += "<br>";

                            activeRelsHTML += "<input type=checkbox id=deleteRelationship > delete this relationship";

                            activeRelsHTML += "<br>";

                            activeRelsHTML += "show rel (below): ";
                            activeRelsHTML += "<div class='doSomethingButton_small showRelOldButton' data-schema="+nextWord_slug+" data-relnumber="+r+" id=showRelOld_"+r+" >old</div>";
                            activeRelsHTML += "<div class='doSomethingButton_small showRelNewButton' data-schema="+nextWord_slug+" data-relnumber="+r+" id=showRelNew_"+r+" >new</div>";

                            activeRelsHTML += "<br>";

                            activeRelsHTML += "<textarea id=rel_old_"+r+" style='width:95%;height:80px;' >";
                            activeRelsHTML += nextRel_str;
                            activeRelsHTML += "</textarea >";

                            activeRelsHTML += "<textarea id=rel_new_"+r+" style='width:95%;height:80px;display:none;border-color:orange;' >";
                            activeRelsHTML += nextRel_str;
                            activeRelsHTML += "</textarea >";
                        activeRelsHTML += "</div>";
                    }
                }
            }
        }
        jQuery("#activeRelationshipsContainer").html(activeRelsHTML)
        jQuery(".activeRelContainer").change(function(){
            var relationshipnumber = jQuery(this).data("relationshipnumber")
            // console.log("activeRelContainer changed; relationshipnumber: "+relationshipnumber)
            updateRelationship(relationshipnumber)
        });
        jQuery(".showRelOldButton").click(function(){
            var schema_slug = jQuery(this).data("schema")
            var relnumber = jQuery(this).data("relnumber")
            // console.log("showRelOldButton clicked; schema_slug: "+schema_slug+"; relnumber: "+relnumber)
            jQuery("#showRelOld_"+relnumber).css("backgroundColor","green")
            jQuery("#showRelNew_"+relnumber).css("backgroundColor","grey")
            jQuery("#rel_old_"+relnumber).css("display","block")
            jQuery("#rel_new_"+relnumber).css("display","none")
        });
        jQuery(".showRelNewButton").click(function(){
            var schema_slug = jQuery(this).data("schema")
            var relnumber = jQuery(this).data("relnumber")
            updateRelationship(relnumber)
            // console.log("showRelNewButton clicked; schema_slug: "+schema_slug+"; relnumber: "+relnumber)
            jQuery("#showRelOld_"+relnumber).css("backgroundColor","grey")
            jQuery("#showRelNew_"+relnumber).css("backgroundColor","green")
            jQuery("#rel_old_"+relnumber).css("display","none")
            jQuery("#rel_new_"+relnumber).css("display","block")
        });
        jQuery(".showOldSchemaButton").click(function(){
            var schema_slug = jQuery(this).data("schema")
            var schema_rF_obj = lookupRawFileBySlug_obj[schema_slug];
            var schema_rF_str = JSON.stringify(schema_rF_obj,null,4);
            jQuery("#schema_unedited_rawFile").html(schema_rF_str)
            jQuery("#schema_unedited_rawFile").val(schema_rF_str)
            jQuery("#schema_edited_rawFile").css("display","none");
            jQuery("#schema_unedited_rawFile").css("display","block");
            // console.log("showOldSchemaButton clicked; schema_slug: "+schema_slug)
        })
        jQuery(".showNewSchemaButton").click(function(){
            var relnumber = jQuery(this).data("relnumber")
            // console.log("showNewSchemaButton clicked; relnumber: "+relnumber)

            jQuery("#schema_edited_rawFile").css("display","block");
            jQuery("#schema_unedited_rawFile").css("display","none");

            var schema_slug = jQuery(this).data("schema")

            updateSchemaWithEnumRel_enum(schema_slug,relnumber);
        })
        /*
        jQuery(".updateSchemaButton").click(function(){
            // console.log("updateSchemaButton clicked")
        })
        */

    });
}

function createEditedEnumerationRawFile_enum() {
    // console.log("createEditedEnumerationRawFile_enum")
    var enumeration_unedited_rF_str = jQuery("#enumeration_unedited_rawFile").val()
    var enumeration_edited_rF_obj = JSON.parse(enumeration_unedited_rF_str);

    var set_slug = jQuery("#setSelector option:selected").data("slug");
    enumeration_edited_rF_obj.enumerationData.source.set = set_slug;

    var uniqueField = jQuery("#uniqueFieldSelector option:selected").data("prop");
    enumeration_edited_rF_obj.enumerationData.field = uniqueField;

    enumeration_edited_rF_obj.enumerationData.additionalFields = [];
    jQuery(".additionalFieldCheckbox").each(function(){
        var nextField = jQuery(this).data("prop");
        var nextField_checked = jQuery(this).prop("checked");
        if (nextField_checked) {
            // console.log("nextField: "+nextField+"; nextField_checked: "+nextField_checked)
            if (nextField != uniqueField) {
                enumeration_edited_rF_obj.enumerationData.additionalFields.push(nextField)
            }
        }
    })

    var enumeration_edited_rF_str = JSON.stringify(enumeration_edited_rF_obj,null,4)
    jQuery("#enumeration_edited_rawFile").html(enumeration_edited_rF_str)
    jQuery("#enumeration_edited_rawFile").val(enumeration_edited_rF_str)
}
function updateEnumerationRawFile_enum() {
    var enumeration_slug = jQuery("#enumerationSelector_enum option:selected").data("slug");
    if (lookupRawFileBySlug_obj.hasOwnProperty(enumeration_slug)) {
        var enumeration_rF_obj = lookupRawFileBySlug_obj[enumeration_slug];
        var enumeration_rF_str = JSON.stringify(enumeration_rF_obj,null,4);
        var enumeration_field = enumeration_rF_obj.enumerationData.field;
        var enumeration_additionalFields_arr = [];
        if (enumeration_rF_obj.enumerationData.hasOwnProperty("additionalFields")) {
            enumeration_additionalFields_arr = enumeration_rF_obj.enumerationData.additionalFields;
        }
        var enumeration_concept_slug = enumeration_rF_obj.enumerationData.source.concept;
        var enumeration_concept_set = enumeration_rF_obj.enumerationData.source.set;

        var concept_rF_obj = lookupRawFileBySlug_obj[enumeration_concept_slug];
        var primaryProperty_slug = concept_rF_obj.conceptData.nodes.primaryProperty.slug;

        var primaryProperty_rF_obj = lookupRawFileBySlug_obj[primaryProperty_slug];
        var uniqueValueProps_arr = primaryProperty_rF_obj.propertyData.conceptGraphStyle.uniqueValueProps
        var allProps_arr = primaryProperty_rF_obj.propertyData.conceptGraphStyle.props
        var allProperties_arr = primaryProperty_rF_obj.propertyData.conceptGraphStyle.properties
        var numUniqueValueProps = uniqueValueProps_arr.length;
        var numProps = allProps_arr.length;
        var numProperties = allProperties_arr.length;

        var sets_arr = concept_rF_obj.globalDynamicData.sets;
        sets_arr.unshift(concept_rF_obj.conceptData.nodes.superset.slug);
        var numSets = sets_arr.length;

        var panelHTML = "";

        panelHTML += "<div class=leftCol_enum >";
        panelHTML += "concept";
        panelHTML += "</div>";
        panelHTML += "<div class=rightCol_enum >";
        panelHTML += enumeration_concept_slug;
        panelHTML += "</div>";

        panelHTML += "<br>";

        panelHTML += "<div class=leftCol_enum >";
        panelHTML += "set";
        panelHTML += "</div>";
        panelHTML += "<div class=rightCol_enum >";
        // panelHTML += enumeration_concept_set;
        panelHTML += "<select id=setSelector >";
        for (var s=0;s<numSets;s++) {
            var nextSet_slug = sets_arr[s];
            panelHTML += "<option ";
            panelHTML += " data-slug='"+nextSet_slug+"' ";
            if (enumeration_concept_set==nextSet_slug) { panelHTML += " selected "; }
            panelHTML += " >";
            panelHTML += nextSet_slug;
            panelHTML += "</option>";
        }
        panelHTML += "</select>";
        panelHTML += "</div>";

        panelHTML += "<br>";

        panelHTML += "<div class=leftCol_enum >";
        panelHTML += "uniqueField";
        panelHTML += "</div>";
        panelHTML += "<div class=rightCol_enum >";
        // panelHTML += enumeration_field;
        panelHTML += "<select id=uniqueFieldSelector >";
        for (var u=0;u<numUniqueValueProps;u++) {
            var nextUniqueValueProp = uniqueValueProps_arr[u];
            panelHTML += "<option ";
            panelHTML += " data-prop='"+nextUniqueValueProp+"' ";
            if (enumeration_field==nextUniqueValueProp) { panelHTML += " selected "; }
            panelHTML += " >";
            panelHTML += nextUniqueValueProp;
            panelHTML += "</option>";
        }
        panelHTML += "</select>";
        panelHTML += "</div>";

        panelHTML += "<br>";

        panelHTML += "<div class=leftCol_enum >";
        panelHTML += "additionalFields";
        panelHTML += "</div>";
        panelHTML += "<div class=rightCol_enum >";
        /*
        for (var u=0;u<numProps;u++) {
            var nextProp_obj = allProps_arr[u];
            var nextProp_key = nextProp_obj.key;
            // var nextProp_value = nextProp_obj.value;
            if (nextProp_key != "type") {
                panelHTML += "<input class=additionalFieldCheckbox data-prop="+nextProp_key+" type=checkbox ";
                if (jQuery.inArray(nextProp_key,enumeration_additionalFields_arr) > -1) {
                    panelHTML += " checked ";
                }
                // if (nextUniqueValueProp==nextProp_key) { panelHTML += " disabled "; }
                panelHTML += " > ";
                panelHTML += nextProp_key;
                panelHTML += "<br>";
            }
        }
        */
        for (var u=0;u<numProperties;u++) {
            var nextProp_obj = allProperties_arr[u];
            var nextProp_key = nextProp_obj.key;
            // var nextProp_value = nextProp_obj.value;
            if (nextProp_key != "type") {
                panelHTML += "<input class=additionalFieldCheckbox data-prop='"+nextProp_key+"' type=checkbox ";
                if (jQuery.inArray(nextProp_key,enumeration_additionalFields_arr) > -1) {
                    panelHTML += " checked ";
                }
                // if (nextUniqueValueProp==nextProp_key) { panelHTML += " disabled "; }
                panelHTML += " > ";
                panelHTML += nextProp_key;
                panelHTML += "<br>";
            }
        }
        panelHTML += "</div>";

        panelHTML += "<br>";

        panelHTML += "Active relationships: <br>";

        panelHTML += "<div id=activeRelationshipsContainer>activeRelationshipsContainer</div>";

        // panelHTML += enumeration_slug + " enumerates ";

        jQuery("#selectedEnumerationPanel").html(panelHTML)
        jQuery("#enumeration_unedited_rawFile").html(enumeration_rF_str)
        jQuery("#enumeration_unedited_rawFile").val(enumeration_rF_str)

        jQuery("#selectedEnumerationPanel").change(function(){
            // console.log("selectedEnumerationPanel changed")
            createEditedEnumerationRawFile_enum();
        })
        createEditedEnumerationRawFile_enum();
        // updateEnumerationRelationships_enum must be called after jQuery("#selectedEnumerationPanel").html(panelHTML)
        // because it references element with id=activeRelationshipsContainer
        // (alternatively I could move <div id=activeRelationshipsContainer>activeRelationshipsContainer</div> to code below)
        updateEnumerationRelationships_enum();
    }

}

function createConceptSelector_enum() {
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");

    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;

    sendAsync(sql).then((words_arr) => {
        var enumerationSelectorHTML = "";
        enumerationSelectorHTML += "<select id=enumerationSelector_enum >";

        var numWords = words_arr.length;
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
            var nextWord_ipns = nextWord_obj.metaData.ipns;

            lookupRawFileBySlug_obj[nextWord_slug] = nextWord_obj;
            lookupRawFileBySlug_obj.edited[nextWord_slug] = nextWord_obj;

            if (jQuery.inArray("enumeration",nextWord_wordTypes) > -1) {
                var nextWord_rF_obj = nextWord_obj;
                var nextWord_rF_str = JSON.stringify(nextWord_rF_obj,null,4)
                // console.log("nextWord_slug: "+nextWord_slug+"; nextWord_rF_str: "+nextWord_rF_str)

                // console.log("qwerty nextWord_rF_propertySchema_slug: "+nextWord_rF_propertySchema_slug)

                enumerationSelectorHTML += "<option data-ipns='"+nextWord_ipns+"' data-slug='"+nextWord_slug+"' >";
                enumerationSelectorHTML += nextWord_slug;
                enumerationSelectorHTML += "</option>";
            }
        }
        enumerationSelectorHTML += "</select>";
        jQuery("#enumerationSelectorContainer_enum").html(enumerationSelectorHTML);
        jQuery("#enumerationSelector_enum").change(function(){
            updateEnumerationRawFile_enum();
        });
        updateEnumerationRawFile_enum();
    });
}

export default class EnumerationEditor extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        createConceptSelector_enum();

        jQuery("#editExistingEnumerationButton").click(function(){
            jQuery("#editExistingEnumerationButton").css("backgroundColor","green");
            jQuery("#createNewEnumerationButton").css("backgroundColor","grey");

            jQuery("#editExistingEnumerationContainer").css("display","block")
            jQuery("#createNewEnumerationContainer").css("display","none")
        })
        jQuery("#createNewEnumerationButton").click(function(){
            jQuery("#editExistingEnumerationButton").css("backgroundColor","grey");
            jQuery("#createNewEnumerationButton").css("backgroundColor","green");

            jQuery("#editExistingEnumerationContainer").css("display","none")
            jQuery("#createNewEnumerationContainer").css("display","block")
        })

        jQuery("#showEnumerationUneditedButton_enum").click(function(){
            jQuery("#showEnumerationUneditedButton_enum").css("backgroundColor","green");
            jQuery("#showEnumerationEditedButton_enum").css("backgroundColor","grey");

            jQuery("#enumeration_unedited_rawFile").css("display","block")
            jQuery("#enumeration_edited_rawFile").css("display","none")
        })
        jQuery("#showEnumerationEditedButton_enum").click(function(){
            jQuery("#showEnumerationUneditedButton_enum").css("backgroundColor","grey");
            jQuery("#showEnumerationEditedButton_enum").css("backgroundColor","green");

            jQuery("#enumeration_unedited_rawFile").css("display","none")
            jQuery("#enumeration_edited_rawFile").css("display","block")
        })
        jQuery("#updateEnumerationButton_enum").click(function(){
            var enumeration_rF_str = jQuery("#enumeration_edited_rawFile").val();
            var enumeration_rF_obj = JSON.parse(enumeration_rF_str);
            // console.log("updateEnumerationButton_enum clicked; enumeration_rF_str: "+enumeration_rF_str)
            MiscFunctions.updateWordInAllTables(enumeration_rF_obj);
        });
        jQuery("#updateSchema_enum").click(function(){
            var schema_rF_str = jQuery("#schema_edited_rawFile").val();
            var schema_rF_obj = JSON.parse(schema_rF_str);
            // console.log("updateSchema_enum clicked; schema_rF_str: "+schema_rF_str)
            MiscFunctions.updateWordInAllTables(schema_rF_obj);
        });

    }
    state = {
    }
    render() {
        return (
            <>
                <center>Build / Edit Enumeration</center>

                <fieldset style={{display:"inline-block",border:"1px sold black",width:"500px",height:"800px",padding:"5px",verticalAlign:"top"}} >
                    <center>Enumeration Control Panel</center>
                    <div class="doSomethingButton" id="editExistingEnumerationButton" >edit existing</div>
                    <div class="doSomethingButton" id="createNewEnumerationButton" >create new</div>
                    <br/>
                    <fieldset id="editExistingEnumerationContainer" >
                        <center>Edit Existing Enumeration</center>
                        enumeration: <div style={{display:"inline-block"}} id="enumerationSelectorContainer_enum" >enumerationSelectorContainer</div>
                        <br/>
                        <div id="selectedEnumerationPanel" >selectedEnumerationPanel</div>
                    </fieldset>
                    <fieldset id="createNewEnumerationContainer" style={{display:"none"}} >
                        <center>Create New Enumeration</center>
                        Go to: Build Concept Family, Show Graphs, main schema (skeleton)
                    </fieldset>
                </fieldset>

                <fieldset style={{display:"inline-block",border:"1px sold black",width:"500px",height:"800px",padding:"5px",verticalAlign:"top"}} >
                    <center>Selected Enumeration File</center>
                    <div class="doSomethingButton" id="showEnumerationUneditedButton_enum" >(unedited)</div>
                    <div class="doSomethingButton" id="showEnumerationEditedButton_enum" >(edited)</div>
                    <div class="doSomethingButton" id="updateEnumerationButton_enum" >UPDATE in SQL</div>
                    <br/>
                    <textarea id="enumeration_unedited_rawFile" style={{width:"98%",height:"800px"}} >enumeration_unedited_rawFile</textarea>
                    <textarea id="enumeration_edited_rawFile" style={{width:"98%",height:"800px",display:"none"}} >enumeration_edited_rawFile</textarea>
                </fieldset>

                <fieldset style={{display:"inline-block",border:"1px sold black",width:"500px",height:"800px",padding:"5px",verticalAlign:"top"}} >
                    <center>Selected Schema File <div id="updateSchema_enum" class="doSomethingButton_small" >UPDATE edited schema in SQL</div></center>
                    <textarea id="schema_unedited_rawFile" style={{width:"98%",height:"800px"}} >schema_unedited_rawFile</textarea>
                    <textarea id="schema_edited_rawFile" style={{width:"98%",height:"800px",display:"none",borderColor:"orange"}} >schema_edited_rawFile</textarea>
                </fieldset>

            </>
        );
    }
}
