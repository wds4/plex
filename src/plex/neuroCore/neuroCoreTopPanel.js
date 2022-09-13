import React, { useState, useEffect } from "react";
import NeuroCoreMonitoringPanel from './neuroCoreMonitoringPanel.js';
import NeuroCoreTimer from './neuroCoreTimer.js';
import ManageSqlInDOM from './manageSqlInDOM.js';
// import NeuroCoreMainConceptGraphSelector from './neuroCoreMainConceptGraphSelector.js'
const jQuery = require("jquery");

const NeuroCoreTopPanel = () => {
    return (
        <>
            <div className="neuroCoreMonitoringPanel" id="manageSqlInDOMPanel">
                <ManageSqlInDOM />
            </div>

            <div className="neuroCoreMonitoringPanel" id="neuroCoreMonitoringPanel">
                <NeuroCoreTimer style={{display:"inline-block"}} />
                <NeuroCoreMonitoringPanel />
            </div>
        </>
    )
}

export default NeuroCoreTopPanel;
