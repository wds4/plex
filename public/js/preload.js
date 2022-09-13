
// import { ipcRenderer, contextBridge } from 'electron';

var preloadVar = 5;

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
