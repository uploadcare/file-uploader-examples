/*
  Generates `public/index.html` — the landing page that lists every example.
  Styled to match the per-example sidebar (logo, theme tokens, card grid).
*/

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const FRAMEWORK_ICONS = {
  'js-uploader': javascriptIcon(),
  'react-uploader': reactIcon(),
  'react-uploader-adapter': reactIcon(),
  'vue-uploader': vueIcon(),
  'svelte-uploader': svelteIcon(),
  'angular-uploader': angularIcon(),
  'next-uploader': nextIcon(),
  'next-uploader-adapter': nextIcon(),
};

const FRAMEWORK_BLURBS = {
  'js-uploader': 'Vanilla JS — drop the web components into any HTML page.',
  'react-uploader':
    'React component tree wrapping the file-uploader Web Components directly.',
  'react-uploader-adapter':
    'React adapter (@uploadcare/react-uploader) for an idiomatic React API.',
  'vue-uploader': 'Vue 3 + vue-router with the file-uploader Web Components.',
  'svelte-uploader': 'SvelteKit + custom Unsplash plugin written in Svelte.',
  'angular-uploader': 'Angular standalone components binding to the Web Components.',
  'next-uploader': 'Next.js App Router with the file-uploader Web Components.',
  'next-uploader-adapter':
    'Next.js App Router with @uploadcare/react-uploader/next adapter.',
};

export function writePublicIndex(publicDir, basePath, examples) {
  const cards = examples
    .map((ex) => renderCard(ex, basePath))
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en" class="theme--light">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Uploadcare File Uploader — Examples</title>
  <meta
    name="description"
    content="Live examples of the Uploadcare File Uploader integrated with JavaScript, React, Vue, Svelte, Angular, and Next.js."
  />
  <link rel="preconnect" href="https://ucarecdn.com" />
  <style>${styles()}</style>
</head>
<body>
  <header class="header">
    <a class="logo" href="https://uploadcare.com" aria-label="Uploadcare homepage">
      ${uploadcareLogo()}
    </a>
    <button class="theme-toggle" type="button" id="theme-toggle" aria-label="Toggle theme">
      ${sunIcon()}
      ${moonIcon()}
    </button>
  </header>

  <main class="main">
    <section class="hero">
      <h1>Uploadcare File Uploader</h1>
      <p class="hero-lede">
        Production-ready demos of <a href="https://uploadcare.com/docs/file-uploader/">the File Uploader</a>
        across eight stacks. Each example shares the same form view, theme
        tokens, and a custom <em>Unsplash</em> source plugin so you can
        compare integration patterns side by side.
      </p>
      <p class="hero-source">
        <a href="https://github.com/uploadcare/file-uploader-examples">Source on GitHub</a>
        ·
        <a href="https://uploadcare.com/docs/integrations/frameworks-file-uploader/">All integrations</a>
      </p>
    </section>

    <section class="grid" aria-label="Examples">
      ${cards}
    </section>
  </main>

  <footer class="footer">
    <span>Uploadcare File Uploader Examples</span>
    <a href="https://github.com/uploadcare/file-uploader-examples">GitHub</a>
  </footer>

  <script>${themeScript()}</script>
</body>
</html>
`;

  writeFileSync(resolve(publicDir, 'index.html'), html);
  console.log(`> Wrote landing page to ${resolve(publicDir, 'index.html')}`);
}

function renderCard(ex, basePath) {
  const href = `${basePath}${ex.name}/`;
  return `<a class="card" href="${href}">
        <div class="card-icon" aria-hidden="true">${FRAMEWORK_ICONS[ex.name]}</div>
        <div class="card-body">
          <h2 class="card-title">${ex.framework}</h2>
          <p class="card-blurb">${FRAMEWORK_BLURBS[ex.name]}</p>
          <span class="card-link">examples/${ex.name} →</span>
        </div>
      </a>`;
}

function styles() {
  return `
    *,
    *::before,
    *::after { box-sizing: border-box; }

    :root,
    html.theme--light {
      color-scheme: light;
      --background-color: #f7f9fa;
      --text-color: #000;
      --ui-text-color: #6b6b78;
      --ui-control-border-color-default: #cbcdd7;
      --ui-control-border-color-focus: #0059c8;
      --ui-control-background-color: #fcfcfe;
      --ui-control-box-shadow-color: rgba(199, 215, 255, 0.5);
      --ui-control-outline-color-focus: #98cbff;
      --ui-control-text-color: #323236;
      --ui-action-button-background: #0059c8;
      --ui-action-button-text-color: #fff;
      --card-bg: #fff;
      --card-shadow: 0 1px 3px rgba(15, 22, 36, 0.04), 0 12px 32px rgba(15, 22, 36, 0.06);
      --card-shadow-hover: 0 2px 4px rgba(15, 22, 36, 0.05), 0 24px 48px rgba(15, 22, 36, 0.1);
    }

    html.theme--dark {
      color-scheme: dark;
      --background-color: #080605;
      --text-color: #fff;
      --ui-text-color: #8a877e;
      --ui-control-border-color-default: #343228;
      --ui-control-border-color-focus: #ffa637;
      --ui-control-background-color: #0d0c08;
      --ui-control-box-shadow-color: rgba(56, 40, 0, 0.5);
      --ui-control-outline-color-focus: #673400;
      --ui-control-text-color: #cdcdc9;
      --ui-action-button-background: #ffa637;
      --ui-action-button-text-color: #000;
      --card-bg: #141210;
      --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.4), 0 12px 32px rgba(0, 0, 0, 0.5);
      --card-shadow-hover: 0 2px 4px rgba(0, 0, 0, 0.5), 0 24px 48px rgba(0, 0, 0, 0.7);
    }

    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
        'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      background: var(--background-color);
      color: var(--text-color);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    a { color: inherit; text-decoration: none; }
    a:hover { opacity: 0.85; }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 32px;
      border-bottom: 1px solid var(--ui-control-border-color-default);
    }

    .logo { display: inline-flex; }

    .theme-toggle {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      padding: 0;
      box-shadow: 0 0 16px 0 var(--ui-control-box-shadow-color);
      background-color: var(--ui-control-background-color);
      border: 1px solid var(--ui-control-border-color-default);
      border-radius: 50%;
      color: var(--ui-control-text-color);
      cursor: pointer;
    }
    .theme-toggle:hover,
    .theme-toggle:focus-visible {
      outline: 2px solid var(--ui-control-outline-color-focus);
    }
    .theme-toggle svg { width: 16px; height: 16px; }
    html.theme--dark .theme-toggle .icon-sun { display: none; }
    html.theme--light .theme-toggle .icon-moon { display: none; }

    .main {
      flex: 1;
      width: 100%;
      max-width: 1080px;
      margin: 0 auto;
      padding: 64px 32px 96px;
    }

    .hero { max-width: 720px; margin: 0 auto 64px; text-align: center; }
    .hero h1 {
      margin: 0 0 16px;
      font-size: clamp(28px, 4vw, 44px);
      font-weight: 600;
      letter-spacing: -0.02em;
    }
    .hero-lede {
      margin: 0 0 16px;
      font-size: 17px;
      line-height: 1.5;
      color: var(--ui-control-text-color);
    }
    .hero-lede a {
      color: var(--ui-action-button-background);
      border-bottom: 1px solid currentColor;
    }
    .hero-source {
      margin: 0;
      font-size: 14px;
      color: var(--ui-text-color);
    }
    .hero-source a { border-bottom: 1px solid color-mix(in srgb, currentColor 30%, transparent); }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .card {
      display: flex;
      gap: 16px;
      padding: 20px;
      background: var(--card-bg);
      border: 1px solid var(--ui-control-border-color-default);
      border-radius: 14px;
      box-shadow: var(--card-shadow);
      transition:
        transform 180ms ease,
        box-shadow 180ms ease,
        border-color 180ms ease;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: var(--card-shadow-hover);
      border-color: var(--ui-control-border-color-focus);
      opacity: 1;
    }

    .card-icon {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ui-control-text-color);
    }
    .card-icon svg { width: 32px; height: 32px; }

    .card-body { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
    .card-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: -0.01em;
    }
    .card-blurb {
      margin: 0;
      font-size: 14px;
      line-height: 1.45;
      color: var(--ui-control-text-color);
    }
    .card-link {
      margin-top: auto;
      font-size: 13px;
      font-family: 'SFMono-Regular', ui-monospace, monospace;
      color: var(--ui-text-color);
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24px 32px;
      border-top: 1px solid var(--ui-control-border-color-default);
      font-size: 13px;
      color: var(--ui-text-color);
    }

    @media (max-width: 600px) {
      .header,
      .main,
      .footer { padding-left: 20px; padding-right: 20px; }
      .main { padding-top: 40px; padding-bottom: 64px; }
    }
  `;
}

function themeScript() {
  return `
    (() => {
      const KEY = 'uploadcareExamplesTheme';
      const root = document.documentElement;
      const stored = localStorage.getItem(KEY);
      const initial = stored === 'dark' || stored === 'light'
        ? stored
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      apply(initial);

      document.getElementById('theme-toggle').addEventListener('click', () => {
        const next = root.classList.contains('theme--dark') ? 'light' : 'dark';
        apply(next);
      });

      function apply(theme) {
        root.classList.remove('theme--light', 'theme--dark');
        root.classList.add('theme--' + theme);
        localStorage.setItem(KEY, theme);
      }
    })();
  `;
}

function uploadcareLogo() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="32" height="32">
      <title>Uploadcare</title>
      <circle cx="9" cy="9" r="9" fill="url(#landing-logo-gradient)"></circle>
      <defs>
        <radialGradient id="landing-logo-gradient" cx="0" cy="0" r="1"
          gradientTransform="rotate(149.216 9.368 7.42) scale(17.5848 20.2492)"
          gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFC700"></stop>
          <stop offset="1" stop-color="#FFEDAB"></stop>
        </radialGradient>
      </defs>
    </svg>
  `;
}

function sunIcon() {
  return `<svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
  </svg>`;
}

function moonIcon() {
  return `<svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>`;
}

// Framework icons — simpleicons.org. Single-color, fill="currentColor".
function javascriptIcon() {
  return svg(
    'JavaScript',
    'M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z',
  );
}

function reactIcon() {
  return svg(
    'React',
    'M14.448 16.24l-1.972-3.34c-.155.018-.298.018-.476.018-.135 0-.296-.015-.422-.034l-1.872 3.358h.014c.59-.038 1.184-.115 1.79-.236.122-.024.246-.041.371-.058l-.012-.011c.582-.116 1.157-.27 1.713-.461.149-.05.305-.114.466-.18l-.005-.058zM7.84 18.16C6.6 17.86 5.79 17.55 5.05 17.144c-.65-.354-1.094-.731-1.34-1.094-.231-.34-.341-.692-.341-1.05 0-.713.452-1.477 1.302-2.16.85-.685 2.046-1.244 3.412-1.674-.16-.547-.265-1.099-.31-1.617C7.692 9.5 7.692 9.444 7.692 9.39c0-1.62.355-2.948.85-3.96.493-1.013 1.124-1.717 1.806-2.045a1.9 1.9 0 0 1 .788-.196c.357 0 .708.108 1.05.342.34.232.66.583.957 1.043.296.46.564 1.025.789 1.685.224.66.401 1.413.531 2.252v.013c.554.155 1.078.345 1.557.554.482.21.916.439 1.288.681.373.243.681.5.92.769.24.27.412.553.488.847a1.9 1.9 0 0 1 .078.523c0 .497-.193 1.014-.567 1.546-.373.534-.92 1.084-1.625 1.628-.706.544-1.567 1.07-2.547 1.557 0 0-.064.026-.084.034-.087.039-.169.066-.247.094zM18.6 12c0 1.32-.95 2.4-2.13 2.4-1.18 0-2.13-1.08-2.13-2.4 0-1.32.95-2.4 2.13-2.4 1.18 0 2.13 1.08 2.13 2.4z M11.998 16.5c.346 0 .626-.28.626-.625a.625.625 0 0 0-.626-.625.625.625 0 0 0-.625.625c0 .345.28.625.625.625zm0-3.13a4.355 4.355 0 0 1-1.353-.25 8.5 8.5 0 0 1-1.39-.7 14.4 14.4 0 0 1-1.34-.94c-.43-.34-.81-.66-1.16-.99-.34-.32-.62-.62-.86-.91-.24-.28-.43-.55-.55-.78a2 2 0 0 1-.21-.65c0-.26.082-.5.243-.7.16-.2.39-.36.69-.49a3.4 3.4 0 0 1 1.04-.243 8.6 8.6 0 0 1 1.34-.097c.91 0 1.79.13 2.6.34l.07.01v.005c0 .345-.28.625-.625.625a.62.62 0 0 1-.625-.625l-.005-.005a14 14 0 0 1-2.041-.256c-.41-.097-.66-.232-.81-.4-.15-.17-.18-.36-.18-.55 0-.34.32-.66.91-.94.59-.28 1.42-.5 2.39-.62a17.4 17.4 0 0 1 2.65-.21h.004c.91 0 1.79.13 2.6.34.81.21 1.55.51 2.16.88.61.37 1.09.81 1.4 1.31.31.5.46 1.05.46 1.66 0 .61-.15 1.16-.46 1.66-.31.5-.79.94-1.4 1.31-.61.37-1.35.67-2.16.88-.81.21-1.69.34-2.6.34h-.004c-.91 0-1.79-.13-2.6-.34l-.07-.01v.005c0 .345.28.625.625.625a.62.62 0 0 1 .625.625v.04zM12 7.5c-.346 0-.626.28-.626.625S11.654 8.75 12 8.75c.346 0 .625-.28.625-.625S12.346 7.5 12 7.5z',
  );
}

function vueIcon() {
  return svg(
    'Vue',
    'M24 1.61h-9.94L12 5.16 9.94 1.61H0L12 22.39 24 1.61zm-19.86 1.6h3.16L12 8.96l4.7-5.75h3.16L12 16.21z',
  );
}

function svelteIcon() {
  return svg(
    'Svelte',
    'M10.354 21.125a4.44 4.44 0 0 1-4.765-1.767 4.109 4.109 0 0 1-.703-3.107 3.898 3.898 0 0 1 .134-.522l.105-.321.287.21a7.21 7.21 0 0 0 2.186 1.092l.208.063-.02.208a1.253 1.253 0 0 0 .226.83 1.337 1.337 0 0 0 1.435.533 1.231 1.231 0 0 0 .343-.15l5.59-3.562a1.164 1.164 0 0 0 .524-.778 1.242 1.242 0 0 0-.211-.937 1.338 1.338 0 0 0-1.435-.533 1.23 1.23 0 0 0-.343.15l-2.133 1.36a4.078 4.078 0 0 1-1.135.499 4.44 4.44 0 0 1-4.765-1.766 4.108 4.108 0 0 1-.702-3.108 3.855 3.855 0 0 1 1.742-2.582l5.589-3.563a4.072 4.072 0 0 1 1.135-.499 4.44 4.44 0 0 1 4.765 1.767 4.108 4.108 0 0 1 .703 3.107 3.943 3.943 0 0 1-.134.522l-.105.321-.286-.21a7.204 7.204 0 0 0-2.187-1.093l-.208-.063.02-.207a1.255 1.255 0 0 0-.226-.831 1.337 1.337 0 0 0-1.435-.532 1.231 1.231 0 0 0-.343.15L8.62 9.368a1.162 1.162 0 0 0-.524.778 1.24 1.24 0 0 0 .211.937 1.338 1.338 0 0 0 1.435.533 1.235 1.235 0 0 0 .344-.151l2.132-1.36a4.07 4.07 0 0 1 1.135-.498 4.44 4.44 0 0 1 4.765 1.766 4.108 4.108 0 0 1 .702 3.108 3.857 3.857 0 0 1-1.742 2.583l-5.589 3.562a4.072 4.072 0 0 1-1.135.499',
  );
}

function angularIcon() {
  return svg(
    'Angular',
    'M9.93 12.645h4.134L11.996 7.74M11.996.009L.686 3.988l1.725 14.76 9.585 5.243 9.588-5.238L23.308 3.99 11.996.01zm7.058 18.297h-2.636l-1.42-3.501H8.995l-1.42 3.501H4.937l7.06-15.648 7.057 15.648z',
  );
}

function nextIcon() {
  return svg(
    'Next.js',
    'M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z',
  );
}

function svg(title, path) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><title>${title}</title><path d="${path}"></path></svg>`;
}
