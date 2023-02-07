import picture from '../assets/undraw_winners_ao2o 2.svg'

const Results = props => {
    return (
        <div>
            <img src={picture} alt='winner'/>
            <h2 className='results'>Results</h2>
            <p className='resultsText'>You got <span className='number'>xx</span> correct answers
             <br/>out of <span>xx</span> questions</p>
            <button className='tryAgainButton'>Try again</button>
        </div>
    )

}

export default Results