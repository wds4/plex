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
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";

import oFormData from '../../ratings/json/prefilledRatings/trustRatingTemplate.json';

const jQuery = require("jquery");

const uiSchema = {
    ratingData: {
        slug: {'ui:widget': 'hidden'},
        name: {'ui:widget': 'hidden'},
        title: {'ui:widget': 'hidden'},
        description: {'ui:widget': 'hidden'},
        raterData: {
            raterEntityType: { 'ui:widget': 'hidden' },
            userData: {
                slug: { 'ui:widget': 'hidden' },
                name: { 'ui:widget': 'hidden' },
                ipns: { 'ui:widget': 'hidden' },
                peerID: { 'ui:widget': 'hidden' },
                title: { 'ui:widget': 'hidden' },
                description: { 'ui:widget': 'hidden' }
            }
        },
        rateeData: {
            rateeEntityType: { 'ui:widget': 'hidden' },
            userData: {
                slug: { 'ui:widget': 'hidden' },
                name: { 'ui:widget': 'hidden' },
                ipns: { 'ui:widget': 'hidden' },
                peerID: { 'ui:widget': 'hidden' },
                title: { 'ui:widget': 'hidden' },
                description: { 'ui:widget': 'hidden' }
            }
        },
        ratingTemplateData: {
            ratingTemplateName: { 'ui:widget': 'hidden' },
            ratingTemplateIPNS: { 'ui:widget': 'hidden' },
            ratingTemplateWordSlug: { 'ui:widget': 'hidden' },
            ratingTemplateTitle: { 'ui:widget': 'hidden' }
        },
        ratingFieldsetData: {
            trustFieldsetData: {
                referenceData: {
                    referenceEntityType: { 'ui:widget': 'hidden' },
                    userData: {
                        slug: {'ui:widget': 'hidden' },
                        title: {'ui:widget': 'hidden' },
                        description: {'ui:widget': 'hidden' },
                        name: {'ui:widget': 'hidden' },
                        peerID: {'ui:widget': 'hidden' }
                    }
                }
            },
            commentsFieldsetData: {
                comments: {
                    'ui:widget': 'textarea',
                    'ui:options': {
                        rows: 8
                    }
                }
            }
        }
    }
}

const onFormSubmit = async ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
}

const onFormChange = async ({formData}, e) => {
    var sNewRating = await MiscFunctions.cloneObj(JSON.stringify(formData,null,4));
    jQuery("#newRatingRawFile").val(sNewRating)
}

const renderFormFromNode = (slug,oPrefilledFormData) => {
    var oWord = window.lookupWordBySlug[slug];
    var oSchema = {};
    /*
    var oFormData = {};
    oFormData.ratingData = {};
    oFormData.ratingData.ratingTemplateData = {};
    oFormData.ratingData.ratingTemplateData.ratingTemplateTitle = "Generic User Trust";
    */
    if (oWord.hasOwnProperty("propertyData")) {
        oSchema = oWord.propertyData;
    }
    if (oWord.hasOwnProperty("JSONSchemaData")) {
        oSchema = oWord;
    }

    jQuery("#ratingJsonSchemaRawFile").val(JSON.stringify(oWord,null,4))

    // oSchema = MiscFunctions.cloneObj(jsonSchemaRatingTest)

    ReactDOM.render(
        <Form
            schema={oSchema}
            validator={validator}
            onSubmit={onFormSubmit}
            onChange={onFormChange}
            uiSchema={uiSchema}
            formData={oPrefilledFormData}
            liveOmit

        />,
        document.getElementById("renderedFormElem")
    )
}

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
        await populateFields(cid);

        var oPrefilledFormData = MiscFunctions.cloneObj(oFormData)
        oPrefilledFormData.ratingData.rateeData.userData.name = jQuery("#usernameContainer").html();
        oPrefilledFormData.ratingData.rateeData.userData.peerID = cid;
        oPrefilledFormData.ratingData.ratingFieldsetData.trustFieldsetData.referenceData.userData.peerID = cid;
        var ipfsPath = "/grapevineData/userProfileData/myProfile.txt";
        var oMyProfile = await MiscIpfsFunctions.ipfs.id();
        // console.log("oMyProfile: "+JSON.stringify(oMyProfile,null,4))
        oPrefilledFormData.ratingData.raterData.userData.peerID = oMyProfile.id;
        for await (const chunk of MiscIpfsFunctions.ipfs.files.read(ipfsPath)) {
            var myUserData = new TextDecoder("utf-8").decode(chunk);
            try {
                // console.log("populateFieldsWithoutEditing; try; myUserData: "+myUserData)
                var oMyUserData = JSON.parse(myUserData);
                if (typeof oMyUserData == "object") {
                    var myUsername = oMyUserData.username;
                    var peerID = oMyUserData.peerID;
                    oPrefilledFormData.ratingData.raterData.userData.name = oMyUserData.username;
                    oPrefilledFormData.ratingData.ratingFieldsetData.trustFieldsetData.referenceData.userData.name = oMyUserData.username;
                }
            } catch (e) {}
        }

        var rating_jsonSchema_slug = "JSONSchemaFor_rating";
        renderFormFromNode(rating_jsonSchema_slug,oPrefilledFormData)
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
                            <div id="renderedFormElem" style={{width:"440px",display:"inline-block",textAlign:"left"}} >
                            </div>

                            <textarea id="newRatingRawFile" style={{width:"800px",height:"800px",display:"inline-block",border:"1px dashed grey"}} >
                            </textarea>

                            <textarea id="ratingJsonSchemaRawFile" style={{width:"700px",height:"800px",display:"inline-block",border:"1px dashed grey"}} >
                            </textarea>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
