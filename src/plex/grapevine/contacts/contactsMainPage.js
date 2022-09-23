import React from "react";
import { Link } from "react-router-dom";
import Masthead from '../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/grapevine_leftNav1';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'

const jQuery = require("jquery");

const addPeerToUserList = async (cid) => {

    var ipfsPath = "/ipns/"+cid+"/grapevineData/userProfileData/myProfile.txt";

    // console.log("ipfsPath: "+ipfsPath)

    var userHTML = "";
    userHTML += "<div class='contactPageSingleContactContainer' data-cid='"+cid+"' >";
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
const fetchUsersList = async () => {
    var aUsers = [];
    const peerInfos = await MiscIpfsFunctions.ipfs.swarm.addrs();
    var numPeers = peerInfos.length;
    console.log("numPeers: "+numPeers);

    var outputHTML = "number of peers: "+numPeers+"<br>";
    jQuery("#swarmPeersData").append(outputHTML);
    peerInfos.forEach(info => {
        var nextPeerID = info.id;
        aUsers.push(nextPeerID)
        addPeerToUserList(nextPeerID)
    })
    return aUsers;
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
        var aUsers = await fetchUsersList()
        jQuery(".contactPageSingleContactContainer").click(function(){
            var cid = jQuery(this).data("cid")
            console.log("contactPageSingleContactContainer; cid: "+cid)
            jQuery("#linkFrom_"+cid).get(0).click();
        })
        console.log("aUsers: "+JSON.stringify(aUsers,null,4))
        for (var u=0;u<aUsers.length;u++) {
            var nextCid = aUsers[u];
            var oUserData = {};
            oUserData.pathname = "/SingleUserProfilePage/"+nextCid;
            oUserData.linkfromcid = 'linkFrom_'+nextCid;
            oUserData.cid = nextCid;
            this.state.contactLinks.push(oUserData)
            this.forceUpdate();
        }
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
