import React from "react";
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar1_conceptGraph extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNav1Panel_ConceptGraph" >
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/PlexHome'>
                <div style={{fontSize:"42px"}} >&#x221E;</div>
                <div style={{fontSize:"12px",lineHeight:"100%"}} >Plex</div>
                </NavLink>
            <br/><br/>
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/ConceptGraphHome' >
                <div style={{fontSize:"38px"}} >&#x26CF;</div>
                <div style={{fontSize:"10px"}} >Concept Graph</div>
                </NavLink>
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/ConceptGraphsMainPage' >Concept Graphs</NavLink>
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/DictionariesMainPage' >Dictionaries</NavLink>
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/WordTypesMainPage' >Word Types</NavLink>
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/RelationshipTypesMainPage' >Relationship Types</NavLink>

            <br/><br/><br/>

            <NavLink class="leftNav1Button_old" exact activeClassName="active" to='/OldPGAHome' >Home (old, PGA)</NavLink>

        </div>

      </>
    );
  }
}
