import { useState } from 'react';
import morseCode from './morseCode';

const MorseTranslator = () => {
    const [inputText, setInputText] = useState('');
    const [morseText, setMorseText] = useState('');

    const translateToMorse = (text) => {
        return text.toUpperCase().split('').map(char => morseCode[char] || '').join(' ');
    };

    const handleTranslate = () => {
        const translated = translateToMorse(inputText);
        setMorseText(translated);
    };

    return (
        <div>
            <div>
                <h1>Text - Morse Code Translator</h1>
                <div>
                    <textarea
                        rows="4"
                        cols="50"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type your text here..."
                    />
                </div>
                <div >
                    <button onClick={handleTranslate}>Translate to Morse</button>
                </div>
                <h2>Morse Code:</h2>
                <div>{morseText}</div>
                <div>
                     <p>Made with <span style={{ color: 'red' }}>❤</span>,  by <a href="https://github.com/y1hy11" target="_blank">y1hy11</a></p>
                </div>
            </div>
        </div>
    );
};

export default MorseTranslator;