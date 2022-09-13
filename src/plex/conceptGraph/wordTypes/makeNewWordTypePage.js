import React from "react";
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/wordTypes_leftNav2.js';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

const makeNewWordType = async () => {
    console.log("makeNewWordType")
    var commandHTML = "";
    var newWordTypeSlug = jQuery("#newWordTypeSlugField").val();
    var newWordTypeName = jQuery("#newWordTypeNameField").val();
    var newWordTypeBackgroundColor = jQuery("#newWordTypeBackgroundColorField").val();
    var newWordTypeBorderColor = jQuery("#newWordTypeBorderColorField").val();
    var newWordTypeShape = jQuery("#newWordTypeShapeField").val();
    var newWordTypeBorderWidth = jQuery("#newWordTypeBorderWidthField").val();
    var newWordTypeDescription = jQuery("#newWordTypeDescriptionField").val();
    var newWordTypeTemplate = jQuery("#newWordTypeTemplateField").val();
    var newWordTypeSchema = jQuery("#newWordTypeSchemaField").val();

    if (newWordTypeTemplate) { newWordTypeTemplate = JSON.stringify(JSON.parse(newWordTypeTemplate),null,0) }
    if (newWordTypeSchema) { newWordTypeSchema = JSON.stringify(JSON.parse(newWordTypeSchema),null,0) }

    commandHTML += "INSERT OR IGNORE INTO wordTypes";
    commandHTML += " (slug, name, template, schema, description, backgroundColor, borderColor, shape, borderWidth) ";
    commandHTML += " VALUES(";
    commandHTML += " '"+newWordTypeSlug+"', ";
    commandHTML += " '"+newWordTypeName+"', ";
    commandHTML += " '"+newWordTypeTemplate+"', ";
    commandHTML += " '"+newWordTypeSchema+"', ";
    commandHTML += " '"+newWordTypeDescription+"', ";
    commandHTML += " '"+newWordTypeBackgroundColor+"', ";
    commandHTML += " '"+newWordTypeBorderColor+"', ";
    commandHTML += " '"+newWordTypeShape+"', ";
    commandHTML += " '"+newWordTypeBorderWidth+"' ";
    commandHTML += " )";

    console.log("makeNewWordType commandHTML: "+commandHTML)

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

export default class MakeNewWordTypePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        jQuery("#makeNewWordTypeButton").click(function(){
            makeNewWordType();
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
                        <div class="h2">Make New Word Type Page</div>

                        <div style={{marginTop:"50px"}}>
                            <div className="makeNewLeftPanel">
                            slug
                            </div>
                            <textarea id="newWordTypeSlugField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel">
                            name
                            </div>
                            <textarea id="newWordTypeNameField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel">
                            background color
                            </div>
                            <textarea id="newWordTypeBackgroundColorField" className="makeNewRightPanel">
                            </textarea>
                            #ABCDEF or grey

                            <br/>

                            <div className="makeNewLeftPanel">
                            border color
                            </div>
                            <textarea id="newWordTypeBorderColorField" className="makeNewRightPanel">
                            </textarea>
                            #ABCDEF or grey

                            <br/>

                            <div className="makeNewLeftPanel">
                            shape
                            </div>
                            <textarea id="newWordTypeShapeField" className="makeNewRightPanel">
                            </textarea>
                            circle

                            <br/>

                            <div className="makeNewLeftPanel">
                            border width
                            </div>
                            <textarea id="newWordTypeBorderWidthField" className="makeNewRightPanel">
                            </textarea>
                            3

                            <br/>

                            <div className="makeNewLeftPanel">
                            description
                            </div>
                            <textarea id="newWordTypeDescriptionField" className="makeNewRightPanel" style={{height:"50px"}}>
                            </textarea>
                            lorem ipsum

                            <br/>

                            <div className="makeNewLeftPanel">
                            template
                            </div>
                            <textarea id="newWordTypeTemplateField" className="makeNewRightPanel" style={{height:"300px"}}>
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel">
                            schema
                            </div>
                            <textarea id="newWordTypeSchemaField" className="makeNewRightPanel" style={{height:"50px"}}>
                            </textarea>

                            <br/><br/>

                            <div id="makeNewWordTypeButton" className="doSomethingButton" style={{marginLeft:"800px"}}>make new wordType</div>

                            <br/>

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
