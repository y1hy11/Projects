import { useState } from 'react';
import FileUpload from './components/FileUpload';
import FileConverter from './components/FileConverter';
import Footer from './components/Footer';
import './styles/App.css';

const App = () => {
    const [file, setFile] = useState(null);

    return (
        <div className="container">
            <h1 className='title'>P2G </h1>
            <h1 className='subtitle'> Free Online PDF-PNG-JPG-DOC converter</h1>
            <FileUpload onFileChange={setFile} />
            {file && <FileConverter file={file} />}
            <Footer />
        </div>
    );
};

export default App;