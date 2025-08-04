import React from "react";
const ChoiceBox = ({text, choices}) => {
    
    return (
        <div className="choiceBox">
            <div style={{padding: '0'}}>
                <p className="choiceTitle">{text}</p>
            </div>
            <div className="choices">
                {choices.map((choice, index) => {
                    return (
                        <a
                            key={index} 
                            href={`/${choice[1]}`} 
                            className="choice"
                            onClick={(event) => choice[2][0](...choice[2][1][0], event)}
                        >
                            {choice[0]}
                        </a>
                    )
                })}
            </div>
        </div>
    )
}

export default ChoiceBox;