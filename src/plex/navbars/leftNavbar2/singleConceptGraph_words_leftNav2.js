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

            <center>Words</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllWordsTable_fast'>Show All Words (table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllWordsTable_sql'>Show All Words (table) (slow, from SQL)</NavLink>
        </div>

      </>
    );
  }
}
