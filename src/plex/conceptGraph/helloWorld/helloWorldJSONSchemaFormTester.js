import React from 'react';
import ReactDOM from 'react-dom';
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import JSONSchemaForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
// import schema from '../../lib/json/JSONSchema/schemaTest.json';
import oSchema from '../../lib/json/JSONSchema/schemaTest6.json';

const jQuery = require("jquery");

const uiSchema = {
    catData: { 'ui:widget': 'hidden' },
}

const renderForm = () => {
    var sSchema = jQuery("#jsonSchemaContainer").val();
    var oSchema = JSON.parse(sSchema)

    ReactDOM.render(<JSONSchemaForm
      schema={oSchema}
      onSubmit={onFormSubmit}
      onChange={onFormChange}
      uiSchema={uiSchema}
      omitExtraData
      />,
        document.getElementById("jsonSchemaFormContainer")
    )
}

const onFormChange = ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
    jQuery("#formContainer").val(sFormData)
}
const onFormSubmit = ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
    jQuery("#formContainer").val(sFormData)
}
export default class HelloWorldJSONSchemaFormTester extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        jQuery("#jsonSchemaContainer").html(JSON.stringify(oSchema,null,4))
        jQuery("#renderJSONSchemaButton").click(function(){
            renderForm();
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Hello World: JSON Schema Form Tester</div>

                        <div style={{width:"500px",height:"1200px",display:"inline-block"}} >
                            <div id="renderJSONSchemaButton" className="doSomethingButton">render</div>
                            <textarea id="jsonSchemaContainer" style={{width:"95%",height:"1000px",display:"inline-block"}} >
                            </textarea>
                        </div>

                        <div id="jsonSchemaFormContainer" style={{width:"500px",display:"inline-block"}} >
                            <JSONSchemaForm
                              schema={oSchema}
                              onChange={onFormChange}
                              onSubmit={onFormSubmit}
                              uiSchema={uiSchema}
                              omitExtraData
                              />
                        </div>
                        <textarea id="formContainer" style={{width:"500px",height:"1200px",display:"inline-block"}} >
                            formContainer
                        </textarea>
                    </div>
                </fieldset>
            </>
        );
    }
}
