import React, { useState, useEffect } from "react";

const jQuery = require("jquery");

const TopPanelWithCounter = () => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        setTimeout(() => {
            setCount((count) => count + 1);
        }, 1000);
    }, [count]); // <- add empty brackets here

    return (
        <h1>I've rendered {count} times!</h1>
    )
}

export default TopPanelWithCounter;

/*
function TopPanelTimer() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setCount((count) => count + 1);
        }, 1000);
    }, [count]); // <- add empty brackets here

    return <h1>I've rendered {count} times!</h1>;
}

export default class TopPanelWithTimer extends React.PureComponent {
    componentDidMount() {

    }
    shouldComponentUpdate(nextProps, nextState) {
      return true;
    }
    render() {
        return (
          <TopPanelTimer />
        );
    }
}
*/
