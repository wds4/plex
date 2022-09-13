
import React from "react";
import ReactDOM from 'react-dom';
import * as Constants from '../conceptGraphMasthead.js';
import ReactJSONSchemaForm from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import schema from '../json/schemaTest2';
import ratingTemplateSchema from '../json/schemaTest3';
import Demo from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import LeftNavbarHelloWorld from '../LeftNavbar_HelloWorld';
const jQuery = require("jquery");

const uiSchema = {
    address: { 'ui:widget': 'hidden' },
}

const onFormSubmit_helloWorld = ({formData}, e) => {
    var formData_str = JSON.stringify(formData,null,4);
    /*
    jQuery.each(e,function(key,obj){
        console.log("key: "+key)
        if (key != "target") {
            var obj_str = JSON.stringify(obj,null,4)
            console.log("obj_str: "+obj_str)
        } else {
            jQuery.each(obj,function(k,v){
                var v_typeof = typeof v;
                console.log("k: "+k+"; v_typeof: "+v_typeof)
            })
        }

    })
    */
    jQuery("#formDataContainer").html(formData_str)
    jQuery("#formDataContainer").val(formData_str)

    var elem = document.getElementById('jsonSchemaFormContainer_helloWorld')
    // var elem_str = JSON.stringify(elem,null,4)
    // console.log("elem_str: "+elem_str)
}

const onFormChange_helloWorld = ({formData}, e) => {
    var formData_str = JSON.stringify(formData,null,4);
    jQuery("#formDataContainer").html(formData_str)
    jQuery("#formDataContainer").val(formData_str)
}

function createReactJsonSchemaForm_helloWorld() {
    var formData_str = jQuery("#formDataContainer").val()
    var formData_obj = JSON.parse(formData_str);
    var schema_str = jQuery("#schemaDataContainer").val()
    var schema_obj = JSON.parse(schema_str);

    ReactDOM.render(
        <>
        <ReactJSONSchemaForm
            schema={schema_obj}
            formData={formData_obj}
            onSubmit={onFormSubmit_helloWorld}
            onChange={onFormChange_helloWorld}
            uiSchema={uiSchema}
            omitExtraData
            />
            <div style={{fontSize:"10px"}}>
            Click Submit to update a preexisting Specific Instance in SQL<br/>
            To store a new Specific Instance in SQL, use the add button on the left panel.
            </div>
        </>,
        document.getElementById('jsonSchemaFormContainer_helloWorld')
    )
}

function resetReactJsonSchemaForm_helloWorld() {
    // var formData_str = jQuery("#formDataContainer").val()
    // var formData_obj = JSON.parse(formData_str);
/*
    var formData_obj = {
        "ratingTemplateData": {
            "ratingTemplateTitle": "Flag User as Troll: Rating Template",
            "ratingTemplateName": ""
        }
    }
*/
    var formData_obj = {}

    ReactDOM.render(
        <>
        <ReactJSONSchemaForm
            schema={ratingTemplateSchema}
            formData={formData_obj}
            onSubmit={onFormSubmit_helloWorld}
            onChange={onFormChange_helloWorld}
            uiSchema={uiSchema}
            omitExtraData
            />
            <div style={{fontSize:"10px"}}>
            Click Submit to update a preexisting Specific Instance in SQL<br/>
            To store a new Specific Instance in SQL, use the add button on the left panel.
            </div>
        </>,
        document.getElementById('jsonSchemaFormContainer_helloWorld')
    )

    var ratingTemplateSchema_str = JSON.stringify(ratingTemplateSchema,null,4);
    jQuery("#schemaDataContainer").html(ratingTemplateSchema_str)
    jQuery("#schemaDataContainer").val(ratingTemplateSchema_str)
}

export default class ReactJSONSchemaForm2 extends React.Component {
  constructor(props) {
      super(props);
  }
  componentDidMount() {
      var initFormData_str = "{}";
      jQuery("#formDataContainer").html(initFormData_str)
      jQuery("#formDataContainer").val(initFormData_str)
      var schema_str = JSON.stringify(schema,null,4);
      jQuery("#schemaDataContainer").html(schema_str)
      jQuery("#schemaDataContainer").val(schema_str)
      createReactJsonSchemaForm_helloWorld()
      jQuery("#schemaDataContainer").change(function(){
          createReactJsonSchemaForm_helloWorld();
      });
      jQuery("#resetFormButton").click(function(){
          console.log("resetFormButton clicked");
          resetReactJsonSchemaForm_helloWorld();
      })
  }
  render() {
    return (
      <>
        <fieldset className="mainBody" >
            <LeftNavbarHelloWorld />
            <div className="mainPanel" >
                {Constants.conceptGraphMasthead}
                <div class="h2">This is my React JSON Schema Form page</div>
                <div>
                    <textarea id="schemaDataContainer" style={{width:"500px",height:"1000px",display:"inline-block",verticalAlign:"top"}} ></textarea>
                    <textarea id="formDataContainer" style={{width:"400px",height:"1000px",display:"inline-block",verticalAlign:"top"}} ></textarea>
                    <div style={{width:"500px",display:"inline-block"}}  >
                        <div id="jsonSchemaFormContainer_helloWorld" style={{width:"500px",display:"inline-block"}} >jsonSchemaFormContainer_helloWorld</div>
                        <br/>
                        <div className="doSomethingButton" id="resetFormButton" >reset</div>
                    </div>
                </div>
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
