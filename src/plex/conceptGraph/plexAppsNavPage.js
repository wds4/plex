import React from 'react';
import { NavLink, Link } from "react-router-dom";
import Masthead from '../mastheads/plexMasthead.js';
import LeftNavbar1 from '../navbars/leftNavbar1/plex_leftNav1';

const jQuery = require("jquery");

export default class PlexAppsNavPage extends React.Component {
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
                        <Masthead />
                        <div class="h2">Plex Apps Nav Page</div>

                        <center>
                            <div style={{display:"inline-block",width:"60%",textAlign:"left",marginTop:"50px"}}>
                                <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/PlexHome' >
                                    <center>Plex</center>
                                </NavLink>

                                <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/ConceptGraphHome' >
                                    <center>Concept Graph</center>
                                </NavLink>

                                <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/DecentralizedProofOfPersonhoodHome'>
                                    <center>decentralized Proof of Personhood</center>
                                </NavLink>

                                <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/GrapevineHome' >
                                    <center>The Grapevine</center>
                                </NavLink>

                                <br/>

                                <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/DecentralizedSearchHome'>
                                    <center>decentralized Search</center>
                                </NavLink>

                                <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/DecentralizedTwitterHome'>
                                    <center>decentralized Twitter</center>
                                </NavLink>

                                <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/DecentralizedRedditHome'>
                                    <center>decentralized Reddit</center>
                                </NavLink>

                                <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/EBooksHome'>
                                    <center>eBooks</center>
                                </NavLink>

                            </div>
                        </center>
                    </div>
                </fieldset>
            </>
        );
    }
}
