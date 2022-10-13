import React from "react";
import Masthead from '../../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../../navbars/leftNavbar1/grapevine_leftNav1';
import LeftNavbar2 from '../../../navbars/leftNavbar2/grapevine_settings_leftNav2';

const jQuery = require("jquery");

export default class GrapevineSettingsRatingsLocationsInMutableFileSystem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");
        var pathToLocalRatings = window.grapevine.ratings.local.mfsPath
        var pathToExternalRatings = window.grapevine.ratings.external.mfsPath
        var setForLocalRatings = window.grapevine.ratings.local.set
        var setForExternalRatings = window.grapevine.ratings.external.set
    }
    render() {
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
                                transfer ratings data:
                                <div id="transferRatingsDataAllStepsButton" className="doSomethingButton_small">Transfer</div>
                            </div>
                            <li>
                                <div style={{display:"inline-block"}}>
                                    From
                                    <div id="setForLocalRatingsContainer" style={{display:"inline-block",marginLeft:"5px",marginRight:"5px"}} >setForLocalRatingsContainer</div>
                                    to
                                    <div id="grapevineMfsFileForLocalRatingsContainer" style={{display:"inline-block",marginLeft:"5px",marginRight:"5px"}} >grapevineMfsFileForLocalRatingsContainer</div>
                                    <div id="transferLocalRatingsDataButton" className="doSomethingButton_small">Transfer</div>
                                </div>
                            </li>
                            <li>
                                <div style={{display:"inline-block"}}>
                                    From
                                    <div id="setForExternalRatingsContainer" style={{display:"inline-block",marginLeft:"5px",marginRight:"5px"}} >setForExternalRatingsContainer</div>
                                    to
                                    <div id="grapevineMfsFileForExternalRatingsContainer" style={{display:"inline-block",marginLeft:"5px",marginRight:"5px"}} >grapevineMfsFileForExternalRatingsContainer</div>
                                    <div id="transferExternalRatingsDataButton" className="doSomethingButton_small">Transfer</div>
                                </div>
                            </li>
                        </div>

                        <div style={{backgroundColor:"#DFDFDF",padding:"5px",marginBottom:"10px"}} >paths to ratings in MFS:</div>

                        <li>
                            <div style={{display:"inline-block"}} >
                                public: ratings by me<br/>
                                <div>/grapevineData/ratings/locallyAuthored/ratings.txt</div>
                            </div>
                        </li>

                        <li>
                            <div style={{display:"inline-block"}}>
                                public: archive of ratings by others<br/>
                                <div>/grapevineData/ratings/externallyAuthored/ratings.txt</div>
                            </div>
                        </li>

                        <div style={{backgroundColor:"#DFDFDF",padding:"5px",marginBottom:"10px"}} >
                            The files ratings.txt will be arrays with a list of cids, each one of which is a specific instance of the ratings concept.
                        </div>

                        <li>
                            <div style={{display:"inline-block"}}>
                                <div>local: ratings by me</div>
                                <div>conceptFor_rating; setFor_ratings_authoredLocally</div>
                            </div>
                        </li>

                        <li>
                            <div style={{display:"inline-block"}}>
                                <div>local: ratings by others</div>
                                <div>conceptFor_rating; setFor_ratings_authoredExternally</div>
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
