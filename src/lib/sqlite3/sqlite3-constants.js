
export var dictionary_class_fields = " ";
dictionary_class_fields += "  id INTEGER PRIMARY KEY  ";
dictionary_class_fields += " , slug TEXT NULL  ";
dictionary_class_fields += " , ipns TEXT NULL  ";
dictionary_class_fields += " , ipfs TEXT NULL  ";
dictionary_class_fields += " , wordTypes TEXT NULL  ";
dictionary_class_fields += " , title_rS TEXT NULL  ";
dictionary_class_fields += " , table_rS TEXT NULL  ";
dictionary_class_fields += " , comments_rS TEXT NULL  ";
dictionary_class_fields += " , rawFile TEXT NULL  ";
dictionary_class_fields += " , keyname TEXT NULL  ";
dictionary_class_fields += " , UNIQUE(keyname) ";
dictionary_class_fields += " , UNIQUE(ipns) ";

export var myDictionary_class_fields = " ";
myDictionary_class_fields += "  id INTEGER PRIMARY KEY  ";
myDictionary_class_fields += " , slug TEXT NULL  ";
myDictionary_class_fields += " , ipns TEXT NULL  ";
myDictionary_class_fields += " , ipfs TEXT NULL  ";
myDictionary_class_fields += " , keyname TEXT NULL  ";
myDictionary_class_fields += " , wordTypes TEXT NULL  ";
myDictionary_class_fields += " , title_rS TEXT NULL  ";
myDictionary_class_fields += " , table_rS TEXT NULL  ";
myDictionary_class_fields += " , comments_rS TEXT NULL  ";
myDictionary_class_fields += " , rawFile TEXT NULL  ";
myDictionary_class_fields += " , lastUpdate_local INTEGER NULL  ";
myDictionary_class_fields += " , slug_originalVersion TEXT NULL  ";
myDictionary_class_fields += " , ipns_originalVersion TEXT NULL  ";
myDictionary_class_fields += " , ipfs_originalVersion TEXT NULL  ";
myDictionary_class_fields += " , externalDictionary_originalVersion TEXT NULL  ";
myDictionary_class_fields += " , whenCreated INTEGER NULL  ";
myDictionary_class_fields += " , UNIQUE(keyname) ";
myDictionary_class_fields += " , UNIQUE(ipns) ";
myDictionary_class_fields += " , UNIQUE(ipns_originalVersion) ";

export var externalDictionary_class_fields = " ";
externalDictionary_class_fields += "  id INTEGER PRIMARY KEY  ";
externalDictionary_class_fields += " , slug TEXT NULL  ";
externalDictionary_class_fields += " , ipns TEXT NULL  ";
externalDictionary_class_fields += " , ipfs TEXT NULL  ";
externalDictionary_class_fields += " , wordTypes TEXT NULL  ";
externalDictionary_class_fields += " , title_rS TEXT NULL  ";
externalDictionary_class_fields += " , table_rS TEXT NULL  ";
externalDictionary_class_fields += " , comments_rS TEXT NULL  ";
externalDictionary_class_fields += " , rawFile TEXT NULL  ";
externalDictionary_class_fields += " , whenCreated INTEGER NULL  ";
externalDictionary_class_fields += " , UNIQUE(ipns) ";

export var relationships_class_fields = " ";
relationships_class_fields += "  id INTEGER PRIMARY KEY  ";
relationships_class_fields += " , from_slug TEXT NULL, relType_slug TEXT NULL, to_slug TEXT NULL  ";

export var myConceptGraph_class_fields = " ";
myConceptGraph_class_fields += "  id INTEGER PRIMARY KEY  ";
myConceptGraph_class_fields += " , slug TEXT NULL  ";
myConceptGraph_class_fields += " , keyname TEXT NULL  ";
myConceptGraph_class_fields += " , ipns TEXT NULL  ";
myConceptGraph_class_fields += " , ipfs TEXT NULL  ";
myConceptGraph_class_fields += " , wordTypes TEXT NULL  ";
myConceptGraph_class_fields += " , title_rS TEXT NULL  ";
myConceptGraph_class_fields += " , table_rS TEXT NULL  ";
myConceptGraph_class_fields += " , comments_rS TEXT NULL  ";
myConceptGraph_class_fields += " , rawFile TEXT NULL  ";
myConceptGraph_class_fields += " , lastUpdate_local INTEGER NULL  ";
myConceptGraph_class_fields += " , referenceDictionary TEXT NULL  ";
myConceptGraph_class_fields += " , keyname_reference TEXT NULL  ";
myConceptGraph_class_fields += " , slug_reference TEXT NULL  ";
myConceptGraph_class_fields += " , ipns_reference TEXT NULL  ";
myConceptGraph_class_fields += " , lastUpdate_reference INTEGER NULL  ";
myConceptGraph_class_fields += " , globalDynamicData_keywords TEXT 'globalDynamicData'  ";
myConceptGraph_class_fields += " , whenCreated INTEGER NULL  ";
myConceptGraph_class_fields += " , UNIQUE(slug) ";
myConceptGraph_class_fields += " , UNIQUE(keyname) ";
myConceptGraph_class_fields += " , UNIQUE(ipns) ";

export var externalConceptGraph_class_fields = " ";
externalConceptGraph_class_fields += "  id INTEGER PRIMARY KEY  ";
externalConceptGraph_class_fields += " , slug TEXT NULL  ";
externalConceptGraph_class_fields += " , ipns TEXT NULL  ";
externalConceptGraph_class_fields += " , ipfs TEXT NULL  ";
externalConceptGraph_class_fields += " , wordTypes TEXT NULL  ";
externalConceptGraph_class_fields += " , title_rS TEXT NULL  ";
externalConceptGraph_class_fields += " , table_rS TEXT NULL  ";
externalConceptGraph_class_fields += " , comments_rS TEXT NULL  ";
externalConceptGraph_class_fields += " , rawFile TEXT NULL  ";
externalConceptGraph_class_fields += " , whenCreated INTEGER NULL  ";
externalConceptGraph_class_fields += " , UNIQUE(slug) ";
externalConceptGraph_class_fields += " , UNIQUE(ipns) ";

export var myDictionaries_class_fields = " ";
myDictionaries_class_fields += "  id INTEGER PRIMARY KEY  ";
myDictionaries_class_fields += " , slug TEXT NULL  ";
myDictionaries_class_fields += " , title TEXT NULL  ";
myDictionaries_class_fields += " , tableName TEXT NULL  ";
myDictionaries_class_fields += " , description TEXT NULL  ";
myDictionaries_class_fields += " , rootSchemaIPNS TEXT NULL  ";
myDictionaries_class_fields += " , numberOfWords INTEGER NULL  ";
myDictionaries_class_fields += " , conceptGraphList TEXT NULL  ";
myDictionaries_class_fields += " , UNIQUE(slug)  ";
myDictionaries_class_fields += " , UNIQUE(title)  ";
myDictionaries_class_fields += " , UNIQUE(tableName)  ";

export var externalDictionaries_class_fields = " ";
externalDictionaries_class_fields += "  id INTEGER PRIMARY KEY  ";
externalDictionaries_class_fields += " , slug TEXT NULL  ";
externalDictionaries_class_fields += " , title TEXT NULL  ";
externalDictionaries_class_fields += " , tableName TEXT NULL  ";
externalDictionaries_class_fields += " , description TEXT NULL  ";
externalDictionaries_class_fields += " , rootSchemaIPNS TEXT NULL  ";
externalDictionaries_class_fields += " , numberOfWords INTEGER NULL  ";
externalDictionaries_class_fields += " , repoPeerID TEXT NULL  ";
externalDictionaries_class_fields += " , conceptGraphList TEXT NULL  ";

export var myConceptGraphs_class_fields = " ";
myConceptGraphs_class_fields += "  id INTEGER PRIMARY KEY  ";
myConceptGraphs_class_fields += " , slug TEXT NULL  ";
myConceptGraphs_class_fields += " , title TEXT NULL  ";
myConceptGraphs_class_fields += " , tableName TEXT NULL  ";
myConceptGraphs_class_fields += " , description TEXT NULL  ";
myConceptGraphs_class_fields += " , rawFile TEXT NULL  ";
myConceptGraphs_class_fields += " , rootSchemaIPNS TEXT NULL  ";
myConceptGraphs_class_fields += " , referenceDictionary_tableName TEXT NULL  ";
myConceptGraphs_class_fields += " , globalDynamicData_keywords TEXT NULL  ";

export var externalConceptGraphs_class_fields = " ";
externalConceptGraphs_class_fields += "  id INTEGER PRIMARY KEY  ";
externalConceptGraphs_class_fields += " , slug TEXT NULL  ";
externalConceptGraphs_class_fields += " , title TEXT NULL  ";
externalConceptGraphs_class_fields += " , tableName TEXT NULL  ";
externalConceptGraphs_class_fields += " , description TEXT NULL  ";
externalConceptGraphs_class_fields += " , rootSchemaIPNS TEXT NULL  ";
externalConceptGraphs_class_fields += " , repoPeerID TEXT NULL  ";
externalConceptGraphs_class_fields += " , referenceDictionary_tableName TEXT NULL  ";
externalConceptGraphs_class_fields += " , globalDynamicData_keywords TEXT NULL  ";

export var defaultTableList_arr = [
    {"tableName": "myConceptGraphs"},
    {"tableName": "myDictionaries"},
    {"tableName": "concepts"},
    {"tableName": "wordTemplatesByWordType"},
    {"tableName": "myConceptGraph_pga"},
    {"tableName": "myConceptGraph_temporary"},
    {"tableName": "myConceptGraph_organisms"},
    {"tableName": "myConceptGraph_epistemologies"},
    {"tableName": "myConceptGraph_2WAY"},
    {"tableName": "myDictionary_pga"},
    {"tableName": "myDictionary_temporary"}
];

export var insertDefaultDataCommands = {};
insertDefaultDataCommands["myConceptGraphs"] = "";
insertDefaultDataCommands["myDictionaries"] = "";
insertDefaultDataCommands["concepts"] = "";
insertDefaultDataCommands["wordTemplatesByWordType"] = "";
insertDefaultDataCommands["myConceptGraph_pga"] = "";
insertDefaultDataCommands["myConceptGraph_temporary"] = "";
insertDefaultDataCommands["myConceptGraph_organisms"] = "";
insertDefaultDataCommands["myConceptGraph_epistemologies"] = "";
insertDefaultDataCommands["myConceptGraph_2WAY"] = "";
insertDefaultDataCommands["myDictionary_pga"] = "";
insertDefaultDataCommands["myDictionary_temporary"] = "";

insertDefaultDataCommands["myConceptGraphs"] += ` INSERT OR IGNORE INTO myConceptGraphs `;
insertDefaultDataCommands["myConceptGraphs"] += ` (slug, title, tableName, rawFile, referenceDictionary_tableName) `;
// insertDefaultDataCommands["myConceptGraphs"] += ` VALUES('pga_old', 'Pretty Good Apps Main Concept Graph (old)', 'conceptGraph_pga' ) `;
insertDefaultDataCommands["myConceptGraphs"] += ` VALUES('pga', 'Pretty Good Apps Main Concept Graph (new)', 'myConceptGraph_pga', '{}', 'myDictionary' ) `;
insertDefaultDataCommands["myConceptGraphs"] += ` , ('temporary', 'Concept Graph: Temporary For Testing Shit', 'myConceptGraph_temporary', '{}', 'myDictionary' ) `;
insertDefaultDataCommands["myConceptGraphs"] += ` , ('organism', 'Concept Graph: Organisms', 'myConceptGraph_organisms', '{}', 'myDictionary' ) `;
insertDefaultDataCommands["myConceptGraphs"] += ` , ('epistemology', 'Concept Graph: Epistemologies', 'myConceptGraph_epistemologies', '{}', 'myDictionary' ) `;
insertDefaultDataCommands["myConceptGraphs"] += ` , ('2WAY', 'Concept Graph: 2WAY', 'myConceptGraph_2WAY', '{}', 'myDictionary' ); `;

insertDefaultDataCommands["myDictionaries"] += ` INSERT OR IGNORE INTO myDictionaries `;
insertDefaultDataCommands["myDictionaries"] += ` (slug, title, tableName) `;
insertDefaultDataCommands["myDictionaries"] += ` VALUES( 'myDictionary_pga', 'Pretty Good Apps Main Dictionary', 'myDictionary_pga' ) `;
insertDefaultDataCommands["myDictionaries"] += ` , ( 'myDictionary_temporary', 'Test Dictionary for Inter-Dictionary Transfers', 'myDictionary_temporary' ); `;

insertDefaultDataCommands["wordTemplatesByWordType"] += ` INSERT OR IGNORE INTO wordTemplatesByWordType `;
insertDefaultDataCommands["wordTemplatesByWordType"] += ` (wordType, rawFile) `;
insertDefaultDataCommands["wordTemplatesByWordType"] += ` VALUES( 'concept', '{}' ) `;
insertDefaultDataCommands["wordTemplatesByWordType"] += ` , ( 'compactConceptSummary', '{}' ) `;
insertDefaultDataCommands["wordTemplatesByWordType"] += ` , ( 'compactConceptGraphSummary', '{}' ); `;


export var createTableCommands = {};

createTableCommands["myConceptGraphs"] = "";
createTableCommands["myConceptGraphs"] += "CREATE TABLE IF NOT EXISTS myConceptGraphs ( ";
createTableCommands["myConceptGraphs"] += myConceptGraphs_class_fields;
createTableCommands["myConceptGraphs"] += " ) ";

createTableCommands["externalConceptGraphs"] = "";
createTableCommands["externalConceptGraphs"] += "CREATE TABLE IF NOT EXISTS externalConceptGraphs ( ";
createTableCommands["externalConceptGraphs"] += externalConceptGraphs_class_fields;
createTableCommands["externalConceptGraphs"] += " ) ";

createTableCommands["myDictionaries"] = "";
createTableCommands["myDictionaries"] += "CREATE TABLE IF NOT EXISTS myDictionaries ( ";
createTableCommands["myDictionaries"] += myDictionaries_class_fields;
createTableCommands["myDictionaries"] += " ) ";

createTableCommands["externalDictionaries"] = "";
createTableCommands["externalDictionaries"] += "CREATE TABLE IF NOT EXISTS externalDictionaries ( ";
createTableCommands["externalDictionaries"] += externalDictionaries_class_fields;
createTableCommands["externalDictionaries"] += " ) ";

createTableCommands["myConceptGraph_pga"] = "";
createTableCommands["myConceptGraph_pga"] += "CREATE TABLE IF NOT EXISTS myConceptGraph_pga ( ";
createTableCommands["myConceptGraph_pga"] += myConceptGraph_class_fields;
createTableCommands["myConceptGraph_pga"] += " ) ";

createTableCommands["myConceptGraph_temporary"] = "";
createTableCommands["myConceptGraph_temporary"] += "CREATE TABLE IF NOT EXISTS myConceptGraph_temporary ( ";
createTableCommands["myConceptGraph_temporary"] += myConceptGraph_class_fields;
createTableCommands["myConceptGraph_temporary"] += " ) ";

createTableCommands["myConceptGraph_organisms"] = "";
createTableCommands["myConceptGraph_organisms"] += "CREATE TABLE IF NOT EXISTS myConceptGraph_organisms ( ";
createTableCommands["myConceptGraph_organisms"] += myConceptGraph_class_fields;
createTableCommands["myConceptGraph_organisms"] += " ) ";

createTableCommands["myConceptGraph_epistemologies"] = "";
createTableCommands["myConceptGraph_epistemologies"] += "CREATE TABLE IF NOT EXISTS myConceptGraph_epistemologies ( ";
createTableCommands["myConceptGraph_epistemologies"] += myConceptGraph_class_fields;
createTableCommands["myConceptGraph_epistemologies"] += " ) ";

createTableCommands["myConceptGraph_2WAY"] = "";
createTableCommands["myConceptGraph_2WAY"] += "CREATE TABLE IF NOT EXISTS myConceptGraph_2WAY ( ";
createTableCommands["myConceptGraph_2WAY"] += myConceptGraph_class_fields;
createTableCommands["myConceptGraph_2WAY"] += " ) ";

//
createTableCommands["myDictionary_pga"] = "";
createTableCommands["myDictionary_pga"] += "CREATE TABLE IF NOT EXISTS myDictionary_pga ( ";
createTableCommands["myDictionary_pga"] += myDictionary_class_fields;
createTableCommands["myDictionary_pga"] += " ) ";
//
createTableCommands["myDictionary_temporary"] = "";
createTableCommands["myDictionary_temporary"] += "CREATE TABLE IF NOT EXISTS myDictionary_temporary ( ";
createTableCommands["myDictionary_temporary"] += myDictionary_class_fields;
createTableCommands["myDictionary_temporary"] += " ) ";


export var concepts_class_fields = " ";
concepts_class_fields += "  id INTEGER PRIMARY KEY  ";
concepts_class_fields += " , conceptName TEXT NULL  ";
concepts_class_fields += " , conceptGraph_tableName TEXT NULL  ";
concepts_class_fields += " , compactSummary_rawFile TEXT NULL  ";
concepts_class_fields += " , definition TEXT NULL  ";
concepts_class_fields += " , path TEXT NULL  ";
concepts_class_fields += " , UNIQUE(conceptName)  ";


createTableCommands["concepts"] = "";
createTableCommands["concepts"] += " CREATE TABLE IF NOT EXISTS concepts ( ";
createTableCommands["concepts"] += concepts_class_fields;
createTableCommands["concepts"] += " ) ";

createTableCommands["relationships"] = "";
createTableCommands["relationships"] += "CREATE TABLE IF NOT EXISTS relationships ( ";
createTableCommands["relationships"] += relationships_class_fields;
createTableCommands["relationships"] += " ) ";

createTableCommands["conceptGraph_localConstruction"] = "";
createTableCommands["conceptGraph_localConstruction"] += "CREATE TABLE IF NOT EXISTS conceptGraph_localConstruction ( ";
createTableCommands["conceptGraph_localConstruction"] += myConceptGraph_class_fields;
createTableCommands["conceptGraph_localConstruction"] += " ) ";

createTableCommands["dictionary"] = "";
createTableCommands["dictionary"] += "CREATE TABLE IF NOT EXISTS dictionary ( ";
createTableCommands["dictionary"] += externalDictionary_class_fields;
createTableCommands["dictionary"] += " ) ";

createTableCommands["myDictionary"] = "";
createTableCommands["myDictionary"] += "CREATE TABLE IF NOT EXISTS myDictionary ( ";
createTableCommands["myDictionary"] += myDictionary_class_fields;
createTableCommands["myDictionary"] += " ) ";

createTableCommands["wordTemplatesByWordType"] = "";
createTableCommands["wordTemplatesByWordType"] += " CREATE TABLE IF NOT EXISTS wordTemplatesByWordType ( ";
createTableCommands["wordTemplatesByWordType"] += " id INTEGER PRIMARY KEY  ";
createTableCommands["wordTemplatesByWordType"] += " , wordType TEXT NULL  ";
createTableCommands["wordTemplatesByWordType"] += " , rawFile TEXT '{}'  ";
createTableCommands["wordTemplatesByWordType"] += " , UNIQUE(wordType) ";
createTableCommands["wordTemplatesByWordType"] += " ) ";
