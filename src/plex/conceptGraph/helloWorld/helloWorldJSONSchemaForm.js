import React from 'react';
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import JSONSchemaForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
// import schema from '../../lib/json/JSONSchema/schemaTest.json';
import schema from '../../lib/json/JSONSchema/schemaTest6.json';

const jQuery = require("jquery");

const uiSchema = {
    catData: { 'ui:widget': 'hidden' },
}


const onFormChange = ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
    jQuery("#formContainer").val(sFormData)
}
const onFormSubmit = ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
    jQuery("#formContainer").val(sFormData)
}
export default class HelloWorldJSONSchemaForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Hello World: JSON Schema Form</div>
                        <div style={{width:"500px",display:"inline-block"}} >
                            <JSONSchemaForm
                              schema={schema}
                              onChange={onFormChange}
                              onSubmit={onFormSubmit}
                              uiSchema={uiSchema}
                              omitExtraData
                              />
                        </div>
                        <textarea id="formContainer" style={{width:"600px",height:"1200px",display:"inline-block"}} >
                            formContainer
                        </textarea>
                    </div>
                </fieldset>
            </>
        );
    }
}
