import React from 'react';
import { NavLink, Link } from "react-router-dom";
import * as MiscFunctions from '../functions/miscFunctions.js';
// import * as NeuroCore2TopPanel from '../neuroCore2/neuroCoreTopPanel.js';

const jQuery = require("jquery");

export default class ConceptGraphMasthead extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentConceptGraphSqlID: window.currentConceptGraphSqlID,
            currentConceptSqlID: window.currentConceptSqlID
        }
    }
    componentDidMount() {
    }
    render() {
        return (
          <>
              <div>
                  <div style={{fontSize:"48px",display:"inline-block",marginTop:"10px",color:"#1B2631",marginRight:"30px"}}>
                  PLEX
                  </div>

                  <div style={{float:"right",display:"inline-block",marginRight:"50px",height:"100%"}}>
                      <div style={{display:"inline-block",marginTop:"30px",marginRight:"10px"}} >Hi Alice!</div>
                      <NavLink className="mastheadNavButton" exact activeClassName="active" to='/PlexAppsNavPage' >apps</NavLink>
                      <NavLink className="mastheadNavButton" exact activeClassName="active" to='/PlexSettingsMainPage' >
                          Settings
                          <div style={{fontSize:"8px"}}>(Plex)</div>
                      </NavLink>
                      <NavLink className="mastheadNavButton" exact activeClassName="active" to='/ProfileMainPage' >Profile</NavLink>
                  </div>
              </div>
              <div className="landingPage_plex_SubBanner" >
                  <div >Plex motto</div>
              </div>
          </>
        );
    }
}
