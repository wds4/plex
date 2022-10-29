import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_ConceptGraphs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title
        }
    }
    render() {
        return (
          <>
            <div className="leftNav2Panel_NeuroCore" >
                <div className="leftNavBarBackBox" >
                    <center>back</center>
                    <NavLink className="leftNav2BackButton" activeClassName="active" to='/ConceptGraphsFrontEndMainPage'>All Concept Graphs</NavLink>
                    <NavLink className="leftNav2BackButton" activeClassName="active" to='/ConceptGraphsFrontEndSingleConceptGraphMainPage/current'>Current Concept Graph</NavLink>
                </div>

                <div className="leftNavBarConceptGraphTitle" >
                {this.props.viewingConceptGraphTitle}
                </div>

                <center>Concepts in the MFS</center>
                <br/>
                <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_ConceptsMainPage/current'>Concepts</NavLink>
                <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_TableOfConcepts/current'>Table of Concepts</NavLink>
                <br/><br/>
                <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_MakeNewConcept/current'>Make New Concept</NavLink>

            </div>

          </>
        );
    }
}
