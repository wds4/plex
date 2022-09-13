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

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const VisNetwork_NeuroCore2_patternsActions = () => {
    // A reference to the div rendered by this component
    var domNode = useRef(null);

    // A reference to the vis network instance
    network = useRef(null);

    useEffect(
      () => {
        network.current = new Network(domNode.current, data, options);
        // await timeout(2000);
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

    /////////////// actions
    var oSupersetActions = window.neuroCore.engine.oRFL.current[actionSet_slug];
    var aActions = oSupersetActions.globalDynamicData.specificInstances;
    aActions = aActions.sort();
    /////////////// patterns
    var oSupersetPatterns = window.neuroCore.engine.oRFL.current[patternSet_slug];
    var aPatterns = oSupersetPatterns.globalDynamicData.specificInstances;
    aPatterns = aPatterns.sort();

    var oNumTriggeringPatterns = {};
    for (var z=0;z<aActions.length;z++) {
        var nextAction_wordSlug = aActions[z];
        var oAction = window.neuroCore.engine.oRFL.current[nextAction_wordSlug];
        var nextAction_actionSlug = oAction.actionData.slug;
        oNumTriggeringPatterns[nextAction_actionSlug] = 0;
    }
    for (var z=0;z<aPatterns.length;z++) {
        var nextPattern_wordSlug = aPatterns[z];
        var oNextPattern = window.neuroCore.engine.oRFL.current[nextPattern_wordSlug];
        var aNextPattern_triggeredActions = oNextPattern.patternData.actions;
        if (aNextPattern_triggeredActions) {
            for (var t=0;t<aNextPattern_triggeredActions.length;t++) {
                var action_actionSlug = aNextPattern_triggeredActions[t];
                if (oNumTriggeringPatterns.hasOwnProperty(action_actionSlug)) {
                    oNumTriggeringPatterns[action_actionSlug]++;
                }
            }
        }
    }

    /////////////// actions
    for (var z=0;z<aActions.length;z++) {
        var nextAction_wordSlug = aActions[z];
        var oNextAction = window.neuroCore.engine.oRFL.current[nextAction_wordSlug];
        var nextAction_name = oNextAction.actionData.name;
        var nextAction_description = oNextAction.actionData.description;
        var nextAction_actionSlug = oNextAction.actionData.slug;

        var nextNode_slug = nextAction_wordSlug;
        var nextNode_id = nextAction_actionSlug
        var nextNode_group = "action";
        var nextNode_name = oNextAction.wordData.name;
        var nextNode_VSTitle = nextNode_name;
        nextNode_VSTitle += "\n" + nextAction_wordSlug;
        nextNode_VSTitle += "\n" + nextAction_description;
        var nextNode_label = nextNode_name;
        var physics = true;
        var xPos = 1000;
        var yPos = 100 * z;
        var numTriggeringPatterns = 0;
        if (oNumTriggeringPatterns.hasOwnProperty(action_actionSlug)) {
            numTriggeringPatterns = oNumTriggeringPatterns[nextAction_actionSlug];
        }

        if (numTriggeringPatterns == 0) {
            var physics = false;
        }
        var nextNode_vis_obj = { id: nextNode_id, label: nextNode_label, slug: nextNode_slug, title: nextNode_VSTitle, group: nextNode_group, physics: physics, numTriggeringPatterns: numTriggeringPatterns, x: xPos, y: yPos }
        aNodes.push(nextNode_vis_obj)
    }

    /////////////// patterns
    // var oSupersetPatterns = window.neuroCore.engine.oRFL.current[patternSet_slug];
    // var aPatterns = oSupersetPatterns.globalDynamicData.specificInstances;
    aPatterns = aPatterns.sort();
    for (var z=0;z<aPatterns.length;z++) {
        var nextPattern_wordSlug = aPatterns[z];

        var oNextPattern = window.neuroCore.engine.oRFL.current[nextPattern_wordSlug];
        var nextPattern_name = oNextPattern.patternData.name;
        var nextPattern_description = oNextPattern.patternData.description;
        var nextPattern_patternSlug = oNextPattern.patternData.slug;
        var nextPattern_inputField = oNextPattern.patternData.inputField;
        var aNextPattern_triggeredActions = oNextPattern.patternData.actions;

        var nextNode_slug = nextPattern_wordSlug;
        var nextNode_group = "pattern";
        var nextNode_name = oNextPattern.wordData.name;
        var nextNode_VSTitle = nextNode_name;
        nextNode_VSTitle += "\n" + nextPattern_wordSlug;
        nextNode_VSTitle += "\n" + nextPattern_description;
        var nextNode_label = nextNode_name;
        var physics = false;
        var xPos = 0;

        if (aNextPattern_triggeredActions) {
            if (aNextPattern_triggeredActions.length==0) {
                xPos = -300;
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
                var nF_id = nextRel_nF_slug
                var nT_id = nextRel_nT_slug
                var nextRel_vis_obj = { from: nF_id, to: nT_id, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug, relationshipStringified:relationshipStringified  }
                // var nextRel_vis_obj = { color: "red", width: "4", from: nextRel_nF_slug, to: nextRel_nT_slug, nodeA: nextRel_nF_slug, nodeB: nextRel_nT_slug, relationshipType: nextRel_rT_slug, relationshipStringified:relationshipStringified  }
                // aEdges.push(nextRel_vis_obj)
                aEdges = addEdgeWithStyling_visjsfunctions(aEdges,nextRel_vis_obj);
            }
        } else {
            xPos = -500;
        }


        var yPos = z * 100;
        var nextNode_id = nextPattern_patternSlug
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
        aNodes.push(nextNode_vis_obj)
    }

    nodes = new DataSet(aNodes);
    edges = new DataSet(aEdges);
    data = {
        nodes,
        edges
    };

    var networkElemID = "graphElem1"
    ReactDOM.render(<VisNetwork_NeuroCore2_patternsActions clickHandler={console.log('click')} onSelectNode={console.log("onSelectNode") } />,
        document.getElementById(networkElemID)
    )
}

export default class NeuroCore2ActionPatternGraph1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var actionSet_slug = "supersetFor_action";
        var patternSet_slug = "supersetFor_pattern";
        makeVisGraph_NeuroCore2(patternSet_slug,actionSet_slug);

    }
    render() {
        return (
          <>
              <div style={{display:"inline-block"}}>
                  <center><div class="h5">Graph 1: P to A</div></center>
                  <div id="graphElem1" style={{width:"200px",height:"900px",border:"1px dashed grey",display:"inline-block"}}></div>
              </div>
          </>
        );
    }
}
