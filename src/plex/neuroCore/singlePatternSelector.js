import React from 'react';
import { manageSinglePatternSelectorCheckboxes } from './uiFunctions.js'
import sendAsync from '../renderer.js'

const jQuery = require("jquery");

/*
const updateSinglePatternSelector = (oPatterns) => {
    var newHTML = "";
    newHTML += "updated HTML; oPatterns: "+oPatterns.patterns.opCodeC.s1r[1];
    newHTML += "\n\n\n\n";
    return newHTML;
}
*/

export default class SinglePatternSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patterns: this.props.dataParentToChild
        }
    }

    componentDidMount() {
        var topLevel = this.state.patterns.patternsSelector.topLevel;
        jQuery("#allPatterns").prop("checked",true);
        jQuery("#allOpCodeB").prop("checked",true)
        jQuery("#allOpCodeC").prop("checked",true)
        manageSinglePatternSelectorCheckboxes(topLevel)
        // alert("SinglePatternSelector")
    }

    render() {
        const {patterns} = this.state;
        var oPatterns = this.state;
        const numPatterns = patterns.opCodeC.s2r.length;
        var names = ["Alice","Bob"]
        var aS1n = patterns.opCodeC.s1n;
        var aS1r = patterns.opCodeC.s1r;
        var aS2r = patterns.opCodeC.s2r;
        // var singlePatternHTML = updateSinglePatternSelector(oPatterns)
        return (
          <>
            <div>
                <center>Single Pattern Selector</center>
                <div className="s1nDisplayBox" >
                    single node
                    {aS1n.map(function(name, index){
                        return (
                            <>
                                <div>
                                    <input className="singlePatternCheckbox" id={name} data-index={index} data-name={name} name="singlePatternSelector"  type="checkbox" />
                                    <label class="ncmp-radio-checkbox-label" >{name}</label>
                                </div>
                            </>
                        )
                    })}
                </div>

                <div className="s1rDisplayBox" >
                    single relationship
                    {aS1r.map(function(name, index){
                        return (
                            <>
                                <div>
                                    <input className="singlePatternCheckbox" id={name} data-index={index} data-name={name} name="singlePatternSelector"  type="checkbox" />
                                    <label class="ncmp-radio-checkbox-label" >{name}</label>
                                </div>
                            </>
                        );
                    })}
                </div>

                <div className="s2rDisplayBox" >
                    double-relationship
                    {aS2r.map(function(name, index){
                        return (
                            <>
                                <div>
                                    <input className="singlePatternCheckbox" id={name} data-index={index} data-name={name} name="singlePatternSelector" type="checkbox" />
                                    <label class="ncmp-radio-checkbox-label" >{name}</label>
                                </div>
                            </>
                        );
                    })}
                </div>
            </div>

          </>
        );
    }
}
