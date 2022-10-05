import React, { useState, useEffect }  from 'react';
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

export default class LeftNavbar2_HelloWorld extends React.Component {
  render() {
    return (
      <>
        <div className="leftNav2Panel_Plex" >
            <center>Plex Settings</center>

            <br/>

            <NavLink className="leftNav2BackButton" activeClassName="active" to='/PlexSettingsMainPage'>Plex General Settings</NavLink>

            <br/><br/>

            <center>Hello World</center>
            <br/>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldMainPage'>Hello World Home</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldChildToParent'>React: Child to Parent</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldAsyncChain'>Chain Async Fxns</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldDataTables'>DataTables</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldWriteFile'>Write File (fs)</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldUploadImageToIPFS'>Upload Image to IPFS</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldMarkdown'>Markdown</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldNoUiSlider'>NoUiSlider</NavLink>
            <br/><br/>
            <center>JSON Schema</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldJSONSchemaForm'>JSONSchemaForm</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldJSONSchemaFormTester'>JSONSchema: Form Tester</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldJSONSchemaFormRender'>JSONSchemaForm via React Render</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldJSONSchemaFormV5'>JSONSchemaForm Version 5</NavLink>
            <br/><br/>
            <center>Imaging</center>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldVisJS'>Vis.js</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldP5'>p5.js</NavLink>
            <NavLink className="leftNav2Button" activeClassName="active" to='/HelloWorldC2'>c2.js</NavLink>

            <br/><br/><br/>

            <LeftNav1Timer />
        </div>

      </>
    );
  }
}
