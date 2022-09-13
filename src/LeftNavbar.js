import React from "react";
import { NavLink, Link } from "react-router-dom";
import * as Constants from './conceptGraphMasthead.js';
// import { useLocation } from "react-router-dom";
// trying to track location via useLocation using this guide:
// https://medium.com/how-to-react/add-an-active-classname-to-the-link-using-react-router-b7c350473916

export default class LeftNavbar extends React.Component {
  render() {
    return (
      <>
        <div className="navButtonPanel" >
            <div style={{color:"white"}}>
            appTimer: {this.props.appTimer}
            </div>
            <NavLink class="navButton" exact activeClassName="active" to='/' >Home</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/MaintenancePages'>Maintenance pages</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/ConceptGraphHome' >Plex Concept Graph Home</NavLink>
            <br/><br/>
            <NavLink class="navButton" activeClassName="active" to='/BuildConceptFamily'>Build Concept Family</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/MyDictionaries'>My Dictionaries</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/ViewMyDictionary/myDictionary_temporary'>View My Dictionary</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/MyConceptGraphs'>My ConceptGraphs</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/ViewMyConceptGraph/myConceptGraph_temporary'>View My ConceptGraph</NavLink>
            <NavLink class="navButton" activeClassName="active" to='/wordTemplatesByWordType'>Word Templates by Word Type</NavLink>
            <br/><br/>
            <NavLink class="navButton" activeClassName="active" to='/HelloWorldPages'>Hello World pages</NavLink>
            <div style={{border:"1px solid black",backgroundColor:"white",padding:"3px",fontSize:"10px",margin:"5px",textAlign:"left"}} >
                <center>Maintenance</center>
                task number: <div id="currentTaskNumberContainer_mini" style={{display:"inline-block"}}></div>

                <br/>

                <div className="leftCol_mini_cpd" style={{borderBottom:"1px solid black"}} >
                gp name
                </div>
                <div className="rightCol_mini_cpd" style={{borderBottom:"1px solid black"}} >
                num
                </div>

                <br/>

                <div id="maintenanceGroupNameContainer_mini_0" className="leftCol_mini_cpd" >
                0 XYZ
                </div>
                <div id="conceptGraphMaintenanceGroup_mini_0" className="rightCol_mini_cpd" >
                </div>

                <br/>

                <div id="maintenanceGroupNameContainer_mini_1" className="leftCol_mini_cpd" >
                1 gDD
                </div>
                <div id="conceptGraphMaintenanceGroup_mini_1" className="rightCol_mini_cpd" >
                </div>

                <br/>

                <div id="maintenanceGroupNameContainer_mini_2" className="leftCol_mini_cpd" >
                2 pDM
                </div>
                <div id="conceptGraphMaintenanceGroup_mini_2" className="rightCol_mini_cpd" >
                </div>

            </div>
        </div>

      </>
    );
  }
}
