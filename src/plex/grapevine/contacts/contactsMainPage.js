import React from "react";
import { Link } from "react-router-dom";
import Masthead from '../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/grapevine_leftNav1';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'

const jQuery = require("jquery");

const updateMasterUsersList = async (sMasterUsersList) => {
    var path = '/grapevineData/users/masterUsersList.txt';
    await MiscIpfsFunctions.ipfs.files.write(path,new TextEncoder().encode(sMasterUsersList), {create: true, flush: true});
}
const updateUserContactInfo = async (cid,sUserData) => {
    var pathA = '/grapevineData/users/'+cid;
    var pathB = pathA + "/userProfile.txt"
    await MiscIpfsFunctions.ipfs.files.mkdir(pathA,{"parents":true});
    await MiscIpfsFunctions.ipfs.files.write(pathB,new TextEncoder().encode(sUserData), {create: true, flush: true});
}

const fetchUsersFromExternalMFS = async (nextPeerID) => {
    var aUsers = [];

    var path = "/ipns/"+nextPeerID+"/grapevineData/users/";
    try {
        for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
            console.log("fetchUsersFromExternalMFS path: "+path+"; file name: "+file.name)
            console.log("fetchUsersFromExternalMFS path: "+path+"; file type: "+file.type)
            if (file.type=="directory") {
                aUsers.push(file.name)
            }
        }
    } catch (e) {
        console.log("fetchUsersFromExternalMFS error: "+e)
    }

    return aUsers;
}

const fetchUsersFromMyGrapevineMFS = async () => {
    var aUsers = [];
    var path = "/grapevineData/users/";
    for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
        console.log("path: "+path+"; file name: "+file.name)
        console.log("path: "+path+"; file type: "+file.type)
        if (file.type=="directory") {
            aUsers.push(file.name)
        }
    }

    return aUsers;
}

const fetchUsersListViaSwarmAddrs = async () => {
    var aUsers = [];

    const peerInfos = await MiscIpfsFunctions.ipfs.swarm.addrs();
    var numPeers = peerInfos.length;
    console.log("numPeers: "+numPeers);
    var outputHTML = "number of peers: "+numPeers+"<br>";
    jQuery("#swarmPeersData").append(outputHTML);
    peerInfos.forEach(info => {
        var nextPeerID = info.id;
        aUsers.push(nextPeerID)
        // addPeerToUserList(myPeerID,nextPeerID)
    })

    return aUsers;
}

const fetchUsersListViaSwarmPeers = async (myPeerID) => {
    var aUsers = [];

    const peerInfos = await MiscIpfsFunctions.ipfs.swarm.peers();
    console.log("peerInfos: "+JSON.stringify(peerInfos,null,4));
    var numPeers = peerInfos.length;
    var outputHTML = "number of peers: "+numPeers+"<br>";
    jQuery("#swarmPeersData").append(outputHTML);
    peerInfos.forEach(info => {
        var nextPeerID = info.peer;
        aUsers.push(nextPeerID)
        // addPeerToUserList(myPeerID,nextPeerID)
    })

    return aUsers;
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
            	img.src = window.URL.createObjectURL(blob)

                jQuery("#contactsPageUsernameContainer_"+cid).html(username)
                jQuery("#contactsPageUsernameContainer_"+cid).css("font-size","22px")

                // if contact info is discovered from an active node (from the other users' own node), save it to my local mutable files
                await updateUserContactInfo(cid,sUserData)

            } else {
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
        var a1Users = await fetchUsersListViaSwarmPeers(myPeerID)
        console.log("a1Users: "+JSON.stringify(a1Users,null,4))
        var grouping = "swarmPeers";
        for (var u=0;u<a1Users.length;u++) {
            var nextPeerID = a1Users[u];
            masterUserList.push(nextPeerID)
            addPeerToUserList(myPeerID,nextPeerID,grouping)
            var oUserData = {};
            oUserData.pathname = "/SingleUserProfilePage/"+nextPeerID;
            oUserData.linkfromcid = 'linkFrom_'+nextPeerID;
            oUserData.cid = nextPeerID;
            this.state.contactLinks.push(oUserData)
            this.forceUpdate();
        }

        ////////////////////////////////////////////////////////////////
        /////////////////////// swarm addrs ////////////////////////////
        var a2Users = await fetchUsersListViaSwarmAddrs()
        console.log("a2Users: "+JSON.stringify(a2Users,null,4))
        var grouping = "swarmAddrs";
        for (var u=0;u<a2Users.length;u++) {
            var nextPeerID = a2Users[u];
            if (!masterUserList.includes(nextPeerID)) {
                masterUserList.push(nextPeerID)
                addPeerToUserList(myPeerID,nextPeerID,grouping)
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
        var a3Users = await fetchUsersFromMyGrapevineMFS()
        console.log("a3Users: "+JSON.stringify(a3Users,null,4))
        var grouping = "previouslySeen";
        for (var u=0;u<a3Users.length;u++) {
            var nextPeerID = a3Users[u];
            if (!masterUserList.includes(nextPeerID)) {
                masterUserList.push(nextPeerID)
                addPeerToUserList(myPeerID,nextPeerID,grouping)
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
        console.log("sMasterUserList: "+sMasterUserList)
        await updateMasterUsersList(sMasterUserList)

        ////////////////////////////////////////////////////////////////////
        /////////////////// scrape data from other users ///////////////////
        for (var u=0;u<a1Users.length;u++) {
            var nextPeerID = a1Users[u];
            console.log("try fetchUsersFromExternalMFS from nextPeerID: "+nextPeerID)
            var a4Users = await fetchUsersFromExternalMFS(nextPeerID)
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
