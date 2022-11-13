import React, { useCallback, useState } from 'react';
import { useDropzone } from "react-dropzone";
import { Button } from "reactstrap";
import * as ConceptGraphLib from '../../lib/ipfs/conceptGraphLib.js'
import * as GrapevineLib from '../../lib/ipfs/grapevineLib.js'
import * as MiscIpfsFunctions from '../../lib/ipfs/miscIpfsFunctions.js'

const cg = ConceptGraphLib.cg;
const gv = GrapevineLib.gv;

const jQuery = require("jquery");

export const addDataToIPFS = async (metadata) => {
    const ipfsHash = await MiscIpfsFunctions.ipfs.add(metadata);
    return ipfsHash.cid.toString();
};

const UploadProfileImage = ({ onImageUploaded }) => {
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
                // console.log("ipfsHash", ipfsHash);
                jQuery("#newImageIpfsHashContainer").html(ipfsHash)
                MiscIpfsFunctions.fetchImgFromIPFS(ipfsHash)
                jQuery("#avatarBox").css("display","inline-block");
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
        <img className="square-cirle" src={image.preview} alt={image.name} style={{width:"100px"}} />
    );

    return (
        <div {...getRootProps()} className="mb-3" style={{width:"100%",height:"100%"}} >
            <input {...getInputProps()} />
                {isDragActive ? (
                <div style={{width:"100%",height:"100%"}} >
                    <Button block color="warning" type="button" style={{width:"100%",height:"100%"}} >
                        Drop
                    </Button>
                </div>
            ) : (
                <div style={{width:"100%",height:"100%"}} >
                    <Button block color="default" type="button" style={{width:"100%",height:"100%"}} >
                        Drag and drop profile pic
                    </Button>
                </div>
            )}
        </div>
    );
};

export default class NewPostContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        console.log("Pitter Home")
        jQuery("#writeNewPostTextarea").keyup(function(){
            var currentMessage = jQuery(this).val();
            var numChars = currentMessage.length;
            jQuery("#numberOfCharactersContainer").html(currentMessage.length)
            jQuery("#numberOfCharactersContainerWrapper").css("border-color","green")
            jQuery(".numberOfCharactersContainerWrapper").css("display","table")
            if (numChars == 0) {
                jQuery(".numberOfCharactersContainerWrapper").css("display","none")
            }
            if (numChars > 280) {
                jQuery(".numberOfCharactersContainerWrapper").css("border-color","red")
            }
        })
        jQuery("#submitPostButton").click(async function(){
            var oNewPost = await cg.word.create("post")
            var currentMessage = jQuery("#writeNewPostTextarea").val();
            // or convert message to CBOR?
            // also need validation functions
            oNewPost.postData.author.peerID = await cg.ipfs.returnMyPeerID();
            oNewPost.postData.author.username = await cg.ipfs.returnMyUsername();
            oNewPost.postData.text = currentMessage;
            oNewPost.postData.whenSubmitted = Date.now()
            console.log("oNewPost: "+JSON.stringify(oNewPost,null,4))
        })
    }
    render() {
        return (
            <>
                <div style={{padding:"5px",textAlign:"left"}} >
                    <div >What is your status?</div>
                    <textarea id="writeNewPostTextarea" className="writeNewPostTextarea" ></textarea>
                    <div style={{float:"right"}}>
                        <div style={{display:"inline-block"}}>
                            <div className="numberOfCharactersContainerWrapper" >
                                <div id="numberOfCharactersContainer" style={{display:"table-cell",verticalAlign:"middle"}} ></div>
                            </div>
                        </div>
                        <div id="submitPostButton" >Tap</div>
                    </div>
                    <div style={{clear:"both"}} ></div>

                    <div id="avatarContainer" style={{display:"inline-block",border:"1px dashed grey",width:"100px",height:"100px"}}>
                        <div id="uploadProfileImageButtonContainer" style={{display:"none",width:"100%",height:"100%"}} >
                            <UploadProfileImage />
                        </div>
                        <img id="avatarBox" />
                    </div>

                </div>
            </>
        );
    }
}
