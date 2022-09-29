import React, { useCallback, useState } from 'react';
import { NavLink, Link } from "react-router-dom";
import ReactDOM from 'react-dom';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../lib/ipfs/miscIpfsFunctions.js'
import { Button } from "reactstrap";
import { useDropzone } from "react-dropzone";
import Masthead from '../../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/grapevine_leftNav1';
import { create, urlSource } from 'ipfs'
import ContextSelectors from './contextSelectors.js'

import oFormData from '../../ratings/json/prefilledRatings/trustRatingTemplate.json';

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
                var myUsername = oUserData.username;
                var peerID = oUserData.peerID;
                var loc = oUserData.loc;
                var about = oUserData.about;
                var lastUpdated = oUserData.lastUpdated;
                var imageCid = oUserData.imageCid;
                console.log("imageCid: "+imageCid)

                jQuery("#usernameContainer").html(myUsername)
                // jQuery("#locationContainer").html(loc)
                // jQuery("#aboutContainer").html(about)

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
    }
}

const populateRatingRawFile = async (cid) => {
    var oRating = MiscFunctions.cloneObj(oFormData)
    oRating.ratingData.rateeData.userData.name = jQuery("#usernameContainer").html();
    oRating.ratingData.rateeData.userData.peerID = cid;
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.referenceData.userData.peerID = cid;
    var ipfsPath = "/grapevineData/userProfileData/myProfile.txt";
    var oMyProfile = await MiscIpfsFunctions.ipfs.id();
    // console.log("oMyProfile: "+JSON.stringify(oMyProfile,null,4))
    oRating.ratingData.raterData.userData.peerID = oMyProfile.id;
    for await (const chunk of MiscIpfsFunctions.ipfs.files.read(ipfsPath)) {
        var myUserData = new TextDecoder("utf-8").decode(chunk);
        try {
            // console.log("populateFieldsWithoutEditing; try; myUserData: "+myUserData)
            var oMyUserData = JSON.parse(myUserData);
            if (typeof oMyUserData == "object") {
                var myUsername = oMyUserData.username;
                var peerID = oMyUserData.peerID;
                oRating.ratingData.raterData.userData.name = oMyUserData.username;
                oRating.ratingData.ratingFieldsetData.trustFieldsetData.referenceData.userData.name = oMyUserData.username;
            }
        } catch (e) {}
    }

    var topic_wordSlug = jQuery("#contextSelector option:selected").data("contextwordslug")
    var topic_name = jQuery("#contextSelector option:selected").data("contextname")
    var topic_ipns = jQuery("#contextSelector option:selected").data("contexttitle")
    var topic_title = jQuery("#contextSelector option:selected").data("contextipns")
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.topicData.topicWordSlug = topic_wordSlug
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.topicData.topicName = topic_name
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.topicData.topicIPNS = topic_ipns
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.topicData.topicTitle = topic_title

    var contextGraph_wordSlug = jQuery("#influenceTypeSelector option:selected").data("contextgraphwordslug")
    var contextGraph_name = jQuery("#influenceTypeSelector option:selected").data("contextgraphname")
    var contextGraph_title = jQuery("#influenceTypeSelector option:selected").data("contextgraphtitle")
    var contextGraph_ipns = jQuery("#influenceTypeSelector option:selected").data("contextgraphipns")
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.contextGraphData.contextGraphWordSlug = contextGraph_wordSlug
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.contextGraphData.contextGraphName = contextGraph_name
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.contextGraphData.contextGraphIPNS = contextGraph_ipns
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.contextGraphData.contextGraphWordTitle = contextGraph_title

    var influenceType_wordSlug = jQuery("#influenceTypeSelector option:selected").data("influencetypewordslug")
    var influenceType_name = jQuery("#influenceTypeSelector option:selected").data("influencetypename")
    var influenceType_title = jQuery("#influenceTypeSelector option:selected").data("influencetypetitle")
    var influenceType_ipns = jQuery("#influenceTypeSelector option:selected").data("influencetypeipns")
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.influenceCategoryData.influenceCategoryWordSlug = influenceType_wordSlug
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.influenceCategoryData.influenceCategoryName = influenceType_name
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.influenceCategoryData.influenceCategoryIPNS = influenceType_ipns
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.influenceCategoryData.influenceCategoryTitle = influenceType_title

    jQuery("#newRatingRawFile").val(JSON.stringify(oRating,null,4))
}

export default class SingleUserLeaveRating extends React.Component {
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

        populateRatingRawFile(cid)
        jQuery("#optionsSelectorsContainer").change(function(){
            populateRatingRawFile(cid)
        })

    }
    render() {
        var path = "/SingleUserProfilePage/"+this.props.match.params.cid;
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <center>
                            Leave Rating
                        </center>
                        <div>
                            <div id="avatarContainer" style={{display:"inline-block",width:"100px",height:"100px"}}>
                                <img id="avatarBox" className="rateUserPageAvatarBox" />
                            </div>
                            <div id="usernameContainer" style={{display:"inline-block",height:"70px",padding:"10px",fontSize:"28px",textAlign:"left",overflow:"scroll"}}>
                            </div>
                            <NavLink className="rateSomeoneButton" activeClassName="active" to={path} >Return to profile</NavLink>
                        </div>

                        <div>
                            Presets:
                            <div className="rateSomeoneButton">Follow</div>
                        </div>

                        <div id="optionsSelectorsContainer" style={{display:"inline-block"}}>
                            <ContextSelectors />
                        </div>

                        <textarea id="newRatingRawFile" style={{width:"800px",height:"800px",display:"inline-block",border:"1px dashed grey"}} >
                        </textarea>

                    </div>
                </fieldset>
            </>
        );
    }
}
