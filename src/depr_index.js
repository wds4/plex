import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import App2 from './App2';
// import App3 from './App3';
import Page1 from './page1';
import Page2 from './page2';
import Page3 from './page3';
import Profile from './Profile';
import About from './About';
import LandingPage from './LandingPage';
import ReactJSONSchemaForm from './helloWorld/react-jsonschema-form';
import BuildConceptFamily from './views/buildConceptFamily';
import ConceptGraphMasthead from'./conceptGraphMasthead';
import { BrowserRouter, Route } from "react-router-dom";
import Demo from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import schema from './json/schemaTest';
// import Example from './example';
import * as Constants from './bubblegum.js';
// import reportWebVitals from './reportWebVitals';

/*
// this works:
ReactDOM.render(
<Example />,
document.getElementById('example')
);
*/

/*
ReactDOM.render(
  <React.StrictMode>
    <div className="App">
    </div>
  </React.StrictMode>,
  document.getElementById('example2')
);
*/
ReactDOM.render(
  <React.StrictMode>
     <BrowserRouter>
        <div className="App2" style={{height:"100%"}}>
          <Route path="/" exact component={App2} />
          <Route path="/About" exact component={About} />
          <Route path="/Profile" exact component={Profile} />
          <Route path="/ReactJSONSchemaForm" exact component={ReactJSONSchemaForm} />
          <Route path="/BuildConceptFamily" exact component={BuildConceptFamily} />
        </div>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
/*
// works:
ReactDOM.render((
  <Demo schema={schema} />
), document.getElementById("rootNode"));
*/
/*
ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
        <Route path="/" component={App3}>
          <Route path="page1" component={Page1} />
          <Route path="page2" component={Page2} />
        </Route>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('example3')
);
*/
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
