import React, { forwardRef, useEffect } from 'react';

const VideoPlayer = forwardRef(({ videoUrl, onEnd }, ref) => {
  useEffect(() => {
    console.log("Video URL:", videoUrl);
    if (ref.current) {
      ref.current.addEventListener('ended', onEnd);
      return () => {
        ref.current.removeEventListener('ended', onEnd);
      };
    }
  }, [onEnd, ref]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center', // Vertically center the video
      height: '100%', // Take full height of the parent container
      overflow: 'hidden'
    }}>
      <video
        ref={ref}
        key={videoUrl} // Add this line
        style={{ width: '100%', height: 'auto', maxWidth: '360px' }}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
});

export default VideoPlayer;
