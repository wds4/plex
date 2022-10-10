import React from 'react';
import { NavLink, Link } from "react-router-dom";
import * as MiscFunctions from '../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../lib/ipfs/miscIpfsFunctions.js'
import * as NeuroCore2TopPanel from '../neuroCore2/neuroCoreTopPanel.js';

const jQuery = require("jquery");

const timeout = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default class ConceptGraphMasthead extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentConceptGraphSqlID: window.currentConceptGraphSqlID,
            currentConceptSqlID: window.currentConceptSqlID
        }
    }
    async componentDidMount() {
        var ipfsPath = "/grapevineData/userProfileData/myProfile.txt";
        var oIpfsID = await MiscIpfsFunctions.ipfs.id();
        var cid = oIpfsID.id;
        jQuery("#myCidMastheadContainer").html(cid)
        for await (const chunk of MiscIpfsFunctions.ipfs.files.read(ipfsPath)) {
            var myUserData = new TextDecoder("utf-8").decode(chunk);
            try {
                // console.log("populateFieldsWithoutEditing; try; myUserData: "+myUserData)
                var oMyUserData = JSON.parse(myUserData);
                if (typeof oMyUserData == "object") {
                    var myUsername = oMyUserData.username;
                    var peerID = oMyUserData.peerID;
                    jQuery("#myUsernameMastheadContainer").html(myUsername)
                }
            } catch (e) {}
        }
        jQuery("#neuroCorePanelToggleButton").click(function(){
            var currStatus = jQuery("#neuroCorePanelToggleButton").data("status");
            if (currStatus=="closed") {
                jQuery("#neuroCorePanelToggleButton").data("status","open");
                jQuery("#neuroCorePanelToggleButton").html("hide NeuroCore")
                // jQuery("#neuroCoreMonitoringPanel").css("display","block")
                jQuery("#neuroCoreMonitoringPanel").animate({
                    height: "80%",
                    padding: "10px",
                    borderWidth:"1px"
                },500);
            }
            if (currStatus=="open") {
                jQuery("#neuroCorePanelToggleButton").data("status","closed");
                jQuery("#neuroCorePanelToggleButton").html("show NeuroCore");
                // jQuery("#neuroCoreMonitoringPanel").css("display","none")
                jQuery("#neuroCoreMonitoringPanel").animate({
                    height: "0%",
                    padding: "0px",
                    borderWidth:"0px"
                },500);
            }
        });

        jQuery("#neuroCore2PanelToggleButton").click(function(){
            var currStatus = jQuery("#neuroCore2PanelToggleButton").data("status");
            if (currStatus=="closed") {
                jQuery("#neuroCore2PanelToggleButton").data("status","open");
                jQuery("#neuroCore2PanelToggleButton").html("hide NeuroCore")
                // jQuery("#neuroCore2MonitoringPanel").css("display","block")
                jQuery("#neuroCore2MonitoringPanel").animate({
                    height: "80%",
                    padding: "10px",
                    borderWidth:"1px"
                },500);
            }
            if (currStatus=="open") {
                jQuery("#neuroCore2PanelToggleButton").data("status","closed");
                jQuery("#neuroCore2PanelToggleButton").html("show NeuroCore");
                // jQuery("#neuroCore2MonitoringPanel").css("display","none")
                jQuery("#neuroCore2MonitoringPanel").animate({
                    height: "0%",
                    padding: "0px",
                    borderWidth:"0px"
                },500);
            }
        });

        jQuery("#sqlInDOMPanelToggleButton").click(function(){
            var currStatus = jQuery("#sqlInDOMPanelToggleButton").data("status");
            if (currStatus=="closed") {
                jQuery("#sqlInDOMPanelToggleButton").data("status","open");
                jQuery("#sqlInDOMPanelToggleButton").html("hide SQL in DOM panel")
                jQuery("#manageSqlInDOMPanel").animate({
                    height: "40%",
                    padding: "10px",
                    borderWidth:"1px"
                },500);
            }
            if (currStatus=="open") {
                jQuery("#sqlInDOMPanelToggleButton").data("status","closed");
                jQuery("#sqlInDOMPanelToggleButton").html("show SQL in DOM panel");
                jQuery("#manageSqlInDOMPanel").animate({
                    height: "0%",
                    padding: "0px",
                    borderWidth:"0px"
                },500);
            }
        });

        var conceptGraphTitle = MiscFunctions.returnConceptGraphInfo("title");
        jQuery("#conceptGraphTitleContainer_masthead").html(conceptGraphTitle)

        var conceptIdentifier = MiscFunctions.returnConceptInfo("name");
        jQuery("#conceptFieldContainer_masthead").html(conceptIdentifier)

        jQuery("#takeANapButton").click( async function(){
            console.log("takeANapButton clicked")
            if (window.oAutomatedImportData.running == false) {
                jQuery("#goToCurrentConceptGraphMainPageButton").get(0).click();
            }
            console.log("takeANapButton do some more stuff")
            document.getElementById("executeChangesSelector").value="yes";
            document.getElementById("repeatLoopOverPatternListSelector").value="managed";
            jQuery(".patternCheckbox").prop("checked",false);
            jQuery("#patternCheckbox_pattern_p-r-s1n-initialprocessing_s8itsr").prop("checked",true);
            jQuery("#populateActivePatternsButton").get(0).click();
            await timeout(1000)
            jQuery("#startNeuroCore2Button").get(0).click();
        })
        jQuery("#takeANapREMButton").click( async function(){
            console.log("takeANapREMButton clicked")
            var message = "";
            message += "Not yet functional or even fully defined. \n\n";
            message += "REM = gRapevine Enabled Mudulation, lol. \n\n";
            message += "It will involve ";
            alert(message)
        })
        jQuery("#takeADeeperNapButton").click(function(){
            NeuroCore2TopPanel.takeADeeperNap()
        })
        jQuery("#neuroCoreTablenameSelector").change(async function(){
            var neuroCoreTablename = jQuery("#neuroCoreTablenameSelector option:selected").data("neurocoretablename")
            var neuroCoreSqlID = jQuery("#neuroCoreTablenameSelector option:selected").data("neurocoresqlid")
            console.log("changing neuroCoreTable; neuroCoreTablename: "+neuroCoreTablename+"; neuroCoreSqlID: "+neuroCoreSqlID)
            var foo = true;
            window.neuroCore.engine.currentConceptGraphSqlID = neuroCoreSqlID;
            await NeuroCore2TopPanel.loadNeuroCore2ConceptGraph(foo);
            await NeuroCore2TopPanel.loadPatterns()
        })
    }
    render() {
        return (
          <>
              <div>
                  <div style={{fontSize:"20px",display:"inline-block",marginTop:"10px",color:"#003300"}}>
                  the
                  </div>
                  <div style={{fontSize:"48px",display:"inline-block",marginTop:"10px",color:"#5F5F5F",marginRight:"0px"}}>
                  Concept Graph
                  </div>
                  <div style={{fontSize:"14px",display:"inline-block",marginTop:"10px",color:"#003300",marginRight:"20px"}}>
                    <div style={{lineHeight:"90%"}}>front<br/>end</div>
                  </div>

                  <div style={{float:"right",display:"inline-block",marginRight:"50px",height:"100%"}}>
                      <div style={{display:"inline-block",marginTop:"10px",marginRight:"10px"}} >
                          <div >
                            <div style={{verticalAlign:"bottom",fontSize:"20px",display:"inline-block"}} >Hi</div>
                            <div id="myUsernameMastheadContainer" style={{display:"inline-block",marginLeft:"5px",fontSize:"20px",color:"purple"}}>my username</div>
                            <div style={{verticalAlign:"bottom",display:"inline-block",fontSize:"20px"}} >!</div>
                          </div>
                          <div style={{fontSize:"8px",display:"none"}}>
                            my cid:
                            <div id="myCidMastheadContainer" style={{display:"inline-block",marginLeft:"5px",color:"grey"}}>peerID</div>
                          </div>
                      </div>

                      <NavLink className="mastheadNavButton" exact activeClassName="active" to='/ConceptGraphsFrontEnd_ManageDownload' >
                          <div style={{fontSize:"10px",lineHeight:"100%"}} >Download Concept Graph from External MFS</div>
                          </NavLink>

                      <NavLink className="mastheadNavButton" exact activeClassName="active" to='/SettingsMainPage' >
                          Settings
                          <div style={{fontSize:"8px"}}>(Concept Graph)</div>
                          </NavLink>

                      <NavLink className="mastheadNavButton" exact activeClassName="active" to='/ProfileMainPage' >Profile</NavLink>
                  </div>
                  <div style={{clear:"both"}}></div>
              </div>
              <div className="landingPageSubBanner" >
                    <div style={{display:"inline-block",float:"right"}} >
                          <NavLink id="goToCurrentConceptGraphMainPageButton" class="mastheadBarNavButton" style={{display:"inline-block"}} to="/EditExistingConceptGraphPage/current" >
                              <div style={{display:"inline-block"}} >Concept Graph Back End: </div>
                              <div style={{display:"inline-block",marginLeft:"20px"}} id="conceptGraphTitleContainer_masthead" >conceptGraphTitleContainer_masthead</div>
                              <div style={{display:"inline-block",marginLeft:"5px"}} >[ ID: {this.state.currentConceptGraphSqlID} ]</div>
                          </NavLink>

                          <NavLink class="mastheadBarNavButton" style={{display:"inline-block",marginLeft:"10px"}} to='/SingleConceptGeneralInfo/current' >
                              <div style={{display:"inline-block"}} id="conceptFieldContainer_masthead" >conceptFieldContainer_masthead</div>
                              <div style={{display:"inline-block",marginLeft:"5px"}} >[ ID: {this.state.currentConceptSqlID} ]</div>
                          </NavLink>
                    </div>
                    <div style={{display:"inline-block",clear:"both"}} ></div>
              </div>
          </>
        );
    }
}
