import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import YearProgress from '../components/YearProgress';

const PhotoPage = () => {
  const containerRef = useRef(null);
  const capturedRef = useRef(false);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const captureImage = async () => {
      if (capturedRef.current) return;
      capturedRef.current = true;

      // Wait for the component to fully render
      await new Promise(resolve => setTimeout(resolve, 500));

      const element = document.getElementById('year-progress');
      if (!element) {
        console.error('Element not found');
        return;
      }

      try {
        const canvas = await html2canvas(element, {
          width: 1080,
          height: 2340,
          scale: 2,
          backgroundColor: '#1a1a1a',
          logging: false,
          windowWidth: 1080,
          windowHeight: 2340
        });

        // Convert canvas to PNG data URL
        const dataUrl = canvas.toDataURL('image/png');
        setImageUrl(dataUrl);
        
        // Update document title for filename
        document.title = 'daily_wallpaper.png';
      } catch (error) {
        console.error('Error capturing image:', error);
      }
    };

    captureImage();
  }, []);

  useEffect(() => {
    // Set meta tag for content-type
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Type';
    meta.content = 'image/png';
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  if (!imageUrl) {
    return (
      <div ref={containerRef} style={{ width: '1080px', height: '2340px', visibility: 'hidden', position: 'absolute' }}>
        <YearProgress />
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt="daily_wallpaper.png"
      style={{ 
        display: 'block',
        width: '100%',
        height: 'auto',
        maxWidth: '1080px',
        margin: '0 auto'
      }}
    />
  );
};

export default PhotoPage;
