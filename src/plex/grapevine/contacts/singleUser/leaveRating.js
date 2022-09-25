import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../../lib/ipfs/miscIpfsFunctions.js'
import { Button } from "reactstrap";
import { useDropzone } from "react-dropzone";
import Masthead from '../../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/grapevine_leftNav1';
import { create, urlSource } from 'ipfs'
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";

const jQuery = require("jquery");

const uiSchema = {
    address: { 'ui:widget': 'hidden' },
}



const jsonSchemaRatingTest = {
    "wordData": {
        "slug": "JSONSchemaFor_rating",
        "title": "JSONSchema for Rating",
        "name": "JSONSchema for rating",
        "description": "",
        "wordType": "JSONSchema",
        "wordTypes": [
            "word",
            "JSONSchema"
        ],
        "governingConcepts": [
            "conceptFor_rating"
        ]
    },
    "JSONSchemaData": {
        "slug": "rating",
        "title": "Rating",
        "name": "rating",
        "description": "",
        "metaData": {
            "governingConcept": {
                "slug": "conceptFor_rating"
            },
            "primaryProperty": "primaryPropertyFor_rating"
        },
        "requiredDefinitions": []
    },
    "$schema": "http://json-schema.org/draft-07/schema",
    "definitions": {
        "userData": {
            "type": "object",
            "slug": "userData",
            "name": "user data",
            "title": "User Data",
            "description": "data about this user",
            "types": [
                "primaryProperty"
            ],
            "require": true,
            "required": [
                "slug",
                "name",
                "title"
            ],
            "unique": [
                "slug",
                "name",
                "title"
            ],
            "properties": {
                "slug": {
                    "type": "string",
                    "slug": "slug",
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this user"
                },
                "name": {
                    "type": "string",
                    "slug": "name",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this user"
                },
                "title": {
                    "type": "string",
                    "slug": "title",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this user"
                },
                "description": {
                    "type": "string",
                    "slug": "description",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this user"
                }
            }
        },
        "listingData": {
            "type": "object",
            "slug": "listingData",
            "name": "listing data",
            "title": "Listing Data",
            "description": "data about this listing",
            "types": [
                "primaryProperty"
            ],
            "require": true,
            "required": [
                "slug",
                "name",
                "title"
            ],
            "unique": [
                "slug",
                "name",
                "title"
            ],
            "properties": {
                "slug": {
                    "type": "string",
                    "slug": "slug",
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this listing"
                },
                "name": {
                    "type": "string",
                    "slug": "name",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this listing"
                },
                "title": {
                    "type": "string",
                    "slug": "title",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this listing"
                },
                "description": {
                    "type": "string",
                    "slug": "description",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this listing"
                }
            }
        },
        "postData": {
            "type": "object",
            "slug": "postData",
            "name": "post data",
            "title": "Post Data",
            "description": "data about this post",
            "types": [
                "primaryProperty"
            ],
            "require": true,
            "required": [
                "slug",
                "name",
                "title"
            ],
            "unique": [
                "slug",
                "name",
                "title"
            ],
            "properties": {
                "slug": {
                    "type": "string",
                    "slug": "slug",
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this post"
                },
                "name": {
                    "type": "string",
                    "slug": "name",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this post"
                },
                "title": {
                    "type": "string",
                    "slug": "title",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this post"
                },
                "description": {
                    "type": "string",
                    "slug": "description",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this post"
                }
            }
        },
        "confidenceFieldsetData": {
            "type": "object",
            "slug": "confidenceFieldsetData",
            "name": "confidence fieldset data",
            "title": "Confidence Fieldset Data",
            "description": "data about this confidence fieldset",
            "types": [
                "primaryProperty"
            ],
            "require": true,
            "required": [
                "slug",
                "name",
                "title",
                "confidence"
            ],
            "unique": [
                "slug",
                "name",
                "title"
            ],
            "properties": {
                "slug": {
                    "type": "string",
                    "slug": "slug",
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this confidence fieldset"
                },
                "name": {
                    "type": "string",
                    "slug": "name",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this confidence fieldset"
                },
                "title": {
                    "type": "string",
                    "slug": "title",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this confidence fieldset"
                },
                "description": {
                    "type": "string",
                    "slug": "description",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this confidence fieldset"
                },
                "confidence": {
                    "type": "integer",
                    "slug": "confidence",
                    "name": "confidence",
                    "title": "Confidence",
                    "description": "Provide a description of this confidence.",
                    "minimum": 0,
                    "maximum": 100
                }
            }
        },
        "trustFieldsetData": {
            "type": "object",
            "slug": "trustFieldsetData",
            "name": "trust fieldset data",
            "title": "Trust Fieldset Data",
            "description": "data about this trust fieldset",
            "types": [
                "primaryProperty"
            ],
            "require": true,
            "required": [
                "slug",
                "name",
                "title",
                "trustRating",
                "referenceTrustRating",
                "referenceData",
                "context"
            ],
            "unique": [
                "slug",
                "name",
                "title"
            ],
            "properties": {
                "slug": {
                    "type": "string",
                    "slug": "slug",
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this trust fieldset"
                },
                "name": {
                    "type": "string",
                    "slug": "name",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this trust fieldset"
                },
                "title": {
                    "type": "string",
                    "slug": "title",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this trust fieldset"
                },
                "description": {
                    "type": "string",
                    "slug": "description",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this trust fieldset"
                },
                "trustRating": {
                    "type": "integer",
                    "slug": "trustRating",
                    "name": "trust rating",
                    "title": "Trust Rating",
                    "description": "Provide a description of this trust rating.",
                    "minimum": 0,
                    "maximum": 100
                },
                "referenceTrustRating": {
                    "type": "integer",
                    "slug": "referenceTrustRating",
                    "name": "reference trust rating",
                    "title": "Reference Trust Rating",
                    "description": "Provide a description of this reference trust rating.",
                    "minimum": 0,
                    "maximum": 100
                },
                "referenceData": {
                    "type": "object",
                    "slug": "referenceData",
                    "name": "reference data",
                    "title": "Reference Data",
                    "description": "Provide a description of this reference data.",
                    "required": [
                        "referenceEntityType"
                    ],
                    "unique": [],
                    "properties": {
                        "referenceEntityType": {
                            "type": "string",
                            "slug": "referenceEntityType",
                            "name": "reference entity type",
                            "title": "Reference Entity Type",
                            "description": "Provide a description of this reference entity type.",
                            "enum": [
                                "user",
                                "listing",
                                "post",
                                null
                            ],
                            "dependencyPlacement": "lower"
                        }
                    },
                    "dependencies": {
                        "referenceEntityType": {
                            "oneOf": [
                                {
                                    "properties": {
                                        "referenceEntityType": {
                                            "enum": [
                                                "user"
                                            ]
                                        },
                                        "userData": {
                                            "$ref": "#/definitions/userData"
                                        }
                                    },
                                    "required": [
                                        "userData"
                                    ]
                                },
                                {
                                    "properties": {
                                        "referenceEntityType": {
                                            "enum": [
                                                "listing"
                                            ]
                                        },
                                        "listingData": {
                                            "$ref": "#/definitions/listingData"
                                        }
                                    },
                                    "required": [
                                        "listingData"
                                    ]
                                },
                                {
                                    "properties": {
                                        "referenceEntityType": {
                                            "enum": [
                                                "post"
                                            ]
                                        },
                                        "postData": {
                                            "$ref": "#/definitions/postData"
                                        }
                                    },
                                    "required": [
                                        "postData"
                                    ]
                                }
                            ]
                        }
                    }
                },
                "context": {
                    "type": "string",
                    "slug": "context",
                    "name": "context",
                    "title": "Context",
                    "description": "Provide a description of this context.",
                    "enum": [
                        null
                    ]
                }
            }
        },
        "commentsFieldsetData": {
            "type": "object",
            "slug": "commentsFieldsetData",
            "name": "comments fieldset data",
            "title": "Comments Fieldset Data",
            "description": "data about this comments fieldset",
            "types": [
                "primaryProperty"
            ],
            "require": true,
            "required": [
                "slug",
                "name",
                "title",
                "comments"
            ],
            "unique": [
                "slug",
                "name",
                "title"
            ],
            "properties": {
                "slug": {
                    "type": "string",
                    "slug": "slug",
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this comments fieldset"
                },
                "name": {
                    "type": "string",
                    "slug": "name",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this comments fieldset"
                },
                "title": {
                    "type": "string",
                    "slug": "title",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this comments fieldset"
                },
                "description": {
                    "type": "string",
                    "slug": "description",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this comments fieldset"
                },
                "comments": {
                    "type": "string",
                    "slug": "comments",
                    "name": "comments",
                    "title": "Comments",
                    "description": "Provide a description of this comments."
                }
            }
        },
        "5starFieldsetData": {
            "type": "object",
            "slug": "5starFieldsetData",
            "name": "5star fieldset data",
            "title": "5star Fieldset Data",
            "description": "data about this 5star fieldset",
            "types": [
                "primaryProperty"
            ],
            "require": true,
            "required": [
                "slug",
                "name",
                "title",
                "stars"
            ],
            "unique": [
                "slug",
                "name",
                "title"
            ],
            "properties": {
                "slug": {
                    "type": "string",
                    "slug": "slug",
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this 5star fieldset"
                },
                "name": {
                    "type": "string",
                    "slug": "name",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this 5star fieldset"
                },
                "title": {
                    "type": "string",
                    "slug": "title",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this 5star fieldset"
                },
                "description": {
                    "type": "string",
                    "slug": "description",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this 5star fieldset"
                },
                "stars": {
                    "type": "number",
                    "slug": "stars",
                    "name": "stars",
                    "title": "Stars",
                    "description": "Provide a description of this stars.",
                    "minimum": 0,
                    "maximum": 5
                }
            }
        }
    },
    "type": "object",
    "required": [
        "ratingData"
    ],
    "dependencies": {},
    "properties": {
        "ratingData": {
            "type": "object",
            "slug": "ratingData",
            "name": "rating data",
            "title": "Rating Data",
            "description": "data about this rating",
            "types": [
                "primaryProperty"
            ],
            "require": true,
            "required": [
                "slug",
                "name",
                "title",
                "ratingTemplateData",
                "raterData",
                "rateeData",
                "ratingFieldsetData"
            ],
            "unique": [
                "slug",
                "name",
                "title"
            ],
            "properties": {
                "slug": {
                    "type": "string",
                    "slug": "slug",
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this rating"
                },
                "name": {
                    "type": "string",
                    "slug": "name",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this rating"
                },
                "title": {
                    "type": "string",
                    "slug": "title",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this rating"
                },
                "description": {
                    "type": "string",
                    "slug": "description",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this rating"
                },
                "ratingTemplateData": {
                    "type": "object",
                    "slug": "ratingTemplateData",
                    "name": "rating template data",
                    "title": "Rating Template Data",
                    "description": "Provide a description of this rating template data.",
                    "required": [
                        "ratingTemplateName"
                    ],
                    "unique": [],
                    "properties": {
                        "ratingTemplateName": {
                            "type": "string",
                            "slug": "ratingTemplateName",
                            "name": "rating template name",
                            "title": "Rating Template Name",
                            "description": "Provide a description of this rating template name.",
                            "enum": [
                                "Generic User Trust",
                                "Listing Delivery Speed",
                                "Flag User as Troll",
                                "Flag User as Troll Hunter",
                                "Writing Quality of User",
                                "Writing Quality of Post",
                                null
                            ]
                        }
                    }
                },
                "raterData": {
                    "type": "object",
                    "slug": "raterData",
                    "name": "rater data",
                    "title": "Rater Data",
                    "description": "Provide a description of this rater data.",
                    "required": [
                        "raterEntityType"
                    ],
                    "unique": [],
                    "properties": {
                        "raterEntityType": {
                            "type": "string",
                            "slug": "raterEntityType",
                            "name": "rater entity type",
                            "title": "Rater Entity Type",
                            "description": "Provide a description of this rater entity type.",
                            "enum": [
                                "user",
                                null
                            ],
                            "dependencyPlacement": "lower"
                        }
                    },
                    "dependencies": {
                        "raterEntityType": {
                            "oneOf": [
                                {
                                    "properties": {
                                        "raterEntityType": {
                                            "enum": [
                                                "user"
                                            ]
                                        },
                                        "userData": {
                                            "$ref": "#/definitions/userData"
                                        }
                                    },
                                    "required": [
                                        "userData"
                                    ]
                                }
                            ]
                        }
                    }
                },
                "rateeData": {
                    "type": "object",
                    "slug": "rateeData",
                    "name": "ratee data",
                    "title": "Ratee Data",
                    "description": "Provide a description of this ratee data.",
                    "required": [
                        "rateeEntityType"
                    ],
                    "unique": [],
                    "properties": {
                        "rateeEntityType": {
                            "type": "string",
                            "slug": "rateeEntityType",
                            "name": "ratee entity type",
                            "title": "Ratee Entity Type",
                            "description": "Provide a description of this ratee entity type.",
                            "enum": [
                                "user",
                                "listing",
                                "post",
                                null
                            ],
                            "dependencyPlacement": "lower"
                        }
                    },
                    "dependencies": {
                        "rateeEntityType": {
                            "oneOf": [
                                {
                                    "properties": {
                                        "rateeEntityType": {
                                            "enum": [
                                                "user"
                                            ]
                                        },
                                        "userData": {
                                            "$ref": "#/definitions/userData"
                                        }
                                    },
                                    "required": [
                                        "userData"
                                    ]
                                },
                                {
                                    "properties": {
                                        "rateeEntityType": {
                                            "enum": [
                                                "listing"
                                            ]
                                        },
                                        "listingData": {
                                            "$ref": "#/definitions/listingData"
                                        }
                                    },
                                    "required": [
                                        "listingData"
                                    ]
                                },
                                {
                                    "properties": {
                                        "rateeEntityType": {
                                            "enum": [
                                                "post"
                                            ]
                                        },
                                        "postData": {
                                            "$ref": "#/definitions/postData"
                                        }
                                    },
                                    "required": [
                                        "postData"
                                    ]
                                }
                            ]
                        }
                    }
                },
                "ratingFieldsetData": {
                    "type": "object",
                    "slug": "ratingFieldsetData",
                    "name": "rating fieldset data",
                    "title": "Rating Fieldset Data",
                    "description": "Provide a description of this rating fieldset data.",
                    "required": [
                        "ratingFieldsetName"
                    ],
                    "unique": [],
                    "properties": {
                        "ratingFieldsetName": {
                            "type": "string",
                            "slug": "ratingFieldsetName",
                            "name": "rating fieldset name",
                            "title": "Rating Fieldset Name",
                            "description": "Provide a description of this rating fieldset name.",
                            "enum": [
                                "confidence fieldset",
                                "trust fieldset",
                                "comments fieldset",
                                "5star fieldset",
                                null
                            ],
                            "dependencyPlacement": "lower"
                        }
                    },
                    "dependencies": {
                        "ratingFieldsetName": {
                            "oneOf": [
                                {
                                    "properties": {
                                        "ratingFieldsetName": {
                                            "enum": [
                                                "confidence fieldset"
                                            ]
                                        },
                                        "confidenceFieldsetData": {
                                            "$ref": "#/definitions/confidenceFieldsetData"
                                        }
                                    },
                                    "required": [
                                        "confidenceFieldsetData"
                                    ]
                                },
                                {
                                    "properties": {
                                        "ratingFieldsetName": {
                                            "enum": [
                                                "trust fieldset"
                                            ]
                                        },
                                        "trustFieldsetData": {
                                            "$ref": "#/definitions/trustFieldsetData"
                                        }
                                    },
                                    "required": [
                                        "trustFieldsetData"
                                    ]
                                },
                                {
                                    "properties": {
                                        "ratingFieldsetName": {
                                            "enum": [
                                                "comments fieldset"
                                            ]
                                        },
                                        "commentsFieldsetData": {
                                            "$ref": "#/definitions/commentsFieldsetData"
                                        }
                                    },
                                    "required": [
                                        "commentsFieldsetData"
                                    ]
                                },
                                {
                                    "properties": {
                                        "ratingFieldsetName": {
                                            "enum": [
                                                "5star fieldset"
                                            ]
                                        },
                                        "5starFieldsetData": {
                                            "$ref": "#/definitions/5starFieldsetData"
                                        }
                                    },
                                    "required": [
                                        "5starFieldsetData"
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }
    },
    "globalDynamicData": {
        "myDictionaries": [],
        "myConceptGraphs": [
            "myConceptGraph_plexPlayground"
        ],
        "specificInstanceOf": [],
        "valenceData": {
            "valenceL1": [],
            "parentJSONSchemaSequence": []
        }
    },
    "metaData": {
        "ipns": "k2k4r8or8ikbwym4qq9u2dz2fd9cwwlr7t6bi1kkols0ceh6cf9hj2bt",
        "keyname": "plexWord_JSONSchema_1662513743478_969",
        "lastUpdate": 1662521388835,
        "neuroCore": {
            "initialProcessing": true,
            "lastUpdate": null
        }
    },
    "allOf": [
        {
            "if": {
                "properties": {
                    "ratingData": {
                        "properties": {
                            "ratingTemplateData": {
                                "properties": {
                                    "ratingTemplateName": {
                                        "enum": [
                                            "Generic User Trust"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "then": {
                "properties": {
                    "ratingData": {
                        "properties": {
                            "raterData": {
                                "properties": {
                                    "raterEntityType": {
                                        "const": "user",
                                        "enum": [
                                            "user"
                                        ]
                                    }
                                }
                            },
                            "rateeData": {
                                "properties": {
                                    "rateeEntityType": {
                                        "const": "user",
                                        "enum": [
                                            "user"
                                        ]
                                    }
                                }
                            },
                            "ratingFieldsetData": {
                                "properties": {
                                    "ratingFieldsetName": {
                                        "const": "trust fieldset",
                                        "enum": [
                                            "trust fieldset"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            "if": {
                "properties": {
                    "ratingData": {
                        "properties": {
                            "ratingTemplateData": {
                                "properties": {
                                    "ratingTemplateName": {
                                        "enum": [
                                            "Listing Delivery Speed"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "then": {
                "properties": {
                    "ratingData": {
                        "properties": {
                            "raterData": {
                                "properties": {
                                    "raterEntityType": {
                                        "const": "user",
                                        "enum": [
                                            "user"
                                        ]
                                    }
                                }
                            },
                            "rateeData": {
                                "properties": {
                                    "rateeEntityType": {
                                        "const": "listing",
                                        "enum": [
                                            "listing"
                                        ]
                                    }
                                }
                            },
                            "ratingFieldsetData": {
                                "properties": {
                                    "ratingFieldsetName": {
                                        "const": "5star fieldset",
                                        "enum": [
                                            "5star fieldset"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            "if": {
                "properties": {
                    "ratingData": {
                        "properties": {
                            "ratingTemplateData": {
                                "properties": {
                                    "ratingTemplateName": {
                                        "enum": [
                                            "Flag User as Troll"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "then": {
                "properties": {
                    "ratingData": {
                        "properties": {
                            "raterData": {
                                "properties": {
                                    "raterEntityType": {
                                        "const": "user",
                                        "enum": [
                                            "user"
                                        ]
                                    }
                                }
                            },
                            "rateeData": {
                                "properties": {
                                    "rateeEntityType": {
                                        "const": "user",
                                        "enum": [
                                            "user"
                                        ]
                                    }
                                }
                            },
                            "ratingFieldsetData": {
                                "properties": {
                                    "ratingFieldsetName": {
                                        "const": "comments fieldset",
                                        "enum": [
                                            "comments fieldset"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            "if": {
                "properties": {
                    "ratingData": {
                        "properties": {
                            "ratingTemplateData": {
                                "properties": {
                                    "ratingTemplateName": {
                                        "enum": [
                                            "Flag User as Troll Hunter"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "then": {
                "properties": {
                    "ratingData": {
                        "properties": {
                            "raterData": {
                                "properties": {
                                    "raterEntityType": {
                                        "const": "user",
                                        "enum": [
                                            "user"
                                        ]
                                    }
                                }
                            },
                            "rateeData": {
                                "properties": {
                                    "rateeEntityType": {
                                        "const": "user",
                                        "enum": [
                                            "user"
                                        ]
                                    }
                                }
                            },
                            "ratingFieldsetData": {
                                "properties": {
                                    "ratingFieldsetName": {
                                        "const": "comments fieldset",
                                        "enum": [
                                            "comments fieldset"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            "if": {
                "properties": {
                    "ratingData": {
                        "properties": {
                            "ratingTemplateData": {
                                "properties": {
                                    "ratingTemplateName": {
                                        "enum": [
                                            "Writing Quality of User"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "then": {
                "properties": {
                    "ratingData": {
                        "properties": {
                            "raterData": {
                                "properties": {
                                    "raterEntityType": {
                                        "const": "user",
                                        "enum": [
                                            "user"
                                        ]
                                    }
                                }
                            },
                            "rateeData": {
                                "properties": {
                                    "rateeEntityType": {
                                        "const": "user",
                                        "enum": [
                                            "user"
                                        ]
                                    }
                                }
                            },
                            "ratingFieldsetData": {
                                "properties": {
                                    "ratingFieldsetName": {
                                        "const": "5star fieldset",
                                        "enum": [
                                            "5star fieldset"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            "if": {
                "properties": {
                    "ratingData": {
                        "properties": {
                            "ratingTemplateData": {
                                "properties": {
                                    "ratingTemplateName": {
                                        "enum": [
                                            "Writing Quality of Post"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "then": {
                "properties": {
                    "ratingData": {
                        "properties": {
                            "raterData": {
                                "properties": {
                                    "raterEntityType": {
                                        "const": "user",
                                        "enum": [
                                            "user"
                                        ]
                                    }
                                }
                            },
                            "rateeData": {
                                "properties": {
                                    "rateeEntityType": {
                                        "const": "post",
                                        "enum": [
                                            "post"
                                        ]
                                    }
                                }
                            },
                            "ratingFieldsetData": {
                                "properties": {
                                    "ratingFieldsetName": {
                                        "const": "5star fieldset",
                                        "enum": [
                                            "5star fieldset"
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    ]
}


const onFormSubmit = async ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
}

const onFormChange = async ({formData}, e) => {
    var sNewRating = await MiscFunctions.cloneObj(JSON.stringify(formData,null,4));
    jQuery("#newRatingRawFile").val(sNewRating)
}

const renderFormFromNode = (slug) => {
    var oWord = window.lookupWordBySlug[slug];
    var oSchema = {};
    if (oWord.hasOwnProperty("propertyData")) {
        oSchema = oWord.propertyData;
    }
    if (oWord.hasOwnProperty("JSONSchemaData")) {
        oSchema = oWord;
    }

    oSchema = MiscFunctions.cloneObj(jsonSchemaRatingTest)

    ReactDOM.render(
        <Form
            schema={oSchema}
            validator={validator}
            onSubmit={onFormSubmit}
            onChange={onFormChange}
            uiSchema={uiSchema}
            liveOmit
            omitExtraData
        />,
        document.getElementById("renderedFormElem")
    )
}

const populateFields = async (cid) => {
    console.log("populateFields")
    jQuery("#myIpfsPeerID").html(cid)
    var ipfsPath = "/ipns/"+cid+"/grapevineData/userProfileData/myProfile.txt";

    try {
        for await (const chunk of MiscIpfsFunctions.ipfs.cat(ipfsPath)) {
            var userData = new TextDecoder("utf-8").decode(chunk);
            console.log("populateFieldsWithoutEditing; userData: "+userData)
            console.log("populateFieldsWithoutEditing; try; userData: "+userData)
            var oUserData = JSON.parse(userData);

            if (typeof oUserData == "object") {
                var sUserData = JSON.stringify(oUserData,null,4);
                console.log("populateFieldsWithoutEditing; --- sUserData: "+sUserData)
                var myUsername = oUserData.username;
                var peerID = oUserData.peerID;
                var loc = oUserData.loc;
                var about = oUserData.about;
                var lastUpdated = oUserData.lastUpdated;
                var imageCid = oUserData.imageCid;
                console.log("imageCid: "+imageCid)

                jQuery("#usernameContainer").html(myUsername)
                // jQuery("#locationContainer").html(loc)
                // jQuery("#aboutContainer").html(about)

                // var cid1 = '/ipfs/QmNma7eG55pEEbnoepvCGXZTt8LJDshY6zZerGj8ZY21iS' // sample_rorshach.png in private IPFS network, also on iMac desktop
                // var cid2 = '/ipfs/QmWQmayHks3Gf5oV3RRVbEV37gm9j3aCxYcgx4SZfdHiRY' // darth vader
                // var cid2 = null;
                MiscIpfsFunctions.fetchImgFromIPFS(imageCid);

            } else {
                var stockAvatarCid = MiscIpfsFunctions.addDefaultImage(cid)
                MiscIpfsFunctions.fetchImgFromIPFS(stockAvatarCid);
            }
        }
    } catch (e) {
        console.log("error: "+e)
        console.log("populateFields: user profile not found")
        var stockAvatarCid = MiscIpfsFunctions.addDefaultImage(cid)
        console.log("populateFields: stockAvatarCid: "+stockAvatarCid)
        MiscIpfsFunctions.fetchImgFromIPFS(stockAvatarCid);
    }
}

export default class SingleUserLeaveRating extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");

        var cid = this.props.match.params.cid
        var defaultAvatarNumber = parseInt(cid,10);
        console.log("cid: "+cid+"; defaultAvatarNumber: "+defaultAvatarNumber)
        populateFields(cid);

        var rating_jsonSchema_slug = "JSONSchemaFor_rating";
        renderFormFromNode(rating_jsonSchema_slug)
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <center>
                            Leave Rating
                        </center>
                        <div>
                            <div id="avatarContainer" style={{display:"inline-block",width:"100px",height:"100px"}}>
                                <img id="avatarBox" className="rateUserPageAvatarBox" />
                            </div>
                            <div id="usernameContainer" style={{display:"inline-block",height:"70px",padding:"10px",fontSize:"28px",textAlign:"left",overflow:"scroll"}}>
                            </div>
                        </div>

                        <div>
                            <div id="renderedFormElem" style={{width:"440px",display:"inline-block",textAlign:"left"}} >
                            </div>

                            <textarea id="newRatingRawFile" style={{width:"440px",height:"800px",display:"inline-block",border:"1px dashed grey"}} >
                            </textarea>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
