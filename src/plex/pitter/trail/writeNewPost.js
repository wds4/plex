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

export const fetchImgFromIPFS = async (cid) => {
    if (!cid) {
        cid = '/ipfs/QmNma7eG55pEEbnoepvCGXZTt8LJDshY6zZerGj8ZY21iS' // sample_rorshach.png in private IPFS network, also on iMac desktop
    }
	try {
    	let bufs = []
    	for await (const buf of MiscIpfsFunctions.ipfs.cat(cid)) {
    	    bufs.push(buf)
    	}
    	const data = Buffer.concat(bufs)
    	var blob = new Blob([data], {type:"image/png"})
    	var img = document.getElementById("imageBox_"+nextUploadPicNumber) // the img tag you want it in
    	img.src = window.URL.createObjectURL(blob)
    } catch (e) {}
}

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
                aImageCidsToUpload.push(ipfsHash)
                console.log("ipfsHash", ipfsHash);
                await fetchImgFromIPFS(ipfsHash)
                jQuery("#imageBox_"+nextUploadPicNumber).css("display","inline-block");
                // jQuery("#uploadImagesContainer1").css("display","none");
                jQuery("#uploadImageContainer_"+nextUploadPicNumber).css("display","inline-block");
                nextUploadPicNumber++;
                jQuery("#nextUploadPicNumberContainer").html(nextUploadPicNumber)
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
        <div {...getRootProps()} id="dragAndDropBox_" className="mb-3" style={{width:"100%",height:"100%"}} >
            <input {...getInputProps()} />
                {isDragActive ? (
                <div style={{width:"100%",height:"100%"}} >
                    <Button block color="warning" type="button" style={{width:"100%",height:"100%"}} >
                        Drop
                    </Button>
                </div>
            ) : (
                <div  style={{width:"100%",height:"100%"}} >
                    <Button block color="default" type="button" style={{width:"100%",height:"100%",fontSize:"12px"}} >
                        <div>drag and drop</div>
                        <div>- or -</div>
                        <div>click to upload</div>
                    </Button>
                </div>
            )}
        </div>
    );
};

var nextUploadPicNumber = 0;
var aImageCidsToUpload = [];

export default class NewPostContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    async componentDidMount() {
        console.log("Pitter Home")
        nextUploadPicNumber = 0;
        aImageCidsToUpload = [];
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
            var foo1 = await cg.ipfs.returnMyPeerID({slice10:true})
            var foo2 = await cg.word.returnIpns(oNewPost,{slice10:true});
            var wordSlug = "post_"+foo1+"_"+foo2;
            var wordName = "post by "+foo1+" of "+foo2;
            var wordTitle = "Post by "+foo1+" of: "+foo2;
            // or convert message to CBOR?
            // also need validation functions
            oNewPost.wordData.slug = wordSlug;
            oNewPost.wordData.name = wordName;
            oNewPost.wordData.title = wordTitle;
            oNewPost.postData.author.peerID = await cg.ipfs.returnMyPeerID();
            oNewPost.postData.author.username = await cg.ipfs.returnMyUsername();
            oNewPost.postData.text = currentMessage;
            oNewPost.postData.images = aImageCidsToUpload
            oNewPost.postData.whenSubmitted = Date.now()
            console.log("oNewPost: "+JSON.stringify(oNewPost,null,4))

            // first, add new word to the concept graph (unattached)
            // var foo = await cg.mfs.add(oNewPost)
            // next, attach it to the concept for post
            var foo = await cg.specificInstance.add(oNewPost,"conceptFor_post",{conceptGraphRole:"grapevine"})
        })
        jQuery("#addPicsToggleButton").click(function(){
            var currStatus = jQuery(this).data("status");
            if (currStatus=="closed") {
                jQuery(this).data("status","open")
                jQuery("#pitterTrailLeaveMessageContainer").css("height","300px")
                // jQuery("#uploadImagesContainer1").css("display","inline-block")
                // jQuery("#uploadImagesContainer").css("display","inline-block")
                jQuery("#uploadImagesSection").css("display","block");
            }
            if (currStatus=="open") {
                jQuery(this).data("status","closed")
                jQuery("#pitterTrailLeaveMessageContainer").css("height","180px")
                // jQuery("#uploadImagesContainer1").css("display","none")
                jQuery("#uploadImagesContainer").css("display","none")
                jQuery("#uploadImagesSection").css("display","none");
            }
        })
    }
    render() {
        return (
            <>
                <div style={{padding:"5px",textAlign:"left"}} >
                    <div >What is your status?</div>
                    <textarea id="writeNewPostTextarea" className="writeNewPostTextarea" ></textarea>

                    <div style={{display:"none"}} >
                        nextUploadPicNumber:
                        <div id="nextUploadPicNumberContainer" >0</div>
                    </div>
                    <div style={{display:"inline-block",marginLeft:"5px",padding:"0px 5px 0px 5px"}} id="addPicsToggleButton" data-status="closed" >
                        <div style={{fontSize:"24px"}} >&#x1F4CE;</div>
                    </div>
                    <div style={{float:"right"}}>
                        <div style={{display:"inline-block"}}>
                            <div className="numberOfCharactersContainerWrapper" >
                                <div id="numberOfCharactersContainer" style={{display:"table-cell",verticalAlign:"middle"}} ></div>
                            </div>
                        </div>
                        <div id="submitPostButton" >post status</div>
                    </div>
                    <div style={{clear:"both"}} ></div>
                    <center>
                        <div id="uploadImagesSection" style={{display:"none"}} >
                            <div id="uploadImagesContainer" style={{display:"none",border:"1px dashed grey",width:"100px",height:"100px"}}>
                                <img id="imageBox" />
                            </div>

                            <div id="uploadImageContainer_0" style={{display:"none",border:"1px dashed grey",width:"100px",height:"100px"}}>
                                <img id="imageBox_0" />
                            </div>

                            <div id="uploadImageContainer_1" style={{display:"none",border:"1px dashed grey",width:"100px",height:"100px"}}>
                                <img id="imageBox_1" />
                            </div>

                            <div id="uploadImageContainer_2" style={{display:"none",border:"1px dashed grey",width:"100px",height:"100px"}}>
                                <img id="imageBox_2" />
                            </div>

                            <div id="uploadImageContainer_3" style={{display:"none",border:"1px dashed grey",width:"100px",height:"100px"}}>
                                <img id="imageBox_3" />
                            </div>

                            <div id="uploadImagesContainer1" style={{display:"inline-block",border:"1px dashed grey",width:"100px",height:"100px"}}>
                                <div id="uploadProfileImageButtonContainer" style={{display:"inline-block",width:"100%",height:"100%"}} >
                                    <UploadProfileImage />
                                </div>
                            </div>
                        </div>
                    </center>

                </div>
            </>
        );
    }
}
