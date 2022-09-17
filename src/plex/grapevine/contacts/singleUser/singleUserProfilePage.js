import React, { useCallback, useState } from 'react';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../lib/ipfs/miscIpfsFunctions.js'
import { Button } from "reactstrap";
import { useDropzone } from "react-dropzone";
import Masthead from '../../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/grapevine_leftNav1';
import { create, urlSource } from 'ipfs'

const jQuery = require("jquery");

const populateFields = async (cid) => {
    console.log("populateFields")
    var ipfsPath = "/ipns/"+cid+"/grapevineData/userProfileData/myProfile.txt";

    for await (const chunk of MiscIpfsFunctions.ipfs.cat(ipfsPath)) {
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

                // var cid1 = '/ipfs/QmNma7eG55pEEbnoepvCGXZTt8LJDshY6zZerGj8ZY21iS' // sample_rorshach.png in private IPFS network, also on iMac desktop
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

export const addDataToIPFS = async (metadata) => {
    const ipfsHash = await MiscIpfsFunctions.ipfs.add(metadata);
    return ipfsHash.cid.toString();
};

export default class SingleUserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        var cid = this.props.match.params.cid
        console.log("cid: "+cid)
        jQuery(".mainPanel").css("width","calc(100% - 100px)");
        populateFields(cid);
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
                                    <img id="avatarBox" />
                                </div>

                                <div style={{display:"inline-block",border:"1px dashed grey",width:"800px",height:"400px",position:"relative"}}>
                                    <div id="usernameContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"70px",padding:"10px",fontSize:"28px",textAlign:"left",overflow:"scroll"}}>
                                    </div>

                                    <div id="locationContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"70px",padding:"10px",fontSize:"18px",textAlign:"left",overflow:"scroll",color:"grey"}}>
                                    </div>

                                    <div id="aboutContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"150px",padding:"10px",fontSize:"18px",textAlign:"left",overflow:"scroll"}}>
                                    </div>

                                    <div style={{display:"inline-block",fontSize:"14px",marginLeft:"10px",position:"absolute",bottom:"5px",left:"5px"}}>
                                        <div style={{display:"inline-block",fontSize:"14px"}}>ipfs cid: </div>
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
