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

const makeKeynameAndIpnsForNewRating = async () => {
    var newWordType = "updateProposalRating";
    var randomNonce = Math.floor(Math.random() * 1000);
    var currentTime = Date.now();
    var newKeyname = "plexWord_"+newWordType+"_"+currentTime+"_"+randomNonce;
    var oGeneratedKey = await MiscIpfsFunctions.ipfs.key.gen(newKeyname, {
        type: 'rsa',
        size: 2048
    })

    // var newWord_ipns = oGeneratedKey["id"];
    // var generatedKey_name = oGeneratedKey["name"];
    // console.log("generatedKey_obj id: "+newWord_ipns+"; name: "+generatedKey_name);
    // newWord_obj.metaData.ipns = newWord_ipns;
    // newWord_obj.metaData.keyname = newKeyname;

    return oGeneratedKey;
}

const populateRatingRawFile = async (oUpdateProposal) => {

    var currentTime = Date.now();
    var oRating = MiscFunctions.cloneObj(oBlankRatingTemplate)

    var myPeerID = await MiscIpfsFunctions.returnMyPeerID();
    var myUsername = await MiscIpfsFunctions.returnMyUsername();
    oRating.ratingData.raterData.userData.username = myUsername;
    oRating.ratingData.raterData.userData.peerID = myPeerID;
    var raterPeerIdLast6 = myPeerID.slice(myPeerID.length-6);

    var up_slug = oUpdateProposal.wordData.slug;
    var up_ipns = oUpdateProposal.updateProposalData.ipns;
    oRating.ratingData.rateeData.updateProposalData.type = oUpdateProposal.updateProposalData.type;
    oRating.ratingData.rateeData.updateProposalData.slug = up_slug;
    oRating.ratingData.rateeData.updateProposalData.ipns = up_ipns;
    oRating.ratingData.rateeData.updateProposalData.author.peerID = oUpdateProposal.updateProposalData.author.peerID;
    oRating.ratingData.rateeData.updateProposalData.author.username = oUpdateProposal.updateProposalData.author.username;

    var comments = jQuery("#commentsRawFile").val();
    oRating.ratingData.ratingFieldsetData.commentsFieldsetData.comments = comments;

    var cSlider = document.getElementById('confidenceSlider');
    var confidenceValue = cSlider.noUiSlider.get();
    oRating.ratingData.ratingFieldsetData.confidenceFieldsetData.confidence = confidenceValue;

    var verdict_true = jQuery("#verdict_true").prop("checked")
    var verdict_false = jQuery("#verdict_false").prop("checked")
    var verdict = null;
    if ( (verdict_true) && (!verdict_false) ) {
        verdict = true;
    }
    if ( (!verdict_true) && (verdict_false) ) {
        verdict = false;
    }
    oRating.ratingData.ratingFieldsetData.booleanVerdictFieldsetData.verdict = verdict

    var cSlider = document.getElementById('confidenceSlider');
    var confidenceValue = cSlider.noUiSlider.get();
    oRating.ratingData.ratingFieldsetData.confidenceFieldsetData.confidence = confidenceValue

    oRating.metaData.keyname = jQuery("#newRatingKeyname").html()
    oRating.metaData.ipns = jQuery("#newRatingIPNS").html()
    oRating.metaData.lastUpdate = currentTime;

    var rTT = oRating.ratingData.ratingTemplateData.ratingTemplateTitle;

    var ratingTemplateIPNS = oRating.ratingData.ratingTemplateData.ratingTemplateIPNS;
    var stuffToDigest = myPeerID + up_ipns + ratingTemplateIPNS;
    const addResult = await MiscIpfsFunctions.ipfs.add(stuffToDigest)
    var ratingUniqueIdentifier = addResult.path;
    console.log("ratingUniqueIdentifier: "+ratingUniqueIdentifier)

    var up_inps_Last6 = up_ipns.slice(up_ipns.length-6);
    var rating_wordSlug = "ratingOf_"+up_inps_Last6+"_by_"+raterPeerIdLast6+"_"+ratingUniqueIdentifier.slice(-6);
    var rating_wordName = "rating of "+up_slug+" by "+myUsername+" using "+rTT;
    var rating_wordTitle = "Rating of "+up_slug+" by "+myUsername+" using "+rTT;
    var rating_wordDescription = "rating of "+up_slug+" ("+up_ipns+") by "+myUsername+" ("+myPeerID+") using "+rTT
    rating_wordDescription += "Authored at time "+currentTime+".";

    oRating.wordData.slug = rating_wordSlug;
    oRating.wordData.name = rating_wordName;
    oRating.wordData.title = rating_wordTitle;
    oRating.wordData.description = rating_wordDescription;

    oRating.ratingData.slug = rating_wordSlug;
    oRating.ratingData.name = rating_wordName;
    oRating.ratingData.title = rating_wordTitle;
    oRating.ratingData.description = rating_wordDescription;

    oRating.ratingData.submissionTime = currentTime

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
            populateRatingRawFile(oUpdateProposal)
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

        var oGeneratedKey = await makeKeynameAndIpnsForNewRating()
        jQuery("#newRatingKeyname").html(oGeneratedKey["name"])
        jQuery("#newRatingIPNS").html(oGeneratedKey["id"])

        jQuery("#submitThisRatingButton").click(async function(){
            console.log("submitThisRatingButton clicked")
            var sNewRating = jQuery("#newRatingRawFile").val()
            var oNewRating = JSON.parse(sNewRating)
            var conceptFor_rating = "conceptFor_rating";
            var subsetUniqueIdentifier = "setFor_ratings_authoredLocally"; // adding to subsets not yet implemented in addSpecificInstanceToConceptGraphMfs; currently adds only to superset
            var aSetUniqueIdentifiers = []
            aSetUniqueIdentifiers.push(subsetUniqueIdentifier)
            // await ConceptGraphInMfsFunctions.publishWordToIpfs(oNewRating) // this step is now taken care of by addSpecificInstanceToConceptGraphMfs
            await ConceptGraphInMfsFunctions.addNewWordAsSpecificInstanceToConceptInMFS_specifyConceptGraph(viewingConceptGraph_ipns,oNewRating,conceptFor_rating,aSetUniqueIdentifiers)
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
                                            <input name="verdictRadioButton" class="verdictRadioButton" value="true" id="verdict_true" type="radio" />Approve
                                        </div>
                                        <div>
                                            <input name="verdictRadioButton" class="verdictRadioButton" value="false" id="verdict_false" type="radio" />Disapprove
                                        </div>
                                    </div>

                                    <div>
                                        Comments:
                                        <textarea id="commentsRawFile" style={{width:"95%",height:"100px"}} ></textarea>
                                    </div>

                                    <div>
                                        <div className="rateSomeoneButton" id="submitThisRatingButton" >Submit this rating</div>
                                        <div style={{display:"inline-block"}}>
                                            <div id="newRatingKeyname">newRatingKeyname</div>
                                            <div id="newRatingIPNS">newRatingIPNS</div>
                                        </div>
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
