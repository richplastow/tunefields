'use client'; // leads to an error if missing

import Link from 'next/link';
import styled from 'styled-components';

/* eslint-disable-next-line */
export interface AboutProps {}

const StyledAbout = styled.div`
  color: pink;
`;

export default function About(props: AboutProps) {
  return (
    <StyledAbout>
      <h1>Welcome to About!</h1>
      <Link href="/">‘view’ home</Link>
    </StyledAbout>
  );
}
