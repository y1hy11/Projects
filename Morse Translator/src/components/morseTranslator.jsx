import { useState, useRef } from 'react';
import morseCode from './morseCode';

const MorseTranslator = () => {
    const [inputText, setInputText] = useState('');
    const [morseText, setMorseText] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    const audioContextRef = useRef(null);
    const oscillatorRef = useRef(null);
    const playMorseCode = (morseText) => {
        if (isPlaying) return;
        setIsPlaying(true);
        const unit = 0.2; // Duration of a dot
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const context = audioContextRef.current;
        let currentTime = context.currentTime;

        const playTone = (duration) => {
            oscillatorRef.current = context.createOscillator();
            oscillatorRef.current.frequency.setValueAtTime(600, currentTime);
            oscillatorRef.current.connect(context.destination);
            oscillatorRef.current.start(currentTime);
            oscillatorRef.current.stop(currentTime + duration);
            currentTime += duration + unit;
        };

        for (let char of morseText) {
            if (char === '.') {
                playTone(unit);
            } else if (char === '-') {
                playTone(unit * 3);
            } else if (char === ' ') {
                currentTime += unit * 3;
            }
        }

        setTimeout(() => {
            setIsPlaying(false);
        }, (currentTime - context.currentTime) * 1000);
    };

    const pauseMorseCode = () => {
        if (audioContextRef.current) {
            audioContextRef.current.close();
            setIsPlaying(false);
        }
    };

    const translateToMorse = (text) => {
        return text.toUpperCase().split('').map(char => morseCode[char] || '').join(' ');
    };

    const handleTranslate = () => {
        const translated = translateToMorse(inputText);
        setMorseText(translated);
    };

    return (
        <div>
            <div className="morse-translator">
                <h1>Text - Morse Code Translator</h1>
                <h2>Text:</h2>
                <div>
                    <textarea
                        rows="4"
                        cols="50"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your text here..."
                    />
                </div>
                <div className="button-group">
                    <button onClick={handleTranslate}>Translate to Morse</button>
                    <button
                    onClick={() => {
                        if (isPlaying) {
                            pauseMorseCode();
                        } else {
                            playMorseCode(morseText);
                        }
                    }}
                    disabled={!morseText}
                >
                    {isPlaying ? 'Pause Morse Code' : 'Play Morse Code'}
                </button>
                </div>
                <h2>Morse Code:</h2>
                <div className="morse-output">{morseText}</div>
                <div className="footer">
                     <p>Made with <span style={{ color: 'red' }}>❤</span>,  by <a href="https://github.com/y1hy11" target="_blank" rel="noopener noreferrer">y1hy11</a></p>
                </div>
            </div>
        </div>
    );
};

export default MorseTranslator;