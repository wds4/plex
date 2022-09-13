
const jQuery = require("jquery");

const generateSqlCommand_wordTypes = (actionType,tableName) => {
    var commandHTML = "";
    var currWordTypeSqlId = jQuery("#currWordTypeSqlId").val();
    var newWordTypeSlug = jQuery("#newWordTypeSlug").val();
    var newWordTypeName = jQuery("#newWordTypeName").val();
    var newWordTypeBackgroundColor = jQuery("#newWordTypeBackgroundColor").val();
    var newWordTypeBorderColor = jQuery("#newWordTypeBorderColor").val();
    var newWordTypeShape = jQuery("#newWordTypeShape").val();
    var newWordTypeBorderWidth = jQuery("#newWordTypeBorderWidth").val();
    var newWordTypeDescription = jQuery("#newWordTypeDescription").val();
    var newWordTypeTemplate = jQuery("#newWordTypeTemplate").val();
    var newWordTypeSchema = jQuery("#newWordTypeSchema").val();

    newWordTypeTemplate = JSON.stringify(JSON.parse(newWordTypeTemplate),null,0)
    newWordTypeSchema = JSON.stringify(JSON.parse(newWordTypeSchema),null,0)

    if (actionType=="makeNew") {
        commandHTML += "INSERT OR IGNORE INTO "+tableName;
        commandHTML += " (slug, name, template, schema, description, backgroundColor, borderColor, shape, borderWidth) ";
        commandHTML += " VALUES(";
        commandHTML += " '"+newWordTypeSlug+"', ";
        commandHTML += " '"+newWordTypeName+"', ";
        commandHTML += " '"+newWordTypeTemplate+"', ";
        commandHTML += " '"+newWordTypeSchema+"', ";
        commandHTML += " '"+newWordTypeDescription+"', ";
        commandHTML += " '"+newWordTypeBackgroundColor+"', ";
        commandHTML += " '"+newWordTypeBorderColor+"', ";
        commandHTML += " '"+newWordTypeShape+"', ";
        commandHTML += " '"+newWordTypeBorderWidth+"' ";
        commandHTML += " )";
    }
    if (actionType=="editExisting") {
        commandHTML += "UPDATE "+tableName;
        commandHTML += " SET ";
        commandHTML += "slug ='"+newWordTypeSlug+"', ";
        commandHTML += "name ='"+newWordTypeName+"', ";
        commandHTML += "template ='"+newWordTypeTemplate+"', ";
        commandHTML += "schema ='"+newWordTypeSchema+"', ";
        commandHTML += "description ='"+newWordTypeDescription+"', ";
        commandHTML += "backgroundColor ='"+newWordTypeBackgroundColor+"', ";
        commandHTML += "borderColor ='"+newWordTypeBorderColor+"', ";
        commandHTML += "shape ='"+newWordTypeShape+"', ";
        commandHTML += "borderWidth ='"+newWordTypeBorderWidth+"' ";
        commandHTML += " WHERE id='"+currWordTypeSqlId+"' ";
    }
    if (actionType=="deleteExisting") {
        commandHTML += "DELETE FROM "+tableName;
        commandHTML += " WHERE id='"+currWordTypeSqlId+"' ";
    }
    jQuery("#sqlCommandContainer").html(commandHTML);
    jQuery("#sqlCommandContainer").val(commandHTML);
}

const generateSqlCommand_relationshipTypes = (actionType,tableName) => {
    var commandHTML = "";
    var currRelTypeSqlId = jQuery("#currRelTypeSqlId").val()
    if (actionType=="makeNew") {
        commandHTML += "INSERT OR IGNORE INTO "+tableName;
        commandHTML += " (slug, name, template, schema, description, color, polarity, width, dashes) ";
        commandHTML += " VALUES(";
        /*
        commandHTML += " '"++"', ";
        commandHTML += " '"++"', ";
        commandHTML += " '"++"', ";
        commandHTML += " '"++"', ";
        commandHTML += " '"++"', ";
        commandHTML += " '"++"', ";
        commandHTML += " '"++"', ";
        commandHTML += " '"++"', ";
        commandHTML += " '"++"' ";
        */
        commandHTML += " )";
    }
    if (actionType=="editExisting") {
        commandHTML += "UPDATE "+tableName;

        commandHTML += " SET ";
        commandHTML += " WHERE id='"+currRelTypeSqlId+"' ";
    }
    if (actionType=="deleteExisting") {
        commandHTML += "DELETE FROM "+tableName;
        commandHTML += " WHERE id='"+currRelTypeSqlId+"' ";
    }
    jQuery("#sqlCommandContainer").html(commandHTML);
    jQuery("#sqlCommandContainer").val(commandHTML);
}

const generateSqlCommand_s1n = (actionType,tableName) => {
    var commandHTML = "";

    jQuery("#sqlCommandContainer").html(commandHTML);
    jQuery("#sqlCommandContainer").val(commandHTML);
}

const generateSqlCommand_s1r = (actionType,tableName) => {
    var commandHTML = "";
    var currPatternSqlId = jQuery("#currPatternSqlId").val()
    var newPatternName = jQuery("#newPatternName").val()
    var newOpCodesB = jQuery("#newOpCodesB").val()
    var newOpCodeD = jQuery("#newOpCodeD").val()
    var newActionsList = jQuery("#newActionsList").val()
    var newDescription = jQuery("#newDescription").val()
    var newWordTypeFrom = jQuery("#newWordTypeFrom").val()
    var newRelationshipType = jQuery("#newRelationshipType").val()
    var newWordTypeTo = jQuery("#newWordTypeTo").val()
    if (actionType=="makeNew") {
        commandHTML += "INSERT OR IGNORE INTO "+tableName;
        commandHTML += " (patternName, opCodesB, opCodeD, actionsList, description, wordType_from, relationshipType, wordType_to) ";
        commandHTML += " VALUES(";
        commandHTML += " '"+newPatternName+"', ";
        commandHTML += " '"+newOpCodesB+"', ";
        commandHTML += " '"+newOpCodeD+"', ";
        commandHTML += " '"+newActionsList+"', ";
        commandHTML += " '"+newDescription+"', ";
        commandHTML += " '"+newWordTypeFrom+"', ";
        commandHTML += " '"+newRelationshipType+"', ";
        commandHTML += " '"+newWordTypeTo+"' ";
        commandHTML += " )";
    }
    if (actionType=="editExisting") {
        commandHTML += "UPDATE "+tableName;
        commandHTML += " SET ";
        commandHTML += " patternName='"+newPatternName+"', ";
        commandHTML += " opCodesB='"+newOpCodesB+"', ";
        commandHTML += " opCodeD='"+newOpCodeD+"', ";
        commandHTML += " actionsList='"+newActionsList+"', ";
        commandHTML += " description='"+newDescription+"', ";
        commandHTML += " wordType_from='"+newWordTypeFrom+"', ";
        commandHTML += " relationshipType='"+newRelationshipType+"', ";
        commandHTML += " wordType_to='"+newWordTypeTo+"' ";
        commandHTML += " WHERE id='"+currPatternSqlId+"' ";
    }
    if (actionType=="deleteExisting") {
        commandHTML += "DELETE FROM "+tableName;
        commandHTML += " WHERE id='"+currPatternSqlId+"' ";
    }
    jQuery("#sqlCommandContainer").html(commandHTML);
    jQuery("#sqlCommandContainer").val(commandHTML);
}

const generateSqlCommand_s2r = (actionType,tableName) => {
    console.log("generateSqlCommand_s2r; actionType: "+actionType)
    var commandHTML = "";
    var currPatternSqlId = jQuery("#currPatternSqlId").val()
    var newPatternName = jQuery("#newPatternName").val()
    var newOpCodesB = jQuery("#newOpCodesB").val()
    var newOpCodeD = jQuery("#newOpCodeD").val()
    var newActionsList = jQuery("#newActionsList").val()
    var newDescription = jQuery("#newDescription").val()
    var newWordTypeA = jQuery("#newWordTypeA").val()
    var newRelationshipTypeA = jQuery("#newRelationshipTypeA").val()
    var newWordTypeB = jQuery("#newWordTypeB").val()
    var newRelationshipTypeB = jQuery("#newRelationshipTypeB").val()
    var newWordTypeC = jQuery("#newWordTypeC").val()
    if (actionType=="makeNew") {
        commandHTML += "INSERT OR IGNORE INTO "+tableName;
        commandHTML += " (patternName, opCodesB, opCodeD, actionsList, description, wordType_A, relationshipType_A, wordType_B, relationshipType_B, wordType_C) ";
        commandHTML += " VALUES(";
        commandHTML += " '"+newPatternName+"', ";
        commandHTML += " '"+newOpCodesB+"', ";
        commandHTML += " '"+newOpCodeD+"', ";
        commandHTML += " '"+newActionsList+"', ";
        commandHTML += " '"+newDescription+"', ";
        commandHTML += " '"+newWordTypeA+"', ";
        commandHTML += " '"+newRelationshipTypeA+"', ";
        commandHTML += " '"+newWordTypeB+"', ";
        commandHTML += " '"+newRelationshipTypeB+"', ";
        commandHTML += " '"+newWordTypeC+"' ";
        commandHTML += " )";
    }
    if (actionType=="editExisting") {
        commandHTML += "UPDATE "+tableName;
        commandHTML += " SET ";
        commandHTML += " patternName='"+newPatternName+"', ";
        commandHTML += " opCodesB='"+newOpCodesB+"', ";
        commandHTML += " opCodeD='"+newOpCodeD+"', ";
        commandHTML += " actionsList='"+newActionsList+"', ";
        commandHTML += " description='"+newDescription+"', ";
        commandHTML += " wordType_A='"+newWordTypeA+"', ";
        commandHTML += " relationshipType_A='"+newRelationshipTypeA+"', ";
        commandHTML += " wordType_B='"+newWordTypeB+"', ";
        commandHTML += " relationshipType_B='"+newRelationshipTypeB+"', ";
        commandHTML += " wordType_C='"+newWordTypeC+"' ";
        commandHTML += " WHERE id='"+currPatternSqlId+"' ";
    }
    if (actionType=="deleteExisting") {
        commandHTML += "DELETE FROM "+tableName;
        commandHTML += " WHERE id='"+currPatternSqlId+"' ";
    }
    jQuery("#sqlCommandContainer").html(commandHTML);
    jQuery("#sqlCommandContainer").val(commandHTML);
}

export { generateSqlCommand_s1n, generateSqlCommand_s1r, generateSqlCommand_s2r, generateSqlCommand_wordTypes, generateSqlCommand_relationshipTypes }
