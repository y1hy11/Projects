import { useState } from 'react';
import PropTypes from 'prop-types';
import * as pdf from 'pdf-lib';
import mammoth from 'mammoth';
import { saveAs } from 'file-saver';

const FileConverter = ({ file }) => {
    const [outputFormat, setOutputFormat] = useState('pdf');
    const [progress, setProgress] = useState(0);
    const [isConverting, setIsConverting] = useState(false);
    const getFilenameWithoutExtension = (filename) => {
        return filename.substring(0, filename.lastIndexOf('.')) || filename;
    };

    const handleConversion = async () => {
        try {
            setIsConverting(true);
            setProgress(0);

            let convertedFile;
            switch(outputFormat) {
                case 'pdf':
                    convertedFile = await convertToPDF(file, 'pdf');
                    break;
                case 'doc':
                    convertedFile = await convertToDocx(file, 'doc');
                    break;
                case 'docx':
                    convertedFile = await convertToDocx(file, 'docx');
                    break;
                case 'jpg':
                    convertedFile = await convertToImage(file, 'jpg');
                    break;
                case 'png':
                    convertedFile = await convertToImage(file, 'png');
                    break;

                default:
                    throw new Error('Unsupported format');
            }

            setProgress(100);
            const newFilename = `${getFilenameWithoutExtension(file.name)}.${outputFormat}`;
            saveAs(convertedFile, newFilename);
            setIsConverting(false);
            setProgress(0);

        } catch (error) {
            console.error('Conversion error:', error);
            alert(`Conversion failed: ${error.message}`);
            setIsConverting(false);
        }
    };


    const convertToPDF = async (inputFile) => {
        const pdfDoc = await pdf.PDFDocument.create();
        const page = pdfDoc.addPage();

        let image;
        if (inputFile.type === 'image/jpeg') {
            image = await pdfDoc.embedJpg(await inputFile.arrayBuffer());
        } else if (inputFile.type === 'image/png') {
            image = await pdfDoc.embedPng(await inputFile.arrayBuffer());
        } else {
            throw new Error('Unsupported image format for PDF conversion');
        }

        page.drawImage(image, {
            x: 50,
            y: 50,
            width: page.getWidth() - 100,
            height: page.getHeight() - 100,
        });

        return new Blob([await pdfDoc.save()], { type: 'application/pdf' });
    };

    const convertToDocx = async (inputFile) => {
        try {
            const { Document, Paragraph, ImageRun, Packer } = await import('docx');
            const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
    
            if (imageTypes.includes(inputFile.type)) {
                return await createDocxFromImage(inputFile, { Document, Paragraph, ImageRun, Packer });
            } else if (inputFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                return inputFile;
            } else {
                const { value: html } = await mammoth.convertToHtml({ buffer: await inputFile.arrayBuffer() });
                const { value: docxBuffer } = await mammoth.convertToDocx({ html });
                return new Blob([docxBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            }
        } catch (error) {
            console.error('DOCX conversion error:', error);
            throw new Error(`Unable to convert to DOCX: ${error.message}`);
        }
    };
    
    const createDocxFromImage = async (inputFile, docx) => {
        const imageBuffer = await inputFile.arrayBuffer();
    
        const doc = new docx.Document({
            sections: [{
                children: [
                    new docx.Paragraph({
                        children: [
                            new docx.ImageRun({
                                data: new Uint8Array(imageBuffer),
                                transformation: {
                                    width: 500,
                                    height: 500,
                                }
                            })
                        ]
                    })
                ]
            }]
        });
    
        return new Promise((resolve, reject) => {
            docx.Packer.toBlob(doc)
                .then(blob => {
                    resolve(blob);
                })
                .catch(error => {
                    reject(error);
                });
        });
    };
    
    const convertToImage = async (inputFile, format) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = URL.createObjectURL(inputFile);
        
        await new Promise(resolve => {
            img.onload = resolve;
        });

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        return new Promise(resolve => {
            canvas.toBlob(blob => {
                resolve(blob);
            }, `image/${format}`);
        });
    };

    return (
        <div className="file-converter">
            <select onChange={(e) => setOutputFormat(e.target.value)}>
                <option value="pdf">PDF</option>
                <option value="docx">DOCX</option>
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
            </select>
            <button 
                onClick={handleConversion} 
                disabled={isConverting}
            >
                {isConverting ? `Converting (${progress}%)` : 'Convert'}
            </button>
            {isConverting && (
                <div>
                    <progress value={progress} max="100" />
                </div>
            )}
        </div>
    );
};

FileConverter.propTypes = {
    file: PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    }).isRequired,
};

export default FileConverter;