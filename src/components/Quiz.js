import { useEffect, useReducer, useState } from "react"

function random(min, max){
    return Math.floor(Math.random() * (max-min +1)) +min
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
    resultsId: init()
}

const quizReducer = (state, action) =>{
    let updatedQuiz;
    if(action.type === 'INIT'){
        let updatedCountries = action.countries
        updatedQuiz = {
            countries: updatedCountries,
            questionType: state.questionType,
            allQuestionsAsked: state.allQuestionsAsked,
            resultsId: state.resultsId
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

   
    return (
        <div className="quiz">
            {error && <h2 className="question pb-4">{error}</h2>}
            {(isLoading || quizState.countries.length === 0) && <h2 className="question pb-4">Loading...</h2>}
            {!error && !isLoading && allCountries.length !== 0 && <>
            <h2 className="question pb-4">
                {quizState.questionType === 1 && <div className="pb-3"><img className="flag" src={allCountries[quizState.resultsId.goodResponse].flag} alt='flag'/></div>}
                <div>{quizState.questionType === 0 ? allCountries[quizState.resultsId.goodResponse].capital+' is the capital of...' : 'Which country does this flag belong to?'}</div>
            </h2>
            {/* <p>{allCountries[quizState.resultsId.goodResponse].name}</p> */}
            {/* <p>bonne réponse : {quizState.resultsId.goodResponse}</p> */}
            {/* {console.log('bonne rep : '+quizState.resultsId.goodResponse)} */}
            <form>
                <label className="responseButton mb-2"><input type='radio' value='1'/>{allCountries[quizState.resultsId.propositions[0]].name}</label>
                <label className="responseButton mb-2"><input type='radio' value='2'/>{allCountries[quizState.resultsId.propositions[1]].name}</label>
                <label className="responseButton mb-2"><input type='radio' value='3'/>{allCountries[quizState.resultsId.propositions[2]].name}</label>
                <label className="responseButton mb-2"><input type='radio' value='4'/>{allCountries[quizState.resultsId.propositions[3]].name}</label>
            </form>
            </>}
        </div>
    )
}

export default Quiz