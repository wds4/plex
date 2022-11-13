import React from 'react';
import * as MiscIpfsFunctions from '../lib/ipfs/miscIpfsFunctions.js'
import { NavLink } from "react-router-dom";

const jQuery = require("jquery");

export default class GrapevineMasthead extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentConceptGraphSqlID: window.currentConceptGraphSqlID,
            currentConceptSqlID: window.currentConceptSqlID
        }
    }
    async componentDidMount() {
        if (window.hasIpfsMfsBeenInitialized == false) {
            try {
                window.hasIpfsMfsBeenInitialized = true;
                var foo = await MiscIpfsFunctions.initializeIpfsMutableFileSystem();
            } catch (e) {
                console.log("grapevineMasthead initializeIpfsMutableFileSystem e: "+e)
            }
        }
        var ipfsPath = "/grapevineData/userProfileData/myProfile.txt";
        var oIpfsID = await MiscIpfsFunctions.ipfs.id();
        var cid = oIpfsID.id;
        // jQuery("#myCidMastheadContainer").html(cid)
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

        // var stockAvatarCid = MiscIpfsFunctions.addDefaultImage(cid)
        var myAvatarCid = await MiscIpfsFunctions.returnUserImageCid(cid)
        var blob = await MiscIpfsFunctions.fetchImgFromIPFS_b(myAvatarCid)
        var img = document.getElementById("mastheadAvatarThumb") // the img tag you want it in
        img.src = window.URL.createObjectURL(blob)

        var pitterCid = "QmNhBB4HzcEK2FQryiwfH9k21CqDFZab7G21brEyP3nCQ7"
        var blob2 = await MiscIpfsFunctions.fetchImgFromIPFS_b(pitterCid)
        var img2 = document.getElementById("pitterThumb") // the img tag you want it in
        img2.src = window.URL.createObjectURL(blob2)
    }
    render() {
        return (
          <>
              <div >
                  <div style={{height:"100%"}}>
                      <div style={{fontSize:"48px",display:"inline-block",marginTop:"10px",color:"purple",marginRight:"5px"}}>
                      Pitter
                      </div>
                      <div style={{width:"35px",marginTop:"20px",display:"inline-block"}} >
                            <img id='pitterThumb' />
                      </div>


                      <div style={{float:"right",display:"inline-block",marginRight:"50px",height:"100%"}}>
                        <NavLink  exact activeClassName="active" to='/ProfileMainPage' >
                          <div className="mastheadAvatarContainer" >
                                <img id='mastheadAvatarThumb' className='contactsPageAvatarThumb' />
                          </div>
                          <div style={{display:"inline-block",marginTop:"10px",marginRight:"10px"}} >
                                <div style={{fontSize:"20px",display:"inline-block"}} >Hi</div>
                                <div id="myUsernameMastheadContainer" style={{display:"inline-block",marginLeft:"5px",fontSize:"20px",color:"purple"}}>my username</div>
                                <div style={{display:"inline-block",fontSize:"20px"}} >!</div>
                          </div>
                        </NavLink>
                          <NavLink className="mastheadNavButton" exact activeClassName="active" to='/GrapevineSettingsMainPage' >
                              Settings
                              <div style={{fontSize:"8px"}}>(Grapevine)</div>
                              </NavLink>

                          <NavLink className="mastheadNavButton" exact activeClassName="active" to='/ProfileMainPage' style={{display:"none"}} >Profile</NavLink>
                      </div>

                      <div style={{clear:"both"}}></div>
                  </div>

                  <div className="landingPageSubBanner" >
                      <div >Pitter Patter let's get at 'er</div>
                  </div>
              </div>
          </>
        );
    }
}
