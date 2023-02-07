import { useEffect, useReducer, useState } from "react"
import QuizItem from "./QuizItem"
import Results from "./Results"

function random(min, max){
    return Math.floor(Math.random() * (max-min +1)) +min
}

const checkAnswer = (value, rightOne)=>value === rightOne ? true : false


function init(){
    let array=[]
    for(let i = 0 ; array.length < 4; i++ ){
        let id = random(0,249)
        !array.includes(id) ? array.push(id) : array.push()
    }
    return {propositions:array, goodResponse: array[random(0,3)]}
}

function newQuestion(prevQuestions, qType){
    // prevQuestions -> objet {capitals:[], flags:[]}
    let array=[]
    let type = qType === 0 ? prevQuestions.capitals : prevQuestions.flags
    for(let i = 0 ; array.length < 4; i++ ){
        let id = random(0,249)
        !array.includes(id) && !type.includes(id) ? array.push(id) : array.push()
    }
    return {propositions:array, goodResponse: array[random(0,3)]}
}

const defaultQuiz = {
    countries: [],
    questionType: 0,
    allQuestionsAsked: {capitals:[], flags:[]},
    resultsId: init(),
    response:'',
    nbGoodResponse:0
}

const quizReducer = (state, action) =>{
    let updatedQuiz;
    let updatedAllQuestionsAsked ;
    if(action.type === 'INIT'){
        updatedAllQuestionsAsked = state.questionType === 0 ? {capitals:[state.resultsId.goodResponse], flags:[]} : {capitals:[], flags:[state.resultsId.goodResponse]}
        let updatedCountries = action.countries
        updatedQuiz = {
            countries: updatedCountries,
            questionType: state.questionType,
            allQuestionsAsked: updatedAllQuestionsAsked,
            resultsId: state.resultsId,
            response:'',
            nbGoodResponse:state.nbGoodResponse
        }
    }

    if(action.type === 'RESPONSE'){
        let updatedResponse = action.response
        let updatedNbGoodResponse = updatedResponse === state.resultsId.goodResponse ? state.nbGoodResponse+1 : state.nbGoodResponse

        updatedQuiz = {
            countries: state.countries,
            questionType: state.questionType,
            allQuestionsAsked: state.allQuestionsAsked,
            resultsId: state.resultsId,
            response:updatedResponse,
            nbGoodResponse:updatedNbGoodResponse
        }

    }

    if(action.type === 'NEWQUESTION'){

        let updatedQType = random(0,1)
        let updateResponse = ''
        let updatedResultsId = newQuestion(state.allQuestionsAsked, updatedQType)
        let prevCapitals = state.allQuestionsAsked.capitals
        let prevFlags = state.allQuestionsAsked.flags

        if(updatedQType === 0) {
            let updatedCapitals = prevCapitals.push(updatedResultsId.goodResponse)
            updatedAllQuestionsAsked = {capitals:updatedCapitals, flags: prevFlags}
        } else {
            let updatedFlags = prevFlags.push(updatedResultsId.goodResponse)
            updatedAllQuestionsAsked = {capitals:prevCapitals, flags: updatedFlags}
        }

        updatedQuiz = {
            countries: state.countries,
            questionType: updatedQType,
            allQuestionsAsked: state.allQuestionsAsked,
            resultsId: updatedResultsId,
            response: updateResponse,
            nbGoodResponse:state.nbGoodResponse
        }
        
    }

    if(action.type === 'NEWGAME'){

        let updatedQType = random(0,1)
        let updatedResultsId = init()

        if(updatedQType === 0){
            updatedAllQuestionsAsked = {capitals:[updatedResultsId.goodResponse], flags:[]}
        } else {
            updatedAllQuestionsAsked = {capitals:[], flags:[updatedResultsId.goodResponse]}
        }
        updatedQuiz = {
            countries: state.countries,
            questionType: updatedQType,
            allQuestionsAsked: updatedAllQuestionsAsked,
            resultsId: updatedResultsId,
            response:'',
            nbGoodResponse:0
        }
    }

    return updatedQuiz
}





const Quiz = props =>{
    // gère les erreurs de récupération de données
    const [error, setError] = useState()
    // pour récupérer toutes les infos de pays
    const [allCountries, setAllCountries] = useState([])
    // gestion du chargement
    const [isLoading, setIsLoading] = useState(true)
    // gestion de la sélection d'option
    const [selected, setSelected] = useState('')
    // gestion de détection de soumission de form
    const [formIsSubmited, setFormIsSubmited] = useState(false)
    // gestion boutons en fonction de la réponse
    const[ok, setOk] = useState(true)
    // gestion de l'affichage des résultats
    const [results, setResults] = useState('')
    

   
    // on récupère toutes les infos pays
    const url = 'https://restcountries.com/v2/all'
    
    useEffect(()=>{
        const fetchingData = async ()=>{
            setIsLoading(true)
            let loadCountries = []
            const response = await fetch(url)
            if(!response.ok){
                throw new Error ('An error occured. Please refresh.')
            }
            let data = await response.json()
            for(const el in data){
                loadCountries.push({
                    id: el,
                    name: data[el].name,
                    capital: data[el].capital,
                    flag: data[el].flag
                })  
            }
            setAllCountries(loadCountries)
        }
        try{
            fetchingData()
        } catch (error){
            setError(error.message)
        }
        setIsLoading(false)
        
    }, [])
    
    const [quizState, dispatchQuizAction]= useReducer(quizReducer, defaultQuiz)

    useEffect(()=>{
        if(!isLoading && !error && allCountries.length !== 0){
            dispatchQuizAction({type: 'INIT', countries:allCountries })
        } 
    }, [allCountries, isLoading, error])

    const onSelectionHandler = e => {
        dispatchQuizAction({type: 'RESPONSE', response:e})
        setSelected(e)
    }
    useEffect(()=>{
        if(quizState.response.length !== 0){
            setOk(checkAnswer(quizState.response,quizState.resultsId.goodResponse))
            setSelected(quizState.response)
            if(results ===0){
                document.getElementById('form').click()
            }
            setFormIsSubmited(true)
        }
    }, [quizState.response, quizState.resultsId.goodResponse, results])
    
    const submitHandler = e => {
        e.preventDefault()
    }

    
    const newQuestionHandler = () => {
        dispatchQuizAction({type: 'NEWQUESTION'})
        setFormIsSubmited(false)
        setOk(true)
        setSelected('')
    }

    let quizItems = ()=>{
        let propositions= quizState.resultsId.propositions
        let classes = ''
        let items = propositions.map(el => {
            classes = selected !== el ? '' : el === quizState.resultsId.goodResponse ? 'right' : 'wrong'
            if(selected.length !== 0){
                if(el === quizState.resultsId.goodResponse){
                    classes = 'right'
                }
            }
            return <QuizItem key={el} id={el} className={classes} proposition={propositions[el]} selected={selected === el} onChange={onSelectionHandler} disabled={formIsSubmited} >{allCountries[el].name}</QuizItem>
        })
        return items
    } 

    
    const resultsHandler = () => {
        let nbQuestions = (quizState.allQuestionsAsked.capitals.length + quizState.allQuestionsAsked.flags.length)
        setResults({nbResponses: quizState.nbGoodResponse, nbQuestions:nbQuestions})
    }
    
    const tryAgainHandler = () => {
        setResults('')
        dispatchQuizAction({type:'NEWGAME'})
        setFormIsSubmited(false)
        setOk(true)
        setSelected('')
    }

    return (
        <div className="quiz">
            {error && <h2 className="question pb-4">{error}</h2>}
            {(isLoading || quizState.countries.length === 0) && <h2 className="question pb-4">Loading...</h2>}
            {!error && !isLoading && allCountries.length !== 0 && results ==='' && <>
            <h2 className="question pb-4">
                {quizState.questionType === 1 && <div className="pb-3"><img className="flag" src={allCountries[quizState.resultsId.goodResponse].flag} alt='flag'/></div>}
                <div>{quizState.questionType === 0 ? allCountries[quizState.resultsId.goodResponse].capital+' is the capital of...' : 'Which country does this flag belong to?'}</div>
            </h2>

            <form id="form" onSubmit={submitHandler}>
                {quizItems()}
            </form>
                {formIsSubmited && ok && <div><button className="nextButton" onClick={newQuestionHandler}>NEXT</button></div>}
                {formIsSubmited && !ok && <div><button className="nextButton" onClick={resultsHandler}>Results</button></div>}
            </>}
            {results !=='' && <Results nbResponses={results.nbResponses} nbQuestions={results.nbQuestions} tryAgain={tryAgainHandler}/>}

        </div>
    )
}

export default Quiz