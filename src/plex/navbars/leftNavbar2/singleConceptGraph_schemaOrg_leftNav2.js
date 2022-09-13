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
            </div>

            <div className="leftNavBarConceptGraphTitle" >
            {window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}
            </div>

            <center>Schema.org</center>

            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingSchemaOrg/current'>Schema.org</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingSchemaOrgGraphNav/current'>Graphical view</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingSchemaOrgTextNav/current'>text-based nav</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingSchemaOrgExtensions/current'>extensions to schema.org</NavLink>
            <br/><br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDMSchemaOrgAllRelationshipsTable/current'>type relationships</NavLink>
            <br/><br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDMSchemaOrgTypesTable/current'>types</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDMSchemaOrgPropertiesTable/current'>properties</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDMSchemaOrgDataTypesTable/current'>dataTypes</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDMSchemaOrgEnumerationsTable/current'>enumerations</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDMSchemaOrgEnumerationMembersTable/current'>enumeration members</NavLink>
        </div>

      </>
    );
  }
}
