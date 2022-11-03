import React, { useCallback, useState } from 'react';
import { NavLink, Link } from "react-router-dom";
import ReactDOM from 'react-dom';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from '../../../lib/ipfs/conceptGraphInMfsFunctions.js'
// import * as ConceptGraphInMfsFunctions2 from '../../../lib/ipfs/conceptGraphInMfsFunctions2.js'
import { Button } from "reactstrap";
import { useDropzone } from "react-dropzone";
import Masthead from '../../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/grapevine_leftNav1';
import { create, urlSource } from 'ipfs'
import ContextSelectors from './contextSelectors.js'
// import Nouislider from "nouislider-react";
import noUiSlider from "nouislider";
// import "nouislider/distribute/nouislider.css";
import oBlankRatingTemplate from '../../ratings/json/prefilledRatings/trustRatingTemplate.json';

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

        var oUserProfile = await MiscIpfsFunctions.returnUserProfileFromMFS(cid);
        var username = oUserProfile.username;
        var peerID = oUserProfile.peerID;
        var loc = oUserProfile.loc;
        var about = oUserProfile.about;
        var lastUpdated = oUserProfile.lastUpdated;
        var imageCid = oUserProfile.imageCid;
        // jQuery("#imageCidContainer").html(imageCid)
        jQuery("#usernameContainer").html(username)
        // jQuery("#locationContainer").html(loc)
        // jQuery("#aboutContainer").html(about)

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

const makeKeynameAndIpnsForNewRating = async () => {
    var newWordType = "grapevineTrustRating";
    var randomNonce = Math.floor(Math.random() * 1000);
    var currentTime = Date.now();
    var newKeyname = "plexWord_"+newWordType+"_"+currentTime+"_"+randomNonce;
    var oGeneratedKey = await MiscIpfsFunctions.ipfs.key.gen(newKeyname, {
        type: 'rsa',
        size: 2048
    })

    // var newWord_ipns = oGeneratedKey["id"];
    // var generatedKey_name = oGeneratedKey["name"];
    // console.log("generatedKey_obj id: "+newWord_ipns+"; name: "+generatedKey_name);
    // newWord_obj.metaData.ipns = newWord_ipns;
    // newWord_obj.metaData.keyname = newKeyname;

    return oGeneratedKey;
}

const populateRatingRawFile = async (cid) => {
    var currentTime = Date.now();
    var rateePeerIdLast6 = cid.slice(cid.length-6);
    var raterPeerIdLast6 = "unknown";
    var rateeUsername = jQuery("#usernameContainer").html();

    console.log("populateRatingRawFile; cid: "+cid)
    var oRating = MiscFunctions.cloneObj(oBlankRatingTemplate)
    oRating.ratingData.rateeData.userData.username = rateeUsername
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
                raterPeerIdLast6 = peerID.slice(peerID.length-6);
                oRating.ratingData.raterData.userData.username = oMyUserData.username;
                oRating.ratingData.ratingFieldsetData.trustFieldsetData.referenceData.userData.name = oMyUserData.username;
            }
        } catch (e) {}
    }

    var topic_wordSlug = jQuery("#contextSelector option:selected").data("contextwordslug")
    var topic_name = jQuery("#contextSelector option:selected").data("contextname")
    var topic_ipns = jQuery("#contextSelector option:selected").data("contextipns")
    var topic_title = jQuery("#contextSelector option:selected").data("contexttitle")
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

    var mrSlider = document.getElementById('mainRatingSlider');
    var mainRatingValue = mrSlider.noUiSlider.get();
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.trustRating = mainRatingValue

    var rrSlider = document.getElementById('referenceRatingSlider');
    var referenceRatingValue = rrSlider.noUiSlider.get();
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.referenceTrustRating = referenceRatingValue

    var cSlider = document.getElementById('confidenceSlider');
    var confidenceValue = cSlider.noUiSlider.get();
    oRating.ratingData.ratingFieldsetData.confidenceFieldsetData.confidence = confidenceValue

    var comments = jQuery("#commentsRawFile").val();
    oRating.ratingData.ratingFieldsetData.commentsFieldsetData.comments = comments

    var transitivity = jQuery("#transitivityCheckbox").prop("checked")
    oRating.ratingData.ratingFieldsetData.trustFieldsetData.contextData.transitivity = transitivity

    oRating.metaData.keyname = jQuery("#newRatingKeyname").html()
    oRating.metaData.ipns = jQuery("#newRatingIPNS").html()
    oRating.metaData.lastUpdate = currentTime;

    var rTT = oRating.ratingData.ratingTemplateData.ratingTemplateTitle;

    // Question: if a user decides to change a rating,
    // whether to overwrite the old rating file or create a new one and "invalidate" the old one?
    // For now: overwrite, using the same slug name and ipns, so files don't get out of hand if user makes frequent updates
    // Solution: Make a unique identifier which is a hash that takes inputs:
    // rateeEntityType (always user, for now)
    // rater peerID (assumes the rater entity type is a user)
    // ratee peerID (assumes the ratee entity type is a user)
    // topic_ipns
    // influenceType_ipns
    // contextGraph_ipns
    // ratingTemplateIPNS (although this would usually be redundant)
    // Make hash using ipfs.key.gen, using the string as the key (this is a hack - would be better to use simple hash function without adding a new key!)
    var ratingTemplateIPNS = oRating.ratingData.ratingTemplateData.ratingTemplateIPNS;
    var stuffToDigest = peerID + cid + topic_ipns + influenceType_ipns + contextGraph_ipns + ratingTemplateIPNS;

    const addResult = await MiscIpfsFunctions.ipfs.add(stuffToDigest)
    var ratingUniqueIdentifier = addResult.path;
    // console.log("stuffToDigest: "+stuffToDigest)
    // console.log("addResult: "+JSON.stringify(addResult,null,4))
    // var truncatedIdentifier = new TextDecoder("utf-8").decode(addResult)
    console.log("ratingUniqueIdentifier: "+ratingUniqueIdentifier)

    var rating_wordSlug = "ratingOf_"+rateePeerIdLast6+"_by_"+raterPeerIdLast6+"_"+ratingUniqueIdentifier.slice(-6);
    var rating_wordName = "rating of "+rateeUsername+" by "+myUsername+" using "+rTT;
    var rating_wordTitle = "Rating of "+rateeUsername+" by "+myUsername+" using "+rTT;
    var rating_wordDescription = "rating of "+rateeUsername+" ("+cid+") by "+myUsername+" ("+peerID+") using "+rTT
    rating_wordDescription += " for purpose of managing: "+influenceType_name+" along the topic of: "+topic_name+". ";
    rating_wordDescription += "Authored at time "+currentTime+".";

    oRating.wordData.slug = rating_wordSlug;
    oRating.wordData.name = rating_wordName;
    oRating.wordData.title = rating_wordTitle;
    oRating.wordData.description = rating_wordDescription;

    oRating.ratingData.slug = rating_wordSlug;
    oRating.ratingData.name = rating_wordName;
    oRating.ratingData.title = rating_wordTitle;
    oRating.ratingData.description = rating_wordDescription;

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

        const callPopulateRatingRawFile = () => {
            populateRatingRawFile(cid)
        }

        const updateConfidence = () => {
            var sliderValue = cSlider.noUiSlider.get();
            console.log("updateConfidence; sliderValue: "+sliderValue)
        }

        var mRSlider = document.getElementById('mainRatingSlider');
        noUiSlider.create(mRSlider, {
            start: 40,
            orientation: 'vertical',
            direction: 'rtl',
            range: {
                'max': 100,
                "min": 0
            },
            pips: { mode: "count", values: 5 },
            clickablePips: true
        });

        var rRSlider = document.getElementById('referenceRatingSlider');
        noUiSlider.create(rRSlider, {
            start: 40,
            orientation: 'vertical',
            direction: 'rtl',
            range: {
                'min': 0,
                'max': 100
            },
            pips: { mode: "count", values: 5 },
            clickablePips: true
        });

        var cSlider = document.getElementById('confidenceSlider');
        noUiSlider.create(cSlider, {
            start: 40,
            orientation: 'vertical',
            direction: 'rtl',
            range: {
                'min': 0,
                'max': 100
            },
            pips: { mode: "count", values: 5 },
            clickablePips: true,
            step:1
        });

        // on update would render changes continuously
        // on change renders changes at the end of a move
        // cSlider.noUiSlider.on("change",updateConfidence)
        cSlider.noUiSlider.on("change",callPopulateRatingRawFile)
        mRSlider.noUiSlider.on("change",callPopulateRatingRawFile)
        rRSlider.noUiSlider.on("change",callPopulateRatingRawFile)
        jQuery("#commentsRawFile").change(function(){
            callPopulateRatingRawFile()
        })
        jQuery("#transitivityCheckbox").change(function(){
            callPopulateRatingRawFile()
        })
        jQuery("#standardFollowButton").click(function(){
            // set confidence to 20%
            cSlider.noUiSlider.set(20);
            // set trust/influence to attention
            jQuery("#influenceTypeSelector option[data-influencetypename='attention']").prop("selected",true).change()
            // set context to everything
            jQuery("#contextSelector option[data-contextname='everything']").prop("selected",true)
            // set rating to 100
            mRSlider.noUiSlider.set(100);
            // set reference rating to 100
            rRSlider.noUiSlider.set(100);
            // set transitivity to true
            jQuery("#transitivityCheckbox").prop("checked",true)

            callPopulateRatingRawFile()
        })
        jQuery("#standardIgnoreButton").click(function(){
            // set confidence to 20%
            cSlider.noUiSlider.set(20);
            // set trust/influence to attention
            jQuery("#influenceTypeSelector option[data-influencetypename='attention']").prop("selected",true).change()
            // set context to everything
            jQuery("#contextSelector option[data-contextname='everything']").prop("selected",true)
            // set rating to 100
            mRSlider.noUiSlider.set(0);
            // set reference rating to 100
            rRSlider.noUiSlider.set(100);
            // set transitivity to true
            jQuery("#transitivityCheckbox").prop("checked",false)

            callPopulateRatingRawFile()
        })
        jQuery("#standardEntrustWithOntologyVCButton").click(function(){
            // set confidence to 20%
            cSlider.noUiSlider.set(20);
            // set trust/influence to attention
            jQuery("#influenceTypeSelector option[data-influencetypename='ontology']").prop("selected",true).change()
            // set context to everything
            jQuery("#contextSelector option[data-contextname='verifiable credential']").prop("selected",true)
            // set rating to 100
            mRSlider.noUiSlider.set(100);
            // set reference rating to 100
            rRSlider.noUiSlider.set(100);
            // set transitivity to true
            jQuery("#transitivityCheckbox").prop("checked",true)

            callPopulateRatingRawFile()
        })
        jQuery("#submitThisRatingButton").click(async function(){
            console.log("submitThisRatingButton clicked")
            var sNewRating = jQuery("#newRatingRawFile").val()
            var oNewRating = JSON.parse(sNewRating)
            var subsetUniqueIdentifier = "setFor_ratings_authoredLocally"; // adding to subsets not yet implemented in addSpecificInstanceToConceptGraphMfs; currently adds only to superset
            var aSetUniqueIdentifiers = []
            aSetUniqueIdentifiers.push(subsetUniqueIdentifier)

            // await ConceptGraphInMfsFunctions.publishWordToIpfs(oNewRating) // this step is now taken care of by addSpecificInstanceToConceptGraphMfs
            await ConceptGraphInMfsFunctions.addSpecificInstanceToConceptGraphMfs2(aSetUniqueIdentifiers,oNewRating)

            // var conceptUniqueIdentifier = "conceptFor_rating";
            // await ConceptGraphInMfsFunctions.addSpecificInstanceToConceptGraphMfs(conceptUniqueIdentifier,subsetUniqueIdentifier,oNewRating)
        })

        var oGeneratedKey = await makeKeynameAndIpnsForNewRating()
        jQuery("#newRatingKeyname").html(oGeneratedKey["name"])
        jQuery("#newRatingIPNS").html(oGeneratedKey["id"])

        callPopulateRatingRawFile()
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
                            <div className="rateSomeoneButton" id="standardFollowButton" >Follow</div>
                            <div className="rateSomeoneButton" id="standardIgnoreButton" >Ignore</div> (similar functionality to legacy social networks)
                            <br/>
                            Contextual:
                            <div className="rateSomeoneButton" id="standardAgreeButton" >Believe statements on topic of: covid</div>
                            <div className="rateSomeoneButton" id="standardAgreeButton" >Trust advice: covid</div>
                            <div className="rateSomeoneButton" id="standardEntrustWithFashionButton" >Trust taste in movies</div>
                            <div className="rateSomeoneButton" id="standardEntrustWithOntologyVCButton" >Entrust to craft Verifiable Credentials</div>
                        </div>

                        <div id="ratingsSelectorsContainer" style={{padding:"10px",paddingTop:"30px",width:"600px",height:"800px",border:"1px dashed grey",display:"inline-block"}}>
                            <div style={{marginBottom:"50px"}}>
                                <div style={{textAlign:"center",width:"150px",display:"inline-block"}}>
                                    <div style={{height:"50px"}}>Rating</div>
                                    <div id="mainRatingSlider" style={{display:"inline-block",height:"400px",backgroundColor:"orange"}} ></div>
                                </div>
                                <div style={{textAlign:"center",width:"150px",display:"inline-block"}}>
                                    <div style={{height:"50px"}}>Reference Rating</div>
                                    <div id="referenceRatingSlider" style={{display:"inline-block",height:"400px",backgroundColor:"orange"}} ></div>
                                </div>
                                <div style={{textAlign:"center",width:"150px",display:"inline-block"}}>
                                    <div style={{height:"50px"}}>Confidence</div>
                                    <div id="confidenceSlider" style={{display:"inline-block",height:"400px",backgroundColor:"orange"}} ></div>
                                </div>
                            </div>

                            <div >
                                <label class="checkboxContainer">Transitivity
                                    <input id="transitivityCheckbox" type="checkbox" />
                                    <span class="checkmark"></span>
                                </label>
                            </div>

                            Comments:<br/>
                            <textarea id="commentsRawFile" style={{width:"95%",height:"150px",display:"inline-block",fontSize:"10px",border:"1px dashed grey"}} >
                            </textarea>
                        </div>

                        <div id="optionsSelectorsContainer" style={{display:"inline-block"}}>
                            <ContextSelectors />
                        </div>

                        <div style={{display:"inline-block",fontSize:"10px"}}>
                            <div>
                                <div className="rateSomeoneButton" id="submitThisRatingButton" >Submit this rating</div>
                                <div style={{display:"inline-block"}}>
                                    <div id="newRatingKeyname">newRatingKeyname</div>
                                    <div id="newRatingIPNS">newRatingIPNS</div>
                                </div>
                            </div>
                            <textarea id="newRatingRawFile" style={{width:"700px",height:"800px",display:"inline-block",border:"1px dashed grey",fontSize:"10px"}} >
                            </textarea>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
