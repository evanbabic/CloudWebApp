import {useState, useEffect} from 'react'
import axios from 'axios'

function PlaylistDisplay( {mood} ) {

    const [playlist, setPlaylist] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState("");
    const [token, setToken] = useState();

    useEffect(() => {
        if (mood){

            setLoading(true);
            setError(null);

            axios.get('http://localhost:5000/api/spotify/recommendation', { params: {mood: mood} })
            .then((response) => { 
                setMessage(response.data.message);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load playlist. Please try again.");
                setLoading(false);
            })
        }
    }, [mood]);

    if (loading) return <div className="playlist-display"><p>Loading...</p></div>
    if (error) return <div className="playlist-display"><p>{error}</p></div>

    return(
        <>
            <div className="playlist-display">
                <h3>Playlist for Mood {mood}:</h3>
                {
                    <p>{message}</p>
                /* <ul>
                
                    {playlist.map((song, index) => (
                        <li key={index}>
                            {song.title} by {song.artist}
                        </li>
                    ))}
                </ul> */}
            </div>
        </>
    )
}

export default PlaylistDisplay