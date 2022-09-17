import React from 'react';
import { NavLink, Link } from "react-router-dom";
import * as MiscFunctions from '../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../lib/ipfs/miscIpfsFunctions.js'
// import * as NeuroCore2TopPanel from '../neuroCore2/neuroCoreTopPanel.js';

const jQuery = require("jquery");

export default class EBooksMasthead extends React.Component {
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
                console.log("populateFieldsWithoutEditing; try; myUserData: "+myUserData)
                var oMyUserData = JSON.parse(myUserData);
                if (typeof oMyUserData == "object") {
                    var myUsername = oMyUserData.username;
                    var peerID = oMyUserData.peerID;
                    jQuery("#myUsernameMastheadContainer").html(myUsername)
                }
            } catch (e) {}
        }
    }
    render() {
        return (
          <>
              <div>
                  <div style={{fontSize:"48px",display:"inline-block",marginTop:"10px",color:"#1B2631",marginRight:"30px"}}>
                  eBooks
                  </div>

                  <div style={{float:"right",display:"inline-block",marginRight:"50px",height:"100%"}}>
                      <div style={{display:"inline-block",marginTop:"10px",marginRight:"10px"}} >
                          <div >
                            <div style={{verticalAlign:"bottom",fontSize:"20px",display:"inline-block"}} >Hi</div>
                            <div id="myUsernameMastheadContainer" style={{display:"inline-block",marginLeft:"5px",fontSize:"20px",color:"purple"}}>my username</div>
                            <div style={{verticalAlign:"bottom",display:"inline-block",fontSize:"20px"}} >!</div>
                          </div>
                          <div style={{fontSize:"8px"}}>
                            my cid:
                            <div id="myCidMastheadContainer" style={{display:"inline-block",marginLeft:"5px",color:"grey"}}>peerID</div>
                          </div>
                      </div>
                      <NavLink className="mastheadNavButton" exact activeClassName="active" to='/PlexAppsNavPage' >apps</NavLink>
                      <NavLink className="mastheadNavButton" exact activeClassName="active" to='/PlexSettingsMainPage' >
                          Settings
                          <div style={{fontSize:"8px"}}>(Plex)</div>
                      </NavLink>
                      <NavLink className="mastheadNavButton" exact activeClassName="active" to='/ProfileMainPage' >Profile</NavLink>
                  </div>
                  <div style={{clear:"both"}}></div>
              </div>
              <div className="landingPage_plex_SubBanner" >
                  <div >Plex motto</div>
              </div>
          </>
        );
    }
}
