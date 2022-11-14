import React from "react";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import * as ConceptGraphLib from '../../lib/ipfs/conceptGraphLib.js'
import * as GrapevineLib from '../../lib/ipfs/grapevineLib.js'
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/plex_settings_leftNav2';
import { cgidTypeExample } from './libraryExamples/cgidTypeExample.js'
import { cgidExample } from './libraryExamples/cgidExample.js'
import { setupContainer } from './libraryExamples/setupContainer.js'

import { cgExample_11 } from './libraryExamples/11.js'
import { cgExample_21 } from './libraryExamples/21.js'
import { cgExample_22 } from './libraryExamples/22.js'
import { cgExample_62 } from './libraryExamples/62.js'
import { cgExample_63 } from './libraryExamples/63.js'
import { cgExample_61 } from './libraryExamples/61.js'
import { cgExample_105 } from './libraryExamples/105.js'
import { cgExample_101 } from './libraryExamples/101.js'
import { cgExample_103 } from './libraryExamples/103.js'
import { cgExample_41 } from './libraryExamples/41.js'
import { cgExample_42 } from './libraryExamples/42.js'
import { cgExample_51 } from './libraryExamples/51.js'
import { cgExample_52 } from './libraryExamples/52.js'
import { cgExample_301 } from './libraryExamples/301.js'
import { cgExample_310 } from './libraryExamples/310.js'
import { cgExample_502 } from './libraryExamples/502.js'
import { cgExample_511 } from './libraryExamples/511.js'
import { cgExample_512 } from './libraryExamples/512.js'
import { cgExample_10001 } from './libraryExamples/10001.js'
import { cgExample_10002 } from './libraryExamples/10002.js'
import { cgExample_10101 } from './libraryExamples/10101.js'
import { cgExample_11001 } from './libraryExamples/11001.js'
import { cgExample_12001 } from './libraryExamples/12001.js'
import { cgExample_12010 } from './libraryExamples/12010.js'

const jQuery = require("jquery");

const cg = ConceptGraphLib.cg;
const gv = GrapevineLib.gv;

export default class ConceptGraphAPI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 300px)");

        jQuery("#setupContainer").html(setupContainer)
        jQuery("#cgidExample").html(cgidExample)
        jQuery("#cgidTypeExample").html(cgidTypeExample)

        jQuery("#cgExample_11").html(cgExample_11)
        jQuery("#cgExample_21").html(cgExample_21)
        jQuery("#cgExample_22").html(cgExample_22)

        jQuery("#cgExample_62").html(cgExample_62)
        jQuery("#cgExample_63").html(cgExample_63)
        jQuery("#cgExample_61").html(cgExample_61)

        jQuery("#cgExample_105").html(cgExample_105)
        jQuery("#cgExample_101").html(cgExample_101)
        jQuery("#cgExample_103").html(cgExample_103)

        jQuery("#cgExample_41").html(cgExample_41)
        jQuery("#cgExample_42").html(cgExample_42)

        jQuery("#cgExample_51").html(cgExample_51)
        jQuery("#cgExample_52").html(cgExample_52)

        jQuery("#cgExample_301").html(cgExample_301)
        jQuery("#cgExample_310").html(cgExample_310)

        jQuery("#cgExample_502").html(cgExample_502)
        jQuery("#cgExample_511").html(cgExample_511)
        jQuery("#cgExample_512").html(cgExample_512)

        jQuery("#cgExample_10001").html(cgExample_10001)
        jQuery("#cgExample_10002").html(cgExample_10002)

        jQuery("#cgExample_10101").html(cgExample_10101)

        jQuery("#cgExample_11001").html(cgExample_11001)
        jQuery("#cgExample_12001").html(cgExample_12001)
        jQuery("#cgExample_12010").html(cgExample_12010)

        var cgid = "conceptFor_user";
        var cgid_ipns = await cg.resolve(cgid);
        console.log("cgid_ipns: "+cgid_ipns)

        jQuery("#toggleShowUsageButton").click(function(){
            var currStatus = jQuery(this).data("status");
            if (currStatus=="open") {
                jQuery(this).html("+")
                jQuery(this).data("status","closed");
                jQuery("#setupContainer").css("display","none")
            }
            if (currStatus=="closed") {
                jQuery(this).html("-")
                jQuery(this).data("status","open");
                jQuery("#setupContainer").css("display","block")
            }
        })
        jQuery("#toggleShowBriefDescriptionsButton").click(function(){
            var currStatus = jQuery(this).data("status");
            if (currStatus=="open") {
                jQuery(this).html("+")
                jQuery(this).data("status","closed");
                jQuery(".apiMajorSectionDescription").css("display","none")
                jQuery(".apiMajorSectionContainerContainerTop").css("width","400px");
                jQuery(".apiMajorSectionContainerContainerContainer").css("width","1000px");
            }
            if (currStatus=="closed") {
                jQuery(this).html("-")
                jQuery(this).data("status","open");
                jQuery(".apiMajorSectionDescription").css("display","block")
                jQuery(".apiMajorSectionContainerContainerTop").css("width","600px");
                jQuery(".apiMajorSectionContainerContainerContainer").css("width","800px");
            }
        })
        jQuery("li.commandLi").click(function(){
            // console.log("commandNumber: ")
            var commandNumber = jQuery(this).data("commandnumber");
            console.log("commandNumber: "+commandNumber)
            jQuery(".apiMajorSectionContainerContainerSubTop").css("display","none")
            jQuery("#commandNumber_"+commandNumber).css("display","block")
        })
        jQuery("#showAllButton").click(function(){
            jQuery(".apiMajorSectionContainerContainerSubTop").css("display","block")
        })
        jQuery("#showAdditionalOptionsButton").click(function(){
            jQuery(".apiMajorSectionContainerContainerSubTop").css("display","none")
            jQuery("#commandNumber_all").css("display","block")
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
                        <div className="h2">Concept Graph API (under construction)</div>
                        <div style={{fontSize:"12px"}} >
                            <div style={{margin:"20px"}} >
                                See https://github.com/ipfs/js-ipfs/tree/master/docs/core-api for how this should be done.
                            </div>
                            <div>
                                <div style={{display:"inline-block",marginLeft:"30px"}} >
                                    <div id="toggleShowBriefDescriptionsButton" data-status="closed" className="doSomethingButton_small" style={{width:"15px",textAlign:"center"}} >+</div>Show brief descriptions
                                </div>
                                <div style={{display:"inline-block",marginLeft:"30px"}} >
                                    <div id="toggleShowUsageButton" data-status="closed" className="doSomethingButton_small" style={{width:"15px",textAlign:"center"}} >+</div>Usage:
                                </div>
                                <div style={{display:"inline-block",marginLeft:"30px"}} >
                                    <div id="showAllButton" className="doSomethingButton_small" >show all</div>
                                    <div id="showAdditionalOptionsButton" className="doSomethingButton_small" >show default options</div>
                                </div>
                            </div>
                            <pre id="setupContainer" style={{margin:"20px",display:"none"}} ></pre>

                            <div className="apiMajorSectionContainerContainerTop apiMajorSectionContainerContainer" style={{height:"800px",overflow:"scroll"}} >
                                Top-level API
                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="11" >
                                        cg.ipfs.add(file,[options])
                                        <div className="commandNumberContainer" >11</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Add the provided cgid to the ipfs. cgid type must correspond to a file (either object, which will be stringified, or already-stringified file).
                                    </div>

                                    <li className="commandLi" data-commandnumber="21" >
                                        cg.ipfs.returnMyPeerID([options])
                                        <div className="commandNumberContainer" >21</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns the peerID of the associated IPFS node.
                                    </div>

                                    <li className="commandLi" data-commandnumber="22" >
                                        cg.ipfs.returnMyUsername([options])
                                        <div className="commandNumberContainer" >22</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns the grapevine username of the user profile of the associated IPFS node.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="41" >
                                        cg.mfs.ls([options])
                                        <div className="commandNumberContainer" >41</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of all MFS directory paths.
                                    </div>

                                    <li className="commandLi" data-commandnumber="42" >
                                        cg.mfs.get(path, [options])
                                        <div className="commandNumberContainer" >42</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns the object at the specified local mutable file system path.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg.mfs.update(path,cgid,[options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Update the presented path in the mfs with the presented file.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg.mfs.publish(path,[options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Publish the presented mfs path.
                                    </div>

                                    <li className="commandLi" data-commandnumber="51" >
                                        cg.mfs.baseDirectory([options])
                                        <div className="commandNumberContainer" >51</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Return the base directory (10-character slice if prompted by options) for locally stored concept graphs.
                                    </div>

                                    <li className="commandLi" data-commandnumber="52" >
                                        cg.mfs.path.get(cgid,[options])
                                        <div className="commandNumberContainer" >52</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Return the MFS path to the node indicated by the input cgid
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="61" >
                                        cg.cgids.ls([options])
                                        <div className="commandNumberContainer" >61</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns a list of cgids for the default or specified concept graph.
                                    </div>

                                    <li className="commandLi" data-commandnumber="62" >
                                        cg.cgid.resolve(cgid, [options])
                                        <div className="commandNumberContainer" >62</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    resolves a unique identifier by converting it from one format to another; e.g., from the slug to the full node as an object
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg.cgid.types.ls([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Return a list of all cgid types.
                                    </div>

                                    <li className="commandLi" data-commandnumber="63" >
                                        cg.cgid.type.resolve(cgid, [options])
                                        <div className="commandNumberContainer" >63</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Discover and return the cgid type of the input cgid.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg.cgid.amISteward(cgid, [options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns a boolean indicating whether I am the steward of this keyname:ipns pair. Options indicate which of several methods to make this determination. Option: if not me, return who is the steward (if known).
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg.cgid.steward(cgid, [options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Imports a node that is under external stewardship and creates a new one, with me as steward. Returns the cgid of the new node.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="x" >
                                        cg(cgid).toWordType([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Determines the governing concept(s) of the input cgid and returns the cgid (or an array of cgids) of the wordType of the governing concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg(cgid).toConcept([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Determines the governing concept(s) of the input cgid and returns the cgid (or an array of cgids) of the governing concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg(cgid).toJSONSchema([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Determines the governing concept(s) of the input cgid and returns the cgid (or an array of cgids) of the JSON schema of the governing concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg(cgid).toMainSchema([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Determines the governing concept(s) of the input cgid and returns the cgid (or an array of cgids) of the main schema of the governing concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg(cgid).toPropertySchema([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Determines the governing concept(s) of the input cgid and returns the cgid (or an array of cgids) of the property schema of the governing concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg(cgid).toSuperset([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Determines the governing concept(s) of the input cgid and returns the cgid (or an array of cgids) of the superset of the governing concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg(cgid).toPrimaryProperty([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Determines the governing concept(s) of the input cgid and returns the cgid (or an array of cgids) of the primary property of the governing concept.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="x" >
                                        cg.updates.ls(cgid, [options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns a list of update proposals (as cgids) for the input node.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg.update.execute(update_cgid,target_cgid [options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Executes the indicated updateProposal on the indicated target node.
                                    </div>
                                </div>

                                <div className="apiMajorSectionPlexContainerContainer" >
                                    <li className="commandLi" data-commandnumber="xyz" >
                                        plex.init.mfs([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Initialize the Plex Mutable File System.
                                    </div>

                                    <li className="commandLi" data-commandnumber="xyz" >
                                        plex.init.all([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Runs all initialization steps for Plex, including checks.
                                    </div>

                                    <li className="commandLi" data-commandnumber="xyz" >
                                        plex.init.status([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns the initialization status of Plex, including a list of actions that must be taken to complete initialization.
                                    </div>

                                    <li className="commandLi" data-commandnumber="xyz" >
                                        plex.ipfs.status([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns the status of the ipfs node connected to Plex.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="0" >cg.ls(concept_cgid,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Return a list of all specific instances of that concept
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.add(concept_cgid,si_cgid,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Add a specific instance to that concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.get(cgid,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Return information on the requested specific instance of that concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.rm(concept_cgid,si_cgid,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Remove the indicated specific instance from that concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.update(cgid, [options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Apply the indicated updates to the specific instance in question.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="101" >
                                        cg.conceptGraphs.ls(cgid, [options])
                                        <div className="commandNumberContainer" >101</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Return an array of all concept graphs. By default, this looks in the mfs. Options can be used to look in other places, e.g. supersetFor_conceptGraph in the "active" concept graph or in some other mfs file.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg.conceptGraph.roles.ls([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns a list of all <i>roles</i> as well as the concept graphs currently filling them.
                                    </div>

                                    <li className="commandLi" data-commandnumber="103" >
                                        cg.conceptGraphs.roles.reload([options])
                                        <div className="commandNumberContainer" >103</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Reloads <i>roles</i> from MFS directory to the DOM.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg.conceptGraph.role.assign(role,[options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Assign or update concept graph to each of the various concept graph <i>roles</i> (active, currently-viewing, etc)
                                    </div>

                                    <li className="commandLi" data-commandnumber="105" >
                                        cg.conceptGraph.resolve(role,[options])
                                        <div className="commandNumberContainer" >105</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Return the cid of the requested concept graph.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg.conceptGraph.add(cgid, [options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Add a concept graph.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.conceptGraph.create(cgid, [options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Create a new concept graph.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.conceptGraph.get(cgid, [options])
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Return the cid of the requested concept graph.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.conceptGraph.update(cgid, [options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Update existing concept graph.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.conceptGraph.publish(cgid, [options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Publish existing concept graph to the ipfs.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="201" >
                                        cg.concepts.ls([options])
                                        <div className="commandNumberContainer" >* 201</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of all concepts in the indicated concept graph.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.concept.create(nameSingular,namePlural,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Creates a new concept. Heavy use will be made of options to specifiy additional details.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.concept.properties.add(key,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Creates a new property for a concept. Extensive use of options.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.concept.properties.unique.ls(cgid,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of the unique properties of the input node. If the input node is not a concept,
                                    then the governing concept will be determined, with its unique properties returned.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.concept.init(cgid,[options])
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Perform a full initialization of a concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.concept.topLevelProperties.add(key,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Creates a new top level property for a concept. Extensive use of options.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.concept.topLevelProperties.update(key,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Update top level property for a concept. Extensive use of options.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.concept.topLevelProperties.rm(key,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Remove top level property from a concept. Extensive use of options.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="0" >cg.concept.[_CONCEPT_].ls([options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Return a list of all specific instances of that concept
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.concept.[_CONCEPT_].add(cgid, [options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Add a specific instance to that concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.concept.[_CONCEPT_].get(cgid, [options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Return information on the requested specific instance of that concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.concept.[_CONCEPT_].rm(cgid, [options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Remove the indicated specific instance from that concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.concept.[_CONCEPT_].update(cgid, [options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Apply the indicated updates to the specific instance in question.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="301" >
                                        cg.specificInstances.ls(cgid, [options])
                                        <div className="commandNumberContainer" >301</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Outputs an array of (direct) specific instances of the parent cgid.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.specificInstance.add(child,parent,[options])
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Add a child node as a (direct) specific instance to one or more parent sets. ? Change to: .connect ? makeSubset? link?
                                    </div>

                                    <li className="commandLi" data-commandnumber="310" >
                                        cg.specificInstance.put(child,parent,[options])
                                        <div className="commandNumberContainer" >310</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    cg.specificInstance.put
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.specificInstance.mv(child,parent,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Move a child node as a (direct) specific instance from one or more parent sets, to one or more alternate parent sets.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.specificInstance.rm(child,parent,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Remove a node so it is no longer a (direct) child of the specified set.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.specificInstance.update(child,parent,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Update a node.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="401" >
                                        cg.sets.ls(parent,[options])
                                        <div className="commandNumberContainer" >* 401</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Outputs an array of sets of the parent node. Functions similarly to specificInstances.ls.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.sets.put(child,parent,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Add a child set as a direct subset of the parent node. Functions similarly to specificInstances.put.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.sets.mv(child,parent,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Move a child node as a subset from one or more parent sets, to one or more alternate parent sets. Functions similarly to specificInstances.mv.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.sets.rm(child,parent,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Remove a child node as a subset of one or more parent sets. Functions similarly to specificInstances.rm.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="501" >
                                        cg.words.ls([options])
                                        <div className="commandNumberContainer" >* 501</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Outputs an array of words. Multiple options exist, e.g. limit to particular worType.
                                    </div>

                                    <li className="commandLi" data-commandnumber="502" >
                                        cg.word.create(name,wordType,[options])
                                        <div className="commandNumberContainer" >502</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Creates a new word of the indicated wordType(s). Heavy use will be made of options to specifiy additional details.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg.word.returnWordTypes(cgid,[options])
                                        <div className="commandNumberContainer" >* 511</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of wordTypes of the input word or node.
                                    </div>

                                    <li className="commandLi" data-commandnumber="512" >
                                        cg.word.returnIpns(cgid,[options])
                                        <div className="commandNumberContainer" >512</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns the ipns of the input word or node.
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg.word.update(cgid,path,value,[options])
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Updates the value of a word at a given path. The value can be any of the standard property types (string, object, array, etc).
                                    </div>

                                    <li className="commandLi" data-commandnumber="x" >
                                        cg.word.valenceL1.ls(cgid, [options])
                                        <div className="commandNumberContainer" >*</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Outputs an array of valenceL1 words of the specified word.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="601" >
                                        cg.schemas.ls([options])
                                        <div className="commandNumberContainer" >* 601</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of schemas from the indicated concept graph.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.schema.create([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Create a new schema.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.schema.words.ls(schema,[options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of words from the indicated schema.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.schema.relationships.ls(schema,[options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of relationships from the indicated schema.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.schema.addRel(schema,rel,[options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Adds a relationship, including nodes, to a schema if it does not already exist.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.schema.addNode(schema,node,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Adds a node to a schema if it does not already exist.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.schema.removeRel(schema,rel,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Removes a relationship, (+/- nodes depending on options) from a schema if it exists.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.schema.removeNode(schema,node,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Removes a node from a schema if it exists.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.mainSchemas.ls([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of main schemas from the indicated concept graph.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.propertySchemas.ls([options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of property schemas from the indicated concept graph.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.propertySchema.properties.ls(cgid, [options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of properties of the indicated property schema.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.propertySchema.primaryProperty(cgid, [options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns the cgid of the primary property of the indicated property schema.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="701" >
                                        cg.supersets.ls([options])
                                        <div className="commandNumberContainer" >* 701</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of supersets from the indicated concept graph.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="801" >
                                        cg.primaryProperties.ls([options])
                                        <div className="commandNumberContainer" >* 801</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of primary properties from the indicated concept graph.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="901" >
                                        cg.wordTypes.ls([options])
                                        <div className="commandNumberContainer" >* 901</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of wordTypes from the indicated concept graph.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="1001" >
                                        cg.jsonSchemas.ls([options])
                                        <div className="commandNumberContainer" >* 1001</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of JSON schemas from the indicated concept graph.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="1101" >
                                        cg.properties.ls([options])
                                        <div className="commandNumberContainer" >* 1101</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of properties from the indicated concept graph.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.neuroCore.patterns.ls([options])
                                        <div className="commandNumberContainer" >* 2001</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Outputs an array of all available patterns.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.neuroCore.actions.ls([options])
                                        <div className="commandNumberContainer" >* 3001</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Outputs an array of all available actions.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.neuroCore.pattern.search(pattern,[options])
                                        <div className="commandNumberContainer" >* 2002</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Looks for the specified pattern within the concept graph; returns an array of occurrences with auxiliary information on each occurrence.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        cg.neuroCore.action.execute(action,[options])
                                        <div className="commandNumberContainer" >* 3002</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Executes the indicated action.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.neuroCore.concept.validate(concept,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns a report on the validation status (vs rules for concepts) of the input concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.neuroCore.concept.optimizeTree(concept,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Optimize the sets and specific instances tree of a concept.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.neuroCore.cg.validate(conceptGraph,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns a report on the validation status (vs concept graph rules) of the input concept graph.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.neuroCore.ruleset.validate(cgid,ruleset,[options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns a report on the validation status of the input node vs the input ruleset (ruleset ?= specification of wordType; rules for concepts, for schemas, for concept graphs, etc.)
                                    </div>
                                </div>

                                <div className="apiMajorSectionGrapevineContainerContainer" >
                                    <li className="commandLi" data-commandnumber="10001" >
                                        gv.users.ls([options])
                                        <div className="commandNumberContainer" >10001</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Return an array of all known users
                                    </div>

                                    <li className="commandLi" data-commandnumber="10002" >
                                        gv.user.profile.get(cgid,[options])
                                        <div className="commandNumberContainer" >10002</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Retrieve user profile information.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        gv.user.profile.update([options])
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Update user profile information.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        gv.user.add(cgid,[options])
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Add a user to the userlist.
                                    </div>

                                    <li className="commandLi" data-commandnumber="10101" >
                                        gv.user.trust.get(cgid,[options])
                                        <div className="commandNumberContainer" >10101</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Return the trust score of the indicated user. Multiple options to indicate which trust score to obtain.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        gv.user.trust.update(cgid,[options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Update the trust score of the indicated user.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >
                                        gv.user.ratings.ls(cgid,[options])
                                        <div className="commandNumberContainer" >x</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Retrieve a list of ratings related to this individual. Multiple options (by user, of user, on certain topic, etc)
                                    </div>

                                    <li className="commandLi" data-commandnumber="11001" >
                                        gv.ratings.ls([options])
                                        <div className="commandNumberContainer" >11001</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Retrieve a list of ratings
                                    </div>

                                    <li className="commandLi" data-commandnumber="12001" >
                                        gv.compositeScores.ls([options])
                                        <div className="commandNumberContainer" >12001</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Retrieve a list of compositeScores
                                    </div>

                                    <li className="commandLi" data-commandnumber="12010" >
                                        gv.compositeScore.get(cgid,[options])
                                        <div className="commandNumberContainer" >12010</div>
                                    </li>
                                    <div className="apiMajorSectionDescription" >
                                    Retrieve compositeScore data regarding the specified entity.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >
                                    <li className="commandLi" data-commandnumber="0" >cg.grapevine.users.ls([options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of all known users.
                                    </div>

                                    <li className="commandLi" data-commandnumber="0" >cg.grapevine.ratings.ls([options])</li>
                                    <div className="apiMajorSectionDescription" >
                                    Returns an array of all known ratings.
                                    </div>
                                </div>

                                <div className="apiMajorSectionConceptGraphContainerContainer" >

                                </div>

                                <li className="commandLi" data-commandnumber="0" >cg.returnGoverningConcepts(cgid,[options])</li>
                                <div className="apiMajorSectionDescription" >
                                Returns the governing concept(s) of the input node. WordTypes of the input node are limited to the basic concept structural components.
                                </div>

                                <li className="commandLi" data-commandnumber="0" >cg.publish(cgid,[options])</li>
                                <div className="apiMajorSectionDescription" >
                                Publish the input cgid to the ipfs.
                                </div>

                                <li className="commandLi" data-commandnumber="0" >cg.files.publish(cgid,[options])</li>
                                <div className="apiMajorSectionDescription" >
                                Publish the input cgid to the MFS.
                                </div>

                                <li className="commandLi" data-commandnumber="0" >cg.concept.findComponent(cgid,wordType,[options])</li>
                                <div className="apiMajorSectionDescription" >
                                Return the component (JSONSchema, superset, wordType, etc) that corresponds to the governing concept of the input word.
                                </div>
                            </div>

                            <div className="apiMajorSectionContainerContainerContainer" >
                                <div id="commandNumber_62" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.cgid.resolve(cgid, [options])
                                        <div className="commandNumberContainer" >62</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    resolves a unique identifier by converting it from one format to another; e.g., from the slug to the full node as an object
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>cgid</td>
                                                <td><span className="uniqueIdentifierStyle" >cgid</span></td>
                                                <td>the unique identifier</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>inputCgidType</td>
                                                <td>string</td>
                                                <td>slug (= word-slug)</td>
                                                <td>the cgid type of the input. This ought to be determined automatically, but could be input for improved speed or in case of error.
                                                If specified, it will override the auto-determination.</td>
                                            </tr>
                                            <tr>
                                                <td>outputCgidType</td>
                                                <td>string</td>
                                                <td>word (= node)</td>
                                                <td>the cgid type of the output</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td><span className="uniqueIdentifierStyle" >cgid</span></td>
                                                <td>The node after it has been converted to its alternate cgid format.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_62" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_63" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.cgid.type.resolve(cgid,[options])
                                        <div className="commandNumberContainer" >63</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Discover and return the cgidType of the input cgid.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>cgid</td>
                                                <td><span className="uniqueIdentifierStyle" >cgid</span></td>
                                                <td>the input cgid</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>string</td>
                                                <td>the type of the input cid (If more than one type is possible, then an array of all possible types is returned? Or will there always be a "best" type?)</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_63" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_61" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.cgids.ls([options])
                                        <div className="commandNumberContainer" >61</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Returns a list of all cgids, of all types, for the default or specified concept graph. Several formats for the output.
                                    (Arrange by concept, arrange by cgid type, one long list of all cgids including potential redundancies, etc)
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>cgidType</td>
                                                <td>string</td>
                                                <td>ipns</td>
                                                <td>The cgid type of the output</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>array: <span className="uniqueIdentifierStyle" >cgid</span></td>
                                                <td>a list of all cgids for the concept graph.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_61" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_41" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.mfs.ls([options])
                                        <div className="commandNumberContainer" >41</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Returns an array of all MFS directory paths.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>substring</td>
                                                <td>string</td>
                                                <td>false</td>
                                                <td>Filters results by the provided string</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>array</td>
                                                <td>an array of MFS paths</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_41" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_42" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.mfs.get(path,[options])
                                        <div className="commandNumberContainer" >42</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Returns the object at the specified local mutable file system path. Converts file to object by default, but option can
                                    be set to return the file as is.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>path</td>
                                                <td>string</td>
                                                <td>path through the Mutable File System directory</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>convertToObject</td>
                                                <td>boolean</td>
                                                <td>true</td>
                                                <td>If true (default), converts the file to object prior to returning it.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>object</td>
                                                <td>the requested file as a JSON object</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_42" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_51" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.mfs.baseDirectory([options])
                                        <div className="commandNumberContainer" >51</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Returns the IPNS hash generated by a keyname which is generated from the local peerID. This is used to create the name
                                    of a local directory in the Mutable File System where all local concept graphs are stored. This directory name in theory
                                    should be hidden from the outside world. (? Need to make directory invisible?)
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>slice10</td>
                                                <td>boolean</td>
                                                <td>false</td>
                                                <td>If false(default), returns the entire IPNS hash. If true, returns only the final 10 characters of the hash.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>object</td>
                                                <td>the requested file as a JSON object</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_51" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_52" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.mfs.path.get(cgid,[options])
                                        <div className="commandNumberContainer" >52</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Find the MFS path to the specified cgid
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>cgid</td>
                                                <td><span className="uniqueIdentifierStyle" >cgid</span></td>
                                                <td>the input cgid</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>string</td>
                                                <td>an MFS path</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_52" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_11" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.ipfs.add(file,[options])
                                        <div className="commandNumberContainer" >11</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Add the provided file to the ipfs and returns its cid.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>file</td>
                                                <td>string, object, (other?)</td>
                                                <td>The file to be added to the ipfs.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>inputFormat</td>
                                                <td>string</td>
                                                <td>object</td>
                                                <td>The type of the file to be added. If the input is an object, it will be stringified before adding it.
                                                The function will try to determine the format of the input file so specification of this option is not strictly necessary.
                                                Other options may be added to modify the default stringify parameters.
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>verboseCid</td>
                                                <td>boolean</td>
                                                <td>false</td>
                                                <td>If false (default), cid is output as a string (ipfs hash). If true, the cid is formatted as per IPFS protocol (= object .. ?)
                                                </td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>cid</td>
                                                <td>the cid of the added file as a string. Can include option to return cid as an object.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_11" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_21" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.ipfs.returnMyPeerID([options])
                                        <div className="commandNumberContainer" >21</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >

                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>slice10</td>
                                                <td>boolean</td>
                                                <td>false</td>
                                                <td>If false(default), returns the entire IPNS hash. If true, returns only the final 10 characters of the hash.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>string</td>
                                                <td>my peerID</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_21" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_22" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.ipfs.returnMyUsername([options])
                                        <div className="commandNumberContainer" >22</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >

                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>string</td>
                                                <td>my username</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_22" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_301" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.specificInstances.ls(parent, [options])
                                        <div className="commandNumberContainer" >301</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Outputs an array of specific instances of the parent node.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>parent</td>
                                                <td><span className="uniqueIdentifierStyle" >cgid</span></td>
                                                <td>cgid of the parent word. Parent word is usually a set or superset, but can be wordType, JSONSchema, or concept of the node in question;
                                                basically, any word which lies along the Loki Pathway. If concept, wordType, or JSONSchema is specified, the specific instances of the
                                                superset are returned.
                                                </td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>inputCgidType</td>
                                                <td>string</td>
                                                <td>slug</td>
                                                <td>the cgid type of the input node</td>
                                            </tr>
                                            <tr>
                                                <td>outputCgidType</td>
                                                <td>string</td>
                                                <td>slug</td>
                                                <td>the cgid type of the output nodes</td>
                                            </tr>
                                            <tr>
                                                <td>degree</td>
                                                <td>string or array of two integers</td>
                                                <td>indirect</td>
                                                <td>indirect (include all child specific instances) or direct (include only those that are directly-connected).
                                                Alternatively, may send a pair of two integers to indicate how many "subsetOf" hops to traverse. (May deprecate integers.)
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>parentWordType</td>
                                                <td>string</td>
                                                <td>set</td>
                                                <td>the wordType of the parent node. Usually this is left blank, as it can be deduced from the parent cid itself.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>array</td>
                                                <td>An array of specific instances, each of which is formatted as a cgid.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_301" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_310" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.specificInstance.put(child,parent,[options])
                                        <div className="commandNumberContainer" >310</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    cg.specificInstance.put -- same as cg.specificInstance.add ?
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>si</td>
                                                <td><span className="uniqueIdentifierStyle" >cgid</span></td>
                                                <td>the cgid of the node being added
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>set</td>
                                                <td><span className="uniqueIdentifierStyle" >cgid</span></td>
                                                <td>cgids of the set(s) to which the node will be added
                                                </td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>siUniqueID</td>
                                                <td>string</td>
                                                <td>slug</td>
                                                <td>mfsPath, slug (= word-slug), ipns, ipfs, concept-specific-identifier (e.g. user-slug, widget-title), or word (=node) (the full node as an object) corresponding to the specific instance that is being added</td>
                                            </tr>
                                            <tr>
                                                <td>outputUniqueID</td>
                                                <td>string</td>
                                                <td>slug</td>
                                                <td>same as inputUniqueID</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>array</td>
                                                <td>An array of specific instances, each of which is formatted as a cgid.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_310" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_502" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.word.create(wordType,[options])
                                        <div className="commandNumberContainer" >502</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Creates a new word of the indicated wordType(s). Heavy use will be made of options to specifiy additional details.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>wordType</td>
                                                <td>string</td>
                                                <td>the desired wordType
                                                </td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>method</td>
                                                <td>string</td>
                                                <td>sql</td>
                                                <td>The method of creating the new word. Options include; sql (old method, will be phased out); others to be created.
                                                (NeuroCore will need to maintain a database of templates for every concept. Make a concept called conceptTemplates or something like that.)
                                                </td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>object</td>
                                                <td>A new word, including new ipns and keyname, as an object. It will not yet have been stored in the IPFS of MFS.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_502" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_512" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.word.returnIpns(cgid,[options])
                                        <div className="commandNumberContainer" >512</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Returns the ipns of the word specified by the input cgid (i.e. the value of metaData.ipns).
                                    Usually the cgid will be presented as an object, but other formats (such as slug) are acceptable.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>cgid</td>
                                                <td><span className="uniqueIdentifierStyle" >cgid</span></td>
                                                <td>the cgid of the specified word
                                                </td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>slice10</td>
                                                <td>boolean</td>
                                                <td>false</td>
                                                <td>If false(default), returns the entire IPNS hash. If true, returns only the final 10 characters of the hash.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>string</td>
                                                <td>The ipns of the input word.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_512" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_99" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.schema.addRel(schema,rel,[options])
                                        <div className="commandNumberContainer" >XYZ</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Adds a relationship, including nodes if necessary, to a schema if it does not already exist.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="--Example" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_105" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.conceptGraph.resolve(role,[options])
                                        <div className="commandNumberContainer" >105</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Return the cgid of the requested concept graph.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>role</td>
                                                <td>string</td>
                                                <td>the role of the concept graph: active, currently-viewing, grapevine, neurocore-engine, neurocore-subject, etc.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>outputCgidType</td>
                                                <td>string</td>
                                                <td>slug</td>
                                                <td>the cgid type of the output</td>
                                            </tr>
                                            <tr>
                                                <td>reload</td>
                                                <td>boolean</td>
                                                <td>false</td>
                                                <td>If true, reloads data from the file in MFS (currently: conceptGraphsDirectory/node.txt) to DOM variables
                                                (currently: window.frontEndConceptGraph...). Default is false, for faster lookup; but if var is not yet set, then will automatically
                                                reload data from MFS even if option is set to false.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td><span className="uniqueIdentifierStyle" >cgid</span></td>
                                                <td>cgid of the requested concept graph</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_105" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_101" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.conceptGraphs.ls([options])
                                        <div className="commandNumberContainer" >101</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Return an array of all local concept graphs. By default, this looks in the mfs. Options can be used to look in other places, e.g. supersetFor_conceptGraph
                                    in the "active" concept graph, in some external concept graph, or in some other mfs file.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>roles</td>
                                                <td>array:string</td>
                                                <td>null</td>
                                                <td>the roles (active, currently-viewing, etc) of requested concept graphs. Empty or null indicates to return all roles.</td>
                                            </tr>
                                            <tr>
                                                <td>cgidType</td>
                                                <td>string</td>
                                                <td>ipns</td>
                                                <td>the desired cgid type (slug, ipns, word, etc)</td>
                                            </tr>
                                            <tr>
                                                <td>source</td>
                                                <td>string</td>
                                                <td>mfs</td>
                                                <td>if mfs (default), query mfs directory tree to obtain list.
                                                If source=conceptGraph, query concept graph (role=active,set=superset) to obtain list.
                                                Can also set source=cgid of a concept graph.</td>
                                            </tr>
                                            <tr>
                                                <td>verbose</td>
                                                <td>boolean</td>
                                                <td>false</td>
                                                <td>For each array element, return a specialized object (rather than a <span className="uniqueIdentifierStyle" >cgid</span>) with additional information.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>array:<span className="uniqueIdentifierStyle" >cgid(ipns)</span></td>
                                                <td>an array of cgids as ipns of the requested concept graphs</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_101" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_103" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.conceptGraphs.roles.reload([options])
                                        <div className="commandNumberContainer" >103</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Reloads <i>roles</i> from MFS directory to the DOM.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_103" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_10001" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        gv.users.ls([options])
                                        <div className="commandNumberContainer" >10001</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Return an array of all known users.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>userSet</td>
                                                <td><span className="uniqueIdentifierStyle" >cgid(ipns)</span></td>
                                                <td>supersetFor_user</td>
                                                <td>identifies which set from which to acquire the userlist</td>
                                            </tr>
                                            <tr>
                                                <td>cgidType</td>
                                                <td>string</td>
                                                <td>ipns</td>
                                                <td>the desired cgid type (slug, ipns, word, etc) for the output</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>array: <span className="uniqueIdentifierStyle" >cgid(ipns)</span>:ipns</td>
                                                <td>an array of users</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_10001" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_10002" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        gv.user.profile.get(cgid,[options])
                                        <div className="commandNumberContainer" >10002</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Retrieve user profile information.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>cgid</td>
                                                <td><span className="uniqueIdentifierStyle" >cgid(ipns)</span></td>
                                                <td>The cgid of the indicated user.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_10002" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_10101" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        gv.user.trust.get(cgid,[options])
                                        <div className="commandNumberContainer" >10101</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Return the trust score of the indicated user. Multiple options to indicate which trust score to obtain.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>cgid</td>
                                                <td><span className="uniqueIdentifierStyle" >cgid(ipns)</span></td>
                                                <td>The cgid of the indicated user.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>string, integer, object</td>
                                                <td>The trust score of the indicated user. Format depends on requested information.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_10101" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_11001" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        gv.ratings.ls([options])
                                        <div className="commandNumberContainer" >11001</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Retrieve a list of ratings
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>array:<span className="uniqueIdentifierStyle" >cgid(ipns)</span></td>
                                                <td>list of requested ratings as an array.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_11001" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_12001" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        gv.compositeScores.ls([options])
                                        <div className="commandNumberContainer" >12001</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Retrieve a list of compositeScores
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>array: <span className="uniqueIdentifierStyle" >cgid(ipns)</span></td>
                                                <td>composite scores as an array</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_12001" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>

                                <div id="commandNumber_12010" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        gv.compositeScore.get(cgid,[options])
                                        <div className="commandNumberContainer" >12010</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Retrieve compositeScore data regarding the specified entity.
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>cgid</td>
                                                <td><span className="uniqueIdentifierStyle" >cgid(ipns)</span></td>
                                                <td>The cgid of the indicated entity.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_12010" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>






                                <div id="commandNumber_XYZ" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <li>
                                        cg.(, [options])
                                        <div className="commandNumberContainer" >XYZ</div>
                                    </li>
                                    <div className="apiMajorSectionDescriptionB" >
                                    .
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Parameters:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Returns:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Type</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>.</td>
                                                <td>.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Example:
                                        </div>
                                        <pre id="cgExample_XYZ" className="apiMajorSectionExample" ></pre>
                                    </div>
                                </div>





                                <div id="commandNumber_all" className="apiMajorSectionContainerContainerSubTop apiMajorSectionContainerContainer" >
                                    <div className="apiMajorSectionDescriptionB" >
                                    Most commands have what is called the "primary reference concept graph" for that command, which is the concept graph that is utilized by that command at the time it is run.
                                    In some cases, a command may make use of more than one concept graph at a time, such as when neuroCore is running off of one concept graph (neuroCore-engine)
                                    but is making modifications to another (neuroCore-subject). The names given to these concept graphs (primary) will be specific to that command.
                                    </div>
                                    <div className="apiMajorSectionDescriptionB" >
                                    To keep track of the identity of the primary reference concept graph, in addition to what is listed for each command, all commands contain the following additional options:
                                    </div>
                                    <div className="apiMajorSectionContainer" >
                                        <div className="apiMajorSectionTitle" >
                                        Options:
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>conceptGraph</td>
                                                <td><span className="uniqueIdentifierStyle" >cgid</span></td>
                                                <td>(currently-viewing ?)</td>
                                                <td>The identity of the concept graph to use as the reference for this command.</td>
                                            </tr>
                                            <tr>
                                                <td>conceptGraphCgidType</td>
                                                <td>string</td>
                                                <td>ipns</td>
                                                <td>The cgid type used to specify the concept graph to operate upon</td>
                                            </tr>
                                            <tr>
                                                <td>conceptGraphRole</td>
                                                <td>string</td>
                                                <td>active</td>
                                                <td>Specifies which concept graph is the reference concept graph for the command. Options: active, currently-viewing, neurocore-engine, neurocore-subject, etc.</td>
                                            </tr>
                                        </table>

                                        <div className="apiMajorSectionTitle" >
                                        Options - many but not all commands
                                        </div>
                                        <table className="apiPageTable" >
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Default</th>
                                                <th>Description</th>
                                            </tr>
                                            <tr>
                                                <td>verbose</td>
                                                <td>boolean</td>
                                                <td>false</td>
                                                <td>More detailed output.</td>
                                            </tr>
                                        </table>

                                    </div>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Concept Graph roles:
                                    <li>active</li>
                                    <li>currently-viewing</li>
                                    <li>grapevine</li>
                                    <li>neuroCore-engine</li>
                                    <li>neuroCore-subject</li>
                                    <li>external: This indicates a concept graph not under local control.</li>
                                    </div>
                                    <center>concept graph <i>roles</i> (plex-wide) versus the "reference" or "governing" or "principal" or "active" concept graph (command-specific)</center>
                                    <div className="apiMajorSectionDescriptionB" >
                                    Two different domains (might want to create more?) implemented so far:
                                    <li>all of plex (plex-wide): "roles"</li>
                                    <li>single app (not yet implemented)</li>
                                    <li>within a command function</li>
                                    Concept graph "roles" (active, currently-viewing, neuroCore-engine, neuroCore-subject, grapevine, etc) are defined in relation to the Plex app.
                                    Each command has what are called "reference concept graphs." Usually, there is only one reference concept graph for a command, the "primary" reference concept graph.
                                    Usually, the default setting for most commands is for its "primary" reference concept graph to be set equal to either the Plex apps's active or to its currently-viewing concept graph.
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div>
                            <center>Concept Graph Unique Identifiers (cgid)</center>
                            <div style={{fontSize:"12px",border:"1px dashed grey",padding:"10px"}} >
                                <div style={{marginTop:"15px"}} >
                                    The concept of the concept graph unique identifier (cgid) is central to the concept graph, in much the same way the cid (or CAR ???) is unique to the ipfs.
                                </div>

                                <div style={{marginTop:"15px"}} >
                                    <span className="uniqueIdentifierStyle" >cgid</span> is <b>contextually dynamically typed</b>.
                                </div>

                                <div style={{marginTop:"15px"}} >
                                    One of the most remarkable things about the cgid is that there exist concept-specific cgid types. These types can be found at conceptData.(uniqueTopLevelProperties??),
                                    and can also be discovered by looking each of that concept's top-level string properties to see whether propertyData.unique == true.
                                    For example: in the concept for users, name is NOT considered to be unique (there can be more than one "Bob"), but other concepts may require
                                    "name" to be unique. If user's name were required to be unique, it would mean there can be only one Bob *within that concept graph*.
                                    It would also mean that "user-name" would be an allowed cgid type.
                                </div>

                                <div style={{marginTop:"15px"}} >
                                    a unique top-level property / identifier of a word, e.g. "slug" for almost all concepts (which could also be denoted "word-slug"). This is hyphenated into two parts:
                                    <li className="commandLi" data-commandnumber="0" >The first part: the slug of the concept, e.g.: user, post, concept. (Note that the slug, name, and title of individual concepts must be unique within any concept graph!)</li>
                                    <li className="commandLi" data-commandnumber="0" >The second part: the key of the unique top-level property. This can be located in propertyData.key</li>
                                </div>

                                <div style={{marginTop:"15px"}} >
                                    A particularly important cgid type is the one that corresponds to the unique top-level propery conceptGraph-role:
                                </div>
                                <div>
                                    There are multiple types of cgid:
                                    <li className="commandLi" data-commandnumber="0" >the one that corresponds to the top-level property / identifier of a word</li>
                                    <li className="commandLi" data-commandnumber="0" >ipns</li>
                                    <li className="commandLi" data-commandnumber="0" >ipfs</li>
                                    <li className="commandLi" data-commandnumber="0" >mfsPath</li>
                                    <li className="commandLi" data-commandnumber="0" >an ipfs cid</li>
                                    <li className="commandLi" data-commandnumber="0" >concept-specific-identifier (e.g. user-slug, widget-title)</li>
                                    <li className="commandLi" data-commandnumber="0" >"word" (may also be specified as "node") (the full node as an object) -- may be deprecated</li>
                                </div>
                            </div>
                            <center>Examples: cgids</center>
                            <pre id="cgidExample" className="apiMajorSectionExample" ></pre>

                            <center>Examples: cgid types</center>
                            <pre id="cgidTypeExample" className="apiMajorSectionExample" ></pre>
                        </div>
                    </div>
                </fieldset>
            </>
        );
    }
}
