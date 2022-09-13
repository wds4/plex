
// import React, { useState } from 'react';
import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
// import React from 'react';
// import * as Constants from './conceptGraphMasthead.js';
import ConceptGraphMasthead from './conceptGraphMasthead.js';
import LeftNavbar from './LeftNavbar';
// import fs from 'fs-extra';
import IpfsHttpClient from 'ipfs-http-client';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
  host: "localhost",
  port: "5001",
  protocol: "http"
});

var ipfsShowID_html = `
    <div class="smallLeftCol_ipfsInfoBox" >IPFS node ID:</div> <div id="ipfs_id" style=display:inline-block; ></div><br/>
    <div class="smallLeftCol_ipfsInfoBox" >IPFS publicKey:</div> <div id="ipfs_publicKey" style=overflow:scroll;width:800px;font-size:10px;display:inline-block; ></div><br/>
    <div class="smallLeftCol_ipfsInfoBox" >IPFS agentVersion:</div> <div id="ipfs_agentVersion" style=display:inline-block; ></div><br/>
    <div class="smallLeftCol_ipfsInfoBox" >IPFS protocolVersion:</div> <div id="ipfs_protocolVersion" style=display:inline-block; ></div><br/>
`;

function Timer() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setCount((count) => count + 1);
        }, 1000);
    }, [count]); // <- add empty brackets here

    return <h1>I've rendered {count} times!</h1>;
}

// var appTimer = 1;
export const runMainTimer = () => {
    setInterval( async () => {
        // appTimer++
        window.plexTimerCount++
    }, 1000);
}



async function ipfsShowID_main() {
    const ipfs_info_obj = await ipfs.id();
    console.log(ipfs_info_obj)

    var ipfs_id = ipfs_info_obj.id;
    // var my_ipfs_id = ipfs_info_obj.id;
    var ipfs_publicKey = ipfs_info_obj.publicKey;
    // var ipfs_addresses_arr = ipfs_info_obj.addresses;
    var ipfs_agentVersion = ipfs_info_obj.agentVersion;
    var ipfs_protocolVersion = ipfs_info_obj.protocolVersion;

    console.log("ipfs_id: "+ ipfs_id);
    console.log("ipfs_publicKey: "+ ipfs_publicKey);
    console.log("ipfs_agentVersion: "+ ipfs_agentVersion);
    console.log("ipfs_protocolVersion: "+ ipfs_protocolVersion);

    document.getElementById("ipfs_id").innerHTML = ipfs_id;
    document.getElementById("ipfs_publicKey").innerHTML = ipfs_publicKey;
    document.getElementById("ipfs_agentVersion").innerHTML = ipfs_agentVersion;
    document.getElementById("ipfs_protocolVersion").innerHTML = ipfs_protocolVersion;
}

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            oTestVarApp: {
                foo: "barrrr"
            },
            appTimer: 0,
            count: window.plexTimerCount
        };
        // var testLink2 = "<Link class='navButton' to='/'>test link</Link>";
    }
    countUp() {
        this.setState({ count: this.state.count + 1 })
        // this.setState(currentState => {
          //   return { count: currentState.count + 1 };
        // });
    }

    componentDidMount() {
        jQuery("#landingPageElem").append(ipfsShowID_html);
        ipfsShowID_main();
        // runMainTimer();
        setInterval(function () {
            // countUp()
            // this.state.appTimer++
            // this.setState({appTimer: this.state.appTimer +1 });
        }, 1000);
    }
    render() {
      const { count } = this.state;
      return (
        <div className="mainBody_wrapper" >
          <fieldset className="mainBody" >
              <LeftNavbar appTimer={this.state.appTimer} />
              <div id="mainPanel" className="mainPanel" >
                  <ConceptGraphMasthead appTimer={this.state.appTimer} oTestVar = {this.state.oTestVarApp} />
                  <div className="h2">Home page {this.state.oTestVarApp.foo}; appTimer: {this.state.appTimer}; useEffect timer: <Timer /></div>
                  <div>
                    <button onClick={() => this.countUp()}>count: {count}; window.plexTimerCount: {window.plexTimerCount}</button>
                  </div>
                  <div id="tech-box" >
                      <div className="smallLeftCol" style={{color:"brown"}} >We are using:</div> <span style={{color:"brown"}} >version:</span><br/>
                      <div className="smallLeftCol" >Node.js</div> <span id="node-version">,</span><br/>
                      <div className="smallLeftCol" >Chromium</div> <span id="chrome-version">,</span><br/>
                      <div className="smallLeftCol" >and Electron</div> <span id="electron-version">.</span><br/><br/>
                  </div>
                  <div id="landingPageElem" ></div>
              </div>
          </fieldset>
        </div>
      );
    }
}

export default App;
