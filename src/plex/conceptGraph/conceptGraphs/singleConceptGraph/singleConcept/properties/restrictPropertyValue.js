import React from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../../navbars/leftNavbar2/singleConcept_properties_leftNav2.js';
import * as MiscFunctions from '../../../../../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../../../../../functions/conceptGraphFunctions.js';
import JSONSchemaForm from 'react-jsonschema-form';
import sendAsync from '../../../../../renderer.js';
import schema from '../../../../../lib/json/JSONSchema/schemaTest.json';

const jQuery = require("jquery");
jQuery.DataTable = require("datatables.net");

const makeConcept1Selector = (aConcepts) => {
    var numConcepts = aConcepts.length;

    var selectorHTML = "";
    selectorHTML += "<select id='concept1Selector' >";
    for (var c=0;c<numConcepts;c++) {
        var conceptSlug = aConcepts[c];
        var oConcept = window.lookupWordBySlug[conceptSlug];
        var conceptName = oConcept.conceptData.name.singular;
        var conceptPropertyPath = oConcept.conceptData.propertyPath;
        var conceptIPNS = oConcept.metaData.ipns;
        selectorHTML += "<option ";
        selectorHTML += " data-conceptslug='"+conceptSlug+"' ";
        selectorHTML += " data-conceptname='"+conceptName+"' ";
        selectorHTML += " data-conceptpropertypath='"+conceptPropertyPath+"' ";
        selectorHTML += " data-conceptipns='"+conceptIPNS+"' ";
        selectorHTML += " >";
        selectorHTML += conceptName;
        selectorHTML += "</option>";
    }

    selectorHTML += "</select>";
    jQuery("#concept1SelectorContainer").html(selectorHTML)
    jQuery("#concept1Selector").change(function(){
        makeProperty1Selector();
        makeSet1Selector();
        makeConcept1SpecificInstancesList();
    })
}

const makeProperty1Selector = () => {
    var c1slug = jQuery("#concept1Selector option:selected").data("conceptslug");
    var oC1 = window.lookupWordBySlug[c1slug];

    var selectorHTML = "";
    selectorHTML += "<select id='property1Selector' >";

    var aUniquePropertyKeys = ConceptGraphFunctions.fetchUniqueTopLevelPropertyKeys(c1slug);
    for (var p=0;p<aUniquePropertyKeys.length;p++) {
        var nextUPK = aUniquePropertyKeys[p]
        selectorHTML += "<option ";
        // selectorHTML += " data-propertyslug='"+nextUPK+"' ";
        selectorHTML += " data-propertykey='"+nextUPK+"' ";
        selectorHTML += " >";
        selectorHTML += nextUPK;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";
    jQuery("#property1SelectorContainer").html(selectorHTML)

    jQuery("#property1Selector").change(function(){
        makeSet1Selector();
        makeConcept1SpecificInstancesList();
        makeHumanReadableSentence();
    })
}

const makeSet1Selector = () => {
    var c1slug = jQuery("#concept1Selector option:selected").data("conceptslug");
    var oC1 = window.lookupWordBySlug[c1slug];

    var supersetSlug = oC1.conceptData.nodes.superset.slug;
    var oSuperset = window.lookupWordBySlug[supersetSlug];
    var supersetName = oSuperset.supersetData.name;
    var supersetIPNS = oSuperset.metaData.ipns;

    var aSets = [];
    aSets = oSuperset.globalDynamicData.subsets;

    var selectorHTML = "";
    selectorHTML += "<select id='set1Selector' >";

    selectorHTML += "<option ";
    selectorHTML += " data-slug='"+supersetSlug+"' ";
    selectorHTML += " data-name='"+supersetName+"' ";
    selectorHTML += " data-ipns='"+supersetIPNS+"' ";
    selectorHTML += " >";
    selectorHTML += supersetName;
    selectorHTML += "</option>";

    for (var s=0;s<aSets.length;s++) {
        var setSlug = aSets[s];
        var oSet = window.lookupWordBySlug[setSlug];
        var setName = oSet.setData.name;
        var setIPNS = oSet.metaData.ipns;
        selectorHTML += "<option ";
        selectorHTML += " data-slug='"+setSlug+"' ";
        selectorHTML += " data-name='"+setName+"' ";
        selectorHTML += " data-ipns='"+setIPNS+"' ";
        selectorHTML += " >";
        selectorHTML += setName;
        selectorHTML += "</option>";

    }

    selectorHTML += "</select>";
    jQuery("#set1SelectorContainer").html(selectorHTML)
    jQuery("#set1Selector").change(function(){
        makeConcept1SpecificInstancesList();
        makeHumanReadableSentence()
    })
    try {
        makeHumanReadableSentence();
    } catch (e) {}
    //
}

const makeConcept1SpecificInstancesList = () => {

    var c1slug = jQuery("#concept1Selector option:selected").data("conceptslug");
    var oC1 = window.lookupWordBySlug[c1slug];
    var propertyPath = oC1.conceptData.propertyPath;

    var uniqueProperty = jQuery("#property1Selector option:selected").data("propertykey");

    var set1slug = jQuery("#set1Selector option:selected").data("slug");
    var oSet1 = window.lookupWordBySlug[set1slug];
    var aSpecificInstances = [];
    aSpecificInstances = oSet1.globalDynamicData.specificInstances;

    var specificInstancesHTML = "";
    for (var s=0;s<aSpecificInstances.length;s++) {
        var nextSpecificInstanceSlug = aSpecificInstances[s];
        var oNextSpecificInstance = window.lookupWordBySlug[nextSpecificInstanceSlug];
        var nextSPecificInstance = oNextSpecificInstance[propertyPath][uniqueProperty];
        specificInstancesHTML += nextSPecificInstance;
        specificInstancesHTML += "<br>";
    }

    jQuery("#concept1SpecificInstancesListContainer").html(specificInstancesHTML)
    // jQuery("#concept1SpecificInstancesListContainer").html("foo1<br>foo2")
    // jQuery("#property2Selector").change(function(){
        // makeHumanReadableSentence();
    // })

}

const makeConcept2Selector = (aConcepts) => {
    var numConcepts = aConcepts.length;

    var selectorHTML = "";
    selectorHTML += "<select id='concept2Selector' >";
    for (var c=0;c<numConcepts;c++) {
        var conceptSlug = aConcepts[c];
        var oConcept = window.lookupWordBySlug[conceptSlug];
        var conceptName = oConcept.conceptData.name.singular;
        var conceptIPNS = oConcept.metaData.ipns;
        selectorHTML += "<option ";
        selectorHTML += " data-conceptslug='"+conceptSlug+"' ";
        selectorHTML += " data-conceptname='"+conceptName+"' ";
        selectorHTML += " data-conceptipns='"+conceptIPNS+"' ";
        selectorHTML += " >";
        selectorHTML += conceptName;
        selectorHTML += "</option>";
    }

    selectorHTML += "</select>";
    jQuery("#concept2SelectorContainer").html(selectorHTML)
    jQuery("#concept2Selector").change(function(){
        makeProperty2Selector();
        // makeHumanReadableSentence();
    })
}

const detectProperty2Type = () => {
    // var p2Type = "dunno";

    var c2slug = jQuery("#concept2Selector option:selected").data("conceptslug");
    var oC2 = window.lookupWordBySlug[c2slug];
    var propertySchemaSlug = oC2.conceptData.nodes.propertySchema.slug;
    var oPropertySchema = window.lookupWordBySlug[propertySchemaSlug];

    var p2Type = jQuery("#property2Selector option:selected").data("propertytype");

    jQuery("#property2TypeContainer").html(p2Type)
}

const makeProperty2Selector = () => {
    var selectorHTML = "";
    selectorHTML += "<select id='property2Selector' >";

    var c2slug = jQuery("#concept2Selector option:selected").data("conceptslug");
    var oC2 = window.lookupWordBySlug[c2slug];
    var propertySchemaSlug = oC2.conceptData.nodes.propertySchema.slug;
    var oPropertySchema = window.lookupWordBySlug[propertySchemaSlug];
    var aPropertySchemaWords = oPropertySchema.schemaData.nodes;
    for (var w=0;w<aPropertySchemaWords.length;w++) {
        var nextWordSlug = aPropertySchemaWords[w].slug;
        var oNextWord = window.lookupWordBySlug[nextWordSlug];
        if (oNextWord.hasOwnProperty("propertyData")) {
            var nextPropertyName = oNextWord.propertyData.name;
            var nextPropertyKey = oNextWord.propertyData.key;
            if ( (oNextWord.propertyData.type=="string") || (oNextWord.propertyData.type=="array") ) {
                selectorHTML += "<option ";
                selectorHTML += " data-propertyslug='"+nextWordSlug+"' ";
                selectorHTML += " data-propertyname='"+nextPropertyName+"' ";
                selectorHTML += " data-propertykey='"+nextPropertyKey+"' ";
                selectorHTML += " data-propertytype='"+oNextWord.propertyData.type+"' ";
                selectorHTML += " data-propertyipns='"+oNextWord.metaData.ipns+"' ";
                selectorHTML += " >";
                selectorHTML += nextPropertyName;
                selectorHTML += "</option>";
            }
        }
    }

    selectorHTML += "</select>";
    jQuery("#property2SelectorContainer").html(selectorHTML)
    jQuery("#property2Selector").change(function(){
        makeHumanReadableSentence();
        detectProperty2Type()
    })
    detectProperty2Type()

    var sPropertySchema = JSON.stringify(oPropertySchema,null,4)
    jQuery("#restrictedConceptPropertySchemaTextarea_unedited").val(sPropertySchema)
}

const makeHumanReadableSentence = () => {
    console.log("makeHumanReadableSentence triggered")
    var c1slug = jQuery("#concept1Selector option:selected").data("conceptslug");
    var oC1 = window.lookupWordBySlug[c1slug];

    var s1slug = jQuery("#set1Selector option:selected").data("slug");
    var oS1 = window.lookupWordBySlug[s1slug];

    // var p1slug = jQuery("#property1Selector option:selected").data("propertyslug");
    // var oP1 = window.lookupWordBySlug[p1slug];

    var c2slug = jQuery("#concept2Selector option:selected").data("conceptslug");
    console.log("c2slug: "+c2slug)
    var oC2 = window.lookupWordBySlug[c2slug];

    var p2slug = jQuery("#property2Selector option:selected").data("propertyslug");
    console.log("p2slug: "+p2slug)
    var oP2 = window.lookupWordBySlug[p2slug];

    var dependenciesValue = jQuery("#dependenciesSelector option:selected").val();
    var subsetValue = jQuery("#subsetSelector option:selected").val();

    var c1SpecificInstances = jQuery("#concept1SpecificInstancesListContainer").html();
    var aC1SpecificInstances = c1SpecificInstances.split("<br>");

    var c1Name = "";
    try {
        c1Name = oC1.conceptData.name.singular;
    } catch (e) { }

    var c2Name = "";
    try {
        c2Name = oC2.conceptData.name.singular;
    } catch (e) { }

    var s1Name = "";
    try {
        s1Name = oS1.setData.name;
    } catch (e) {
        s1Name = oS1.supersetData.name;
    }

    var p2Name = "";
    try {
        p2Name = oP2.propertyData.name;
    } catch (e) {}

    var sentenceHTML = "";
    sentenceHTML += "Any given "+c2Name+"'s "+p2Name+" must be one of the following options: ";
    for (var s=0;s<aC1SpecificInstances.length;s++) {
        var nextSI = aC1SpecificInstances[s];
        sentenceHTML += nextSI;
        if (s+2 < aC1SpecificInstances.length) {
            sentenceHTML += ", ";
        }
    }
    sentenceHTML += "<br>";
    sentenceHTML += "The choice of option will ";
    if (dependenciesValue=="no") {
        sentenceHTML += "NOT ";
    }
    sentenceHTML += "trigger option-specific expoundification with additional details.";
    sentenceHTML += ". ";

    jQuery("#humanReadableSentenceContainer").html(sentenceHTML)

    makeNewRelationship();
}

const makeNewRelationship = () => {
    console.log("makeNewRelationship triggered")
    var c1slug = jQuery("#concept1Selector option:selected").data("conceptslug");
    var c2slug = jQuery("#concept2Selector option:selected").data("conceptslug");

    var s1ipns = jQuery("#set1Selector option:selected").data("ipns");
    var p2ipns = jQuery("#property2Selector option:selected").data("propertyipns");

    var c1PropertyPath = jQuery("#concept1Selector option:selected").data("conceptpropertypath");

    var s1slug = jQuery("#set1Selector option:selected").data("slug");
    var p2slug = jQuery("#property2Selector option:selected").data("propertyslug");
    var p1key = jQuery("#property1Selector option:selected").data("propertykey");
    // var p2key = jQuery("#property2Selector option:selected").data("propertykey");

    var p2type = jQuery("#property2TypeContainer").html();

    var dependenciesValue = jQuery("#dependenciesSelector option:selected").val();
    var subsetValue = jQuery("#subsetSelector option:selected").val();

    var dV = false;
    if (dependenciesValue=="yes") {
        dV = true;
    }
    var sV = false;
    if (subsetValue=="yes") {
        sV = true;
    }

    var uniqueID = s1ipns.substring(s1ipns.length - 6) + "_restrictsValue_" + p2ipns.substring(p2ipns.length - 6) ;

    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipTypes.restrictsValue);
    oNewRel.nodeFrom.slug = s1slug;
    oNewRel.relationshipType.restrictsValueData.uniqueID = uniqueID;
    oNewRel.relationshipType.restrictsValueData.targetPropertyType = p2type;
    oNewRel.relationshipType.restrictsValueData.propertyPath = c1PropertyPath;
    oNewRel.relationshipType.restrictsValueData.uniquePropertyKey = p1key;
    oNewRel.relationshipType.restrictsValueData.withSubsets = sV;
    oNewRel.relationshipType.restrictsValueData.withDependencies = dV;

    oNewRel.nodeTo.slug = p2slug;

    var sNewRel = JSON.stringify(oNewRel,null,4);
    jQuery("#newRelTextarea").val(sNewRel);

    // add rel to main schema
    var sSchema = jQuery("#restrictedConceptPropertySchemaTextarea_unedited").val()
    var oSchema = JSON.parse(sSchema)
    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNewRel,window.lookupWordBySlug);
    var sSchema_updated = JSON.stringify(oSchema,null,4)

    jQuery("#restrictedConceptPropertySchemaTextarea_edited").val(sSchema_updated)

    displayOldPrimaryPropertyWithForm();
}

const displayOldPrimaryPropertyWithForm = () => {
    try {
        var c2slug = jQuery("#concept2Selector option:selected").data("conceptslug");
        var p2key = jQuery("#property2Selector option:selected").data("propertykey");
        var p2type = jQuery("#property2Selector option:selected").data("propertytype");

        var oC2 = window.lookupWordBySlug[c2slug];
        var primaryProperty2Slug = oC2.conceptData.nodes.primaryProperty.slug;
        var oPP2 = window.lookupWordBySlug[primaryProperty2Slug];
        var oPP2_updated = MiscFunctions.cloneObj(oPP2)

        // oPP2_updated.propertyData.properties[p2key].enum = []

        if (p2type=="string") {
            oPP2_updated.propertyData.properties[p2key].enum = []
        }
        if (p2type=="array") {
            oPP2_updated.propertyData.properties[p2key].items = []
        }


        var c1SpecificInstances = jQuery("#concept1SpecificInstancesListContainer").html();
        var aC1SpecificInstances = c1SpecificInstances.split("<br>");
        // console.log("aC1SpecificInstances.length: "+aC1SpecificInstances.length)
        for (var s=0;s<aC1SpecificInstances.length - 1;s++) {
            // console.log("aC1SpecificInstances; s:"+s+"; ==> "+aC1SpecificInstances[s])
            var foo = aC1SpecificInstances[s];
            // oPP2_updated.propertyData.properties[p2key].enum.push(foo)

            if (p2type=="string") {
                oPP2_updated.propertyData.properties[p2key].enum.push(foo)
            }
            if (p2type=="array") {
                oPP2_updated.propertyData.properties[p2key].items.push(foo)
            }

        }

        var sPP2 = JSON.stringify(oPP2,null,4);
        var sPP2_updated = JSON.stringify(oPP2_updated,null,4);

        jQuery("#primaryPropertyTextarea_unedited").val(sPP2);
        jQuery("#primaryPropertyTextarea_edited").val(sPP2_updated);

        ReactDOM.render(<JSONSchemaForm schema={oPP2_updated.propertyData} />,
            document.getElementById("displayOldPrimaryPropertyWithForm_updated")
        )

        ReactDOM.render(<JSONSchemaForm schema={oPP2.propertyData} />,
            document.getElementById("displayOldPrimaryPropertyWithForm_unedited")
        )
    } catch (e) {}
}

export default class RestrictPropertyValue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var conceptGraphMainSchemaSlug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug;
        var oConceptGraphMainSchema = window.lookupWordBySlug[conceptGraphMainSchemaSlug];
        var aConcepts = oConceptGraphMainSchema.conceptGraphData.concepts;

        makeConcept1Selector(aConcepts);
        makeProperty1Selector();
        makeSet1Selector();
        makeConcept1SpecificInstancesList();


        makeConcept2Selector(aConcepts);
        makeProperty2Selector();

        makeHumanReadableSentence();

        displayOldPrimaryPropertyWithForm();

        jQuery("#dependenciesSelector").change(function(){
            makeHumanReadableSentence();
        })

        jQuery("#subsetSelector").change(function(){
            makeHumanReadableSentence();
        })

        jQuery("#addRestrictionButton").click(function(){
            var sSchema = jQuery("#restrictedConceptPropertySchemaTextarea_edited").val();
            console.log("addRestrictionButton; sSchema: "+sSchema)
            var oSchema = JSON.parse(sSchema);
            MiscFunctions.createOrUpdateWordInAllTables(oSchema)
        })



    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Restrict Property Value</div>

                        <div style={{display:"inline-block",width:"450px",height:"200px",padding:"5px",border:"1px dashed grey"}}>
                            <center>Restricting Concept</center>

                            <div className="styleFContainer">
                                <div className="leftColStyleF" >concept:</div>
                                <div id="concept1SelectorContainer" className="rightColStyleF" >selector:</div>
                            </div>

                            <div className="styleFContainer">
                                <div className="leftColStyleF" >unique property:</div>
                                <div id="property1SelectorContainer" className="rightColStyleF" >selector:</div>
                            </div>

                            <div className="styleFContainer">
                                <div className="leftColStyleF" >set:</div>
                                <div id="set1SelectorContainer" className="rightColStyleF" >selector:</div>
                            </div>

                            <div className="styleFContainer">
                                <div className="leftColStyleF" >specific instances:</div>
                                <div id="concept1SpecificInstancesListContainer" className="rightColStyleF" style={{height:"75px",overflow:"scroll",backgroundColor:"white"}} >specific instances</div>
                            </div>
                        </div>

                        <div style={{display:"inline-block",width:"450px",height:"200px",padding:"5px",border:"1px dashed grey"}}>
                            <center>Restricted Concept</center>

                            <div className="styleFContainer">
                                <div className="leftColStyleF" >concept:</div>
                                <div id="concept2SelectorContainer" className="rightColStyleF" >selector:</div>
                            </div>

                            <div className="styleFContainer">
                                <div className="leftColStyleF" >property:</div>
                                <div id="property2SelectorContainer" className="rightColStyleF" >selector:</div>
                            </div>

                            <div className="styleFContainer">
                                <div className="leftColStyleF" >property type:</div>
                                <div id="property2TypeContainer" className="rightColStyleF"style={{backgroundColor:"white"}} >property2TypeContainer</div>
                            </div>

                        </div>

                        <div style={{display:"inline-block",width:"450px",height:"200px",padding:"5px",border:"1px dashed grey"}}>
                            <center>Form Options</center>

                            <div className="styleFContainer">
                                <div className="leftColStyleF" >dependencies?:</div>
                                <div className="rightColStyleF" >
                                    <select id="dependenciesSelector" name="dependenciesSelector" >
                                        <option value="yes" >yes</option>
                                        <option value="no" >no</option>
                                    </select>
                                </div>
                            </div>

                            <div className="styleFContainer">
                                <div className="leftColStyleF" >subsets?:</div>
                                <div className="rightColStyleF" >
                                    <select id="subsetSelector" name="subsetSelector" >
                                        <option value="yes" >yes</option>
                                        <option value="no" >no</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <br/>

                        <div style={{display:"inline-block",width:"1350px",height:"100px",padding:"5px 10px 5px 10px",border:"1px dashed grey"}}>
                            <div id="humanReadableSentenceContainer">humanReadableSentenceContainer</div>
                            <div id="addRestrictionButton" className="doSomethingButton_small" >ADD RESTRICTION</div> (adds new relationship to the restricted concept's propertySchema)
                        </div>

                        <br/>

                        <div style={{display:"inline-block",width:"450px",height:"600px",padding:"5px",border:"1px dashed grey"}}>
                            old propertySchema<br/>
                            <textarea id="restrictedConceptPropertySchemaTextarea_unedited" style={{width:"95%",height:"200px"}}>restrictedConceptPropertySchemaTextarea_unedited</textarea>
                            new relationship<br/>
                            <textarea id="newRelTextarea" style={{width:"95%",height:"100px"}}>newRelTextarea</textarea>
                            updated propertySchema<br/>
                            <textarea id="restrictedConceptPropertySchemaTextarea_edited" style={{width:"95%",height:"200px"}}>restrictedConceptPropertySchemaTextarea_edited</textarea>
                        </div>

                        <div style={{display:"inline-block",width:"450px",height:"600px",padding:"5px",border:"1px dashed grey"}}>
                            <div style={{display:"inline-block",width:"95%",height:"400px",padding:"1px",border:"1px solid black",overflow:"scroll"}}>
                                <div id="displayOldPrimaryPropertyWithForm_unedited"></div>
                            </div>
                            <br/>
                            old primary property<br/>
                            <textarea id="primaryPropertyTextarea_unedited" style={{width:"95%",height:"100px"}}>primaryPropertyTextarea_unedited</textarea>

                        </div>

                        <div style={{display:"inline-block",width:"450px",height:"600px",padding:"5px",border:"1px dashed grey"}}>
                            <div style={{display:"inline-block",width:"95%",height:"400px",padding:"1px",border:"1px solid black",overflow:"scroll"}}>
                                <center>updated form</center>
                                <div id="displayOldPrimaryPropertyWithForm_updated"></div>
                            </div>
                            <br/>
                            updated primary property<br/>
                            <textarea id="primaryPropertyTextarea_edited" style={{width:"95%",height:"100px"}}>primaryPropertyTextarea_edited</textarea>

                        </div>


                    </div>
                </fieldset>
            </>
        );
    }
}
