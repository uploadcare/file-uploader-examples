/*
  Builds the shared site chrome (logo, top-level nav, source links) and
  prepends it to <body>. Each page calls `mountLayout(activePage)` so the
  current item gets the active treatment.
 */

const LOGO_SVG = /* HTML */ `
  <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 18 18" width="30" height="30">
    <title>Uploadcare</title>
    <circle cx="9" cy="9" r="9" fill="url(#layout-logo-gradient)"></circle>
    <defs>
      <radialGradient
        id="layout-logo-gradient"
        cx="0"
        cy="0"
        r="1"
        gradientTransform="rotate(149.216 9.368 7.42) scale(17.5848 20.2492)"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#FFC700"></stop>
        <stop offset="1" stop-color="#FFEDAB"></stop>
      </radialGradient>
    </defs>
  </svg>
`;

const GITHUB_SVG = /* HTML */ `
  <svg xmlns="http://www.w3.org/2000/svg" focusable="false" viewBox="0 0 24 24" width="30" height="30">
    <title>GitHub</title>
    <path
      style="fill: var(--ui-control-text-color);"
      stroke="none"
      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    ></path>
  </svg>
`;

const CODESANDBOX_BADGE = /* HTML */ `
  <img
    src="https://codesandbox.io/static/img/play-codesandbox.svg"
    alt="Play with CodeSandbox"
    height="30"
  />
`;

const STACKBLITZ_BADGE = /* HTML */ `
  <img
    src="https://developer.stackblitz.com/img/open_in_stackblitz.svg"
    alt="Open in StackBlitz"
    height="30"
  />
`;

const NAV_ITEMS = [
  { id: 'form', href: 'form.html', label: 'Real-life form' },
  { id: 'minimal', href: 'minimal.html', label: 'Minimal uploader' },
  { id: 'regular', href: 'regular.html', label: 'Regular uploader' },
];

export function mountLayout(activePage) {
  const items = NAV_ITEMS.map(({ id, href, label }) => {
    const className = `layout-link layout-menu-link${id === activePage ? ' active' : ''}`;
    return `<li class="layout-menu-item"><a class="${className}" href="${href}">${label}</a></li>`;
  }).join('');

  const nav = document.createElement('nav');
  nav.className = 'layout-root';
  nav.innerHTML = /* HTML */ `
    <a class="layout-link layout-logo" href="https://uploadcare.com">${LOGO_SVG}</a>
    <ul class="layout-menu">${items}</ul>
    <div class="layout-source">
      <span class="layout-source-title">Built with Uploadcare File Uploader and JavaScript</span>
      <a
        class="layout-link"
        href="https://uploadcare.com/docs/integrations/javascript-file-uploader/"
      >
        Docs
      </a>
      <a
        class="layout-link"
        href="https://codesandbox.io/p/devbox/github/uploadcare/file-uploader-examples/tree/main/examples/js-uploader"
      >
        ${CODESANDBOX_BADGE}
      </a>
      <a
        class="layout-link"
        href="https://stackblitz.com/github/uploadcare/file-uploader-examples/tree/main/examples/js-uploader"
      >
        ${STACKBLITZ_BADGE}
      </a>
      <a
        class="layout-link"
        href="https://github.com/uploadcare/file-uploader-examples/tree/main/examples/js-uploader"
      >
        ${GITHUB_SVG}
      </a>
    </div>
  `;

  document.body.prepend(nav);
}
