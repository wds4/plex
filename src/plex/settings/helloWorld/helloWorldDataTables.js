import React from 'react';
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
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
                        <Masthead />
                        <div class="h2">Hello World: DataTables</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
