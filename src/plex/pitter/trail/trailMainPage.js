import React from 'react';
import Masthead from '../../mastheads/pitterMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/pitter_leftNav1';
import NewPostContainer from './writeNewPost.js'

const jQuery = require("jquery");

export default class PitterTrailMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");
        console.log("Pitter Home")
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <center>
                            <div className="pitterTrailMainContainer" >
                                <div id="pitterTrailLeaveMessageContainer" className="pitterTrailLeaveMessageContainer" >
                                    <NewPostContainer />
                                </div>
                                <div className="pitterTrailMessagesContainer" >
                                </div>
                            </div>
                            <div className="pitterTrailInfoContainer" >

                            </div>
                        </center>
                    </div>
                </fieldset>
            </>
        );
    }
}
