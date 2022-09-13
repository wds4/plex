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

            <center>Context</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingContext/current'>Context</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingContextGraphNav/current'>Graphical view</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingContextTextNav/current'>text-based nav</NavLink>
            <br/><br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDMContextAllRelationshipsTable/current'>Context Relationships</NavLink>
            <br/><br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDMContextContextsTable/current'>Contexts</NavLink>
        </div>

      </>
    );
  }
}
