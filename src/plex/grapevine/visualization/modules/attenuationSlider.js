import React from "react";
import ReactDOM from 'react-dom';
import * as MiscFunctions from '../../../functions/miscFunctions.js';
import noUiSlider from "nouislider";
import "nouislider/distribute/nouislider.min.css";

const electronFs = window.require('fs');

const jQuery = require("jquery");

export default class AttenuationSliderModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    async componentDidMount() {
        const updateAttenuationFactor = () => {
            var attenuationFactorValue = attenuationSlider.noUiSlider.get();
            var attenuationFactorValue = attenuationFactorValue / 100;
            jQuery("#attenuationFactorValueContainer").html(attenuationFactorValue)
        }
        var attenuationSlider = document.getElementById('attenuationSlider');
        noUiSlider.create(attenuationSlider, {
            start: 90,
            step: 1,
            range: {
                'max': 100,
                "min": 0
            }
        });
        attenuationSlider.noUiSlider.on("update",updateAttenuationFactor)
    }
    render() {
        return (
            <>
                <div style={{display:"inline-block",fontSize:"12px"}} >ATTENUATION FACTOR</div>
                <div id="attenuationFactorValueContainer" style={{display:"inline-block",marginLeft:"10px",width:"30px",fontSize:"12px"}} >1.00</div>
                <div style={{display:"inline-block",marginLeft:"10px",fontSize:"12px"}} >OFF</div>
                <div id="attenuationSlider" style={{display:"inline-block",width:"200px",marginLeft:"10px",backgroundColor:"blue"}} ></div>
                <div style={{display:"inline-block",marginLeft:"10px",fontSize:"12px"}} >ON</div>
            </>
        );
    }
}