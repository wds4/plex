var sqlite3 = require('sqlite3').verbose();

dictionary_class_fields = " ";
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

// PUSHING UPDATES between tables
// an UPDATE PUSH is transfer of data from one row in one table to one row in another table:
// It is always from one of my dictionaries to one of my concept graphs.
// slug and wordTypes get copied directly
// rawFile gets copied, except every globalDynamicData_keyword remains unchanged. (Alternatively, could simply recalculate all globalDynamicData_keywords)
// lastUpdate_local means when was an edit made to rawFile, slug, wordTypes (more?) in this table
// lastUpdate_reference means when was an edit made to same columns in the reference table
// ** In any one of my concept graph tables, for any row,
// if lastUpdate_reference > lastUpdate_local, then the update needs to be PUSHED from reference table to local table.
// lastUpdate_local, lastUpdate_reference, whenCreated are all in UNIX time, 13 digits (in milliseconds)
myDictionary_class_fields = " ";
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
// myDictionary_class_fields += " , UNIQUE(slug) ";
myDictionary_class_fields += " , UNIQUE(ipns) ";
myDictionary_class_fields += " , UNIQUE(ipns_originalVersion) ";

externalDictionary_class_fields = " ";
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

relationships_class_fields = " ";
relationships_class_fields += "  id INTEGER PRIMARY KEY  ";
relationships_class_fields += " , from_slug TEXT NULL, relType_slug TEXT NULL, to_slug TEXT NULL  ";


// reference dictionary, keyname, slug, and ipns are used as a source to update the rawFile,
// with the exception that any information stored under special keyword(s) (globalDynamicData_keywords)
// does not get updated using the external reference. These keywords are
myConceptGraph_class_fields = " ";
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

externalConceptGraph_class_fields = " ";
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

// dictionary_class_fields += " , keyname_rS TEXT NULL  ";

// dictionaryFields = " (id INTEGER PRIMARY KEY, keyname TEXT NULL, slug TEXT NULL, wordTypes TEXT NULL, ipns TEXT NULL, ipfs TEXT NULL, rawFile TEXT NULL, deleted INTEGER, UNIQUE(ipns) ) ";

// dictionaries rows:
// title - self-explanatory
// rootSchemaIPNS:
// numberOfWords:
// conceptGraphList: a list of conceptGraphs whose words are "rooted" in this dictionary.
myDictionaries_class_fields = " ";
myDictionaries_class_fields += "  id INTEGER PRIMARY KEY  ";
myDictionaries_class_fields += " , slug TEXT NULL  ";
myDictionaries_class_fields += " , title TEXT NULL  ";
myDictionaries_class_fields += " , tableName TEXT NULL  ";
myDictionaries_class_fields += " , description TEXT NULL  ";
myDictionaries_class_fields += " , rootSchemaIPNS TEXT NULL  ";
myDictionaries_class_fields += " , numberOfWords INTEGER NULL  ";
myDictionaries_class_fields += " , conceptGraphList TEXT NULL  ";

externalDictionaries_class_fields = " ";
externalDictionaries_class_fields += "  id INTEGER PRIMARY KEY  ";
externalDictionaries_class_fields += " , slug TEXT NULL  ";
externalDictionaries_class_fields += " , title TEXT NULL  ";
externalDictionaries_class_fields += " , tableName TEXT NULL  ";
externalDictionaries_class_fields += " , description TEXT NULL  ";
externalDictionaries_class_fields += " , rootSchemaIPNS TEXT NULL  ";
externalDictionaries_class_fields += " , numberOfWords INTEGER NULL  ";
externalDictionaries_class_fields += " , repoPeerID TEXT NULL  ";
externalDictionaries_class_fields += " , conceptGraphList TEXT NULL  ";

// conceptGraphs rows:
// title, tableName, slug, description - self-explanatory
// rootSchemaIPNS:
// repoPeerID:
// globalDynamicData_keywords: This is a list of top-level keywords that change dynamically as functions of the overall conceptGraph
// as of May 2021, this will typically be GlobalDynamicData.
// Every keyword not in globalDynamicData_keywords is subject to change at the dictionary level; any such changes are expected to be
// copied from the dictionary rawFile to the conceptGraph rawFile.
myConceptGraphs_class_fields = " ";
myConceptGraphs_class_fields += "  id INTEGER PRIMARY KEY  ";
myConceptGraphs_class_fields += " , slug TEXT NULL  ";
myConceptGraphs_class_fields += " , title TEXT NULL  ";
myConceptGraphs_class_fields += " , tableName TEXT NULL  ";
myConceptGraphs_class_fields += " , description TEXT NULL  ";
myConceptGraphs_class_fields += " , c2cRelationshipsCompactSummary_rawFile TEXT NULL  ";
myConceptGraphs_class_fields += " , rootSchemaIPNS TEXT NULL  ";
// myConceptGraphs_class_fields += " , referenceDictionary TEXT NULL  ";
myConceptGraphs_class_fields += " , referenceDictionary_slug TEXT NULL  ";
myConceptGraphs_class_fields += " , globalDynamicData_keywords TEXT NULL  ";

externalConceptGraphs_class_fields = " ";
externalConceptGraphs_class_fields += "  id INTEGER PRIMARY KEY  ";
externalConceptGraphs_class_fields += " , slug TEXT NULL  ";
externalConceptGraphs_class_fields += " , title TEXT NULL  ";
externalConceptGraphs_class_fields += " , tableName TEXT NULL  ";
externalConceptGraphs_class_fields += " , description TEXT NULL  ";
externalConceptGraphs_class_fields += " , rootSchemaIPNS TEXT NULL  ";
externalConceptGraphs_class_fields += " , repoPeerID TEXT NULL  ";
externalConceptGraphs_class_fields += " , referenceDictionary_slug TEXT NULL  ";
externalConceptGraphs_class_fields += " , globalDynamicData_keywords TEXT NULL  ";

function initAllTbls() {
    console.log('initAllTbls');
    // console.log('config_str: '+config_str);
    rootSchema_arr = config_obj["ConceptGraph"]["RootSchema"];
    numRootSchema = rootSchema_arr.length;

    // console.log('numRootSchema: '+numRootSchema);
    var db_init = new sqlite3.Database('./conceptGraph.db', sqlite3, (err) => {
        console.log('Trying to connect to db_init');
        if (err) {
            console.log('ERROR db_init');
            // return console.error(err.message);
            console.log("err.message: "+err.message);
        }
        // console.log('Connected to the in-memory SQlite database.');
        console.log('Connected db_init to the prettyGoodApps SQlite3 database.');
    });

    db_init.serialize(function() {
        // drop these 4 tables while I am in the process of designing them; later, comment out these drop commands
        resetTablesIn_myConceptGraphs = false;
        resetTablesIn_externalConceptGraphs = false;
        resetTablesIn_myDictionaries = false;
        resetTablesIn_externalDictionaries = false;

        resetTable_myConceptGraphs = false;
        resetTable_externalConceptGraphs = false;
        resetTable_myDictionaries = false;
        resetTable_externalDictionaries = false;

        resetAll_MyConceptGraphAndMyDictionaryTables = false;
        if (resetAll_MyConceptGraphAndMyDictionaryTables) {
            resetTablesIn_myConceptGraphs = true;
            resetTablesIn_myDictionaries = true;

            resetTable_myConceptGraphs = true;
            resetTable_myDictionaries = true;
        }

        if (resetTable_myConceptGraphs) { db_init.run("DROP TABLE IF EXISTS myConceptGraphs"); }
        if (resetTable_externalConceptGraphs) { db_init.run("DROP TABLE IF EXISTS externalConceptGraphs"); }
        if (resetTable_myDictionaries) { db_init.run("DROP TABLE IF EXISTS myDictionaries"); }
        if (resetTable_externalDictionaries) { db_init.run("DROP TABLE IF EXISTS externalDictionaries"); }

        // remake rootSchema table at every startup (need to do this?)
        db_init.run("DROP TABLE IF EXISTS rootSchemas");

        // delete these sometimes during debugging process

        // relationship-class tables
        // db_init.run("DROP TABLE IF EXISTS relationships");

        // dictionary-class tables created from config file
        // db_init.run("DROP TABLE IF EXISTS OnTheBlockchain_fullPublicActiveDictionary");
        // db_init.run("DROP TABLE IF EXISTS conceptGraph_mainSchema");
        // db_init.run("DROP TABLE IF EXISTS conceptGraph_pga");
        // db_init.run("DROP TABLE IF EXISTS conceptGraph_localConstruction");

        // dictionary-class tables not in config table (should they be added ???)
        // db_init.run("DROP TABLE IF EXISTS dictionary");

        //////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////
        // NEVER drop myDictionary! It is currently (3APR21) the sole repository of any words that I author
        // db_init.run("DROP TABLE IF EXISTS myDictionary");
        //////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////
    });

    db_init.serialize(function() {
        ///////////////////////////////////////////////////////////////////
        ///////////////////////// myConceptGraphs /////////////////////////
        createTableCommands = "CREATE TABLE IF NOT EXISTS myConceptGraphs ( ";
        createTableCommands += myConceptGraphs_class_fields;
        createTableCommands += " ) ";
        db_init.run(createTableCommands);

        // addRowCommands = "ALTER TABLE myConceptGraphs ADD COLUMN c2cRelationshipsCompactSummary_rawFile TEXT NULL ";
        // db_init.run(addRowCommands);

        if (resetTable_myConceptGraphs) {
        // if (1) {
            insertRowCommands = ` INSERT OR IGNORE INTO myConceptGraphs `;
            insertRowCommands += ` (title, tableName) `;
            insertRowCommands += ` VALUES('Pretty Good Apps Main Concept Graph (old)', 'conceptGraph_pga' ) `;
            db_init.run(insertRowCommands);
            insertRowCommands = ` INSERT OR IGNORE INTO myConceptGraphs `;
            insertRowCommands += ` (title, tableName) `;
            insertRowCommands += ` VALUES('Pretty Good Apps Main Concept Graph (new)', 'myConceptGraph_pga' ) `;
            db_init.run(insertRowCommands);
            insertRowCommands = ` INSERT OR IGNORE INTO myConceptGraphs `;
            insertRowCommands += ` (title, tableName) `;
            insertRowCommands += ` VALUES('Concept Graph: Temporary For Testing Shit', 'myConceptGraph_temporary' ) `;
            db_init.run(insertRowCommands);
            insertRowCommands = ` INSERT OR IGNORE INTO myConceptGraphs `;
            insertRowCommands += ` (title, tableName) `;
            insertRowCommands += ` VALUES('Concept Graph: Organisms', 'myConceptGraph_organisms' ) `;
            db_init.run(insertRowCommands);
            insertRowCommands = ` INSERT OR IGNORE INTO myConceptGraphs `;
            insertRowCommands += ` (title, tableName) `;
            insertRowCommands += ` VALUES('Concept Graph: Epistemologies', 'myConceptGraph_epistemologies' ) `;
            db_init.run(insertRowCommands);
            insertRowCommands = ` INSERT OR IGNORE INTO myConceptGraphs `;
            insertRowCommands += ` (title, tableName) `;
            insertRowCommands += ` VALUES('Concept Graph: 2WAY', 'myConceptGraph_2WAY' ) `;
            db_init.run(insertRowCommands);
        }
        if (resetTablesIn_myConceptGraphs) {
            db_init.run("DROP TABLE IF EXISTS myConceptGraph_pga");
            createTableCommands = "CREATE TABLE IF NOT EXISTS myConceptGraph_pga ( ";
            createTableCommands += myConceptGraph_class_fields;
            createTableCommands += " ) ";
            db_init.run(createTableCommands);

            db_init.run("DROP TABLE IF EXISTS myConceptGraph_temporary");
            createTableCommands = "CREATE TABLE IF NOT EXISTS myConceptGraph_temporary ( ";
            createTableCommands += myConceptGraph_class_fields;
            createTableCommands += " ) ";
            db_init.run(createTableCommands);

            db_init.run("DROP TABLE IF EXISTS myConceptGraph_organisms");
            createTableCommands = "CREATE TABLE IF NOT EXISTS myConceptGraph_organisms ( ";
            createTableCommands += myConceptGraph_class_fields;
            createTableCommands += " ) ";
            db_init.run(createTableCommands);

            db_init.run("DROP TABLE IF EXISTS myConceptGraph_epistemologies");
            createTableCommands = "CREATE TABLE IF NOT EXISTS myConceptGraph_epistemologies ( ";
            createTableCommands += myConceptGraph_class_fields;
            createTableCommands += " ) ";
            db_init.run(createTableCommands);

            db_init.run("DROP TABLE IF EXISTS myConceptGraph_2WAY");
            createTableCommands = "CREATE TABLE IF NOT EXISTS myConceptGraph_2WAY ( ";
            createTableCommands += myConceptGraph_class_fields;
            createTableCommands += " ) ";
            db_init.run(createTableCommands);
        }
        // db_init.run("INSERT OR IGNORE INTO myConceptGraphs (title, tableName, slug, description, rootSchemaIPNS) VALUES('Concept Graph Pretty Good Apps', 'conceptGraph_pga', 'conceptGraph_pga', 'a concept graph for Pretty Good Apps', 'notYetAssigned' )");

        ///////////////////////////////////////////////////////////////////
        ///////////////////////// externalConceptGraphs ///////////////////
        createTableCommands = "CREATE TABLE IF NOT EXISTS externalConceptGraphs ( ";
        createTableCommands += externalConceptGraphs_class_fields;
        createTableCommands += " ) ";
        db_init.run(createTableCommands);
        if (resetTable_externalConceptGraphs) {
            // db_init.run("INSERT OR IGNORE INTO externalConceptGraphs (title) VALUES('Concept Graph Pretty Good Apps')");
            insertRowCommands = ` INSERT OR IGNORE INTO externalConceptGraphs `;
            insertRowCommands += ` (title, tableName, slug, description, rootSchemaIPNS, repoPeerID) `;
            insertRowCommands += ` VALUES('OnTheBlockchain Main Root Schema', 'conceptGraph_mainSchema', 'conceptGraph_mainSchema', 'OnTheBlockchain main schema', 'QmQ6VCXHkzGduoBZtK5JCUZ8bqJTUpoXXvQ1J6F1rYaAqJ', 'QmXvSDSxcgRfPzXLhet8SEbrtA36paH6rUrM64bzBWksZB' ) `;
            db_init.run(insertRowCommands);
            // db_init.run("INSERT OR IGNORE INTO externalConceptGraphs (title, tableName, slug, description, rootSchemaIPNS, repoPeerID) VALUES('Concept Graph: OnTheBlockchain Main Schema', 'conceptGraph_mainSchema', 'conceptGraph_mainSchema', 'OnTheBlockchain main schema', 'QmQ6VCXHkzGduoBZtK5JCUZ8bqJTUpoXXvQ1J6F1rYaAqJ', 'QmXvSDSxcgRfPzXLhet8SEbrtA36paH6rUrM64bzBWksZB' )");
        }
        if (resetTablesIn_externalConceptGraphs) {
            /*
            db_init.run("DROP TABLE IF EXISTS conceptGraph_mainSchema");
            createTableCommands = "CREATE TABLE IF NOT EXISTS conceptGraph_mainSchema ( ";
            createTableCommands += externalConceptGraph_class_fields;
            createTableCommands += " ) ";
            db_init.run(createTableCommands);
            */
        }

        ///////////////////////////////////////////////////////////////////
        ///////////////////////// myDictionaries //////////////////////////
        createTableCommands = "CREATE TABLE IF NOT EXISTS myDictionaries ( ";
        createTableCommands += myDictionaries_class_fields;
        createTableCommands += " ) ";
        db_init.run(createTableCommands);
        if (resetTable_myDictionaries) {
        // if (1) {
            insertRowCommands = ` INSERT OR IGNORE INTO myDictionaries `;
            insertRowCommands += ` (title, tableName) `;
            insertRowCommands += ` VALUES('Pretty Good Apps Main Dictionary', 'myDictionary' ) `;
            db_init.run(insertRowCommands);

            insertRowCommands = ` INSERT OR IGNORE INTO myDictionaries `;
            insertRowCommands += ` (title, tableName) `;
            insertRowCommands += ` VALUES('Test Dictionary for Inter-Dictionary Transfers', 'myTemporaryDictionary' ) `;
            db_init.run(insertRowCommands);
        }

        if (resetTablesIn_myDictionaries) {
            db_init.run("DROP TABLE IF EXISTS myDictionary");
            createTableCommands = "CREATE TABLE IF NOT EXISTS myDictionary ( ";
            createTableCommands += myDictionary_class_fields;
            createTableCommands += " ) ";
            db_init.run(createTableCommands);

            db_init.run("DROP TABLE IF EXISTS myTemporaryDictionary");
            createTableCommands = "CREATE TABLE IF NOT EXISTS myTemporaryDictionary ( ";
            createTableCommands += myDictionary_class_fields;
            createTableCommands += " ) ";
            db_init.run(createTableCommands);
        }


        ///////////////////////////////////////////////////////////////////
        ///////////////////////// externalDictionaries ////////////////////
        createTableCommands = "CREATE TABLE IF NOT EXISTS externalDictionaries ( ";
        createTableCommands += externalDictionaries_class_fields;
        createTableCommands += " ) ";
        db_init.run(createTableCommands);
        if (resetTable_externalDictionaries) {
            insertRowCommands = ` INSERT OR IGNORE INTO externalDictionaries `;
            insertRowCommands += ` (title, tableName, slug, description, rootSchemaIPNS, numberOfWords, repoPeerID) `;
            insertRowCommands += ` VALUES('OnTheBlockchain Public Active Dictionary', 'dictionary', 'schemaRepoForPublicActiveDictionary', 'all words that OnTheBlockchain includes in its active dictionary list (excludes discarded, draft, private, etc)', 'QmYicjt5MDrktdYdN7hy47G3Ry6nHkNFJEPm1AGK98VYFc', 1355, 'QmXvSDSxcgRfPzXLhet8SEbrtA36paH6rUrM64bzBWksZB' ) `;
            db_init.run(insertRowCommands);

            /*
            insertRowCommands = ` INSERT OR IGNORE INTO externalDictionaries `;
            insertRowCommands += ` (title, tableName, slug, description, rootSchemaIPNS, numberOfWords, repoPeerID) `;
            insertRowCommands += ` VALUES('OnTheBlockchain Public Active Dictionary', 'externalDictionary_OnTheBlockchain_fullPublicActiveDictionary', 'schemaRepoForPublicActiveDictionary', 'all words that OnTheBlockchain includes in its active dictionary list (excludes discarded, draft, private, etc)', 'QmYicjt5MDrktdYdN7hy47G3Ry6nHkNFJEPm1AGK98VYFc', 1355, 'QmXvSDSxcgRfPzXLhet8SEbrtA36paH6rUrM64bzBWksZB' ) `;
            db_init.run(insertRowCommands);
            // db_init.run("INSERT OR IGNORE INTO externalDictionaries (title, tableName, slug, description, rootSchemaIPNS, numberOfWords, repoPeerID) VALUES('OnTheBlockchain Public Active Dictionary', 'externalDictionary_OnTheBlockchain_fullPublicActiveDictionary', 'schemaRepoForPublicActiveDictionary', 'all words that OnTheBlockchain includes in its active dictionary list (excludes discarded, draft, private, etc)', 'QmYicjt5MDrktdYdN7hy47G3Ry6nHkNFJEPm1AGK98VYFc', 1355, 'QmXvSDSxcgRfPzXLhet8SEbrtA36paH6rUrM64bzBWksZB' )");
            */
        }
        if (resetTablesIn_externalDictionaries) {
            /*
            db_init.run("DROP TABLE IF EXISTS externalDictionary_OnTheBlockchain_fullPublicActiveDictionary");
            createTableCommands = "CREATE TABLE IF NOT EXISTS externalDictionary_OnTheBlockchain_fullPublicActiveDictionary ( ";
            createTableCommands += externalDictionary_class_fields;
            createTableCommands += " ) ";
            db_init.run(createTableCommands);
            */
        }

        // db_init.run("DROP TABLE relationships");
        // read config file at startup, fetch rawFiles from ipfs or endpoints and place them in rootSchemas table
        // db_init.run("DROP TABLE rootSchemas");

        // db_init.run("DROP TABLE compactConceptSummaries");
        run_createCompactConceptSummaries = " CREATE TABLE IF NOT EXISTS compactConceptSummaries ( ";
        run_createCompactConceptSummaries += " id INTEGER PRIMARY KEY  ";
        run_createCompactConceptSummaries += " , conceptName TEXT NULL  ";
        run_createCompactConceptSummaries += " , rawFile TEXT NULL  ";
        run_createCompactConceptSummaries += " , UNIQUE(conceptName)  ";
        run_createCompactConceptSummaries += " ) ";
        db_init.run(run_createCompactConceptSummaries);

        run_createRootSchemas = " CREATE TABLE IF NOT EXISTS rootSchemas ( ";
        run_createRootSchemas += " id INTEGER PRIMARY KEY  ";
        run_createRootSchemas += " , slug TEXT NULL  ";
        run_createRootSchemas += " , ipns TEXT NULL  ";
        run_createRootSchemas += " , ipfs TEXT NULL  ";
        run_createRootSchemas += " , title_rS TEXT NULL  ";
        run_createRootSchemas += " , table_rS TEXT NULL  ";
        run_createRootSchemas += " , comments_rS TEXT NULL  ";
        run_createRootSchemas += " , rawFile TEXT NULL  ";
        run_createRootSchemas += " , keyname TEXT NULL  ";
        run_createRootSchemas += " , UNIQUE(ipns) ";
        run_createRootSchemas += " ) ";
        db_init.run(run_createRootSchemas);
        // future: run script to insert these from config
        rootSchemaList_arr = config_obj["ConceptGraph"]["RootSchema"];
        numRootSchemas = rootSchemaList_arr.length;
        console.log("numRootSchemas, db_init: "+numRootSchemas);

        for (x=0;x<numRootSchemas;x++) {
            tableName = rootSchemaList_arr[x]["table"];
            console.log("createTableIdNeededFromConfig, tableName: "+tableName);
            createTableCommands = "CREATE TABLE IF NOT EXISTS "+tableName+" ( ";
            createTableCommands += dictionary_class_fields;
            createTableCommands += " ) ";
            db_init.run(createTableCommands);

            db_init.run("INSERT OR IGNORE INTO rootSchemas (id) VALUES("+x+") ");
        }

        // db_init.run("CREATE TABLE IF NOT EXISTS dictionary (id INTEGER PRIMARY KEY, keyname TEXT NULL, slug TEXT NULL, wordTypes TEXT NULL, ipns TEXT NULL, ipfs TEXT NULL, rawFile TEXT NULL, deleted INTEGER, UNIQUE(ipns) )");
        // db_init.run("CREATE TABLE IF NOT EXISTS relationships (id INTEGER PRIMARY KEY, from_slug TEXT NULL, relType_slug TEXT NULL, to_slug TEXT NULL )");
        createTableCommands = "CREATE TABLE IF NOT EXISTS relationships ( ";
        createTableCommands += relationships_class_fields;
        createTableCommands += " ) ";
        db_init.run(createTableCommands);

        // create all dictionary-class tables if not already existing
        createTableCommands = "CREATE TABLE IF NOT EXISTS conceptGraph_localConstruction ( ";
        createTableCommands += myConceptGraph_class_fields;
        createTableCommands += " ) ";
        db_init.run(createTableCommands);

        createTableCommands = "CREATE TABLE IF NOT EXISTS dictionary ( ";
        createTableCommands += externalDictionary_class_fields;
        createTableCommands += " ) ";
        db_init.run(createTableCommands);

        createTableCommands = "CREATE TABLE IF NOT EXISTS myDictionary ( ";
        createTableCommands += myDictionary_class_fields;
        createTableCommands += " ) ";
        db_init.run(createTableCommands);

        for (c=0;c<numRootSchema;c++) {
            nextRootSchemaTableName = rootSchema_arr[c]["table"];
            initCommands = "CREATE TABLE IF NOT EXISTS "+nextRootSchemaTableName+" ( ";
            initCommands += dictionary_class_fields;
            initCommands += " ) ";
            db_init.run(initCommands);
        }

        // db.run("DROP TABLE dictionary");
        // db_init.run("INSERT OR IGNORE INTO dictionary (keyname, slug, wordTypes, ipns, ipfs, rawFile, deleted) VALUES('OTBuser_136-schema', 'mainSchema', 'wordTypes', 'QmQ6VCXHkzGduoBZtK5JCUZ8bqJTUpoXXvQ1J6F1rYaAqJ', 'QmTPS57GfHv2YtdvB832UoW4ZGaksFjCEW4DqcuBJEDZVa', 'rawFile_str', 0)");
        // db.run("SELECT ipns FROM dictionary; ");

        run_wordTemplatesByWordType = " CREATE TABLE IF NOT EXISTS wordTemplatesByWordType ( ";
        run_wordTemplatesByWordType += " id INTEGER PRIMARY KEY  ";
        run_wordTemplatesByWordType += " , wordType TEXT NULL  ";
        run_wordTemplatesByWordType += " , rawFile TEXT '{}'  ";
        run_wordTemplatesByWordType += " , UNIQUE(wordType) ";
        run_wordTemplatesByWordType += " ) ";
        db_init.run(run_wordTemplatesByWordType);
    });

    db_init.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Close the db_init database connection.');
    });
}
