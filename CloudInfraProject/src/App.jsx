import Header from './components/Header.jsx'
import MoodSelector from './components/MoodSelector.jsx'
import PlaylistDisplay from './components/PlaylistDisplay.jsx'
import {useState} from 'react'


function App() {

  const [mood, setMood] = useState('');

  return (
    <div className="main-div">
        <Header/>
        <MoodSelector onMoodSelect={setMood}/>
        <p>{mood}</p>
        {mood && <PlaylistDisplay mood={mood}/>}
      </div>
  )
}

export default App
