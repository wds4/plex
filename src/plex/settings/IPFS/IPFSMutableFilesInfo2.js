import React from "react";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/ipfs_leftNav2';

const jQuery = require("jquery");

const reportMutableFilesTree = async (path) => {
    for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
        // console.log("path: "+path+"; file name: "+file.name)
        // console.log("path: "+path+"; file type: "+file.type)
        var reportHTML = "";
        reportHTML += "<div >";
        reportHTML += "<div style='display:inline-block;' >"+path+"</div>";
        // reportHTML += "<div style='margin-left:50px;' >cid: "+file.cid+"</div>";
        if (file.type=="directory") {
            reportHTML += "<div style='display:inline-block;margin-left:0px;background-color:yellow;' >" + file.name + "</div>";
            reportHTML += "<div class='doSomethingButton_tiny deleteDirectoryButton' style='background-color:#DFDFFF;' ";
            reportHTML += " data-filename='"+file.name+"' ";
            reportHTML += " data-path='"+path+"' ";
            reportHTML += " >";
            reportHTML += "delete directory";
            reportHTML += "</div>";
        }
        if (file.type=="file") {
            var ipfsPath = path + file.name;
            var isFileValidObj = await MiscIpfsFunctions.isMfsFileValidObj(ipfsPath)
            reportHTML += "<div class=ipfsMutableFilesFileContainer style='display:inline-block;margin-left:0px;";
            if (isFileValidObj) { reportHTML += "background-color:orange;"; }
            if (!isFileValidObj) { reportHTML += "background-color:red;color:white;"; }
            reportHTML += "' ";
            reportHTML += " data-filename='"+file.name+"' ";
            reportHTML += " data-path='"+path+"' ";
            reportHTML += " data-cid='"+file.cid+"' ";
            reportHTML += " >";
            reportHTML += file.name ;
            reportHTML += "</div>";
            reportHTML += "<div class='doSomethingButton_tiny deleteFileButton' ";
            reportHTML += " data-filename='"+file.name+"' ";
            reportHTML += " data-path='"+path+"' ";
            reportHTML += " >";
            reportHTML += "delete file";
            reportHTML += "</div>";
            if ( (path=="/grapevineData/userProfileData/") && (file.name=="myProfile.txt")) {
                jQuery("#hasGrapevineDataUsersMyProfileTxtBeenEstablishedContainer").html("YES");
                jQuery("#establishGrapevineDataUsersMyProfileMutableFileButton").css("display","none")
            }
        }
        reportHTML += "</div>";
        jQuery("#ipfsMutableFilesListContainer").append(reportHTML)
        if (file.type=="directory") {

            var newPath=path+file.name+"/";
            await reportMutableFilesTree(newPath)
        }
    }
}

export default class IPFSMutableFilesInfoPage2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var ipfsID = await MiscIpfsFunctions.returnIpfsID();
        await reportMutableFilesTree('/');
        MiscFunctions.timeout(100);
        jQuery(".deleteFileButton").click(async function(){
            var fileName = jQuery(this).data("filename")
            var path = jQuery(this).data("path")
            // var ipfsPath = "/ipns/" + ipfsID + path + fileName;
            var ipfsPathToFileToRemove = path + fileName;
            console.log("deleteFileButton clicked; fileName: "+fileName+"; ipfsPathToFileToRemove: "+ipfsPathToFileToRemove)
            await MiscIpfsFunctions.ipfs.files.rm(ipfsPathToFileToRemove)
        });
        jQuery(".deleteDirectoryButton").click(async function(){
            var fileName = jQuery(this).data("filename")
            var path = jQuery(this).data("path")
            // var ipfsPath = "/ipns/" + ipfsID + path + fileName;
            var ipfsPathToDirectoryToRemove = path + fileName;
            console.log("deleteDirectoryButton clicked; fileName: "+fileName+"; ipfsPathToDirectoryToRemove: "+ipfsPathToDirectoryToRemove)
            await MiscIpfsFunctions.ipfs.files.rm(ipfsPathToDirectoryToRemove, { recursive: true })
        });

        jQuery(".ipfsMutableFilesFileContainer").click(async function(){
            var fileName = jQuery(this).data("filename")
            var path = jQuery(this).data("path")
            var cid = jQuery(this).data("cid")
            jQuery("#cidContainer").html(cid)
            var ipfsPath = "/ipns/" + ipfsID + path + fileName;
            var ipfsPathB = path + fileName;
            // console.log("ipfsMutableFilesFileContainer clicked; fileName: "+fileName+"; ipfsPath: "+ipfsPath)
            var chunks = []
            for await (const chunk2 of MiscIpfsFunctions.ipfs.files.read(ipfsPathB)) {
                chunks.push(chunk2)
                // console.info("chunk2: "+chunk2)
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
                        <div className="h2">IPFS Mutable Files Info Page 2</div>

                        <div>

                            <div id="ipfsMutableFilesListContainer" style={{marginTop:"20px",border:"1px dashed grey",padding:"5px",height:"800px",width:"800px",display:"inline-block",fontSize:"10px",overflow:"scroll"}} ></div>
                            <div style={{marginTop:"20px",display:"inline-block"}} >
                                <div>
                                    cid: <div id="cidContainer" style={{display:"inline-block"}} > </div>
                                </div>
                                <pre id="selectedFileContentsContainer" style={{border:"1px dashed grey",padding:"5px",height:"800px",width:"600px",display:"inline-block",fontSize:"12px",overflow:"scroll"}} ></pre>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
