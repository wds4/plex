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
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/SingleConceptGraphDataModelingContext/current'>Context</NavLink>
            </div>

            <div className="leftNavBarConceptGraphTitle" >
            {window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}
            </div>

            <center>Schema.org: type relationships</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDMContextAllRelationshipsTable/current'>Context Relationships</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDMContextMakeNewRelationship/current'>make new relationship</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDMContextSingleRelationshipExplorer/current'>single relationship explorer</NavLink>
        </div>

      </>
    );
  }
}
