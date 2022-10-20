import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_ConceptGraphs extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <center>Single Concept Graph</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Single Concept Graph</NavLink>

        </div>

      </>
    );
  }
}
