import React from "react";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as IpfsFunctions from '../../functions/ipfsFunctions.js'
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/ipfs_leftNav2';

const jQuery = require("jquery");

export default class IPFSPeersInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        IpfsFunctions.ipfsSwarmPeers_main();

    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div className="h2">IPFS Peers Info</div>

                        <div id="ipfsSwarmPeersDataContainer" style={{backgroundColor:"yellow",marginBottom:"5px",overflow:"scroll"}} >
                            Peers that ought to be present:<br/>
                            <li> <div className="swarmPeerVerification" id="rochen-nodeVerification" >?</div> QmXvSDSxcgRfPzXLhet8SEbrtA36paH6rUrM64bzBWksZB (Rochen node)</li>
                            <li> <div className="swarmPeerVerification" id="aws-nodeVerification" >?</div> QmawuDjAyAvRQNvsNHdKwaeCgkgyMFmmTWrt25e8mqWVtW (AWS node)</li>
                            <li> <div className="swarmPeerVerification" id="MBP-electron-nodeVerification" >?</div> Qmevsrf1o6yTmjd9TM4fP1BrPmuKR9GVJyCz2ffw34qAty (MBP electron (.jsipfs) node)</li>
                            <li> <div className="swarmPeerVerification" id="iMac-electron-nodeVerification" >?</div> QmX1dzUb3TSGUbP28nLYEMJEt7X4UuPdpGXPFTF9YQtDhJ (iMac electron (.jsipfs) node)</li>
                            <li> <div className="swarmPeerVerification" id="MBP-go-ipfs-nodeVerification" >?</div> QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ (MBP IPFS Desktop (.ipfs, go-ipfs node)</li>
                            <li> <div className="swarmPeerVerification" id="iMac-go-ipfs-nodeVerification" >?</div> 12D3KooWJpiTmrQGWG9oThj6MAMhMmm756htH2Co1TT6LsPsBWki (iMac IPFS Desktop (.ipfs, go-ipfs node)</li>

                            <pre id="swarmPeersData" style={{backgroundColor:"yellow",marginBottom:"5px",width:"1200px",overflow:"scroll"}} ></pre>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
