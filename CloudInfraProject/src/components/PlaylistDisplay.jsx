import {useState, useEffect} from 'react'
import axios from 'axios'

function PlaylistDisplay( {mood} ) {

    const [playlist, setPlaylist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (mood){

            setLoading(true);
            setError(null);

            axios.get('http://localhost:5000/api/spotify/recommendation', { params: {mood: mood} })
            .then((response) => { 
                setPlaylist(response.data.recommendations);
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
                <h3>Playlist for Mood: {mood}:</h3> <br></br>
                <ul>
                    {playlist.map((track, index) => (
                        <li key={index}>
                            {track.name} by {track.artists[0].name}                        
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default PlaylistDisplay