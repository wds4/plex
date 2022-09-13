import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { NavLink, Link, Route, useHistory } from "react-router-dom";
import * as Constants from '../../conceptGraphMasthead.js';
import LeftNavbar from '../../LeftNavbar';
import sendAsync from '../../renderer';
const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

function makeTable(dDataSet) {
    var dtable = jQuery('#table_myConceptGraphs').DataTable({
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
            { visible: false }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip'
    });
}

function send(sql) {
    console.log("send; sql: "+sql)
    sendAsync(sql).then((result) => this.setResponse({response: result}) );
}



export default class MyConceptGraphs extends React.Component {
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
        var sql = " SELECT * FROM myConceptGraphs ";
        //
        var testLink = "<Link class='navButton' to='/'>test link</Link>";
        sendAsync(sql).then((result) => {
              this.setState({response: JSON.stringify(result,null,4) } )
              var dDataSet = [];
              var conceptGraphs_arr = result;
              var numConceptGraphs = conceptGraphs_arr.length;
              console.log("numConceptGraphs: "+numConceptGraphs)
              for (var w=0;w<numConceptGraphs;w++) {
                  var nextConceptGraph_id = conceptGraphs_arr[w].id;
                  var nextConceptGraph_slug = conceptGraphs_arr[w].slug;
                  var nextConceptGraph_title = conceptGraphs_arr[w].title;
                  var nextConceptGraph_tableName = conceptGraphs_arr[w].tableName;
                  var nextConceptGraph_description = conceptGraphs_arr[w].description;
                  var nextConceptGraph_rootSchemaIPNS = conceptGraphs_arr[w].rootSchemaIPNS;
                  var nextConceptGraph_refDictionary = conceptGraphs_arr[w].referenceDictionary_tableName;
                  var nextConceptGraph_gDDKeywords = conceptGraphs_arr[w].globalDynamicData_keywords;
                  var nextConceptGraph_rawFile = conceptGraphs_arr[w].rawFile;
                  var nextConceptGraph_arr = ["",w,nextConceptGraph_id,
                      nextConceptGraph_description,
                      nextConceptGraph_title,
                      nextConceptGraph_tableName,
                      nextConceptGraph_slug,
                      nextConceptGraph_rootSchemaIPNS,
                      nextConceptGraph_title,
                      nextConceptGraph_refDictionary,
                      nextConceptGraph_tableName
                    ];
                  dDataSet.push(nextConceptGraph_arr);
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
                    <div class="h2">My Concept Graphs</div>
                    <div className="tableContainer" >
                      <table id="table_myConceptGraphs" className="display" style={{color:"black",width:"95%"}} >
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
                                  <th>title</th>
                                  <th>reference dictionary (slug)</th>
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
                                  <th>title</th>
                                  <th>reference dictionary (slug)</th>
                                  <th>table name</th>
                              </tr>
                          </tfoot>
                      </table>

                      <Link class='navButton'
                        to={{
                              pathname: "/ViewMyConceptGraph/myConceptGraph_pga",
                              aboutProps:{
                                  tablename:'myConceptGraph_pga'
                              },
                              tablename: 'myConceptGraph_pga',
                              state: {tablename:'myConceptGraph_pga'}
                          }}
                      >PGA table</Link>
                      <br/>
                      <Link class='navButton'
                        to={{
                              pathname: "/ViewMyConceptGraph/myConceptGraph_temporary",
                              aboutProps:{
                                  tablename:'myConceptGraph_temporary'
                              },
                              tablename: 'myConceptGraph_temporary',
                              state: {tablename:'myConceptGraph_temporary'}
                          }}
                      >Temporary table</Link>
                      <br/>
                      <Link class='navButton'
                        to={{
                              pathname: "/ViewMyConceptGraph/myConceptGraph_organisms",
                              aboutProps:{
                                  tablename:'myConceptGraph_organisms'
                              },
                              tablename: 'myConceptGraph_organisms',
                              state: {tablename:'myConceptGraph_organisms'}
                          }}
                      >Organisms table</Link>
                      <br/>
                      <Link class='navButton'
                        to={{
                              pathname: "/ViewMyConceptGraph/myConceptGraph_epistemologies",
                              aboutProps:{
                                  tablename:'myConceptGraph_epistemologies'
                              },
                              tablename: 'myConceptGraph_epistemologies',
                              state: {tablename:'myConceptGraph_epistemologies'}
                          }}
                      >Epistemologies table</Link>
                      <br/>
                      <Link class='navButton'
                        to={{
                              pathname: "/ViewMyConceptGraph/myConceptGraph_2WAY",
                              aboutProps:{
                                  tablename:'myConceptGraph_2WAY'
                              },
                              tablename: 'myConceptGraph_2WAY',
                              state: {tablename:'myConceptGraph_2WAY'}
                          }}
                      >2WAY table</Link>
                    </div>
                    <div style={{width:"800px",overflow:"scroll"}}>
                        <pre>response: {this.state.response}</pre>
                    </div>
                </div>
            </fieldset>
          </>
        );
    }
}
