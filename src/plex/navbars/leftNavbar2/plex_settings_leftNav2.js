import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_GeneralSettings extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_Plex" >
            <center>Plex Settings</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/PlexSettingsMainPage'>Plex General Settings</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldMainPage'>Hello World Pages</NavLink>
            <br/>
            <br/><br/>
            <center>Networks and Databases</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SQLGeneralSettingsPage'>SQL</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/IPFSGeneralInfoPage'>IPFS (.ipfs)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/IPFSCoreGeneralInfoPage'>ipfs-core</NavLink>
            <NavLink className="leftNav2ButtonGreyed" activeClassName="active" to='/'>GUN</NavLink>

            <br/><br/>
            <center>Documents</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphAPI'>API</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/PlexFAQ'>FAQ</NavLink>
        </div>

      </>
    );
  }
}
