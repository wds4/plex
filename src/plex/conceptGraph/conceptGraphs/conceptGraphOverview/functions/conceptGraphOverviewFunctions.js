import sendAsync from '../../../../renderer.js';
import IpfsHttpClient from 'ipfs-http-client';
import * as MiscFunctions from '../../../../functions/miscFunctions.js';
import * as CGOverviewHTMLFunctions from './conceptGraphOverviewHTMLFunctions.js';
import * as CGOverviewMainPageFunctions from '../overviewMainPage.js';
import * as CompactFileFormattingFunctions from './translateBetweenCompactFileFormats.js';
const jQuery = require("jquery");

// window.cgOverviewPage.loadingStoredConceptGraph = false;

const toggleElemHeight = "400px";

export const openSetsContainer = (conceptNumber) => {
    jQuery("#toggleSetsButton_"+conceptNumber).data("status","open");
    jQuery("#toggleSetsButton_"+conceptNumber).css("background-color","green");
    var setsContainerHeight = jQuery("#setsContainer_"+conceptNumber).css("height");
    var setsContainerHeight = parseInt(setsContainerHeight.slice(0,-2)) + 15;
    setsContainerHeight += "px";
    if (!window.cgOverviewPage.loadingStoredConceptGraph) {
        jQuery("#setsContainerWrapper_"+conceptNumber).animate({
            height: setsContainerHeight,
            padding: "3px",
            borderWidth:"1px"
        },500);
    }
}
export const closeSetsContainer = (conceptNumber) => {
    jQuery("#toggleSetsButton_"+conceptNumber).data("status","closed");
    jQuery("#toggleSetsButton_"+conceptNumber).css("background-color","#DFDFDF");
    if (!window.cgOverviewPage.loadingStoredConceptGraph) {
        jQuery("#setsContainerWrapper_"+conceptNumber).animate({
            height: "0px",
            padding: "0px",
            borderWidth:"0px"
        },500);
    }
}
export const openPropertiesContainer = (conceptNumber) => {
    jQuery("#togglePropertiesButton_"+conceptNumber).data("status","open");
    jQuery("#togglePropertiesButton_"+conceptNumber).css("background-color","green");
    var propertiesContainerHeight = jQuery("#propertiesContainer_"+conceptNumber).css("height");
    var propertiesContainerHeight = parseInt(propertiesContainerHeight.slice(0,-2)) + 15;
    propertiesContainerHeight += "px";
    if (!window.cgOverviewPage.loadingStoredConceptGraph) {
        jQuery("#propertiesContainerWrapper_"+conceptNumber).animate({
            height: propertiesContainerHeight,
            padding: "3px",
            borderWidth:"1px"
        },500);
    }
}
export const closePropertiesContainer = (conceptNumber) => {
    jQuery("#togglePropertiesButton_"+conceptNumber).data("status","closed");
    jQuery("#togglePropertiesButton_"+conceptNumber).css("background-color","#DFDFDF");
    if (!window.cgOverviewPage.loadingStoredConceptGraph) {
        jQuery("#propertiesContainerWrapper_"+conceptNumber).animate({
            height: "0px",
            padding: "0px",
            borderWidth:"0px"
        },500);
    }
}
export const openSpecificInstancesContainer = (conceptNumber) => {
    jQuery("#toggleSpecificInstancesButton_"+conceptNumber).data("status","open");
    jQuery("#toggleSpecificInstancesButton_"+conceptNumber).css("background-color","green");
    var siContainerHeight = jQuery("#specificInstancesContainer_"+conceptNumber).css("height");
    var siContainerHeight = parseInt(siContainerHeight.slice(0,-2)) + 15;
    siContainerHeight += "px";
    if (!window.cgOverviewPage.loadingStoredConceptGraph) {
        jQuery("#specificInstancesContainerWrapper_"+conceptNumber).animate({
            height: siContainerHeight,
            padding: "3px",
            borderWidth:"1px"
        },500);
    }
}
export const closeSpecificInstancesContainer = (conceptNumber) => {
    jQuery("#toggleSpecificInstancesButton_"+conceptNumber).data("status","closed");
    jQuery("#toggleSpecificInstancesButton_"+conceptNumber).css("background-color","#DFDFDF");
    if (!window.cgOverviewPage.loadingStoredConceptGraph) {
        jQuery("#specificInstancesContainerWrapper_"+conceptNumber).animate({
            height: "0px",
            padding: "0px",
            borderWidth:"0px"
        },500);
    }
}
export const openTemplatingContainer = (conceptNumber) => {
    jQuery("#toggleTemplatingButton_"+conceptNumber).data("status","open");
    jQuery("#toggleTemplatingButton_"+conceptNumber).css("background-color","green");
    var tContainerHeight = jQuery("#templatingContainer_"+conceptNumber).css("height");
    var tContainerHeight = parseInt(tContainerHeight.slice(0,-2)) + 15;
    tContainerHeight += "px";
    if (!window.cgOverviewPage.loadingStoredConceptGraph) {
        jQuery("#templatingContainerWrapper_"+conceptNumber).animate({
            height: tContainerHeight,
            padding: "3px",
            borderWidth:"1px"
        },500);
    }
}
export const closeTemplatingContainer = (conceptNumber) => {
    jQuery("#toggleTemplatingButton_"+conceptNumber).data("status","closed");
    jQuery("#toggleTemplatingButton_"+conceptNumber).css("background-color","#DFDFDF");
    if (!window.cgOverviewPage.loadingStoredConceptGraph) {
        jQuery("#templatingContainerWrapper_"+conceptNumber).animate({
            height: "0px",
            padding: "0px",
            borderWidth:"0px"
        },500);
    }
}
export const updateWindowCgOverviewFields = () => {
    console.log("updateWindowCgOverviewFields");
    // update concept graph name and description
    window.cgOverviewPage.conceptGraphData.name = jQuery("#conceptGraphNameTextarea").val();
    window.cgOverviewPage.conceptGraphData.description = jQuery("#conceptGraphDescriptionTextarea").val();
    for (var cN=0;cN<window.cgOverviewPage.concepts.length;cN++) {
        window.cgOverviewPage.concepts[cN].name.singular = jQuery("#conceptNameSingular_"+cN).val();

        var numberOfProperties = window.cgOverviewPage.concepts[cN].properties.length;
        var numberOfSets = window.cgOverviewPage.concepts[cN].sets.length;
        var numberOfSpecificInstances = window.cgOverviewPage.concepts[cN].specificInstances.length;
        jQuery("#numberOfProperties_"+cN).html(numberOfProperties)
        jQuery("#numberOfSets_"+cN).html(numberOfSets)
        jQuery("#numberOfSpecificInstances_"+cN).html(numberOfSpecificInstances)

        jQuery("#numberOfProperties_"+cN).css("color","#BFBFBF")
        jQuery("#numberOfSets_"+cN).css("color","#BFBFBF")
        jQuery("#numberOfSpecificInstances_"+cN).css("color","#BFBFBF")

        if (numberOfProperties > 0) { jQuery("#numberOfProperties_"+cN).css("color","purple") }
        if (numberOfSets > 0) { jQuery("#numberOfSets_"+cN).css("color","purple") }
        if (numberOfSpecificInstances > 0) { jQuery("#numberOfSpecificInstances_"+cN).css("color","purple") }

        for (var pN=0;pN<window.cgOverviewPage.concepts[cN].properties.length;pN++) {
            var propertyName = jQuery("#propertyName_"+cN+"_"+pN).val();
            var propertyType = jQuery("#propertyTypeSelector_"+cN+"_"+pN+" option:selected").data("value")
            var required = jQuery("#propertyRequiredCheckbox_"+cN+"_"+pN).prop("checked")
            var unique = jQuery("#propertyUniqueCheckbox_"+cN+"_"+pN).prop("checked")
            var propertySlug = MiscFunctions.convertNameToSlug(propertyName);
            var propertyTitle = MiscFunctions.convertNameToTitle(propertyName);
            var propertyKey = propertySlug;
            var propertyKeyPaths = [];
            var parentPropertyNumber = window.cgOverviewPage.concepts[cN].properties[pN].parentPropertyNumber;
            if (parentPropertyNumber ==- 1) {
                var propertyPath = MiscFunctions.convertNameToSlug(window.cgOverviewPage.concepts[cN].name.singular)+"Data";
                propertyKeyPaths = [propertyPath+"."+propertyKey]
            }
            if (parentPropertyNumber > -1) {
                var parentPropertyKeyPaths = window.cgOverviewPage.concepts[cN].properties[parentPropertyNumber].propertyKeyPaths
                // var fooPKP = "parent has "+parentPropertyKeyPaths.length+" property key paths";
                // propertyKeyPaths = [ fooPKP ];
                for (var x=0;x<parentPropertyKeyPaths.length;x++) {
                    var parentKeyPath = parentPropertyKeyPaths[x];
                    var childKeyPath = parentKeyPath + "." + propertyKey;
                    propertyKeyPaths.push(childKeyPath)
                }
            }
            window.cgOverviewPage.concepts[cN].properties[pN].propertyName = propertyName;
            window.cgOverviewPage.concepts[cN].properties[pN].propertySlug = propertySlug;
            window.cgOverviewPage.concepts[cN].properties[pN].propertyKey = propertyKey;
            window.cgOverviewPage.concepts[cN].properties[pN].propertyKeyPaths = propertyKeyPaths;
            window.cgOverviewPage.concepts[cN].properties[pN].propertyTitle = propertyTitle;
            window.cgOverviewPage.concepts[cN].properties[pN].propertyType = propertyType;
            window.cgOverviewPage.concepts[cN].properties[pN].required = required;
            window.cgOverviewPage.concepts[cN].properties[pN].unique = unique;
        }
        for (var sN=0;sN<window.cgOverviewPage.concepts[cN].sets.length;sN++) {
            var setName = jQuery("#setName_"+cN+"_"+sN).val();
            window.cgOverviewPage.concepts[cN].sets[sN].setName = setName
            window.cgOverviewPage.concepts[cN].sets[sN].setSlug = MiscFunctions.convertNameToSlug(setName);
            window.cgOverviewPage.concepts[cN].sets[sN].setTitle = MiscFunctions.convertNameToTitle(setName);
            // console.log("updateWindowCgOverviewFields; cN: "+cN+"; sN: "+sN)
        }
        for (var siN=0;siN<window.cgOverviewPage.concepts[cN].specificInstances.length;siN++) {
            var creationType = window.cgOverviewPage.concepts[cN].specificInstances[siN].creationType;
            if (creationType=="preexistingConcept") {
                var sourceConceptNumber = window.cgOverviewPage.concepts[cN].specificInstances[siN].sourceConceptNumber;
                var sNme = window.cgOverviewPage.concepts[sourceConceptNumber].name.singular;
                var cSlg = MiscFunctions.convertNameToSlug(sNme)
                var cTle = MiscFunctions.convertNameToTitle(sNme)
                window.cgOverviewPage.concepts[cN].specificInstances[siN].specificInstanceSlug = "wordTypeFor_"+cSlg;
                window.cgOverviewPage.concepts[cN].specificInstances[siN].specificInstanceName = "word type for "+sNme;
                window.cgOverviewPage.concepts[cN].specificInstances[siN].specificInstanceTitle = "Word Type for "+cTle;
            }
            if (creationType=="deNovo") {
                var specificInstanceName = jQuery("#specificInstanceNameSingularTextarea_"+cN+"_"+siN).val();
                window.cgOverviewPage.concepts[cN].specificInstances[siN].specificInstanceName = specificInstanceName;
                window.cgOverviewPage.concepts[cN].specificInstances[siN].specificInstanceSlug = MiscFunctions.convertNameToSlug(specificInstanceName);
                window.cgOverviewPage.concepts[cN].specificInstances[siN].specificInstanceTitle = MiscFunctions.convertNameToTitle(specificInstanceName);
            }
        }
    }

    var numberOfConcepts = window.cgOverviewPage.concepts.length;
    jQuery("#numberOfConcepts").html(numberOfConcepts)

    CGOverviewMainPageFunctions.updateRawFileFromDOM();
    CompactFileFormattingFunctions.translateFromDOMToCompactImportExportRawFile();
}
export const actionsAfterHTMLChange = () => {
    console.log("actionsAfterHTMLChange")
    updateWindowCgOverviewFields();
    CGOverviewHTMLFunctions.redrawAllRestrictionsByEnumerationHTML();
    CGOverviewHTMLFunctions.redrawAllSpecificInstanceSourceConceptSelectors();
    CGOverviewHTMLFunctions.redrawAllSetSourceConceptSelectors();
    CGOverviewHTMLFunctions.redrawAllSetChildSpecificInstanceMatchSelectors();
    CGOverviewHTMLFunctions.redrawAllSetChildSubsetMatchSelectors();
    CGOverviewHTMLFunctions.redrawAllExistingTemplatingConceptSelectors();
    runBindings();

    /*
    updateWindowCgOverviewFields();
    CGOverviewHTMLFunctions.redrawAllRestrictionsByEnumerationHTML();
    CGOverviewHTMLFunctions.redrawAllSpecificInstanceSourceConceptSelectors();
    CGOverviewHTMLFunctions.redrawAllSetSourceConceptSelectors();
    CGOverviewHTMLFunctions.redrawAllSetChildSpecificInstanceMatchSelectors();
    CGOverviewHTMLFunctions.redrawAllSetChildSubsetMatchSelectors();
    CGOverviewHTMLFunctions.redrawAllExistingTemplatingConceptSelectors();
    runBindings();
    */
}

export const recalculateNumericPropertyFields = (conceptNumber,propertyNumber) => {
    var type = jQuery("#propertyTypeSelector_"+conceptNumber+"_"+propertyNumber+" option:selected").data("value")

    var minimumOption = jQuery("#numericPropertyMinimumTypeSelector_"+conceptNumber+"_"+propertyNumber+" option:selected").data("minimumoption")
    var minimumField = jQuery("#propertyMinimumValue_"+conceptNumber+"_"+propertyNumber).val();
    if (type=="integer") {
        minimumField = parseInt(minimumField);
    }
    if (type=="number") {
        minimumField = parseFloat(minimumField);
    }
    window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].keywords.minimum = {};
    if (minimumOption=="unrestricted") {
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].keywords.minimum.restrict = false
    }
    if (minimumOption=="minimum") {
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].keywords.minimum.restrict = true
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].keywords.minimum.minimum = minimumField;
    }
    if (minimumOption=="exclusiveMinimum") {
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].keywords.minimum.restrict = true
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].keywords.minimum.exclusiveMinimum = minimumField;
    }

    var maximumOption = jQuery("#numericPropertyMaximumTypeSelector_"+conceptNumber+"_"+propertyNumber+" option:selected").data("maximumoption")
    var maximumField = jQuery("#propertyMaximumValue_"+conceptNumber+"_"+propertyNumber).val();
    if (type=="integer") {
        maximumField = parseInt(maximumField);
    }
    if (type=="number") {
        maximumField = parseFloat(maximumField);
    }
    window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].keywords.maximum = {};
    if (maximumOption=="unrestricted") {
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].keywords.maximum.restrict = false
    }
    if (maximumOption=="maximum") {
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].keywords.maximum.restrict = true
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].keywords.maximum.maximum = maximumField;
    }
    if (maximumOption=="exclusiveMaximum") {
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].keywords.maximum.restrict = true
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].keywords.maximum.exclusiveMaximum = maximumField;
    }
}
export const recalculateSetSourceFields = (conceptNumber,setNumber) => {
    /*
    var setCreationType = jQuery("#singleSetTypeSelector_"+conceptNumber+"_"+propertyNumber+" option:selected").data("setcreationtype");
    if (setCreationType=="deNovo") {

    }
    */
    var sourceConceptNumber = jQuery("#setSourceConceptSelector_"+conceptNumber+"_"+setNumber+" option:selected").data("setsourceconceptnumber")
    var sourceSetNumber = jQuery("#setSourceSetSelector_"+conceptNumber+"_"+setNumber+" option:selected").data("setsourcesetnumber")
    console.log("recalculateSetSourceFields; conceptNumber: "+conceptNumber+"; setNumber: "+setNumber)
    window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].sourceConceptNumber = sourceConceptNumber;
    window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].sourceSetNumber = sourceSetNumber;
}
export const recalculatePropertyEnumerationFields = (conceptNumber,propertyNumber) => {
    var isChecked = jQuery("#limitValuesCheckbox_"+conceptNumber+"_"+propertyNumber).prop("checked");
    if (!isChecked) {
        jQuery("#enumerationSourceSelectorsContainer_"+conceptNumber+"_"+propertyNumber).css("display","none")
    }
    if (isChecked) {
        var withSubsets = jQuery("#enumerationWithSubsetsCheckbox_"+conceptNumber+"_"+propertyNumber).prop("checked")
        var dependenciesOption = jQuery("#enumerationWithDependenciesSelector_"+conceptNumber+"_"+propertyNumber+" option:selected").data("dependenciesoption");
        if (dependenciesOption=="none") {
            var withDependencies = false;
            var dependenciesPlacement = null;
        }
        if (dependenciesOption=="lower") {
            var withDependencies = true;
            var dependenciesPlacement = "lower";
        }
        if (dependenciesOption=="upper") {
            var withDependencies = true;
            var dependenciesPlacement = "upper";
        }
        jQuery("#enumerationSourceSelectorsContainer_"+conceptNumber+"_"+propertyNumber).css("display","inline-block")
        jQuery("#propertyStringPatternCheckbox_"+conceptNumber+"_"+propertyNumber).prop("checked",false).change();
        var sourceConceptNumber = jQuery("#enumerationSourceConceptSelector_"+conceptNumber+"_"+propertyNumber+" option:selected").data("enumerationsourceconceptnumber");
        var sourceSetNumber = jQuery("#enumerationSourceSetSelector_"+conceptNumber+"_"+propertyNumber+" option:selected").data("enumerationsourcesetnumber");
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.sourceConceptNumber = sourceConceptNumber;
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.sourceSetNumber = sourceSetNumber;
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.withSubsets = withSubsets;
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.withDependencies = withDependencies;
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.dependenciesPlacement = dependenciesPlacement;
    }
}
export const updateTemplatingIndependentPropertyNumberDisplay = (conceptNumber) => {
    var primaryTemplatingPropertyNumber = window.cgOverviewPage.concepts[conceptNumber].templating.independentPropertyNumber;
    var displayHTML = "";
    if (primaryTemplatingPropertyNumber != null) {
        var propertyName = window.cgOverviewPage.concepts[conceptNumber].properties[primaryTemplatingPropertyNumber].propertyName;
        displayHTML += primaryTemplatingPropertyNumber + " ";
        displayHTML += propertyName;
    }
    jQuery("#templatingIndependentPropertyContainer_"+conceptNumber).html(displayHTML)
}
export const updateTemplatingSecondaryPropertiesNumberDisplay = (conceptNumber) => {
    var aSecondaryTemplatingPropertyNumbers = window.cgOverviewPage.concepts[conceptNumber].templating.secondaryPropertyNumbers;
    var displayHTML = "";
    for (var t=0;t < aSecondaryTemplatingPropertyNumbers.length;t++) {
        var nextPropertyNumber = aSecondaryTemplatingPropertyNumbers[t];
        var nextPropertyName = window.cgOverviewPage.concepts[conceptNumber].properties[nextPropertyNumber].propertyName;
        displayHTML += "<div>";
        displayHTML += nextPropertyNumber + " ";
        displayHTML += nextPropertyName;
        displayHTML += "</div>";
    }
    jQuery("#templatingDependentPropertiesContainer_"+conceptNumber).html(displayHTML)
}
export const runBindings = () => {
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////// CHECKBOXES ////////////////////////////////////////////////
    jQuery(".propertyStringPatternCheckbox").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        var isPatternChecked = jQuery("#propertyStringPatternCheckbox_"+conceptNumber+"_"+propertyNumber).prop("checked")
        if (isPatternChecked) {
            jQuery("#limitValuesCheckbox_"+conceptNumber+"_"+propertyNumber).prop("checked",false).change();
            jQuery("#propertyStringPatternTextareaContainer_"+conceptNumber+"_"+propertyNumber).css("display","inline-block");
        }
        if (!isPatternChecked) {
            jQuery("#propertyStringPatternTextareaContainer_"+conceptNumber+"_"+propertyNumber).css("display","none");
        }
    });
    jQuery(".limitValuesCheckbox").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        var isChecked = jQuery(this).prop("checked");
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.limitValues = isChecked;
        if (!isChecked) {
            jQuery("#enumerationSourceSelectorsContainer_"+conceptNumber+"_"+propertyNumber).css("display","none")
            jQuery("#enumerationContainerB_"+conceptNumber+"_"+propertyNumber).css("display","none")
        }
        if (isChecked) {
            jQuery("#enumerationSourceSelectorsContainer_"+conceptNumber+"_"+propertyNumber).css("display","inline-block")
            jQuery("#enumerationContainerB_"+conceptNumber+"_"+propertyNumber).css("display","inline-block")
            jQuery("#propertyStringPatternCheckbox_"+conceptNumber+"_"+propertyNumber).prop("checked",false).change();
            recalculatePropertyEnumerationFields(conceptNumber,propertyNumber)
        }
    });
    jQuery(".propertyRequiredCheckbox").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        var required = jQuery("#propertyRequiredCheckbox_"+conceptNumber+"_"+propertyNumber).prop("checked")
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].required = required;
    })
    jQuery(".propertyUniqueCheckbox").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        var unique = jQuery("#propertyUniqueCheckbox_"+conceptNumber+"_"+propertyNumber).prop("checked")
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].unique = unique;
    })
    jQuery(".enumerationWithSubsetsCheckbox").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        recalculatePropertyEnumerationFields(conceptNumber,propertyNumber)
    })
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////// DATA FIELDS ////////////////////////////////////////////////
    jQuery(".propertyMinimumValue").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        recalculateNumericPropertyFields(conceptNumber,propertyNumber);
    })
    jQuery(".propertyMaximumValue").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        recalculateNumericPropertyFields(conceptNumber,propertyNumber);
    })
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////// SELECTORS /////////////////////////////////////////////////

    jQuery(".existingTemplatingConceptSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var templatingConceptNumber = jQuery("#existingTemplatingConceptSelector_"+conceptNumber+" option:selected").data("templateconceptnumber");
        window.cgOverviewPage.concepts[conceptNumber].templating.templateConceptNumber = templatingConceptNumber;
    });
    jQuery(".templatingConceptSourceMethodSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var templatingConceptSourceMethod = jQuery("#templatingConceptSourceMethodSelector_"+conceptNumber+" option:selected").data("templatingconceptsourcemethod");
        console.log("templatingConceptSourceMethodSelector changed; conceptNumber: "+conceptNumber+"; templatingConceptSourceMethod: "+templatingConceptSourceMethod)
        if (templatingConceptSourceMethod=="noTemplatingConcept") {
            window.cgOverviewPage.concepts[conceptNumber].templating.method = "none";
            jQuery("#templating_"+conceptNumber).html("&#10006;")
            jQuery(".templatingButton_"+conceptNumber).css("display","none")
            jQuery("#existingTemplatingConceptSelectorContainer_"+conceptNumber).css("display","none")
        }
        if (templatingConceptSourceMethod=="autogenerateNewTemplatingConcept") {
            window.cgOverviewPage.concepts[conceptNumber].templating.method = "autogenerate";
            jQuery("#templating_"+conceptNumber).html("&#10004")
            jQuery(".templatingButton_"+conceptNumber).css("display","inline-block")
            jQuery("#existingTemplatingConceptSelectorContainer_"+conceptNumber).css("display","none")
        }
        if (templatingConceptSourceMethod=="linkToExistingTemplatingConcept") {
            window.cgOverviewPage.concepts[conceptNumber].templating.method = "existing";
            jQuery("#templating_"+conceptNumber).html("&#10004")
            jQuery(".templatingButton_"+conceptNumber).css("display","inline-block")
            jQuery("#existingTemplatingConceptSelectorContainer_"+conceptNumber).css("display","inline-block")
        }
    });
    jQuery(".setSourceSetSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var setNumber = jQuery(this).data("setnumber");
        recalculateSetSourceFields(conceptNumber,setNumber)
    });
    jQuery(".setSourceConceptSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var setNumber = jQuery(this).data("setnumber");
        recalculateSetSourceFields(conceptNumber,setNumber)
    });
    jQuery(".enumerationWithDependenciesSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        recalculatePropertyEnumerationFields(conceptNumber,propertyNumber)
    });

    jQuery(".numericPropertyMinimumTypeSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        recalculateNumericPropertyFields(conceptNumber,propertyNumber);
    });
    jQuery(".numericPropertyMaximumTypeSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        recalculateNumericPropertyFields(conceptNumber,propertyNumber);
    });

    jQuery(".setChildSubsetMatchSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var setNumber = jQuery(this).data("setnumber");
        var childSubsetNumber = jQuery(this).data("childsubsetnumber");
        var subsetNumber = jQuery("#setChildSubsetMatchSelector_"+conceptNumber+"_"+setNumber+"_"+childSubsetNumber+" option:selected").data("subsetnumber")
        window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].subsets[childSubsetNumber].subsetNumber = subsetNumber;
    });
    jQuery(".setChildSpecificInstanceMatchSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var setNumber = jQuery(this).data("setnumber");
        var childSpecificInstanceNumber = jQuery(this).data("childspecificinstancenumber");
        var specificInstanceNumber = jQuery("#setChildSpecificInstanceMatchSelector_"+conceptNumber+"_"+setNumber+"_"+childSpecificInstanceNumber+" option:selected").data("specificinstancenumber")
        window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].specificInstances[childSpecificInstanceNumber].specificInstanceNumber = specificInstanceNumber;
    });
    jQuery(".specificInstanceSourceConceptSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var specificInstanceNumber = jQuery(this).data("specificinstancenumber");
        var specificInstanceSourceConceptNumber = jQuery("#specificInstanceSourceConceptSelector_"+conceptNumber+"_"+specificInstanceNumber+" option:selected").data("specificinstancesourceconceptnumber")
        window.cgOverviewPage.concepts[conceptNumber].specificInstances[specificInstanceNumber].sourceConceptNumber = specificInstanceSourceConceptNumber;
    });
    jQuery(".singleSetTypeSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var setNumber = jQuery(this).data("setnumber");
        var setCreationType = jQuery("#singleSetTypeSelector_"+conceptNumber+"_"+setNumber+" option:selected").data("setcreationtype")
        window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].creationType = setCreationType;
        if (setCreationType=="deNovo") {
            jQuery("#setName_"+conceptNumber+"_"+setNumber).css("display","inline-block")
            jQuery("#setSourceConceptSelectorContainer_"+conceptNumber+"_"+setNumber).css("display","none")
            jQuery("#setSourceSetSelectorContainer_"+conceptNumber+"_"+setNumber).css("display","none")
        }
        if (setCreationType=="preexistingConcept") {
            jQuery("#setName_"+conceptNumber+"_"+setNumber).css("display","none")
            jQuery("#setSourceConceptSelectorContainer_"+conceptNumber+"_"+setNumber).css("display","inline-block")
            jQuery("#setSourceSetSelectorContainer_"+conceptNumber+"_"+setNumber).css("display","inline-block")
            var setSourceConceptNumber = jQuery("#setSourceConceptSelector_"+conceptNumber+"_"+setNumber+" option:selected").data("setsourceconceptnumber")
            window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].sourceConceptNumber = setSourceConceptNumber;
        }
        recalculateSetSourceFields(conceptNumber,setNumber);
    });
    jQuery(".singleSpecificInstanceTypeSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var specificInstanceNumber = jQuery(this).data("specificinstancenumber");
        var specificInstanceCreationType = jQuery("#singleSpecificInstanceTypeSelector_"+conceptNumber+"_"+specificInstanceNumber+" option:selected").data("specificinstancecreationtype")
        if (specificInstanceCreationType=="deNovo") {
            jQuery("#specificInstanceNameSingularTextarea_"+conceptNumber+"_"+specificInstanceNumber).css("display","inline-block")
            jQuery("#specificInstanceSourceConceptSelectorContainer_"+conceptNumber+"_"+specificInstanceNumber).css("display","none")
        }
        if (specificInstanceCreationType=="preexistingConcept") {
            jQuery("#specificInstanceNameSingularTextarea_"+conceptNumber+"_"+specificInstanceNumber).css("display","none")
            jQuery("#specificInstanceSourceConceptSelectorContainer_"+conceptNumber+"_"+specificInstanceNumber).css("display","inline-block")
            var specificInstanceSourceConceptNumber = jQuery("#specificInstanceSourceConceptSelector_"+conceptNumber+"_"+specificInstanceNumber+" option:selected").data("specificinstancesourceconceptnumber")
            window.cgOverviewPage.concepts[conceptNumber].specificInstances[specificInstanceNumber].sourceConceptNumber = specificInstanceSourceConceptNumber;
        }
        window.cgOverviewPage.concepts[conceptNumber].specificInstances[specificInstanceNumber].creationType = specificInstanceCreationType;
    });
    jQuery(".enumerationSourceSetSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        var enumerationSourceSetNumber = jQuery("#enumerationSourceSetSelector_"+conceptNumber+"_"+propertyNumber+" option:selected").data("enumerationsourcesetnumber")
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.sourceSetNumber = enumerationSourceSetNumber;
    });
    jQuery(".enumerationSourceConceptSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        var enumerationSourceConceptNumber = jQuery("#enumerationSourceConceptSelector_"+conceptNumber+"_"+propertyNumber+" option:selected").data("enumerationsourceconceptnumber")
        // console.log("enumerationSourceConceptSelector changed; enumerationSourceConceptNumber: "+enumerationSourceConceptNumber)
        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.sourceConceptNumber = enumerationSourceConceptNumber;
        CGOverviewHTMLFunctions.updateEnumerationSourceSetSelector(conceptNumber,propertyNumber,enumerationSourceConceptNumber);
    })
    jQuery(".propertyTypeSelector").off().change(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        var type = jQuery("#propertyTypeSelector_"+conceptNumber+"_"+propertyNumber+" option:selected").data("value")

        jQuery(".propertyTypeDependentVisibility_"+conceptNumber+"_"+propertyNumber).css("display","none")

        if ( (type != "string") && (type != "array") ) {
            window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.limitValues = false;
        }
        if ( (type=="string") || (type=="array") ) {
            jQuery("#enumerationsContainer_"+conceptNumber+"_"+propertyNumber).css("display","block")
            var isChecked = jQuery("#limitValuesCheckbox_"+conceptNumber+"_"+propertyNumber).prop("checked");
            window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.limitValues = isChecked;
        }
        if (type=="string") {
            jQuery("#propertyStringPatternContainer_"+conceptNumber+"_"+propertyNumber).css("display","block")
        }
        if ( (type=="integer") || (type=="number") ) {
            jQuery("#numericPropertyOptions_"+conceptNumber+"_"+propertyNumber).css("display","inline-block")
        }
        if (type=="object") {
            jQuery("#propertiesContainer_"+conceptNumber+"_"+propertyNumber).css("display","block")
            jQuery("#addPropertyButton_"+conceptNumber+"_"+propertyNumber).css("display","inline-block")
        }
        if ((type=="integer") || (type=="number")) {
            recalculateNumericPropertyFields(conceptNumber,propertyNumber);
        }

        jQuery("#independentPropertyForTemplatingButtonBox_"+conceptNumber+"_"+propertyNumber).css("display","none");
        jQuery("#dependentPropertyForTemplatingButtonBox_"+conceptNumber+"_"+propertyNumber).css("display","none");
        if (type=="string") {
            jQuery("#independentPropertyForTemplatingButtonBox_"+conceptNumber+"_"+propertyNumber).css("display","inline-block");
            jQuery("#dependentPropertyForTemplatingButtonBox_"+conceptNumber+"_"+propertyNumber).css("display","inline-block");
        }
        if ((type=="object") || (type=="array")) {
            jQuery("#dependentPropertyForTemplatingButtonBox_"+conceptNumber+"_"+propertyNumber).css("display","inline-block");
        }

    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////// BUTTON CLICKS ///////////////////////////////////////////////
    jQuery(".independentPropertyForTemplatingButton").off().click(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        var status = jQuery(this).data("status");
        if (status=="off") {
            jQuery(this).data("status","on");
            jQuery(this).css("color","white");
            jQuery(this).css("background-color","green");
            window.cgOverviewPage.concepts[conceptNumber].templating.independentPropertyNumber = propertyNumber;
            updateTemplatingIndependentPropertyNumberDisplay(conceptNumber)
        }
        if (status=="on") {
            jQuery(this).data("status","off");
            jQuery(this).css("color","black");
            jQuery(this).css("background-color","#EFEFEF");
            window.cgOverviewPage.concepts[conceptNumber].templating.independentPropertyNumber = null;
            updateTemplatingIndependentPropertyNumberDisplay(conceptNumber)
        }
    })
    jQuery(".dependentPropertyForTemplatingButton").off().click(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var propertyNumber = jQuery(this).data("propertynumber");
        var status = jQuery(this).data("status");
        if (status=="off") {
            jQuery(this).data("status","on");
            jQuery(this).css("color","white");
            jQuery(this).css("background-color","blue");
            if (!window.cgOverviewPage.concepts[conceptNumber].templating.secondaryPropertyNumbers.includes(propertyNumber)) {
                window.cgOverviewPage.concepts[conceptNumber].templating.secondaryPropertyNumbers.push(propertyNumber)
            }
            updateTemplatingSecondaryPropertiesNumberDisplay(conceptNumber)
        }
        if (status=="on") {
            jQuery(this).data("status","off");
            jQuery(this).css("color","black");
            jQuery(this).css("background-color","#EFEFEF");
            var index = window.cgOverviewPage.concepts[conceptNumber].templating.secondaryPropertyNumbers.indexOf(propertyNumber)
            if (index > -1) {
                window.cgOverviewPage.concepts[conceptNumber].templating.secondaryPropertyNumbers.splice(index,1);
            }
            updateTemplatingSecondaryPropertiesNumberDisplay(conceptNumber)
        }
    })

    jQuery(".toggleSetsButton").off().click(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var currStatus = jQuery(this).data("status");
        if (currStatus=="closed") {
            openSetsContainer(conceptNumber)
            closePropertiesContainer(conceptNumber)
            closeSpecificInstancesContainer(conceptNumber)
            closeTemplatingContainer(conceptNumber)
        }
        if (currStatus=="open") {
            closeSetsContainer(conceptNumber);
        }
    })
    jQuery(".togglePropertiesButton").off().click(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var currStatus = jQuery(this).data("status");
        if (currStatus=="closed") {
            openPropertiesContainer(conceptNumber)
            closeSetsContainer(conceptNumber);
            closeSpecificInstancesContainer(conceptNumber)
            closeTemplatingContainer(conceptNumber)
        }
        if (currStatus=="open") {
            closePropertiesContainer(conceptNumber)
        }
    })
    jQuery(".toggleSpecificInstancesButton").off().click(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var currStatus = jQuery(this).data("status");
        if (currStatus=="closed") {
            openSpecificInstancesContainer(conceptNumber)
            closeSetsContainer(conceptNumber);
            closePropertiesContainer(conceptNumber)
            closeTemplatingContainer(conceptNumber)
        }
        if (currStatus=="open") {
            closeSpecificInstancesContainer(conceptNumber)
        }
    })
    jQuery(".toggleTemplatingButton").off().click(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var currStatus = jQuery(this).data("status");
        if (currStatus=="closed") {
            openTemplatingContainer(conceptNumber)
            closeSetsContainer(conceptNumber);
            closePropertiesContainer(conceptNumber)
            closeSpecificInstancesContainer(conceptNumber)
        }
        if (currStatus=="open") {
            closeTemplatingContainer(conceptNumber)
        }
    })
    jQuery(".connectSpecificInstanceToSetButton").off().click(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var setNumber = jQuery(this).data("setnumber");
        var specificInstanceNumber = window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].nextSpecificInstanceNumber;
        window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].specificInstances[specificInstanceNumber] = {};
        window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].specificInstances[specificInstanceNumber].specificInstanceNumber = 0;
        // window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].specificInstances[specificInstanceNumber].childConcept = false;
        // window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].specificInstances[specificInstanceNumber].childConceptNumber = null;
        window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].nextSpecificInstanceNumber++;
        CGOverviewHTMLFunctions.connectSpecificInstanceToSet(conceptNumber,setNumber,specificInstanceNumber)
        openSetsContainer(conceptNumber);
    })
    jQuery(".connectSubsetToSetButton").off().click(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var setNumber = jQuery(this).data("setnumber");
        var subsetNumber = window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].nextSubsetNumber;
        window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].subsets[subsetNumber] = {};
        window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].subsets[subsetNumber].subsetNumber = 0;
        window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].nextSubsetNumber++;
        CGOverviewHTMLFunctions.connectSubsetToSet(conceptNumber,setNumber,subsetNumber)
        openSetsContainer(conceptNumber);
    })
    jQuery(".addSpecificInstanceButton").off().click(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var thisSpecificInstanceNumber = window.cgOverviewPage.concepts[conceptNumber].nextSpecificInstanceNumber;
        window.cgOverviewPage.concepts[conceptNumber].specificInstances[thisSpecificInstanceNumber] = {};
        window.cgOverviewPage.concepts[conceptNumber].specificInstances[thisSpecificInstanceNumber].specificInstanceSlug = null;
        window.cgOverviewPage.concepts[conceptNumber].specificInstances[thisSpecificInstanceNumber].specificInstanceName = null;
        window.cgOverviewPage.concepts[conceptNumber].specificInstances[thisSpecificInstanceNumber].specificInstanceTitle = null;
        window.cgOverviewPage.concepts[conceptNumber].specificInstances[thisSpecificInstanceNumber].directSpecificInstanceOfSuperset = true;
        window.cgOverviewPage.concepts[conceptNumber].specificInstances[thisSpecificInstanceNumber].thisSpecificInstanceNumber = thisSpecificInstanceNumber;
        window.cgOverviewPage.concepts[conceptNumber].specificInstances[thisSpecificInstanceNumber].parentSetsNumbers = [] ;
        window.cgOverviewPage.concepts[conceptNumber].specificInstances[thisSpecificInstanceNumber].creationType = "deNovo";
        window.cgOverviewPage.concepts[conceptNumber].specificInstances[thisSpecificInstanceNumber].sourceConceptNumber = null;
        window.cgOverviewPage.concepts[conceptNumber].nextSpecificInstanceNumber++;
        CGOverviewHTMLFunctions.addNewSpecificInstanceHTML(conceptNumber,thisSpecificInstanceNumber)
        CGOverviewHTMLFunctions.updateSpecificInstanceSourceConceptSelector(conceptNumber,thisSpecificInstanceNumber)
        openSpecificInstancesContainer(conceptNumber);
    })
    jQuery(".addSetButton").off().click(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var parentSetNumber = jQuery(this).data("setnumber");
        var thisSetNumber = window.cgOverviewPage.concepts[conceptNumber].nextSetNumber;
        window.cgOverviewPage.concepts[conceptNumber].sets[thisSetNumber] = {};
        window.cgOverviewPage.concepts[conceptNumber].sets[thisSetNumber].setSlug = null;
        window.cgOverviewPage.concepts[conceptNumber].sets[thisSetNumber].setName = null;
        window.cgOverviewPage.concepts[conceptNumber].sets[thisSetNumber].setTitle = null;
        window.cgOverviewPage.concepts[conceptNumber].sets[thisSetNumber].thisSetNumber = thisSetNumber;
        window.cgOverviewPage.concepts[conceptNumber].sets[thisSetNumber].parentSetNumber = parentSetNumber;
        window.cgOverviewPage.concepts[conceptNumber].sets[thisSetNumber].directSubsetOfSuperset = true;
        window.cgOverviewPage.concepts[conceptNumber].sets[thisSetNumber].nextSpecificInstanceNumber = 0;
        window.cgOverviewPage.concepts[conceptNumber].sets[thisSetNumber].specificInstances = [];
        window.cgOverviewPage.concepts[conceptNumber].sets[thisSetNumber].nextSubsetNumber = 0;
        window.cgOverviewPage.concepts[conceptNumber].sets[thisSetNumber].subsets = [];
        window.cgOverviewPage.concepts[conceptNumber].sets[thisSetNumber].creationType = "deNovo";
        window.cgOverviewPage.concepts[conceptNumber].sets[thisSetNumber].sourceConceptNumber = null;
        window.cgOverviewPage.concepts[conceptNumber].nextSetNumber++;
        CGOverviewHTMLFunctions.addNewSetHTML(conceptNumber,thisSetNumber,parentSetNumber)
        openSetsContainer(conceptNumber);
    })
    jQuery(".addPropertyButton").off().click(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var parentPropertyNumber = jQuery(this).data("propertynumber");
        var thisPropertyNumber = window.cgOverviewPage.concepts[conceptNumber].nextPropertyNumber;
        // var parentPropertyNumber = -1;
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber] = {};
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].propertySlug = null;
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].propertyKey = null;
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].propertyKeyPaths = [];
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].propertyName = null;
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].propertyTitle = null;
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].propertyType = null;
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].required = true;
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].unique = false;
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].thisPropertyNumber = thisPropertyNumber;
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].parentPropertyNumber = parentPropertyNumber;
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].keywords = {};
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].enumerationData = {};
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].enumerationData.limitValues = false;
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].enumerationData.sourceConceptNumber = null;
        window.cgOverviewPage.concepts[conceptNumber].properties[thisPropertyNumber].enumerationData.sourceSetNumber = null;
        window.cgOverviewPage.concepts[conceptNumber].nextPropertyNumber++;
        CGOverviewHTMLFunctions.addNewPropertyHTML(conceptNumber,thisPropertyNumber,parentPropertyNumber)
        openPropertiesContainer(conceptNumber);
    })
    jQuery(".toggleDeleteSomethingButton").off().click(function(){
        // var conceptNumber = jQuery(this).data("conceptnumber");
        // var propertyNumber = jQuery(this).data("propertynumber");
        var currentStatus = jQuery(this).data("status")
        if (currentStatus=="green") {
            jQuery(this).data("status","red")
            jQuery(this).css("backgroundColor","red")
        }
        if (currentStatus=="red") {
            jQuery(this).data("status","green")
            jQuery(this).css("backgroundColor","green")
        }
    })
    jQuery(".toggleConnectSetToSupersetButton").off().click(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var setNumber = jQuery(this).data("setnumber");
        var currentStatus = jQuery(this).data("status")
        if (currentStatus=="connect") {
            jQuery(this).data("status","disconnect")
            jQuery(this).css("backgroundColor","red")
            window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].directSubsetOfSuperset = false;
        }
        if (currentStatus=="disconnect") {
            jQuery(this).data("status","connect")
            jQuery(this).css("backgroundColor","green")
            window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].directSubsetOfSuperset = true;
        }
    })
    jQuery(".toggleConnectSpecificInstanceToSupersetButton").off().click(function(){
        var conceptNumber = jQuery(this).data("conceptnumber");
        var specificInstanceNumber = jQuery(this).data("specificinstancenumber");
        var currentStatus = jQuery(this).data("status")
        if (currentStatus=="connect") {
            jQuery(this).data("status","disconnect")
            jQuery(this).css("backgroundColor","red")
            window.cgOverviewPage.concepts[conceptNumber].specificInstances[specificInstanceNumber].directSpecificInstanceOfSuperset = false;
        }
        if (currentStatus=="disconnect") {
            jQuery(this).data("status","connect")
            jQuery(this).css("backgroundColor","green")
            window.cgOverviewPage.concepts[conceptNumber].specificInstances[specificInstanceNumber].directSpecificInstanceOfSuperset = true;
        }
    })
}
