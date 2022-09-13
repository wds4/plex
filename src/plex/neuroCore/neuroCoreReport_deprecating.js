import React from 'react';

const jQuery = require("jquery");

const NeuroCoreReport = () => {
    var reportHTML = "";
    reportHTML = "howdy";

    var isAllPatternsChecked = jQuery("#allPatterns").prop("checked");
    var isJustOnePatternChecked = jQuery("#justOnePattern").prop("checked");
    var isSelectedPatternsChecked = jQuery("#selectedPatterns").prop("checked");

    var reportHTML = "";
    if (isAllPatternsChecked) {
          reportHTML += "running ALL PATTERNS";
    }
    if (isJustOnePatternChecked) {
          reportHTML += "running JUST ONE PATTERN";
    }
    if (isSelectedPatternsChecked) {
          reportHTML += "running SELECTED PATTERNS";
    }
    reportHTML += "\n";
    reportHTML += "\\\\\\\\\\\\\\\\\\\\\\\\\\";

    return (
      <>
        {reportHTML}
      </>
    );

}

export default NeuroCoreReport
