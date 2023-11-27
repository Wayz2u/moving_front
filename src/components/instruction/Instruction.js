import React, { useState } from 'react';
import { Typography, Modal, Box, CircularProgress, Button} from '@mui/material';

// Simple modal component for demonstration
const SimpleModal = ({ open, onClose, content }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography id="simple-modal-title" variant="h6" component="h2">
          {content.title}
        </Typography>
        <img src={content.image} alt={content.title} style={{ width: '100%', marginTop: '1em' }} />
      </Box>
    </Modal>
  );
};


const Instruction = ({ id, buttonText, onPlayButtonClick, highlights, isActive }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  const handleHighlightClick = (highlight) => {
    setModalContent(highlight.modalContent);
    setModalOpen(true);
  };

  const buttonStyle = {
    my: 1, // Vertical margins, adjust as needed
    width: '400px', // Fixed width, adjust as needed
    height: '50px', // Fixed height, adjust as needed
    justifyContent: 'flex-start', // Aligns text to the left
    color: 'text.primary',
    borderColor: 'black', // Button border color
    pl: 2, // Padding left to push text to the right
  };

  // Function to split the text and insert highlights
  const renderTextWithHighlights = (text) => {
    const splitText = text.split(/(\s+)/).map((segment, index) => {
      const highlight = highlights.find(h => segment.includes(h.text));
      if (highlight) {
        return (
          <span
            key={index}
            style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => handleHighlightClick(highlight)}
          >
            {highlight.text}
          </span>
        );
      }
      return segment;
    });
    return splitText;
  };


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Button
        key={id}
        variant="outlined"
        disabled={isActive}
        onClick={onPlayButtonClick}
        startIcon={isActive ? <CircularProgress size={24} /> : null}
        sx={buttonStyle}
      >
        {highlights && highlights.length > 0 ? renderTextWithHighlights(buttonText) : buttonText}
      </Button>
      {modalOpen && (
        <SimpleModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          content={modalContent}
        />
      )}
    </Box>
  );
};

export default Instruction;
