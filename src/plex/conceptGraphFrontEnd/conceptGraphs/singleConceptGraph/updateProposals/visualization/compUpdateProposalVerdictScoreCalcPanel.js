import React from 'react';

export default class CompScoreCalcPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    async componentDidMount() {


    }
    render() {
        // const {data} = this.state;
        return (
            <>
                <div style={{border:"1px solid purple",borderRadius:"5px",padding:"5px",display:"inline-block",width:"1450px",backgroundColor:"yellow",textAlign:"left"}}>
                    <center>Update Proposal Verdict Score Calculations</center>

                    <center>
                        <div style={{display:"inline-block",textAlign:"left"}} >
                            <div style={{display:"inline-block"}} >
                                <div>
                                    <div style={{display:"inline-block",width:"80px",textAlign:"right",marginRight:"10px",color:"grey"}} >slug</div>
                                    <div style={{display:"inline-block"}} id="upSlugContainer" >{this.props.oSingleUpdateProposalVerdictScores.updateProposalSlug}</div>
                                </div>
                                <div>
                                    <div style={{display:"inline-block",width:"80px",textAlign:"right",marginRight:"10px",color:"grey"}} >ipns</div>
                                    <div style={{display:"inline-block"}} id="upIpnsContainer" >{this.props.oSingleUpdateProposalVerdictScores.updateProposalIPNS}</div>
                                </div>
                            </div>
                        </div>
                    </center>

                    <div style={{}} >
                        <center>

                            <div style={{display:"inline-block",width:"150px"}} >
                                <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                INFLUENCE:
                                </div>
                                <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                {this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.influence}
                                </div>
                            </div>

                            <div style={{display:"inline-block",width:"150px"}} >
                                <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                Average:
                                </div>
                                <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                {this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.average}
                                </div>
                            </div>

                            <div style={{display:"inline-block",width:"150px"}} >
                                <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                Input:
                                </div>
                                <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                {this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.input}
                                </div>
                            </div>

                            <div style={{display:"inline-block",width:"150px"}} >
                                <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                Certainty:
                                </div>
                                <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                {(this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.certainty * 100).toPrecision(4)} %
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
                        {this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.sumOfProducts}
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
                        {this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.input}
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
                        {this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.average}
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
                        {(this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.certainty * 100).toPrecision(4)} %
                        </div>
                    </div>

                    <div >
                        <div className="grapevinePageColA" >
                        influence:
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
                        {this.props.oSingleUpdateProposalVerdictScores.compositeScoreData.standardCalculations.influence}
                        </div>
                    </div>

                </div>
            </>
        );
    }
}
