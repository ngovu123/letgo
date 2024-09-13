import { styled } from '@mui/system';
import React from 'react';


const FooterContainer = styled('footer')({
  marginTop: 'auto',
  background: '#333333',
  color: '#ffffff',
  padding: '1rem'
});

const FooterText = styled('span')({
  marginRight: '0.5rem',
});

const FooterLink = styled('a')({
  color: '#ffffff',
  textDecoration: 'none',
  marginRight: '0.5rem',
  marginLeft: '0.5rem'
});

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>SparkHub AI</FooterText>|
      <FooterLink href="https://www.facebook.com/profile.php?id=61553047801114">Fanfage</FooterLink>|
    </FooterContainer>
  );
};

export default Footer;
