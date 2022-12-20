import React from "react";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/gun_leftNav2';

const GUN = require('gun');

const jQuery = require("jquery");

export default class GunGeneralInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        const gun = GUN(['http://localhost:8765/gun', 'https://gun-manhattan.herokuapp.com/gun']);
        const copy = gun.get('toast').get('paste');
        paste.oninput = () => { copy.put(paste.value) };
        copy.on((data) => { paste.value = data });

    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div className="h2">GUN General Info</div>

                        <textarea id="paste" placeholder="paste here!"></textarea>
                    </div>
                </fieldset>
            </>
        );
    }
}
