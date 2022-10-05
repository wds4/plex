import React from "react";
import Masthead from '../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/cgFe_concepts_singleConcept_leftNav2';
import * as MiscIpfsFunctions from '../../../lib/ipfs/miscIpfsFunctions.js'

const jQuery = require("jquery");

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

export default class ConceptGraphsFrontEndSingleConceptMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var conceptCid = this.props.match.params.conceptcid
        console.log("conceptCid: "+conceptCid)
        await loadConceptData(conceptCid)
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
                    </div>
                </fieldset>
            </>
        );
    }
}
