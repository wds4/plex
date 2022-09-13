
import React, { Component, createRef, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
// import * as Constants from '../../../conceptGraphMasthead.js';
import ConceptGraphMasthead from '../../../conceptGraphMasthead.js';
import LeftNavbarMaintenance from '../../../LeftNavbar_Maintenance';
import * as MiscFunctions from '../../../lib/miscFunctions.js';
import * as MaintenanceFunctions from './maintenanceOfPropertySchemas_functions.js';
const jQuery = require("jquery");

// coda for this pattern-match-function group: was XYZ, changed to prs

const getPromise = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(`Promise resolved for ${time}s`)
        }, time)
    })
}

const mainFoo = async () => {
    var myPromiseArray = [getPromise(1000), getPromise(500), getPromise(3000)]
    console.log('Before For Each Loop')

    // AVOID USING THIS
    // myPromiseArray.forEach(async (element, index) => {
    //   let result = await element;
    //   console.log(result);
    // })

    // This works well
    for (const element of myPromiseArray) {
        let result = await element;
        console.log(result)
    }

    console.log('After For Each Loop')
}



export default class MaintenanceOfPropertySchemas extends React.Component {
    componentDidMount() {
        var conceptGrapTableName = jQuery("#myConceptGraphSelector option:selected").data("tablename");
        MaintenanceFunctions.fetchConceptGraph_prs(conceptGrapTableName);
        jQuery("#updateConceptGraphButton").click(function(){
            jQuery.each(MaintenanceFunctions.words_prs_post_rF_obj,function(nextWord_slug,nextWord_obj){
                // MiscFunctions.updateWordInAllTables(nextWord_obj)
                MiscFunctions.createOrUpdateWordInAllTables(nextWord_obj)
            })
        })
        jQuery("#createWordSelectorButton_prs").click(function(){
            console.log("createWordSelectorButton_prs clicked")
            MaintenanceFunctions.createWordSelector_prs();
            mainFoo();
        })
    }
    render() {
        return (
          <>
            <fieldset className="mainBody" >
                <LeftNavbarMaintenance />
                <div className="mainPanel" >
                    <ConceptGraphMasthead />
                    <div class="h2">Maintenance of Property Schemas</div>
                    <div style={{fontSize:"12px",width:"90%",border:"1px solid black",padding:"5px"}}>
                    There are 9 basic property types. (May change in future.)
                    For each concept's property schema, make sure there is a set for each basic type of property.
                    e.g. for type0: make sure propertiesFor[Concept]_type0 exists.
                    (Exception: for concept: property, instead of propertiesForProperty_type0, we have: properties_type0.
                    May need to change this at some point: have a dedicated propertyTreeSchema for each conceptGraph.)
                    <br/>
                    Also make sure for each type, there is a propagateProperty relationship.
                    e.g. for type0,
                    properties_type0 -- propagateProperty -- propertiesFor[Concept]_type0
                    </div>
                    <br/>
                    <div className="doSomethingButton" id="updateConceptGraphButton">update concept graph</div>
                    <div className="doSomethingButton" id="createWordSelectorButton_prs">create word selector</div>
                    <br/>
                    Select one word:<div id="wordSelectorElem_prs" style={{display:"inline-block"}} >wordSelectorElem_prs</div>
                    <div style={{display:"inline-block"}} > number of new + updated words: </div>
                    <div style={{display:"inline-block"}} id="numUpdatedWordsContainer_prs" >numUpdatedWordsContainer_prs</div>
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
