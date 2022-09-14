import React from 'react';
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import sendAsync from '../../renderer.js'

const electronFs = window.require('fs');

const jQuery = require("jquery");

const data = "Hello World test file. \n Here is line 2."

electronFs.writeFile("src/plex/conceptGraph/helloWorld/helloWorldTestFile.txt", data, (err) => {
    if (err)
        console.log(err);
    else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(electronFs.readFileSync("src/plex/conceptGraph/helloWorld/helloWorldTestFile.txt", "utf8"));
    }
});

export default class HelloWorldWriteFile extends React.Component {
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
                        <div class="h2">Hello World: Write File</div>
                        See helloWorldTestFile.txt in src/plex/conceptGraph/helloWorld/
                        <br/>
                        Also see console.
                    </div>
                </fieldset>
            </>
        );
    }
}
