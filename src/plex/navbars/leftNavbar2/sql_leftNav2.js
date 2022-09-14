import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_SQL extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_Plex" >

            <center>Plex Settings</center>

            <br/>

            <NavLink className="leftNav2BackButton" activeClassName="active" to='/PlexSettingsMainPage'>Plex General Settings</NavLink>

            <br/><br/>

            <center>SQL</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SQLGeneralSettingsPage'>General Info</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SQLTablesPage'>Tables</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SQLMakeANewTablePage'>Make New Table</NavLink>
        </div>

      </>
    );
  }
}
