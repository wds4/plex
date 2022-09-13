import React from "react";
import sendAsync from '../../../../renderer.js';
const jQuery = require("jquery");
const electronFs = window.require('fs');

const patterns_header = `import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../../../functions/conceptGraphFunctions.js';
import { oPatternDataOutputTemplate } from './constants.js';
const jQuery = require("jquery");

export const checkSingleS1nPattern = async (node_slug,oNextPattern,oRawFileLookup) => {
    var oCheckSingleS1nPatternOutput = {};
    var isPatternPresent = false;
    var patternName = oNextPattern.patternName;

    var oNode = oRawFileLookup[node_slug];
    var oAuxiliaryData = {};
    oAuxiliaryData.node = node_slug;
    var oExtraAuxiliaryData = {};

    switch (patternName) {
`;

const patterns_footer = `
        default:
            // code
            break;
    }

    oCheckSingleS1nPatternOutput.isPatternPresent = isPatternPresent;
    oAuxiliaryData.oExtraAuxiliaryData = oExtraAuxiliaryData;

    // console.log("checkSingleS1nPattern; node_slug: "+node_slug+"; oCheckSingleS1nPatternOutput.isPatternPresent: "+oCheckSingleS1nPatternOutput.isPatternPresent)
    oCheckSingleS1nPatternOutput.oAuxiliaryData = oAuxiliaryData;
    return oCheckSingleS1nPatternOutput;
}
`;

const transferPatternFunctions = async () => {
    // console.log("updateConceptGraphPatterns_s1n")
    var sql = " SELECT * from conceptGraphPatterns_s1n ";
    // console.log("updateNodeLookup sql: "+sql);

    var r = await sendAsync(sql).then( async (result) => {
        var aResult = result;
        var numRows = aResult.length;
        // console.log("updateConceptGraphPatterns_s1n numRows: "+numRows)
        var outputFile = "";
        outputFile += patterns_header;
        for (var r=0;r<numRows;r++) {
            var oNextPattern = aResult[r];
            var nextPattern_id = oNextPattern.id;
            var nextPattern_patternName = oNextPattern.patternName;
            var nextPattern_opCodesB = oNextPattern.opCodesB;
            var nextPattern_actionsList = oNextPattern.actionsList;
            var nextPattern_javascript = oNextPattern.javascript;
            var nextPattern_javascript_formatted = "                "+nextPattern_javascript.replaceAll("\n","\n                ")+"\n";

            var nextPattern_patternName_converted = nextPattern_patternName.replaceAll(".","_").toLowerCase();

            window.lookupPatternJavascriptByName[nextPattern_patternName] = nextPattern_javascript;

            outputFile += `        case "`+nextPattern_patternName+`": \n`;
            outputFile += `            try { \n`;
            outputFile += nextPattern_javascript_formatted;
            outputFile += `            } catch (err) { \n`;
            outputFile += `                console.log("javaScriptError with pattern `+nextPattern_patternName_converted+`; err: "+err); \n`;
            outputFile += `                console.log("node_slug: "+node_slug+"; "); \n`;
            outputFile += `            } \n`;
            outputFile += `            break; \n`;

        }

        outputFile += patterns_footer;

        electronFs.writeFile("src/plex/neuroCore/neuroCoreFunctions/patterns/patterns-s1n.js", outputFile, (err) => {
            if (err)
                console.log(err);
            else {
                console.log("patterns-s1n file written successfully\n");
            }
        });

        return true;

    });

}

export default class RecreatePatternsS1n extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery("#recreatePatternsS1nButton").click(function(){
            transferPatternFunctions();
        })
    }
    render() {
        return (
          <>
              <div style={{border:"1px solid grey",margin:"5px",padding:"5px"}} >
              Rewrite file with code for patterns-s1n.js<br/>
              (Do this every time javascript is updated in Table for Patterns (s1n),
              <br/>
              by transfering data from SQL table: conceptGraphPatterns_s1n to file: patterns-s1n.js.)
              <br/>
              ( src/plex/neuroCore/neuroCoreFunctions/patterns/patterns-s1n.js )
              <br/>
              <div id="recreatePatternsS1nButton" className="doSomethingButton">Rewrite</div>
              </div>
          </>
        );
    }
}
