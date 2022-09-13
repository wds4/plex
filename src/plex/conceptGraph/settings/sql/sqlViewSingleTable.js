import React from "react";
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/sqlSingleTable_leftNav2';
import sendAsync from '../../../renderer.js';
// import send from '../../../conceptGraph/settings/sql/sqlFunctions.js'

const jQuery = require("jquery");

export default class SQLViewSingleTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableName: 'tableName not yet defined',
            tableLinks: []
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var tableName = this.props.match.params.tablename
        this.setState({tableName: tableName } )

        var sql = " SELECT * FROM sqlite_schema WHERE name='"+tableName+"' ";
        sendAsync(sql).then((result) => {
            var aTables = result;
            var numTables = aTables.length;
            for (var t=0;t<numTables;t++) {
                var nextTable_id = aTables[t].id;
                var nextTable_name = aTables[t].name;
                var nextTable_sql= aTables[t].sql;
                var nextTable_rootpage = aTables[t].rootpage;

                nextTable_sql = nextTable_sql.replace(/\n/g,"")
                var firstParen = nextTable_sql.split(" (")
                var firstParenA = firstParen[1];
                var secondParen = firstParenA.split(" )");
                var secondParenA = secondParen[0];
                var breakByComma = secondParenA.split(",")
                var numCols = breakByComma.length;

                var tableDataHTML = "";
                tableDataHTML += "<div id=renameTableButton class=doSomethingButton >make SQL command to rename table: </div>";
                tableDataHTML += "<textarea id=newTableNameInput style=display:inline-block;width:300px;margin-left:10px;></textarea>";
                tableDataHTML += "<br>";
                tableDataHTML += "<div id=dropTableButton class=doSomethingButton >make SQL command to DROP table: </div>";
                tableDataHTML += "<br><br>";
                tableDataHTML += "number of columns: "+numCols;
                tableDataHTML += "<br><br>";
                for (var c=0;c<numCols;c++) {
                    var nextColInfo = breakByComma[c];

                    var nextColInfoSplit = nextColInfo.split(' ');
                    var numSplits = nextColInfoSplit.length;
                    var nextColName = "";
                    var remainder = "";
                    for (var s=0;s<numSplits;s++) {
                        var nextSplat = nextColInfoSplit[s]
                        console.log("nextTable_name: "+nextTable_name+"; s: "+s+"; nextSplat: ->"+nextSplat+"<-")
                        if ((!nextColName)&&(nextSplat)) {
                            nextColName = nextSplat;
                        } else {
                            remainder += nextSplat+" ";
                        }
                    }
                    tableDataHTML+= "make SQL command to: ";
                    tableDataHTML+= "<div data-columnname='"+nextColName+"' data-colnum="+c+" id=changeNameCommandButton_"+c+" class='doSomethingButton changeNameCommandButton' >change name</div>";
                    tableDataHTML+= "<div data-columnname='"+nextColName+"' data-colnum="+c+" id=dropColumnCommandButton_"+c+" class='doSomethingButton dropColumnCommandButton' >DROP column</div>";
                    tableDataHTML+= "<textarea id='colNameInput_"+c+"' style=display:inline-block;width:300px;margin-left:10px; >"+nextColName+"</textarea>";
                    tableDataHTML+= "<div style=display:inline-block;width:300px;>"+remainder+"</div>";
                    tableDataHTML+= "<br>";
                }
                tableDataHTML += "<div id=addNewCol class=doSomethingButton >make SQL command to add new column</div>";
                tableDataHTML += "<textarea id=newColNameInput style=display:inline-block;width:300px;margin-left:10px;></textarea>";
                tableDataHTML += "<select id=newColDataTypeSelector >";
                  tableDataHTML += "<option>TEXT</option>";
                  tableDataHTML += "<option>INTEGER</option>";
                  tableDataHTML += "<option>INTEGER PRIMARY KEY</option>";
                tableDataHTML += "</select>";

                tableDataHTML += "<select id=newColDefaultSelector >";
                  tableDataHTML += "<option>NULL</option>";
                  tableDataHTML += "<option>NOT NULL</option>";
                  tableDataHTML += "<option>USE DEFAULT</option>";
                tableDataHTML += "</select>";

                tableDataHTML += "UNIQUE?";
                tableDataHTML += "<select id=newColUniqueSelector >";
                  tableDataHTML += "<option>NO</option>";
                  tableDataHTML += "<option>YES</option>";
                tableDataHTML += "</select>";
                tableDataHTML += " default: <textarea id=newColDefaultInput style=display:inline-block;width:300px;margin-left:10px;></textarea>";

                jQuery("#tableInfoContainer").html(tableDataHTML)
                jQuery("#renameTableButton").click(function(){
                    var newTableName = jQuery("#newTableNameInput").val();
                    var newCommand = ""
                    newCommand += " ALTER TABLE "+tableName;
                    newCommand += " RENAME TO "+newTableName;
                    jQuery("#sqlCommand").html(newCommand)
                    jQuery("#sqlCommand").val(newCommand)
                })
                jQuery("#dropTableButton").click(function(){
                    var newCommand = ""
                    newCommand += " DROP TABLE IF EXISTS "+tableName;
                    jQuery("#sqlCommand").html(newCommand)
                    jQuery("#sqlCommand").val(newCommand)
                })
                jQuery("#addNewCol").click(function(){
                    var newColName = jQuery("#newColNameInput").val()
                    var newColDataType = jQuery("#newColDataTypeSelector option:selected").val()
                    var newColDefault = jQuery("#newColDefaultSelector option:selected").val()
                    var newColUnique = jQuery("#newColUniqueSelector option:selected").val()
                    var newColDefaultInput = jQuery("#newColDefaultInput").val()
                    var newCommand = ""
                    newCommand += " ALTER TABLE "+tableName;
                    newCommand += " ADD COLUMN "+newColName
                    newCommand += " "+newColDataType
                    if (newColDataType != "INTEGER PRIMARY KEY") {
                        if ( (newColDefault=="NULL") || (newColDefault=="NOT NULL") ) {
                            newCommand += " "+newColDefault
                        } else {
                            newCommand += " '"+newColDefaultInput+"' ";
                        }
                        if (newColUnique=="YES") {
                            newCommand += " UNIQUE"
                        }
                    }
                    jQuery("#sqlCommand").html(newCommand)
                    jQuery("#sqlCommand").val(newCommand)
                })
                jQuery(".changeNameCommandButton").click(function(){
                    var thisCurrentColName = jQuery(this).data("columnname");
                    var thisCurrentColNum = jQuery(this).data("colnum");
                    var newColName = jQuery("#colNameInput_"+thisCurrentColNum).val();
                    var newCommand = ""
                    newCommand += " ALTER TABLE "+tableName;
                    newCommand += " RENAME COLUMN "+thisCurrentColName;
                    newCommand += " TO "+newColName;
                    jQuery("#sqlCommand").html(newCommand)
                    jQuery("#sqlCommand").val(newCommand)
                })
                jQuery(".dropColumnCommandButton").click(function(){
                    var thisCurrentColName = jQuery(this).data("columnname");
                    var thisCurrentColNum = jQuery(this).data("colnum");
                    var newCommand = ""
                    newCommand += " ALTER TABLE "+tableName;
                    newCommand += " DROP COLUMN "+thisCurrentColName;
                    jQuery("#sqlCommand").html(newCommand)
                    jQuery("#sqlCommand").val(newCommand)
                })

                var oTableData = aTables[t];
                var sTableData = JSON.stringify(oTableData,null,4)

                var oTableData = {};
                oTableData.tablename = nextTable_name;
                oTableData.sql = nextTable_sql;
                this.state.tableLinks.push(oTableData)
                this.forceUpdate();
            }
        });
        jQuery("#executeSqlCommandButton").click( function(){
            var sql = jQuery("#sqlCommand").val()
            console.log("sql: "+sql)
            sendAsync(sql).then((result) => {
                var sResult = JSON.stringify(result,null,4)
                jQuery("#sqlResultContainer").html(sResult)
                jQuery("#sqlResultContainer").val(sResult)
            })
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
                        <div class="h2">{this.state.tableName}</div>

                        <div id="tableInfoContainer">table info </div>

                        <textarea id="sqlCommand" style={{width:"75%",height:"60px"}}>sql command</textarea>
                        <br/>
                        <div id="executeSqlCommandButton" className="doSomethingButton">execute SQL command</div>
                        SQL Result:<br/>
                        <div id="sqlResultContainer" >result</div>

                        <br/><br/><hr/><br/>
                        SQL command to create this table:<br/>
                        <div>
                        {this.state.tableLinks.map(link => (
                            <div style={{width:"70%"}}>
                              {link.sql}
                            </div>
                        ))}
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
