import Header from './components/Header.jsx'
import MoodSelector from './components/MoodSelector.jsx'
import PlaylistDisplay from './components/PlaylistDisplay.jsx'
import {useState} from 'react'
import { useAuth } from 'react-oidc-context';
import axios from 'axios'


function App() {

  const [mood, setMood] = useState('');
  const [playlist, setPlaylist] = useState([]);

  const handleResetMood = () => {
    setMood('');
    setPlaylist([]);
  }
  
  // Code from Cognito to handle authorization on front-end
  
  const auth = useAuth();

  const signoutRedireOut = () => {
    const clientId = "36i9ardejc7rkick8fahlicjkr"; 
    const logoutUri = "<logout uri>";
    const cognitoDomain = "us-east-1svbhd9qum.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const handleMoodSelection = async (selectedMood) => {

    try {
      if (auth.isAuthenticated) {
        const user = auth.user.email;
        const email = "example@gmail.com"
        console.log(email);
        const timeStamp = new Date().toISOString();
           
        const data = {
          userId: email,
          timestamp: timeStamp,
          mood: selectedMood,
        };
      
        await axios.post('https://dqy1oo5875.execute-api.us-east-1.amazonaws.com/dev/recommendation', data);

        // Sets mood to get React to load playlist page
        setMood(selectedMood);

      } else { 
        console.error("User is not authenticated."); 
      }

    } catch (error) {
      console.error("Error communicating with API", error)
    }
  }

  // If waiting for authorization (Cognito)
  
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  // Only load app if authorization succeeds

  if (auth.isAuthenticated) {
  return (
    <div className="main-div">
        <Header/>

        {!mood && <MoodSelector onMoodSelect={handleMoodSelection}/>}
        
        { mood && (
          <>
            <PlaylistDisplay mood={mood}/> <br/>

            <div className="container-lg" >
              <button className="btn-outline-primary" onClick={handleResetMood}>Select Mood</button>
            </div> 
          </>
        )}
        <button className="btn-outline-primary" onClick={() => auth.removeUser()}>Sign Out</button>
      </div>
  ) 
}

 return (
    <div className="login">
      <p>Please login below to access application:</p><br></br>
      <button className="btn-outline-primary" onClick={() => auth.signinRedirect()}>Sign in</button>
    </div>
 );
}

export default App
