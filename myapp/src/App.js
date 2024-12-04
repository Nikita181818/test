


import React, { useState, useEffect } from "react";
import "./App.css";

const ImageGrid = ({ name, count, images }) => {
  const [imageStates, setImageStates] = useState(
    images.map((img) => ({
      ...img,
      retryCount: 0,
      isLoading: false,
    }))
  );

  const handleImageError = (index) => {
    setImageStates((prev) => {
      const updatedImages = [...prev];
      const currentImage = updatedImages[index];

      if (currentImage.retryCount < 3) {
        currentImage.retryCount += 1;
        currentImage.isLoading = true;

        setTimeout(() => {
          setImageStates((prevRetry) => {
            const retryImages = [...prevRetry];
            retryImages[index].isLoading = false;
            retryImages[index].error = retryImages[index].retryCount >= 3;
            return retryImages;
          });
        }, 5000);
      } else {
        currentImage.error = true;
        currentImage.isLoading = false;
      }

      return updatedImages;
    });
  };

  useEffect(() => {
    setImageStates((prev) =>
      prev.map((img) => ({ ...img, retryCount: 0, isLoading: false }))
    );
  }, [images]);

  return (
    <div className="image-grid-container">
      <h2>{name}</h2>
      <p>Count: {count}</p>
      <div className="image-grid">
        {imageStates.map((image, index) => (
          <div
            key={index}
            className="image-wrapper"
            title={`Status: ${
              image.error
                ? "Error"
                : image.isLoading
                ? "Retrying..."
                : image.ready
                ? "Ready"
                : "Pending"
            }, Retry Count: ${image.retryCount}`}
          >
            {image.isLoading ? (
              <div className="spinner"></div>
            ) : image.ready && !image.error ? (
              <img
                src={image.url}
                alt={`Image ${index + 1}`}
                onError={() => handleImageError(index)}
              />
            ) : image.error ? (
              <div className="error-icon">⚠</div>
            ) : (
              <div className="placeholder">Placeholder</div>
            )}
          </div>
        ))}
        {Array.from({ length: 4 - imageStates.length }, (_, i) => (
          <div
            key={`placeholder-${i}`}
            className="image-wrapper"
            title="Status: Empty Slot"
          >
            <div className="placeholder">Placeholder</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const imageData = [
    {
      url: "https://th.bing.com/th/id/R.6149d8b9b80d8db1801a87bbd152865e?rik=j5FzJKcg7QGrHA...",
      ready: true,
      error: false,
    },
    { url: "https://invalid-url.com/image.jpg", ready: false, error: true },
    {
      url: "https://th.bing.com/th/id/R.6149d8b9b80d8db1801a87bbd152865e?rik=j5FzJKcg7QGrHA...",
      ready: true,
      error: false,
    },
    {
      url: "https://th.bing.com/th/id/R.6149d8b9b80d8db1801a87bbd152865e?rik=j5FzJKcg7QGrHA...",
      ready: true,
      error: false,
    },
  ];

  return (
    <div className="App">
      <ImageGrid name="Image Grid" count={4} images={imageData} />
    </div>
  );
};

export default App;
