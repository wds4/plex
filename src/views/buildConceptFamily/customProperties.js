

var emptyProp_obj = {
    "wordData": {
        "slug": "",
        "title": "",
        "name": "",
        "wordType": "property",
        "wordTypes": [
            "word",
            "property"
        ]
    },
    "propertyData": {
        "type": "",
        "conceptGraphStyle": {
            "type": "",
            "key": "",
            "conceptGraphProperties": []
        },
        "JSONSchemaStyle": {
            "key": "",
            "value": {
                "type": ""
            }
        }
    },
    "globalDynamicData": {
        "myDictionaries": [
            "myDictionary_temporary"
        ],
        "myConceptGraphs": [
            "myConceptGraph_temporary"
        ],
        "specificInstanceOf": [
        ]
    },
    "metaData": {
        "ipns": ""
    }
}

var nextRel = [];

export var customPropertyNodes = {};
export var customPropertyRelationships = {};
export var customPropertySets = [];
customPropertyNodes.property = [];
customPropertyNodes.rating = [];
customPropertyRelationships.property = []
customPropertyRelationships.rating = [];

// make the list of customPropertySets all subsetOf the superset: properties
// could also do it like this:
// nextRel = ["properties_reservedKeywords", "subsetOf", "properties"];
// customPropertyRelationships.property.push(nextRel);
customPropertySets = [
  "properties_reservedKeywords",
  "properties_reservedValues",
  "properties_valueNull",
  "properties_singleKeyValuePair_reservedValues",
  "properties_singleKeyValuePair_unreservedValues",
  "properties_type1",
  "properties_type2",
  "properties_type3"
]
var prop_x_obj = JSON.parse(JSON.stringify(emptyProp_obj));
var prop1_obj = JSON.parse(JSON.stringify(emptyProp_obj));
var prop2_obj = JSON.parse(JSON.stringify(emptyProp_obj));
var prop3_obj = JSON.parse(JSON.stringify(emptyProp_obj));
var prop4_obj = JSON.parse(JSON.stringify(emptyProp_obj));
var prop5_obj = JSON.parse(JSON.stringify(emptyProp_obj));

// prop_x_obj is the EMPTY or NULL property
var prop_NULL_obj = JSON.parse(JSON.stringify(emptyProp_obj));
prop_NULL_obj.wordData.slug = "property_NULL_abcde";
prop_NULL_obj.wordData.title = "";
prop_NULL_obj.propertyData.type = ""; // type1, type2, type3, hasKey, setType
prop_NULL_obj.propertyData.conceptGraphStyle = {
    "type": "",
    "key": "",
    "conceptGraphProperties": []
};
prop_NULL_obj.propertyData.JSONSchemaStyle.key = ""; // paste from OTB dictionary
prop_NULL_obj.propertyData.JSONSchemaStyle.value = {}; // paste from OTB dictionary
customPropertyNodes.property.push(prop_NULL_obj)

nextRel = ["property_NULL_abcde", "isASpecificInstanceOf", "properties"];
customPropertyRelationships.property.push(nextRel);

// relationships:
// property_NULL_abcde -addKey{field:"type"}-> (property_addKey_type_abcde)
// (property_addKey_type_abcde) -addValue{field:"string"}-> property_String_abcde
var prop_string_obj = JSON.parse(JSON.stringify(emptyProp_obj));
prop_string_obj.wordData.slug = "property_String_abcde"; // convention: capitalize reserved values like String, Object, etc
prop_string_obj.wordData.title = "";
prop_string_obj.propertyData.type = "type1";
prop_string_obj.propertyData.conceptGraphStyle = {
    "type": "string",
    "key": "",
    "conceptGraphProperties": []
};
prop_string_obj.propertyData.JSONSchemaStyle.key = "";
prop_string_obj.propertyData.JSONSchemaStyle.value = {
    "type": "string"
};
customPropertyNodes.property.push(prop_string_obj)

// set of all reservedKeywords; repeat the above process (for type) for each of the following reserved keywords
nextRel = ["property_addKey_type_abcde", "isASpecificInstanceOf", "properties_reservedKeywords"];
customPropertyRelationships.property.push(nextRel);
nextRel = ["property_addKey_slug_abcde", "isASpecificInstanceOf", "properties_reservedKeywords"];
customPropertyRelationships.property.push(nextRel);
nextRel = ["property_addKey_title_abcde", "isASpecificInstanceOf", "properties_reservedKeywords"];
customPropertyRelationships.property.push(nextRel);
nextRel = ["property_addKey_name_abcde", "isASpecificInstanceOf", "properties_reservedKeywords"];
customPropertyRelationships.property.push(nextRel);
nextRel = ["property_addKey_properties_abcde", "isASpecificInstanceOf", "properties_reservedKeywords"];
customPropertyRelationships.property.push(nextRel);
nextRel = ["property_addKey_required_abcde", "isASpecificInstanceOf", "properties_reservedKeywords"];
customPropertyRelationships.property.push(nextRel);
// not sure if key or defaukt should be a reserved keyword or not
nextRel = ["property_addKey_key_abcde", "isASpecificInstanceOf", "properties_reservedKeywords"];
customPropertyRelationships.property.push(nextRel);
nextRel = ["property_addKey_default_abcde", "isASpecificInstanceOf", "properties_reservedKeywords"];
customPropertyRelationships.property.push(nextRel);
var reservedKeywords = [
    "type",
    "slug",
    "title",
    "name",
    "properties",
    "required",
    "key",
    "default"
]
var reservedValues_type = [
    "string",
    "integer",
    "array",
    "object"
]
// property_NULL_abcde -addKey{field:"slug"}-> (property_addKey_slug_abcde)
// property_NULL_abcde -addKey{field:"title"}-> (property_addKey_title_abcde)
// etc.

// ABOVE would likely go into the core schemaForProperty
// These would include reserved keywords and reseved values;
// the set properties_singleKeyValuePair_unreservedValues would go in the core,
// but subsets and specificInstances of properties_singleKeyValuePair_unreservedValues would belong within the concpts that use them
//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
////////////// SOME SAMPLE PROPERTIES FROM THE OTB GRAPEVINE RATING SYSTEM ///////////////////
// BELOW would likely go into the relevant concepts that use them

// (property_addKey_title_abcde) -addValue{field:"Keybase Username"}-> property_title_keybaseUsername_abcde
prop_title_keybaseUsername_obj.wordData.slug = "property_title_keybaseUsername_abcde";
prop_title_keybaseUsername_obj.wordData.title = "";
prop_title_keybaseUsername_obj.propertyData.type = "";
prop_title_keybaseUsername_obj.propertyData.conceptGraphStyle = {
    "type": "",
    "key": "",
    "conceptGraphProperties": [],
    "title": "Keybase Username"
};
prop_title_keybaseUsername_obj.propertyData.JSONSchemaStyle.key = "title_keybaseUsername";
prop_title_keybaseUsername_obj.propertyData.JSONSchemaStyle.value = {
    "title": "Keybase Username"
};
customPropertyNodes.rating.push(prop_title_keybaseUsername_obj)

// property_string_abcde -propagateProperty-> property_keybaseUsername_abcde
// property_key_keybaseUsername_abcde -propagateProperty-> property_type1_keybaseUsername_abcde
// property_title_keybaseUsername_abcde -propagateProperty-> property_type1_keybaseUsername_abcde
// property_default_EMPTY_abcde -propagateProperty-> property_type1_keybaseUsername_abcde
prop_keybaseUsername_obj.wordData.slug = "property_type1_keybaseUsername_abcde";
prop_keybaseUsername_obj.wordData.title = "";
prop_keybaseUsername_obj.propertyData.type = "type1";
prop_keybaseUsername_obj.propertyData.conceptGraphStyle = {
    "type": "string",
    "key": "keybaseUsername",
    "conceptGraphProperties": [],
    "title": "Keybase Username",
    "default": ""
};
prop_keybaseUsername_obj.propertyData.JSONSchemaStyle.key = "keybaseUsername";
prop_keybaseUsername_obj.propertyData.JSONSchemaStyle.value = {
    "type": "string",
    "title": "Keybase Username",
    "default": ""
};
customPropertyNodes.rating.push(prop_keybaseUsername_obj)

// property_object_abcde -propagateProperty-> property_userIdFields_abcde
// property_key_userIdFields_abcde -propagateProperty-> property_keybaseUsername_abcde
// property_keybaseUsername_abcde -addToConceptGraphProperties{required:true}-> property_userIdFields_abcde
// property_blockstackID_abcde -addToConceptGraphProperties{required:false}-> property_userIdFields_abcde
// property_pgpFingerprint_abcde -addToConceptGraphProperties-> property_userIdFields_abcde
// property_IPFSPublicKey_abcde -addToConceptGraphProperties-> property_userIdFields_abcde
// property_OnTheBlockchainUserID_abcde -addToConceptGraphProperties-> property_userIdFields_abcde
// property_OnTheBlockchainUsername_abcde -addToConceptGraphProperties-> property_userIdFields_abcde
// property_OpenBazaarPeerID_abcde -addToConceptGraphProperties-> property_userIdFields_abcde
// property_OpenBazaarUsername_abcde -addToConceptGraphProperties-> property_userIdFields_abcde
prop_userIdFields_obj.wordData.slug = "property_userIdFields_abcde";
prop_userIdFields_obj.wordData.title = "Property for UserIdFields";
prop_userIdFields_obj.propertyData.type = "type3";
prop_userIdFields_obj.propertyData.conceptGraphStyle = {
    "type": "object",
    "key": "userIdFields",
    "properties": [
        "property_keybaseUsername_abcde",
        "property_blockstackID_abcde",
        "property_pgpFingerprint_abcde",
        "property_IPFSPublicKey_abcde",
        "property_OnTheBlockchainUserID_abcde",
        "property_OnTheBlockchainUsername_abcde",
        "property_OpenBazaarPeerID_abcde",
        "property_OpenBazaarUsername_abcde"
    ],
    "required": [
        "property_keybaseUsername_abcde",
        "property_OpenBazaarPeerID_abcde"
    ]
};
prop_userIdFields_obj.propertyData.JSONSchemaStyle.key = "userIdFields";
prop_userIdFields_obj.propertyData.JSONSchemaStyle.value = {
    "title": "User ID Fields",
    "description": "This is a collection of objects, each of which represents one user ID field. Every active user ID field is represented.",
    "type": "object",
    "required": [
        "keybaseUsername",
        "OpenBazaarPeerID"
    ],
    "default": {},
    "properties": {
        "keybaseUsername": {
            "type": "string",
            "title": "Keybase Username"
        },
        "blockstackID": {
            "type": "string",
            "title": "Blockstack ID"
        },
        "pgpFingerprint": {
            "type": "string",
            "title": "pgp Fingerprint"
        },
        "IPFSPublicKey": {
            "type": "string",
            "title": "IPFS Public Key"
        },
        "OnTheBlockchainUserID": {
            "type": "string",
            "title": "OnTheBlockchain User ID"
        },
        "OnTheBlockchainUsername": {
            "type": "string",
            "title": "OnTheBlockchain Username"
        },
        "OpenBazaarPeerID": {
            "type": "string",
            "default": null,
            "title": "Open Bazaar PeerID"
        },
        "OpenBazaarUsername": {
            "type": "string",
            "title": "Open Bazaar Username"
        }
    }
};
customPropertyNodes.rating.push(prop_userIdFields_obj)

// property_object_abcde -propagateProperty-> property_ratingData_abcde
// property_key_ratingData_abcde -propagateProperty-> property_ratingData_abcde
// property_ratingTemplateData_abcde -addToConceptGraphProperties{required:true}-> property_ratingData_abcde
// property_raterData_abcde -addToConceptGraphProperties{required:true}-> property_ratingData_abcde
// property_rateeData_abcde -addToConceptGraphProperties{required:true}-> property_ratingData_abcde
// property_ratingFieldsData_abcde -addToConceptGraphProperties{required:true}-> property_ratingData_abcde
var prop_rating_obj = JSON.parse(JSON.stringify(emptyProp_obj));
prop_rating_obj.wordData.slug = "property_ratingData_abcde";
prop_rating_obj.wordData.title = "";
prop_rating_obj.propertyData.type = "type3"; // type1, type2, type3, hasKey, setType
prop_rating_obj.propertyData.conceptGraphStyle = {
    "type": "object",
    "key": "ratingData",
    "properties": [
        "property_ratingTemplateData_abcde",
        "property_raterData_abcde",
        "property_rateeData_abcde",
        "property_ratingFieldsData_abcde"
    ],
    "required": [
        "property_ratingTemplateData_abcde",
        "property_raterData_abcde",
        "property_rateeData_abcde",
        "property_ratingFieldsData_abcde"
    ],
};
prop_rating_obj.propertyData.JSONSchemaStyle.key = "ratingData"; // paste from OTB dictionary
prop_rating_obj.propertyData.JSONSchemaStyle.value = {
    "type": "object",
    "default": {},
    "required": [
        "ratingTemplateData",
        "raterData",
        "rateeData",
        "ratingFieldsData",
        "timestamp"
    ],
    "properties": {
        "ratingTemplateData": {
            "type": "object",
            "required": [],
            "default": {},
            "properties": {
                "title": {
                    "type": "string",
                    "default": null
                },
                "slug": {
                    "type": "string",
                    "default": null
                },
                "IPNS": {
                    "type": "string",
                    "default": null
                }
            }
        },
        "raterData": {
            "title": "Rater Data",
            "type": "object",
            "default": {},
            "required": [
                "type",
                "idFields"
            ],
            "properties": {
                "type": {
                    "type": "string",
                    "default": "user"
                },
                "idFields": {
                    "$ref": "#/definitions/userIdFields"
                }
            }
        },
        "rateeData": {
            "title": "Ratee Data",
            "type": "object",
            "default": {},
            "required": [
                "type",
                "idFields"
            ],
            "properties": {
                "type": {
                    "title": "Ratee Type",
                    "description": "the type of entity (e.g. user, listing, etc) that is being rated",
                    "type": "string",
                    "contains": {
                        "$ref": "#/definitions/rateeTypesList"
                    }
                },
                "idFields": {
                    "type": "object",
                    "required": [],
                    "properties": {}
                }
            }
        },
        "ratingFieldsData": {
            "type": "object",
            "default": {},
            "required": [],
            "properties": {}
        }
    }
}; // pasted from OTB dictionary
customPropertyNodes.property.push(prop_rating_obj)
