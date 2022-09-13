import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../../../functions/conceptGraphFunctions.js';
import { oPatternDataOutputTemplate } from './constants.js';
const jQuery = require("jquery");

export const checkSingleS1nPattern = (node_slug,oNextPattern,oRawFileLookup) => {
    var oCheckSingleS1nPatternOutput = {};
    var isPatternPresent = false;
    var patternName = oNextPattern.patternName;

    var oNode = oRawFileLookup[node_slug];

    switch (patternName) {
        case "P.rV1.s1n.00": 
            try { 
                var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                for (var p=0;p < aNodePatternCodes.length;p++) {
                    var nextPatternCode = aNodePatternCodes[p];
                    if (nextPatternCode.includes("P.rV1.s1n.00")) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) { 
                console.log("javaScriptError with pattern p_rv1_s1n_00; err: "+err); 
                console.log("node_slug: "+node_slug+"; "); 
            } 
            break; 
        case "P.rV0.s1n.00": 
            try { 
                var aNodePatternCodes = oNode.globalDynamicData.nodePatternCodes;
                for (var p=0;p < aNodePatternCodes.length;p++) {
                    var nextPatternCode = aNodePatternCodes[p];
                    if (nextPatternCode.includes("P.rV0.s1n.00")) {
                        isPatternPresent = true;
                    }
                }
            } catch (err) { 
                console.log("javaScriptError with pattern p_rv0_s1n_00; err: "+err); 
                console.log("node_slug: "+node_slug+"; "); 
            } 
            break; 

        default:
            // code
            break;
    }

    oCheckSingleS1nPatternOutput.isPatternPresent = isPatternPresent;

    console.log("checkSingleS1nPattern; node_slug: "+node_slug+"; oCheckSingleS1nPatternOutput.isPatternPresent: "+oCheckSingleS1nPatternOutput.isPatternPresent)
    return oCheckSingleS1nPatternOutput;
}
