import React from "react";
import Masthead from '../../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../../navbars/leftNavbar2/cgFe_singleConcept_specificInstances_leftNav2';

const jQuery = require("jquery");

var example_a = {
    wordData: {
        slug: "user_Alice",
        wordTypes: [
            "word",
            "user"
        ]
    },
    userData: {
        name: "Alice",
        title: null
    }
}

var example_b = {
    wordData: {
        slug: "specificInstancesArrayFor_user",
        wordTypes: [
            "word",
            "specificInstancesArray",
            "aUser"
        ]
    },
    specificInstancesArrayData: {
        concept: {
            slug: "conceptFor_user"
        }
    },
    aUserData: [
        {
            name: "Alice",
            title: null
        },
        {
            name: "Bob",
            title: null
        }
    ]
}

var example_c = {
    wordData: {},
    specificInstanceDigestFileData: {
        specificInstanceDigestFileType: {
            slug: "siDigestFileTypeFor_widgets_abc123",
            type: "csv",
            ipns: "sdf789"
        }
    }
}

var example_d = {
    wordData: {},
    supersetData: {},
    globalDynamicData: {
        specificInstances: [
            "abcde12345",
            "qwert73562"
        ]
    }
}
var example_e = {
    wordData: {
        slug: "siDigestFileTypeFor_widgets_abc123"
    },
    specificInstanceDigestFileTypeData: {
        title: "Widget Quality Ratings Summary",
        description:"used on page XYZ which lists the top 10 widgets of all time",
        concept: {
            slug: "conceptFor_widget",
            ipns: "abc123"
        },
        type: "csv",
        items: [
            {
                name: "title",
                description: "",
                source: {
                    concept: "conceptFor_widget",
                    path: "widgetData.title"
                }
            },
            {
                name: "average",
                description: "",
                source: {
                    concept: "conceptFor_widgetQualityCompositeScores",
                    path: "widgetQualityCompositeScoreData.average"
                }
            },
            {
                name: "certainty",
                description: "",
                source: {
                    concept: "conceptFor_widgetQualityCompositeScores",
                    path: "widgetQualityCompositeScoreData.certainty"
                }
            }
        ]

    }
}


export default class SpecificInstanceDigestsMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        jQuery("#example_a").html(JSON.stringify(example_a,null,4))
        jQuery("#example_b").html(JSON.stringify(example_b,null,4))
        jQuery("#example_c").html(JSON.stringify(example_c,null,4))
        jQuery("#example_d").html(JSON.stringify(example_d,null,4))
        jQuery("#example_e").html(JSON.stringify(example_e,null,4))
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">Specific Instance Digests: Main Page</div>
                        <div style={{fontSize:"12px"}} >
                            A Specific Instance Digest is a specific type of file, usually a .csv file, that contains selected information about each specific instance
                            that is in a given set (either direct or indirect specific instances of that set).
                            <br/>
                            In general, there is a spectrum of methods to look up information about specific instances in the concept graph, ranging from most compact to most detailed:
                            <li>A: Individual nodes (i.e. words) which exist at the distal end of a Loki Pathway and contains extensive information about that specific instance.</li>
                            <li>B: Specific Instance Array file. This contains all the same information and in the same format as A, but </li>
                            <li>C: Specific Instance Digests</li>
                            <li>D: oSet or oSuperset.globalDynamicData.specificInstances (or .directSpecificInstances) - a simple list of slugs</li>
                            Each Specific Instance Digest will correspond to a Specific Instance File Type, the specification of which will be located within that concept's propertySchema.
                        </div>

                        <div style={{fontSize:"12px"}} >
                            <div style={{display:"inline-block",width:"15%",height:"600px",border:"1px dashed grey"}} >
                                <center>A: traditional specific instance</center>
                                <pre id="example_a" style={{width:"95%",height:"90%",border:"1px solid purple"}} >

                                </pre>
                            </div>

                            <div style={{display:"inline-block",width:"25%",height:"600px",border:"1px dashed grey"}} >
                                <center>B: specific instances array</center>
                                <div>
                                    The purpose of this file is to simplify things by merging multiple files into one file. However, not sure how much utility this will see.
                                </div>
                                <pre id="example_b" style={{width:"95%",height:"80%",border:"1px solid purple"}} >
                                </pre>
                            </div>

                            <div style={{display:"inline-block",width:"30%",height:"600px",border:"1px dashed grey"}} >
                                <center>C: specific instance digest</center>
                                <div style={{fontSize:"10px",padding:"5px"}} >
                                    This will probably turn out to be very useful, with large datasets summarized efficiently in one file.
                                    One of its advantages is that information can be culled from multiple sources, e.g. username & peerID from concepFor_user and
                                    influence, average score, etc from one or even more sources.
                                </div>
                                <pre id="example_c" style={{width:"95%",height:"60%",border:"1px solid purple"}} >
                                </pre>
                                File with cid sdf789:
                                <pre style={{width:"95%",height:"20%",border:"1px solid purple"}} >
                                name,influence,average,certainty,input<br/>
                                Alice,0.72,0.9,0.8,1.3<br/>
                                Bob,0.63,0.9,0.7,1.1
                                </pre>
                            </div>

                            <div style={{display:"inline-block",width:"20%",height:"600px",border:"1px dashed grey"}} >
                                <center>D: superset</center>
                                <pre id="example_d" style={{width:"95%",height:"90%",border:"1px solid purple"}} >
                                </pre>
                            </div>

                            <div style={{display:"inline-block",width:"40%",height:"600px",border:"1px dashed grey"}} >
                                <center>C-appendix: specific instance digest File Type</center>
                                <div>
                                    These files are found in propertySchema. Note:
                                    <li>there can be multiple Digest File Types for any given concept, e.g.: one that stores userTrustCompositeScore data with settings1: (rigor=r1,seedUser=peer1, ...) another with settings2: (rigor=r2,seedUser=peer2,...) </li>
                                    <li>information can be pulled from external concepts (not just from the specific instance files themselves)</li>
                                </div>
                                <pre id="example_e" style={{width:"95%",height:"90%",border:"1px solid purple"}} >
                                </pre>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
