import React from "react";
// import ReactDOM from 'react-dom';
// import ConceptGraphMasthead from '../../../conceptGraphMasthead.js';
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
// import LeftNavbar from '../../../LeftNavbar';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/neuroCore_leftNav2.js';
import neuroCoreConfig from '../../../configFiles/neuroCoreConfig.json'
import neuroCoreConfigReadme from '../../../configFiles/neuroCoreConfigReadme.txt'
// import fs from 'fs'
// import fse from 'fs-extra'

const jQuery = require("jquery");
// const fs = require('fs')
// const fse = require('fs-extra')

export default class NeuroCoreCofig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        fetch(neuroCoreConfigReadme)
        .then((r) => r.text())
        .then(text  => {
            // console.log(text);
            jQuery("#neuroCoreConfigReadmeContainer").val(text)
            jQuery("#neuroCoreConfigReadmeContainer").html(text)
        })
    }
    render() {
        return (
          <>
            <fieldset className="mainBody" >
                <LeftNavbar1 />
                <LeftNavbar2 />
                <div className="mainPanel" >
                    <ConceptGraphMasthead />
                    <div class="h2">NeuroCore Config</div>

                    <textarea id="neuroCoreConfigContainer" style={{width:"60%",height:"400px"}}>
                    {JSON.stringify(neuroCoreConfig,null,4)}
                    </textarea>
                    <br/>
                    To update: <pre style={{display:"inline-block",padding:"0px"}}>plex/configFiles/neuroCoreConfig.json</pre>

                    <br/><br/>

                    <pre id="neuroCoreConfigReadmeContainer" style={{border:"1px solid grey",padding:"5px",width:"60%"}} >
                    </pre>
                    To update: <pre style={{display:"inline-block",padding:"0px"}}>plex/configFiles/neuroCoreConfigReadme.txt</pre>
                </div>
            </fieldset>
          </>
        );
    }
}
