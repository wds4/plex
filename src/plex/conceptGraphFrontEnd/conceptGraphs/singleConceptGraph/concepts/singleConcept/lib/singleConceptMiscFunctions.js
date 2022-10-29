
export const generateNodeHTML = async (nextNode_slug,lookupChildTypes,isTopLevel) => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    var propertyPath = jQuery("#propertyPathContainer").html()

    var aChildren = lookupChildTypes[nextNode_slug]
    var numChildren = aChildren.length;

    var oNextNode = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nextNode_slug);
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

            nextNodeHTML += "<div id='nodeNameContainer_"+nextNode_name+"' data-slug='"+nextNode_slug+"' class='nodeNameContainer' ";
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

var aAllSets = [];

export const generateConceptFullHierarchy = async (oConcept) => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    var propertyPath = jQuery("#propertyPathContainer").html()
    jQuery("#fullHierarchyContainer").html("")

    var mainSchema_slug = oConcept.conceptData.nodes.schema.slug;
    var oMainSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,mainSchema_slug)
    // console.log("mainSchema_slug: "+mainSchema_slug+"; oMainSchema: "+JSON.stringify(oMainSchema,null,4))
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
        var oNF = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nF_slug)
        var oNT = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nT_slug)

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
                if (!aAllSets.includes(nF_slug)) {
                    aAllSets.push(nF_slug)
                }
                if (!aAllSets.includes(nT_slug)) {
                    aAllSets.push(nT_slug)
                }
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
                if (!aAllSets.includes(nT_slug)) {
                    aAllSets.push(nT_slug)
                }
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
        var oNxtNde = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,nextNode_slug)
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
