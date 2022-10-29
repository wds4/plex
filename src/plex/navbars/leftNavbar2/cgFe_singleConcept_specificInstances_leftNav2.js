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
                    <NavLink className="leftNav2BackButton" activeClassName="active" to='/ConceptGraphsFrontEnd_ConceptsMainPage/current'>All Concepts</NavLink>
                    <NavLink className="leftNav2BackButton" activeClassName="active" to='/ConceptGraphsFrontEnd_SingleConceptMainPage/current'>Current Concept</NavLink>
                </div>

                <div className="leftNavBarConceptGraphTitle" >
                {this.props.viewingConceptGraphTitle}
                </div>

                <div className="leftNavBarConceptTitle" >
                {window.frontEndConceptGraph.viewingConcept.title}
                </div>

                <center>Specific Instances</center>

                <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEndSpecificInstancesMainPage/current'>Specific Instances Main Page</NavLink>
                <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEndMakeNewSpecificInstance/current'>Make New Specific Instance</NavLink>
            </div>

          </>
        );
    }
}
