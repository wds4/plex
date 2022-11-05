import React from 'react';

export default class CompScoreCalcPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    async componentDidMount() {
        // var aFi = this.props.aF;
        // console.log("aFi: "+aFi)
        // var imageCid = "QmbRs5wrimekB4ChruzzokihpyrnMDGeFHkYqLkB1F53ho";
        var imageCid = this.props.oSingleUserGrapevineScores.avatarCid;
        var img = document.getElementById("showCalculationsAvatarThumb") // the img tag you want it in
        // img.src = "http://localhost:8080/ipfs/"+imageCid;
        img.src = "http://localhost:8080/ipfs/"+this.props.oSingleUserGrapevineScores.avatarCid;

    }
    render() {
        // const {data} = this.state;
        return (
            <>
                <div style={{border:"1px solid purple",borderRadius:"5px",padding:"5px",display:"inline-block",width:"1450px",backgroundColor:"yellow",textAlign:"left"}}>
                    <center>User Trust Score Calculations</center>

                    <center>
                        <div style={{display:"inline-block",textAlign:"left"}} >
                            <div className="contactsPageAvatarContainer" style={{display:"inline-block",width:"50px",height:"50px",backgroundColor:"yellow"}} >
                                <img id="showCalculationsAvatarThumb" className="contactsPageAvatarThumb" />
                            </div>

                            <div style={{display:"inline-block",marginLeft:"10px"}} >
                                <div>
                                    <div style={{display:"inline-block",width:"90px",textAlign:"right",marginRight:"10px",color:"grey"}} >username:</div>
                                    <div style={{display:"inline-block"}} id="usernameContainer" >{this.props.oSingleUserGrapevineScores.username}</div>
                                </div>
                                <div>
                                    <div style={{display:"inline-block",width:"90px",textAlign:"right",marginRight:"10px",color:"grey"}} >peerID:</div>
                                    <div style={{display:"inline-block"}} id="peerIDContainer">{this.props.oSingleUserGrapevineScores.peerID}</div>
                                </div>
                            </div>
                        </div>
                    </center>

                    <div style={{}} >
                        <center>
                            <div style={{display:"inline-block"}} >

                                <div style={{display:"inline-block",width:"150px"}} >
                                    <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                    INFLUENCE:
                                    </div>
                                    <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                    {this.props.oSingleUserGrapevineScores.compositeScoreData.standardCalculations.influence}
                                    </div>
                                </div>

                                <div style={{display:"inline-block",width:"150px"}} >
                                    <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                    Average:
                                    </div>
                                    <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                    {this.props.oSingleUserGrapevineScores.compositeScoreData.standardCalculations.average}
                                    </div>
                                </div>

                                <div style={{display:"inline-block",width:"150px"}} >
                                    <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                    Input:
                                    </div>
                                    <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                    {this.props.oSingleUserGrapevineScores.compositeScoreData.standardCalculations.input}
                                    </div>
                                </div>

                                <div style={{display:"inline-block",width:"150px"}} >
                                    <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                    Certainty:
                                    </div>
                                    <div style={{display:"inline-block",width:"150px",height:"30px"}} >
                                    {(this.props.oSingleUserGrapevineScores.compositeScoreData.standardCalculations.certainty * 100).toPrecision(4)} %
                                    </div>
                                </div>

                            </div>
                        </center>
                    </div>

                    <div >
                        <div className="calculationRowsHeaderContainer" >
                            <div className="grapevinePageColA" >
                            rater <span style={{color:"blue"}} >(ratee)</span>
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
                            mod.#1 coeff.
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
                            rater <span style={{color:"blue"}}>(ratee)</span> influence
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            rating confidence
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            strat. #2 coeff.
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            mod. #3 coeff.
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            Attenuation Factor
                            </div>
                        </div>

                        <div style={{color:"brown"}} >
                        {this.props.oSingleUserGrapevineScores.ratings.map(oRating => (
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
                                {oRating.mod1Coeff}
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
                                <div className="grapevinePageSpacer1Col" >
                                *
                                </div>
                                <div className="grapevinePageColB" >
                                {oRating.strat2Coeff}
                                </div>
                                <div className="grapevinePageSpacer1Col" >
                                *
                                </div>
                                <div className="grapevinePageColB" >
                                {oRating.mod3Coeff}
                                </div>
                                <div className="grapevinePageSpacer1Col" >
                                *
                                </div>
                                <div className="grapevinePageColB" >
                                {oRating.attenuationFactor}
                                </div>

                            </div>
                        ))}
                        </div>

                        <div style={{color:"blue"}} >
                        {this.props.oSingleUserGrapevineScores.inverseRatings.map(oRating => (
                            <div className="calculationRowContainer" >
                                <div className="grapevinePageColA" >
                                {oRating.ratingNumber} {oRating.rateeUsername}
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
                                {oRating.mod1Coeff}
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
                                {oRating.rateeInfluence}
                                </div>
                                <div className="grapevinePageSpacer1Col" >
                                *
                                </div>
                                <div className="grapevinePageColB" >
                                {oRating.ratingConfidence} %
                                </div>
                                <div className="grapevinePageSpacer1Col" >
                                *
                                </div>
                                <div className="grapevinePageColB" >
                                {oRating.strat2Coeff}
                                </div>
                                <div className="grapevinePageSpacer1Col" >
                                *
                                </div>
                                <div className="grapevinePageColB" >
                                {oRating.mod3Coeff}
                                </div>
                                <div className="grapevinePageSpacer1Col" >
                                *
                                </div>
                                <div className="grapevinePageColB" >
                                {oRating.attenuationFactor}
                                </div>

                            </div>
                        ))}
                        </div>

                        <div style={{color:"orange"}} >
                        {this.props.oSingleUserGrapevineScores.inheritedRatings.map(oInheritedRating => (
                            <div className="calculationRowContainer" >
                                <div className="grapevinePageColA" >
                                {oInheritedRating.parentCompositeScoreNumber} {oInheritedRating.parentCompositeScoreType}
                                </div>
                                <div className="grapevinePageColB" >
                                {oInheritedRating.product}
                                </div>
                                <div className="grapevinePageSpacer1Col" >
                                =
                                </div>
                                <div className="grapevinePageColB" >
                                {oInheritedRating.rating}
                                </div>
                                <div className="grapevinePageSpacer1Col" >
                                *
                                </div>
                                <div className="grapevinePageColB" >
                                (n/a)
                                </div>
                                <div className="grapevinePageSpacer1Col" >
                                *
                                </div>
                                <div className="grapevinePageColB" >
                                {oInheritedRating.weightAdjusted}
                                </div>
                                <div className="grapevinePageSpacer2Col" >

                                </div>
                                <div className="grapevinePageColB" >
                                {oInheritedRating.weight}
                                </div>
                                <div className="grapevinePageSpacer1Col" >
                                =
                                </div>
                                <div className="grapevinePageColB" >
                                {oInheritedRating.raterInfluence}
                                </div>
                                <div className="grapevinePageSpacer1Col" >
                                *
                                </div>
                                <div className="grapevinePageColB" >
                                {oInheritedRating.ratingConfidence} (? n/a)
                                </div>
                                <div className="grapevinePageSpacer1Col" >
                                *
                                </div>
                                <div className="grapevinePageColB" >
                                {oInheritedRating.strat2Coeff} (n/a)
                                </div>
                                <div className="grapevinePageSpacer1Col" >
                                *
                                </div>
                                <div className="grapevinePageColB" >
                                {oInheritedRating.mod3Coeff} (n/a)
                                </div>
                                <div className="grapevinePageSpacer1Col" >
                                *
                                </div>
                                <div className="grapevinePageColB" >
                                {oInheritedRating.attenuationFactor} (by.def.)
                                </div>
                            </div>
                        ))}
                        </div>

                        <div className="calculationRowContainer" style={{color:"grey"}} >
                            <div className="grapevinePageColA" >
                            default User Trust Score
                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.oSingleUserGrapevineScores.defaultRating.product}
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            =
                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.compScoreDisplayPanelData.defaultUserTrustAverageScore}
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.oSingleUserGrapevineScores.defaultRating.strat1Coeff}
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.oSingleUserGrapevineScores.defaultRating.weightAdjusted}
                            </div>
                            <div className="grapevinePageSpacer2Col" >

                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.oSingleUserGrapevineScores.defaultRating.weight}
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            =
                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.oSingleUserGrapevineScores.defaultRating.raterInfluence} (by def.)
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.compScoreDisplayPanelData.defaultUserTrustConfidence}
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.oSingleUserGrapevineScores.defaultRating.strat2Coeff} (n/a)
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.oSingleUserGrapevineScores.defaultRating.mod3Coeff} (n/a)
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.oSingleUserGrapevineScores.defaultRating.attenuationFactor} (n/a)
                            </div>
                        </div>

                        <div style={{marginTop:"30px"}} >
                            <div className="grapevinePageColA" >
                            sum of products:
                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.oSingleUserGrapevineScores.compositeScoreData.standardCalculations.sumOfProducts}
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

                            </div>
                            <div className="grapevinePageSpacer1Col" >

                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.oSingleUserGrapevineScores.compositeScoreData.standardCalculations.input}
                            </div>
                        </div>

                        <div >
                            <div className="grapevinePageColA" >
                            * input:
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

                            </div>
                            <div className="grapevinePageSpacer1Col" >

                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.oSingleUserGrapevineScores.compositeScoreData.standardCalculations.inputWithoutStrat2}
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
                            {this.props.oSingleUserGrapevineScores.compositeScoreData.standardCalculations.average}
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
                            <div className="grapevinePageSpacer1Col" >

                            </div>
                            <div className="grapevinePageColB" >

                            </div>
                            <div className="grapevinePageSpacer2Col" >

                            </div>
                            <div className="grapevinePageColB" >
                            {(this.props.oSingleUserGrapevineScores.compositeScoreData.standardCalculations.certainty * 100).toPrecision(4)} %
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
                            <div className="grapevinePageSpacer1Col" >

                            </div>
                            <div className="grapevinePageColB" >

                            </div>
                            <div className="grapevinePageSpacer2Col" >

                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.oSingleUserGrapevineScores.compositeScoreData.standardCalculations.influence}
                            </div>
                        </div>

                    </div>
                </div>
            </>
        );
    }
}
