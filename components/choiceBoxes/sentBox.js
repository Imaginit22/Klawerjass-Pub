import ChoiceBox from "../choiceBox";


const SentBox = ({text, functions}) => {
    return (
        <div>
            <ChoiceBox
            text={text}
            choices={[['Delete invite', 'deleteInvite', [functions[0][0], [functions[0][1]]]]]}
            />
        </div>
    )
}

export default SentBox