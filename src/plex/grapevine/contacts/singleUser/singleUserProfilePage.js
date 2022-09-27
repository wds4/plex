import React, { useCallback, useState } from 'react';
import { NavLink, Link } from "react-router-dom";
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

export const addDataToIPFS = async (metadata) => {
    const ipfsHash = await MiscIpfsFunctions.ipfs.add(metadata);
    return ipfsHash.cid.toString();
};

const fetchInfluenceTypes = async (pCG0) => {

    var aResult = [];

    var pathToInfluenceTypes = pCG0 + "concepts/influenceType/superset/allSpecificInstances/slug/"
    // console.log("fetchInfluenceTypes; pathToInfluenceTypes: "+pathToInfluenceTypes)
    for await (const file of MiscIpfsFunctions.ipfs.files.ls(pathToInfluenceTypes)) {
        var fileName = file.name;
        var fileType = file.type;
        // console.log("fetchInfluenceTypes; file name: "+file.name)
        // console.log("fetchInfluenceTypes; file type: "+file.type)
        if (fileType=="directory") {
            var pathToSpecificInstance = pathToInfluenceTypes + fileName + "/node.txt";
            for await (const siFile of MiscIpfsFunctions.ipfs.files.read(pathToSpecificInstance)) {
                var sNextSpecificInstanceRawFile = new TextDecoder("utf-8").decode(siFile);
                var oNextSpecificInstanceRawFile = JSON.parse(sNextSpecificInstanceRawFile);
                var nextInfluenceType_name = oNextSpecificInstanceRawFile.influenceTypeData.name;
                // console.log("fetchInfluenceTypes; nextInfluenceType_name: "+nextInfluenceType_name)
                aResult.push(oNextSpecificInstanceRawFile)
            }
        }
    }
    return aResult;
}

const makeInfluenceTypeSelector = async () => {
    var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug
    var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
    var mainSchema_ipns = oMainSchema.metaData.ipns;
    var pCG = "/plex/conceptGraphs/";
    var pCG0 = pCG + mainSchema_ipns + "/";

    var aInfluenceTypes = await fetchInfluenceTypes(pCG0);
    // console.log("aInfluenceTypes: "+JSON.stringify(aInfluenceTypes,null,4))

    var selectorHTML = "";
    selectorHTML += "<select id='influenceTypeSelector' >";
    for (var z=0;z<aInfluenceTypes.length;z++) {
        var oNextInfluenceType = aInfluenceTypes[z];
        var nextInfluenceType_name = oNextInfluenceType.influenceTypeData.name;
        var nextInfluenceType_title = oNextInfluenceType.influenceTypeData.title;
        var nextInfluenceType_slug = oNextInfluenceType.influenceTypeData.slug;
        // console.log("oNextInfluenceType: "+JSON.stringify(oNextInfluenceType,null,4))
        var nextInfluenceType_associatedContextGraph_slug = oNextInfluenceType.influenceTypeData.contextGraph.slug;
        selectorHTML += "<option ";
        selectorHTML += " data-contextgraphslug='"+nextInfluenceType_associatedContextGraph_slug+"' ";
        selectorHTML += " value='"+nextInfluenceType_associatedContextGraph_slug+"' ";
        selectorHTML += " >";
        selectorHTML += nextInfluenceType_name;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";
    jQuery("#influenceTypeSelectorContainer").html(selectorHTML)
    document.getElementById("influenceTypeSelector").value = "contextGraph_attention_8xr5k8";
    //
    makeContextSelector()
    document.getElementById("contextSelector").value = "everything";
    jQuery("#influenceTypeSelector").change(function(){
        makeContextSelector()
    })
    // var foo = await MiscFunctions.timeout(500);
    // document.getElementById("influenceTypeSelector").value = "influenceType_attention_8teh9x";

    // jQuery("#influenceTypeSelector").get[0].change()
}

// set selector defaults:
// influenceType_attention_8teh9x, contextGraph_attention_8xr5k8
// contextStructuredData_context_everything_sei24k
// document.getElementById("influenceTypeSelector").value = "influenceType_attention_8teh9x";
// document.getElementById("contextSelector").value = "contextStructuredData_context_everything_sei24k";

const makeContextSelector = () => {
    var selectorHTML = "";
    selectorHTML += "<select id='contextSelector' >";

    var contextGraph_slug = jQuery("#influenceTypeSelector option:selected").data("contextgraphslug")
    var oContextGraph = window.lookupWordBySlug[contextGraph_slug]
    var aContexts = oContextGraph.schemaData.nodes;
    for (var z=0;z<aContexts.length;z++) {
        var oNC = aContexts[z];
        var nextContext_slug = oNC.slug;
        var oNextContext = window.lookupWordBySlug[nextContext_slug]
        var nextContext_contextName = oNextContext.contextStructuredData_contextData.name;
        var nextContext_contextSlug = oNextContext.contextStructuredData_contextData.slug;
        selectorHTML += "<option ";
        selectorHTML += " data-contextwordslug='"+nextContext_slug+"' ";
        selectorHTML += " data-contextslug='"+nextContext_contextSlug+"' ";
        selectorHTML += " value='"+nextContext_contextSlug+"' ";
        selectorHTML += " >";
        selectorHTML += nextContext_contextName;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";
    jQuery("#contextSelectorContainer").html(selectorHTML)

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
        await makeInfluenceTypeSelector();
        jQuery("#leaveRatingButton").click(function(){
            console.log("leaveRatingButton clicked")
        })

    }
    render() {
        // var path = "/SingleUserLeaveRating/QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ"+cid;
        var path = "/SingleUserLeaveRating/"+this.props.match.params.cid;
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <center>
                            <div style={{border:"1px dashed grey",width:"1210px",textAlign:"left"}}>
                                <div id="avatarContainer" style={{display:"inline-block",border:"1px dashed grey",width:"400px",height:"400px"}}>
                                    <img id="avatarBox" className="mainProfilePageAvatarBox" />
                                </div>

                                <div style={{display:"inline-block",border:"1px dashed grey",width:"800px",height:"400px",position:"relative"}}>
                                    <div id="usernameContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"70px",padding:"10px",fontSize:"28px",textAlign:"left",overflow:"scroll"}}>
                                    </div>

                                    <div id="locationContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"70px",padding:"10px",fontSize:"18px",textAlign:"left",overflow:"scroll",color:"grey"}}>
                                    </div>

                                    <div id="aboutContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100%",height:"150px",padding:"10px",fontSize:"18px",textAlign:"left",overflow:"scroll"}}>
                                    </div>

                                    <NavLink className="rateSomeoneButton" activeClassName="active" to={path} >Rate this user</NavLink>

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
                                    <div id="leaveRatingButton" className="doSomethingButton" >FOLLOW</div>
                                    <div id="toggleRatingsOptionsButton" className="doSomethingButton_small" >more options</div>
                                    <div style={{border:"1px dashed grey",display:"inline-block",width:"300px",height:"100px"}}>
                                        <center>select trust / influence type</center>
                                        <div id="influenceTypeSelectorContainer" ></div>
                                    </div>
                                    <div style={{border:"1px dashed grey",display:"inline-block",width:"300px",height:"100px"}}>
                                        <center>select context</center>
                                        <div id="contextSelectorContainer" ></div>
                                    </div>
                                </div>
                            </div>

                        </center>

                    </div>
                </fieldset>
            </>
        );
    }
}
