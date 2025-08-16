import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html, Bounds, useBounds } from '@react-three/drei';
import { useDropzone } from 'react-dropzone';
import './ProductViewer.css';

const Model = ({ url, rotation }) => {
  const { scene } = useGLTF(url);
  const bounds = useBounds();
  useEffect(() => {
    bounds.refresh(scene).clip().fit();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);
  return <primitive object={scene} rotation={rotation} />;
};

const ProductViewer = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [background, setBackground] = useState('/backgrounds/b1.jpg');
  const [customModelUrl, setCustomModelUrl] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setCustomModelUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf'],
    },
    multiple: false,
  });

  if (!product) {
    return <div className="loading">Loading...</div>;
  }

  const modelAdjustments = {
    'a_couch.glb': { rotation: [0, Math.PI / 2, 0] },
  };

  const currentModelPath = customModelUrl || product.modelPath;
  const modelFileName = currentModelPath.split('/').pop();
  const adjustment = modelAdjustments[modelFileName];

  const backgrounds = [
    { name: 'Background 1', path: '/backgrounds/b1.jpg' },
    { name: 'Background 2', path: '/backgrounds/b2.jpg' },
  ];

  return (
    <div className="product-viewer-wrapper" style={{ backgroundImage: `url(${background})` }}>
      <div className="product-viewer">
        <div className="viewer-container">
          <Canvas>
            <ambientLight intensity={1.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            <Suspense fallback={<Html center>Loading model...</Html>}>
              <Bounds fit clip margin={1.2}>
                <Model url={currentModelPath} rotation={adjustment ? adjustment.rotation : [0, 0, 0]} />
              </Bounds>
              <OrbitControls makeDefault />
            </Suspense>
          </Canvas>
        </div>
        <div className="details-container">
          <h1>{product.name}</h1>
          <p><strong>Category:</strong> {product.category}</p>
          <p className="price">${product.price}</p>

          <div className="background-selector">
            <h3>Change Background</h3>
            <div className="background-options">
              {backgrounds.map(bg => (
                <button
                  key={bg.name}
                  className={background === bg.path ? 'active' : ''}
                  onClick={() => setBackground(bg.path)}
                >
                  {bg.name}
                </button>
              ))}
            </div>
          </div>

          <div className="model-upload-section">
            <h3>Upload Custom Model</h3>
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
              <input {...getInputProps()} />
              {
                isDragActive ?
                  <p>Drop the files here ...</p> :
                  <p>Drag 'n' drop a .glb or .gltf model here, or click to select files</p>
              }
            </div>
            {customModelUrl && (
              <button onClick={() => setCustomModelUrl(null)} className="reset-model-button">
                Reset to Original Model
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewer;
