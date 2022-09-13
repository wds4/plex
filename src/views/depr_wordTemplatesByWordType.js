
import React, { Component } from "react";
import * as Constants from '../conceptGraphMasthead.js';
import LeftNavbar from '../LeftNavbar';
// import {Table} from "../helloWorld/DataTables/Table";
// const $ = require("jquery");
// $.DataTable = require("datatables.net");
import DataTable from 'react-data-table-component';


const data = [{ id: 1, title: 'Conan the Barbarian', year: '1982' }];
const columns = [
  {
    name: 'Title',
    selector: 'title',
    sortable: true,
  },
  {
    name: 'Year',
    selector: 'year',
    sortable: true,
    right: true,
  },
];

class MyComponent extends Component {
  render() {
    return (
      <DataTable
        title="Arnold Movies"
        columns={columns}
        data={data}
      />
    )
  }
};

export default class WordTemplatesByWordType extends React.Component {
  render() {
    return (
      <>
        <fieldset className="mainBody" >
            <LeftNavbar />
            <div className="mainPanel" >
                {Constants.conceptGraphMasthead}
                <div class="h2">Word Templates by Word Type</div>
                <MyComponent />
            </div>
        </fieldset>
      </>
    );
  }
}
