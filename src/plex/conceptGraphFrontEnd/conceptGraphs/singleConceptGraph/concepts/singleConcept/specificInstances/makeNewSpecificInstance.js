import React from "react";
import Masthead from '../../../../../../mastheads/conceptGraphMasthead_frontEnd.js';
import LeftNavbar1 from '../../../../../../navbars/leftNavbar1/conceptGraphFront_leftNav1';
import LeftNavbar2 from '../../../../../../navbars/leftNavbar2/cgFe_singleConcept_specificInstances_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../../../../lib/ipfs/conceptGraphInMfsFunctions.js'
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";

const jQuery = require("jquery");

const uiSchema = {
    address: { 'ui:widget': 'hidden' },
}

const onFormSubmit = ({formData}, e) => {
}

const onFormChange = ({formData}, e) => {
}

export default class MakeNewSpecificInstance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
            oJSONSchema: {},
            oBlankForm: {}
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var conceptSlug = this.props.match.params.conceptslug;
        if (conceptSlug=="current") {
            conceptSlug = window.frontEndConceptGraph.viewingConcept.slug

        }
        var viewingConceptGraph_ipns = window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph;
        var oConcept = await ConceptGraphInMfsFunctions.lookupWordBySlug_specifyConceptGraph(viewingConceptGraph_ipns,conceptSlug)
        var jsonSchema_slug = oConcept.conceptData.nodes.JSONSchema.slug;
        var oJSONSchema = window.lookupWordBySlug[jsonSchema_slug];
        this.setState({oJSONSchema: oJSONSchema})
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                    <div className="mainPanel" >
                        <Masthead viewingConceptGraphTitle={this.state.viewingConceptGraphTitle} />
                        <div class="h2">Make New Specific Instance</div>

                        <center>
                            <div style={{width:"600px",display:"inline-block",textAlign:"left"}} >
                                <Form
                                    schema={this.state.oJSONSchema}
                                    validator={validator}
                                    formData={this.state.oBlankForm}
                                    onSubmit={onFormSubmit}
                                    onChange={onFormChange}
                                    uiSchema={uiSchema}
                                    liveOmit
                                    omitExtraData
                                />
                            </div>
                        </center>

                    </div>
                </fieldset>
            </>
        );
    }
}
