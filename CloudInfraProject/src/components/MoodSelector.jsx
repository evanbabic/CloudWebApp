
function MoodSelector( {onMoodSelect} ){
    const moods = ['Happy', 'Sad', 'Energetic', 'Relaxed', 'Angry', 'Motivated', 'Romantic']

    return(
        <> <br></br>
        <div className="container">
            <div className="d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <h2>Select Your Mood</h2>
                    <div className="d-flex align-items-center mt-3">
                        { moods.map((mood) => (
                            <button key={mood} className="btn btn-outline-primary" style={{margin: 10}} onClick={() => onMoodSelect(mood)}> {mood} </button>
                        )) }
                    </div>
                </div>
            </div>
        </div>

    </>)
}

export default MoodSelector