import React from 'react';
// import React, { useCallback, useState } from 'react';
// import { Button } from "reactstrap";
// import { useDropzone } from "react-dropzone";
// import Dropzone from 'react-dropzone'
import * as MiscFunctions from '../../functions/miscFunctions.js';
// import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import sendAsync from '../../renderer.js'
// import axios from 'axios';

import { create, urlSource } from 'ipfs'

// const axios = require('axios').default;
/*
export const Accept = (props) => {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/png': []
    }
  });

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <em>(Only *.jpeg and *.png images will be accepted)</em>
      </div>
      <aside>
        <h4>Accepted files</h4>
        <ul>{acceptedFileItems}</ul>
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul>
      </aside>
    </section>
  );
}
*/


const electronFs = window.require('fs');

const jQuery = require("jquery");

const data = "Hello World test file 2. \n Here is line 2."

/*
var formData = new FormData();

electronFs.readFile("src/plex/conceptGraph/helloWorld/helloWorldTestFile.txt", "utf-8", function(err, dataB) {
    console.log('success; dataB: '+dataB)
})
*/

electronFs.writeFile("src/plex/settings/helloWorld/helloWorldTestFile2.txt", data, (err) => {
    if (err)
        console.log(err);
    else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(electronFs.readFileSync("src/plex/settings/helloWorld/helloWorldTestFile2.txt", "utf8"));
    }
});

export default class HelloWorldWriteFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {

    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Hello World: Write File</div>
                        See helloWorldTestFile.txt in src/plex/conceptGraph/helloWorld/
                        <br/>
                        Also see console.
                    </div>
                </fieldset>
            </>
        );
    }
}
