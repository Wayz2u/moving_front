import React, { useState } from 'react';
import { Typography, Modal, Box, CircularProgress, Button } from '@mui/material';

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
        width: { xs: '80%', sm: '60%', md: '40%', lg: '30%' }, // Responsive width
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        overflow: 'auto', // Add scroll if content is too large
        maxHeight: '80vh', // Maximum height
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

  const buttonStyle = {
    my: 1,
    width: '100%', // Take the full width of the container
    height: '50px',
    justifyContent: 'flex-start',
    color: isActive ? 'primary.main' : 'text.primary', // Text color changes when active
    borderColor: isActive ? 'primary.main' : 'grey.300', // Outline color changes when active
    borderWidth: isActive ? 2 : 1, // Outline thickness changes when active
    pl: 2,
    '&:hover': {
      borderColor: isActive ? 'primary.dark' : 'grey.400', // Hover color changes when active
      backgroundColor: isActive ? '' : 'background.paper', // Optional: Change background color on hover when not active
    },
  };


  return (
    <>
      <Button
        variant="outlined"
        onClick={onPlayButtonClick}
        sx={buttonStyle}
        startIcon={isActive ? <CircularProgress size={24} color="primary" /> : null}
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
    </>
  );
};

export default Instruction;
