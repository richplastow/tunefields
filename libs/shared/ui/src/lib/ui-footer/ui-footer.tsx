import styled from 'styled-components';

/* eslint-disable-next-line */
export interface UiFooterProps {}

const StyledUiFooter = styled.div`
  color: pink;
`;

export function UiFooter(props: UiFooterProps) {
  return (
    <StyledUiFooter>
      <footer>Welcome to UiFooter!</footer>
    </StyledUiFooter>
  );
}

export default UiFooter;
