import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar1_Grapevine extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNav1Panel_Grapevine" >
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/PlexHome'>Plex Home</NavLink>
            <br/><br/>
            <NavLink className="leftNav1Button" activeClassName="active" to='/GrapevineHome'>Grapevine Home</NavLink>
            <NavLink className="leftNav1Button" activeClassName="active" to='/GrapevineContactsMainPage'>Contacts</NavLink>
            <NavLink className="leftNav1Button" activeClassName="active" to='/GrapevineVisualizationMainPage'>Grapevine: Visualization</NavLink>
            <NavLink className="leftNav1Button" activeClassName="active" to='/GrapevineChatroomMainPage'>chatroom</NavLink>
            <NavLink className="leftNav1Button" activeClassName="active" to='/GrapevineRatingsMainPage'>Ratings</NavLink>
            <NavLink className="leftNav1Button" activeClassName="active" to='/GrapevineScoresMainPage'>Composite Scores</NavLink>
            <NavLink className="leftNav1Button" activeClassName="active" to='/GrapevineContextMainPage'>Context tree</NavLink>
            <NavLink className="leftNav1Button" activeClassName="active" to='/GrapevineInfluenceAndTrustScoresMainPage'>Influence & Trust Scores</NavLink>
        </div>

      </>
    );
  }
}
