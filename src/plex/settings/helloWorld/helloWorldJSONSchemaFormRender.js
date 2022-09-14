import React from 'react';
import ReactDOM from 'react-dom';
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import JSONSchemaForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import schema from '../../lib/json/JSONSchema/schemaTest.json';

const renderForm = () => {
    ReactDOM.render(<JSONSchemaForm schema={schema} />,
        document.getElementById("renderedFormElem")
    )
}

export default class HelloWorldJSONSchemaFormRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        renderForm();
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Hello World: JSON Schema Form via React's Render</div>
                        <div style={{width:"500px"}} >
                            <div id="renderedFormElem" ></div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
