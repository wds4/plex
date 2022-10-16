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

    }
    render() {
        const {data} = this.state;
        return (
            <>
                <div style={{border:"1px solid purple",borderRadius:"5px",padding:"5px",display:"inline-block",width:"1600px",backgroundColor:"yellow",textAlign:"left"}}>
                    <center>Trust Score Calculations</center>
                    <div style={{display:"inline-block",textAlign:"left"}} >
                        <div>
                             <div style={{display:"inline-block"}} >username</div>
                             <div style={{display:"inline-block"}}  id="usernameContainer"></div>
                         </div>
                         <div>
                             <div style={{display:"inline-block"}} >peerID</div>
                             <div style={{display:"inline-block"}} id="peerIDContainer"></div>
                         </div>
                    </div>

                    <div style={{border:"1px dashed grey"}} >
                        <center>score results (4 cols)</center>
                        <div>
                            <div>
                            </div>
                        </div>
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
