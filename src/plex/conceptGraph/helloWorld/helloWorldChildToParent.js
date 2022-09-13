import React from 'react';
import ConceptGraphMasthead from '../../mastheads/conceptGraphMasthead.js';
import LeftNavbar1 from '../../navbars/leftNavbar1/conceptGraph_leftNav1';
import LeftNavbar2 from '../../navbars/leftNavbar2/helloWorld_leftNav2.js';
import sendAsync from '../../renderer.js'

const jQuery = require("jquery");

class Child extends React.Component{

    onTrigger = (event) => {
        this.props.parentCallback("Data from child");
        event.preventDefault();
    }

    render(){
        return(
        <div>
            <form onSubmit = {this.onTrigger}>
                <input type = "submit" value = "Submit"/>
            </form>
        </div>
        )
    }
}

export default class HelloWorldMainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    handleCallback = (childData) =>{
        this.setState({data: childData})
    }

    componentDidMount() {
    }
    render() {
        const {data} = this.state;
        return (
            <>
                <fieldset className="mainBody" >
                    <LeftNavbar1 />
                    <LeftNavbar2 />
                    <div className="mainPanel" >
                        <ConceptGraphMasthead />
                        <div class="h2">Hello World: React Child to Parent</div>

                        <div>
                            <Child parentCallback = {this.handleCallback}/>
                            {data}
                        </div>

                    </div>
                </fieldset>
            </>
        );
    }
}
