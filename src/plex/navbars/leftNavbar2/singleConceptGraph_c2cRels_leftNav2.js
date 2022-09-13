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

            <center>Concept to Concept Relationships</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllC2CRelationshipsTable'>Show All C2C Rels (table) (Layer 2)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllC2CRelationshipsGraph'>Show All C2C Rels (graph) (Layer 2)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/MakeNewC2cRel/current'>Make New C2C Relationship</NavLink>
        </div>

      </>
    );
  }
}
