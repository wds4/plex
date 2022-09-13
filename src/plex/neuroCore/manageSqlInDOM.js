import React from 'react';
// import * as MiscFunctions from '../functions/miscFunctions.js';
import * as InitDOMFunctions from '../functions/transferSqlToDOM.js';

const jQuery = require("jquery");

export default class ManageSqlInDOM extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        // load SQL data into the DOM (probably not good practice; should fix later)
        // init window.lookupWordTypeTemplate
        console.log("ManageSqlInDOM")

    }
    render() {
        return (
            <>
                <div >
                    <div class="h2">Manage SQL in DOM</div>
                </div>
            </>
        );
    }
}
