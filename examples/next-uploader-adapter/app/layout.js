import Layout from './_lib/Layout.js';
import { ThemeProvider } from './_lib/ThemeProvider.js';

import './global.css';

export default function RootLayout(props) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Layout />
          {props.children}
        </ThemeProvider>
      </body>
    </html>
  );
}
