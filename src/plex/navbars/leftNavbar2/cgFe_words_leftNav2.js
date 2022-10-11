import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_ConceptGraphs extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <center>Words in the MFS</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_WordsMainPage'>Words</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_TableOfWords'>Table of Words</NavLink>
        </div>

      </>
    );
  }
}
