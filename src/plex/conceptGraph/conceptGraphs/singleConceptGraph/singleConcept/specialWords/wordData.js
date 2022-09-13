import React from "react";
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

export default class WordData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var conceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].tableName;
        var currentConcept_slug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug;

        var oConcept = window.lookupWordBySlug[currentConcept_slug];
        var wordType = this.props.wordType
        var currSlug = oConcept.conceptData.nodes[wordType].slug

        var oWord = window.lookupWordBySlug[currSlug];
        var name = oWord.wordData.name;
        jQuery("#currentWordNameField").val(name)
        var title = oWord.wordData.title;
        jQuery("#currentWordTitleField").val(title)
        var slug = oWord.wordData.slug;
        jQuery("#currentWordSlugField").val(slug)
    }

    render() {
        return (
            <>
                <div className="makeNewLeftPanel" >slug</div>
                <textarea id="currentWordSlugField" className="makeNewRightPanel">

                </textarea>

                <br/>

                <div className="makeNewLeftPanel" >name</div>
                <textarea id="currentWordNameField" className="makeNewRightPanel">

                </textarea>

                <br/>

                <div className="makeNewLeftPanel" >title</div>
                <textarea id="currentWordTitleField" className="makeNewRightPanel">
                </textarea>
            </>
        );
    }
}
