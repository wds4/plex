import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_NeuroCore extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >

            <center>back</center>

            <NavLink className="leftNav2BackButton" activeClassName="active" to='/SettingsMainPage'>Settings</NavLink>

            <br/><br/>

            <center>NeuroCore 0.2</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCore2SettingsControlPanel'>NeuroCore 0.2 Main Control Panel</NavLink>

            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCore2Overview'>Overview (chart)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCore2GraphicalOverview'>Overview (graphical)</NavLink>

            <br/><br/>

            <center>PATTERNS TABLES</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCore2TableForPatternsSingleNode'>single node</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCore2TableForPatternsSingleRelationship'>single relationship</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCore2TableForPatternsDoubleRelationship'>double relationship</NavLink>
            <br/>

            <br/><br/>

            <center>ACTIONS TABLES</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCore2TableForActionsALl'>all actions</NavLink>
            <br/>

        </div>

      </>
    );
  }
}
