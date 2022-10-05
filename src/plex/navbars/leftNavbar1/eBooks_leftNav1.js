import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar1_eBooks extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNav1Panel_ConceptGraph" >
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/PlexHome'>
                <div style={{fontSize:"42px"}} >&#x221E;</div>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >Plex</div>
                </NavLink>

            <br/><br/>

            <NavLink className="leftNav1Button" activeClassName="active" to='/EBooksHome'>eBooks Home</NavLink>
            <NavLink className="leftNav1Button" activeClassName="active" to='/EBook1Home'>The Cognitive Blind Spot</NavLink>

        </div>

      </>
    );
  }
}
