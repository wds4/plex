import React from "react";
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/sql_leftNav2';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

function updateNewSqlCommands(numNewCols) {
    var newTableName = jQuery("#newTableNameInput").val();
    var newSqlCommand = "";
    newSqlCommand += "CREATE TABLE "+newTableName+" ( ";
    newSqlCommand += "\n";
    for (var c=0;c<numNewCols;c++) {
        var nextColumnName = jQuery("#newColName_"+c).val();
        var nextColumnDataType = jQuery("#dataTypeSelector_"+c+" option:selected").val();
        var nextColumnUnique = jQuery("#uniqueSelector_"+c+" option:selected").val();
        var nextColumnDefault = jQuery("#defaultSelector_"+c+" option:selected").val();
        var nextColumnDefaultInput = jQuery("#newColDefault_"+c).val();
        newSqlCommand += " "+nextColumnName;
        newSqlCommand += " "+nextColumnDataType;
        if (nextColumnDataType != "INTEGER PRIMARY KEY") {
            if ((nextColumnDefault=="NULL")||(nextColumnDefault=="NOT NULL")) {
                newSqlCommand += " "+nextColumnDefault;
            }
            if (nextColumnDefault=="USE DEFAULT") {
                newSqlCommand += " '"+nextColumnDefaultInput+"' ";
            }
            if (nextColumnUnique=="YES") {
                newSqlCommand += " UNIQUE";
            }
        }
        if ((c+1) < numNewCols) {
            newSqlCommand += ",";
        }
        newSqlCommand += " \n";
    }
    newSqlCommand += ") ";
    jQuery("#newTableSQLCommand").html(newSqlCommand)
    jQuery("#newTableSQLCommand").val(newSqlCommand)
}

export default class SQLMakeANewTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        jQuery("#runSqlButton").click(function(){
            var sql = jQuery("#newTableSQLCommand").val();
            console.log("sql: "+sql)
            sendAsync(sql).then((result) => {
                var sResult = JSON.stringify(result,null,4)
                jQuery("#sqlResultContainer").html(sResult)
                jQuery("#sqlResultContainer").val(sResult)
            })
        })

        var numNewCols = 0;
        jQuery("#addColumnButton").click(function(){
            var sqlCommand = jQuery("#newTableSQLCommand").val();
            console.log("sqlCommand: "+sqlCommand)
            var newColumnHTML = "";
            newColumnHTML += "<div style='padding:5px;border:1px solid grey;vertical-align:top' >";
                newColumnHTML += "column number "+numNewCols+"<br>";
                newColumnHTML += "<textarea id=newColName_"+numNewCols+" style=width:200px; >new col name</textarea>";

                newColumnHTML += "<select id=dataTypeSelector_"+numNewCols+" >";
                newColumnHTML += "<option>TEXT</option>";
                newColumnHTML += "<option>INTEGER</option>";
                newColumnHTML += "<option>INTEGER PRIMARY KEY</option>";
                newColumnHTML += "</select>";

                newColumnHTML += "<select id=defaultSelector_"+numNewCols+" >";
                newColumnHTML += "<option>NULL</option>";
                newColumnHTML += "<option>NOT NULL</option>";
                newColumnHTML += "<option>USE DEFAULT</option>";
                newColumnHTML += "</select>";

                newColumnHTML += "UNIQUE?";
                newColumnHTML += "<select id=uniqueSelector_"+numNewCols+" >";
                newColumnHTML += "<option>NO</option>";
                newColumnHTML += "<option>YES</option>";
                newColumnHTML += "</select>";

                newColumnHTML += " default: <textarea id=newColDefault_"+numNewCols+" style=width:200px; >default</textarea>";
            newColumnHTML += "</div>";

            jQuery("#newColumnsContainer").append(newColumnHTML)
            numNewCols++;
        })
        jQuery("#newTableInputContainer").change(function(){
            updateNewSqlCommands(numNewCols);
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
                        <div class="h2">SQL Make a New Table</div>
                        <div id="newTableInputContainer" >
                            new table name:
                            <textarea id="newTableNameInput" style={{display:"inline-block",width:"300px",marginLeft:"10px"}} ></textarea>
                            <br/>
                            <div id="newColumnsContainer" ></div>
                            <div id="addColumnButton" className="doSomethingButton">+</div>
                        </div>
                        SQL command:
                        <textarea id="newTableSQLCommand" style={{display:"inline-block",width:"600px",height:"100px",marginLeft:"10px"}} >new table SQL command</textarea>
                        <br/>
                        <div id="runSqlButton" className="doSomethingButton">Run SQL Command</div>
                        <br/>
                        SQL Result:<br/>
                        <div id="sqlResultContainer" >result</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
