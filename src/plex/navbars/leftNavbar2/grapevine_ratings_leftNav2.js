import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_Grapevine_Ratings extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <center>Ratings</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/GrapevineRatingsMainPage'>Ratings Main Page</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ShowAllRatings'>Show all Ratings</NavLink>
        </div>

      </>
    );
  }
}
