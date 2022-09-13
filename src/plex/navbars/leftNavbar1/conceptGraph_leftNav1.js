import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

function LeftNav1Timer() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setCount((count) => count + 1);
        }, 1000);
    }, [count]); // <- add empty brackets here

    return <div>I've rendered {count} times!</div>;
}

export default class LeftNavbar1_conceptGraph extends React.PureComponent {
  render() {
    return (
      <>
        <div className="leftNav1Panel_ConceptGraph" >
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/ConceptGraphHome' >Concept Graph Home (CG)</NavLink>
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/ConceptGraphsMainPage' >Concept Graphs</NavLink>
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/DictionariesMainPage' >Dictionaries</NavLink>
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/WordTypesMainPage' >Word Types</NavLink>
            <NavLink className="leftNav1Button" exact activeClassName="active" to='/RelationshipTypesMainPage' >Relationship Types</NavLink>

            <br/><br/><br/>

            <NavLink class="leftNav1Button_old" exact activeClassName="active" to='/OldPGAHome' >Home (old, PGA)</NavLink>

            <br/><br/><br/>

            <LeftNav1Timer />

        </div>

      </>
    );
  }
}
