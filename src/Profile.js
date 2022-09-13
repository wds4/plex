import React from "react";
import { NavLink, Link } from "react-router-dom";
import * as Constants from './conceptGraphMasthead.js';
// import LeftNavbar from './LeftNavbar';
import LeftNavbarHelloWorld from './LeftNavbar_HelloWorld';
const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

var dDataSet = [
  ["a", "a","a","a","a","a","a","c","a","c"],
  ["b", "b","b","b","b","b","b","d","a","d"]

];

function makeTable() {
    var dtable = jQuery('#table_profile').DataTable({
        data: dDataSet,
        pageLength: 25,
        "columns": [
            {
                "className":          'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { visible: false },
            { visible: false },
            { visible: false },
            { visible: false },
            { },
            { },
            { },
            { visible: false },
            { visible: false }
        ],
        "dom": '<"pull-left"f><"pull-right"l>tip'
    });

}

export default class Profile extends React.Component {
  componentDidMount() {
      // jQuery("#testElement").html(tableHTML);
      makeTable()
  }
  render() {
    return (
      <>
        <fieldset className="mainBody" >
            <LeftNavbarHelloWorld />
            <div className="mainPanel" >
                {Constants.conceptGraphMasthead}
                <div class="h2">This is my profile</div>
                <div id="testElement" > test element</div>
                <div className="tableContainer" >
                    <table id="table_profile" className="display" style={{color:"black"}}>
                      <thead>
                          <tr>
                              <th></th>
                              <th>r</th>
                              <th>id</th>
                              <th>rawFile</th>
                              <th>keyname</th>
                              <th>slug</th>
                              <th>wordType(s)</th>
                              <th>IPNS/IPFS</th>
                              <th>IPNS</th>
                              <th>IPFS</th>
                          </tr>
                      </thead>
                      <tfoot>
                          <tr>
                              <th></th>
                              <th>r</th>
                              <th>id</th>
                              <th>rawFile</th>
                              <th>keyname</th>
                              <th>slug</th>
                              <th>wordType(s)</th>
                              <th>IPNS/IPFS</th>
                              <th>IPNS</th>
                              <th>IPFS</th>
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
