import React from "react";
import * as MiscFunctions from '../functions/miscFunctions.js';
const jQuery = require("jquery");

const linkifySingleLevel = (obj,p) => {
    // var path = "";
    var newHTML = "";
    newHTML += "{";
    jQuery.each( obj, function( key, value ) {
        var path = p+"."+key;
        newHTML += "<div style='margin-left:30px;' >";
        var valueType = typeof value;
        if (jQuery.isArray(value)) {
            valueType = "array";
        }
        var thisPath = ""+path;
        newHTML += "<div id='"+key+"' data-key='"+key+"' data-path='"+thisPath+"' class=linkifyObjectButton >";
        newHTML += key + ": ";
        newHTML += "</div>";
        if (valueType=="array") {
            newHTML += " [] <br>";
        }
        if (valueType=="string") {
            newHTML += " \"\" <br>";
        }
        if (valueType=="object") {
            // newHTML += valueType;
            // newHTML += "<div style='margin-left:5px;display:inline-block;border:1px solid blue' >";
            newHTML += linkifySingleLevel(value,path);
            // newHTML += "</div>";
        }
        // newHTML += "<br>";
        newHTML += "</div>";
    });
    newHTML += "}<br>";


    return newHTML;
}

export default class ObjectLinkify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            objectToLinkifyEmpty: this.props.objectToLinkifyEmpty,
            objectToLinkifyFull: this.props.objectToLinkifyFull
        }
    }

    componentDidMount() {
        var objectToLinkifyEmpty = this.state.objectToLinkifyEmpty;
        var objectToLinkifyFull = this.state.objectToLinkifyFull
        var linkifiedObjectHTML = "";
        linkifiedObjectHTML += "<center>Linkified: this.state (empty)</center>";
        linkifiedObjectHTML += linkifySingleLevel(objectToLinkifyEmpty,"")

        jQuery("#linkifiedObjectContainer").html(linkifiedObjectHTML)
        jQuery(".linkifyObjectButton").click(function(){
            var path = jQuery(this).data("path")
            // alert("linkifyObjectButton clicked; path: "+path)
            var stringifiedValueHTML = "";
            stringifiedValueHTML += "<center>Linkified: this.state (active)</center>";
            stringifiedValueHTML += "<center>";
            stringifiedValueHTML += path;
            stringifiedValueHTML += "</center>";
            var objectToDisplay = objectToLinkifyFull;
            var aPathSteps = path.split(".")
            var numSteps = aPathSteps.length;
            for (var s=1;s<numSteps;s++) {
                var nextStep = aPathSteps[s];
                objectToDisplay = MiscFunctions.cloneObj(objectToDisplay[nextStep])
            }
            // stringifiedValueHTML += "numSteps: "+numSteps;
            stringifiedValueHTML += JSON.stringify(objectToDisplay,null,4)
            jQuery("#stringifiedValueContainer").html(stringifiedValueHTML)
        })
    }

    render() {
        return (
            <>
                <pre id="linkifiedObjectContainer" style={{display:"inline-block",width:"350px",height:"100%",verticalAlign:"top",overflow:"scroll"}} >
                    linkified object
                </pre>
                <pre id="stringifiedValueContainer" style={{display:"inline-block",width:"350px",height:"100%",verticalAlign:"top",overflow:"scroll"}} >
                    click a link on the left panel to see the current contents of the object
                </pre>
            </>
        )
    }
}
