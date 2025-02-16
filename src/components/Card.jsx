import React from 'react';
import egg from '../assets/images/egg.jpg'
import "../index.css";

const Card = ({ card, isFlipped, onClick }) => {
    return (
        <div className="card" onClick={onClick}>
            <img 
                src={isFlipped ? card.image : egg} 
                className={isFlipped ? "card" : "card-back"} />
        </div>
    );
};

export default Card;
