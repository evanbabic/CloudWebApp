import {useState, useEffect} from 'react'
import axios from 'axios'

function PlaylistDisplay( {mood} ) {

    const [playlist, setPlaylist] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect( () => {
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

    if (loading) return <div className="container-lg"><div className="spinner"></div></div>
    if (error) return <div className="container-lg"><p>{error}</p> {mood = ''}</div>

    return(
        <>
            <div className="playlist-display">
                {playlist.map((track, index) => (
                    <div className="display-element" key={index}>
                        <div>
                            <p className="p-title"><b>{track.name}</b></p>
                            <p>{track.artists[0].name}</p> 
                            <img src={track.album.images[0].url}></img>  
                        </div>             
                    </div> 
                ))}
            </div>
        </>
    )
}

export default PlaylistDisplay