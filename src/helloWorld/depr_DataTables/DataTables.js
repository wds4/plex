import React, { Component } from "react";
import ReactDOM from "react-dom";
const $ = require("jquery");
$.DataTable = require("datatables.net");
const columns = [
      { title: "Name", data:"name" },
     { title: "Position", data:"position" },
     { title: "Office", data:"office" },
     { title: "Extn.", data: "ext" },
     { title: "Start date", data:"date" },
     { title: "Salary", data: "salary" },
];


class DataTableComp extends Component {
    constructor(props) {
        super(props);
    }
    reloadTableData = (data) => {
        const table = $(".data-table-wrapper")
                      .find("table")
                      .DataTable();
                      table.clear();
                      table.rows.add(data);
                     table.draw();
        }
    shouldComponentUpdate(nextProps){
      if (nextProps.data.length !== this.props.data.length) {
               this.reloadTableData(nextProps.data);
        }
           return false;
      }
    componentDidMount() {
         this.$el = $(this.el);
         this.$el.DataTable({
                dom: '<"data-table-wrapper"t>',
                data: this.props.data,
                columns: columns,
                ordering: false,
                columnDefs: [
                         {
                        targets: [5],
                        width: 180,
                        className: "center",
                        createdCell: (td, cellData, rowData) =>
                        ReactDOM.render(
                             <div
                               id={rowData.id}
                               onClick={() => {
                               this.props.deleteRow(rowData.id);
                               }}
                              > Delete </div>, td ),
                        },
                ],
        });
   }
   componentWillUnmount() {
           $(".data-table-wrapper").find("table").DataTable().destroy(true);
           }
       reloadTableData = (data) => {
               const table = $('.data-table-wrapper').find('table').DataTable();
            table.clear();
            table.rows.add(data);
            table.draw();
             }
       shouldComponentUpdate(nextProps, nextState){
       if (nextProps.data.length !== this.props.data.length) {
              this.reloadTableData(nextProps.data);
       }
      return false;
    }
    render() {
        return (
        <div>
              <table
                className="table table-borderless display"
                id="dataTable"
                 width="100%"
                 cellSpacing="0"
                ref={(el) => (this.el = el)}
                 />
         </div>
        );
    }
}
export default DataTableComp;
