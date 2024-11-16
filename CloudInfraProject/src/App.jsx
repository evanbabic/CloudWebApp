import Header from './components/Header.jsx'
import MoodSelector from './components/MoodSelector.jsx'
import PlaylistDisplay from './components/PlaylistDisplay.jsx'
import {useState} from 'react'


function App() {

  const [mood, setMood] = useState('');
  const [playlist, setPlaylist] = useState([]);

  const handleResetMood = () => {
    setMood('');
    setPlaylist([]);
  }

  return (
    <div className="main-div">
        <Header/>

        {!mood && <MoodSelector onMoodSelect={setMood}/>}
        
        { mood && (
          <>
            <PlaylistDisplay mood={mood}/> <br/>

            <div className="container-lg" >
              <button className="btn-outline-primary" onClick={handleResetMood}>Select Mood</button>
            </div> 
          </>
        )}
      </div>
  ) 
}

export default App
