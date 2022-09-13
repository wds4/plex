
const jQuery = require("jquery");

const toggleNeuroCoreStatePanel = () => {
    var currStatus = jQuery("#neuroCoreStatePanelToggleButton").data("status");
    if (currStatus=="closed") {
        jQuery("#neuroCoreStatePanelToggleButton").data("status","open");
        jQuery("#neuroCoreStatePanelToggleButton").html("hide State Panel")
        // jQuery("#neuroCoreMonitoringPanel").css("display","block")
        jQuery("#neuroCoreStatePanel").animate({
            height: "500px",
            padding: "10px",
            borderWidth:"1px"
        },500);
    }
    if (currStatus=="open") {
        jQuery("#neuroCoreStatePanelToggleButton").data("status","closed");
        jQuery("#neuroCoreStatePanelToggleButton").html("show State Panel");
        // jQuery("#neuroCoreMonitoringPanel").css("display","none")
        jQuery("#neuroCoreStatePanel").animate({
            height: "0px",
            padding: "0px",
            borderWidth:"0px"
        },500);
    }
}

const toggleNeuroCorePatternsPanel = () => {
    var currStatus = jQuery("#neuroCorePatternsPanelToggleButton").data("status");
    if (currStatus=="closed") {
        jQuery("#neuroCorePatternsPanelToggleButton").data("status","open");
        jQuery("#neuroCorePatternsPanelToggleButton").html("hide Patterns Panel")
        // jQuery("#neuroCoreMonitoringPanel").css("display","block")
        jQuery("#neuroCorePatternsPanel").animate({
            height: "500px",
            padding: "10px",
            borderWidth:"1px"
        },500);
    }
    if (currStatus=="open") {
        jQuery("#neuroCorePatternsPanelToggleButton").data("status","closed");
        jQuery("#neuroCorePatternsPanelToggleButton").html("show Patterns Panel");
        // jQuery("#neuroCoreMonitoringPanel").css("display","none")
        jQuery("#neuroCorePatternsPanel").animate({
            height: "0px",
            padding: "0px",
            borderWidth:"0px"
        },500);
    }
}

const toggleNeuroCoreActionsPanel = () => {
    var currStatus = jQuery("#neuroCoreActionsPanelToggleButton").data("status");
    if (currStatus=="closed") {
        jQuery("#neuroCoreActionsPanelToggleButton").data("status","open");
        jQuery("#neuroCoreActionsPanelToggleButton").html("hide Actions Panel")
        // jQuery("#neuroCoreMonitoringPanel").css("display","block")
        jQuery("#neuroCoreActionsPanel").animate({
            height: "500px",
            padding: "10px",
            borderWidth:"1px"
        },500);
    }
    if (currStatus=="open") {
        jQuery("#neuroCoreActionsPanelToggleButton").data("status","closed");
        jQuery("#neuroCoreActionsPanelToggleButton").html("show Actions Panel");
        // jQuery("#neuroCoreMonitoringPanel").css("display","none")
        jQuery("#neuroCoreActionsPanel").animate({
            height: "0px",
            padding: "0px",
            borderWidth:"0px"
        },500);
    }
}

const manageSinglePatternSelectorCheckboxes = (topLevel) => {

    // var s1rBoolean = jQuery("#allPatterns").prop("checked")
    if (topLevel=="allPatterns") {
        jQuery(".singlePatternCheckbox").prop("checked",true)
        jQuery(".s1nDisplayBox").css("display","block")
        jQuery(".s1rDisplayBox").css("display","block")
        jQuery(".s2rDisplayBox").css("display","block")
    }
    if (topLevel=="justOnePattern") {
        jQuery(".singlePatternCheckbox").prop("checked",false)
        jQuery(".s1nDisplayBox").css("display","block")
        jQuery(".s1rDisplayBox").css("display","block")
        jQuery(".s2rDisplayBox").css("display","block")
    }
    if (topLevel=="selectedPatterns") {
        jQuery(".singlePatternCheckbox").prop("checked",true)
        var allOpCodeB = jQuery("#allOpCodeB").prop("checked")
        var allOpCodeC = jQuery("#allOpCodeC").prop("checked")

        if (allOpCodeC) {
            jQuery(".s1nDisplayBox").css("display","block")
            jQuery(".s1rDisplayBox").css("display","block")
            jQuery(".s2rDisplayBox").css("display","block")
        } else {
            var s1nChecked = jQuery("#checkbox-s1n").prop("checked")
            var s1rChecked = jQuery("#checkbox-s1r").prop("checked")
            var s2rChecked = jQuery("#checkbox-s2r").prop("checked")
            if (s1nChecked) { jQuery(".s1nDisplayBox").css("display","block")
                } else { jQuery(".s1nDisplayBox").css("display","none") }
            if (s1rChecked) { jQuery(".s1rDisplayBox").css("display","block")
                } else { jQuery(".s1rDisplayBox").css("display","none") }
            if (s2rChecked) { jQuery(".s2rDisplayBox").css("display","block")
                } else { jQuery(".s2rDisplayBox").css("display","none") }
        }
    }
}

export { toggleNeuroCorePatternsPanel, toggleNeuroCoreActionsPanel, toggleNeuroCoreStatePanel, manageSinglePatternSelectorCheckboxes };
