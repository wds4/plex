import React from 'react';
import { NavLink, Link, Route, Router, useHistory } from "react-router-dom";
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/sql_leftNav2';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

function send(sql) {
    console.log("send; sql: "+sql)
    sendAsync(sql).then((result) => this.setResponse({response: result}) );
}

export default class SQLTables extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableLinks: []
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var sql1 = " SELECT * FROM sqlite_schema WHERE type='table' ";
        sendAsync(sql1).then((result1) => {
            console.log("sql1: "+sql1)
            var sResult1 = JSON.stringify(result1,null,4)
            console.log("sResult1: "+sResult1)
            var aTables = result1;
            var numTables = aTables.length;
            for (var t=0;t<numTables;t++) {
                var nextTable_id = aTables[t].id;
                var nextTable_name = aTables[t].name;
                var nextTable_sql= aTables[t].sql;
                var nextTable_rootpage = aTables[t].rootpage;

                var oTableData = aTables[t];
                var sTableData = JSON.stringify(oTableData,null,4)
                console.log("sTableData: "+sTableData)

                var oTableData = {};
                oTableData.pathname = "/SQLViewSingleTablePage/"+nextTable_name;
                oTableData.linkfromtablename = 'linkFrom_'+nextTable_name;
                oTableData.tablename = nextTable_name;
                oTableData.sql = nextTable_sql;
                // cGlinks2.push(cGlinks_obj)
                this.state.tableLinks.push(oTableData)
                this.forceUpdate();
            }
        });
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">SQL Tables</div>

                        <div>
                        {this.state.tableLinks.map(link => (
                            <div id={link.linkfromtablename} >
                                <Link class='navButton'
                                  to={link.pathname}
                                >{link.tablename}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div style={{display:"none"}}>
                        {this.state.tableLinks.map(link => (
                            <div >
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
