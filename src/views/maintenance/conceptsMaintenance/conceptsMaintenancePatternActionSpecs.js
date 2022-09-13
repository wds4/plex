

/*
conceptsMaintenance refers to creating, repairing, or optimizing the structure of individual concepts
Concept creation:
By using these functions, it is much easier to create a new concept: all that is required is to
make the new wordType node. These action-patterns will take care of the rest.
*/

////////////////////////////////////////////////////////////
////////// patterns based on NODES /////////////////////////

export const cm_node_Patterns = {}
export const cm_node_Actions = {}

var p = {};
var a = {};

///////////////////// wordType ///////////////////
// Purpose: make sure that each node where wordType = wordType
// contains all the basic nodes and relationships of a fully formed concept
// If necessary, create a new node and connect it with the appropriate relationship

cm_node_Patterns.wordType_1 = {};
cm_node_Actions.wT_1 = {}; // schemaFor[] - isTheSchemaFor - X
cm_node_Actions.wT_2 = {}; // JSONSchemaFor[] - isTheJSONSchemaFor - X


////////////////////////////////////////////////////////////
///////// patterns based on single RELATIONSHIPS ///////////

export const cm_rel_Patterns = {}
export const cm_rel_Actions = {}

var p = {};
var a = {};

///////////////////// addToConceptGraphProperties /////////////
// enumprop_1 should look at each instance of enumeration -- addToConceptGraphProperties -- property
// and make the target property into a specific instance of the set: propertiesFor[thatConcept]_object_dependencies
// Within schemaForPoertiesFor[thatConcept]
// ( For now, as of 19 Sep 2021, this action is performed without using this pattern-action method to trigger it; it is simply hand coded )

cm_rel_Patterns.addToConceptGraphProperties_1 = {};
cm_rel_Actions.enumprop_1 = {};

p = {};
p.relationshipType = "addToConceptGraphProperties";
p.nodeFrom = {};
p.nodeFrom.wordTypes = [ "enumeration" ];
p.nodeTo = {};
p.nodeTo.wordTypes = [ "property" ];
p.actions = ["enumprop_1"];
cm_rel_Patterns.addToConceptGraphProperties_1=p;

a = {};
a.relMethod="relMethod_enum_0";
a.relationshipType="addToConceptGraphProperties";
cm_rel_Actions.enumprop_1=a;
