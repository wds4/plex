import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar1_Plex extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNav1Panel_Plex" >
            <NavLink className="leftNav1PlexButton" exact activeClassName="active" to='/PlexHome'>
                <div style={{fontSize:"42px"}} >&#x221E;</div>
                Plex
                </NavLink>
        <br/><br/>
            <NavLink className="leftNav1PlexButton" activeClassName="active" to='/ConceptGraphHome' >
                <div style={{fontSize:"28px"}} >&#x1F4A1;</div>
                Concept Graph
                </NavLink>
            <NavLink className="leftNav1PlexButton" activeClassName="active" to='/ConceptGraphFrontEndHome' >Concept Graph Home (front end)</NavLink>
            <NavLink className="leftNav1PlexButton" activeClassName="active" to='/GrapevineHome'>
                <div style={{fontSize:"42px"}} >&#x1F347;</div>
                Grapvine
                </NavLink>
            <NavLink className="leftNav1PlexButton" activeClassName="active" to='/CrowdscreenedGroupsHome'>
                <div style={{fontSize:"42px"}} >&#9860;</div>
                cGroups
                </NavLink>
        </div>

      </>
    );
  }
}
