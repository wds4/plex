import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar1_Plex extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNav1Panel_Plex" >
            <NavLink className="leftNav1PlexButton" exact activeClassName="active" to='/PlexHome'>
                <div style={{fontSize:"42px"}} >&#x221E;</div>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >Plex</div>
                </NavLink>
        <br/><br/>
            <NavLink className="leftNav1PlexButton" activeClassName="active" to='/ConceptGraphHome' >
                <div style={{fontSize:"38px"}} >&#x26CF;</div>
                <div style={{fontSize:"10px"}} >Concept Graph</div>
                </NavLink>
            <NavLink className="leftNav1PlexButton" activeClassName="active" to='/ConceptGraphFrontEndHome' >
                <div style={{fontSize:"38px"}} >&#x1F4A1;</div>
                <div style={{fontSize:"10px",lineHeight:"100%"}} >Concept Graph (front end)</div>
                </NavLink>
            <NavLink className="leftNav1PlexButton" activeClassName="active" to='/GrapevineHome'>
                <div style={{fontSize:"42px"}} >&#x1F347;</div>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >Grapevine</div>
                </NavLink>
            <NavLink className="leftNav1PlexButton" activeClassName="active" to='/CrowdscreenedGroupsHome'>
                <div style={{fontSize:"42px"}} >&#9860;</div>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >cGroups</div>
                </NavLink>
        </div>

      </>
    );
  }
}
