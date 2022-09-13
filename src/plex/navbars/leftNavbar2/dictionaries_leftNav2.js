import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_ConceptGraphs extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <center>Dictionaries</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/DictionariesMainPage'>Show All Dictionaries (table)</NavLink>
            <NavLink className="leftNav2ButtonGreyed" activeClassName="active" to='/'>Make New Dictionary</NavLink>
        </div>

      </>
    );
  }
}
