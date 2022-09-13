import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_NeuroCore extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >

            <center>back</center>

            <NavLink className="leftNav2BackButton" activeClassName="active" to='/SettingsMainPage'>Settings</NavLink>
            <NavLink className="leftNav2BackButton" activeClassName="active" to='/NeuroCore2SettingsControlPanel'>NeuroCore 0.2 Main Control Panel</NavLink>

            <br/><br/>

            <br/><br/>

            <center>ACTIONS TABLES</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCore2TableForActionsAll'>all actions</NavLink>

            <br/><br/>

            <NavLink className="leftNav2Button" activeClassName="active" to='/'>make new action: update single node (u1n)</NavLink>
        </div>

      </>
    );
  }
}
