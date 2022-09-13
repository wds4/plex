import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_SingleWord extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <div className="leftNavBarBackBox">
                <center>back</center>

                <NavLink className="leftNav2BackButton" activeClassName="active" to='/ConceptGraphsMainPage'>All Concept Graphs</NavLink>
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/EditExistingConceptGraphPage/current'>Current Concept Graph</NavLink>
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/AllConceptsTable_fast'>All Concepts</NavLink>
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/SingleConceptGeneralInfo/current'>Current Concept</NavLink>
                <NavLink className="leftNav2BackButton" activeClassName="active" to='/SingleConceptAllWords/current'>All Words (current concept )</NavLink>
            </div>

            <div className="leftNavBarConceptGraphTitle" >
            {window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}
            </div>

            <div className="leftNavBarConceptTitle" >
            {window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].name}
            </div>

            <center>Single Word</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptSingleWordGeneralInfo/current'>General Info</NavLink>
        </div>

      </>
    );
  }
}
