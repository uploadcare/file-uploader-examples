declare module 'react/jsx-runtime' {
  // Minimal declarations to satisfy TS when it expects the automatic JSX runtime
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}
