import React from 'react';
import '../index.css';

const WinMessage = ({moves, restartGame}) => {
    return (
        <div className="message">
            <h3>Congrats, you won in {moves} moves!</h3>
            <button onClick={restartGame} className="newGame-button">Play Again</button>
        </div>
    )
}

export default WinMessage