import React, { useRef, useState, useEffect } from 'react';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-webgl';

import './App.css';

const version = 2;
const alpha = 0.5;

const App: React.FC = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isModelLoading, setIsModelLoading] = useState<boolean>(false);
    const [loadedModel, setLoadedModel] = useState<mobilenet.MobileNet | null>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [predictions, setPreictions] = useState<{ className: string; probability: number; }[] | null>(null);

    const loadModel = async () => {
        setIsModelLoading(true);
        try {
            const model = await mobilenet.load({ version, alpha });
            setLoadedModel(model);
        } catch (e) {
            console.log(e);
            throw new Error(e);
        }
        setIsModelLoading(false);
    };

    useEffect(() => { loadModel(); }, []);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log(e.target.files[0].type);
            setPreictions(null);
            const reader: FileReader = new FileReader();
            reader.onload = async () => setImageUrl(reader.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const classify = async () => {
        const results = await loadedModel!.classify(imageRef.current!);
        console.log(results);
        setPreictions(results);
    };

    if (isModelLoading) return <h2 style={{ textAlign: 'center' }}>Loading model</h2>;

    return (
        <div className="App">
            <h1>Tensorflow.js image prediction!</h1>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />

            { imageUrl != null
                ? (
                    <div style={{ marginTop: 50 }}>
                        <img src={imageUrl} crossOrigin="anonymous" style={{ width: 300, height: 300 }} alt="test" ref={imageRef} />
                        <br />

                        <button type="button" style={{ margin: 5 }} onClick={classify}>Classify</button>

                        <div
                            style={{
                                margin: 'auto',
                                width: '50%',
                                border: '1px solid green',
                                padding: '5px',
                                textAlign: 'start',
                            }}
                        >
                            {
                                predictions != null
                                    ? predictions.map((p) => (
                                        <ul>
                                            <li>
                                                Picture is a
                                                {' '}
                                                {p.className}
                                                {' '}
                                                by
                                                {' '}
                                                {(p.probability * 100).toFixed(3)}
                                                {' '}
                                                %
                                            </li>
                                        </ul>

                                    ))
                                    : null
                            }
                        </div>
                    </div>
                )
                : null}
        </div>
    );
};

export default App;
