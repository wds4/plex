import React from "react";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/ipfs_leftNav2';

// import * as IPFS from 'ipfs-core'
// const ipfs = IPFS.create()

const jQuery = require("jquery");

export default class IPFSGeneralInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        /*
        const ipfs = await IPFS.create()

        const ipfs_info_obj = await ipfs.id();
        console.info("ipfs_info_obj: "+JSON.stringify(ipfs_info_obj,null,4)) // id: 12D3KooWMBxT9GE6hYLCj3QFEyN2wC3j28VCdyo44uwk5WWphgwT
        const config = await ipfs.config.getAll();
        console.info("config: "+JSON.stringify(config,null,4))
        */
        /*
        const newConfig = {
        "Bootstrap": [
               "/ip4/206.123.119.235/tcp/4001/p2p/QmXvSDSxcgRfPzXLhet8SEbrtA36paH6rUrM64bzBWksZB",
               "/ip4/34.222.144.119/tcp/4001/ipfs/QmawuDjAyAvRQNvsNHdKwaeCgkgyMFmmTWrt25e8mqWVtW",
               "/ip4/76.100.212.118/tcp/4001/p2p/QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ",
               "/ip4/76.100.212.118/tcp/4001/p2p/Qmevsrf1o6yTmjd9TM4fP1BrPmuKR9GVJyCz2ffw34qAty",
               "/ip4/76.100.212.118/tcp/4001/p2p/QmX1dzUb3TSGUbP28nLYEMJEt7X4UuPdpGXPFTF9YQtDhJ",
               "/ip4/76.100.212.118/tcp/4001/p2p/12D3KooWJpiTmrQGWG9oThj6MAMhMmm756htH2Co1TT6LsPsBWki"
            ]
        }

        await ipfs.config.replace(newConfig)

        const config2 = await ipfs.config.getAll();
        console.info("config2: "+JSON.stringify(config2,null,4))

        jQuery("#ipfsButton1").click(async function(){
            console.log("ipfsButton1 clicked")
            const { cid } = await ipfs.add('Hello world')
            console.info("ciddd: "+cid)
        })
        */

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

                        <a target='_blank' href='https://github.com/ipfs/js-ipfs/tree/master/docs/core-api' >https://github.com/ipfs/js-ipfs/tree/master/docs/core-api</a>

                        <div style={{fontSize:"12px",backgroundColor:"#DFDFDF"}}>
                        If ipfs is not running, go to terminal and run:<br/>
                        ipfs swarm peers (to check if it is running)<br/>
                        ipfs daemon --enable-pubsub-experiment (to start ipfs node)<br/>
                        ipfs pubsub sub grapevine (to subscribe to grapevine pubsub)
                        </div>

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
