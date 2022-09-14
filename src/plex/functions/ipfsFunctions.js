import sendAsync from '../renderer.js';
import IpfsHttpClient from 'ipfs-http-client';
import * as NeuroCore2 from '../neuroCore2/neuroCoreTopPanel.js'
const jQuery = require("jquery");

export const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

// ipfs-show-id
export const ipfsShowStatusData = async () => {
    const ipfs_info_obj = await ipfs.id();
    console.log(ipfs_info_obj)

    var ipfs_id = ipfs_info_obj.id;
    var my_ipfs_id = ipfs_info_obj.id;
    var ipfs_publicKey = ipfs_info_obj.publicKey;
    var ipfs_addresses_arr = ipfs_info_obj.addresses;
    var ipfs_agentVersion = ipfs_info_obj.agentVersion;
    var ipfs_protocolVersion = ipfs_info_obj.protocolVersion;

    console.log("ipfs_id: "+ ipfs_id);
    console.log("ipfs_publicKey: "+ ipfs_publicKey);
    console.log("ipfs_agentVersion: "+ ipfs_agentVersion);
    console.log("ipfs_protocolVersion: "+ ipfs_protocolVersion);

    /*
    document.getElementById("ipfs_id").innerHTML = ipfs_id;
    document.getElementById("ipfs_publicKey").innerHTML = ipfs_publicKey;
    document.getElementById("ipfs_agentVersion").innerHTML = ipfs_agentVersion;
    document.getElementById("ipfs_protocolVersion").innerHTML = ipfs_protocolVersion;
    */
    const ipfsShowID_html = `
        <div class=smallIpfsDataLeftCol >IPFS node ID:</div> <div id=ipfs_id style=display:inline-block; >`+ipfs_id+`</div><br>
        <div class=smallIpfsDataLeftCol >IPFS publicKey:</div> <div id=ipfs_publicKey style=display:inline-block; >`+ipfs_publicKey+`</div><br>
        <div class=smallIpfsDataLeftCol >IPFS agentVersion:</div> <div id= ipfs_agentVersion style=display:inline-block; >`+ipfs_agentVersion+`</div><br>
        <div class=smallIpfsDataLeftCol >IPFS protocolVersion:</div> <div id= ipfs_protocolVersion style=display:inline-block; >`+ipfs_protocolVersion+`</div><br>
    `;
    return ipfsShowID_html
}


export const ipfsSwarmPeers_main = async () => {
    const peerInfos = await ipfs.swarm.addrs();
    var numPeers = peerInfos.length;
    console.log("numPeers: "+numPeers);

    var outputHTML = "number of peers: "+numPeers+"<br>";
    jQuery("#swarmPeersData").append(outputHTML);
    peerInfos.forEach(info => {
        var nextPeerID = info.id;
        // injectPeerIDintoUsersTable(nextPeerID);
        // fetchUserProfileData_ipfsToSql(nextPeerID);
        if (nextPeerID=="QmXvSDSxcgRfPzXLhet8SEbrtA36paH6rUrM64bzBWksZB") {
            jQuery("#rochen-nodeVerification").html("yes");
        }
        if (nextPeerID=="QmawuDjAyAvRQNvsNHdKwaeCgkgyMFmmTWrt25e8mqWVtW") {
            jQuery("#aws-nodeVerification").html("yes");
        }
        if (nextPeerID=="Qmevsrf1o6yTmjd9TM4fP1BrPmuKR9GVJyCz2ffw34qAty") {
            jQuery("#MBP-electron-nodeVerification").html("yes");
        }
        if (nextPeerID=="QmX1dzUb3TSGUbP28nLYEMJEt7X4UuPdpGXPFTF9YQtDhJ") {
            jQuery("#iMac-electron-nodeVerification").html("yes");
        }
        if (nextPeerID=="QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ") {
            jQuery("#MBP-go-ipfs-nodeVerification").html("yes");
        }
        if (nextPeerID=="12D3KooWJpiTmrQGWG9oThj6MAMhMmm756htH2Co1TT6LsPsBWki") {
            jQuery("#iMac-go-ipfs-nodeVerification").html("yes");
        }
        var nextPeerAddrs = info.addrs;
        var ipnsPath = nextPeerID+"/grapevineData/userProfileData";
        // catFile_ipns(ipnsPath)
        var ipnsPath = "Qmevsrf1o6yTmjd9TM4fP1BrPmuKR9GVJyCz2ffw34qAty/grapevineData/userProfileData";
        // this async return function (returnFile_ipns) is not handled correctly
        // usrProData = await returnFile_ipns(ipnsPath);
        // console.log(nextPeerID);

        // pingNode(nextPeerID);

        outputHTML = "<div style='border:1px solid white; padding:2px;' >";
        outputHTML += nextPeerID;
        outputHTML += "<br>";
        outputHTML += nextPeerAddrs;
        outputHTML += "<br>";
        // outputHTML += usrProData;
        outputHTML += "</div>";
        jQuery("#swarmPeersData").append(outputHTML);
        // info.addrs.forEach(addr => console.log(addr.toString()))
    });
}

export const ipfsShowPubsubSubscribedPeers_main = async () => {
    const topic = 'grapevine';
    const peerIds = await ipfs.pubsub.peers(topic);
    var outputHTML = "";
    outputHTML += "pubsub topic: "+topic+"<br>";
    outputHTML += "subscribed peerIds: "+peerIds;
    console.log(outputHTML);
    return outputHTML;
}

// ipfs-show-config
export const ipfsShowConfig_main = async () => {
    const config = await ipfs.config.getAll();
    var outputHTML = "";
    outputHTML += JSON.stringify(config,null,4);
    console.log("config: "+outputHTML);
    // outputHTML_formatted = "<pre>"+outputHTML+"</pre>";
    // document.getElementById("showConfig").innerHTML = outputHTML;
    return outputHTML;
}
