import sendAsync from '../../../../renderer.js';
import IpfsHttpClient from 'ipfs-http-client';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import * as CGOverviewFunctions from './conceptGraphOverviewFunctions.js';
const jQuery = require("jquery");

export const generatePropertyKeyPath = (conceptNumber,propertyNumber) => {
    var propertyKeyPath = "";
    var aProperties = window.cgOverviewPage.concepts[conceptNumber].properties;
    var propertyParentMapping = [];
    for (var p=0;p < aProperties.length;p++) {
        var oNextPropertyData = window.cgOverviewPage.concepts[conceptNumber].properties[p];
        var nextPPN = oNextPropertyData.parentPropertyNumber
        var nextPK = oNextPropertyData.propertyKey
    }
    var propertyNumberSequence = [];

    var nextPropertyNumber = propertyNumber;
    // if (nextPropertyNumber == -1) { nextPropertyNumber = 0 }

    // console.log("window.cgOverviewPage.concepts[conceptNumber].properties: "+JSON.stringify(window.cgOverviewPage.concepts[conceptNumber].properties,null,4))
    propertyNumberSequence.push(nextPropertyNumber);
    do {
        var parentPropertyNumber = window.cgOverviewPage.concepts[conceptNumber].properties[nextPropertyNumber].parentPropertyNumber
        propertyNumberSequence.push(parentPropertyNumber);
        nextPropertyNumber = parentPropertyNumber
    } while (nextPropertyNumber > -1)

    // console.log("propertyNumberSequence: "+JSON.stringify(propertyNumberSequence,null,4))
    /*
    if (nextPropertyNumber > -1) {
        var parentPropertyNumber = window.cgOverviewPage.concepts[conceptNumber].properties[nextPropertyNumber].parentPropertyNumber
        propertyNumberSequence.push(parentPropertyNumber);
    }
    */
    propertyNumberSequence.reverse();
    for (var z=0;z<propertyNumberSequence.length;z++) {
        var nextPN = propertyNumberSequence[z];
        // discrepancy whether to use 0 or -1 to designate the primaryProperty vs one of the top level properties
        if (nextPN == -1) {
             var nextPKey =  MiscFunctions.convertNameToSlug(window.cgOverviewPage.concepts[conceptNumber].name.singular) + "Data";
        } else {
            var nextPKey = window.cgOverviewPage.concepts[conceptNumber].properties[nextPN].propertyKey;
        }

        propertyKeyPath += nextPKey;
        if (z < propertyNumberSequence.length - 1) {
            propertyKeyPath += ".";
        }
    }

    return propertyKeyPath;
}
// Style1 refers to the style from the Compact Graph Overview page (from late Aug 2022; starting Aug 19 or Aug 20) [more compact than style2]
// Style2 refers to the "cg_entire" filetype style of CompactImportExport files (from early/mid August 2022) [more compact than live compact graph]
// This function translates data from Style1 to Style2
export const translateFromDOMToCompactImportExportRawFile = () => {
    if (window.cgOverviewPage.loadingStoredConceptGraph==false) {
        var oRawFileFromDom = MiscFunctions.cloneObj(window.cgOverviewPage);
        var oCompactIORawFile = MiscFunctions.cloneObj(window.oBlankConceptGraphRawFile)

        // conceptGraphData
        oCompactIORawFile.conceptGraphData.name = oRawFileFromDom.conceptGraphData.name;
        if (oRawFileFromDom.conceptGraphData.name) {
            oCompactIORawFile.conceptGraphData.slug = MiscFunctions.convertNameToSlug(oRawFileFromDom.conceptGraphData.name);
            oCompactIORawFile.conceptGraphData.title = MiscFunctions.convertNameToTitle(oRawFileFromDom.conceptGraphData.name);
        }
        oCompactIORawFile.conceptGraphData.description = oRawFileFromDom.conceptGraphData.description;

        var aConcepts = oRawFileFromDom.concepts;
        // concepts
        var lookupConceptSlugSingularByNumber = [];
        var lookupSetSlugByNumbers = [];
        var lookupSetNameByNumbers = [];
        var lookupSetTitleByNumbers = [];
        var lookupPropertySlugByNumbers = [];
        for (var c=0;c<aConcepts.length;c++) {
            var oConceptStyle1 = aConcepts[c];
            var oConceptStyle2 = MiscFunctions.cloneObj(window.oConceptData)

            var aSets = oConceptStyle1.sets;
            var aProperties = oConceptStyle1.properties;
            var aSpecificInstances = oConceptStyle1.specificInstances;
            var oTemplatingStyle1Data = MiscFunctions.cloneObj(oConceptStyle1.templating);

            var nameSingular = oConceptStyle1.name.singular;
            var namePlural = oConceptStyle1.name.plural;
            if ( (nameSingular) && (!namePlural) ) {
                namePlural = nameSingular + "s";
            }
            var slugSingular = MiscFunctions.convertNameToSlug(nameSingular);
            var slugPlural = MiscFunctions.convertNameToSlug(namePlural);

            lookupConceptSlugSingularByNumber[c] = slugSingular;

            var titleSingular = MiscFunctions.convertNameToTitle(nameSingular);
            var titlePlural = MiscFunctions.convertNameToTitle(namePlural);

            // var description = MiscFunctions.convertNameToDescription(nameSingular);

            var concept_wordSlug = "conceptFor_"+slugSingular;
            var propertyPath = slugSingular+"Data";
            var superset_wordSlug = "supersetFor_"+slugSingular;
            var supersetSlug = slugPlural;
            var superset_wordName = "superset for "+nameSingular;
            var superset_wordTitle = "Superset for "+titleSingular;
            var primaryProperty_wordSlug = "primaryPropertyFor_"+slugSingular;

            oConceptStyle2.wordTypeData.slug = slugSingular;
            oConceptStyle2.wordTypeData.name = nameSingular;
            oConceptStyle2.wordTypeData.title = titleSingular;

            oConceptStyle2.conceptData.slug = slugSingular;
            oConceptStyle2.conceptData.name.singular = nameSingular
            oConceptStyle2.conceptData.name.plural = namePlural
            oConceptStyle2.conceptData.title = titleSingular;
            oConceptStyle2.conceptData.description = "";

            oConceptStyle2.conceptData.oSlug.singular = slugSingular
            oConceptStyle2.conceptData.oSlug.plural = slugPlural

            oConceptStyle2.conceptData.oName.singular = nameSingular
            oConceptStyle2.conceptData.oName.plural = namePlural

            oConceptStyle2.conceptData.oTitle.singular = titleSingular
            oConceptStyle2.conceptData.oTitle.plural = titlePlural

            oConceptStyle2.conceptData.propertyPath = propertyPath;
            oConceptStyle2.governingConceptNameSingular = nameSingular;

            oCompactIORawFile.concepts[concept_wordSlug] = oConceptStyle2;

            ////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////   PROPERTIES   ////////////////////////////////
            // propertiesData
            // console.log("propertiesData; aProperties.length: "+aProperties.length)
            // var propertyNumbersLookupBySlug = {};
            lookupPropertySlugByNumbers[c] = [];
            var propertySlugLookupByNumber = [];
            propertySlugLookupByNumber[-1] = primaryProperty_wordSlug;
            for (var x=0;x<aProperties.length;x++) {
                var oPropertyStyle1 = aProperties[x]
                var oPropertyStyle2 = MiscFunctions.cloneObj(window.oPropertyDataBlank)

                var propertySlug = oPropertyStyle1.propertySlug;
                var propertyName = oPropertyStyle1.propertyName;
                var propertyTitle = oPropertyStyle1.propertyTitle;
                var propertyType = oPropertyStyle1.propertyType;

                lookupPropertySlugByNumbers[c][x] = propertySlug;

                if ( (propertyType=="integer") || (propertyType=="number") ) {
                    if (oPropertyStyle1.keywords.hasOwnProperty("minimum")) {
                        if (oPropertyStyle1.keywords.minimum.restrict == true) {
                            if (oPropertyStyle1.keywords.minimum.hasOwnProperty("minimum")) {
                                if (propertyType=="integer") {
                                    oPropertyStyle2.minimum = parseInt(oPropertyStyle1.keywords.minimum.minimum);
                                }
                                if (propertyType=="number") {
                                    oPropertyStyle2.minimum = parseFloat(oPropertyStyle1.keywords.minimum.minimum);
                                }
                            }
                            if (oPropertyStyle1.keywords.minimum.hasOwnProperty("exclusiveMinimum")) {
                                if (propertyType=="integer") {
                                    oPropertyStyle2.exclusiveMinimum = parseInt(oPropertyStyle1.keywords.minimum.exclusiveMinimum);
                                }
                                if (propertyType=="number") {
                                    oPropertyStyle2.exclusiveMinimum = parseFloat(oPropertyStyle1.keywords.minimum.exclusiveMinimum);
                                }
                            }
                        }
                    }
                    if (oPropertyStyle1.keywords.hasOwnProperty("maximum")) {
                        if (oPropertyStyle1.keywords.maximum.restrict == true) {
                            if (oPropertyStyle1.keywords.maximum.hasOwnProperty("maximum")) {
                                if (propertyType=="integer") {
                                    oPropertyStyle2.maximum = parseInt(oPropertyStyle1.keywords.maximum.maximum);
                                }
                                if (propertyType=="number") {
                                    oPropertyStyle2.maximum = parseFloat(oPropertyStyle1.keywords.maximum.maximum);
                                }
                            }
                            if (oPropertyStyle1.keywords.maximum.hasOwnProperty("exclusiveMaximum")) {
                                if (propertyType=="integer") {
                                    oPropertyStyle2.exclusiveMaximum = parseInt(oPropertyStyle1.keywords.maximum.exclusiveMaximum);
                                }
                                if (propertyType=="number") {
                                    oPropertyStyle2.exclusiveMaximum = parseFloat(oPropertyStyle1.keywords.maximum.exclusiveMaximum);
                                }
                            }
                        }
                    }
                }

                var unique = oPropertyStyle1.unique;
                var required = oPropertyStyle1.required;
                var thisPropertyNumber = oPropertyStyle1.thisPropertyNumber;
                var parentPropertyNumber = oPropertyStyle1.parentPropertyNumber;
                var propertyDescription = MiscFunctions.convertNameToDescription(propertyName);
                propertySlugLookupByNumber[thisPropertyNumber] = propertySlug;

                oPropertyStyle2.slug = propertySlug;
                oPropertyStyle2.key = propertySlug;
                oPropertyStyle2.type = propertyType;
                oPropertyStyle2.name = propertyName;
                oPropertyStyle2.title = propertyTitle;
                oPropertyStyle2.description = propertyDescription;

                oPropertyStyle2.metaData.required = required;
                oPropertyStyle2.metaData.unique = unique;

                oPropertyStyle2.metaData.governingConcept.slug = concept_wordSlug;

                oCompactIORawFile.concepts[concept_wordSlug].propertiesData[propertySlug] = oPropertyStyle2
            }

            // relationships (for properties)
            var aRelationshipsForProperties = [];
            for (var x=0;x<aProperties.length;x++) {
                var oPropertyStyle1 = aProperties[x]

                var propertySlug = oPropertyStyle1.propertySlug;
                var thisPropertyNumber = oPropertyStyle1.thisPropertyNumber;
                var parentPropertyNumber = oPropertyStyle1.parentPropertyNumber;

                var parentPropertySlug = propertySlugLookupByNumber[parentPropertyNumber];

                var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                oNextRel.nodeFrom.slug = propertySlug
                oNextRel.relationshipType.slug = "addToConceptGraphProperties"
                oNextRel.nodeTo.slug = parentPropertySlug
                aRelationshipsForProperties.push(oNextRel)
            }
            oCompactIORawFile.concepts[concept_wordSlug].relationships = aRelationshipsForProperties;

            ////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////   SPECIFIC INSTANCES   ////////////////////////////
            // specificInstancesData
            var specificInstanceSlugLookupByNumber = [];
            for (var x=0;x<aSpecificInstances.length;x++) {
                var oSpecificInstanceStyle1 = aSpecificInstances[x]
                var oSpecificInstanceStyle2 = MiscFunctions.cloneObj(window.oSpecificInstanceDataBlank)

                var specificInstanceSlug = oSpecificInstanceStyle1.specificInstanceSlug;
                var specificInstanceName = oSpecificInstanceStyle1.specificInstanceName;
                var specificInstanceTitle = oSpecificInstanceStyle1.specificInstanceTitle;
                var thisSpecificInstanceNumber = oSpecificInstanceStyle1.thisSpecificInstanceNumber;

                specificInstanceSlugLookupByNumber[thisSpecificInstanceNumber] = specificInstanceSlug

                oSpecificInstanceStyle2.slug = specificInstanceSlug;
                oSpecificInstanceStyle2.name = specificInstanceName;
                oSpecificInstanceStyle2.title = specificInstanceTitle;

                oSpecificInstanceStyle2.metaData.governingConcept.slug = concept_wordSlug;

                oCompactIORawFile.concepts[concept_wordSlug].specificInstancesData[specificInstanceSlug] = oSpecificInstanceStyle2
            }


            ////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////      SETS      ////////////////////////////////
            // setsData
            var setSlugLookupByNumber = [];
            lookupSetSlugByNumbers[c] = [];
            lookupSetNameByNumbers[c] = [];
            lookupSetTitleByNumbers[c] = [];
            // setSlugLookupByNumber[-1] = superset_wordSlug;
            // lookupSetSlugByNumbers[c][-1] = superset_wordSlug;
            setSlugLookupByNumber[-1] = supersetSlug;
            lookupSetSlugByNumbers[c][-1] = supersetSlug;
            lookupSetNameByNumbers[c][-1] = superset_wordName;
            lookupSetTitleByNumbers[c][-1] = superset_wordTitle;
            for (var x=0;x<aSets.length;x++) {
                var oSetStyle1 = aSets[x]
                var oSetStyle2 = MiscFunctions.cloneObj(window.oSetDataBlank)

                var thisSetNumber = oSetStyle1.thisSetNumber;

                var creationType = oSetStyle1.creationType

                if (creationType=="deNovo") {
                    var setSlug = oSetStyle1.setSlug;
                    var setName = oSetStyle1.setName;
                    var setTitle = oSetStyle1.setTitle;

                    setSlugLookupByNumber[thisSetNumber] = setSlug;
                    lookupSetSlugByNumbers[c][thisSetNumber] = setSlug;
                    lookupSetNameByNumbers[c][thisSetNumber] = setName;
                    lookupSetTitleByNumbers[c][thisSetNumber] = setTitle;

                    oSetStyle2.slug = setSlug;
                    oSetStyle2.name = setName;
                    oSetStyle2.title = setTitle;

                    oSetStyle2.metaData.governingConcept.slug = concept_wordSlug;
                    oSetStyle2.metaData.governingConcepts.push(concept_wordSlug);

                    oCompactIORawFile.concepts[concept_wordSlug].setsData[setSlug] = oSetStyle2
                }
            }

            // DEPRECATING THIS STEP ... ???? no need to add set here if it is pulled from another concept
            // (unless it it needed for relationshipsForSets, if the other concept isn't pulled in ... ?????)
            for (var x=0;x<aSets.length;x++) {
                var oSetStyle1 = aSets[x]
                var oSetStyle2 = MiscFunctions.cloneObj(window.oSetDataBlank)

                var thisSetNumber = oSetStyle1.thisSetNumber;

                var creationType = oSetStyle1.creationType

                if (creationType=="preexistingConcept") {
                    var sourceConceptNumber = oSetStyle1.sourceConceptNumber;
                    var sourceSetNumber = oSetStyle1.sourceSetNumber;

                    var sourceSetSlug = lookupSetSlugByNumbers[sourceConceptNumber][sourceSetNumber];
                    var sourceSetName = lookupSetNameByNumbers[sourceConceptNumber][sourceSetNumber];
                    var sourceSetTitle = lookupSetTitleByNumbers[sourceConceptNumber][sourceSetNumber];

                    oSetStyle2.slug = sourceSetSlug;
                    oSetStyle2.name = sourceSetName;
                    oSetStyle2.title = sourceSetTitle;

                    oSetStyle2.metaData.governingConcept.slug = concept_wordSlug;
                    oSetStyle2.metaData.governingConcepts.push(concept_wordSlug);

                    // oCompactIORawFile.concepts[concept_wordSlug].setsData[sourceSetSlug] = oSetStyle2
                }
            }

            // relationshipsForSets
            var aRelationshipsForSets = [];
            for (var x=0;x<aSets.length;x++) {
                var oSetStyle1 = aSets[x];

                var setSlug = oSetStyle1.setSlug;
                var setName = oSetStyle1.setName;
                var setTitle = oSetStyle1.setTitle;
                var thisSetNumber = oSetStyle1.thisSetNumber;
                var directSubsetOfSuperset = oSetStyle1.directSubsetOfSuperset
                var aSubsets = oSetStyle1.subsets

                for (var z=0;z < aSubsets.length; z++) {
                    var oNextSubset = aSubsets[z];
                    var nextSubsetNumber = oNextSubset.subsetNumber;
                    var nextSubsetSlug = setSlugLookupByNumber[nextSubsetNumber];
                    var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                    oNextRel.nodeFrom.slug = nextSubsetSlug
                    oNextRel.relationshipType.slug = "subsetOf"
                    oNextRel.nodeTo.slug = setSlug
                    aRelationshipsForSets.push(oNextRel)
                }

                if (directSubsetOfSuperset) {
                    var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                    oNextRel.nodeFrom.slug = setSlug
                    oNextRel.relationshipType.slug = "subsetOf"
                    oNextRel.nodeTo.slug = superset_wordSlug
                    aRelationshipsForSets.push(oNextRel)
                }
            }
            oCompactIORawFile.concepts[concept_wordSlug].relationshipsForSets = aRelationshipsForSets;

            // relationshipsForSpecificInstances
            var aRelationshipsForSpecificInstances = [];
            for (var x=0;x<aSpecificInstances.length;x++) {
                var oSpecificInstanceStyle1 = aSpecificInstances[x]

                var specificInstanceSlug = oSpecificInstanceStyle1.specificInstanceSlug;
                // var specificInstanceName = oSpecificInstanceStyle1.specificInstanceName;
                // var specificInstanceTitle = oSpecificInstanceStyle1.specificInstanceTitle;
                // var thisSpecificInstanceNumber = oSpecificInstanceStyle1.thisSpecificInstanceNumber;
                var directSpecificInstanceOfSuperset = oSpecificInstanceStyle1.directSpecificInstanceOfSuperset

                if (directSpecificInstanceOfSuperset) {
                    var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                    oNextRel.nodeFrom.slug = specificInstanceSlug
                    oNextRel.relationshipType.slug = "isASpecificInstanceOf"
                    oNextRel.nodeTo.slug = superset_wordSlug
                    aRelationshipsForSpecificInstances.push(oNextRel)
                }
            }

            for (var x=0;x<aSets.length;x++) {
                var oSetStyle1 = aSets[x];

                var setSlug = oSetStyle1.setSlug;
                var setName = oSetStyle1.setName;
                var setTitle = oSetStyle1.setTitle;
                var thisSetNumber = oSetStyle1.thisSetNumber;
                var aThisSetChildSpecificInstances = oSetStyle1.specificInstances;

                for (var z=0;z<aThisSetChildSpecificInstances.length;z++) {
                    var oNextChildSi = aThisSetChildSpecificInstances[z];
                    var nextChildSiNumber = oNextChildSi.specificInstanceNumber;

                    var nextChildSiSlug = specificInstanceSlugLookupByNumber[nextChildSiNumber];

                    var oNextRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                    oNextRel.nodeFrom.slug = nextChildSiSlug
                    oNextRel.relationshipType.slug = "isASpecificInstanceOf"
                    oNextRel.nodeTo.slug = setSlug
                    aRelationshipsForSpecificInstances.push(oNextRel)
                }
            }
            oCompactIORawFile.concepts[concept_wordSlug].relationshipsForSpecificInstances = aRelationshipsForSpecificInstances;
        }
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////      ENUMERATIONS      ////////////////////////////
        for (var c=0;c<aConcepts.length;c++) {
            var oConceptStyle1 = aConcepts[c];
            var nameSingular = oConceptStyle1.name.singular
            var conceptSlugSingular = MiscFunctions.convertNameToSlug(nameSingular);
            var aProperties = oConceptStyle1.properties;
            for (var x=0;x<aProperties.length;x++) {
                var oPropertyStyle1 = aProperties[x];
                var propertySlug = oPropertyStyle1.propertySlug;
                var propertyType = oPropertyStyle1.propertyType;
                var propertyKeyPaths = oPropertyStyle1.propertyKeyPaths;
                // var propertyKey = oPropertyStyle1.propertyKey;

                var oEnumerationData = oPropertyStyle1.enumerationData;
                if (oEnumerationData.limitValues==true) {
                    // console.log("oEnumerationData: "+JSON.stringify(oEnumerationData,null,4));
                    var sourceConceptNumber = oEnumerationData.sourceConceptNumber;
                    var sourceSetNumber = oEnumerationData.sourceSetNumber;
                    var withSubsets = oEnumerationData.withSubsets;
                    var withDependencies = oEnumerationData.withDependencies;
                    var dependenciesPlacement = oEnumerationData.dependenciesPlacement;
                    if ( (sourceConceptNumber != null) && (sourceSetNumber != null) ) {
                        var sourceConceptSlugSingular = lookupConceptSlugSingularByNumber[sourceConceptNumber]
                        var sourceSetSlug = lookupSetSlugByNumbers[sourceConceptNumber][sourceSetNumber]
                        var oEnumeration = MiscFunctions.cloneObj(window.oBlankEnumeration);
                        var nF_slug = "setOf_"+sourceSetSlug;
                        var nT_slug = "propertyFor_"+nameSingular+"_"+propertySlug;
                        var targetPropertyType = propertyType;
                        var uniquePropertyKey = "name";
                        var e_slug = "enumerationOf_"+sourceConceptSlugSingular+"_"+sourceSetSlug+"_by_"+uniquePropertyKey + "_toModify_" + c + "_" + x;
                        oEnumeration.restrictsValueData.nodeFrom.slug = nF_slug;
                        oEnumeration.restrictsValueData.nodeFrom.sourceConceptSlug = sourceConceptSlugSingular;
                        oEnumeration.restrictsValueData.nodeFrom.sourceSetSlug = sourceSetSlug;
                        oEnumeration.restrictsValueData.nodeTo.slug = nT_slug;
                        oEnumeration.restrictsValueData.nodeTo.targetConceptSlug = conceptSlugSingular;
                        oEnumeration.restrictsValueData.nodeTo.targetPropertyKey = propertySlug;
                        oEnumeration.restrictsValueData.nodeTo.targetPropertyKeyPaths = propertyKeyPaths;
                        oEnumeration.restrictsValueData.targetPropertyType = targetPropertyType;
                        oEnumeration.restrictsValueData.uniquePropertyKey = uniquePropertyKey;
                        oEnumeration.restrictsValueData.withSubsets = withSubsets;
                        oEnumeration.restrictsValueData.withDependencies = withDependencies;
                        oEnumeration.restrictsValueData.dependenciesPlacement = dependenciesPlacement;
                        oCompactIORawFile.enumerations[e_slug] = oEnumeration;
                    }
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////      TEMPLATING      ////////////////////////////
        for (var c=0;c<aConcepts.length;c++) {
            var oConceptStyle1 = aConcepts[c];

            var nameSingular = oConceptStyle1.name.singular;
            var slugSingular = MiscFunctions.convertNameToSlug(nameSingular);
            var concept_wordSlug = "conceptFor_"+slugSingular;

            var oTemplatingStyle1Data = MiscFunctions.cloneObj(oConceptStyle1.templating);

            // var oTemplatingStyle2Data = {};
            var method = oTemplatingStyle1Data.method;
            var tCN = oTemplatingStyle1Data.templateConceptNumber;
            var iPN = oTemplatingStyle1Data.independentPropertyNumber;
            var aSecondaryPropertyNumbers = oTemplatingStyle1Data.secondaryPropertyNumbers;

            var templateConcept = null;
            if (tCN != null) {
                templateConcept = lookupConceptSlugSingularByNumber[tCN];
            }

            var independentPropertySlug = null;
            if (iPN != null) {
                independentPropertySlug = lookupPropertySlugByNumbers[c][iPN];
            }

            // console.log("c="+c+"; tCN: "+tCN)
            // console.log("c="+c+"; nameSingular: "+nameSingular)
            // console.log("c="+c+"; lookupConceptSlugSingularByNumber: "+JSON.stringify(lookupConceptSlugSingularByNumber,null,4))
            // console.log("c="+c+"; oTemplatingStyle1Data.templateConceptNumber: "+JSON.stringify(oTemplatingStyle1Data.templateConceptNumber,null,4)+"; oTemplatingStyle1Data: "+JSON.stringify(oTemplatingStyle1Data,null,4))

            oCompactIORawFile.concepts[concept_wordSlug].templating.method = method;
            oCompactIORawFile.concepts[concept_wordSlug].templating.templateConcept = templateConcept;
            oCompactIORawFile.concepts[concept_wordSlug].templating.independentProperty = independentPropertySlug;
            var aDP = [];
            var dependentPropertySlug = null;
            for (var z=0;z < aSecondaryPropertyNumbers.length;z++) {
                var sPN = aSecondaryPropertyNumbers[z];
                dependentPropertySlug = null;
                if (sPN != null) {
                    dependentPropertySlug = lookupPropertySlugByNumbers[c][sPN];
                    aDP.push(dependentPropertySlug)
                }
            }
            oCompactIORawFile.concepts[concept_wordSlug].templating.dependentProperties = aDP;

            oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating = {};
            oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.templateCreationEnabled = null;
            oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.templatingConcept = {};
            oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.templatingConcept.wordSlug = null;
            oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.templatingConcept.conceptSlug = null;
            oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.primaryFields = [];
            oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.dependentFields = [];

            oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.templateCreationEnabled = false;
            if (method=="none") {
                oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.templateCreationEnabled = false;
            }
            if (method=="autogenerate") {
                oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.templateCreationEnabled = true;
            }
            if (method=="existing") {
                oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.templateCreationEnabled = true;
                oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.templatingConcept.wordSlug = "conceptFor_"+templateConcept
                oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.templatingConcept.conceptSlug = templateConcept
            }

            if (oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.templateCreationEnabled == true) {
                var oPropertyField = {}
                oPropertyField.propertyKeyPath = null;
                oPropertyField.property = {};
                oPropertyField.property.wordSlug = null;
                oPropertyField.property.type = null;
                oPropertyField.property.key = null;

                var oPrimaryField = MiscFunctions.cloneObj(oPropertyField)
                oPrimaryField.propertyKeyPath = generatePropertyKeyPath(c,iPN);
                oPrimaryField.property.type = window.cgOverviewPage.concepts[c].properties[iPN].propertyType;
                oPrimaryField.property.key = window.cgOverviewPage.concepts[c].properties[iPN].propertyKey;
                oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.primaryFields.push(oPrimaryField)

                for (var z=0;z < aSecondaryPropertyNumbers.length;z++) {
                    var sPN = aSecondaryPropertyNumbers[z];
                    dependentPropertySlug = null;
                    if (sPN != null) {
                        dependentPropertySlug = lookupPropertySlugByNumbers[c][sPN];
                        var oSecondaryField = MiscFunctions.cloneObj(oPropertyField)
                        oSecondaryField.propertyKeyPath = generatePropertyKeyPath(c,sPN);
                        oSecondaryField.property.key = dependentPropertySlug;
                        oCompactIORawFile.concepts[concept_wordSlug].conceptData.templating.dependentFields.push(oSecondaryField)
                    }
                }
            }
        }

        jQuery("#currentCompactImportExportRawFileTextarea").val(JSON.stringify(oCompactIORawFile,null,4))
    }
}
