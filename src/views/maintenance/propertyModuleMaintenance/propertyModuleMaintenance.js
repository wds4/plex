
import React, { Component, createRef, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
// import * as Constants from '../../../conceptGraphMasthead.js';
import ConceptGraphMasthead from '../../../conceptGraphMasthead.js';
import LeftNavbarMaintenance from '../../../LeftNavbar_Maintenance';
import * as MiscFunctions from '../../../lib/miscFunctions.js';
import * as MaintenanceFunctions from './maintenanceOfXYZ_functions.js';
const jQuery = require("jquery");

// coda for this pattern-match-function group: XYZ

export default class PropertyModuleMaintenance extends React.Component {
    componentDidMount() {
        var conceptGrapTableName = jQuery("#myConceptGraphSelector option:selected").data("tablename");
        MaintenanceFunctions.fetchConceptGraph_XYZ(conceptGrapTableName);
        jQuery("#updateConceptGraphButton").click(function(){
            jQuery.each(MaintenanceFunctions.words_XYZ_post_rF_obj,function(nextWord_slug,nextWord_obj){
                // MiscFunctions.updateWordInAllTables(nextWord_obj)
                MiscFunctions.createOrUpdateWordInAllTables(nextWord_obj)
            })
        })
        jQuery("#createWordSelectorButton").click(function(){
            console.log("createWordSelectorButton clicked")
            MaintenanceFunctions.createWordSelector_XYZ();
        })
    }
    render() {
        return (
          <>
            <fieldset className="mainBody" >
                <LeftNavbarMaintenance />
                <div className="mainPanel" >
                    <ConceptGraphMasthead />
                    <div class="h2">Property Module Maintenance</div>
                    <div style={{fontSize:"12px",border:"1px solid black",padding:"10px",display:"inline-block"}}>
                    Starting with the following pattern: <br/>
                    enumerationSlug -- inducesPartitioningOf, field: propertyModuleKey -- target set (usually but not always superset of target concept)<br/>
                    Flesh out a propertyModule in its entirety. This is a multistep process. Each step produces a pattern which is detected and acted upon by the next step.
                    </div>
                    <br/>
                    <div className="doSomethingButton" id="updateConceptGraphButton">update concept graph</div>
                    <div className="doSomethingButton" id="createWordSelectorButton">create word selector</div>
                    <br/>
                    Select one word:<div id="wordSelectorElem_XYZ" style={{display:"inline-block"}} >wordSelectorElem_XYZ</div>
                    <div style={{display:"inline-block"}} > number of new words: </div>
                    <div style={{display:"inline-block"}} id="numNewWordsContainer_XYZ" >numNewWordsContainer_XYZ</div>
                    <div style={{display:"inline-block",marginLeft:"20px"}} > number of updated words: </div>
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
