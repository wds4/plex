
/*
nodeMethod_0
nodeMethod_1

relMethod_0
relMethod_1
relMethod_2
relMethod_3 -- not yet done; rebuild JSONSchema from its primaryProperty (may take some work)
*/

// ppa_node_Patterns and ppa_node_Actions cycle through each node in the conceptGraph
// and perform the indicated action if the indicated pattern is a match

export const ppa_node_Patterns = {}
export const ppa_node_Actions = {}

var p = {};
var a = {};

///////////////////// property /////////////
// Purpose: starting with conceptGraphStyle,
// create from scratch JSONSchemaStyle and dependencies and definitions.direct
// (definitions.indirect will be populated in a separate action ... ?)

ppa_node_Patterns.property_1 = {};
ppa_node_Actions.prop_1 = {}; // transfer from conceptGraphStyle to (most of) JSONSchemaStyle; create definitions.direct
ppa_node_Actions.prop_2 = {}; // flesh out definitions.indirect

p = {};
p.wordTypes = [ "property" ];
p.actions = ["prop_1","prop_2"];
ppa_node_Patterns.property_1=p;

a = {};
a.nodeMethod="nodeMethod_0";
a.source={};
a.source.path = "propertyData.conceptGraphStyle";
a.target={};
a.target.path1 = "propertyData.JSONSchemaStyle";
a.target.path2 = "propertyData.definitions";
ppa_node_Actions.prop_1=a;

a = {};
a.nodeMethod="nodeMethod_1";
ppa_node_Actions.prop_2=a;

///////////////////// JSONSchema /////////////

ppa_node_Patterns.JSONSchema_1 = {};
ppa_node_Actions.jss_1 = {}; // process additionalFields; DEPRECATED -- this is taken care of within relMethod_enum_0

p = {};
p.wordTypes = [ "JSONSchema" ];
p.actions = ["jss_1"];
ppa_node_Patterns.JSONSchema_1=p;

a = {};
a.nodeMethod="nodeMethod_2";
a.source={};
// a.source.path = "enumerationData.conceptGraphStyle.additionalFields";
a.target={};
// a.target.path = "enumerationData.conceptGraphStyle";
ppa_node_Actions.jss_1=a;

// ppa_rel_Patterns and ppa_rel_Actions cycle through each relationship in the conceptGraph
// and perform the indicated action if the indicated pattern is a match
// (similar to globalDynamicData/valenceTransfers)

///////////////////// enumeration /////////////
/*
ppa_node_Patterns.enumeration_1 = {};
ppa_node_Actions.enum_1 = {}; // process additionalFields; DEPRECATED -- this is taken care of within relMethod_enum_0

p = {};
p.wordTypes = [ "enumeration" ];
p.actions = ["enum_1"];
ppa_node_Patterns.enumeration_1=p;

a = {};
a.nodeMethod="nodeMethod_2";
a.source={};
// a.source.path = "enumerationData.conceptGraphStyle.additionalFields";
a.target={};
// a.target.path = "enumerationData.conceptGraphStyle";
ppa_node_Actions.enum_1=a;
*/
// ppa_rel_Patterns and ppa_rel_Actions cycle through each relationship in the conceptGraph
// and perform the indicated action if the indicated pattern is a match
// (similar to globalDynamicData/valenceTransfers)

export const ppa_rel_Patterns = {}
export const ppa_rel_Actions = {}

var p = {};
var a = {};

///////////////////// enumerates /////////////
// see jQuery("#recalculateEnumerationsButton_"+concept_x_slug).click from GenerateCompactConceptSummarySelector.js
// purpose: to cycle through every enumerates relationship within the concept's main schema and recalculate
// the already-created enumeration node

ppa_rel_Patterns.enumerates_1 = {};
ppa_rel_Actions.enum_1 = {};

p = {};
p.relationshipType = "enumerates";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "set", "superset" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "enumeration" ];
p.actions = ["enum_1"];
ppa_rel_Patterns.enumerates_1=p;

a = {};
a.relMethod="relMethod_enum_0";
a.relationshipType="enumerates";
ppa_rel_Actions.enum_1=a;

///////////////////// enumeratesSingleValue /////////////
// see jQuery("#recalculateEnumerationsButton_"+concept_x_slug).click from GenerateCompactConceptSummarySelector.js
// purpose: to cycle through every enumerates relationship within the concept's main schema and recalculate
// the already-created enumeration node

ppa_rel_Patterns.enumeratesSingleValue_1 = {};
ppa_rel_Actions.esv_1 = {};

p = {};
p.relationshipType = "enumeratesSingleValue";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "any" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "enumeration" ];
p.actions = ["esv_1"];
ppa_rel_Patterns.enumeratesSingleValue_1=p;

a = {};
a.relMethod="relMethod_esv_0";
a.relationshipType="enumeratesSingleValue";
ppa_rel_Actions.esv_1=a;

// METHODS:
// relMethod_0: transfer data from path in source to path in destination, each of which is in either nodeFrom or nodeTo
// relMethod_1: transfer data from path in source to path in destination, where destination is either nodeFrom or nodeTo (usu nodeTo),
// but source is specified by reference to the slug of another node specified by an intermediary, which is either nodeFrom or nodeTo (usu nodeFrom)
// relMethod_2: incorporates a field from [relationshipType]Data
// used for addToConceptGraphProperties, addPropertyKey and addPropertyValue, where the source is part of the relationshipData

///////////////////// propagateProperty /////////////

ppa_rel_Patterns.propagateProperty_1 = {};
ppa_rel_Patterns.propagateProperty_2 = {};
ppa_rel_Patterns.propagateProperty_3 = {};
ppa_rel_Actions.pp_1 = {};
ppa_rel_Actions.pp_1b = {};
ppa_rel_Actions.pp_2 = {};
ppa_rel_Actions.pp_3 = {};

p = {};
p.relationshipType = "propagateProperty";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "property" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "property" ];
p.actions = ["pp_1","pp_1b"];
ppa_rel_Patterns.propagateProperty_1=p;

a = {};
a.relMethod="relMethod_0";
a.relationshipType="propagateProperty";
a.elementType="object"; // if source/target type is array, then elementType may be string or object (or integer? or array??)
a.source={};
a.source.node = "nodeFrom";
a.source.path = "propertyData.conceptGraphStyle.props";
a.source.type = "array";
a.target={};
a.target.node = "nodeTo";
a.target.path = "propertyData.conceptGraphStyle.props";
a.target.type = "array";
ppa_rel_Actions.pp_1=a;

a = {};
a.relMethod="relMethod_0";
a.relationshipType="propagateProperty";
a.elementType="object"; // if source/target type is array, then elementType may be string or object (or integer? or array??)
a.source={};
a.source.node = "nodeFrom";
a.source.path = "propertyData.conceptGraphStyle.properties";
a.source.type = "array";
a.target={};
a.target.node = "nodeTo";
a.target.path = "propertyData.conceptGraphStyle.properties";
a.target.type = "array";
ppa_rel_Actions.pp_1b=a;

p = {};
p.relationshipType = "propagateProperty";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "property" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "set" ];
p.actions = ["pp_2"];
ppa_rel_Patterns.propagateProperty_2=p;

a = {};
a.relMethod="relMethod_0";
a.relationshipType="propagateProperty";
a.elementType="string";
a.source={};
a.source.node = "nodeFrom";
a.source.path = "wordData.slug";
a.source.type = "string";
a.target={};
a.target.node = "nodeTo";
a.target.path = "setData.propagatePropertyInputs";
a.target.type = "array";
ppa_rel_Actions.pp_2=a;

p = {};
p.relationshipType = "propagateProperty";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "set" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "set" ];
p.actions = ["pp_3"];
ppa_rel_Patterns.propagateProperty_3=p;

a = {};
a.relMethod="relMethod_0";
a.relationshipType="propagateProperty";
a.elementType="string";
a.source={};
a.source.node = "nodeFrom";
a.source.path = "setData.propagatePropertyInputs";
a.source.type = "array";
a.target={};
a.target.node = "nodeTo";
a.target.path = "setData.propagatePropertyInputs";
a.target.type = "array";
ppa_rel_Actions.pp_3=a;

///////////////////// subsetOf /////////////

ppa_rel_Patterns.subsetOf_1 = {};
ppa_rel_Actions.so_1 = {};

p = {};
p.relationshipType = "subsetOf";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "set" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "set" ];
p.actions = ["so_1"];
ppa_rel_Patterns.subsetOf_1=p;

a = {};
a.relMethod="relMethod_0";
a.relationshipType="subsetOf";
a.elementType="string";
a.source={};
a.source.node = "nodeTo";
a.source.path = "setData.propagatePropertyInputs";
a.source.type = "array";
a.target={};
a.target.node = "nodeFrom";
a.target.path = "setData.propagatePropertyInputs";
a.target.type = "array";
ppa_rel_Actions.so_1=a;

///////////////////// isASpecificInstanceOf /////////////

// isASpecificInstanceOf_1 pairs with propagateProperty_2;
// currently propagateProperty_2 places the slug name into the target, and then
// when see isASpecificInstanceOf_1, action is to fetch data from that slug and transfer to the target;
// but this becomes a bit complex to specify execution of isASpecificInstanceOf_1.
// Perhaps rewrite so that the data itself rather than the slug gets transferred to the set as the intermediate step ???

// also: if setData.propertyTypes exists, then transfer elements in that array (e.g. type0, type1, etc)
// to propertyData.type and propertyData.types
ppa_rel_Patterns.isASpecificInstanceOf_1 = {};
ppa_rel_Actions.sio_1 = {};
ppa_rel_Actions.sio_2 = {};

p = {};
p.relationshipType = "isASpecificInstanceOf";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "property" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "set" ];
p.actions = ["sio_1","sio_2"];
ppa_rel_Patterns.isASpecificInstanceOf_1=p;

a = {};
a.relMethod="relMethod_1";
a.relationshipType="isASpecificInstanceOf";
a.intermediary={};
a.intermediary.node = "nodeTo";
a.intermediary.path = "setData.propagatePropertyInputs";
a.intermediary.type = "array";
a.source={};
a.source.node = "intermediary";
a.source.path = "propertyData.conceptGraphStyle.props";
a.source.type = "array";
a.target={};
a.target.node = "nodeFrom";
a.target.path = "propertyData.conceptGraphStyle.props";
a.target.type = "array";
ppa_rel_Actions.sio_1=a;

a = {};
a.relMethod="relMethod_0";
a.relationshipType="isASpecificInstanceOf";
a.source={};
a.source.node = "nodeTo";
a.source.path = "setData.metaData.types";
a.source.type = "array";
a.target={};
a.target.node = "nodeFrom";
a.target.path = "propertyData.types";
a.target.type = "array";
ppa_rel_Actions.sio_2=a;

////////////////////////////////////////// relMethod_2 //////////////////////////////////////////
///////////////////// addPropertyKey /////////////

ppa_rel_Patterns.addPropertyKey_1 = {};
ppa_rel_Actions.apk_1 = {};

p = {};
p.relationshipType = "addPropertyKey";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "set" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "property" ];
p.actions = ["apk_1"];
ppa_rel_Patterns.addPropertyKey_1=p;

a = {};
a.relMethod="relMethod_2";
a.relationshipType="addPropertyKey";
a.relationshipData = {}
a.relationshipData.fields = ["field"]
a.element = {};
a.element.type="object"; // if source/target type is array, then elementType may be string or object (or integer? or array??)
a.element.createNew = true;
a.element.modifyExisting = false;
a.element.obj = {}
a.element.obj.key = {};
a.element.obj.key.type = "string";
a.element.obj.key.value = "relationshipTypeData";
a.element.obj.value = {};
a.element.obj.value.type = "string";
a.element.obj.value.value = null;
a.source={};
a.source.node = "nodeFrom";
a.source.path = "propertyData.conceptGraphStyle.props";
a.source.type = "array";
a.target={};
a.target.node = "nodeTo";
a.target.path = "propertyData.conceptGraphStyle.props";
a.target.type = "array";
ppa_rel_Actions.apk_1=a;

///////////////////// addPropertyValue /////////////

ppa_rel_Patterns.addPropertyValue_1 = {};
ppa_rel_Actions.apv_1 = {};

p = {};
p.relationshipType = "addPropertyValue";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "property" ];
p.nodeFrom.propertyData = {};
p.nodeFrom.propertyData.types = [ "hasKey" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "property" ];
p.actions = ["apv_1"];
// p.actions = [];
ppa_rel_Patterns.addPropertyValue_1=p;

a = {};
a.relMethod="relMethod_2";
a.relationshipType="addPropertyValue";
a.relationshipData = {}
a.relationshipData.fields = ["field"]
a.element = {};
a.element.type="object"; // if source/target type is array, then elementType may be string or object (or integer? or array??)
a.element.createNew = false;
a.element.modifyExisting = true;
a.element.obj = {}
a.element.obj.key = {};
a.element.obj.key.type = "string";
a.element.obj.key.set = false;
a.element.obj.key.value = "";
a.element.obj.value = {};
a.element.obj.value.type = "string";
a.element.obj.value.set = true;
a.element.obj.value.value = "relationshipTypeData";
a.source={};
a.source.node = "nodeFrom";
a.source.path = "propertyData.conceptGraphStyle.props";
a.source.type = "array";
a.target={};
a.target.node = "nodeTo";
a.target.path = "propertyData.conceptGraphStyle.props";
a.target.type = "array";
ppa_rel_Actions.apv_1=a;

///////////////////// addToConceptGraphProperties /////////////

ppa_rel_Patterns.addToConceptGraphProperties_1 = {};
ppa_rel_Actions.atcgp_1 = {}; //

p = {};
p.relationshipType = "addToConceptGraphProperties";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "property", "enumeration" ];
// p.nodeFrom.wordTypes = [ "property" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "property" ];
p.actions = ["atcgp_1"];
// p.actions = [];
ppa_rel_Patterns.addToConceptGraphProperties_1=p;

a = {};
a.relMethod="relMethod_2";
a.relationshipType="addToConceptGraphProperties"; 
a.relationshipData = {}
a.relationshipData.fields = ["field"]
a.element = {};
a.element.type="object"; // if source/target type is array, then elementType may be string or object (or integer? or array??)
a.element.createNew = true;
a.element.modifyExisting = false;
a.element.obj = {}
a.element.obj.key = {};
a.element.obj.key.type = "string";
a.element.obj.key.value = "relationshipTypeData";
a.element.obj.slug = {};
a.element.obj.slug.type = "string";
a.element.obj.slug.value = "source";
a.source={};
a.source.node = "nodeFrom";
a.source.path = "wordData.slug";
a.source.type = "string";
a.target={};
a.target.node = "nodeTo";
a.target.path = "propertyData.conceptGraphStyle.properties";
a.target.type = "array";
ppa_rel_Actions.atcgp_1=a;

///////////////////// populatesArray /////////////

ppa_rel_Patterns.populatesArray_1 = {};
ppa_rel_Actions.pa_1 = {}; //

p = {};
p.relationshipType = "populatesArray";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "enumeration" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "property" ];
p.actions = ["pa_1"];
// p.actions = [];
ppa_rel_Patterns.populatesArray_1=p;

a = {};
a.relMethod="relMethod_4";
ppa_rel_Actions.pa_1=a;

///////////////////// isThePrimaryPropertyFor /////////////
// Purpose: to build the JSONSchema using its primary property

ppa_rel_Patterns.isThePrimaryPropertyFor_1 = {};
ppa_rel_Actions.itppf_1 = {};

p = {};
p.relationshipType = "isThePrimaryPropertyFor";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "property" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "wordType" ];
p.actions = ["itppf_1"];
ppa_rel_Patterns.isThePrimaryPropertyFor_1=p;

a = {};
a.relMethod="relMethod_3";
a.relationshipType="isThePrimaryPropertyFor";
a.source={};
a.source.node = "nodeFrom";
a.source.path = "";
a.source.type = "";
a.target={};
a.target.node = "nodeTo";
a.target.path = "";
a.target.type = "";
ppa_rel_Actions.itppf_1=a;
