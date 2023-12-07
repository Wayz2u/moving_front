import React, { useState } from 'react';
import { Typography, Modal, Box, CircularProgress, Button } from '@mui/material';

const getYoutubeVideoId = (url) => {
  if (!url) return null;
  const regex = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  const match = url.match(regex);
  return (match && match[2].length === 11) ? match[2] : null;
};

const SimpleModal = ({ open, onClose, content }) => {
  console.log(content)
  const videoId = content && content.image ? getYoutubeVideoId(content.image) : null;

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
        width: { xs: '80%', sm: '60%', md: '40%', lg: '30%' },
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        overflow: 'auto',
        maxHeight: '80vh',
      }}>
        <Typography id="simple-modal-title" variant="h6" component="h2">
          {content.title}
        </Typography>
        {videoId && (
          <iframe
            width="100%"
            height="315"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={content.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
      </Box>
    </Modal>
  );
};


const Instruction = ({ id, buttonText, onPlayButtonClick, highlights, isActive }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({});

  // Responsive button style
  const buttonStyle = {
    my: 1,
    justifyContent: 'flex-start',
    color: 'text.primary',
    borderColor: 'black',
    pl: 2,
    padding: '10px 20px',
    width: { // Responsive width
      xs: '100%', // full width on extra-small devices
      sm: '100%', // fixed width on small devices and up
      md: '100%', // fixed width on medium devices and up
      lg: '100%', // fixed width on large devices and up
    },
  };

  const handleHighlightClick = (highlight) => {
    setModalContent(highlight.modalContent);
    setModalOpen(true);
  };

  const renderTextWithHighlights = (text) => {
    return text.split(/(\s+)/).map((segment, index) => {
      const highlight = highlights.find(h => segment.includes(h.text));
      if (highlight) {
        return (
          <span key={index} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => handleHighlightClick(highlight)}>
            {highlight.text}
          </span>
        );
      }
      return segment;
    });
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
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
    </>
  );
};

export default Instruction;