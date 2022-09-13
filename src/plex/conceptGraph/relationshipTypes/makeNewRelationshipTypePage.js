import React from "react";
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/relationshipTypes_leftNav2.js';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

const makeNewRelationshipType = async () => {
    console.log("makeNewRelationshipType")
    var commandHTML = "";
    var newRelationshipTypeSlug = jQuery("#newRelationshipTypeSlugField").val();
    var newRelationshipTypeName = jQuery("#newRelationshipTypeNameField").val();
    var newRelationshipTypeColor = jQuery("#newRelationshipTypeColorField").val();
    var newRelationshipTypePolarity = jQuery("#newRelationshipTypePolarityField").val();
    var newRelationshipTypeWidth = jQuery("#newRelationshipTypeWidthField").val();
    var newRelationshipTypeDashes = jQuery("#newRelationshipTypeDashesField").val();
    var newRelationshipTypeDescription = jQuery("#newRelationshipTypeDescriptionField").val();

    commandHTML += "INSERT OR IGNORE INTO relationshipTypes";
    commandHTML += " (slug, name, description, color, polarity, width, dashes) ";
    commandHTML += " VALUES(";
    commandHTML += " '"+newRelationshipTypeSlug+"', ";
    commandHTML += " '"+newRelationshipTypeName+"', ";
    commandHTML += " '"+newRelationshipTypeDescription+"', ";
    commandHTML += " '"+newRelationshipTypeColor+"', ";
    commandHTML += " '"+newRelationshipTypePolarity+"', ";
    commandHTML += " '"+newRelationshipTypeWidth+"', ";
    commandHTML += " '"+newRelationshipTypeDashes+"' ";
    commandHTML += " )";

    console.log("makeNewRelationshipType commandHTML: "+commandHTML)

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

export default class MakeNewRelationshipTypePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        jQuery("#makeNewRelationshipTypeButton").click(function(){
            makeNewRelationshipType();
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
                        <div class="h2">Make New Relationship Type</div>

                        <div style={{marginTop:"50px"}}>
                            <div className="makeNewLeftPanel">
                            slug
                            </div>
                            <textarea id="newRelationshipTypeSlugField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel">
                            name
                            </div>
                            <textarea id="newRelationshipTypeNameField" className="makeNewRightPanel">
                            </textarea>

                            <br/>

                            <div className="makeNewLeftPanel">
                            color
                            </div>
                            <textarea id="newRelationshipTypeColorField" className="makeNewRightPanel">
                            </textarea>
                            #ABCDEF, grey

                            <br/>

                            <div className="makeNewLeftPanel">
                            polarity
                            </div>
                            <textarea id="newRelationshipTypePolarityField" className="makeNewRightPanel">
                            </textarea>
                            forward, reverse

                            <br/>

                            <div className="makeNewLeftPanel">
                            width
                            </div>
                            <textarea id="newRelationshipTypeWidthField" className="makeNewRightPanel">
                            </textarea>
                            3

                            <br/>

                            <div className="makeNewLeftPanel">
                            dashes
                            </div>
                            <textarea id="newRelationshipTypeDashesField" className="makeNewRightPanel">
                            </textarea>
                            false, true

                            <br/>

                            <div className="makeNewLeftPanel">
                            description
                            </div>
                            <textarea id="newRelationshipTypeDescriptionField" className="makeNewRightPanel" style={{height:"50px"}}>
                            </textarea>
                            lorem ipsum

                            <br/><br/>

                            <div id="makeNewRelationshipTypeButton" className="doSomethingButton" style={{marginLeft:"800px"}}>make new relationshipType</div>

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
