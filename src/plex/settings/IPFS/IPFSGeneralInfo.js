import React from "react";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/ipfs_leftNav2';

// import * as IPFS from 'ipfs-core'

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

        const { cid } = await ipfs.add('Hello world')
        console.info("cid: "+cid)

        const oIpfsId = await ipfs.id();
        console.info("oIpfsId: "+JSON.stringify(oIpfsId,null,4)) // id: 12D3KooWABPgr9ouzhoDtYRvBpa8vU31GX27ktC4vJwe5xCn9AVT

        const config = await ipfs.config.getAll();
        console.info("config: "+JSON.stringify(config,null,4))

        const newConfig = {
            "Addresses": {
                "Swarm": [],
                "Announce": [],
                "NoAnnounce": [],
                "API": "",
                "Gateway": "",
                "RPC": "",
                "Delegates": [
                    "/dns4/node0.delegate.ipfs.io/tcp/443/https",
                    "/dns4/node1.delegate.ipfs.io/tcp/443/https",
                    "/dns4/node2.delegate.ipfs.io/tcp/443/https",
                    "/dns4/node3.delegate.ipfs.io/tcp/443/https"
                ]
            },
            "Discovery": {
                "MDNS": {
                    "Enabled": false,
                    "Interval": 10
                },
                "webRTCStar": {
                    "Enabled": true
                }
            },
            "Bootstrap": [
                "/ip4/206.123.119.235/tcp/4001/p2p/QmXvSDSxcgRfPzXLhet8SEbrtA36paH6rUrM64bzBWksZB",
                "/ip4/34.222.144.119/tcp/4001/p2p/QmawuDjAyAvRQNvsNHdKwaeCgkgyMFmmTWrt25e8mqWVtW",
                "/ip4/76.100.212.118/tcp/4001/p2p/QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ",
                "/ip4/76.100.212.118/tcp/4001/p2p/12D3KooWJpiTmrQGWG9oThj6MAMhMmm756htH2Co1TT6LsPsBWki"
            ],
            "Pubsub": {
                "Enabled": true
            },
            "Swarm": {
                "ConnMgr": {
                    "LowWater": 5,
                    "HighWater": 20
                },
                "DisableNatPortMap": true
            },
            "Routing": {
                "Type": "dhtclient"
            },
            "Identity": {
                "PeerID": "12D3KooWABPgr9ouzhoDtYRvBpa8vU31GX27ktC4vJwe5xCn9AVT",
                "PrivKey": "CAESQEU1Nzu/xjHlfEyNLYgi0A/AFz+dJCfqKXr7b3wYfiZOBWLqIOmD6nYkwXEjwxIMlAhy5/JKxpB833zsEADgZmY="
            },
            "Datastore": {
                "Spec": {
                    "type": "mount",
                    "mounts": [
                        {
                            "mountpoint": "/blocks",
                            "type": "measure",
                            "prefix": "flatfs.datastore",
                            "child": {
                                "type": "flatfs",
                                "path": "blocks",
                                "sync": true,
                                "shardFunc": "/repo/flatfs/shard/v1/next-to-last/2"
                            }
                        },
                        {
                            "mountpoint": "/",
                            "type": "measure",
                            "prefix": "leveldb.datastore",
                            "child": {
                                "type": "levelds",
                                "path": "datastore",
                                "compression": "none"
                            }
                        }
                    ]
                }
            },
            "Keychain": {
                "DEK": {
                    "keyLength": 64,
                    "iterationCount": 10000,
                    "salt": "2a+5fUUCefc8cqgCT4Eva4pp",
                    "hash": "sha2-512"
                }
            }
        }

        // await ipfs.config.replace(newConfig)
        // config has been replaced

        // const config2 = await ipfs.config.getAll();
        /// console.info("config2: "+JSON.stringify(config2,null,4))

        */

        var ipfsStatusDataHTML = await MiscIpfsFunctions.ipfsShowStatusData();
        jQuery("#ipfsStatusDataContainer").html(ipfsStatusDataHTML)

        var ipfsVersionDataHTML = await MiscIpfsFunctions.ipfsShowVersion();
        jQuery("#ipfsVersionDataContainer").html(ipfsVersionDataHTML)

        var ipfsDnsDataHTML = await MiscIpfsFunctions.ipfsShowDNS();
        jQuery("#ipfsDnsDataContainer").html(ipfsDnsDataHTML)

        var ipfsStatsDataHTML = await MiscIpfsFunctions.ipfsShowStats();
        jQuery("#ipfsStatsDataContainer").html(ipfsStatsDataHTML)


        jQuery("#ipfsButton1").click(async function(){
            /*
            console.log("ipfsButton1 clicked")

            const peerInfos = await ipfs.swarm.peers()
            console.log("peerInfos: "+JSON.stringify(peerInfos,null,4))

            const multiAddrs = await ipfs.swarm.localAddrs()
            console.log("multiAddrs: "+JSON.stringify(multiAddrs,null,4))


            const { cid } = await ipfs.add('Hello world')
            console.info("cid: "+cid)

            const oIpfsId = await ipfs.id();
            console.info("oIpfsId: "+JSON.stringify(oIpfsId,null,4)) // id: 12D3KooWABPgr9ouzhoDtYRvBpa8vU31GX27ktC4vJwe5xCn9AVT

            const config = await ipfs.config.getAll();
            console.info("config: "+JSON.stringify(config,null,4))
            */
        })
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

/*
'/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
'/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
'/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
'/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
'/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
'/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
'/dns4/node0.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic',
'/dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
'/dns4/node2.preload.ipfs.io/tcp/443/wss/p2p/QmV7gnbW5VTcJ3oyM2Xk1rdFBJ3kTkvxc87UFGsun29STS',
'/dns4/node3.preload.ipfs.io/tcp/443/wss/p2p/QmY7JB6MQXhxHvq7dBDh4HpbH29v4yE9JRadAVpndvzySN'
*/

/*
"/ip4/206.123.119.235/tcp/4001/p2p/QmXvSDSxcgRfPzXLhet8SEbrtA36paH6rUrM64bzBWksZB",
"/ip4/34.222.144.119/tcp/4001/p2p/QmawuDjAyAvRQNvsNHdKwaeCgkgyMFmmTWrt25e8mqWVtW",
"/ip4/76.100.212.118/tcp/4001/p2p/QmWpLB32UFkrVTDHwstrf8wdFSen5kbrs1TGEzu8XaXtKQ",
"/ip4/76.100.212.118/tcp/4001/p2p/12D3KooWJpiTmrQGWG9oThj6MAMhMmm756htH2Co1TT6LsPsBWki"
*/
