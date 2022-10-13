import React from 'react';
import PlexMasthead from './mastheads/plexMasthead.js';
import LeftNavbar1 from './navbars/leftNavbar1/plex_leftNav1';
// import * as LoadActiveIpfsConceptGraph from './lib/ipfs/loadActiveIpfsConceptGraph.js'
import * as ConceptGraphInMfsFunctions from './lib/ipfs/conceptGraphInMfsFunctions.js'

const jQuery = require("jquery");

export default class PlexHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");

        // 9 Oct 2022
        // It is important to do this step to initialize window.ipfs
        await ConceptGraphInMfsFunctions.loadActiveIpfsConceptGraph();
        await ConceptGraphInMfsFunctions.loadNeuroCore3ConceptGraph()


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
