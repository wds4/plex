import React from 'react';
import Masthead from '../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/cgFe_singleConceptGraph_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../lib/ipfs/conceptGraphInMfsFunctions.js';
// import * as MiscFunctions from '../../../functions/miscFunctions.js';
// import * as InitDOMFunctions from '../../../functions/transferSqlToDOM.js';

const jQuery = require("jquery");

export default class SingleConceptGraphFrontEndMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
            viewingConceptGraphSlug: window.frontEndConceptGraph.viewingConceptGraph.slug,
            viewingConceptGraphIPNS: window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var pCGb = window.ipfs.pCGb;
        var ipnsForMainSchemaForConceptGraph = this.props.match.params.ipnsForMainSchemaForConceptGraph
        if (ipnsForMainSchemaForConceptGraph == "current") {
            ipnsForMainSchemaForConceptGraph = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph
        }
        var conceptGraphDirectoryName = ipnsForMainSchemaForConceptGraph
        var path = pCGb + conceptGraphDirectoryName + "/words/mainSchemaForConceptGraph/node.txt"
        var oMainSchemaForConceptGraph = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(path)
        var cgSlug = oMainSchemaForConceptGraph.conceptGraphData.slug;
        var cgTitle = oMainSchemaForConceptGraph.conceptGraphData.title;
        var cgDescription = oMainSchemaForConceptGraph.conceptGraphData.description;
        var aConcepts = oMainSchemaForConceptGraph.conceptGraphData.aConcepts;

        window.frontEndConceptGraph.viewingConceptGraph.slug = cgSlug;
        window.frontEndConceptGraph.viewingConceptGraph.title = cgTitle;
        window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph = ipnsForMainSchemaForConceptGraph;

        this.setState({
            viewingConceptGraphTitle: cgTitle,
            viewingConceptGraphSlug: cgSlug,
            viewingConceptGraphIPNS:ipnsForMainSchemaForConceptGraph
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
                        <div class="h2">Single Concept Graph Main Page (front end)</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
