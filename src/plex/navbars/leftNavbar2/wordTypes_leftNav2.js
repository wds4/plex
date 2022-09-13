import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_ConceptGraphs extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <center>Word Types</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/WordTypesMainPage'>Show All Word Types (table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/MakeNewWordTypePage'>Make New Word Type</NavLink>
        </div>

      </>
    );
  }
}
