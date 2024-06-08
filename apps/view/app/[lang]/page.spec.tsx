import { render } from '@testing-library/react';

import Lang from './page';

describe('Lang', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Lang />);
    expect(baseElement).toBeTruthy();
  });
});
