import React from "react";
import sendAsync from '../../renderer';
const jQuery = require("jquery");

function generateConceptSelector_type3Prop(modnum,type3ModConceptSelectorId) {
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
        jQuery("#"+type3ModConceptSelectorId).html(selectorHTML);
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

export default class Type3Module extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           //states
        };
    }
    componentDidMount() {
        // console.log("here in componentDidMount; "+this.props.type3ModNameId);
        jQuery("#"+this.props.type3ModNameId).change(function(){
            var mnum = jQuery(this).data("modnum");
            var thisID = jQuery(this).attr("id");
            console.log("t3propertyName_0 triggered; mnum: "+mnum+"; thisID: "+thisID)
            updateParentJSWithModules();
        })
        generateConceptSelector_type3Prop(this.props.modnum,this.props.type3ModConceptSelectorId)
    }
    render() {
        return (
            <>
                <div style={{border:"1px solid black",padding:"3px",margin:"5px 0px 5px 0px"}}>
                    Type 3 Property (module) num: {this.props.modnum}
                    <br/>
                    propertyName:<textarea className="t3propertyNameTextarea" id={this.props.type3ModNameId} data-modnum={this.props.modnum} style={{width:"200px",height:"20px"}} ></textarea>
                    <div id={this.props.type3ModConceptSelectorId} >type3ModConceptSelectorId</div>
                </div>
            </>
        );
    }
}
