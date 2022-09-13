import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';

import sendAsync from '../../../renderer.js';

// import Ajv from "ajv"

const Ajv = require('ajv');
const ajv = new Ajv({
    allErrors: true,
    useDefaults: true,
    strictDefault: true
});

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const validation = (parent_slug,child_slug) => {
    var oParent = window.lookupWordBySlug[parent_slug];
    var oChild = window.lookupWordBySlug[child_slug];

    delete oParent["$id"];

    var validate = ajv.compile(oParent);
    var valid = validate(oChild);
    // console.log(valid); // false
    if (!valid) {
      // console.log(validate.errors); // null
    }
    if (valid) {
        jQuery("#ajvOutput").html("valid!");
        jQuery("#ajvOutputErrors").html("");
    } else 	{
        jQuery("#ajvOutput").html("There are errors!");
        jQuery("#ajvOutputErrors").html(JSON.stringify(validate.errors,null,4));
    }
}

const validationForStatusIndicatorBox = (parent_slug,child_slug) => {
    // console.log("validationForStatusIndicatorBox; parent_slug: "+parent_slug+"; child_slug: "+child_slug)
    var oParent = window.lookupWordBySlug[parent_slug];
    var oChild = window.lookupWordBySlug[child_slug];

    delete oParent["$id"];

    var validate = ajv.compile(oParent);
    var valid = validate(oChild);
    // console.log(valid); // false
    if (!valid) {
      // console.log(validate.errors); // null
    }
    if (valid) {
        jQuery("#indicatorBox_"+child_slug+"_"+parent_slug).css("background-color","green");
    } else 	{
        var numErrors = validate.errors.length;
        jQuery("#indicatorBox_"+child_slug+"_"+parent_slug).css("background-color","red");
        jQuery("#indicatorBox_"+child_slug+"_"+parent_slug).html(numErrors);
    }
}

const validationTest = () => {
    var parent = {
    	"$id": "http://www.somedomain.com",
    	"$schema": "http://json-schema.org/draft-07/schema",
    	"definitions": {},
    	"type": "object",
    	"required": [ "name", "hometown" ],
    	"properties": {
    		"name": {
    			"type": "string"
    		},
    		"hometown": {
    			"type": "string"
    		}
    	}
    }
    var child1 = {
    	"name": "Alice",
    	"hometown": "Nashville"
    }
    var child2 = {
    	"name": "Bob"
    }
    const ajv = new Ajv({
        allErrors: true,
        useDefaults: true,
        strictDefault: true
    });
    var validateAgainstMeta = ajv.validateSchema(parent);
    console.log(validateAgainstMeta);
    if (validateAgainstMeta) {
        console.log(ajv);
        const validate = ajv.compile(parent);
        var validateResult1 = validate(child1);
        console.log(validateResult1);
        console.log("errors: "+ajv.errors);
        console.log(child1);
        if (validateResult1) {
            jQuery("#ajvOutput1").html("valid!");
        } else 	{
            jQuery("#ajvOutput1").html("needs work!");
            jQuery("#ajvOutput1Errors").html(ajv.errors);
        }
        var validateResult2 = validate(child2);
        console.log(validateResult2);
        console.log("errors: "+ajv.errors);
        console.log(child2);
        if (validateResult2) {
            jQuery("#ajvOutput2").html("valid!");
        } else 	{
            jQuery("#ajvOutput2").html("needs work!");
            jQuery("#ajvOutput2Errors").html(ajv.errors);
        }

    } else {
        jQuery("#ajvOutput1").html("did not validate!");
        jQuery("#ajvOutput2").html("did not validate!");
    }
}

export default class AllWordsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wordLinks: []
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var aWords = Object.keys(window.lookupWordBySlug)
        // var maxNumParents = 3;

        var oParentJSONSchemaSequence = {};
        var aWordsWithWordAsParent = [];
        for (var a=0;a<aWords.length;a++) {
            var nextWord_slug = aWords[a];
            var oNextWord = window.lookupWordBySlug[nextWord_slug]
            var aParentJSONSchemaSequence = oNextWord.globalDynamicData.valenceData.parentJSONSchemaSequence;
            var numParents = aParentJSONSchemaSequence.length;

            var includesWordAsParent = false;
            if (aParentJSONSchemaSequence.includes("JSONSchemaFor_word")) {
                includesWordAsParent = true;
                aWordsWithWordAsParent.push(nextWord_slug)
            }
            oParentJSONSchemaSequence[nextWord_slug] = aParentJSONSchemaSequence;

            var child_slug = nextWord_slug;

            var wordHTML = "";
            wordHTML += "<div class='singleWordContainer' style='font-size:12px;margin-bottom:5px;overflow:scroll;width:350px' ";
            wordHTML += " data-slug='"+nextWord_slug+"' ";
            wordHTML += " >";
                wordHTML += "<div style='display:inline-block;width:75px;border:1px dashed grey;margin-right:5px;' >";
                    if (includesWordAsParent) {
                        var parent_slug = "JSONSchemaFor_word";

                        var numParentsNotWord = numParents - 1;
                        wordHTML += "<div class=parentJSONSchemaStatusIndicatorBox style='border:1px solid black;' ";
                        wordHTML += " id='indicatorBox_"+child_slug+"_"+parent_slug+"' ";
                        wordHTML += " >";
                        wordHTML += ".";
                        wordHTML += "</div>";
                    }

                    if (!includesWordAsParent) {
                        var numParentsNotWord = numParents;
                        wordHTML += "<div class=parentJSONSchemaStatusIndicatorBox style='border:0px;background-color:#CFCFCF;' >";
                        wordHTML += ".";
                        wordHTML += "</div>";
                    }

                    for (var n=0;n<aParentJSONSchemaSequence.length;n++) {
                        var nextParent_slug = aParentJSONSchemaSequence[n];
                        if (nextParent_slug != "JSONSchemaFor_word") {
                            wordHTML += "<div class=parentJSONSchemaStatusIndicatorBox ";
                            wordHTML += " id='indicatorBox_"+child_slug+"_"+nextParent_slug+"' ";
                            wordHTML += " >";
                            wordHTML += ".";
                            wordHTML += "</div>";
                        }
                    }

                wordHTML += "</div>";

                wordHTML += "<div style='display:inline-block;width:20px;' >";
                wordHTML += aParentJSONSchemaSequence.length;
                wordHTML += "</div>";

                wordHTML += nextWord_slug;
            wordHTML += "</div>";
            jQuery("#wordsListContainer").append(wordHTML)
        }
        var parent_slug = "JSONSchemaFor_word";
        for (var w=0;w<aWordsWithWordAsParent.length;w++) {
            var nextWord_slug = aWordsWithWordAsParent[w];
            // console.log("aWordsWithWordAsParent w: "+w+"; nextWord_slug: "+nextWord_slug)
            validationForStatusIndicatorBox(parent_slug,nextWord_slug);
            var aParents = oParentJSONSchemaSequence[nextWord_slug]
            for (var p=0;p<aParents.length;p++) {
                var nextParent_slug = aParents[p];
                validationForStatusIndicatorBox(nextParent_slug,nextWord_slug)
            }
        }
        jQuery(".singleWordContainer").click(function(){
            var clickedSlug = jQuery(this).data("slug")
            var oClickedWord = window.lookupWordBySlug[clickedSlug]
            var aParentJSONSchemaSequence = oClickedWord.globalDynamicData.valenceData.parentJSONSchemaSequence;

            jQuery(".singleWordContainer").css("backgroundColor","#DFDFDF")
            jQuery(this).css("backgroundColor","orange")

            jQuery("#clickedParentRawFile").val("")
            jQuery("#ajvOutput").html("")
            jQuery("#ajvOutputErrors").html("")

            jQuery("#parentJSONSchemasListContainer").html("")
            for (var a=0;a<aParentJSONSchemaSequence.length;a++) {
                var nextPJSchema_slug = aParentJSONSchemaSequence[a];
                var wordHTML = "";
                wordHTML += "<div class='singleParentJSONSchemaContainer' style='font-size:12px;margin-bottom:5px;' ";
                wordHTML += " data-slug='"+nextPJSchema_slug+"' ";
                wordHTML += " >";
                wordHTML += nextPJSchema_slug;
                wordHTML += "</div>";
                jQuery("#parentJSONSchemasListContainer").append(wordHTML)
            }
            jQuery(".singleParentJSONSchemaContainer").click(function(){
                jQuery(".singleParentJSONSchemaContainer").css("backgroundColor","#DFDFDF")
                jQuery(this).css("backgroundColor","orange")
                var singleParentJSONSchemaSlug = jQuery(this).data("slug")
                validation(singleParentJSONSchemaSlug,clickedSlug);
                var oParent = window.lookupWordBySlug[singleParentJSONSchemaSlug]
                var sParent = JSON.stringify(oParent,null,4)
                jQuery("#clickedParentRawFile").val(sParent)
            })

            var sClickedWord = JSON.stringify(oClickedWord,null,4)
            jQuery("#clickedWordRawFile").val(sClickedWord)
            console.log("singleWordContainer clicked; clickedSlug: "+clickedSlug)
        })
        validationTest();
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <ConceptGraphMasthead />
                        <div class="h2" >All Words: Validation</div>

                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>

                        <div style={{display:"inline-block",width:"450px",height:"900px",border:"1px dashed grey"}} >
                            <center>Child</center>
                            <div id="wordsListContainer" style={{display:"inline-block",width:"290",height:"860px",overflow:"scroll"}} ></div>
                        </div>

                        <div style={{display:"inline-block",width:"400px",height:"900px",border:"1px dashed grey",padding:"3px",overflow:"scroll"}}  >
                            <div style={{display:"inline-block",width:"100%",height:"100px",border:"1px dashed grey",padding:"3px",overflow:"scroll"}} >
                                <center>Parent</center>
                                <div id="parentJSONSchemasListContainer" ></div>
                            </div>
                            <center>Parent</center>
                            <textarea id="clickedParentRawFile" style={{display:"inline-block",width:"100%",height:"300px",border:"1px dashed grey",padding:"3px",overflow:"scroll"}} >
                                clicked parent rawfile
                            </textarea>
                            <center>Child</center>
                            <textarea id="clickedWordRawFile" style={{display:"inline-block",width:"100%",height:"300px",border:"1px dashed grey",padding:"3px",overflow:"scroll"}} >
                                clicked word rawfile
                            </textarea>
                        </div>

                        <div style={{display:"inline-block",width:"550px",height:"900px",border:"1px dashed grey",padding:"3px",overflow:"scroll"}}  >
                            Output: <div style={{backgroundColor:"#EFEFEF",border:"1px solid black",padding:"3px",marginBottom:"5px"}}  id="ajvOutput" ></div>
                            Errors: <pre style={{backgroundColor:"#EFEFEF",border:"1px solid black",padding:"3px",marginBottom:"5px"}}  id="ajvOutputErrors" ></pre>
                            <div style={{display:"none",border:"1px dashed grey"}}>
                                <center>test</center>
                                Output: <div style={{backgroundColor:"#EFEFEF",border:"1px solid black",padding:"3px",marginBottom:"5px"}} id="ajvOutput1" ></div>
                                Errors: <div style={{backgroundColor:"#EFEFEF",border:"1px solid black",padding:"3px",marginBottom:"5px"}}  id="ajvOutput1Errors" ></div>
                                <hr/>
                                Output: <div style={{backgroundColor:"#EFEFEF",border:"1px solid black",padding:"3px",marginBottom:"5px"}}  id="ajvOutput2" ></div>
                                Errors: <div style={{backgroundColor:"#EFEFEF",border:"1px solid black",padding:"3px",marginBottom:"5px"}}  id="ajvOutput2Errors" ></div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
