import React from 'react';
import { NavLink, Link } from "react-router-dom"; 

export default class LeftNavbar2_SingleConceptGraph_concepts extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <div className="leftNavBarBackBox">
                <center>back</center>

                <NavLink className="leftNav2BackButton" activeClassName="active" to='/ConceptGraphsMainPage'>All Concept Graphs</NavLink>
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/EditExistingConceptGraphPage/current'>Current Concept Graph</NavLink>
            </div>

            <div className="leftNavBarConceptGraphTitle" >
            {window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}
            </div>

            <center>Concepts</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllConceptsTable_fast'>Show All Concepts (table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllConceptsTable_sql'>Show All Concepts (table) (slow, from SQL)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/MakeNewConcept/current'>Make New Concept</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ExpandWordIntoNewConcept/current'>Expand Existing Word into New Concept</NavLink>
        </div>

      </>
    );
  }
}
