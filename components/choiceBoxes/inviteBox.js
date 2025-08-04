import ChoiceBox from "../choiceBox";

const InviteBox = ({text, functions}) => {
    return (
        <div>
            <ChoiceBox
            text={text}
            choices={[['Accept invite', 'acceptInvite', [functions[0][0], [functions[0][1]]]]]}
            />
        </div>
    )
}

export default InviteBox