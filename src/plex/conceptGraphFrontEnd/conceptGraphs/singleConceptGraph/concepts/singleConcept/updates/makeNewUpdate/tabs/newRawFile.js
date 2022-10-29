import React from "react";

const jQuery = require("jquery");

/*
updateTypes:
word
    schema
        mainSchema
        propertySchema
    concept

*/

var updateRawFile1 = {
    updateData: {
        updateType: "mainSchema",
        keywords: [],
        comments: null,
        baseSchemaData: {
            title: {
                primary: null,
                alternates: []
            },
            slug: {
                primary: null,
                alternates: []
            },
            ipns: {
                primary: null,
                synonyms: []
            },
            parentConcept: {
                title: {
                    primary: null,
                    alternates: []
                },
                slug: {
                    primary: null,
                    alternates: []
                },
                ipns: {
                    primary: null,
                    synonyms: []
                }
            },
            prerequisites: {
                sets: [],
                specificInstances: [],
                relationships: [],
                relationshipTypes: []
            }
        },
        updates: {
            additions: {
                nodes: [],
                relationships: [],
                relationshipTypes: [],
                topLevelFields: {
                    slug: null,
                    name: null,
                    title: null,
                    description: null
                }
            },
            subtractions: {
                nodes: [],
                relationships: [],
                relationshipTypes: [],
                topLevelFields: []
            },
            substitutions: {
                nodes: [],
                relationships: [],
                relationshipTypes: [],
                topLevelFields: {
                    slug: null,
                    name: null,
                    title: null,
                    description: null
                }
            }
        },
        submissionTime: null
    }
}

var updateRawFile2 = {
    updateData: {
        updateType: "concept",
        baseConceptData: {
            title: {
                primary: null,
                alternates: [],
            },
            ipns: {
                primary: null,
                synonyms: []
            },
            prerequisites: {

            }
        },
        updates: {
            additions: {
                topLevelFields: []
            },
            subtractions: {
                topLevelFields: []
            },
            substitutions: {
                topLevelFields: []
            }
        },
        submissionTime: null
    }
}

export default class NewUpdateRawFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
        }
    }
    async componentDidMount() {
        /*
        jQuery("#generateNewRawFileButton").click(function(){
            console.log("generateNewRawFileButton")
        })
        var oUpdateSchema = this.props.oUpdateSchema;
        jQuery("#newUpdateRawFileContainer").val(JSON.stringify(oUpdateSchema,null,4))
        */
    }
    render() {
        return (
            <>
                <div >
                    <center>Update: new rawFile</center>
                    <textarea id="newUpdateRawFileContainer1" style={{width:"95%",height:"300px"}} >{JSON.stringify(updateRawFile1,null,4)}</textarea>
                    <textarea id="newUpdateRawFileContainer2" style={{width:"95%",height:"300px"}} >{JSON.stringify(updateRawFile1,null,4)}</textarea>
                </div>
            </>
        );
    }
}
