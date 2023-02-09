import picture from '../assets/undraw_winners_ao2o 2.svg'

const Results = props => {

    const resetHandler= ()=>{
        props.tryAgain()
    }

    return (
        <>
            <p><img src={picture} alt='winner'/></p>
            <h2 className='results'>Results</h2>
            {props.nbResponses === 0 && <p className='resultsText'>No good answer... That's a shame, try again!</p>}
            {props.nbResponses === 1 && <p className='resultsText'>You got <span className='number'>{props.nbResponses}</span> correct answer! <br/>You can do better, try again!</p>}
            {props.nbResponses > 1 && <p className='resultsText'>You got <span className='number'>{props.nbResponses}</span> correct answers!</p>}
            {props.nbResponses >= 10 && <p className='resultsText'>You got <span className='number'>{props.nbResponses}</span> correct answers!<br/>You're on fire! Can you do better?</p>}
            <div><button className='tryAgainButton' onClick={resetHandler}>Try again</button></div>
        </>
    )

}

export default Results