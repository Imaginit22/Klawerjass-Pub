import { useEffect } from 'react';
import Szhead from '../components/Szhead'; 

const HomePage = () => {
    useEffect(() => {
        const imgLink = document.getElementById("imgLink");
        if (!(localStorage.getItem('email') == undefined)) {
            imgLink.href = "/invite";
        } else {
            imgLink.href = "/login";
        }
    }, []);

    return (
        <div>
            <Szhead title="Home" />
            <header>
                <a className="navbar-centered" id="imgLink" href="/howplay">
                    <img src="images/svg/JS.svg" id="AceHearts"  alt="JS Icon" />
                </a>
                <div className="top">
                    <h1 className="top">Play Klawerjas!</h1>    
                </div>
                
                   
            </header>
        </div>
        
    );
};

export default HomePage;
