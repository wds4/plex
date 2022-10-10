import IpfsHttpClient from 'ipfs-http-client';
import * as ConceptGraphInMfsFunctions from './conceptGraphInMfsFunctions.js'
const jQuery = require("jquery");

const electronFs = window.require('fs');

const ipfs = IpfsHttpClient({
    host: "localhost",
    port: "5001",
    protocol: "http"
});
