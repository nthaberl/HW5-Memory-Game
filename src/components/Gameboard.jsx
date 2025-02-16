import React, { useState, useEffect } from "react";
import "../index.css";
import Card from "./Card";
import Header from "./Header"
import WinMessage from "./WinMessage";
import { sounds, yoshis } from '../assets/assets.js';

const images = [
    yoshis.blackYoshi, yoshis.blueYoshi, yoshis.redYoshi, yoshis.greenYoshi,
    yoshis.ltBlueYoshi, yoshis.melon, yoshis.pinkYoshi, yoshis.yellowYoshi
];

const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const Gameboard = () => {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [moves, setMoves] = useState(0);
    const [lockBoard, setLockBoard] = useState(false);
    const [timerRunning, setTimerRunning] = useState(false); //flag for if timer should be running or not
    const [elapsedTime, setElapsedTime] = useState(0);  //keeps track of time
    const [gameWon, setGameWon] = useState(false); //check for the win game state to render win message

    //checks for a save state in storage first, otherwise sets up a new game board on start
    useEffect(() => {
        const savedState = sessionStorage.getItem("gameState");
        if (savedState) {
            const { flippedCards, matchedPairs, moves, elapsedTime, timerRunning, cards, gameWon } = JSON.parse(savedState);
            setFlippedCards(flippedCards);
            setMatchedPairs(matchedPairs);
            setMoves(moves);
            setElapsedTime(elapsedTime);
            setTimerRunning(timerRunning);
            setCards(cards);
            setGameWon(gameWon);
        } else {
            const duplicatedImages = [...images, ...images];
            const shuffledImages = shuffleArray(duplicatedImages).map((image, index) => ({
                id: index,
                image,
                isMatched: false
            }));
            setCards(shuffledImages);
        }
    }, []);


    // Save game state to sessionStorage whenever state variables change
    useEffect(() => {
        const gameState = {
            flippedCards,
            matchedPairs,
            moves,
            elapsedTime,
            timerRunning,
            cards,
            gameWon
        };
        sessionStorage.setItem("gameState", JSON.stringify(gameState));
    }, [flippedCards, matchedPairs, moves, elapsedTime, timerRunning, cards, gameWon]);

    useEffect(() => {
        let timerInterval;

        if (timerRunning) {
            timerInterval = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
        }

        return () => clearInterval(timerInterval); // Cleanup interval on unmount or when timer stops
    }, [timerRunning]);

    const handleCardClick = (id) => {

        console.log(lockBoard)
        if (flippedCards.length === 2 || lockBoard) return; // Prevent flipping more than 2 cards

        if (!flippedCards.includes(id)) {
            const newFlippedCards = [...flippedCards, id];
            setFlippedCards(newFlippedCards);
            const flipSound = new Audio(sounds.cardFlip);
            flipSound.play();

            if (newFlippedCards.length === 2) {
                setLockBoard(true); // Lock board to prevent additional flips
                setTimeout(() => checkForMatch(newFlippedCards), 1000);
            }
        }

        if (!timerRunning) {
            setTimerRunning(true); // Start timer when first card is flipped
        }
    };

    const checkForMatch = (flipped) => {
        setMoves((prev) => prev + 1);

        const [first, second] = flipped.map((id) => cards.find((card) => card.id === id));

        if (first.image === second.image) {
            setMatchedPairs((prev) => [...prev, first.id, second.id]);
            setFlippedCards([]);
            setLockBoard(false);
            setTimerRunning(false);
            const matchSound = new Audio(sounds.match);
            matchSound.play();

            if (matchedPairs.length + 2 === cards.length) {
                matchSound.pause();
                const victorySound = new Audio(sounds.victory);
                victorySound.play();
                setGameWon(true);
                sessionStorage.setItem("gameState", JSON.stringify({
                    ...JSON.parse(sessionStorage.getItem("gameState")),
                    gameWon: true
                }));

            }
        } else {
            setTimeout(() => {
                setFlippedCards([]);
                setLockBoard(false);
            }, 500);
        }
    };

    const restartGame = () => {
        sessionStorage.removeItem("gameState");
        const duplicatedImages = [...images, ...images];
        const shuffledImages = shuffleArray(duplicatedImages).map((image, index) => ({
            id: index,
            image,
            isMatched: false
        }));

        setCards(shuffledImages);
        setFlippedCards([]);
        setMatchedPairs([]);
        setTimerRunning(false);
        setElapsedTime(0);
        setMoves(0);
        setGameWon(false); // Hide win message
    };


    return (
        <div className="game-board">
            <Header elapsedTime={elapsedTime} moves={moves} />
            <div className="game-cards">
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        card={card}
                        isFlipped={flippedCards.includes(card.id) || matchedPairs.includes(card.id)}
                        onClick={() => handleCardClick(card.id)}
                    />
                ))}
            </div>
            {gameWon ? <WinMessage moves={moves} restartGame={restartGame} /> : ""}
        </div>
    );
};

export default Gameboard;

