import React from "react";
import Masthead from '../mastheads/plexMasthead.js';
import LeftNavbar1 from '../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../navbars/leftNavbar2/plex_settings_leftNav2';

const jQuery = require("jquery");

export default class PlexSettingsMainPage extends React.Component {
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
                        <Masthead />
                        <div class="h2">Plex Settings Main Page</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
