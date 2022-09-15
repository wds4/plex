import React from "react";
import Masthead from '../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/grapevine_leftNav1';

const jQuery = require("jquery");

export default class GrapevineVisualizationMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Grapevine Visualization Main Page</div>

                        <center>
                            <div>
                                <div style={{border:"1px dashed grey",display:"inline-block",width:"300px",height:"100px"}}>
                                    <center>viewing</center>
                                    <select>
                                        <option>user</option>
                                        <option>Proven Person</option>
                                    </select>
                                </div>

                                <div style={{border:"1px dashed grey",display:"inline-block",width:"300px",height:"100px"}}>
                                    <center>select influence type</center>
                                    <select>
                                        <option>attention</option>
                                        <option>belief</option>
                                        <option>ontology</option>
                                        <option>advice</option>
                                    </select>
                                </div>

                                <div style={{border:"1px dashed grey",display:"inline-block",width:"300px",height:"100px"}}>
                                    <center>select context</center>
                                    <select>
                                        <option>everything</option>
                                        <option>open standards</option>
                                    </select>
                                </div>
                            </div>
                        </center>

                        <center>
                            <div>
                                <div style={{border:"1px dashed grey",display:"inline-block",width:"1000px",height:"700px"}}>
                                    <center>graph</center>
                                </div>

                                <div style={{border:"1px dashed grey",display:"inline-block",width:"500px",height:"700px"}}>
                                    <center>Control Panel</center>
                                </div>
                            </div>
                        </center>

                    </div>
                </fieldset>
            </>
        );
    }
}
