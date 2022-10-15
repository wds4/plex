import React from "react";
import Masthead from '../../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/grapevine_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/grapevine_settings_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../lib/ipfs/conceptGraphInMfsFunctions.js'
import * as MiscFunctions from '../../../functions/miscFunctions.js'

const jQuery = require("jquery");

// Performs all steps involved in transferring ratings data between:
// external trusted nodes (via scraping from their MFS)
// the local Concept Graph (which may be accessible only locally)
// and local MFS (which is visible from external nodes)
// This function should be called on a routine basis to keep ratings data updated.
export const transferRatingsDataAllSteps = async () => {
    await scrapeRatingsDataFromExternalNodes();
    await transferLocalRatingsData();
    await transferExternalRatingsData();
}

// Transfers ratings data authored locally from the concept graph (accessed via the appropriate set(s) in Concept for Ratings )
// to a file in the MFS that is publically-accessible
export const transferLocalRatingsData = async () => {
    var pathToRatingsFile = window.grapevine.ratings.local.mfsFile
    var set_slug = window.grapevine.ratings.local.set
    var oSet = await ConceptGraphInMfsFunctions.lookupWordBySlug(set_slug)
    var aRatings = oSet.globalDynamicData.specificInstances;
    var aIpfsPaths = [];
    for (var r=0;r<aRatings.length;r++) {
        var nextRating_slug = aRatings[r];
        var oNextRating = await ConceptGraphInMfsFunctions.lookupWordBySlug(nextRating_slug)
        await ConceptGraphInMfsFunctions.publishWordToIpfs(oNextRating)
        var nextRating_ipns = oNextRating.metaData.ipns;
        var nR_ipfsPath = await ConceptGraphInMfsFunctions.ipfs.resolve("/ipns/"+nextRating_ipns)
        aIpfsPaths.push(nR_ipfsPath)
    }
    // console.log("transferLocalRatingsData aIpfsPaths: "+JSON.stringify(aIpfsPaths,null,4));
    await ConceptGraphInMfsFunctions.publishObjectToMFS(aIpfsPaths,pathToRatingsFile)
}

// Transfers ratings data authored externally from the concept graph (accessed via the appropriate set(s) in Concept for Ratings )
// to a file in the MFS that is publically-accessible
export const transferExternalRatingsData = async () => {
    var pathToRatingsFile = window.grapevine.ratings.external.mfsFile
    var set_slug = window.grapevine.ratings.external.set
    var oSet = await ConceptGraphInMfsFunctions.lookupWordBySlug(set_slug)
    var aRatings = oSet.globalDynamicData.specificInstances;
    var aIpfsPaths = [];
    for (var r=0;r<aRatings.length;r++) {
        var nextRating_slug = aRatings[r];
        var oNextRating = await ConceptGraphInMfsFunctions.lookupWordBySlug(nextRating_slug)
        await ConceptGraphInMfsFunctions.publishWordToIpfs(oNextRating)
        var nextRating_ipns = oNextRating.metaData.ipns;
        var nR_ipfsPath = await ConceptGraphInMfsFunctions.ipfs.resolve("/ipns/"+nextRating_ipns)
        aIpfsPaths.push(nR_ipfsPath)
    }
    // console.log("transferExternalRatingsData aIpfsPaths: "+JSON.stringify(aIpfsPaths,null,4));
    await ConceptGraphInMfsFunctions.publishObjectToMFS(aIpfsPaths,pathToRatingsFile)
}

export const scrapeRatingsDataFromExternalNodes = async () => {
    // for now: use the masterUsersList
    // Future: fetch list from the Concept for Users; start with all users, then can transition to one of the trusted users sets
    var pathToLocalRatingsFile = window.grapevine.ratings.local.mfsFile
    var pathToExternalRatingsFile = window.grapevine.ratings.external.mfsFile
    var mfsPath = "/grapevineData/users/masterUsersList.txt"
    var aMasterUsersList = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(mfsPath)
    console.log("aMasterUsersList: "+JSON.stringify(aMasterUsersList,null,4));
    for (var u=0;u<aMasterUsersList.length;u++) {
        var nextUserPeerID = aMasterUsersList[u];
        var mfsPathLocal = "/ipns/"+nextUserPeerID+pathToLocalRatingsFile;
        var mfsPathExternal = "/ipns/"+nextUserPeerID+pathToExternalRatingsFile;
        console.log("mfsPathLocal: "+mfsPathLocal);
        // console.log("mfsPathExternal: "+mfsPathExternal);
        var aLocalRatingsList = await ConceptGraphInMfsFunctions.fetchObjectByCatIpfsPath(mfsPathLocal)
        var aExternalRatingsList = await ConceptGraphInMfsFunctions.fetchObjectByCatIpfsPath(mfsPathExternal)
        if (aLocalRatingsList) {
            console.log("scrapeRatingsDataFromExternalNodes aLocalRatingsList: "+JSON.stringify(aLocalRatingsList,null,4));
            await addToConceptGraphExternalRatingsSet(aLocalRatingsList)
        }
        if (aExternalRatingsList) {
            console.log("scrapeRatingsDataFromExternalNodes aExternalRatingsList: "+JSON.stringify(aExternalRatingsList,null,4));
            await addToConceptGraphExternalRatingsSet(aExternalRatingsList)
        }

    }
}

/*
const fetchListOfAllKnownRatingSlug = async () => {
    var aAllKnownRatings = [];
    var mfsPathLocal = window.grapevine.ratings.local.mfsFile
    var mfsPathExternal = window.grapevine.ratings.external.mfsFile
    var setForLocalRatings_slug = window.grapevine.ratings.local.set
    var setForExternalRatings_slug = window.grapevine.ratings.external.set

    var oExternalSet = await ConceptGraphInMfsFunctions.lookupWordBySlug(setForExternalRatings_slug)
    var aCurrentRatingsExternal = oExternalSet.globalDynamicData.specificInstances; // this is a list of the slugs of all the externally-authored ratings already stored in the local concept graph
    var oLocalSet = await ConceptGraphInMfsFunctions.lookupWordBySlug(setForLocalRatings_slug)
    var aCurrentRatingsLocal = oLocalSet.globalDynamicData.specificInstances; // this is a list of the slugs of all the locally-authored ratings already stored in the local concept graph
    var aAllKnownRatingsBySlug = aCurrentRatingsExternal.concat(aCurrentRatingsLocal) // this is a list of the slugs of all the ratings already stored in the local concept graph (simpler way to do this: using ratings superset; no need to concat arrays)

    var aLocalRatingsListByIPNS = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(mfsPathLocal)
    var aExternalRatingsListByIPNS = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(mfsPathExternal)
    for (var r=0;r<aLocalRatingsListByIPNS.length;r++) {
        var nextRating_ipfsPath = aLocalRatingsListByIPNS[r];
        var oNextRating = await ConceptGraphInMfsFunctions.fetchObjectByCatIpfsPath(nextRating_ipfsPath)
        var nextRating_slug = oNextRating.wordData.slug;
        if (!aAllKnownRatingsBySlug.includes(nextRating_slug)) {
            aAllKnownRatingsBySlug.push(nextRating_slug)
        }
    }
    for (var r=0;r<aExternalRatingsListByIPNS.length;r++) {
        var nextRating_ipfsPath = aExternalRatingsListByIPNS[r];
        var oNextRating = await ConceptGraphInMfsFunctions.fetchObjectByCatIpfsPath(nextRating_ipfsPath)
        var nextRating_slug = oNextRating.wordData.slug;
        if (!aAllKnownRatingsBySlug.includes(nextRating_slug)) {
            aAllKnownRatingsBySlug.push(nextRating_slug)
        }
    }
    return aAllKnownRatingsBySlug;
}
*/
// Input a list (aRatingsToAdd) of ratings obtained from an external node
// Input list is an array with elements of the form: /ipfs/[cid to rating file]
// Elements will be added to the local Concept Graph as specific instances of the set: window.grapevine.ratings.external.set
// If the rating is an updated version of one already on file, then the more recent one will be kept.
// Specifically: If the rating is a Grapevine User Trust rating, an identical slug == it is the same rater, same ratee, and same rating settings, so the most recent one should be kept
// In a different function, these will later be transferred to the file at: window.grapevine.ratings.external.mfsFile
export const addToConceptGraphExternalRatingsSet = async (aRatingsToAdd) => {
    // var aCurrentRatingsBySlug = await fetchListOfAllKnownRatingSlug()
    // console.log("addToConceptGraphExternalRatingsSet aCurrentRatingsBySlug: "+JSON.stringify(aCurrentRatingsBySlug,null,4))
    var schemaForRating_slug = window.grapevine.ratings.schema.slug
    var setForExternalRatings_slug = window.grapevine.ratings.external.set
    var oExternalSet = await ConceptGraphInMfsFunctions.lookupWordBySlug(setForExternalRatings_slug)
    // console.log("updateExternalRatingsList; aCurrentRatingsBySlug: "+JSON.stringify(aCurrentRatingsBySlug,null,4))
    // console.log("updateExternalRatingsList; aRatingsList: "+JSON.stringify(aRatingsToAdd,null,4))
    for (var r=0;r<aRatingsToAdd.length;r++) {
        var okToAdd = true;
        var nextRating_ipfsPath = aRatingsToAdd[r]; // should be of form: /ipfs/abcde12345
        var oNextRating = await ConceptGraphInMfsFunctions.fetchObjectByCatIpfsPath(nextRating_ipfsPath)
        var nextRating_slug = oNextRating.wordData.slug;
        console.log("r: "+r+"; addToConceptGraphExternalRatingsSet_; does aCurrentRatingsBySlug include nextRating_slug? "+nextRating_slug)
        // if this slug already is in my concept database, then do not add it (This should include any ratings that are self-authored)
        var isRatingInActiveConceptGraph = await ConceptGraphInMfsFunctions.lookupWordBySlug(nextRating_slug) // this will yield false if rating slug is not present
        /*
        if (aCurrentRatingsBySlug.includes(nextRating_slug)) {
            // rating is already known locally; nothing to do
            okToAdd = false;
            console.log("addToConceptGraphExternalRatingsSet_; already known! nextRating_slug: "+nextRating_slug)
        }
        */
        if (isRatingInActiveConceptGraph) {
            // if a word with this slug already exists in the local concept graph, then need to determine which one is more recent and keep that one
            var oRating_alreadyInCG = await ConceptGraphInMfsFunctions.lookupWordBySlug(nextRating_slug)
            // need to add a timestamp variable in ratingsData !!!
        }
        if (!isRatingInActiveConceptGraph) {
            // obtain the slug for this; determine whether the slug already exists
            // console.log("addToConceptGraphExternalRatingsSet; need to add! nextRating_ipfsPath: "+nextRating_ipfsPath)
            // var oNextRating = await ConceptGraphInMfsFunctions.fetchObjectByCatIpfsPath(nextRating_ipfsPath)
            // var nextRating_slug = oNextRating.wordData.slug;
            console.log("addToConceptGraphExternalRatingsSet_; need to add! nextRating_slug: "+nextRating_slug)
            if (oNextRating) {
                // console.log("addToConceptGraphExternalRatingsSet; oNextRating: "+JSON.stringify(oNextRating,null,4))
                oNextRating = await ConceptGraphInMfsFunctions.convertExternalNodeToLocalWord(oNextRating)
                await ConceptGraphInMfsFunctions.publishWordToIpfs(oNextRating);
                await ConceptGraphInMfsFunctions.publishWordToMFS(oNextRating);
                var oNewRel = MiscFunctions.cloneObj(window.lookupWordTypeTemplate.relationshipType)
                oNewRel.nodeFrom.slug = nextRating_slug
                oNewRel.relationshipType.slug = "isASpecificInstanceOf"
                oNewRel.nodeTo.slug = setForExternalRatings_slug
                var oRatingsSchema = await ConceptGraphInMfsFunctions.lookupWordBySlug(schemaForRating_slug)
                var oMiniRFL = {};
                oMiniRFL[nextRating_slug] = oNextRating;
                oMiniRFL[setForExternalRatings_slug] = oExternalSet;
                oMiniRFL[schemaForRating_slug] = oRatingsSchema;
                oRatingsSchema = MiscFunctions.updateSchemaWithNewRel(oRatingsSchema,oNewRel,oMiniRFL)
                await ConceptGraphInMfsFunctions.createOrUpdateWordInMFS(oRatingsSchema)
                // aCurrentRatingsBySlug.push(nextRating_slug)
            }
        }

    }
}

const populateRatingsLists = async () => {
    var mfsPathLocal = window.grapevine.ratings.local.mfsFile
    var mfsPathExternal = window.grapevine.ratings.external.mfsFile
    var setForLocalRatings_slug = window.grapevine.ratings.local.set
    var setForExternalRatings_slug = window.grapevine.ratings.external.set

    var aLocalRatingsList = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(mfsPathLocal)
    var aExternalRatingsList = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(mfsPathExternal)
    console.log("mfsPathLocal: "+mfsPathLocal+"; aLocalRatingsList: "+aLocalRatingsList)
    // var aLocalRatingsList = JSON.parse(sLocalRatingsList)
    // var aExternalRatingsList = JSON.parse(sExternalRatingsList)
    for (var r=0;r<aLocalRatingsList.length;r++) {
        var nextRating_cid = aLocalRatingsList[r];
        var oRat = await ConceptGraphInMfsFunctions.fetchObjectByCatIpfsPath(nextRating_cid)
        var nR_slug = oRat.wordData.slug;
        var nRatingHTML = "";
        nRatingHTML += "<div>";
        nRatingHTML += nR_slug;
        nRatingHTML += "</div>";
        jQuery("#grapevineDataLocalContainer").append(nRatingHTML)
    }
    for (var r=0;r<aExternalRatingsList.length;r++) {
        var nextRating_cid = aExternalRatingsList[r];
        var oRat = await ConceptGraphInMfsFunctions.fetchObjectByCatIpfsPath(nextRating_cid)
        var nR_slug = oRat.wordData.slug;
        var nRatingHTML = "";
        nRatingHTML += "<div>";
        nRatingHTML += nR_slug;
        nRatingHTML += "</div>";
        jQuery("#grapevineDataExternalContainer").append(nRatingHTML)
    }

    var oSet_local = await ConceptGraphInMfsFunctions.lookupWordBySlug(setForLocalRatings_slug)
    var aRatings_local = oSet_local.globalDynamicData.specificInstances;

    var oSet_external = await ConceptGraphInMfsFunctions.lookupWordBySlug(setForExternalRatings_slug)
    var aRatings_external = oSet_external.globalDynamicData.specificInstances;

    for (var r=0;r<aRatings_local.length;r++) {
        var nextRating_cid = aRatings_local[r];
        var nRatingHTML = "";
        nRatingHTML += "<div>";
        nRatingHTML += nextRating_cid;
        nRatingHTML += "</div>";
        jQuery("#setLocalContainer").append(nRatingHTML)
    }

    for (var r=0;r<aRatings_external.length;r++) {
        var nextRating_cid = aRatings_external[r];
        var nRatingHTML = "";
        nRatingHTML += "<div>";
        nRatingHTML += nextRating_cid;
        nRatingHTML += "</div>";
        jQuery("#setExternalContainer").append(nRatingHTML)
    }
}

export default class GrapevineSettingsRatingsLocationsInMutableFileSystem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        await populateRatingsLists()
        jQuery("#transferRatingsDataAllStepsButton").click(async function(){
            console.log("transferRatingsDataAllStepsButton clicked")
            await transferRatingsDataAllSteps();
        })
        jQuery("#transferLocalRatingsDataButton").click(async function(){
            console.log("transferLocalRatingsDataButton clicked")
            await transferLocalRatingsData();
        })
        jQuery("#transferExternalRatingsDataButton").click(async function(){
            console.log("transferExternalRatingsDataButton clicked")
            await transferExternalRatingsData();
        })
        jQuery("#scrapeRatingsDataButton").click(async function(){
            console.log("scrapeRatingsDataButton clicked")
            await scrapeRatingsDataFromExternalNodes();
        })
    }
    render() {
        var pathToLocalRatingsFile = window.grapevine.ratings.local.mfsFile
        var pathToExternalRatingsFile = window.grapevine.ratings.external.mfsFile
        var setForLocalRatings = window.grapevine.ratings.local.set
        var setForExternalRatings = window.grapevine.ratings.external.set

        var pathToExternalNodeLocalRatingsFile = "/ipns/[externalNodeIPNS]" + pathToLocalRatingsFile
        var pathToExternalNodeExternalRatingsFile = "/ipns/[externalNodeIPNS]" + pathToExternalRatingsFile
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Where Ratings and Composite Scores are stored in the Mutable File System</div>

                        <div style={{marginBottom:"10px",padding:"5px",border:"1px solid purple",borderRadius:"3px"}}>
                            <div>
                                <b><i>transfer ratings data:</i></b>
                                <div id="transferRatingsDataAllStepsButton" className="doSomethingButton_small">Transfer: all steps</div>
                            </div>
                            <li>
                                <div style={{display:"inline-block"}}>
                                    From
                                    <div id="setForLocalRatingsContainer" style={{display:"inline-block",marginLeft:"5px",marginRight:"5px"}} >{setForLocalRatings}</div>
                                    to
                                    <div id="grapevineMfsFileForLocalRatingsContainer" style={{display:"inline-block",marginLeft:"5px",marginRight:"5px"}} >{pathToLocalRatingsFile}</div>
                                    <div id="transferLocalRatingsDataButton" className="doSomethingButton_small">Transfer</div>
                                </div>
                            </li>
                            <li>
                                <div style={{display:"inline-block"}}>
                                    From
                                    <div id="setForExternalRatingsContainer" style={{display:"inline-block",marginLeft:"5px",marginRight:"5px"}} >{setForExternalRatings}</div>
                                    to
                                    <div id="grapevineMfsFileForExternalRatingsContainer" style={{display:"inline-block",marginLeft:"5px",marginRight:"5px"}} >{pathToExternalRatingsFile}</div>
                                    <div id="transferExternalRatingsDataButton" className="doSomethingButton_small">Transfer</div>
                                </div>
                            </li>
                            <div style={{fontStyle:"italic"}}>These will set ratings.txt = [] if sets have no specific instances</div>
                            <div>
                                <b><i>scan trusted nodes and scrape their ratings data:</i></b>
                            </div>
                            <li>
                                <div style={{display:"inline-block",width:"90%"}}>
                                    From
                                    <div id="pathToExternalNodeLocalRatingsContainer" style={{display:"inline-block",marginLeft:"5px",marginRight:"5px"}} >{pathToExternalNodeLocalRatingsFile}</div>
                                    and
                                    <div id="pathToExternalNodeExternalRatingsContainer" style={{display:"inline-block",marginLeft:"5px",marginRight:"5px"}} >{pathToExternalNodeExternalRatingsFile}</div>
                                    to
                                    <div id="grapevineMfsFileForLocalRatingsContainer" style={{display:"inline-block",marginLeft:"5px",marginRight:"5px"}} >{setForExternalRatings}</div>
                                    <div id="scrapeRatingsDataButton" className="doSomethingButton_small">Scrape</div>
                                </div>
                            </li>
                        </div>

                        <div style={{backgroundColor:"#DFDFDF",padding:"5px",marginBottom:"10px"}} >paths to ratings in MFS:</div>

                        <li>
                            <div style={{display:"inline-block"}} >
                                public: ratings by me<br/>
                                <div>{pathToLocalRatingsFile}</div>
                            </div>
                        </li>

                        <li>
                            <div style={{display:"inline-block"}}>
                                public: archive of ratings by others<br/>
                                <div>{pathToExternalRatingsFile}</div>
                            </div>
                        </li>

                        <div style={{backgroundColor:"#DFDFDF",padding:"5px",marginBottom:"10px"}} >
                            The files ratings.txt will be arrays with a list of cids, each one of which is a specific instance of the ratings concept.
                        </div>

                        <li>
                            <div style={{display:"inline-block"}}>
                                <div>local: ratings by me</div>
                                <div>{setForLocalRatings}</div>
                            </div>
                        </li>

                        <li>
                            <div style={{display:"inline-block"}}>
                                <div>local: ratings by others</div>
                                <div>{setForExternalRatings}</div>
                            </div>
                        </li>

                        <div style={{backgroundColor:"#DFDFDF",padding:"5px",marginBottom:"10px"}} >
                            Newly authored ratings are placed into setFor_ratings_authoredLocally, and ratings.txt is updated with new cids.
                        </div>

                        <div style={{backgroundColor:"#DFDFDF",padding:"5px",marginBottom:"10px"}} >
                            Periodically, I scan both ratings.txt files from trusted nodes and add newly found ratings to my concept graph (setFor_ratings_authoredExternally).
                            At any given time, each of the two ratings.txt files should reflect all specific instances of each of the two sets in my concept graph.
                        </div>

                        <div>The above structure is very likely to evolve over time.</div>

                        <div className="grapevineSettingsRatingsContainer" >
                            <center>set: local ratings</center>
                            <div id="setLocalContainer"></div>
                        </div>
                        <div className="grapevineSettingsRatingsContainer" >
                            <center>set: external ratings</center>
                            <div id="setExternalContainer"></div>
                        </div>
                        <div className="grapevineSettingsRatingsContainer" >
                            <center>grapevineData: local ratings</center>
                            <div id="grapevineDataLocalContainer"></div>
                        </div>
                        <div className="grapevineSettingsRatingsContainer" >
                            <center>grapevineData: external ratings</center>
                            <div id="grapevineDataExternalContainer"></div>
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
