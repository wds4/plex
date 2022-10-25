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
            </div>

            <div className="leftNavBarConceptGraphTitle" >
            {window.frontEndConceptGraph.viewingConceptGraph.title}
            </div>

            <center>Words in the MFS</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_WordsMainPage/current'>Words</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_TableOfWords/current'>Table of Words</NavLink>
        </div>

      </>
    );
  }
}
