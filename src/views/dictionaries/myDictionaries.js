import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { NavLink, Link, Route, useHistory } from "react-router-dom";
import * as Constants from '../../conceptGraphMasthead.js';
import LeftNavbar from '../../LeftNavbar';
import sendAsync from '../../renderer';
const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

function makeTable(dDataSet) {
    var dtable = jQuery('#table_myDictionaries').DataTable({
        data: dDataSet,
        pageLength: 25,
        "columns": [
          {
              "class":          'details-control',
              "orderable":      false,
              "data":           null,
              "defaultContent": ''
          },
          { visible: false },
          { visible: false },
          { visible: false },
          { },
          { },
          { visible: false },
          { visible: false },
          { visible: false },
          { visible: false },
          { visible: false },
          { visible: false }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip'
    });
}

function send(sql) {
    console.log("send; sql: "+sql)
    sendAsync(sql).then((result) => this.setResponse({response: result}) );
}


export default class MyDictionaries extends React.Component {
    constructor(props) {
         super(props);
         this.state = {
             count: 0,
             message: 'SELECT * FROM sqlite_master',
             response: null
         };
         var testLink2 = "<Link class='navButton' to='/'>test link</Link>";
    }

    componentDidMount() {
        var sql = " SELECT * FROM myDictionaries ";
        //
        var testLink = "<Link class='navButton' to='/'>test link</Link>";
        sendAsync(sql).then((result) => {
              this.setState({response: JSON.stringify(result,null,4) } )
              var dDataSet = [];
              var dictionaries_arr = result;
              var numDictionaries = dictionaries_arr.length;
              console.log("numDictionaries: "+numDictionaries)
              for (var w=0;w<numDictionaries;w++) {
                  var nextDictionary_id = dictionaries_arr[w].id;
                  var nextDictionary_slug = dictionaries_arr[w].slug;
                  var nextDictionary_title = dictionaries_arr[w].title;
                  var nextDictionary_tableName = dictionaries_arr[w].tableName;
                  var nextDictionary_description = dictionaries_arr[w].description;
                  var nextDictionary_rootSchemaIPNS = dictionaries_arr[w].rootSchemaIPNS;
                  var nextDictionary_numberOfWords = dictionaries_arr[w].numberOfWords;
                  var nextDictionary_conceptGraphList= dictionaries_arr[w].conceptGraphList;
                  var nextDictionary_arr = ["",w,nextDictionary_id,
                      nextDictionary_description,
                      nextDictionary_title,
                      nextDictionary_tableName,
                      nextDictionary_slug,
                      nextDictionary_rootSchemaIPNS,
                      nextDictionary_numberOfWords,
                      nextDictionary_conceptGraphList,
                      nextDictionary_title,
                      nextDictionary_tableName
                    ];
                  dDataSet.push(nextDictionary_arr);
              }
              makeTable(dDataSet);
        });
    }

    render() {
      return (
        <>
          <fieldset className="mainBody" >
              <LeftNavbar />
              <div className="mainPanel" >
                  {Constants.conceptGraphMasthead}
                  <div class="h2">My Dictionaries</div>

                  <table id="table_myDictionaries" className="display" style={{color:"black",width:"95%"}} >
                      <thead>
                          <tr>
                              <th></th>
                  	        	<th>r</th>
                	            <th>id</th>
                              <th>description</th>
                	            <th>title</th>
                              <th>table name</th>
                	            <th>slug</th>
                	            <th>root schema IPNS</th>
                              <th>numberOfWords</th>
                              <th>conceptGraphList</th>
                              <th>title</th>
                              <th>table name</th>
                          </tr>
                      </thead>
                      <tfoot>
                          <tr>
                              <th></th>
                  	        	<th>r</th>
                	            <th>id</th>
                              <th>description</th>
                	            <th>title</th>
                              <th>table name</th>
                	            <th>slug</th>
                	            <th>root schema IPNS</th>
                              <th>numberOfWords</th>
                              <th>conceptGraphList</th>
                              <th>title</th>
                              <th>table name</th>
                          </tr>
                      </tfoot>
                  </table>
                  <Link class='navButton'
                    to={{
                          pathname: "/ViewMyDictionary/myDictionary_pga",
                          aboutProps:{
                              tablename:'myDictionary_pga'
                          },
                          tablename: 'myDictionary_pga',
                          state: {tablename:'myDictionary_pga'}
                      }}
                  >PGA table</Link>
                  <br/>
                  <Link class='navButton'
                    to={{
                          pathname: "/ViewMyDictionary/myDictionary_temporary",
                          aboutProps:{
                              tablename:'myDictionary_temporary'
                          },
                          tablename: 'myDictionary_temporary',
                          state: {tablename:'myDictionary_temporary'}
                      }}
                  >temporary table</Link>
              </div>
          </fieldset>
        </>
      );
    }
}
