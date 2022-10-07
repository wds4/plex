import React from 'react';
import Masthead from '../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/cgFe_manageDownloads_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from '../../lib/ipfs/conceptGraphInMfsFunctions.js'
// import * as InitDOMFunctions from '../functions/transferSqlToDOM.js';

const jQuery = require("jquery");

export default class ManageConceptGraphDownload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var oIpfsID = await MiscIpfsFunctions.ipfs.id();
        var myPeerID = oIpfsID.id;

        var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug
        var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
        var mainSchema_ipns = oMainSchema.metaData.ipns;
        console.log("mainSchema_ipns: "+mainSchema_ipns)
        jQuery("#mainSchemaSeedIPNSContainer").html(mainSchema_ipns)

        jQuery("#storeSeedMSFCGButton").click(async function(){
            console.log("storeSeedMSFCGButton clicked")
            var newIPNS = await ConceptGraphInMfsFunctions.addConceptGraphSeedToMFS(oMainSchema)
        })
        jQuery("#updateSeedMSFCGButton").click(async function(){
            console.log("storeSeedMSFCGButton clicked")
            // await ConceptGraphInMfsFunctions.updateConceptGraphSeedToMFS(oMainSchema)
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
                        <div class="h2">Manage mainSchemaForConceptGraph</div>

                        <div style={{border:"1px dashed grey",padding:"5px",fontSize:"12px",marginTop:"20px"}} >
                            <div>
                                <div style={{display:"inline-block",width:"500px"}} >
                                mainSchemaForConceptGraph IPNS (seed):
                                </div>
                                <div id="mainSchemaSeedIPNSContainer" style={{display:"inline-block"}} >
                                </div>
                                <div className="doSomethingButton_small" id="storeSeedMSFCGButton" >plant seed</div>
                                <div className="doSomethingButton_small" id="updateSeedMSFCGButton" >update seed</div>
                            </div>
                            <div >
                            This is the seed IPNS which will be used to download the default Concept Graph from an external source.
                            Once downloaded, the mainSchemaForConceptGraph will be given a new IPNS, with the old one archived in metaData.
                            Next, each word will be placed in the MFS and given a new, local IPNS address. The same keynames will be used if present.
                            The old IPNS, author (if known), and keyname will be recorded.
                            </div>
                            <div >
                            pCG0 = /plex/conceptGraphs/mainSchemaForConceptGraph/node.txt -- IPNS will be derived from this.
                            </div>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
