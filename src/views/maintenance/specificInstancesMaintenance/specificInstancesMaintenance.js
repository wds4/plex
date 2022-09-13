
import React, { Component, createRef, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import ConceptGraphMasthead from '../../../conceptGraphMasthead.js';
import LeftNavbarMaintenance from '../../../LeftNavbar_Maintenance';
import * as MiscFunctions from '../../../lib/miscFunctions.js';

// import * as MaintenanceFunctions from './c2cRelsMaintenanceFunctions.js';

import sendAsync from '../../../renderer';
const jQuery = require("jquery");

var reports_obj = {};
// could move this function to c2cRelsMaintenanceFunctions.js ? if it gets big
async function updateWords_sim(words_in_rF_obj) {
    var words_out_rF_obj = MiscFunctions.cloneObj(words_in_rF_obj)

    // cycle through all words; for each word, nextWord_slug with nextWord_rF_obj:
    // fetch sets_arr = globalDynamicData.specificInstanceOf which will be an array of sets and subsets
    // for each element set_slug of sets_arr, if set_slug is the superset of a concept with concept_wT_slug that is in the conceptGraph, then make sure:
    // STEP 1. nextWord_rF_obj.wordData.wordTypes contains concept_wT_slug
    // STEP 2. nextWord_rF_obj.[concept_wT_slug]Data exists after wordData, after wordTypeData, before globalDynamicData and metaData;
    // STEP 3. If making anew, populate slug, name, title, and all required properties inside nextWord_rF_obj.[concept_wT_slug]Data and fetch values from wordData if present

    // STEP 1:
    for (const [nextWord_slug, nextWord_rF_obj] of Object.entries(words_in_rF_obj)) {
        var nextWord_wordTypes_arr = nextWord_rF_obj.wordData.wordTypes;
        var nextWord_specificInstanceOf_arr = nextWord_rF_obj.globalDynamicData.specificInstanceOf;
        var numSiOf = nextWord_specificInstanceOf_arr.length;
        // if (numSiOf > 0) {
            // words_out_rF_obj[nextWord_slug].wordData.wordTypes_b = []
        // }
        for (var r=0;r<numSiOf;r++) {
            var nextSet_slug = nextWord_specificInstanceOf_arr[r];
            var nextSet_rF_obj = words_in_rF_obj[nextSet_slug];
            console.log("nextSet_slug: "+nextSet_slug)
            var nextSet_rF_str = JSON.stringify(nextSet_rF_obj,null,4)
            console.log("nextSet_rF_str: "+nextSet_rF_str)
            if (typeof nextSet_rF_obj == "object") {
                var nextSet_wordTypes_arr = nextSet_rF_obj.wordData.wordTypes;
                /*
                if (jQuery.inArray("set",nextSet_wordTypes_arr) > -1) {
                    var governingConcepts_arr = nextSet_rF_obj.setData.metaData.governingConcepts;
                    var numGovCon = governingConcepts_arr.length;
                    for (var g=0;g<numGovCon;g++) {
                        var governingConcept_slug = governingConcepts_arr[g];
                        var governingConcept_rF_obj = words_in_rF_obj[governingConcept_slug];
                        var governingConcept_wT_slug = governingConcept_rF_obj.conceptData.nodes.wordType.slug;
                        if (jQuery.inArray(governingConcept_wT_slug,words_out_rF_obj[nextWord_slug].wordData.wordTypes) == -1) {
                            words_out_rF_obj[nextWord_slug].wordData.wordTypes.push(governingConcept_wT_slug)
                        }
                    }
                }
                */
                if (jQuery.inArray("superset",nextSet_wordTypes_arr) > -1) {
                    var governingConcept_slug = nextSet_rF_obj.supersetData.metaData.governingConcept.slug;
                    var governingConcept_rF_obj = words_in_rF_obj[governingConcept_slug];
                    var governingConcept_wT_slug = governingConcept_rF_obj.conceptData.nodes.wordType.slug;
                    // words_out_rF_obj[nextWord_slug].wordData.wordTypes_b.push(governingConcept_wT_slug)
                    if (jQuery.inArray(governingConcept_wT_slug,words_out_rF_obj[nextWord_slug].wordData.wordTypes) == -1) {
                        words_out_rF_obj[nextWord_slug].wordData.wordTypes.push(governingConcept_wT_slug)
                    }
                }
            }
        }
    }

    // STEP 2:
    for (const [nextWord2_slug, nextWord_rF_obj] of Object.entries(words_in_rF_obj)) {
        var nextWord_wordTypes_arr = nextWord_rF_obj.wordData.wordTypes;
        var numWordTypes = nextWord_wordTypes_arr.length;
        for (var w=0;w<numWordTypes;w++) {
            var nextWordType = nextWord_wordTypes_arr[w];
            if (words_in_rF_obj.hasOwnProperty(nextWordType)) {
                // console.log("nextWordType: "+nextWordType)
                var nextCon_wT_obj = words_in_rF_obj[nextWordType];
                var nextCon_concept_slug = nextCon_wT_obj.wordTypeData.concept;
                var nextCon_concept_rF_obj = words_in_rF_obj[nextCon_concept_slug]
                var propPath = nextCon_concept_rF_obj.conceptData.propertyPath;
                var fooBarr = typeof nextWord_rF_obj[propPath];
                if (typeof nextWord_rF_obj[propPath] != "object") {
                    var gDD = words_out_rF_obj[nextWord2_slug].globalDynamicData;
                    var mD = words_out_rF_obj[nextWord2_slug].metaData;
                    words_out_rF_obj[nextWord2_slug][propPath] = {};
                    words_out_rF_obj[nextWord2_slug][propPath].slug = nextWord_rF_obj.wordData.slug;
                    if (nextWord_rF_obj.wordData.hasOwnProperty("name")) {
                        words_out_rF_obj[nextWord2_slug][propPath].name = nextWord_rF_obj.wordData.name;
                    }
                    if (nextWord_rF_obj.wordData.hasOwnProperty("title")) {
                        words_out_rF_obj[nextWord2_slug][propPath].title = nextWord_rF_obj.wordData.title;
                    }
                    // Now move globalDynamicData and metaData to the end, after propPath
                    delete words_out_rF_obj[nextWord2_slug].globalDynamicData;
                    delete words_out_rF_obj[nextWord2_slug].metaData;
                    words_out_rF_obj[nextWord2_slug].globalDynamicData = gDD;
                    words_out_rF_obj[nextWord2_slug].metaData = mD;
                }
            }
        }
    }

    return words_out_rF_obj;
}

function showSelectedWord_sim() {
    var selectedWord_slug = jQuery("#wordSelectorElem option:selected").data("slug");
    if (words_pre_rF_obj.hasOwnProperty(selectedWord_slug)) {
        var word_pre_rF_obj = words_pre_rF_obj[selectedWord_slug];
    } else {
        var word_pre_rF_obj = {};
        word_pre_rF_obj.note = "This word does not yet exist in the SQL database!!!"
    }

    var word_pre_rF_str = JSON.stringify(word_pre_rF_obj,null,4);
    var word_post_rF_obj = words_post_rF_obj[selectedWord_slug];
    var word_post_rF_str = JSON.stringify(word_post_rF_obj,null,4);
    jQuery("#word_pre_elem").html(word_pre_rF_str);
    jQuery("#word_post_elem").html(word_post_rF_str);
}

var patterns_template_sim = {};
patterns_template_sim.numPositive = 0;
patterns_template_sim.isASubsetOf = {};

var words_pre_rF_obj = {};
var words_post_rF_obj = {};
var numWords_original = 0;
var numWords_updated = 0;
var numNotValidJSON_original = 0;
var numValidButNoSlug_original = 0;
var numWords_original = 0;
var numUpdatedWords_sim = 0;
var numNewWords_sim = 0;
async function fetchConceptGraph_sim() {
    var conceptGrapTableName = jQuery("#myConceptGraphSelector option:selected").data("tablename");
    words_pre_rF_obj = {};
    words_post_rF_obj = {};
    var sql = " SELECT * FROM "+conceptGrapTableName;
    console.log("sql: "+sql);
    numWords_original = 0;
    numWords_updated = 0;
    numNotValidJSON_original = 0;
    numValidButNoSlug_original = 0;
    numWords_original = 0;
    numUpdatedWords_sim = 0;
    numNewWords_sim = 0;
    sendAsync(sql).then(async (words_original_arr) => {
          numWords_original = words_original_arr.length;
          console.log("fetchConceptGraph_sim via sql; numWords_original: "+numWords_original)
          var wordSelectorHTML = "";
          wordSelectorHTML += "<select id=wordSelector >";

          for (var w=0;w<numWords_original;w++) {
              var nextWord = words_original_arr[w];
              var nextWord_rawFile_str = nextWord.rawFile;
              var isValidJSON = MiscFunctions.isValidJSONString(nextWord_rawFile_str)
              if (isValidJSON) {
                  var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
                  var nextWord_slug = "** valid JSON but no valid slug **";
                  if (nextWord_rawFile_obj.hasOwnProperty("wordData")) {
                      if (nextWord_rawFile_obj.wordData.hasOwnProperty("slug")) {
                          nextWord_slug = nextWord_rawFile_obj.wordData.slug;
                      }
                  }
                  if (nextWord_slug == "** valid JSON but no valid slug **") {
                      numValidButNoSlug_original++;
                  }
                  words_pre_rF_obj[nextWord_slug]=MiscFunctions.cloneObj(nextWord_rawFile_obj);
              } else {
                  numNotValidJSON_original ++;
              }
          }

          // words_post_rF_obj = MiscFunctions.cloneObj(words_pre_rF_obj);
          // THIS IS WHERE THE CHANGES OCCUR
          words_post_rF_obj = await updateWords_sim(words_pre_rF_obj);

          for (var w=0;w<numWords_original;w++) {
              var nextWord = words_original_arr[w];
              var nextWord_rawFile_str = nextWord.rawFile;
              var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
              var nextWord_slug = nextWord_rawFile_obj.wordData.slug;

              var word_original_obj = words_pre_rF_obj[nextWord_slug];
              var word_updated_obj = words_post_rF_obj[nextWord_slug];

              var word_original_str = JSON.stringify(word_original_obj);
              var word_updated_str = JSON.stringify(word_updated_obj);

              wordSelectorHTML += "<option data-slug="+nextWord_slug+" >";
              if (word_original_str != word_updated_str) {
                  wordSelectorHTML += " *** UPDATED *** ";
                  numUpdatedWords_sim ++;
              }
              wordSelectorHTML += nextWord_slug;
              wordSelectorHTML += "</option>";
          }
          // now cycle through each word in words_post_rF_obj; if it's not present in words_pre_rF_obj, then add it as another option
          for (const [nextWord_slug, nextWord_rF_obj] of Object.entries(words_post_rF_obj)) {

              if (!words_pre_rF_obj.hasOwnProperty(nextWord_slug)) {
                  wordSelectorHTML += "<option data-slug="+nextWord_slug+" >";
                  wordSelectorHTML += " *** NEW WORD *** ";
                  numNewWords_sim ++;
                  wordSelectorHTML += nextWord_slug;
                  wordSelectorHTML += "</option>";
              }

          }

          wordSelectorHTML += "</select>";
          jQuery("#numUpdatedWordsContainer_sim").html(numUpdatedWords_sim);
          jQuery("#numNewWordsContainer_sim").html(numNewWords_sim);

          jQuery("#wordSelectorElem").html(wordSelectorHTML);
          jQuery("#wordSelectorElem").change(function(){
              showSelectedWord_sim();
          });

          showSelectedWord_sim();

          updateBasicInfoBox_sim();
    });
}

function updateBasicInfoBox_sim() {
    var infoHTML = "";
    infoHTML += "Current: ";
    infoHTML += "numWords: "+numWords_original;
    infoHTML += " numNotValidJSON: "+numNotValidJSON_original;
    infoHTML += " numValidButNoSlug: "+numValidButNoSlug_original;
    infoHTML += "<br>";
    infoHTML += "Updated: ";
    infoHTML += " numUpdatedWords: "+numUpdatedWords_sim;

    jQuery("#basicInfoBox_sim").html(infoHTML);
}

export default class SpecificInstancesMaintenance extends React.Component {
    componentDidMount() {
        jQuery("#myConceptGraphSelector").change(function(){
            // console.log("myConceptGraphSelector changed");
            fetchConceptGraph_sim();
        })
        fetchConceptGraph_sim();
        jQuery("#updateConceptGraphButton").click(function(){
            jQuery.each(words_post_rF_obj,function(nextWord_slug,nextWord_obj){
                MiscFunctions.createOrUpdateWordInAllTables(nextWord_obj)
            })
        })
    }
    render() {
        return (
          <>
            <fieldset className="mainBody" >
                <LeftNavbarMaintenance />
                <div className="mainPanel" >
                    <ConceptGraphMasthead />
                    <div class="h2">Specific Instances Maintenance</div>
                    For each nodeA which is a specific instance of conceptB, edit nodeA to ensure that:<br/>
                    <li>conceptB is inside wordData.wordTypes</li>
                    <li>[conceptB]Data exists; populate slug, name, title, and description from wordData if building [conceptB]Data from scratch</li>
                    <br/>
                    <div className="doSomethingButton" id="updateConceptGraphButton">update concept graph</div>
                    <br/>
                    <div id="basicInfoBox_sim" style={{border:"1px solid grey",padding:"2px",width:"1200px"}}>
                    info
                    </div>

                    Select one word:<div id="wordSelectorElem" style={{display:"inline-block"}} >wordSelectorElem</div>
                    <div style={{display:"inline-block"}} > number of updated words: </div>
                    <div style={{display:"inline-block"}} id="numUpdatedWordsContainer_sim" >numUpdatedWordsContainer_sim</div>
                    <div style={{display:"inline-block",marginLeft:"20px"}} > number of new words: </div>
                    <div style={{display:"inline-block"}} id="numNewWordsContainer_sim" >numNewWordsContainer_sim</div>
                    <br/>
                    <div style={{width:"600px",height:"600px",overflow:"scroll",display:"inline-block",border:"1px solid black"}}>
                        <pre id="word_pre_elem">word_pre_elem</pre>
                    </div>
                    <div style={{width:"600px",height:"600px",overflow:"scroll",display:"inline-block",border:"1px solid black"}}>
                        <pre id="word_post_elem">word_post_elem</pre>
                    </div>

                </div>
            </fieldset>
          </>
        );
    }
}
