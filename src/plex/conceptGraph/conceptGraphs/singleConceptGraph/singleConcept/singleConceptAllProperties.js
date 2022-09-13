import React from "react";
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConcept_properties_leftNav2.js';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import sendAsync from '../../../../renderer.js'; 

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

function makeThisPageTable(tableName,propertyDataSet) {
    var dtable = jQuery('#table_properties').DataTable({
        data: propertyDataSet,
        pageLength: 5,
        "columns": [
            {
                "class":          'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { },
            { },
            { },
            { },
            { },
            { }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip',

        "drawCallback": function( settings ) {
            // alert( 'DataTables has redrawn the table' );
            jQuery(".nextRowEditButton").click(function(){
                var slug = jQuery(this).data("slug");
                // console.log("slug: "+slug)
                jQuery("#linkFrom_"+slug).get(0).click();
            })
        }
    });
    // Add event listener for opening and closing details
    jQuery('#table_properties tbody').on('click', 'td.details-control', function () {
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
            var slug = d[3];
            var oProperty = window.lookupWordBySlug[slug];
            var sProperty = JSON.stringify(oProperty,null,4)

            var expansionHTML = "";
            expansionHTML += "<div>";
            expansionHTML += "<div data-status='pre' data-slug='"+slug+"' id='toggleTextareaButton_"+slug+"' class=doSomethingButton  >toggle edit box</div>";
            expansionHTML += "<div id='update_"+slug+"' data-slug='"+slug+"' class=doSomethingButton style=display:none; >UPDATE</div>";

            expansionHTML += "<textarea id='textarea_"+slug+"' style=width:700px;height:800px;display:none; >";
            expansionHTML += sProperty;
            expansionHTML += "</textarea>";

            expansionHTML += "<pre id='pre_"+slug+"' >";
            expansionHTML += sProperty;
            expansionHTML += "</pre>";

            expansionHTML += "</div>";

            row.child( expansionHTML ).show();
            tr.addClass('shown');
            jQuery("#toggleTextareaButton_"+slug).click(function(){
                var slug = jQuery(this).data("slug");
                var status = jQuery(this).data("status");
                // alert("clicked; slug: "+slug+"; status: "+status)
                if (status=="pre") {
                    jQuery(this).data("status","textarea");
                    jQuery("#textarea_"+slug).css("display","block")
                    jQuery("#update_"+slug).css("display","inline-block")
                    jQuery("#pre_"+slug).css("display","none")
                }
                if (status=="textarea") {
                    jQuery(this).data("status","pre");
                    jQuery("#textarea_"+slug).css("display","none")
                    jQuery("#update_"+slug).css("display","none")
                    jQuery("#pre_"+slug).css("display","block")
                }
            })
            jQuery("#update_"+slug).click(function(){
                var slug = jQuery(this).data("slug");
                var sWord = jQuery("#textarea_"+slug).val();
                var oWord = JSON.parse(sWord);
                MiscFunctions.createOrUpdateWordInAllTables(oWord);
                // alert("clicked; slug: "+slug+"; sWord: "+sWord)
            })
        }
    } );
}

export default class SingleConceptAllPropertiesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            propertyLinks: []
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var propertyDataSet = [];
        var conceptSlug = window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug
        var oConcept = window.lookupWordBySlug[conceptSlug];
        var propertySchemaSlug = oConcept.conceptData.nodes.propertySchema.slug;
        var oPropertySchema = window.lookupWordBySlug[propertySchemaSlug];
        var aPropertySchemaWords = oPropertySchema.schemaData.nodes;
        for (var w=0;w<aPropertySchemaWords.length;w++) {
            var nextWordSlug = aPropertySchemaWords[w].slug;
            var oNextWord = window.lookupWordBySlug[nextWordSlug];
            if (oNextWord.hasOwnProperty("propertyData")) {
                var nextPropertyName = oNextWord.propertyData.name;
                var nextPropertyType = oNextWord.propertyData.type
                var aChildProperties = [];
                var aPropertyTypes = oNextWord.propertyData.metaData.types
                var nextProperty_childProperties = "";
                if (nextPropertyType=="object") {
                    var oChildProperties = oNextWord.propertyData.properties;
                    jQuery.each(oChildProperties, function(key,value){
                        aChildProperties.push(key);
                        nextProperty_childProperties += key + "<br>";
                    })
                }
                var aNextProperty = [];
                var nextRow_button = "<div data-nodenum="+w+" data-slug="+nextWordSlug+" class='doSomethingButton_small nextRowEditButton' style=margin-right:5px; >VIEW / EDIT</div>";
                var nextRow_link_html = nextRow_button;
                var nextWordSlug_html = nextWordSlug;
                if (jQuery.inArray("primaryProperty",aPropertyTypes) > -1) {
                    nextRow_link_html += "<br>** primary property**"
                }
                aNextProperty = ["",w,
                    nextRow_link_html,
                    nextWordSlug,
                    nextPropertyName,
                    nextPropertyType,
                    nextProperty_childProperties
                ];
                propertyDataSet.push(aNextProperty);

                // create links to individual view / edit existing wordType page
                var oPropertyData = {};
                oPropertyData.pathname = "/SingleConceptSingleProperty/"+nextWordSlug;
                oPropertyData.propertyID = 'linkFrom_'+nextWordSlug;
                oPropertyData.propertyname = nextPropertyName;
                this.state.propertyLinks.push(oPropertyData);
                this.forceUpdate();
            }
        }
        var thisPageTableName = "unknown";
        var currCgID = window.currentConceptGraphSqlID;
        if (window.aLookupConceptGraphInfoBySqlID.hasOwnProperty(currCgID)) {
            thisPageTableName = ""+window.aLookupConceptGraphInfoBySqlID[currCgID].tableName;
        }
        makeThisPageTable(thisPageTableName,propertyDataSet);
        jQuery(".nextRowEditButton").click(function(){
            var slug = jQuery(this).data("slug");
            // console.log("slug: "+slug)
            if(document.getElementById("linkFrom_"+slug)) {
                jQuery("#linkFrom_"+slug).get(0).click();
            }
        })
        jQuery("#thisPageTableNameContainer").css("display","none");
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Single Concept All Properties (table)</div>
                        <div class="h3" >{window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}</div>
                        <div class="h3" >{window.aLookupConceptInfoBySqlID[window.currentConceptSqlID].slug}</div>

                        <div style={{display:"none"}} >
                        {this.state.propertyLinks.map(link => (
                            <div >
                                <Link class='navButton'
                                  id={link.propertyID}
                                  to={link.pathname}
                                >{link.propertyname}
                                </Link>
                            </div>
                        ))}
                        </div>

                        <div className="tableContainer" style={{marginTop:"20px",marginLeft:"20px"}} >
                            <table id="table_properties" className="display" style={{color:"black",width:"95%"}} >
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>n</th>
                                        <th>link</th>
                                        <th>slug</th>
                                        <th>name</th>
                                        <th>property type</th>
                                        <th>child properties</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th></th>
                                        <th>n</th>
                                        <th>link</th>
                                        <th>slug</th>
                                        <th>name</th>
                                        <th>property type</th>
                                        <th>child properties</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
