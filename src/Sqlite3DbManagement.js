import React, { useState } from 'react';
import { Link } from "react-router-dom";
import * as Constants from './conceptGraphMasthead.js';
import LeftNavbarHelloWorld from './LeftNavbar_HelloWorld';
import sendAsync from './renderer';
import * as Sqlite3Constants from './lib/sqlite3/sqlite3-constants'; 

const createTableCommands_obj = Sqlite3Constants.createTableCommands;
const defaultTableList_arr = Sqlite3Constants.defaultTableList_arr;
const insertDefaultDataCommands_obj = Sqlite3Constants.insertDefaultDataCommands;
function Sqlite3DbManagement() {

    const [message, setMessage] = useState('SELECT * FROM sqlite_master');
    const [response, setResponse] = useState();

    function send(sql) {
        // var sql1 = " SELECT * FROM myConceptGraphs  ";
        console.log("send; sql: "+sql)
        sendAsync(sql).then((result) => setResponse(result));
    }

    function showTableInfo(clickedTableName) {
        console.log("showTableInfo: "+clickedTableName)
        var sql = document.getElementById("sql_showTableInfo_"+clickedTableName).value;
        console.log("showTableInfo, sql: "+sql)
        send(sql);
    }

    function dropTable(clickedTableName) {
        console.log("dropTable: "+clickedTableName)
        var sql = document.getElementById("sql_dropTable_"+clickedTableName).value;
        console.log("dropTable, sql: "+sql)
        send(sql);
    }

    const [message1, setMessage1] = useState('SELECT * FROM sqlite_master WHERE type="table" ');
    const [response1, setResponse1] = useState();

    function createTable(tableName) {
        // var tableName = this.getAttribute("data-tablename");
        var sql = createTableCommands_obj[tableName];
        console.log("createTable; tableName: "+tableName)
        console.log("sql: "+sql)
        send(sql);
    }

    function insertDefaultData(tableName) {
        // var tableName = this.getAttribute("data-tablename");
        var sql = insertDefaultDataCommands_obj[tableName];
        console.log("insertDefaultData; tableName: "+tableName)
        console.log("sql: "+sql)
        send(sql);
    }

    function processResponse() {
        // sendAsync(sql).then((result1) => setResponse(result1));
        var nextHTML = "";

        var numTables = response.length;
        for (var t=0;t<numTables;t++) {
            var nextTable_obj = response[t];
            var nextTable_tableName = nextTable_obj.tbl_name
            var sql_queryThisTable = " SELECT * FROM "+ nextTable_obj.tbl_name;
            var sql_dropThisTable = " DROP TABLE IF EXISTS "+ nextTable_obj.tbl_name;
            console.log("nextTable_tableName: "+nextTable_tableName)
            nextHTML += "<div class='tableInfoContainer' >";
                nextHTML += "<div class='leftCol_activeTables' >";
                nextHTML += nextTable_tableName;
                nextHTML += "</div>";

                nextHTML += "<br>";

                nextHTML += '<button type="button" data-action="insertDefaultData" data-tablename="'+nextTable_tableName+'" id="insertDefaultData_'+nextTable_tableName+'" > ';
                nextHTML += 'Insert Default Data';
                nextHTML += '</button>';

                nextHTML += "<br>";

                nextHTML += '<textarea id="sql_dropTable_'+nextTable_tableName+'" type="text" style="width:500px" ';
                nextHTML += ' value="'+sql_dropThisTable+'" ';
                nextHTML += ' >';
                nextHTML += sql_dropThisTable;
                nextHTML += ' </textarea> ';
                nextHTML += '<button type="button" data-action="dropTable" data-tablename="'+nextTable_tableName+'" id="dropTable_'+nextTable_tableName+'" > ';
                nextHTML += 'Drop Table';
                nextHTML += '</button>';

                nextHTML += "<br>";

                nextHTML += '<textarea id="sql_showTableInfo_'+nextTable_tableName+'" type="text" style="width:500px" ';
                nextHTML += ' value="'+sql_queryThisTable+'" ';
                nextHTML += ' >';
                nextHTML += sql_queryThisTable;
                nextHTML += ' </textarea> ';
                nextHTML += '<button type="button" data-action="showTableInfo" data-tablename="'+nextTable_tableName+'" id="showRows_'+nextTable_tableName+'" > ';
                nextHTML += 'Show Table Info';
                nextHTML += '</button>';
            nextHTML += "</div>";
        }
        nextHTML += "</div>";
        document.getElementById("activeTableList").innerHTML = nextHTML;
        // document.getElementById("activeTableList").val = nextHTML;

        for (var t=0;t<numTables;t++) {
            var nextTable_obj = response[t];
            var nextTable_tableName = nextTable_obj.tbl_name
            var e1 = document.getElementById("showRows_"+nextTable_tableName);
            e1.addEventListener('click', function(event){
                var clickedTableName = this.getAttribute("data-tablename");
                showTableInfo(clickedTableName);
            });
            var e2 = document.getElementById("dropTable_"+nextTable_tableName);
            e2.addEventListener('click', function(event){
                var clickedTableName = this.getAttribute("data-tablename");
                dropTable(clickedTableName);
            });
        }
    }

    return (
        <div className="Sqlite3DbManagement" style={{height:"100%"}} >
          <div className="mainBody_wrapper" >
            <fieldset className="mainBody" >
                <LeftNavbarHelloWorld />
                <div className="mainPanel" >
                    {Constants.conceptGraphMasthead}
                    <div class="h2">SQLite3 Database Management</div>
                    <header className="App-header">
                        <h1>
                            Standalone application with Electron, React, and
                            SQLite stack.
                        </h1>
                    </header>
                    <article>
                        <div className="h2" >Tables</div>
                        <textarea
                            type="text"
                            style={{width:"800px"}}
                            value={createTableCommands_obj.wordTemplatesByWordType}
                            onChange={({ target: { value } }) => setMessage(value)}
                        >
                        </textarea>
                        <button type="button" onClick={() => send(createTableCommands_obj.wordTemplatesByWordType)}>
                            Send
                        </button>

                        <p>
                            Default tables:
                        </p>


                        {defaultTableList_arr.map((option) => (
                          <div>
                            <div className="leftCol_activeTables createTable" >{option.tableName}</div>
                            <div className="doSomethingButton" onClick={() => createTable(option.tableName)} >Create</div>
                            <div className="doSomethingButton" onClick={() => insertDefaultData(option.tableName)} >Insert Default Data</div>
                          </div>
                        ))}


                        <p>
                            1. Show all tables of type: table (as opposed to: index).
                        </p>
                        <input
                            type="text"
                            style={{width:"800px"}}
                            value={message1}
                            onChange={({ target: { value } }) => setMessage1(value)}
                        />
                        <button type="button" onClick={() => send(message1)}>
                            Send
                        </button>
                        <button type="button" onClick={() => processResponse()}>
                            Process response
                        </button>
                        <div id="activeTableList"></div>

                        <p>
                            Say <i>ping</i> to the main process.
                        </p>
                        <input
                            type="text"
                            style={{width:"800px"}}
                            value={message}
                            onChange={({ target: { value } }) => setMessage(value)}
                        />
                        <button type="button" onClick={() => send(message)}>
                            Send
                        </button>
                        <br />
                        <p>Main process responses:</p>
                        <pre>
                            {(response && JSON.stringify(response, null, 2)) ||
                                'No query results yet!'}
                        </pre>
                    </article>

                </div>
            </fieldset>
          </div>
        </div>
    );
}

export default Sqlite3DbManagement;
