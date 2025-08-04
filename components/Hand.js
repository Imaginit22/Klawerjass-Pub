import React, { useEffect } from "react";
import Card from './Card'

const HandComp = ({data, screenWidth }) => {
    console.log("HANDLOADED")
    // Log the data passed to the component as soon as it knows its parameters
    useEffect(() => {
        console.log("HandComp data:", data);
    }, [data]);

    const playCard = ((card) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({'card': card})
        }
        fetch('/chooseSuit'+data.urlSub, options)
        .then(res => {
            data.changeCards(data.cards)
        })
    })
    const swap = (() => {
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({'email': data.email,  'oppEmail': data.oppEmail, 'password': data.password, 's': true})
        }
        fetch('/interactions', options)
    })
    const run = (() => {
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({'email': data.email,  'oppEmail': data.oppEmail, 'password': data.password, 'r': true})
        }
        fetch('/interactions', options)
    })
    const belle = (() => {
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({'email': data.email,  'oppEmail': data.oppEmail, 'password': data.password, 'b': true})
        }
        fetch('/interactions', options)
    })
    const styles = data.top ? {} : {bottom: '0', position: 'fixed'}
    return (
        <div id="hand" style={styles}>
            {data.cardsHand ? data.cardsHand.map((card, index) => { 
                let runs = -1
                if (data?.trick == 0) {
                    if (data?.runs != undefined) {
                        if (data.runs[0] != undefined) {
                            runs = data.runs[0] - 1
                        }
                        if (data.runs[1] != undefined) {
                            runs = data.runs[1] - 2
                        }
                    }
                }
                
                let playableSuit
                if (data.playable) {
                    if (data.canFollow != undefined) {
                        switch(data.canFollow) {
                            case 0: playableSuit = data.suitToFollow
                                break;
                            case 1: playableSuit = data.trumps
                                break;
                        }
                    }
                    let canPlay
                    if (data.played != undefined) {
                        canPlay = (playableSuit == card[1] || playableSuit == undefined)
                    }
                    if (data.canFollow == undefined) {
                        canPlay = true
                    }
                    if (((data.played == index) && (canPlay))) {
                        const img = new Image;
                        img.src = `images/svg/${card}.svg`;
                        return (
                            <div style={{bottom: `${((.9*screenWidth/9)/img.width)*img.height}px`, position: 'relative'}}>
                                <Card key={index} src={`images/svg/${card}.svg`} width={.9*screenWidth/9}/>
                                {<button style={{position: 'fixed'}} onClick={() => {playCard(card)}}>Play this card</button>}
                            </div>
                        )
                    } else {
                        return (
                            <div>
                                <Card key={index} src={`images/svg/${card}.svg`} width={.9*screenWidth/9} onClick={() => {data.chooseCard(index)}}/>
                                {data.trumpDecider != undefined && data.trick == 0 ? (('7' + data.trumpDecider[1] == card)? (<button onClick={() => {swap()}}>Swap 7 for {data.trumpDecider? data.mapNames.get(data.trumpDecider[0]) : 'loading...'}</button>) : (<div></div>)) : (<div></div>)}
                                {runs == index && data.trick == 0 ? (<button onClick={() => {run()}}>RUN</button>) : (<div></div>)}
                                {(data?.belle && card == 'K' + data.trumps) && data.trick == 0? (<button onClick={() => {belle()}}>BELLE</button>) : (<div></div>)}
                            </div>
                        )
                    }
                } else {
                    return (
                        <div>
                            <Card key={index} src={`images/svg/${card}.svg`} width={.9*screenWidth/9}/>
                        </div>
                    )
                }
            }) : <div>Loading cards...</div>}
            {data.blanks? (data.blanks.map((blank, index) => (
                <div>
                    <Card key = {blank+index} src={'images/svg/1B.svg'} width={.9*screenWidth/9} />
                </div>
            ))) :
            (<div></div>)}
        </div>
    )
}

export default HandComp;