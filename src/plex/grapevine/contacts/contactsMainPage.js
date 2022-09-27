import React from "react";
import { Link } from "react-router-dom";
import Masthead from '../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/grapevine_leftNav1';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'

const jQuery = require("jquery");

const electronFs = window.require('fs');

const updateMasterUsersList = async (sMasterUsersList) => {
    // var path = '/grapevineData/users/masterUsersList.txt';
    var ipfsPath = "/grapevineData/users/masterUsersList.txt";
    // await MiscIpfsFunctions.ipfs.files.write(ipfsPath,new TextEncoder().encode(sMasterUsersList));
    await MiscIpfsFunctions.ipfs.files.write(ipfsPath,new TextEncoder().encode(sMasterUsersList), {create: true, flush: true});
    await MiscFunctions.timeout(100)
    // Next: need to fetch the updated cid (thisPeerData_cid) and publish it to the public peerID
    var stats = await MiscIpfsFunctions.ipfs.files.stat('/');
    var stats_str = JSON.stringify(stats);
    var thisPeerData_cid = stats.cid.string;
    console.log("thisPeerData_cid: " + thisPeerData_cid)
    var options_publish = { key: 'self' }
    var res = await MiscIpfsFunctions.ipfs.name.publish(thisPeerData_cid, options_publish)
}

const updateUserContactInfo = async (cid,sUserData) => {
    var pathA = '/grapevineData/users/'+cid;
    var pathB = pathA + "/userProfile.txt"
    // await MiscIpfsFunctions.ipfs.files.rm(pathB);
    // console.log("qwerty removing pathA: " + pathA)
    await MiscIpfsFunctions.ipfs.files.mkdir(pathA,{"parents":true});
    await MiscIpfsFunctions.ipfs.files.write(pathB,new TextEncoder().encode(sUserData), {create: true, flush: true});

    await MiscFunctions.timeout(100)
    var stats = await MiscIpfsFunctions.ipfs.files.stat('/');
    var stats_str = JSON.stringify(stats);
    var thisPeerData_cid = stats.cid.string;
    console.log("qwerty publishing thisPeerData_cid: " + thisPeerData_cid + "; sUserData: "+sUserData)
    var options_publish = { key: 'self' }
    var res = await MiscIpfsFunctions.ipfs.name.publish(thisPeerData_cid, options_publish)
}

const addArchivedPeerToUserList = async (myPeerID,cid,grouping) => {
    var userHTML = "";
    userHTML += "<div data-cid='"+cid+"' class='contactPageSingleContactContainer";
    if (grouping=="swarmPeers") { userHTML += " contactPageSingleContactContainer_green"; }
    if (grouping=="previouslySeen") { userHTML += " contactPageSingleContactContainer_grey"; }
    if (myPeerID==cid) { userHTML += " contactPageSingleContactContainer_blue"; }
    userHTML += "' >";
        userHTML += "<div class='contactsPageAvatarContainer' >";
        userHTML += "<img id='contactsPageAvatarThumb_"+cid+"' class='contactsPageAvatarThumb' />";
        userHTML += "</div>";

        userHTML += "<div class='contactsPageUsernameContainer' id='contactsPageUsernameContainer_"+cid+"' >";
        userHTML += cid;
        userHTML += "</div>";
    userHTML += "</div>";

    jQuery("#usersListContainer").append(userHTML);

    var oUserProfile = await MiscIpfsFunctions.returnUserProfileFromMFS(cid);

    var username = oUserProfile.username;
    var peerID = oUserProfile.peerID;
    var loc = oUserProfile.loc;
    var about = oUserProfile.about;
    var lastUpdated = oUserProfile.lastUpdated;
    var imageCid = oUserProfile.imageCid;

    var blob = await MiscIpfsFunctions.fetchImgFromIPFS_b(imageCid)
    var img = document.getElementById("contactsPageAvatarThumb_"+cid) // the img tag you want it in
    // img.src = window.URL.createObjectURL(blob)
    img.src = "http://localhost:8080/ipfs/"+imageCid;

    jQuery("#contactsPageUsernameContainer_"+cid).html(username)
    jQuery("#contactsPageUsernameContainer_"+cid).css("font-size","22px")
}

const addPeerToUserList = async (myPeerID,cid,grouping) => {

    var ipfsPath = "/ipns/"+cid+"/grapevineData/userProfileData/myProfile.txt";
    // var ipfsPathB = "/ipns/"+cid+"/grapevineData/userProfileData";

    var userHTML = "";
    userHTML += "<div data-cid='"+cid+"' class='contactPageSingleContactContainer";
    if (grouping=="swarmPeers") { userHTML += " contactPageSingleContactContainer_green"; }
    if (grouping=="previouslySeen") { userHTML += " contactPageSingleContactContainer_grey"; }
    if (myPeerID==cid) { userHTML += " contactPageSingleContactContainer_blue"; }
    userHTML += "' >";
        userHTML += "<div class='contactsPageAvatarContainer' >";
        userHTML += "<img id='contactsPageAvatarThumb_"+cid+"' class='contactsPageAvatarThumb' />";
        userHTML += "</div>";

        userHTML += "<div class='contactsPageUsernameContainer' id='contactsPageUsernameContainer_"+cid+"' >";
        userHTML += cid;
        userHTML += "</div>";
    userHTML += "</div>";

    jQuery("#usersListContainer").append(userHTML)

    // modify DOM element with image and username (or just cid if username not available)
    try {
        for await (const chunk of MiscIpfsFunctions.ipfs.cat(ipfsPath)) {
            var userData = new TextDecoder("utf-8").decode(chunk);

            var oUserData = JSON.parse(userData);
            if (typeof oUserData == "object") {
                var sUserData = JSON.stringify(oUserData,null,4);
                // console.log("sUserData: "+sUserData)

                var username = oUserData.username;
                var peerID = oUserData.peerID;
                var loc = oUserData.loc;
                var about = oUserData.about;
                var lastUpdated = oUserData.lastUpdated;
                var imageCid = oUserData.imageCid;

                var blob = await MiscIpfsFunctions.fetchImgFromIPFS_b(imageCid)
                var img = document.getElementById("contactsPageAvatarThumb_"+cid) // the img tag you want it in
            	// img.src = window.URL.createObjectURL(blob)
                img.src = "http://localhost:8080/ipfs/"+imageCid;

                /*
                // var pathA = "public/grapevine/assets/users/"+peerID;
                var pathA = "src/assets/grapevine/users/"+peerID;
                var pathB = pathA+"/avatar.png";
                var imageData = await MiscIpfsFunctions.fetchImgFromIPFS_c(imageCid);
                var typeofImageData = typeof imageData;
                var data = "Hello World test file 2. \n Here is line 2."
                console.log("typeof imageData: "+typeofImageData);
                */

                // var fooResult = await MiscIpfsFunctions.makeLocalFolderForContact(pathA)

                /*
                electronFs.writeFile(pathB, imageData, "binary", (err) => {
                    if (err) {
                        console.log("storeAvatarForContact err: "+err);
                        return false;
                    } else {
                        console.log("storeAvatarForContact; file written successfully\n");
                        // console.log("The written has the following contents:");
                        // console.log(electronFs.readFileSync("src/plex/settings/helloWorld/helloWorldTestFile2.txt", "utf8"));
                    }
                });
                */


                // var fooResult = await MiscIpfsFunctions.storeAvatarForContact(pathB,imageData)

                jQuery("#contactsPageUsernameContainer_"+cid).html(username)
                jQuery("#contactsPageUsernameContainer_"+cid).css("font-size","22px")

                // if contact info is discovered from an active node (from the other users' own node), save it to my local mutable files
                await updateUserContactInfo(cid,sUserData)
                return true;

            } else {
                return true;
            }
        }
    } catch (e) {
        console.log("error: "+e)
        console.log("populateFields: user profile not found")
        var stockAvatarCid = MiscIpfsFunctions.addDefaultImage(cid)
        console.log("populateFields: stockAvatarCid: "+stockAvatarCid)
        var blob = await MiscIpfsFunctions.fetchImgFromIPFS_b(stockAvatarCid)
        var img = document.getElementById("contactsPageAvatarThumb_"+cid) // the img tag you want it in
        img.src = window.URL.createObjectURL(blob)
        return true;
    }

}

export default class GrapevineContactsMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contactLinks: []
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");
        var oIpfsID = await MiscIpfsFunctions.ipfs.id();
        var myPeerID = oIpfsID.id;

        var masterUserList = [];
        ////////////////////////////////////////////////////////////////
        /////////////////////// swarm peers ////////////////////////////
        var a1Users = await MiscIpfsFunctions.fetchUsersListViaSwarmPeers()
        console.log("a1Users: "+JSON.stringify(a1Users,null,4))
        var grouping = "swarmPeers";
        for (var u=0;u<a1Users.length;u++) {
            var nextPeerID = a1Users[u];
            masterUserList.push(nextPeerID)
            var foo = await addPeerToUserList(myPeerID,nextPeerID,grouping)
            var oUserData = {};
            oUserData.pathname = "/SingleUserProfilePage/"+nextPeerID;
            oUserData.linkfromcid = 'linkFrom_'+nextPeerID;
            oUserData.cid = nextPeerID;
            this.state.contactLinks.push(oUserData)
            this.forceUpdate();
        }

        ////////////////////////////////////////////////////////////////
        /////////////////////// swarm addrs ////////////////////////////
        var a2Users = await MiscIpfsFunctions.fetchUsersListViaSwarmAddrs()
        console.log("a2Users: "+JSON.stringify(a2Users,null,4))
        var grouping = "swarmAddrs";
        for (var u=0;u<a2Users.length;u++) {
            var nextPeerID = a2Users[u];
            if (!masterUserList.includes(nextPeerID)) {
                masterUserList.push(nextPeerID)
                var foo = await addPeerToUserList(myPeerID,nextPeerID,grouping)
                var oUserData = {};
                oUserData.pathname = "/SingleUserProfilePage/"+nextPeerID;
                oUserData.linkfromcid = 'linkFrom_'+nextPeerID;
                oUserData.cid = nextPeerID;
                this.state.contactLinks.push(oUserData)
                this.forceUpdate();
            }
        }

        ////////////////////////////////////////////////////////////////////
        /////////////////////// previously seen ////////////////////////////
        var a3Users = await MiscIpfsFunctions.fetchUsersFromMyGrapevineMFS()
        console.log("a3Users: "+JSON.stringify(a3Users,null,4))
        var grouping = "previouslySeen";
        for (var u=0;u<a3Users.length;u++) {
            var nextPeerID = a3Users[u];
            if (!masterUserList.includes(nextPeerID)) {
                masterUserList.push(nextPeerID)
                var foo = await addArchivedPeerToUserList(myPeerID,nextPeerID,grouping)
                var oUserData = {};
                oUserData.pathname = "/SingleUserProfilePage/"+nextPeerID;
                oUserData.linkfromcid = 'linkFrom_'+nextPeerID;
                oUserData.cid = nextPeerID;
                this.state.contactLinks.push(oUserData)
                this.forceUpdate();
            }
        }

        // add list of all known peerIDs in MFS for others to find
        var sMasterUserList = JSON.stringify(masterUserList,null,4)
        // console.log("sMasterUserList: "+sMasterUserList)
        await updateMasterUsersList(sMasterUserList)

        ////////////////////////////////////////////////////////////////////
        /////////////////// scrape data from other users ///////////////////
        for (var u=0;u<a1Users.length;u++) {
            var nextPeerID = a1Users[u];
            // console.log("try fetchUsersFromExternalMFS from nextPeerID: "+nextPeerID)
            var a4Users = await MiscIpfsFunctions.fetchUsersFromExternalMFS(nextPeerID)
            // console.log("a4Users: "+JSON.stringify(a4Users,null,4))
            var grouping = "scraped";
            for (var u=0;u<a4Users.length;u++) {
                var nextPeerID = a4Users[u];
                if (!masterUserList.includes(nextPeerID)) {
                    masterUserList.push(nextPeerID)
                    var foo = await addPeerToUserList(myPeerID,nextPeerID,grouping)
                    var oUserData = {};
                    oUserData.pathname = "/SingleUserProfilePage/"+nextPeerID;
                    oUserData.linkfromcid = 'linkFrom_'+nextPeerID;
                    oUserData.cid = nextPeerID;
                    this.state.contactLinks.push(oUserData)
                    this.forceUpdate();
                }
            }
        }

        jQuery(".contactPageSingleContactContainer").click(function(){
            var cid = jQuery(this).data("cid")
            console.log("contactPageSingleContactContainer; cid: "+cid)
            jQuery("#linkFrom_"+cid).get(0).click();
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Contacts Main Page</div>

                        <div style={{display:"none"}} >
                        {this.state.contactLinks.map(link => (
                            <div >
                                <Link id={link.linkfromcid} class='navButton'
                                  to={link.pathname}
                                >{link.cid}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div id="usersListContainer" ></div>

                    </div>
                </fieldset>
            </>
        );
    }
}
