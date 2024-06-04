import styled from 'styled-components';

/* eslint-disable-next-line */
export interface UiFooterProps {}

const StyledUiFooter = styled.div`
  color: pink;
`;

export function UiFooter(props: UiFooterProps) {
  return (
    <StyledUiFooter>
      <h1>Welcome to UiFooter!</h1>
    </StyledUiFooter>
  );
}

export default UiFooter;
