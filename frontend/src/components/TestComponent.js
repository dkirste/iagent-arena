import React from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  padding: 2rem;
  background-color: #1e293b;
  border-radius: 1rem;
  margin: 2rem;
  text-align: center;
`;

const TestHeading = styled.h1`
  color: #f8fafc;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const TestParagraph = styled.p`
  color: #94a3b8;
  font-size: 1.2rem;
`;

function TestComponent() {
  return (
    <TestContainer>
      <TestHeading>Test Component</TestHeading>
      <TestParagraph>
        If you can see this, the React application is rendering correctly!
      </TestParagraph>
    </TestContainer>
  );
}

export default TestComponent;
