import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_ManageDownload extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <center>Manage Download</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_ManageDownload'>Manage Download</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_ManageMainConceptGraphSchema'>Manage mainConceptGraphSchema</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_DownloadConceptGraphFromExternalSource'>Download Concept Graph</NavLink>
        </div>

      </>
    );
  }
}
