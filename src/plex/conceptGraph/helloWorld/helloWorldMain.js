import React from 'react';
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import sendAsync from '../../renderer.js'

const jQuery = require("jquery");

export default class HelloWorldMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Hello World: Main Page</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
