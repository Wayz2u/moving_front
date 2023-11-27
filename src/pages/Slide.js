import React, { useState, useEffect, useRef } from 'react';
import VideoPlayer from '../components/animaition/Video';
import Instruction from '../components/instruction/Instruction';
import { Container, Paper } from '@mui/material';

const Slide = () => {
  const [instructions, setInstructions] = useState([]);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('instruction1.mp4');
  const [activeInstructionId, setActiveInstructionId] = useState(null);
  const videoRef = useRef(null);

  // Assuming fetchedSlides is coming from an API or a static file
  const fetchedSlides = {
    "videoUrl": "instruction1.mp4",
    "videoLength": 8,
    "instructions": [
      {
        "id": "1",
        "text": "BC와 DE가 평행이므로 B와 D가 같습니다.",
        "startTime": 0,
        "highlights": []
      },
      {
        "id": "2",
        "text": "BC와 DE가 평행이므로 C와 E가 같습니다.",
        "startTime": 3,
        "highlights": []
      },
      {
        "id": "3",
        "text": "BCF와 DEF가  AA닮음 입니다.",
        "startTime": 6,
        "highlights": [
          {
            "text": "AA닮음",
            "modalContent": {
              "title": "닮음 : AA",
              "image": "AA.png"
            }
          }
        ]
      }
    ]
  };

  useEffect(() => {
    setInstructions(fetchedSlides.instructions);
    setCurrentVideoUrl(fetchedSlides.videoUrl);
    playVideo(fetchedSlides.instructions[0]?.startTime || 0);
  }, []);

  const playVideo = (startTime) => {
    if (typeof startTime === 'number' && !isNaN(startTime)) {
      if (videoRef.current) {
        videoRef.current.currentTime = startTime;
        videoRef.current.muted = true; // Mute the video
        videoRef.current.play().catch(error => {
          console.error('Error attempting to play video:', error);
        });
      }
    } else {
      console.error('Invalid start time:', startTime);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        const currentTime = videoRef.current.currentTime;
        let foundActive = false;

        for (let i = 0; i < instructions.length; i++) {
          const instruction = instructions[i];
          const nextInstruction = instructions[i + 1];
          const endTime = nextInstruction ? nextInstruction.startTime : videoRef.current.duration;

          if (currentTime >= instruction.startTime && currentTime < endTime) {
            setActiveInstructionId(instruction.id);
            foundActive = true;
            break;
          }
        }

        if (!foundActive) {
          setActiveInstructionId(null);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [instructions]);


  const onVideoEnd = () => {
    setActiveInstructionId(null);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '1em', marginBottom: '1em' }}>
        <VideoPlayer ref={videoRef} videoUrl={currentVideoUrl} onEnd={onVideoEnd} />
      </Paper>
      {instructions.map((instruction) => (
        <Instruction
          key={instruction.id}
          id={instruction.id}
          buttonText={instruction.text}
          onPlayButtonClick={() => playVideo(instruction.startTime)}
          highlights={instruction.highlights}
          isActive={activeInstructionId === instruction.id}
        />
      ))}
    </Container>
  );
};

export default Slide;
