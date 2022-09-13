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

export default class SingleConceptConcept extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wordType: "concept"
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
                        <div class="h2">Single Concept: Concept</div>

                        <div id="allInputFieldsContainer" style={{marginTop:"20px"}} >
                            <WordData wordType={this.state.wordType}  />

                            <div className="specialWordsDoubleColumn" >
                                <center>conceptData</center>
                                <br/><br/>
                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        name - singular:
                                    </div>
                                    <textarea id="singularContainer" className="leftColumnRightPanelTextarea" >
                                        ?
                                    </textarea>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        name - plural:
                                    </div>
                                    <textarea id="pluralContainer" className="leftColumnRightPanelTextarea" >
                                        ?
                                    </textarea>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        propertyPath:
                                    </div>
                                    <textarea id="propertyPathContainer" className="leftColumnRightPanelTextarea" >
                                        ?
                                    </textarea>
                                </div>

                                <div className="singleItemContainer">
                                    <div className="leftColumnLeftPanel" >
                                        description:
                                    </div>
                                    <textarea id="descriptionContainer" className="leftColumnRightPanelTextarea" >
                                        ?
                                    </textarea>
                                </div>

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
