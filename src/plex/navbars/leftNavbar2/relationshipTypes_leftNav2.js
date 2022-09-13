import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_ConceptGraphs extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <center>Relationship Types</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/RelationshipTypesMainPage'>Show All Relationship Types (table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/MakeNewRelationshipTypePage'>Make New Relationship Type</NavLink>
        </div>

      </>
    );
  }
}
