import React from 'react';
import { NavLink, Link } from "react-router-dom";

export default class LeftNavbar2_SingleConceptGraph extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_NeuroCore" >
            <div className="leftNavBarBackBox" style={{height:"75px"}} >
                <center>back</center>

                <NavLink className="leftNav2BackButton" activeClassName="active" to='/ConceptGraphsMainPage'>All Concept Graphs</NavLink>
            </div>

            <div className="leftNavBarConceptGraphTitle" >
            {window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].title}
            </div>

            <NavLink className="leftNav2Button" activeClassName="active" to='/EditExistingConceptGraphPage/current'>General Info</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDetailedInfo/current'>Detailed Info</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/GrandChart'>Grand Chart</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllConceptsTable_fast'>Show All Concepts (table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllForms'>Show All Forms (one for each concept)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllWordsTable_fast'>Show All Words (table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllWordsValidation'>Show All Words: Validation</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/DeleteWord'>Delete Word</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ChangeSlug'>Rename Slug</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllRelationshipsTable'>Show All Relationships (table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphCompactExport/current'>Compact Export</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphImport/current'>Import via Compact Files</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphTemplating/current'>Templating</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphDataModeling/current'>Data Modeling</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphWriteToMFS'>Write SQL to MFS</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphPinToIPFS'>Pin to IPFS</NavLink>

            <br/><br/>

            <div >Layer 2</div>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllC2CRelationshipsTable'>Show All C2C Rels (L2; table)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/RestrictsValueManagementExplorer'>RVM Explorer</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/EnumerationTreeManagementExplorer'>Enumeration Explorer</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/MakeNewC2cRelBasic/current'>Make New C2C Rel (basic)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/MakeNewC2cRelRestrictValue/current'>Make New C2C Rel (restrictsValue)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/MakeNewC2cRelViaEnumeration/current'>Make New C2C Rel (enumeration)</NavLink>

            <div style={{display:"none"}}>
            <br/><br/>
            <div style={{fontSize:"12px"}}>Show all words of wordType:</div>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllConcepts'>Concepts</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllSchemas'>Schemas</NavLink>
            </div>

            <br/><br/>

            <center>Graphs</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/AllC2CRelationshipsGraph'>Show All C2C Rels (graph) (Layer 2)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/ExplorePropertyGraphs'>View Property Graphs</NavLink>



            <br/><br/>

            <center>Technical Info</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/SingleConceptGraphErrorCheck/current'>Check for Errors</NavLink>

        </div>

      </>
    );
  }
}
