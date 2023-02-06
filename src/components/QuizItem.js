const QuizItem = props => {

    let proposition = props.proposition

    const onChangeHandler = () => {
        props.onChange(props.id)
    }
 
    return (
        <label htmlFor={proposition} className={`responseButton mb-2 ${props.className}`}><input id={props.id} type='radio'  checked={props.selected} onChange={onChangeHandler} value={props.id} disabled={props.disabled}/>{props.children}</label>
    )
}

export default QuizItem