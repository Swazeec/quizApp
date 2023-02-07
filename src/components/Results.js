import picture from '../assets/undraw_winners_ao2o 2.svg'

const Results = props => {

    const resetHandler= ()=>{
        props.tryAgain()
    }

    return (
        <div>
            <img src={picture} alt='winner'/>
            <h2 className='results'>Results</h2>
            <p className='resultsText'>You got <span className='number'>{props.nbResponses}</span> correct answers
             <br/>out of <span>{props.nbQuestions}</span> questions</p>
            <button className='tryAgainButton' onClick={resetHandler}>Try again</button>
        </div>
    )

}

export default Results