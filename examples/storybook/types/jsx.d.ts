// Minimal JSX namespace to make TS happy when using a custom pragma factory
// We model elements as "any" since hyperscript returns HTMLElement-like nodes
// and Fragment returns arrays of children.

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
  interface Element {}
}

declare const Fragment: unique symbol;
declare function __h(type: any, props?: any, ...children: any[]): any;

declare module 'hyperscript' {
  const h: (tag: any, props?: any, ...children: any[]) => any;
  export default h;
}
