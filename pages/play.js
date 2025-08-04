import Szhead from '../components/Szhead';
import Card from '../components/Card'
import Tricks from '../components/phases/Tricks'
import Trumps from '../components/phases/Trumps'
import { useEffect, useState } from 'react';
import HandComp from '../components/Hand';
import Played from '../components/Played';

const playPage = () => {
    const [data, changeData] = useState({});
    const [screenWidth, changeWidth] = useState();
    const [screenHeight, changeHeight] = useState();
    console.log("TOPTHEDATAIS", data)
    const updateData = (toSpread) => {
        console.log(typeof(toSpread), toSpread, "TOSPREADCHK")
        console.log({...data}, "DATAFG")
        let tempData = {...data, ...toSpread}
        console.log(tempData, "TEMPDATA2")
        changeData(tempData)
    }
    const resizeThings = () => {
        changeWidth(window.innerWidth)
        changeHeight(window.innerHeight)
    }
    const grabCards = (queryUrl, password) => {
        console.log("Grabbing cards", queryUrl)
        fetch('/grabCards' + queryUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: password })
        })
        .then(response => response.json())
        .then(grabbedData => {
            if (grabbedData?.code != 'nogame') {
                Object.assign(grabbedData, {urlSub: queryUrl})
                updateData(grabbedData)
                console.log('Success:', data);
            }
        })
        .catch(error => {
            console.error('Error uploading JSON:', error);
        });
    }
    useEffect(() => {
        resizeThings()
        window.addEventListener('resize', resizeThings)
        let urlPlay = new URL(window.location.href)
        let urlToSend = urlPlay.pathname.substring(1) + urlPlay.search;
        console.log("DATARESIZE", data)
        const pword = window.localStorage.getItem('password')
        grabCards(urlPlay.search, pword)
        const interval = setInterval(() => {
            grabCards(urlPlay.search, pword)
        }, 1000);
    }, [])
    console.log("THEDATAIS", data)
    return(
        <div>
            <Szhead title={'play'}/>
            <div>
                {data.gamePhase > 1? 
                (<div>
                    <p1>Player 1 points: {data?.p1pts != undefined? data.p1pts : 'loading...'}<br/></p1>
                    <p1>Player 2 points: {data?.p2pts != undefined? data.p2pts : 'loading...'}<br/></p1>
                    <p1>{data?.trump != undefined? 'Trumps: ' + data.trump : ''}</p1>
                </div>) 
                : 
                (<div></div>)}
                
                {data.isTurn ? (
                    data.gamePhase < 2? (
                        <div>
                            <Trumps data={data} screenWidth={screenWidth} screenHeight={screenHeight} />
                        </div>
                    ) : (
                        data.played ? (
                            <div>
                                <Played card={data.played} screenWidth={screenWidth} screenHeight={screenHeight}/>
                                <HandComp data={data} screenWidth={screenWidth} />
                                <Tricks data={data} screenWidth={screenWidth} screenHeight={screenHeight} />
                            </div>
                        ) : (
                            <div>
                                <HandComp data={data} screenWidth={screenWidth} />
                                <Tricks data={data} screenWidth={screenWidth} screenHeight={screenHeight} />
                            </div>
                        )   
                    )
                ) : (
                    data.played? (
                        <div>
                            <Played card={data.played} screenWidth={screenWidth} screenHeight={screenHeight}/>
                            <h1>It's your opponent's turn</h1>
                            <HandComp data={data} screenWidth={screenWidth} />
                            <HandComp data={data} screenWidth={screenWidth}/>
                        </div>
                    ) : (
                        <div>
                            <h1>Waiting for your opponent</h1>
                            <HandComp data={data} screenWidth={screenWidth} />
                            <HandComp data={data} screenWidth={screenWidth}/>  
                        </div>
                    )
                )}
            </div> 
        </div>
    );
}
export default playPage