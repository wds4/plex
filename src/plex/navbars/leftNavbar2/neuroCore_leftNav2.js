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

            <center>NeuroCore</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCoreSettingsControlPanel'>NeuroCore Main Control Panel</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCoreConfig'>View/Edit NeuroCore Config File</NavLink>

            <br/><br/>

            <center>PATTERNS TABLES</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCoreTableForPatternsSingleNode'>single node</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCoreTableForPatternsSingleRelationship'>single relationship</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCoreTableForPatternsDoubleRelationship'>double relationship</NavLink>

            <br/><br/>

            <center>ACTIONS TABLES</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/NeuroCoreTableForActionsUpdateSingleNode'>update single node (u1n)</NavLink>

            <center>Require Async</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Create New Node</NavLink>
            <br/><br/>
            <center>Do Not Require Async</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/'>Update Existing Node</NavLink>


        </div>

      </>
    );
  }
}
