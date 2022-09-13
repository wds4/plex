import React from "react";
import { NavLink, Link } from "react-router-dom";
import * as Constants from './conceptGraphMasthead.js';
// import { useLocation } from "react-router-dom";
// trying to track location via useLocation using this guide:
// https://medium.com/how-to-react/add-an-active-classname-to-the-link-using-react-router-b7c350473916

export default class LeftNavbarMaintenance extends React.Component {
  render() {
    return (
      <>
        <div className="navButtonPanel" >
            <NavLink class="navButton" exact activeClassName="active" to='/' >Home</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/MaintenanceControlPanel'>Maintenance Control Panel</NavLink>
            <br/><br/>
            <NavLink class="navButton" activeClassName="active" to='/C2CRelsMaintenance'>Changes stemming from c2c rels</NavLink>
            <br/><br/>
            <div style={{color:"white",fontSize:"12px"}}>Modify words, continuous:</div>
            <NavLink class="navButton" activeClassName="active" to='/UpdataGlobalDynamicData'>Update globalDynamicData</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/UpdatePropertyData'>Update propertyData</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/MaintenanceOfSchemas'>Maintenance of Schemas</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/ConceptsMaintenance'>Concepts Maintenance</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/SpecificInstancesMaintenance'>SpecificInstances Maintenance</NavLink>
            <br/><br/>
            <div style={{color:"white",fontSize:"12px"}}>Modify words, sporadic</div>
            <NavLink class="navButton" activeClassName="active" to='/ResetMiscValues'>Reset various word values</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/MaintenanceOfPropertySchemas'>Property Schema Maintenance</NavLink>
            <br/><br/>
            <div style={{color:"white",fontSize:"12px"}}>Modify words, template</div>
            <NavLink class="navButton" activeClassName="active" to='/MaintenanceOfXYZ'>XYZ Maintenance</NavLink>
            <br/><br/>
            <div style={{color:"white",fontSize:"12px"}}>Modify words, incomplete</div>
            <NavLink class="navButton" activeClassName="active" to='/ConceptGraphMaintenance'>Concept Graph Maintenance</NavLink>
            <br/><br/>
            <div style={{color:"white",fontSize:"12px"}}>Modify graph</div>
            <NavLink class="navButton" activeClassName="active" to='/PropertyModuleMaintenance'>Property Module Maintenance</NavLink>
        </div>
      </>
    );
  }
}
