import React from "react";
import ReactDOM from 'react-dom';
import { Link } from "react-router-dom";
import ConceptGraphMasthead from '../../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../../navbars/leftNavbar2/singleConceptGraph_leftNav2.js';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import * as ConceptGraphFunctions from '../../../../functions/conceptGraphFunctions.js';
import JSONSchemaForm from 'react-jsonschema-form';
import sendAsync from '../../../../renderer.js';
import schema from '../../../../lib/json/JSONSchema/schemaTest.json';

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
        var conceptNamePlural = oConcept.conceptData.name.plural;
        var conceptPropertyPath = oConcept.conceptData.propertyPath;
        var conceptIPNS = oConcept.metaData.ipns;
        selectorHTML += "<option ";
        selectorHTML += " data-conceptslug='"+conceptSlug+"' ";
        selectorHTML += " data-conceptname='"+conceptName+"' ";
        selectorHTML += " data-conceptnameplural='"+conceptNamePlural+"' ";
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
        makeRestrictingConceptMainSchemaUneditedTextarea();
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
        if (oSet.hasOwnProperty("setData")) {
            var setName = oSet.setData.name;
        }
        if (oSet.hasOwnProperty("supersetData")) {
            var setName = oSet.supersetData.name;
        }
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
        if (oNextSpecificInstance.hasOwnProperty(propertyPath)) {
            var nextSPecificInstance = oNextSpecificInstance[propertyPath][uniqueProperty];
        } else {
            var nextSPecificInstance = nextSpecificInstanceSlug + " missing "+propertyPath;
        }
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
        makeHumanReadableSentence();
    })
    /*
    jQuery("#concept1Selector").change(function(){
        makeProperty1Selector();
        makeSet1Selector();
        makeConcept1SpecificInstancesList();
    })
    */
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
                selectorHTML += " ("+nextWordSlug+") ";
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
    var s1name = s1slug;
    if (oS1.hasOwnProperty("setData")) {
        s1name = oS1.setData.name;
    }
    if (oS1.hasOwnProperty("supersetData")) {
        s1name = oS1.supersetData.name;
    }

    var p1key = jQuery("#property1Selector option:selected").data("propertykey");
    // var oP1 = window.lookupWordBySlug[p1slug];

    var c2slug = jQuery("#concept2Selector option:selected").data("conceptslug");
    console.log("c2slug: "+c2slug)
    var oC2 = window.lookupWordBySlug[c2slug];

    var p2slug = jQuery("#property2Selector option:selected").data("propertyslug");
    console.log("p2slug: "+p2slug)
    var oP2 = window.lookupWordBySlug[p2slug];

    var dependenciesValue = jQuery("#dependenciesSelector option:selected").val();
    if (dependenciesValue=="yes") {
        jQuery("#dependenciesTypeSelector").css("display","inline-block")
    }
    if (dependenciesValue=="no") {
        jQuery("#dependenciesTypeSelector").css("display","none")
    }
    var dependenciesTypeValue = jQuery("#dependenciesTypeSelector option:selected").val();

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

    var c1PropertyPath = "";
    try {
        c1PropertyPath = oC1.conceptData.propertyPath;
    } catch (e) { }

    var c2PropertyPath = "";
    try {
        c2PropertyPath = oC2.conceptData.propertyPath;
    } catch (e) { }

    var sentenceHTML = "";
    sentenceHTML += "A given <span style=color:blue; >"+c2Name+"</span>'s <span style=color:purple; >"+p2Name+"</span> will be specified using the ";
    sentenceHTML += "<span style=color:red; >" + p1key + "</span> of a specific <span style=color:green; >"+c1Name+"</span>";
    sentenceHTML += " which must be a member of the *set: "+s1name + ".";
    sentenceHTML += "<br>(A given <span style=color:blue; >"+c2Name+"</span>'s <span style=color:purple; >"+p2Name+"</span> can only be one of the options listed in the orange box). ";
    for (var s=0;s<aC1SpecificInstances.length;s++) {
        var nextSI = aC1SpecificInstances[s];
        // sentenceHTML += nextSI;
        if (s+2 < aC1SpecificInstances.length) {
            // sentenceHTML += ", ";
        }
    }
    // sentenceHTML += "<br>";
    jQuery("#humanReadableSentenceContainer").html(sentenceHTML)

    var sentence2HTML = "";
    sentence2HTML += "The choice of option will ";
    if (dependenciesValue=="no") {
        sentence2HTML += "NOT trigger additional option-specific details.";
    }
    if (dependenciesValue=="yes") {
        // sentence2HTML += "trigger additional option-specific details under the heading: <span style=color:green; >"+c1PropertyPath+"</span>. In the form, these will be located ";
        sentence2HTML += "trigger additional option-specific details (usually under the heading: [the option you picked]Data). In the form, these will be located ";
        if (dependenciesTypeValue=="1") {
            sentence2HTML += "alongside the property (<span style=color:purple; >"+p2Name+"</span>) (lower level).";
        }
        if (dependenciesTypeValue=="2") {
            sentence2HTML += "alongside the concept <span style=color:blue; >"+c2PropertyPath+"</span> (upper level)";
            // sentence2HTML += "alongside the concept (usually under the heading: [the option you picked]Data) (upper level)";
        }
    }

    jQuery("#humanReadableSentence2Container").html(sentence2HTML)

    makeNewRelationships();
    // editEnumeration();
}
/*
const editEnumeration = () => {
    var sEnumerationUnedited = jQuery("#enumerationTextarea_unedited").val();
    var oEnumeration = JSON.parse(sEnumerationUnedited);

    var sEnumerationEdited = JSON.stringify(oEnumeration,null,4)
    jQuery("#enumerationTextarea_edited").val(sEnumerationEdited);
}
*/

const makeNewRelationships = () => {
    console.log("makeNewRelationships triggered")
    var c1slug = jQuery("#concept1Selector option:selected").data("conceptslug");
    var c1namePlural = jQuery("#concept1Selector option:selected").data("conceptnameplural");
    var c2slug = jQuery("#concept2Selector option:selected").data("conceptslug");

    var oC1 = window.lookupWordBySlug[c1slug];
    var oC2 = window.lookupWordBySlug[c2slug];

    var s1ipns = jQuery("#set1Selector option:selected").data("ipns");
    var p2ipns = jQuery("#property2Selector option:selected").data("propertyipns");

    var c1PropertyPath = jQuery("#concept1Selector option:selected").data("conceptpropertypath");

    var allowNull_boolean = true;
    var allowNull = jQuery("#allowNullSelector option:selected").data("value");
    if (allowNull=="yes") {
        allowNull_boolean = true;
    }
    if (allowNull=="no") {
        allowNull_boolean = false;
    }
    var aAdditionalOptions = [];
    jQuery("div.anotherInputTextContainer").each(function(){
        var optionNumber = jQuery(this).data("optionnumber")
        var optionInput = jQuery("#anotherInputText_"+optionNumber).val()
        var optionCheckbox = jQuery("#anotherInputCheckbox_"+optionNumber).prop("checked")
        console.log("anotherInputText; optionNumber: "+optionNumber+": optionInput: "+optionInput+"; optionCheckbox: "+optionCheckbox)
        if (optionCheckbox==true) {
            aAdditionalOptions.push(optionInput)
        }
    })

    var s1slug = jQuery("#set1Selector option:selected").data("slug");
    var p2slug = jQuery("#property2Selector option:selected").data("propertyslug");
    var p1key = jQuery("#property1Selector option:selected").data("propertykey");
    var p2key = jQuery("#property2Selector option:selected").data("propertykey");

    var oP2 = window.lookupWordBySlug[p2slug];

    var oS1 = window.lookupWordBySlug[s1slug];
    var s1_setSlug = s1slug;
    if (oS1.hasOwnProperty("setData")) {
        s1_setSlug = oS1.setData.slug;
    }
    if (oS1.hasOwnProperty("supersetData")) {
        s1_setSlug = oS1.supersetData.slug;
    }

    var p2type = jQuery("#property2TypeContainer").html();

    var dependenciesValue = jQuery("#dependenciesSelector option:selected").val();
    var subsetValue = jQuery("#subsetSelector option:selected").val();
    var dependenciesPlacementValue = jQuery("#dependenciesTypeSelector option:selected").val();

    var dP = null;
    var dV = false;
    if (dependenciesValue=="yes") {
        dV = true;
        if (dependenciesPlacementValue=="1") {
            dP="lower";
        }
        if (dependenciesPlacementValue=="2") {
            dP="upper";
        }
    }
    var sV = false;
    if (subsetValue=="yes") {
        sV = true;
    }

    var oNewRel_defines = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
    var oNewRel_enumerates = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType);
    oNewRel_defines.relationshipType.slug = "defines";
    oNewRel_enumerates.relationshipType.slug = "enumerates";

    oNewRel_defines.nodeFrom.slug = s1slug;
    oNewRel_enumerates.nodeTo.slug = p2slug;

    /*
    // deprecated; was used for the restrictsValue relationship
    var uniqueID = s1ipns.substring(s1ipns.length - 6) + "_restrictsValue_" + p2ipns.substring(p2ipns.length - 6) ;

    var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipTypes.restrictsValue);
    oNewRel.nodeFrom.slug = s1slug;
    oNewRel.relationshipType.restrictsValueData.uniqueID = uniqueID;
    oNewRel.relationshipType.restrictsValueData.targetPropertyType = p2type;
    oNewRel.relationshipType.restrictsValueData.propertyPath = c1PropertyPath;
    oNewRel.relationshipType.restrictsValueData.uniquePropertyKey = p1key;
    oNewRel.relationshipType.restrictsValueData.withSubsets = sV;
    oNewRel.relationshipType.restrictsValueData.withDependencies = dV;
    oNewRel.relationshipType.restrictsValueData.dependenciesPlacement = dP;
    oNewRel.nodeTo.slug = p2slug;
    var sNewRel = JSON.stringify(oNewRel,null,4);
    jQuery("#newRel_enumerates_Textarea").val(sNewRel);
    */
    var oRFLWithEnumeration = MiscFunctions.cloneObj(window.lookupWordBySlug)

    try {
        var sEnumerationWord = jQuery("#enumerationTextarea_unedited").val();
        var oEnumeration = JSON.parse(sEnumerationWord);
        var enumeration_ipns = oEnumeration.metaData.ipns;

        var enumeration_wordName = "enumeration of " + c1namePlural + " by " + p1key;
        var enumeration_wordTitle = "Enumeration of " + c1namePlural + " by " + p1key;
        // var enumeration_wordSlug = "enumerationOf_" + c1namePlural + "_by_" + p1key + "_"+enumeration_ipns.substr(-6);
        var enumeration_wordSlug = "enumerationOf_" + c1slug + "_by_" + p1key + "_"+enumeration_ipns.substr(-6);
        oEnumeration.wordData.slug = enumeration_wordSlug;
        oEnumeration.wordData.title = enumeration_wordTitle;
        oEnumeration.wordData.name = enumeration_wordName;

        var enumeration_enumerationName = c1namePlural + " by " + p1key;
        var enumeration_enumerationTitle = c1namePlural + " by " + p1key;
        // var enumeration_enumerationSlug = c1namePlural + "_by_" + p1key + "_"+enumeration_ipns.substr(-6);
        var enumeration_enumerationSlug = c1slug + "_by_" + p1key + "_"+enumeration_ipns.substr(-6);
        oEnumeration.enumerationData.slug = enumeration_enumerationSlug;
        oEnumeration.enumerationData.title = enumeration_enumerationTitle;
        oEnumeration.enumerationData.name = enumeration_enumerationName;

        oEnumeration.enumerationData.metaData.governingConcept.slug = c1slug;

        var uniqueID = s1ipns.substring(s1ipns.length - 6) + "_restrictsValue_" + p2ipns.substring(p2ipns.length - 6) ;

        /*
        var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipTypes.restrictsValue);
        oNewRel.nodeFrom.slug = s1slug;
        oNewRel.relationshipType.restrictsValueData.uniqueID = uniqueID;
        oNewRel.relationshipType.restrictsValueData.targetPropertyType = p2type;
        oNewRel.relationshipType.restrictsValueData.propertyPath = c1PropertyPath;
        oNewRel.relationshipType.restrictsValueData.provideNullOption = allowNull_boolean;
        oNewRel.relationshipType.restrictsValueData.uniquePropertyKey = p1key;
        oNewRel.relationshipType.restrictsValueData.withSubsets = sV;
        oNewRel.relationshipType.restrictsValueData.withDependencies = dV;
        oNewRel.relationshipType.restrictsValueData.dependenciesPlacement = dP;
        oNewRel.nodeTo.slug = p2slug;
        // oEnumeration.enumerationData.restrictsValue = oNewRel;
        */

        var aTargetPropertyKeyPaths = [];
        if (oP2.propertyData.metaData.hasOwnProperty("propertyKeyPaths")) {
            aTargetPropertyKeyPaths = oP2.propertyData.metaData.propertyKeyPaths;
        }


        oEnumeration.enumerationData.restrictsValueData = {};
        oEnumeration.enumerationData.restrictsValueData.uniqueID = uniqueID;
        oEnumeration.enumerationData.restrictsValueData.nodeFrom = {};
        oEnumeration.enumerationData.restrictsValueData.nodeFrom.slug = s1slug;
        oEnumeration.enumerationData.restrictsValueData.nodeFrom.sourceConceptSlug = oC1.conceptData.slug;
        oEnumeration.enumerationData.restrictsValueData.nodeFrom.sourceSetSlug = s1_setSlug;
        oEnumeration.enumerationData.restrictsValueData.nodeTo = {};
        oEnumeration.enumerationData.restrictsValueData.nodeTo.slug = p2slug;
        oEnumeration.enumerationData.restrictsValueData.nodeTo.targetConceptSlug = oC2.conceptData.slug;
        oEnumeration.enumerationData.restrictsValueData.nodeTo.targetPropertyKey = p2key;
        oEnumeration.enumerationData.restrictsValueData.nodeTo.targetPropertyKeyPaths = aTargetPropertyKeyPaths;
        oEnumeration.enumerationData.restrictsValueData.targetPropertyType = p2type;
        oEnumeration.enumerationData.restrictsValueData.propertyPath = c1PropertyPath;
        oEnumeration.enumerationData.restrictsValueData.provideNullOption = allowNull_boolean;
        oEnumeration.enumerationData.restrictsValueData.additionalOptions = aAdditionalOptions;
        oEnumeration.enumerationData.restrictsValueData.uniquePropertyKey = p1key;
        oEnumeration.enumerationData.restrictsValueData.withSubsets = sV;
        oEnumeration.enumerationData.restrictsValueData.withDependencies = dV;
        oEnumeration.enumerationData.restrictsValueData.dependenciesPlacement = dP;

        var oERM = MiscFunctions.cloneObj(window.enumerationRolesManagement);
        oERM.uniqueID = uniqueID;
        oERM.role1_slug = s1slug;
        oERM.role2_slug = p2slug;
        oEnumeration.enumerationData.nodeRolesManagement = oERM;

        var sEnumerationEdited = JSON.stringify(oEnumeration,null,4)
        jQuery("#enumerationTextarea_edited").val(sEnumerationEdited);

        oRFLWithEnumeration[enumeration_wordSlug] = oEnumeration;
    } catch (e) {}


    var enumeration_slug = "newEnumeration_slug"
    try {
        var sEnumerationWord = jQuery("#enumerationTextarea_unedited").val();
        var oEnumerationWord = JSON.parse(sEnumerationWord);
        enumeration_slug = oEnumerationWord.wordData.slug;
    } catch (e) {}

    try {
        var sEnumerationWord = jQuery("#enumerationTextarea_edited").val();
        var oEnumerationWord = JSON.parse(sEnumerationWord);
        enumeration_slug = oEnumerationWord.wordData.slug;
    } catch (e) {}

    oNewRel_defines.nodeTo.slug = enumeration_slug;
    oNewRel_enumerates.nodeFrom.slug = enumeration_slug;

    var sNewRel_defines = JSON.stringify(oNewRel_defines,null,4)
    var sNewRel_enumerates = JSON.stringify(oNewRel_enumerates,null,4)

    jQuery("#newRel_defines_Textarea").val(sNewRel_defines);
    jQuery("#newRel_enumerates_Textarea").val(sNewRel_enumerates);

    // add defines rel to main schema

    var sSchema = jQuery("#restrictingConceptMainSchemaTextarea_unedited").val()
    var oSchema = JSON.parse(sSchema)
    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNewRel_defines,oRFLWithEnumeration);
    var sSchema_updated = JSON.stringify(oSchema,null,4)
    jQuery("#restrictingConceptMainSchemaTextarea_edited").val(sSchema_updated)


    // add enumerates rel to property schema
    var sSchema = jQuery("#restrictedConceptPropertySchemaTextarea_unedited").val()
    var oSchema = JSON.parse(sSchema)
    oSchema = MiscFunctions.updateSchemaWithNewRel(oSchema,oNewRel_enumerates,oRFLWithEnumeration);
    var sSchema_updated = JSON.stringify(oSchema,null,4)
    jQuery("#restrictedConceptPropertySchemaTextarea_edited").val(sSchema_updated)

    displayOldPrimaryPropertyWithForm();
}

const displayOldPrimaryPropertyWithForm = () => {
    try {
        var c2slug = jQuery("#concept2Selector option:selected").data("conceptslug");
        var p2key = jQuery("#property2Selector option:selected").data("propertykey");
        var p2type = jQuery("#property2Selector option:selected").data("propertytype");
        var p2slug = jQuery("#property2Selector option:selected").data("propertyslug");
        var p2ipns = jQuery("#property2Selector option:selected").data("propertyipns");

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

const makeBaseEnumeration = async () => {
    console.log("makeBaseEnumeration")
    var newWordWordType = "enumeration";
    var oNewEnumeration = await MiscFunctions.createNewWordByTemplate(newWordWordType)

    var sNewEnumeration = JSON.stringify(oNewEnumeration,null,4);
    jQuery("#enumerationTextarea_unedited").val(sNewEnumeration);

    return sNewEnumeration;
}

const makeRestrictingConceptMainSchemaUneditedTextarea = () => {
    var concept_slug = jQuery("#concept1Selector option:selected").data("conceptslug");
    var oConcept = window.lookupWordBySlug[concept_slug];
    var mainSchema_slug = oConcept.conceptData.nodes.schema.slug;
    var oMainSchema = window.lookupWordBySlug[mainSchema_slug];
    var sMainSchema = JSON.stringify(oMainSchema,null,4);
    jQuery("#restrictingConceptMainSchemaTextarea_unedited").val(sMainSchema)
}

export default class RestrictPropertyValue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        var conceptGraphMainSchemaSlug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug;
        var oConceptGraphMainSchema = window.lookupWordBySlug[conceptGraphMainSchemaSlug];
        var aConcepts = oConceptGraphMainSchema.conceptGraphData.concepts;

        var foo_mbe = await makeBaseEnumeration();

        makeConcept1Selector(aConcepts);
        makeRestrictingConceptMainSchemaUneditedTextarea();
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
        jQuery("#dependenciesTypeSelector").change(function(){
            makeHumanReadableSentence();
        })
        jQuery("#subsetSelector").change(function(){
            makeHumanReadableSentence();
        })
        jQuery("#allowNullSelector").change(function(){
            makeHumanReadableSentence();
        })
        jQuery("#additionalOptionsBox").change(function(){
            makeHumanReadableSentence();
        })

        jQuery("#addEnumerationWithRestrictionButton").click(async function(){
            var sWord = jQuery("#enumerationTextarea_edited").val();
            console.log("addEnumerationWithRestrictionButton; sWord: "+sWord)
            var oWord = JSON.parse(sWord);
            var foo_w = await MiscFunctions.createOrUpdateWordInAllTables(oWord)

            var sSchema = jQuery("#restrictedConceptPropertySchemaTextarea_edited").val();
            console.log("addEnumerationWithRestrictionButton; sSchema: "+sSchema)
            var oSchema1 = JSON.parse(sSchema);
            var foo_s1 = await MiscFunctions.createOrUpdateWordInAllTables(oSchema1)

            var sSchema = jQuery("#restrictingConceptMainSchemaTextarea_edited").val();
            console.log("addEnumerationWithRestrictionButton; sSchema: "+sSchema)
            var oSchema2 = JSON.parse(sSchema);
            var foo_s2 = await MiscFunctions.createOrUpdateWordInAllTables(oSchema2)
        })
        jQuery("#displayDeveloperDetailsToggleButton").click(function(){
            var currStatus = jQuery(this).data("status")
            if (currStatus=="show") {
                jQuery(this).data("status","hide")
                jQuery(this).html("show developer details")
                jQuery("#propertySchemaBox").css("display","none")
                jQuery("#oldPrimaryPropertyBox").css("display","none")
                jQuery("#updatedPrimaryPropertyBox").css("display","none")
                jQuery("#whatsHappeningDetailsBox").css("display","none")
            }
            if (currStatus=="hide") {
                jQuery(this).data("status","show")
                jQuery(this).html("hide developer details")
                jQuery("#propertySchemaBox").css("display","inline-block")
                jQuery("#oldPrimaryPropertyBox").css("display","block")
                jQuery("#updatedPrimaryPropertyBox").css("display","block")
                jQuery("#whatsHappeningDetailsBox").css("display","inline-block")
            }
        })
        var additionalOptionNumber = 0;
        jQuery("#addAnotherOptionButton").click(function(){
            var anotherOptionHTML = "";
            anotherOptionHTML += "<div data-optionnumber='"+additionalOptionNumber+"' class='anotherInputTextContainer' id='anotherInputTextContainer_"+additionalOptionNumber+"' >";
            anotherOptionHTML += "<input class='anotherInputText' id='anotherInputCheckbox_"+additionalOptionNumber+"' type=checkbox />";
            anotherOptionHTML += "<input id='anotherInputText_"+additionalOptionNumber+"' type=text style='margin-left:5px;' />";
            anotherOptionHTML += "</div>";
            jQuery("#additionalOptionsContainer").append(anotherOptionHTML)
            additionalOptionNumber++;
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
                        <div style={{position:"relative"}}>
                            <div className="doSomethingButton" style={{position:"absolute",left:"5px",top:"5px"}} id="displayDeveloperDetailsToggleButton" data-status="hide">show developer details</div>
                            <div class="h2">Restrict Property Value (via enumeration)</div>

                            <div style={{margin:"20px 0px 20px 0px",textAlign:"center"}}>
                            The "restricting concept" places limits on the allowed values of the "restricted concept."
                            </div>

                            <div style={{textAlign:"center"}}>
                                <div style={{display:"inline-block",width:"550px",height:"250px",padding:"5px",border:"1px dashed grey"}}>
                                    <center>Restricting Concept</center>

                                    <div className="styleFContainer">
                                        <div className="leftColStyleF" style={{color:"green"}} >concept:</div>
                                        <div id="concept1SelectorContainer" className="rightColStyleG" >selector:</div>
                                    </div>

                                    <div className="styleFContainer">
                                        <div className="leftColStyleF" style={{color:"red"}} >unique property:</div>
                                        <div id="property1SelectorContainer" className="rightColStyleG" >selector:</div>
                                    </div>

                                    <div className="styleFContainer">
                                        <div className="leftColStyleF" >*set:</div>
                                        <div id="set1SelectorContainer" className="rightColStyleG" >selector:</div>
                                    </div>
                                </div>

                                <div style={{display:"inline-block",height:"250px",padding:"5px",border:"1px dashed grey"}}>
                                    <center>specific instances:</center>
                                    <div id="concept1SpecificInstancesListContainer" className="rightColStyleG" style={{paddingLeft:"5px",fontSize:"10px",height:"80px",overflow:"scroll",backgroundColor:"#ffcc80"}} >specific instances</div>
                                    <div>
                                        allow null:
                                        <select id="allowNullSelector" style={{marginLeft:"10px"}}>
                                            <option data-value="yes" >yes</option>
                                            <option data-value="no" >no</option>
                                        </select>
                                    </div>
                                    <div id="additionalOptionsBox" >
                                        <div id="addAnotherOptionButton" className="doSomethingButton" >+</div> additional options:
                                        <div id="additionalOptionsContainer"></div>
                                    </div>
                                </div>

                                <div style={{display:"inline-block",width:"550px",height:"250px",padding:"5px",border:"1px dashed grey"}}>
                                    <center>Restricted Concept</center>

                                    <div className="styleFContainer">
                                        <div className="leftColStyleF" style={{color:"blue"}} >concept:</div>
                                        <div id="concept2SelectorContainer" className="rightColStyleG" >selector:</div>
                                    </div>

                                    <div className="styleFContainer">
                                        <div className="leftColStyleF" style={{color:"purple"}} >property:</div>
                                        <div id="property2SelectorContainer" className="rightColStyleG" >selector:</div>
                                    </div>

                                    <div className="styleFContainer">
                                        <div className="leftColStyleF" >property type:</div>
                                        <div id="property2TypeContainer" className="rightColStyleG"style={{backgroundColor:"white"}} >property2TypeContainer</div>
                                    </div>
                                </div>

                            </div>

                            <br/>

                            <div style={{display:"inline-block",width:"1350px",padding:"5px 10px 5px 10px"}}>
                                <div id="humanReadableSentenceContainer" style={{margin:"0px 0px 10px 0px"}}>humanReadableSentenceContainer</div>
                                <div id="addEnumerationWithRestrictionButton" className="doSomethingButton" >ADD ENUMERATES WITH RESTRICTION</div>
                                <div id="whatsHappeningDetailsBox" style={{display:"none",fontSize:"10px"}} >
                                Adds new enumeration node plus two relationships with this new node: <br/>
                                (set or superset) - defines - newEnumerationNode (to mainSchema of restricting concept)<br/>
                                newEnumerationNode - enumerates - property (to propertySchema of restricted concept)
                                </div>
                            </div>

                            <br/><br/>

                            <div style={{display:"inline-block",width:"500px",overflow:"scroll"}} >
                                <div style={{display:"inline-block",width:"500px",padding:"5px"}}>
                                    <center>Form Options</center>

                                    <div className="styleFContainer">
                                        <div className="leftColStyleF" >dependencies?:</div>
                                        <div className="rightColStyleG" style={{width:"300px"}} >
                                            <select id="dependenciesSelector" name="dependenciesSelector" >
                                                <option value="yes" >yes</option>
                                                <option value="no" >no</option>
                                            </select>
                                            <select id="dependenciesTypeSelector" name="dependenciesTypeSelector" style={{marginLeft:"10px"}}>
                                                <option value="1" >alongside property (lower level)</option>
                                                <option value="2" >alongside concept (upper level)</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div id="humanReadableSentence2Container" style={{fontSize:"14px",margin:"10px 0px 30px 0px"}}>humanReadableSentence2Container</div>

                                    <div className="styleFContainer">
                                        <div className="leftColStyleF" >subsets?:</div>
                                        <div className="rightColStyleG" >
                                            <select id="subsetSelector" name="subsetSelector" >
                                                <option value="yes" >yes</option>
                                                <option value="no" >no</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div id="humanReadableSentence3Container">humanReadableSentence3Container</div>

                                <div id="propertySchemaBox" style={{display:"none",width:"450px",height:"800px",padding:"5px",border:"1px dashed grey"}}>
                                    <div style={{border:"2px solid purple"}}>
                                        <center>new enumeration node</center>
                                        unedited enumeration<br/>
                                        <textarea id="enumerationTextarea_unedited" style={{width:"95%",height:"200px"}}>enumerationTextarea_unedited</textarea>
                                        edited enumeration<br/>
                                        <textarea id="enumerationTextarea_edited" style={{width:"95%",height:"200px"}}>enumerationTextarea_edited</textarea>
                                    </div>
                                    <div style={{border:"2px solid purple"}}>
                                        old mainSchema<br/>
                                        <textarea id="restrictingConceptMainSchemaTextarea_unedited" style={{width:"95%",height:"200px"}}>restrictingConceptMainSchemaTextarea_unedited</textarea>
                                        new defines relationship<br/>
                                        <textarea id="newRel_defines_Textarea" style={{width:"95%",height:"100px"}}>newRel_defines_Textarea</textarea>
                                        new mainSchema<br/>
                                        <textarea id="restrictingConceptMainSchemaTextarea_edited" style={{width:"95%",height:"200px"}}>restrictingConceptMainSchemaTextarea_edited</textarea>
                                    </div>
                                    <div style={{border:"2px solid purple"}}>
                                        old propertySchema<br/>
                                        <textarea id="restrictedConceptPropertySchemaTextarea_unedited" style={{width:"95%",height:"200px"}}>restrictedConceptPropertySchemaTextarea_unedited</textarea>
                                        new enumerates relationship<br/>
                                        <textarea id="newRel_enumerates_Textarea" style={{width:"95%",height:"100px"}}>newRel_enumerates_Textarea</textarea>
                                        updated propertySchema<br/>
                                        <textarea id="restrictedConceptPropertySchemaTextarea_edited" style={{width:"95%",height:"200px"}}>restrictedConceptPropertySchemaTextarea_edited</textarea>
                                    </div>
                                </div>
                            </div>

                            <div style={{display:"inline-block",width:"450px",padding:"5px"}}>
                                <div style={{display:"inline-block",width:"95%",padding:"1px",border:"1px solid black",overflow:"scroll"}}>
                                    <center>existing form</center>
                                    <div id="displayOldPrimaryPropertyWithForm_unedited"></div>
                                </div>
                                <br/>
                                <div id="oldPrimaryPropertyBox" style={{display:"none"}}>
                                    old primary property<br/>
                                    <textarea id="primaryPropertyTextarea_unedited" style={{width:"95%",height:"100px"}}>primaryPropertyTextarea_unedited</textarea>
                                </div>
                            </div>

                            <div style={{display:"inline-block",width:"450px",padding:"5px"}}>
                                <div style={{display:"inline-block",width:"95%",padding:"1px",border:"1px solid black",overflow:"scroll"}}>
                                    <center>updated form</center>
                                    <div style={{fontSize:"10px",border:"1px dashed grey"}} >* Currently (as of 27 June 2022) the updated form simulation does not properly handle peoperties that are not top-level; however, the actual finished product will work correctly.</div>
                                    <div id="displayOldPrimaryPropertyWithForm_updated"></div>
                                </div>
                                <br/>
                                <div id="updatedPrimaryPropertyBox" style={{display:"none"}}>
                                    updated primary property<br/>
                                    <textarea id="primaryPropertyTextarea_edited" style={{width:"95%",height:"100px"}}>primaryPropertyTextarea_edited</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
