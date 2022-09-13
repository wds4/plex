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
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/SingleConceptGraphDataModeling/current'>Data Modeling</NavLink>
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/SingleConceptGraphDataModelingSchemaOrg/current'>Schema.org</NavLink>
            </div>

            <div className="leftNavBarConceptGraphTitle" >
            {window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}
            </div>

            <center>Schema.org: enumerations</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDMSchemaOrgEnumerationsTable/current'>enumerations</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDMSchemaOrgMakeNewEnumeration/current'>make new enumeration</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDMSchemaOrgSingleEnumerationExplorer/current'>single enumeration explorer</NavLink>
        </div>

      </>
    );
  }
}
