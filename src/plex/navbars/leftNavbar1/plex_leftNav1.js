import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar1_Plex extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNav1Panel_Plex" >
            <NavLink className="leftNav1PlexButton" exact activeClassName="active" to='/PlexHome'>Plex Home</NavLink>
            <br/><br/>
            <NavLink className="leftNav1PlexButton" activeClassName="active" to='/ConceptGraphHome' >Concept Graph Home (back end)</NavLink>
            <NavLink className="leftNav1PlexButton" activeClassName="active" to='/ConceptGraphFrontEndHome' >Concept Graph Home (front end)</NavLink>
            <NavLink className="leftNav1PlexButton" activeClassName="active" to='/GrapevineHome'>Grapevine Home</NavLink>
        </div>

      </>
    );
  }
}
