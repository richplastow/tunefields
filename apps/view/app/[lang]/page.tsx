'use client';

import styled from 'styled-components';

/* eslint-disable-next-line */
export interface LangProps {}

const StyledLang = styled.div`
  color: pink;
`;

export default function Lang(props: LangProps) {
  return (
    <StyledLang>
      <h1>Welcome to Lang!</h1>
    </StyledLang>
  );
}
