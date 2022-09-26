import React from 'react';
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import sendAsync from '../../renderer.js'
import { marked } from 'marked';
const electronFs = window.require('fs');

const jQuery = require("jquery");

export default class HelloWorldMarkdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        const html = marked.parse('# Marked in Node.js\n\nRendered by **marked**.');
        jQuery("#content").html(html)

        const mdFile = electronFs.readFileSync("src/plex/settings/helloWorld/helloWorldMarkdownTestFile.md", "utf8");
        const html2 = marked.parse(mdFile);
        jQuery("#content2").html(html2)
        // document.getElementById('content').innerHTML = marked.parse('# Marked in the browser\n\nRendered by **marked**.');
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div className="h2">Hello World: Markdown</div>

                        <div id="content"></div>

                        <div id="content2"></div>

                    </div>
                </fieldset>
            </>
        );
    }
}
