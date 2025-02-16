import React from 'react';
import "../index.css";
import apple from '../assets/images/apple.jpg';

const Header = ({ elapsedTime, moves }) => {
    // Formatting time into minutes and seconds
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="game-header">
            <h1><img src={apple}/> Concentration <img src={apple}/></h1>
            <div className="stats">
                <div className="timer"><h3>Time: {formatTime(elapsedTime)}</h3></div>
                <div className="moves"><h3>Moves: {moves}</h3></div>
            </div>
        </div>
    );
};

export default Header;
