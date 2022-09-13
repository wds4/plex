import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleWord_leftNav2.js';
import sendAsync from '../../../../renderer.js'; 

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

export default class SingleWordMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wordSqlID: null
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var wordSqlID = this.props.match.params.wordsqlid;
        if (wordSqlID=="current") {
            wordSqlID = window.currentWordSqlID;
        } else {
             window.currentWordSqlID = wordSqlID;
        }
        this.setState({wordSqlID: wordSqlID } )

        var currentConceptGraphSqlID = window.currentConceptGraphSqlID;
        var currentConceptGraphTableName = window.aLookupConceptGraphInfoBySqlID[currentConceptGraphSqlID].tableName;

        var sql = " SELECT * FROM "+currentConceptGraphTableName+" WHERE id='"+wordSqlID+"' ";
        console.log("sql: "+sql)
        sendAsync(sql).then( async (result) => {
            var oWordData = result[0];
            var sRawFile = oWordData.rawFile;
            jQuery("#currentWordRawFile").html(sRawFile);
            jQuery("#currentWordRawFile").val(sRawFile);
        });
        jQuery("#updateWordButton").click(function(){
            var sRawFile = jQuery("#currentWordRawFile").val();
            var sql = " UPDATE "+currentConceptGraphTableName+" SET rawFile=`"+sRawFile+"` WHERE id='"+wordSqlID+"' ";
            console.log("sql: "+sql)
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
                        <div class="h2" >Single Word Main Page</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div style={{marginLeft:"20px"}} >
                        sql ID: {this.state.wordSqlID}
                        <br/>
                        <div id="updateWordButton" className="doSomethingButton">UPDATE</div>
                        <br/>
                        <textarea id="currentWordRawFile" style={{width:"600px",height:"800px"}}>currentWordRawFile</textarea>
                        </div>
                    </div>

                </fieldset>
            </>
        );
    }
}
