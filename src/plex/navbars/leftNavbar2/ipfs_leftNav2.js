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

            <center>IPFS</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/IPFSGeneralInfoPage'>IPFS General Info</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/IPFSPeersInfoPage'>Peers Info</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/IPFSPubsubInfoPage'>Pubsub Info</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/IPFSConfigInfoPage'>Config file</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/IPFSPinsInfoPage'>Pins file</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/IPFSKeysInfoPage'>Keys</NavLink>

            <br/><br/>

            <center>Mutable File System</center>

            <NavLink className="leftNav2Button" activeClassName="active" to='/IPFSMutableFilesInfoPage1'>MFS 1</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/IPFSMutableFilesInfoPage2'>MFS 2</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/IPFSMutableFilesInfoPage3'>MFS 3</NavLink>
        </div>

      </>
    );
  }
}
