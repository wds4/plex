import sendAsync from '../../../../renderer.js';
import IpfsHttpClient from 'ipfs-http-client';
import * as CGOverviewFunctions from './conceptGraphOverviewFunctions.js';
const jQuery = require("jquery");

export const addNewConceptHTML = (conceptNumber) => {
    var conceptHTML = "";
    conceptHTML += "<div class=singleConceptContainer >";

        conceptHTML += "<div >";
            conceptHTML += "<div class=conceptNumberContainer >"+conceptNumber+"</div>";
            conceptHTML += "<textarea id='conceptNameSingular_"+conceptNumber+"' class=cgOverviewRight >";
            conceptHTML += "</textarea>";
            conceptHTML += "<div style='display:inline-block;float:right;' >";
                conceptHTML += "<div style=display:inline-block;margin-left:20px; >show: </div>";

                conceptHTML += "<div id='togglePropertiesButton_"+conceptNumber+"' data-status='closed' data-conceptnumber='"+conceptNumber+"' class='doSomethingButton togglePropertiesButton' >";
                conceptHTML += "<div id='numberOfProperties_"+conceptNumber+"' class='toggleButtonNumberContainer' >0</div>";
                conceptHTML += "properties";
                conceptHTML += "</div>";

                conceptHTML += "<div id='toggleSetsButton_"+conceptNumber+"' data-status='closed' data-conceptnumber='"+conceptNumber+"' class='doSomethingButton toggleSetsButton' >";
                conceptHTML += "<div id='numberOfSets_"+conceptNumber+"' class='toggleButtonNumberContainer' >0</div>";
                conceptHTML += "sets";
                conceptHTML += "</div>";

                conceptHTML += "<div id='toggleSpecificInstancesButton_"+conceptNumber+"' data-status='closed' data-conceptnumber='"+conceptNumber+"' class='doSomethingButton toggleSpecificInstancesButton' >";
                conceptHTML += "<div id='numberOfSpecificInstances_"+conceptNumber+"' class='toggleButtonNumberContainer' >0</div>";
                conceptHTML += "specific instances";
                conceptHTML += "</div>";

                conceptHTML += "<div id='toggleTemplatingButton_"+conceptNumber+"' data-status='closed' data-conceptnumber='"+conceptNumber+"' class='doSomethingButton toggleTemplatingButton' >";
                conceptHTML += "<div id='templating_"+conceptNumber+"' class='toggleButtonNumberContainer' >&#10006;</div>";
                conceptHTML += "templating";
                conceptHTML += "</div>";

                conceptHTML += "<div style=display:inline-block;float:right; >";
                    conceptHTML += "<div style=display:inline-block;margin-left:100px; >delete: ";
                        conceptHTML += "<div data-status='green' data-conceptnumber='"+conceptNumber+"' class='toggleDeleteSomethingButton deleteConceptButton' >X</div>";
                    conceptHTML += "</div>";
                conceptHTML += "</div>";
            conceptHTML += "</div>";
            conceptHTML += "<div style=clear:both; ></div>";
        conceptHTML += "</div>";

        conceptHTML += "<div style='border:0px solid purple;' >";
            conceptHTML += addSetsContainerHTML(conceptNumber);
            conceptHTML += addPropertiesContainerHTML(conceptNumber);
            conceptHTML += addSpecificInstancesContainerHTML(conceptNumber);
            conceptHTML += addTemplatingContainerHTML(conceptNumber);
        conceptHTML += "</div>";

    conceptHTML += "</div>";

    return conceptHTML
}

export const addSetsContainerHTML = (conceptNumber) => {
    var setsHTML = "";
    setsHTML += "<div id='setsContainerWrapper_"+conceptNumber+"' class=setsContainerWrapper >";
        setsHTML += "<div id='setsContainer_"+conceptNumber+"' class=setsContainer >";
        setsHTML += "sets: <div id='addSetButton_"+conceptNumber+"' data-conceptnumber='"+conceptNumber+"' data-setnumber='-1' class='addSomethingButton addSetButton' >+</div>";
        // setsHTML += "<div id='supersetContainer_"+conceptNumber+"' ></div>";
        // setsHTML += "</div>";
        setsHTML += "<div id='setsContainer_"+conceptNumber+"' ></div>";
        setsHTML += "</div>";
    setsHTML += "</div>";
    return setsHTML;
}

export const addPropertiesContainerHTML = (conceptNumber) => {
    var propertiesHTML = "";
    propertiesHTML += "<div id='propertiesContainerWrapper_"+conceptNumber+"' data-conceptnumber='"+conceptNumber+"' class=propertiesContainerWrapper >";
        propertiesHTML += "<div id='propertiesContainer_"+conceptNumber+"' data-conceptnumber='"+conceptNumber+"' class=propertiesContainer >";
        propertiesHTML += "properties: ";
        propertiesHTML += "<div id='addPropertyButton_"+conceptNumber+"' data-propertynumber='-1' data-conceptnumber='"+conceptNumber+"' class='addSomethingButton addPropertyButton' >+</div>";

        propertiesHTML += "<div style='float:right;display:inline-block;margin-right:50px;' >";
            propertiesHTML += "<div style='display:inline-block;margin-right:15px;'' >DEFAULTS:</div>";
            var defaultTopLevelPropertySlug = "";
            defaultTopLevelPropertySlug = "slug";
            propertiesHTML += "<div style=display:inline-block;margin-left:30px; >";
                propertiesHTML += "<div data-status='green' data-defaultpropertyslug='"+defaultTopLevelPropertySlug+"' data-conceptnumber='"+conceptNumber+"' class='toggleDeleteSomethingButton deleteDefaultTopLevelPropertyButton' >X</div> ";
                propertiesHTML += defaultTopLevelPropertySlug
            propertiesHTML += "</div>";

            defaultTopLevelPropertySlug = "name";
            propertiesHTML += "<div style=display:inline-block;margin-left:30px; >";
                propertiesHTML += "<div data-status='green' data-defaultpropertyslug='"+defaultTopLevelPropertySlug+"' data-conceptnumber='"+conceptNumber+"' class='toggleDeleteSomethingButton deleteDefaultTopLevelPropertyButton' >X</div> ";
                propertiesHTML += defaultTopLevelPropertySlug
            propertiesHTML += "</div>";

            defaultTopLevelPropertySlug = "title";
            propertiesHTML += "<div style=display:inline-block;margin-left:30px; >";
                propertiesHTML += "<div data-status='green' data-defaultpropertyslug='"+defaultTopLevelPropertySlug+"' data-conceptnumber='"+conceptNumber+"' class='toggleDeleteSomethingButton deleteDefaultTopLevelPropertyButton' >X</div> ";
                propertiesHTML += defaultTopLevelPropertySlug
            propertiesHTML += "</div>";

            defaultTopLevelPropertySlug = "description";
            propertiesHTML += "<div style=display:inline-block;margin-left:30px; >";
                propertiesHTML += "<div data-status='green' data-defaultpropertyslug='"+defaultTopLevelPropertySlug+"' data-conceptnumber='"+conceptNumber+"' class='toggleDeleteSomethingButton deleteDefaultTopLevelPropertyButton' >X</div> ";
                propertiesHTML += defaultTopLevelPropertySlug
            propertiesHTML += "</div>";
        propertiesHTML += "</div>";
        propertiesHTML += "<div style='clear:both;' ></div>";

        propertiesHTML += "<div id='propertiesContainer_"+conceptNumber+"_-1' ></div>";
        propertiesHTML += "</div>";
    propertiesHTML += "</div>";

    return propertiesHTML;
}

export const addSpecificInstancesContainerHTML = (conceptNumber) => {
    var specificInstancesHTML = "";
    specificInstancesHTML += "<div id='specificInstancesContainerWrapper_"+conceptNumber+"' data-conceptnumber='"+conceptNumber+"' class=specificInstancesContainerWrapper >";
        specificInstancesHTML += "<div id='specificInstancesContainer_"+conceptNumber+"' data-conceptnumber='"+conceptNumber+"' class=specificInstancesContainer >";
        specificInstancesHTML += "specific instances: <div id='addSpecificInstanceButton_"+conceptNumber+"' parentsetsnumbers='[-1]' data-conceptnumber='"+conceptNumber+"' class='addSomethingButton addSpecificInstanceButton' >+</div>";
        specificInstancesHTML += "<div id='specificInstancesContainer_"+conceptNumber+"_-1' ></div>";
        specificInstancesHTML += "</div>";
    specificInstancesHTML += "</div>";

    return specificInstancesHTML;
}

export const addTemplatingContainerHTML = (conceptNumber) => {
    var containerHTML = "";
    containerHTML += "<div id='templatingContainerWrapper_"+conceptNumber+"' data-conceptnumber='"+conceptNumber+"' class=templatingContainerWrapper >";
        containerHTML += "<div id='templatingContainer_"+conceptNumber+"' data-conceptnumber='"+conceptNumber+"' class=templatingContainer >";
            // containerHTML += "establish templating: <div id='establishTemplatingButton_"+conceptNumber+"' data-conceptnumber='"+conceptNumber+"' class='addSomethingButton establishTemplatingButton' >+</div>";
            // containerHTML += "<br>";
            containerHTML += "Templating: ";
            containerHTML += "<select id='templatingConceptSourceMethodSelector_"+conceptNumber+"' data-conceptnumber='"+conceptNumber+"' class='templatingConceptSourceMethodSelector' >";
                containerHTML += "<option data-templatingconceptsourcemethod='noTemplatingConcept' >none</option>";
                containerHTML += "<option data-templatingconceptsourcemethod='autogenerateNewTemplatingConcept' >autogenerate new templating concept</option>";
                containerHTML += "<option data-templatingconceptsourcemethod='linkToExistingTemplatingConcept' >link to an existing templating concept</option>";
            containerHTML += "</select>";
            // containerHTML += "<br>";
            containerHTML += "<div id='existingTemplatingConceptSelectorContainer_"+conceptNumber+"' style='display:inline-block;margin-left:10px;' ></div>";
            containerHTML += "<div id='templatingPropertiesContainersBox_"+conceptNumber+"' style='color:white;' >";
                containerHTML += "<div id='templatingIndependentPropertyContainer_"+conceptNumber+"' style='background-color:purple;padding:5px;' >templatingIndependentPropertyContainer_</div>";
                containerHTML += "<div id='templatingDependentPropertiesContainer_"+conceptNumber+"' style='background-color:blue;padding:5px;' >templatingDependentPropertiesContainer_</div>";
            containerHTML += "</div>";
        containerHTML += "</div>";
    containerHTML += "</div>";

    return containerHTML;
}

export const connectSubsetToSet = (conceptNumber,setNumber,childSetNumber) => {
    var subsetHTML = "";
    subsetHTML += "<div class=singleChildSubsetBox >";
        subsetHTML += "<div class=subsetNumberContainer >"+childSetNumber+"</div>";
        subsetHTML += "<div id='setChildSubsetMatchSelectorContainer_"+conceptNumber+"_"+setNumber+"_"+childSetNumber+"' style=display:inline-block; ></div>";
    subsetHTML += "</div>";

    jQuery("#subsetChildrenOfSetContainer_"+conceptNumber+"_"+setNumber).append(subsetHTML)
    CGOverviewFunctions.actionsAfterHTMLChange();
}

// childSpecificInstanceNumber refers to the specific instance of the set
// (maybe rename to setConnectedSpecificInstanceNumber ??)
// specificInstanceNumber refersto the specific instance of the concept
export const connectSpecificInstanceToSet = (conceptNumber,setNumber,childSpecificInstanceNumber) => {
    var siHTML = "";
    siHTML += "<div class=singleChildSpecificInstanceBox >";
        siHTML += "<div class=specificInstanceNumberContainer >"+childSpecificInstanceNumber+"</div>";
        siHTML += "<div id='setChildSpecificInstanceMatchSelectorContainer_"+conceptNumber+"_"+setNumber+"_"+childSpecificInstanceNumber+"' style=display:inline-block; ></div>";
    siHTML += "</div>";

    jQuery("#specificInstanceChildrenOfSetContainer_"+conceptNumber+"_"+setNumber).append(siHTML)
    CGOverviewFunctions.actionsAfterHTMLChange();
}

export const addNewSpecificInstanceHTML = (conceptNumber,specificInstanceNumber) => {
    var siHTML = "";
    siHTML += "<div class=singleSpecificInstanceBox>";
        siHTML += "<div>";
            siHTML += "<div class=specificInstanceNumberContainer >"+specificInstanceNumber+"</div>";

            siHTML += "<div id='toggleConnectSpecificInstanceToSupersetButton_"+conceptNumber+"_"+specificInstanceNumber+"' data-status='connect' class='toggleConnectSpecificInstanceToSupersetButton' data-conceptnumber='"+conceptNumber+"' data-specificinstancenumber='"+specificInstanceNumber+"' >S</div>";

            siHTML += "<select id='singleSpecificInstanceTypeSelector_"+conceptNumber+"_"+specificInstanceNumber+"' data-conceptnumber='"+conceptNumber+"' data-specificinstancenumber='"+specificInstanceNumber+"' class='conceptGraphOverviewSelectors singleSpecificInstanceTypeSelector' >";
                siHTML += "<option data-specificinstancecreationtype='deNovo' >new s.i. name:</option>";
                siHTML += "<option data-specificinstancecreationtype='preexistingConcept' >s.i. = another concept:</option>";
            siHTML += "</select>";

            siHTML += "<textarea id='specificInstanceNameSingularTextarea_"+conceptNumber+"_"+specificInstanceNumber+"' class=cgOverviewRight >";
            siHTML += "</textarea>";

            siHTML += "<div id='specificInstanceSourceConceptSelectorContainer_"+conceptNumber+"_"+specificInstanceNumber+"' style=display:none; ></div>";

            siHTML += "<div style=display:inline-block;float:right; >";
                siHTML += "<div style=display:inline-block;margin-left:100px; >delete: ";
                    siHTML += "<div data-status='green' data-conceptnumber='"+conceptNumber+"' data-specificinstancenumber='"+specificInstanceNumber+"' class='toggleDeleteSomethingButton deleteSpecificInstanceButton' >X</div>";
                siHTML += "</div>";
            siHTML += "</div>";
        siHTML += "</div>";
    siHTML += "</div>";

    jQuery("#specificInstancesContainer_"+conceptNumber).append(siHTML)
    document.getElementById("specificInstanceNameSingularTextarea_"+conceptNumber+"_"+specificInstanceNumber).focus();
    CGOverviewFunctions.actionsAfterHTMLChange();
}

export const addNewSetHTML = (conceptNumber,thisSetNumber,parentSetNumber) => {
    var setHTML = "";
    setHTML += "<div class=singleSetBox >";
        setHTML += "<div>";
            setHTML += "<div class=setNumberContainer >"+thisSetNumber+"</div>";

            setHTML += "<div id='toggleConnectSetToSupersetButton_"+conceptNumber+"_"+thisSetNumber+"' data-status='connect' class='toggleConnectSetToSupersetButton' data-conceptnumber='"+conceptNumber+"' data-setnumber='"+thisSetNumber+"' >S</div>";

            // setHTML += "from another concept";
            setHTML += "<select id='singleSetTypeSelector_"+conceptNumber+"_"+thisSetNumber+"' data-conceptnumber='"+conceptNumber+"' data-setnumber='"+thisSetNumber+"' class='conceptGraphOverviewSelectors singleSetTypeSelector' >";
                setHTML += "<option data-setcreationtype='deNovo' >new set name:</option>";
                setHTML += "<option data-setcreationtype='preexistingConcept' >set from another concept:</option>";
            setHTML += "</select>";

            setHTML += "<textarea id='setName_"+conceptNumber+"_"+thisSetNumber+"' class=cgOverviewRight >";
            setHTML += "</textarea>";

            setHTML += "<div id='setSourceConceptSelectorContainer_"+conceptNumber+"_"+thisSetNumber+"' style=display:none; ></div>";
            setHTML += "<div id='setSourceSetSelectorContainer_"+conceptNumber+"_"+thisSetNumber+"' style=display:none; ></div>";

            setHTML += "<div style=display:inline-block;margin-left:5px; >connect specific instance:</div>";
            setHTML += "<div id='connectSpecificInstanceToSetButton_"+conceptNumber+"_"+thisSetNumber+"' class='addSomethingButton connectSpecificInstanceToSetButton' data-conceptnumber='"+conceptNumber+"' data-setnumber='"+thisSetNumber+"' >+</div>";

            setHTML += "<div style=display:inline-block;margin-left:5px; >connect subset:</div>";
            setHTML += "<div id='connectSubsetToSetButton_"+conceptNumber+"_"+thisSetNumber+"' class='addSomethingButton connectSubsetToSetButton' data-conceptnumber='"+conceptNumber+"' data-setnumber='"+thisSetNumber+"' >+</div>";

            setHTML += "<div style=display:inline-block;float:right; >";
                setHTML += "<div style=display:inline-block;margin-left:100px; >delete: ";
                    setHTML += "<div data-status='green' data-conceptnumber='"+conceptNumber+"' data-setnumber='"+thisSetNumber+"' class='toggleDeleteSomethingButton deleteSetButton' >X</div>";
                setHTML += "</div>";
            setHTML += "</div>";
        setHTML += "</div>";

        setHTML += "<div id='subsetChildrenOfSetContainer_"+conceptNumber+"_"+thisSetNumber+"' class=subsetChildrenOfSetContainer >";
        setHTML += "</div>";

        setHTML += "<div id='specificInstanceChildrenOfSetContainer_"+conceptNumber+"_"+thisSetNumber+"' class=specificInstanceChildrenOfSetContainer >";
        setHTML += "</div>";

        setHTML += "<div id='childSetsContainer_"+conceptNumber+"_"+thisSetNumber+"' class=childSetsContainer >";
        setHTML += "</div>";
    setHTML += "</div>";

    jQuery("#setsContainer_"+conceptNumber).append(setHTML)
    document.getElementById("setName_"+conceptNumber+"_"+thisSetNumber).focus();
    CGOverviewFunctions.actionsAfterHTMLChange();
}

export const addNewPropertyHTML = (conceptNumber,thisPropertyNumber,parentPropertyNumber) => {
    var propertyHTML = "";
    propertyHTML += "<div class=singlePropertyBox >";

    propertyHTML += "<div>";
        propertyHTML += "<div class=propertyNumberContainer >"+thisPropertyNumber+"</div>";
        propertyHTML += "<textarea id='propertyName_"+conceptNumber+"_"+thisPropertyNumber+"' class=cgOverviewRight >";
        propertyHTML += "</textarea>";

        var aOptions = ["string","object","array","integer","number","boolean","null"]
        propertyHTML += "<select id='propertyTypeSelector_"+conceptNumber+"_"+thisPropertyNumber+"' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' class='propertyTypeSelector conceptGraphOverviewSelectors' >";
            for (var a=0;a<aOptions.length;a++) {
                var nextOption = aOptions[a];
                propertyHTML += "<option ";
                propertyHTML += " data-value='"+nextOption+"' ";
                propertyHTML += " >";
                propertyHTML += nextOption;
                propertyHTML += "</option>";
            }
        propertyHTML += "</select>";

        // visible if propertyType == object
        propertyHTML += "<div id='addPropertyButton_"+conceptNumber+"_"+thisPropertyNumber+"' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' class='addSomethingButton addPropertyButton propertyTypeDependentVisibility_"+conceptNumber+"_"+thisPropertyNumber+"' style=margin-left:10px;display:none; >+</div>";

        propertyHTML += "<div style=display:inline-block;float:right; >";
            propertyHTML += "<input id='propertyRequiredCheckbox_"+conceptNumber+"_"+thisPropertyNumber+"' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' type=checkbox class='cgOverviewCheckbox propertyRequiredCheckbox' /><div style=display:inline-block;margin-left:5px; >required</div>";
            propertyHTML += "<input id='propertyUniqueCheckbox_"+conceptNumber+"_"+thisPropertyNumber+"' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' type=checkbox class='cgOverviewCheckbox propertyUniqueCheckbox' /><div style=display:inline-block;margin-left:5px; >unique</div>";
            propertyHTML += "<div style=display:inline-block;margin-left:100px; >delete: ";
                propertyHTML += "<div data-status='green' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' class='toggleDeleteSomethingButton deletePropertyButton' style=margin-left:10px; >X</div>";
            propertyHTML += "</div>";
        propertyHTML += "</div>";

        // need to decide when these are visible
        propertyHTML += "<div id='independentPropertyForTemplatingButtonBox_"+conceptNumber+"_"+thisPropertyNumber+"' >";
            propertyHTML += "<div data-status='off' id='independentPropertyForTemplatingButton_"+conceptNumber+"_"+thisPropertyNumber+"' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' class='independentPropertyForTemplatingButton templatingButton_"+conceptNumber+"' style=margin-left:10px;display:none; >T</div>";
        propertyHTML += "</div>";
        propertyHTML += "<div id='dependentPropertyForTemplatingButtonBox_"+conceptNumber+"_"+thisPropertyNumber+"' >";
            propertyHTML += "<div data-status='off' id='dependentPropertyForTemplatingButton_"+conceptNumber+"_"+thisPropertyNumber+"' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' class='dependentPropertyForTemplatingButton templatingButton_"+conceptNumber+"' style=margin-left:10px;display:none; >T</div>";
        propertyHTML += "</div>";
    propertyHTML += "</div>";

    // visible if propertyType == integer or number
    propertyHTML += "<div id='numericPropertyOptions_"+conceptNumber+"_"+thisPropertyNumber+"' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' class='numericPropertyOptions propertyTypeDependentVisibility_"+conceptNumber+"_"+thisPropertyNumber+"' style=margin-left:30px;display:none; >";
        propertyHTML += "limits: ";
        propertyHTML += "<select id='numericPropertyMinimumTypeSelector_"+conceptNumber+"_"+thisPropertyNumber+"' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' class='conceptGraphOverviewSelectors numericPropertyMinimumTypeSelector' >";
            propertyHTML += "<option data-minimumoption='unrestricted' >not specified</option>";
            propertyHTML += "<option data-minimumoption='minimum' >minimum</option>";
            propertyHTML += "<option data-minimumoption='exclusiveMinimum' >exclusiveMinimum</option>";
        propertyHTML += "</select>";
        propertyHTML += "<input type='number' id='propertyMinimumValue_"+conceptNumber+"_"+thisPropertyNumber+"' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' class='propertyMinimumValue' >";

        propertyHTML += "<select id='numericPropertyMaximumTypeSelector_"+conceptNumber+"_"+thisPropertyNumber+"' style='margin-left:10px;' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' class='conceptGraphOverviewSelectors numericPropertyMaximumTypeSelector' >";
            propertyHTML += "<option data-maximumoption='unrestricted' >not specified</option>";
            propertyHTML += "<option data-maximumoption='maximum' >maximum</option>";
            propertyHTML += "<option data-maximumoption='exclusiveMaximum' >exclusiveMaximum</option>";
        propertyHTML += "</select>";
        propertyHTML += "<input type='number' id='propertyMaximumValue_"+conceptNumber+"_"+thisPropertyNumber+"' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' class='propertyMaximumValue' >";
    propertyHTML += "</div>";

    // visible if propertyType == object
    propertyHTML += "<div id='propertiesContainer_"+conceptNumber+"_"+thisPropertyNumber+"' class='childPropertiesContainer propertyTypeDependentVisibility_"+conceptNumber+"_"+thisPropertyNumber+"' style='display:none;' >";
    propertyHTML += "</div>";

    // visible if propertyType == string or array
    propertyHTML += "<div id='enumerationsContainer_"+conceptNumber+"_"+thisPropertyNumber+"' class='enumerationsContainer propertyTypeDependentVisibility_"+conceptNumber+"_"+thisPropertyNumber+"' >";
        propertyHTML += "<div id='enumerationsSelectorContainer_"+conceptNumber+"_"+thisPropertyNumber+"' style='display:inline-block;' >";
        propertyHTML += "</div>";

        propertyHTML += "<div id='enumerationContainerB_"+conceptNumber+"_"+thisPropertyNumber+"' style='display:none;' >";
            propertyHTML += "<div style=display:inline-block;margin-left:5px; >dependencies: </div>";
            propertyHTML += "<select id='enumerationWithDependenciesSelector_"+conceptNumber+"_"+thisPropertyNumber+"' class='conceptGraphOverviewSelectors enumerationWithDependenciesSelector' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' >";
                propertyHTML += "<option data-dependenciesoption='none' >none</option>";
                propertyHTML += "<option data-dependenciesoption='lower' >lower</option>";
                propertyHTML += "<option data-dependenciesoption='upper' >upper</option>";
            propertyHTML += "</select>";
            propertyHTML += "<input id='enumerationWithSubsetsCheckbox_"+conceptNumber+"_"+thisPropertyNumber+"' type=checkbox data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' class='cgOverviewCheckbox enumerationWithSubsetsCheckbox' />";
            propertyHTML += "<div style=display:inline-block;margin-left:5px; >subsets</div>";
        propertyHTML += "</div>";
    propertyHTML += "</div>";

    // visible if propertyType == string
    propertyHTML += "<div id='propertyStringPatternContainer_"+conceptNumber+"_"+thisPropertyNumber+"' style=display:inline-block;margin-left:25px; class='propertyTypeDependentVisibility_"+conceptNumber+"_"+thisPropertyNumber+"' >";
    propertyHTML += "<input id='propertyStringPatternCheckbox_"+conceptNumber+"_"+thisPropertyNumber+"' type=checkbox data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+thisPropertyNumber+"' class='cgOverviewCheckbox propertyStringPatternCheckbox' />";
    propertyHTML += "<div style=display:inline-block;margin-left:5px; >pattern: </div>";
    propertyHTML += "<div id='propertyStringPatternTextareaContainer_"+conceptNumber+"_"+thisPropertyNumber+"' style='display:none;' >";
        propertyHTML += "<textarea id='propertyStringPattern_"+conceptNumber+"_"+thisPropertyNumber+"' class=cgOverviewRight ></textarea>";
        propertyHTML += "</div>";
    propertyHTML += "</div>";

    jQuery("#propertiesContainer_"+conceptNumber+"_"+parentPropertyNumber).append(propertyHTML)
    document.getElementById("propertyName_"+conceptNumber+"_"+thisPropertyNumber).focus();
    CGOverviewFunctions.actionsAfterHTMLChange();
}

export const restrictionByEnumerationHTML = (conceptNumber,propertyNumber) => {
    var selectorHTML = "";
    selectorHTML += "<div style='margin-left:25px;' >";
    selectorHTML += "<input ";
    if (window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.limitValues == true) {
        selectorHTML += " checked ";
    }
    selectorHTML += " id='limitValuesCheckbox_"+conceptNumber+"_"+propertyNumber+"' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+propertyNumber+"' type=checkbox class='cgOverviewCheckbox limitValuesCheckbox' />";
    selectorHTML += "<div style=display:inline-block;margin-left:5px; >Limit values to specific instances of: </div>";
        selectorHTML += "<div id='enumerationSourceSelectorsContainer_"+conceptNumber+"_"+propertyNumber+"' ";
        if (!window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.limitValues) {
            selectorHTML += " style='display:none;' ";
        }
        if (window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.limitValues == true) {
            selectorHTML += " style='display:inline-block;' ";
        }
        selectorHTML += " >";
            selectorHTML += "<div id='enumerationSourceConceptSelectorContainer_"+conceptNumber+"_"+propertyNumber+"' style='display:inline-block;' >";
            selectorHTML += "<select class='enumerationSourceConceptSelector conceptGraphOverviewSelectors' id='enumerationSourceConceptSelector_"+conceptNumber+"_"+propertyNumber+"' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+propertyNumber+"' >";
                for (var cN=0;cN<window.cgOverviewPage.concepts.length;cN++) {
                    // if (cN != conceptNumber) {
                        selectorHTML += "<option data-enumerationsourceconceptnumber='"+cN+"' ";
                        if (cN == window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.sourceConceptNumber) {
                            selectorHTML += " selected ";
                        }
                        var conceptName = window.cgOverviewPage.concepts[cN].name.singular;
                        selectorHTML += " >";
                        if (conceptName) {
                            selectorHTML += conceptName;
                        } else {
                            selectorHTML += "set number <div class=conceptNumberContainer >"+cN+"</div>";
                        }
                        selectorHTML += "</option>";
                    // }
                }
            selectorHTML += "</select>";
            selectorHTML += "</div>";

            selectorHTML += "<div class='enumerationSourceSetSelectorContainer' id='enumerationSourceSetSelectorContainer_"+conceptNumber+"_"+propertyNumber+"' style='display:inline-block;' >";
            selectorHTML += "set selector";
            selectorHTML += "</div>";

            /*
            selectorHTML += "<div style=display:inline-block;margin-left:5px; >dependencies: </div>";
            selectorHTML += "<select id='enumerationWithDependenciesSelector_"+conceptNumber+"_"+propertyNumber+"' class='conceptGraphOverviewSelectors' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+propertyNumber+"' >";
                selectorHTML += "<option>none</option>";
                selectorHTML += "<option>LOWER</option>";
                selectorHTML += "<option>UPPER</option>";
            selectorHTML += "</select>";
            selectorHTML += "<input id='enumerationWithSubsetsCheckbox_"+conceptNumber+"_"+propertyNumber+"' type=checkbox data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+propertyNumber+"' class='cgOverviewCheckbox' />";
            selectorHTML += "<div style=display:inline-block;margin-left:5px; >subsets</div>";
            */

        selectorHTML += "</div>";

    selectorHTML += "</div>";

    return selectorHTML;
}

export const updateEnumerationSourceSetSelector = (conceptNumber,propertyNumber,enumerationSourceConceptNumber) => {
    var selectorHTML = "";
    selectorHTML += "<select class='enumerationSourceSetSelector conceptGraphOverviewSelectors' id='enumerationSourceSetSelector_"+conceptNumber+"_"+propertyNumber+"' data-conceptnumber='"+conceptNumber+"' data-propertynumber='"+propertyNumber+"' >";
    if (enumerationSourceConceptNumber != null) {
        var sN = -1; // -1 indicates superset
        selectorHTML += "<option data-enumerationsourcesetnumber='"+sN+"' ";
        if (sN == window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.sourceSetNumber) {
            selectorHTML += " selected ";
        }
        selectorHTML += " >";
        selectorHTML += "superset";
        selectorHTML += "</option>";
        for (var sN=0;sN < window.cgOverviewPage.concepts[enumerationSourceConceptNumber].sets.length; sN ++) {
            selectorHTML += "<option data-enumerationsourcesetnumber='"+sN+"' ";
            if (sN == window.cgOverviewPage.concepts[conceptNumber].properties[propertyNumber].enumerationData.sourceSetNumber) {
                selectorHTML += " selected ";
            }
            var setName = window.cgOverviewPage.concepts[enumerationSourceConceptNumber].sets[sN].setName;
            selectorHTML += " >";
            if (setName) {
                selectorHTML += setName;
            } else {
                selectorHTML += "set number <div class=setNumberContainer >"+sN+"</div>";
            }
            selectorHTML += "</option>";
        }
    }
    selectorHTML += "</select>";
    jQuery("#enumerationSourceSetSelectorContainer_"+conceptNumber+"_"+propertyNumber).html(selectorHTML)
}

export const updateSpecificInstanceSourceConceptSelector = (conceptNumber,specificInstanceNumber) => {
    var selectorHTML = "";
    selectorHTML += "<select class='specificInstanceSourceConceptSelector conceptGraphOverviewSelectors' id='specificInstanceSourceConceptSelector_"+conceptNumber+"_"+specificInstanceNumber+"' data-conceptnumber='"+conceptNumber+"' data-specificinstancenumber='"+specificInstanceNumber+"' >";
    for (var cN=0;cN<window.cgOverviewPage.concepts.length;cN++) {
        if (cN != conceptNumber) {
            selectorHTML += "<option data-specificinstancesourceconceptnumber='"+cN+"' ";
            if (cN == window.cgOverviewPage.concepts[conceptNumber].specificInstances[specificInstanceNumber].sourceConceptNumber) {
                selectorHTML += " selected ";
            }
            var conceptName = window.cgOverviewPage.concepts[cN].name.singular;
            selectorHTML += " >";
            if (conceptName) {
                selectorHTML += conceptName;
            } else {
                selectorHTML += "concept number <div class='conceptNumberContainer' >"+cN+"</div>";
            }
            selectorHTML += "</option>";
        }
    }
    selectorHTML += "</select>";
    jQuery("#specificInstanceSourceConceptSelectorContainer_"+conceptNumber+"_"+specificInstanceNumber).html(selectorHTML)
}

export const updateSetSourceConceptSelector = (conceptNumber,setNumber) => {
    var selectorHTML = "";
    selectorHTML += "<select class='setSourceConceptSelector conceptGraphOverviewSelectors' id='setSourceConceptSelector_"+conceptNumber+"_"+setNumber+"' data-conceptnumber='"+conceptNumber+"' data-setnumber='"+setNumber+"' >";
    for (var cN=0;cN<window.cgOverviewPage.concepts.length;cN++) {
        if (cN != conceptNumber) {
            selectorHTML += "<option data-setsourceconceptnumber='"+cN+"' ";
            if (cN == window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].sourceConceptNumber) {
                selectorHTML += " selected ";
            }
            var conceptName = window.cgOverviewPage.concepts[cN].name.singular;
            selectorHTML += " >";
            if (conceptName) {
                selectorHTML += conceptName;
            } else {
                selectorHTML += "concept number <div class='conceptNumberContainer' >"+cN+"</div>";
            }
            selectorHTML += "</option>";
        }
    }
    selectorHTML += "</select>";
    jQuery("#setSourceConceptSelectorContainer_"+conceptNumber+"_"+setNumber).html(selectorHTML)
}
export const updateSetSourceSetSelector = (conceptNumber,setNumber) => {
    var sourceConceptNumber = window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].sourceConceptNumber;
    var selectorHTML = "";
    selectorHTML += "<select class='setSourceSetSelector conceptGraphOverviewSelectors' id='setSourceSetSelector_"+conceptNumber+"_"+setNumber+"' data-conceptnumber='"+conceptNumber+"' data-setnumber='"+setNumber+"' >";
    var sN = -1;
    selectorHTML += "<option data-setsourcesetnumber='"+sN+"' ";
    if (sN == window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].sourceSetNumber) {
        selectorHTML += " selected ";
    }
    selectorHTML += " >";
    selectorHTML += "superset";
    selectorHTML += "</option>";
    if (sourceConceptNumber != null) {
        for (var sN=0;sN < window.cgOverviewPage.concepts[sourceConceptNumber].sets.length;sN++) {
            var setName = window.cgOverviewPage.concepts[sourceConceptNumber].sets[sN].setName;
            selectorHTML += "<option data-setsourcesetnumber='"+sN+"' ";
            if (sN == window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].sourceSetNumber) {
                selectorHTML += " selected ";
            }
            selectorHTML += " >";
            selectorHTML += setName;
            selectorHTML += "</option>";
        }
    }
    selectorHTML += "</select>";
    jQuery("#setSourceSetSelectorContainer_"+conceptNumber+"_"+setNumber).html(selectorHTML)
}

export const updateSetChildSubsetMatchSelector = (conceptNumber,setNumber,childSubsetNumber) => {
    var selectorHTML = "";
    selectorHTML += "<select class='setChildSubsetMatchSelector conceptGraphOverviewSelectors' id='setChildSubsetMatchSelector_"+conceptNumber+"_"+setNumber+"_"+childSubsetNumber+"' data-conceptnumber='"+conceptNumber+"' data-setnumber='"+setNumber+"' data-childsubsetnumber='"+childSubsetNumber+"' >";
    for (var subN=0;subN < window.cgOverviewPage.concepts[conceptNumber].sets.length;subN++) {
        if (subN != setNumber) {
            selectorHTML += "<option data-subsetnumber='"+subN+"' ";
            var childSetNumber = window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].subsets[childSubsetNumber].subsetNumber
            if (subN == childSetNumber) {
                selectorHTML += " selected ";
            }
            selectorHTML += " >";
            var subsetName = window.cgOverviewPage.concepts[conceptNumber].sets[subN].setName;
            selectorHTML += subsetName;
            selectorHTML += "</option>";
        }
    }
    selectorHTML += "</select>";
    jQuery("#setChildSubsetMatchSelectorContainer_"+conceptNumber+"_"+setNumber+"_"+childSubsetNumber).html(selectorHTML)
    // The following 2 lines are needed for when .subsetNumber is set to zero (by default), but zero is not a valid option bc zero is the parent set
    var initialSubsetNumber = jQuery("#setChildSubsetMatchSelector_"+conceptNumber+"_"+setNumber+"_"+childSubsetNumber+" option:selected").data("subsetnumber")
    window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].subsets[childSubsetNumber].subsetNumber = initialSubsetNumber;
}

export const updateSetChildSpecificInstanceMatchSelector = (conceptNumber,setNumber,childSpecificInstanceNumber) => {
    var selectorHTML = "";
    selectorHTML += "<select class='setChildSpecificInstanceMatchSelector conceptGraphOverviewSelectors' id='setChildSpecificInstanceMatchSelector_"+conceptNumber+"_"+setNumber+"_"+childSpecificInstanceNumber+"' data-conceptnumber='"+conceptNumber+"' data-setnumber='"+setNumber+"' data-childspecificinstancenumber='"+childSpecificInstanceNumber+"' >";
    for (var siN=0;siN<window.cgOverviewPage.concepts[conceptNumber].specificInstances.length;siN++) {
        selectorHTML += "<option data-specificinstancenumber='"+siN+"' ";
        if (siN == window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].specificInstances[childSpecificInstanceNumber].specificInstanceNumber) {
            selectorHTML += " selected ";
        }
        var specificInstanceCreationType = window.cgOverviewPage.concepts[conceptNumber].specificInstances[siN].creationType;
        // console.log("updateSetChildSpecificInstanceMatchSelector; conceptNumber: "+conceptNumber+"; siN: "+siN+"; specificInstanceCreationType: "+specificInstanceCreationType)
        if (specificInstanceCreationType=="deNovo") {
            var specificInstanceName = window.cgOverviewPage.concepts[conceptNumber].specificInstances[siN].specificInstanceName;
        }
        if (specificInstanceCreationType=="preexistingConcept") {
            var sourceConceptNumber = window.cgOverviewPage.concepts[conceptNumber].specificInstances[siN].sourceConceptNumber;
            if (sourceConceptNumber != null) {
                var specificInstanceName = window.cgOverviewPage.concepts[sourceConceptNumber].name.singular;
            } else {
                var specificInstanceName = "preexistingConcept, but sourceConceptNumber is unknown";
            }
        }
        var selectorValue = "";
        if (specificInstanceName) {
            // selectorHTML += specificInstanceName;
            selectorValue = specificInstanceName
        } else {
            // selectorHTML += "specific instance number "+siN;
            selectorValue = "specific instance number "+siN;
        }
        selectorHTML += " value='"+selectorValue+"' ";
        selectorHTML += " >";
        selectorHTML += selectorValue;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";
    jQuery("#setChildSpecificInstanceMatchSelectorContainer_"+conceptNumber+"_"+setNumber+"_"+childSpecificInstanceNumber).html(selectorHTML)
    // CGOverviewFunctions.actionsAfterHTMLChange();
}

export const updateExistingTemplateConceptSelector = (conceptNumber) => {
    var selectorHTML = "";
    selectorHTML += "<select id='existingTemplatingConceptSelector_"+conceptNumber+"' data-conceptnumber='"+conceptNumber+"' class='conceptGraphOverviewSelectors existingTemplatingConceptSelector' >";
    for (var cN=0;cN<window.cgOverviewPage.concepts.length;cN++) {
        if (cN != conceptNumber) {
            selectorHTML += "<option data-templateconceptnumber='"+cN+"' ";
            if (cN == window.cgOverviewPage.concepts[conceptNumber].templating.templateConceptNumber) {
                selectorHTML += " selected ";
            }
            var conceptName = window.cgOverviewPage.concepts[cN].name.singular;
            selectorHTML += " >";
            if (conceptName) {
                selectorHTML += conceptName;
            } else {
                selectorHTML += "concept number <div class='conceptNumberContainer' >"+cN+"</div>";
            }
            selectorHTML += "</option>";
        }
    }
    selectorHTML += "</select>";
    jQuery("#existingTemplatingConceptSelectorContainer_"+conceptNumber).html(selectorHTML)
}

export const redrawAllExistingTemplatingConceptSelectors = () => {
    for (var conceptNumber=0;conceptNumber<window.cgOverviewPage.concepts.length;conceptNumber++) {
        updateExistingTemplateConceptSelector(conceptNumber);
    }
}

export const redrawAllSetChildSubsetMatchSelectors = () => {
    for (var conceptNumber=0;conceptNumber<window.cgOverviewPage.concepts.length;conceptNumber++) {
        for (var setNumber=0;setNumber<window.cgOverviewPage.concepts[conceptNumber].sets.length;setNumber++) {
            for (var childSubsetNumber=0;childSubsetNumber < window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].subsets.length; childSubsetNumber++) {
                updateSetChildSubsetMatchSelector(conceptNumber,setNumber,childSubsetNumber);
                // jQuery("#setChildSubsetMatchSelector_"+conceptNumber+"_"+setNumber+"_"+childSubsetNumber).change();
            }
        }
    }
}
export const redrawAllSetChildSpecificInstanceMatchSelectors = () => {
    for (var conceptNumber=0;conceptNumber<window.cgOverviewPage.concepts.length;conceptNumber++) {
        for (var setNumber=0;setNumber<window.cgOverviewPage.concepts[conceptNumber].sets.length;setNumber++) {
            for (var childSpecificInstanceNumber=0;childSpecificInstanceNumber < window.cgOverviewPage.concepts[conceptNumber].sets[setNumber].specificInstances.length; childSpecificInstanceNumber++) {
                updateSetChildSpecificInstanceMatchSelector(conceptNumber,setNumber,childSpecificInstanceNumber)
            }
        }
    }
}
export const redrawAllSpecificInstanceSourceConceptSelectors = () => {
    for (var conceptNumber=0;conceptNumber<window.cgOverviewPage.concepts.length;conceptNumber++) {
        for (var specificInstanceNumber=0;specificInstanceNumber<window.cgOverviewPage.concepts[conceptNumber].specificInstances.length;specificInstanceNumber++) {
            updateSpecificInstanceSourceConceptSelector(conceptNumber,specificInstanceNumber)
        }
    }
}
export const redrawAllSetSourceConceptSelectors = () => {
    for (var conceptNumber=0;conceptNumber<window.cgOverviewPage.concepts.length;conceptNumber++) {
        for (var setNumber=0;setNumber<window.cgOverviewPage.concepts[conceptNumber].sets.length;setNumber++) {
            updateSetSourceConceptSelector(conceptNumber,setNumber)
            updateSetSourceSetSelector(conceptNumber,setNumber)
        }
    }
}
export const redrawAllRestrictionsByEnumerationHTML = () => {
    for (var conceptNumber=0;conceptNumber<window.cgOverviewPage.concepts.length;conceptNumber++) {
        for (var propertyNumber=0;propertyNumber<window.cgOverviewPage.concepts[conceptNumber].properties.length;propertyNumber++) {
            var restrictionsHTML = restrictionByEnumerationHTML(conceptNumber,propertyNumber);
            jQuery("#enumerationsSelectorContainer_"+conceptNumber+"_"+propertyNumber).html(restrictionsHTML)
            var enumerationSourceConceptNumber = jQuery("#enumerationSourceConceptSelector_"+conceptNumber+"_"+propertyNumber+" option:selected").data("enumerationsourceconceptnumber")
            updateEnumerationSourceSetSelector(conceptNumber,propertyNumber,enumerationSourceConceptNumber);
        }
    }
}
