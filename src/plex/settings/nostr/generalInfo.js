import React from "react";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/nostr_leftNav2';
import { generatePrivateKey, getPublicKey } from 'nostr-tools'

const jQuery = require("jquery");



export default class NostrGeneralInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");


        const sk = generatePrivateKey() // `sk` is a hex string
        console.log("nostr_sk: "+sk)

        /*
        let pk = getPublicKey(sk) // `pk` is a hex string
        console.log("nostr_pk: "+pk)
        */
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div className="h2">nostr General Info</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
