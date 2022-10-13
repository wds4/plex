import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_GeneralSettings extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_Plex" >
            <center>Grapevine Settings</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/GrapevineSettingsMainPage'>Grapevine General Settings</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/GrapevineSettingsRatingsLocationsInMutableFileSystem'>Ratings Locations in MFS</NavLink>
        </div>

      </>
    );
  }
}
