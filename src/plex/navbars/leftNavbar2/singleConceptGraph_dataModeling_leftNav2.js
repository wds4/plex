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

            <center>Data Modeling</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModeling/current'>Data Modeling</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingSchemaOrg/current'>Schema.org</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingContext/current'>Context</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingConceptGraph/current'>Concept Graph</NavLink>

            <br/><br/>
            
            <center>not yet started Data Modeling pages</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingJSONLD/current'>JSON-LD</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingJWT/current'>JSON Web Tokens</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingVC/current'>Verifiable Credentials</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModelingMakeNew/current'>make new data model</NavLink>

        </div>

      </>
    );
  }
}
