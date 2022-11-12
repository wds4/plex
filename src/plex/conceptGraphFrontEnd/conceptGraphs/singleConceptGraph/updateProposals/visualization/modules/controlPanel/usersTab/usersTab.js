import React from "react";
import ReactDOM from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import * as MiscFunctions from '../../../../../../../../functions/miscFunctions.js';
import * as ConceptGraphInMfsFunctions from '../../../../../../../../lib/ipfs/conceptGraphInMfsFunctions.js'
import noUiSlider from "nouislider";
import "nouislider/distribute/nouislider.min.css";
import { aUserTrustScores } from '../../../visualizeCalculations.js';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

async function makeThisPageTable(usersDataSet) {
    jQuery('#table_users thead th').each(function () {
        var title = jQuery(this).text();
        jQuery(this).html(title + '<br><input id="searchDiv_'+title+'" type="text" placeholder="Search ' + title + '" />');
    });
    jQuery.fn.dataTable.ext.order['dom-text-numeric'] = function (settings, col) {
        return this.api()
            .column(col, { order: 'index' })
            .nodes()
            .map(function (td, i) {
                return jQuery('input', td).val() * 1;
            });
    };
    jQuery.fn.dataTable.ext.order['dom-text-numeric2'] = function (settings, col) {
        return this.api()
            .column(col, { order: 'index' })
            .nodes()
            .map(function (td, i) {
                return jQuery('div', td).data("result") * 1;
            });
    };
    var dtable = jQuery('#table_users').DataTable({
        data: usersDataSet,
        pageLength: 100,
        "columns": [
            {
                "class":          'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { visible: false },
            { },
            { visible: false },
            { orderDataType: 'dom-text-numeric2' },
            { orderDataType: 'dom-text-numeric2' },
            { orderDataType: 'dom-text-numeric2' },
            { orderDataType: 'dom-text-numeric2' }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip',
        initComplete: function () {
            // Apply the search
            this.api()
                .columns()
                .every(function () {
                    var that = this;
                    jQuery('input', this.header()).on('keyup change clear', function () {
                        if (that.search() !== this.value) {
                            that.search(this.value).draw();
                        }
                    });
                });
        },

        "drawCallback": function( settings ) {
            try {
                jQuery(".nextRowEditButton").click(function(){
                    var sqlid = jQuery(this).data("sqlid");
                    jQuery("#linkFrom_"+sqlid).get(0).click();
                })
            } catch (e) {}
        }
    });
    // dtable.cell(jQuery(".influenceContainer")).data("updated").draw("full-hold")
    // Add event listener for opening and closing details
    jQuery('#table_users tbody').on('click', 'td.details-control', async function () {
        // console.log("clicked icon");
        var tr = jQuery(this).parents('tr');
        var row = dtable.row( tr );
        // console.log("row: "+row);
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }

        else {
            var d=row.data();
            var username = d[2];
            var peerID = d[3];

            var expansionHTML = "";
            expansionHTML += "<div>";
            expansionHTML += username;
            expansionHTML += "<br>";
            expansionHTML += peerID;
            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');
        }
    });
    console.log("makeThisPageTable B")
}

export const updateAllUsersTrustCompositeScore = async (masterUsersList) => {
    console.log("updateAllUsersTrustCompositeScore")
    for (var u=0;u<masterUsersList.length;u++) {
        var user_ipns = masterUsersList[u];
        console.log("user_ipns: "+user_ipns)
    }

    var sUtCS1 = jQuery("#utCompositeScoreContainer1").val()
    var oUtCS1 = JSON.parse(sUtCS1)

    var wordSlug = "userTrustCompositeScore_multiSpecificInstance_superset"
    var wordName = "user trust composite score: multi specific instance, superset"
    var wordTitle = "User Trust Composite Score: Multi Specific Instance, superset"
    var wordDescription = "multiple specific instances stored in one file as one word, via the relationship: areSpecificInstancesOf the superset for the concept of userTrustCompositeScore.";

    oUtCS1.wordData.slug = wordSlug;
    oUtCS1.wordData.name = wordName;
    oUtCS1.wordData.title = wordTitle;
    oUtCS1.wordData.description = wordDescription;

    var aUTS = MiscFunctions.cloneObj(aUserTrustScores)

    for (var c=0;c<aUTS.length;c++) {
        var compositeScoreNumber = c;
        if (compositeScoreNumber==2) {
            var aUsers = aUTS[c].users;
            var aAllScores = []
            for (var u=0;u<aUsers.length;u++) {
                var oCSD = aUsers[u]
                delete oCSD.ratings;
                delete oCSD.defaultRating;
                delete oCSD.inheritedRatings;
                delete oCSD.inverseRatings;
                delete oCSD.fooR; // temporary
                delete oCSD.fooIR; // temporary
                aAllScores.push(oCSD)
            }
            oUtCS1.aUserTrustCompositeScoreData = aAllScores
            jQuery("#utCompositeScoreContainer2").val(JSON.stringify(oUtCS1,null,4))
        }
    }
}


export default class GrapevineVisualControlPanelUsersTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compScoreDisplayPanelData: this.props.compScoreDisplayPanelData
        }
    }

    async componentDidMount() {
        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;

        var usersDataSet = [];
        var masterUsersList = this.props.masterUsersList;
        console.log("--masterUsersList: "+JSON.stringify(masterUsersList,null,4))
        for (var u=0;u<masterUsersList.length;u++) {
            var nextUser_peerID = masterUsersList[u];
            var oUserProfile = await ConceptGraphInMfsFunctions.returnUserProfileFromMfsByPeerID(nextUser_peerID)
            console.log("--oUserProfile: "+JSON.stringify(oUserProfile,null,4))
            var nextUser_username = oUserProfile.username;
            if (!nextUser_username) {
                nextUser_username = "unknown";
            }
            // var influenceHTML = "<div class='influenceContainer' id='influence_"+nextUser_peerID+"' >?</div>";
            /*
            var influenceHTML = "<div id='influence_"+nextUser_peerID+"' data-result='"+u+"'>"+u+"</div>";
            var averageHTML = "<input type='text' id='average_"+nextUser_peerID+"' value='"+u+"'>";
            var certaintyHTML = "<input type='text' id='certainty_"+nextUser_peerID+"' value='"+u+"'>";
            var inputHTML = "<input type='text' id='input_"+nextUser_peerID+"' value='"+u+"'>";
            */
            var influenceHTML = "<div id='influence_"+nextUser_peerID+"' data-result='"+u+"' >"+u+"</div>";
            var averageHTML = "<div id='average_"+nextUser_peerID+"' value='"+u+"' data-result='"+u+"' >"+u+"</div>";
            var certaintyHTML = "<div id='certainty_"+nextUser_peerID+"' value='"+u+"' data-result='"+u+"' >"+u+"</div>";
            var inputHTML = "<div id='input_"+nextUser_peerID+"' value='"+u+"' data-result='"+u+"' >"+u+"</div>";
            var oNxtUser = [
                "",
                u,
                nextUser_username,
                nextUser_peerID,
                influenceHTML,
                averageHTML,
                certaintyHTML,
                inputHTML
            ]
            usersDataSet.push(oNxtUser)
        }


        await makeThisPageTable(usersDataSet);

        const updateUsersDefAvScore = () => {
            var usersDefAvScoreValue = usersDefAvScoreSlider.noUiSlider.get();
            var usersDefAvScoreValue = usersDefAvScoreValue / 100;
            this.props.userTrustAverageScoreSliderCallback(usersDefAvScoreValue);
            jQuery("#usersDefaultAverageScoreValueContainer").html(usersDefAvScoreValue)

            var compScoreDisplayPanelData_new = this.state.compScoreDisplayPanelData
            compScoreDisplayPanelData_new.defaultUserTrustAverageScore = usersDefAvScoreValue
            this.setState({compScoreDisplayPanelData: compScoreDisplayPanelData_new})
            console.log("usersTab; new usersDefAvScoreValue: "+usersDefAvScoreValue)
        }
        var usersDefAvScoreSlider = document.getElementById('usersDefaultAverageScoreSlider');
        // var starterValue1 = this.state.compScoreDisplayPanelData.defaultUserTrustAverageScore;
        // var starterValueUserAvgTrust = this.props.compScoreDisplayPanelData.defaultUserTrustAverageScore;
        var starterValueUserAvgTrust = this.props.compScoreDisplayPanelData.defaultUserTrustAverageScore * 100;
        // var starterValueUserAvgTrust = this.props.defaultUserTrustAverageScore
        // var starterValueUserAvgTrust = 0.69
        console.log("userTab starterValueUserAvgTrust: "+starterValueUserAvgTrust)
        // var starterValue1 = window.grapevine.starterDefaultUserTrustAverageScore
        noUiSlider.create(usersDefAvScoreSlider, {
            start: starterValueUserAvgTrust,
            step: 1,
            range: {
                'max': 100,
                "min": 0
            }
        });
        usersDefAvScoreSlider.noUiSlider.on("update",updateUsersDefAvScore)

        const updateUsersDefConfidenceScore = () => {
            var usersDefConfidenceValue = usersDefConfidenceSlider.noUiSlider.get();
            var usersDefConfidenceValue = usersDefConfidenceValue / 100;
            this.props.userTrustConfidenceSliderCallback(usersDefConfidenceValue);
            jQuery("#usersDefaultConfidenceValueContainer").html(usersDefConfidenceValue)
        }
        var usersDefConfidenceSlider = document.getElementById('usersDefaultConfidenceSlider');
        // var starterValue2 = this.state.compScoreDisplayPanelData.defaultUserTrustConfidence;
        var starterValueUserTrustConfidence = this.props.compScoreDisplayPanelData.defaultUserTrustConfidence * 100;
        // var starterValue2 = window.grapevine.starterDefaultUserTrustConfidence
        // var starterValue2 = this.props.compScoreDisplayPanelData.defaultUserTrustConfidence;
        noUiSlider.create(usersDefConfidenceSlider, {
            start: starterValueUserTrustConfidence,
            step: 1,
            range: {
                'max': 100,
                "min": 0
            }
        });
        usersDefConfidenceSlider.noUiSlider.on("update",updateUsersDefConfidenceScore)

        ////////////////////////////////////////////////////////////
        // load existing userTrustCompositeScore_multiSpecificInstance_superset; if it does not already exist, then
        // create a new one
        var multiSpecificInstances_slug = "userTrustCompositeScore_multiSpecificInstance_superset";
        var oUtCS = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,multiSpecificInstances_slug);
        if (!oUtCS) {
            var oUtCS = await MiscFunctions.createNewWordByTemplate("userTrustCompositeScore");
        }
        jQuery("#utCompositeScoreContainer1").val(JSON.stringify(oUtCS,null,4))
        ////////////////////////////////////////////////////////////

        jQuery("#saveUtCompositeScoreButton").click(async function(){
            var sUTCS = jQuery("#utCompositeScoreContainer2").val();
            var oUTCS = JSON.parse(sUTCS);
            var utcs_slug = oUTCS.wordData.slug;
            console.log("saveUtCompositeScoreButton clicked; oUTCS: "+JSON.stringify(oUTCS,null,4));

            var concept_slug = "conceptFor_userTrustCompositeScore";
            var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,concept_slug);
            var superset_slug = oConcept.conceptData.nodes.superset.slug;
            var oSuperset = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,superset_slug);
            var mainSchema_slug = oConcept.conceptData.nodes.schema.slug;
            var oMainSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,mainSchema_slug);

            var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
            oNewRel.nodeFrom.slug = utcs_slug;
            oNewRel.relationshipType.slug = "areSpecificInstancesOf";
            oNewRel.nodeTo.slug = superset_slug;

            console.log("addNewWordAsSpecificInstanceToConceptInMFS_specifyConceptGraph; oNewRel: "+JSON.stringify(oNewRel,null,4))

            var oMiniWordLookup = {};
            oMiniWordLookup[utcs_slug] = oUTCS;
            oMiniWordLookup[superset_slug] = oSuperset;
            oMainSchema = MiscFunctions.updateSchemaWithNewRel(oMainSchema,oNewRel,oMiniWordLookup)
            console.log("addNewWordAsSpecificInstanceToConceptInMFS_specifyConceptGraph; oMainSchema: "+JSON.stringify(oMainSchema,null,4))

            await ConceptGraphInMfsFunctions.addWordToMfsConceptGraph_specifyConceptGraph(viewingConceptGraph_ipns,oUTCS);
            await ConceptGraphInMfsFunctions.addWordToMfsConceptGraph_specifyConceptGraph(viewingConceptGraph_ipns,oMainSchema);
        })
        jQuery("#usersTableButton").click(function(){
            jQuery("#usersTableButton").css("backgroundColor","green")
            jQuery("#utCompositeScoresRawFileButton").css("backgroundColor","grey")

            jQuery("#usersTableContainer").css("display","block")
            jQuery("#utCompositeScoresRawFileContainer").css("display","none")
        })
        jQuery("#utCompositeScoresRawFileButton").click(function(){
            jQuery("#usersTableButton").css("backgroundColor","grey")
            jQuery("#utCompositeScoresRawFileButton").css("backgroundColor","green")

            jQuery("#usersTableContainer").css("display","none")
            jQuery("#utCompositeScoresRawFileContainer").css("display","block")
        })
        jQuery("#updateUtRawfileCompositeScoreButton").click(async function(){
            console.log("updateUtRawfileCompositeScoreButton clicked")
            await updateAllUsersTrustCompositeScore(masterUsersList);
        })
    }
    render() {
        return (
            <>
                <div style={{textAlign:"left"}}>
                    <div style={{textAlign:"center",height:"600px",overflow:"scroll"}} >

                        <div style={{display:"inline-block",border:"1px solid black",borderRadius:"5px",width:"300px",padding:"5px"}} >
                            <div style={{fontSize:"14px",marginLeft:"5px"}} >
                                default avg score for unvetted users:
                            </div>
                            <div style={{marginTop:"10px"}}>
                                <div id="usersDefaultAverageScoreValueContainer" style={{display:"inline-block",width:"30px",marginLeft:"10px"}} ></div>
                                <div id="usersDefaultAverageScoreSlider" style={{display:"inline-block",width:"200px",marginLeft:"20px",backgroundColor:"green"}} ></div>
                            </div>
                        </div>

                        <div style={{display:"inline-block",border:"1px solid black",borderRadius:"5px",width:"300px",padding:"5px",marginLeft:"10px"}}>
                            <div style={{fontSize:"14px",marginLeft:"5px"}} >
                                confidence:
                            </div>
                            <div style={{marginTop:"10px"}}>
                                <div id="usersDefaultConfidenceValueContainer" style={{display:"inline-block",width:"30px",marginLeft:"10px"}} ></div>
                                <div id="usersDefaultConfidenceSlider" style={{display:"inline-block",width:"200px",marginLeft:"20px",backgroundColor:"grey"}} ></div>
                            </div>
                        </div>
                        <div>
                            <div id="usersTableButton" className="doSomethingButton" style={{backgroundColor:"green"}} >users table</div>
                            <div id="utCompositeScoresRawFileButton" className="doSomethingButton" style={{backgroundColor:"grey"}} >composite scores rawFile</div>
                        </div>

                        <div id="utCompositeScoresRawFileContainer" style={{display:"none"}} >
                            <div className="doSomethingButton_small" id="updateUtRawfileCompositeScoreButton">update file (below)</div>
                            <div className="doSomethingButton_small" id="saveUtCompositeScoreButton">save</div>
                            <div style={{marginTop:"5px"}} >
                                <textarea id="utCompositeScoreContainer1" style={{width:"95%",height:"200px"}} >
                                </textarea>
                            </div>
                            <div style={{marginTop:"5px"}} >
                                <textarea id="utCompositeScoreContainer2" style={{width:"95%",height:"300px"}} >
                                </textarea>
                            </div>
                        </div>

                        <div id="usersTableContainer" className="tableContainer" style={{marginTop:"20px",marginLeft:"20px", width:"1350px",overflow:"scroll"}} >
                            <table id="table_users" className="display" style={{color:"black",width:"95%",textAlign:"left"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>w</th>
                                        <th>username</th>
                                        <th>peerID</th>
                                        <th>influence</th>
                                        <th>average</th>
                                        <th>certainty</th>
                                        <th>input</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>w</th>
                                        <th>username</th>
                                        <th>peerID</th>
                                        <th>influence</th>
                                        <th>average</th>
                                        <th>certainty</th>
                                        <th>input</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                    </div>
                </div>
            </>
        );
    }
}
