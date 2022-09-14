import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_GeneralSettings extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <center>Concept Graph Settings</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SettingsMainPage'>General Settings</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCoreSettingsControlPanel'>NeuroCore 0.1</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCore2SettingsControlPanel'>NeuroCore 0.2</NavLink>
            <br/>
        </div>

      </>
    );
  }
}
