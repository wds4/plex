import React from "react";
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/relationshipTypes_leftNav2.js';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

const updateCurrentRelationshipType = async () => {
    console.log("updateCurrentRelationshipType")
    var commandHTML = "";
    var currentRelationshipTypeSqlId = jQuery("#currentRelationshipTypeSqlIdField").html();
    var currentRelationshipTypeSlug = jQuery("#currentRelationshipTypeSlugField").val();
    var currentRelationshipTypeName = jQuery("#currentRelationshipTypeNameField").val();
    var currentRelationshipTypeColor = jQuery("#currentRelationshipTypeColorField").val();
    var currentRelationshipTypePolarity = jQuery("#currentRelationshipTypePolarityField").val();
    var currentRelationshipTypeWidth = jQuery("#currentRelationshipTypeWidthField").val();
    var currentRelationshipTypeDashes = jQuery("#currentRelationshipTypeDashesField").val();
    var currentRelationshipTypeDescription = jQuery("#currentRelationshipTypeDescriptionField").val();

    commandHTML += "UPDATE relationshipTypes ";
    commandHTML += " SET ";
    commandHTML += " slug='"+currentRelationshipTypeSlug+"', ";
    commandHTML += " name='"+currentRelationshipTypeName+"', ";
    commandHTML += " description='"+currentRelationshipTypeDescription+"', ";
    commandHTML += " color='"+currentRelationshipTypeColor+"', ";
    commandHTML += " polarity='"+currentRelationshipTypePolarity+"', ";
    commandHTML += " width='"+currentRelationshipTypeWidth+"', ";
    commandHTML += " dashes='"+currentRelationshipTypeDashes+"' ";
    commandHTML += " WHERE id='"+currentRelationshipTypeSqlId+"' ";

    console.log("updateCurrentRelationshipType commandHTML: "+commandHTML)

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

const populateRelationshipTypeFields = async (sqlid) => {
    var sql = " SELECT * FROM relationshipTypes WHERE id='"+sqlid+"' ";
    console.log("sql: "+sql)

    sendAsync(sql).then((result) => {
        var oRelationshipTypeData = result[0];
        var currRelationshipTypeSlug = oRelationshipTypeData.slug;
        var currRelationshipTypeName = oRelationshipTypeData.name;
        var currRelationshipTypeDescription = oRelationshipTypeData.description;
        var currRelationshipTypeColor = oRelationshipTypeData.color;
        var currRelationshipTypePolarity = oRelationshipTypeData.polarity;
        var currRelationshipTypeWidth = oRelationshipTypeData.width;
        var currRelationshipTypeDashes = oRelationshipTypeData.dashes;

        jQuery("#currentRelationshipTypeSqlIdField").html(sqlid);
        jQuery("#currentRelationshipTypeSlugField").val(currRelationshipTypeSlug);
        jQuery("#currentRelationshipTypeNameField").val(currRelationshipTypeName);
        jQuery("#currentRelationshipTypeColorField").val(currRelationshipTypeColor);
        jQuery("#currentRelationshipTypePolarityField").val(currRelationshipTypePolarity);
        jQuery("#currentRelationshipTypeWidthField").val(currRelationshipTypeWidth);
        jQuery("#currentRelationshipTypeDashesField").val(currRelationshipTypeDashes);
        jQuery("#currentRelationshipTypeDescriptionField").val(currRelationshipTypeDescription);
    })
}

export default class MakeNewRelationshipTypePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            relTypeSqlID: null
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var relTypeSqlID = this.props.match.params.relationshiptypesqlid
        this.setState({relTypeSqlID: relTypeSqlID } )

        jQuery("#updateCurrentRelationshipTypeButton").click(function(){
            updateCurrentRelationshipType();
        })

        jQuery("#deleteCurrentRelationshipTypeButton").click(function(){

        })

        populateRelationshipTypeFields(relTypeSqlID);
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Edit Existing Relationship Type Page</div>
                        <div style={{marginTop:"20px"}}>
                            <div id="updateCurrentRelationshipTypeButton" className="doSomethingButton" style={{marginLeft:"700px"}}>update this relationshipType</div>
                            <div id="deleteCurrentRelationshipTypeButton" className="doSomethingButton" style={{marginLeft:"20px"}}>delete this relationshipType (not yet functional)</div>

                            <br/>

                            <div className="makeNewLeftPanel">
                            sql ID
                            </div>
                            <div id="currentRelationshipTypeSqlIdField" className="makeNewRightPanel" style={{backgroundColor:"#EFEFEF"}}>
                            </div>

                            <br/>

                            <div className="makeNewLeftPanel">
                            slug
                            </div>
                            <textarea id="currentRelationshipTypeSlugField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel">
                            name
                            </div>
                            <textarea id="currentRelationshipTypeNameField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel">
                            color
                            </div>
                            <textarea id="currentRelationshipTypeColorField" className="makeNewRightPanel">
                            </textarea>
                            #ABCDEF, grey

                            <br/>

                            <div className="makeNewLeftPanel">
                            polarity
                            </div>
                            <textarea id="currentRelationshipTypePolarityField" className="makeNewRightPanel">
                            </textarea>
                            forward, reverse

                            <br/>

                            <div className="makeNewLeftPanel">
                            width
                            </div>
                            <textarea id="currentRelationshipTypeWidthField" className="makeNewRightPanel">
                            </textarea>
                            3

                            <br/>

                            <div className="makeNewLeftPanel">
                            dashes
                            </div>
                            <textarea id="currentRelationshipTypeDashesField" className="makeNewRightPanel">
                            </textarea>
                            false, true

                            <br/>

                            <div className="makeNewLeftPanel">
                            description
                            </div>
                            <textarea id="currentRelationshipTypeDescriptionField" className="makeNewRightPanel" style={{height:"50px"}}>
                            </textarea>
                            lorem ipsum

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
