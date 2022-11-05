
// import { ipcRenderer, contextBridge } from 'electron';


var preloadVar = 5;

window.hasIpfsMfsBeenInitialized = false;

window.oTestVariable = {};
window.oTestVariable.foo = "bar";
console.log("PRELOAD HERE; window.oTestVariable.foo = "+window.oTestVariable.foo);

window.initDOMFunctionsComplete = false;
window.mustReload_lookupWordBySlug = false;

var oTestVar = {};
oTestVar.foo = "bar";

// DELAYS: inelegant hack to get around the fact that I cannot have multiple SQL queries happening at the same time
// therfore at startup, I put several of them on delays so they don't collide
/*
// like this:
setTimeout( async function(){
    jQuery("#createConceptGraphSelectorButton").trigger("click");
},window.delays.neoroCoreConceptGraphSelectorDelay);
*/
window.delays = {};
// plex/neuroCore/neuroCoreMonitoringPanel.js
window.delays.reloadTableS1n = 100;
window.delays.reloadTableS1r = 1000;
window.delays.reloadTableS2r = 2000;
// plex/neuroCore/neuroCoreMainConceptGraphSelector.js
window.delays.neoroCoreConceptGraphSelectorDelay = 3000;


//////////////////////////// OPTION 1
window.defaultConceptGraph = "myConceptGraph_plex";
window.currentConceptGraph = "myConceptGraph_plex";
window.defaultConceptGraphSqlID = 10;
window.currentConceptGraphSqlID = 10;
window.aLookupConceptGraphInfoBySqlID = [];
window.aLookupConceptGraphInfoBySqlID[10] = {}
window.aLookupConceptGraphInfoBySqlID[10].tableName="myConceptGraph_plex";
window.aLookupConceptGraphInfoBySqlID[10].title="Concept Graph: Plex";
window.aLookupConceptGraphInfoBySqlID[10].mainSchema_slug="mainSchemaForConceptGraph";
window.aLookupConceptInfoBySqlID = [];

/*
window.aLookupConceptInfoBySqlID[2] = {}
window.aLookupConceptInfoBySqlID[2].slug="conceptFor_relationshipType";
window.aLookupConceptInfoBySqlID[2].name="concept for relationshipType";
window.aLookupConceptInfoBySqlID[2].title="Concept for relationshipType";
window.defaultConceptSqlID = 2;
window.currentConceptSqlID = 2;
*/
/*
window.aLookupConceptInfoBySqlID[3] = {}
window.aLookupConceptInfoBySqlID[3].slug="conceptFor_wordType";
window.aLookupConceptInfoBySqlID[3].name="concept for wordType";
window.aLookupConceptInfoBySqlID[3].title="Concept for wordType";
window.defaultConceptSqlID = 3;
window.currentConceptSqlID = 3;
*/

window.aLookupConceptInfoBySqlID[659] = {}
window.aLookupConceptInfoBySqlID[659].slug="conceptFor_rating";
window.aLookupConceptInfoBySqlID[659].name="concept for rating";
window.aLookupConceptInfoBySqlID[659].title="Concept for rating";
window.defaultConceptSqlID = 659;
window.currentConceptSqlID = 659;
/*
window.aLookupConceptInfoBySqlID[660] = {}
window.aLookupConceptInfoBySqlID[660].slug="conceptFor_ratingTemplate";
window.aLookupConceptInfoBySqlID[660].name="concept for ratingTemplate";
window.aLookupConceptInfoBySqlID[660].title="Concept for ratingTemplate";
window.defaultConceptSqlID = 660;
window.currentConceptSqlID = 660;
*/

/*
//////////////////////////// OPTION 2
window.defaultConceptGraph = "myConceptGraph_temporary";
window.currentConceptGraph = "myConceptGraph_temporary";
window.defaultConceptGraphSqlID = 2;
window.currentConceptGraphSqlID = 2;
window.aLookupConceptGraphInfoBySqlID = [];
window.aLookupConceptGraphInfoBySqlID[2] = {}
window.aLookupConceptGraphInfoBySqlID[2].tableName="myConceptGraph_temporary";
window.aLookupConceptGraphInfoBySqlID[2].title="Concept Graph: Temporary For Testing Shit";
window.aLookupConceptGraphInfoBySqlID[2].mainSchema_slug="schemaForConceptGraphFor_temporary";

window.defaultConceptSqlID = 29;
window.currentConceptSqlID = 29;
window.aLookupConceptInfoBySqlID = [];
window.aLookupConceptInfoBySqlID[29] = {}
window.aLookupConceptInfoBySqlID[29].slug="conceptForRating";
window.aLookupConceptInfoBySqlID[29].name="concept for rating";
window.aLookupConceptInfoBySqlID[29].title="Concept for Rating";

//////////////////////////// OPTION 2 part B
window.defaultConceptSqlID = 6;
window.currentConceptSqlID = 6;
window.aLookupConceptInfoBySqlID = [];
window.aLookupConceptInfoBySqlID[6] = {}
window.aLookupConceptInfoBySqlID[6].slug="conceptForEntityType";
window.aLookupConceptInfoBySqlID[6].name="concept for entityType";
window.aLookupConceptInfoBySqlID[6].title="Concept for EntityType";
*/

window.defaultWordSqlID = 0;
window.currentWordSqlID = 0;
window.aLookupWordInfoBySqlID = [];

window.testCounter = 0;

// this is NOT for use by NeuroCore!!!! only on the other pages!
window.lookupWordBySlug = {};
window.oOldWordReplacementMap = {};
window.aOldReplacedWords = [];
window.aNewReplacerWords = [];
window.lookupWordTypeTemplate = {};
window.lookupWordTypeTemplate.relationshipType = {
    "nodeFrom": { "slug": null },
    "relationshipType": { "slug": null },
    "nodeTo": { "slug": null }
}
window.lookupWordTypeTemplate.relationshipTypes = {};
window.lookupWordTypeTemplate.relationshipTypes.restrictsValue = {
    "nodeFrom": { "slug": null },
    "relationshipType": {
        "slug": "restrictsValue",
        "restrictsValueData": {
            "uniqueID": null, // nodeFrom-IPNS (last 6 chars) - restrictsValue - nodeTo-IPNS (last 6 chars)
            "targetPropertyType": null,
            "propertyPath": null,
            "uniquePropertyKey": null,
            "withSubsets": null,
            "withDependencies": null,
            "dependenciesPlacement": null // "lower" vs "upper"
        }
    },
    "nodeTo": { "slug": null }
}
window.visjs = {};
window.visjs.groupOptions = {};
window.visjs.edgeOptions = {};

window.lookupActionJavascriptByName = {};
window.lookupPatternJavascriptByName = {};

window.lookupSqlIDBySlug = {};
window.lookupSlugBySqlID = {};
window.allConceptGraphRelationships = [];

window.restrictsValueManagement = {
  "uniqueID": null,
  "seriesOfActionsCompleted": false,
  "singleActionCompleted": false,
  "thisNodeRole": null,
  "role0_slugs": [],
  "role1_slug": null,
  "role2_slug": null,
  "role3_slug": null,
  "role4_slug": null,
  "role5_slug": null,
  "role6_slugs": [],
  "correspondingRole0_slug": false,
  "correspondingRole6_slug": false
}
window.enumerationRolesManagement = {
  "uniqueID": null,
  "role0_slugs": [],
  "role1_slug": null,
  "role2_slug": null,
  "role3_slug": null,
  "role4_slug": null,
  "role5_slug": null,
  "role6_slugs": [],
  "role7_slugs": []
}

///////////////////////////////////////////////////////////////////
//////////////////////// NeuroCore 2 //////////////////////////////
window.neuroCore = {};
window.neuroCore.aS1nPatternsByName = [];
window.neuroCore.aS1rPatternsByName = [];
window.neuroCore.aS2rPatternsByName = [];
window.neuroCore.aU1nActionsByName = [];

window.neuroCore.oRFL = {};
window.neuroCore.oRFL.current = {};
window.neuroCore.oRFL.updated = {};

// 27 July 2022: new
window.neuroCore.engine = {};
window.neuroCore.subject = {};

window.neuroCore.engine.oOldWordReplacementMap = {};
window.neuroCore.engine.aOldReplacedWords = [];
window.neuroCore.engine.aNewReplacerWords = [];

window.neuroCore.engine.oRFL = {};
window.neuroCore.engine.oRFL.current = {};
window.neuroCore.engine.oRecordOfUpdates = {};
window.neuroCore.engine.oMapPatternNameToWordSlug = {};
window.neuroCore.engine.oMapActionNameToWordSlug = {};
window.neuroCore.engine.oMapActionSlugToWordSlug = {};
window.neuroCore.engine.oPatternsWithAuxiliaryDataQueue = {};
window.neuroCore.engine.changesMadeYetThisCycle = false;
window.neuroCore.engine.changesMadeYetThisSupercycle = false;

window.neuroCore.subject.allConceptGraphRelationships = [];
window.neuroCore.subject.oRFL = {};
window.neuroCore.subject.oRFL.current = {};
window.neuroCore.subject.oRFL.updated = {};
window.neuroCore.subject.oRFL.new = {};
window.neuroCore.subject.oMainSchemaForConceptGraph = {};

window.neuroCore.engine.currentConceptGraphSqlID = 10; // myConceptGraph_plex
window.neuroCore.subject.currentConceptGraphSqlID = window.currentConceptGraphSqlID;

///////////////////////////////////////////////////////////////////
//////////////////////// NeuroCore 3 //////////////////////////////
// 11 Oct 2022 Copied NeuroCore 2 init and added .ipfs to indicate NeuroCore 3
window.ipfs = {};
window.ipfs.neuroCore = {};
window.ipfs.neuroCore.aS1nPatternsByName = [];
window.ipfs.neuroCore.aS1rPatternsByName = [];
window.ipfs.neuroCore.aS2rPatternsByName = [];
window.ipfs.neuroCore.aU1nActionsByName = [];

window.ipfs.neuroCore.oRFL = {};
window.ipfs.neuroCore.oRFL.current = {};
window.ipfs.neuroCore.oRFL.updated = {};

window.ipfs.neuroCore.engine = {};
window.ipfs.neuroCore.subject = {};

window.ipfs.neuroCore.engine.oOldWordReplacementMap = {};
window.ipfs.neuroCore.engine.aOldReplacedWords = [];
window.ipfs.neuroCore.engine.aNewReplacerWords = [];

window.ipfs.neuroCore.engine.oRFL = {};
window.ipfs.neuroCore.engine.oRFL.current = {};
window.ipfs.neuroCore.engine.oRecordOfUpdates = {};
window.ipfs.neuroCore.engine.oMapPatternNameToWordSlug = {};
window.ipfs.neuroCore.engine.oMapActionNameToWordSlug = {};
window.ipfs.neuroCore.engine.oMapActionSlugToWordSlug = {};
window.ipfs.neuroCore.engine.oPatternsWithAuxiliaryDataQueue = {};
window.ipfs.neuroCore.engine.changesMadeYetThisCycle = false;
window.ipfs.neuroCore.engine.changesMadeYetThisSupercycle = false;
window.ipfs.neuroCore.engine.oPatternsTriggeredByAction = {};

window.ipfs.neuroCore.subject.allConceptGraphRelationships = [];
window.ipfs.neuroCore.subject.oRFL = {};
window.ipfs.neuroCore.subject.oRFL.current = {};
window.ipfs.neuroCore.subject.oRFL.updated = {};
window.ipfs.neuroCore.subject.oRFL.new = {};
window.ipfs.neuroCore.subject.oMainSchemaForConceptGraph = {};

window.ipfs.neuroCore.engine.currentConceptGraphSqlID = 10; // myConceptGraph_plex
window.ipfs.neuroCore.subject.currentConceptGraphSqlID = window.currentConceptGraphSqlID;

window.ipfs.updatesSinceLastRefresh = true;
window.ipfs.mfsDirectoriesEstablished = false;

window.ipfs.neuroCore.engine.pCG = null; // eg: pCG0 = /plex/conceptGraphs/1cnx1ekjkv/k2k4r8m51oham1hg0lqrdryt2bjs4vzvmbe9r2geijux4nmqbqeq1r67/
window.ipfs.neuroCore.subject.pCG = null
window.ipfs.pCG = "/plex/conceptGraphs/";
window.ipfs.pCGpub = "/plex/conceptGraphs/public/publicConceptGraphsDirectory/node.txt";
window.ipfs.pCGb = null; // b=base; default path to all operational concept graphs in this node; includes 10-character directory which should be unknown to other nodes
window.ipfs.pCGs = null; // s=schema; path to the active mainSchemaForConceptGraph file
window.ipfs.pCG0 = null; // 0=most important; path to "active" concept graph. can also have: window.ipfs.pCG1, 2, 3, etc and switch between them
window.ipfs.pCGw = null; // w=word; path to all words in active concept graph pCG0 + word/
window.ipfs.pCGd = null; // d=directory; path to the directory of all concept graphs as well as roles played
// pCG = /plex/conceptGraphs/
// pCGpub = /plex/conceptGraphs/publicConceptGraphDirectory/node.txt
// pCGb = /plex/conceptGraphs/abcde12345/
// pCGs = pCGb + "mainSchemaForConceptGraph/node.txt" // might deprecate this location for this file; instead use conceptGraphsDirectory to find the active concept graph ipns
// pCGs = pCGb + [ipns hash] + "/"
// pCGw = pCGs + "/words"
// pCGd = pCGb + "conceptGraphsDirectory/node.txt";
window.ipfs.pCGnce = null; // nce = neuroCore engine; default: pCGnce = pCG0
window.ipfs.pCGncs = null; // ncs = neuroCore subject; default: pCGncs = pCG0
// convention: same info in two places; ought to pick just one
// window.ipfs.neuroCore.engine.pCG = window.ipfs.pCGnce
// window.ipfs.neuroCore.subject.pCG = window.ipfs.pCGncs

window.frontEndConceptGraph = {};
window.frontEndConceptGraph.activeConceptGraph = {};
window.frontEndConceptGraph.activeConceptGraph.slug = null;
window.frontEndConceptGraph.activeConceptGraph.title = null;
window.frontEndConceptGraph.activeConceptGraph.ipnsForMainSchemaForConceptGraph = null;

window.frontEndConceptGraph.viewingConceptGraph = {};
window.frontEndConceptGraph.viewingConceptGraph.slug = null;
window.frontEndConceptGraph.viewingConceptGraph.title = null;
window.frontEndConceptGraph.viewingConceptGraph.ipnsForMainSchemaForConceptGraph = null;
window.frontEndConceptGraph.viewingConcept = {};
window.frontEndConceptGraph.viewingConcept.slug = null;
window.frontEndConceptGraph.viewingConcept.title = null;
window.frontEndConceptGraph.viewingConcept.ipns = null;

window.frontEndConceptGraph.neuroCore = {};
window.frontEndConceptGraph.neuroCore.subject = {};
window.frontEndConceptGraph.neuroCore.subject.ipnsForMainSchemaForConceptGraph = null;
window.frontEndConceptGraph.neuroCore.engine = {};
window.frontEndConceptGraph.neuroCore.engine.ipnsForMainSchemaForConceptGraph = null;

// The following file system is established by ConceptGraphInMfsFunctions.establishMfsDirectories which is called by the landing page ( src/plex/plexHome.js ) unless it has already been done successfully
window.grapevine = {};
window.grapevine.ratings = {};
window.grapevine.ratings.local = {};
window.grapevine.ratings.external = {};
window.grapevine.ratings.local.mfsPath = "/grapevineData/ratings/locallyAuthored/";
window.grapevine.ratings.external.mfsPath = "/grapevineData/ratings/externallyAuthored/";
window.grapevine.ratings.local.mfsFile = "/grapevineData/ratings/locallyAuthored/ratings.txt";
window.grapevine.ratings.external.mfsFile = "/grapevineData/ratings/externallyAuthored/ratings.txt";
window.grapevine.ratings.local.set = "setFor_ratings_authoredLocally";
window.grapevine.ratings.external.set = "setFor_ratings_authoredExternally";
window.grapevine.ratings.concept = {};
window.grapevine.ratings.concept.slug = "conceptFor_rating";
window.grapevine.ratings.schema = {};
window.grapevine.ratings.schema.slug = "schemaFor_rating";
window.grapevine.myUserData = "/grapevineData/userProfileData/myProfile.txt"
window.grapevine.users = "/grapevineData/users/"

window.grapevine.starterDefaultAttenuationFactor = 90;
window.grapevine.starterDefaultUpdateProposalVerdictAverageScore = 0;
window.grapevine.starterDefaultUpdateProposalVerdictConfidence = 40;
window.grapevine.starterDefaultUserTrustAverageScore = 50;
window.grapevine.starterDefaultUserTrustConfidence = 40;
window.grapevine.starterRigor = 25; // ?? 25 / 100
window.grapevine.starterDecoupleRigorConfidence = false // ??
window.grapevine.starterStrat1Coeff = 15; // ?? 10 / 100
window.grapevine.starterStrat2Coeff = 10; // ?? 100 / 100
window.grapevine.starterStrat3Coeff = 100; // ?? 100 / 100
window.grapevine.starterStrat4Coeff = 200; // ?? 200 / 500
window.grapevine.starterStrat5Coeff = 500; // ?? 500 / 2000
// visualization
window.grapevine.defaultNodeSize = 30;

window.ipfs.mainSchemaForConceptGraph_defaultExternalIPNS = "k2k4r8jya910bj45nxvwiw7pjqr611qv431331sx3py6ee2tiwxtmf6y";
window.ipfs.isEstablishedYet_oMainSchemaForConceptGraphLocal = false

window.testVarA = "defined in public/js/preload.js"

window.oAutomatedImportData = {};
window.oAutomatedImportData.running=false;
window.oAutomatedImportData.currentStep=null;
window.oAutomatedImportData.currentCommandName = null;
window.oAutomatedImportData.currentQueueNumber = null;

window.oBlankConceptGraphRawFile = {};
window.oBlankConceptGraphRawFile.conceptGraphData = {};
window.oBlankConceptGraphRawFile.conceptGraphData.slug = "blankConceptGraph";
window.oBlankConceptGraphRawFile.conceptGraphData.name = "blank concept graph";
window.oBlankConceptGraphRawFile.conceptGraphData.title = "Blank Concept Graph";
window.oBlankConceptGraphRawFile.conceptGraphData.description = "This is a blank concept graph.";
window.oBlankConceptGraphRawFile.conceptGraphData.concepts = [];
window.oBlankConceptGraphRawFile.concepts = {};
window.oBlankConceptGraphRawFile.enumerations = {};

window.oConceptData = {
    "wordTypeData": {
        "slug": null,
        "name": null,
        "title": null
    },
    "conceptData": {
      "slug": null,
      "name": {
          "singular": null,
          "plural": null
      },
      "title": null,
      "oSlug": {
          "singular": null,
          "plural": null
      },
      "oName": {
          "singular": null,
          "plural": null
      },
      "oTitle": {
          "singular": null,
          "plural": null
      },
      "description": null,
      "propertyPath": null
    },
    "templating": {
        "method": "none",
        "templateConcept": null,
        "independentProperty": null,
        "dependentProperties": []
    },
    "governingConceptNameSingular": null,
    "propertiesData": {},
    "relationships": [],
    "setsData": {},
    "relationshipsForSets": [],
    "specificInstancesData": {},
    "relationshipsForSpecificInstances": []
};

window.oSpecificInstanceDataBlank = {
    "slug": null,
    "name": null,
    "title": null,
    "metaData": {
        "governingConcept": {
            "slug": null,
        },
        "primaryProperty": null,
    }
}
window.oSetDataBlank = {
    "slug": null,
    "title": null,
    "name": null,
    "description": null,
    "propertyDefinition": false,
    "metaData": {
        "types": [],
        "governingConcept": {
            "slug": null,
        },
        "governingConcepts": []
    }
}
window.oPropertyDataBlank = {
    "slug": null,
    "key": null,
    "type": null,
    "name": null,
    "title": null,
    "description": null,
    "metaData": {
        "types": [],
        "required": false,
        "unique": false,
        "governingConcept": {
            "slug": null
        }
    }
}

window.oPropertyData = {
    "slug": null,
    "key": null,
    "type": null,
    "name": null,
    "title": null,
    "description": null,
    "metaData": {
        "types": ["topLevel"],
        "required": false,
        "unique": false,
        "governingConcept": {
            "slug": null
        }
    }
}

window.oPropertyData_primaryProperty = {
    "slug": null,
    "key": null,
    "type": "object",
    "name": null,
    "title": null,
    "description": "the primary property for this concept",
    "metaData": {
        "types": ["primaryProperty"],
        "required": true,
        "unique": true,
        "governingConcept": {
            "slug": null
        }
    }
}

window.oPropertyData_slug = {
    "slug": "slug",
    "key": "slug",
    "type": "string",
    "name": "slug",
    "title": "Slug",
    "description": "the slug for this concept",
    "metaData": {
        "types": ["topLevel"],
        "required": true,
        "unique": true,
        "governingConcept": {
            "slug": null
        }
    }
}

window.oPropertyData_name = {
    "slug": "name",
    "key": "name",
    "type": "string",
    "name": "name",
    "title": "Name",
    "description": "the name for this concept",
    "metaData": {
        "types": ["topLevel"],
        "required": true,
        "unique": true,
        "governingConcept": {
            "slug": null
        }
    }
}

window.oPropertyData_title = {
    "slug": "title",
    "key": "title",
    "type": "string",
    "name": "title",
    "title": "Title",
    "description": "the title for this concept",
    "metaData": {
        "types": ["topLevel"],
        "required": true,
        "unique": true,
        "governingConcept": {
            "slug": null
        }
    }
}

window.oPropertyData_description = {
    "slug": "description",
    "key": "description",
    "type": "string",
    "name": "description",
    "title": "Description",
    "description": "the description for this concept",
    "metaData": {
        "types": ["topLevel"],
        "required": false,
        "unique": false,
        "governingConcept": {
            "slug": null
        }
    }
}

window.oBlankEnumeration = {
    "restrictsValueData": {
        "nodeFrom": {
            "slug": null,
            "sourceConceptSlug": null,
            "sourceSetSlug": null
        },
        "nodeTo": {
            "slug": null,
            "targetConceptSlug": null,
            "targetPropertyKey": null,
            "targetPropertyKeyPaths": []
        },
        "targetPropertyType": null,
        "provideNullOption": true,
        "uniquePropertyKey": null,
        "withSubsets": false,
        "withDependencies": false,
        "dependenciesPlacement": null
    }
}
window.constants = {};
window.constants.cgOverviewPage = {};
window.constants.cgOverviewPage.currentConceptNumber = 0;
window.constants.cgOverviewPage.conceptGraphData = {};
window.constants.cgOverviewPage.conceptGraphData.name = null;
window.constants.cgOverviewPage.conceptGraphData.description = null;
window.constants.cgOverviewPage.concepts = [];
window.constants.cgOverviewPage.c2cRels = {};
window.constants.cgOverviewPage.c2cRels.enumerations = [];
window.constants.cgOverviewPage.c2cRels.isASubsetOf = [];
window.constants.cgOverviewPage.c2cRels.isARealizationOf = [];
window.constants.cgOverviewPage.loadingStoredConceptGraph = false;

window.templating = {};
/*
// quick fetch main schema for concept graph:
var oMainSchemaForConceptGraph = window.lookupWordBySlug[window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug];
*/
/*
// NOTES:
jQuery("#whateverButton").get(0).click();
*/
