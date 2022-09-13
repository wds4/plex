import React from "react";
import { NavLink, Link } from "react-router-dom";
import * as Constants from './conceptGraphMasthead.js';
// import { useLocation } from "react-router-dom";
// trying to track location via useLocation using this guide:
// https://medium.com/how-to-react/add-an-active-classname-to-the-link-using-react-router-b7c350473916

export default class LeftNavbarHelloWorld extends React.Component {
  render() {
    return (
      <>
        <div className="navButtonPanel" >
            <NavLink class="navButton" exact activeClassName="active" to='/' >Home</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/Sqlite3DbManagement'>SQLite3 Database Management</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/ReactJSONSchemaForm'>React JSON Schema Form</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/ReactJSONSchemaForm2'>React JSON Schema Form 2</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/about'>About</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/profile'>Profile</NavLink>
        </div>
      </>
    );
  }
}
