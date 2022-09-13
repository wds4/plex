import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_Profile extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <center>Profile</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/'>My Profile</NavLink>
        </div>

      </>
    );
  }
}
