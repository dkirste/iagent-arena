import styled from 'styled-components';

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--footer-height);
  background-color: white;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2rem;
  z-index: 100;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
`;

const Copyright = styled.p`
  color: var(--text-color);
  font-size: 0.9rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialLink = styled.a`
  color: var(--text-color);
  font-size: 1.2rem;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-color);
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          © {currentYear} iAgent Arena. All rights reserved.
        </Copyright>
        <SocialLinks>
          <SocialLink href="https://twitter.com/injectiveprotocol" target="_blank" rel="noopener noreferrer">
            Twitter
          </SocialLink>
          <SocialLink href="https://discord.com/invite/injective" target="_blank" rel="noopener noreferrer">
            Discord
          </SocialLink>
          <SocialLink href="https://github.com/dkirste/iagent-arena" target="_blank" rel="noopener noreferrer">
            GitHub
          </SocialLink>
        </SocialLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
