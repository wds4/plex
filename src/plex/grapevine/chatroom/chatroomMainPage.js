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

export default class GrapevineChatroomMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");

        const topic = "grapevine";
        var d = new Date();
        var messageNumber = 0;
        const receiveMsg = (msg) => {
            messageNumber++;
            var msg_from = msg.from;
            var msg_data = msg.data;
            var msg_seqno = msg.seqno;
            var msg_topics_arr = msg.topicIDs;
            var msg_topics_str = JSON.stringify(msg_topics_arr);
            var msg_str = JSON.stringify(msg);

            var msg_content = new TextDecoder("utf-8").decode(msg_data);

            var msg_html = "";
            msg_html += "<div id='messageNumber_"+messageNumber+"' style='height:0px;font-size:12px;border:1px solid grey;margin-bottom:5px;padding:5px;' >";
                msg_html += "<div id='messageHeightDeterminator_"+messageNumber+"' >";
                msg_html += "<div style='font-size:12px;' >";
                    msg_html += "<div style='display:inline-block;' >";
                    msg_html += "from: "+msg_from+"<br>";
                    msg_html += "</div>";

                    msg_html += "<div style='display:inline-block;float:right;' >";
                    msg_html += "received: "+ d +"<br>";
                    msg_html += "</div>";

                    msg_html += "<div style='clear:both;' ></div>";
                msg_html += "</div>";

                msg_html += "<div style='font-size:16px;' >";
                msg_html += msg_content;
                msg_html += "</div>";
            msg_html += "</div>";
            jQuery("#pubsub_log").prepend(msg_html);
            openMessageContainer(messageNumber)
        }

        await MiscIpfsFunctions.ipfs.pubsub.subscribe(topic, receiveMsg)
        console.log(`subscribed to ${topic}`)

        var topics = await MiscIpfsFunctions.ipfs.pubsub.ls();
        console.log("topics: "+topics)

        var msg = new TextEncoder().encode('I hereby subscribe my peerID to the Pretty Good Grapevine Community');
        await MiscIpfsFunctions.ipfs.pubsub.publish(topic,msg);

        jQuery("#publishMessageButton").unbind("click");
        jQuery("#publishMessageButton").on("click", async function(){
            var post = jQuery("#postContainer").val()
            var msg = new TextEncoder().encode(post);
            await MiscIpfsFunctions.ipfs.pubsub.publish(topic,msg);
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

                                <div id="onlineMembersContainer" style={{display:"inline-block",border:"1px solid purple",borderRadius:"5px",padding:"10px",width:"350px",height:"700px",overflow:"scroll"}} >
                                    <center>Who's online</center>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
