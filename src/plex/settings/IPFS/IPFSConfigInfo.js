import React from "react";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as IpfsFunctions from '../../functions/ipfsFunctions.js'
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/ipfs_leftNav2';

const jQuery = require("jquery");

export default class IPFSGeneralInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        
        var ipfsShowConfigHTML = await IpfsFunctions.ipfsShowConfig_main();
        jQuery("#ipfsShowConfigContainer").html(ipfsShowConfigHTML)
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div className="h2">IPFS Config File</div>
                        <pre id="ipfsShowConfigContainer" style={{backgroundColor:"yellow",marginBottom:"5px"}} >ipfsShowConfigContainer</pre>
                    </div>
                </fieldset>
            </>
        );
    }
}
