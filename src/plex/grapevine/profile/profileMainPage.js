import React, { useCallback, useState } from 'react';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import { Button } from "reactstrap";
import { useDropzone } from "react-dropzone";
import Masthead from '../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/grapevine_leftNav1';
import { create, urlSource } from 'ipfs'
// import UploadProfileImage from './uploadProfileImage.js'
// const fs = window.require('fs');
// const {desktopCapturer} = require('electron');

// const fs = window.require('fs');

// var Jimp = require('jimp');

const jQuery = require("jquery");

const populateFieldsWithoutEditing = async () => {
    console.log("populateFieldsWithoutEditing")
    var ipfsPath = "/grapevineData/userProfileData/myProfile.txt";
    // var ipfsPathToFlush = "/grapevineData/userProfileData";
    for await (const chunk of MiscIpfsFunctions.ipfs.files.read(ipfsPath)) {
        var myUserData = new TextDecoder("utf-8").decode(chunk);
        console.log("populateFieldsWithoutEditing; myUserData: "+myUserData)
        try {
            console.log("populateFieldsWithoutEditing; try; myUserData: "+myUserData)
            var oMyUserData = JSON.parse(myUserData);

            if (typeof oMyUserData == "object") {
                var sMyUserData = JSON.stringify(oMyUserData,null,4);
                console.log("populateFieldsWithoutEditing; sMyUserData: "+sMyUserData)
                var myUsername = oMyUserData.username;
                var peerID = oMyUserData.peerID;
                var loc = oMyUserData.loc;
                var about = oMyUserData.about;
                var lastUpdated = oMyUserData.lastUpdated;
                var imageCid = oMyUserData.imageCid;

                jQuery("#myIpfsPeerID").html(peerID)

                jQuery("#usernameContainer").html(myUsername)
                jQuery("#locationContainer").html(loc)
                jQuery("#aboutContainer").html(about)

                // var cid1 = 'QmNma7eG55pEEbnoepvCGXZTt8LJDshY6zZerGj8ZY21iS' // sample_rorshach.png in private IPFS network, also on iMac desktop
                // var cid2 = '/ipfs/QmWQmayHks3Gf5oV3RRVbEV37gm9j3aCxYcgx4SZfdHiRY' // darth vader
                // var cid2 = null;
                MiscIpfsFunctions.fetchImgFromIPFS(imageCid);

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
                myUsernameHTML += "<textarea class='profileDataEntryField' id='myUsernameEditBox' style='width:90%;font-size:22px;' >";
                myUsernameHTML += myUsername;
                myUsernameHTML += "</textarea>";

                var locationHTML = "";
                locationHTML += "<textarea class='profileDataEntryField' id='myLocationEditBox' style='width:90%;font-size:22px;height:80%;' >";
                locationHTML += loc;
                locationHTML += "</textarea>";

                var aboutHTML = "";
                aboutHTML += "<textarea class='profileDataEntryField' id='myAboutEditBox' style='width:90%;font-size:22px;height:80%;' >";
                aboutHTML += about;
                aboutHTML += "</textarea>";
                aboutHTML += "imageCid: "+imageCid + "<br>";

                jQuery("#usernameContainer").html(myUsernameHTML)
                jQuery("#locationContainer").html(locationHTML)
                jQuery("#aboutContainer").html(aboutHTML)

                jQuery(".profileDataEntryField").change(function(){
                    console.log("profileDataEntryField change")
                    jQuery("#toggleEditProfileButton").html("discard changes");
                })
            } else {
            }
        } catch (e) {
            console.log("error: "+e)
        }
    }
    jQuery(".profileDataEntryField").change(function(){
        console.log("profileDataEntryField change")
        jQuery("#toggleEditProfileButton").html("discard changes");
    })
}

export const addDataToIPFS = async (metadata) => {
    const ipfsHash = await MiscIpfsFunctions.ipfs.add(metadata);
    return ipfsHash.cid.toString();
};

const UploadProfileImage = ({ onImageUploaded }) => {
    const [image, setImage] = useState();

    const convertToBuffer = async (reader) => {
        //file is converted to a buffer for upload to IPFS
        //set this buffer -using es6 syntax
        const buffer = await Buffer.from(reader.result);
        return buffer;
    };

    const onDrop = useCallback(
        (acceptedFiles) => {
            const uploadedImage = acceptedFiles[0];
            if (!uploadedImage) return;

            uploadedImage["preview"] = URL.createObjectURL(uploadedImage);
            setImage(uploadedImage);

            let reader = new window.FileReader();
            reader.readAsArrayBuffer(uploadedImage);
            reader.onloadend = async () => {
                const bufferImage = await convertToBuffer(reader);
                const ipfsHash = await addDataToIPFS(bufferImage);
                // console.log("ipfsHash", ipfsHash);
                jQuery("#newImageIpfsHashContainer").html(ipfsHash)
                MiscIpfsFunctions.fetchImgFromIPFS(ipfsHash)
                jQuery("#avatarBox").css("display","inline-block");
            };
        },
        [onImageUploaded]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: "image/jpeg, image/png",
    });

    const thumbs = image && (
        <img className="square-cirle" src={image.preview} alt={image.name} style={{width:"100px"}} />
    );

    return (
        <div {...getRootProps()} className="mb-3" style={{width:"100%",height:"100%"}} >
            <input {...getInputProps()} />
                {isDragActive ? (
                <div style={{width:"100%",height:"100%"}} >
                    <Button block color="warning" type="button" style={{width:"100%",height:"100%"}} >
                        Drop
                    </Button>
                </div>
            ) : (
                <div style={{width:"100%",height:"100%"}} >
                    <Button block color="default" type="button" style={{width:"100%",height:"100%"}} >
                        Drag and drop profile pic
                    </Button>
                </div>
            )}
        </div>
    );
};

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
                // jQuery("#avatarBox").css("display","none");
                // jQuery("#uploadProfileImageButtonContainer").css("display","inline-block");
                populateFieldsWithEditing();
                jQuery("#saveProfileChangesButton").css("display","inline-block")
                jQuery("#toggleEditProfileButton").html("done editing")
            }
            if (editStatus=="on") {
                jQuery(this).data("editstatus","off")
                // jQuery("#avatarBox").css("display","inline-block");
                // MiscIpfsFunctions.fetchImgFromIPFS(cid2);
                // jQuery("#uploadProfileImageButtonContainer").css("display","none");
                populateFieldsWithoutEditing();
                jQuery("#saveProfileChangesButton").css("display","none")
                jQuery("#toggleEditProfileButton").html("edit profile")
            }
        })
        jQuery("#toggleEditProfilePicButton").click(function(){
            var editStatus = jQuery(this).data("editstatus")
            if (editStatus=="off") {
                jQuery(this).data("editstatus","on")
                jQuery("#avatarBox").css("display","none");
                jQuery("#uploadProfileImageButtonContainer").css("display","inline-block");
                // populateFieldsWithEditing();
                jQuery("#saveProfilePicChangesButton").css("display","inline-block")
                jQuery("#toggleEditProfilePicButton").html("keep old pic")
            }
            if (editStatus=="on") {
                jQuery(this).data("editstatus","off")
                jQuery("#avatarBox").css("display","inline-block");
                // MiscIpfsFunctions.fetchImgFromIPFS(cid2);
                jQuery("#uploadProfileImageButtonContainer").css("display","none");
                populateFieldsWithoutEditing();
                jQuery("#saveProfilePicChangesButton").css("display","none")
                jQuery("#toggleEditProfilePicButton").html("update profile pic")
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
                        // oMyUserData.imageCid = null;
                        var sMyUserData = JSON.stringify(oMyUserData,null,4);
                        console.log("sMyUserData B: "+sMyUserData)
                        var options_write = {
                            create:true,
                            truncate:true,
                            parents:true
                        }
                        await MiscIpfsFunctions.ipfs.files.write(ipfsPath,sMyUserData,options_write)
                        jQuery("#toggleEditProfileButton").html("done editing");
                        await MiscFunctions.timeout(100)
                        // Next: need to fetch the updated cid (thisPeerData_cid) and publish it to the public peerID
                        var stats = await MiscIpfsFunctions.ipfs.files.stat('/');
                        var stats_str = JSON.stringify(stats);
                        var thisPeerData_cid = stats.cid.string;
                        console.log("thisPeerData_cid: " + thisPeerData_cid)
                        var options_publish = { key: 'self' }
                        var res = await MiscIpfsFunctions.ipfs.name.publish(thisPeerData_cid, options_publish)

                    } else {
                    }
                } catch (e) {
                    console.log("error: "+e)
                }
            }
        })
        jQuery("#saveProfilePicChangesButton").click(async function(){
            var newPicIpfsHash = jQuery("#newImageIpfsHashContainer").html()
            var ipfsPath = "/grapevineData/userProfileData/myProfile.txt";
            for await (const chunk of MiscIpfsFunctions.ipfs.files.read(ipfsPath)) {
                var myUserData = new TextDecoder("utf-8").decode(chunk);
                try {
                    var oMyUserData = JSON.parse(myUserData);
                    if (typeof oMyUserData == "object") {
                        var sMyUserData = JSON.stringify(oMyUserData,null,4);
                        console.log("sMyUserData A: "+sMyUserData)
                        oMyUserData.lastUpdated = Date.now();
                        oMyUserData.imageCid = newPicIpfsHash;
                        var sMyUserData = JSON.stringify(oMyUserData,null,4);
                        console.log("sMyUserData B: "+sMyUserData)
                        await MiscIpfsFunctions.ipfs.files.write(ipfsPath,sMyUserData)
                        jQuery("#toggleEditProfilePicButton").html("done choosing new pic");
                        await MiscFunctions.timeout(100)
                        // Next: need to fetch the updated cid (thisPeerData_cid) and publish it to the public peerID
                        var stats = await MiscIpfsFunctions.ipfs.files.stat('/');
                        var stats_str = JSON.stringify(stats);
                        var thisPeerData_cid = stats.cid.string;
                        console.log("thisPeerData_cid: " + thisPeerData_cid)
                        var options_publish = { key: 'self' }
                        var res = await MiscIpfsFunctions.ipfs.name.publish(thisPeerData_cid, options_publish)
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
                                <div id="avatarContainer" style={{display:"inline-block",border:"1px dashed grey",width:"400px",height:"400px"}}>
                                    <div id="uploadProfileImageButtonContainer" style={{display:"none",width:"100%",height:"100%"}} >
                                        <UploadProfileImage />
                                    </div>
                                    <img id="avatarBox" />

                                </div>

                                <div style={{display:"inline-block",border:"1px dashed grey",width:"800px",height:"400px",position:"relative"}}>
                                    <div id="usernameContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"70px",padding:"10px",fontSize:"28px",textAlign:"left",overflow:"scroll"}}>
                                    </div>

                                    <div id="locationContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"70px",padding:"10px",fontSize:"18px",textAlign:"left",overflow:"scroll",color:"grey"}}>
                                    </div>

                                    <div id="aboutContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"150px",padding:"10px",fontSize:"18px",textAlign:"left",overflow:"scroll"}}>
                                    </div>

                                    <div data-editstatus="off" id="toggleEditProfileButton" className="doSomethingButton">edit profile</div>
                                    <div id="saveProfileChangesButton" className="doSomethingButton" style={{display:"none"}} >save changes</div>
                                    <br/>
                                    <div data-editstatus="off" id="toggleEditProfilePicButton" className="doSomethingButton">update profile pic</div>
                                    <div id="saveProfilePicChangesButton" className="doSomethingButton" style={{display:"none"}} >save new pic</div>
                                    <div>
                                    <div style={{display:"none"}} id="newImageIpfsHashContainer">newImageIpfsHashContainer</div>
                                    </div>
                                    <div style={{display:"inline-block",fontSize:"14px",marginLeft:"10px",position:"absolute",bottom:"5px"}}>
                                        <div style={{display:"inline-block",fontSize:"14px"}}>my ipfs cid: </div>
                                        <div id="myIpfsPeerID" style={{display:"inline-block",fontSize:"14px",marginLeft:"10px",color:"grey"}}></div>
                                    </div>
                                </div>
                            </div>

                            <div style={{border:"1px dashed grey",width:"1210px",height:"400px",textAlign:"left"}}>
                                <div style={{border:"1px dashed grey",width:"1210px",height:"50px",textAlign:"left"}}>
                                    <div style={{display:"inline-block",border:"1px dashed grey",width:"300px",height:"50px",textAlign:"left"}}>
                                        <center>About</center>
                                    </div>
                                    <div style={{display:"inline-block",border:"1px dashed grey",width:"300px",height:"50px",textAlign:"left"}}>
                                        <center>Posts</center>
                                    </div>
                                    <div style={{display:"inline-block",border:"1px dashed grey",width:"75px",height:"50px",textAlign:"left"}}>
                                        <center>Grapevine</center>
                                    </div>
                                    <div style={{display:"inline-block",border:"1px dashed grey",width:"300px",height:"50px",textAlign:"left"}}>
                                        <center>Scores</center>
                                    </div>
                                </div>
                                <div style={{border:"1px dashed grey",width:"1210px",height:"350px",textAlign:"left",overflow:"scroll"}}>
                                    <center>Content</center>
                                </div>
                            </div>

                        </center>

                    </div>
                </fieldset>
            </>
        );
    }
}
