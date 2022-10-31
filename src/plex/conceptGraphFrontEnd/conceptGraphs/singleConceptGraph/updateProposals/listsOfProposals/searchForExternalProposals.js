import React from "react";
import Masthead from '../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/cgFe_singleConceptGraph_updates_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../../../lib/ipfs/conceptGraphInMfsFunctions.js';

const jQuery = require("jquery");

export default class ConceptGraphsFrontEndExternalUpdateProposals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;

        // Fetch list of users. Multiple ways to do this.
        // (For now, fetch from grapevineData, which is the publically available file with list of peerIDs.
        // Future: obtain list from the appropriate set from the active concept graph.)
        var path = "/grapevineData/users/masterUsersList.txt";
        var aMasterUsersList =  await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path);
        console.log("aMasterUsersList: "+JSON.stringify(aMasterUsersList,null,4))

        for (var u=0;u<aMasterUsersList.length;u++) {
            var peerID = aMasterUsersList[u];
            path = "/ipns/"+peerID+"/plex/conceptGraphs/public/updateProposals/node.txt";
            var updateProposals =  await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path);
            if (!updateProposals) { updateProposals = {};  }
            console.log("peerID: "+peerID+"; updateProposals: "+JSON.stringify(updateProposals,null,4))
        }
        // var path = "/plex/conceptGraphs/public/updateProposals/node.txt";
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">Search for All Update Proposals from External Nodes</div>

                        <div style={{fontSize:"12px"}}>
                        Cycle through the list of *trusted* contacts (influenceType: ontology; context: everything; threshold: adjustable; -- able to be adjusted)
                        and scrape the list of all known updateProposals from /plex/conceptGraphs/public/updateProposals/node.txt.
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
