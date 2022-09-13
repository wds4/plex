import React from "react";
import ConceptGraphMasthead from '../../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/conceptGraphs_leftNav2.js';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as CGOverviewHTMLFunctions from './functions/conceptGraphOverviewHTMLFunctions.js';
import * as CGOverviewFunctions from './functions/conceptGraphOverviewFunctions.js';
import * as CompactFileFormattingFunctions from './functions/translateBetweenCompactFileFormats.js';
import sendAsync from '../../../renderer.js';

const jQuery = require("jquery");

/*
window.cgOverviewPage = {};
window.cgOverviewPage.currentConceptNumber = 0;
window.cgOverviewPage.conceptGraphData = {};
window.cgOverviewPage.conceptGraphData.name = null;
window.cgOverviewPage.conceptGraphData.description = null;
window.cgOverviewPage.concepts = [];
window.cgOverviewPage.enumerations = [];
*/

window.cgOverviewPage = MiscFunctions.cloneObj(window.constants.cgOverviewPage);

const clearExistingConceptGraphOverview = () => {

}

export const loadCompactConceptGraphOverview = async () => {
    var sql = "";
    sql += " SELECT * from compactConceptGraphOverview ";

    var selectorHTML = "";
    selectorHTML += "<select id='saveConceptGraphsSelector' >";
    var foo = await sendAsync(sql).then( async (aResult) => {
        for (var r=0;r<aResult.length;r++) {
            var oNextFile = aResult[r];
            var nextFile_id = oNextFile.id;
            var nextFile_name = oNextFile.name;
            var nextFile_rawFile = oNextFile.rawFile;
            selectorHTML += "<option data-name='"+nextFile_name+"' >";
            selectorHTML += nextFile_name;
            selectorHTML += "</option>";
        }
        selectorHTML += "</select>";
    });
    jQuery("#existingCompactConceptGraphSelectorContainer").html(selectorHTML);
}

// transfer data from DOM (user-controlled via UI) into rawFile at currentRawFileTextarea
export const updateRawFileFromDOM = () => {
    var oRawFileFromDom = MiscFunctions.cloneObj(window.cgOverviewPage);
    jQuery("#currentRawFileTextarea").val(JSON.stringify(oRawFileFromDom,null,4))
}

export const deleteSelectedConceptGraph = async () => {
    var cgName = jQuery("#saveConceptGraphsSelector option:selected").data("name");
    var sql = "";
    sql += " DELETE FROM compactConceptGraphOverview WHERE name='"+cgName+"' ";
    console.log("deleteSelectedConceptGraph; sql: "+sql)

    var foo = await sendAsync(sql)
}

export const loadSelectedConceptGraph = async () => {
    var cgName = jQuery("#saveConceptGraphsSelector option:selected").data("name");
    var sql = "";
    sql += " SELECT * from compactConceptGraphOverview WHERE name='"+cgName+"' ";
    console.log("loadSelectedConceptGraph; sql: "+sql)

    var foo = await sendAsync(sql).then( async (aResult) => {
        if (aResult.length==1) {
            window.cgOverviewPage.loadingStoredConceptGraph = true;
            var oNextFile = aResult[0];
            var nextFile_id = oNextFile.id;
            var nextFile_name = oNextFile.name;
            var rawFile = oNextFile.rawFile;
            console.log("loadSelectedConceptGraph; rawFile: "+rawFile)
            var oConceptGraphOverview = JSON.parse(rawFile);
            // window.cgOverviewPage = oConceptGraphOverview;

            clearExistingConceptGraphOverview()

            var name = oConceptGraphOverview.conceptGraphData.name;
            var description = oConceptGraphOverview.conceptGraphData.description;

            jQuery("#conceptGraphNameTextarea").val(name);
            jQuery("#conceptGraphDescriptionTextarea").val(description);

            var aConcepts = oConceptGraphOverview.concepts;
            var lookupConceptNameByNumber = [];
            for (var conceptNumber=0;conceptNumber < aConcepts.length;conceptNumber++) {
                var oConcept = aConcepts[conceptNumber];
                var conceptName = oConcept.name.singular;
                lookupConceptNameByNumber[conceptNumber] = conceptName;
                jQuery("#addConceptButton").get(0).click();
                jQuery("#conceptNameSingular_"+conceptNumber).val(conceptName);
            }
            var foo = await MiscFunctions.timeout(0);
            var lookupeSpecificInstanceNameByNumber = [];
            var lookupSetNameByNumber = [];
            for (var conceptNumber=0;conceptNumber < aConcepts.length;conceptNumber++) {
                lookupeSpecificInstanceNameByNumber[conceptNumber] = [];
                lookupSetNameByNumber[conceptNumber] = [];
                var oConcept = aConcepts[conceptNumber];
                var aSets = oConcept.sets;
                var aProperties = oConcept.properties;
                var aSpecificInstances = oConcept.specificInstances;
                for (var setNumber=0;setNumber < aSets.length;setNumber++) {
                    var oSet = aSets[setNumber];
                    var setName = oSet.setName;
                    var directSubsetOfSuperset = oSet.directSubsetOfSuperset;
                    jQuery("#addSetButton_"+conceptNumber).get(0).click();
                    jQuery("#setName_"+conceptNumber+"_"+setNumber).val(setName);
                    if (!directSubsetOfSuperset) {
                        jQuery("#toggleConnectSetToSupersetButton_"+conceptNumber+"_"+setNumber).get(0).click();
                    }
                    lookupSetNameByNumber[conceptNumber][setNumber] = setName
                    // var foo = await MiscFunctions.timeout(0);
                }
                var foo = await MiscFunctions.timeout(0);
                for (var propertyNumber=0;propertyNumber < aProperties.length;propertyNumber++) {
                    var oProperty = aProperties[propertyNumber];
                    var propertyName = oProperty.propertyName;
                    var propertyType = oProperty.propertyType;
                    var required = oProperty.required;
                    var unique = oProperty.unique;

                    var thisPropertyNumber = oProperty.thisPropertyNumber;
                    var parentPropertyNumber = oProperty.parentPropertyNumber;
                    if (parentPropertyNumber == -1) {
                        jQuery("#addPropertyButton_"+conceptNumber).get(0).click();
                        document.getElementById("propertyTypeSelector_"+conceptNumber+"_"+propertyNumber).value=propertyType;
                        jQuery("#propertyTypeSelector_"+conceptNumber+"_"+propertyNumber).change();
                        jQuery("#propertyName_"+conceptNumber+"_"+propertyNumber).val(propertyName);
                    }
                    if (parentPropertyNumber > -1) {
                        jQuery("#addPropertyButton_"+conceptNumber+"_"+parentPropertyNumber).get(0).click();
                        document.getElementById("propertyTypeSelector_"+conceptNumber+"_"+propertyNumber).value=propertyType;
                        jQuery("#propertyTypeSelector_"+conceptNumber+"_"+propertyNumber).change();
                        jQuery("#propertyName_"+conceptNumber+"_"+propertyNumber).val(propertyName);
                    }
                    jQuery("#propertyRequiredCheckbox_"+conceptNumber+"_"+propertyNumber).prop("checked",required)
                    jQuery("#propertyUniqueCheckbox_"+conceptNumber+"_"+propertyNumber).prop("checked",unique)
                    jQuery(".propertyTypeSelector").change();
                    var oKeywords = oProperty.keywords;
                    if (oKeywords.hasOwnProperty("minimum")) {
                        var isMinRestrictChecked = oKeywords.minimum.restrict;
                        if (!isMinRestrictChecked) {
                            document.getElementById("numericPropertyMinimumTypeSelector_"+conceptNumber+"_"+propertyNumber).value = "unrestricted"
                        }
                        if (isMinRestrictChecked) {
                            if (oKeywords.minimum.hasOwnProperty("minimum")) {
                                document.getElementById("numericPropertyMinimumTypeSelector_"+conceptNumber+"_"+propertyNumber).value = "minimum"
                                jQuery("#propertyMinimumValue_"+conceptNumber+"_"+propertyNumber).val(oKeywords.minimum.minimum)
                            }
                            if (oKeywords.minimum.hasOwnProperty("exclusiveMinimum")) {
                                document.getElementById("numericPropertyMinimumTypeSelector_"+conceptNumber+"_"+propertyNumber).value = "exclusiveMinimum"
                                jQuery("#propertyMinimumValue_"+conceptNumber+"_"+propertyNumber).val(oKeywords.minimum.exclusiveMinimum)
                            }
                        }
                        jQuery(".numericPropertyMinimumTypeSelector").change()
                    }
                    if (oKeywords.hasOwnProperty("maximum")) {
                        var isMaxRestrictChecked = oKeywords.maximum.restrict;
                        if (!isMaxRestrictChecked) {
                            document.getElementById("numericPropertyMaximumTypeSelector_"+conceptNumber+"_"+propertyNumber).value = "unrestricted"
                        }
                        if (isMaxRestrictChecked) {
                            if (oKeywords.maximum.hasOwnProperty("maximum")) {
                                document.getElementById("numericPropertyMaximumTypeSelector_"+conceptNumber+"_"+propertyNumber).value = "maximum"
                                jQuery("#propertyMaximumValue_"+conceptNumber+"_"+propertyNumber).val(oKeywords.maximum.maximum)
                            }
                            if (oKeywords.maximum.hasOwnProperty("exclusiveMaximum")) {
                                document.getElementById("numericPropertyMaximumTypeSelector_"+conceptNumber+"_"+propertyNumber).value = "exclusiveMaximum"
                                jQuery("#propertyMaximumValue_"+conceptNumber+"_"+propertyNumber).val(oKeywords.maximum.exclusiveMaximum)
                            }
                        }
                        jQuery(".numericPropertyMaximumTypeSelector").change()
                    }
                    // var foo = await MiscFunctions.timeout(0);
                }
                // var foo = await MiscFunctions.timeout(0);
                for (var specificInstanceNumber=0;specificInstanceNumber < aSpecificInstances.length;specificInstanceNumber++) {
                    var oSpecificInstance = aSpecificInstances[specificInstanceNumber];
                    jQuery("#addSpecificInstanceButton_"+conceptNumber).get(0).click();
                    var creationType = oSpecificInstance.creationType;
                    jQuery("#singleSpecificInstanceTypeSelector_"+conceptNumber+"_"+specificInstanceNumber+" option[data-specificinstancecreationtype='"+creationType+"']").attr("selected","selected");
                    if (creationType=="deNovo") {
                        var specificInstanceName = oSpecificInstance.specificInstanceName;
                        jQuery("#specificInstanceNameSingularTextarea_"+conceptNumber+"_"+specificInstanceNumber).val(specificInstanceName);
                        lookupeSpecificInstanceNameByNumber[conceptNumber][specificInstanceNumber] = specificInstanceName;
                    }
                    if (creationType=="preexistingConcept") {
                        var sourceConceptNumber = oSpecificInstance.sourceConceptNumber
                        var sourceConceptName = lookupConceptNameByNumber[sourceConceptNumber]
                        window.cgOverviewPage.concepts[conceptNumber].specificInstances[specificInstanceNumber].creationType = "preexistingConcept";
                        window.cgOverviewPage.concepts[conceptNumber].specificInstances[specificInstanceNumber].sourceConceptNumber = sourceConceptNumber;
                        CGOverviewHTMLFunctions.updateSpecificInstanceSourceConceptSelector(conceptNumber,specificInstanceNumber)
                        jQuery("#singleSpecificInstanceTypeSelector_"+conceptNumber+"_"+specificInstanceNumber).change();
                        lookupeSpecificInstanceNameByNumber[conceptNumber][specificInstanceNumber] = sourceConceptName;
                    }
                    var directSpecificInstanceOfSuperset = oSpecificInstance.directSpecificInstanceOfSuperset;
                    if (!directSpecificInstanceOfSuperset) {
                        jQuery("#toggleConnectSpecificInstanceToSupersetButton_"+conceptNumber+"_"+specificInstanceNumber).get(0).click();
                    }
                    // var foo = await MiscFunctions.timeout(0);
                }
                // var foo = await MiscFunctions.timeout(0);
            }










            for (var conceptNumber=0;conceptNumber < aConcepts.length;conceptNumber++) {
                var oConcept = aConcepts[conceptNumber];
                var aSets = oConcept.sets;
                for (var setNumber=0;setNumber < aSets.length;setNumber++) {
                    var oSet = aSets[setNumber];
                    var aSubsets = oSet.subsets;
                    var aChildSpecificInstances = oSet.specificInstances;
                    for (var childSubsetNumber = 0;childSubsetNumber < aSubsets.length;childSubsetNumber++) {
                        var oChildSubset = aSubsets[childSubsetNumber];
                        var subsetNumber = oChildSubset.subsetNumber;
                        var subsetName = lookupSetNameByNumber[conceptNumber][subsetNumber]
                        jQuery("#connectSubsetToSetButton_"+conceptNumber+"_"+setNumber).get(0).click();
                        document.getElementById("setChildSubsetMatchSelector_"+conceptNumber+"_"+setNumber+"_"+childSubsetNumber).value=subsetName
                        window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].subsets[childSubsetNumber].subsetNumber = subsetNumber;
                    }
                    for (var childSpecificInstanceNumber = 0;childSpecificInstanceNumber < aChildSpecificInstances.length;childSpecificInstanceNumber++) {
                        var oChildSpecificInstance = aChildSpecificInstances[childSpecificInstanceNumber];
                        var specificInstanceNumber = oChildSpecificInstance.specificInstanceNumber;
                        jQuery("#connectSpecificInstanceToSetButton_"+conceptNumber+"_"+setNumber).get(0).click();
                        var childSpecificInstanceName = lookupeSpecificInstanceNameByNumber[conceptNumber][specificInstanceNumber]
                        document.getElementById("setChildSpecificInstanceMatchSelector_"+conceptNumber+"_"+setNumber+"_"+childSpecificInstanceNumber).value=childSpecificInstanceName
                        window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].specificInstances[childSpecificInstanceNumber].specificInstanceNumber = specificInstanceNumber;
                    }
                    var foo = await MiscFunctions.timeout(0);
                }
            }
            // now iterate through all concepts / all sets;
            for (var conceptNumber=0;conceptNumber < aConcepts.length;conceptNumber++) {
                var oConcept = aConcepts[conceptNumber];
                var aSets = oConcept.sets;
                for (var setNumber=0;setNumber < aSets.length;setNumber++) {
                    var oSet = aSets[setNumber];
                    var creationType = oSet.creationType
                    jQuery("#singleSetTypeSelector_"+conceptNumber+"_"+setNumber+" option[data-setcreationtype='"+creationType+"']").attr("selected","selected").change();
                    if (creationType=="deNovo") {
                        // nothing to do
                    }
                    if (creationType=="preexistingConcept") {
                        sourceConceptNumber = oSet.sourceConceptNumber
                        sourceSetNumber = oSet.sourceSetNumber
                        jQuery("#setSourceConceptSelector_"+conceptNumber+"_"+setNumber+" option[data-setsourceconceptnumber='"+sourceConceptNumber+"']").attr("selected","selected").change();
                        jQuery("#setSourceSetSelector_"+conceptNumber+"_"+setNumber+" option[data-setsourcesetnumber='"+sourceSetNumber+"']").attr("selected","selected").change();
                    }
                    // jQuery(".setSourceConceptSelector").change();
                    // jQuery(".singleSetTypeSelector").change();
                    var foo = await MiscFunctions.timeout(0);
                }
            }
            // now iterate through all concepts / all properties; handle enumerations (which requires me to have already done basic processing of all sets of all concepts)
            for (var conceptNumber=0;conceptNumber < aConcepts.length;conceptNumber++) {
                var oConcept = aConcepts[conceptNumber];
                var aProperties = oConcept.properties;
                for (var propertyNumber=0;propertyNumber < aProperties.length;propertyNumber++) {
                    var oProperty = aProperties[propertyNumber];
                    var oEnumerationData = oProperty.enumerationData;
                    var limitValues = oEnumerationData.limitValues;
                    if (limitValues == true) {
                        // I may (?) need to trigger the following change event prior to updating sourceConceptName and sourceSetName in the DOM
                        // (does not seem to register otherwise ??)
                        jQuery("#limitValuesCheckbox_"+conceptNumber+"_"+propertyNumber).prop("checked",true).change();

                        var sourceConceptNumber = oEnumerationData.sourceConceptNumber;
                        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.sourceConceptNumber = sourceConceptNumber;
                        var sourceConceptName = lookupConceptNameByNumber[sourceConceptNumber]
                        document.getElementById("enumerationSourceConceptSelector_"+conceptNumber+"_"+propertyNumber).value = sourceConceptName;

                        var sourceSetNumber = oEnumerationData.sourceSetNumber;
                        window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.sourceSetNumber = sourceSetNumber;
                        if (sourceSetNumber==-1) {
                            document.getElementById("enumerationSourceSetSelector_"+conceptNumber+"_"+propertyNumber).value = "superset";
                        } else {
                            var sourceSettName =lookupSetNameByNumber[conceptNumber][sourceSetNumber];
                            document.getElementById("enumerationSourceSetSelector_"+conceptNumber+"_"+propertyNumber).value = sourceSettName;
                        }

                        var withSubsets = oEnumerationData.withSubsets;
                        var withDependencies = oEnumerationData.withDependencies;
                        var dependenciesPlacement = oEnumerationData.dependenciesPlacement;

                        var dep = "none";
                        if (!withDependencies) {
                            dep = "none";
                        }
                        if (withDependencies) {
                            if (dependenciesPlacement == "lower") {
                                dep = "lower";
                            }
                            if (dependenciesPlacement == "upper") {
                                dep = "upper";
                            }
                        }
                        document.getElementById("enumerationWithDependenciesSelector_"+conceptNumber+"_"+propertyNumber).value = dep;
                        jQuery("#enumerationWithSubsetsCheckbox_"+conceptNumber+"_"+propertyNumber).prop("checked",withSubsets)

                        // trigger the following change event again so that new values for sourceConceptName and sourceSetName are updated in style1 rawFile
                        jQuery("#limitValuesCheckbox_"+conceptNumber+"_"+propertyNumber).prop("checked",true).change();
                    }
                    var foo = await MiscFunctions.timeout(0);
                }
            }
            for (var conceptNumber=0;conceptNumber < aConcepts.length;conceptNumber++) {
                var oConcept = aConcepts[conceptNumber];
                var conceptName = oConcept.name.singular;
                lookupConceptNameByNumber[conceptNumber] = conceptName;
                var oTemplating = {};
                oTemplating.method = "none";
                oTemplating.templateConceptNumber = null;
                oTemplating.independentPropertyNumber = null;
                oTemplating.secondaryPropertyNumbers = [];
                if (oConcept.hasOwnProperty("templating")) {
                    oTemplating = oConcept.templating;
                }
                var tMethod = oTemplating.method;
                var templateConceptNumber = oTemplating.templateConceptNumber;
                var independentPropertyNumber = oTemplating.independentPropertyNumber
                var aSecondaryPropertyNumbers = oTemplating.secondaryPropertyNumbers

                window.cgOverviewPage.concepts[conceptNumber].templating.method = tMethod;
                window.cgOverviewPage.concepts[conceptNumber].templating.templateConceptNumber = templateConceptNumber;
                window.cgOverviewPage.concepts[conceptNumber].templating.independentPropertyNumber = independentPropertyNumber;
                window.cgOverviewPage.concepts[conceptNumber].templating.secondaryPropertyNumbers = aSecondaryPropertyNumbers;
                if (independentPropertyNumber != null) {
                    jQuery("#independentPropertyForTemplatingButton_"+conceptNumber+"_"+independentPropertyNumber).get(0).click();
                }
                for (var x = 0;x < aSecondaryPropertyNumbers.length;x++) {
                    var secondaryPropertyNumber = aSecondaryPropertyNumbers[x];
                    jQuery("#dependentPropertyForTemplatingButton_"+conceptNumber+"_"+secondaryPropertyNumber).get(0).click();
                }
                var sMethod = "noTemplatingConcept";
                if (tMethod=="none") {
                    sMethod = "noTemplatingConcept";
                }
                if (tMethod=="autogenerate") {
                    sMethod = "autogenerateNewTemplatingConcept";
                }
                if (tMethod=="existing") {
                    sMethod = "linkToExistingTemplatingConcept";
                    console.log("templateconceptnumber = "+templateConceptNumber)
                    jQuery("#existingTemplatingConceptSelector_"+conceptNumber+" option[data-templateconceptnumber='"+templateConceptNumber+"']").attr("selected","selected");
                }
                jQuery("#templatingConceptSourceMethodSelector_"+conceptNumber+" option[data-templatingconceptsourcemethod='"+sMethod+"']").attr("selected","selected");
                jQuery("#templatingConceptSourceMethodSelector_"+conceptNumber).change();

            }
            for (var conceptNumber=0;conceptNumber < aConcepts.length;conceptNumber++) {
                CGOverviewFunctions.closeSetsContainer(conceptNumber);
                CGOverviewFunctions.closePropertiesContainer(conceptNumber);
                CGOverviewFunctions.closeSpecificInstancesContainer(conceptNumber);

                CGOverviewFunctions.updateTemplatingIndependentPropertyNumberDisplay(conceptNumber)
                CGOverviewFunctions.updateTemplatingSecondaryPropertiesNumberDisplay(conceptNumber);
            }
            // console.log("window.cgOverviewPage: "+JSON.stringify(window.cgOverviewPage,null,4))

            window.cgOverviewPage.loadingStoredConceptGraph = false;
        }
    });
}

export const saveConceptGraphStyle2 = async () => {
    var cgDescription = jQuery("#conceptGraphDescriptionTextarea").val();
    var cgName = jQuery("#conceptGraphNameTextarea").val();
    var cgRawFile = jQuery("#currentCompactImportExportRawFileTextarea").val()
    var filetype = "cg_entire";
    var conceptGraphTableName = "__quikCreatePage__";
    var slugForContext = "__notApplicable__"
    var uniqueID = cgName + "_" + conceptGraphTableName + "-" + filetype + "-" + slugForContext;
    var cgName;
    var sql = "";
    sql += " INSERT OR IGNORE INTO compactExports ";
    sql += " (rawFile,conceptGraphTableName,filetype,slugForContext,description,uniqueID) ";
    sql += " VALUES( '"+cgRawFile+"', '"+conceptGraphTableName+"', '"+filetype+"', '"+slugForContext+"', '"+cgDescription+"', '"+uniqueID+"') ";
    console.log("saveConceptGraphStyle2; sql: "+sql)

    var foo = await sendAsync(sql)

    MiscFunctions.timeout(100);

    var sql = "";
    sql += " UPDATE compactExports ";
    sql += " SET rawFile = '"+cgRawFile+"' ";
    sql += " WHERE uniqueID = '"+cgName+"' ";
    console.log("saveConceptGraphStyle1; sql: "+sql)

    var foo = await sendAsync(sql)
}

// save existing concept graph to SQL
export const saveConceptGraphStyle1 = async () => {
    var cgName = jQuery("#conceptGraphNameTextarea").val();
    var cgRawFile = jQuery("#currentRawFileTextarea").val()
    var sql = "";
    sql += " INSERT OR IGNORE INTO compactConceptGraphOverview ";
    sql += " (name,rawFile) ";
    sql += " VALUES( '"+cgName+"', '"+cgRawFile+"') ";
    console.log("saveConceptGraphStyle1; sql: "+sql)

    var foo = await sendAsync(sql)

    MiscFunctions.timeout(100);

    var sql = "";
    sql += " UPDATE compactConceptGraphOverview ";
    sql += " SET rawFile = '"+cgRawFile+"' ";
    sql += " WHERE name = '"+cgName+"' ";
    console.log("saveConceptGraphStyle1; sql: "+sql)

    var foo = await sendAsync(sql)
}

export const deleteAllConceptGraphStyle2 = async () => {
    var sql = "";
    sql += " DELETE FROM compactExports WHERE conceptGraphTableName = '__quikCreatePage__' ";
    console.log("deleteAllConceptGraphStyle2; sql: "+sql)

    var foo = await sendAsync(sql)
}

export default class SingleConceptGraphOverviewMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        // reset window.cgOverviewPage
        window.cgOverviewPage = MiscFunctions.cloneObj(window.constants.cgOverviewPage);
        /*
        window.cgOverviewPage = {};
        window.cgOverviewPage.currentConceptNumber = 0;
        window.cgOverviewPage.conceptGraphData = {};
        window.cgOverviewPage.conceptGraphData.name = null;
        window.cgOverviewPage.conceptGraphData.description = null;
        window.cgOverviewPage.concepts = [];
        window.cgOverviewPage.enumerations = [];
        */


        await loadCompactConceptGraphOverview()
        jQuery("#addConceptButton").click(function(){
            var conceptNumber = window.cgOverviewPage.currentConceptNumber;
            window.cgOverviewPage.concepts[conceptNumber] = {};
            window.cgOverviewPage.concepts[conceptNumber].name = {}
            window.cgOverviewPage.concepts[conceptNumber].name.singular = null;
            window.cgOverviewPage.concepts[conceptNumber].name.plural = null;
            window.cgOverviewPage.concepts[conceptNumber].templating = {};
            window.cgOverviewPage.concepts[conceptNumber].templating.method = "none";
            window.cgOverviewPage.concepts[conceptNumber].templating.templateConceptNumber = null;
            window.cgOverviewPage.concepts[conceptNumber].templating.independentPropertyNumber = null;
            window.cgOverviewPage.concepts[conceptNumber].templating.secondaryPropertyNumbers = [];
            window.cgOverviewPage.concepts[conceptNumber].nextSetNumber = 0;
            window.cgOverviewPage.concepts[conceptNumber].sets = [];
            window.cgOverviewPage.concepts[conceptNumber].nextPropertyNumber = 0;
            window.cgOverviewPage.concepts[conceptNumber].properties = [];
            window.cgOverviewPage.concepts[conceptNumber].nextSpecificInstanceNumber = 0;
            window.cgOverviewPage.concepts[conceptNumber].specificInstances = [];
            var newConceptHTML = CGOverviewHTMLFunctions.addNewConceptHTML(conceptNumber);
            window.cgOverviewPage.currentConceptNumber++;
            jQuery("#allConceptsBox").append(newConceptHTML);
            document.getElementById("conceptNameSingular_"+conceptNumber).focus();
            CGOverviewFunctions.actionsAfterHTMLChange()
        })
        jQuery("#conceptGraphInfoContainer").change(function(){
            CGOverviewFunctions.actionsAfterHTMLChange()
        });
        jQuery("#toggleRawFileButton").click(async function(){
            var currStatus = jQuery(this).data("status");
            if (currStatus=="showingMainUI") {
                updateRawFileFromDOM();
                CompactFileFormattingFunctions.translateFromDOMToCompactImportExportRawFile();
                jQuery(this).data("status","showingRawFile");
                jQuery("#currentRawFileContainer").css("display","block")
                jQuery("#allConceptsContainer").css("display","none")
            }
            if (currStatus=="showingRawFile") {
                jQuery(this).data("status","showingMainUI");
                jQuery("#currentRawFileContainer").css("display","none")
                jQuery("#allConceptsContainer").css("display","block")
            }
        })
        jQuery("#saveConceptGraphStyle1Button").click(async function(){
            await saveConceptGraphStyle1()
        });
        jQuery("#saveConceptGraphStyle2Button").click(async function(){
            await saveConceptGraphStyle2()
        });
        jQuery("#loadSelectedConceptGraphButton").click(async function(){
            console.log("loadSelectedConceptGraphButton clicked")
            await loadSelectedConceptGraph()
        });
        jQuery("#deleteSelectedConceptGraphButton").click(async function(){
            console.log("deleteSelectedConceptGraphButton clicked")
            await deleteSelectedConceptGraph()
        });
        jQuery("#deleteAllConceptGraphStyle2Button").click(async function(){
            console.log("deleteAllConceptGraphStyle2Button clicked")
            await deleteAllConceptGraphStyle2()
        });
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" style={{backgroundColor:"#CFCFCF"}} >
                        <ConceptGraphMasthead />
                        <div class="h2">QuikCreate: Concept Graph Overview</div>

                        <div id="conceptGraphInfoContainer" >
                            <center>
                                <div>
                                    <div style={{display:"inline-block"}}>
                                        <div style={{display:"inline-block"}} id="existingCompactConceptGraphSelectorContainer"></div>
                                        <div id="loadSelectedConceptGraphButton" className="doSomethingButton" >load selected</div>
                                        <div id="deleteSelectedConceptGraphButton" className="doSomethingButton" >delete selected</div>
                                        <br/>
                                        <div data-status="showingMainUI" id="toggleRawFileButton" className="doSomethingButton">toggle rawFile</div>
                                    </div>
                                    <div style={{display:"inline-block"}}>
                                        <div>
                                            <div className="cgOverviewLeft" >name:</div>
                                            <textarea id="conceptGraphNameTextarea" className="cgOverviewRight" >
                                            </textarea>
                                        </div>

                                        <div>
                                            <div className="cgOverviewLeft" >description:</div>
                                            <textarea id="conceptGraphDescriptionTextarea" className="cgOverviewRight" >
                                            </textarea>
                                        </div>
                                    </div>
                                </div>
                            </center>

                            <div id="allConceptsContainer" style={{padding:"10px 10px 400px 10px",marginBottom:"400px"}} >
                                <div style={{marginLeft:"10px",marginBottom:"5px"}}>
                                    <div id="numberOfConcepts" className="toggleButtonNumberContainer" >0</div>
                                    concepts:
                                    <div id="addConceptButton" className="addSomethingButton">+</div>
                                </div>
                                <div id="allConceptsBox" ></div>
                            </div>

                            <div id="currentRawFileContainer" style={{display:"none"}} >
                                <div style={{display:"inline-block"}} >
                                    <div>
                                        Style1 (QuikCreate, in table: compactConceptGraphOverview)<br/>
                                        <div id="saveConceptGraphStyle1Button" className="doSomethingButton" >save / update</div>
                                    </div>
                                    <textarea id="currentRawFileTextarea" style={{display:"inline-block",width:"600px",height:"800px",overflow:"scroll"}} ></textarea>
                                </div>
                                <div style={{display:"inline-block"}} >
                                    <div>
                                        Style2 (cg_entire import/export file, in table: compactExports)<br/>
                                        <div id="saveConceptGraphStyle2Button" className="doSomethingButton" >save / update</div>
                                        <div id="deleteAllConceptGraphStyle2Button" className="doSomethingButton" >delete ALL quikCreate files</div>
                                    </div>
                                    <textarea id="currentCompactImportExportRawFileTextarea" style={{display:"inline-block",width:"600px",height:"800px",overflow:"scroll"}} ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
