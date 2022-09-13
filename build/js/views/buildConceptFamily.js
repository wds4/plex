
function renderAlpacaForm() {
    // clear existing form
    jQuery("#alpacaForm").val("");
    jQuery("#alpacaForm").html("");
    // render the form anew
    alpaca_str = jQuery("#JSONSchema_rawFile_parent").val()
    alpaca_obj = JSON.parse(alpaca_str);
    jQuery("#alpacaForm").alpaca(alpaca_obj)
    console.log("renderAlpacaForm; alpaca_str: "+alpaca_str)
}
function calculateFamilyUnit() {
    console.log("calculateFamilyUnit");
    conceptwordtype_path = jQuery("#addPropertySelector_path option:selected ").data("conceptwordtype")
    conceptwordtype_key = jQuery("#addPropertySelector_key option:selected ").data("conceptwordtype")
    valuetype = jQuery("#addPropertySelector_value_type option:selected ").data("valuetype")
    valuetargetA = jQuery("#addPropertySelector_value_targetA option:selected ").data("valuetarget")
    valuetargetB = jQuery("#addPropertySelector_value_targetB option:selected ").data("valuetarget")
    valuefield = jQuery("#addPropertySelector_value_field option:selected ").data("valuefield")
    extraPropertyKey = jQuery("#extraPropertyKey").val()

    path = conceptsInfo_obj[conceptwordtype_path]["path"]
    if (conceptwordtype_key=="extraProperty") {
        key = extraPropertyKey;
    } else {
        if (conceptwordtype_key=="noConcept") {
            key = "?";
        } else {
            key = conceptsInfo_obj[conceptwordtype_key]["wordType"]
        }
    }

    special_obj = {};
    child_obj = {};
    parent_obj = {};
    schema_obj = {};
    options_obj = {};

    options_obj["fields"] = {};
    schema_obj["type"] = "object";
    schema_obj["title"] = "top level";
    schema_obj["required"] = [];
    schema_obj["required"].push(path)
    schema_obj["definitions"] = {};
    schema_obj["definitions"]["postData"] = {};
    schema_obj["definitions"]["postData"]["title"] = "Post Data";
    schema_obj["definitions"]["postData"]["type"] = "string";
    schema_obj["definitions"]["userData"] = {};
    schema_obj["definitions"]["userData"]["title"] = "User Data";
    schema_obj["definitions"]["userData"]["type"] = "string";
    schema_obj["properties"] = {};

    schema_obj["properties"]["name"] = {};
    schema_obj["properties"]["name"]["type"] = "string";
    schema_obj["properties"]["name"]["title"] = "name";
    schema_obj["required"].push("name")

    schema_obj["properties"][path] = {};
    if (conceptwordtype_key=="extraProperty") {
        child_obj[path] = {};
        child_obj[path][extraPropertyKey] = {};
    } else {
        if (conceptwordtype_key=="noConcept") {
            schema_obj["properties"][path]["type"] = "string";
            child_obj[path] = "";
        } else {
            schema_obj["properties"][path]["type"] = "object";
            schema_obj["properties"][path]["title"] = path;
            schema_obj["properties"][path]["required"] = [];
            schema_obj["properties"][path]["properties"] = {};
            schema_obj["properties"][path]["dependencies"] = {};
            schema_obj["properties"][path]["required"].push(key);
            schema_obj["properties"][path]["properties"][key] = {}
            schema_obj["properties"][path]["properties"][key]["type"] = valuetype;
            schema_obj["properties"][path]["properties"][key]["enum"] = [];

            schema_obj["properties"][path]["properties"]["name"] = {}
            schema_obj["properties"][path]["properties"]["name"]["type"] = "string";
            schema_obj["properties"][path]["properties"]["name"]["title"] = "name";
            schema_obj["properties"][path]["required"].push("name");

            // allElements_arr = conceptsInfo_obj[conceptwordtype_key][valuetargetB];
            elements_arr = conceptsInfo_obj[conceptwordtype_key]["allSets"][valuetargetA][valuetargetB];
            numElements = elements_arr.length;
            // console.log("numElements: "+numElements);
            for (e=0;e<numElements;e++) {
                nextElemSlug = elements_arr[e];
                nextElem = conceptsInfo_obj[conceptwordtype_key][valuetargetB][nextElemSlug][valuefield];
                nextElem_path = conceptsInfo_obj[nextElemSlug]["path"];
                schema_obj["properties"][path]["properties"][key]["enum"].push(nextElem)
                // schema_obj["properties"][path]["properties"][key]["enum"].push(nextElem_path)
                schema_obj["properties"][path]["properties"][nextElem_path] = {}
                schema_obj["properties"][path]["properties"][nextElem_path]["$ref"] = "#/definitions/"+nextElem_path;
                options_obj["fields"][nextElem_path] = {};
                options_obj["fields"][nextElem_path]["dependencies"] = {};
                options_obj["fields"][nextElem_path]["dependencies"][key] = nextElem;
                schema_obj["properties"][path]["dependencies"][nextElem_path] = [key];
            }

            child_obj[path] = {};

            whichElem = "x";

            if (numElements > 0) {
                whichElemNum = Math.floor(Math.random() * numElements);
                // whichElemNum = 0;
                whichElem_slug = elements_arr[whichElemNum];
                whichElem = conceptsInfo_obj[conceptwordtype_key][valuetargetB][whichElem_slug][valuefield];
            }

            child_obj[path][key] = whichElem;
            console.log("child_obj; path: "+path+"; key: "+key+"; whichElem: "+whichElem)

            if (valuetype=="object") {
                whichElem_slug = "x";
                if (numElements>0) { whichElem_slug = elements_arr[whichElemNum]; }
                secondPath = conceptsInfo_obj[whichElem_slug]["path"]
                // secondPath = conceptsInfo_obj[conceptwordtype_key][valuetargetB][secondPath_slug][valuefield];
                child_obj[path][secondPath] = {};
            }

        }
    }
    // schema_obj["options"] = options_obj;
    parent_obj["schema"] = schema_obj;
    parent_obj["options"] = options_obj;
    // parent_obj["options"] = options_obj;

    special_str = JSON.stringify(special_obj,null,4);
    child_str = JSON.stringify(child_obj,null,4);
    parent_str = JSON.stringify(parent_obj,null,4);
    jQuery("#JSONSchema_rawFile_special").val(special_str)
    jQuery("#JSONSchema_rawFile_child").val(child_str)
    jQuery("#JSONSchema_rawFile_parent").val(parent_str)
    renderAlpacaForm();
}

function makeAllSelectors() {
    makeAddPropertySelector_path();
    makeAddPropertySelector_key();
    makeAddPropertySelector_value_type();
    makeAddPropertySelector_value_targetA();
    makeAddPropertySelector_value_targetB();
    makeAddPropertySelector_value_field();
}

function makeAddPropertySelector_path() {
    numConcepts = listOfConcepts_arr.length;
    selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_path >";
        for (z=0;z<numConcepts;z++) {
            nextConcept_slug = listOfConcepts_arr[z];
            nextConcept_obj = conceptsInfo_obj[nextConcept_slug];
            nextConcept_path = nextConcept_obj["path"];
            selectorHTML += "<option data-conceptwordtype='"+nextConcept_slug+"' >"+nextConcept_slug+"</option>";
        }
    selectorHTML += "</select>";
    jQuery("#addPropertySelector_path").html(selectorHTML)
    jQuery("#addPropertySelector_path").change(function(){
       conceptwordtype = jQuery("#addPropertySelector_path option:selected ").data("conceptwordtype")
       console.log("addPropertySelector_path changed; conceptwordtype: "+conceptwordtype);
       calculateFamilyUnit();
    })
}
function makeAddPropertySelector_key() {
    numConcepts = listOfConcepts_arr.length;
    selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_key >";
        selectorHTML += "<option data-conceptwordtype=noConcept >--none--</option>";
        selectorHTML += "<option data-conceptwordtype=extraProperty >--extraProperty--</option>";
        for (z=0;z<numConcepts;z++) {
            nextConcept_slug = listOfConcepts_arr[z];
            nextConcept_obj = conceptsInfo_obj[nextConcept_slug];
            nextConcept_path = nextConcept_obj["path"];
            selectorHTML += "<option data-conceptwordtype='"+nextConcept_slug+"' >concept: "+nextConcept_slug+"</option>";
        }
    selectorHTML += "</select>";
    jQuery("#addPropertySelector_key").html(selectorHTML)
    jQuery("#addPropertySelector_key").change(function(){
       conceptwordtype = jQuery("#addPropertySelector_key option:selected ").data("conceptwordtype")
       console.log("addPropertySelector_key changed; conceptwordtype: "+conceptwordtype);
       makeAddPropertySelector_value_targetA();
       calculateFamilyUnit();
    })
}

function makeAddPropertySelector_value_type() {
    numConcepts = listOfConcepts_arr.length;
    selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_value_type >";
        selectorHTML += "<option data-valuetype=string >string</option>";
        selectorHTML += "<option data-valuetype=object >object</option>";
    selectorHTML += "</select>";
    jQuery("#addPropertySelector_value_type").html(selectorHTML)
    jQuery("#addPropertySelector_value_type").change(function(){
       valuetype = jQuery("#addPropertySelector_value_type option:selected ").data("valuetype")
       console.log("addPropertySelector_value_type changed; valuetype: "+valuetype);
       calculateFamilyUnit();
    })
}

function makeAddPropertySelector_value_targetA() {
    numConcepts = listOfConcepts_arr.length;

    selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_value_targetA >";
        // selectorHTML += "<option data-valuetarget=blank >--none--</option>";
        // selectorHTML += "<option data-valuetarget=specificInstances selected >specificInstances</option>";
        // selectorHTML += "<option data-valuetarget=subsets >subsets</option>";
        conceptwordtype_key = jQuery("#addPropertySelector_key option:selected ").data("conceptwordtype");
        console.log("makeAddPropertySelector_value_targetA; conceptwordtype_key: "+conceptwordtype_key)
        if ( (conceptwordtype_key != "extraProperty") && (conceptwordtype_key != "noConcept") ) {
            allSets_arr = conceptsInfo_obj[conceptwordtype_key]["allSets"]
            numAllSets = allSets_arr.length;
            for (n=0;n<numAllSets;n++) {
                nextAllSet_slug = allSets_arr[n];
                selectorHTML += "<option data-valuetarget="+nextAllSet_slug+" >"+nextAllSet_slug+"</option>";
            }
        }
    selectorHTML += "</select>";
    jQuery("#addPropertySelector_value_targetA").html(selectorHTML)
    jQuery("#addPropertySelector_value_targetA").change(function(){
       valuetarget = jQuery("#addPropertySelector_value_targetA option:selected ").data("valuetarget")
       console.log("addPropertySelector_value_targetA changed; valuetarget: "+valuetarget);
       calculateFamilyUnit();
    })
}
function makeAddPropertySelector_value_targetB() {
    numConcepts = listOfConcepts_arr.length;
    selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_value_targetB >";
        selectorHTML += "<option data-valuetarget=blank >--none--</option>";
        selectorHTML += "<option data-valuetarget=specificInstances selected >specificInstances</option>";
        selectorHTML += "<option data-valuetarget=subsets >subsets</option>";
    selectorHTML += "</select>";
    jQuery("#addPropertySelector_value_targetB").html(selectorHTML)
    jQuery("#addPropertySelector_value_targetB").change(function(){
       valuetarget = jQuery("#addPropertySelector_value_targetB option:selected ").data("valuetarget")
       console.log("addPropertySelector_value_targetB changed; valuetarget: "+valuetarget);
       calculateFamilyUnit();
    })
}

function makeAddPropertySelector_value_field() {
    numConcepts = listOfConcepts_arr.length;
    selectorHTML = "";
    selectorHTML += "<select id=addPropertySelector_value_field >";
        selectorHTML += "<option data-valuefield=name >name</option>";
        selectorHTML += "<option data-valuefield=slug >slug</option>";
        selectorHTML += "<option data-valuefield=title >title</option>";
    selectorHTML += "</select>";
    jQuery("#addPropertySelector_value_field").html(selectorHTML)
    jQuery("#addPropertySelector_value_field").change(function(){
       valuefield = jQuery("#addPropertySelector_value_field option:selected ").data("valuefield")
       console.log("addPropertySelector_value_field changed; valuefield: "+valuefield);
       calculateFamilyUnit();
    })
}


listOfConcepts_arr = [];
listOfConcepts_arr[0] = "organism";
listOfConcepts_arr[1] = "organismType";
listOfConcepts_arr[2] = "animal";
listOfConcepts_arr[3] = "animalType";
listOfConcepts_arr[4] = "dog";
listOfConcepts_arr[5] = "cat";
listOfConcepts_arr[6] = "rating";
listOfConcepts_arr[7] = "user";
listOfConcepts_arr[8] = "post";
listOfConcepts_arr[9] = "entity";
listOfConcepts_arr[10] = "entityType";
listOfConcepts_arr[11] = "rater";
listOfConcepts_arr[12] = "ratee";

conceptsInfo_obj = {};

///////////////////// RATINGS //////////////////
conceptsInfo_obj.rater = {}
conceptsInfo_obj.rater.path = "raterData";
conceptsInfo_obj.rater.wordType = "rater";
conceptsInfo_obj.rater.superset = "raters";
conceptsInfo_obj.rater.schema = "schemaForRater";
conceptsInfo_obj.rater.JSONSchema = "JSONSchemaForRater";
conceptsInfo_obj.rater.concept = "conceptForRater";
conceptsInfo_obj.rater.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.rater.allSets = [ "raters" ];
conceptsInfo_obj.rater.sets = {};
conceptsInfo_obj.rater.specificInstances = {};

conceptsInfo_obj.ratee = {}
conceptsInfo_obj.ratee.path = "rateeData";
conceptsInfo_obj.ratee.wordType = "ratee";
conceptsInfo_obj.ratee.superset = "ratees";
conceptsInfo_obj.ratee.schema = "schemaForRatee";
conceptsInfo_obj.ratee.JSONSchema = "JSONSchemaForRatee";
conceptsInfo_obj.ratee.concept = "conceptForRatee";
conceptsInfo_obj.ratee.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.ratee.allSets = [ "ratees" ];
conceptsInfo_obj.ratee.sets = {};
conceptsInfo_obj.ratee.specificInstances = {};

conceptsInfo_obj.entity = {}
conceptsInfo_obj.entity.path = "entityData";
conceptsInfo_obj.entity.wordType = "entity";
conceptsInfo_obj.entity.superset = "entities";
conceptsInfo_obj.entity.schema = "schemaForEntity";
conceptsInfo_obj.entity.JSONSchema = "JSONSchemaForEntity";
conceptsInfo_obj.entity.concept = "conceptForEntity";
conceptsInfo_obj.entity.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.entity.allSets = [ "entities", "raters", "ratees" ];
conceptsInfo_obj.entity.sets = {
        "raters": {
            "slug": "raters",
            "name": "raters",
            "title": "Raters",
            "parent": "entities"
        },
        "ratees": {
            "slug": "ratees",
            "name": "ratees",
            "title": "Ratees",
            "parent": "entities"
        }
    };
conceptsInfo_obj.entity.specificInstances = {};

conceptsInfo_obj.entityType = {}
conceptsInfo_obj.entityType.path = "entityTypeData";
conceptsInfo_obj.entityType.wordType = "entityType";
conceptsInfo_obj.entityType.superset = "entityTypes";
conceptsInfo_obj.entityType.schema = "schemaForEntityType";
conceptsInfo_obj.entityType.JSONSchema = "JSONSchemaForEntityType";
conceptsInfo_obj.entityType.concept = "conceptForEntityType";
conceptsInfo_obj.entityType.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.entityType.allSets = [ "entityTypes", "ratableEntityTypes", "entityTypesThatCanRate" ];
conceptsInfo_obj.entityType.allSets.entityTypes = {}
conceptsInfo_obj.entityType.allSets.entityTypes.specificInstances = [ "user", "post" ]
conceptsInfo_obj.entityType.allSets.entityTypes.subsets = [ "ratableEntityTypes", "entityTypesThatCanRate" ]
conceptsInfo_obj.entityType.allSets.ratableEntityTypes = {}
conceptsInfo_obj.entityType.allSets.ratableEntityTypes.specificInstances = [ "user", "post" ]
conceptsInfo_obj.entityType.allSets.ratableEntityTypes.subsets = []
conceptsInfo_obj.entityType.allSets.entityTypesThatCanRate = {}
conceptsInfo_obj.entityType.allSets.entityTypesThatCanRate.specificInstances = [ "user" ]
conceptsInfo_obj.entityType.allSets.entityTypesThatCanRate.subsets = []
conceptsInfo_obj.entityType.sets = {
        "entityTypes": {
            "slug": "entityTypes",
            "name": "entity types",
            "title": "Entity Types",
            "parents": [ ]
        },
        "ratableEntityTypes": {
            "slug": "ratableEntityTypes",
            "name": "ratable types of entities",
            "title": "Ratable Types of Entities",
            "parents": [ "entityTypes" ]
        },
        "entityTypesThatCanRate": {
            "slug": "entityTypesThatCanRate",
            "name": "entity types that can rate",
            "title": "Entity Types that can Rate",
            "parents": [ "entityTypes" ]
        }
    };
conceptsInfo_obj.entityType.specificInstances = {
        "user": {
            "slug": "user",
            "name": "user",
            "title": "User",
            "parents": [ "entityTypes", "ratableEntityTypes", "entityTypesThatCanRate" ]
        },
        "post": {
            "slug": "post",
            "name": "post",
            "title": "Post",
            "parents": [ "entityTypes", "ratableEntityTypes" ]
        }
    };

conceptsInfo_obj.post = {}
conceptsInfo_obj.post.path = "postData";
conceptsInfo_obj.post.wordType = "post";
conceptsInfo_obj.post.superset = "posts";
conceptsInfo_obj.post.schema = "schemaForPost";
conceptsInfo_obj.post.JSONSchema = "JSONSchemaForPost";
conceptsInfo_obj.post.concept = "conceptForPost";
conceptsInfo_obj.post.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.post.allSets = [ "posts" ];
conceptsInfo_obj.post.sets = {};
conceptsInfo_obj.post.specificInstances = {};

conceptsInfo_obj.user = {}
conceptsInfo_obj.user.path = "userData";
conceptsInfo_obj.user.wordType = "user";
conceptsInfo_obj.user.superset = "users";
conceptsInfo_obj.user.schema = "schemaForUser";
conceptsInfo_obj.user.JSONSchema = "JSONSchemaForUser";
conceptsInfo_obj.user.concept = "conceptForUser";
conceptsInfo_obj.user.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.user.allSets = [ "users" ];
conceptsInfo_obj.user.sets = {};
conceptsInfo_obj.user.specificInstances = {};

conceptsInfo_obj.rating = {}
conceptsInfo_obj.rating.path = "ratingData";
conceptsInfo_obj.rating.wordType = "rating";
conceptsInfo_obj.rating.superset = "ratings";
conceptsInfo_obj.rating.schema = "schemaForRating";
conceptsInfo_obj.rating.JSONSchema = "JSONSchemaForRating";
conceptsInfo_obj.rating.concept = "conceptForRating";
conceptsInfo_obj.rating.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.rating.allSets = [ "ratings", "ratingsOrganizedByRatee", "ratingsOrganizedByRater", "ratingsOfUsers", "ratingsOfPosts" ];
conceptsInfo_obj.rating.sets = [
        {
            "slug": "ratingsOrganizedByRatee",
            "name": "ratings organized by ratee",
            "title": "Ratings Organized by Ratee",
            "parent": "ratings"
        },
        {
            "slug": "ratingsOrganizedByRater",
            "name": "ratings organized by rater",
            "title": "Ratings Organized by Rater",
            "parent": "ratings"
        },
        {
            "slug": "ratingsOfUsers",
            "name": "ratings of users",
            "title": "Ratings of Users",
            "parent": "ratingsOrganizedByRatee"
        },
        {
            "slug": "ratingsOfPosts",
            "name": "ratings of posts",
            "title": "Ratings of Posts",
            "parent": "ratingsOrganizedByRatee"
        }
    ];
conceptsInfo_obj.rating.specificInstances = {};

///////////////////// ORGANISMS //////////////////
conceptsInfo_obj.organism = {}
conceptsInfo_obj.organism.path = "organismData";
conceptsInfo_obj.organism.wordType = "organism";
conceptsInfo_obj.organism.superset = "organisms";
conceptsInfo_obj.organism.schema = "schemaForOrganism";
conceptsInfo_obj.organism.JSONSchema = "JSONSchemaForOrganism";
conceptsInfo_obj.organism.concept = "conceptForOrganism";
conceptsInfo_obj.organism.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.organism.allSets = [ "organisms", "organismsAsPets" ];
conceptsInfo_obj.organism.sets = {
        "organismsAsPets": {
            "slug": "organismsAsPets",
            "name": "organisms as pets",
            "title": "Organisms as Pets",
            "parent": "organisms"
        }
    };
conceptsInfo_obj.organism.specificInstances = {};

conceptsInfo_obj.organismType = {}
conceptsInfo_obj.organismType.path = "organismTypeData";
conceptsInfo_obj.organismType.wordType = "organismType";
conceptsInfo_obj.organismType.superset = "organismTypes";
conceptsInfo_obj.organismType.schema = "schemaForOrganismType";
conceptsInfo_obj.organismType.JSONSchema = "JSONSchemaForOrganismType";
conceptsInfo_obj.organismType.concept = "conceptForOrganismType";
conceptsInfo_obj.organismType.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.organismType.allSets = [ "organismTypes" ];
conceptsInfo_obj.organismType.sets = {};
conceptsInfo_obj.organismType.specificInstances = {
        "animal": {
            "slug": "animal",
            "name": "animal",
            "title": "Animal",
            "parent": "organismTypes"
        },
        "plant": {
            "slug": "plant",
            "name": "plant",
            "title": "Plant",
            "parent": "organismTypes"
        }
    };

conceptsInfo_obj.animal = {}
conceptsInfo_obj.animal.path = "animalData";
conceptsInfo_obj.animal.wordType = "animal";
conceptsInfo_obj.animal.superset = "animals";
conceptsInfo_obj.animal.schema = "schemaForAnimal";
conceptsInfo_obj.animal.JSONSchema = "JSONSchemaForAnimal";
conceptsInfo_obj.animal.concept = "conceptForAnimal";
conceptsInfo_obj.animal.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.animal.allSets = [ "animals", "animalsAsPets" ];
conceptsInfo_obj.animal.sets = {
        "animalsAsPets": {
            "slug": "animalsAsPets",
            "name": "animals as pets",
            "title": "Animals as Pets",
            "parent": "animals"
        }
    };
conceptsInfo_obj.animal.specificInstances = {};

conceptsInfo_obj.animalType = {}
conceptsInfo_obj.animalType.path = "animalTypeData";
conceptsInfo_obj.animalType.wordType = "animalType";
conceptsInfo_obj.animalType.superset = "animalTypes";
conceptsInfo_obj.animalType.schema = "schemaForAnimalType";
conceptsInfo_obj.animalType.JSONSchema = "JSONSchemaForAnimalType";
conceptsInfo_obj.animalType.concept = "conceptForAnimalType";
conceptsInfo_obj.animalType.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.animalType.allSets = [ "animalTypes" ];
conceptsInfo_obj.animalType.allSets.animalTypes = {}
conceptsInfo_obj.animalType.allSets.animalTypes.specificInstances = [ "dog", "cat" ]
conceptsInfo_obj.animalType.allSets.animalTypes.subsets = []
conceptsInfo_obj.animalType.sets = {};
conceptsInfo_obj.animalType.specificInstances = {
        "dog": {
            "slug": "dog",
            "name": "dog",
            "title": "Dog",
            "parent": "animalTypes"
        },
        "cat": {
            "slug": "cat",
            "name": "cat",
            "title": "Cat",
            "parent": "animalTypes"
        }
    };

conceptsInfo_obj.dog = {}
conceptsInfo_obj.dog.path = "dogData";
conceptsInfo_obj.dog.wordType = "dog";
conceptsInfo_obj.dog.superset = "dogs";
conceptsInfo_obj.dog.schema = "schemaForDog";
conceptsInfo_obj.dog.JSONSchema = "JSONSchemaForDog";
conceptsInfo_obj.dog.concept = "conceptForDog";
conceptsInfo_obj.dog.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.dog.allSets = [ "dogs", "dogsAsPets" ];
conceptsInfo_obj.dog.sets = {
        "dogsAsPets": {
            "slug": "dogsAsPets",
            "name": "dogs as pets",
            "title": "Dogs as Pets",
            "parent": "dogs",
            "subsets": [],
            "specificInstances": [ "MikeTheDog" ]
        }
    };
conceptsInfo_obj.dog.specificInstances = {
        "MikeTheDog": {
            "slug": "MikeTheDog",
            "name": "Mike the dog",
            "title": "Mike the Dog",
            "parent": "dogsAsPets"
        }
    };

conceptsInfo_obj.cat = {}
conceptsInfo_obj.cat.path = "catData";
conceptsInfo_obj.cat.wordType = "cat";
conceptsInfo_obj.cat.superset = "cats";
conceptsInfo_obj.cat.schema = "schemaForCat";
conceptsInfo_obj.cat.JSONSchema = "JSONSchemaForCat";
conceptsInfo_obj.cat.concept = "conceptForCat";
conceptsInfo_obj.cat.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.cat.allSets = [ "cats", "catsAsPets" ];
conceptsInfo_obj.cat.allSets.cats={}
conceptsInfo_obj.cat.allSets.cats.specificInstances=[]
conceptsInfo_obj.cat.allSets.cats.subsets=[]
conceptsInfo_obj.cat.allSets.catsAsPets={}
conceptsInfo_obj.cat.allSets.catsAsPets.specificInstances=[]
conceptsInfo_obj.cat.allSets.catsAsPets.subsets=[]
conceptsInfo_obj.cat.sets = {
        "catsAsPets": {
            "slug": "catsAsPets",
            "name": "cats as pets",
            "title": "Cats as Pets",
            "parent": "cats",
            "subsets": [],
            "specificInstances": [ "GarfieldTheCat" ]
        }
    };
conceptsInfo_obj.cat.specificInstances = {
        "GarfieldTheCat": {
            "slug": "GarfieldTheCat",
            "name": "Garfield the cat",
            "title": "Garfield the Cat",
            "parent": "catsAsPets"
        }
    };

pageViews['buildConceptFamily-contents'] = conceptGraphMasthead + `
<div class=h2>Build a Concept Family</div>

<style>
.basicContainer_bcf {
    border:1px solid black;
    padding:5px;
    margin-bottom:5px;
}
.activeConceptContainer_bcf {
    // display:inline-block;
    border:1px solid black;
    padding:5px;
    margin-bottom:5px;
}
.textField_bfc {
    width:500px;
    height:30px;
}
.leftCol_bfc {
    display:inline-block;
    width:200px;
}
#network_singleConcept {
    width:600px;
    height:600px;
    border:1px solid black;
    display:inline-block;
}
.JSONSchemaContainer {
    background-color:#FFGGFF
    height:300px;
}
.fileInnerContainer {
    display:inline-block;
    height:300px;
    width:300px;
    padding:5px;
    background-color:white;
}
.fileOuterContainer {
    display:inline-block;
    // height:300px;
    width:320px;
    padding:5px;
    background-color:orange;
}
</style>

<div class=doSomethingButton id=loadExistingConceptFamily>Load Concept Family</div>

<select>
    <option>animal</option>
    <option>rating</option>
</select>
<br>
<div class=basicContainer_bcf >
    Add a new Concept:<br>
    <div class=leftCol_bfc >name, singular:</div>
    <textarea class=textField_bfc id=newConcept_singular ></textarea>

    <br>

    <div class=leftCol_bfc >name, plural:</div>
    <textarea class=textField_bfc id=newConcept_plural ></textarea>

    <br>

    <div class=leftCol_bfc >specificInstance fields:</div>
    <input type=checkbox id=newConceptField_name checked /> name
    <input type=checkbox id=newConceptField_title  /> title
    <input type=checkbox id=newConceptField_slug  /> slug
    <input type=checkbox id=newConceptField_alias  /> alias
    <br>
    <div class=doSomethingButton id=addNewConceptButton >Add</div>
    <div class=doSomethingButton id=clearNewConceptButton >Clear</div>
</div>
<fieldset class=JSONSchemaContainer >
    <div class=fileOuterContainer id=JSONSchemaContainer_controlPanel >
        <center>Add a Property</center>
        path:
        <div id=addPropertySelector_path style=display:inline-block; ></div>

        <br>

        <div style=display:none; >
        <input type=checkbox id=extraPropertyCheckbox /> extraProperty: <textarea style=width:200px; id=extraPropertyKey >somethingData</textarea>
        <br>
        </div>

        key:
        <div id=addPropertySelector_key style=display:inline-block; ></div>

        <br>

        value type: <div id=addPropertySelector_value_type style=display:inline-block; ></div><br>
        value targetA: <div id=addPropertySelector_value_targetA style=display:inline-block; ></div><br>
        value targetB (?): <div id=addPropertySelector_value_targetB style=display:inline-block; ></div><br>
        value field: <div id=addPropertySelector_value_field style=display:inline-block; ></div>

        <br>

        <div class=doSomethingButton >add</div>
        <div class=doSomethingButton onclick=calculateFamilyUnit(); >recalc</div>
    </div>
    <div class=fileOuterContainer id=JSONSchemaContainer_special >
        special:<br>
        <textarea class=fileInnerContainer id=JSONSchema_rawFile_special ></textarea>
    </div>
    <div class=fileOuterContainer id=JSONSchemaContainer_child >
        child:<br>
        <textarea class=fileInnerContainer id=JSONSchema_rawFile_child ></textarea>
    </div>
    <div class=fileOuterContainer id=JSONSchemaContainer_parent >
        parent:<br>
        <textarea class=fileInnerContainer id=JSONSchema_rawFile_parent ></textarea>
    </div>
</fieldset>

<div id=activeConceptsContainer style="width:600px;border:1px solid black;padding:5px;display:inline-block;">
    <div id=alpacaForm ></div>
</div>
<div id=activeConceptsContainer style="width:620px;height:700px;border:1px solid black;padding:5px;display:inline-block;">
    <div class=doSomethingButton id=showConceptGraphRelsButton>Show Concept Graph Rels</div>
    <br>
    <center><div id=network_singleConcept></div></center>
</div>

<script>
jQuery("#clearNewConceptButton").click(function(){
    jQuery("#newConcept_singular").val("");
    jQuery("#newConcept_singular").html("");
    jQuery("#newConcept_plural").val("");
    jQuery("#newConcept_plural").html("");

    jQuery("#newConceptField_name").prop("checked",true);
    jQuery("#newConceptField_title").prop("checked",false);
    jQuery("#newConceptField_slug").prop("checked",false);
    jQuery("#newConceptField_alias").prop("checked",false);
});
jQuery("#addNewConceptButton").click(function(){
    newConcept_singular = jQuery("#newConcept_singular").val();
    newConcept_plural = jQuery("#newConcept_plural").val();

    newConcept_singular_firstCap = newConcept_singular.substr(0,1).toUpperCase()+newConcept_singular.substr(1);

    newConcept_path = newConcept_singular+"Data";

    newConcept_schema_slug = "schemaFor"+newConcept_singular_firstCap;
    newConcept_JSONSchema_slug = "JSONSchemaFor"+newConcept_singular_firstCap;
    newConcept_superset_slug = newConcept_plural;
    newConcept_wordType_slug = newConcept_singular;
    newConcept_concept_slug = "conceptFor"+newConcept_singular_firstCap;

    numConcepts = listOfConcepts_arr.length;
    listOfConcepts_arr[numConcepts] = newConcept_wordType_slug;

    newHTML = "";
    newHTML += "<div class=activeConceptContainer_bcf >";
        newHTML += numConcepts;
        newHTML += "<div class=leftCol_bfc >";
        newHTML += "concept:";
        newHTML += "</div>";
        newHTML += newConcept_wordType_slug;
        newHTML += "<br>";
        newHTML += newConcept_path;
        newHTML += "<br>";
        newHTML += "<div class=doSomethingButton>Show Graph</div>";
        // newHTML += newConcept_superset_slug;
    newHTML += "</div>";
    jQuery("#activeConceptsContainer").append(newHTML)
});
makeAllSelectors();
calculateFamilyUnit();
</script>
`;
