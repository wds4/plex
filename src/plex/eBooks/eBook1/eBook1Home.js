import React from 'react';
import { NavLink, Link } from "react-router-dom";
import Masthead from '../../mastheads/eBooksMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/eBooks_leftNav1';
import oTableOfContents from './toc';
import { cap0 } from './chapters/cap0';
import { cap1 } from './chapters/cap1';
import { cap2 } from './chapters/cap2';
import { cap3 } from './chapters/cap3';
import { cap4 } from './chapters/cap4.md';
// import sendAsync from '../../renderer.js'
import { marked } from 'marked';
const electronFs = window.require('fs');
// import * as MiscFunctions from '../functions/miscFunctions.js';

const oEntireBook = {};
oEntireBook.cap0 = cap0;
oEntireBook.cap1 = cap1;
oEntireBook.cap2 = cap2;
oEntireBook.cap3 = cap3;

const eBook1Masthead = `
<div style='height:100px;background-color:#EFEFEF;border-bottom:2px solid purple;margin-bottom:20px;' >
                        <div class="h2">The Cognitive Blind Spot</div>
</div>`

const jQuery = require("jquery");

export const createChapter = (sectionNumber,chapterNumber) => {
    var oTocChapterData = oTableOfContents.sections[sectionNumber].chapters[chapterNumber]
    var tocChapterTitle = oTocChapterData.title;
    var chapterReference = oTocChapterData.chapterReference
    var chapterContent = oEntireBook[chapterReference];

    var chapterHTML = "";
    chapterHTML += "<h3>";
    chapterHTML += tocChapterTitle;
    chapterHTML += "</h3>";

    chapterHTML += "<div style='text-align:left;' >";
    chapterHTML += chapterContent;
    chapterHTML += "</div>";

    // const mdFile = electronFs.readFileSync("src/plex/eBooks/eBook1/chapters/tocIntro.md", "utf8");
    // chapterHTML = marked.parse(mdFile);

    jQuery("#eBookMainContainer").html(chapterHTML);
}

export const runBindings = () => {
    jQuery(".eBookChapterTitleContainer").off().click(function(){
        jQuery("#eBookTocIntroContainer").html("")
        var chapterNumber = jQuery(this).data("chapternumber")
        var sectionNumber = jQuery(this).data("sectionnumber")
        createChapter(sectionNumber,chapterNumber)
    })
}

export const createTitlePage = () => {
    jQuery("#eBookMainContainer").html("");

    const mdFile = electronFs.readFileSync("src/plex/eBooks/eBook1/chapters/tocIntro.md", "utf8");
    const html2 = marked.parse(mdFile);
    jQuery("#eBookTocIntroContainer").html(html2)

    /*
    var tocIntroHTML = "";
    tocIntroHTML += "<div style='text-align:left;margin-bottom:10px;color:#0G0G0G;font-size:14px;' >";
        tocIntroHTML += "<div style='margin-bottom:5px;' >";
        tocIntroHTML += "Human beings are remarkably good at self-deception. It seems like we are all <i>batshit crazy.</i>";
        tocIntroHTML += "Not only that: each social group, each community, seems to have its own distinct, idiosyncratic brand of crazy.";
        tocIntroHTML += "</div>";

        tocIntroHTML += "<div style='margin-bottom:5px;' >";
        tocIntroHTML += "In this book, we offer an explanation for the above questions. Ironically, it is our need for community, our need for <i>belonging</i>, and our search for <i>virtue</i> ";
        tocIntroHTML += "that drives these ostensibly anti-virtuous traits.";
        tocIntroHTML += "</div>";

        tocIntroHTML += "<div style='margin-bottom:5px;' >";
        tocIntroHTML += "We believe there is a method to the madness. In this book we offer an answer to the above questions. More importantly, this book tells us what we can do about it.";
        tocIntroHTML += "</div>";
    tocIntroHTML += "</div>";
    */

    // jQuery("#eBookMainContainer").append(tocIntroHTML)

    var aSections = oTableOfContents.sections;
    for (var sectionNumber=0;sectionNumber < aSections.length; sectionNumber++) {
        var oSection = aSections[sectionNumber];
        var sectionTitle = oSection.title;
        var aChapters = oSection.chapters;

        var sectionNumberDisplay = sectionNumber +1;

        var sectionHTML = "";
        sectionHTML += "<div class=eBookSectionContainer >";

        sectionHTML += "<div data-sectionnumber='"+sectionNumber+"' class='eBookSectionTitleContainer eBookHoverableElements' >";
        sectionHTML += sectionNumberDisplay + ". ";
        sectionHTML += sectionTitle;
        sectionHTML += "</div>";


        sectionHTML += "<div data-sectionnumber='"+sectionNumber+"' class=eBookSectionChaptersContainer >";
            for (var chapterNumber=0;chapterNumber < aChapters.length;chapterNumber++) {
                var oChapter = aChapters[chapterNumber];
                var chapterTitle = oChapter.title;
                var chapterReference = oChapter.chapterReference;

                sectionHTML += "<div data-sectionnumber='"+sectionNumber+"' data-chapternumber='"+chapterNumber+"' class='eBookChapterTitleContainer eBookHoverableElements' >";
                sectionHTML += chapterTitle

                sectionHTML += "<div style='display:inline-block;float:right;margin-right:10px;' >";
                sectionHTML += "("+chapterReference+")";
                sectionHTML += "</div>";

                sectionHTML += "<div style='clear:both;' ></div>";

                sectionHTML += "</div>";
            }
        sectionHTML += "</div>";

        sectionHTML += "</div>";
        jQuery("#eBookMainContainer").append(sectionHTML)
    }
    runBindings()
}
export default class EBook1Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        jQuery(".eBooksMainPanel").css("width","calc(100% - 100px)");
        console.log("eBook 1 Home; toc: "+JSON.stringify(oTableOfContents,null,4))
        createTitlePage()
        jQuery("#eBook1MainTitle").click(function(){
            createTitlePage()
        })
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <div className="eBooksMainPanel" >
                        <div style={{height:"60px",backgroundColor:"#EFEFEF",borderBottom:"2px solid purple",marginBottom:"10px",paddingTop:"15px"}} >
                            <div id="eBook1MainTitle" class="h2 eBookHoverableElements" >The Cognitive Blind Spot</div>
                        </div>

                        <center>
                            <div id="eBookTocIntroContainer" className = "eBookTocIntroContainer" >
                            </div>

                            <div id="eBookMainContainer" className = "eBookMainContainer" >
                            </div>
                        </center>

                    </div>
                </fieldset>
            </>
        );
    }
}
