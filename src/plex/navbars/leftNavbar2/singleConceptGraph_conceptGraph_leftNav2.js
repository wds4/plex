import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_SingleConceptGraph_conceptGraph extends React.Component {
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

            <center>Concept Graph</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingConceptGraph/current'>Context</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingConceptGraphGraphNav/current'>Graphical view</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingConceptGraphTextNav/current'>text-based nav</NavLink>
        </div>

      </>
    );
  }
}
