import React from "react";
import Masthead from '../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/cgFe_conceptGraphsMainPage_leftNav2.js';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

const makeNewConceptGraph = async () => {
    console.log("makeNewConceptGraph")
    var commandHTML = "";
    var newConceptGraphSlug = jQuery("#newConceptGraphSlugField").val();
    var newConceptGraphTitle = jQuery("#newConceptGraphTitleField").val();
    var newConceptGraphTableName = jQuery("#newConceptGraphTableNameField").val();
    var newConceptGraphMainSchemaSlug = jQuery("#newConceptGraphMainSchemaSlugField").val();
    var newConceptGraphDescription = jQuery("#newConceptGraphDescriptionField").val();

    commandHTML += "INSERT OR IGNORE INTO myConceptGraphs";
    commandHTML += " (slug, title, tableName, mainSchema_slug, description) ";
    commandHTML += " VALUES(";
    commandHTML += " '"+newConceptGraphSlug+"', ";
    commandHTML += " '"+newConceptGraphTitle+"', ";
    commandHTML += " '"+newConceptGraphTableName+"', ";
    commandHTML += " '"+newConceptGraphMainSchemaSlug+"', ";
    commandHTML += " '"+newConceptGraphDescription+"' ";
    commandHTML += " )";

    console.log("makeNewConceptGraph commandHTML: "+commandHTML)

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

export default class MakeNewConceptGraphPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        jQuery("#makeNewConceptGraphButton").click(function(){
            makeNewConceptGraph();
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Make New Concept Graph</div>

                        <div style={{marginTop:"50px"}}>
                            <div className="makeNewLeftPanel">
                            slug
                            </div>
                            <textarea id="newConceptGraphSlugField" className="makeNewRightPanel">
                            </textarea>
                            foo

                            <br/>

                            <div className="makeNewLeftPanel">
                            title
                            </div>
                            <textarea id="newConceptGraphTitleField" className="makeNewRightPanel">
                            </textarea>
                            Concept Graph: Foo

                            <br/>

                            <div className="makeNewLeftPanel">
                            tableName
                            </div>
                            <textarea id="newConceptGraphTableNameField" className="makeNewRightPanel">
                            </textarea>
                            myConceptGraph_foo

                            <br/>

                            <div className="makeNewLeftPanel">
                            mainSchema_slug
                            </div>
                            <textarea id="newConceptGraphMainSchemaSlugField" className="makeNewRightPanel">
                            </textarea>
                            mainSchemaForConceptGraph

                            <br/>

                            <div className="makeNewLeftPanel">
                            description
                            </div>
                            <textarea id="newConceptGraphDescriptionField" className="makeNewRightPanel" style={{height:"50px"}}>
                            </textarea>
                            lorem ipsum

                            <br/><br/>

                            <div id="makeNewConceptGraphButton" className="doSomethingButton" style={{marginLeft:"320px"}}>make new Concept Graph</div>

                            <div style={{display:"none"}}>
                                <div id="sqlCommandContainer" >sqlCommandContainer</div>
                                <br/>
                                <div id="sqlResultContainer_mNWTP" >sqlResultContainer_mNWTP</div>
                            </div>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
