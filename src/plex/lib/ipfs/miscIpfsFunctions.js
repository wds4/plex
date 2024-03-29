import IpfsHttpClient from 'ipfs-http-client';
import * as MiscFunctions from '../../functions/miscFunctions.js';
const jQuery = require("jquery");
const electronFs = window.require('fs');

export const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

////////////////////////////////////////////////////////////////////////////
//
//         https://github.com/ipfs/js-ipfs/tree/master/docs/core-api
//
////////////////////////////////////////////////////////////////////////////

// TO_DO: REPLACING MiscIpfsFunctions.returnMyPeerID() with cg.ipfs.returnMyPeerID()
// FINISHED: no
export const returnMyPeerID = async () => {
    var oIpfsID = await ipfs.id();
    var myPeerID = oIpfsID.id;
    // console.log("returnMyPeerID; myPeerID: "+myPeerID)
    return myPeerID
}

// TO_DO: REPLACING MiscIpfsFunctions.returnMyUsername() with cg.ipfs.returnMyUsername()
// FINISHED: no
export const returnMyUsername = async () => {
    var ipfsPath = "/grapevineData/userProfileData/myProfile.txt";
    var chunks = []
    try {
        for await (const chunk of ipfs.files.read(ipfsPath)) {
            var sResult1 = new TextDecoder("utf-8").decode(chunk);
            chunks.push(sResult1)
        }
        var sResult = chunks.join("")
        var oMyUserData = JSON.parse(sResult)
        if (typeof oMyUserData == "object") {
            var myUsername = oMyUserData.username;
            return myUsername;
        }
    } catch (e) {}
    return false;
}

export const fetchIpnsFromKeynameIfExists = async (keyname) => {
    // returns ipns if keyname exists; returns false if does not exist
    var ipns = false;
    const keys = await ipfs.key.list()
    for (var k=0;k<keys.length;k++) {
        var oNext = keys[k];
        var nextKeyname = oNext.name;
        if (nextKeyname==keyname) {
            ipns = oNext.id;
        }
    }
    return ipns;
}

export const storeAvatarForContact = async (path,imageData) => {
    // try {
        // if (!electronFs.exists(path)) {
            electronFs.writeFile(path, imageData, "binary", (err) => {
                if (err) {
                    console.log("storeAvatarForContact err: "+err);
                    return false;
                } else {
                    console.log("storeAvatarForContact; file written successfully\n");
                    MiscFunctions.timeout(500);
                    return true;
                    // console.log("The written has the following contents:");
                    // console.log(electronFs.readFileSync("src/plex/settings/helloWorld/helloWorldTestFile2.txt", "utf8"));
                }
            });
            return true;
        // } else {
            // return true;
        // }
    // } catch (e) {
        // console.log("storeAvatarForContact error: "+e);
        // return false;
    // }
    return false;
}

export const makeLocalFolderForContact = async (path) => {
    try {
        if (!electronFs.existsSync(path)) {
            electronFs.mkdir(path, (err) => {
                if (err)
                    console.log(err);
                else {
                    console.log("director created successfully\n");
                }
            });
            return true;
        } else {
            return true;
        }
    } catch (e) {
        console.log("mkdir path: "+path+"; error: "+e)
        return false;
    }
    return false;
}

// This function has been deprecated
/*
export const fetchLocalRatingsFromExternalMFS = async (peerID) => {
    var aCids = []

    var mfsPath = "/ipns/"+peerID+"/grapevineData/publicRatingsData/ratingsByMe/ratings.txt";

    try {
        for await (const chunk of ipfs.cat(mfsPath)) {
            var ratingsListData = new TextDecoder("utf-8").decode(chunk);

            var aCids = JSON.parse(ratingsListData);
            console.log("fetchLocalRatingsFromExternalMFS "+peerID+" SUCCESS! aCids: "+JSON.stringify(aCids,null,4))
            return aCids;
        }
    } catch (e) {
        console.log("fetchLocalRatingsFromExternalMFS "+peerID+" error: "+e)
        var aUsers = [];
        return aCids;
    }

    return aCids;
}
*/

export const returnUserProfileFromMFS = async (peerID) => {
    var oUserProfile = {};

    var mfsPath = "/grapevineData/users/"+peerID+"/userProfile.txt";
    try {
        var chunks = []
        for await (const chunk2 of ipfs.files.read(mfsPath)) {
            chunks.push(chunk2)
            // console.info("chunk2: "+chunk2)
            var chunk3 = new TextDecoder("utf-8").decode(chunk2);
            try {
                var chunk4 = JSON.parse(chunk3);
                if (typeof chunk4 == "object") {
                    return chunk4
                } else {
                    return false
                }
            } catch (e) {
                return false
            }
        }
    } catch (e) {
        return false;
    }

    return oUserProfile;
}

export const isMfsFileValidObj = async (ipfsPath) => {
    try {
        var chunks = []
        for await (const chunk2 of ipfs.files.read(ipfsPath)) {
            chunks.push(chunk2)
            // console.info("chunk2: "+chunk2)
            var chunk3 = new TextDecoder("utf-8").decode(chunk2);
            try {
                var chunk4 = JSON.parse(chunk3);
                if (typeof chunk4 == "object") {
                    return true
                } else {
                    return false
                }
            } catch (e) {
                return false
            }
        }
    } catch (e) {

    }

    return false;
}
export const fetchImgFromIPFS_c = async (cid) => {
    if (!cid) {
        cid = '/ipfs/QmNma7eG55pEEbnoepvCGXZTt8LJDshY6zZerGj8ZY21iS' //  sample_rorshach.png in private IPFS network, also on iMac desktop
    }
	try {
    	let bufs = []
    	for await (const buf of ipfs.cat(cid)) {
    	    bufs.push(buf)
    	}
    	const data = Buffer.concat(bufs)
        return data;
    } catch (e) {}
}

export const fetchImgFromIPFS_b = async (cid) => {
    if (!cid) {
        cid = '/ipfs/QmNma7eG55pEEbnoepvCGXZTt8LJDshY6zZerGj8ZY21iS' // sample_rorshach.png in private IPFS network, also on iMac desktop
    }
	try {
    	let bufs = []
    	for await (const buf of ipfs.cat(cid)) {
    	    bufs.push(buf)
    	}
    	const data = Buffer.concat(bufs)
    	var blob = new Blob([data], {type:"image/png"})
        return blob;
    } catch (e) {
        return false;
    }
}

export const fetchImgFromIPFS = async (cid) => {
    if (!cid) {
        cid = '/ipfs/QmNma7eG55pEEbnoepvCGXZTt8LJDshY6zZerGj8ZY21iS' // sample_rorshach.png in private IPFS network, also on iMac desktop
    }
	try {
    	let bufs = []
    	for await (const buf of ipfs.cat(cid)) {
    	    bufs.push(buf)
    	}
    	const data = Buffer.concat(bufs)
    	var blob = new Blob([data], {type:"image/png"})
    	var img = document.getElementById("avatarBox") // the img tag you want it in
    	img.src = window.URL.createObjectURL(blob)
    } catch (e) {}
}

export const ipfsShowKeys = async () => {
    var outputHTML = "";
    const aKeys = await ipfs.key.list()
    outputHTML += "Number of keys: "+aKeys.length+"<br>";
    for (var k=0;k<aKeys.length;k++) {
        var oNextKey = aKeys[k];
        outputHTML += "id: "+oNextKey.id+"<br>";
        outputHTML += "name: "+oNextKey.name+"<br><br>";
    }
    return outputHTML;
}

export const ipfsShowPins = async () => {
    var output1HTML = "";
    var numPins = 0;
    var numDirect = 0;
    var numIndirect = 0;
    var numRecursive = 0;
    for await (const { cid, type } of ipfs.pin.ls()) {
        // console.log({ cid, type })
        output1HTML += cid + " " + type + "<br>";
        numPins++;
        if (type=="recursive") {
            numRecursive++;
        }
        if (type=="indirect") {
            numIndirect++;
        }
        if (type=="direct") {
            numDirect++;
        }
    }
    var output2HTML = "";
    output2HTML += "total: "+numPins;
    output2HTML += "; recursive: "+numRecursive;
    output2HTML += "; indirect: "+numIndirect;
    output2HTML += "; direct: "+numDirect;
    output2HTML += "<br>";
    var outputFinalHTML = "";
    outputFinalHTML += output2HTML;
    outputFinalHTML += output1HTML;
    return outputFinalHTML;
}

export const ipfsShowStats = async () => {
    for await (const stats of ipfs.stats.bw()) {
        // console.log("stats: "+JSON.stringify(stats,null,4))
        return JSON.stringify(stats,null,4);
    }

}

export const ipfsShowDNS = async () => {
    const path = await ipfs.dns('ipfs.io')
    // console.log(path)
    return path;
}

export const ipfsShowVersion = async () => {
    const oVersion = await ipfs.version()
    // console.log("version: "+oVersion)
    var sVersion = JSON.stringify(oVersion,null,4)
    return sVersion;
}

export const returnIpfsID = async () => {
    const ipfs_info_obj = await ipfs.id();
    // console.log(ipfs_info_obj)

    var ipfs_id = ipfs_info_obj.id;

    return ipfs_id
}

// ipfs-show-id
export const ipfsShowStatusData = async () => {
    const ipfs_info_obj = await ipfs.id();
    // console.log(ipfs_info_obj)

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

// deprecating this function for now
export const ipfsShowFiles = async () => {
    for await (const file of ipfs.files.ls('/grapevineData/publishedRatingsData')) {
        console.log("file name: "+file.name)
        var cidHash = file.cid.hash;
        var decoded = new TextDecoder().decode(file.cid.hash);
        console.log("file cidHash: "+JSON.stringify(cidHash,null,4))
        console.log("file decoded: "+decoded)
        console.log("typeof cidHash: "+ typeof cidHash)
        var sFile = JSON.stringify(file.cid,null,4)
        return sFile;
    }
}

export const returnUserImageCid = async (peerID) => {
    var imageCid = "";
    var ipfsPath = "/ipns/"+peerID+"/grapevineData/userProfileData/myProfile.txt";

    try {
        for await (const chunk of ipfs.cat(ipfsPath)) {
            var userData = new TextDecoder("utf-8").decode(chunk);

            var oUserData = JSON.parse(userData);
            if (typeof oUserData == "object") {
                var sUserData = JSON.stringify(oUserData,null,4);
                var imageCid = oUserData.imageCid;
            }
        }
    } catch (e) {}

    return imageCid;
}
/*
stockAvatar_00: QmNma7eG55pEEbnoepvCGXZTt8LJDshY6zZerGj8ZY21iS // the one that looks like a baseball
stockAvatar_01: QmaYjy2JC1VAfiP2wViNfrnkSvHUZBJa9Fo87CjhR1Lcbh
stockAvatar_02: QmRKj1ZytaVkVf2e9YTezeRCfTLaZUMCVTNQYz7RwfysXX
stockAvatar_03: QmcmwFTQSnxFb8iMob4R5ojYNyf48KRcysN9axhoq9AX7p
stockAvatar_04: Qmd2eQr2PHN7AySH9rv7BvwdnkyJh7X5eoweq3thcChy7y
stockAvatar_05: QmT6XFrVgxpGn6aQa26UnaEtFYVhSpQkJYbTm4EyPTPuRD
stockAvatar_06: QmZ6AZe7xxd6raYsSbiV8bUXq9zMm8gAZQyvVJdneWWkCG
stockAvatar_07: QmWjDLLnPbJExTb5P7oDmFW4Kcnw2ey8ttdhF1qnhchGWt
stockAvatar_08: QmVkgT6PMyJ9F9EkthtsES4NAJQ5mpP6C27agfLTGxTtpy
stockAvatar_09: QmXRFh16ctss9Be9YvTjpcPJGG8vQsn9oDZWppugD2LdQW
stockAvatar_10: QmfYNMx5eq9rpaZXroqVdDrw3UxUsVG2eDikYAue34s3Bz
stockAvatar_11: QmdMcyKRKPisGTstwFqbMixMWbxRSZBvkXdY4z7SMGHy5r
*/
export const addDefaultImage = (cid) => {
    var stockAvatarCid = "QmNma7eG55pEEbnoepvCGXZTt8LJDshY6zZerGj8ZY21iS";
    var num = cid.charCodeAt(6);
    var defaultAvatarNumber = num % 10;
    console.log("addDefaultImage; cid: "+cid+"; num: "+num+"; defaultAvatarNumber: "+defaultAvatarNumber)
    if (defaultAvatarNumber==0) {
        stockAvatarCid = "QmNma7eG55pEEbnoepvCGXZTt8LJDshY6zZerGj8ZY21iS";
    }
    if (defaultAvatarNumber==1) {
        stockAvatarCid = "QmaYjy2JC1VAfiP2wViNfrnkSvHUZBJa9Fo87CjhR1Lcbh";
    }
    if (defaultAvatarNumber==2) {
        stockAvatarCid = "QmRKj1ZytaVkVf2e9YTezeRCfTLaZUMCVTNQYz7RwfysXX";
    }
    if (defaultAvatarNumber==3) {
        stockAvatarCid = "QmcmwFTQSnxFb8iMob4R5ojYNyf48KRcysN9axhoq9AX7p";
    }
    if (defaultAvatarNumber==4) {
        stockAvatarCid = "Qmd2eQr2PHN7AySH9rv7BvwdnkyJh7X5eoweq3thcChy7y";
    }
    if (defaultAvatarNumber==5) {
        stockAvatarCid = "QmT6XFrVgxpGn6aQa26UnaEtFYVhSpQkJYbTm4EyPTPuRD";
    }
    if (defaultAvatarNumber==6) {
        stockAvatarCid = "QmZ6AZe7xxd6raYsSbiV8bUXq9zMm8gAZQyvVJdneWWkCG";
    }
    if (defaultAvatarNumber==7) {
        stockAvatarCid = "QmWjDLLnPbJExTb5P7oDmFW4Kcnw2ey8ttdhF1qnhchGWt";
    }
    if (defaultAvatarNumber==8) {
        stockAvatarCid = "QmVkgT6PMyJ9F9EkthtsES4NAJQ5mpP6C27agfLTGxTtpy";
    }
    if (defaultAvatarNumber==9) {
        stockAvatarCid = "QmXRFh16ctss9Be9YvTjpcPJGG8vQsn9oDZWppugD2LdQW";
    }
    if (defaultAvatarNumber==10) {
        stockAvatarCid = "QmfYNMx5eq9rpaZXroqVdDrw3UxUsVG2eDikYAue34s3Bz";
    }
    if (defaultAvatarNumber==11) {
        stockAvatarCid = "QmdMcyKRKPisGTstwFqbMixMWbxRSZBvkXdY4z7SMGHy5r";
    }
    return stockAvatarCid;
}

export const initializeMyProfile = async (peerID) => {
    var oBlankMyProfile = {
        "username": null,
        "peerID": peerID,
        "loc": null,
        "about": null,
        "lastUpdated": null,
        "imageCid": null
    }
    var sBlankMyProfile = JSON.stringify(oBlankMyProfile,null,4)
    await ipfs.files.write('/grapevineData/userProfileData/myProfile.txt',new TextEncoder().encode(sBlankMyProfile), {create: true, flush: true});

}

export const initializeIpfsMutableFileSystem = async () => {
    await ipfs.files.mkdir('/grapevineData/userProfileData',{"parents":true});
    await ipfs.files.mkdir('/grapevineData/users',{"parents":true});

    await ipfs.files.mkdir('/plex/conceptGraphs');
    await ipfs.files.mkdir('/plex/images');

    return true;
}

//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////// Fetch Users via IPFS //////////////////////////////////////

export const fetchUsersFromExternalMFS = async (nextPeerID) => {
    var path = "/ipns/"+nextPeerID+"/grapevineData/users/masterUsersList.txt";
    console.log("fetchUsersFromExternalMFS; path: "+path)
    try {
        for await (const chunk of ipfs.cat(path)) {
            var masterUsersListData = new TextDecoder("utf-8").decode(chunk);
            console.log("masterUsersListData: "+typeof masterUsersListData)
            var aUsers = JSON.parse(masterUsersListData);
            console.log("masterUsersListData; aUsers: "+typeof aUsers)
            // var aUsers = masterUsersListData
            console.log("fetchUsersFromExternalMFS "+nextPeerID+" SUCCESS! aUsers: "+JSON.stringify(aUsers,null,4))
            // aUsers = [];
            return aUsers;
        }
    } catch (e) {
        console.log("fetchUsersFromExternalMFS "+nextPeerID+" error: "+e)
        var aUsers = [];
        return aUsers;
    }

    return aUsers;
}

export const fetchUsersFromMyGrapevineMFS = async () => {
    var aUsers = [];
    var path = "/grapevineData/users/";
    for await (const file of ipfs.files.ls(path)) {
        console.log("path: "+path+"; file name: "+file.name)
        console.log("path: "+path+"; file type: "+file.type)
        if (file.type=="directory") {
            aUsers.push(file.name)
        }
    }

    return aUsers;
}

export const fetchUsersListViaSwarmAddrs = async () => {
    var aUsers = [];

    const peerInfos = await ipfs.swarm.addrs();
    var numPeers = peerInfos.length;
    console.log("numPeers: "+numPeers);
    peerInfos.forEach(info => {
        var nextPeerID = info.id;
        aUsers.push(nextPeerID)
    })

    return aUsers;
}

export const fetchUsersListViaSwarmPeers = async () => {
    var aUsers = [];

    const peerInfos = await ipfs.swarm.peers();
    console.log("peerInfos: "+JSON.stringify(peerInfos,null,4));
    var numPeers = peerInfos.length;
    peerInfos.forEach(info => {
        var nextPeerID = info.peer;
        aUsers.push(nextPeerID)
    })

    return aUsers;
}
