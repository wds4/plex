import React from 'react';
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import sendAsync from '../../renderer.js'

const jQuery = require("jquery");

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const sqlFxn1 = async (e) => {
    jQuery("#sqlFxn1Container").css("backgroundColor","yellow")
    var sql = " SELECT * FROM wordTypes WHERE id='1' ";
    console.log("sql: "+sql)
    var output = e + await sendAsync(sql).then( async (result) => {
        var oData = result[0];
        var slug = oData.slug;
        console.log("sqlFxn1 slug: "+slug)
        await timeout(2000);
        // alert("sendAsync timeout 2000")
        return "updatedBy_fxn1_"+slug;
    })
    jQuery("#sqlFxn1Container").css("backgroundColor","grey")
    return output;
}
const sqlFxn2 = async (e) => {
    jQuery("#sqlFxn2Container").css("backgroundColor","yellow")
    var sql = " SELECT * FROM relationshipTypes WHERE id='1' ";
    console.log("sql: "+sql)
    var output = e + await sendAsync(sql).then( async (result) => {
        var oData = result[0];
        var slug = oData.slug;
        console.log("sqlFxn2 slug: "+slug)
        await timeout(2000);
        // alert("sendAsync timeout 2000")
        return "updatedBy_fxn2_"+slug;
    })
    jQuery("#sqlFxn2Container").css("backgroundColor","grey")
    return output;
}
const sqlFxn3 = async (e) => {
    jQuery("#sqlFxn3Container").css("backgroundColor","yellow")
    var sql = " SELECT * FROM myConceptGraph_plex WHERE id='1' ";
    console.log("sql: "+sql)
    var output = e + await sendAsync(sql).then( async (result) => {
        var oData = result[0];
        var slug = oData.slug;
        console.log("sqlFxn3 slug: "+slug)
        await timeout(2000);
        // alert("sendAsync timeout 2000")
        return "updatedBy_fxn3_"+slug;
    })
    jQuery("#sqlFxn3Container").css("backgroundColor","grey")
    return output;
}

const fxn1 = (e) => {
    jQuery("#f1oContainer").css("backgroundColor","yellow")
    var output = e+"_modified";
    jQuery("#f1oContainer").css("backgroundColor","grey")
    return output;
}

async function fxn2(e) {
    jQuery("#f2oContainer").css("backgroundColor","yellow")
    var output = e+"_modified";
    await timeout(2000);
    jQuery("#f2oContainer").css("backgroundColor","grey")
    return output;
}

async function fxn3() {
    jQuery("#f3oContainer").css("backgroundColor","yellow")
    var oNewWord = await MiscFunctions.createNewWordByTemplate("superset");
    jQuery("#f3oContainer").css("backgroundColor","grey")
    return oNewWord.metaData.ipns;
}

const fooFunction = async (actionName, oAction) => {
    await timeout(1000);
    var nextHTML = "";
    nextHTML += actionName;
    nextHTML += "<br>";
    jQuery("#asyncViaJQueryContainer").append(nextHTML)
    await timeout(1000);
}

const actionList = {
        "actionName1": { "foo": "bar1" },
        "actionName2": { "foo": "bar2" }
    }
const aActionList = [
        { "actionName1": { "foo": "bar1" } },
        { "actionName2": { "foo": "bar2" } }
]
export default class HelloWorldMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    async componentDidMount() {
        // await timeout(2000);

        var oNewSuperset = await MiscFunctions.createNewWordByTemplate("superset");
        var newSupersetIPNS = oNewSuperset.metaData.ipns;

        var sqlResult1 = await sqlFxn1("start");
        jQuery("#sqlFxn1Container").html(sqlResult1)

        var sqlResult2 = await sqlFxn2(sqlResult1);
        jQuery("#sqlFxn2Container").html(sqlResult2)

        var sqlResult3 = await sqlFxn3(sqlResult2);
        jQuery("#sqlFxn3Container").html(sqlResult3)

        // jQuery.each( actionList, await fooFunction( actionName, oAction ) );

        for (var x=0;x<aActionList.length;x++) {
            var oNextAction = aActionList[x];
            var nextActionName = "nextActionName"
            await fooFunction(nextActionName, oNextAction)
        }

        var f1o = await fxn1(newSupersetIPNS);
        jQuery("#f1oContainer").html(f1o)

        var f2o = await fxn2(sqlResult1);
        jQuery("#f2oContainer").html(f2o)

        var f3o = await fxn3();
        jQuery("#f3oContainer").html(f3o)

        var oNewWord = await MiscFunctions.createNewWordByTemplate("set");
        var newWordIPNS = oNewWord.metaData.ipns;
        jQuery("#newWordIPNSContainer").html(newWordIPNS);

    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Hello World: Async Chain</div>

                        sqlFxn1Container: <div id="sqlFxn1Container" >sqlFxn1Container</div>
                        <br/>
                        sqlFxn2Container: <div id="sqlFxn2Container" >sqlFxn2Container</div>
                        <br/>
                        sqlFxn3Container: <div id="sqlFxn3Container" >sqlFxn3Container</div>
                        <br/>

                        async functions via jQuery: <div id="asyncViaJQueryContainer" ></div>
                        <br/>

                        f1oContainer: <div id="f1oContainer" >f1oContainer</div>
                        <br/>
                        f2oContainer: <div id="f2oContainer" >f2oContainer</div>
                        <br/>
                        f3oContainer: <div id="f3oContainer" >f3oContainer</div>
                        <br/>
                        newWordIPNSContainer: <div id="newWordIPNSContainer" >newWordIPNSContainer</div>
                    </div>
                </fieldset>
            </>
        );
    }
}
