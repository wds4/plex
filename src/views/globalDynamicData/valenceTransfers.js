
export const gDDPatterns = {}
export const gDDActions = {}

var p = {};
var a = {};

///////////////////// isTheConceptFor /////////////
gDDPatterns.isTheConceptFor_1 = {};
gDDActions.con_1 = {};
gDDActions.con_2 = {};

p = {};
p.relationshipType = "isTheConceptFor";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "concept" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "wordType" ];
p.actions = ["con_1", "con_2"];
// p.actions = [];
gDDPatterns.isTheConceptFor_1=p;

a = {};
a.source={};
a.source.node = "nodeTo";
a.source.path = "globalDynamicData.specificInstances";
a.source.type = "array";
a.target={};
a.target.node = "nodeFrom";
a.target.path = "globalDynamicData.specificInstances";
a.target.type = "array";
gDDActions.con_1=a;

a = {};
a.source={};
a.source.node = "nodeTo";
a.source.path = "globalDynamicData.subsets";
a.source.type = "array";
a.target={};
a.target.node = "nodeFrom";
a.target.path = "globalDynamicData.sets";
a.target.type = "array";
gDDActions.con_2=a;

///////////////////// isTheSupersetFor /////////////
gDDPatterns.isTheSupersetFor_1 = {};
gDDActions.sup_1 = {};
gDDActions.sup_2 = {};

p = {};
p.relationshipType = "isTheSupersetFor";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "superset" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "wordType" ];
p.actions = ["sup_1", "sup_2", "sup_3"];
// p.actions = [];
gDDPatterns.isTheSupersetFor_1=p;

a = {};
a.source={};
a.source.node = "nodeFrom";
a.source.path = "globalDynamicData.specificInstances";
a.source.type = "array";
a.target={};
a.target.node = "nodeTo";
a.target.path = "globalDynamicData.specificInstances";
a.target.type = "array";
gDDActions.sup_1=a;

a = {};
a.source={};
a.source.node = "nodeFrom";
a.source.path = "globalDynamicData.subsets";
a.source.type = "array";
a.target={};
a.target.node = "nodeTo";
a.target.path = "globalDynamicData.subsets";
a.target.type = "array";
gDDActions.sup_2=a;

a = {};
a.source={};
a.source.node = "nodeTo";
a.source.path = "globalDynamicData.valenceData.valenceL1";
a.source.type = "array";
a.target={};
a.target.node = "nodeFrom";
a.target.path = "globalDynamicData.valenceData.valenceL1";
a.target.type = "array";
gDDActions.sup_3=a;


///////////////////// isASpecificInstanceOf /////////////
gDDPatterns.isASpecificInstanceOf_1 = {};
gDDActions.sio_1 = {};
gDDActions.sio_2 = {};

p = {};
p.relationshipType = "isASpecificInstanceOf";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "any" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "any" ];
p.actions = ["sio_1", "sio_2", "sio_3"];
// p.actions = ["sio_1", "sio_2"];
// p.actions = [];
gDDPatterns.isASpecificInstanceOf_1=p;

a = {};
a.source={};
a.source.node = "nodeFrom";
a.source.path = "wordData.slug";
a.source.type = "string";
a.target={};
a.target.node = "nodeTo";
a.target.path = "globalDynamicData.specificInstances";
a.target.type = "array";
gDDActions.sio_1=a;

a = {};
a.source={};
a.source.node = "nodeTo";
a.source.path = "wordData.slug";
a.source.type = "string";
a.target={};
a.target.node = "nodeFrom";
a.target.path = "globalDynamicData.specificInstanceOf";
a.target.type = "array";
gDDActions.sio_2=a;

a = {};
a.source={};
a.source.node = "nodeTo";
a.source.path = "globalDynamicData.valenceData.valenceL1";
a.source.type = "array";
a.target={};
a.target.node = "nodeFrom";
a.target.path = "globalDynamicData.valenceData.parentJSONSchemaSequence";
a.target.type = "array";
gDDActions.sio_3=a;

/////////////////////// addPropertyKey ///////////////
// (this invokes the function of isASpecificInstanceOf within property schemas)
gDDPatterns.addPropertyKey_1 = {};
gDDActions.apk_1 = {};

p = {};
p.relationshipType = "addPropertyKey";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "set" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "property" ];
p.actions = ["apk_1", "apk_2"];
// p.actions = [];
gDDPatterns.addPropertyKey_1=p;

a = {};
a.source={};
a.source.node = "nodeTo";
a.source.path = "wordData.slug";
a.source.type = "string";
a.target={};
a.target.node = "nodeFrom";
a.target.path = "globalDynamicData.specificInstances";
a.target.type = "array";
gDDActions.apk_1=a;

a = {};
a.source={};
a.source.node = "nodeFrom";
a.source.path = "wordData.slug";
a.source.type = "string";
a.target={};
a.target.node = "nodeTo";
a.target.path = "globalDynamicData.specificInstanceOf";
a.target.type = "array";
gDDActions.apk_2=a;

///////////////////// subsetOF /////////////
gDDPatterns.subsetOf_1 = {};
gDDActions.sub_1 = {};
gDDActions.sub_2 = {};
gDDActions.sub_3 = {};
gDDActions.sub_4 = {};

p = {};
p.relationshipType = "subsetOf";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "any" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "any" ];
////////////////////// !!!!!!!!!!!!!! sub_1 does not work; not sure why; need to fix!
// p.actions = ["sub_1","sub_2", "sub_3",  "sub_4"];
p.actions = [ "sub_2", "sub_3",  "sub_4"];
// p.actions = [];
gDDPatterns.subsetOf_1=p;

/*
// not sure if this is correct
a = {};
a.source={};
a.source.node = "nodeFrom";
a.source.path = "globalDynamicData.subsets";
a.source.type = "array";
a.target={};
a.target.node = "nodeTo";
a.target.path = "globalDynamicData.valenceData.valenceL1";
a.target.type = "array";
gDDActions.sub_1=a;
*/

a = {};
a.source={};
a.source.node = "nodeTo";
a.source.path = "globalDynamicData.valenceData.valenceL1";
a.source.type = "array";
a.target={};
a.target.node = "nodeFrom";
a.target.path = "globalDynamicData.valenceData.valenceL1";
a.target.type = "array";
gDDActions.sub_1=a;

a = {};
a.source={};
a.source.node = "nodeFrom";
a.source.path = "globalDynamicData.specificInstances";
a.source.type = "array";
a.target={};
a.target.node = "nodeTo";
a.target.path = "globalDynamicData.specificInstances";
a.target.type = "array";
gDDActions.sub_2=a;

a = {};
a.source={};
a.source.node = "nodeFrom";
a.source.path = "wordData.slug";
a.source.type = "string";
a.target={};
a.target.node = "nodeTo";
a.target.path = "globalDynamicData.subsets";
a.target.type = "array";
gDDActions.sub_3=a;

a = {};
a.source={};
a.source.node = "nodeTo";
a.source.path = "wordData.slug";
a.source.type = "string";
a.target={};
a.target.node = "nodeFrom";
a.target.path = "globalDynamicData.subsetOf";
a.target.type = "array";
gDDActions.sub_4=a;

///////////////////// isTheJSONSchemaFor /////////////
gDDPatterns.isTheJSONSchemaFor_1 = {};
gDDActions.jsf_1 = {};
gDDActions.jsf_2 = {};
gDDActions.jsf_3 = {};

p = {};
p.relationshipType = "isTheJSONSchemaFor";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "JSONSchema" ];
p.nodeTo = {};
// p.nodeTo.wordTypes = [ "wordType" ];
p.nodeTo.wordTypes = [ "any" ];
p.actions = [ "jsf_1","jsf_2", "jsf_3"];
// p.actions = [  "jsf_2", "jsf_3"];
// p.actions = [];
gDDPatterns.isTheJSONSchemaFor_1=p;

a = {};
a.source={};
a.source.node = "nodeFrom";
a.source.path = "wordData.slug";
a.source.type = "string";
a.target={};
a.target.node = "nodeTo";
a.target.path = "globalDynamicData.valenceData.valenceL1";
a.target.type = "array";
gDDActions.jsf_1=a;

a = {};
a.source={};
a.source.node = "nodeTo";
a.source.path = "globalDynamicData.specificInstances";
a.source.type = "array";
a.target={};
a.target.node = "nodeFrom";
a.target.path = "globalDynamicData.specificInstances";
a.target.type = "array";
gDDActions.jsf_2=a;

a = {};
a.source={};
a.source.node = "nodeTo";
a.source.path = "globalDynamicData.subsets";
a.source.type = "array";
a.target={};
a.target.node = "nodeFrom";
a.target.path = "globalDynamicData.subsets";
a.target.type = "array";
gDDActions.jsf_3=a;
