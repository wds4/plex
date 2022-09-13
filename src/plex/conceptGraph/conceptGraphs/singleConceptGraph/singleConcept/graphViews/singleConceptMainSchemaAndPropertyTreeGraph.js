import React, { useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import { DataSet, Network} from 'vis-network/standalone/esm/vis-network';
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConcept_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import sendAsync from '../../../../../renderer.js';
import * as VisStyleConstants from '../../../../../lib/visjs/visjs-style';

const jQuery = require("jquery");


export default class SingleConceptMainSchemaAndPropertyTreeGraph extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Single Concept Main Schema and Property Tree Graph</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
