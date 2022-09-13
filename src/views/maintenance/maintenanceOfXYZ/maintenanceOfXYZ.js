
import React, { Component, createRef, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import * as Constants from '../../../conceptGraphMasthead.js';
import LeftNavbarMaintenance from '../../../LeftNavbar_Maintenance';
import * as MiscFunctions from '../../../lib/miscFunctions.js';
import * as MaintenanceFunctions from './maintenanceOfXYZ_functions.js';
const jQuery = require("jquery");

// coda for this pattern-match-function group: XYZ

const getPromise = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(`Promise resolved for ${time}s`)
        }, time)
    })
}
var testOutput_obj = {};

async function testPromiseJunkB() {
    var testOutputFoos_obj = {
        "foo10": 200,
        "foo11": 500,
        "foo12": 2000,
        "foo13": 100,
        "foo14": 3000,
        "foo15": 900
    };




    testOutput_obj.foo1 = "bar1";
    testOutput_obj.foo2 = "bar2";
    testOutput_obj.foo3 = await getPromise(1000);
    testOutput_obj.foo4 = await getPromise(500);
    testOutput_obj.foo5 = await getPromise(2000);
    testOutput_obj.foo6 = await MiscFunctions.createNewWordByTemplate("word");
    testOutput_obj.foo6.wordData.title = "updated title";

    jQuery.each(testOutputFoos_obj,async function(a,b){
        console.log("testOutputFoos_obj a: "+a)
        testOutput_obj[a] = await getPromise(10);
        testOutput_obj.foo7 = await getPromise(200);
    })

    var testOutputFoos_arr = []
    jQuery.each(testOutputFoos_obj,async function(a,b){
        console.log("testOutputFoos_obj a: "+a)
        var nextFoo = ["array"+a,b]
        testOutputFoos_arr.push(nextFoo)
    })

    var numFoos = testOutputFoos_arr.length;
    for (var f=0;f<numFoos;f++) {
        var nextFooA = testOutputFoos_arr[f][0];
        var nextFooB = testOutputFoos_arr[f][1];
        // testOutput_obj[nextFooA] = await getPromise(nextFooB);
    }



    return await testOutput_obj;
}

async function testPromiseJunkA() {
    var result_obj = await testPromiseJunkB();
    var result_str = JSON.stringify(result_obj,null,4);
    jQuery("#asyncTestContainer").val(result_str)
}

export default class MaintenanceOfXYZ extends React.Component {
    componentDidMount() {
        var conceptGrapTableName = jQuery("#myConceptGraphSelector option:selected").data("tablename");
        MaintenanceFunctions.fetchConceptGraph_XYZ(conceptGrapTableName);
        jQuery("#updateConceptGraphButton").click(function(){
            jQuery.each(MaintenanceFunctions.words_XYZ_post_rF_obj,function(nextWord_slug,nextWord_obj){
              // MiscFunctions.updateWordInAllTables(nextWord_obj)
              MiscFunctions.createOrUpdateWordInAllTables(nextWord_obj)
            })
        })
        testPromiseJunkA();
    }
    render() {
        return (
          <>
            <fieldset className="mainBody" >
                <LeftNavbarMaintenance />
                <div className="mainPanel" >
                    {Constants.conceptGraphMasthead}
                    <div class="h2">Maintenance of XYZ</div>
                    <textarea id="asyncTestContainer" style={{width:"500px",height:"600px"}}>asyncTestContainer</textarea>
                    <br/>
                    Select one of My Concept Graphs:
                    <select id="myConceptGraphSelector" >
                        <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_pga" >Pretty Good Apps Main Concept Graph (new)</option>
                        <option data-dictionarytablename="myDictionary_temporary" data-tablename="myConceptGraph_temporary" selected >Concept Graph: Temporary For Testing Shit</option>
                        <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_organisms" >Concept Graph: Organisms</option>
                        <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_epistemologies" >Concept Graph: Epistemologies</option>
                        <option data-dictionarytablename="myDictionary_pga" data-tablename="myConceptGraph_2WAY" >Concept Graph: 2WAY</option>
                    </select>
                    <br/>
                    <div className="doSomethingButton" id="updateConceptGraphButton">update concept graph</div>
                    <br/>
                    Select one word:<div id="wordSelectorElem_XYZ" style={{display:"inline-block"}} >wordSelectorElem_XYZ</div>
                    <div style={{display:"inline-block"}} > number of new words: </div>
                    <div style={{display:"inline-block"}} id="numNewWordsContainer_XYZ" >numNewWordsContainer_XYZ</div>
                    <div style={{display:"inline-block",marginLeft:"20px"}} > number of updated words: </div>
                    <div style={{display:"inline-block"}} id="numUpdatedWordsContainer_XYZ" >numUpdatedWordsContainer_XYZ</div>
                    <br/>
                    <div style={{width:"600px",height:"600px",overflow:"scroll",display:"inline-block",border:"1px solid black"}}>
                        <pre id="word_pre_elem">word_pre_elem</pre>
                    </div>
                    <div style={{width:"600px",height:"600px",overflow:"scroll",display:"inline-block",border:"1px solid black"}}>
                        <pre id="word_post_elem">word_post_elem</pre>
                    </div>
                    <div style={{width:"800px",overflow:"scroll"}}>
                        <pre id="words_sql_elem"></pre>
                    </div>
                </div>
            </fieldset>
          </>
        );
    }
}
