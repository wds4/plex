import React from "react";
import Masthead from '../../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/grapevine_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/grapevine_settings_leftNav2';
import * as ConceptGraphInMfsFunctions from '../../../lib/ipfs/conceptGraphInMfsFunctions.js'

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
    console.log("transferLocalRatingsData aIpfsPaths: "+JSON.stringify(aIpfsPaths,null,4));
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
    console.log("transferExternalRatingsData aIpfsPaths: "+JSON.stringify(aIpfsPaths,null,4));
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
        console.log("mfsPathExternal: "+mfsPathExternal);
        var aLocalRatingsList = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(mfsPathLocal)
        var aExternalRatingsList = await ConceptGraphInMfsFunctions.fetchObjectByLocalMutableFileSystemPath(mfsPathExternal)
        console.log("aLocalRatingsList: "+JSON.stringify(aLocalRatingsList,null,4));
        console.log("aExternalRatingsList: "+JSON.stringify(aExternalRatingsList,null,4));
    }
}

export default class GrapevineSettingsRatingsLocationsInMutableFileSystem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
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

                    </div>
                </fieldset>
            </>
        );
    }
}
