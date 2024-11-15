import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const FileUpload = ({ onFileChange }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        onFileChange(file);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragActive(false);
        
        const file = event.dataTransfer.files[0];
        setSelectedFile(file);
        onFileChange(file);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragActive(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragActive(false);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div 
            className={`dropzone ${isDragActive ? 'active' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
        >
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            {selectedFile ? (
                <p>Selected File: {selectedFile.name}</p>
            ) : (
                <p>Drag and drop a file here, or click to select a file</p>
            )}
        </div>
    );
};

FileUpload.propTypes = {
    onFileChange: PropTypes.func.isRequired,
};

export default FileUpload;