
import React, { Component, createRef, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
// import * as Constants from '../../../conceptGraphMasthead.js';
import ConceptGraphMasthead from '../../../conceptGraphMasthead.js';
import LeftNavbarMaintenance from '../../../LeftNavbar_Maintenance';
import * as MiscFunctions from '../../../lib/miscFunctions.js';
import * as MaintenanceFunctions from '../maintenanceOfXYZ/maintenanceOfXYZ_functions.js';
import * as MaintenanceOfXYZ from './maintenanceOfXYZ/cp_maintenanceOfXYZ_functions.js';
import * as ConceptGraphMaintenance from './conceptGraphMaintenance/cp_conceptGraphMaintenanceFunctions.js';
import * as ConceptsMaintenance from './conceptsMaintenance/cp_conceptsMaintenanceFunctions.js';
import * as GlobalDynamicDataMaintenance from './globalDynamicData/cp_globalDynamicDataFunctions.js';
import * as MaintenanceOfPropertySchemas from './maintenanceOfPropertySchemas/cp_maintenanceOfPropertySchemas_functions.js';
import * as PropertyDataMaintenance from './propertyData/cp_propertyDataFunctions.js';
import IpfsHttpClient from 'ipfs-http-client';
import sendAsync from '../../../renderer';
// import * as MaintenanceFunctions from './maintenanceOfXYZ_functions.js';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

var maintenanceFunctionsRunning = false;

export const updateControlPanelDisplay = (numUpdatedWords,currentTaskNumber) => {
    var modCurrentTaskNumber = currentTaskNumber % 3;

    // Main Control Panel display
    var outputID = "conceptGraphMaintenanceGroup_"+modCurrentTaskNumber;
    var outputHTML = numUpdatedWords
    jQuery("#"+outputID).html(outputHTML)
    jQuery("#currentTaskNumberContainer").html(currentTaskNumber)
    jQuery("#maintenanceGroupNameContainer_0").css("border","1px solid white")
    jQuery("#maintenanceGroupNameContainer_1").css("border","1px solid white")
    jQuery("#maintenanceGroupNameContainer_2").css("border","1px solid white")
    var maintenanceGroupNameContainerID = "maintenanceGroupNameContainer_"+modCurrentTaskNumber;
    jQuery("#"+maintenanceGroupNameContainerID).css("border","1px solid black")


    // mini Control Panel Display
    var outputID = "conceptGraphMaintenanceGroup_mini_"+modCurrentTaskNumber;
    var outputHTML = numUpdatedWords
    jQuery("#"+outputID).html(outputHTML)
    jQuery("#currentTaskNumberContainer_mini").html(currentTaskNumber)
    jQuery("#maintenanceGroupNameContainer_mini_0").css("border","1px solid white")
    jQuery("#maintenanceGroupNameContainer_mini_1").css("border","1px solid white")
    jQuery("#maintenanceGroupNameContainer_mini_2").css("border","1px solid white")
    var maintenanceGroupNameContainerMiniID = "maintenanceGroupNameContainer_mini_"+modCurrentTaskNumber;
    jQuery("#"+maintenanceGroupNameContainerMiniID).css("border","1px solid black")
}

var currentTaskNumber = 0;
var updateChangedWords = false;
export const proceedWithNextTask = async () => {
    // console.log("proceedWithNextTask")
    if (maintenanceFunctionsRunning) {
        currentTaskNumber++;
        // console.log("currentTaskNumber: "+currentTaskNumber)
        setTimeout( async () => {
            var conceptGrapTableName = jQuery("#myConceptGraphSelector option:selected").data("tablename");
            var modCurrentTaskNumber = currentTaskNumber % 3;
            var numUpdatedWords = -1;
            var updateChangedWordsThisGroup = false;
            // XYZ
            if (modCurrentTaskNumber==0) {
                updateChangedWordsThisGroup = false;
                if (!updateChangedWords) {
                    updateChangedWordsThisGroup = false;
                }
                numUpdatedWords = await MaintenanceOfXYZ.cp_fetchConceptGraph_XYZ(conceptGrapTableName,currentTaskNumber,updateChangedWordsThisGroup)
            }
            // globalDynamicData
            if (modCurrentTaskNumber==1) {
                updateChangedWordsThisGroup = true;
                if (!updateChangedWords) {
                    updateChangedWordsThisGroup = false;
                }
                numUpdatedWords = await GlobalDynamicDataMaintenance.cp_fetchConceptGraph_gDD(conceptGrapTableName,currentTaskNumber,updateChangedWordsThisGroup)
            }
            // propertyData
            if (modCurrentTaskNumber==2) {
                updateChangedWordsThisGroup = true;
                if (!updateChangedWords) {
                    updateChangedWordsThisGroup = false;
                }
                numUpdatedWords = await PropertyDataMaintenance.cp_fetchConceptGraph_pDM(conceptGrapTableName,currentTaskNumber,updateChangedWordsThisGroup)
            }
            // console.log("numUpdatedWords: "+numUpdatedWords)
        }, 300, currentTaskNumber );
    }
}
export default class MaintenanceControlPanel extends React.Component {
    componentDidMount() {
        // var conceptGrapTableName = jQuery("#myConceptGraphSelector option:selected").data("tablename");

        jQuery("#startBackgroundMaintenanceWithChangesButton").click(async function(){
            // console.log("startBackgroundMaintenanceWithChangesButton clicked");
            jQuery("#startBackgroundMaintenanceWithChangesButton").css("backgroundColor","green")
            jQuery("#startBackgroundMaintenanceWithoutChangesButton").css("backgroundColor","grey")
            jQuery("#stopBackgroundMaintenanceButton").css("backgroundColor","grey")
            updateChangedWords = true;
            if (!maintenanceFunctionsRunning) {
                maintenanceFunctionsRunning = true;
                proceedWithNextTask();
            }
        });
        jQuery("#startBackgroundMaintenanceWithoutChangesButton").click(async function(){
            // console.log("startBackgroundMaintenanceWithoutChangesButton clicked");
            jQuery("#startBackgroundMaintenanceWithChangesButton").css("backgroundColor","grey")
            jQuery("#startBackgroundMaintenanceWithoutChangesButton").css("backgroundColor","green")
            jQuery("#stopBackgroundMaintenanceButton").css("backgroundColor","grey")
            updateChangedWords = false;
            if (!maintenanceFunctionsRunning) {
                maintenanceFunctionsRunning = true;
                proceedWithNextTask();
            }
        });
        jQuery("#stopBackgroundMaintenanceButton").click(async function(){
            // console.log("stopBackgroundMaintenanceButton clicked");
            jQuery("#startBackgroundMaintenanceWithChangesButton").css("backgroundColor","grey")
            jQuery("#startBackgroundMaintenanceWithoutChangesButton").css("backgroundColor","grey")
            jQuery("#stopBackgroundMaintenanceButton").css("backgroundColor","green")
            maintenanceFunctionsRunning = false;
        });
    }
    render() {
        return (
          <>
            <fieldset className="mainBody" >
                <LeftNavbarMaintenance />
                <div className="mainPanel" >
                    <ConceptGraphMasthead />
                    <div class="h2">Control Panel for Routine Maintenance and Upkeep of the Concept Graph</div>
                    Select one of My Concept Graphs:
                    <select id="myConceptGraphSelector" >
                        <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_pga" >Pretty Good Apps Main Concept Graph (new)</option>
                        <option data-dictionarytablename="myDictionary_temporary" data-tablename="myConceptGraph_temporary" selected >Concept Graph: Temporary For Testing Shit</option>
                        <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_organisms" >Concept Graph: Organisms</option>
                        <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_epistemologies" >Concept Graph: Epistemologies</option>
                        <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_2WAY" >Concept Graph: 2WAY</option>
                    </select>
                    <br/>
                    <div className="doSomethingButton" id="startBackgroundMaintenanceWithChangesButton">Start (make changes)</div>
                    <div className="doSomethingButton" id="startBackgroundMaintenanceWithoutChangesButton">Start (do NOT make changes!)</div>
                    <div className="doSomethingButton" id="stopBackgroundMaintenanceButton">Stop</div>
                    <br/>

                    <div style={{width:"300px",border:"1px solid black",padding:"5px",backgroundColor:"white"}}>
                        <center>CP Activity Display</center>

                        task number: <div id="currentTaskNumberContainer" style={{display:"inline-block"}}></div>

                        <br/>

                        <div className="leftCol_cpd" style={{borderBottom:"1px solid black"}} >
                        group name
                        </div>
                        <div className="midCol_cpd" style={{borderBottom:"1px solid black"}} >
                        number
                        </div>
                        <div className="rightCol_cpd" style={{borderBottom:"1px solid black"}} >
                        num words changed
                        </div>

                        <br/>

                        <div id="maintenanceGroupNameContainer_0" className="leftCol_cpd" >
                        0 XYZ [dummy group]
                        </div>
                        <div id="cgMid_0" className="midCol_cpd" >
                        0
                        </div>
                        <div id="conceptGraphMaintenanceGroup_0" className="rightCol_cpd" >

                        </div>

                        <br/>

                        <div id="maintenanceGroupNameContainer_1" className="leftCol_cpd" >
                        1 globalDynamicData
                        </div>
                        <div id="cgMid_1" className="midCol_cpd" >
                        1
                        </div>
                        <div id="conceptGraphMaintenanceGroup_1" className="rightCol_cpd" >

                        </div>

                        <br/>

                        <div id="maintenanceGroupNameContainer_2" className="leftCol_cpd" >
                        2 propertyData
                        </div>
                        <div id="cgMid_2" className="midCol_cpd" >
                        2
                        </div>
                        <div id="conceptGraphMaintenanceGroup_2" className="rightCol_cpd" >

                        </div>

                        <br/>


                    </div>
                </div>
            </fieldset>
          </>
        );
    }
}
