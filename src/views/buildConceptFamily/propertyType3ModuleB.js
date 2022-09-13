import React from "react";
import sendAsync from '../../renderer';
import { lookupRawFileBySlug_obj } from '../addANewConcept';
const jQuery = require("jquery");

function generatePropertySelectorB(modnum,type3ModBbPropertySelectorId) {
    var propertyList_slug = jQuery("#propertyListSlugContainer").html()
    console.log("generatePropertySelectorB; propertyList_slug: "+propertyList_slug)
    var propertyList_rF_obj = lookupRawFileBySlug_obj[propertyList_slug];
    var properties_rF_obj = lookupRawFileBySlug_obj["properties"];
    var properties_sI_arr = properties_rF_obj.globalDynamicData.specificInstances;
    var numProperties = properties_sI_arr.length;

    var selectorHTML = "";
    selectorHTML += "<select class='conceptSelector_type3Prop' data-modnum='"+modnum+"' id='conceptSelector_type3Prop_"+modnum+"' >";

    for (var p=0;p<numProperties;p++) {
        var nextProp_slug = properties_sI_arr[p];
        var nextProp_rF_obj = lookupRawFileBySlug_obj[nextProp_slug];
        var nextProp_title = nextProp_rF_obj.wordData.title;
        var nextProp_propertyType = nextProp_rF_obj.propertyData.type;
        selectorHTML += "<option data-propertytype='"+nextProp_propertyType+"' data-propertykey='"+nextProp_slug+"' >";
        selectorHTML += "(type: "+nextProp_propertyType+") ";
        selectorHTML += nextProp_title;
        selectorHTML += "</option>";
    }

    selectorHTML += "</select>";

    jQuery("#"+type3ModBbPropertySelectorId).html(selectorHTML);
}

function generatePropertySelector(modnum,type3ModBPropertySelectorId) {
    var propertyList_slug = jQuery("#propertyListSlugContainer").html()
    console.log("generatePropertySelector; propertyList_slug: "+propertyList_slug)
    var propertyList_rF_obj = lookupRawFileBySlug_obj[propertyList_slug];

    var t1PropList_obj = propertyList_rF_obj.propertyListData.properties.type1;
    var t2PropList_obj = propertyList_rF_obj.propertyListData.properties.type2;
    var t3PropList_obj = propertyList_rF_obj.propertyListData.properties.type3;

    var selectorHTML = "";
    selectorHTML += "<select class='conceptSelector_type3Prop' data-modnum='"+modnum+"' id='conceptSelector_type3Prop_"+modnum+"' >";

    jQuery.each(t1PropList_obj,function(nextPropKey,value){
        console.log("t1PropList_obj nextPropKey: "+nextPropKey)
        selectorHTML += "<option data-propertytype='type1' data-propertykey='"+nextPropKey+"' >";
        selectorHTML += "(type1): ";
        selectorHTML += nextPropKey;
        selectorHTML += "</option>";
    });

    jQuery.each(t2PropList_obj,function(nextPropKey,value){
        console.log("t2PropList_obj nextPropKey: "+nextPropKey)
        selectorHTML += "<option data-propertytype='type2' data-propertykey='"+nextPropKey+"' >";
        selectorHTML += "(type2): ";
        selectorHTML += nextPropKey;
        selectorHTML += "</option>";
    })

    jQuery.each(t3PropList_obj,function(nextPropKey,value){
        console.log("t3PropList_obj nextPropKey: "+nextPropKey)
        selectorHTML += "<option data-propertytype='type3' data-propertykey='"+nextPropKey+"' >";
        selectorHTML += "(type3): ";
        selectorHTML += nextPropKey;
        selectorHTML += "</option>";
    })

    selectorHTML += "</select>";

    // jQuery("#"+type3ModBPropertySelectorId).html(selectorHTML);
}

// deprecating this function, I think
function generateConceptSelector_type3Prop(modnum,type3ModBPropertySelectorId) {
    console.log("generateConceptSelector_type3Prop")
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;
    console.log("sql: "+sql)
    var selectorHTML = "";
    selectorHTML += "<select id='conceptSelector_type3Prop' >";
    sendAsync(sql).then((words_arr) => {
        var numWords = words_arr.length;
        console.log("numWords: "+numWords)
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
            var nextWord_ipns = nextWord_obj.metaData.ipns;

            console.log("nextWord_slug: "+nextWord_slug)

            var isWordType_concept = jQuery.inArray("concept",nextWord_wordTypes);

            console.log("isWordType_concept: "+isWordType_concept)

            if (isWordType_concept > -1 ) {
                console.log("adding the option for: "+nextWord_slug)
                selectorHTML += "<option>";
                selectorHTML += nextWord_slug;
                selectorHTML += "</option>";
            }
        }
        selectorHTML += "</select>";
        // jQuery("#"+type3ModBPropertySelectorId).html(selectorHTML);
    });
}

function updateParentJSWithModules() {
    var jsParent_str = jQuery("#JSONSchema_rawFile_parent_B").val();
    var jsParent_obj = JSON.parse(jsParent_str);
    var primaryProperty = jsParent_obj.JSONSchemaData.metaData.primaryProperty;
    console.log("updateParentJSWithModules; jsParent_str: "+jsParent_str)
    var elem_arr = jQuery(".t3propertyNameTextarea");
    var numModules = elem_arr.length;
    for (var m=0;m<numModules;m++) {
        var nextElem = elem_arr[m];
        var nextModuleName = jQuery(nextElem).val();
        console.log("nextModuleName: "+nextModuleName)
        jsParent_obj.properties[primaryProperty].properties[nextModuleName] = {};
        jsParent_obj.properties[primaryProperty].properties[nextModuleName].type = "object";
        jsParent_obj.properties[primaryProperty].properties[nextModuleName].title = nextModuleName;
        jsParent_obj.properties[primaryProperty].properties[nextModuleName].properties = {};
    }
    var jsParent_edited_str = JSON.stringify(jsParent_obj,null,4);
    console.log("jsParent_edited_str: "+jsParent_edited_str)
    jQuery("#JSONSchema_rawFile_parent_B").val(jsParent_edited_str);
    jQuery("#JSONSchema_rawFile_parent_B").html(jsParent_edited_str);
}

export default class Type3ModuleB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           //states
        };
    }
    componentDidMount() {
        // console.log("here in componentDidMount; "+this.props.type3ModBNameId);
        jQuery("#"+this.props.type3ModBNameId).change(function(){
            var mnum = jQuery(this).data("modnum");
            var thisID = jQuery(this).attr("id");
            console.log("t3propertyName_0 triggered; mnum: "+mnum+"; thisID: "+thisID)
            updateParentJSWithModules();
        })
        // generateConceptSelector_type3Prop(this.props.modnum,this.props.type3ModBPropertySelectorId)
        generatePropertySelector(this.props.modnum,this.props.type3ModBPropertySelectorId)
        generatePropertySelectorB(this.props.modnum,this.props.type3ModBbPropertySelectorId)
    }
    render() {
        return (
            <>
                <div style={{border:"1px solid black",padding:"3px",margin:"5px 0px 5px 0px"}}>
                    Type 3 Property (module) num: {this.props.modnum}
                    <br/>
                    propertyName:<textarea className="t3propertyNameTextarea" id={this.props.type3ModBNameId} data-modnum={this.props.modnum} style={{width:"200px",height:"20px"}} ></textarea>
                    <div id={this.props.type3ModBPropertySelectorId} >type3ModBPropertySelectorId</div>
                    <div id={this.props.type3ModBbPropertySelectorId} >type3ModBbPropertySelectorId</div>
                </div>
            </>
        );
    }
}
