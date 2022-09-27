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
        // jQuery("#button1").off().click(function(){
        jQuery("#button1").click(function(){
            console.log("button1 clicked (from componentDidMount)")
        })

        // jQuery("#button2").off().click(function(){
        jQuery("#button2").click(function(){
            console.log("button2 clicked (from button 2 - a)")
            jQuery("#button1").click(function(){
                console.log("button1 clicked (from button 2 - b)")
            })
        })

        jQuery("#button3").click(function(){
            console.log("button3 clicked (from button 3 - a)")
            jQuery("#button1").off().click(function(){
                console.log("button1 clicked (from button 3 - b)")
            })
        })

        jQuery("#button4").click(function(){
            console.log("button4 clicked (from button 4 - a)")
            jQuery("#button1").click(function(){
                console.log("button1 clicked (from button 4 - b)")
            })
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Hello World: Main Page</div>

                        <a target='_blank' href='https://openprocessing.org/sketch/418494/embed/' >rorschach image generator</a>

                        <br/>

                        <div className="doSomethingButton" id="button1">button 1</div>
                        <div className="doSomethingButton" id="button2">button 2</div>
                        <div className="doSomethingButton" id="button3">button 3</div>
                        <div className="doSomethingButton" id="button4">button 4</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
