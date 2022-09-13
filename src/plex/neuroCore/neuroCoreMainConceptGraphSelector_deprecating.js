import React from "react";
import * as MiscFunctions from '../functions/miscFunctions.js';
import sendAsync from '../../renderer.js';
const jQuery = require("jquery");

// window.oTestVariable.foo = "bar";
// var starterConceptGraph_tableName = "myConceptGraph_slashtags";
var starterConceptGraph_tableName = "myConceptGraph_temporary";
var activeConceptGraph_tableName = starterConceptGraph_tableName;

// export var aConceptGraphs = [];

export default class NeuroCoreMainConceptGraphSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeConceptGraph: {
                rawFileLookup: {},
                tableName: "",
                conceptGraphTitle: "",
                slugLists: {
                    total: [],
                    schemas: [],
                    JSONSchemas: [],
                    concepts: [],
                    properties: []
                },
                relationshipLists: {
                    all: []
                }
            }
        }
    }

    /*
    loadActiveConceptGraphData = () => {
        var selectedConceptGraph_tablename = jQuery("#neuroCoreConceptGraphSelector option:selected").data("tablename");
        var selectedConceptGraph_title = jQuery("#neuroCoreConceptGraphSelector option:selected").data("conceptgraphtitle");
        var sql = " SELECT * FROM "+selectedConceptGraph_tablename;
        // alert("sql: "+sql)
        var aSlugList = [];
        // var aActiveConceptGraph = [];
        var oActiveConceptRawFileLookup = {}
        var aSchemas = [];
        var aConcepts = [];
        var aJSONSchemas = [];
        var aProperties = [];
        var aRelationshipsAll = [];
        sendAsync(sql).then((aResult) => {
            var numRows = aResult.length;
            console.log("numRows: "+numRows)
            for (var r=0;r<numRows;r++) {
                var oNextRow = aResult[r];
                var nextRow_id = oNextRow.id;
                var nextRow_slug = oNextRow.slug;
                var nextRow_title = oNextRow.title;
                var nextRow_rawFile = oNextRow.rawFile;

                var oRawFile = JSON.parse(nextRow_rawFile)
                var aWordTypes = oRawFile.wordData.wordTypes;
                if (jQuery.inArray("schema",aWordTypes) > -1) {
                    aSchemas.push(nextRow_slug)
                    var aRels = oRawFile.schemaData.relationships;
                    aRelationshipsAll = MiscFunctions.concatenateRels(aRelationshipsAll,aRels);
                }
                if (jQuery.inArray("concept",aWordTypes) > -1) {
                    aConcepts.push(nextRow_slug)
                }
                if (jQuery.inArray("JSONSchema",aWordTypes) > -1) {
                    aJSONSchemas.push(nextRow_slug)
                }
                if (jQuery.inArray("property",aWordTypes) > -1) {
                    aProperties.push(nextRow_slug)
                }

                oActiveConceptRawFileLookup[nextRow_slug] = nextRow_rawFile;

                aSlugList.push(nextRow_slug)
            }

            this.setState(prevState => {
                var activeConceptGraph = Object.assign({}, prevState.activeConceptGraph);
                activeConceptGraph.rawFileLookup = oActiveConceptRawFileLookup;
                activeConceptGraph.tableName = selectedConceptGraph_tablename;
                activeConceptGraph.conceptGraphTitle = selectedConceptGraph_title;
                activeConceptGraph.slugLists.total = aSlugList;
                activeConceptGraph.slugLists.schemas = aSchemas;
                activeConceptGraph.slugLists.JSONSchemas = aJSONSchemas;
                activeConceptGraph.slugLists.concepts = aConcepts;
                activeConceptGraph.slugLists.properties = aProperties;
                activeConceptGraph.relationshipLists.all = aRelationshipsAll;
                return { activeConceptGraph };
            })
        })
    }


    createConceptGraphSelector = () => {
        var sql = " SELECT * FROM myConceptGraphs ";
        var aConceptGraphs = [];

        sendAsync(sql).then((aResult) => {
            // var aResult = result;
            var numRows = aResult.length;
            console.log("numRows: "+numRows)
            for (var r=0;r<numRows;r++) {
                var oNextRow = aResult[r];
                var nextRow_id = oNextRow.id;
                var nextRow_slug = oNextRow.slug;
                var nextRow_title = oNextRow.title;
                var nextRow_tableName = oNextRow.tableName;
                var nextRow_description = oNextRow.description;
                var nextRow_rawFile = oNextRow.rawFile;
                var nextRow_dictionarytablename = oNextRow.referenceDictionary_tableName

                aConceptGraphs[r] = {};
                aConceptGraphs[r].dictionarytablename = nextRow_dictionarytablename;
                aConceptGraphs[r].tableName = nextRow_tableName;
                aConceptGraphs[r].slug = nextRow_slug;
                aConceptGraphs[r].title = nextRow_title;
            }
        }).then((bResult) => {
            var numConceptGraphs = aConceptGraphs.length;
            // alert("done; numConceptGraphs: "+numConceptGraphs)
            var selectorHTML = "";
            selectorHTML += "<select id='neuroCoreConceptGraphSelector' >";
            for (var c=0;c<numConceptGraphs;c++) {
                selectorHTML += "<option ";
                selectorHTML += " data-dictionarytablename="+aConceptGraphs[c].dictionarytablename+" ";
                selectorHTML += " data-tablename="+aConceptGraphs[c].tableName+" ";
                selectorHTML += " data-conceptgraphslug="+aConceptGraphs[c].slug+" ";
                selectorHTML += " data-conceptgraphtitle='"+aConceptGraphs[c].title+"' ";
                if (aConceptGraphs[c].tableName == activeConceptGraph_tableName) {
                    selectorHTML += " selected ";
                }
                selectorHTML += " >";
                selectorHTML += aConceptGraphs[c].title;
                selectorHTML += "</option>";
            }
            selectorHTML += "</select>";
            jQuery("#neuroCoreMainConceptGraphSelectorContainer").html(selectorHTML)
            jQuery("#neuroCoreConceptGraphSelector").change(function(){
                jQuery("#loadActiveConceptGraphDataButton").trigger("click")
            })
            jQuery("#loadActiveConceptGraphDataButton").trigger("click")
        })
    }
    */

    componentDidMount() {
        setTimeout( async function(){
            // createConceptGraphSelector()
            // jQuery("#createConceptGraphSelectorButton").trigger("click");
        },window.delays.neoroCoreConceptGraphSelectorDelay);
    }
    render() {
        return (
            <>

            </>
        )
    }
}
