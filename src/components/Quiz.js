const Quiz = props =>{
       
    return (
        <div className="quiz">
            <h2 className="question pb-4">My questions are gonna be there</h2>
            <form>
                <label className="responseButton mb-2"><input type='radio' value='1'/>Response 1</label>
                <label className="responseButton mb-2"><input type='radio' value='2'/>Response 2</label>
                <label className="responseButton mb-2"><input type='radio' value='3'/>Response 3</label>
                <label className="responseButton mb-2"><input type='radio' value='4'/>Response 4</label>
            </form>
        </div>
    )
}

export default Quiz