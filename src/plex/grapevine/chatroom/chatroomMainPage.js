import React from "react";
import Masthead from '../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/grapevine_leftNav1';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'

const jQuery = require("jquery");

export const openMessageContainer = (messageNumber) => {
    var setsContainerHeight = jQuery("#messageHeightDeterminator_"+messageNumber).css("height");
    var setsContainerHeight = parseInt(setsContainerHeight.slice(0,-2)) + 15;
    setsContainerHeight += "px";
    // var setsContainerHeight = "100px";
    jQuery("#messageNumber_"+messageNumber).animate({
        height: setsContainerHeight,
        padding: "3px",
        borderWidth:"1px"
    },500);
}

const addImageToMessage = async (peerID,msgNum) => {
    var ipfsPath = "/ipns/"+peerID+"/grapevineData/userProfileData/myProfile.txt";
    var avatarElementID = "chatroomMessateAvatarBox_"+peerID+"_"+msgNum;
    try {
        var chunks=[];
        for await (const chunk of MiscIpfsFunctions.ipfs.cat(ipfsPath)) {
            var decodedChunk = new TextDecoder("utf-8").decode(chunk);
            chunks.push(decodedChunk)
        }
        var sJoinedChunks = chunks.join("")
        var oUserData = JSON.parse(sJoinedChunks)
        console.log("oUserData: "+JSON.stringify(oUserData,null,4))
        var imageCid = oUserData.imageCid;

        var bufs = []
        for await (const buf of MiscIpfsFunctions.ipfs.cat(imageCid)) {
            bufs.push(buf)
        }
        const data = Buffer.concat(bufs)
        var blob = new Blob([data], {type:"image/png"})
        var img = document.getElementById(avatarElementID) // the img tag you want it in
        img.src = window.URL.createObjectURL(blob)
    } catch (e) {}
}

const addProfileData = async (peerID) => {
    var ipfsPath = "/ipns/"+peerID+"/grapevineData/userProfileData/myProfile.txt";
    var avatarElementID = "whosOnlineAvatarBox_"+peerID;
    var usernameElementID = "whosOnlineUsername_"+peerID;
    console.log("avatarElementID: "+avatarElementID)
    try {
        var chunks=[];
        for await (const chunk of MiscIpfsFunctions.ipfs.cat(ipfsPath)) {
            var decodedChunk = new TextDecoder("utf-8").decode(chunk);
            chunks.push(decodedChunk)
        }
        var sJoinedChunks = chunks.join("")
        var oUserData = JSON.parse(sJoinedChunks)
        console.log("oUserData: "+JSON.stringify(oUserData,null,4))
        var username = oUserData.username;
        var peerID = oUserData.peerID;
        var loc = oUserData.loc;
        var about = oUserData.about;
        var lastUpdated = oUserData.lastUpdated;
        var imageCid = oUserData.imageCid;

        jQuery("#"+usernameElementID).html(username)

        var bufs = []
        for await (const buf of MiscIpfsFunctions.ipfs.cat(imageCid)) {
            bufs.push(buf)
        }
        const data = Buffer.concat(bufs)
        var blob = new Blob([data], {type:"image/png"})
        var img = document.getElementById(avatarElementID) // the img tag you want it in
        img.src = window.URL.createObjectURL(blob)
    } catch (e) {}
}

const addPeerToOnlineList = async (nextPeerID) => {
    var peerHTML = "";

    peerHTML += "<div class='chatroomPeerUserInfoContainer' >";
        peerHTML += "<div class=chatroomPeerAvatarContainer style='display:inline-block;width:50px;height:50px' >";
            peerHTML += "<img id='whosOnlineAvatarBox_"+nextPeerID+"' class=chatroomPageAvatarBox />";
        peerHTML += "</div>";
        peerHTML += "<div style='font-size:14px;overflow:scroll;display:inline-block;margin-left:5px;width:80%;height:100%;' >";
            peerHTML += "<div id='whosOnlineUsername_"+nextPeerID+"' >username</div>";
        peerHTML += "</div>";
    peerHTML += "</div>";
    jQuery("#onlineMembersContainer").append(peerHTML)
    await addProfileData(nextPeerID)

}

const refreshWhosOnline = async (topic) => {
    var onlinePeerIDs = await MiscIpfsFunctions.ipfs.pubsub.peers(topic);
    jQuery("#onlineMembersContainer").html("")
    for (var p=0;p<onlinePeerIDs.length;p++) {
        var nextPeerID = onlinePeerIDs[p];
        console.log("nextPeerID: "+nextPeerID)
        await addPeerToOnlineList(nextPeerID)
    }
}

var messageNumber = 0;

export default class GrapevineChatroomMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");

        const topic = "grapevine";
        var d = Date.now();
        const receiveMsg = async (msg) => {
            messageNumber++;
            var msg_from = msg.from;
            var msg_data = msg.data;
            var msg_seqno = msg.seqno;
            var msg_topics_arr = msg.topicIDs;
            var msg_topics_str = JSON.stringify(msg_topics_arr);
            var msg_str = JSON.stringify(msg);

            var senderPeerID = msg_from;

            var msg_content = new TextDecoder("utf-8").decode(msg_data);

            var msg_html = "";
            msg_html += "<div id='messageNumber_"+messageNumber+"' style='height:0px;font-size:12px;border:1px solid grey;margin-bottom:5px;padding:5px;' >";
                msg_html += "<div id='messageHeightDeterminator_"+messageNumber+"' >";
                    msg_html += "<div class=chatroomPeerAvatarContainer style='display:inline-block;width:50px;height:50px' >"
                        msg_html += "<img id='chatroomMessateAvatarBox_"+senderPeerID+"_"+messageNumber+"' class=chatroomPageAvatarBox />"
                    msg_html += "</div>"

                    msg_html += "<div style='font-size:12px;display:inline-block;width:92%;margin-left:5px;' >";
                        msg_html += "<div style='font-size:12px;' >";
                            msg_html += "<div style='display:inline-block;' >";
                            msg_html += "from: "+msg_from+"<br>";
                            msg_html += "</div>";

                            msg_html += "<div style='display:inline-block;float:right;' class='whenReceivedContainer' data-whenreceived='"+d+"' >";
                            msg_html += "received: "+ d;
                            msg_html += "</div>";

                            msg_html += "<div style='clear:both;' ></div>";
                        msg_html += "</div>";

                        msg_html += "<div style='font-size:16px;display:' >";
                        msg_html += msg_content;
                        msg_html += "</div>";
                    msg_html += "</div>"
                msg_html += "</div>"
            msg_html += "</div>";
            jQuery("#pubsub_log").prepend(msg_html);
            await addImageToMessage(senderPeerID,messageNumber)
            openMessageContainer(messageNumber)
        }

        await MiscIpfsFunctions.ipfs.pubsub.subscribe(topic, receiveMsg)
        console.log(`subscribed to ${topic}`)

        var topics = await MiscIpfsFunctions.ipfs.pubsub.ls();
        console.log("topics: "+topics)

        var msg = new TextEncoder().encode('I hereby subscribe my peerID to the Pretty Good Grapevine Community');
        // await MiscIpfsFunctions.ipfs.pubsub.publish(topic,msg);

        jQuery("#publishMessageButton").unbind("click");
        jQuery("#publishMessageButton").on("click", async function(){
            var post = jQuery("#postContainer").val()
            var msg = new TextEncoder().encode(post);
            await MiscIpfsFunctions.ipfs.pubsub.publish(topic,msg);
        })
        await refreshWhosOnline(topic)
        jQuery("#refreshWhosOnlineButton").click(async function(){
            await refreshWhosOnline(topic)
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Chatroom Main Page</div>

                        <textarea id="postContainer" style={{border:"1px solid purple",borderRadius:"5px",padding:"10px",width:"800px",height:"100px"}} ></textarea>
                        <div id="publishMessageButton" className="doSomethingButton">post a message</div>

                        <div style={{width:"1400px"}}>
                            <center>Trollbox</center>
                            <div>
                                <div id="pubsub_log" style={{display:"inline-block",border:"1px solid purple",borderRadius:"5px",padding:"10px",width:"1000px",height:"700px",overflow:"scroll"}} >
                                </div>

                                <div style={{display:"inline-block",border:"1px solid purple",borderRadius:"5px",padding:"10px",width:"350px",height:"700px",overflow:"scroll"}} >
                                    <center>Who's online</center>
                                    <div id="refreshWhosOnlineButton" className="doSomethingButton">refresh</div>
                                    <div id="onlineMembersContainer" ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
