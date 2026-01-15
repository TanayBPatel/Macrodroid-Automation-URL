import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import YearProgress from '../components/YearProgress';

const PhotoPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const capturedRef = useRef(false);

  useEffect(() => {
    const captureAndDownload = async () => {
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

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          
          // Create a temporary link and trigger download
          const link = document.createElement('a');
          link.href = url;
          link.download = `year-progress-${new Date().getFullYear()}.jpeg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          // Clean up
          URL.revokeObjectURL(url);
          
          // Navigate back to home after a short delay
          setTimeout(() => navigate('/'), 1000);
        }, 'image/jpeg');
      } catch (error) {
        console.error('Error capturing image:', error);
        navigate('/');
      }
    };

    captureAndDownload();
  }, [navigate]);

  return (
    <div ref={containerRef} style={{ width: '1080px', height: '2340px' }}>
      <YearProgress />
    </div>
  );
};

export default PhotoPage;
