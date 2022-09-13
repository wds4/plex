import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_SingleConcept_properties extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <div className="leftNavBarBackBox">
                <center>back</center>

                <NavLink className="leftNav2BackButton" activeClassName="active" to='/ConceptGraphsMainPage'>All Concept Graphs</NavLink>
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/EditExistingConceptGraphPage/current'>Current Concept Graph</NavLink>
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/AllConceptsTable_fast'>All Concepts (table)</NavLink>
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/SingleConceptGeneralInfo/current'>Current Concept</NavLink>
            </div>

            <div className="leftNavBarConceptGraphTitle" >
            {window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}
            </div>

            <div className="leftNavBarConceptTitle" >
            {window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].name}
            </div>

            <center>Properties</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptAllProperties/current'>All Properties</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/MakeNewProperty/current'>Make New Property</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/RestrictPropertyValue/current'>Restrict Property Value</NavLink>
        </div>

      </>
    );
  }
}
