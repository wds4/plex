import React from 'react';

class CalculationRow extends React.Component{

    render(){
        return(
        <div>
            Another Row
        </div>
        )
    }
}

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
        var aRatings = this.props.oSingleUserGrapevineScores.ratings;
        const {data} = this.state;
        return (
            <>
                <div style={{border:"1px solid purple",borderRadius:"5px",padding:"5px",display:"inline-block",width:"1600px",backgroundColor:"yellow",textAlign:"left"}}>
                    <center>Trust Score Calculations</center>

                    <center>
                        <div style={{display:"inline-block",textAlign:"left"}} >
                            <div className="contactsPageAvatarContainer" style={{display:"inline-block",width:"50px",height:"50px",backgroundColor:"yellow"}} >
                                <img id="showCalculationsAvatarThumb" className="contactsPageAvatarThumb" />
                            </div>

                            <div style={{display:"inline-block"}} >
                                <div>
                                    <div style={{display:"inline-block",width:"100px"}} >username</div>
                                    <div style={{display:"inline-block"}}  id="usernameContainer">{this.props.oSingleUserGrapevineScores.username}</div>
                                </div>
                                <div>
                                    <div style={{display:"inline-block",width:"100px"}} >peerID</div>
                                    <div style={{display:"inline-block"}} id="peerIDContainer">{this.props.oSingleUserGrapevineScores.peerID}</div>
                                </div>
                            </div>
                        </div>
                    </center>

                    <div style={{border:"1px dashed grey"}} >
                        <center>score results (4 cols)</center>
                        <div>
                            <div>
                            </div>
                        </div>
                    </div>

                    <div style={{border:"1px solid purple"}} >
                    {this.props.oSingleUserGrapevineScores.ratings.map(oRating => (
                        <div >
                            <div
                            >{oRating.ratingNumber}
                            </div>
                        </div>
                    ))}
                    </div>

                    <div style={{border:"1px dashed grey"}} >
                        <center>calculation details (multiple rows and cols)</center>
                        <div id="calculationRowsHeaderContainer" >
                            <div className="grapevinePageColA" >
                            rater (ratee)
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
                            strat.#1 coeff.
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
                            strat. #3 coeff.
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            Attenuation Factor
                            </div>
                        </div>

                        <div style={{color:"grey"}} >
                            <div className="grapevinePageColA" >
                            default User Trust Score
                            </div>
                            <div className="grapevinePageColB" >
                            product
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
                            strat.#1 coeff.
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
                            1 (by def.)
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
                            1 (n/a)
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            1 (by def.)
                            </div>
                            <div className="grapevinePageSpacer1Col" >
                            *
                            </div>
                            <div className="grapevinePageColB" >
                            {this.props.compScoreDisplayPanelData.attenuationFactor}
                            </div>
                        </div>

                        <div id="calculationRowsContainer" >
                            <CalculationRow />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
