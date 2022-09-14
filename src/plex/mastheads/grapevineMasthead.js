import React from 'react';
import { NavLink, Link } from "react-router-dom";

const jQuery = require("jquery");

export default class GrapevineMasthead extends React.Component {
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
                  <div style={{fontSize:"20px",display:"inline-block",marginTop:"10px",color:"#5e0080"}}>
                  the
                  </div>
                  <div style={{fontSize:"48px",display:"inline-block",marginTop:"10px",color:"purple",marginRight:"30px"}}>
                  Grapevine
                  </div>

                  <div style={{float:"right",display:"inline-block",marginRight:"50px",height:"100%"}}>
                      <div style={{display:"inline-block",marginTop:"30px",marginRight:"10px"}} >Hi Alice!</div>
                      <NavLink className="mastheadNavButton" exact activeClassName="active" to='/SettingsMainPage' >Settings</NavLink>
                      <NavLink className="mastheadNavButton" exact activeClassName="active" to='/ProfileMainPage' >Profile</NavLink>
                  </div>
              </div>
              <div className="landingPageSubBanner" >
                  <div >Grapevine motto</div>
              </div>
          </>
        );
    }
}
