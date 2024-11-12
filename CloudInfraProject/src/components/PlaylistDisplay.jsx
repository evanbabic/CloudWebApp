import {useState, useEffect} from 'react'
import axios from 'axios'

function PlaylistDisplay( {mood} ) {

    const [playlist, setPlaylist] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (mood){

            setLoading(true);
            setError(null);

            axios.get('http://localhost:5000/api/playlist?mood=${mood}')
            .then((response) => {
                setPlaylist(response.data.playlist);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load playlist. Please try again.");
                setLoading(false);
            })
        }
    }, [mood]);

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    return(
        <>
            <div className="playlist-display">
                <h3>Playlist for Mood {mood}:</h3>
                {/* <ul>
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