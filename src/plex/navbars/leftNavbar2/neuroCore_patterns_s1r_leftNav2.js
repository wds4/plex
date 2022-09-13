import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_NeuroCore extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >

            <center>back</center>

            <NavLink className="leftNav2BackButton" activeClassName="active" to='/SettingsMainPage'>Settings</NavLink>
            <NavLink className="leftNav2BackButton" activeClassName="active" to='/NeuroCoreSettingsControlPanel'>NeuroCore Main Control Panel</NavLink>

            <br/><br/>

            <br/><br/>

            <center>PATTERNS TABLES</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCoreTableForPatternsSingleNode'>single node</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCoreTableForPatternsSingleRelationship'>single relationship</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCoreTableForPatternsDoubleRelationship'>double relationship</NavLink>

            <br/><br/>

            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCoreMakeNewPatternSingleRelationship'>make new single relationship pattern</NavLink>
        </div>

      </>
    );
  }
}
