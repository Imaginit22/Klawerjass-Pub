import { useEffect, useState } from 'react';
import Szhead from '../components/Szhead';
import GameBox from '../components/choiceBoxes/gameBox';
import SentBox from '../components/choiceBoxes/sentBox';
import InviteBox from '../components/choiceBoxes/inviteBox';
const InvitePage = () => {
    const [invites, setInvites] = useState([]);
    const [games, setGames] = useState([]);
    const [outvites, setOutvites] = useState([]);
    const [userToInvite, setUserToInvite] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    function grabInvites(email, password) {
        fetch('/grabInvites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': (email ? email : ''), 'password': password })
        }).then(res => {
            console.log("quetzali");
            if(!res.ok) {
                console.log("OKNOTOK")
            } else {
                console.log("RADIO");
                return res.json()
            }
        }).then(data => {
            if (data.invites != 'NOINVITES') {
                setInvites(data.invites)
                console.log(data.invites, " IAIDO")
            }
            if (data.games != 'NOGAMES') {
                setGames(data.games)
                console.log("DATAGAMES " , data.games)
            }
            if (data.outvites != 'NOSENT') {
                setOutvites(data.outvites)
                console.log("OUTVITES " , data.outvites)
            }
        });
    }
    useEffect(() => {
        const storedEmail = window.localStorage.getItem('email');
        const storedPassword = window.localStorage.getItem('password');
        setEmail(storedEmail || '');
        setPassword(storedPassword || '');
        console.log(email, password)
        grabInvites(storedEmail, storedPassword);
    }, [])

    const acceptInvite = (sender, event) => {
        event.preventDefault();
        console.log("DEFAULTPREVENTED", sender)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: password,
                recipient: email,
                sender: sender.email
            })
        };
        console.log('Request options:', options)
        fetch(`/createGame`, options)
        .then(res => {
            console.log('PostReq', options)
            console.log(res, "ALLOSAURUS")
            const addGames = [...games]
            addGames.push(sender)
            console.log("PENIS")
            console.log("ADDDDDDDDD", addGames)
            setGames(addGames)
            for (let i = 0; i < invites.length; i++) {
                if (invites[i].email == sender.email) {
                    const changeVites = [...invites]
                    changeVites.splice(i, 1)
                    console.log("FFLLYNK", invites, "UUIII", changeVites)
                    setInvites(changeVites)
                    break;
                }
            }
        })
        
    }
    const fieldTyped = (event) => {
        setMessage('')
        setUserToInvite(event.target.value)
        console.log("FCU ", userToInvite, "  ", event.target.value)
    }
    const sendInvite = () =>  {
        const wholeShebang = {
            recipient: userToInvite,
            sender: email
        }
        console.log(email)
        console.log("boo")
        const jsonData = JSON.stringify(wholeShebang)
        const options = {
            method: 'POST', // Specify the request method (PUT for updating data)
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        };
        console.log(options, "OPTIONS")
        fetch('/userInvite', options)
        .then(res => res.json())
        .then(data => {
            console.log(data, "DINOSAUR")
            setMessage(data)
            console.log(outvites, "OUTV1TEES", outvites.length)
            if (data != "That user does not exist.") {
                if (outvites.length == 0) {
                    setOutvites([{email: userToInvite}])
                } else {
                    const pushArray = outvites
                    pushArray.push({email: userToInvite})
                    setOutvites(pushArray)
                }
            }     
        })
    }
    const deleteInvite = (recipient, event) => {
        event.preventDefault();
        console.log("DFP DELETEINV", recipient.email)
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: password,
                sender: email,
                recipient: recipient.email
            })
        };
        console.log('Request options:', options)
        fetch(`/deleteInvite`, options)
        .then(res => {
            console.log('PostReq', options)
            console.log(res, "ANKYLOSAURUS HOBBES")
            for (let i = 0; i < outvites.length; i++) {
                if (outvites[i].email == recipient.email) {
                    const changeVites = [...outvites]
                    changeVites.splice(i, 1)
                    console.log("ALLYNK", outvites, "CHCHC", changeVites)
                    setOutvites(changeVites)
                    break;
                }
            }
        })
    }

    

    return(
        <div>
            <Szhead title={'invites'}/>
            <div className="form-overall">
                <h1>Invites/Games</h1>
                <div className="form-items">
                    <label htmlFor="userToInvite" id="user">User to Invite: </label>
                    <input type="user" value={userToInvite} onChange={fieldTyped} id="userToInvite" name="userToInvite" placeholder="Username" required/>
                </div>
                <label id="error"></label>
                <button type="submit" className = "submit-button" name="submitButton" id="submitButton" value="Submit" onClick={sendInvite}>Submit</button>
                <p1 id="inviteFlag">{message}</p1>
                <h2 className="form-overall" id='invitesTitle'>{invites.length > 0 ? 'Invites' : ''}</h2>
                <div className="form-overall" id="invites">
                    {invites.map((invite, index) => (
                    /*<a
                        key={index} 
                        href={`/createGame`} 
                        onClick={(event) => acceptInvite(invite, event)}
                    >
                        {invite.email}
                    </a>*/
                        <InviteBox
                            key={index}
                            text={invite.email}
                            functions={[[acceptInvite, [invite]]]}
                        />
                    ))}
                </div>
                <h2 className="form-overall" id='gamesTitle'>{games.length > 0 ? 'Games' : ''}</h2>
                <div className="form-overall" id='games'>
                    {games.map((game, index) => (
                        <GameBox
                            key={index}
                            text={game.email}
                            openLink={`play?${email}+${game.email}`}
                        />
                    ))}
                </div>
                <h2 className="form-overall" id='outvitesTitle'>{outvites.length > 0 ? 'Sent Invites' : ''}</h2>
                <div className="form-overall" id="outvites">
                    {console.log(outvites, "PUTOUTOUTOUT")}
                    {outvites.map((outvite, index) => (
                    /*<a
                        key={index} 
                        href={`/deleteInvite`} 
                        onClick={(event) => deleteInvite(outvite, event)}
                    >
                        {outvite.email}
                    </a>*/
                        <SentBox
                        key={index}
                        text={outvite.email}
                        functions={[[deleteInvite, [outvite]]]}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
export default InvitePage