import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_ConceptGraphs extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <center>Concept Graphs</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEndTable'>Show All Concept Graphs (table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEndMakeNewConceptGraph'>Make New Concept Graph</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEndManageDirectory'>Manage Directory</NavLink>

        </div>

      </>
    );
  }
}
