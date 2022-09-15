import React from "react";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
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

        var ipfsStatusDataHTML = await MiscIpfsFunctions.ipfsShowStatusData();
        jQuery("#ipfsStatusDataContainer").html(ipfsStatusDataHTML)

        var ipfsVersionDataHTML = await MiscIpfsFunctions.ipfsShowVersion();
        jQuery("#ipfsVersionDataContainer").html(ipfsVersionDataHTML)

        var ipfsDnsDataHTML = await MiscIpfsFunctions.ipfsShowDNS();
        jQuery("#ipfsDnsDataContainer").html(ipfsDnsDataHTML)

        var ipfsStatsDataHTML = await MiscIpfsFunctions.ipfsShowStats();
        jQuery("#ipfsStatsDataContainer").html(ipfsStatsDataHTML)
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div className="h2">IPFS General Info</div>
                        id:<br/>
                        <div id="ipfsStatusDataContainer" style={{backgroundColor:"yellow",marginBottom:"5px"}} >ipfsStatusDataContainer</div>
                        <br/><br/>
                        version:<br/>
                        <div id="ipfsVersionDataContainer" style={{backgroundColor:"yellow",marginBottom:"5px"}} >ipfsVersionDataContainer</div>
                        <br/><br/>
                        dns:<br/>
                        <div id="ipfsDnsDataContainer" style={{backgroundColor:"yellow",marginBottom:"5px"}} >ipfsDnsDataContainer</div>
                        <br/><br/>
                        stats (IPFS bandwith information):<br/>
                        <div id="ipfsStatsDataContainer" style={{backgroundColor:"yellow",marginBottom:"5px"}} >ipfsStatsDataContainer</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
