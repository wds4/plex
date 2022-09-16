import React from "react";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import Masthead from '../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/grapevine_leftNav1';

const jQuery = require("jquery");

const populateFieldsWithoutEditing = async () => {
    var ipfsPath = "/grapevineData/userProfileData/myProfile.txt";
    for await (const chunk of MiscIpfsFunctions.ipfs.files.read(ipfsPath)) {
        var myUserData = new TextDecoder("utf-8").decode(chunk);
        try {
            var oMyUserData = JSON.parse(myUserData);
            if (typeof oMyUserData == "object") {
                // var sMyUserData = JSON.stringify(oMyUserData,null,4);
                // console.log("sMyUserData: "+sMyUserData)
                var myUsername = oMyUserData.username;
                var peerID = oMyUserData.peerID;
                var loc = oMyUserData.loc;
                var about = oMyUserData.about;
                var lastUpdated = oMyUserData.lastUpdated;
                var imageCid = oMyUserData.imageCid;

                jQuery("#usernameContainer").html(myUsername)
                jQuery("#locationContainer").html(loc)
                jQuery("#aboutContainer").html(about)

            } else {
            }
        } catch (e) {
            console.log("error: "+e)
        }
    }
}

const populateFieldsWithEditing = async () => {
    var ipfsPath = "/grapevineData/userProfileData/myProfile.txt";
    for await (const chunk of MiscIpfsFunctions.ipfs.files.read(ipfsPath)) {
        var myUserData = new TextDecoder("utf-8").decode(chunk);
        try {
            var oMyUserData = JSON.parse(myUserData);
            if (typeof oMyUserData == "object") {
                // var sMyUserData = JSON.stringify(oMyUserData,null,4);
                // console.log("sMyUserData: "+sMyUserData)
                var myUsername = oMyUserData.username;
                var peerID = oMyUserData.peerID;
                var loc = oMyUserData.loc;
                var about = oMyUserData.about;
                var lastUpdated = oMyUserData.lastUpdated;
                var imageCid = oMyUserData.imageCid;

                var myUsernameHTML = "";
                myUsernameHTML += "<textarea id='myUsernameEditBox' style='width:90%;font-size:22px;' >";
                myUsernameHTML += myUsername;
                myUsernameHTML += "</textarea>";

                var locationHTML = "";
                locationHTML += "<textarea id='myLocationEditBox' style='width:90%;font-size:22px;height:80%;' >";
                locationHTML += loc;
                locationHTML += "</textarea>";

                var aboutHTML = "";
                aboutHTML += "<textarea id='myAboutEditBox' style='width:90%;font-size:22px;height:80%;' >";
                aboutHTML += about;
                aboutHTML += "</textarea>";

                jQuery("#usernameContainer").html(myUsernameHTML)
                jQuery("#locationContainer").html(locationHTML)
                jQuery("#aboutContainer").html(aboutHTML)
            } else {
            }
        } catch (e) {
            console.log("error: "+e)
        }
    }
}

export default class ProfileMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");
        populateFieldsWithoutEditing();
        jQuery("#toggleEditProfileButton").click(function(){
            var editStatus = jQuery(this).data("editstatus")
            if (editStatus=="off") {
                jQuery(this).data("editstatus","on")
                populateFieldsWithEditing();
                jQuery("#saveProfileChangesButton").css("display","inline-block")
            }
            if (editStatus=="on") {
                jQuery(this).data("editstatus","off")
                populateFieldsWithoutEditing();
                jQuery("#saveProfileChangesButton").css("display","none")
            }
        })
        jQuery("#saveProfileChangesButton").click(async function(){
            var myUpdatedUsername = jQuery("#myUsernameEditBox").val()
            var myUpdatedLocation = jQuery("#myLocationEditBox").val()
            var myUpdatedAbout = jQuery("#myAboutEditBox").val()
            var ipfsPath = "/grapevineData/userProfileData/myProfile.txt";
            for await (const chunk of MiscIpfsFunctions.ipfs.files.read(ipfsPath)) {
                var myUserData = new TextDecoder("utf-8").decode(chunk);
                try {
                    var oMyUserData = JSON.parse(myUserData);
                    if (typeof oMyUserData == "object") {
                        var sMyUserData = JSON.stringify(oMyUserData,null,4);
                        console.log("sMyUserData A: "+sMyUserData)
                        oMyUserData.username = myUpdatedUsername;
                        oMyUserData.loc = myUpdatedLocation;
                        oMyUserData.about = myUpdatedAbout;
                        oMyUserData.lastUpdated = Date.now();
                        oMyUserData.imageCid = null;
                        var sMyUserData = JSON.stringify(oMyUserData,null,4);
                        console.log("sMyUserData B: "+sMyUserData)

                    } else {
                    }
                } catch (e) {
                    console.log("error: "+e)
                }
            }
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <center>
                            <div style={{border:"1px dashed grey",width:"1210px",textAlign:"left"}}>
                                <div style={{display:"inline-block",border:"1px dashed grey",width:"400px",height:"400px"}}>

                                </div>

                                <div style={{display:"inline-block",border:"1px dashed grey",width:"800px",height:"400px"}}>
                                    <div id="usernameContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"70px",padding:"10px",fontSize:"28px",textAlign:"left",overflow:"scroll"}}>
                                    </div>
                                    <div id="locationContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"70px",padding:"10px",fontSize:"18px",textAlign:"left",overflow:"scroll",color:"grey"}}>
                                    </div>
                                    <div id="aboutContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"200px",padding:"10px",fontSize:"18px",textAlign:"left",overflow:"scroll"}}>
                                    </div>
                                    <div data-editstatus="off" id="toggleEditProfileButton" className="doSomethingButton">toggle edit profile</div>
                                    <div id="saveProfileChangesButton" className="doSomethingButton" style={{display:"none"}} >save changes</div>
                                </div>
                            </div>

                            <div style={{border:"1px dashed grey",width:"1210px",height:"400px",textAlign:"left",overflow:"scroll"}}>
                                <center>more data</center>
                                <a target='_blank' href='https://openprocessing.org/sketch/418494/embed/' >rorschach image generator</a>
                            </div>

                        </center>

                    </div>
                </fieldset>
            </>
        );
    }
}
