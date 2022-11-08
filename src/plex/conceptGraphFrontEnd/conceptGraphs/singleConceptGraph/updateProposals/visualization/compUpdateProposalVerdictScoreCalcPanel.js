import React from 'react';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';

const jQuery = require("jquery");

export default class CompScoreCalcPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    handleUpdateProposalVerdictCompositeScoreData = () => {
        var oCSD = MiscFunctions.cloneObj(this.props.oSingleUpdateProposalVerdictScores);
        delete oCSD.ratings;
        delete oCSD.defaultRating;
        console.log("handleMupdateCompositeScoreDataod5Callback; oCSD: "+JSON.stringify(oCSD,null,4))
        // var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
        // compScoreDisplayPanelData_new.strat5Coeff = newMod5Factor
        // this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
        var sUpvCS1 = jQuery("#upvCompositeScoreContainer1").val()
        var oUpvCS1 = JSON.parse(sUpvCS1)

        var wordSlug = "updateProposalVerdictCompositeScore_multiSpecificInstance_superset"
        var wordName = "update proposal verdict composite score: multi specific instance, superset"
        var wordTitle = "Update Proposal Verdict Composite Score: Multi Specific Instance, superset"
        var wordDescription = "multiple specific instances stored in one file as one word, via the relationship: areSpecificInstancesOf the superset for the concept of updateProposalVerdictCompositeScore.";

        oUpvCS1.wordData.slug = wordSlug;
        oUpvCS1.wordData.name = wordName;
        oUpvCS1.wordData.title = wordTitle;
        oUpvCS1.wordData.description = wordDescription;

        console.log("updateCSDataButton clicked")
        oUpvCS1.aUpdateProposalVerdictCompositeScoreData = []
        oUpvCS1.aUpdateProposalVerdictCompositeScoreData.push(oCSD)

        jQuery("#upvCompositeScoreContainer2").val(JSON.stringify(oUpvCS1,null,4))
    }

    async componentDidMount() {
        /*
        var oCSD = this.props.oSingleUpdateProposalVerdictScores.compositeScoreData
        jQuery("#updateCSDataButton").click(function(){
            var sUpvCS1 = jQuery("#upvCompositeScoreContainer1").val()
            var oUpvCS1 = JSON.parse(sUpvCS1)

            console.log("updateCSDataButton clicked")
            oUpvCS1.aUpdateProposalVerdictCompositeScoreData = []
            oUpvCS1.aUpdateProposalVerdictCompositeScoreData.push(oCSD)

            jQuery("#upvCompositeScoreContainer2").val(JSON.stringify(oUpvCS1,null,4))
        })
        */
    }
    render() {
        // const {data} = this.state;
        return (
            <>
                <div style={{border:"1px solid purple",borderRadius:"5px",padding:"5px",display:"inline-block",width:"1450px",backgroundColor:"yellow",textAlign:"left"}}>
                    <center>
                        Update Proposal Verdict Score Calculations
                        <div id="updateCSDataButton" className="doSomethingButton_small" onClick={this.handleUpdateProposalVerdictCompositeScoreData} >update composite score data</div>
                    </center>

                    <center>
                        <div style={{display:"inline-block",textAlign:"left"}} >
                            <div style={{display:"inline-block"}} >
                                <div>
                                    <div style={{display:"inline-block",width:"80px",textAlign:"right",marginRight:"10px",color:"grey"}} >slug</div>
                                    <div style={{display:"inline-block"}} id="upSlugContainer" >{this.props.oSingleUpdateProposalVerdictScores.updateProposalData.slug}</div>
                                </div>
                                <div>
                                    <div style={{display:"inline-block",width:"80px",textAlign:"right",marginRight:"10px",color:"grey"}} >ipns</div>
                                    <div style={{display:"inline-block"}} id="upIpnsContainer" >{this.props.oSingleUpdateProposalVerdictScores.updateProposalData.ipns}</div>
                                </div>
                            </div>
                        </div>
                    </center>

                    <div style={{}} >
                        <center>

                            <div style={{display:"inline-block",width:"150px"}} >
                                <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                Average:
                                </div>
                                <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                {this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.sum.average}
                                </div>
                            </div>

                            <div style={{display:"inline-block",width:"150px"}} >
                                <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                Input:
                                </div>
                                <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                {this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.sum.input}
                                </div>
                            </div>

                            <div style={{display:"inline-block",width:"150px"}} >
                                <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                Certainty:
                                </div>
                                <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                {(this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.sum.certainty * 100).toPrecision(4)} %
                                </div>
                            </div>

                        </center>
                    </div>

                    <div >
                        <div className="calculationRowsHeaderContainer" >
                            <div className="grapevinePageColA" >
                            rater
                            </div>
                            <div className="grapevinePageColB" >
                            product
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            =
                            </div>
                            <div className="grapevinePageColB" >
                            rating
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            WEIGHT (adjusted)
                            </div>
                            <div className="grapevinePageSpacer2Col" >

                            </div>
                            <div className="grapevinePageColB" >
                            WEIGHT
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            =
                            </div>
                            <div className="grapevinePageColB" >
                            rater influence
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            rating confidence
                            </div>
                        </div>
                    </div>

                    <div style={{color:"brown"}} >
                    {this.props.oSingleUpdateProposalVerdictScores.ratings.map(oRating => (
                        <div className="calculationRowContainer" >
                            <div className="grapevinePageColA" >
                            {oRating.ratingNumber} {oRating.raterUsername}
                            </div>
                            <div className="grapevinePageColB" >
                            {oRating.product}
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            =
                            </div>
                            <div className="grapevinePageColB" >
                            {oRating.rating}
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            {oRating.weightAdjusted}
                            </div>
                            <div className="grapevinePageSpacer2Col" >

                            </div>
                            <div className="grapevinePageColB" >
                            {oRating.weight}
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            =
                            </div>
                            <div className="grapevinePageColB" >
                            {oRating.raterInfluence}
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            {oRating.ratingConfidence} %
                            </div>
                        </div>
                    ))}
                    </div>

                    <div className="calculationRowContainer" style={{color:"grey"}} >
                        <div className="grapevinePageColA" >
                        default User Trust Score
                        </div>
                        <div className="grapevinePageColB" >
                        {this.props.oSingleUpdateProposalVerdictScores.defaultRating.product}
                        </div>
                        <div className="grapevinePageSpacer1Col" >
                        =
                        </div>
                        <div className="grapevinePageColB" >
                        {this.props.compScoreDisplayPanelData.defaultUpdateProposalVerdictAverageScore}
                        </div>
                        <div className="grapevinePageSpacer1Col" >
                        *
                        </div>
                        <div className="grapevinePageColB" >
                        {this.props.oSingleUpdateProposalVerdictScores.defaultRating.weightAdjusted}
                        </div>
                        <div className="grapevinePageSpacer2Col" >

                        </div>
                        <div className="grapevinePageColB" >
                        {this.props.oSingleUpdateProposalVerdictScores.defaultRating.weight}
                        </div>
                        <div className="grapevinePageSpacer1Col" >
                        =
                        </div>
                        <div className="grapevinePageColB" >
                        {this.props.oSingleUpdateProposalVerdictScores.defaultRating.raterInfluence} (by def.)
                        </div>
                        <div className="grapevinePageSpacer1Col" >
                        *
                        </div>
                        <div className="grapevinePageColB" >
                        {this.props.compScoreDisplayPanelData.defaultUpdateProposalVerdictConfidence}
                        </div>
                    </div>

                    <div style={{marginTop:"30px"}} >
                        <div className="grapevinePageColA" >
                        sum of products:
                        </div>
                        <div className="grapevinePageColB" >
                        {this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.sum.sumOfProducts}
                        </div>
                    </div>

                    <div >
                        <div className="grapevinePageColA" >
                        input:
                        </div>
                        <div className="grapevinePageColB" >

                        </div>
                        <div className="grapevinePageSpacer1Col" >

                        </div>
                        <div className="grapevinePageColB" >

                        </div>
                        <div className="grapevinePageSpacer1Col" >

                        </div>
                        <div className="grapevinePageColB" >
                        {this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.sum.input}
                        </div>
                    </div>

                    <div >
                        <div className="grapevinePageColA" >
                        average:
                        </div>
                        <div className="grapevinePageColB" >

                        </div>
                        <div className="grapevinePageSpacer1Col" >

                        </div>
                        <div className="grapevinePageColB" >
                        {this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.sum.average}
                        </div>
                    </div>

                    <div >
                        <div className="grapevinePageColA" >
                        certainty:
                        </div>
                        <div className="grapevinePageColB" >

                        </div>
                        <div className="grapevinePageSpacer1Col" >

                        </div>
                        <div className="grapevinePageColB" >

                        </div>
                        <div className="grapevinePageSpacer2Col" >

                        </div>
                        <div className="grapevinePageColB" >
                        {(this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.sum.certainty * 100).toPrecision(4)} %
                        </div>
                    </div>

                </div>
            </>
        );
    }
}
