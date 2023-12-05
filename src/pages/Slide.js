import React, { useState, useEffect, useRef } from 'react';
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

const Slide = () => {
  const [instructions, setInstructions] = useState([]);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('instruction1.mp4');
  const [activeInstructionId, setActiveInstructionId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [problemImg, setProblemImg] = useState('logo192.png');
  const [problemTitle, setProblemText] = useState('삼각형의 닮음 6-4-1 3번')
  const [answer, setAnswer] = useState('정답 : 2번')
  const instructionsPerPage = 3;
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState(null);
  const videoRef = useRef(null);


  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentPage(current => Math.min(current + 1, paginatedInstructions.length - 1)),
    onSwipedRight: () => setCurrentPage(current => Math.max(current - 1, 0)),
  });

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  // Assuming fetchedSlides is coming from an API or a static file
  const fetchedSlides = {
    "problemTitle": "",
    "problemImage": "",
    "problemAnswer": "",
    "videoUrl": "instruction1.mp4",// 동영상 url
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
        "startTime": 2,
        "highlights": []
      },
      {
        "id": "3",
        "text": "BCF와 DEF가  AA닮음 입니다.",
        "startTime": 4,
        "highlights": [
          {
            "text": "AA닮음",
            "modalContent": {
              "title": "닮음 : AA",
              "image": "AA.png" // IMG URL
            }
          }
        ]
      },
      {
        "id": "4",
        "text": "4",
        "startTime": 6,
        "highlights": []
      },
      {
        "id": "5",
        "text": "5",
        "startTime": 7,
        "highlights": []
      },
    ]
  };

  const paginatedInstructions = [];
  for (let i = 0; i < fetchedSlides.instructions.length; i += instructionsPerPage) {
    paginatedInstructions.push(fetchedSlides.instructions.slice(i, i + instructionsPerPage));
  }

  useEffect(() => {
    setInstructions(fetchedSlides.instructions);
    setCurrentVideoUrl(fetchedSlides.videoUrl);
  }, []);

  useEffect(() => {
    // Function to fetch data from the server
    const fetchData = async () => {
      try {
        const response = await fetch('https://capston-moving.s3.ap-northeast-2.amazonaws.com/test.json');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
        console.log(jsonData) // Update state with the fetched data
      } catch (error) {
        console.error("Fetching data failed:", error);
      }
    };

    fetchData();
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
    <>
      <ThemeProvider theme={darkTheme}>
        <Accordion TransitionProps={{ unmountOnExit: true }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{problemTitle}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <img src={problemImg} alt="Your Image" style={{ width: '100%', height: 'auto' }} />
          </AccordionDetails>
        </Accordion>
      </ThemeProvider>
      <div {...swipeHandlers}>
        <Container maxWidth="md" sx={{ mt: 2 }}>
          <Paper elevation={3} sx={{ position: 'relative', padding: '1em', marginBottom: '1em', height: '50vh'}}>
            <VideoPlayer ref={videoRef} videoUrl={currentVideoUrl} onEnd={onVideoEnd} />
            <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 8, right: 8 }}>
              <Chip label={answer} color="primary" variant='outlined'/>
            </Stack>
          </Paper>
          {paginatedInstructions[currentPage].map((instruction) => (
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
      </div>
    </>
  );
};

export default Slide;
