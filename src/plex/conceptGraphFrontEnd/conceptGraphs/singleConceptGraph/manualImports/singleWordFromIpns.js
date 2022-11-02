import React from "react";
import Masthead from '../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/cgFe_singleConceptGraph_manualImports_leftNav2';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import * as ConceptGraphInMfsFunctions from '../../../../lib/ipfs/conceptGraphInMfsFunctions.js';

const jQuery = require("jquery"); 

const updateMainSchema = async () => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    console.log("updateMainSchema")
    var sWord = jQuery("#importedWordContainer2").val()
    var oWord = JSON.parse(sWord)
    var word_slug = oWord.wordData.slug

    var sMainSchema = jQuery("#mainSchemaContainer1").val()
    var oMainSchema = JSON.parse(sMainSchema)

    var aSetSlugs = [];
    jQuery(".setCheckbox").each(async function(i,obj){
        var set_slug = jQuery(this).data("slug")
        var isChecked = jQuery(this).prop("checked")
        console.log("set_slug: "+set_slug+"; isChecked: "+isChecked)
        if (isChecked) {
            aSetSlugs.push(set_slug)
        }
    })

    for (var s=0;s<aSetSlugs.length;s++) {
        var set_slug = aSetSlugs[s];
        var oSet = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,set_slug);
        var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
        oNewRel.nodeFrom.slug = word_slug;
        oNewRel.relationshipType.slug = "isASpecificInstanceOf";
        oNewRel.nodeTo.slug = set_slug;

        console.log("oNewRel: "+JSON.stringify(oNewRel,null,4))

        var oMiniWordLookup = {};
        oMiniWordLookup[word_slug] = oWord;
        oMiniWordLookup[set_slug] = oSet;
        oMainSchema = MiscFunctions.updateSchemaWithNewRel(oMainSchema,oNewRel,oMiniWordLookup)
    }

    jQuery("#mainSchemaContainer2").val(JSON.stringify(oMainSchema,null,4))
}

const makeSetSelector = async () => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    var concept_ipns = jQuery("#conceptSelector option:selected").data("ipns")
    var concept_slug = jQuery("#conceptSelector option:selected").data("slug")
    var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,concept_slug);
    var superset_slug = oConcept.conceptData.nodes.superset.slug;
    var oSuperset = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,superset_slug);
    var aSubsets = oSuperset.globalDynamicData.subsets;
    var superset_ipns = oSuperset.metaData.ipns;

    var checkboxesHTML = "";
    checkboxesHTML += "<div id='checkboxesBox' >";
    checkboxesHTML += "<div>";
    checkboxesHTML += "<input class='setCheckbox' type='checkbox' ";
    checkboxesHTML += " data-slug='"+superset_slug+"' ";
    checkboxesHTML += " data-ipns='"+superset_ipns+"' ";
    checkboxesHTML += " >";
    checkboxesHTML += "<span >"+superset_slug+"</span>";
    checkboxesHTML += "</div>";
    for (var s=0;s<aSubsets.length;s++) {
        var set_slug = aSubsets[s];
        var oSet = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,set_slug);
        var set_ipns = oSet.metaData.ipns;
        checkboxesHTML += "<div>";
        checkboxesHTML += "<input class='setCheckbox' type='checkbox' ";
        checkboxesHTML += " data-slug='"+set_slug+"' ";
        checkboxesHTML += " data-ipns='"+set_ipns+"' ";
        checkboxesHTML += " >";
        checkboxesHTML += "<span >"+set_slug+"</span>";
        checkboxesHTML += "</div>";
    }

    jQuery("#setCheckboxesContainer").html(checkboxesHTML);
    jQuery("#checkboxesBox").change(async function(){
        await updateMainSchema();
    })

    // Also: set up main schema for the selected concept
    var mainSchema_slug = oConcept.conceptData.nodes.schema.slug;
    var oMainSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,mainSchema_slug);

    jQuery("#mainSchemaContainer1").val(JSON.stringify(oMainSchema,null,4))
}

const makeConceptSelector = async () => {
    var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
    var pCGb = window.ipfs.pCGb;
    var path = pCGb + viewingConceptGraph_ipns + "/words/mainSchemaForConceptGraph/node.txt";
    console.log("AllConceptsTable path: "+path)
    var oConceptGraphMainSchema = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path)
    var aConceptList = oConceptGraphMainSchema.conceptGraphData.concepts.sort();

    var selectorHTML = "";
    selectorHTML += "<select id='conceptSelector' >";
    for (var c=0;c<aConceptList.length;c++) {
        var concept_slug = aConceptList[c];
        var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,concept_slug);
        if (oConcept) {
            var concept_name = oConcept.conceptData.name.singular;
            var concept_ipns = oConcept.metaData.ipns;
        }
        if (!oConcept) {
            var concept_name = "? ("+concept_slug+")";
            var concept_ipns = "?";
        }

        selectorHTML += "<option ";
        selectorHTML += " data-slug="+concept_slug+" ";
        selectorHTML += " data-ipns="+concept_ipns+" ";
        selectorHTML += " >";
        selectorHTML += concept_name;
        selectorHTML += "</option>";
    }

    selectorHTML += "</select>";

    jQuery("#conceptSelectorContainer").html(selectorHTML);
    await makeSetSelector();
    jQuery("#conceptSelector").change(async function(){
        await makeSetSelector();
    })
}

export default class ConceptGraphsFrontEndSingleConceptGraphManualImportsSingleWordByIpns extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;

        await makeConceptSelector();

        jQuery("#fetchWordButton").click(async function(){
            var ipns = jQuery("#ipnsContainer").val()
            // console.log("fetchWordButton; ipns: "+ipns)
            var path = "/ipns/"+ipns;
            // console.log("path: "+path)
            var oWord = await ConceptGraphInMfsFunctions.fetchObjectByCatIpfsPath(path);
            // console.log("fetchWordButton; ipns: "+ipns+"; oWord: "+JSON.stringify(oWord,null,4))
            jQuery("#importedWordContainer1").val(JSON.stringify(oWord,null,4))
        })

        jQuery("#convertToLocalButton").click(async function(){
            var sWord = jQuery("#importedWordContainer1").val()
            var oWord = JSON.parse(sWord)
            var oWordLocal = await ConceptGraphInMfsFunctions.convertExternalNodeToLocalWord(oWord);
            jQuery("#importedWordContainer2").val(JSON.stringify(oWordLocal,null,4))
        })

        jQuery("#importButton").click(async function(){
            var sWord = jQuery("#importedWordContainer2").val()
            var oWord = JSON.parse(sWord)

            var sMainSchema = jQuery("#mainSchemaContainer2").val()
            var oMainSchema = JSON.parse(sMainSchema)

            await ConceptGraphInMfsFunctions.addWordToMfsConceptGraph_specifyConceptGraph(viewingConceptGraph_ipns,oWord);
            await ConceptGraphInMfsFunctions.addWordToMfsConceptGraph_specifyConceptGraph(viewingConceptGraph_ipns,oMainSchema);

        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">Manual import single word into this Concept Graph from external source based on its IPNS</div>

                        <div style={{border:"1px solid green",display:"inline-block",width:"600px",height:"850px"}} >
                            <center>import word into currently-viewing Concept Graph</center>
                            <div id="conceptSelectorContainer" >conceptSelectorContainer</div>
                            <div id="setCheckboxesContainer" >setCheckboxesContainer</div>

                            <div style={{fontSize:"12px",padding:"10px"}}>
                            Import the word on the right (bottom, converted to local) into the currently-viewing-concept graph; add to appropriate spot in the MFS;
                            and update mainSchema for the above concept to make the new word a specific instance of the checkmarked sets.
                            </div>
                            <div className="doSomethingButton" id="importButton" >Import</div>

                            <textarea id="mainSchemaContainer1" style={{display:"inline-block",width:"95%",height:"200px"}} >
                            </textarea>

                            <textarea id="mainSchemaContainer2" style={{display:"inline-block",width:"95%",height:"200px"}} >
                            </textarea>

                        </div>

                        <div style={{border:"1px solid green",display:"inline-block",width:"600px",height:"850px"}} >
                            <center>import using IPNS into textarea</center>
                            Enter IPNS: <div id="fetchWordButton" className="doSomethingButton" >fetch</div>
                            <div id="convertToLocalButton" className="doSomethingButton" >convert to local</div>
                            <textarea id="ipnsContainer" style={{display:"inline-block",width:"95%",height:"30px"}} >
                            </textarea>
                            original:
                            <textarea id="importedWordContainer1" style={{display:"inline-block",width:"95%",height:"300px"}} >
                            </textarea>
                            converted to local:
                            <textarea id="importedWordContainer2" style={{display:"inline-block",width:"95%",height:"300px"}} >
                            </textarea>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
