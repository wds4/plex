import React, { useCallback, useState } from 'react';
import { NavLink, Link } from "react-router-dom";
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from '../../../lib/ipfs/conceptGraphInMfsFunctions.js'
import * as ConceptGraphLib from '../../../lib/ipfs/conceptGraphLib.js'
import * as GrapevineLib from '../../../lib/ipfs/grapevineLib.js'
import { Button } from "reactstrap";
import { useDropzone } from "react-dropzone";
import Masthead from '../../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/grapevine_leftNav1';
import { create, urlSource } from 'ipfs'
import Scores from './tabs/scores.js';

const cg = ConceptGraphLib.cg;
const gv = GrapevineLib.gv;

const jQuery = require("jquery");

const populateFields = async (cid) => {
    console.log("populateFields")
    jQuery("#thisUserPeerID").html(cid)
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
                await MiscIpfsFunctions.fetchImgFromIPFS(imageCid);

            } else {
                var stockAvatarCid = MiscIpfsFunctions.addDefaultImage(cid)
                await MiscIpfsFunctions.fetchImgFromIPFS(stockAvatarCid);
            }
        }
    } catch (e) {
        console.log("error: "+e)
        console.log("populateFields: user profile not found")
        var stockAvatarCid = MiscIpfsFunctions.addDefaultImage(cid)
        console.log("populateFields: stockAvatarCid: "+stockAvatarCid)
        await MiscIpfsFunctions.fetchImgFromIPFS(stockAvatarCid);

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
        this.state = {
            user: {
                peerID: null,
                username: null
            }
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");

        var cid = this.props.match.params.cid
        var user_new={}
        user_new.peerID = cid;
        user_new.username="not yet set";
        this.setState({user:user_new});
        this.forceUpdate();
        var oCSD = await gv.compositeScore.get(cid)
        console.log("oCSD: "+JSON.stringify(oCSD,null,4))
        var inf = oCSD.standardCalculations.influence;
        jQuery("#influenceContainer").html(inf)

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
        jQuery(".profilePageBarTab").click(function(){
            var contentDescription = jQuery(this).data("contentdescription")
            // console.log("bottomPanelContainer; contentDescription: "+contentDescription)
            jQuery(".bottomPanelContainer").css("display","none")
            jQuery(".profilePageBarTab").css("text-decoration-line","none")
            jQuery(".profilePageBarTab").css("color","grey")

            jQuery("#bottomPanelContainer_"+contentDescription).css("display","block")
            jQuery("#profilePageBarTab_"+contentDescription).css("text-decoration-line","underline")
            jQuery("#profilePageBarTab_"+contentDescription).css("color","black")
        })
        jQuery("#moreRatingPresetsButton").click(function(){
            jQuery(".bottomPanelContainer").css("display","none")
            jQuery(".profilePageBarTab").css("text-decoration-line","none")
            jQuery(".profilePageBarTab").css("color","grey")

            jQuery("#bottomPanelContainer_ratingPresets").css("display","block")
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
                    <div className="mainPanel" style={{border:"1px solid grey"}}>
                        <Masthead />
                        <center>
                            <div style={{border:"1px solid grey",width:"1210px"}}>
                                <div style={{width:"100%",textAlign:"left"}}>
                                    <div style={{display:"inline-block",width:"400px",height:"400px",position:"relative"}}>
                                        <div id="avatarContainer" style={{display:"inline-block",width:"400px",height:"400px"}}>
                                            <img id="avatarBox" className="mainProfilePageAvatarBox" />
                                        </div>
                                    </div>

                                    <div style={{display:"inline-block",width:"800px",height:"400px",position:"relative"}}>
                                        <div id="usernameContainer" style={{display:"inline-block",width:"100%",padding:"10px",fontSize:"28px",textAlign:"left",overflow:"scroll"}}>
                                        </div>

                                        <div id="locationContainer" style={{display:"inline-block",width:"100%",padding:"10px",fontSize:"18px",textAlign:"left",overflow:"scroll",color:"grey"}}>
                                        </div>

                                        <div style={{marginLeft:"10px"}} >
                                            <div>
                                                <div style={{display:"inline-block",fontSize:"9px"}}>peerID (cid): </div>
                                                <div id="thisUserPeerID" style={{display:"inline-block",fontSize:"9px",marginLeft:"5px",color:"grey"}}></div>
                                            </div>
                                            <div style={{display:"none"}}>
                                                <div style={{display:"inline-block",fontSize:"9px"}}>image cid: </div>
                                                <div id="imageCidContainer" style={{display:"inline-block",fontSize:"9px",marginLeft:"5px",color:"grey"}}></div>
                                            </div>
                                        </div>

                                        <div id="aboutContainer" style={{display:"inline-block",backgroundColor:"#DFDFDF",width:"100%",height:"200px",padding:"10px",fontSize:"18px",textAlign:"left",overflow:"scroll"}}>
                                        </div>

                                        <NavLink className="rateSomeoneButton" activeClassName="active" to={path2} >Follow</NavLink>
                                        <div id="moreRatingPresetsButton" >more rating presets</div>

                                    </div>
                                </div>

                                <div style={{width:"1210px",height:"500px",textAlign:"left"}}>
                                    <div style={{width:"1210px",textAlign:"left"}}>
                                        <div className="profilePageBarTab" id="profilePageBarTab_about" data-contentdescription="about" >
                                            <center>About</center>
                                        </div>
                                        <div className="profilePageBarTab" id="profilePageBarTab_posts" data-contentdescription="posts" >
                                            <center>Posts</center>
                                        </div>
                                        <div className="profilePageBarTab" id="profilePageBarTab_grapevine" data-contentdescription="grapevine" >
                                            <center>Grapevine</center>
                                        </div>
                                        <div className="profilePageBarTab" id="profilePageBarTab_ratings" data-contentdescription="ratings" >
                                            <center>Ratings</center>
                                        </div>
                                        <div className="profilePageBarTab" id="profilePageBarTab_scores" data-contentdescription="scores" >
                                            <center>Scores</center>
                                        </div>
                                    </div>
                                    <div style={{width:"1210px",height:"350px",textAlign:"left",overflow:"scroll"}}>
                                        <div data-contentdescription="about" id="bottomPanelContainer_about" className="bottomPanelContainer" >
                                            About
                                            <NavLink className="rateSomeoneButton" activeClassName="active" to={path1} >Rate this user (JSON Schema Form) (?deprecating)</NavLink>
                                            <div id="saveUserToMutableFileSystemConceptGraphButton" className="doSomethingButton">save/update user file to Concept Graph on MFS (deprecating?)</div>
                                        </div>
                                        <div data-contentdescription="posts" id="bottomPanelContainer_posts" className="bottomPanelContainer" >
                                            Posts
                                        </div>
                                        <div data-contentdescription="grapevine" id="bottomPanelContainer_grapevine" className="bottomPanelContainer" >
                                            Grapevine
                                        </div>
                                        <div data-contentdescription="ratings" id="bottomPanelContainer_ratings" className="bottomPanelContainer" >
                                            Ratings
                                        </div>
                                        <div data-contentdescription="scores" id="bottomPanelContainer_scores" className="bottomPanelContainer" >
                                            <Scores user={this.state.user} />
                                        </div>
                                        <div data-contentdescription="ratingPresets" id="bottomPanelContainer_ratingPresets" className="bottomPanelContainer" >
                                            <div >
                                                <div className="ratingPresetsPanel_colA" >
                                                    Attention:
                                                </div>
                                                <div className="ratingPresetsPanel_colB" >
                                                    <NavLink className="rateSomeoneButton" activeClassName="active" to={path2} >Follow</NavLink>
                                                </div>
                                                <div className="ratingPresetsPanel_colC" >
                                                    <NavLink className="rateSomeoneButton" activeClassName="active" to={path2} >Ignore</NavLink>
                                                </div>
                                                <div className="ratingPresetsPanel_colD" >
                                                default
                                                </div>
                                            </div>
                                            <div >
                                                <div className="ratingPresetsPanel_colA" >
                                                    manage ontology:
                                                </div>
                                                <div className="ratingPresetsPanel_colB" >
                                                    <NavLink className="rateSomeoneButton" activeClassName="active" to={path2} >trust</NavLink>
                                                </div>
                                                <div className="ratingPresetsPanel_colC" >
                                                    <NavLink className="rateSomeoneButton" activeClassName="active" to={path2} >don't trust</NavLink>
                                                </div>
                                                <div className="ratingPresetsPanel_colD" >
                                                default
                                                </div>
                                            </div>
                                            <div >
                                                <div className="ratingPresetsPanel_colA" >
                                                    believe:
                                                </div>
                                                <div className="ratingPresetsPanel_colB" >
                                                    <NavLink className="rateSomeoneButton" activeClassName="active" to={path2} >Believe</NavLink>
                                                </div>
                                                <div className="ratingPresetsPanel_colC" >
                                                    <NavLink className="rateSomeoneButton" activeClassName="active" to={path2} >don't believe</NavLink>
                                                </div>
                                                <div className="ratingPresetsPanel_colD" >
                                                default
                                                </div>
                                            </div>
                                        </div>

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
