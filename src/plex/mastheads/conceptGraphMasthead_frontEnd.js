import React from 'react';
import { NavLink, Link } from "react-router-dom";
import * as MiscFunctions from '../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../lib/ipfs/miscIpfsFunctions.js'
import * as NeuroCore3TopPanel from '../neuroCore3/neuroCoreTopPanel.js';

const jQuery = require("jquery");

const timeout = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default class ConceptGraphMasthead extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentConceptGraphSqlID: window.currentConceptGraphSqlID,
            currentConceptSqlID: window.currentConceptSqlID,
            viewingFrontEndConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
            viewingFrontEndConceptTitle: window.frontEndConceptGraph.viewingConcept.title,
            viewingFrontEndConceptSlug: window.frontEndConceptGraph.viewingConcept.slug
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

        jQuery("#neuroCore3PanelToggleButton").click(function(){
            var currStatus = jQuery("#neuroCore3PanelToggleButton").data("status");
            if (currStatus=="closed") {
                jQuery("#neuroCore3PanelToggleButton").data("status","open");
                jQuery("#neuroCore3PanelToggleButton").html("hide NeuroCore3")
                // jQuery("#neuroCore3MonitoringPanel").css("display","block")
                jQuery("#neuroCore3MonitoringPanel").animate({
                    height: "80%",
                    padding: "10px",
                    borderWidth:"1px"
                },500);
            }
            if (currStatus=="open") {
                jQuery("#neuroCore3PanelToggleButton").data("status","closed");
                jQuery("#neuroCore3PanelToggleButton").html("show NeuroCore3");
                // jQuery("#neuroCore3MonitoringPanel").css("display","none")
                jQuery("#neuroCore3MonitoringPanel").animate({
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

        jQuery("#takeANeuroCore3NapButton").click( async function(){
            console.log("takeANeuroCore3NapButton clicked")
            if (window.oAutomatedImportData.running == false) {
                jQuery("#goToNeuroCore3CurrentConceptGraphMainPageButton").get(0).click();
            }
            console.log("takeANeuroCore3NapButton do some more stuff")
            document.getElementById("executeChangesNeuroCore3Selector").value="yes";
            document.getElementById("repeatLoopOverNeuroCore3PatternListSelector").value="managed";
            jQuery(".neuroCore3PatternCheckbox").prop("checked",false);
            jQuery("#neuroCore3PatternCheckbox_pattern_p-r-s1n-initialprocessing_s8itsr").prop("checked",true);
            jQuery("#populateActiveNeuroCore3PatternsButton").get(0).click();
            await timeout(1000)
            jQuery("#startNeuroCore3Button").get(0).click();
        })
        jQuery("#takeADeeperNeuroCore3NapButton").click(function(){
            NeuroCore3TopPanel.takeADeeperNap()
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

                  <div style={{display:"inline-block"}} >
                      <div className="doSomethingButton" id="takeANeuroCore3NapButton" style={{backgroundColor:"white",color:"purple"}}>Take a NC3 Power Nap! (non REM)</div>
                      <div className="doSomethingButton" id="takeADeeperNeuroCore3NapButton" style={{backgroundColor:"white",color:"purple"}}>(slightly deeper) NC3 Nap! (non REM)</div>
                      <br/>
                      <div className="doSomethingButton" id="neuroCore3PanelToggleButton" data-status="closed" >show NeuroCore3</div>
                      NC3 status:
                      <div data-currentstatus="off" id="NC2StatusIndicator" style={{display:"inline-block",border:"1px solid black",marginLeft:"10px",padding:"0px 10px 0px 10px"}}>off</div>
                      <div style={{display:"inline-block"}} id="latestActionContainer"></div>
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

                      <NavLink className="mastheadNavButton" exact activeClassName="active" to='/ConceptGraphSettingsMainPage' >
                          Settings
                          <div style={{fontSize:"8px"}}>(Concept Graph)</div>
                          </NavLink>

                      <NavLink className="mastheadNavButton" exact activeClassName="active" to='/ProfileMainPage' >Profile</NavLink>
                  </div>
                  <div style={{clear:"both"}}></div>
              </div>
              <div className="landingPageSubBanner" >
                    <div style={{display:"inline-block",float:"left"}} >
                        <div style={{display:"inline-block",marginRight:"10px"}} >Front End: </div>
                        <NavLink id="goToNeuroCore3CurrentConceptGraphMainPageButton" class="mastheadBarNavButton" style={{display:"inline-block"}} to="/ConceptGraphsFrontEndSingleConceptGraphMainPage/current" >
                            <div style={{display:"inline-block",color:"grey"}} >Concept Graph Title:</div>
                            <div style={{display:"inline-block",marginLeft:"5px"}} >{this.props.viewingConceptGraphTitle}</div>
                        </NavLink>

                        <NavLink class="mastheadBarNavButton" style={{display:"inline-block",marginLeft:"10px"}} to="/ConceptGraphsFrontEnd_SingleConceptMainPage/current" >
                            <div style={{display:"inline-block",color:"grey"}} >Concept Title:</div>
                            <div style={{display:"inline-block",marginLeft:"5px"}} >{this.state.viewingFrontEndConceptSlug}</div>
                        </NavLink>
                    </div>

                    <div style={{display:"inline-block",float:"right"}} >
                          <div style={{display:"inline-block",marginRight:"10px"}} >Back End: </div>
                          <NavLink id="goToCurrentConceptGraphMainPageButton" class="mastheadBarNavButton" style={{display:"inline-block"}} to="/EditExistingConceptGraphPage/current" >
                              <div style={{display:"inline-block"}} id="conceptGraphTitleContainer_masthead" >conceptGraphTitleContainer_masthead</div>
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
