import React from "react";
import Masthead from '../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/cgFe_conceptGraphsMainPage_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphLib from '../../lib/ipfs/conceptGraphLib.js'
import * as GrapevineLib from '../../lib/ipfs/grapevineLib.js'
import sendAsync from '../../renderer.js';

const cg = ConceptGraphLib.cg;
const gv = GrapevineLib.gv;

const jQuery = require("jquery");

const generateNewConceptGraph = async () => {
    var oNewConceptGraph = await MiscFunctions.createNewWordByTemplate("conceptGraph");
    var newConceptGraphSlugField = jQuery("#newConceptGraphSlugField").val();
    var newConceptGraphNameField = jQuery("#newConceptGraphNameField").val();
    var newConceptGraphTitleField = jQuery("#newConceptGraphTitleField").val();
    var newConceptGraphDescriptionField = jQuery("#newConceptGraphDescriptionField").val();

    var newConceptGraphMainSchemaSlugField = jQuery("#newConceptGraphMainSchemaSlugField").val();

    // var myPeerID = await MiscIpfsFunctions.returnMyPeerID();
    // var myUsername = await MiscIpfsFunctions.returnMyUsername();

    var myPeerID = await cg.ipfs.returnMyPeerID();
    var myUsername = await cg.ipfs.returnMyUsername();

    var mCG = "myConceptGraph_"+newConceptGraphSlugField

    oNewConceptGraph.wordData.slug = newConceptGraphMainSchemaSlugField;
    oNewConceptGraph.conceptGraphData.slug = newConceptGraphSlugField;
    oNewConceptGraph.conceptGraphData.name = newConceptGraphNameField;
    oNewConceptGraph.conceptGraphData.title = newConceptGraphTitleField;
    oNewConceptGraph.conceptGraphData.description = newConceptGraphDescriptionField;
    oNewConceptGraph.globalDynamicData.myConceptGraphs = [mCG]
    oNewConceptGraph.metaData.stewardPeerID = myPeerID;
    oNewConceptGraph.metaData.stewardUsername = myUsername;
    oNewConceptGraph.metaData.lastUpdate = Date.now();

    jQuery("#newConceptGraphRawFileField").val(JSON.stringify(oNewConceptGraph,null,4))
}

const saveNewConceptGraph = async () => {
    var newConceptGraphRawFileField = jQuery("#newConceptGraphRawFileField").val();
    var oNewConceptGraph = JSON.parse(newConceptGraphRawFileField)
    var newConceptGraph_ipns = oNewConceptGraph.metaData.ipns;
    var newConceptGraph_slug = oNewConceptGraph.wordData.slug; // should be mainSchemaForConceptGraph

    var pCGb = window.ipfs.pCGb;
    var path = pCGb + newConceptGraph_ipns + "/words/" + newConceptGraph_slug + "/";
    var pathToFile = path + "node.txt";

    console.log("saveNewConceptGraph; path: "+path)
    console.log("saveNewConceptGraph; pathToFile: "+pathToFile)

    try { await MiscIpfsFunctions.ipfs.files.mkdir(path,{parents:true}) } catch (e) {}
    var fileToWrite = JSON.stringify(oNewConceptGraph,null,4)
    try { await MiscIpfsFunctions.ipfs.files.rm(pathToFile, {recursive: true}) } catch (e) {}
    try { await MiscIpfsFunctions.ipfs.files.write(pathToFile, new TextEncoder().encode(fileToWrite), {create: true, flush: true}) } catch (e) {}
}

export default class MakeNewConceptGraphPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        jQuery("#newConceptGraphNameField").change(function(){
            var newConceptGraphNameField = jQuery(this).val()
            var newConceptGraphSlug = MiscFunctions.convertNameToSlug(newConceptGraphNameField)
            var newConceptGraphTitle = MiscFunctions.convertNameToTitle(newConceptGraphNameField)
            jQuery("#newConceptGraphSlugField").val(newConceptGraphSlug);
            jQuery("#newConceptGraphTitleField").val(newConceptGraphTitle);
        })
        jQuery("#generateNewConceptGraphButton").click( async function(){
            await generateNewConceptGraph()
        })
        jQuery("#saveNewConceptGraphButton").click( async function(){
            await saveNewConceptGraph()
        })
        jQuery("#generateAndSaveNewConceptGraphButton").click( async function(){
            await generateNewConceptGraph()
            await saveNewConceptGraph()
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">Make New Concept Graph</div>

                        <div style={{marginTop:"50px"}}>
                            <div className="makeNewLeftPanel">
                            name
                            </div>
                            <textarea id="newConceptGraphNameField" className="makeNewRightPanel">
                            </textarea>
                            e.g. animal kingdom

                            <br/>

                            <div className="makeNewLeftPanel">
                            slug
                            </div>
                            <textarea id="newConceptGraphSlugField" className="makeNewRightPanel">
                            </textarea>
                            e.g. animalKingdom

                            <br/>

                            <div className="makeNewLeftPanel">
                            title
                            </div>
                            <textarea id="newConceptGraphTitleField" className="makeNewRightPanel">
                            </textarea>
                            e.g. Animal Kingdom

                            <br/>

                            <div className="makeNewLeftPanel">
                            description
                            </div>
                            <textarea id="newConceptGraphDescriptionField" className="makeNewRightPanel" style={{height:"50px"}}>
                            </textarea>
                            lorem ipsum

                            <br/>

                            <div className="makeNewLeftPanel">
                            slug
                            </div>
                            <textarea id="newConceptGraphMainSchemaSlugField" className="makeNewRightPanel" style={{backgroundColor:"#DFDFDF"}} >
                            mainSchemaForConceptGraph
                            </textarea>
                            mainSchemaForConceptGraph

                            <br/><br/>

                            <div id="generateNewConceptGraphButton" className="doSomethingButton" style={{marginLeft:"320px"}}>step 1: generate new Concept Graph file</div>
                            <br/>
                            <div id="saveNewConceptGraphButton" className="doSomethingButton" style={{marginLeft:"320px"}}>step 2: save new file into MFS</div>
                            <br/>
                            <div id="generateAndSaveNewConceptGraphButton" className="doSomethingButton" style={{marginLeft:"320px"}}>steps 1 and 2</div>

                            <br/><br/>

                            <div className="makeNewLeftPanel" >rawFile</div>
                            <textarea id="newConceptGraphRawFileField" className="makeNewRightPanel" style={{height:"500px",width:"800px",fontSize:"12px"}} >
                            </textarea>

                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
