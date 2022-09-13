
import React from "react";
import ReactDOM from 'react-dom';
import * as Constants from '../conceptGraphMasthead.js';
import schema from '../json/schemaTest';
import Demo from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import LeftNavbarHelloWorld from '../LeftNavbar_HelloWorld'; 

export default class ReactJSONSchemaForm extends React.Component {
  render() {
    return (
      <>
        <fieldset className="mainBody" >
            <LeftNavbarHelloWorld />
            <div className="mainPanel" >
                {Constants.conceptGraphMasthead}
                <div class="h2">This is my React JSON Schema Form page</div>
                <Demo schema={schema} />
            </div>
        </fieldset>
      </>
    );
  }
}

/*
ReactDOM.render((
  <Demo schema={schema} />
), document.getElementById("reactFormNode"));
*/
