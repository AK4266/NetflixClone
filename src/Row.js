import React, { useState, useEffect } from 'react'
import axios from './axios';
import "./Row.css";
import YouTube from 'react-youtube'
import movieTrailer from "movie-trailer";


const baseURL = "http://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");

    //snippet of code which runs on a specific condition
    useEffect(() => {
        //if [], run once when row loads and dont run it again
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            console.log(request.data.results);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    const handleClick = (movie) => {
        if(trailerUrl) {
            setTrailerUrl('');
        } else {
            movieTrailer(movie?.name || "")
            .then(url => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'));
            }).catch((error) => console.log(error));
        }
    }

    console.log(movies);
    return (
        <div className="row">
            <h2>{title}</h2>

            <div className="row_posters">
                {/**row_posters */}

                {movies.map(movie => (
                    <img 
                    key={movie.id}
                    onClick={() => handleClick(movie)}
                    className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                    src={`${baseURL}${
                        isLargeRow ? movie.poster_path : movie.backdrop_path
                    }`} 
                    alt={movie.name}
                    />
                    
                ))}

            </div>

            {/**container -> posters */}
            {trailerUrl && <YouTube videoId={trailerUrl}opts={opts}/>}
        </div>
        
    );
}

export default Row
