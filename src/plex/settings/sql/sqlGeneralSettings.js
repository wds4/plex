import React, { useState } from 'react';
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/sql_leftNav2';
import sendAsync from '../../renderer.js';

const jQuery = require("jquery");

function send(sql) {
    console.log("send; sql: "+sql)
    sendAsync(sql).then((result) => this.setResponse({response: result}) );
}

export default class SQLGeneralSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var sql = " SELECT sqlite_version() ";
        sendAsync(sql).then((result) => {
            var sResult = JSON.stringify(result,null,4)
            jQuery("#sqliteQueryResultContainer").html(sResult)
            jQuery("#sqliteQueryResultContainer").val(sResult)
            var sqliteVersion = result[0]["sqlite_version()"]
            jQuery("#sqLiteVersion").html(sqliteVersion)
            jQuery("#sqLiteVersion").val(sqliteVersion)
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
                        <div class="h2">SQL General Settings</div>
                        SQLite Version: <div id="sqLiteVersion" style={{display:"inline-block"}}>result</div>
                        <br/>
                        <div id="sqliteQueryResultContainer">result</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
