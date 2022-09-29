import React from 'react';
import ReactDOM from 'react-dom';
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import JSONSchemaOldForm from 'react-jsonschema-form';
import validator from "@rjsf/validator-ajv6";
import Form from "@rjsf/core";
// import oSchema from '../../lib/json/JSONSchema/schemaTest6.json';
// const Form = JSONSchemaForm.default;
// const {default: Form} = JSONSchemaForm;

// See:
// https://rjsf-team.github.io/react-jsonschema-form/
// for demonstration 

const oIfThenSchema = {
  "type": "object",
  "properties": {
    "animal": {
      "enum": [
        "Cat",
        "Fish"
      ]
    }
  },
  "allOf": [
    {
      "if": {
        "properties": {
          "animal": {
            "const": "Cat"
          }
        }
      },
      "then": {
        "properties": {
          "food": {
            "type": "string",
            "enum": [
              "meat",
              "grass",
              "fish"
            ]
          }
        },
        "required": [
          "food"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "animal": {
            "const": "Fish"
          }
        }
      },
      "then": {
        "properties": {
          "food": {
            "type": "string",
            "enum": [
              "insect",
              "worms"
            ]
          },
          "water": {
            "type": "string",
            "enum": [
              "lake",
              "sea"
            ]
          }
        },
        "required": [
          "food",
          "water"
        ]
      }
    },
    {
      "required": [
        "animal"
      ]
    }
  ]
}

const oIfThenSchema2 = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "ratingData": {
            "type": "object",
            "title": "Rating Data",
            "properties": {
                "name": {
                    "type": "string",
                    "title": "Name"
                },
                "slug": {
                    "type": "string",
                    "title": "Slug"
                },
                "ratingTemplateData": {
                    "type": "object",
                    "title": "Rating Template Data",
                    "properties": {
                        "ratingTemplateName": {
                            "type": "string",
                            "title": "Rating Template Name",
                            "enum": [
                                "Generic User Trust",
                                "Delivery Speed",
                                "Flag User as Troll",
                                "Flag Customer as Rowdy"
                            ]
                        }
                    }
                },
                "raterData": {
                    "type": "object",
                    "title": "Rater Data",
                    "properties": {
                        "raterDataEntityType": {
                            "type": "string",
                            "title": "Rater Data Entity Type",
                            "enum": [
                                "user",
                                "self-driving car"
                            ]
                        }
                    }
                },
                "rateeData": {
                    "type": "object",
                    "title": "Ratee Data",
                    "properties": {
                        "rateeDataEntityType": {
                            "type": "string",
                            "title": "Ratee Data Entity Type",
                            "enum": [
                                "user",
                                "listing",
                                "post",
                                "self-driving car"
                            ]
                        }
                    }
                }
            },
            "allOf": [
                {
                    "if": {
                        "properties": {
                            "ratingTemplateData": {
                                "properties": {
                                    "ratingTemplateName": {
                                        "enum": [ "Generic User Trust" ]
                                    }
                                }
                            }
                        }
                    },
                    "then": {
                        "properties": {
                            "raterData": {
                                "properties": {
                                    "raterDataEntityType": {
                                        "const": "user",
                                        "enum": [ "user" ]
                                    }
                                }
                            },
                            "rateeData": {
                                "properties": {
                                    "rateeDataEntityType": {
                                        "const": "user",
                                        "enum": [ "user" ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    "if": {
                        "properties": {
                            "ratingTemplateData": {
                                "properties": {
                                    "ratingTemplateName": {
                                        "enum": [ "Delivery Speed" ]
                                    }
                                }
                            }
                        }
                    },
                    "then": {
                        "properties": {
                            "raterData": {
                                "properties": {
                                    "raterDataEntityType": {
                                        "const": "user",
                                        "enum": [ "user" ]
                                    }
                                }
                            },
                            "rateeData": {
                                "properties": {
                                    "rateeDataEntityType": {
                                        "const": "listing",
                                        "enum": [ "listing" ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    "if": {
                        "properties": {
                            "ratingTemplateData": {
                                "properties": {
                                    "ratingTemplateName": {
                                        "enum": [ "Flag User as Troll" ]
                                    }
                                }
                            }
                        }
                    },
                    "then": {
                        "properties": {
                            "raterData": {
                                "properties": {
                                    "raterDataEntityType": {
                                        "const": "user",
                                        "enum": [ "user" ]
                                    }
                                }
                            },
                            "rateeData": {
                                "properties": {
                                    "rateeDataEntityType": {
                                        "const": "user",
                                        "enum": [ "user" ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    "if": {
                        "properties": {
                            "ratingTemplateData": {
                                "properties": {
                                    "ratingTemplateName": {
                                        "enum": [ "Flag Customer as Rowdy" ]
                                    }
                                }
                            }
                        }
                    },
                    "then": {
                        "properties": {
                            "raterData": {
                                "properties": {
                                    "raterDataEntityType": {
                                        "const": "self-driving car",
                                        "enum": [ "self-driving car" ]
                                    }
                                }
                            },
                            "rateeData": {
                                "properties": {
                                    "rateeDataEntityType": {
                                        "const": "user",
                                        "default": "user",
                                        "enum": [ "user" ]
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        }
    }
}

const oIfThenSchema3 = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "ratingData": {
            "type": "object",
            "title": "Rating Data",
            "properties": {
                "name": {
                    "type": "string",
                    "title": "Name"
                },
                "slug": {
                    "type": "string",
                    "title": "Slug"
                },
                "ratingTemplateData": {
                    "type": "object",
                    "title": "Rating Template Data",
                    "properties": {
                        "ratingTemplateName": {
                            "type": "string",
                            "title": "Rating Template Name",
                            "enum": [
                                "Generic User Trust",
                                "Delivery Speed",
                                "Flag User as Troll",
                                "Flag Customer as Rowdy"
                            ]
                        }
                    }
                },
                "raterData": {
                    "type": "object",
                    "title": "Rater Data",
                    "properties": {
                        "raterDataEntityType": {
                            "type": "string",
                            "title": "Rater Data Entity Type",
                            "enum": [
                                "user",
                                "self-driving car"
                            ]
                        }
                    }
                },
                "rateeData": {
                    "type": "object",
                    "title": "Ratee Data",
                    "properties": {
                        "rateeDataEntityType": {
                            "type": "string",
                            "title": "Ratee Data Entity Type",
                            "enum": [
                                "user",
                                "listing",
                                "post",
                                "self-driving car"
                            ]
                        }
                    }
                }
            }
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
                                        "enum": [ "Generic User Trust" ]
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
                                    "raterDataEntityType": {
                                        "const": "user",
                                        "enum": [ "user" ]
                                    }
                                }
                            },
                            "rateeData": {
                                "properties": {
                                    "rateeDataEntityType": {
                                        "const": "user",
                                        "enum": [ "user" ]
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
                                        "enum": [ "Delivery Speed" ]
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
                                    "raterDataEntityType": {
                                        "const": "user",
                                        "enum": [ "user" ]
                                    }
                                }
                            },
                            "rateeData": {
                                "properties": {
                                    "rateeDataEntityType": {
                                        "const": "listing",
                                        "enum": [ "listing" ]
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
                                        "enum": [ "Flag User as Troll" ]
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
                                    "raterDataEntityType": {
                                        "const": "user",
                                        "enum": [ "user" ]
                                    }
                                }
                            },
                            "rateeData": {
                                "properties": {
                                    "rateeDataEntityType": {
                                        "const": "user",
                                        "enum": [ "user" ]
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
                                        "enum": [ "Flag Customer as Rowdy" ]
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
                                    "raterDataEntityType": {
                                        "const": "self-driving car",
                                        "enum": [ "self-driving car" ]
                                    }
                                }
                            },
                            "rateeData": {
                                "properties": {
                                    "rateeDataEntityType": {
                                        "const": "user",
                                        "default": "user",
                                        "enum": [ "user" ]
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

const oIfThenSchema4 = {
    "definitions": {
        "userData": {
            "type": "object",
            "name": "user data",
            "title": "user Data",
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
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this user",
                    "slug": "slug"
                },
                "name": {
                    "type": "string",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this user",
                    "slug": "name"
                },
                "title": {
                    "type": "string",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this user",
                    "slug": "title"
                },
                "description": {
                    "type": "string",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this user",
                    "slug": "description"
                }
            },
            "slug": "userData"
        },
        "selfDrivingCarData": {
            "type": "object",
            "name": "selfDrivingCar data",
            "title": "selfDrivingCar Data",
            "description": "data about this selfDrivingCar",
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
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this selfDrivingCar",
                    "slug": "slug"
                },
                "name": {
                    "type": "string",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this selfDrivingCar",
                    "slug": "name"
                },
                "title": {
                    "type": "string",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this selfDrivingCar",
                    "slug": "title"
                },
                "description": {
                    "type": "string",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this selfDrivingCar",
                    "slug": "description"
                }
            },
            "slug": "selfDrivingCarData"
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
                }
            }
        },
        "listingData": {
            "type": "object",
            "name": "listing data",
            "title": "listing Data",
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
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this listing",
                    "slug": "slug"
                },
                "name": {
                    "type": "string",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this listing",
                    "slug": "name"
                },
                "title": {
                    "type": "string",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this listing",
                    "slug": "title"
                },
                "description": {
                    "type": "string",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this listing",
                    "slug": "description"
                }
            },
            "slug": "listingData"
        },
        "postData": {
            "type": "object",
            "name": "post data",
            "title": "post Data",
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
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this post",
                    "slug": "slug"
                },
                "name": {
                    "type": "string",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this post",
                    "slug": "name"
                },
                "title": {
                    "type": "string",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this post",
                    "slug": "title"
                },
                "description": {
                    "type": "string",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this post",
                    "slug": "description"
                }
            },
            "slug": "postData"
        }
    },
    "type": "object",
    "required": [
        "ratingData"
    ],
    "properties": {
        "ratingData": {
            "type": "object",
            "name": "rating data",
            "title": "rating Data",
            "description": "data about this rating",
            "types": [
                "primaryProperty"
            ],
            "require": true,
            "required": [
                "slug",
                "name",
                "title",
                "raterData",
                "rateeData",
                "ratingTemplateData",
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
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this rating",
                    "slug": "slug"
                },
                "name": {
                    "type": "string",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this rating",
                    "slug": "name"
                },
                "title": {
                    "type": "string",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this rating",
                    "slug": "title"
                },
                "description": {
                    "type": "string",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this rating",
                    "slug": "description"
                },
                "raterData": {
                    "type": "object",
                    "name": "rater data",
                    "title": "Rater Data",
                    "description": "data about this rater, the author of this rating",
                    "required": [
                        "raterEntityType"
                    ],
                    "unique": [],
                    "properties": {
                        "raterEntityType": {
                            "type": "string",
                            "name": "rater entity type",
                            "title": "Rater Entity Type",
                            "description": "What is the entity type of this rater?",
                            "default": "",
                            "enum": [
                                "user",
                                "selfDrivingCar",
                                null
                            ],
                            "dependencyPlacement": "lower",
                            "slug": "raterEntityType"
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
                                },
                                {
                                    "properties": {
                                        "raterEntityType": {
                                            "enum": [
                                                "selfDrivingCar"
                                            ]
                                        },
                                        "selfDrivingCarData": {
                                            "$ref": "#/definitions/selfDrivingCarData"
                                        }
                                    },
                                    "required": [
                                        "selfDrivingCarData"
                                    ]
                                }
                            ]
                        }
                    },
                    "slug": "raterData"
                },
                "rateeData": {
                    "type": "object",
                    "name": "ratee data",
                    "title": "Ratee Data",
                    "description": "data about the ratee, the subject of this rating",
                    "required": [
                        "rateeEntityType"
                    ],
                    "unique": [],
                    "properties": {
                        "rateeEntityType": {
                            "type": "string",
                            "name": "ratee entity type",
                            "title": "Ratee Entity Type",
                            "description": "What is the entity type of this ratee?",
                            "default": "",
                            "slug": "rateeEntityType",
                            "enum": [
                                "user",
                                "listing",
                                "post",
                                "selfDrivingCar",
                                null
                            ],
                            "dependencyPlacement": "lower"
                        }
                    },
                    "slug": "rateeData",
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
                                },
                                {
                                    "properties": {
                                        "rateeEntityType": {
                                            "enum": [
                                                "selfDrivingCar"
                                            ]
                                        },
                                        "selfDrivingCarData": {
                                            "$ref": "#/definitions/selfDrivingCarData"
                                        }
                                    },
                                    "required": [
                                        "selfDrivingCarData"
                                    ]
                                }
                            ]
                        }
                    }
                },
                "ratingTemplateData": {
                    "type": "object",
                    "name": "rating template data",
                    "title": "Rating Template Data",
                    "description": "data about the template for this rating",
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
                            "description": "",
                            "default": null,
                            "enum": [
                                "generic user trust",
                                "flag user as troll",
                                "flag user as troll hunter",
                                "delivery speed",
                                "writing quality of user",
                                "flag post as spam",
                                null
                            ]
                        }
                    },
                    "slug": "ratingTemplateData"
                },
                "ratingFieldsetData": {
                    "type": "object",
                    "slug": "ratingFieldsetData",
                    "name": "rating fieldset data",
                    "title": "Rating Fieldset Data",
                    "description": "",
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
                            "description": "",
                            "default": null,
                            "enum": [
                                "comments fieldset",
                                "confidence fieldset",
                                "trust fieldset",
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
            },
            "slug": "ratingData"
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
                                            "flag post as spam"
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

const oIfThenSchema5 = {
    "definitions": {
        "userData": {
            "type": "object",
            "name": "user data",
            "title": "user Data",
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
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this user",
                    "slug": "slug"
                },
                "name": {
                    "type": "string",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this user",
                    "slug": "name"
                },
                "title": {
                    "type": "string",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this user",
                    "slug": "title"
                },
                "description": {
                    "type": "string",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this user",
                    "slug": "description"
                }
            },
            "slug": "userData"
        },
        "selfDrivingCarData": {
            "type": "object",
            "name": "selfDrivingCar data",
            "title": "selfDrivingCar Data",
            "description": "data about this selfDrivingCar",
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
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this selfDrivingCar",
                    "slug": "slug"
                },
                "name": {
                    "type": "string",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this selfDrivingCar",
                    "slug": "name"
                },
                "title": {
                    "type": "string",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this selfDrivingCar",
                    "slug": "title"
                },
                "description": {
                    "type": "string",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this selfDrivingCar",
                    "slug": "description"
                }
            },
            "slug": "selfDrivingCarData"
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
                }
            }
        },
        "listingData": {
            "type": "object",
            "name": "listing data",
            "title": "listing Data",
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
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this listing",
                    "slug": "slug"
                },
                "name": {
                    "type": "string",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this listing",
                    "slug": "name"
                },
                "title": {
                    "type": "string",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this listing",
                    "slug": "title"
                },
                "description": {
                    "type": "string",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this listing",
                    "slug": "description"
                }
            },
            "slug": "listingData"
        },
        "postData": {
            "type": "object",
            "name": "post data",
            "title": "post Data",
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
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this post",
                    "slug": "slug"
                },
                "name": {
                    "type": "string",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this post",
                    "slug": "name"
                },
                "title": {
                    "type": "string",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this post",
                    "slug": "title"
                },
                "description": {
                    "type": "string",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this post",
                    "slug": "description"
                }
            },
            "slug": "postData"
        }
    },
    "type": "object",
    "required": [
        "ratingData"
    ],
    "properties": {
        "ratingData": {
            "type": "object",
            "name": "rating data",
            "title": "rating Data",
            "description": "data about this rating",
            "types": [
                "primaryProperty"
            ],
            "require": true,
            "required": [
                "slug",
                "name",
                "title",
                "raterData",
                "rateeData",
                "ratingTemplateData",
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
                    "name": "slug",
                    "title": "Slug",
                    "description": "The top-level slug for this rating",
                    "slug": "slug"
                },
                "name": {
                    "type": "string",
                    "name": "name",
                    "title": "Name",
                    "description": "The top-level name for this rating",
                    "slug": "name"
                },
                "title": {
                    "type": "string",
                    "name": "title",
                    "title": "Title",
                    "description": "The top-level title for this rating",
                    "slug": "title"
                },
                "description": {
                    "type": "string",
                    "name": "description",
                    "title": "Description",
                    "description": "The top-level description for this rating",
                    "slug": "description"
                },
                "raterData": {
                    "type": "object",
                    "name": "rater data",
                    "title": "Rater Data",
                    "description": "data about this rater, the author of this rating",
                    "required": [
                        "raterEntityType"
                    ],
                    "unique": [],
                    "properties": {
                        "raterEntityType": {
                            "type": "string",
                            "name": "rater entity type",
                            "title": "Rater Entity Type",
                            "description": "What is the entity type of this rater?",
                            "default": "",
                            "enum": [
                                "user",
                                "selfDrivingCar",
                                null
                            ],
                            "dependencyPlacement": "lower",
                            "slug": "raterEntityType"
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
                                },
                                {
                                    "properties": {
                                        "raterEntityType": {
                                            "enum": [
                                                "selfDrivingCar"
                                            ]
                                        },
                                        "selfDrivingCarData": {
                                            "$ref": "#/definitions/selfDrivingCarData"
                                        }
                                    },
                                    "required": [
                                        "selfDrivingCarData"
                                    ]
                                }
                            ]
                        }
                    },
                    "slug": "raterData"
                },
                "rateeData": {
                    "type": "object",
                    "name": "ratee data",
                    "title": "Ratee Data",
                    "description": "data about the ratee, the subject of this rating",
                    "required": [
                        "rateeEntityType"
                    ],
                    "unique": [],
                    "properties": {
                        "rateeEntityType": {
                            "type": "string",
                            "name": "ratee entity type",
                            "title": "Ratee Entity Type",
                            "description": "What is the entity type of this ratee?",
                            "default": "",
                            "slug": "rateeEntityType",
                            "enum": [
                                "user",
                                "listing",
                                "post",
                                "selfDrivingCar",
                                null
                            ],
                            "dependencyPlacement": "lower"
                        }
                    },
                    "slug": "rateeData",
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
                                },
                                {
                                    "properties": {
                                        "rateeEntityType": {
                                            "enum": [
                                                "selfDrivingCar"
                                            ]
                                        },
                                        "selfDrivingCarData": {
                                            "$ref": "#/definitions/selfDrivingCarData"
                                        }
                                    },
                                    "required": [
                                        "selfDrivingCarData"
                                    ]
                                }
                            ]
                        }
                    }
                },
                "ratingTemplateData": {
                    "type": "object",
                    "name": "rating template data",
                    "title": "Rating Template Data",
                    "description": "data about the template for this rating",
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
                            "description": "",
                            "default": null,
                            "enum": [
                                "generic user trust",
                                "flag user as troll",
                                "flag user as troll hunter",
                                "delivery speed",
                                "writing quality of user",
                                "flag post as spam",
                                null
                            ]
                        }
                    },
                    "slug": "ratingTemplateData"
                },
                "ratingFieldsetData": {
                    "type": "object",
                    "slug": "ratingFieldsetData",
                    "name": "rating fieldset data",
                    "title": "Rating Fieldset Data",
                    "description": "",
                    "required": [
                        "ratingFieldsetNames"
                    ],
                    "unique": [],
                    "properties": {
                        "ratingFieldsetNames": {
                            "type": "array",
                            "slug": "ratingFieldsetNames",
                            "name": "rating fieldset name",
                            "title": "Rating Fieldset Name",
                            "description": "",
                            "default": null,
                            "items": {
                                "enum": [
                                    "comments fieldset",
                                    "confidence fieldset",
                                    "trust fieldset",
                                    "5star fieldset",
                                    null
                                ]
                            },
                            "dependencyPlacement": "lower"
                        }
                    },
                    "allOf": [
                        {
                            "if": {
                                "properties": {
                                    "ratingFieldsetNames": {
                                        "contains": {
                                            "const": "comments fieldset"
                                        }
                                    }
                                }
                            },
                            "then": {
                                "properties": {
                                    "commentsFieldsetData": {
                                        "$ref": "#/definitions/commentsFieldsetData"
                                    }
                                }
                            }
                        },
                        {
                            "if": {
                                "properties": {
                                    "ratingFieldsetNames": {
                                        "contains": {
                                            "const": "confidence fieldset"
                                        }
                                    }
                                }
                            },
                            "then": {
                                "properties": {
                                    "confidenceFieldsetData": {
                                        "$ref": "#/definitions/confidenceFieldsetData"
                                    }
                                }
                            }
                        }
                    ]
                }
            },
            "slug": "ratingData"
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
                                            "flag post as spam"
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
                                    "ratingFieldsetNames": {
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

const log = (type) => console.log.bind(console, type);

const jQuery = require("jquery");

const uiSchema = {
    catData: { 'ui:widget': 'hidden' },
}

const renderForm = () => {
    var sSchema = jQuery("#jsonSchemaContainer").val();
    var oSchema = JSON.parse(sSchema)

    ReactDOM.render((
        <Form schema={oSchema}
            validator={validator}
            onChange={onFormChange}
            onSubmit={onFormSubmit}
            onError={log("errors")}
            omitExtraData />
    ), document.getElementById("JSONSchemaOldFormContainer"));

}

const onFormChange = ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
    jQuery("#formContainer").val(sFormData)
}
const onFormSubmit = ({formData}, e) => {
    var sFormData = JSON.stringify(formData,null,4);
    jQuery("#formContainer").val(sFormData)
}
export default class HelloWorldJSONSchemaOldFormV5 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        jQuery("#jsonSchemaContainer").html(JSON.stringify(oIfThenSchema5,null,4))
        renderForm();
        jQuery("#renderJSONSchemaButton").click(function(){
            renderForm();
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Hello World: JSON Schema Form Version 5</div>

                        <div style={{width:"500px",height:"1200px",display:"inline-block"}} >
                            <div id="renderJSONSchemaButton" className="doSomethingButton">render</div>
                            <textarea id="jsonSchemaContainer" style={{width:"95%",height:"1000px",display:"inline-block"}} >
                            </textarea>
                        </div>

                        <div id="JSONSchemaOldFormContainer" style={{width:"500px",display:"inline-block"}} >
                            JSONSchemaOldFormContainer
                        </div>
                        <textarea id="formContainer" style={{width:"500px",height:"1200px",display:"inline-block"}} >
                            formContainer
                        </textarea>
                    </div>
                </fieldset>
            </>
        );
    }
}
