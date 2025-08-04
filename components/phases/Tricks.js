import React from "react";
import Card from '../Card'
import HandComp from "../Hand";

const divHand = ({data, screenWidth, screenHeight }) => {
    const playCard = (index) => {
        console.log("Played", index)
        data.chooseCard(index);
    }
    return (
        <div>
            <HandComp
            data={data}
            screenWidth={screenWidth}
            playable={true}
            played={data.played}
            playCard={playCard}
            />
        </div>
    )
}

export default divHand