import { useEffect } from 'react';
import Szhead from '../components/Szhead';
const AccountPage = () => {
    useEffect(() => {
        const logOut = document.getElementById("logOut");
        logOut.addEventListener('click', () => {
            localStorage.removeItem('email');
            localStorage.removeItem('password');
            window.location.reload();
            window.location.href = '/';
        })
    }, [])
    return(
        <div>
            <Szhead title={'account'}/>
            <button id = "logOut">Log Out</button>
        </div>
    );
}
export default AccountPage