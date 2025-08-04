import ChoiceBox from "../choiceBox";

const GameBox = ({text, openLink}) => {
    return (
        <div>
            <ChoiceBox
            text={text}
            choices={[['Open', openLink]]}
            />
        </div>
    )
}

export default GameBox