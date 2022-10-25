import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_ConceptGraphs extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <div className="leftNavBarBackBox" >
                <center>back</center>
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/ConceptGraphsFrontEndMainPage'>All Concept Graphs</NavLink>
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/ConceptGraphsFrontEndSingleConceptGraphMainPage/current'>Current Concept Graph</NavLink>
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/ConceptGraphsFrontEnd_ConceptsMainPage/current'>All Concepts</NavLink>
            </div>

            <div className="leftNavBarConceptGraphTitle" >
            {window.frontEndConceptGraph.viewingConceptGraph.title}
            </div>

            <div className="leftNavBarConceptTitle" >
            {window.frontEndConceptGraph.viewingConcept.title}
            </div>

            <center>Single Concept</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_SingleConceptMainPage/current'>Current Concept Main Page</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Full MFS directory for this concept</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Sets & s.i Tree</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Specific Instances</NavLink>

            <br/><br/>

            <center>Updates</center>

            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Updates Control Panel</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Suggested Updates</NavLink>

        </div>

      </>
    );
  }
}
