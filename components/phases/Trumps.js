import React from "react";
import Card from '../Card'
import HandComp from "../Hand";

const pickHand = ({data, screenWidth, screenHeight }) => {
    const chooseSuit = ((trump) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({'trump': trump})
        }
        console.log("URLSUB", data.urlSub)
        fetch('/chooseSuit'+data.urlSub, options)
    })
    let suitSkip;
    const suitNames = {
        'S': 'Spades', 
        'H': 'Hearts', 
        'C': 'Clubs', 
        'D': 'Diamonds'}
    if (data.dealPhase < 2) {
        suitSkip = [data.trumpDecider, 'B']
    } else if (data.dealPhase == 2) {
        suitSkip = ['S', 'H', 'C', 'D', 'B']
    } else if (data.dealPhase == 3) {
        suitSkip = ['S', 'H', 'C', 'D']
    }
    console.log("SuitSkip", suitSkip)
    return (
        <div>
            <div id="choices">
                {suitSkip.map((suit, index) => {
                    return (
                        <div>
                            <Card src={`images/svg/${suit.length == 2 ? data.trumpDecider :'A'+suit}.svg`} key={index} ></Card>
                            <button onClick={() => {chooseSuit(suit)}}>{suit=='B' ? 'Pass': `Pick ${suitNames[suit.slice(-1)]}`}</button>
                        </div>
                    )
                })}
            </div>
            <HandComp 
                data={data}
                screenWidth={screenWidth}
                trumpDecider={data.trumpDecider}
                playable={false}
            />
        </div>
    )
}

export default pickHand