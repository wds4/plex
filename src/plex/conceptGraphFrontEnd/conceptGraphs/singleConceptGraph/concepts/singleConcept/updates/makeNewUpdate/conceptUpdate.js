import React from "react";
import Masthead from '../../../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../../../navbars/leftNavbar2/cgFe_singleConceptUpdates_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../../../../../lib/ipfs/conceptGraphInMfsFunctions.js'

const jQuery = require("jquery");

export default class ConceptGraphsFrontEndSingleConceptMakeNewConceptUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var conceptSlug = this.props.match.params.conceptslug;
        if (conceptSlug=="current") {
            conceptSlug = window.frontEndConceptGraph.viewingConcept.slug
        }
        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;

        var oMainSchemaForConceptGraph = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,"mainSchemaForConceptGraph")
        var aDefaultProperties = oMainSchemaForConceptGraph.conceptGraphData.properties.default;

        var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,conceptSlug)
        var wT_slug = oConcept.conceptData.nodes.wordType.slug;
        var oWordType = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,wT_slug)

        // need to do these for conceptFor_concept, not conceptFor_ viewing concept 
        var aAdditionalDefaultProperties = oConcept.conceptData.defaultProperties.additional;
        var aOmitDefaultProperties = oConcept.conceptData.defaultProperties.omit;

    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">Make New Concept Update for Single Concept</div>

                        <div style={{fontSize:"12px"}}>
                            For now, concept update proposals will be limited to changes in top-level fields (e.g. description, name, title).
                            Future: May incorporate more complex changes; or may delegate more complex changes to other update proposal types.
                        </div>

                        Update proposals from other:
                        <select>
                            <option>no updates</option>
                            <option>list all: approve manually</option>
                            <option>list from *approved users; approve manually</option>
                            <option>list from *approved users; automatic updates</option>
                        </select>

                        *Approved users:
                        Influence type:
                        context:
                        score threshold

                    </div>
                </fieldset>
            </>
        );
    }
}
