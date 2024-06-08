import { NextIntlClientProvider } from 'next-intl';
import React from 'react';
import { render } from '@testing-library/react';

import Page from '../app/[locale]/page';
import messagesEn from '../messages/en.json';

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <NextIntlClientProvider
        locale="en"
        messages={messagesEn}
      >
        <Page />
      </NextIntlClientProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
