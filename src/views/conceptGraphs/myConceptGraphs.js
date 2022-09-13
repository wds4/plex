import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { NavLink, Link, Route, Router, useHistory } from "react-router-dom";
// import * as Constants from '../../conceptGraphMasthead.js';
import ConceptGraphMasthead, { conceptGraphs_masthead_arr, conceptGraphsDataByTableName_obj } from '../../conceptGraphMasthead.js';
import LeftNavbar from '../../LeftNavbar';
import sendAsync from '../../renderer';
// import conceptGraphs_masthead_arr from '../../conceptGraphMasthead.js';
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

    // Add event listener for opening and closing details
    jQuery('#table_myConceptGraphs tbody').on('click', 'td.details-control', function () {
        // console.log("clicked icon");
        var tr = jQuery(this).parents('tr');
        var row = dtable.row( tr );
        // console.log("row: "+row);
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }

        else {
            var d=row.data();
            var sqlid = d[2];
            var description = d[3];
            var title = d[4];
            var tableName = d[5];
            var slug = d[6];
            var rootSchemaIPNS = d[7];
            var title = d[8];
            var referenceDictionarySlug = d[9];
            var tableName = d[10];

            var uniqueConceptGraphID = sqlid;

            var expansionHTML = "";
            expansionHTML += "<div>";
                expansionHTML += "<div>";
                    expansionHTML += "<div class='expansionPanel_left' >";
                    expansionHTML += "sqlid: ";
                    expansionHTML += "</div>";
                    expansionHTML += "<div class='expansionPanel_right expansionPanel_right_fixed'>";
                    expansionHTML += sqlid;
                    expansionHTML += "</div>";
                expansionHTML += "</div>";

                expansionHTML += "<div>";
                    expansionHTML += "<div class='expansionPanel_left' >";
                    expansionHTML += "description: ";
                    expansionHTML += "</div>";
                    expansionHTML += "<textarea class='expansionPanel_right expansionPanel_right_editable' id='description_"+sqlid+"' >";
                    expansionHTML += description;
                    expansionHTML += "</textarea>";
                expansionHTML += "</div>";

                expansionHTML += "<div>";
                    expansionHTML += "<div class='expansionPanel_left' >";
                    expansionHTML += "title: ";
                    expansionHTML += "</div>";
                    expansionHTML += "<textarea class='expansionPanel_right expansionPanel_right_editable' id='title_"+sqlid+"' >";
                    expansionHTML += title;
                    expansionHTML += "</textarea>";
                expansionHTML += "</div>";

                expansionHTML += "<div>";
                    expansionHTML += "<div class='expansionPanel_left' >";
                    expansionHTML += "tableName: ";
                    expansionHTML += "</div>";
                    expansionHTML += "<textarea class='expansionPanel_right expansionPanel_right_editable' id='tableName_"+sqlid+"' >";
                    expansionHTML += tableName;
                    expansionHTML += "</textarea>";
                expansionHTML += "</div>";

                expansionHTML += "<div>";
                    expansionHTML += "<div class='expansionPanel_left' >";
                    expansionHTML += "concept graph slug: ";
                    expansionHTML += "</div>";
                    expansionHTML += "<textarea class='expansionPanel_right expansionPanel_right_editable' id='slug_"+sqlid+"' >";
                    expansionHTML += slug;
                    expansionHTML += "</textarea>";
                expansionHTML += "</div>";

                expansionHTML += "<div>";
                    expansionHTML += "<div class='expansionPanel_left' style='font-size:12px;' >";
                    expansionHTML += "referenceDictionarySlug (or tableName?): ";
                    expansionHTML += "</div>";
                    expansionHTML += "<textarea class='expansionPanel_right expansionPanel_right_editable' id='referenceDictionarySlug_"+sqlid+"' >";
                    expansionHTML += referenceDictionarySlug;
                    expansionHTML += "</textarea>";
                expansionHTML += "</div>";

                expansionHTML += "<div id=updateConceptGraphButton_"+uniqueConceptGraphID+" class=doSomethingButton >UPDATE CONCEPT GRAPH</div>";
                expansionHTML += "<br>";
                expansionHTML += "<div id=deleteConceptGraphButton_"+uniqueConceptGraphID+" class=doSomethingButton >DELETE THIS CONCEPT GRAPH (does not currently execute)</div>";

            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');

            jQuery("#updateConceptGraphButton_"+uniqueConceptGraphID).click(function(){
                console.log("updating "+sqlid)
                var description_updated = jQuery("#description_"+sqlid).val();
                var title_updated = jQuery("#title_"+sqlid).val();
                var tableName_updated = jQuery("#tableName_"+sqlid).val();
                var slug_updated = jQuery("#slug_"+sqlid).val();
                var referenceDictionarySlug_updated = jQuery("#referenceDictionarySlug_"+sqlid).val();
                var sql1 = "";
                sql1 += "UPDATE myConceptGraphs ";
                sql1 += " SET description='"+description_updated+"' ";
                sql1 += " , title='"+title_updated+"' ";
                sql1 += " , tableName='"+tableName_updated+"' ";
                sql1 += " , slug='"+slug_updated+"' ";
                sql1 += " , referenceDictionary_tableName='"+referenceDictionarySlug_updated+"' ";
                sql1 += " WHERE id='"+sqlid+"' ";
                console.log("sql1: "+sql1)
                sendAsync(sql1)
            })
            jQuery("#deleteConceptGraphButton_"+uniqueConceptGraphID).click(function(){
                var sql1 = "";
                sql1 += "DELETE FROM myConceptGraphs";
                sql1 += " WHERE id='"+sqlid+"' ";
                // need to make delete row command, then sendAsync
                console.log("deleting from table: myConceptGraphs, the row with sql id:"+sqlid)
                // sendAsync(sql1)
            })
        }
    } );
}

function send(sql) {
    console.log("send; sql: "+sql)
    sendAsync(sql).then((result) => this.setResponse({response: result}) );
}


var cGlinks = [];

export default class MyConceptGraphs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            cglinks: [
                /*
                {
                    tablename: 'myConceptGraph_pga',
                    pathname: '/ViewMyConceptGraph/myConceptGraph_pga',
                    linkfromtablename: 'linkFrom_myConceptGraph_pga'
                }
                */
            ],
            count: 0,
            message: 'SELECT * FROM sqlite_master',
            response: null
        };
        var testLink2 = "<Link class='navButton' to='/'>test link</Link>";
    }

    async componentDidMount() {
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
                  // nextConceptGraph_title += " <div id='linkTo_"+nextConceptGraph_tableName+"' >link to: "+nextConceptGraph_tableName+"</div>";
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

                  var cGlinks_obj = {};
                  cGlinks_obj.pathname = "/ViewMyConceptGraph/"+nextConceptGraph_tableName;
                  cGlinks_obj.tablename = nextConceptGraph_tableName;
                  cGlinks_obj.linkfromtablename = 'linkFrom_'+nextConceptGraph_tableName;
                  // cGlinks2.push(cGlinks_obj)
                  this.state.cglinks.push(cGlinks_obj)
                  this.forceUpdate();
                  var cgm_obj = {};
                  cgm_obj.dictionarytablename = nextConceptGraph_refDictionary;
                  cgm_obj.tableName = nextConceptGraph_tableName;
                  cgm_obj.slug = nextConceptGraph_slug;
                  cgm_obj.title = nextConceptGraph_title;
                  conceptGraphs_masthead_arr[w] = cgm_obj;

                  conceptGraphsDataByTableName_obj[nextConceptGraph_tableName] = {}
                  conceptGraphsDataByTableName_obj[nextConceptGraph_tableName].dictionaryTableName = nextConceptGraph_refDictionary

              }
              makeTable(dDataSet);
        });
        jQuery("#createNewConceptGraphButton").click(function(){
            var newTitle = jQuery("#newConceptGraphTitle").val();
            var sql1 = ` INSERT OR IGNORE INTO myConceptGraphs `;
            sql1 += ` (title, tableName) `;
            sql1 += ` VALUES('`+newTitle+`', 'conceptGraph_pga' ) `;
            console.log("creating new concept graph entry, sql1: "+sql1);
            sendAsync(sql1);
        })
    }

    render() {
        return (
          <>
            <fieldset className="mainBody" >
                <LeftNavbar />
                <div className="mainPanel" >
                    <ConceptGraphMasthead />
                    <div class="h2">My Concept Graphs; {window.oTestVariable.foo}; {window.oTestVariable.foo1}</div>

                    <div>
                    {this.state.cglinks.map(link => (
                        <div id={link.linkfromtablename} >
                            <Link class='navButton'
                              to={link.pathname}
                            >{link.tablename}
                            </Link>
                        </div>
                    ))}
                    </div>

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

                      <fieldset style={{border:"1px solid black",radius:"5px",width:"80%",padding:"10px"}}>
                          Make new Concept Graph
                          <br/>
                          Title: <textarea id="newConceptGraphTitle"></textarea>
                          <br/>
                          <div id="createNewConceptGraphButton" className="doSomethingButton">Create</div>
                      </fieldset>

                      <fieldset style={{display:"none"}}>
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

                          <br/>
                          <Link class='navButton'
                            to={{
                                  pathname: "/ViewMyConceptGraph/myConceptGraph_slashtags",
                                  aboutProps:{
                                      tablename:'myConceptGraph_slashtags'
                                  },
                                  tablename: 'myConceptGraph_slashtags',
                                  state: {tablename:'myConceptGraph_slashtags'}
                              }}
                          >Slashtags table</Link>

                          <div style={{width:"800px",overflow:"scroll"}}>
                              <pre>response: {this.state.response}</pre>
                          </div>

                          </fieldset>
                    </div>
                </div>
            </fieldset>
          </>
        );
    }
}
