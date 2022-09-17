import React from "react";
import Masthead from '../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/grapevine_leftNav1';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'

const jQuery = require("jquery");

const addPeerToUserList = async (cid) => {

    var ipfsPath = "/ipns/"+cid+"/grapevineData/userProfileData/myProfile.txt";

    // console.log("ipfsPath: "+ipfsPath)

    var userHTML = "";
    userHTML += "<div class='contactPageSingleContactContainer' >";
        // userHTML += cid;
        userHTML += "<div class='contactsPageAvatarContainer' >";
        userHTML += "<img id='contactsPageAvatarThumb_"+cid+"' class='contactsPageAvatarThumb' />";
        userHTML += "</div>";

        userHTML += "<div class='contactsPageUsernameContainer' id='contactsPageUsernameContainer_"+cid+"' >";
        userHTML += cid;
        userHTML += "</div>";
    userHTML += "</div>";

    jQuery("#usersListContainer").append(userHTML)

    try {
        var ipfsPathB = "/ipns/"+cid+"/grapevineData/userProfileData";

        for await (const chunk of MiscIpfsFunctions.ipfs.cat(ipfsPath)) {
            var userData = new TextDecoder("utf-8").decode(chunk);
            try {
                var oUserData = JSON.parse(userData);
                if (typeof oUserData == "object") {
                    var sUserData = JSON.stringify(oUserData,null,4);
                    console.log("sUserData: "+sUserData)

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

                } else {
                }
            } catch (e) {
                console.log("error: "+e)
            }
        }
    } catch (e) {}



}
const fetchUsersList = async () => {
    const peerInfos = await MiscIpfsFunctions.ipfs.swarm.addrs();
    var numPeers = peerInfos.length;
    console.log("numPeers: "+numPeers);

    var outputHTML = "number of peers: "+numPeers+"<br>";
    jQuery("#swarmPeersData").append(outputHTML);
    peerInfos.forEach(info => {
        var nextPeerID = info.id;
        addPeerToUserList(nextPeerID)
    })
}
export default class GrapevineContactsMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");
        await fetchUsersList()
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Contacts Main Page</div>

                        <div id="usersListContainer" ></div>

                    </div>
                </fieldset>
            </>
        );
    }
}
