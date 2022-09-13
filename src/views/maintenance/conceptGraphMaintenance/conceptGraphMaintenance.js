
import React, { Component, createRef, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import * as Constants from '../../../conceptGraphMasthead.js';
import LeftNavbarMaintenance from '../../../LeftNavbar_Maintenance';
import * as MiscFunctions from '../../../lib/miscFunctions.js';
import * as MaintenanceFunctions from './conceptGraphMaintenanceFunctions.js';
const jQuery = require("jquery");

// coda for this pattern-match-function group: XYZ

export default class ConceptGraphMaintenance extends React.Component {
    componentDidMount() {
        var conceptGrapTableName = jQuery("#myConceptGraphSelector option:selected").data("tablename");
        MaintenanceFunctions.fetchConceptGraph_XYZ(conceptGrapTableName);
        jQuery("#updateConceptGraphButton").click(function(){
            jQuery.each(MaintenanceFunctions.words_XYZ_post_rF_obj,function(nextWord_slug,nextWord_obj){
                MiscFunctions.updateWordInAllTables(nextWord_obj)
            })
        })
    }
    render() {
        return (
          <>
            <fieldset className="mainBody" >
                <LeftNavbarMaintenance />
                <div className="mainPanel" >
                    {Constants.conceptGraphMasthead}
                    <div class="h2">Maintenance of Concept Graph</div>
                    Select one of My Concept Graphs:
                    <select id="myConceptGraphSelector" >
                        <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_pga" >Pretty Good Apps Main Concept Graph (new)</option>
                        <option data-dictionarytablename="myDictionary_temporary" data-tablename="myConceptGraph_temporary" selected >Concept Graph: Temporary For Testing Shit</option>
                        <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_organisms" >Concept Graph: Organisms</option>
                        <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_epistemologies" >Concept Graph: Epistemologies</option>
                        <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_2WAY" >Concept Graph: 2WAY</option>
                    </select>
                    <br/>
                    <div className="doSomethingButton" id="updateConceptGraphButton">update concept graph</div>
                    <br/>
                    Select one word:<div id="wordSelectorElem_XYZ" style={{display:"inline-block"}} >wordSelectorElem_XYZ</div>
                    <div style={{display:"inline-block"}} > number of updated words: </div>
                    <div style={{display:"inline-block"}} id="numUpdatedWordsContainer_XYZ" >numUpdatedWordsContainer_XYZ</div>
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
