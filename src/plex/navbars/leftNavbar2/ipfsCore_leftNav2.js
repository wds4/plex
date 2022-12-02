import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_IPFS extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_Plex" >

            <center>Plex Settings</center>

            <br/>

            <NavLink className="leftNav2BackButton" activeClassName="active" to='/PlexSettingsMainPage'>Plex General Settings</NavLink>

            <br/><br/>

            <center>IPFS Core</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/IPFSCoreGeneralInfoPage'>IPFS Core General Info</NavLink>
        </div>

      </>
    );
  }
}
