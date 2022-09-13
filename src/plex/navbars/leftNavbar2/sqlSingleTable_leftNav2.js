import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_SQLSingleTable extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >

            <center>back</center>

            <NavLink className="leftNav2BackButton" activeClassName="active" to='/SettingsMainPage'>Settings</NavLink>
            <NavLink className="leftNav2BackButton" activeClassName="active" to='/SQLTablesPage'>SQL Tables</NavLink>

            <br/><br/>

            <center>SQL: Single Table</center>
            <br/>

            <Link className="leftNav2ButtonGreyed" to='/SQLViewSingleTablePage/myConceptGraph_pga' >View/Edit Table Structure</Link>
        </div>

      </>
    );
  }
}
