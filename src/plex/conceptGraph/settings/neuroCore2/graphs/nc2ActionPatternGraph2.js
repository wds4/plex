import React, { useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import * as NC2ActionPatternGraphFunctions from '../neuroCore2GraphicalOverview.js';
import sendAsync from '../../../../renderer.js';
import * as VisStyleConstants from '../../../../lib/visjs/visjs-style';
const jQuery = require("jquery");

// An array of nodes
export var nodes = new DataSet([
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' }
]);

// An array of edges
export var edges = new DataSet([
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 }
]);

var options = VisStyleConstants.options_vis_neuroCore2;

export var network = {};

var data = {
    nodes,
    edges
};

export const VisNetwork_NeuroCore2_patternsActions = () => {
    // A reference to the div rendered by this component
    var domNode = useRef(null);

    // A reference to the vis network instance
    network = useRef(null);

    useEffect(
      () => {
        network.current = new Network(domNode.current, data, options);
        network.current.fit();

        network.current.on("click",function(params){
            var aNodes = params.nodes;
            var numNodes = aNodes.length;

            if (numNodes==1) {
                var nodeID = aNodes[0];
                var node = nodes.get(nodeID);
                var clickedNodeSlug = node.slug;
                var clickedNodeGroup = node.group;
                var clickedNodeHTML = "";
                if (clickedNodeGroup=="pattern") {
                    NC2ActionPatternGraphFunctions.displayPatternInfo(clickedNodeSlug)
                }
                if (clickedNodeGroup=="action") {
                    NC2ActionPatternGraphFunctions.displayActionInfo(clickedNodeSlug)
                }
                if (clickedNodeGroup=="set") {
                    NC2ActionPatternGraphFunctions.displaySetInfo(clickedNodeSlug)
                }
            }
        });

        // EDGES
        network.current.on("selectEdge",function(params){
        });
        network.current.on("deselectEdge",function(params){
        });

        // NODES
        network.current.on("doubleClick",function(params){
        });
        network.current.on("selectNode",function(params){
        });
        network.current.on("deselectNode",function(params){
        });
      },
      [domNode, network, data, options]
    );

    return (
      <div style={{height:"100%",width:"100%"}} ref = { domNode } />
    );
}

export function addEdgeWithStyling_visjsfunctions(aEdges,nextEdge_obj) {
    var nextEdge_out_obj = MiscFunctions.cloneObj(nextEdge_obj);

    var relType = nextEdge_out_obj.relationshipType;

    nextEdge_out_obj.title = relType;

    nextEdge_out_obj.label = relType;

    var nextEdge_color = VisStyleConstants.edgeOptions_obj[relType].color;
    nextEdge_out_obj.color = nextEdge_color;

    var nextEdge_width = VisStyleConstants.edgeOptions_obj[relType].width;
    nextEdge_out_obj.width = nextEdge_width;
    var nextEdge_dashes = VisStyleConstants.edgeOptions_obj[relType].dashes;
    nextEdge_out_obj.dashes = nextEdge_dashes;
    var nextEdge_polarity = VisStyleConstants.edgeOptions_obj[relType].polarity;

    // console.log("addEdgeWithStyling_visjsfunctions; nextEdge_out_obj: "+JSON.stringify(nextEdge_out_obj,null,4))
    aEdges.push(nextEdge_out_obj)
    return aEdges;
}

const makeVisGraph_NeuroCore2 = (patternSet_slug,actionSet_slug) => {
    var aNodes = [];
    var aEdges = [];

    /////////////// patterns
    var oMapPatternNameToWordSlug = {};
    console.log("patternSet_slug: "+patternSet_slug)
    var oSupersetPatterns = window.neuroCore.engine.oRFL.current[patternSet_slug];
    console.log("oSupersetPatterns: "+JSON.stringify(oSupersetPatterns,null,4))
    var aPatterns = oSupersetPatterns.globalDynamicData.specificInstances;
    var aPatternSubsets = oSupersetPatterns.globalDynamicData.subsets;
    aPatterns = aPatterns.sort();
    // reorder to place active first, then inactive
    var aPatterns_active = [];
    var aPatterns_inactive = [];
    for (var p=0;p<aPatterns.length;p++) {
        var nextP = aPatterns[p];
        var oNextP = window.neuroCore.engine.oRFL.current[nextP];
        var patternName = oNextP.patternData.name;
        var status = oNextP.patternData.status;
        if (status=="active") {
            aPatterns_active.push(nextP)
        } else {
            aPatterns_inactive.push(nextP)
        }
        oMapPatternNameToWordSlug[patternName] = nextP;
    }
    aPatterns = aPatterns_active.concat(aPatterns_inactive);
    var numActivePatterns = aPatterns_active.length;

    /////////////// actions
    var oSupersetActions = window.neuroCore.engine.oRFL.current[actionSet_slug];
    var aActions = oSupersetActions.globalDynamicData.specificInstances;
    var aActionSubsets = oSupersetActions.globalDynamicData.subsets;
    aActions = aActions.sort();
    // reorder to place active first, then inactive
    var aActions_active = [];
    var aActions_inactive = [];
    for (var p=0;p<aActions.length;p++) {
        var nextP = aActions[p];
        var oNextP = window.neuroCore.engine.oRFL.current[nextP];
        var status = oNextP.actionData.status;
        if (status=="active") {
            aActions_active.push(nextP)
        } else {
            aActions_inactive.push(nextP)
        }
    }
    aActions = aActions_active.concat(aActions_inactive);
    var numActiveActions = aActions_active.length;

    var numActive = Math.max(numActivePatterns,numActiveActions)

    /////////////// patterns
    var inactiveCounter = 0;
    for (var z=0;z<aPatterns.length;z++) {
        var nextPattern_wordSlug = aPatterns[z];

        var oNextPattern = window.neuroCore.engine.oRFL.current[nextPattern_wordSlug];

        var nextPattern_name = oNextPattern.patternData.name;
        var nextPattern_description = oNextPattern.patternData.description;
        var nextPattern_patternSlug = oNextPattern.patternData.slug;
        var nextPattern_inputField = oNextPattern.patternData.inputField;
        var nextPattern_status = oNextPattern.patternData.status;

        var nextNode_slug = nextPattern_wordSlug;
        var nextNode_group = "pattern";
        var nextNode_name = oNextPattern.wordData.name;
        var nextNode_VSTitle = nextNode_name;
        nextNode_VSTitle += "\n" + nextPattern_wordSlug;
        nextNode_VSTitle += "\n" + nextPattern_description;
        var nextNode_label = nextNode_name;
        var physics = false;
        var xPos = 1200;
        if (nextPattern_status=="active") {
            var yPos = z * 100;
        } else {
            var yPos = (numActive + inactiveCounter + 5) * 100;
            inactiveCounter++;
        }
        var nextNode_id = nextPattern_patternSlug
        // console.log("nextNode_id: "+nextNode_id)
        var nextNode_vis_obj = { id: nextNode_id, label: nextNode_label, slug: nextNode_slug, title: nextNode_VSTitle, group: nextNode_group, physics: physics, x: xPos, y: yPos }

        nextNode_vis_obj.color = {};
        nextNode_vis_obj.color.background = "yellow";
        if (nextPattern_inputField=="singleNode") {
            nextNode_vis_obj.color.border="red";
        }
        if (nextPattern_inputField=="singleRelationship") {
            nextNode_vis_obj.color.border="#2B7CE9";
        }
        nextNode_vis_obj.color = {};
        nextNode_vis_obj.color.background = "yellow";
        if (nextPattern_inputField=="singleNode") {
            nextNode_vis_obj.color.border="red";
        }
        if (nextPattern_inputField=="singleRelationship") {
            nextNode_vis_obj.color.border="#2B7CE9";
        }
        if (nextPattern_inputField=="singleNode") {
            nextNode_vis_obj.shape = "dot";
        }
        if (nextPattern_inputField=="singleRelationship") {
            nextNode_vis_obj.shape = "box";
        }
        if (nextPattern_inputField=="doubleRelationship") {
            nextNode_vis_obj.shape = "hexagon";
        }
        if (nextPattern_status != "active") {
            nextNode_vis_obj.color.background="#444444";
        }
        nextNode_vis_obj.borderWidth=1;
        nextNode_vis_obj.size=50;
        aNodes.push(nextNode_vis_obj)
    }

    /////////////// pattern subsets
    for (var z=0;z<aPatternSubsets.length;z++) {
        var nextPatternSubset_wordSlug = aPatternSubsets[z];

        var oNextPatternSubset = window.neuroCore.engine.oRFL.current[nextPatternSubset_wordSlug];
        // console.log("nextPatternSubset_wordSlug: "+nextPatternSubset_wordSlug+": oNextPatternSubset: "+JSON.stringify(oNextPatternSubset,null,4))
        // console.log("nextPatternSubset_wordSlug: "+nextPatternSubset_wordSlug)

        if (oNextPatternSubset.hasOwnProperty("setData")) {
            var nextPatternSubset_setName = oNextPatternSubset.setData.name;
            var nextPatternSubset_setSlug = oNextPatternSubset.setData.slug;
        }
        if (oNextPatternSubset.hasOwnProperty("supersetData")) {
            var nextPatternSubset_setName = oNextPatternSubset.supersetData.name;
            var nextPatternSubset_setSlug = oNextPatternSubset.supersetData.slug;
        }
        // console.log("nextPatternSubset_wordSlug: "+nextPatternSubset_wordSlug+"; nextPatternSubset_setName: "+nextPatternSubset_setName+"; nextPatternSubset_setSlug: "+nextPatternSubset_setSlug)

        var nextNode_slug = nextPatternSubset_wordSlug;
        var nextNode_group = "set";
        var nextNode_name = nextPatternSubset_setName
        var nextNode_VSTitle = nextNode_name;
        nextNode_VSTitle += "\n" + nextPatternSubset_wordSlug;
        var nextNode_label = nextNode_name;
        var physics = false;
        var xPos = 1500;

        var aDirectSpecificInstances = [];
        aDirectSpecificInstances = oNextPatternSubset.globalDynamicData.directSpecificInstances;

        var nextRel_rT_slug = "isASpecificInstanceOf";
        for (var y=0;y<aDirectSpecificInstances.length;y++) {
            var nextPattern_slug = aDirectSpecificInstances[y];
            var oNextPattern = window.neuroCore.engine.oRFL.current[nextPattern_slug]
            var nextPattern_patternSlug = oNextPattern.patternData.slug;
            // console.log("y: "+y+"; nextPatternSubset_wordSlug: "+nextPatternSubset_wordSlug+"; nextPattern_slug: "+nextPattern_slug)

            var nextRel_vis_obj = { from: nextPatternSubset_wordSlug, to: nextPattern_patternSlug, nodeA: nextPatternSubset_wordSlug, nodeB: nextPattern_patternSlug, relationshipType: nextRel_rT_slug }
            aEdges = addEdgeWithStyling_visjsfunctions(aEdges,nextRel_vis_obj);
        }

        if (aDirectSpecificInstances.length==0) {
            xPos = 1800;
        }

        var yPos = z * 100;
        var nextNode_id = nextPatternSubset_wordSlug
        var nextNode_vis_obj = { id: nextNode_id, label: nextNode_label, slug: nextNode_slug, title: nextNode_VSTitle, group: nextNode_group, physics: physics, x: xPos, y: yPos }
        aNodes.push(nextNode_vis_obj);
    }

    /////////////// actions
    var inactiveCounter = 0;
    for (var z=0;z<aActions.length;z++) {
        var nextAction_wordSlug = aActions[z];

        var oNextAction = window.neuroCore.engine.oRFL.current[nextAction_wordSlug];

        var nextAction_name = oNextAction.actionData.name;
        var nextAction_description = oNextAction.actionData.description;
        var nextAction_status = oNextAction.actionData.status;
        var nextAction_functions = [];
        if (oNextAction.actionData.hasOwnProperty("functions")) {
            nextAction_functions = oNextAction.actionData.functions;
        }
        var nextAction_actionSlug = oNextAction.actionData.slug;
        var aNextAction_secondaryPatterns_sets = [];
        var aNextAction_secondaryPatterns_patterns = [];
        if (oNextAction.actionData.hasOwnProperty("secondaryPatterns")) {
            if (oNextAction.actionData.secondaryPatterns.hasOwnProperty("sets")) {
                aNextAction_secondaryPatterns_sets = oNextAction.actionData.secondaryPatterns.sets;
            }
            if (oNextAction.actionData.secondaryPatterns.hasOwnProperty("individualPatterns")) {
                aNextAction_secondaryPatterns_patterns = oNextAction.actionData.secondaryPatterns.individualPatterns;
            }
        }

        var nextNode_slug = nextAction_wordSlug;
        var nextNode_group = "action";
        var nextNode_name = oNextAction.wordData.name;
        var nextNode_VSTitle = nextNode_name;
        nextNode_VSTitle += "\n" + nextAction_wordSlug;
        nextNode_VSTitle += "\n" + nextAction_description;
        var nextNode_label = nextNode_name;
        var physics = false;
        var xPos = 0;

        var nextRel_rT_slug = "inducesPattern";
        for (var y=0;y<aNextAction_secondaryPatterns_sets.length;y++) {
            var nextSet_slug = aNextAction_secondaryPatterns_sets[y];

            var nextRel_vis_obj = { from: nextAction_actionSlug, to: nextSet_slug, nodeA: nextAction_actionSlug, nodeB: nextSet_slug, relationshipType: nextRel_rT_slug }
            aEdges = addEdgeWithStyling_visjsfunctions(aEdges,nextRel_vis_obj);

            for (var n=0;n<aNodes.length;n++) {
                var oFoo = aNodes[n];
                var fooID = oFoo.id;
                if (fooID == nextSet_slug) {
                    aNodes[n].x = 800;
                }
            }
        }
        for (var y=0;y<aNextAction_secondaryPatterns_patterns.length;y++) {
            // var nextPattern_slug = aNextAction_secondaryPatterns_patterns[y];
            var nextPattern_patternName = aNextAction_secondaryPatterns_patterns[y];
            console.log("nextPattern_patternName: "+nextPattern_patternName)
            var nextPattern_wordSlug = oMapPatternNameToWordSlug[nextPattern_patternName];
            console.log("nextPattern_wordSlug: "+nextPattern_wordSlug)
            var oPatt = window.neuroCore.engine.oRFL.current[nextPattern_wordSlug]
            var nextPattern_patternSlug = oPatt.patternData.slug;

            var nextRel_vis_obj = { from: nextAction_actionSlug, to: nextPattern_patternSlug, nodeA: nextAction_actionSlug, nodeB: nextPattern_patternSlug, relationshipType: nextRel_rT_slug }
            aEdges = addEdgeWithStyling_visjsfunctions(aEdges,nextRel_vis_obj);
        }
        if ( (aNextAction_secondaryPatterns_sets.length==0) && (aNextAction_secondaryPatterns_patterns.length==0) ) {
            xPos = -100;
        }

        var yPos = z * 100;
        if (nextAction_status=="active") {
            var yPos = z * 100;
        } else {
            var yPos = (numActive + inactiveCounter + 5) * 100;
            inactiveCounter++;
        }
        var nextNode_id = nextAction_actionSlug
        var nextNode_vis_obj = { id: nextNode_id, label: nextNode_label, slug: nextNode_slug, title: nextNode_VSTitle, group: nextNode_group, physics: physics, x: xPos, y: yPos }
        if (nextAction_functions.includes("Loki")) {
            nextNode_vis_obj.shape = "dot";
        }
        if (nextAction_functions.includes("propertyTree")) {
            nextNode_vis_obj.shape = "triangleDown";
        }
        if (nextAction_functions.includes("conceptStructure")) {
            nextNode_vis_obj.shape = "star";
        }
        if (nextAction_functions.includes("enumeration")) {
            nextNode_vis_obj.shape = "triangle";
        }
        nextNode_vis_obj.color = {};
        nextNode_vis_obj.color.background = "orange";
        if (nextAction_status != "active") {
            nextNode_vis_obj.color.background="#444444";
        }
        nextNode_vis_obj.borderWidth=1;
        nextNode_vis_obj.size=50;
        aNodes.push(nextNode_vis_obj)
    }

    // patterns, again
    var inactiveCounter = 0;
    for (var z=0;z<aPatterns.length;z++) {
        var nextPattern_wordSlug = aPatterns[z];

        var oNextPattern = window.neuroCore.engine.oRFL.current[nextPattern_wordSlug];
        var nextPattern_name = oNextPattern.patternData.name;
        var nextPattern_description = oNextPattern.patternData.description;
        var nextPattern_patternSlug = oNextPattern.patternData.slug;
        var nextPattern_inputField = oNextPattern.patternData.inputField;
        var nextPattern_status = oNextPattern.patternData.status;
        var aNextPattern_triggeredActions = oNextPattern.patternData.actions;

        var nextNode_slug = nextPattern_wordSlug;
        var nextNode_group = "pattern";
        var nextNode_name = oNextPattern.wordData.name;
        var nextNode_VSTitle = nextNode_name;
        nextNode_VSTitle += "\n" + nextPattern_wordSlug;
        nextNode_VSTitle += "\n" + nextPattern_description;
        var nextNode_label = nextNode_name;
        var physics = false;
        var xPos = -900;

        if (aNextPattern_triggeredActions) {
            if (aNextPattern_triggeredActions.length==0) {
                xPos = -1000;
            }
            for (var t=0;t<aNextPattern_triggeredActions.length;t++) {
                var action_slug = aNextPattern_triggeredActions[t];

                var nextRel_nF_slug = nextPattern_patternSlug;
                var nextRel_rT_slug = "inducesAction";
                var nextRel_nT_slug = action_slug;
                var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
                oNextRel.nodeFrom.slug = nextRel_nF_slug;
                oNextRel.relationshipType.slug = nextRel_rT_slug;
                oNextRel.nodeTo.slug = nextRel_nT_slug;
                var relationshipStringified = JSON.stringify(oNextRel)
                var nF_id = nextRel_nF_slug + "_"
                var nT_id = nextRel_nT_slug
                var nextRel_vis_obj = { from: nF_id, to: nT_id, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug, relationshipStringified:relationshipStringified  }
                // var nextRel_vis_obj = { color: "red", width: "4", from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug, relationshipStringified:relationshipStringified  }
                // aEdges.push(nextRel_vis_obj)
                aEdges = addEdgeWithStyling_visjsfunctions(aEdges,nextRel_vis_obj);
            }
        } else {
            xPos = -1100;
        }

        // var yPos = z * 100;
        if (nextPattern_status=="active") {
            var yPos = z * 100;
        } else {
            var yPos = (numActive + inactiveCounter + 5) * 100;
            inactiveCounter++;
        }
        var nextNode_id = nextPattern_patternSlug + "_";
        var nextNode_vis_obj = { id: nextNode_id, label: nextNode_label, slug: nextNode_slug, title: nextNode_VSTitle, group: nextNode_group, physics: physics, x: xPos, y: yPos }
        // console.log("makeVisGraph_NeuroCore2; pattens nextNode_vis_obj: "+JSON.stringify(nextNode_vis_obj,null,4))
        nextNode_vis_obj.color = {};
        nextNode_vis_obj.color.background = "yellow";
        if (nextPattern_inputField=="singleNode") {
            nextNode_vis_obj.color.border="red";
        }
        if (nextPattern_inputField=="singleRelationship") {
            nextNode_vis_obj.color.border="#2B7CE9";
        }
        if (nextPattern_inputField=="singleNode") {
            nextNode_vis_obj.shape = "dot";
        }
        if (nextPattern_inputField=="singleRelationship") {
            nextNode_vis_obj.shape = "box";
        }
        if (nextPattern_inputField=="doubleRelationship") {
            nextNode_vis_obj.shape = "hexagon";
        }
        if (nextPattern_status != "active") {
            nextNode_vis_obj.color.background="#444444";
        }
        nextNode_vis_obj.borderWidth=1;
        nextNode_vis_obj.size=50;
        aNodes.push(nextNode_vis_obj)
    }

    nodes = new DataSet(aNodes);
    edges = new DataSet(aEdges);
    data = {
        nodes,
        edges
    };

    var networkElemID = "graphElem2"
    ReactDOM.render(<VisNetwork_NeuroCore2_patternsActions clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById(networkElemID)
    )
}

export default class NeuroCore2ActionPatternGraph2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var actionSet_slug = "supersetFor_action";
        var patternSet_slug = "supersetFor_pattern";
        makeVisGraph_NeuroCore2(patternSet_slug,actionSet_slug);

        jQuery(".showNodesButton").click(function(){
            var whatToShow = jQuery(this).data("whattoshow");
            jQuery(".showNodesButton").css("backgroundColor","#DFDFDF");
            jQuery(this).css("backgroundColor","green");

            if (whatToShow=="all") {
            }
        })
    }
    render() {
        return (
          <>
              <div style={{display:"inline-block"}}>
                  <center><div class="h5">Graph 2: A to P</div></center>
                  <div>
                      show:
                      <div className="doSomethingButton_small showNodesButton" id="showNodesAllButton" data-whattoshow="all" >all</div>
                      <div className="doSomethingButton_small showNodesButton" id="showNodesLokiButton" data-whattoshow="pattern" >Loki Pathway</div>
                      <div className="doSomethingButton_small showNodesButton" id="showNodesPropertyTreeButton" data-whattoshow="action" >Property Tree</div>
                      <div className="doSomethingButton_small showNodesButton" id="showNodesConceptButton" data-whattoshow="set" >Concept Maintenance</div>
                      <div className="doSomethingButton_small showNodesButton" id="showNodesEnumerationButton" data-whattoshow="set" >Enumeration</div>
                  </div>
                  <div id="graphElem2" style={{width:"450px",height:"900px",border:"1px dashed grey",display:"inline-block"}}></div>
              </div>
          </>
        );
    }
}
