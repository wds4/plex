import React from "react";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import Masthead from '../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/grapevine_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/grapevine_ratings_leftNav2.js';

const jQuery = require("jquery");

const reportMutableFilesTree = async (basePath,path) => {
    for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
        // console.log("path: "+path+"; file name: "+file.name)
        // console.log("path: "+path+"; file type: "+file.type)
        var pathTip = path.replace(basePath,"");
        var reportHTML = "";
        reportHTML += "<div >";

        // reportHTML += "<div style='margin-left:50px;' >cid: "+file.cid+"</div>";
        if (file.type=="directory") {
            // reportHTML += "<div style='display:inline-block;' >"+pathTip+"</div>";
            // reportHTML += "<div style='display:inline-block;margin-left:0px;background-color:yellow;' >" + file.name + "</div>";
            /*
            reportHTML += "<div class='doSomethingButton_tiny deleteDirectoryButton' style='background-color:#DFDFFF;' ";
            reportHTML += " data-filename='"+file.name+"' ";
            reportHTML += " data-path='"+path+"' ";
            reportHTML += " >";
            reportHTML += "delete directory";
            reportHTML += "</div>";
            */
        }
        if (file.type=="file") {
            reportHTML += "<div style='display:inline-block;' >"+pathTip+"</div>";
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
            /*
            reportHTML += "<div class='doSomethingButton_tiny deleteFileButton' ";
            reportHTML += " data-filename='"+file.name+"' ";
            reportHTML += " data-path='"+path+"' ";
            reportHTML += " >";
            reportHTML += "delete file";
            reportHTML += "</div>";
            */
        }
        reportHTML += "</div>";
        jQuery("#ipfsMutableFilesListContainer").append(reportHTML)
        if (file.type=="directory") {
            var newPath=path+file.name+"/";
            await reportMutableFilesTree(basePath,newPath)
        }
    }
}

export default class ShowAllRatings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var ipfsID = await MiscIpfsFunctions.returnIpfsID();
        var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug;
        var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
        var mainSchema_ipns = oMainSchema.metaData.ipns;
        var basePath = "/plex/conceptGraphs/"+mainSchema_ipns+"/concepts/conceptFor_rating/superset/allSpecificInstances/"
        await reportMutableFilesTree(basePath,basePath);
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
        var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug;
        var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
        var mainSchema_ipns = oMainSchema.metaData.ipns;
        var basePath = "/plex/conceptGraphs/"+mainSchema_ipns+"/concepts/conceptFor_rating/superset/allSpecificInstances/"
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Show All Ratings</div>
                        <div style={{border:"1px dashed grey",padding:"10px",fontSize:"12px"}} >
                        All ratings stored in Mutable File System under the concept for ratings:<br/>
                        {basePath}
                        </div>

                        <div id="ipfsMutableFilesListContainer" style={{marginTop:"20px",border:"1px dashed grey",padding:"5px",height:"800px",width:"800px",display:"inline-block",fontSize:"10px",overflow:"scroll"}} ></div>
                        <div style={{marginTop:"20px",display:"inline-block"}} >
                            <div>
                                cid: <div id="cidContainer" style={{display:"inline-block"}} > </div>
                            </div>
                            <pre id="selectedFileContentsContainer" style={{border:"1px dashed grey",padding:"5px",height:"800px",width:"600px",display:"inline-block",fontSize:"12px",overflow:"scroll"}} ></pre>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
