
import React from "react";
import { BrowserRouter, Link, Route } from "react-router-dom";
import ConceptGraphMasthead from './conceptGraphMasthead';
import About from './About';
import ReactJSONSchemaForm from './helloWorld/react-jsonschema-form';

export default class LandingPage extends React.Component {
  render() {
    return (
      <BrowserRouter>
      <div>
        <h1>Landing page</h1>
        <div>
        <Link to="/About">About</Link>
        </div>
        <div>
        <Link to="/ReactJSONSchemaForm">React JSON Schema Form</Link>
        </div>
        <Link to="/">Go back to home</Link>
      </div>
      </BrowserRouter>
    );
  }
}
