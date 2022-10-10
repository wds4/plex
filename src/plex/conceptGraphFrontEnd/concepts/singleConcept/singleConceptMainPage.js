import React from "react";
import Masthead from '../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/cgFe_concepts_singleConcept_leftNav2';
import * as MiscIpfsFunctions from '../../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from '../../../lib/ipfs/conceptGraphInMfsFunctions.js'

const jQuery = require("jquery");

const openChildrenContainer = (parentNode_slug) => {
    jQuery("#childrenNodesContainer_"+parentNode_slug).css("display","block")
}

const closeChildrenContainer = (parentNode_slug) => {
    jQuery("#childrenNodesContainer_"+parentNode_slug).css("display","none")
}

const processClickedToggleButton = (node_slug) => {
    var status = jQuery("#toggleChildrenOfTypesButton_"+node_slug).data("status")
    console.log("node_slug: "+node_slug+"; status: "+status)
    if (status=="closed") {
        jQuery("#toggleChildrenOfTypesButton_"+node_slug).data("status","open")
        openChildrenContainer(node_slug)
    }
    if (status=="open") {
        jQuery("#toggleChildrenOfTypesButton_"+node_slug).data("status","closed")
        closeChildrenContainer(node_slug)
    }
}

const loadConceptData = async (cid) => {
    console.log("loadConceptData; cid: "+ typeof cid)
    for await (const chunk2 of MiscIpfsFunctions.ipfs.cat(cid)) {
        var chunk3 = new TextDecoder("utf-8").decode(chunk2);
        try {
            var oConcept = JSON.parse(chunk3);
            if (typeof oConcept == "object") {
                var concept_wordSlug = oConcept.wordData.slug;
                var concept_conceptTitle = oConcept.conceptData.title;
                jQuery("#conceptTitleContainer").html(concept_conceptTitle)
            } else {
            }
        } catch (e) {
            console.log("error: "+e)
        }
    }
}

const generateNodeHTML = async (nextNode_slug,lookupChildTypes,isTopLevel) => {
    var propertyPath = jQuery("#propertyPathContainer").html()

    var aChildren = lookupChildTypes[nextNode_slug]
    var numChildren = aChildren.length;

    var oNextNode = await ConceptGraphInMfsFunctions.lookupWordBySlug(nextNode_slug);
    if (oNextNode.hasOwnProperty(propertyPath)) {
        var nextNode_name = oNextNode[propertyPath].name;
    }
    if (!oNextNode.hasOwnProperty(propertyPath)) {
        if (oNextNode.hasOwnProperty("setData")) {
            var nextNode_name = oNextNode.setData.name;
        }
        if (oNextNode.hasOwnProperty("supersetData")) {
            var nextNode_name = oNextNode.supersetData.name;
        }
    }
    var nextNodeHTML = "";
    nextNodeHTML += "<div style='padding:2px;";
    nextNodeHTML += "' > ";
        nextNodeHTML += "<div>";
            nextNodeHTML += "<div id='toggleChildrenOfTypesButton_"+nextNode_slug+"' data-slug='"+nextNode_slug+"' data-status='closed' class='toggleChildrenOfTypesButton' ";
            if (oNodeRole[nextNode_slug]=="specificInstance")  { nextNodeHTML += " style='border:0px' "; }
            nextNodeHTML += " >";
            if (oNodeRole[nextNode_slug]=="set")  { nextNodeHTML += numChildren; }
            if (oNodeRole[nextNode_slug]=="specificInstance")  { nextNodeHTML += " * "; }

            nextNodeHTML += "</div>";

            nextNodeHTML += "<div id='typeNameContainer_"+nextNode_name+"' data-slug='"+nextNode_slug+"' class='typeNameContainer' ";
            if (oNodeRole[nextNode_slug]=="specificInstance")  { nextNodeHTML += " style='color:purple;' "; }
            nextNodeHTML += " >";
            nextNodeHTML += nextNode_name
            nextNodeHTML += "</div>";
        nextNodeHTML += "</div>";
        nextNodeHTML += "<div id='childrenNodesContainer_"+nextNode_slug+"' data-parentslug='"+nextNode_slug+"' class='childrenNodesContainer' style='display:none;' >";
        // nextNodeHTML += "<div id='childrenNodesContainer_"+nextNode_slug+"' data-parentslug='"+nextNode_slug+"' class='childrenNodesContainer' >";
        for (var c=0;c<aChildren.length;c++) {
            var nextChildNode_slug = aChildren[c];
            // nextNodeHTML += nextChildNode_slug + "<br>";
            nextNodeHTML += await generateNodeHTML(nextChildNode_slug,lookupChildTypes,false)
        }
        // nextNodeHTML += "childrenNodesContainer";
        nextNodeHTML += "</div>";
    nextNodeHTML += "</div>";

    return nextNodeHTML;
}

var oNodeRole = {};

const generateConceptFullHierarchy = async (oConcept) => {
    var propertyPath = jQuery("#propertyPathContainer").html()
    jQuery("#fullHierarchyContainer").html("")
    // var superset_slug = oConcept.conceptData.nodes.superset.slug;
    // var oSuperset = await ConceptGraphInMfsFunctions.lookupWordBySlug(superset_slug)

    var mainSchema_slug = oConcept.conceptData.nodes.schema.slug;
    var oMainSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug(mainSchema_slug)
    console.log("mainSchema_slug: "+mainSchema_slug+"; oMainSchema: "+JSON.stringify(oMainSchema,null,4))
    var aNodes = oMainSchema.schemaData.nodes;
    var aRels = oMainSchema.schemaData.relationships;
    var lookupChildTypes = {};
    var lookupParentTypes = {};
    for (var n=0;n<aNodes.length;n++) {
        var nextNode_slug = aNodes[n].slug;
        if (!lookupChildTypes.hasOwnProperty(nextNode_slug)) {
            lookupChildTypes[nextNode_slug] = [];
        }
        if (!lookupParentTypes.hasOwnProperty(nextNode_slug)) {
            lookupParentTypes[nextNode_slug] = [];
        }
    }
    for (var r=0;r<aRels.length;r++) {
        var oNextRel = aRels[r];
        var relType = oNextRel.relationshipType.slug;
        var nF_slug = oNextRel.nodeFrom.slug;
        var nT_slug = oNextRel.nodeTo.slug;
        var oNF = await ConceptGraphInMfsFunctions.lookupWordBySlug(nF_slug)
        var oNT = await ConceptGraphInMfsFunctions.lookupWordBySlug(nT_slug)

        var isSpecificInstance_nF = false;
        if ( oNF.hasOwnProperty(propertyPath) ) {
            isSpecificInstance_nF = true;
        }

        var isSet_nF = false;
        if ( oNF.hasOwnProperty("setData") || oNF.hasOwnProperty("supersetData") ) {
            isSet_nF = true;
        }
        var isSet_nT = false;
        if ( (oNT.hasOwnProperty("setData")) || (oNT.hasOwnProperty("supersetData")) ) {
            isSet_nT = true;
        }
        if ((isSet_nF) && (isSet_nT)) {
            if (relType="subsetOf") {
                oNodeRole[nF_slug] = "set"
                oNodeRole[nT_slug] = "set"
                var childNode_slug = oNextRel.nodeFrom.slug;
                var parentNode_slug = oNextRel.nodeTo.slug;
                if (!lookupChildTypes[parentNode_slug].includes(childNode_slug)) {
                    lookupChildTypes[parentNode_slug].push(childNode_slug)
                }
                if (!lookupParentTypes[childNode_slug].includes(parentNode_slug)) {
                    lookupParentTypes[childNode_slug].push(parentNode_slug)
                }
            }
        }
        if ((isSpecificInstance_nF) && (isSet_nT)) {
            if (relType="isASpecificInstanceOf") {
                oNodeRole[nF_slug] = "specificInstance"
                oNodeRole[nT_slug] = "set"
                var childNode_slug = oNextRel.nodeFrom.slug;
                var parentNode_slug = oNextRel.nodeTo.slug;
                if (!lookupChildTypes[parentNode_slug].includes(childNode_slug)) {
                    lookupChildTypes[parentNode_slug].push(childNode_slug)
                }
                if (!lookupParentTypes[childNode_slug].includes(parentNode_slug)) {
                    lookupParentTypes[childNode_slug].push(parentNode_slug)
                }
            }
        }
    }
    // a topLevelType is a node that has no parents
    var aTopLevelTypes = [];
    for (var n=0;n<aNodes.length;n++) {
        var nextNode_slug = aNodes[n].slug;
        var oNxtNde = await ConceptGraphInMfsFunctions.lookupWordBySlug(nextNode_slug)
        var isMainPropertiesSet_nxtNode = false;
        var isSet_nxtNde = false;
        if ( oNxtNde.hasOwnProperty("setData") || oNxtNde.hasOwnProperty("supersetData") ) {
            isSet_nxtNde = true;
            if (oNxtNde.hasOwnProperty("setData")) {
                if (oNxtNde.setData.metaData.types.includes("mainPropertiesSet")) {
                    isMainPropertiesSet_nxtNode = true;
                }
            }
        }
        var numParentNodes =lookupParentTypes[nextNode_slug]
        if ((isSet_nxtNde) && (numParentNodes==0) && (!isMainPropertiesSet_nxtNode)) {
            aTopLevelTypes.push(nextNode_slug);
        }
    }
    console.log("aTopLevelTypes: "+JSON.stringify(aTopLevelTypes,null,4))
    for (var n=0;n<aTopLevelTypes.length;n++) {
        var nextNode_slug = aTopLevelTypes[n];
        var nextNodeHTML = await generateNodeHTML(nextNode_slug,lookupChildTypes,true)
        jQuery("#fullHierarchyContainer").append(nextNodeHTML)
    }
}

export default class ConceptGraphsFrontEnd_SingleConceptMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var conceptSlug = this.props.match.params.conceptslug;
        var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug(conceptSlug)
        var propertyPath = oConcept.conceptData.propertyPath;
        jQuery("#propertyPathContainer").html(propertyPath)
        // console.log("conceptSlug: "+conceptSlug+"; oConcept: "+JSON.stringify(oConcept,null,4))
        jQuery("#conceptTitleContainer").html(oConcept.wordData.title)

        await generateConceptFullHierarchy(oConcept)

        jQuery(".toggleChildrenOfTypesButton").click(function(){
            var node_slug = jQuery(this).data("slug")
            processClickedToggleButton(node_slug);
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
                        <div class="h2">
                            <div style={{display:"inline-block",fontSize:"14px",marginRight:"20px",verticalAlign:"middle"}}>concept title: </div>
                            <div id="conceptTitleContainer" style={{display:"inline-block",marginRight:"20px"}}>conceptTitleContainer</div>
                        </div>

                        <div style={{marginTop:"20px"}}>
                            <div id="propertyPathContainer">propertyPathContainer</div>

                            <div style={{display:"inline-block",width:"600px",height:"800px",border:"1px dashed grey"}} >
                                <center>Content: Hierarchical View</center>
                                <div id="fullHierarchyContainer" style={{overflow:"scroll"}} ></div>
                            </div>
                            <div style={{display:"inline-block",width:"600px",height:"800px",border:"1px dashed grey"}} >
                                <textarea id="dataModelSchemaRawFileContainer" style={{display:"inline-block",width:"95%",height:"700px"}} >dataModelSchemaRawFileContainer</textarea>
                            </div>
                        </div>


                    </div>
                </fieldset>
            </>
        );
    }
}
