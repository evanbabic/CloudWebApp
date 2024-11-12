import React, {useState} from 'react';

function MoodSelector(){
    const moods = ['Happy', 'Sad', 'Energetic', 'Relaxed', 'Angry', 'Sigma']

    const [mood, setMood] = useState();

    const handleMoodChange = (mood) => {
        setMood(mood);
    }

    return(
        <> <br></br>
            <div className="d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <h2>Select Your Mood</h2>
                    <div className="d-flex align-items-center mt-3">
                        {moods.map((mood) => (
                            <button key={mood} className="btn btn-primary" style={{margin: 10}} onClick={() => handleMoodChange(mood)}> {mood} </button>
                        ))}
                    </div>

                <p>Your Mood: {mood} </p>
                </div>
            </div>
    </>)
    
}

export default MoodSelector