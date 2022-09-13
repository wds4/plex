import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConcept_specialWords_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import WordData from './wordData.js';
import SpecialWordRawFile from './specialWordRawFile.js';
import sendAsync from '../../../../../renderer.js';

const jQuery = require("jquery");

export default class SingleConceptWordType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wordType: "wordType"
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Single Concept: WordType</div>

                        <div id="allInputFieldsContainer" style={{marginTop:"20px"}} >
                            <WordData wordType={this.state.wordType} />

                            <div className="specialWordsDoubleColumn" >
                                <center>Left Column</center>
                            </div>
                            <div className="specialWordsDoubleColumn" >
                                <SpecialWordRawFile wordType={this.state.wordType} />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
