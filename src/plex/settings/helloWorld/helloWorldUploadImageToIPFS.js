import React, { useCallback, useState } from 'react';
import * as MiscFunctions from '../../functions/miscFunctions.js';
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'
import { Button } from "reactstrap";
import { useDropzone } from "react-dropzone";
import Masthead from '../../mastheads/plexMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/plex_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import sendAsync from '../../renderer.js'

import { create, urlSource } from 'ipfs'

const jQuery = require("jquery");

export const addDataToIPFS = async (metadata) => {
    const ipfsHash = await MiscIpfsFunctions.ipfs.add(metadata);
    return ipfsHash.cid.toString();
};

const UploadImage = ({ onImageUploaded }) => {
    const [image, setImage] = useState();

    const convertToBuffer = async (reader) => {
        //file is converted to a buffer for upload to IPFS
        //set this buffer -using es6 syntax
        const buffer = await Buffer.from(reader.result);
        return buffer;
    };

    const onDrop = useCallback(
        (acceptedFiles) => {
            const uploadedImage = acceptedFiles[0];
            if (!uploadedImage) return;

            uploadedImage["preview"] = URL.createObjectURL(uploadedImage);
            setImage(uploadedImage);

            let reader = new window.FileReader();
            reader.readAsArrayBuffer(uploadedImage);
            reader.onloadend = async () => {
                const bufferImage = await convertToBuffer(reader);
                const ipfsHash = await addDataToIPFS(bufferImage);
                console.log("ipfsHash", ipfsHash);
                jQuery("#ipfsHashContainer").html(ipfsHash)
            };
        },
        [onImageUploaded]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: "image/jpeg, image/png",
    });

    const thumbs = image && (
        <img className="square-cirle" src={image.preview} alt={image.name} style={{width:"400px"}} />
    );

    return (
        <div {...getRootProps()} className="mb-3">
            <input {...getInputProps()} />
            {isDragActive ? (
            <Button block color="warning" type="button">
                Drop
            </Button>
            ) : (
                <>
                    <Button block color="default" type="button">
                        Drag and drop profile pic
                    </Button>
                </>
            )}
            <br/>
            <div>
            IPFS hash: <div style={{display:"inline-block"}} id="ipfsHashContainer">ipfsHashContainer</div>
            </div>
            {thumbs}
        </div>
    );
};

export default class HelloWorldUploadImageToIPFS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }
    render() {
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <Masthead />
                        <div class="h2">Hello World: Upload Image to IPFS</div>

                        <UploadImage />

                    </div>
                </fieldset>
            </>
        );
    }
}
