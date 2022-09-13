import React from "react";
import ReactDOM from 'react-dom';
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/wordTypes_leftNav2.js';
import ReactJSONSchemaForm from 'react-jsonschema-form';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

function createReactJsonSchemaForm(oJSONSchema) {
    var oSpecificInstance = {}

    ReactDOM.render(
        <>
        <ReactJSONSchemaForm
            schema={oJSONSchema}
            formData={oSpecificInstance}
            />
        </>,
        document.getElementById('jsonSchemaFormContainer')
    )
}

const updateCurrentWordType = async () => {
    console.log("updateCurrentWordType")
    var commandHTML = "";
    var currentWordTypeSqlId = jQuery("#currentWordTypeSqlIdField").html();
    var currentWordTypeSlug = jQuery("#currentWordTypeSlugField").val();
    var currentWordTypeName = jQuery("#currentWordTypeNameField").val();
    var currentWordTypeBackgroundColor = jQuery("#currentWordTypeBackgroundColorField").val();
    var currentWordTypeBorderColor = jQuery("#currentWordTypeBorderColorField").val();
    var currentWordTypeShape = jQuery("#currentWordTypeShapeField").val();
    var currentWordTypeBorderWidth = jQuery("#currentWordTypeBorderWidthField").val();
    var currentWordTypeDescription = jQuery("#currentWordTypeDescriptionField").val();
    var currentWordTypeJSONSchema = jQuery("#currentWordTypeJSONSchemaField").val();
    var currentWordTypeTemplate = jQuery("#currentWordTypeTemplateField").val();
    var currentWordTypeSchema = jQuery("#currentWordTypeSchemaField").val();

    if (!currentWordTypeTemplate) { currentWordTypeTemplate = "{}" }
    if (!currentWordTypeSchema) { currentWordTypeSchema = "{}" }

    if (currentWordTypeTemplate) { currentWordTypeTemplate = JSON.stringify(JSON.parse(currentWordTypeTemplate),null,0) }
    if (currentWordTypeSchema) { currentWordTypeSchema = JSON.stringify(JSON.parse(currentWordTypeSchema),null,0) }

    commandHTML += "UPDATE wordTypes ";
    commandHTML += " SET ";
    commandHTML += " slug='"+currentWordTypeSlug+"', ";
    commandHTML += " name='"+currentWordTypeName+"', ";
    commandHTML += " template='"+currentWordTypeTemplate+"', ";
    commandHTML += " schema='"+currentWordTypeSchema+"', ";
    commandHTML += " description='"+currentWordTypeDescription+"', ";
    commandHTML += " backgroundColor='"+currentWordTypeBackgroundColor+"', ";
    commandHTML += " borderColor='"+currentWordTypeBorderColor+"', ";
    commandHTML += " shape='"+currentWordTypeShape+"', ";
    commandHTML += " borderWidth='"+currentWordTypeBorderWidth+"', ";
    commandHTML += " jsonSchemaSlug='"+currentWordTypeJSONSchema+"' ";
    commandHTML += " WHERE id='"+currentWordTypeSqlId+"' ";

    console.log("updateCurrentWordType commandHTML: "+commandHTML)


    jQuery("#sqlCommandContainer").html(commandHTML);
    jQuery("#sqlCommandContainer").val(commandHTML);

    var sql = commandHTML;
    console.log("sql: "+sql)
    sendAsync(sql).then((result) => {
        var sResult = JSON.stringify(result,null,4)
        jQuery("#sqlResultContainer_mNWTP").html(sResult)
        jQuery("#sqlResultContainer_mNWTP").val(sResult)
        console.log("sResult: "+sResult)
    })
}

const populateWordTypeFields = async (sqlid) => {
    var sql = " SELECT * FROM wordTypes WHERE id='"+sqlid+"' ";
    console.log("sql: "+sql)

    sendAsync(sql).then((result) => {
        var oWordTypeData = result[0];
        var currWordTypeSlug = oWordTypeData.slug;
        var currWordTypeName = oWordTypeData.name;
        var currWordTypeTemplate = oWordTypeData.template;
        var currWordTypeSchema = oWordTypeData.schema;
        var currWordTypeDescription = oWordTypeData.description;
        var currWordTypeBackgroundColor = oWordTypeData.backgroundColor;
        var currWordTypeBorderColor = oWordTypeData.borderColor;
        var currWordTypeShape = oWordTypeData.shape;
        var currWordTypeBorderWidth = oWordTypeData.borderWidth;
        var currWordTypeJSONSchema = oWordTypeData.jsonSchemaSlug;

        if (currWordTypeTemplate) { currWordTypeTemplate = JSON.stringify(JSON.parse(currWordTypeTemplate),null,4) }
        if (currWordTypeSchema) { currWordTypeSchema = JSON.stringify(JSON.parse(currWordTypeSchema),null,4) }

        if (currWordTypeJSONSchema) {
            var oJSONSchema = window.lookupWordBySlug[currWordTypeJSONSchema]
            delete oJSONSchema.wordData;
            delete oJSONSchema.globalDynamicData;
            delete oJSONSchema.metaData;
            // delete oJSONSchema.["$schema"];
            var sJSONSchema = JSON.stringify(oJSONSchema,null,4);
            createReactJsonSchemaForm(oJSONSchema)
        }

        jQuery("#currentWordTypeSqlIdField").html(sqlid);
        jQuery("#currentWordTypeSlugField").val(currWordTypeSlug);
        jQuery("#currentWordTypeNameField").val(currWordTypeName);
        jQuery("#currentWordTypeBackgroundColorField").val(currWordTypeBackgroundColor);
        jQuery("#currentWordTypeBorderColorField").val(currWordTypeBorderColor);
        jQuery("#currentWordTypeShapeField").val(currWordTypeShape);
        jQuery("#currentWordTypeBorderWidthField").val(currWordTypeBorderWidth);
        jQuery("#currentWordTypeDescriptionField").val(currWordTypeDescription);
        jQuery("#currentWordTypeJSONSchemaField").val(currWordTypeJSONSchema);
        jQuery("#currentWordTypeTemplateField").val(currWordTypeTemplate);
        jQuery("#currentWordTypeSchemaField").val(currWordTypeSchema);
        jQuery("#jsonRawfileContainer").val(sJSONSchema);
    })
}

export default class EditExistingWordTypePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wordTypeSqlID: null
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var wordTypeSqlID = this.props.match.params.wordtypesqlid
        this.setState({wordTypeSqlID: wordTypeSqlID } )

        jQuery("#updateCurrentWordTypeButton").click(function(){
            updateCurrentWordType();
        })

        jQuery("#deleteCurrentWordTypeButton").click(function(){
        })

        populateWordTypeFields(wordTypeSqlID);

        jQuery(".showSomethingButton").click(function(){
            jQuery(".showSomethingButton").css("backgroundColor","grey")
            jQuery(this).css("backgroundColor","green")

            var containerID = jQuery(this).data("whattoshow");
            jQuery(".showSomethingContainer").css("display","none")
            jQuery("#"+containerID).css("display","block")

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
                        <div class="h2">View / Edit Existing Word Type</div>
                        <div style={{marginTop:"20px"}}>

                            <div id="updateCurrentWordTypeButton" className="doSomethingButton" style={{marginLeft:"700px"}}>update this wordType</div>
                            <div id="deleteCurrentWordTypeButton" className="doSomethingButton" style={{marginLeft:"20px"}}>delete this wordType (not yet functional)</div>

                            <br/>

                            <div className="makeNewLeftPanel">
                            sql ID
                            </div>
                            <div id="currentWordTypeSqlIdField" className="makeNewRightPanel" style={{backgroundColor:"#EFEFEF"}}>
                            </div>

                            <br/>

                            <div className="makeNewLeftPanel">
                            slug
                            </div>
                            <textarea id="currentWordTypeSlugField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel">
                            name
                            </div>
                            <textarea id="currentWordTypeNameField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel">
                            background color
                            </div>
                            <textarea id="currentWordTypeBackgroundColorField" className="makeNewRightPanel">
                            </textarea>
                            #ABCDEF or grey

                            <br/>

                            <div className="makeNewLeftPanel">
                            border color
                            </div>
                            <textarea id="currentWordTypeBorderColorField" className="makeNewRightPanel">
                            </textarea>
                            #ABCDEF or grey

                            <br/>

                            <div className="makeNewLeftPanel">
                            shape
                            </div>
                            <textarea id="currentWordTypeShapeField" className="makeNewRightPanel">
                            </textarea>
                            circle

                            <br/>

                            <div className="makeNewLeftPanel">
                            border width
                            </div>
                            <textarea id="currentWordTypeBorderWidthField" className="makeNewRightPanel">
                            </textarea>
                            3

                            <br/>

                            <div className="makeNewLeftPanel">
                            description
                            </div>
                            <textarea id="currentWordTypeDescriptionField" className="makeNewRightPanel" style={{height:"50px"}}>
                            </textarea>
                            lorem ipsum

                            <br/>

                            <div className="makeNewLeftPanel">
                            JSONSchemaSlug
                            </div>
                            <textarea id="currentWordTypeJSONSchemaField" className="makeNewRightPanel" style={{height:"50px"}}>
                            </textarea>
                            JSONSchemaFor_superset

                            <br/>

                            <div style={{display:"inline-block",marginLeft:"20px"}}>
                                template <br/>
                                <textarea id="currentWordTypeTemplateField" className="makeNewRightPanel" style={{height:"500px",fontSize:"12px",marginLeft:"0px"}} >
                                </textarea>
                            </div>

                            <div style={{display:"inline-block",marginLeft:"20px"}}>
                                <div className="doSomethingButton showSomethingButton" data-whattoshow="schemaContainer" >schema</div>
                                <div className="doSomethingButton showSomethingButton" data-whattoshow="JSONContainer" >JSON Schema (pruned)</div>
                                <div className="doSomethingButton showSomethingButton" data-whattoshow="formContainer" >Form</div>
                                <br/>
                                <div className="showSomethingContainer" id="schemaContainer" style={{display:"none"}} >
                                    <textarea id="currentWordTypeSchemaField" className="makeNewRightPanel" style={{height:"500px",fontSize:"12px",marginLeft:"0px"}} >
                                    </textarea>
                                </div>
                                <div className="showSomethingContainer" id="JSONContainer" style={{display:"none"}} >
                                    <textarea id="jsonRawfileContainer" className="makeNewRightPanel" style={{height:"500px",fontSize:"12px",marginLeft:"0px"}} >
                                    </textarea>
                                </div>
                                <div className="showSomethingContainer" id="formContainer" style={{display:"none",overflow:"scroll"}} >
                                    <div id="jsonSchemaFormContainer" className="makeNewRightPanel" style={{height:"500px",fontSize:"12px",marginLeft:"0px"}} >
                                    </div>
                                </div>
                            </div>

                            <br/><br/>

                            <div id="sqlCommandContainer" >sqlCommandContainer</div>

                            <br/>

                            <div id="sqlResultContainer_mNWTP" >sqlResultContainer_mNWTP</div>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
