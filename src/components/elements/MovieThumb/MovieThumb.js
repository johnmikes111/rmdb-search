import React from 'react';
import {Link} from 'react-router-dom';
import './MovieThumb.css';

//functional component because not need for state 
const MovieThumb = (props) => {
    return (
        <div className="rmdb-moviethumb">
            {props.clickable ? 
                <Link to={{pathname:`/${props.movieId}`,movieName:`${props.movieName}`}}>
                    <img src={props.image} alt="moviethumb"/>
                </Link>
                :
                <img src={props.image} alt="moviethumb"/>
            }
        </div>
    )
}

export default MovieThumb;