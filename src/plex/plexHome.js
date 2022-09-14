
import React from 'react';
import PlexMasthead from './mastheads/plexMasthead.js';
import LeftNavbar1 from './navbars/leftNavbar1/plex_leftNav1';

const jQuery = require("jquery");

export default class PlexHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <PlexMasthead />
                        <div class="h2">Plex Home</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
