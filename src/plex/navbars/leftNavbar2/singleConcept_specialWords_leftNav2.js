import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_SingleConcept_specialWords extends React.Component {
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

            <center>Special Words</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptSchema/current'>Schema</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptJSONSchema/current'>JSON Schema</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptConcept/current'>Concept</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptWordType/current'>Word Type</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptSuperset/current'>Superset</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptPropertySchema/current'>Property Schema</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptPrimaryProperty/current'>Primary Property</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptProperties/current'>Properties</NavLink>


        </div>

      </>
    );
  }
}
