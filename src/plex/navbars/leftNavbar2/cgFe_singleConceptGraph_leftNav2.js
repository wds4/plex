import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_ConceptGraphs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title
        }
    }
    render() {
        return (
          <>
            <div className="leftNav2Panel_NeuroCore" >
                <div className="leftNavBarBackBox" >
                    <center>back</center>
                    <NavLink className="leftNav2BackButton" activeClassName="active" to='/ConceptGraphsFrontEndMainPage'>All Concept Graphs</NavLink>
                </div>

                <div className="leftNavBarConceptGraphTitle" >
                {this.props.viewingConceptGraphTitle}
                </div>

                <center>Single Concept Graph</center>
                <br/>
                <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEndSingleConceptGraphMainPage/current'>General Info</NavLink>
                <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEndSingleConceptGraphDetailedInfo/current'>Detailed Info</NavLink>
                <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_ConceptsMainPage/current'>Show All Concepts</NavLink>
                <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEnd_WordsMainPage/current'>Show All Words</NavLink>
                <NavLink className="leftNav2Button" activeClassName="active" to='/ConceptGraphsFrontEndSingleConceptGraphUpdateProposals/current'>Update Proposals</NavLink>

            </div>

          </>
        );
    }
}
