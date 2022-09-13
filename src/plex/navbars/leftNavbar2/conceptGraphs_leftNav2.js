import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_ConceptGraphs extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <center>Concept Graphs</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsMainPage'>Show All Concept Graphs (table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/MakeNewConceptGraphPage'>Make New Concept Graph</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsImportsExportsPage'>Compact Imports / Exports</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsCompactFilesTable'>Compact I/E Files: Table</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphOverviewMainPage'>A Concept Graph Overview</NavLink>
        </div>
      </>
    );
  }
}
