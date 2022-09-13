import React from "react";
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

export default class SpecialWordRawFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
        var currentConcept_slug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;

        var oConcept = window.lookupWordBySlug[currentConcept_slug];
        var wordType = this.props.wordType
        var currSlug = oConcept.conceptData.nodes[wordType].slug

        var oWord = window.lookupWordBySlug[currSlug];
        var sWord = JSON.stringify(oWord,null,4)
        jQuery("#specialWordRawFileTextarea").val(sWord)

        jQuery("#updateSpecialWordRawFileButton").click(function(){
            var sSpecialWord = jQuery("#specialWordRawFileTextarea").val();
            console.log("updateSpecialWordRawFileButton clicked; sSpecialWord: "+sSpecialWord)
            var oSpecialWord = JSON.parse(sSpecialWord)
            MiscFunctions.createOrUpdateWordInAllTables(oSpecialWord)
        })
    }
    render() {
        return (
            <>
                <center>Special Word RawFile</center>
                <div id="updateSpecialWordRawFileButton" className="doSomethingButton" >UPDATE</div>
                <br/>
                <textarea id="specialWordRawFileTextarea" style={{width:"80%",height:"700px"}} >
                specialWordRawFileTextarea
                </textarea>
            </>
        );
    }
}
