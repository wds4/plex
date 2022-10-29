import React from "react";

const jQuery = require("jquery");

export default class OverviewOfUpdates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewingConceptGraphTitle: window.frontEndConceptGraph.viewingConceptGraph.title,
        }
    }
    async componentDidMount() {

    }
    render() {
        return (
            <>
                <div >
                    <center>Overview of Updates</center>
                </div>
            </>
        );
    }
}
