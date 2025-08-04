import React from "react";
import Card from './Card'
const Played = ({card, screenWidth, screenHeight}) => {
    const styles = {bottom: screenHeight/3, position: 'fixed'}
    return (
        <div id="hand" style={styles}>
            <Card src={`images/svg/${card}.svg`} width={.9*screenWidth/9}/>
        </div>
    )
}

export default Played;