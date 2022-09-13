// import React from "react";
import React, { Component, createRef, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
// import * as Constants from '../../conceptGraphMasthead.js';
import ConceptGraphMasthead from '../../conceptGraphMasthead.js';
// import LeftNavbar from './LeftNavbar';
import LeftNavbarMaintenance from '../../LeftNavbar_Maintenance';
import * as MiscFunctions from '../../lib/miscFunctions.js';
import { sortGlobalDynamicData } from './globalDynamicDataFunctions.js';
import { lookupRawFileBySlug_obj, removeDuplicatesFromSimpleArray } from '../addANewConcept.js';
import sendAsync from '../../renderer';
const jQuery = require("jquery");

function showSelectedWord_gdd() {
    var selectedWord_slug = jQuery("#wordSelectorElem option:selected").data("slug");
    // console.log("showSelectedWord_gdd; selectedWord_slug: "+selectedWord_slug);
    var word_pre_rF_obj = words_pre_rF_obj[selectedWord_slug];
    var word_pre_rF_str = JSON.stringify(word_pre_rF_obj,null,4);
    // console.log("showSelectedWord_gdd; word_pre_rF_str: "+word_pre_rF_str);
    var word_post_rF_obj = words_post_rF_obj[selectedWord_slug];
    var word_post_rF_str = JSON.stringify(word_post_rF_obj,null,4);
    jQuery("#word_pre_elem").html(word_pre_rF_str);
    jQuery("#word_post_elem").html(word_post_rF_str);
}
var words_pre_rF_obj = {};
var words_post_rF_obj = {};
function fetchConceptGraph_gdd() {
    var conceptGrapTableName = jQuery("#myConceptGraphSelector option:selected").data("tablename");
    words_pre_rF_obj = {};
    words_post_rF_obj = {};
    var sql = " SELECT * FROM "+conceptGrapTableName;
    // console.log("sql: "+sql);
    sendAsync(sql).then((words_pre_arr) => {
          var words_pre_str = JSON.stringify(words_pre_arr,null,4);
          jQuery("#words_sql_elem").html(words_pre_str)
          var numWords = words_pre_arr.length;
          // console.log("numWords: "+numWords)
          var wordSelectorHTML = "";
          wordSelectorHTML += "<select id=wordSelector >";

          for (var w=0;w<numWords;w++) {
              var nextWord = words_pre_arr[w];
              var nextWord_rawFile_str = nextWord.rawFile;
              var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
              var nextWord_slug = nextWord_rawFile_obj.wordData.slug;
              words_pre_rF_obj[nextWord_slug]=JSON.parse(JSON.stringify(nextWord_rawFile_obj));
          }

          words_post_rF_obj = sortGlobalDynamicData(words_pre_rF_obj);
          // lookupRawFileBySlug_obj = words_post_rF_obj;

          var numUpdatedWords_gdd = 0;
          for (var w=0;w<numWords;w++) {
              var nextWord = words_pre_arr[w];
              var nextWord_rawFile_str = nextWord.rawFile;
              var nextWord_rawFile_obj = JSON.parse(nextWord_rawFile_str);
              var nextWord_slug = nextWord_rawFile_obj.wordData.slug;

              var word_original_obj = words_pre_rF_obj[nextWord_slug];
              var word_updated_obj = words_post_rF_obj[nextWord_slug];

              var word_original_str = JSON.stringify(word_original_obj);
              var word_updated_str = JSON.stringify(word_updated_obj);

              wordSelectorHTML +="<option data-slug="+nextWord_slug+" >";
              if (word_original_str != word_updated_str) {
                  wordSelectorHTML += " *** UPDATED *** ";
                  numUpdatedWords_gdd ++;
              }
              wordSelectorHTML +=nextWord_slug;
              wordSelectorHTML +="</option>";
              if (nextWord_rawFile_obj.hasOwnProperty("setData")) {
                  if (nextWord_rawFile_obj.setData.hasOwnProperty("propagatePropertyInputs")) {
                      nextWord_rawFile_obj.setData.propagatePropertyInputs = removeDuplicatesFromSimpleArray(nextWord_rawFile_obj.setData.propagatePropertyInputs)
                      // nextWord_rawFile_obj.setData.propagatePropertyInputs = [];
                  }
              }

          }
          wordSelectorHTML += "</select>";
          jQuery("#numUpdatedWordsContainer_gdd").html(numUpdatedWords_gdd);
          jQuery("#wordSelectorElem").html(wordSelectorHTML);
          jQuery("#wordSelectorElem").change(function(){
              showSelectedWord_gdd();
          });

          showSelectedWord_gdd();
          var words_post_rF_str = JSON.stringify(words_post_rF_obj,null,4);
          // console.log("words_post_rF_str: "+words_post_rF_str)
    });
}
export default class UpdataGlobalDynamicData extends React.Component {
    componentDidMount() {
        jQuery("#myConceptGraphSelector").change(function(){
            // console.log("myConceptGraphSelector changed");
            fetchConceptGraph_gdd();
        })
        fetchConceptGraph_gdd();
        jQuery("#updateConceptGraphButton").click(function(){
            // console.log("updateConceptGraphButton clicked");
            var words_post_rF_str = JSON.stringify(words_post_rF_obj,null,4);
            // console.log("words_post_rF_str: "+words_post_rF_str)
            jQuery.each(words_post_rF_obj,function(slug,rF_obj){
                var rF_str = JSON.stringify(rF_obj,null,4)
                var ipns = rF_obj.metaData.ipns;
                // console.log("words_post_rF_obj; next slug: "+slug+"; rF_obj: "+rF_str)
                var conceptGraphTableName = jQuery("#myConceptGraphSelector option:selected").data("tablename");
                var updateRowCommands = " UPDATE "+conceptGraphTableName;
                updateRowCommands += " SET ";
                updateRowCommands += " rawFile = '"+rF_str+"' ";
                // updateRowCommands += " , slug = '"+slug+"' ";
                updateRowCommands += " WHERE slug = '"+slug+"' ";
                // console.log("updateRowCommands: "+updateRowCommands);
                sendAsync(updateRowCommands);
            })
        })
    }
    constructor(props) {
         super(props);
         this.state = {};
         this.state.message = 'SELECT * FROM sqlite_master';
         this.state.response = null;
    }
    render() {
        return (
          <>
            <fieldset className="mainBody" >
                <LeftNavbarMaintenance />
                <div className="mainPanel" >
                    <ConceptGraphMasthead />
                    <div class="h2">Update globalDynamicData</div>
                    <br/>
                    <div className="doSomethingButton" id="updateConceptGraphButton">update concept graph</div>
                    <br/>
                    Select one word:<div id="wordSelectorElem" style={{display:"inline-block"}} >wordSelectorElem</div>
                    <div style={{display:"inline-block"}} > number of updated words: </div>
                    <div style={{display:"inline-block"}} id="numUpdatedWordsContainer_gdd" >numUpdatedWordsContainer_gdd</div>
                    <br/>
                    <div style={{width:"600px",height:"600px",overflow:"scroll",display:"inline-block",border:"1px solid black"}}>
                        <pre id="word_pre_elem">word_pre_elem</pre>
                    </div>
                    <div style={{width:"600px",height:"600px",overflow:"scroll",display:"inline-block",border:"1px solid black"}}>
                        <pre id="word_post_elem">word_post_elem</pre>
                    </div>
                    <div style={{width:"800px",overflow:"scroll"}}>
                        <pre id="words_sql_elem"></pre>
                    </div>
                </div>
            </fieldset>
          </>
        );
    }
}
