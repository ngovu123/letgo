import { CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import PptxGenJS from 'pptxgenjs';
import React, { useEffect, useState } from 'react';

const { REACT_APP_API_URL } = process.env;

const TranscriptionContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  background: '#f7f7f7',
});

const Transcript = styled('div')({
  maxWidth: '80%',
  padding: '0.5rem',
  background: '#ffffff',
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
});

const LoadingIndicator = styled(CircularProgress)({
  margin: '0.5rem',
});

const Transcription = ({ audioFile }) => {
  const [transcription, setTranscription] = useState(null);
  const [loading, setLoading] = useState(false);

  const generatePPT = (slides) => {
    const pptx = new PptxGenJS();

    slides.forEach((slideData) => {
      const slide = pptx.addSlide();
      slide.addText(slideData.Header, {
        x: 1,
        y: 1,
        w: 8,
        h: 1,
        fontSize: 24,
        bold: true,
      });
      slideData.BulletPoints.forEach((bulletPoint, index) => {
        slide.addText(bulletPoint, {
          x: 1,
          y: 1.5 + index * 0.5,
          w: 8,
          h: 0.5,
          fontSize: 14,
          bullet: true,
        });
      });
    });

    pptx.writeFile('Generated_Presentation.pptx');
  };

  useEffect(() => {
    let isMounted = true;

    if (!audioFile) return;

    const getTranscription = async () => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('audio', audioFile);

        const response = await axios.post(
          `${REACT_APP_API_URL}/whisper`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (isMounted && !transcription) {
          setTranscription(response.data.transcription);
          generatePPT(response.data.slides);
        }
      } catch (error) {
        console.error('Error getting transcription:', error);
      } finally {
        setLoading(false);
      }
    };

    getTranscription();

    return () => {
      isMounted = false;
    };
  }, [audioFile, transcription]);

  return (
    <TranscriptionContainer>
      {loading ? (
        <>
          <Typography variant="body1">Processing your audio file...</Typography>
          <p></p>
          <LoadingIndicator size={60} />
        </>
      ) : (
        <Transcript>
          {transcription ? (
            <>
              <Typography variant="h4" gutterBottom>
                Transcription:
              </Typography>
              <Typography variant="body1">{transcription}</Typography>
            </>
          ) : (
            <Typography variant="body1">Processing your audio file...</Typography>
          )}
        </Transcript>
      )}
    </TranscriptionContainer>
  );
};

export default Transcription;
