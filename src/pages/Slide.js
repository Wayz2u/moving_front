import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import VideoPlayer from '../components/animaition/Video';
import Instruction from '../components/instruction/Instruction';
import { Container, Paper, Typography, ThemeProvider, Accordion, AccordionSummary, AccordionDetails, Chip, Stack } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSwipeable } from 'react-swipeable';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Slide = () => {
  const query = useQuery();
  const slideNumber = query.get('questionnumber');
  const [instructions, setInstructions] = useState([]);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [activeInstructionId, setActiveInstructionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [problemImg, setProblemImg] = useState('');
  const [problemTitle, setProblemText] = useState('');
  const [answer, setAnswer] = useState('');
  const [paginatedInstructions, setPaginatedInstructions] = useState([]);

  const instructionsPerPage = 3;
  const videoRef = useRef(null);
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentPage(current => Math.min(current + 1, paginatedInstructions.length - 1)),
    onSwipedRight: () => setCurrentPage(current => Math.max(current - 1, 0)),
  });



  useEffect(() => {
    console.log(slideNumber);
    const fetchData = async () => {
      try {
        const response = await fetch(`https://capston-moving.s3.ap-northeast-2.amazonaws.com/${slideNumber}.json`);
        const data = await response.json();
        console.log(data);
        setInstructions(data.instructions);
        setCurrentVideoUrl(data.videoUrl);
        setProblemImg(data.problemImage);
        setProblemText(data.problemTitle);
        setAnswer(data.problemAnswer);
        const paginated = [];
        for (let i = 0; i < data.instructions.length; i += instructionsPerPage) {
          paginated.push(data.instructions.slice(i, i + instructionsPerPage));
        }
        setPaginatedInstructions(paginated);
      } catch (error) {
        console.error('Error fetching slide data:', error);
      }
    };

    fetchData();
  }, [slideNumber]);

  // 재생관리
  const playVideo = (instructionIndex) => {
    const instruction = instructions[instructionIndex];
    const nextInstruction = instructions[instructionIndex + 1];
    const endTime = nextInstruction ? nextInstruction.startTime : videoRef.current.duration;

    if (videoRef.current) {
      videoRef.current.currentTime = instruction.startTime;
      videoRef.current.muted = true;
      videoRef.current.play().catch(error => {
        console.error('Error attempting to play video:', error);
      });

      // Set a timeout to pause the video at the end of the current instruction
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
          setActiveInstructionId(null); // Reset the active instruction ID
        }
      }, (endTime - instruction.startTime) * 1000); // Convert to milliseconds
    }
  };

  // 인스트럭션 관리
  useEffect(() => {
    const checkTime = () => {
      if (videoRef.current && !videoRef.current.paused) {
        const currentTime = videoRef.current.currentTime;
        let activeId = null;

        for (let i = 0; i < instructions.length; i++) {
          const instruction = instructions[i];
          const nextInstruction = instructions[i + 1];
          const endTime = nextInstruction ? nextInstruction.startTime : videoRef.current.duration;

          if (currentTime >= instruction.startTime && currentTime < endTime) {
            activeId = instruction.id;
            break;
          }
        }

        setActiveInstructionId(activeId);
      } else {
        setActiveInstructionId(null);
      }
    };

    const interval = setInterval(checkTime, 500);
    return () => clearInterval(interval);
  }, [instructions, videoRef]);

  // 비디오 인스트럭션 연계
  const onVideoEnd = () => {
    setActiveInstructionId(null);
  };

  const instructionsToRender = paginatedInstructions[currentPage] || [];

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Accordion TransitionProps={{ unmountOnExit: true }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography>{problemTitle}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <img src={problemImg} alt="Problem Image" style={{ width: '100%', height: 'auto' }} />
          </AccordionDetails>
        </Accordion>
      </ThemeProvider>
      <div {...swipeHandlers}>
        <Container maxWidth="md" sx={{ mt: 2 }}>
          <Paper elevation={3} sx={{ position: 'relative', padding: '1em', marginBottom: '1em', height: '50vh' }}>
            <VideoPlayer ref={videoRef} videoUrl={currentVideoUrl} onEnd={onVideoEnd} />
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 8, right: 8 }}>
              <Chip label={answer} color="primary" variant='outlined' />
            </Stack>
          </Paper>
          {instructionsToRender.map((instruction, index) => (
            <Instruction
              key={instruction.id}
              id={instruction.id}
              buttonText={instruction.text}
              onPlayButtonClick={() => playVideo(index)}
              highlights={instruction.highlights}
              isActive={activeInstructionId === instruction.id}
            />
          ))}
        </Container>
      </div>
    </>
  );
};

export default Slide;
