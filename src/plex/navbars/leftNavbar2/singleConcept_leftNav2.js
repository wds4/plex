import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_SingleConcept extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <div className="leftNavBarBackBox" style={{height:"140px"}} >
                <center>back</center>

                <NavLink className="leftNav2BackButton" activeClassName="active" to='/ConceptGraphsMainPage'>All Concept Graphs</NavLink>
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/EditExistingConceptGraphPage/current'>Current Concept Graph</NavLink>
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/AllConceptsTable_fast'>All Concepts (table)</NavLink>
            </div>

            <div className="leftNavBarConceptGraphTitle" >
            {window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}
            </div>

            <div className="leftNavBarConceptTitle" >
            {window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].name}
            </div>

            <center>Single Concept</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGeneralInfo/current'>General Info</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptDetailedInfo/current'>Detailed Info</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptHierarchicalOverview/current'>Hierarchical Overview</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptSpecialWords/current'>Special Words</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptAllWords/current'>all Words (Table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptAllWordsValidation/current'>all Words: Validation</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptAllProperties/current'>all Properties (Table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptAllSchemas/current'>all Schemas</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptAllRelationships/current'>all Relationships (Table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptAllSets/current'>all Sets (Table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptAllSpecificInstances/current'>all Specific Instances (Table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptJSONSchemaFormForSpecificInstances/current'>Edit Specific Instances via JSON Schema Form</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptDeleteConcept/current'>delete concept</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphTemplating/current'>Build Template</NavLink>

            <br/><br/>

            <center>Graph Views</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptMainSchemaAndPropertyTreeGraph/current'>Main Schema + Property Tree</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptMainSchemaTreeGraph/current'>Main Schema</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptPropertyTreeGraph/current'>Property Tree</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptSetAndSpecificInstanceTreeGraph/current'>Sets + Specific Instances Tree</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptSetTreeGraph/current'>Sets Tree</NavLink>

            <br/><br/>

            <center>Technical Info</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptErrorCheck/current'>Check for Errors</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptInitialization/current'>Finish Concept Initialization</NavLink>

        </div>

      </>
    );
  }
}
