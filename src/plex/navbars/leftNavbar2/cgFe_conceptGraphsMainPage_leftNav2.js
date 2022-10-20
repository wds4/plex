import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_ConceptGraphs extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <center>Concept Graphs</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Show All Concept Graphs (table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Make New Concept Graph</NavLink>

        </div>

      </>
    );
  }
}