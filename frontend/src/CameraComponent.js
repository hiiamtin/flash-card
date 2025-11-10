import React, { useRef, useState } from 'react';
import { Camera } from 'react-camera-pro';

const CameraComponent = ({ onCapture, onError }) => {
  const camera = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' for front, 'environment' for back
  const [numberOfCameras, setNumberOfCameras] = useState(0);

  // Log when number of cameras changes
  React.useEffect(() => {
    console.log('Number of cameras detected:', numberOfCameras);
  }, [numberOfCameras]);

  const startCamera = () => {
    setIsCameraActive(true);
    setCapturedImage(null);
    console.log('Camera started, waiting for camera detection...');
  };

  const stopCamera = () => {
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (camera.current) {
      try {
        const photo = camera.current.takePhoto();
        setCapturedImage(photo);
        setIsCameraActive(false);
      } catch (error) {
        console.error('Error capturing photo:', error);
        if (onError) {
          onError('Failed to capture photo');
        }
      }
    }
  };

  const handleUsePhoto = () => {
    if (capturedImage && onCapture) {
      // Convert base64 to blob
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          onCapture(file);
          setCapturedImage(null);
        })
        .catch(error => {
          console.error('Error processing captured image:', error);
          if (onError) {
            onError('Failed to process captured image');
          }
        });
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsCameraActive(true);
  };

  const switchCamera = () => {
    if (camera.current) {
      try {
        const result = camera.current.switchCamera();
        console.log('Switch camera result:', result);
        // Toggle facing mode state
        setFacingMode(prevMode => {
          const newMode = prevMode === 'user' ? 'environment' : 'user';
          console.log('Switching from', prevMode, 'to', newMode);
          return newMode;
        });
      } catch (error) {
        console.error('Error switching camera:', error);
        alert('Cannot switch camera. Your device may only have one camera or camera switching is not supported.');
      }
    }
  };

  return (
    <div>
      {!isCameraActive && !capturedImage && (
        <div className="camera-controls">
          <button className="btn btn-primary" onClick={startCamera}>
            📷 Start Camera
          </button>
        </div>
      )}

      {isCameraActive && (
        <div>
          <div className="camera-container">
            <Camera
              ref={camera}
              aspectRatio={4 / 3}
              facingMode={facingMode}
              numberOfCamerasCallback={setNumberOfCameras}
              errorMessages={{
                noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
                permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                switchCamera: 'It is not possible to switch camera to different one because there is only one video device accessible.',
                canvas: 'Canvas is not supported.',
              }}
            />
          </div>
          <div className="camera-controls">
            <button className="btn btn-secondary" onClick={stopCamera}>
              Cancel
            </button>
            <button className="btn btn-secondary" onClick={switchCamera}>
              🔄 Switch Camera
            </button>
            <button className="btn btn-primary" onClick={capturePhoto}>
              📸 Capture
            </button>
          </div>
        </div>
      )}

      {capturedImage && (
        <div>
          <div className="camera-container">
            <img src={capturedImage} alt="Captured" style={{ width: '100%', borderRadius: '8px' }} />
          </div>
          <div className="camera-controls">
            <button className="btn btn-secondary" onClick={handleRetake}>
              🔄 Retake
            </button>
            <button className="btn btn-primary" onClick={handleUsePhoto}>
              ✓ Use Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraComponent;

