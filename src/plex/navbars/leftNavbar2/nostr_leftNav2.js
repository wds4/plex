import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_Nostr extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_Plex" >

            <center>Plex Settings</center>

            <br/>

            <NavLink className="leftNav2BackButton" activeClassName="active" to='/PlexSettingsMainPage'>Plex General Settings</NavLink>

            <br/><br/>

            <center>Nostr</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NostrGeneralInfo'>Nostr General Info</NavLink>
        </div>

      </>
    );
  }
}
