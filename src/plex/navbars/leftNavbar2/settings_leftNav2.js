import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_GeneralSettings extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <center>Settings</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SettingsMainPage'>General Settings</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCoreSettingsControlPanel'>NeuroCore 0.1</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCore2SettingsControlPanel'>NeuroCore 0.2</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldMainPage'>Hello World Pages</NavLink>
            <br/>
            <br/><br/>
            <center>Networks and Databases</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SQLGeneralSettingsPage'>SQL</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/IPFSGeneralInfoPage'>IPFS</NavLink>
            <NavLink className="leftNav2ButtonGreyed" activeClassName="active" to='/'>GUN</NavLink>
        </div>

      </>
    );
  }
}
