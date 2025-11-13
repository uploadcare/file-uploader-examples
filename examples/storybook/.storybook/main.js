import { join, dirname } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ["../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: {
    name: getAbsolutePath("@storybook/html-vite"),
    options: {},
  },
  // Configure Vite/esbuild to compile TSX/JSX with a custom hyperscript pragma
  viteFinal: async (config) => {
    config.esbuild = {
      ...(config.esbuild ?? {}),
      // Use a private identifier to avoid collisions with user imports
      jsxFactory: "__h",
      jsxFragment: "Fragment",
      jsxInject: [
        `const Fragment = Symbol.for('jsx-dom/fragment');
function __append(parent, child) {
  if (child == null || child === false) return;
  if (Array.isArray(child)) { child.forEach(c => __append(parent, c)); return; }
  // Convert strings/numbers to Text nodes
  if (typeof child === 'string' || typeof child === 'number') {
    parent.appendChild(document.createTextNode(String(child)));
    return;
  }
  parent.appendChild(child);
}

function __setProp(el, name, value) {
  if (value == null || value === false) return;
  if (name === 'className') name = 'class';
  if (name === 'htmlFor') name = 'for';
  if (name === 'style' && value && typeof value === 'object') {
    for (const k in value) el.style[k] = value[k];
    return;
  }
  if (/^on[A-Z]/.test(name) && typeof value === 'function') {
    const event = name.slice(2).toLowerCase();
    el.addEventListener(event, value);
    return;
  }
  // Set as attribute for reliability with custom elements
  if (value === true) el.setAttribute(name, '');
  else el.setAttribute(name, String(value));
}

function __h(type, props, ...children) {
  if (type === Fragment) {
    const frag = document.createDocumentFragment();
    children.forEach(c => __append(frag, c));
    return frag;
  }
  if (typeof type === 'function') {
    return type({ ...(props || {}), children });
  }
  const el = document.createElement(type);
  if (props) {
    for (const k in props) {
      if (k === 'children') continue;
      __setProp(el, k, props[k]);
    }
  }
  children.forEach(c => __append(el, c));
  return el;
}`,
      ].join("\n"),
    };
    return config;
  },
};
export default config;
