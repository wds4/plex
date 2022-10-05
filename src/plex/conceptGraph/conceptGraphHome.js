import React from 'react';
import ConceptGraphMasthead from '../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../navbars/leftNavbar1/conceptGraph_leftNav1';
// import * as MiscFunctions from '../functions/miscFunctions.js';
// import * as InitDOMFunctions from '../functions/transferSqlToDOM.js';

const jQuery = require("jquery");

export default class ConceptGraphHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Concept Graph Home (back end)</div>


                        <div style={{backgroundColor:"#BBFFBB",padding:"10px",margin:"20px"}} >
                        Concept Graph back end: build CG in SQL; neuroCore sends updates to SQL database.
                        </div>

                        <div style={{backgroundColor:"#BBFFBB",padding:"10px",margin:"20px"}} >
                        Concept Graph front end: download starter CG from single founder schema file (given its ipns, ipfs, or steward peerID + MFS path)
                        to local Mutable File System; neuroCore sends updates to local MFS.
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
