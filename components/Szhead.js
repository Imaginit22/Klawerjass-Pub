
import React, { useEffect, useState } from 'react';
import Head from 'next/head';

const Szhead = ({ title }) => {
    const [links, setLinks] = useState([]);
    const [email, setEmail] = useState([]);
    useEffect(() => {
        setEmail(localStorage.getItem('email'))
        const newLinks = [
            { href: "/", text: "Home" },
            { href: "/about", text: "About" },
            { href: "/howplay", text: "How to Play" }
        ];
        if (localStorage.getItem('email') != null) {
            setLinks([
                ...newLinks,
                { href: "/invite", text: "Invites/Games" }
            ]);
        } else {
            setLinks(newLinks);
        }
    }, []);

    return (
        <>
            <Head>
                <meta charSet="UTF-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>{title}</title>
                <link rel="stylesheet" href="../styles/styles.css"/>
                <link rel="icon" type="image/x-icon" href="/images/svg/JS.svg"/>
            </Head>
            <nav>
                <div id="leftMenu">
                    {links.map(link => (
                        <a key={link.href} href={link.href} style={{paddingLeft:'10px'}}>{link.text}</a>
                    ))}
                </div>
                <div className="right">
                    <a id="signUp" href={email ? "/account" : "/login"}>
                        {email ? email : "Sign up/Log in"}
                    </a>
                </div>
            </nav>
        </>
    );
};

export default Szhead;
