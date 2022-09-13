import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_IPFS extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >

            <center>back</center>

            <NavLink className="leftNav2BackButton" activeClassName="active" to='/SettingsMainPage'>Settings</NavLink>

            <br/><br/>

            <center>SQL</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/IPFSGeneralInfoPage'>IPFS General Info</NavLink>
        </div>

      </>
    );
  }
}
