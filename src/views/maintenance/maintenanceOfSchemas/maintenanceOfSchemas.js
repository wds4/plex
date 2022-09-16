
import React, { Component, createRef, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import ConceptGraphMasthead from '../../../conceptGraphMasthead.js';
import LeftNavbarMaintenance from '../../../LeftNavbar_Maintenance';
import * as MiscFunctions from '../../../lib/miscFunctions.js';
import * as MaintenanceFunctions from './maintenanceOfSchemas_functions.js';
const jQuery = require("jquery");

// coda for this pattern-match-function group: was XYZ, changed to schemas

export default class MaintenanceOfSchemas extends React.Component {
    componentDidMount() {
        var conceptGrapTableName = jQuery("#myConceptGraphSelector option:selected").data("tablename");
        MaintenanceFunctions.fetchConceptGraph_schemas(conceptGrapTableName);
        jQuery("#updateConceptGraphButton").click(function(){
            jQuery.each(MaintenanceFunctions.words_schemas_post_rF_obj,function(nextWord_slug,nextWord_obj){
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
                    <ConceptGraphMasthead />
                    <div class="h2">Maintenance of Schemas</div>
                    <br/>
                    <div className="doSomethingButton" id="updateConceptGraphButton">update concept graph</div>
                    <br/>
                    Select one word:<div id="wordSelectorElem_schemas" style={{display:"inline-block"}} >wordSelectorElem_schemas</div>
                    <div style={{display:"inline-block"}} > number of updated words: </div>
                    <div style={{display:"inline-block"}} id="numUpdatedWordsContainer_schemas" >numUpdatedWordsContainer_schemas</div>
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