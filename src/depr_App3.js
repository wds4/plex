
import React from "react";
import { Router, Route, Link } from "react-router-dom";

export class NavBar extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/bubblegum">Bubblegum</Link>
          </li>
          <li>
            <Link to="/shoelaces">Shoelaces</Link>
          </li>
        </ul>
      </div>
    )
  }
}

export default class App3 extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <div>Other Content</div>
        {this.props.children}
      </div>
    );
  }
}
