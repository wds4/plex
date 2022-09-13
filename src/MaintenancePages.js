import React from "react";
// import * as Constants from './conceptGraphMasthead.js';
import ConceptGraphMasthead from './conceptGraphMasthead.js';
import LeftNavbarMaintenance from './LeftNavbar_Maintenance';

export default class MaintenancePages extends React.Component {
  render() {
    return (
      <>
        <fieldset className="mainBody" >
            <LeftNavbarMaintenance />
            <div className="mainPanel" >
                <ConceptGraphMasthead />
                <div class="h2">Maintenance pages</div>
            </div>
        </fieldset>
      </>
    );
  }
}
