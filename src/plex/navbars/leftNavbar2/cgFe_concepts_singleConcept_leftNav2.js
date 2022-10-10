import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_ConceptGraphs extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <center>Concepts in the MFS</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_ConceptsMainPage'>Concepts</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_TableOfConcepts'>Table of Concepts</NavLink>

            <br/><br/>

            <center>Single Concept</center>

            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_SingleConceptMainPage/current'>Current Concept Main Page</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Full MFS directory for this concept</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Sets & s.i Tree</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Specific Instances</NavLink>

            <br/><br/>

            <center>Updates</center>

            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Updates Control Panel</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Suggested Updates</NavLink>

        </div>

      </>
    );
  }
}
