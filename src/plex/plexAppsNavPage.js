import React from 'react';
import { NavLink, Link } from "react-router-dom";
import Masthead from './mastheads/plexMasthead.js';
import LeftNavbar1 from './navbars/leftNavbar1/plex_leftNav1';

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
                        <div class="h2">the Plex Family of Decentralized Apps</div>

                        <center>
                            <div style={{display:"inline-block",width:"1050px",textAlign:"left",marginTop:"50px"}} >
                                <center>infrastructure / under the hood</center>
                                <center>
                                <div style={{display:"inline-block"}} >
                                    <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/PlexHome' >
                                        <center>Plex</center>
                                    </NavLink>

                                    <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/ConceptGraphHome' >
                                        <center>Concept Graph</center>
                                    </NavLink>

                                    <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/DecentralizedOntologiesHome'>
                                        <center>Ontologies</center>
                                    </NavLink>

                                    <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/GrapevineHome' >
                                        <center>The Grapevine</center>
                                    </NavLink>
                                </div>
                                </center>

                                <br/>

                                <center>higher order apps</center>
                                <center>
                                <div style={{display:"inline-block",textAlign:"left"}} >
                                    <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/CrowdscreenedGroupsHome'>
                                        <center>Crowdscreened Groups</center>
                                    </NavLink>

                                    <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/DecentralizedQuestionsAndAnswersHome'>
                                        <center>Ask Plex: decentralized Questions & Answers</center>
                                    </NavLink>

                                    <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/DecentralizedSearchHome'>
                                        <center>Search</center>
                                    </NavLink>

                                    <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/PitterHome'>
                                        <center>Pitter</center>
                                    </NavLink>

                                    <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/DecentralizedRedditHome'>
                                        <center>Readit</center>
                                    </NavLink>

                                    <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/EBooksHome'>
                                        <center>eBooks</center>
                                    </NavLink>

                                    <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/DecentralizedProofOfPersonhoodHome'>
                                        <center>Proof of Humanity</center>
                                    </NavLink>

                                    <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/DecentralizedListCurationHome'>
                                        <center>List Curation</center>
                                    </NavLink>

                                    <NavLink className="plexAppSquareButton" exact activeClassName="active" to='/DecentralizedRssFeedsHome'>
                                        <center>RSS Feeds</center>
                                    </NavLink>
                                </div>
                                </center>

                            </div>
                        </center>
                    </div>
                </fieldset>
            </>
        );
    }
}
