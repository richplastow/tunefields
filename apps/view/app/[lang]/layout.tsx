import '../global.css';
import { StyledComponentsRegistry } from '../registry';

export const metadata = {
  title: 'Tunefields | view',
  description: 'Explore some music!',
  icons: { icon: './favicon.ico' },
};

const langs = [
  { lang: 'en' },
  { lang: 'en-GB' },
  { lang: 'en-US' },
  { lang: 'es' },
  { lang: 'pt' },
];
const supportsLang = (l: string) => langs.some(({ lang }) => lang === l);

export async function generateStaticParams() {
  return langs;
}

export default function RootLayout({
  children, params,
}: {
  children: React.ReactNode;
  params: {
    lang: string;
  };
}) {
  const { lang } = params;
  return (
    <html lang="{supportsLang(lang) ? lang : 'en'}">
      <body>
        <StyledComponentsRegistry>
          lang: {supportsLang(lang) ? lang : `en (${lang} not supported)`}
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
