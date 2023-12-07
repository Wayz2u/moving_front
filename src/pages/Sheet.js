import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Paper, TextField, Button, Fab } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SearchIcon from '@mui/icons-material/Search';


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Sheet() {
  const query = useQuery();
  const sheetNumber = query.get('sheetnumber');
  const [answers, setAnswers] = useState({});
  const [userInputs, setUserInputs] = useState({});
  const [grading, setGrading] = useState(false);
  const navigate = useNavigate();

  const fetchAnswers = async () => {
    try {
      const response = await fetch(`https://capston-moving.s3.ap-northeast-2.amazonaws.com/${sheetNumber}-answer.json`);
      const data = await response.json();
      localStorage.setItem(`${sheetNumber}-answers`, JSON.stringify(data));
      setAnswers(data[0]);
      initializeUserInputs(data[0]);
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
  };

  const initializeUserInputs = (answersObj) => {
    const initialInputs = {};
    for (const question in answersObj) {
      initialInputs[question] = '';
    }
    setUserInputs(initialInputs);
  };

  const handleInputChange = (question, value) => {
    setUserInputs(prev => {
      const newInputs = { ...prev, [question]: value };
      localStorage.setItem(`${sheetNumber}-inputs`, JSON.stringify(newInputs)); // Save to local storage
      return newInputs;
    });
  };

  const handleGrade = () => {
    setGrading(true);
    localStorage.setItem(`grading-${sheetNumber}`, JSON.stringify(true));
    // Additional grading logic...
  };

  const redirectToSlide = (questionNumber) => {
    navigate(`/slide?questionnumber=${sheetNumber}-${questionNumber}`);
  };

  useEffect(() => {
    const savedInputs = localStorage.getItem(`${sheetNumber}-inputs`);
    const storedAnswers = localStorage.getItem(`${sheetNumber}-answers`);
    if (savedInputs) {
      setUserInputs(JSON.parse(savedInputs));
      const data = JSON.parse(storedAnswers);
      setAnswers(data[0]);
      handleGrade();
    } else {
      fetchAnswers();
    }
  }, [sheetNumber]);

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: 'black', width: '100%' }}>
        <Toolbar>
          <Typography variant="h6">
            {`채점하기 (${sheetNumber})`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 2 }}>
        <Paper style={{ padding: '1em', marginTop: '1em' }}>
          {Object.keys(userInputs).map((question, index) => (
            <div key={index} style={{ marginBottom: '1em' }}>
              <TextField
                fullWidth
                label={`${index + 1}번 문제`}
                variant="outlined"
                value={userInputs[question]}
                onChange={(e) => handleInputChange(question, e.target.value)}
                error={grading && userInputs[question] !== answers[question]}
                helperText={grading && userInputs[question] !== answers[question] ? `정답: ${answers[question]}` : ''}
              />
              {grading && userInputs[question] !== answers[question] && (
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={() => redirectToSlide(index)}
                  sx={{ ml: 2, bgcolor: 'black', color: 'white' }}
                >
                  Solution
                </Button>
              )}
            </div>
          ))}
        </Paper>
      </Container>
      <Fab
        color="default"
        aria-label="grade"
        onClick={handleGrade}
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        <CheckCircleOutlineIcon />
      </Fab>
    </>
  );
}

export default Sheet;
