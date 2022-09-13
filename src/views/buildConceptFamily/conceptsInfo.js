


export var listOfConcepts_arr = [];
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

export var schema_obj = {};
schema_obj.type = "object";
schema_obj.properties = {};
schema_obj.properties.name = {};
schema_obj.properties.name.type = "string";
schema_obj.properties.alias = {};
schema_obj.properties.alias.type = "string";
schema_obj.properties.slug = {};
schema_obj.properties.slug.type = "string";
schema_obj.required = [];
schema_obj.required.push("name");


var defaultDefinition_obj = {};
defaultDefinition_obj.type="object";
defaultDefinition_obj.title="";
defaultDefinition_obj.properties={};
defaultDefinition_obj.properties.name={};
defaultDefinition_obj.properties.name.type="string";
defaultDefinition_obj.properties.name.title="Name";
defaultDefinition_obj.properties.title={};
defaultDefinition_obj.properties.title.type="string";
defaultDefinition_obj.properties.title.title="Name";
defaultDefinition_obj.properties.slug={};
defaultDefinition_obj.properties.slug.type="string";
defaultDefinition_obj.properties.slug.title="Name";
defaultDefinition_obj.required=["name"];

export const conceptsInfo_obj = {};

///////////////////// RATINGS //////////////////
var nextPath = "raterData";
var nextTitle = "Rater Data";
conceptsInfo_obj.rater = {}
conceptsInfo_obj.rater.definition = {};
conceptsInfo_obj.rater.definition[nextPath] = JSON.parse(JSON.stringify(defaultDefinition_obj));
conceptsInfo_obj.rater.definition[nextPath].title = nextTitle;
conceptsInfo_obj.rater.path = nextPath;
conceptsInfo_obj.rater.title = nextTitle;
conceptsInfo_obj.rater.wordType = "rater";
conceptsInfo_obj.rater.superset = "raters";
conceptsInfo_obj.rater.schema = "schemaForRater";
conceptsInfo_obj.rater.JSONSchema = "JSONSchemaForRater";
conceptsInfo_obj.rater.concept = "conceptForRater";
conceptsInfo_obj.rater.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.rater.allSets = [ "raters" ];
conceptsInfo_obj.rater.allSets.raters = {};
conceptsInfo_obj.rater.allSets.raters.specificInstances = [];
conceptsInfo_obj.rater.allSets.raters.subsets = [];
conceptsInfo_obj.rater.sets = {};
conceptsInfo_obj.rater.specificInstances = {};


var nextPath = "rateeData";
var nextTitle = "Ratee Data";
conceptsInfo_obj.ratee = {}
conceptsInfo_obj.ratee.definition = {};
conceptsInfo_obj.ratee.definition[nextPath] = JSON.parse(JSON.stringify(defaultDefinition_obj));
conceptsInfo_obj.ratee.definition[nextPath].title = nextTitle;
conceptsInfo_obj.ratee.path = nextPath;
conceptsInfo_obj.ratee.title = nextTitle;
conceptsInfo_obj.ratee.wordType = "ratee";
conceptsInfo_obj.ratee.superset = "ratees";
conceptsInfo_obj.ratee.schema = "schemaForRatee";
conceptsInfo_obj.ratee.JSONSchema = "JSONSchemaForRatee";
conceptsInfo_obj.ratee.concept = "conceptForRatee";
conceptsInfo_obj.ratee.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.ratee.allSets = [ "ratees" ];
conceptsInfo_obj.ratee.allSets.ratees = {};
conceptsInfo_obj.ratee.allSets.ratees.specificInstances = [];
conceptsInfo_obj.ratee.allSets.ratees.subsets = [];
conceptsInfo_obj.ratee.sets = {};
conceptsInfo_obj.ratee.specificInstances = {};


var nextPath = "entityData";
var nextTitle = "Entity Data";
conceptsInfo_obj.entity = {}
conceptsInfo_obj.entity.definition = {};
conceptsInfo_obj.entity.definition[nextPath] = JSON.parse(JSON.stringify(defaultDefinition_obj));
conceptsInfo_obj.entity.definition[nextPath].title = nextTitle;
conceptsInfo_obj.entity.path = nextPath;
conceptsInfo_obj.entity.title = nextTitle;
conceptsInfo_obj.entity.wordType = "entity";
conceptsInfo_obj.entity.superset = "entities";
conceptsInfo_obj.entity.schema = "schemaForEntity";
conceptsInfo_obj.entity.JSONSchema = "JSONSchemaForEntity";
conceptsInfo_obj.entity.concept = "conceptForEntity";
conceptsInfo_obj.entity.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.entity.allSets = [ "entities", "raters", "ratees" ];
conceptsInfo_obj.entity.allSets.entities = {};
conceptsInfo_obj.entity.allSets.entities.specificInstances = [];
conceptsInfo_obj.entity.allSets.entities.subsets = [ "raters", "ratees" ];
conceptsInfo_obj.entity.allSets.raters = {};
conceptsInfo_obj.entity.allSets.raters.specificInstances = [];
conceptsInfo_obj.entity.allSets.raters.subsets = [];
conceptsInfo_obj.entity.allSets.ratees = {};
conceptsInfo_obj.entity.allSets.ratees.specificInstances = [];
conceptsInfo_obj.entity.allSets.ratees.subsets = [ ];
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


var nextPath = "entityTypeData";
var nextTitle = "Entity Type Data";
conceptsInfo_obj.entityType = {}
conceptsInfo_obj.entityType.definition = {};
conceptsInfo_obj.entityType.definition[nextPath] = JSON.parse(JSON.stringify(defaultDefinition_obj));
conceptsInfo_obj.entityType.definition[nextPath].title = nextTitle;
conceptsInfo_obj.entityType.path = nextPath;
conceptsInfo_obj.entityType.title = nextTitle;
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
            "governingConcept": {
                "slug": "entityType",
                "name": "entity type",
                "title": "Entity Type"
            },
            "parents": [ ]
        },
        "ratableEntityTypes": {
            "slug": "ratableEntityTypes",
            "name": "ratable types of entities",
            "title": "Ratable Types of Entities",
            "governingConcept": {
                "slug": "ratableEntityType",
                "name": "ratable entity type",
                "title": "Ratable Entity Type"
            },
            "parents": [ "entityTypes" ]
        },
        "entityTypesThatCanRate": {
            "slug": "entityTypesThatCanRate",
            "name": "entity types that can rate",
            "title": "Entity Types that can Rate",
            "governingConcept": {
                "slug": "entityTypeThatCanRate",
                "name": "entity type that can rate",
                "title": "Entity Type that can Rate"
            },
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

var nextPath = "postData";
var nextTitle = "Post Data";
conceptsInfo_obj.post = {}
conceptsInfo_obj.post.definition = {};
conceptsInfo_obj.post.definition[nextPath] = JSON.parse(JSON.stringify(defaultDefinition_obj));
conceptsInfo_obj.post.definition[nextPath].title = nextTitle;
conceptsInfo_obj.post.path = nextPath;
conceptsInfo_obj.post.title = nextTitle;
conceptsInfo_obj.post.wordType = "post";
conceptsInfo_obj.post.superset = "posts";
conceptsInfo_obj.post.schema = "schemaForPost";
conceptsInfo_obj.post.JSONSchema = "JSONSchemaForPost";
conceptsInfo_obj.post.concept = "conceptForPost";
conceptsInfo_obj.post.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.post.allSets = [ "posts" ];
conceptsInfo_obj.post.allSets.posts = {};
conceptsInfo_obj.post.allSets.posts.specificInstances = [];
conceptsInfo_obj.post.allSets.posts.subsets = [];
conceptsInfo_obj.post.sets = {};
conceptsInfo_obj.post.specificInstances = {};


var nextPath = "userData";
var nextTitle = "User Data";
conceptsInfo_obj.user = {}
conceptsInfo_obj.user.definition = {};
conceptsInfo_obj.user.definition[nextPath] = JSON.parse(JSON.stringify(defaultDefinition_obj));
conceptsInfo_obj.user.definition[nextPath].title = nextTitle;
conceptsInfo_obj.user.path = nextPath;
conceptsInfo_obj.user.title = nextTitle;
conceptsInfo_obj.user.wordType = "user";
conceptsInfo_obj.user.superset = "users";
conceptsInfo_obj.user.schema = "schemaForUser";
conceptsInfo_obj.user.JSONSchema = "JSONSchemaForUser";
conceptsInfo_obj.user.concept = "conceptForUser";
conceptsInfo_obj.user.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.user.allSets = [ "users" ];
conceptsInfo_obj.user.allSets.users = {};
conceptsInfo_obj.user.allSets.users.specificInstances = [];
conceptsInfo_obj.user.allSets.users.subsets = [];
conceptsInfo_obj.user.sets = {};
conceptsInfo_obj.user.specificInstances = {};


var nextPath = "ratingData";
var nextTitle = "Rating Data";
conceptsInfo_obj.rating = {}
conceptsInfo_obj.rating.definition = {};
conceptsInfo_obj.rating.definition[nextPath] = JSON.parse(JSON.stringify(defaultDefinition_obj));
conceptsInfo_obj.rating.definition[nextPath].title = nextTitle;
conceptsInfo_obj.rating.path = nextPath;
conceptsInfo_obj.rating.title = nextTitle;
conceptsInfo_obj.rating.wordType = "rating";
conceptsInfo_obj.rating.superset = "ratings";
conceptsInfo_obj.rating.schema = "schemaForRating";
conceptsInfo_obj.rating.JSONSchema = "JSONSchemaForRating";
conceptsInfo_obj.rating.concept = "conceptForRating";
conceptsInfo_obj.rating.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.rating.allSets = [ "ratings", "ratingsOrganizedByRatee", "ratingsOrganizedByRater", "ratingsOfUsers", "ratingsOfPosts" ];
conceptsInfo_obj.rating.allSets.ratings = {};
conceptsInfo_obj.rating.allSets.ratings.specificInstances = [];
conceptsInfo_obj.rating.allSets.ratings.subsets = [];
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
var nextPath = "organismData";
var nextTitle = "Organism Data";
conceptsInfo_obj.organism = {}
conceptsInfo_obj.organism.definition = {};
conceptsInfo_obj.organism.definition[nextPath] = JSON.parse(JSON.stringify(defaultDefinition_obj));
conceptsInfo_obj.organism.definition[nextPath].title = nextTitle;
conceptsInfo_obj.organism.path = nextPath;
conceptsInfo_obj.organism.title = nextTitle;
conceptsInfo_obj.organism.wordType = "organism";
conceptsInfo_obj.organism.superset = "organisms";
conceptsInfo_obj.organism.schema = "schemaForOrganism";
conceptsInfo_obj.organism.JSONSchema = "JSONSchemaForOrganism";
conceptsInfo_obj.organism.concept = "conceptForOrganism";
conceptsInfo_obj.organism.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.organism.allSets = [ "organisms", "organismsAsPets" ];
conceptsInfo_obj.organism.allSets.organisms = {};
conceptsInfo_obj.organism.allSets.organisms.specificInstances = [];
conceptsInfo_obj.organism.allSets.organisms.subsets = [];
conceptsInfo_obj.organism.sets = {
        "organismsAsPets": {
            "slug": "organismsAsPets",
            "name": "organisms as pets",
            "title": "Organisms as Pets",
            "parent": "organisms"
        }
    };
conceptsInfo_obj.organism.specificInstances = {};


var nextPath = "organismTypeData";
var nextTitle = "Organism Type Data";
conceptsInfo_obj.organismType = {}
conceptsInfo_obj.organismType.definition = {};
conceptsInfo_obj.organismType.definition[nextPath] = JSON.parse(JSON.stringify(defaultDefinition_obj));
conceptsInfo_obj.organismType.definition[nextPath].title = nextTitle;
conceptsInfo_obj.organismType.path = nextPath;
conceptsInfo_obj.organismType.title = nextTitle;
conceptsInfo_obj.organismType.wordType = "organismType";
conceptsInfo_obj.organismType.superset = "organismTypes";
conceptsInfo_obj.organismType.schema = "schemaForOrganismType";
conceptsInfo_obj.organismType.JSONSchema = "JSONSchemaForOrganismType";
conceptsInfo_obj.organismType.concept = "conceptForOrganismType";
conceptsInfo_obj.organismType.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.organismType.allSets = [ "organismTypes" ];
conceptsInfo_obj.organismType.allSets.organismTypes = {};
conceptsInfo_obj.organismType.allSets.organismTypes.specificInstances = [];
conceptsInfo_obj.organismType.allSets.organismTypes.subsets = [];
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


var nextPath = "animalData";
var nextTitle = "Animal Data";
conceptsInfo_obj.animal = {}
conceptsInfo_obj.animal.definition = {};
conceptsInfo_obj.animal.definition[nextPath] = JSON.parse(JSON.stringify(defaultDefinition_obj));
conceptsInfo_obj.animal.definition[nextPath].title = nextTitle;
conceptsInfo_obj.animal.path = nextPath;
conceptsInfo_obj.animal.title = nextTitle;
conceptsInfo_obj.animal.wordType = "animal";
conceptsInfo_obj.animal.superset = "animals";
conceptsInfo_obj.animal.schema = "schemaForAnimal";
conceptsInfo_obj.animal.JSONSchema = "JSONSchemaForAnimal";
conceptsInfo_obj.animal.concept = "conceptForAnimal";
conceptsInfo_obj.animal.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.animal.allSets = [ "animals", "animalsAsPets" ];
conceptsInfo_obj.animal.allSets.animals = {};
conceptsInfo_obj.animal.allSets.animals.specificInstances = [];
conceptsInfo_obj.animal.allSets.animals.subsets = [];
conceptsInfo_obj.animal.sets = {
        "animalsAsPets": {
            "slug": "animalsAsPets",
            "name": "animals as pets",
            "title": "Animals as Pets",
            "parent": "animals"
        }
    };
conceptsInfo_obj.animal.specificInstances = {};


var nextPath = "animalTypeData";
var nextTitle = "Animal Type Data";
conceptsInfo_obj.animalType = {}
conceptsInfo_obj.animalType.definition = {};
conceptsInfo_obj.animalType.definition[nextPath] = JSON.parse(JSON.stringify(defaultDefinition_obj));
conceptsInfo_obj.animalType.definition[nextPath].title = nextTitle;
conceptsInfo_obj.animalType.path = nextPath;
conceptsInfo_obj.animalType.title = nextTitle;
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


var nextPath = "dogData";
var nextTitle = "Dog Data";
conceptsInfo_obj.dog = {}
conceptsInfo_obj.dog.definition = {};
conceptsInfo_obj.dog.definition[nextPath] = JSON.parse(JSON.stringify(defaultDefinition_obj));
conceptsInfo_obj.dog.definition[nextPath].title = nextTitle;
conceptsInfo_obj.dog.path = nextPath;
conceptsInfo_obj.dog.title = nextTitle;
conceptsInfo_obj.dog.wordType = "dog";
conceptsInfo_obj.dog.superset = "dogs";
conceptsInfo_obj.dog.schema = "schemaForDog";
conceptsInfo_obj.dog.JSONSchema = "JSONSchemaForDog";
conceptsInfo_obj.dog.concept = "conceptForDog";
conceptsInfo_obj.dog.specificInstanceFields = [ "slug", "name", "title" ];
conceptsInfo_obj.dog.allSets = [ "dogs", "dogsAsPets" ];
conceptsInfo_obj.dog.allSets.dogs={}
conceptsInfo_obj.dog.allSets.dogs.specificInstances=[ "MikeTheDog" ]
conceptsInfo_obj.dog.allSets.dogs.subsets=["dogsAsPets"]
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


var nextPath = "catData";
var nextTitle = "Cat Data";
conceptsInfo_obj.cat = {}
conceptsInfo_obj.cat.definition = {};
conceptsInfo_obj.cat.definition[nextPath] = JSON.parse(JSON.stringify(defaultDefinition_obj));
conceptsInfo_obj.cat.definition[nextPath].title = nextTitle;
conceptsInfo_obj.cat.path = nextPath;
conceptsInfo_obj.cat.title = nextTitle;
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
