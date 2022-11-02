import React from "react";
import Masthead from '../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/cgFe_singleConceptGraph_updates_leftNav2';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphInMfsFunctions from '../../../../../lib/ipfs/conceptGraphInMfsFunctions.js'
import noUiSlider from "nouislider";
import oBlankRatingTemplate from '../../../../../grapevine/ratings/json/prefilledRatings/updateProposalRatingTemplate.json';

const jQuery = require("jquery");

const populateRatingRawFile = async (updateProposalSlug) => {
    console.log("populateRatingRawFile; updateProposalSlug: "+updateProposalSlug)
    var oRating = MiscFunctions.cloneObj(oBlankRatingTemplate)

    var cSlider = document.getElementById('confidenceSlider');
    var confidenceValue = cSlider.noUiSlider.get();
    oRating.ratingData.ratingFieldsetData.confidenceFieldsetData.confidence = confidenceValue

    jQuery("#newRatingRawFile").val(JSON.stringify(oRating,null,4))
}

export default class ConceptGraphsFrontEndSingleConceptGraphSingleUpdateProposalMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
            updateProposalSlug: null
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var updateProposalSlug = this.props.match.params.updateproposalslug;
        this.setState({updateProposalSlug:updateProposalSlug});

        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
        var oUpdateProposal = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,updateProposalSlug)
        jQuery("#updateProposalRawFileContainer").val(JSON.stringify(oUpdateProposal,null,4))

        const callPopulateRatingRawFile = () => {
            populateRatingRawFile(updateProposalSlug)
        }

        var cSlider = document.getElementById('confidenceSlider');
        noUiSlider.create(cSlider, {
            start: 40,
            orientation: 'vertical',
            direction: 'rtl',
            range: {
                'min': 0,
                'max': 100
            },
            pips: { mode: "count", values: 5 },
            clickablePips: true,
            step:1
        });

        // on update would render changes continuously
        // on change renders changes at the end of a move
        // cSlider.noUiSlider.on("change",updateConfidence)
        cSlider.noUiSlider.on("change",callPopulateRatingRawFile)
        jQuery("#commentsRawFile").change(function(){
            callPopulateRatingRawFile()
        })
        jQuery(".verdictRadioButton").change(function(){
            callPopulateRatingRawFile()
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
                        <div class="h2">Single Update Proposal: {this.state.updateProposalSlug} Main Page</div>

                        <div style={{border:"1px solid green",width:"600px",height:"900px",padding:"10px",display:"inline-block"}} >
                            <center>Update Proposal Info</center>
                            <textarea id="updateProposalRawFileContainer" style={{width:"95%",height:"400px"}} ></textarea>
                        </div>

                        <div style={{border:"1px solid green",width:"600px",height:"900px",padding:"10px",display:"inline-block"}} >
                            <center>Leave Rating</center>
                            <div style={{marginBottom:"20px"}} >
                                <div style={{width:"400px",display:"inline-block"}} >
                                    <div id="verdictRadioButtonsContainer" >
                                        <div>
                                            <input name="verdictRadioButton" class="verdictRadioButton" value="true" type="radio" />Approve
                                        </div>
                                        <div>
                                            <input name="verdictRadioButton" class="verdictRadioButton" value="false" type="radio" />Disapprove
                                        </div>
                                    </div>

                                    <div>
                                        Comments:
                                        <textarea id="commentsRawFile" style={{width:"95%",height:"100px"}} ></textarea>
                                    </div>
                                </div>
                                <div style={{textAlign:"center",width:"150px",display:"inline-block"}} >
                                    <div style={{height:"50px"}}>Confidence</div>
                                    <div id="confidenceSlider" style={{display:"inline-block",height:"300px",backgroundColor:"orange"}} ></div>
                                </div>
                            </div>

                            <textarea id="newRatingRawFile" style={{width:"95%",height:"400px",display:"inline-block",border:"1px dashed grey",fontSize:"10px"}} >
                            </textarea>

                        </div>

                    </div>

                </fieldset>
            </>
        );
    }
}
