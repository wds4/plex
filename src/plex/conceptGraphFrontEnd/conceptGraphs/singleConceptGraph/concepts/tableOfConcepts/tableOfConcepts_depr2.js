import React from "react";
import { Link } from "react-router-dom";
import Masthead from '../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/cgFe_concepts_leftNav2';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from '../../../lib/ipfs/conceptGraphInMfsFunctions.js'
import sendAsync from '../../../renderer.js';

const jQuery = require("jquery");

const showDeveloperElements = () => {
    console.log("showDeveloperElements")
    jQuery("#toggleDeveloperElementsButton").data("status","show");
    jQuery("#toggleDeveloperElementsButton").css("background-color","green");
    var setsContainerHeight = jQuery("#developerElementsInternalContainer").css("height");
    var setsContainerHeight = parseInt(setsContainerHeight.slice(0,-2)) + 15;
    setsContainerHeight += "px";

    jQuery("#developerElementsContainer").animate({
        height: "400px",
        padding: "3px",
        borderWidth:"1px"
    },500);
}

const hideDeveloperElements = () => {
    console.log("hideDeveloperElements")
    jQuery("#toggleDeveloperElementsButton").data("status","hidden");
    jQuery("#toggleDeveloperElementsButton").css("background-color","#EFEFEF");

    jQuery("#developerElementsContainer").animate({
        height: "0px",
        padding: "0px",
        borderWidth:"0px"
    },500);
}

var aConceptCidList = [];

var cidNum = 0;

// This is the hackiest hack of mine I can think of.
// Somehow passing cid (an object) into the DOM as data-cid converts it to a string when I pull it back out.
// There's surely a standard way to convert a cid object into a string; I just haven't found it yet and this works for now.
const convertCidToString = (inputCid) => {
    var cidHTML = "";
    cidHTML += "<div ";
    cidHTML += " id='inputCid_"+cidNum+"' ";
    cidHTML += " data-cid='"+inputCid+"' ";
    cidHTML += " >";
    cidHTML += "</div>";
    jQuery("#cidConversionContainer").html(cidHTML)
    var outputCid = jQuery("#inputCid_"+cidNum).data("cid")
    cidNum++;
    return outputCid;
}

const addConceptFile = async (cid) => {
    // console.log("addConceptFile; cid: "+ typeof cid)
    var cidHTML = "";
    cidHTML += "<div>"+cid+"</div>";
    jQuery("#cidListContainer").append(cidHTML)
    var decodedCid = convertCidToString(cid)
    // console.log("addConceptFile decodedCid: "+typeof decodedCid)
    if (!aConceptCidList.includes(decodedCid)) {
        aConceptCidList.push(decodedCid)

        for await (const chunk2 of MiscIpfsFunctions.ipfs.cat(cid)) {
        // amazingly, this works and produces the same result with cid (which is an object) and with decodedCid (which is a string)
        // for await (const chunk2 of MiscIpfsFunctions.ipfs.cat(decodedCid)) {
            var chunk3 = new TextDecoder("utf-8").decode(chunk2);
            try {
                var oConcept = JSON.parse(chunk3);
                if (typeof oConcept == "object") {
                    var concept_wordSlug = oConcept.wordData.slug;
                    var concept_conceptTitle = oConcept.conceptData.title;
                    var cidHTML = "";
                    cidHTML += "<div>";
                        cidHTML += "<div class='doSomethingButton_small ipfsMutableFilesConceptContainer' ";
                        cidHTML += " data-cid='"+cid+"' ";
                        cidHTML += " data-wordslug='"+concept_wordSlug+"' ";
                        cidHTML += " data-concepttitle='"+concept_conceptTitle+"' ";
                        cidHTML += " >";
                        cidHTML += "Show rawFile";
                        cidHTML += "</div>";

                        cidHTML += "<div class='goToSingleConceptPageButton' style='display:inline-block;margin-left:10px;' ";
                        cidHTML += " data-cid='"+cid+"' ";
                        cidHTML += " data-wordslug='"+concept_wordSlug+"' ";
                        cidHTML += " data-concepttitle='"+concept_conceptTitle+"' ";
                        cidHTML += " >";
                        cidHTML += "<div>"+concept_conceptTitle+"</div>";
                    cidHTML += "</div>";
                    jQuery("#listOfAllConceptsContainer").append(cidHTML)

                } else {
                }
            } catch (e) {
                console.log("error: "+e)
            }
        }
    }
}

const reportConceptsFromMutableFiles = async (pCG0,path,currDepth) => {
    var pathMinusPrefix = path.replace(pCG0,"./")
    for await (const file of MiscIpfsFunctions.ipfs.files.ls(path)) {
        var fileName = file.name;
        var fileType = file.type;
        var fileCid = file.cid;
        console.log("path: "+path+"; file name: "+fileName)
        // console.log("path: "+path+"; file type: "+fileType)
        var reportHTML = "";
        reportHTML += "<div>";
        reportHTML += "<div style='display:inline-block;' >"+pathMinusPrefix+"</div>";
        if (fileType=="directory") {
            reportHTML += "<div style='display:inline-block;background-color:yellow;' >" + fileName + "</div>";
        }
        if (fileType=="file") {
            reportHTML += "<div class=ipfsMutableFilesFileContainer style='display:inline-block;background-color:orange;' ";
            reportHTML += " data-filename='"+fileName+"' ";
            reportHTML += " data-path='"+path+"' ";
            reportHTML += " data-cid='"+fileCid+"' ";
            reportHTML += " >";
            reportHTML += fileName;
            reportHTML += "</div>";
            if (fileName=="node.txt") {
                await addConceptFile(fileCid)
            }
        }
        reportHTML += "</div>";
        jQuery("#listOfAllPathsContainer").append(reportHTML)
        if (file.type=="directory") {
            var newPath=path+file.name+"/";
            var nextDepth = currDepth + 1;
            if (nextDepth < 2) {
                await reportConceptsFromMutableFiles(pCG0,newPath,nextDepth)
            }
        }
    }
}

export default class AllConceptsInMFS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conceptLinks: []
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        cidNum = 0;
        aConceptCidList = [];
        var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug
        var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
        var mainSchema_ipns = oMainSchema.metaData.ipns;
        var pCG = "/plex/conceptGraphs/";
        var pCG0 = pCG + mainSchema_ipns + "/concepts/";
        var isThisConceptGraphPresentInMFS = false;
        for await (const file of MiscIpfsFunctions.ipfs.files.ls(pCG)) {
            if (file.name==mainSchema_ipns) {
                isThisConceptGraphPresentInMFS = true;
            }
        }
        if (isThisConceptGraphPresentInMFS) {
            var depth = 0;
            console.log("isThisConceptGraphPresentInMFS: "+isThisConceptGraphPresentInMFS)
            await reportConceptsFromMutableFiles(pCG0,pCG0,depth)
            console.log("aConceptCidList: "+JSON.stringify(aConceptCidList,null,4))

            // create links to individual view / edit existing wordType page
            for (var c=0;c<aConceptCidList.length;c++) {
                var nextConceptCid = aConceptCidList[c];
                var oConceptData = {};
                oConceptData.pathname = "/ConceptGraphsFrontEnd_SingleConceptMainPage/"+nextConceptCid;
                oConceptData.conceptcid = nextConceptCid;
                oConceptData.conceptlink = 'linkFrom_'+nextConceptCid;
                this.state.conceptLinks.push(oConceptData)
                this.forceUpdate();
            }

            jQuery(".goToSingleConceptPageButton").click(async function(){
                var cid = jQuery(this).data("cid")
                console.log("goToSingleConceptPageButton; cid: "+cid)
                jQuery("#linkFrom_"+cid).get(0).click();
            })

            jQuery(".ipfsMutableFilesConceptContainer").click(async function(){
                var cid = jQuery(this).data("cid")
                jQuery("#cidToThisConceptContainer").html(cid)
                for await (const chunk2 of MiscIpfsFunctions.ipfs.cat(cid)) {
                    var chunk3 = new TextDecoder("utf-8").decode(chunk2);
                    try {
                        var oConcept = JSON.parse(chunk3);
                        if (typeof oConcept == "object") {
                            var chunk5 = JSON.stringify(oConcept,null,4);
                            jQuery("#clickedConceptRawFileContainer").html(chunk5)
                        } else {
                            jQuery("#clickedConceptRawFileContainer").html(chunk3)
                        }
                    } catch (e) {
                        console.log("error: "+e)
                        jQuery("#clickedConceptRawFileContainer").html(chunk3)
                    }
                }
            })
        }
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <Masthead />
                        <div class="h2">All Concepts (corresponding to this Concept Graph) from the Mutable File System</div>
                        <div style={{fontSize:"12px",marginBottom:"10px",textAlign:"center"}} >
                            All concepts found in the Mutable File System that correspond to this Concept Graph.
                        </div>

                        <div id="cidConversionContainer" style={{display:"none"}} >
                        cidConversionContainer
                        </div>

                        <div style={{display:"none"}} >
                        {this.state.conceptLinks.map(link => (
                            <div >
                                <Link id={link.conceptlink} class='navButton'
                                  to={link.pathname}
                                >{link.conceptcid}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div style={{height:"800px",overflow:"scroll"}}>
                            <div style={{display:"inline-block",height:"100%"}} >
                                <div id="listOfAllConceptsContainer" style={{display:"inline-block",width:"400px",border:"1px dashed purple",height:"95%",overflow:"scroll"}} >
                                    <center>All Concepts</center>
                                    <div style={{fontSize:"10px",textAlign:"center",marginBottom:"10px"}} >Click on concept title to go to overview page</div>
                                </div>
                            </div>

                            <div style={{display:"inline-block",height:"100%"}} >
                                <div style={{marginBottom:"5px"}}>
                                    cid = <div style={{display:"inline-block"}} id="cidToThisConceptContainer" >cidToThisConceptContainer</div>
                                </div>
                                <textarea id="clickedConceptRawFileContainer" style={{display:"inline-block",width:"600px",height:"95%",border:"1px dashed grey",overflow:"scroll"}} ></textarea>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
