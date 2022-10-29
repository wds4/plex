import React from 'react';
import PlexMasthead from './mastheads/plexMasthead.js';
import LeftNavbar1 from './navbars/leftNavbar1/plex_leftNav1';
// import * as LoadActiveIpfsConceptGraph from './lib/ipfs/loadActiveIpfsConceptGraph.js'
import * as ConceptGraphInMfsFunctions from './lib/ipfs/conceptGraphInMfsFunctions.js'
import * as MiscIpfsFunctions from './lib/ipfs/miscIpfsFunctions.js'

const jQuery = require("jquery"); 

export default class PlexHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");

        if (!window.ipfs.isEstablishedYet_oMainSchemaForConceptGraphLocal) {
            var oIpfsID = await MiscIpfsFunctions.ipfs.id();
            var myPeerID = oIpfsID.id;
            var keyname_forActiveCGPathDir = "plex_pathToActiveConceptGraph_"+myPeerID.slice(-10);
            var ipns_forActiveCGPathDir = await ConceptGraphInMfsFunctions.returnIPNSForActiveCGPathDir(keyname_forActiveCGPathDir)
            var ipns10_forActiveCGPathDir = ipns_forActiveCGPathDir.slice(-10);
            var pathToLocalMSFCG = "/plex/conceptGraphs/"+ipns10_forActiveCGPathDir+"/mainSchemaForConceptGraph/node.txt";
            var oMainSchemaForConceptGraphLocal = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(pathToLocalMSFCG)
            if (oMainSchemaForConceptGraphLocal) {
                window.ipfs.isEstablishedYet_oMainSchemaForConceptGraphLocal = true;
                console.log("oMainSchemaForConceptGraphLocal has been established")
            }
        }
        if (!window.ipfs.isEstablishedYet_oMainSchemaForConceptGraphLocal) {
            var mainSchema_external_ipns = window.ipfs.mainSchemaForConceptGraph_defaultExternalIPNS
            await ConceptGraphInMfsFunctions.addConceptGraphSeedToMFS(mainSchema_external_ipns,ipns10_forActiveCGPathDir);
        }

        if (window.ipfs.updatesSinceLastRefresh) {
            await ConceptGraphInMfsFunctions.loadActiveIpfsConceptGraph();
            await ConceptGraphInMfsFunctions.loadNeuroCore3ConceptGraph()
            window.ipfs.updatesSinceLastRefresh = false;
        }
        if (!window.ipfs.mfsDirectoriesEstablished) {
            window.ipfs.mfsDirectoriesEstablished = await ConceptGraphInMfsFunctions.areMfsDirectoriesEstablished();
            console.log("window.ipfs.mfsDirectoriesEstablished: "+window.ipfs.mfsDirectoriesEstablished)
        }
        if (!window.ipfs.mfsDirectoriesEstablished) {
            await ConceptGraphInMfsFunctions.establishMfsDirectories();
        }


        // old way: oWord = window.lookupWordBySlug(slug)
        // new way: oWord = await ConceptGraphInMfsFunctions.lookupWordBySlug(slug)
        // In both cases, slug = wordData.slug (a.k.a. "wordSlug")
        // Future:
        // oWord = await ConceptGraphInMfsFunctions.lookupWordByIPNS(ipns)
        // or:
        // oWord = await ConceptGraphInMfsFunctions.lookupWordByWtSlug(slug) where slug can be [mainWordType]Data.slug
        // will cycle through each wT in wordTypes, and if get null, then try the next wordType, in order
        // or:
        // oWord = await ConceptGraphInMfsFunctions.lookupWordByUniqueID(uniqueID) where uniqueID can be any of the above unique identifiers
        // Will cycle through each type of uniqueID, and if get null, then will try the next type of uniqueID, in order:
        // 1. wordSlug (wordData.slug)
        // 2. ipns (metaData.ipns)
        // 3. cycle through each wordType (including word, although this might be redundant); look up each unique top-level property for that concept; try each one
        // test:
        // var slug = "conceptFor_rating";
        // var oConceptForRating = await ConceptGraphInMfsFunctions.lookupWordBySlug(slug)
        // console.log("oConceptForRating: "+JSON.stringify(oConceptForRating,null,4))
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <PlexMasthead />
                        <div class="h2">Plex Home</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
