import React, { forwardRef, useEffect } from 'react';

const VideoPlayer = forwardRef(({ videoUrl, onEnd }, ref) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('ended', onEnd);
      return () => {
        ref.current.removeEventListener('ended', onEnd);
      };
    }
  }, [onEnd, ref]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <video ref={ref} width="320" height="240">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
});

export default VideoPlayer;
