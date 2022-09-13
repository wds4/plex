import React from "react";
import sendAsync from '../../../../renderer.js';
const jQuery = require("jquery");

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default class SyncPatternActionTables extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    async componentDidMount() {
        jQuery("#syncPatternActionTablesButton").click(async function(){
            jQuery("#syncPAReportContainer").html("");
            var sql0 = " SELECT * from conceptGraphActions_u1n ";

            var sql1 = " SELECT * from conceptGraphPatterns_s1n ";
            var sql2 = " SELECT * from conceptGraphPatterns_s1r ";
            var sql3 = " SELECT * from conceptGraphPatterns_s2r ";

            var oMapActionsToPatterns = {};
            var aExistingActions = [];
            var aMissingActions = [];

            var r0 = await sendAsync(sql0).then( async (result) => {
                var aResult = result;
                var numRows = aResult.length;
                console.log("updateConceptGraphActions_u1n numRows: "+numRows)
                jQuery("#syncPAReportContainer").append("updateConceptGraphActions_u1n numRows: "+numRows+"<br>");
                var outputFile = "";
                for (var r=0;r<numRows;r++) {
                    var oNextAction = aResult[r];
                    var nextAction_id = oNextAction.id;
                    var nextAction_actionName = oNextAction.actionName;
                    var nextAction_patternsList = oNextAction.patternsList;
                    oMapActionsToPatterns[nextAction_actionName] = [];
                    aExistingActions.push(nextAction_actionName)
                    // console.log("updateConceptGraphActions_u1n nextAction_actionName: "+nextAction_actionName+"; nextAction_javascript: "+nextAction_javascript)
                }
            });

            var t1 = await timeout(1000)

            var r1 = await sendAsync(sql1).then( async (result) => {
                var aResult = result;
                var numRows = aResult.length;
                console.log("conceptGraphPatterns_s1n numRows: "+numRows)
                jQuery("#syncPAReportContainer").append("conceptGraphPatterns_s1n numRows: "+numRows+"<br>");
                var outputFile = "";
                for (var r=0;r<numRows;r++) {
                    var oNextPattern = aResult[r];
                    var nextPattern_id = oNextPattern.id;
                    var nextPattern_patternName = oNextPattern.patternName;
                    var nextPattern_actionsList = oNextPattern.actionsList;
                    var aActionsList = nextPattern_actionsList.split(",")
                    for (var a=0;a<aActionsList.length;a++) {
                        var nextAction = aActionsList[a];
                        if (oMapActionsToPatterns.hasOwnProperty(nextAction)) {
                            oMapActionsToPatterns[nextAction].push(nextPattern_patternName)
                        } else {
                            if (jQuery.inArray(nextAction,aMissingActions) == -1) {
                                aMissingActions.push(nextAction)
                            }
                        }
                    }
                }
            });

            var t2 = await timeout(1000)

            var r2 = await sendAsync(sql2).then( async (result) => {
                var aResult = result;
                var numRows = aResult.length;
                console.log("conceptGraphPatterns_s1r numRows: "+numRows)
                jQuery("#syncPAReportContainer").append("conceptGraphPatterns_s1r numRows: "+numRows+"<br>");
                var outputFile = "";
                for (var r=0;r<numRows;r++) {
                    var oNextPattern = aResult[r];
                    var nextPattern_id = oNextPattern.id;
                    var nextPattern_patternName = oNextPattern.patternName;
                    var nextPattern_actionsList = oNextPattern.actionsList;
                    var aActionsList = nextPattern_actionsList.split(",")
                    for (var a=0;a<aActionsList.length;a++) {
                        var nextAction = aActionsList[a];
                        if (oMapActionsToPatterns.hasOwnProperty(nextAction)) {
                            oMapActionsToPatterns[nextAction].push(nextPattern_patternName)
                        } else {
                            if (jQuery.inArray(nextAction,aMissingActions) == -1) {
                                aMissingActions.push(nextAction)
                            }
                        }
                    }
                }
            });

            var t3 = await timeout(1000)

            var r3 = await sendAsync(sql3).then( async (result) => {
                var aResult = result;
                var numRows = aResult.length;
                console.log("conceptGraphPatterns_s2r numRows: "+numRows)
                jQuery("#syncPAReportContainer").append("conceptGraphPatterns_s2r numRows: "+numRows+"<br>");
                var outputFile = "";
                for (var r=0;r<numRows;r++) {
                    var oNextPattern = aResult[r];
                    var nextPattern_id = oNextPattern.id;
                    var nextPattern_patternName = oNextPattern.patternName;
                    var nextPattern_actionsList = oNextPattern.actionsList;
                    var aActionsList = nextPattern_actionsList.split(",")
                    for (var a=0;a<aActionsList.length;a++) {
                        var nextAction = aActionsList[a];
                        if (oMapActionsToPatterns.hasOwnProperty(nextAction)) {
                            oMapActionsToPatterns[nextAction].push(nextPattern_patternName)
                        } else {
                            if (jQuery.inArray(nextAction,aMissingActions) == -1) {
                                aMissingActions.push(nextAction)
                            }
                        }
                    }
                }
            });

            var t4 = await timeout(1000)

            // jQuery.each(oMapActionsToPatterns, async function(actionName,aPatterns){
            for (var a=0;a<aExistingActions.length;a++) {
                var actionName = aExistingActions[a];
                console.log("actionName: "+actionName+"; numPatterns: "+oMapActionsToPatterns[actionName].length)
                var reportHTML = "";
                reportHTML += "<div style=display:inline-block;width:300px; >";
                reportHTML += actionName;
                reportHTML += "</div>";
                reportHTML += "<div style=display:inline-block;width:300px; >";
                reportHTML += oMapActionsToPatterns[actionName].length;
                reportHTML += "</div>";
                reportHTML += "<br>";
                jQuery("#syncPAReportContainer").append(reportHTML);

                var patternsList = "";
                for (var p=0;p<oMapActionsToPatterns[actionName].length;p++) {
                    var nextPattern = oMapActionsToPatterns[actionName][p];
                    patternsList+=nextPattern;
                    if (p+1<oMapActionsToPatterns[actionName].length) {
                        patternsList+=",";
                    }
                }
                var sql = " UPDATE conceptGraphActions_u1n set patternsList = '"+patternsList+"' WHERE actionName='"+actionName+"' ";
                var foo = await sendAsync(sql)
                await timeout(300)
                console.log("sql: "+sql)
            }
            // })
            console.log("numMissingActions: "+aMissingActions.length)
            console.log("aMissingActions: "+JSON.stringify(aMissingActions,null,4))

            jQuery("#syncPAReportContainer").append("numMissingActions: "+aMissingActions.length+"<br>");
            jQuery("#syncPAReportContainer").append("aMissingActions: "+JSON.stringify(aMissingActions,null,4)+"<br>");
        });
    }
    render() {
        return (
          <>
              <div style={{border:"1px solid grey",margin:"5px",padding:"5px"}} >
                  Recalculate patternsList column in all Actions Tables <br/>
                  by transfering data from Patterns Tables
                  <br/>
                  <div id="syncPatternActionTablesButton" className="doSomethingButton">Sync</div>
                  <br/>
                  <div id="syncPAReportContainer" ></div>
              </div>
          </>
        );
    }
}
