import React from "react";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/ipfs_leftNav2';

const jQuery = require("jquery"); 

const reportMutableFilesTree = async (path) => {
    const stats = await MiscIpfsFunctions.ipfs.files.stat(path)
    console.log("path: "+path+"; stats: "+JSON.stringify(stats,null,4))
    for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
        console.log("path: "+path+"; file name: "+file.name)
        console.log("path: "+path+"; file type: "+file.type)
        var reportHTML = "";
        reportHTML += "<div>"+path+"</div>";
        reportHTML += "<div style='margin-left:50px;' >cid: "+file.cid+"</div>";
        if (file.type=="directory") {
            reportHTML += "<div style='margin-left:50px;background-color:yellow;' >" + file.name + "</div>";
            if (file.name=="plex") {
                jQuery("#hasPlexFileBeenEstablishedContainer").html("YES");
                jQuery("#establishPlexMutableFileButtonContainer").css("display","none")
            }
            if ( (path=="/plex/") && (file.name=="conceptGraphs")) {
                jQuery("#hasPlexCgFileBeenEstablishedContainer").html("YES");
                jQuery("#establishPlexCgMutableFileButtonContainer").css("display","none")
            }
            if ( (path=="/grapevineData/") && (file.name=="users")) {
                jQuery("#hasGrapevineDataUsersFileBeenEstablishedContainer").html("YES");
                jQuery("#establishGrapevineDataUsersMutableFileButtonContainer").css("display","none")
            }
            if ( (path=="/grapevineData/") && (file.name=="userProfileData")) {
                jQuery("#hasGrapevineDataUserProfileDataFileBeenEstablishedContainer").html("YES");
                jQuery("#establishGrapevineDataUserProfileDataMutableFileButtonContainer").css("display","none")
            }
        }
        if (file.type=="file") {
            reportHTML += "<div class=ipfsMutableFilesFileContainer style='margin-left:50px;background-color:orange;' ";
            reportHTML += " data-filename='"+file.name+"' ";
            reportHTML += " data-path='"+path+"' ";
            reportHTML += " >";
            reportHTML += file.name ;
            reportHTML += "</div>";
            if ( (path=="/grapevineData/userProfileData/") && (file.name=="myProfile.txt")) {
                jQuery("#hasGrapevineDataUsersMyProfileTxtBeenEstablishedContainer").html("YES");
                jQuery("#establishGrapevineDataUsersMyProfileMutableFileButton").css("display","none")
            }
            /*
            var ipfsPath = "/ipns/QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ/" + path + file.name;
            console.log("ipfsPath: "+ipfsPath)
            for await (const chunk2 of MiscIpfsFunctions.ipfs.cat(ipfsPath)) {
                console.info("chunk2: "+chunk2)
                var chunk3 = new TextDecoder("utf-8").decode(chunk2);

                try {
                    var chunk4 = JSON.parse(chunk3);
                    if (typeof chunk4 == "object") {
                        var chunk5 = JSON.stringify(chunk4,null,4);
                        console.log("chunk5: "+chunk5)
                    } else {
                        console.log("chunk3: "+chunk3)
                    }
                } catch (e) {
                    console.log("error: "+e)
                    console.log("chunk3: "+chunk3)
                }
            }
            */
        }
        jQuery("#ipfsMutableFilesListContainer").append(reportHTML)
        if (file.type=="directory") {
            var newPath=path+file.name+"/";
            await reportMutableFilesTree(newPath)
        }
    }
}

export default class IPFSFilesInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        jQuery("#hasPlexFileBeenEstablishedContainer").html("NO");
        jQuery("#hasPlexCgFileBeenEstablishedContainer").html("NO");
        jQuery("#hasGrapevineDataUsersFileBeenEstablishedContainer").html("NO");
        await reportMutableFilesTree('/');
        var ipfsID = await MiscIpfsFunctions.returnIpfsID();
        // console.log("ipfsID: "+ipfsID)
        MiscFunctions.timeout(100);
        jQuery(".ipfsMutableFilesFileContainer").click(async function(){
            var fileName = jQuery(this).data("filename")
            var path = jQuery(this).data("path")

            // var ipfsPath = "/ipns/QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ/" + path + fileName;

            var ipfsPath = "/ipns/" + ipfsID + path + fileName;
            var ipfsPathB = path + fileName;
            console.log("ipfsMutableFilesFileContainer clicked; fileName: "+fileName+"; ipfsPath: "+ipfsPath)

            // ipfsPath = "QmctKUNuAD656vFL1d11DtQxhYXkMLwQJAm9tgR1nYoUqa";
            // ipfsPath = "QmY4wabUyNFyD341TmHR3GX4iyCFGcAHmsa3gavANG4Ngc/plex";
            // ipfsPath = "/ipns/QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ//plex//conceptGraphs/k2k4r8jya910bj45nxvwiw7pjqr611qv431331sx3py6ee2tiwxtmf6y/mainSchemaForConceptGraph";
            // ipfsPath = "/ipns/QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ/grapevineData/userProfileData/myProfile.txt";
/*
            for await (var file of MiscIpfsFunctions.ipfs.files.ls(ipfsPath)) {
                console.log("path: "+path+"; file name: "+file.name)
                console.log("path: "+path+"; file type: "+file.type)
            }
*/
            var chunks = []

            for await (const chunk2 of MiscIpfsFunctions.ipfs.files.read(ipfsPathB)) {
                chunks.push(chunk2)
                console.info("chunk2: "+chunk2)
                var chunk3 = new TextDecoder("utf-8").decode(chunk2);

                try {
                    var chunk4 = JSON.parse(chunk3);
                    if (typeof chunk4 == "object") {
                        var chunk5 = JSON.stringify(chunk4,null,4);
                        jQuery("#selectedFileContentsContainer").html(chunk5)
                    } else {
                        jQuery("#selectedFileContentsContainer").html(chunk3)
                    }
                } catch (e) {
                    console.log("error: "+e)
                    jQuery("#selectedFileContentsContainer").html(chunk3)
                }
            }
            /*
            for await (const chunk2 of MiscIpfsFunctions.ipfs.cat(ipfsPath)) {
                console.info("chunk2: "+chunk2)
                var chunk3 = new TextDecoder("utf-8").decode(chunk2);

                try {
                    var chunk4 = JSON.parse(chunk3);
                    if (typeof chunk4 == "object") {
                        var chunk5 = JSON.stringify(chunk4,null,4);
                        jQuery("#selectedFileContentsContainer").html(chunk5)
                    } else {
                        jQuery("#selectedFileContentsContainer").html(chunk3)
                    }
                } catch (e) {
                    console.log("error: "+e)
                    jQuery("#selectedFileContentsContainer").html(chunk3)
                }
            }
            */
        })

        jQuery("#establishPlexMutableFileButton").click(async function(){
            await MiscIpfsFunctions.ipfs.files.mkdir('/plex');
            alert("/plex has been created within the ipfs mutable file system")
        })

        jQuery("#establishPlexCgMutableFileButton").click(async function(){
            await MiscIpfsFunctions.ipfs.files.mkdir('/plex/conceptGraphs');
            alert("/plex/conceptGraphs has been created within the ipfs mutable file system")
        })

        jQuery("#establishGrapevineDataUsersMutableFileButton").click(async function(){
            await MiscIpfsFunctions.ipfs.files.mkdir('/grapevineData/users',{"parents":true});
            alert("/grapevineData/users has been created within the ipfs mutable file system")
        })

        jQuery("#establishGrapevineDataUserProfileDataMutableFileButton").click(async function(){
            await MiscIpfsFunctions.ipfs.files.mkdir('/grapevineData/userProfileData',{"parents":true});
            alert("/grapevineData/userProfileData has been created within the ipfs mutable file system")
        })

        jQuery("#establishGrapevineDataUsersMyProfileMutableFileButton").click(async function(){
            var oBlankMyProfile = {
                "username": null,
                "peerID": null,
                "loc": null,
                "about": null,
                "lastUpdated": null,
                "imageCid": null
            }
            var sBlankMyProfile = JSON.stringify(oBlankMyProfile,null,4)
            await MiscIpfsFunctions.ipfs.files.write('/grapevineData/userProfileData/myProfile.txt',new TextEncoder().encode(sBlankMyProfile), {create: true, flush: true});
            alert("/grapevineData/userProfileData/myProfile.txt} has been created within the ipfs mutable file system")
        })
        try {
            await MiscIpfsFunctions.ipfs.files.mkdir('/plex/images');
        } catch (e) {}
        // one-time only to remove unwanted directories:
        try {
            await MiscIpfsFunctions.ipfs.files.rm('/plex/productionConceptGraphs', { recursive: true });
        } catch (e) {}
        try {
            await MiscIpfsFunctions.ipfs.files.rm('/grapevineData/JSONSchemaFor_relationshipType.txt', { recursive: true });
        } catch (e) {}
        try {
            await MiscIpfsFunctions.ipfs.files.rm('/grapevineData/conceptFor_relationshipType.txt', { recursive: true });
        } catch (e) {}
        try {
            await MiscIpfsFunctions.ipfs.files.rm('/grapevineData/conceptFor_wordType.txt', { recursive: true });
        } catch (e) {}
        try {
            await MiscIpfsFunctions.ipfs.files.rm('/grapevineData/mainSchemaForConceptGraph.txt', { recursive: true });
        } catch (e) {}
        try {
            await MiscIpfsFunctions.ipfs.files.rm('/grapevineData/schemaFor_relationshipType.txt', { recursive: true });
        } catch (e) {}
        try {
            await MiscIpfsFunctions.ipfs.files.rm('/grapevineData/users/myProfile.txt', { recursive: false });
        } catch (e) {}
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div className="h2">IPFS Mutable Files Info</div>

                        <pre>
                        expect the following paths:<br/>
                        <br/>
                        old paths (from pga-profile):<br/>
                        /grapevineData/userProfileData/myProfile.txt<br/>
                        /grapevineData/publishedRatingsData/myRatings.txt<br/>
                        <br/>
                        new path (grapevineData):<br/>
                        /grapevineData/users/, with file contents: cid (peerID) for each user, which is same style as myProfile.txt<br/>
                        Eventually /grapevineData/users/ will be replaced by the functionality of /plex/conceptGraphs<br/>
                        <br/>
                        new path (plex):<br/>
                        /plex/conceptGraphs/ipns to mainSchemaForConceptGraph for the concept graph (directory)/slug (wordSlug) for word (file)<br/>
                        <br/>
                        e.g.:<br/>
                        /plex/conceptGraphs/k2k4r8jya910bj45nxvwiw7pjqr611qv431331sx3py6ee2tiwxtmf6y/conceptFor_relationshipsTypes<br/>
                        k2k4r8jya910bj45nxvwiw7pjqr611qv431331sx3py6ee2tiwxtmf6y is a directory and is the IPNS for k2k4r8jya910bj45nxvwiw7pjqr611qv431331sx3py6ee2tiwxtmf6y<br/>
                        Every node in this concept graph (including the mainSchemaForConceptGraph) will be represented as a file in this directory
                        </pre>

                        <div style={{marginTop:"20px",border:"1px dashed grey",padding:"5px"}} >
                            <div>
                                <div style={{display:"inline-block"}} >
                                Has /plex mutable file directory been established?
                                </div>

                                <div id="hasPlexFileBeenEstablishedContainer" style={{display:"inline-block",marginLeft:"50px"}} >
                                ?
                                </div>

                                <div id="establishPlexMutableFileButtonContainer"  >
                                    <div id="establishPlexMutableFileButton" className="doSomethingButton" >establish mutable file: /plex</div>
                                </div>
                            </div>

                            <div>
                                <div style={{display:"inline-block"}} >
                                Has /plex/conceptGraphs mutable file directory been established?
                                </div>

                                <div id="hasPlexCgFileBeenEstablishedContainer" style={{display:"inline-block",marginLeft:"50px"}} >
                                ?
                                </div>

                                <div id="establishPlexCgMutableFileButtonContainer"  >
                                    <div id="establishPlexCgMutableFileButton" className="doSomethingButton" >establish mutable file: /plex/conceptGraphs</div>
                                </div>
                            </div>

                            <div>
                                <div style={{display:"inline-block"}} >
                                Has /grapevineData/users mutable file directory been established?
                                </div>

                                <div id="hasGrapevineDataUsersFileBeenEstablishedContainer" style={{display:"inline-block",marginLeft:"50px"}} >
                                ?
                                </div>

                                <div id="establishGrapevineDataUsersMutableFileButtonContainer"  >
                                    <div id="establishGrapevineDataUsersMutableFileButton" className="doSomethingButton" >establish mutable file: /grapevineData/users</div>
                                </div>
                            </div>

                            <div>
                                <div style={{display:"inline-block"}} >
                                Has /grapevineData/userProfileData mutable file directory been established?
                                </div>

                                <div id="hasGrapevineDataUserProfileDataFileBeenEstablishedContainer" style={{display:"inline-block",marginLeft:"50px"}} >
                                ?
                                </div>

                                <div id="establishGrapevineDataUserProfileDataMutableFileButtonContainer"  >
                                    <div id="establishGrapevineDataUserProfileDataMutableFileButton" className="doSomethingButton" >establish mutable file: /grapevineData/userProfileData</div>
                                </div>
                            </div>

                            <div>
                                <div style={{display:"inline-block"}} >
                                Has /grapevineData/userProfileData/myProfile.txt mutable file been established?
                                </div>

                                <div id="hasGrapevineDataUsersMyProfileTxtBeenEstablishedContainer" style={{display:"inline-block",marginLeft:"50px"}} >
                                ?
                                </div>

                                <div id="establishGrapevineDataUsersMyProfileMutableFileButtonContainer"  >
                                    <div id="establishGrapevineDataUsersMyProfileMutableFileButton" className="doSomethingButton" >establish mutable file: /grapevineData/userProfileData/myProfile.txt</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div id="ipfsMutableFilesListContainer" style={{marginTop:"20px",border:"1px dashed grey",padding:"5px",height:"400px",width:"600px",display:"inline-block",overflow:"scroll"}} ></div>

                            <pre id="selectedFileContentsContainer" style={{marginTop:"20px",border:"1px dashed grey",padding:"5px",height:"400px",width:"600px",display:"inline-block",overflow:"scroll"}} ></pre>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
