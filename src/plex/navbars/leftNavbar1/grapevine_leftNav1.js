import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar1_Grapevine extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNav1Panel_Grapevine" >
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/ConceptGraphHome' >Concept Graph Home (CG)</NavLink>

            <br/><br/>

            <NavLink className="leftNav1Button" activeClassName="active" to='/GrapevineHome'>Grapevine Home</NavLink>

        </div>

      </>
    );
  }
}
