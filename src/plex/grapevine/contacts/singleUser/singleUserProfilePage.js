import React, { useCallback, useState } from 'react';
import { NavLink, Link } from "react-router-dom";
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from '../../../lib/ipfs/conceptGraphInMfsFunctions.js'
import { Button } from "reactstrap";
import { useDropzone } from "react-dropzone";
import Masthead from '../../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/grapevine_leftNav1';
import { create, urlSource } from 'ipfs'

const jQuery = require("jquery");

const populateFields = async (cid) => {
    console.log("populateFields")
    jQuery("#myIpfsPeerID").html(cid)
    var ipfsPath = "/ipns/"+cid+"/grapevineData/userProfileData/myProfile.txt";

    try {
        for await (const chunk of MiscIpfsFunctions.ipfs.cat(ipfsPath)) {
            var userData = new TextDecoder("utf-8").decode(chunk);
            console.log("populateFieldsWithoutEditing; userData: "+userData)
            console.log("populateFieldsWithoutEditing; try; userData: "+userData)
            var oUserData = JSON.parse(userData);

            if (typeof oUserData == "object") {
                var sUserData = JSON.stringify(oUserData,null,4);
                console.log("populateFieldsWithoutEditing; --- sUserData: "+sUserData)
                var username = oUserData.username;
                var peerID = oUserData.peerID;
                var loc = oUserData.loc;
                var about = oUserData.about;
                var lastUpdated = oUserData.lastUpdated;
                var imageCid = oUserData.imageCid;
                console.log("imageCid: "+imageCid)

                jQuery("#usernameContainer").html(username)
                jQuery("#locationContainer").html(loc)
                jQuery("#aboutContainer").html(about)
                jQuery("#imageCidContainer").html(imageCid)

                // var cid1 = '/ipfs/QmNma7eG55pEEbnoepvCGXZTt8LJDshY6zZerGj8ZY21iS' // sample_rorshach.png in private IPFS network, also on iMac desktop
                // var cid2 = '/ipfs/QmWQmayHks3Gf5oV3RRVbEV37gm9j3aCxYcgx4SZfdHiRY' // darth vader
                // var cid2 = null;
                MiscIpfsFunctions.fetchImgFromIPFS(imageCid);

            } else {
                var stockAvatarCid = MiscIpfsFunctions.addDefaultImage(cid)
                MiscIpfsFunctions.fetchImgFromIPFS(stockAvatarCid);
            }
        }
    } catch (e) {
        console.log("error: "+e)
        console.log("populateFields: user profile not found")
        var stockAvatarCid = MiscIpfsFunctions.addDefaultImage(cid)
        console.log("populateFields: stockAvatarCid: "+stockAvatarCid)
        MiscIpfsFunctions.fetchImgFromIPFS(stockAvatarCid);

        var oUserProfile = await MiscIpfsFunctions.returnUserProfileFromMFS(cid);
        var username = oUserProfile.username;
        var peerID = oUserProfile.peerID;
        var loc = oUserProfile.loc;
        var about = oUserProfile.about;
        var lastUpdated = oUserProfile.lastUpdated;
        var imageCid = oUserProfile.imageCid;
        jQuery("#imageCidContainer").html(imageCid)
        jQuery("#usernameContainer").html(username)
        jQuery("#locationContainer").html(loc)
        jQuery("#aboutContainer").html(about)

        if (imageCid) {
            var img = document.getElementById("avatarBox") // the img tag you want it in
            img.src = "http://localhost:8080/ipfs/"+imageCid;
        }

        var a2Users = await MiscIpfsFunctions.fetchUsersListViaSwarmAddrs()
        console.log("a2Users: "+JSON.stringify(a2Users,null,4))
        if (!a2Users.includes(cid)) {
            console.log("a2Users does not include "+cid)
            // var blob = await MiscIpfsFunctions.fetchImgFromIPFS_b(imageCid)
            // var img = document.getElementById("avatarBox") // the img tag you want it in
            // img.src = window.URL.createObjectURL(blob)
            img.src = "http://localhost:8080/ipfs/"+imageCid;
        }
    }
}

export default class SingleUserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");

        var cid = this.props.match.params.cid
        var defaultAvatarNumber = parseInt(cid,10);
        console.log("cid: "+cid+"; defaultAvatarNumber: "+defaultAvatarNumber)
        populateFields(cid);
        // await makeInfluenceTypeSelector();

        jQuery("#saveUserToMutableFileSystemConceptGraphButton").click(async function(){
            var oNewWord = MiscFunctions.cloneObj(window.lookupWordTypeTemplate["user"]);
            var username = jQuery("#usernameContainer").html()
            var currentTime = Date.now();
            var user_wordSlug = "user_"+username.replaceAll(" ","-")+"_"+cid.slice(cid.length-6);
            var user_wordName = "plex user: "+username;
            var user_wordTitle = "Plex User: "+username;
            var keyname = "plexWord_user_"+cid;

            var newWord_ipns = await MiscIpfsFunctions.fetchIpnsFromKeynameIfExists(keyname)

            if (!newWord_ipns) {
                var generatedKey_obj = await MiscIpfsFunctions.ipfs.key.gen(keyname, {
                    type: 'rsa',
                    size: 2048
                })
                var newWord_ipns = generatedKey_obj["id"];
                var generatedKey_name = generatedKey_obj["name"];
                console.log("generatedKey_obj id: "+newWord_ipns+"; name: "+generatedKey_name);
            }

            oNewWord.userData.peerID = cid;
            oNewWord.userData.username = username;
            oNewWord.userData.ipns = newWord_ipns;
            oNewWord.userData.loc = jQuery("#locationContainer").html();
            oNewWord.userData.about = jQuery("#aboutContainer").html();
            oNewWord.userData.imageCid = jQuery("#imageCidContainer").html();;
            oNewWord.wordData.slug = user_wordSlug;
            oNewWord.wordData.name = user_wordName;
            oNewWord.wordData.title = user_wordTitle;
            oNewWord.metaData.ipns = newWord_ipns;
            oNewWord.metaData.keyname = keyname;
            oNewWord.metaData.lastUpdate = currentTime;

            await ConceptGraphInMfsFunctions.publishWordToIpfs(oNewWord)

            console.log("saveUserToMutableFileSystemConceptGraphButton clicked; oNewWord: "+JSON.stringify(oNewWord,null,4));
            var conceptUniqueIdentifier = "conceptFor_user";
            var subsetUniqueIdentifier = null; // adding to subsets not yet implemented in addSpecificInstanceToConceptGraphMfs; currently adds only to superset
            await ConceptGraphInMfsFunctions.addSpecificInstanceToConceptGraphMfs(conceptUniqueIdentifier,subsetUniqueIdentifier,oNewWord)
        })
    }
    render() {
        // var path = "/SingleUserLeaveRating/QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ"+cid;
        var path1 = "/SingleUserLeaveRating1/"+this.props.match.params.cid;
        var path2 = "/SingleUserLeaveRating2/"+this.props.match.params.cid;
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <center>
                            <div style={{border:"1px dashed grey",width:"1210px",textAlign:"left"}}>
                                <div style={{display:"inline-block",border:"1px dashed grey",width:"400px",height:"440px",position:"relative"}}>
                                    <div id="avatarContainer" style={{display:"inline-block",border:"1px dashed grey",width:"400px",height:"400px"}}>
                                        <img id="avatarBox" className="mainProfilePageAvatarBox" />
                                    </div>
                                    <div style={{display:"inline-block",fontSize:"9px",marginLeft:"5px",position:"absolute",bottom:"5px",left:"5px"}}>
                                        <div>
                                            <div style={{display:"inline-block",fontSize:"9px"}}>peerID (cid): </div>
                                            <div id="myIpfsPeerID" style={{display:"inline-block",fontSize:"9px",marginLeft:"5px",color:"grey"}}></div>
                                        </div>

                                        <div>
                                            <div style={{display:"inline-block",fontSize:"9px"}}>image cid: </div>
                                            <div id="imageCidContainer" style={{display:"inline-block",fontSize:"9px",marginLeft:"5px",color:"grey"}}></div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{display:"inline-block",border:"1px dashed grey",width:"800px",height:"440px",position:"relative"}}>
                                    <div id="usernameContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"70px",padding:"10px",fontSize:"28px",textAlign:"left",overflow:"scroll"}}>
                                    </div>

                                    <div id="locationContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"70px",padding:"10px",fontSize:"18px",textAlign:"left",overflow:"scroll",color:"grey"}}>
                                    </div>

                                    <div id="aboutContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"150px",padding:"10px",fontSize:"18px",textAlign:"left",overflow:"scroll"}}>
                                    </div>

                                    <div>
                                        <NavLink className="rateSomeoneButton" activeClassName="active" to={path2} >Trust Rating of this user (custom form)</NavLink>
                                        <NavLink className="rateSomeoneButton" activeClassName="active" to={path1} style={{float:"right"} }>Rate this user (JSON Schema Form) (?deprecating)</NavLink>
                                        <div style={{clear:"both"}} ></div>
                                    </div>
                                    <div id="saveUserToMutableFileSystemConceptGraphButton" className="doSomethingButton">save/update user file to Concept Graph on MFS</div>



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

                                </div>
                            </div>

                        </center>

                    </div>
                </fieldset>
            </>
        );
    }
}
