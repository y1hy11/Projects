const morseCode = {
    // English
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
    'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
    'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
    'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
    'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
    'Z': '--..', ' ': ' ',
    // Arabic Letters
    'ا': '.-', 'ب': '-...', 'ت': '-', 'ث': '-.-.', 
    'ج': '.---', 'ح': '....', 'خ': '---', 'د': '-..', 
    'ذ': '--..', 'ر': '.-.', 'ز': '---.', 'س': '...', 
    'ش': '----', 'ص': '-..-', 'ض': '...-', 'ط': '..-', 
    'ظ': '.--.', 'ع': '.-.-', 'غ': '--.', 'ف': '..-.',
    'ق': '--.-', 'ك': '-.-', 'ل': '.-..', 'م': '--',
    'ن': '-.', 'ه': '..-.', 'و': '.--', 'ي': '..',
    // Numbers (English & Arabic)
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    '٠': '-----', '١': '.----', '٢': '..---', '٣': '...--', '٤': '....-',
    '٥': '.....', '٦': '-....', '٧': '--...', '٨': '---..', '٩': '----.'
};

export default morseCode;