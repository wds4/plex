import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar1_conceptGraph extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNav1Panel_ConceptGraph" >
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/PlexHome'>
                <div style={{fontSize:"42px"}} >&#x221E;</div>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >Plex</div>
                </NavLink>

            <br/><br/>

            <NavLink className="leftNav1Button" activeClassName="active" to='/ConceptGraphFrontEndHome' >
                <div style={{fontSize:"38px"}} >&#x1F4A1;</div>
                <div style={{fontSize:"10px",lineHeight:"100%"}} >Concept Graph (front end)</div>
                </NavLink>

            <NavLink className="leftNav1Button" activeClassName="active" to='/ConceptGraphsFrontEnd_ManageDownload' >
                <div style={{fontSize:"10px",lineHeight:"100%"}} >Manage Download of Concept Graph from IPFS or External MFS</div>
                </NavLink>

            <NavLink className="leftNav1Button" activeClassName="active" to='/ConceptGraphsFrontEnd_ConceptsMainPage' >
                <div style={{fontSize:"10px",lineHeight:"100%"}} >Concepts</div>
                </NavLink>
        </div>

      </>
    );
  }
}
