import React from "react";
import Masthead from '../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/cgFe_singleConceptGraph_manualImports_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../../lib/ipfs/conceptGraphInMfsFunctions.js';

const jQuery = require("jquery");

export default class ConceptGraphsFrontEndSingleConceptGraphManualImportsSingleWordByIpns extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        jQuery("#fetchWordButton").click(async function(){
            var ipns = jQuery("#ipnsContainer").val()
            // console.log("fetchWordButton; ipns: "+ipns)
            var path = "/ipns/"+ipns;
            // console.log("path: "+path)
            var oWord = await ConceptGraphInMfsFunctions.fetchObjectByCatIpfsPath(path);
            console.log("fetchWordButton; ipns: "+ipns+"; oWord: "+JSON.stringify(oWord,null,4))

        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">Manual import single word into this Concept Graph from external source based on its IPNS</div>

                        <div style={{border:"1px solid green",display:"inline-block",width:"600px",height:"800px"}} >
                            <center>import word into currently-viewing Concept Graph</center>
                            <div id="conceptSelector" >conceptSelector</div>
                            <div id="setRadioButtons" >setRadioButtons</div>
                        </div>

                        <div style={{border:"1px solid green",display:"inline-block",width:"600px",height:"800px"}} >
                            <center>import using IPNS into textarea</center>
                            Enter IPNS: <div id="fetchWordButton" className="doSomethingButton" >fetch</div>
                            <textarea id="ipnsContainer" style={{display:"inline-block",width:"95%",height:"40px"}} >
                            </textarea>

                            <textarea id="importedWordContainer" style={{display:"inline-block",width:"95%",height:"700px"}} >
                            </textarea>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
