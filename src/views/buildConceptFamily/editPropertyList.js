import React from "react";
import IpfsHttpClient from 'ipfs-http-client';
import sendAsync from '../../renderer';
import { lookupRawFileBySlug_obj, templatesByWordType_obj, insertOrUpdateWordIntoMyDictionary, insertOrUpdateWordIntoMyConceptGraph } from '../addANewConcept';
import Type3ModuleB from './propertyType3ModuleB';
const jQuery = require("jquery");

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});

var propertyEntryLookup = {};

async function loadPropertyList_editPropertyList() {
    var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");

    var t1SelectorHTML = "";
    var t2SelectorHTML = "";
    var t3SelectorHTML = "";

    t1SelectorHTML += "<select id=t1selector >";
    t2SelectorHTML += "<select id=t2selector >";
    t3SelectorHTML += "<select id=t3selector >";

    t1SelectorHTML += "<option data-propertykey='__noneChosen__' ></option>";
    t2SelectorHTML += "<option data-propertykey='__noneChosen__' ></option>";
    t3SelectorHTML += "<option data-propertykey='__noneChosen__' ></option>";

    var sql = "";
    sql += " SELECT * FROM "+myConceptGraph;
    var doesPropertyListAlreadyExist = false;
    sendAsync(sql).then(async (words_arr) => {
        var numWords = words_arr.length;
        console.log("editPropertyList numWords: "+numWords)
        for (var w=0;w<numWords;w++) {
            console.log("editPropertyList w: "+w)
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_ipns = nextWord_obj.metaData.ipns;
            // console.log("w: "+w+"; nextWord_slug: "+nextWord_slug)
            var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
            // check to see whether mainSchemaForConceptGraph already exists!
            if (jQuery.inArray("propertyList",nextWord_wordTypes_arr) > -1) {
                doesPropertyListAlreadyExist = true;
                jQuery("#propertyListSlugContainer").html(nextWord_slug)

                var t1PropList_obj = nextWord_obj.propertyListData.properties.type1;
                var t2PropList_obj = nextWord_obj.propertyListData.properties.type2;
                var t3PropList_obj = nextWord_obj.propertyListData.properties.type3;

                jQuery.each(t1PropList_obj,function(propertyKey,propertyEntry){
                    // console.log("propertyKey: "+propertyKey)
                    t1SelectorHTML += "<option data-propertykey='"+propertyKey+"' >";
                    t1SelectorHTML += propertyKey;
                    t1SelectorHTML += "</option>";

                    propertyEntryLookup[propertyKey] = propertyEntry;
                });

                jQuery.each(t2PropList_obj,function(propertyKey,propertyEntry){
                    // console.log("propertyKey: "+propertyKey)
                    t2SelectorHTML += "<option data-propertykey='"+propertyKey+"' >";
                    t2SelectorHTML += propertyKey;
                    t2SelectorHTML += "</option>";

                    propertyEntryLookup[propertyKey] = propertyEntry;
                });

                jQuery.each(t3PropList_obj,function(propertyKey,propertyEntry){
                    // console.log("propertyKey: "+propertyKey)
                    t3SelectorHTML += "<option data-propertykey='"+propertyKey+"' >";
                    t3SelectorHTML += propertyKey;
                    t3SelectorHTML += "</option>";

                    propertyEntryLookup[propertyKey] = propertyEntry;
                });
            }
        }
        if (!doesPropertyListAlreadyExist) {
            jQuery("#propertyListSlugContainer").html("propertyList does not exist for this conceptGraph")
        }
        t1SelectorHTML += "</select>";
        t2SelectorHTML += "</select>";
        t3SelectorHTML += "</select>";

        jQuery("#type1propertiesContainer").html(t1SelectorHTML)
        jQuery("#type2propertiesContainer").html(t2SelectorHTML)
        jQuery("#type3propertiesContainer").html(t3SelectorHTML)

        jQuery("#t1selector").change(function(){
            var propKey = jQuery("#t1selector option:selected").data("propertykey")
            document.getElementById("t2selector").selectedIndex = 0;
            document.getElementById("t3selector").selectedIndex = 0;
            // console.log("t1selector changed; propKey: "+propKey);
            if (propKey == "__noneChosen__") {
                jQuery("#existingPropertyEntry").html("");
                jQuery("#existingPropertyEntry").val("");
            } else {
                var propEntry_obj = propertyEntryLookup[propKey]
                var propEntry_str = JSON.stringify(propEntry_obj,null,4);
                jQuery("#existingPropertyEntry").html(propEntry_str);
                jQuery("#existingPropertyEntry").val(propEntry_str);
            }
        })

        jQuery("#t2selector").change(function(){
            var propKey = jQuery("#t2selector option:selected").data("propertykey")
            document.getElementById("t1selector").selectedIndex = 0;
            document.getElementById("t3selector").selectedIndex = 0;
            console.log("t2selector changed; propKey: "+propKey);
            if (propKey == "__noneChosen__") {
                jQuery("#existingPropertyEntry").html("");
                jQuery("#existingPropertyEntry").val("");
            } else {
                var propEntry_obj = propertyEntryLookup[propKey]
                var propEntry_str = JSON.stringify(propEntry_obj,null,4);
                jQuery("#existingPropertyEntry").html(propEntry_str);
                jQuery("#existingPropertyEntry").val(propEntry_str);
            }
        })

        jQuery("#t3selector").change(function(){
            var propKey = jQuery("#t3selector option:selected").data("propertykey")
            document.getElementById("t1selector").selectedIndex = 0;
            document.getElementById("t2selector").selectedIndex = 0;
            console.log("t3selector changed; propKey: "+propKey);
            if (propKey == "__noneChosen__") {
                jQuery("#existingPropertyEntry").html("");
                jQuery("#existingPropertyEntry").val("");
            } else {
                var propEntry_obj = propertyEntryLookup[propKey]
                var propEntry_str = JSON.stringify(propEntry_obj,null,4);
                jQuery("#existingPropertyEntry").html(propEntry_str);
                jQuery("#existingPropertyEntry").val(propEntry_str);
            }
        })
    });
}

async function createPropertyList() {
    var doesPropertyListAlreadyExist = false;
    var propertyList_obj = JSON.parse(JSON.stringify(templatesByWordType_obj["propertyList"]));
    var myConceptGraph_slug = jQuery("#myConceptGraphSelector option:selected ").data("conceptgraphslug");
    var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");
    var myDictionary = jQuery("#myConceptGraphSelector option:selected ").data("dictionarytablename");

    var myConceptGraph
    var pL_slug = "propertyListFor_"+myConceptGraph_slug;
    var pL_title = "Property List for "+myConceptGraph_slug;
    var pL_name = "property list for "+myConceptGraph_slug;
    propertyList_obj.wordData.slug = pL_slug;
    propertyList_obj.wordData.title = pL_title;
    propertyList_obj.wordData.name = pL_name;

    propertyList_obj.propertyListData.metaData.governingConceptGraph.slug = myConceptGraph_slug;

    propertyList_obj.globalDynamicData.myDictionaries.push(myDictionary);
    propertyList_obj.globalDynamicData.myConceptGraphs.push(myConceptGraph);

    var currentTime = Date.now();
    var newKeyname = "dictionaryWord_"+pL_slug+"_"+currentTime;
    var generatedKey_obj = await ipfs.key.gen(newKeyname, {
        type: 'rsa',
        size: 2048
    })
    var pL_ipns = generatedKey_obj["id"];
    var generatedKey_name = generatedKey_obj["name"];
    // console.log("generatedKey_obj id: "+pL_ipns+"; name: "+generatedKey_name);
    propertyList_obj.metaData.ipns = pL_ipns;

    var sql = "";
    sql += " SELECT * FROM "+myConceptGraph;

    sendAsync(sql).then((words_arr) => {
        var numWords = words_arr.length;
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_ipns = nextWord_obj.metaData.ipns;
            // console.log("w: "+w+"; nextWord_slug: "+nextWord_slug)
            var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
            if (jQuery.inArray("propertyList",nextWord_wordTypes_arr) > -1) {
                doesPropertyListAlreadyExist = true;
            }
        }
        var propertyList_str = JSON.stringify(propertyList_obj,null,4);
        // console.log("doesPropertyListAlreadyExist: "+doesPropertyListAlreadyExist+"; propertyList_str: "+propertyList_str)
        if (!doesPropertyListAlreadyExist) {
            // console.log("inserting new propertyList into conceptGraph and dictionary tables")
            insertOrUpdateWordIntoMyConceptGraph(myConceptGraph,myDictionary,propertyList_str,pL_slug,newKeyname,pL_ipns);
            insertOrUpdateWordIntoMyDictionary(myDictionary,propertyList_str,pL_slug,newKeyname,pL_ipns);
        }
    });
}
function makeNewType2SetSelector() {
    var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");

    var selectorHTML = "";
    selectorHTML += "<select id='newType2SetSelector' >";

    var conceptSlug = jQuery("#newType2ConceptSelector option:selected").data("conceptslug");
    // console.log("makeNewType2SetSelector; conceptSlug: "+conceptSlug);

    if (lookupRawFileBySlug_obj.hasOwnProperty(conceptSlug)) {
        var concept_obj = lookupRawFileBySlug_obj[conceptSlug];
        var concept_str = JSON.stringify(concept_obj,null,4);

        var concept_superser_slug = concept_obj.conceptData.nodes.superset.slug;
        selectorHTML += "<option data-setslug='"+concept_superser_slug+"' >";
        selectorHTML += concept_superser_slug;
        selectorHTML += "</option>";

        var sets_arr = concept_obj.globalDynamicData.sets;
        var numSets = sets_arr.length;

        for (var s=0;s<numSets;s++) {
            var nextSet_slug = sets_arr[s];
            selectorHTML += "<option data-setslug='"+nextSet_slug+"' >";
            selectorHTML += nextSet_slug;
            selectorHTML += "</option>";
        }
    }

    selectorHTML += "</select>";
    jQuery("#newType2SetSelectorContainer").html(selectorHTML);

}
async function makeNewType2ConceptSelector() {
    var myConceptGraph = jQuery("#myConceptGraphSelector option:selected ").data("tablename");

    var sql = "";
    sql += " SELECT * FROM "+myConceptGraph;

    var selectorHTML = "";
    selectorHTML += "<select id='newType2ConceptSelector' >";

    sendAsync(sql).then( async (words_arr) => {
        var numWords = words_arr.length;
        console.log("numWords: "+numWords)
        for (var w=0;w<numWords;w++) {
            var nextWord_str = words_arr[w]["rawFile"];
            var nextWord_obj = JSON.parse(nextWord_str);
            var nextWord_slug = nextWord_obj.wordData.slug;
            var nextWord_ipns = nextWord_obj.metaData.ipns;
            // console.log("w: "+w+"; nextWord_slug: "+nextWord_slug)
            var nextWord_wordTypes_arr = nextWord_obj.wordData.wordTypes;
            if (jQuery.inArray("concept",nextWord_wordTypes_arr) > -1) {
                selectorHTML += "<option data-conceptslug='"+nextWord_slug+"' data-conceptipns='"+nextWord_ipns+"' >";
                selectorHTML += nextWord_slug;
                selectorHTML += "</option>";
            }
        }
        selectorHTML += "</select>";
        jQuery("#newType2ConceptSelectorContainer").html(selectorHTML);
        makeNewType2SetSelector();
        jQuery("#newType2ConceptSelector").change(function(){
            console.log("makeNewType2SetSelector pre")
            makeNewType2SetSelector();
            console.log("makeNewType2SetSelector post")
        });
    });

}
export default class EditPropertyList extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        // console.log("here in componentDidMount; "+this.props.type3ModuleBList.length);
        jQuery("#createPropertyListButton").click(function(){
            createPropertyList()
        });
        loadPropertyList_editPropertyList();

        makeNewType2ConceptSelector();
        jQuery("#makeNewPropTypeSelector").change(function(){
            var newType = jQuery("#makeNewPropTypeSelector option:selected").data("type")
            console.log("makeNewPropTypeSelector; newType: "+newType)
            jQuery("#makeNewType1PropContainer").css("display","none");
            jQuery("#makeNewType2PropContainer").css("display","none");
            jQuery("#makeNewType3PropContainer").css("display","none");
            if (newType=="type1") {
                jQuery("#makeNewType1PropContainer").css("display","block");
            }
            if (newType=="type2") {
                jQuery("#makeNewType2PropContainer").css("display","block");
            }
            if (newType=="type3") {
                jQuery("#makeNewType3PropContainer").css("display","block");
            }
        });
        jQuery("#makeNewType1PropContainer").change(function(){
            console.log("makeNewType1PropContainer change: ")
            var newType1PropertyKey = jQuery("#newType1PropertyKey").val();
            var newType1Title = jQuery("#newType1Title").val();
            var newType1Description = jQuery("#newType1Description").val();
            var newType1Default = jQuery("#newType1Default").val();
            var newType1DefaultCheckbox = jQuery("#newType1DefaultCheckbox").is(":checked");

            var newPropListEntry_obj = {};
            newPropListEntry_obj[newType1PropertyKey] = {};
            newPropListEntry_obj[newType1PropertyKey].conceptGraphStyle = {};
            newPropListEntry_obj[newType1PropertyKey].JSONSchemaStyle = {};
            newPropListEntry_obj[newType1PropertyKey].conceptGraphStyle.title = newType1Title;
            newPropListEntry_obj[newType1PropertyKey].conceptGraphStyle.description = newType1Description;
            newPropListEntry_obj[newType1PropertyKey].conceptGraphStyle.includeDefault = newType1DefaultCheckbox;
            newPropListEntry_obj[newType1PropertyKey].conceptGraphStyle.default = newType1Default;
            newPropListEntry_obj[newType1PropertyKey].JSONSchemaStyle.type = "string";
            newPropListEntry_obj[newType1PropertyKey].JSONSchemaStyle.title = newType1Title;
            if (newType1Description) { newPropListEntry_obj[newType1PropertyKey].JSONSchemaStyle.description = newType1Description; }
            if (newType1DefaultCheckbox) { newPropListEntry_obj[newType1PropertyKey].JSONSchemaStyle.default = newType1Default; }

            var newPropListEntry_str = JSON.stringify(newPropListEntry_obj,null,4);
            jQuery("#newType1PropertyEntry").html(newPropListEntry_str)
            jQuery("#newType1PropertyEntry").val(newPropListEntry_str)
        });
        jQuery("#makeNewType2PropContainer").change(function(){
            console.log("makeNewType2PropContainer change: ")
            var newType2PropertyKey = jQuery("#newType2PropertyKey").val();
            var newType2Title = jQuery("#newType2Title").val();
            var newType2Description = jQuery("#newType2Description").val();
            var newType2IncludeDependencies = jQuery("#newType2IncludeDependencies").is(":checked");
            var newType2Concept = jQuery("#newType2ConceptSelector option:selected").data("conceptslug");
            var newType2Set = jQuery("#newType2SetSelector option:selected").data("setslug");
            var newType2Field = jQuery("#newType2FieldSelector option:selected").data("field");

            var newPropListEntry_obj = {};
            newPropListEntry_obj[newType2PropertyKey] = {};
            newPropListEntry_obj[newType2PropertyKey].conceptGraphStyle = {};
            newPropListEntry_obj[newType2PropertyKey].JSONSchemaStyle = {};
            newPropListEntry_obj[newType2PropertyKey].JSONSchemaStyle.property = {};
            newPropListEntry_obj[newType2PropertyKey].JSONSchemaStyle.requiredDefinitions = [];
            newPropListEntry_obj[newType2PropertyKey].JSONSchemaStyle.dependencies = {};
            newPropListEntry_obj[newType2PropertyKey].conceptGraphStyle.title = newType2Title;
            newPropListEntry_obj[newType2PropertyKey].conceptGraphStyle.description = newType2Description;
            newPropListEntry_obj[newType2PropertyKey].conceptGraphStyle.concept = newType2Concept;
            newPropListEntry_obj[newType2PropertyKey].conceptGraphStyle.set = newType2Set;
            newPropListEntry_obj[newType2PropertyKey].conceptGraphStyle.field = newType2Field;
            newPropListEntry_obj[newType2PropertyKey].conceptGraphStyle.includeDependencies = newType2IncludeDependencies;

            newPropListEntry_obj[newType2PropertyKey].JSONSchemaStyle.property.type = "string";
            newPropListEntry_obj[newType2PropertyKey].JSONSchemaStyle.property.title = newType2Title;
            if (newType2Description) { newPropListEntry_obj[newType2PropertyKey].JSONSchemaStyle.property.description = newType2Description; }
            newPropListEntry_obj[newType2PropertyKey].JSONSchemaStyle.property.enum=[];

            var newPropListEntry_str = JSON.stringify(newPropListEntry_obj,null,4);
            jQuery("#newType2PropertyEntry").html(newPropListEntry_str)
            jQuery("#newType2PropertyEntry").val(newPropListEntry_str)
        });

        jQuery("#makeNewType3PropContainer").change(function(){
            console.log("makeNewType3PropContainer change: ")
            var newType3PropertyKey = jQuery("#newType3PropertyKey").val();
            var newType3Title = jQuery("#newType3Title").val();
            var newType3Description = jQuery("#newType3Description").val();

            var newPropListEntry_obj = {};
            newPropListEntry_obj[newType3PropertyKey] = {};
            newPropListEntry_obj[newType3PropertyKey].conceptGraphStyle = {};
            newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle = {};
            newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle.property = {};
            newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle.requiredDefinitions = {};
            newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle.dependencies = {};

            newPropListEntry_obj[newType3PropertyKey].conceptGraphStyle.title = newType3Title;
            newPropListEntry_obj[newType3PropertyKey].conceptGraphStyle.description = newType3Description;
            newPropListEntry_obj[newType3PropertyKey].conceptGraphStyle.conceptGraphProperties = [];

            newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle.property.type = "object";
            newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle.property.title = newType3Title;
            if (newType3Description) { newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle.property.description = newType3Description; }
            newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle.property.required = [];
            newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle.property.properties = {};

            // iterate through each Type 3 Property (module) and add it to here:
            // newPropListEntry_obj[newType3PropertyKey].conceptGraphStyle.conceptGraphProperties
            // var numModules = this.props.modnum;

            jQuery(".conceptSelector_type3Prop").each(function(){
                var nextModnum = jQuery(this).data("modnum");
                var nextPropertyName = jQuery("#t3propertyName_"+nextModnum).val();
                console.log("conceptSelector_type3Prop; nextModnum: "+nextModnum);
                var nextPropertyKey = jQuery("option:selected",this).data("propertykey");
                newPropListEntry_obj[newType3PropertyKey].conceptGraphStyle.conceptGraphProperties.push(nextPropertyName)
                newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle.property.required.push(nextPropertyName)
                newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle.property.properties[nextPropertyName] = {};
                newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle.property.properties[nextPropertyName]["$ref"] = "#/definitions/"+nextPropertyKey;

            });
            /*
            var nextPropertyKey = jQuery("#conceptSelector_type3Prop_0 option:selected").data("propertykey");
            newPropListEntry_obj[newType3PropertyKey].conceptGraphStyle.conceptGraphProperties.push(nextPropertyKey)
            newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle.property.required.push(nextPropertyKey)
            newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle.property.properties[nextPropertyKey] = {};
            newPropListEntry_obj[newType3PropertyKey].JSONSchemaStyle.property.properties[nextPropertyKey]["$ref"] = "#/definitions/"+nextPropertyKey;
            */
            var newPropListEntry_str = JSON.stringify(newPropListEntry_obj,null,4);
            jQuery("#newType3PropertyEntry").html(newPropListEntry_str)
            jQuery("#newType3PropertyEntry").val(newPropListEntry_str)
        });
    }
    state = {
        type3ModuleBList: []
    }
    addType3ModuleB = () => {
        var modnum = this.state.type3ModuleBList.length;
        var newData = {
            type3ModuleBNum: modnum,
            type3ModBNameId: "t3propertyName_"+modnum,
            type3ModBPropertySelectorId: "t3propertyConceptSelector_"+modnum,
            type3ModBbPropertySelectorId: "t3propertyConceptSelectorB_"+modnum
        }
        this.setState(prevState => ({type3ModuleBList: [...prevState.type3ModuleBList, newData]}))
    }
    render() {
        return (
            <>
                <center>Edit Property List for this Concept Graph</center>
                <fieldset style={{verticalAlign:"top",width:"600px",display:"inline-block",}} >
                    <center>Existing Properties</center>
                    propertyList slug for this concept graph:
                    <div id="propertyListSlugContainer" style={{display:"inline-block"}} >propertyListSlugContainer</div>
                    <br/>
                    <div className="doSomethingButton" id="createPropertyListButton">init list</div>
                    <br/>
                    Type1 properties:
                    <div id="type1propertiesContainer" ></div>
                    Type2 properties:
                    <div id="type2propertiesContainer" ></div>
                    Type3 properties:
                    <div id="type3propertiesContainer" ></div>

                    current entry in propertyList:<br/>
                    <textarea id="existingPropertyEntry" style={{width:"95%",height:"250px"}}></textarea>

                </fieldset>

                <fieldset style={{verticalAlign:"top",width:"600px",display:"inline-block"}} >
                    <center>Make New Property</center>
                    <select id="makeNewPropTypeSelector" >
                        <option data-type="type1" >type 1 (simple string)</option>
                        <option data-type="type2" >type 2 (string with concept-based enum)</option>
                        <option data-type="type3" >type 3 (object, i.e. module)</option>
                    </select>

                    <div id="makeNewType1PropContainer" style={{border:"1px solid black",padding:"5px"}} >
                        <center>Type 1 (simple string; no restrictions of field)</center>
                                                propertyKey (slug): <textarea id="newType1PropertyKey" style={{width:"200px",height:"20px"}} ></textarea>
                        <br/>
                        title: <textarea id="newType1Title" style={{width:"200px",height:"20px"}} ></textarea>
                        <br/>
                        description: <textarea id="newType1Description" style={{width:"200px",height:"20px"}} ></textarea>
                        <br/>
                        <input id="newType1DefaultCheckbox" type="checkbox" /> default: <textarea id="newType1Default" style={{width:"200px",height:"20px"}} ></textarea>
                        <br/>
                        entry into propertyList:<br/>
                        <textarea id="newType1PropertyEntry" style={{width:"95%",height:"250px"}}></textarea>
                    </div>

                    <div id="makeNewType2PropContainer" style={{border:"1px solid black",padding:"5px",display:"none"}} >
                        <center>Type 2 (string with concept/set-based enum)</center>
                        propertyKey (slug): <textarea id="newType2PropertyKey" style={{width:"200px",height:"20px"}} ></textarea>
                        <br/>
                        title: <textarea id="newType2Title" style={{width:"200px",height:"20px"}} ></textarea>
                        <br/>
                        description: <textarea id="newType2Description" style={{width:"200px",height:"20px"}} ></textarea>
                        <br/>
                        <input id="newType2IncludeDependencies" type="checkbox" /> include dependencies
                        <br/>
                        concept: <div id="newType2ConceptSelectorContainer">newType2ConceptSelectorContainer</div>
                        set: <div id="newType2SetSelectorContainer">newType2SetSelectorContainer</div>
                        field: <div id="newType2FieldSelectorContainer">
                            <select id="newType2FieldSelector" >
                                <option data-field="slug" >slug</option>
                                <option data-field="name" >name</option>
                                <option data-field="title" >title</option>
                            </select>
                        </div>
                        entry into propertyList:<br/>
                        <textarea id="newType2PropertyEntry" style={{width:"95%",height:"250px"}}></textarea>
                    </div>

                    <div id="makeNewType3PropContainer" style={{border:"1px solid black",padding:"5px",display:"none"}} >
                        <center>Type 3 (object, i.e. module)</center>
                        propertyKey (slug): <textarea id="newType3PropertyKey" style={{width:"200px",height:"20px"}} ></textarea>
                        <br/>
                        title: <textarea id="newType3Title" style={{width:"200px",height:"20px"}} ></textarea>
                        <br/>
                        description: <textarea id="newType3Description" style={{width:"200px",height:"20px"}} ></textarea>
                        <br/>

                        <button onClick={this.addType3ModuleB}>Add Property</button>
                        {this.state.type3ModuleBList.map( (option) =>
                          (
                            <>
                            <Type3ModuleB modnum={option.type3ModuleBNum} type3ModBNameId={option.type3ModBNameId} type3ModBPropertySelectorId={option.type3ModBPropertySelectorId}  type3ModBbPropertySelectorId={option.type3ModBbPropertySelectorId} />
                            </>
                          )
                        )}

                        entry into propertyList:<br/>
                        <textarea id="newType3PropertyEntry" style={{width:"95%",height:"250px"}}></textarea>
                    </div>

                </fieldset>

            </>
        );
    }
}
