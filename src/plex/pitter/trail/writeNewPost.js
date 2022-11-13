import React from 'react';

const jQuery = require("jquery");

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

                </div>
            </>
        );
    }
}
