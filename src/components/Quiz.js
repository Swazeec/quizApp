import { useEffect, useReducer, useState } from "react"
import QuizItem from "./QuizItem"

function random(min, max){
    return Math.floor(Math.random() * (max-min +1)) +min
}

const checkAnswer = (value, rightOne)=>{
    if((value) === rightOne){
        console.log('bravo Elliot ! '+ rightOne)
        return true
    } else {
        console.log('you lose... it was '+ rightOne)
        return false
    }
}

function init(){
    let array=[]
    for(let i = 0 ; array.length < 4; i++ ){
        let id = random(0,249)
        !array.includes(id) ? array.push(id) : array.push()
    }
    return {propositions:array, goodResponse: array[random(0,3)]}
}

const defaultQuiz = {
    countries: [],
    questionType: 0,
    allQuestionsAsked: {'capitals':[], 'flags':[]},
    resultsId: init(),
    response:''
}

const quizReducer = (state, action) =>{
    let updatedQuiz;
    if(action.type === 'INIT'){
        let updatedCountries = action.countries
        updatedQuiz = {
            countries: updatedCountries,
            questionType: state.questionType,
            allQuestionsAsked: state.allQuestionsAsked,
            resultsId: state.resultsId,
            response:''
        }
    }

    if(action.type === 'RESPONSE'){
        let updatedResponse = action.response
        updatedQuiz = {
            countries: state.countries,
            questionType: state.questionType,
            allQuestionsAsked: state.allQuestionsAsked,
            resultsId: state.resultsId,
            response:updatedResponse
        }
        console.log(updatedResponse)
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
    // gestion de l'option sélectionnée
    const [selected, setSelected] = useState('')
    // gestion de détection de soumission de form
    const [formIsSubmited, setFormIsSubmited] = useState(false)

   
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
        // console.log(e)
        dispatchQuizAction({type: 'RESPONSE', response:e})
        setSelected(e)
    }
    useEffect(()=>{
        if(quizState.response.length !== 0){
            checkAnswer(quizState.response,quizState.resultsId.goodResponse)
            setSelected(quizState.response)
            document.getElementById('form').click()
            setFormIsSubmited(true)
        }
    }, [quizState.response, quizState.resultsId.goodResponse])
    
    const submitHandler = e => {
        e.preventDefault()
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
   
    return (
        <div className="quiz">
            {error && <h2 className="question pb-4">{error}</h2>}
            {(isLoading || quizState.countries.length === 0) && <h2 className="question pb-4">Loading...</h2>}
            {!error && !isLoading && allCountries.length !== 0 && <>
            <h2 className="question pb-4">
                {quizState.questionType === 1 && <div className="pb-3"><img className="flag" src={allCountries[quizState.resultsId.goodResponse].flag} alt='flag'/></div>}
                <div>{quizState.questionType === 0 ? allCountries[quizState.resultsId.goodResponse].capital+' is the capital of...' : 'Which country does this flag belong to?'}</div>
            </h2>

            <form id="form" onSubmit={submitHandler}>
                {quizItems()}
                {/* <button id="button" type="submit" onSubmit={submitHandler}>submit</button> */}
                
            </form>
            </>}
        </div>
    )
}

export default Quiz