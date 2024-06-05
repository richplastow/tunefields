import './global.css';
import { StyledComponentsRegistry } from './registry';

export const metadata = {
  title: 'Tunefields | view',
  description: 'Explore some music!',
  icons: { icon: './favicon.ico' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
