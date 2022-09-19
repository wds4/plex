import React from "react";
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import Masthead from '../../mastheads/grapevineMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/grapevine_leftNav1';
import P5Demo from './p5demo.js';

const jQuery = require("jquery");

let c2 = require("c2.js");
let p5 = require("p5");


let rect = new c2.Rect(0, 0, 480, 480);
let rects = rect.split([1,2,3,5,8], 'squarify');

const fetchInfluenceTypes = async (pCG0) => {

    var aResult = [];

    var pathToInfluenceTypes = pCG0 + "concepts/influenceType/superset/allSpecificInstances/slug/"
    // console.log("fetchInfluenceTypes; pathToInfluenceTypes: "+pathToInfluenceTypes)
    for await (const file of MiscIpfsFunctions.ipfs.files.ls(pathToInfluenceTypes)) {
        var fileName = file.name;
        var fileType = file.type;
        // console.log("fetchInfluenceTypes; file name: "+file.name)
        // console.log("fetchInfluenceTypes; file type: "+file.type)
        if (fileType=="directory") {
            var pathToSpecificInstance = pathToInfluenceTypes + fileName + "/node.txt";
            for await (const siFile of MiscIpfsFunctions.ipfs.files.read(pathToSpecificInstance)) {
                var sNextSpecificInstanceRawFile = new TextDecoder("utf-8").decode(siFile);
                var oNextSpecificInstanceRawFile = JSON.parse(sNextSpecificInstanceRawFile);
                var nextInfluenceType_name = oNextSpecificInstanceRawFile.influenceTypeData.name;
                // console.log("fetchInfluenceTypes; nextInfluenceType_name: "+nextInfluenceType_name)
                aResult.push(oNextSpecificInstanceRawFile)
            }
        }
    }
    return aResult;
}

const makeInfluenceTypeSelector = async () => {
    var mainSchema_slug = window.aLookupConceptGraphInfoBySqlID[window.currentConceptGraphSqlID].mainSchema_slug
    var oMainSchema = window.lookupWordBySlug[mainSchema_slug]
    var mainSchema_ipns = oMainSchema.metaData.ipns;
    var pCG = "/plex/conceptGraphs/";
    var pCG0 = pCG + mainSchema_ipns + "/";

    var aInfluenceTypes = await fetchInfluenceTypes(pCG0);
    // console.log("aInfluenceTypes: "+JSON.stringify(aInfluenceTypes,null,4))

    var selectorHTML = "";
    selectorHTML += "<select id='influenceTypeSelector' >";
    for (var z=0;z<aInfluenceTypes.length;z++) {
        var oNextInfluenceType = aInfluenceTypes[z];
        var nextInfluenceType_name = oNextInfluenceType.influenceTypeData.name;
        var nextInfluenceType_title = oNextInfluenceType.influenceTypeData.title;
        var nextInfluenceType_slug = oNextInfluenceType.influenceTypeData.slug;
        // console.log("oNextInfluenceType: "+JSON.stringify(oNextInfluenceType,null,4))
        var nextInfluenceType_associatedContextGraph_slug = oNextInfluenceType.influenceTypeData.contextGraph.slug;
        selectorHTML += "<option ";
        selectorHTML += " data-contextgraphslug='"+nextInfluenceType_associatedContextGraph_slug+"' ";
        selectorHTML += " >";
        selectorHTML += nextInfluenceType_name;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";
    jQuery("#influenceTypeSelectorContainer").html(selectorHTML)
    makeContextSelector()
    jQuery("#influenceTypeSelector").change(function(){
        makeContextSelector()
    })
}

const makeContextSelector = () => {
    var selectorHTML = "";
    selectorHTML += "<select id='contextSelector' >";

    var contextGraph_slug = jQuery("#influenceTypeSelector option:selected").data("contextgraphslug")
    var oContextGraph = window.lookupWordBySlug[contextGraph_slug]
    var aContexts = oContextGraph.schemaData.nodes;
    for (var z=0;z<aContexts.length;z++) {
        var oNC = aContexts[z];
        var nextContext_slug = oNC.slug;
        var oNextContext = window.lookupWordBySlug[nextContext_slug]
        var nextContext_contextName = oNextContext.contextStructuredData_contextData.name;
        selectorHTML += "<option ";
        selectorHTML += " data-contextslug='"+nextContext_slug+"' ";
        selectorHTML += " >";
        selectorHTML += nextContext_contextName;
        selectorHTML += "</option>";
    }
    selectorHTML += "</select>";
    jQuery("#contextSelectorContainer").html(selectorHTML)
}

const fetchUsersList = async () => {
    var aUsers = [];
    const peerInfos = await MiscIpfsFunctions.ipfs.swarm.addrs();
    var numPeers = peerInfos.length;
    console.log("numPeers: "+numPeers);

    var outputHTML = "number of peers: "+numPeers+"<br>";
    jQuery("#swarmPeersData").html(outputHTML);
    peerInfos.forEach(info => {
        var nextPeerID = info.id;
        aUsers.push(nextPeerID)
        // addPeerToUserList(nextPeerID)
    })
    return aUsers;
}

const drawSpring = (aUsers) => {
    const renderer = new c2.Renderer(document.getElementById('c2'));
    resize();

    renderer.background('#cccccc');
    let random = new c2.Random();


    let world = new c2.World(new c2.Rect(0, 0, renderer.width, renderer.height));

    // createTree(createParticle(), 0);

    function createParticle(){
        let x = random.next(renderer.width);
        let y = random.next(renderer.height);
        let p = new c2.Particle(x, y);
        p.radius = random.next(10, renderer.height/15);
        p.mass = p.radius
        p.color = c2.Color.hsl(random.next(0, 30), random.next(30, 60), random.next(20, 100));
        world.addParticle(p);

        return p;
    }

    // function createTree(parent, level){
        for (var u=0;u<6;u++) {
            let p = createParticle();

            // let s = new c2.Spring(parent, p);
            // s.length = (parent.radius + p.radius) * 2;
            // world.addSpring(s);

            // createTree(p, u);
        }
    // }


    let gravitation = new c2.Gravitation(-10);
    gravitation.range(10);
    world.addInteractionForce(gravitation);


    renderer.draw(() => {
        renderer.clear();

        world.update();

        for(let i=0; i<world.springs.length; i++){
          let s = world.springs[i];
          renderer.stroke('#333333');
          renderer.lineWidth(s.length/30);
          renderer.line(s.p1.position.x, s.p1.position.y,
                        s.p2.position.x, s.p2.position.y);
        }

        for(let i=0; i<world.particles.length; i++){
          let p = world.particles[i];
          renderer.stroke('#333333');
          renderer.lineWidth(1);
          renderer.fill(p.color);
          renderer.circle(p.position.x, p.position.y, p.radius);
        }
    });


    window.addEventListener('resize', resize);
    function resize() {
        let parent = renderer.canvas.parentElement;
        renderer.size(parent.clientWidth, parent.clientWidth / 16 * 9);
    }
}

const drawPoint = () => {
    const renderer = new c2.Renderer(document.getElementById('c2'));
    resize();

    renderer.background('#cccccc');
    let random = new c2.Random();


    let world = new c2.World(new c2.Rect(0, 0, renderer.width, renderer.height));

    for(let i=0; i<100; i++){
      let x = random.next(renderer.width);
      let y = random.next(renderer.height);
      let p = new c2.Particle(x, y);
      p.radius = random.next(10, renderer.height/14);
      p.color = c2.Color.hsl(random.next(0, 30), random.next(30, 60), random.next(20, 100));

      world.addParticle(p);
    }

    let collision = new c2.Collision();
    world.addInteractionForce(collision);

    let pointField = new c2.PointField(new c2.Point(renderer.width/2, renderer.height/2), 1);
    world.addForce(pointField);


    renderer.draw(() => {
        renderer.clear();

        let time = renderer.frame * .01;

        world.update();

        for(let i=0; i<world.particles.length; i++){
          let p = world.particles[i];
          renderer.stroke('#333333');
          renderer.lineWidth(1);
          renderer.fill(p.color);
          renderer.circle(p.position.x, p.position.y, p.radius);
          renderer.lineWidth(2);
          renderer.point(p.position.x, p.position.y);
        }
    });


    window.addEventListener('resize', resize);
    function resize() {
        let parent = renderer.canvas.parentElement;
        renderer.size(parent.clientWidth, parent.clientWidth / 16 * 9);
    }
}




export default class GrapevineVisualizationMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".mainPanel").css("width","calc(100% - 100px)");
        await makeInfluenceTypeSelector();
        var aUsers = await fetchUsersList()

        // drawPoint();
        drawSpring(aUsers);
        /*
        let canvas = document.getElementById('c2');
        let renderer = new c2.Renderer(canvas);

        renderer.size(480, 480);
        renderer.background('#cccccc');

        let rect = new c2.Rect(0, 0, 480, 480);
        let rects = rect.split([1,2,3,5,8], 'squarify');

        renderer.draw(() => {
            renderer.clear();

            let mouse = renderer.mouse;
            let point = new c2.Point(mouse.x, mouse.y);
            for (let rect of rects) {
            if(rect.contains(point)) renderer.fill('#ff0000');
                else renderer.fill(false);
                renderer.rect(rect);
            }
        });
        */


    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Grapevine Visualization Main Page</div>

                        <center>
                            <div>
                                <div style={{border:"1px dashed grey",display:"inline-block",width:"300px",height:"100px"}}>
                                    <center>viewing</center>
                                    <select>
                                        <option>user</option>
                                        <option>Proven Person</option>
                                    </select>
                                    <div id="swarmPeersData">swarmPeersData</div>
                                </div>

                                <div style={{border:"1px dashed grey",display:"inline-block",width:"300px",height:"100px"}}>
                                    <center>select trust / influence type</center>
                                    <div id="influenceTypeSelectorContainer" ></div>
                                </div>

                                <div style={{border:"1px dashed grey",display:"inline-block",width:"300px",height:"100px"}}>
                                    <center>select context</center>
                                    <div id="contextSelectorContainer" ></div>
                                </div>
                            </div>
                        </center>

                        <center>
                            <div>
                                <div style={{border:"1px dashed grey",display:"inline-block",width:"1000px",height:"700px"}}>
                                <P5Demo />
                                <div id = "p5sketch">

                                </div>


                                </div>

                                <div style={{border:"1px dashed grey",display:"inline-block",width:"500px",height:"700px"}}>
                                    <center>Control Panel</center>
                                    <canvas id='c2'/>
                                </div>
                            </div>
                        </center>

                    </div>
                </fieldset>
            </>
        );
    }
}
