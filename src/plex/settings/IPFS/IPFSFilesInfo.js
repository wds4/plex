import React from "react";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/ipfs_leftNav2';

const jQuery = require("jquery");

const reportMutableFilesTree = async (path) => {
    for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
        console.log("path: "+path+"; file name: "+file.name)
        console.log("path: "+path+"; file type: "+file.type)
        var reportHTML = "";
        reportHTML += "<div>"+path+"</div>";
        reportHTML += "<div style='margin-left:50px;' >cid for this file: "+file.cid+"</div>";
        if (file.type=="directory") {
            reportHTML += "<div style='margin-left:50px;background-color:yellow;' >" + file.name + "</div>";
            if (file.name=="plex") {
                jQuery("#hasPlexFileBeenEstablishedContainer").html("YES");
                jQuery("#establishPlexMutableFileButtonContainer").css("display","none")
            }
            if ( (path=="/plex/") && (file.name=="productionConceptGraphs")) {
                jQuery("#hasPlexPcgFileBeenEstablishedContainer").html("YES");
                jQuery("#establishPlexPcgMutableFileButtonContainer").css("display","none")
            }
        }
        if (file.type=="file") {
            reportHTML += "<div style='margin-left:50px;background-color:orange;' >" + file.name + "</div>";
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
        await reportMutableFilesTree('/');

        jQuery("#establishPlexMutableFileButton").click(async function(){
            await MiscIpfsFunctions.ipfs.files.mkdir('/plex');
            alert("/plex has been created within the ipfs mutable file system")
        })

        jQuery("#establishPlexPcgMutableFileButton").click(async function(){
            await MiscIpfsFunctions.ipfs.files.mkdir('/plex/productionConceptGraphs');
            alert("/plex/productionConceptGraphs has been created within the ipfs mutable file system")
        })

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
                        new path (plex):<br/>
                        /plex/productionConceptGraphs/ipns to mainSchemaForConceptGraph for the concept graph (directory)/slug (wordSlug) for word (file)<br/>
                        <br/>
                        e.g.:<br/>
                        /plex/productionConceptGraphs/k2k4r8jya910bj45nxvwiw7pjqr611qv431331sx3py6ee2tiwxtmf6y/conceptFor_relationshipsTypes<br/>
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
                                Has /plex/productionConceptGraphs mutable file directory been established?
                                </div>

                                <div id="hasPlexPcgFileBeenEstablishedContainer" style={{display:"inline-block",marginLeft:"50px"}} >
                                ?
                                </div>

                                <div id="establishPlexPcgMutableFileButtonContainer"  >
                                    <div id="establishPlexPcgMutableFileButton" className="doSomethingButton" >establish mutable file: /plex/productionConceptGraphs</div>
                                </div>
                            </div>
                        </div>

                        <div id="ipfsMutableFilesListContainer" style={{marginTop:"20px",border:"1px dashed grey",padding:"5px",height:"400px",overflow:"scroll"}} ></div>

                    </div>
                </fieldset>
            </>
        );
    }
}
