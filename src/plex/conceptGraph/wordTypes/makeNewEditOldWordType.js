import React from "react";

const makeNewEditOldWordType = () => {
    return (
        <>
            <center >Make New / Edit Existing Word Type</center>

            <div style={{backgroundColor:"#CFCFCF",padding:"3px",border:"1px solid grey"}}>
                <div style={{display:"inline-block"}}>
                    <div id="generateSqlCommandButton_makeNew" className="doSomethingButton">generate SQL command to MAKE NEW row</div>
                    <br/>
                    <div id="generateSqlCommandButton_editExisting" className="doSomethingButton">generate SQL command to EDIT EXISTING row</div>
                    <br/>
                    <div id="generateSqlCommandButton_deleteExisting" className="doSomethingButton">generate SQL command to DELETE EXISTING row</div>
                </div>

                <div style={{display:"inline-block",marginLeft:"20px"}}>
                    SQL command: <br/>
                    <textarea id="sqlCommandContainer" style={{width:"500px",height:"100px"}} ></textarea>
                </div>
                <div style={{display:"inline-block",marginLeft:"20px"}}>
                    <br/>
                    <div id="runSqlButton" className="doSomethingButton">execute SQL command</div>
                    <br/>
                    SQL Response: <div id="sqlResultContainer" style={{display:"inline-block"}} >(response)</div>
                </div>
            </div>

            <div className="simpleAddEditContainer" >
                sqlId:
                <textarea id="currWordTypeSqlId" className="singleAddEditElem" ></textarea>
            </div>

            <div className="simpleAddEditContainer" >
                slug:
                <textarea id="newWordTypeSlug" className="singleAddEditElem" ></textarea>
            </div>

            <div className="simpleAddEditContainer" >
                name:
                <textarea id="newWordTypeName" className="singleAddEditElem" ></textarea>
            </div>

            <div className="simpleAddEditContainer" >
                backgroundColor:
                <textarea id="newWordTypeBackgroundColor" className="singleAddEditElem" ></textarea>
            </div>

            <div className="simpleAddEditContainer" >
                borderColor:
                <textarea id="newWordTypeBorderColor" className="singleAddEditElem" ></textarea>
            </div>

            <div className="simpleAddEditContainer" >
                shape:
                <textarea id="newWordTypeShape" className="singleAddEditElem" ></textarea>
            </div>

            <div className="simpleAddEditContainer" >
                borderWidth:
                <textarea id="newWordTypeBorderWidth" className="singleAddEditElem" ></textarea>
            </div>

            <div className="simpleAddEditContainer" >
                description:
                <textarea id="newWordTypeDescription" className="singleAddEditElem" ></textarea>
            </div>

            <br/>

            <div style={{width:"700px",display:"inline-block"}}>
                template:<br/>
                <textarea id="newWordTypeTemplate" style={{width:"650px",height:"600px"}}  ></textarea>
            </div>

            <div style={{width:"700px",display:"inline-block"}}>
                schema (i.e. JSON Schema)<br/>
                <textarea id="newWordTypeSchema" style={{width:"650px",height:"600px"}}  ></textarea>
            </div>
        </>
    )
}

export default makeNewEditOldWordType
