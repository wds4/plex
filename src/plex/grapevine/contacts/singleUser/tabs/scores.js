import React from "react";
import * as ConceptGraphLib from '../../../../lib/ipfs/conceptGraphLib.js'
import * as GrapevineLib from '../../../../lib/ipfs/grapevineLib.js'

const cg = ConceptGraphLib.cg;
const gv = GrapevineLib.gv;

const jQuery = require("jquery");

export default class SingleUserScores extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        var peerID = this.props.user.peerID;
        // var peerID = jQuery("#thisUserPeerID").val()
        console.log("peerID:: "+peerID)

    }
    render() {

        return (
            <>
                <div>
                    <center>Scores tab; peerID: {this.props.user.peerID}</center>
                    <div id="influenceContainer" >influenceContainer</div>
                </div>
            </>
        );
    }
}
