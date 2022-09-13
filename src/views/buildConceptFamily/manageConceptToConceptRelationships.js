import React from "react";
import IpfsHttpClient from 'ipfs-http-client';
import ReactDOM from 'react-dom';
import sendAsync from '../../renderer';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph } from '../addANewConcept';
import * as MiscFunctions from '../../lib/miscFunctions.js';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

// var pendingRelsEnglish_obj = {};
// var pendingRelsObjects_obj = {};
var pendingRels_arr = [];
var pendingRels_counter = 0;

function translateRelObjectIntoSentence_mc2cr(nextRel_obj) {
  var conceptFrom_concept_slug = nextRel_obj.nodeFrom.slug;
  var c2cRelType_slug = nextRel_obj.relationshipType.slug;
  var conceptTo_concept_slug = nextRel_obj.nodeTo.slug;

  var conceptFrom_concept_obj = lookupRawFileBySlug_obj[conceptFrom_concept_slug];
  var conceptTo_concept_obj = lookupRawFileBySlug_obj[conceptTo_concept_slug];
  var conceptFrom_superset_slug = conceptFrom_concept_obj.conceptData.nodes.superset.slug;
  var conceptTo_superset_slug = conceptTo_concept_obj.conceptData.nodes.superset.slug;
  var conceptFrom_wordType_slug = conceptFrom_concept_obj.conceptData.nodes.wordType.slug;
  var conceptTo_wordType_slug = conceptTo_concept_obj.conceptData.nodes.wordType.slug;

  var conceptFrom_translation = "";
  var conceptTo_translation = "";
  var c2cRelType_translation = "";

  conceptFrom_translation = conceptFrom_concept_slug;
  conceptTo_translation = conceptTo_concept_slug;
  c2cRelType_translation = c2cRelType_slug;

  if (c2cRelType_slug=="isARealizationOf") {
      conceptFrom_translation = "The abstract concept of a(n) "+ conceptFrom_wordType_slug;
      c2cRelType_translation = " is an example of ";
      conceptTo_translation = "a(n) "+ conceptTo_wordType_slug;
  }

  if (c2cRelType_slug=="isASubsetOf") {
      conceptFrom_translation = "The set of all "+conceptFrom_superset_slug;
      c2cRelType_translation = " is a subset of ";
      conceptTo_translation = "the set of all "+conceptTo_superset_slug;
  }

  var sentence_raw = "";
  sentence_raw += conceptFrom_translation;
  sentence_raw += " ";
  sentence_raw += c2cRelType_translation;
  sentence_raw += " ";
  sentence_raw += conceptTo_translation;
  sentence_raw += ".";

  if (c2cRelType_slug=="isADescriptorOf") {
      conceptTo_translation = "Any given "+conceptTo_wordType_slug;
      c2cRelType_translation = " can be classified according to its ";
      conceptFrom_translation = conceptFrom_wordType_slug;

      var sentence_raw = "";
      sentence_raw += conceptTo_translation;
      sentence_raw += " ";
      sentence_raw += c2cRelType_translation;
      sentence_raw += " ";
      sentence_raw += conceptFrom_translation;
      sentence_raw += ".";
  }

  return sentence_raw

}

function makeSimpleTranslationOfC2cRel_mc2cr() {
    var conceptFrom_concept_slug = jQuery("#conceptSelector1_mc2cr option:selected").data("thisconceptconceptslug")
    var conceptTo_concept_slug = jQuery("#conceptSelector2_mc2cr option:selected").data("thisconceptconceptslug")
    var conceptFrom_superset_slug = jQuery("#conceptSelector1_mc2cr option:selected").data("thisconceptsupersetslug")
    var conceptTo_superset_slug = jQuery("#conceptSelector2_mc2cr option:selected").data("thisconceptsupersetslug")
    var conceptFrom_wordType_slug = jQuery("#conceptSelector1_mc2cr option:selected").data("thisconceptwordtypeslug")
    var conceptTo_wordType_slug = jQuery("#conceptSelector2_mc2cr option:selected").data("thisconceptwordtypeslug")
    var c2cRelType_slug = jQuery("input[name=c2cRelSelector_mc2cr]:checked").data("reltypeslug")

    var whichSet1 = jQuery("input[name=setSelector1_mc2cr]:checked").data("whichset")
    var whichSet2 = jQuery("input[name=setSelector2_mc2cr]:checked").data("whichset")

    var makeNewSet1 = jQuery("#newListName1_mc2cr").val()
    var makeNewSet2 = jQuery("#newListName2_mc2cr").val()

    var preexistingSet1 = jQuery("#setsSelector1_mc2cr option:selected").data("setname")
    var preexistingSet2 = jQuery("#setsSelector2_mc2cr option:selected").data("setname")
    console.log("preexistingSet1: "+preexistingSet1)
    console.log("preexistingSet2: "+preexistingSet2)

    var conceptFrom_translation = "";
    var conceptTo_translation = "";
    var c2cRelType_translation = "";

    conceptFrom_translation = conceptFrom_concept_slug;
    conceptTo_translation = conceptTo_concept_slug;
    c2cRelType_translation = c2cRelType_slug;

    var setFrom_slug = "";
    var setTo_slug = "";
    if (whichSet1=="chooseExisting") {
        setFrom_slug = preexistingSet1;
    }
    if (whichSet1=="makeNew") {
        setFrom_slug = makeNewSet1;
    }
    if (whichSet2=="chooseExisting") {
        setTo_slug = preexistingSet2;
    }
    if (whichSet2=="makeNew") {
        setTo_slug = makeNewSet2;
    }

    if (c2cRelType_slug=="isASubsetOf") {
        // conceptFrom_translation = "The set of all "+conceptFrom_superset_slug+" ";
        if (whichSet1=="chooseExisting") {
            conceptFrom_translation = "The set of all "+preexistingSet1;
        }
        if (whichSet1=="makeNew") {
            conceptFrom_translation = "The set of all "+makeNewSet1;
        }

        c2cRelType_translation = " is a subset of ";

        // conceptTo_translation = "the set of all "+conceptTo_superset_slug+" ";
        if (whichSet2=="chooseExisting") {
            conceptTo_translation = "the set of all "+preexistingSet2;
        }
        if (whichSet2=="makeNew") {
            conceptTo_translation = "the set of all "+makeNewSet2;
        }
    }

    if (c2cRelType_slug=="isARealizationOf") {
        conceptFrom_translation = "The abstract concept of a(n) "+ conceptFrom_wordType_slug;
        c2cRelType_translation = " is a member of the set of ";
        conceptTo_translation = setTo_slug;
    }

    if (c2cRelType_slug=="canBeSubdividedInto") {

        var canBeSubdividedInto_includeDependencies = jQuery("#canBeSubdividedInto_selector").val()
        console.log("canBeSubdividedInto_includeDependencies: "+canBeSubdividedInto_includeDependencies)

        conceptFrom_translation = "Each "+conceptFrom_wordType_slug+" ";
        if (whichSet1=="chooseExisting") {
            conceptFrom_translation += "from the set of "+preexistingSet1;
        }
        if (whichSet1=="makeNew") {
            conceptFrom_translation += "from the set: "+makeNewSet1;
        }

        c2cRelType_translation = " is characterized by one "+conceptTo_wordType_slug+" ";

        if (whichSet2=="chooseExisting") {
            conceptTo_translation = "from the set of "+preexistingSet2;
        }
        if (whichSet2=="makeNew") {
            conceptTo_translation = "from the set of "+makeNewSet2;
        }
    }

    if (c2cRelType_slug=="map1ToN") {
        var newListName = jQuery("#map1ToN_setName").val();
        var newListMinimum = jQuery("#map1ToN_minimum").val();
        var newListMaximum = jQuery("#map1ToN_maximum").val();
        conceptFrom_translation = "For each individual "+conceptFrom_wordType_slug+" ";
        conceptFrom_translation += "from the set of "+setFrom_slug+", ";

        c2cRelType_translation = " select N "+newListName+" (between "+newListMinimum+" and "+newListMaximum+")";

        conceptTo_translation = " from the set of "+setTo_slug;
    }

    var translationHTML = "";
    translationHTML += conceptFrom_translation;
    translationHTML += " ";
    translationHTML += c2cRelType_translation;
    translationHTML += " ";
    translationHTML += conceptTo_translation;
    translationHTML += ".";

    if (c2cRelType_slug=="isADescriptorOf") {
        conceptTo_translation = "Any given "+conceptTo_wordType_slug;
        c2cRelType_translation = " can be classified according to its ";
        conceptFrom_translation = conceptFrom_wordType_slug;

        var translationHTML = "";
        translationHTML += conceptTo_translation;
        translationHTML += " ";
        translationHTML += c2cRelType_translation;
        translationHTML += " ";
        translationHTML += conceptFrom_translation;
        translationHTML += ".";
    }
    console.log("translationHTML: "+translationHTML)

    if (conceptFrom_concept_slug==conceptTo_concept_slug) {
        translationHTML = "Must choose two different concepts. (Cannot use the same concept twice.)";
    }
    jQuery("#simpleTranslationOfC2cRelContainer_mc2cr").html(translationHTML)

    var rel_obj = MiscFunctions.blankRel_obj();
    rel_obj.nodeFrom.slug = conceptFrom_concept_slug;
    rel_obj.relationshipType.slug = c2cRelType_slug;
    rel_obj.nodeTo.slug = conceptTo_concept_slug;

    var relTypeNameData = c2cRelType_slug + "Data";
    rel_obj.relationshipType[relTypeNameData] = {};
    rel_obj.relationshipType[relTypeNameData].setMappings = [];

    if (c2cRelType_slug=="isASubsetOf") {
        var nextSetMapping = {};
        nextSetMapping.setFrom = setFrom_slug;
        nextSetMapping.setTo = setTo_slug;
    }
    if (c2cRelType_slug=="isARealizationOf") {
        var nextSetMapping = setTo_slug;
    }
    if (c2cRelType_slug=="canBeSubdividedInto") {
        var nextSetMapping = {};
        nextSetMapping.setFrom = preexistingSet1;
        /*
        if (whichSet1=="chooseExisting") {
            var setFrom_spinOff_slug = setFrom_slug+"_subdividedBy_"+setTo_slug;
        }
        if (whichSet1=="makeNew") {
            var setFrom_spinOff_slug = makeNewSet1;
        }
        */
        // nextSetMapping.setFromSpinoff = setFrom_spinOff_slug;

        nextSetMapping.setTo = setTo_slug;
        // nextSetMapping.includeDependencies=true;
        // nextSetMapping.property="slug";
        nextSetMapping.enumerations=[];
        nextSetMapping.includeDependencies = null;
        if (canBeSubdividedInto_includeDependencies=="true") {
            nextSetMapping.includeDependencies = true;
        }
        if (canBeSubdividedInto_includeDependencies=="false") {
            nextSetMapping.includeDependencies = false;
        }
        var chooseLabel = jQuery("#canBeSubdividedInto_chooseLabel_selector option:selected").data("chooselabel");
        // nextSetMapping.property = "choose one";
        nextSetMapping.property = chooseLabel;

    }
    if (c2cRelType_slug=="map1ToN") {
        var nextSetMapping = {};
        nextSetMapping.setFrom = setFrom_slug;
        nextSetMapping.setTo = setTo_slug;
        nextSetMapping.newListName = newListName;
        nextSetMapping.newListMinElements = newListMinimum;
        nextSetMapping.newListMaxElements = newListMaximum;
        nextSetMapping.includeDependencies=true;
        nextSetMapping.property="slug";
        nextSetMapping.enumeration="(enumeration slug)";
    }
    if (c2cRelType_slug=="isARealizationOf") {
    }
    rel_obj.relationshipType[relTypeNameData].setMappings.push(nextSetMapping);


    var rel_str = JSON.stringify(rel_obj,null,4);
    console.log("rel_str: "+rel_str)

    // update schema
    var uneditedSchema_rF_str = jQuery("#schemaForC2cRelsContainer_unedited").val();
    var uneditedSchema_rF_obj = JSON.parse(uneditedSchema_rF_str);
    var editedSchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(uneditedSchema_rF_obj,rel_obj,lookupRawFileBySlug_obj);
    var editedSchema_rF_str = JSON.stringify(editedSchema_rF_obj,null,4)

    if (conceptFrom_concept_slug==conceptTo_concept_slug) {
        rel_str = "{}";
    }

    if (c2cRelType_slug !== undefined ) {
        jQuery("#schemaForC2cRelsContainer_edited").val(editedSchema_rF_str);
        jQuery("#c2cRelContainer_mc2cr").val(rel_str)
    }
}

function makeEditedSchemaForConceptToConceptRelationships_mc2cr() {
    var currentSchema_rF_str = jQuery("#schemaForC2cRelsContainer_panel2_unedited").val();
    var updatedSchema_rF_obj = JSON.parse(currentSchema_rF_str);

    var numPendingRels = pendingRels_arr.length;
    for (var r=0;r<numPendingRels;r++) {
        var nextRelCurrentState = jQuery("#deletePendingRel_"+r).data("currentstate");
        console.log("r: "+r+"; nextRelCurrentState: "+nextRelCurrentState)
        if (nextRelCurrentState=="pending") {
            var nextRel_obj = pendingRels_arr[r];
            var nextRel_english_str = nextRel_obj.english_str;
            var nextRel_rel_obj = nextRel_obj.rel_obj;
            updatedSchema_rF_obj = MiscFunctions.updateSchemaWithNewRel(updatedSchema_rF_obj,nextRel_rel_obj,lookupRawFileBySlug_obj)
        }

    }

    // updatedSchema_rF_obj.wordData.a="b";
    var updatedSchema_rF_str = JSON.stringify(updatedSchema_rF_obj,null,4);
    jQuery("#schemaForC2cRelsContainer_panel2_edited").val(updatedSchema_rF_str);
}

function createConceptSelector_mc2cr() {
    var currentConceptGraph_tableName = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    var sql = "";
    sql += " SELECT * FROM "+currentConceptGraph_tableName;

    sendAsync(sql).then((words_arr) => {
        var conceptSelector1HTML = "";
        conceptSelector1HTML += "<select id=conceptSelector1_mc2cr >";
        var conceptSelector2HTML = "";
        conceptSelector2HTML += "<select id=conceptSelector2_mc2cr >";

        var numWords = words_arr.length;
        var ind=0;
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_wordTypes = nextWord_obj.wordData.wordTypes;
            var nextWord_ipns = nextWord_obj.metaData.ipns;

            lookupRawFileBySlug_obj[nextWord_slug] = nextWord_obj;
            lookupRawFileBySlug_obj.edited[nextWord_slug] = nextWord_obj;

            if (jQuery.inArray("concept",nextWord_wordTypes) > -1) {
                var nextWord_rF_obj = nextWord_obj;
                var nextWord_rF_str = JSON.stringify(nextWord_rF_obj,null,4)
                // console.log("nextWord_slug: "+nextWord_slug+"; nextWord_rF_str: "+nextWord_rF_str)
                var nextWord_rF_wordType_slug = nextWord_rF_obj.conceptData.nodes.wordType.slug;
                var nextWord_rF_wordType_ipns = nextWord_rF_obj.conceptData.nodes.wordType.ipns;
                var nextWord_rF_superset_slug = nextWord_rF_obj.conceptData.nodes.superset.slug;
                var nextWord_rF_superset_ipns = nextWord_rF_obj.conceptData.nodes.superset.ipns;
                var nextWord_rF_schema_slug = nextWord_rF_obj.conceptData.nodes.schema.slug;
                var nextWord_rF_schema_ipns = nextWord_rF_obj.conceptData.nodes.schema.ipns;
                var nextWord_rF_JSONSchema_slug = nextWord_rF_obj.conceptData.nodes.JSONSchema.slug;
                var nextWord_rF_JSONSchema_ipns = nextWord_rF_obj.conceptData.nodes.JSONSchema.ipns;
                var nextWord_rF_concept_slug = nextWord_rF_obj.conceptData.nodes.concept.slug;
                var nextWord_rF_concept_ipns = nextWord_rF_obj.conceptData.nodes.concept.ipns;
                var nextWord_rF_primaryProperty_slug = nextWord_rF_obj.conceptData.nodes.primaryProperty.slug;
                var nextWord_rF_primaryProperty_ipns = nextWord_rF_obj.conceptData.nodes.primaryProperty.ipns;
                var nextWord_rF_propertySchema_slug = nextWord_rF_obj.conceptData.nodes.propertySchema.slug;
                var nextWord_rF_propertySchema_ipns = nextWord_rF_obj.conceptData.nodes.propertySchema.ipns;

                // console.log("qwerty nextWord_rF_propertySchema_slug: "+nextWord_rF_propertySchema_slug)
                var conceptSelectorHTML = "";
                conceptSelectorHTML += "<option data-ipns='"+nextWord_rF_wordType_ipns+"' data-slug='"+nextWord_rF_wordType_slug+"' data-thisconceptconceptslug='"+nextWord_rF_concept_slug+"' data-thisconceptschemaslug='"+nextWord_rF_schema_slug+"' data-thisconceptjsonschemaslug='"+nextWord_rF_JSONSchema_slug+"' data-thisconceptwordtypeslug='"+nextWord_rF_wordType_slug+"' data-thisconceptsupersetslug='"+nextWord_rF_superset_slug+"' data-thisconceptprimarypropertyslug='"+nextWord_rF_primaryProperty_slug+"' data-thisconceptpropertyschemaslug='"+nextWord_rF_propertySchema_slug+"' >";
                conceptSelectorHTML += nextWord_rF_wordType_slug;
                conceptSelectorHTML += "</option>";

                conceptSelector1HTML += conceptSelectorHTML;
                conceptSelector2HTML += conceptSelectorHTML;
            }
            if (jQuery.inArray("schema",nextWord_wordTypes) > -1) {
                if (jQuery.inArray("mainSchemaForConceptGraph",nextWord_obj.schemaData.metaData.types) > -1) {
                // if (nextWord_slug=="schemaForConceptToConceptRelationships") {
                    jQuery("#schemaForC2cRelsContainer_unedited").val(nextWord_str);
                    jQuery("#schemaForC2cRelsContainer_edited").val(nextWord_str);

                    jQuery("#schemaForC2cRelsContainer_panel2_unedited").val(nextWord_str);
                    jQuery("#schemaForC2cRelsContainer_panel2_edited").val(nextWord_str);

                    // populate relListExistingEnglishContainer_mc2cr
                    // var schemaForConceptToConceptRelationships_obj = JSON.parse(nextWord_str)
                    var rels_arr = nextWord_obj.schemaData.relationships;
                    var numRels = rels_arr.length;
                    for (var r=0;r<numRels;r++) {
                        var nextRel_obj = rels_arr[r];
                        var nextRel_sentence_raw = translateRelObjectIntoSentence_mc2cr(nextRel_obj);

                        var nextRelHTML = "";
                        nextRelHTML += "<div>";
                        nextRelHTML += nextRel_sentence_raw;
                        nextRelHTML += "</div>";
                        jQuery("#relListExistingEnglishContainer_mc2cr").append(nextRelHTML)
                    }
                }
            }
        }
        conceptSelector1HTML += "</select>";
        conceptSelector2HTML += "</select>";
        jQuery("#conceptSelectorContainer1_mc2cr").html(conceptSelector1HTML);
        jQuery("#conceptSelectorContainer2_mc2cr").html(conceptSelector2HTML);

        makeSetsSelector_mc2cr(1)

        makeSetsSelector_mc2cr(2)

        makeSelector_canBeSubdividedInto_chooseLabel_mc2cr();

        jQuery("#conceptSelector1_mc2cr").change(function(){
              makeSetsSelector_mc2cr(1)
              makeSimpleTranslationOfC2cRel_mc2cr()

        });
        jQuery("#conceptSelector2_mc2cr").change(function(){
              makeSetsSelector_mc2cr(2)
              makeSelector_canBeSubdividedInto_chooseLabel_mc2cr();
              makeSimpleTranslationOfC2cRel_mc2cr()
        });
        jQuery("#setSelector1Container_mc2cr").change(function(){
              console.log("setSelector1Container_mc2cr changed")
              // makeSetsSelector_mc2cr(1)
              makeSimpleTranslationOfC2cRel_mc2cr()
        });
        jQuery("#setSelector2Container_mc2cr").change(function(){
              console.log("setSelector2Container_mc2cr changed")
              // makeSetsSelector_mc2cr(2)
              makeSelector_canBeSubdividedInto_chooseLabel_mc2cr();
              makeSimpleTranslationOfC2cRel_mc2cr()
        });
        makeSimpleTranslationOfC2cRel_mc2cr();
    });
}

function makeSetsSelector_mc2cr(whichOne) {
    var setsSelectorHTML = "";
    setsSelectorHTML += "<select id='setsSelector"+whichOne+"_mc2cr' >";

    if (whichOne==1) {
        var thisConceptSupersetSlug = jQuery("#conceptSelector1_mc2cr option:selected").data("thisconceptsupersetslug");
    }
    if (whichOne==2) {
        var thisConceptSupersetSlug = jQuery("#conceptSelector2_mc2cr option:selected").data("thisconceptsupersetslug");
    }
    // console.log("thisConceptSupersetSlug: "+thisConceptSupersetSlug)

    setsSelectorHTML += "<option data-setname='"+thisConceptSupersetSlug+"' >superset: ";
    setsSelectorHTML += thisConceptSupersetSlug;
    setsSelectorHTML += "</option>";

    var thisConceptSuperset_rF_obj = lookupRawFileBySlug_obj[thisConceptSupersetSlug]
    var subsets_arr = thisConceptSuperset_rF_obj.globalDynamicData.subsets;
    var numSubsets = subsets_arr.length;
    for (var s=0;s<numSubsets;s++) {
        var nextSubset_slug = subsets_arr[s];

        setsSelectorHTML += "<option data-setname='"+nextSubset_slug+"'>";
        setsSelectorHTML += nextSubset_slug;
        setsSelectorHTML += "</option>";
    }

    setsSelectorHTML += "</select>";

    if (whichOne==1) {
        jQuery("#conceptSetsSelectorContainer1_mc2cr").html(setsSelectorHTML)
    }
    if (whichOne==2) {
        jQuery("#conceptSetsSelectorContainer2_mc2cr").html(setsSelectorHTML)
    }
}

function addRelationshipToList_mc2cr() {
    var nextRelEnglishHTML = "";
    var nextRelObjectHTML = "";

    var nextRelEnglish_raw = jQuery("#simpleTranslationOfC2cRelContainer_mc2cr").html()
    var nextRel_string = jQuery("#c2cRelContainer_mc2cr").val()
    var nextRel_obj = JSON.parse(nextRel_string);

    nextRelEnglishHTML += "<div style='border:1px solid black;margin:5px;padding:5px;' >";
        nextRelEnglishHTML += "<div>";
            nextRelEnglishHTML += "<div data-currentstate='pending' id='deletePendingRel_"+pendingRels_counter+"' class=doSomethingButton style='background-color:green;' >X</div>";
            nextRelEnglishHTML += pendingRels_counter;
        nextRelEnglishHTML += "</div>";

        nextRelEnglishHTML += "<div>";
            nextRelEnglishHTML += nextRelEnglish_raw;
        nextRelEnglishHTML += "</div>";
    nextRelEnglishHTML += "</div>";

    nextRelObjectHTML += "<div class='showWhileDebuggingOn' style='border:1px solid black;margin:5px;padding:5px;' >";
        nextRelObjectHTML += "<textarea style='width:300px;height:200px' >";
            nextRelObjectHTML += nextRel_string;
        nextRelObjectHTML += "</textarea>";
    nextRelObjectHTML += "</div>";

    pendingRels_arr[pendingRels_counter] = {};
    pendingRels_arr[pendingRels_counter].english_str = nextRelEnglish_raw;
    pendingRels_arr[pendingRels_counter].rel_obj = nextRel_obj

    jQuery("#relListPendingEnglishContainer_mc2cr").append(nextRelEnglishHTML)
    jQuery("#relListPendingObjectContainer_mc2cr").append(nextRelObjectHTML)

    jQuery("#deletePendingRel_"+pendingRels_counter).click(function(){
        var currentState = jQuery(this).data("currentstate");
        console.log("deletePendingRel_; currentState: "+currentState)
        if (currentState=="pending") {
            jQuery(this).css("background-color","red")
            jQuery(this).data("currentstate","deleted");
        }
        if (currentState=="deleted") {
            jQuery(this).css("background-color","green")
            jQuery(this).data("currentstate","pending");
        }
        makeEditedSchemaForConceptToConceptRelationships_mc2cr();
    })

    pendingRels_counter ++;

    makeEditedSchemaForConceptToConceptRelationships_mc2cr();

}

function toggleDebuggerState_mc2cr() {
    var currentState = jQuery("#debuggerDisplayToggleSelector_mc2cr option:selected").data("currentstate")
    console.log("toggleDebuggerState_mc2cr; currentState: "+currentState)
    if (currentState=="on") {
        jQuery("#showSchemaForC2cRelsContainer_panel2_editedAndUnedited_mc2cr").css("display","inline-block");
        jQuery("#currentC2cRelContainer_mc2cr").css("display","inline-block");
        jQuery("#relListPendingObjectContainer_mc2cr").css("display","inline-block");

        jQuery(".showWhileDebuggingOn").css("display","inline-block");
    }
    if (currentState=="off") {
        jQuery("#showSchemaForC2cRelsContainer_panel2_editedAndUnedited_mc2cr").css("display","none");
        jQuery("#currentC2cRelContainer_mc2cr").css("display","none");
        jQuery("#relListPendingObjectContainer_mc2cr").css("display","none");

        jQuery(".showWhileDebuggingOn").css("display","none");
    }
}

function addRelationships_panel2_mc2cr() {
    var updatedSchema_rF_str = jQuery("#schemaForC2cRelsContainer_panel2_edited").val();
    var updatedSchema_rF_obj = JSON.parse(updatedSchema_rF_str);
    MiscFunctions.updateWordInAllTables(updatedSchema_rF_obj)
}

function makeSelector_canBeSubdividedInto_chooseLabel_mc2cr() {
    // var thisConcept2SupersetSlug = jQuery("#conceptSelector2_mc2cr option:selected").data("thisconceptsupersetslug");
    var thisConcept2WordTypeSlug = jQuery("#conceptSelector2_mc2cr option:selected").data("thisconceptwordtypeslug");
    var thisConcept2WordType_obj = lookupRawFileBySlug_obj[thisConcept2WordTypeSlug];

    /*
    if (thisConcept2Superset_obj.hasOwnProperty("supersetData")) {
        var concept_slug = thisConcept2Superset_obj.supersetData.metaData.governingConcept.slug;
        var concept_obj = lookupRawFileBySlug_obj[concept_slug];
        var wordType_slug = concept_obj.conceptData.nodes.wordType.slug;
    }
    if (thisConcept2Superset_obj.hasOwnProperty("setData")) {
        var concept_slug = thisConcept2Superset_obj.supersetData.metaData.governingConcept.slug;
        var concept_obj = lookupRawFileBySlug_obj[concept_slug];
        var wordType_slug = concept_obj.conceptData.nodes.wordType.slug;
    }
    */
    var selectorHTML = "";
    selectorHTML += "<select id=canBeSubdividedInto_chooseLabel_selector >";
    selectorHTML += "<option data-chooselabel="+thisConcept2WordTypeSlug+" >"+thisConcept2WordTypeSlug+"</option>";
    if (thisConcept2WordType_obj.wordData.hasOwnProperty("name")) {
        selectorHTML += "<option data-chooselabel="+thisConcept2WordType_obj.wordData.name+" >"+thisConcept2WordType_obj.wordData.name+"</option>";
    }
    if (thisConcept2WordType_obj.wordData.hasOwnProperty("title")) {
        selectorHTML += "<option data-chooselabel="+thisConcept2WordType_obj.wordData.title+" >"+thisConcept2WordType_obj.wordData.title+"</option>";
    }
    selectorHTML += "</select>";

    jQuery("#canBeSubdividedInto_chooseLabel_selectorContainer").html(selectorHTML);
}

export default class ManageConceptToConceptRelationships extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        createConceptSelector_mc2cr();
        jQuery("#c2cRelTypeContainer_mc2cr").change(function(){
            var c2cRelType_slug = jQuery("input[name=c2cRelSelector_mc2cr]:checked").data("reltypeslug")
            console.log("c2cRelTypeContainer_mc2cr changed; c2cRelType_slug: "+c2cRelType_slug)

            if (c2cRelType_slug=="canBeSubdividedInto") {
                jQuery("#canBeSubdividedInto_supplementalInfo").css("display","block")
            } else {
                jQuery("#canBeSubdividedInto_supplementalInfo").css("display","none")
            }

            if (c2cRelType_slug=="map1ToN") {
                jQuery("#map1ToN_supplementalInfo").css("display","block")
            } else {
                jQuery("#map1ToN_supplementalInfo").css("display","none")
            }

            if (c2cRelType_slug=="isARealizationOf") {
                jQuery("#setSelector1Container_mc2cr").css("display","none")
            } else {
                jQuery("#setSelector1Container_mc2cr").css("display","block")
            }

            // makeSelector_canBeSubdividedInto_chooseLabel_mc2cr();

            makeSimpleTranslationOfC2cRel_mc2cr()
        });

        jQuery("#addRelationshipToListButton_mc2cr").click(function(){
              addRelationshipToList_mc2cr();
        });
        jQuery("#debuggerDisplayToggleSelector_mc2cr").change(function(){
              toggleDebuggerState_mc2cr();
        });

        jQuery("#showSchemaForC2cRelsButton_unedited_mc2cr").click(function(){
            jQuery("#schemaForC2cRelsContainer_unedited").css("display","inline-block")
            jQuery("#schemaForC2cRelsContainer_edited").css("display","none")

            jQuery("#showSchemaForC2cRelsButton_unedited_mc2cr").css("backgroundColor","green")
            jQuery("#showSchemaForC2cRelsButton_edited_mc2cr").css("backgroundColor","grey")
        });
        jQuery("#showSchemaForC2cRelsButton_edited_mc2cr").click(function(){
            jQuery("#schemaForC2cRelsContainer_unedited").css("display","none")
            jQuery("#schemaForC2cRelsContainer_edited").css("display","inline-block")

            jQuery("#showSchemaForC2cRelsButton_unedited_mc2cr").css("backgroundColor","grey")
            jQuery("#showSchemaForC2cRelsButton_edited_mc2cr").css("backgroundColor","green")
        });

        jQuery("#showSchemaForC2cRelsButton_panel2_unedited_mc2cr").click(function(){
            jQuery("#schemaForC2cRelsContainer_panel2_unedited").css("display","inline-block")
            jQuery("#schemaForC2cRelsContainer_panel2_edited").css("display","none")

            jQuery("#showSchemaForC2cRelsButton_panel2_unedited_mc2cr").css("backgroundColor","green")
            jQuery("#showSchemaForC2cRelsButton_panel2_edited_mc2cr").css("backgroundColor","grey")
        });
        jQuery("#showSchemaForC2cRelsButton_panel2_edited_mc2cr").click(function(){
            jQuery("#schemaForC2cRelsContainer_panel2_unedited").css("display","none")
            jQuery("#schemaForC2cRelsContainer_panel2_edited").css("display","inline-block")

            jQuery("#showSchemaForC2cRelsButton_panel2_unedited_mc2cr").css("backgroundColor","grey")
            jQuery("#showSchemaForC2cRelsButton_panel2_edited_mc2cr").css("backgroundColor","green")
        });

        jQuery("#addRelButton_mc2cr").click(function(){
              // update schema with the single relationship on the left panel
              // may deprecate in favor of addRelButton_panel2_mc2cr
        });
        jQuery("#addRelButton_panel2_mc2cr").click(function(){
              addRelationships_panel2_mc2cr();
        });
    }
    state = {
    }
    render() {
        return (
            <>
                <center>
                    Manage Concept to Concept Relationships
                    <select id="debuggerDisplayToggleSelector_mc2cr" >
                        <option data-currentstate="on" >debug on</option>
                        <option data-currentstate="off" >debug off</option>
                    </select>
                </center>

                <fieldset style={{display:"inline-block",border:"1px solid black",width:"850px",height:"800px",padding:"5px",verticalAlign:"top"}} >
                    <div>
                        <div className="simpleBoxContainer" >
                            <div id="conceptSelectorContainer1_mc2cr" >conceptSelectorContainer</div>
                            <div id="setSelector1Container_mc2cr" >
                                <input name="setSelector1_mc2cr" data-whichset="chooseExisting" type="radio" defaultChecked="checked" />
                                <div style={{display:"inline-block"}} id="conceptSetsSelectorContainer1_mc2cr" >conceptSetsSelectorContainer</div>
                                <br/>
                                <input name="setSelector1_mc2cr" data-whichset="makeNew" type="radio"  />
                                <input name="newListName1_mc2cr" id="newListName1_mc2cr" type="text" style={{display:"inline-block",width:"200px"}} />
                            </div>
                        </div>
                        <div className="simpleBoxContainer" id="c2cRelTypeContainer_mc2cr" >
                            <div>
                                <input name="c2cRelSelector_mc2cr" data-reltypeslug="isASubsetOf" type="radio" defaultChecked="checked" /> is a subset of
                            </div>
                            <div>
                                <input name="c2cRelSelector_mc2cr" data-reltypeslug="isARealizationOf" type="radio" /> is an example of
                            </div>
                            <div>
                                <input name="c2cRelSelector_mc2cr" data-reltypeslug="isADescriptorOf" type="radio" /> is a feature of (depr?)
                            </div>
                            <div>
                                <input name="c2cRelSelector_mc2cr" data-reltypeslug="canBeSubdividedInto" type="radio" /> can be subdivided into
                                <div id="canBeSubdividedInto_supplementalInfo" style={{display:"none"}}>
                                    include dependencies:
                                    <select id="canBeSubdividedInto_selector">
                                        <option>true</option>
                                        <option>false</option>
                                    </select>
                                    <br/>
                                    choose label:
                                    <div id="canBeSubdividedInto_chooseLabel_selectorContainer" style={{display:"inline-block"}} >canBeSubdividedInto_chooseLabel_selector</div>
                                </div>
                            </div>
                            <div>
                                <input name="c2cRelSelector_mc2cr" data-reltypeslug="map1ToN" type="radio" /> for each 1 one choose N
                                <div id="map1ToN_supplementalInfo" style={{display:"none"}}>
                                    <textarea id="map1ToN_setName"></textarea>
                                    <br/>
                                    minimum: <input name="map1ToN_minimum" id="map1ToN_minimum" type="text" /><br/> (blank = min. of 0)
                                    <br/>
                                    maximum: <input name="map1ToN_maximum" id="map1ToN_maximum" type="text" /><br/>(blank = no max)
                                </div>
                            </div>
                        </div>
                        <div className="simpleBoxContainer" >
                            <div id="conceptSelectorContainer2_mc2cr" >conceptSelectorContainer</div>
                            <div id="setSelector2Container_mc2cr" >
                                <input name="setSelector2_mc2cr" data-whichset="chooseExisting" type="radio" defaultChecked="checked" />
                                <div style={{display:"inline-block"}} id="conceptSetsSelectorContainer2_mc2cr" >conceptSetsSelectorContainer</div>
                                <br/>
                                <input name="setSelector2_mc2cr" data-whichset="makeNew" type="radio"  />
                                <input name="newListName2_mc2cr" id="newListName2_mc2cr" type="text" style={{display:"inline-block",width:"200px"}}  />
                            </div>
                        </div>
                    </div>

                    <div>
                        <br/>
                        <div id="simpleTranslationOfC2cRelContainer_mc2cr"></div>
                        <br/>
                        <div className="doSomethingButton" id="addRelationshipToListButton_mc2cr" >Add to list</div>
                    </div>

                    <fieldset id="currentC2cRelContainer_mc2cr" style={{display:"inline-block",border:"1px solid black",width:"650px",height:"800px",padding:"5px",verticalAlign:"top"}} >
                        <textarea style={{width:"300px",height:"200px"}} id="c2cRelContainer_mc2cr">c2cRelContainer_mc2cr</textarea>
                        <br/>
                        Show:
                        <div className="doSomethingButton" style={{backgroundColor:"green"}} id="showSchemaForC2cRelsButton_unedited_mc2cr" >unedited</div>
                        <div className="doSomethingButton" style={{backgroundColor:"grey"}} id="showSchemaForC2cRelsButton_edited_mc2cr" >edited</div>
                        Update: <div className="doSomethingButton" id="addRelButton_mc2cr" >Update</div>
                        <textarea style={{width:"600px",height:"500px",display:"inline-block"}} id="schemaForC2cRelsContainer_unedited" >schemaForC2cRelsContainer_unedited</textarea>
                        <textarea style={{width:"600px",height:"500px",display:"none"}} id="schemaForC2cRelsContainer_edited" >schemaForC2cRelsContainer_edited</textarea>
                    </fieldset>

                </fieldset>

                <fieldset style={{display:"inline-block",border:"1px solid black",width:"650px",height:"800px",padding:"5px",verticalAlign:"top"}} >

                    <center>relationships (not yet added)</center>
                    <div id="relListPendingEnglishContainer_mc2cr"></div>
                    <div id="relListPendingObjectContainer_mc2cr"></div>
                    Add the above relationships to schema of type: mainSchemaForConceptGraph (schemaForConceptToConceptRelationships): <div className="doSomethingButton" id="addRelButton_panel2_mc2cr" >Update</div>
                    <center>relationships (existing)</center>
                    <div id="relListExistingEnglishContainer_mc2cr"></div>

                    <fieldset id="showSchemaForC2cRelsContainer_panel2_editedAndUnedited_mc2cr" style={{display:"inline-block",border:"1px solid black",width:"650px",height:"800px",padding:"5px",verticalAlign:"top"}} >
                        Show:
                        <div className="doSomethingButton" style={{backgroundColor:"green"}} id="showSchemaForC2cRelsButton_panel2_unedited_mc2cr" >unedited</div>
                        <div className="doSomethingButton" style={{backgroundColor:"grey"}} id="showSchemaForC2cRelsButton_panel2_edited_mc2cr" >edited</div>
                        <textarea style={{width:"600px",height:"500px",display:"inline-block"}} id="schemaForC2cRelsContainer_panel2_unedited" >schemaForC2cRelsContainer_panel2_unedited</textarea>
                        <textarea style={{width:"600px",height:"500px",display:"none"}} id="schemaForC2cRelsContainer_panel2_edited" >schemaForC2cRelsContainer_panel2_edited</textarea>
                    </fieldset>

                </fieldset>

            </>
        );
    }
}
