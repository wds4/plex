import React from 'react';
import ReactDOM from 'react-dom';

import * as InitDOMFunctions from './plex/functions/transferSqlToDOM.js';

import './index.css';
import './css/main.css';
import './css/plex.css';
import './css/react.css';
import './css/checkbox.css';
import './css/customDataTables.css';
// import './css/nouislider.css';
import './css/colorpicker.css';
// import './lib/vis-network-9-0-2.js';
// import App from './App';
import App from './App';
// import App2 from './App';
import Profile from './Profile';
import About from './About';
import HelloWorldPages from './HelloWorldPages';
import MaintenancePages from './MaintenancePages';
import MyConceptGraphs from './views/conceptGraphs/myConceptGraphs';
import ViewMyConceptGraph from './views/conceptGraphs/viewMyConceptGraph';
import MyDictionaries from './views/dictionaries/myDictionaries';
import ViewMyDictionary from './views/dictionaries/viewMyDictionary';
import WordTemplatesByWordType from './views/wordTemplatesByWordType';
import UpdataGlobalDynamicData from './views/globalDynamicData/updateGlobalDynamicData';
import C2CRelsMaintenance from './views/maintenance/c2cRelsMaintenance/c2cRelsMaintenance';
import ConceptsMaintenance from './views/maintenance/conceptsMaintenance/conceptsMaintenance';
import SpecificInstancesMaintenance from './views/maintenance/specificInstancesMaintenance/specificInstancesMaintenance';
import ConceptGraphMaintenance from './views/maintenance/conceptGraphMaintenance/conceptGraphMaintenance';
import MaintenanceOfXYZ from './views/maintenance/maintenanceOfXYZ/maintenanceOfXYZ';
import ResetMiscValues from './views/maintenance/resetMiscValues/resetMiscValues';
import MaintenanceOfSchemas from './views/maintenance/maintenanceOfSchemas/maintenanceOfSchemas';
import MaintenanceControlPanel from './views/maintenance/controlPanel/maintenanceControlPanel';
import MaintenanceOfPropertySchemas from './views/maintenance/maintenanceOfPropertySchemas/maintenanceOfPropertySchemas';
import UpdatePropertyData from './views/propertyData/updatePropertyData';
import PropertyModuleMaintenance from './views/maintenance/propertyModuleMaintenance/propertyModuleMaintenance';

// src/views/globalDynamicData/updateGlobalDynamicData.js
import LeftNavbar from './LeftNavbar';
import LeftNavbarHelloWorld from './LeftNavbar_HelloWorld';
import LeftNavbarMaintenance from './LeftNavbar_Maintenance';
import Sqlite3DbManagement from './Sqlite3DbManagement';
// import LandingPage from './LandingPage';
import ReactJSONSchemaForm from './helloWorld/react-jsonschema-form';
import ReactJSONSchemaForm2 from './helloWorld/react-jsonschema-form-2';
import BuildConceptFamily from './views/buildConceptFamily';
// import ConceptGraphMasthead from'./conceptGraphMasthead';
import { BrowserRouter, Route } from "react-router-dom";
import Demo from 'react-jsonschema-form'; // eslint-disable-line import/no-unresolved
import schema from './json/schemaTest';
import * as Constants from './conceptGraphMasthead.js';


/////////////////////////////////////// PLEX ///////////////////////////////////////////////////
// PLEX (a.k.a. Pretty Good Apps, Pretty Good 'Punk; Concept Graph, Grapevine, Hybrids); started 16 Apr 2022
///////////////                  PLEX: CONCEPT GRAPH

import LeftNavbar1_ConceptGraph from './plex/navbars/leftNavbar1/conceptGraph_leftNav1.js';

import LeftNavbar2_GeneralSettings from './plex/navbars/leftNavbar2/settings_leftNav2.js';
import LeftNavbar2_HelloWorld from './plex/navbars/leftNavbar2/helloWorld_leftNav2.js';
import LeftNavbar2_Profile from './plex/navbars/leftNavbar2/profile_leftNav2.js';

import LeftNavbar2_ConceptGraphs from './plex/navbars/leftNavbar2/conceptGraphs_leftNav2.js';
import LeftNavbar2_SingleConceptGraph from './plex/navbars/leftNavbar2/singleConceptGraph_leftNav2.js';

import LeftNavbar2_Dictionaries from './plex/navbars/leftNavbar2/dictionaries_leftNav2.js';
import LeftNavbar2_WordTypes from './plex/navbars/leftNavbar2/wordTypes_leftNav2.js';
import LeftNavbar2_RelationshipTypes from './plex/navbars/leftNavbar2/relationshipTypes_leftNav2.js';

import LeftNavbar2_NeuroCore from './plex/navbars/leftNavbar2/neuroCore_leftNav2.js';
import LeftNavbar2_SQL from './plex/navbars/leftNavbar2/sql_leftNav2.js';
import LeftNavbar2_SQLSingleTable from './plex/navbars/leftNavbar2/sqlSingleTable_leftNav2.js';

import PlexHome from './plex/plexHome.js';
import PlexSettingsMainPage from './plex/settings/generalPlexSettings.js';

import ConceptGraphFrontEndHome from './plex/conceptGraphFrontEnd/conceptGraphHome.js';
import ConceptGraphsFrontEndMainPage from './plex/conceptGraphFrontEnd/conceptGraphs/conceptGraphsMainPage.js';
import ConceptGraphsFrontEndManageDirectory from './plex/conceptGraphFrontEnd/conceptGraphs/manageDirectory.js';
import ConceptGraphsFrontEndMakeNewConceptGraph from './plex/conceptGraphFrontEnd/conceptGraphs/makeNewConceptGraphPage.js';
import ConceptGraphsFrontEndTable from './plex/conceptGraphFrontEnd/conceptGraphs/conceptGraphsTable.js';

import ConceptGraphsFrontEndSingleConceptGraphMainPage from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/singleConceptGraphMainPage.js';
import ConceptGraphsFrontEndSingleConceptGraphDetailedInfo from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/singleConceptGraphDetailedInfo.js';

import ConceptGraphHome from './plex/conceptGraph/conceptGraphHome.js';
import DecentralizedProofOfPersonhoodHome from './plex/dProofOfPersonhood/dProofOfPersonhoodHome.js';
import CrowdscreenedGroupsHome from './plex/crowdscreenedGroups/crowdscreenedGroupsHome.js';
import DecentralizedRedditHome from './plex/dReddit/dRedditHome.js';
import DecentralizedOntologiesHome from './plex/dOntologies/dOntologiesHome.js';
import DecentralizedQuestionsAndAnswersHome from './plex/askPlex/dQuestionsAndAnswersHome.js';
import DecentralizedTwitterHome from './plex/dTwitter/dTwitterHome.js';
import DecentralizedSearchHome from './plex/dSearch/dSearchHome.js';

import GrapevineHome from './plex/grapevine/grapevineHome.js';
import GrapevineSettingsMainPage from './plex/grapevine/settings/generalSettings.js';
import GrapevineSettingsRatingsLocationsInMutableFileSystem from './plex/grapevine/settings/ratingsInMFS/ratingsLocationsInMutableFileSystem.js';
import GrapevineContactsMainPage from './plex/grapevine/contacts/contactsMainPage.js';
import GrapevineChatroomMainPage from './plex/grapevine/chatroom/chatroomMainPage.js';
import GrapevineVisualizationMainPage from './plex/grapevine/visualization/grapevineVisualizationMainPage.js';
import GrapevineInfluenceAndTrustScoresMainPage from './plex/grapevine/influenceAndTrustScores/influenceAndTrustScoresMainPage.js';

import GrapevineRatingsMainPage from './plex/grapevine/ratings/ratingsMainPage.js';
import ShowAllRatings from './plex/grapevine/ratings/showAllRatings.js';

import GrapevineScoresMainPage from './plex/grapevine/scores/scoresMainPage.js';
import GrapevineContextMainPage from './plex/grapevine/context/contextMainPage.js';

import SingleUserProfilePage from './plex/grapevine/contacts/singleUser/singleUserProfilePage.js';
import SingleUserLeaveRating1 from './plex/grapevine/contacts/singleUser/leaveRating1.js';
import SingleUserLeaveRating2 from './plex/grapevine/contacts/singleUser/leaveRating2.js';

import EBooksHome from './plex/eBooks/eBooksHome.js';
import EBook1Home from './plex/eBooks/eBook1/eBook1Home.js';

import ConceptGraphSettingsMainPage from './plex/conceptGraph/settings/generalSettings.js';
import ProfileMainPage from './plex/grapevine/profile/profileMainPage.js';
import PlexAppsNavPage from './plex/plexAppsNavPage.js';
import HelloWorldMainPage from './plex/settings/helloWorld/helloWorldMain.js';
import HelloWorldMarkdown from './plex/settings/helloWorld/helloWorldMarkdown.js';
import HelloWorldNoUiSlider from './plex/settings/helloWorld/helloWorldNoUiSlider.js';
import HelloWorldVisJS from './plex/settings/helloWorld/helloWorldVisJS.js';
import HelloWorldVictory from './plex/settings/helloWorld/helloWorldVictory.js';
import HelloWorldGoogleCharts from './plex/settings/helloWorld/helloWorldGoogleCharts.js';
import HelloWorldP5 from './plex/settings/helloWorld/helloWorldP5.js';
import HelloWorldC2 from './plex/settings/helloWorld/helloWorldC2.js';
import HelloWorldAsyncChain from './plex/settings/helloWorld/helloWorldAsyncChain.js';
import HelloWorldChildToParent from './plex/settings/helloWorld/helloWorldChildToParent.js';
import HelloWorldDataTables from './plex/settings/helloWorld/helloWorldDataTables.js';
import HelloWorldJSONSchemaForm from './plex/settings/helloWorld/helloWorldJSONSchemaForm.js';
import HelloWorldJSONSchemaFormTester from './plex/settings/helloWorld/helloWorldJSONSchemaFormTester.js';
import HelloWorldJSONSchemaFormRender from './plex/settings/helloWorld/helloWorldJSONSchemaFormRender.js';
import HelloWorldJSONSchemaFormV5 from './plex/settings/helloWorld/helloWorldJSONSchemaFormV5.js';
import HelloWorldWriteFile from './plex/settings/helloWorld/helloWorldWriteFile.js';
import HelloWorldReadFile from './plex/settings/helloWorld/helloWorldReadFile.js';
import HelloWorldUploadImageToIPFS from './plex/settings/helloWorld/helloWorldUploadImageToIPFS.js';

import ConceptGraphsFrontEnd_WordsMainPage from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/words/wordsMainPage.js';
import ConceptGraphsFrontEnd_TableOfWords from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/words/tableOfWords/tableOfWords.js';
import ConceptGraphsFrontEnd_SingleWordMainPage from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/words/singleWord/singleWordMainPage.js';

import ConceptGraphsFrontEnd_ManageDownload from './plex/conceptGraphFrontEnd/manageConceptGraphDownload/manageConceptGraphDownload.js';
import ConceptGraphsFrontEnd_ManageMainConceptGraphSchema from './plex/conceptGraphFrontEnd/manageConceptGraphDownload/manageMainConceptGraphSchema.js';
import ConceptGraphsFrontEnd_DownloadConceptGraphFromExternalSource from './plex/conceptGraphFrontEnd/manageConceptGraphDownload/downloadConceptGraphFromExternalSource.js';
import ConceptGraphsFrontEnd_UpdateIPNSs from './plex/conceptGraphFrontEnd/manageConceptGraphDownload/updateIpnsInSchemaDataAndConceptData.js';

import ConceptGraphsFrontEnd_ConceptsMainPage from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/conceptsMainPage.js';
import ConceptGraphsFrontEnd_TableOfConcepts from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/tableOfConcepts/tableOfConcepts.js';
import ConceptGraphsFrontEnd_SingleConceptMainPage from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/singleConceptMainPage.js';
import ConceptGraphsFrontEnd_MakeNewConcept from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/makeNewConcept.js';

import ConceptGraphsFrontEndSingleConceptGraphUpdateProposals from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/updateProposals/mainPage.js';
import ConceptGraphsFrontEndSingleConceptGraphListsOfUpdateProposals from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/updateProposals/listsOfProposals/mainPage.js';
import ConceptGraphsFrontEndSingleConceptGraphAllKnownUpdateProposals from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/updateProposals/listsOfProposals/allKnownUpdateProposals.js';
import ConceptGraphsFrontEndExternalUpdateProposals from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/updateProposals/listsOfProposals/searchForExternalProposals.js';
import ConceptGraphsFrontEndSingleConceptGraphSingleUpdateProposalMainPage from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/updateProposals/singleUpdateProposal/singleUpdateProposalMainPage.js';
import ConceptGraphsFrontEndSingleConceptGraphUpdateProposalsVisualizationMainPage from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/updateProposals/visualization/mainPage.js';
import ConceptGraphsFrontEndVisualizeScoreCalculationsOfUpdateProposals from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/updateProposals/visualization/visualizeCalculations.js';

import ConceptGraphsFrontEndSingleConceptGraphManualImportsMainPage from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/manualImports/mainPage.js';
import ConceptGraphsFrontEndSingleConceptGraphManualImportsSingleWordByIpns from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/manualImports/singleWordFromIpns.js';
import ConceptGraphsFrontEndSingleConceptGraphManualImportsLinkedConceptGraph from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/manualImports/fromLinkedConceptGraph.js';

import ConceptGraphsFrontEndSingleSet from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/sets/singleSet.js';
import ConceptGraphsFrontEndMakeNewSet from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/sets/makeNewSet.js';
import ConceptGraphsFrontEndSetsMainPage from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/sets/setsMainPage.js';
import ConceptGraphsFrontEndSingleSpecificInstance from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/specificInstances/singleSpecificInstance.js';
import ConceptGraphsFrontEndMakeNewSpecificInstance from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/specificInstances/makeNewSpecificInstance.js';
import ConceptGraphsFrontEndSpecificInstancesMainPage from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/specificInstances/specificInstancesMainPage.js';

import ConceptGraphsFrontEndSpecificInstanceDigestsMainPage from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/specificInstanceDigests/specificInstanceDigestsMainPage.js';
import ConceptGraphsFrontEndManageSpecificInstanceDigestFileTypes from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/specificInstanceDigests/manageSpecificInstanceDigestFileTypes.js';

import ConceptGraphsFrontEndSingleConceptUpdatesMainPage from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/updates/singleConceptUpdatesMainPage.js';
import ConceptGraphsFrontEndSingleConceptUpdatesListOfSynonyms from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/updates/listOfSynonyms.js';
import ConceptGraphsFrontEndSingleConceptUpdatesListOfUpdates from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/updates/listOfUpdates.js';
import ConceptGraphsFrontEndSingleConceptUpdatesControlPanel from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/updates/singleConceptUpdatesControlPanel.js';

import ConceptGraphsFrontEndSingleConceptUpdatesListsOfUpdates from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/updates/listsOfUpdates/mainPage.js';

import ConceptGraphsFrontEndSingleConceptUpdatesMakeNewConceptUpdate from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/updates/makeNewUpdate/conceptUpdate.js';
import ConceptGraphsFrontEndSingleConceptUpdatesMakeNewMainSchemaUpdate from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/updates/makeNewUpdate/mainSchemaUpdate.js';
import ConceptGraphsFrontEndSingleConceptUpdatesMakeNewPropertySchemaUpdate from './plex/conceptGraphFrontEnd/conceptGraphs/singleConceptGraph/concepts/singleConcept/updates/makeNewUpdate/propertySchemaUpdate.js';

import ConceptGraphsMainPage from './plex/conceptGraph/conceptGraphs/conceptGraphsMainPage.js';
import MakeNewConceptGraphPage from './plex/conceptGraph/conceptGraphs/makeNewConceptGraphPage.js';
import ConceptGraphsImportsExportsPage from './plex/conceptGraph/conceptGraphs/conceptGraphsImportsExportsPage.js';
import ConceptGraphsCompactFilesTable from './plex/conceptGraph/conceptGraphs/conceptGraphsCompactFilesTable.js';
import ConceptGraphOverviewMainPage from './plex/conceptGraph/conceptGraphs/conceptGraphOverview/overviewMainPage.js';
import ConceptGraphOverviewReactOnlyMainPage from './plex/conceptGraph/conceptGraphs/conceptGraphOverview/overviewMainPage_reactOnly.js';

import EditExistingConceptGraphPage from './plex/conceptGraph/conceptGraphs/editExistingConceptGraphPage.js';
import SingleConceptGraphDetailedInfo from './plex/conceptGraph/conceptGraphs/singleConceptGraphDetailedInfo.js';
import SingleConceptGraphErrorCheck from './plex/conceptGraph/conceptGraphs/singleConceptGraphErrorCheck.js';
import SingleConceptGraphCompactExport from './plex/conceptGraph/conceptGraphs/singleConceptGraphCompactExport.js';
import SingleConceptGraphImport from './plex/conceptGraph/conceptGraphs/singleConceptGraphImport.js';

import SingleConceptGraphTemplating from './plex/conceptGraph/conceptGraphs/singleConceptGraph/templating/makeNewTemplate.js';

import SingleConceptGraphPinToIPFS from './plex/conceptGraph/conceptGraphs/singleConceptGraph/pin/pinToIPFS.js';
import SingleConceptGraphWriteToMFS from './plex/conceptGraph/conceptGraphs/singleConceptGraph/pin/writeToMFS.js';

import SingleConceptGraphDataModeling from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/dataModeling.js';

import SingleConceptGraphDataModelingSchemaOrg from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/schema_org.js';
import SingleConceptGraphDataModelingSchemaOrgExtensions from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/extensions/extensions.js';
import SingleConceptGraphDataModelingSchemaOrgGraphNav from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/graphicalNavigation.js';
import SingleConceptGraphDataModelingSchemaOrgTextNav from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/hierarchicalTextNavigation.js';

import SingleConceptGraphDataModelingConceptGraph from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/conceptGraph/conceptGraphs.js';
import SingleConceptGraphDataModelingConceptGraphGraphNav from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/conceptGraph/graphicalNavigation.js';
import SingleConceptGraphDataModelingConceptGraphTextNav from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/conceptGraph/hierarchicalTextNavigation.js';

import SingleConceptGraphDMSchemaOrgAllRelationshipsTable from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/typeRelationships/allRelationshipsTable.js';
import SingleConceptGraphDMSchemaOrgMakeNewRelationship from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/typeRelationships/makeNewRelationship.js';
import SingleConceptGraphDMSchemaOrgSingleRelationshipExplorer from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/typeRelationships/viewSingleRelationship.js';

import SingleConceptGraphDMSchemaOrgDataTypesTable from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/dataTypes/dataTypesTable.js';
import SingleConceptGraphDMSchemaOrgMakeNewDataType from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/dataTypes/makeNewDataType.js';
import SingleConceptGraphDMSchemaOrgSingleDataTypeExplorer from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/dataTypes/singleDataTypeExplorer.js';

import SingleConceptGraphDMSchemaOrgEnumerationMembersTable from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/enumerationMembers/enumerationMembersTable.js';
import SingleConceptGraphDMSchemaOrgMakeNewEnumerationMember from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/enumerationMembers/makeNewEnumerationMember.js';
import SingleConceptGraphDMSchemaOrgSingleEnumerationMemberExplorer from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/enumerationMembers/singleEnumerationMemberExplorer.js';

import SingleConceptGraphDMSchemaOrgEnumerationsTable from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/enumerations/enumerationsTable.js';
import SingleConceptGraphDMSchemaOrgMakeNewEnumeration from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/enumerations/makeNewEnumeration.js';
import SingleConceptGraphDMSchemaOrgSingleEnumerationExplorer from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/enumerations/singleEnumerationExplorer.js';

import SingleConceptGraphDMSchemaOrgPropertiesTable from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/properties/propertiesTable.js';
import SingleConceptGraphDMSchemaOrgMakeNewProperty from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/properties/makeNewProperty.js';
import SingleConceptGraphDMSchemaOrgSinglePropertyExplorer from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/properties/singlePropertyExplorer.js';

import SingleConceptGraphDMSchemaOrgTypesTable from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/types/typesTable.js';
import SingleConceptGraphDMSchemaOrgMakeNewType from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/types/makeNewType.js';
import SingleConceptGraphDMSchemaOrgSingleTypeExplorer from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/schemaOrg/types/singleTypeExplorer.js';


import SingleConceptGraphDataModelingContext from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/context/context.js';
import SingleConceptGraphDataModelingContextGraphNav from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/context/graphicalNavigation.js';
import SingleConceptGraphDataModelingContextTextNav from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/context/hierarchicalTextNavigation.js';

import SingleConceptGraphDMContextAllRelationshipsTable from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/context/contextRelationships/allRelationshipsTable.js';
import SingleConceptGraphDMContextMakeNewRelationship from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/context/contextRelationships/makeNewRelationship.js';
import SingleConceptGraphDMContextSingleRelationshipExplorer from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/context/contextRelationships/viewSingleRelationship.js';

import SingleConceptGraphDMContextContextsTable from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/context/contexts/contextsTable.js';
import SingleConceptGraphDMContextMakeNewContext from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/context/contexts/makeNewContext.js';
import SingleConceptGraphDMContextSingleContextExplorer from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/context/contexts/singleContextExplorer.js';

import SingleConceptGraphDataModelingMakeNew from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/makeNewDataModel.js';
import SingleConceptGraphDataModelingJSONLD from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/JSON_LD/jsonLD.js';
import SingleConceptGraphDataModelingJWT from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/JWT/jsonWebTokens.js';
import SingleConceptGraphDataModelingVC from './plex/conceptGraph/conceptGraphs/singleConceptGraph/dataModeling/VerifiableCredentials/verifiableCredentials.js';

import ExplorePropertyGraphs from './plex/conceptGraph/conceptGraphs/singleConceptGraph/explorePropertyGraphs.js';

import ChangeSlug from './plex/conceptGraph/conceptGraphs/singleConceptGraph/changeSlug.js';
import DeleteWord from './plex/conceptGraph/conceptGraphs/singleConceptGraph/deleteWord.js';
import GrandChart from './plex/conceptGraph/conceptGraphs/singleConceptGraph/grandChart.js';
import RestrictsValueManagementExplorer from './plex/conceptGraph/conceptGraphs/restrictsValueManagementExplorer.js';
import EnumerationTreeManagementExplorer from './plex/conceptGraph/conceptGraphs/enumerationTreeManagementExplorer.js';

import AllWordsTable_fast from './plex/conceptGraph/conceptGraphs/singleConceptGraph/allWordsTable_fast.js';
import AllWordsTable_sql from './plex/conceptGraph/conceptGraphs/singleConceptGraph/allWordsTable_sql.js';
import AllWordsValidation from './plex/conceptGraph/conceptGraphs/singleConceptGraph/allWordsValidation.js';
import AllRelationshipsTable from './plex/conceptGraph/conceptGraphs/singleConceptGraph/allRelationshipsTable.js';

import SingleWordGeneralInfo from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleWord/singleWordGeneralInfo.js';

import SingleConceptSingleWordGeneralInfo from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleWord/singleConcept_singleWordGeneralInfo.js';
import SingleConceptSingleSet from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/sets/singleSetGeneralInfo.js';
import SingleConceptSingleSpecificInstance from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/specificInstances/singleSpecificInstanceGeneralInfo.js';
import SingleConceptSingleProperty from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/properties/singlePropertyGeneralInfo.js';
import RestrictPropertyValue from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/properties/restrictPropertyValue.js';

import AllConceptsTable_fast from './plex/conceptGraph/conceptGraphs/singleConceptGraph/allConceptsTable_fast.js';
import AllConceptsTable_sql from './plex/conceptGraph/conceptGraphs/singleConceptGraph/allConceptsTable_sql.js';
import AllConceptsTable_MFS from './plex/conceptGraph/conceptGraphs/singleConceptGraph/allConceptsTable_MFS.js';
import SingleConceptGeneralInfo from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptGeneralInfo.js';
import SingleConceptDetailedInfo from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptDetailedInfo.js';
import SingleConceptHierarchicalOverview from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptHierarchicalOverview.js';
import SingleConceptAllWords from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptAllWords.js';
import SingleConceptSpecialWords from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptSpecialWords.js';
import SingleConceptAllWordsValidation from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptAllWordsValidation.js';
import SingleConceptAllProperties from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptAllProperties.js';
import SingleConceptAllSchemas from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptAllSchemas.js';
import SingleConceptDeleteConcept from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptDeleteConcept.js';
import SingleConceptAllRelationships from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptAllRelationships.js';
import SingleConceptAllSets from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptAllSets.js';
import SingleConceptAllSpecificInstances from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptAllSpecificInstances.js';
import SingleConceptJSONSchemaFormForSpecificInstances from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptJSONSchemaFormForSpecificInstances.js';
import SingleConceptErrorCheck from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptErrorCheck.js';
import SingleConceptInitialization from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/singleConceptInitialization.js';

import SingleConceptSchema from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/specialWords/singleConceptSchema.js';
import SingleConceptJSONSchema from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/specialWords/singleConceptJSONSchema.js';
import SingleConceptPropertySchema from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/specialWords/singleConceptPropertySchema.js';
import SingleConceptConcept from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/specialWords/singleConceptConcept.js';
import SingleConceptWordType from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/specialWords/singleConceptWordType.js';
import SingleConceptSuperset from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/specialWords/singleConceptSuperset.js';
import SingleConceptPrimaryProperty from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/specialWords/singleConceptPrimaryProperty.js';
import SingleConceptProperties from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/specialWords/singleConceptProperties.js';

import MakeNewConcept from './plex/conceptGraph/conceptGraphs/singleConceptGraph/concepts/makeNewConcept.js';
import ExpandWordIntoNewConcept from './plex/conceptGraph/conceptGraphs/singleConceptGraph/concepts/expandWordIntoNewConcept.js';
import MakeNewC2cRel from './plex/conceptGraph/conceptGraphs/singleConceptGraph/c2cRels/makeNewC2cRel.js';

import MakeNewC2cRelBasic from './plex/conceptGraph/conceptGraphs/singleConceptGraph/c2cRels/makeNewC2cRel_basic.js';
import MakeNewC2cRelRestrictValue from './plex/conceptGraph/conceptGraphs/singleConceptGraph/c2cRels/makeNewC2cRel_restrictValue.js';
import MakeNewC2cRelViaEnumeration from './plex/conceptGraph/conceptGraphs/singleConceptGraph/c2cRels/makeNewC2cRel_viaEnumeration.js';

import MakeNewProperty from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/properties/makeNewProperty.js';
import MakeNewSet from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/sets/makeNewSet.js';
import MakeNewSpecificInstance from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/specificInstances/makeNewSpecificInstance.js';
import EstablishPreexistingWordAsSpecificInstance from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/specificInstances/establishPreexistingWordAsSpecificInstance.js';
import EstablishAnotherConceptAsSpecificInstance from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/specificInstances/establishAnotherConceptAsSpecificInstance.js';

import SingleConceptMainSchemaAndPropertyTreeGraph from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/graphViews/singleConceptMainSchemaAndPropertyTreeGraph.js';
import SingleConceptMainSchemaTreeGraph from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/graphViews/singleConceptMainSchemaTreeGraph.js';
import SingleConceptPropertyTreeGraph from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/graphViews/singleConceptPropertyTreeGraph.js';
import SingleConceptSetAndSpecificInstanceTreeGraph from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/graphViews/singleConceptSetAndSpecificInstanceTreeGraph.js';
import SingleConceptSetTreeGraph from './plex/conceptGraph/conceptGraphs/singleConceptGraph/singleConcept/graphViews/singleConceptSetTreeGraph.js';

import AllSchemas from './plex/conceptGraph/conceptGraphs/singleConceptGraph/allWordsOfWordType/allSchemas.js';
import AllConcepts from './plex/conceptGraph/conceptGraphs/singleConceptGraph/allWordsOfWordType/allConcepts.js';

import AllForms from './plex/conceptGraph/conceptGraphs/singleConceptGraph/allForms.js';

import AllC2CRelationshipsTable from './plex/conceptGraph/conceptGraphs/singleConceptGraph/allC2CRelationshipsTable.js';
import AllC2CRelationshipsGraph from './plex/conceptGraph/conceptGraphs/singleConceptGraph/allC2CRelationshipsGraph.js';

import DictionariesMainPage from './plex/conceptGraph/dictionaries/dictionariesMainPage.js';

import RelationshipTypesMainPage from './plex/conceptGraph/relationshipTypes/relationshipTypesMainPage.js';
import MakeNewRelationshipTypePage from './plex/conceptGraph/relationshipTypes/makeNewRelationshipTypePage.js';
import EditExistingRelationshipTypePage from './plex/conceptGraph/relationshipTypes/editExistingRelationshipTypePage.js';

import WordTypesMainPage from './plex/conceptGraph/wordTypes/wordTypesMainPage.js';
import MakeNewWordTypePage from './plex/conceptGraph/wordTypes/makeNewWordTypePage.js';
import EditExistingWordTypePage from './plex/conceptGraph/wordTypes/editExistingWordTypePage.js';

import NeuroCore2SettingsControlPanel from './plex/conceptGraph/settings/neuroCore2/neuroCoreSettingsControlPanel';
import NeuroCore2Overview from './plex/conceptGraph/settings/neuroCore2/neuroCore2Overview';
import NeuroCore2GraphicalOverview from './plex/conceptGraph/settings/neuroCore2/neuroCore2GraphicalOverview';

import NeuroCore2TableForPatternsSingleNode from './plex/conceptGraph/settings/neuroCore2/tableManagement/pattern_singleNode.js';
import NeuroCore2TableForPatternsSingleRelationship from './plex/conceptGraph/settings/neuroCore2/tableManagement/pattern_singleRelationship.js';
import NeuroCore2TableForPatternsDoubleRelationship from './plex/conceptGraph/settings/neuroCore2/tableManagement/pattern_doubleRelationship.js';
import NeuroCore2TableForActionsAll from './plex/conceptGraph/settings/neuroCore2/tableManagement/action_allActions.js';

import NeuroCoreSettingsControlPanel from './plex/conceptGraph/settings/neuroCore/neuroCoreSettingsControlPanel';
import NeuroCoreConfig from './plex/conceptGraph/settings/neuroCore/neuroCoreConfig.js';
import NeuroCoreTableForPatternsSingleNode from './plex/conceptGraph/settings/neuroCore/tableManagement/pattern_singleNode.js';
import NeuroCoreTableForPatternsSingleRelationship from './plex/conceptGraph/settings/neuroCore/tableManagement/pattern_singleRelationship.js';
import NeuroCoreTableForPatternsDoubleRelationship from './plex/conceptGraph/settings/neuroCore/tableManagement/pattern_doubleRelationship.js';
import NeuroCoreTableForActionsUpdateSingleNode from './plex/conceptGraph/settings/neuroCore/tableManagement/action_updateSingleNode.js';

import NeuroCoreMakeNewPatternSingleNode from './plex/conceptGraph/settings/neuroCore/tableManagement/pattern_s1n/makeNew.js';
import NeuroCoreMakeNewPatternSingleRelationship from './plex/conceptGraph/settings/neuroCore/tableManagement/pattern_s1r/makeNew.js';
import NeuroCoreMakeNewPatternDoubleRelationship from './plex/conceptGraph/settings/neuroCore/tableManagement/pattern_s2r/makeNew.js';

import NeuroCoreMakeNewActionUpdateSingleNode from './plex/conceptGraph/settings/neuroCore/tableManagement/action_u1n/makeNew.js';

import NeuroCoreViewEditPatternSingleNode from './plex/conceptGraph/settings/neuroCore/tableManagement/pattern_s1n/viewEdit.js';
import NeuroCoreViewEditPatternSingleRelationship from './plex/conceptGraph/settings/neuroCore/tableManagement/pattern_s1r/viewEdit.js';
import NeuroCoreViewEditPatternDoubleRelationship from './plex/conceptGraph/settings/neuroCore/tableManagement/pattern_s2r/viewEdit.js';
import NeuroCoreViewEditActionUpdateSingleNode from './plex/conceptGraph/settings/neuroCore/tableManagement/action_u1n/viewEdit.js';

import NeuroCore2ViewEditPatternSingleNode from './plex/conceptGraph/settings/neuroCore2/tableManagement/pattern_s1n/viewEdit.js';
import NeuroCore2ViewEditPatternSingleRelationship from './plex/conceptGraph/settings/neuroCore2/tableManagement/pattern_s1r/viewEdit.js';
import NeuroCore2ViewEditPatternDoubleRelationship from './plex/conceptGraph/settings/neuroCore2/tableManagement/pattern_s2r/viewEdit.js';
import NeuroCore2ViewEditActionAll from './plex/conceptGraph/settings/neuroCore2/tableManagement/action_all/viewEdit.js';

import SQLGeneralSettingsPage from './plex/settings/sql/sqlGeneralSettings.js';
import SQLTablesPage from './plex/settings/sql/sqlTables.js';
import SQLMakeANewTablePage from './plex/settings/sql/sqlMakeANewTable.js';
import SQLViewSingleTablePage from './plex/settings/sql/sqlViewSingleTable.js';

import IPFSConfigInfoPage from './plex/settings/IPFS/IPFSConfigInfo.js';
import IPFSGeneralInfoPage from './plex/settings/IPFS/IPFSGeneralInfo.js';
import IPFSPeersInfoPage from './plex/settings/IPFS/IPFSPeersInfo.js';
import IPFSPubsubInfoPage from './plex/settings/IPFS/IPFSPubsubInfo.js';
import IPFSPinsInfoPage from './plex/settings/IPFS/IPFSPinsInfo.js';
import IPFSKeysInfoPage from './plex/settings/IPFS/IPFSKeysInfo.js';

import IPFSMutableFilesInfoPage1 from './plex/settings/IPFS/IPFSMutableFilesInfo1.js';
import IPFSMutableFilesInfoPage2 from './plex/settings/IPFS/IPFSMutableFilesInfo2.js';
import IPFSMutableFilesInfoPage3 from './plex/settings/IPFS/IPFSMutableFilesInfo3.js';

import NeuroCoreTopPanel from './plex/neuroCore/neuroCoreTopPanel.js'
import NeuroCore2TopPanel from './plex/neuroCore2/neuroCoreTopPanel.js'
import NeuroCore3TopPanel from './plex/neuroCore3/neuroCoreTopPanel.js'

window.testVariable = "Alice";
window.plexTimerCount = 0;

// <Route path="/" exact component={App} />
// <Route path="/" exact component={ConceptGraphHome} />
// 27 July 2022: removing <NeuroCoreTopPanel />

ReactDOM.render(
  <React.StrictMode>
     <BrowserRouter>
        <NeuroCore2TopPanel />
        <NeuroCore3TopPanel />
        <div className="App" style={{height:"100%"}} >

          <Route path="/" exact component={PlexHome} />
          <Route path="/PlexHome" exact component={PlexHome} />
          <Route path="/OldPGAHome" exact component={App} />
          <Route path="/ConceptGraphHome" exact component={ConceptGraphHome} />

          <Route path="/ConceptGraphFrontEndHome" exact component={ConceptGraphFrontEndHome} />
          <Route path="/ConceptGraphsFrontEndMainPage" exact component={ConceptGraphsFrontEndMainPage} />
          <Route path="/ConceptGraphsFrontEndManageDirectory" exact component={ConceptGraphsFrontEndManageDirectory} />
          <Route path="/ConceptGraphsFrontEndMakeNewConceptGraph" exact component={ConceptGraphsFrontEndMakeNewConceptGraph} />
          <Route path="/ConceptGraphsFrontEndTable" exact component={ConceptGraphsFrontEndTable} />
          <Route path="/ConceptGraphsFrontEndSingleConceptGraphMainPage/:ipnsForMainSchemaForConceptGraph" exact component={ConceptGraphsFrontEndSingleConceptGraphMainPage} />
          <Route path="/ConceptGraphsFrontEndSingleConceptGraphDetailedInfo/:ipnsForMainSchemaForConceptGraph" exact component={ConceptGraphsFrontEndSingleConceptGraphDetailedInfo} />

          <Route path="/PlexSettingsMainPage" exact component={PlexSettingsMainPage} />

          <Route path="/DecentralizedProofOfPersonhoodHome" exact component={DecentralizedProofOfPersonhoodHome} />
          <Route path="/CrowdscreenedGroupsHome" exact component={CrowdscreenedGroupsHome} />

          <Route path="/GrapevineHome" exact component={GrapevineHome} />
          <Route path="/GrapevineSettingsMainPage" exact component={GrapevineSettingsMainPage} />
          <Route path="/GrapevineSettingsRatingsLocationsInMutableFileSystem" exact component={GrapevineSettingsRatingsLocationsInMutableFileSystem} />

          <Route path="/GrapevineContactsMainPage" exact component={GrapevineContactsMainPage} />
          <Route path="/GrapevineChatroomMainPage" exact component={GrapevineChatroomMainPage} />
          <Route path="/GrapevineVisualizationMainPage" exact component={GrapevineVisualizationMainPage} />
          <Route path="/GrapevineInfluenceAndTrustScoresMainPage" exact component={GrapevineInfluenceAndTrustScoresMainPage} />

          <Route path="/GrapevineRatingsMainPage" exact component={GrapevineRatingsMainPage} />
          <Route path="/GrapevineRatingsMainPage" exact component={GrapevineRatingsMainPage} />

          <Route path="/ShowAllRatings" exact component={ShowAllRatings} />

          <Route path="/GrapevineContextMainPage" exact component={GrapevineContextMainPage} />

          <Route path="/SingleUserProfilePage/:cid" exact component={SingleUserProfilePage} />
          <Route path="/SingleUserLeaveRating1/:cid" exact component={SingleUserLeaveRating1} />
          <Route path="/SingleUserLeaveRating2/:cid" exact component={SingleUserLeaveRating2} />

          <Route path="/DecentralizedOntologiesHome" exact component={DecentralizedOntologiesHome} />
          <Route path="/DecentralizedRedditHome" exact component={DecentralizedRedditHome} />
          <Route path="/DecentralizedTwitterHome" exact component={DecentralizedTwitterHome} />
          <Route path="/DecentralizedSearchHome" exact component={DecentralizedSearchHome} />
          <Route path="/DecentralizedQuestionsAndAnswersHome" exact component={DecentralizedQuestionsAndAnswersHome} />


          <Route path="/EBooksHome" exact component={EBooksHome} />
          <Route path="/EBook1Home" exact component={EBook1Home} />

          <Route path="/NeuroCore2SettingsControlPanel" exact component={NeuroCore2SettingsControlPanel} />
          <Route path="/NeuroCore2Overview" exact component={NeuroCore2Overview} />
          <Route path="/NeuroCore2GraphicalOverview" exact component={NeuroCore2GraphicalOverview} />

          <Route path="/NeuroCoreSettingsControlPanel" exact component={NeuroCoreSettingsControlPanel} />
          <Route path="/NeuroCoreConfig" exact component={NeuroCoreConfig} />

          <Route path="/ConceptGraphSettingsMainPage" exact component={ConceptGraphSettingsMainPage} />
          <Route path="/ProfileMainPage" exact component={ProfileMainPage} />
          <Route path="/PlexAppsNavPage" exact component={PlexAppsNavPage} />
          <Route path="/HelloWorldMainPage" exact component={HelloWorldMainPage} />
          <Route path="/HelloWorldNoUiSlider" exact component={HelloWorldNoUiSlider} />
          <Route path="/HelloWorldMarkdown" exact component={HelloWorldMarkdown} />
          <Route path="/HelloWorldVisJS" exact component={HelloWorldVisJS} />
          <Route path="/HelloWorldGoogleCharts" exact component={HelloWorldGoogleCharts} />
          <Route path="/HelloWorldVictory" exact component={HelloWorldVictory} />
          <Route path="/HelloWorldP5" exact component={HelloWorldP5} />
          <Route path="/HelloWorldC2" exact component={HelloWorldC2} />
          <Route path="/HelloWorldAsyncChain" exact component={HelloWorldAsyncChain} />
          <Route path="/HelloWorldChildToParent" exact component={HelloWorldChildToParent} />
          <Route path="/HelloWorldDataTables" exact component={HelloWorldDataTables} />
          <Route path="/HelloWorldJSONSchemaForm" exact component={HelloWorldJSONSchemaForm} />
          <Route path="/HelloWorldJSONSchemaFormTester" exact component={HelloWorldJSONSchemaFormTester} />
          <Route path="/HelloWorldJSONSchemaFormRender" exact component={HelloWorldJSONSchemaFormRender} />
          <Route path="/HelloWorldJSONSchemaFormV5" exact component={HelloWorldJSONSchemaFormV5} />
          <Route path="/HelloWorldWriteFile" exact component={HelloWorldWriteFile} />
          <Route path="/HelloWorldReadFile" exact component={HelloWorldReadFile} />
          <Route path="/HelloWorldUploadImageToIPFS" exact component={HelloWorldUploadImageToIPFS} />

          <Route path="/ConceptGraphsFrontEnd_WordsMainPage/:ipnsForMainSchemaForConceptGraph" exact component={ConceptGraphsFrontEnd_WordsMainPage} />

          <Route path="/ConceptGraphsFrontEnd_TableOfWords/:ipnsForMainSchemaForConceptGraph" exact component={ConceptGraphsFrontEnd_TableOfWords} />
          <Route path="/ConceptGraphsFrontEnd_SingleWordMainPage/:wordslug" exact component={ConceptGraphsFrontEnd_SingleWordMainPage} />

          <Route path="/ConceptGraphsFrontEnd_ConceptsMainPage/:ipnsForMainSchemaForConceptGraph" exact component={ConceptGraphsFrontEnd_ConceptsMainPage} />
          <Route path="/ConceptGraphsFrontEnd_ManageDownload" exact component={ConceptGraphsFrontEnd_ManageDownload} />
          <Route path="/ConceptGraphsFrontEnd_ManageMainConceptGraphSchema" exact component={ConceptGraphsFrontEnd_ManageMainConceptGraphSchema} />
          <Route path="/ConceptGraphsFrontEnd_DownloadConceptGraphFromExternalSource" exact component={ConceptGraphsFrontEnd_DownloadConceptGraphFromExternalSource} />
          <Route path="/ConceptGraphsFrontEnd_UpdateIPNSs" exact component={ConceptGraphsFrontEnd_UpdateIPNSs} />

          <Route path="/ConceptGraphsFrontEnd_TableOfConcepts/:ipnsForMainSchemaForConceptGraph" exact component={ConceptGraphsFrontEnd_TableOfConcepts} />
          <Route path="/ConceptGraphsFrontEnd_SingleConceptMainPage/:conceptslug" exact component={ConceptGraphsFrontEnd_SingleConceptMainPage} />
          <Route path="/ConceptGraphsFrontEnd_MakeNewConcept/:conceptslug" exact component={ConceptGraphsFrontEnd_MakeNewConcept} />

          <Route path="/ConceptGraphsFrontEndSingleConceptGraphUpdateProposals/:conceptslug" exact component={ConceptGraphsFrontEndSingleConceptGraphUpdateProposals} />
          <Route path="/ConceptGraphsFrontEndSingleConceptGraphListsOfUpdateProposals/:conceptslug" exact component={ConceptGraphsFrontEndSingleConceptGraphListsOfUpdateProposals} />
          <Route path="/ConceptGraphsFrontEndSingleConceptGraphAllKnownUpdateProposals/:conceptslug" exact component={ConceptGraphsFrontEndSingleConceptGraphAllKnownUpdateProposals} />
          <Route path="/ConceptGraphsFrontEndExternalUpdateProposals/:conceptslug" exact component={ConceptGraphsFrontEndExternalUpdateProposals} />
          <Route path="/ConceptGraphsFrontEndSingleConceptGraphSingleUpdateProposalMainPage/:updateproposalslug" exact component={ConceptGraphsFrontEndSingleConceptGraphSingleUpdateProposalMainPage} />
          <Route path="/ConceptGraphsFrontEndSingleConceptGraphUpdateProposalsVisualizationMainPage/:conceptslug" exact component={ConceptGraphsFrontEndSingleConceptGraphUpdateProposalsVisualizationMainPage} />
          <Route path="/ConceptGraphsFrontEndVisualizeScoreCalculationsOfUpdateProposals/:conceptslug" exact component={ConceptGraphsFrontEndVisualizeScoreCalculationsOfUpdateProposals} />

          <Route path="/ConceptGraphsFrontEndSingleConceptGraphManualImportsMainPage/:conceptslug" exact component={ConceptGraphsFrontEndSingleConceptGraphManualImportsMainPage} />
          <Route path="/ConceptGraphsFrontEndSingleConceptGraphManualImportsSingleWordByIpns/:conceptslug" exact component={ConceptGraphsFrontEndSingleConceptGraphManualImportsSingleWordByIpns} />
          <Route path="/ConceptGraphsFrontEndSingleConceptGraphManualImportsLinkedConceptGraph/:conceptslug" exact component={ConceptGraphsFrontEndSingleConceptGraphManualImportsLinkedConceptGraph} />

          <Route path="/ConceptGraphsFrontEndSingleSet/:conceptslug" exact component={ConceptGraphsFrontEndSingleSet} />
          <Route path="/ConceptGraphsFrontEndMakeNewSet/:conceptslug" exact component={ConceptGraphsFrontEndMakeNewSet} />
          <Route path="/ConceptGraphsFrontEndSetsMainPage/:conceptslug" exact component={ConceptGraphsFrontEndSetsMainPage} />

          <Route path="/ConceptGraphsFrontEndSingleSpecificInstance/:conceptslug" exact component={ConceptGraphsFrontEndSingleSpecificInstance} />
          <Route path="/ConceptGraphsFrontEndMakeNewSpecificInstance/:conceptslug" exact component={ConceptGraphsFrontEndMakeNewSpecificInstance} />
          <Route path="/ConceptGraphsFrontEndSpecificInstancesMainPage/:conceptslug" exact component={ConceptGraphsFrontEndSpecificInstancesMainPage} />
          <Route path="/ConceptGraphsFrontEndSpecificInstanceDigestsMainPage/:conceptslug" exact component={ConceptGraphsFrontEndSpecificInstanceDigestsMainPage} />
          <Route path="/ConceptGraphsFrontEndManageSpecificInstanceDigestFileTypes/:conceptslug" exact component={ConceptGraphsFrontEndManageSpecificInstanceDigestFileTypes} />

          <Route path="/ConceptGraphsFrontEndSingleConceptUpdatesMainPage/:conceptslug" exact component={ConceptGraphsFrontEndSingleConceptUpdatesMainPage} />
          <Route path="/ConceptGraphsFrontEndSingleConceptUpdatesListOfSynonyms/:conceptslug" exact component={ConceptGraphsFrontEndSingleConceptUpdatesListOfSynonyms} />
          <Route path="/ConceptGraphsFrontEndSingleConceptUpdatesListsOfUpdates/:conceptslug" exact component={ConceptGraphsFrontEndSingleConceptUpdatesListsOfUpdates} />
          <Route path="/ConceptGraphsFrontEndSingleConceptUpdatesControlPanel/:conceptslug" exact component={ConceptGraphsFrontEndSingleConceptUpdatesControlPanel} />

          <Route path="/ConceptGraphsFrontEndSingleConceptUpdatesMakeNewConceptUpdate/:conceptslug" exact component={ConceptGraphsFrontEndSingleConceptUpdatesMakeNewConceptUpdate} />
          <Route path="/ConceptGraphsFrontEndSingleConceptUpdatesMakeNewMainSchemaUpdate/:conceptslug" exact component={ConceptGraphsFrontEndSingleConceptUpdatesMakeNewMainSchemaUpdate} />
          <Route path="/ConceptGraphsFrontEndSingleConceptUpdatesMakeNewPropertySchemaUpdate/:conceptslug" exact component={ConceptGraphsFrontEndSingleConceptUpdatesMakeNewPropertySchemaUpdate} />

          <Route path="/ConceptGraphsMainPage" exact component={ConceptGraphsMainPage} />
          <Route path="/EditExistingConceptGraphPage/:conceptgraphsqlid" exact component={EditExistingConceptGraphPage} />
          <Route path="/SingleConceptGraphDetailedInfo/:conceptgraphsqlid" exact component={SingleConceptGraphDetailedInfo} />
          <Route path="/SingleConceptGraphErrorCheck/:conceptgraphsqlid" exact component={SingleConceptGraphErrorCheck} />
          <Route path="/SingleConceptGraphCompactExport/:conceptgraphsqlid" exact component={SingleConceptGraphCompactExport} />
          <Route path="/SingleConceptGraphImport/:conceptgraphsqlid" exact component={SingleConceptGraphImport} />
          <Route path="/SingleConceptGraphTemplating/:conceptgraphsqlid" exact component={SingleConceptGraphTemplating} />
          <Route path="/MakeNewConceptGraphPage" exact component={MakeNewConceptGraphPage} />
          <Route path="/ConceptGraphsImportsExportsPage" exact component={ConceptGraphsImportsExportsPage} />
          <Route path="/ConceptGraphsCompactFilesTable" exact component={ConceptGraphsCompactFilesTable} />
          <Route path="/ConceptGraphOverviewMainPage" exact component={ConceptGraphOverviewMainPage} />
          <Route path="/ConceptGraphOverviewReactOnlyMainPage" exact component={ConceptGraphOverviewReactOnlyMainPage} />

          <Route path="/SingleConceptGraphPinToIPFS" exact component={SingleConceptGraphPinToIPFS} />
          <Route path="/SingleConceptGraphWriteToMFS" exact component={SingleConceptGraphWriteToMFS} />

          <Route path="/SingleConceptGraphDataModeling/:conceptgraphsqlid" exact component={SingleConceptGraphDataModeling} />

          <Route path="/SingleConceptGraphDataModelingSchemaOrg/:conceptgraphsqlid" exact component={SingleConceptGraphDataModelingSchemaOrg} />
          <Route path="/SingleConceptGraphDataModelingSchemaOrgExtensions/:conceptgraphsqlid" exact component={SingleConceptGraphDataModelingSchemaOrgExtensions} />
          <Route path="/SingleConceptGraphDataModelingSchemaOrgGraphNav/:conceptgraphsqlid" exact component={SingleConceptGraphDataModelingSchemaOrgGraphNav} />
          <Route path="/SingleConceptGraphDataModelingSchemaOrgTextNav/:conceptgraphsqlid" exact component={SingleConceptGraphDataModelingSchemaOrgTextNav} />

          <Route path="/SingleConceptGraphDataModelingConceptGraph/:conceptgraphsqlid" exact component={SingleConceptGraphDataModelingConceptGraph} />
          <Route path="/SingleConceptGraphDataModelingConceptGraphGraphNav/:conceptgraphsqlid" exact component={SingleConceptGraphDataModelingConceptGraphGraphNav} />
          <Route path="/SingleConceptGraphDataModelingConceptGraphTextNav/:conceptgraphsqlid" exact component={SingleConceptGraphDataModelingConceptGraphTextNav} />

          <Route path="/SingleConceptGraphDMSchemaOrgAllRelationshipsTable/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgAllRelationshipsTable} />
          <Route path="/SingleConceptGraphDMSchemaOrgMakeNewRelationship/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgMakeNewRelationship} />
          <Route path="/SingleConceptGraphDMSchemaOrgSingleRelationshipExplorer/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgSingleRelationshipExplorer} />

          <Route path="/SingleConceptGraphDMSchemaOrgDataTypesTable/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgDataTypesTable} />
          <Route path="/SingleConceptGraphDMSchemaOrgMakeNewDataType/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgMakeNewDataType} />
          <Route path="/SingleConceptGraphDMSchemaOrgSingleDataTypeExplorer/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgSingleDataTypeExplorer} />

          <Route path="/SingleConceptGraphDMSchemaOrgEnumerationMembersTable/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgEnumerationMembersTable} />
          <Route path="/SingleConceptGraphDMSchemaOrgMakeNewEnumerationMember/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgMakeNewEnumerationMember} />
          <Route path="/SingleConceptGraphDMSchemaOrgSingleEnumerationMemberExplorer/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgSingleEnumerationMemberExplorer} />

          <Route path="/SingleConceptGraphDMSchemaOrgEnumerationsTable/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgEnumerationsTable} />
          <Route path="/SingleConceptGraphDMSchemaOrgMakeNewEnumeration/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgMakeNewEnumeration} />
          <Route path="/SingleConceptGraphDMSchemaOrgSingleEnumerationExplorer/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgSingleEnumerationExplorer} />

          <Route path="/SingleConceptGraphDMSchemaOrgPropertiesTable/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgPropertiesTable} />
          <Route path="/SingleConceptGraphDMSchemaOrgMakeNewProperty/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgMakeNewProperty} />
          <Route path="/SingleConceptGraphDMSchemaOrgSinglePropertyExplorer/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgSinglePropertyExplorer} />

          <Route path="/SingleConceptGraphDMSchemaOrgTypesTable/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgTypesTable} />
          <Route path="/SingleConceptGraphDMSchemaOrgMakeNewType/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgMakeNewType} />
          <Route path="/SingleConceptGraphDMSchemaOrgSingleTypeExplorer/:conceptgraphsqlid" exact component={SingleConceptGraphDMSchemaOrgSingleTypeExplorer} />

          <Route path="/SingleConceptGraphDataModelingContext/:conceptgraphsqlid" exact component={SingleConceptGraphDataModelingContext} />
          <Route path="/SingleConceptGraphDataModelingContextGraphNav/:conceptgraphsqlid" exact component={SingleConceptGraphDataModelingContextGraphNav} />
          <Route path="/SingleConceptGraphDataModelingContextTextNav/:conceptgraphsqlid" exact component={SingleConceptGraphDataModelingContextTextNav} />

          <Route path="/SingleConceptGraphDMContextAllRelationshipsTable/:conceptgraphsqlid" exact component={SingleConceptGraphDMContextAllRelationshipsTable} />
          <Route path="/SingleConceptGraphDMContextMakeNewRelationship/:conceptgraphsqlid" exact component={SingleConceptGraphDMContextMakeNewRelationship} />
          <Route path="/SingleConceptGraphDMContextSingleRelationshipExplorer/:conceptgraphsqlid" exact component={SingleConceptGraphDMContextSingleRelationshipExplorer} />

          <Route path="/SingleConceptGraphDMContextContextsTable/:conceptgraphsqlid" exact component={SingleConceptGraphDMContextContextsTable} />
          <Route path="/SingleConceptGraphDMContextMakeNewContext/:conceptgraphsqlid" exact component={SingleConceptGraphDMContextMakeNewContext} />
          <Route path="/SingleConceptGraphDMContextSingleContextExplorer/:conceptgraphsqlid" exact component={SingleConceptGraphDMContextSingleContextExplorer} />

          <Route path="/SingleConceptGraphDataModelingMakeNew/:conceptgraphsqlid" exact component={SingleConceptGraphDataModelingMakeNew} />
          <Route path="/SingleConceptGraphDataModelingJSONLD/:conceptgraphsqlid" exact component={SingleConceptGraphDataModelingJSONLD} />
          <Route path="/SingleConceptGraphDataModelingJWT/:conceptgraphsqlid" exact component={SingleConceptGraphDataModelingJWT} />
          <Route path="/SingleConceptGraphDataModelingVC/:conceptgraphsqlid" exact component={SingleConceptGraphDataModelingVC} />

          <Route path="/AllWordsTable_fast" exact component={AllWordsTable_fast} />
          <Route path="/AllWordsTable_sql" exact component={AllWordsTable_sql} />
          <Route path="/AllWordsValidation" exact component={AllWordsValidation} />
          <Route path="/SingleWordGeneralInfo/:wordsqlid" exact component={SingleWordGeneralInfo} />
          <Route path="/AllRelationshipsTable" exact component={AllRelationshipsTable} />

          <Route path="/ExplorePropertyGraphs" exact component={ExplorePropertyGraphs} />

          <Route path="/DeleteWord" exact component={DeleteWord} />
          <Route path="/ChangeSlug" exact component={ChangeSlug} />
          <Route path="/GrandChart" exact component={GrandChart} />
          <Route path="/RestrictsValueManagementExplorer" exact component={RestrictsValueManagementExplorer} />
          <Route path="/EnumerationTreeManagementExplorer" exact component={EnumerationTreeManagementExplorer} />

          <Route path="/AllConceptsTable_fast" exact component={AllConceptsTable_fast} />
          <Route path="/AllConceptsTable_sql" exact component={AllConceptsTable_sql} />
          <Route path="/AllConceptsTable_MFS" exact component={AllConceptsTable_MFS} />
          <Route path="/SingleConceptGeneralInfo/:conceptsqlid" exact component={SingleConceptGeneralInfo} />
          <Route path="/SingleConceptDetailedInfo/:conceptsqlid" exact component={SingleConceptDetailedInfo} />
          <Route path="/SingleConceptHierarchicalOverview/:conceptsqlid" exact component={SingleConceptHierarchicalOverview} />
          <Route path="/SingleConceptAllWords/:conceptsqlid" exact component={SingleConceptAllWords} />
          <Route path="/SingleConceptSpecialWords/:conceptsqlid" exact component={SingleConceptSpecialWords} />
          <Route path="/SingleConceptAllWordsValidation/:conceptsqlid" exact component={SingleConceptAllWordsValidation} />
          <Route path="/SingleConceptAllProperties/:conceptsqlid" exact component={SingleConceptAllProperties} />
          <Route path="/SingleConceptAllSchemas/:conceptsqlid" exact component={SingleConceptAllSchemas} />
          <Route path="/SingleConceptDeleteConcept/:conceptsqlid" exact component={SingleConceptDeleteConcept} />
          <Route path="/SingleConceptAllRelationships/:conceptsqlid" exact component={SingleConceptAllRelationships} />
          <Route path="/SingleConceptAllSets/:conceptsqlid" exact component={SingleConceptAllSets} />
          <Route path="/SingleConceptAllSpecificInstances/:conceptsqlid" exact component={SingleConceptAllSpecificInstances} />
          <Route path="/SingleConceptJSONSchemaFormForSpecificInstances/:conceptsqlid" exact component={SingleConceptJSONSchemaFormForSpecificInstances} />
          <Route path="/SingleConceptErrorCheck/:conceptsqlid" exact component={SingleConceptErrorCheck} />
          <Route path="/SingleConceptInitialization/:conceptsqlid" exact component={SingleConceptInitialization} />

          <Route path="/SingleConceptSchema/:conceptsqlid" exact component={SingleConceptSchema} />
          <Route path="/SingleConceptJSONSchema/:conceptsqlid" exact component={SingleConceptJSONSchema} />
          <Route path="/SingleConceptPropertySchema/:conceptsqlid" exact component={SingleConceptPropertySchema} />
          <Route path="/SingleConceptConcept/:conceptsqlid" exact component={SingleConceptConcept} />
          <Route path="/SingleConceptWordType/:conceptsqlid" exact component={SingleConceptWordType} />
          <Route path="/SingleConceptSuperset/:conceptsqlid" exact component={SingleConceptSuperset} />
          <Route path="/SingleConceptPrimaryProperty/:conceptsqlid" exact component={SingleConceptPrimaryProperty} />
          <Route path="/SingleConceptProperties/:conceptsqlid" exact component={SingleConceptProperties} />

          <Route path="/MakeNewProperty/:conceptsqlid" exact component={MakeNewProperty} />
          <Route path="/MakeNewSet/:conceptsqlid" exact component={MakeNewSet} />
          <Route path="/MakeNewSpecificInstance/:conceptsqlid" exact component={MakeNewSpecificInstance} />
          <Route path="/EstablishAnotherConceptAsSpecificInstance/:conceptsqlid" exact component={EstablishAnotherConceptAsSpecificInstance} />
          <Route path="/EstablishPreexistingWordAsSpecificInstance/:conceptsqlid" exact component={EstablishPreexistingWordAsSpecificInstance} />

          <Route path="/MakeNewConcept/:conceptsqlid" exact component={MakeNewConcept} />
          <Route path="/ExpandWordIntoNewConcept/:conceptsqlid" exact component={ExpandWordIntoNewConcept} />
          <Route path="/MakeNewC2cRel/:conceptsqlid" exact component={MakeNewC2cRel} />
          <Route path="/MakeNewC2cRelBasic/:conceptsqlid" exact component={MakeNewC2cRelBasic} />
          <Route path="/MakeNewC2cRelRestrictValue/:conceptsqlid" exact component={MakeNewC2cRelRestrictValue} />
          <Route path="/MakeNewC2cRelViaEnumeration/:conceptsqlid" exact component={MakeNewC2cRelViaEnumeration} />

          <Route path="/SingleConceptSingleWordGeneralInfo/:wordsqlid" exact component={SingleConceptSingleWordGeneralInfo} />
          <Route path="/SingleConceptSingleSet/:slug" exact component={SingleConceptSingleSet} />
          <Route path="/SingleConceptSingleSpecificInstance/:slug" exact component={SingleConceptSingleSpecificInstance} />
          <Route path="/SingleConceptSingleProperty/:slug" exact component={SingleConceptSingleProperty} />
          <Route path="/RestrictPropertyValue/:slug" exact component={RestrictPropertyValue} />

          <Route path="/SingleConceptMainSchemaAndPropertyTreeGraph/:conceptsqlid" exact component={SingleConceptMainSchemaAndPropertyTreeGraph} />
          <Route path="/SingleConceptMainSchemaTreeGraph/:conceptsqlid" exact component={SingleConceptMainSchemaTreeGraph} />
          <Route path="/SingleConceptPropertyTreeGraph/:conceptsqlid" exact component={SingleConceptPropertyTreeGraph} />
          <Route path="/SingleConceptSetAndSpecificInstanceTreeGraph/:conceptsqlid" exact component={SingleConceptSetAndSpecificInstanceTreeGraph} />
          <Route path="/SingleConceptSetTreeGraph/:conceptsqlid" exact component={SingleConceptSetTreeGraph} />

          <Route path="/AllSchemas" exact component={AllSchemas} />
          <Route path="/AllConcepts" exact component={AllConcepts} />

          <Route path="/AllForms" exact component={AllForms} />

          <Route path="/AllC2CRelationshipsTable" exact component={AllC2CRelationshipsTable} />
          <Route path="/AllC2CRelationshipsGraph" exact component={AllC2CRelationshipsGraph} />

          <Route path="/DictionariesMainPage" exact component={DictionariesMainPage} />

          <Route path="/RelationshipTypesMainPage" exact component={RelationshipTypesMainPage} />
          <Route path="/MakeNewRelationshipTypePage" exact component={MakeNewRelationshipTypePage} />
          <Route path="/EditExistingRelationshipTypePage/:relationshiptypesqlid" exact component={EditExistingRelationshipTypePage} />

          <Route path="/WordTypesMainPage" exact component={WordTypesMainPage} />
          <Route path="/MakeNewWordTypePage" exact component={MakeNewWordTypePage} />
          <Route path="/EditExistingWordTypePage/:wordtypesqlid" exact component={EditExistingWordTypePage} />

          <Route path="/NeuroCore2TableForPatternsSingleNode" exact component={NeuroCore2TableForPatternsSingleNode} />
          <Route path="/NeuroCore2TableForPatternsSingleRelationship" exact component={NeuroCore2TableForPatternsSingleRelationship} />
          <Route path="/NeuroCore2TableForPatternsDoubleRelationship" exact component={NeuroCore2TableForPatternsDoubleRelationship} />
          <Route path="/NeuroCore2TableForActionsAll" exact component={NeuroCore2TableForActionsAll} />

          <Route path="/NeuroCoreTableForPatternsSingleNode" exact component={NeuroCoreTableForPatternsSingleNode} />
          <Route path="/NeuroCoreTableForPatternsSingleRelationship" exact component={NeuroCoreTableForPatternsSingleRelationship} />
          <Route path="/NeuroCoreTableForPatternsDoubleRelationship" exact component={NeuroCoreTableForPatternsDoubleRelationship} />
          <Route path="/NeuroCoreTableForActionsUpdateSingleNode" exact component={NeuroCoreTableForActionsUpdateSingleNode} />

          <Route path="/NeuroCoreMakeNewPatternSingleNode" exact component={NeuroCoreMakeNewPatternSingleNode} />
          <Route path="/NeuroCoreMakeNewPatternSingleRelationship" exact component={NeuroCoreMakeNewPatternSingleRelationship} />
          <Route path="/NeuroCoreMakeNewPatternDoubleRelationship" exact component={NeuroCoreMakeNewPatternDoubleRelationship} />

          <Route path="/NeuroCoreMakeNewActionUpdateSingleNode" exact component={NeuroCoreMakeNewActionUpdateSingleNode} />

          <Route path="/NeuroCoreViewEditPatternSingleNode/:patternsqlid" exact component={NeuroCoreViewEditPatternSingleNode} />
          <Route path="/NeuroCoreViewEditPatternSingleRelationship/:patternsqlid" exact component={NeuroCoreViewEditPatternSingleRelationship} />
          <Route path="/NeuroCoreViewEditPatternDoubleRelationship/:patternsqlid" exact component={NeuroCoreViewEditPatternDoubleRelationship} />
          <Route path="/NeuroCoreViewEditActionUpdateSingleNode/:actionsqlid" exact component={NeuroCoreViewEditActionUpdateSingleNode} />

          <Route path="/NeuroCore2ViewEditPatternSingleNode/:patternsqlid" exact component={NeuroCore2ViewEditPatternSingleNode} />
          <Route path="/NeuroCore2ViewEditPatternSingleRelationship/:patternsqlid" exact component={NeuroCore2ViewEditPatternSingleRelationship} />
          <Route path="/NeuroCore2ViewEditPatternDoubleRelationship/:patternsqlid" exact component={NeuroCore2ViewEditPatternDoubleRelationship} />
          <Route path="/NeuroCore2ViewEditActionAll/:actionsqlid" exact component={NeuroCore2ViewEditActionAll} />

          <Route path="/SQLGeneralSettingsPage" exact component={SQLGeneralSettingsPage} />
          <Route path="/SQLTablesPage" exact component={SQLTablesPage} />
          <Route path="/SQLMakeANewTablePage" exact component={SQLMakeANewTablePage} />
          <Route path="/SQLViewSingleTablePage/:tablename" exact component={SQLViewSingleTablePage} />

          <Route path="/IPFSConfigInfoPage" exact component={IPFSConfigInfoPage} />
          <Route path="/IPFSGeneralInfoPage" exact component={IPFSGeneralInfoPage} />
          <Route path="/IPFSPeersInfoPage" exact component={IPFSPeersInfoPage} />
          <Route path="/IPFSPubsubInfoPage" exact component={IPFSPubsubInfoPage} />
          <Route path="/IPFSPinsInfoPage" exact component={IPFSPinsInfoPage} />
          <Route path="/IPFSKeysInfoPage" exact component={IPFSKeysInfoPage} />

          <Route path="/IPFSMutableFilesInfoPage1" exact component={IPFSMutableFilesInfoPage1} />
          <Route path="/IPFSMutableFilesInfoPage2" exact component={IPFSMutableFilesInfoPage2} />
          <Route path="/IPFSMutableFilesInfoPage3" exact component={IPFSMutableFilesInfoPage3} />

          <Route path="/ReactJSONSchemaForm" exact component={ReactJSONSchemaForm} />
          <Route path="/ReactJSONSchemaForm2" exact component={ReactJSONSchemaForm2} />
          <Route path="/MyConceptGraphs" exact component={MyConceptGraphs} />
          <Route path="/ViewMyConceptGraph/:tablename" exact component={ViewMyConceptGraph} />
          <Route path="/UpdataGlobalDynamicData" exact component={UpdataGlobalDynamicData} />
          <Route path="/C2CRelsMaintenance" exact component={C2CRelsMaintenance} />
          <Route path="/UpdatePropertyData" exact component={UpdatePropertyData} />
          <Route path="/ConceptGraphMaintenance" exact component={ConceptGraphMaintenance} />
          <Route path="/SpecificInstancesMaintenance" exact component={SpecificInstancesMaintenance} />
          <Route path="/ConceptsMaintenance" exact component={ConceptsMaintenance} />
          <Route path="/MaintenanceOfXYZ" exact component={MaintenanceOfXYZ} />
          <Route path="/ResetMiscValues" exact component={ResetMiscValues} />
          <Route path="/MaintenanceOfSchemas" exact component={MaintenanceOfSchemas} />
          <Route path="/MaintenanceControlPanel" exact component={MaintenanceControlPanel} />
          <Route path="/MaintenanceOfPropertySchemas" exact component={MaintenanceOfPropertySchemas} />
          <Route path="/PropertyModuleMaintenance" exact component={PropertyModuleMaintenance} />
          <Route path="/MyDictionaries" exact component={MyDictionaries} />
          <Route path="/ViewMyDictionary/:tablename" exact component={ViewMyDictionary} />
          <Route path="/BuildConceptFamily" exact component={BuildConceptFamily} />
          <Route path="/Sqlite3DbManagement" exact component={Sqlite3DbManagement} />
          <Route path="/WordTemplatesByWordType" exact component={WordTemplatesByWordType} />
          <Route path="/About" exact component={About} />
          <Route path="/Profile" exact component={Profile} />
          <Route path="/HelloWorldPages" exact component={HelloWorldPages} />
          <Route path="/MaintenancePages" exact component={MaintenancePages} />
        </div>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
if (!window.initDOMFunctionsComplete) {
    InitDOMFunctions.loadSqlToDOM()
}
