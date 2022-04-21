
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /** @returns {Object<string, any>} */
    function cloneObj(obj) {
      let clone = (o) => {
        for (let prop in o) {
          if (o[prop]?.constructor === Object) {
            o[prop] = clone(o[prop]);
          }
        }
        return { ...o };
      };
      return clone(obj);
    }

    class Data {
      /**
       * @param {Object} src
       * @param {String} [src.name]
       * @param {Object<string, any>} src.schema
       */
      constructor(src) {
        this.uid = Symbol();
        this.name = src.name || null;
        if (src.schema.constructor === Object) {
          this.store = cloneObj(src.schema);
        } else {
          // For Proxy support:
          /** @private */
          this._storeIsProxy = true;
          this.store = src.schema;
        }
        /** @type {Object<String, Set<Function>>} */
        this.callbackMap = Object.create(null);
      }

      /**
       * @param {String} actionName
       * @param {String} prop
       */
      static warn(actionName, prop) {
        console.warn(`Symbiote Data: cannot ${actionName}. Prop name: ` + prop);
      }

      /** @param {String} prop */
      read(prop) {
        if (!this._storeIsProxy && !this.store.hasOwnProperty(prop)) {
          Data.warn('read', prop);
          return null;
        }
        return this.store[prop];
      }

      /** @param {String} prop */
      has(prop) {
        return this._storeIsProxy ? this.store[prop] !== undefined : this.store.hasOwnProperty(prop);
      }

      /**
       * @param {String} prop
       * @param {unknown} val
       * @param {Boolean} [rewrite]
       */
      add(prop, val, rewrite = true) {
        if (!rewrite && Object.keys(this.store).includes(prop)) {
          return;
        }
        this.store[prop] = val;
        if (this.callbackMap[prop]) {
          this.callbackMap[prop].forEach((callback) => {
            callback(this.store[prop]);
          });
        }
      }

      /**
       * @template T
       * @param {String} prop
       * @param {T} val
       */
      pub(prop, val) {
        if (!this._storeIsProxy && !this.store.hasOwnProperty(prop)) {
          Data.warn('publish', prop);
          return;
        }
        this.add(prop, val);
      }

      /** @param {Object<string, any>} updObj */
      multiPub(updObj) {
        for (let prop in updObj) {
          this.pub(prop, updObj[prop]);
        }
      }

      /** @param {String} prop */
      notify(prop) {
        if (this.callbackMap[prop]) {
          this.callbackMap[prop].forEach((callback) => {
            callback(this.store[prop]);
          });
        }
      }

      /**
       * @param {String} prop
       * @param {Function} callback
       * @param {Boolean} [init]
       */
      sub(prop, callback, init = true) {
        if (!this._storeIsProxy && !this.store.hasOwnProperty(prop)) {
          Data.warn('subscribe', prop);
          return null;
        }
        if (!this.callbackMap[prop]) {
          this.callbackMap[prop] = new Set();
        }
        this.callbackMap[prop].add(callback);
        if (init) {
          callback(this.store[prop]);
        }
        return {
          remove: () => {
            this.callbackMap[prop].delete(callback);
            if (!this.callbackMap[prop].size) {
              delete this.callbackMap[prop];
            }
          },
          callback,
        };
      }

      remove() {
        delete Data.globalStore[this.uid];
      }

      /** @param {Object<string, any>} schema */
      static registerLocalCtx(schema) {
        let state = new Data({
          schema,
        });
        Data.globalStore[state.uid] = state;
        return state;
      }

      /**
       * @param {String} ctxName
       * @param {Object<string, any>} schema
       * @returns {Data}
       */
      static registerNamedCtx(ctxName, schema) {
        /** @type {Data} */
        let state = Data.globalStore[ctxName];
        if (state) {
          console.warn('State: context name "' + ctxName + '" already in use');
        } else {
          state = new Data({
            name: ctxName,
            schema,
          });
          Data.globalStore[ctxName] = state;
        }
        return state;
      }

      /** @param {String} ctxName */
      static clearNamedCtx(ctxName) {
        delete Data.globalStore[ctxName];
      }

      /**
       * @param {String} ctxName
       * @param {Boolean} [notify]
       * @returns {Data}
       */
      static getNamedCtx(ctxName, notify = true) {
        return Data.globalStore[ctxName] || (notify && console.warn('State: wrong context name - "' + ctxName + '"'), null);
      }
    }

    Data.globalStore = Object.create(null);

    /** @enum {String} */
    const DICT = Object.freeze({
      //  Template data binding attribute:
      BIND_ATTR: 'set',
      //  Local state binding attribute name:
      ATTR_BIND_PRFX: '@',
      // External prop prefix:
      EXT_DATA_CTX_PRFX: '*',
      // Named data context property splitter:
      NAMED_DATA_CTX_SPLTR: '/',
      // Data context name attribute:
      CTX_NAME_ATTR: 'ctx-name',
      // Data context name in CSS custom property:
      CSS_CTX_PROP: '--ctx-name',
      // Element reference attribute:
      EL_REF_ATTR: 'ref',
      // Prefix for auto generated tag names:
      AUTO_TAG_PRFX: 'sym',
    });

    const CHARS = '1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';
    const CHLENGTH = CHARS.length - 1;

    class UID {
      
      /**
       * 
       * @param {String} [pattern] any symbols sequence with dashes. Default dash is used for human readability
       * @returns {String} output example: v6xYaSk7C-kzZ
       */
      static generate(pattern = 'XXXXXXXXX-XXX') {
        let uid = '';
      	for (let i = 0; i < pattern.length; i++) {
      		uid += pattern[i] === '-' ? pattern[i] : CHARS.charAt(Math.random() * CHLENGTH);
      	}
      	return uid;
      }
    }

    /**
     * @template {import('./BaseComponent.js').BaseComponent} T
     * @param {DocumentFragment} fr
     * @param {T} fnCtx
     */
    function slotProcessor(fr, fnCtx) {
      if (fnCtx.shadowRoot) {
        return;
      }
      let slots = [...fr.querySelectorAll('slot')];
      if (fnCtx.initChildren.length && slots.length) {
        let slotMap = {};
        slots.forEach((slot) => {
          let slotName = slot.getAttribute('name');
          if (slotName) {
            slotMap[slotName] = {
              slot,
              fr: document.createDocumentFragment(),
            };
          } else {
            slotMap.__default__ = {
              slot,
              fr: document.createDocumentFragment(),
            };
          }
        });
        fnCtx.initChildren.forEach((/** @type {Element} */ child) => {
          let slotName = child.getAttribute?.('slot');
          if (slotName) {
            child.removeAttribute('slot');
            slotMap[slotName].fr.appendChild(child);
          } else if (slotMap.__default__) {
            slotMap.__default__.fr.appendChild(child);
          }
        });
        Object.values(slotMap).forEach((mapObj) => {
          mapObj.slot.parentNode.insertBefore(mapObj.fr, mapObj.slot);
          mapObj.slot.remove();
        });
      }
    }

    /**
     * @template {import('./BaseComponent.js').BaseComponent} T
     * @param {DocumentFragment} fr
     * @param {T} fnCtx
     */
    function refProcessor(fr, fnCtx) {
      [...fr.querySelectorAll(`[${DICT.EL_REF_ATTR}]`)].forEach((/** @type {HTMLElement} */ el) => {
        let refName = el.getAttribute(DICT.EL_REF_ATTR);
        fnCtx.ref[refName] = el;
        el.removeAttribute(DICT.EL_REF_ATTR);
      });
    }

    /**
     * @template {import('./BaseComponent.js').BaseComponent} T
     * @param {DocumentFragment} fr
     * @param {T} fnCtx
     */
    function domSetProcessor(fr, fnCtx) {
      [...fr.querySelectorAll(`[${DICT.BIND_ATTR}]`)].forEach((el) => {
        let subStr = el.getAttribute(DICT.BIND_ATTR);
        let keyValArr = subStr.split(';');
        keyValArr.forEach((keyValStr) => {
          if (!keyValStr) {
            return;
          }
          let kv = keyValStr.split(':').map((str) => str.trim());
          let prop = kv[0];
          let isAttr;

          if (prop.indexOf(DICT.ATTR_BIND_PRFX) === 0) {
            isAttr = true;
            prop = prop.replace(DICT.ATTR_BIND_PRFX, '');
          }
          /** @type {String[]} */
          let valKeysArr = kv[1].split(',').map((valKey) => {
            return valKey.trim();
          });
          // Deep property:
          let isDeep, parent, lastStep, dive;
          if (prop.includes('.')) {
            isDeep = true;
            let propPath = prop.split('.');
            dive = () => {
              parent = el;
              propPath.forEach((step, idx) => {
                if (idx < propPath.length - 1) {
                  parent = parent[step];
                } else {
                  lastStep = step;
                }
              });
            };
            dive();
          }
          for (let valKey of valKeysArr) {
            fnCtx.sub(valKey, (val) => {
              if (isAttr) {
                if (val?.constructor === Boolean) {
                  val ? el.setAttribute(prop, '') : el.removeAttribute(prop);
                } else {
                  el.setAttribute(prop, val);
                }
              } else if (isDeep) {
                if (parent) {
                  parent[lastStep] = val;
                } else {
                  // Custom element instances are not constructed properly at this time, so:
                  window.setTimeout(() => {
                    dive();
                    parent[lastStep] = val;
                  });
                  // TODO: investigate how to do it better ^^^
                }
              } else {
                el[prop] = val;
              }
            });
          }
        });
        el.removeAttribute(DICT.BIND_ATTR);
      });
    }

    const OPEN_TOKEN = '{{';
    const CLOSE_TOKEN = '}}';
    const SKIP_ATTR = 'skip-text';

    function getTextNodesWithTokens(el) {
      let node;
      let result = [];
      let walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
        acceptNode: (txt) => {
          return !txt.parentElement?.hasAttribute(SKIP_ATTR) && txt.textContent.includes(OPEN_TOKEN) && txt.textContent.includes(CLOSE_TOKEN) && 1;
        },
      });
      while ((node = walk.nextNode())) {
        result.push(node);
      }
      return result;
    }

    /**
     * @template {import('./BaseComponent.js').BaseComponent} T
     * @param {DocumentFragment} fr
     * @param {T} fnCtx
     */
    const txtNodesProcessor = function (fr, fnCtx) {
      let txtNodes = getTextNodesWithTokens(fr);
      txtNodes.forEach((/** @type {Text} */ txtNode) => {
        let tokenNodes = [];
        let offset;
        // Splitting of the text node:
        while (txtNode.textContent.includes(CLOSE_TOKEN)) {
          if (txtNode.textContent.startsWith(OPEN_TOKEN)) {
            offset = txtNode.textContent.indexOf(CLOSE_TOKEN) + CLOSE_TOKEN.length;
            txtNode.splitText(offset);
            tokenNodes.push(txtNode);
          } else {
            offset = txtNode.textContent.indexOf(OPEN_TOKEN);
            txtNode.splitText(offset);
          }
          // @ts-ignore
          txtNode = txtNode.nextSibling;
        }
        tokenNodes.forEach((tNode) => {
          let prop = tNode.textContent.replace(OPEN_TOKEN, '').replace(CLOSE_TOKEN, '');
          fnCtx.sub(prop, (val) => {
            tNode.textContent = val;
          });
        });
      });
    };

    var PROCESSORS = [slotProcessor, refProcessor, domSetProcessor, txtNodesProcessor];

    let autoTagsCount = 0;

    class BaseComponent extends HTMLElement {
      initCallback() {}

      /** @private */
      __initCallback() {
        if (this.__initialized) {
          return;
        }
        /** @private */
        this.__initialized = true;
        this.initCallback?.();
      }

      /** @type {String} */
      static template;

      /**
       * @param {String | DocumentFragment} [template]
       * @param {Boolean} [shadow]
       */
      render(template, shadow = this.renderShadow) {
        /** @type {DocumentFragment} */
        let fr;
        if ((shadow || this.constructor['__shadowStylesUrl']) && !this.shadowRoot) {
          this.attachShadow({
            mode: 'open',
          });
        }
        if (this.processInnerHtml) {
          for (let fn of this.tplProcessors) {
            fn(this, this);
          }
        }
        if (template || this.constructor['template']) {
          if (this.constructor['template'] && !this.constructor['__tpl']) {
            this.constructor['__tpl'] = document.createElement('template');
            this.constructor['__tpl'].innerHTML = this.constructor['template'];
          }
          if (template?.constructor === DocumentFragment) {
            fr = template;
          } else if (template?.constructor === String) {
            let tpl = document.createElement('template');
            tpl.innerHTML = template;
            // @ts-ignore
            fr = tpl.content.cloneNode(true);
          } else if (this.constructor['__tpl']) {
            fr = this.constructor['__tpl'].content.cloneNode(true);
          }
          for (let fn of this.tplProcessors) {
            fn(fr, this);
          }
        }

        // for the possible asynchronous call:
        let addFr = () => {
          fr && ((shadow && this.shadowRoot.appendChild(fr)) || this.appendChild(fr));
          this.__initCallback();
        };

        if (this.constructor['__shadowStylesUrl']) {
          shadow = true; // is needed for cases when Shadow DOM was created manually for some other purposes
          let styleLink = document.createElement('link');
          styleLink.rel = 'stylesheet';
          styleLink.href = this.constructor['__shadowStylesUrl'];
          styleLink.onload = addFr;
          this.shadowRoot.prepend(styleLink); // the link should be added before the other template elements
        } else {
          addFr();
        }
      }

      /**
       * @template {BaseComponent} T
       * @param {(fr: DocumentFragment | T, fnCtx: T) => void} processorFn
       */
      addTemplateProcessor(processorFn) {
        this.tplProcessors.add(processorFn);
      }

      constructor() {
        super();
        /** @type {Object<string, unknown>} */
        this.init$ = Object.create(null);
        /** @type {Set<(fr: DocumentFragment | BaseComponent, fnCtx: unknown) => void>} */
        this.tplProcessors = new Set();
        /** @type {Object<string, any>} */
        this.ref = Object.create(null);
        this.allSubs = new Set();
        /** @type {Boolean} */
        this.pauseRender = false;
        /** @type {Boolean} */
        this.renderShadow = false;
        /** @type {Boolean} */
        this.readyToDestroy = true;
        /** @type {Boolean} */
        this.processInnerHtml = false;
      }

      /** @returns {String} */
      get autoCtxName() {
        if (!this.__autoCtxName) {
          /** @private */
          this.__autoCtxName = UID.generate();
          this.style.setProperty(DICT.CSS_CTX_PROP, `'${this.__autoCtxName}'`);
        }
        return this.__autoCtxName;
      }

      /** @returns {String} */
      get cssCtxName() {
        return this.getCssData(DICT.CSS_CTX_PROP, true);
      }

      /** @returns {String} */
      get ctxName() {
        return this.getAttribute(DICT.CTX_NAME_ATTR)?.trim() || this.cssCtxName || this.autoCtxName;
      }

      /** @returns {Data} */
      get localCtx() {
        if (!this.__localCtx) {
          /** @private */
          this.__localCtx = Data.registerLocalCtx({});
        }
        return this.__localCtx;
      }

      /** @returns {Data} */
      get nodeCtx() {
        return Data.getNamedCtx(this.ctxName, false) || Data.registerNamedCtx(this.ctxName, {});
      }

      /**
       * @private
       * @template {BaseComponent} T
       * @param {String} prop
       * @param {T} fnCtx
       */
      static __parseProp(prop, fnCtx) {
        /** @type {Data} */
        let ctx;
        /** @type {String} */
        let name;
        if (prop.startsWith(DICT.EXT_DATA_CTX_PRFX)) {
          ctx = fnCtx.nodeCtx;
          name = prop.replace(DICT.EXT_DATA_CTX_PRFX, '');
        } else if (prop.includes(DICT.NAMED_DATA_CTX_SPLTR)) {
          let pArr = prop.split(DICT.NAMED_DATA_CTX_SPLTR);
          ctx = Data.getNamedCtx(pArr[0]);
          name = pArr[1];
        } else {
          ctx = fnCtx.localCtx;
          name = prop;
        }
        return {
          ctx,
          name,
        };
      }

      /**
       * @template T
       * @param {String} prop
       * @param {(value: T) => void} handler
       */
      sub(prop, handler) {
        let parsed = BaseComponent.__parseProp(prop, this);
        this.allSubs.add(parsed.ctx.sub(parsed.name, handler));
      }

      /** @param {String} prop */
      notify(prop) {
        let parsed = BaseComponent.__parseProp(prop, this);
        parsed.ctx.notify(parsed.name);
      }

      /** @param {String} prop */
      has(prop) {
        let parsed = BaseComponent.__parseProp(prop, this);
        return parsed.ctx.has(parsed.name);
      }

      /**
       * @template T
       * @param {String} prop
       * @param {T} val
       */
      add(prop, val) {
        let parsed = BaseComponent.__parseProp(prop, this);
        parsed.ctx.add(parsed.name, val, false);
      }

      /** @param {Object<string, any>} obj */
      add$(obj) {
        for (let prop in obj) {
          this.add(prop, obj[prop]);
        }
      }

      get $() {
        if (!this.__stateProxy) {
          /** @type {Object<string, any>} */
          let o = Object.create(null);
          /** @private */
          this.__stateProxy = new Proxy(o, {
            set: (obj, /** @type {String} */ prop, val) => {
              let parsed = BaseComponent.__parseProp(prop, this);
              parsed.ctx.pub(parsed.name, val);
              return true;
            },
            get: (obj, /** @type {String} */ prop) => {
              let parsed = BaseComponent.__parseProp(prop, this);
              return parsed.ctx.read(parsed.name);
            },
          });
        }
        return this.__stateProxy;
      }

      /** @param {Object<string, any>} kvObj */
      set$(kvObj) {
        for (let key in kvObj) {
          this.$[key] = kvObj[key];
        }
      }

      /** @private */
      __initDataCtx() {
        let attrDesc = this.constructor['__attrDesc'];
        if (attrDesc) {
          for (let prop of Object.values(attrDesc)) {
            if (!Object.keys(this.init$).includes(prop)) {
              this.init$[prop] = '';
            }
          }
        }
        for (let prop in this.init$) {
          if (prop.startsWith(DICT.EXT_DATA_CTX_PRFX)) {
            this.nodeCtx.add(prop.replace(DICT.EXT_DATA_CTX_PRFX, ''), this.init$[prop]);
          } else if (prop.includes(DICT.NAMED_DATA_CTX_SPLTR)) {
            let propArr = prop.split(DICT.NAMED_DATA_CTX_SPLTR);
            let ctxName = propArr[0].trim();
            let propName = propArr[1].trim();
            if (ctxName && propName) {
              let namedCtx = Data.getNamedCtx(ctxName, false);
              if (!namedCtx) {
                namedCtx = Data.registerNamedCtx(ctxName, {});
              }
              namedCtx.add(propName, this.init$[prop]);
            }
          } else {
            this.localCtx.add(prop, this.init$[prop]);
          }
        }
        /** @private */
        this.__dataCtxInitialized = true;
      }

      connectedCallback() {
        if (this.__disconnectTimeout) {
          window.clearTimeout(this.__disconnectTimeout);
        }
        if (!this.connectedOnce) {
          let ctxNameAttrVal = this.getAttribute(DICT.CTX_NAME_ATTR)?.trim();
          if (ctxNameAttrVal) {
            this.style.setProperty(DICT.CSS_CTX_PROP, `'${ctxNameAttrVal}'`);
          }
          this.__initDataCtx();
          this.initChildren = [...this.childNodes];
          for (let proc of PROCESSORS) {
            this.addTemplateProcessor(proc);
          }
          if (this.pauseRender) {
            this.__initCallback();
          } else {
            this.render();
          }
        }
        this.connectedOnce = true;
      }

      destroyCallback() {}

      disconnectedCallback() {
        this.dropCssDataCache();
        if (!this.readyToDestroy) {
          return;
        }
        if (this.__disconnectTimeout) {
          window.clearTimeout(this.__disconnectTimeout);
        }
        /** @private */
        this.__disconnectTimeout = window.setTimeout(() => {
          this.destroyCallback();
          for (let sub of this.allSubs) {
            sub.remove();
            this.allSubs.delete(sub);
          }
          for (let proc of this.tplProcessors) {
            this.tplProcessors.delete(proc);
          }
        }, 100);
      }

      /**
       * @param {String} [tagName]
       * @param {Boolean} [isAlias]
       */
      static reg(tagName, isAlias = false) {
        if (!tagName) {
          autoTagsCount++;
          tagName = `${DICT.AUTO_TAG_PRFX}-${autoTagsCount}`;
        }
        /** @private */
        this.__tag = tagName;
        if (window.customElements.get(tagName)) {
          console.warn(`${tagName} - is already in "customElements" registry`);
          return;
        }
        window.customElements.define(tagName, isAlias ? class extends this {} : this);
      }

      static get is() {
        if (!this.__tag) {
          this.reg();
        }
        return this.__tag;
      }

      /** @param {Object<string, string>} desc */
      static bindAttributes(desc) {
        this.observedAttributes = Object.keys(desc);
        /** @private */
        this.__attrDesc = desc;
      }

      attributeChangedCallback(name, oldVal, newVal) {
        if (oldVal === newVal) {
          return;
        }
        /** @type {String} */
        let $prop = this.constructor['__attrDesc'][name];
        if ($prop) {
          if (this.__dataCtxInitialized) {
            this.$[$prop] = newVal;
          } else {
            this.init$[$prop] = newVal;
          }
        } else {
          this[name] = newVal;
        }
      }

      /**
       * @param {String} propName
       * @param {Boolean} [silentCheck]
       */
      getCssData(propName, silentCheck = false) {
        if (!this.__cssDataCache) {
          /** @private */
          this.__cssDataCache = Object.create(null);
        }
        if (!Object.keys(this.__cssDataCache).includes(propName)) {
          if (!this.__computedStyle) {
            /** @private */
            this.__computedStyle = window.getComputedStyle(this);
          }
          let val = this.__computedStyle.getPropertyValue(propName).trim();
          // Firefox doesn't transform string values into JSON format:
          if (val.startsWith(`'`) && val.endsWith(`'`)) {
            val = val.replace(/\'/g, '"');
          }
          try {
            this.__cssDataCache[propName] = JSON.parse(val);
          } catch (e) {
            !silentCheck && console.warn(`CSS Data error: ${propName}`);
            this.__cssDataCache[propName] = null;
          }
        }
        return this.__cssDataCache[propName];
      }

      /**
       * @param {String} propName
       * @param {Boolean} [external]
       * @returns {String}
       */
      bindCssData(propName, external = true) {
        let stateName = (external ? DICT.EXT_DATA_CTX_PRFX : '') + propName;
        this.add(stateName, this.getCssData(propName, true));
        return stateName;
      }

      dropCssDataCache() {
        this.__cssDataCache = null;
        this.__computedStyle = null;
      }

      /**
       * @param {String} propName
       * @param {Function} [handler]
       * @param {Boolean} [isAsync]
       */
      defineAccessor(propName, handler, isAsync) {
        let localPropName = '__' + propName;
        this[localPropName] = this[propName];
        Object.defineProperty(this, propName, {
          set: (val) => {
            this[localPropName] = val;
            if (isAsync) {
              window.setTimeout(() => {
                handler?.(val);
              });
            } else {
              handler?.(val);
            }
          },
          get: () => {
            return this[localPropName];
          },
        });
        this[propName] = this[localPropName];
      }

      /** @param {String} cssTxt */
      static set shadowStyles(cssTxt) {
        let styleBlob = new Blob([cssTxt], {
          type: 'text/css',
        });
        /** @private */
        this.__shadowStylesUrl = URL.createObjectURL(styleBlob);
      }
    }

    const MSG_NAME = '[Typed State] Wrong property name: ';
    const MSG_TYPE = '[Typed State] Wrong property type: ';

    class TypedData {
      /**
       * @param {Object<string, { type: any; value: any; nullable?: Boolean }>} typedSchema
       * @param {String} [ctxName]
       */
      constructor(typedSchema, ctxName) {
        /** @private */
        this.__typedSchema = typedSchema;
        /** @private */
        this.__ctxId = ctxName || UID.generate();
        /** @private */
        this.__schema = Object.keys(typedSchema).reduce((acc, key) => {
          acc[key] = typedSchema[key].value;
          return acc;
        }, {});
        /**
         * @private
         * @type {Data}
         */
        this.__data = Data.registerNamedCtx(this.__ctxId, this.__schema);
      }

      /** @returns {String} */
      get uid() {
        return this.__ctxId;
      }

      /**
       * @param {String} prop
       * @param {any} value
       */
      setValue(prop, value) {
        if (!this.__typedSchema.hasOwnProperty(prop)) {
          console.warn(MSG_NAME + prop);
          return;
        }
        let pDesc = this.__typedSchema[prop];
        if (value?.constructor === pDesc.type || (pDesc.nullable && value === null)) {
          this.__data.pub(prop, value);
          return;
        }
        console.warn(MSG_TYPE + prop);
      }

      /** @param {Object<string, any>} updObj */
      setMultipleValues(updObj) {
        for (let prop in updObj) {
          this.setValue(prop, updObj[prop]);
        }
      }

      /** @param {String} prop */
      getValue(prop) {
        if (!this.__typedSchema.hasOwnProperty(prop)) {
          console.warn(MSG_NAME + prop);
          return undefined;
        }
        return this.__data.read(prop);
      }

      /**
       * @param {String} prop
       * @param {(newVal: any) => void} handler
       */
      subscribe(prop, handler) {
        return this.__data.sub(prop, handler);
      }

      remove() {
        this.__data.remove();
      }
    }

    class TypedCollection {
      /**
       * @param {Object} options
       * @param {Object<string, { type: any; value: any }>} options.typedSchema
       * @param {String[]} [options.watchList]
       * @param {(list: string[]) => void} [options.handler]
       * @param {String} [options.ctxName]
       */
      constructor(options) {
        /**
         * @private
         * @type {Object<string, { type: any; value: any }>}
         */
        this.__typedSchema = options.typedSchema;
        /**
         * @private
         * @type {String}
         */
        this.__ctxId = options.ctxName || UID.generate();
        /**
         * @private
         * @type {Data}
         */
        this.__data = Data.registerNamedCtx(this.__ctxId, {});
        /**
         * @private
         * @type {string[]}
         */
        this.__watchList = options.watchList || [];
        /**
         * @private
         * @type {(list: string[]) => void}
         */
        this.__handler = options.handler || null;
        /**
         * @private
         * @type {Object<string, any>}
         */
        this.__subsMap = Object.create(null);
        /**
         * @private
         * @type {Set}
         */
        this.__observers = new Set();
        /**
         * @private
         * @type {Set<string>}
         */
        this.__items = new Set();

        let changeMap = Object.create(null);

        /**
         * @private
         * @param {String} propName
         * @param {String} ctxId
         */
        this.__notifyObservers = (propName, ctxId) => {
          if (this.__observeTimeout) {
            window.clearTimeout(this.__observeTimeout);
          }
          if (!changeMap[propName]) {
            changeMap[propName] = new Set();
          }
          changeMap[propName].add(ctxId);
          /** @private */
          this.__observeTimeout = window.setTimeout(() => {
            this.__observers.forEach((handler) => {
              handler({ ...changeMap });
            });
            changeMap = Object.create(null);
          });
        };
      }

      notify() {
        if (this.__notifyTimeout) {
          window.clearTimeout(this.__notifyTimeout);
        }
        /** @private */
        this.__notifyTimeout = window.setTimeout(() => {
          this.__handler?.([...this.__items]);
        });
      }

      /**
       * @param {Object<string, any>} init
       * @returns {any}
       */
      add(init) {
        let item = new TypedData(this.__typedSchema);
        for (let prop in init) {
          item.setValue(prop, init[prop]);
        }
        this.__data.add(item.uid, item);
        this.__watchList.forEach((propName) => {
          if (!this.__subsMap[item.uid]) {
            this.__subsMap[item.uid] = [];
          }
          this.__subsMap[item.uid].push(
            item.subscribe(propName, () => {
              this.__notifyObservers(propName, item.uid);
            })
          );
        });
        this.__items.add(item.uid);
        this.notify();
        return item;
      }

      /**
       * @param {String} id
       * @returns {TypedData}
       */
      read(id) {
        return this.__data.read(id);
      }

      /**
       * @param {String} id
       * @param {String} propName
       * @returns {any}
       */
      readProp(id, propName) {
        let item = this.read(id);
        return item.getValue(propName);
      }

      /**
       * @template T
       * @param {String} id
       * @param {String} propName
       * @param {T} value
       */
      publishProp(id, propName, value) {
        let item = this.read(id);
        item.setValue(propName, value);
      }

      /** @param {String} id */
      remove(id) {
        this.__items.delete(id);
        this.notify();
        this.__data.pub(id, null);
        delete this.__subsMap[id];
      }

      clearAll() {
        this.__items.forEach((id) => {
          this.remove(id);
        });
      }

      /** @param {Function} handler */
      observe(handler) {
        this.__observers.add(handler);
      }

      /** @param {Function} handler */
      unobserve(handler) {
        this.__observers.delete(handler);
      }

      /**
       * @param {(item: TypedData) => Boolean} checkFn
       * @returns {String[]}
       */
      findItems(checkFn) {
        let result = [];
        this.__items.forEach((id) => {
          let item = this.read(id);
          if (checkFn(item)) {
            result.push(id);
          }
        });
        return result;
      }

      items() {
        return [...this.__items];
      }

      destroy() {
        this.__data.remove();
        this.__observers = null;
        for (let id in this.__subsMap) {
          this.__subsMap[id].forEach((sub) => {
            sub.remove();
          });
          delete this.__subsMap[id];
        }
      }
    }

    /** @typedef {Object<string, string | number | boolean>} StyleMap */

    /** @typedef {Object<string, string | number | boolean>} AttrMap */

    /** @typedef {Object<string, any>} PropMap */

    /**
     * @template {HTMLElement} T
     * @param {T} el HTMLElement
     * @param {StyleMap} styleMap
     */
    function applyStyles(el, styleMap) {
      for (let prop in styleMap) {
        if (prop.includes('-')) {
          // @ts-ignore
          el.style.setProperty(prop, styleMap[prop]);
        } else {
          el.style[prop] = styleMap[prop];
        }
      }
    }

    /**
     * @template {HTMLElement} T
     * @param {T} el HTMLElement
     * @param {AttrMap} attrMap
     */
    function applyAttributes(el, attrMap) {
      for (let attrName in attrMap) {
        if (attrMap[attrName].constructor === Boolean) {
          if (attrMap[attrName]) {
            el.setAttribute(attrName, '');
          } else {
            el.removeAttribute(attrName);
          }
        } else {
          // @ts-ignore
          el.setAttribute(attrName, attrMap[attrName]);
        }
      }
    }

    /**
     * @typedef {{
     *   tag?: String;
     *   attributes?: AttrMap;
     *   styles?: StyleMap;
     *   properties?: PropMap;
     *   processors?: Function[];
     *   children?: ElementDescriptor[];
     * }} ElementDescriptor
     */

    /**
     * @param {ElementDescriptor} [desc]
     * @returns {any}
     */
    function create(desc = { tag: 'div' }) {
      let el = document.createElement(desc.tag);
      if (desc.attributes) {
        applyAttributes(el, desc.attributes);
      }
      if (desc.styles) {
        applyStyles(el, desc.styles);
      }
      if (desc.properties) {
        for (let prop in desc.properties) {
          el[prop] = desc.properties[prop];
        }
      }
      if (desc.processors) {
        desc.processors.forEach((fn) => {
          fn(el);
        });
      }
      if (desc.children) {
        desc.children.forEach((desc) => {
          let child = create(desc);
          el.appendChild(child);
        });
      }
      return el;
    }

    /**
     * @template {import('./Block.js').Block} T
     * @param {DocumentFragment} fr
     * @param {T} fnCtx
     */
    function l10nProcessor(fr, fnCtx) {
      [...fr.querySelectorAll('[l10n]')].forEach((el) => {
        let key = el.getAttribute('l10n');
        let elProp = 'textContent';
        if (key.includes(':')) {
          let arr = key.split(':');
          elProp = arr[0];
          key = arr[1];
        }
        let ctxKey = 'l10n:' + key;
        // @ts-ignore
        fnCtx.__l10nKeys.push(ctxKey);
        fnCtx.add(ctxKey, key);
        fnCtx.sub(ctxKey, (val) => {
          el[elProp] = fnCtx.l10n(val);
        });
        el.removeAttribute('l10n');
      });
    }

    // 3.0
    // @ts-nocheck

    class UploadClientError extends Error {
        constructor(message, code, request, response, headers) {
            super();
            this.name = 'UploadClientError';
            this.message = message;
            this.code = code;
            this.request = request;
            this.response = response;
            this.headers = headers;
            Object.setPrototypeOf(this, UploadClientError.prototype);
        }
    }
    const cancelError = (message = 'Request canceled') => {
        const error = new UploadClientError(message);
        error.isCancel = true;
        return error;
    };

    const onCancel = (signal, callback) => {
        if (signal) {
            if (signal.aborted) {
                Promise.resolve().then(callback);
            }
            else {
                signal.addEventListener('abort', () => callback(), { once: true });
            }
        }
    };

    const request = ({ method, url, data, headers = {}, signal, onProgress }) => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const requestMethod = (method === null || method === void 0 ? void 0 : method.toUpperCase()) || 'GET';
        let aborted = false;
        xhr.open(requestMethod, url);
        if (headers) {
            Object.entries(headers).forEach((entry) => {
                const [key, value] = entry;
                typeof value !== 'undefined' &&
                    !Array.isArray(value) &&
                    xhr.setRequestHeader(key, value);
            });
        }
        xhr.responseType = 'text';
        onCancel(signal, () => {
            aborted = true;
            xhr.abort();
            reject(cancelError());
        });
        xhr.onload = () => {
            if (xhr.status != 200) {
                // analyze HTTP status of the response
                reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`)); // e.g. 404: Not Found
            }
            else {
                const request = {
                    method: requestMethod,
                    url,
                    data,
                    headers: headers || undefined,
                    signal,
                    onProgress
                };
                // Convert the header string into an array
                // of individual headers
                const headersArray = xhr
                    .getAllResponseHeaders()
                    .trim()
                    .split(/[\r\n]+/);
                // Create a map of header names to values
                const responseHeaders = {};
                headersArray.forEach(function (line) {
                    const parts = line.split(': ');
                    const header = parts.shift();
                    const value = parts.join(': ');
                    if (header && typeof header !== 'undefined') {
                        responseHeaders[header] = value;
                    }
                });
                const responseData = xhr.response;
                const responseStatus = xhr.status;
                resolve({
                    request,
                    data: responseData,
                    headers: responseHeaders,
                    status: responseStatus
                });
            }
        };
        xhr.onerror = () => {
            if (aborted)
                return;
            // only triggers if the request couldn't be made at all
            reject(new Error('Network error'));
        };
        if (onProgress && typeof onProgress === 'function') {
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    onProgress({
                        isComputable: true,
                        value: event.loaded / event.total
                    });
                }
                else {
                    onProgress({ isComputable: false });
                }
            };
        }
        if (data) {
            xhr.send(data);
        }
        else {
            xhr.send();
        }
    });

    function identity(obj) {
        return obj;
    }

    const transformFile = identity;
    var getFormData = () => new FormData();

    const isFileTuple = (tuple) => tuple[0] === 'file';
    function buildFormData(body) {
        const formData = getFormData();
        for (const tuple of body) {
            if (Array.isArray(tuple[1])) {
                // refactor this
                tuple[1].forEach((val) => val && formData.append(tuple[0] + '[]', `${val}`));
            }
            else if (isFileTuple(tuple)) {
                const name = tuple[2];
                const file = transformFile(tuple[1]); // lgtm[js/superfluous-trailing-arguments]
                formData.append(tuple[0], file, name);
            }
            else if (tuple[1] != null) {
                formData.append(tuple[0], `${tuple[1]}`);
            }
        }
        return formData;
    }

    const serializePair = (key, value) => typeof value !== 'undefined' ? `${key}=${encodeURIComponent(value)}` : null;
    const createQuery = (query) => Object.entries(query)
        .reduce((params, [key, value]) => params.concat(Array.isArray(value)
        ? value.map((value) => serializePair(`${key}[]`, value))
        : serializePair(key, value)), [])
        .filter((x) => !!x)
        .join('&');
    const getUrl = (base, path, query) => [
        base,
        path,
        query && Object.keys(query).length > 0 ? '?' : '',
        query && createQuery(query)
    ]
        .filter(Boolean)
        .join('');

    /*
      Settings for future support:
      parallelDirectUploads: 10,
     */
    const defaultSettings = {
        baseCDN: 'https://ucarecdn.com',
        baseURL: 'https://upload.uploadcare.com',
        maxContentLength: 50 * 1024 * 1024,
        retryThrottledRequestMaxTimes: 1,
        multipartMinFileSize: 25 * 1024 * 1024,
        multipartChunkSize: 5 * 1024 * 1024,
        multipartMinLastPartSize: 1024 * 1024,
        maxConcurrentRequests: 4,
        multipartMaxAttempts: 3,
        pollingTimeoutMilliseconds: 10000,
        pusherKey: '79ae88bd931ea68464d9'
    };
    const defaultContentType = 'application/octet-stream';
    const defaultFilename = 'original';

    var version = '3.0.0';

    /**
     * Returns User Agent based on version and settings.
     */
    function getUserAgent({ userAgent, publicKey = '', integration = '' } = {}) {
        const libraryName = 'UploadcareUploadClient';
        const libraryVersion = version;
        const languageName = 'JavaScript';
        if (typeof userAgent === 'string') {
            return userAgent;
        }
        if (typeof userAgent === 'function') {
            return userAgent({
                publicKey,
                libraryName,
                libraryVersion,
                languageName,
                integration
            });
        }
        const mainInfo = [libraryName, libraryVersion, publicKey]
            .filter(Boolean)
            .join('/');
        const additionInfo = [languageName, integration].filter(Boolean).join('; ');
        return `${mainInfo} (${additionInfo})`;
    }

    const SEPARATOR = /\W|_/g;
    /**
     * Transforms a string to camelCased.
     */
    function camelize(text) {
        return text
            .split(SEPARATOR)
            .map((word, index) => word.charAt(0)[index > 0 ? 'toUpperCase' : 'toLowerCase']() +
            word.slice(1))
            .join('');
    }
    /**
     * Transforms keys of an object to camelCased recursively.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function camelizeKeys(source) {
        if (!source || typeof source !== 'object') {
            return source;
        }
        return Object.keys(source).reduce((accumulator, key) => {
            accumulator[camelize(key)] =
                typeof source[key] === 'object' ? camelizeKeys(source[key]) : source[key];
            return accumulator;
        }, {});
    }

    /**
     * setTimeout as Promise.
     *
     * @param {number} ms Timeout in milliseconds.
     */
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const defaultOptions = {
        factor: 2,
        time: 100
    };
    function retrier(fn, options = defaultOptions) {
        let attempts = 0;
        function runAttempt(fn) {
            const defaultDelayTime = Math.round(options.time * Math.pow(options.factor, attempts));
            const retry = (ms) => delay(ms !== null && ms !== void 0 ? ms : defaultDelayTime).then(() => {
                attempts += 1;
                return runAttempt(fn);
            });
            return fn({
                attempt: attempts,
                retry
            });
        }
        return runAttempt(fn);
    }

    const REQUEST_WAS_THROTTLED_CODE = 'RequestThrottledError';
    const DEFAULT_RETRY_AFTER_TIMEOUT = 15000;
    function getTimeoutFromThrottledRequest(error) {
        const { headers } = error || {};
        return ((headers &&
            Number.parseInt(headers['x-throttle-wait-seconds']) * 1000) ||
            DEFAULT_RETRY_AFTER_TIMEOUT);
    }
    function retryIfThrottled(fn, retryThrottledMaxTimes) {
        return retrier(({ attempt, retry }) => fn().catch((error) => {
            if ('response' in error &&
                (error === null || error === void 0 ? void 0 : error.code) === REQUEST_WAS_THROTTLED_CODE &&
                attempt < retryThrottledMaxTimes) {
                return retry(getTimeoutFromThrottledRequest(error));
            }
            throw error;
        }));
    }

    /**
     * Performs file uploading request to Uploadcare Upload API.
     * Can be canceled and has progress.
     */
    function base(file, { publicKey, fileName, baseURL = defaultSettings.baseURL, secureSignature, secureExpire, store, signal, onProgress, source = 'local', integration, userAgent, retryThrottledRequestMaxTimes = defaultSettings.retryThrottledRequestMaxTimes }) {
        return retryIfThrottled(() => {
            var _a;
            return request({
                method: 'POST',
                url: getUrl(baseURL, '/base/', {
                    jsonerrors: 1
                }),
                headers: {
                    'X-UC-User-Agent': getUserAgent({ publicKey, integration, userAgent })
                },
                data: buildFormData([
                    ['file', file, (_a = fileName !== null && fileName !== void 0 ? fileName : file.name) !== null && _a !== void 0 ? _a : defaultFilename],
                    ['UPLOADCARE_PUB_KEY', publicKey],
                    [
                        'UPLOADCARE_STORE',
                        typeof store === 'undefined' ? 'auto' : store ? 1 : 0
                    ],
                    ['signature', secureSignature],
                    ['expire', secureExpire],
                    ['source', source]
                ]),
                signal,
                onProgress
            }).then(({ data, headers, request }) => {
                const response = camelizeKeys(JSON.parse(data));
                if ('error' in response) {
                    throw new UploadClientError(response.error.content, response.error.errorCode, request, response, headers);
                }
                else {
                    return response;
                }
            });
        }, retryThrottledRequestMaxTimes);
    }

    var TypeEnum;
    (function (TypeEnum) {
        TypeEnum["Token"] = "token";
        TypeEnum["FileInfo"] = "file_info";
    })(TypeEnum || (TypeEnum = {}));
    /**
     * Uploading files from URL.
     */
    function fromUrl(sourceUrl, { publicKey, baseURL = defaultSettings.baseURL, store, fileName, checkForUrlDuplicates, saveUrlForRecurrentUploads, secureSignature, secureExpire, source = 'url', signal, integration, userAgent, retryThrottledRequestMaxTimes = defaultSettings.retryThrottledRequestMaxTimes }) {
        return retryIfThrottled(() => request({
            method: 'POST',
            headers: {
                'X-UC-User-Agent': getUserAgent({ publicKey, integration, userAgent })
            },
            url: getUrl(baseURL, '/from_url/', {
                jsonerrors: 1,
                pub_key: publicKey,
                source_url: sourceUrl,
                store: typeof store === 'undefined' ? 'auto' : store ? 1 : undefined,
                filename: fileName,
                check_URL_duplicates: checkForUrlDuplicates ? 1 : undefined,
                save_URL_duplicates: saveUrlForRecurrentUploads ? 1 : undefined,
                signature: secureSignature,
                expire: secureExpire,
                source: source
            }),
            signal
        }).then(({ data, headers, request }) => {
            const response = camelizeKeys(JSON.parse(data));
            if ('error' in response) {
                throw new UploadClientError(response.error.content, response.error.errorCode, request, response, headers);
            }
            else {
                return response;
            }
        }), retryThrottledRequestMaxTimes);
    }

    var Status;
    (function (Status) {
        Status["Unknown"] = "unknown";
        Status["Waiting"] = "waiting";
        Status["Progress"] = "progress";
        Status["Error"] = "error";
        Status["Success"] = "success";
    })(Status || (Status = {}));
    const isErrorResponse = (response) => {
        return 'status' in response && response.status === Status.Error;
    };
    /**
     * Checking upload status and working with file tokens.
     */
    function fromUrlStatus(token, { publicKey, baseURL = defaultSettings.baseURL, signal, integration, userAgent, retryThrottledRequestMaxTimes = defaultSettings.retryThrottledRequestMaxTimes } = {}) {
        return retryIfThrottled(() => request({
            method: 'GET',
            headers: publicKey
                ? {
                    'X-UC-User-Agent': getUserAgent({
                        publicKey,
                        integration,
                        userAgent
                    })
                }
                : undefined,
            url: getUrl(baseURL, '/from_url/status/', {
                jsonerrors: 1,
                token
            }),
            signal
        }).then(({ data, headers, request }) => {
            const response = camelizeKeys(JSON.parse(data));
            if ('error' in response && !isErrorResponse(response)) {
                throw new UploadClientError(response.error.content, undefined, request, response, headers);
            }
            else {
                return response;
            }
        }), retryThrottledRequestMaxTimes);
    }

    /**
     * Returns a JSON dictionary holding file info.
     */
    function info(uuid, { publicKey, baseURL = defaultSettings.baseURL, signal, source, integration, userAgent, retryThrottledRequestMaxTimes = defaultSettings.retryThrottledRequestMaxTimes }) {
        return retryIfThrottled(() => request({
            method: 'GET',
            headers: {
                'X-UC-User-Agent': getUserAgent({ publicKey, integration, userAgent })
            },
            url: getUrl(baseURL, '/info/', {
                jsonerrors: 1,
                pub_key: publicKey,
                file_id: uuid,
                source
            }),
            signal
        }).then(({ data, headers, request }) => {
            const response = camelizeKeys(JSON.parse(data));
            if ('error' in response) {
                throw new UploadClientError(response.error.content, response.error.errorCode, request, response, headers);
            }
            else {
                return response;
            }
        }), retryThrottledRequestMaxTimes);
    }

    /**
     * Start multipart uploading.
     */
    function multipartStart(size, { publicKey, contentType, fileName, multipartChunkSize = defaultSettings.multipartChunkSize, baseURL = '', secureSignature, secureExpire, store, signal, source = 'local', integration, userAgent, retryThrottledRequestMaxTimes = defaultSettings.retryThrottledRequestMaxTimes }) {
        return retryIfThrottled(() => request({
            method: 'POST',
            url: getUrl(baseURL, '/multipart/start/', { jsonerrors: 1 }),
            headers: {
                'X-UC-User-Agent': getUserAgent({ publicKey, integration, userAgent })
            },
            data: buildFormData([
                ['filename', fileName !== null && fileName !== void 0 ? fileName : defaultFilename],
                ['size', size],
                ['content_type', contentType !== null && contentType !== void 0 ? contentType : defaultContentType],
                ['part_size', multipartChunkSize],
                ['UPLOADCARE_STORE', store ? '' : 'auto'],
                ['UPLOADCARE_PUB_KEY', publicKey],
                ['signature', secureSignature],
                ['expire', secureExpire],
                ['source', source]
            ]),
            signal
        }).then(({ data, headers, request }) => {
            const response = camelizeKeys(JSON.parse(data));
            if ('error' in response) {
                throw new UploadClientError(response.error.content, response.error.errorCode, request, response, headers);
            }
            else {
                // convert to array
                response.parts = Object.keys(response.parts).map((key) => response.parts[key]);
                return response;
            }
        }), retryThrottledRequestMaxTimes);
    }

    /**
     * Complete multipart uploading.
     */
    function multipartUpload(part, url, { signal, onProgress }) {
        return request({
            method: 'PUT',
            url,
            data: part,
            // Upload request can't be non-computable because we always know exact size
            onProgress: onProgress,
            signal
        })
            .then((result) => {
            // hack for node ¯\_(ツ)_/¯
            if (onProgress)
                onProgress({
                    isComputable: true,
                    value: 1
                });
            return result;
        })
            .then(({ status }) => ({ code: status }));
    }

    /**
     * Complete multipart uploading.
     */
    function multipartComplete(uuid, { publicKey, baseURL = defaultSettings.baseURL, source = 'local', signal, integration, userAgent, retryThrottledRequestMaxTimes = defaultSettings.retryThrottledRequestMaxTimes }) {
        return retryIfThrottled(() => request({
            method: 'POST',
            url: getUrl(baseURL, '/multipart/complete/', { jsonerrors: 1 }),
            headers: {
                'X-UC-User-Agent': getUserAgent({ publicKey, integration, userAgent })
            },
            data: buildFormData([
                ['uuid', uuid],
                ['UPLOADCARE_PUB_KEY', publicKey],
                ['source', source]
            ]),
            signal
        }).then(({ data, headers, request }) => {
            const response = camelizeKeys(JSON.parse(data));
            if ('error' in response) {
                throw new UploadClientError(response.error.content, response.error.errorCode, request, response, headers);
            }
            else {
                return response;
            }
        }), retryThrottledRequestMaxTimes);
    }

    class UploadcareFile {
        constructor(fileInfo, { baseCDN, defaultEffects, fileName }) {
            this.name = null;
            this.size = null;
            this.isStored = null;
            this.isImage = null;
            this.mimeType = null;
            this.cdnUrl = null;
            this.cdnUrlModifiers = null;
            this.originalUrl = null;
            this.originalFilename = null;
            this.imageInfo = null;
            this.videoInfo = null;
            const { uuid, s3Bucket } = fileInfo;
            const urlBase = s3Bucket
                ? `https://${s3Bucket}.s3.amazonaws.com/${uuid}/${fileInfo.filename}`
                : `${baseCDN}/${uuid}/`;
            const cdnUrlModifiers = defaultEffects ? `-/${defaultEffects}` : null;
            const cdnUrl = `${urlBase}${cdnUrlModifiers || ''}`;
            const originalUrl = uuid ? urlBase : null;
            this.uuid = uuid;
            this.name = fileName || fileInfo.filename;
            this.size = fileInfo.size;
            this.isStored = fileInfo.isStored;
            this.isImage = fileInfo.isImage;
            this.mimeType = fileInfo.mimeType;
            this.cdnUrl = cdnUrl;
            this.cdnUrlModifiers = cdnUrlModifiers;
            this.originalUrl = originalUrl;
            this.originalFilename = fileInfo.originalFilename;
            this.imageInfo = camelizeKeys(fileInfo.imageInfo);
            this.videoInfo = camelizeKeys(fileInfo.videoInfo);
        }
    }

    const DEFAULT_INTERVAL = 500;
    const poll = ({ check, interval = DEFAULT_INTERVAL, signal }) => new Promise((resolve, reject) => {
        let timeoutId;
        onCancel(signal, () => {
            timeoutId && clearTimeout(timeoutId);
            reject(cancelError('Poll cancelled'));
        });
        const tick = () => {
            try {
                Promise.resolve(check(signal))
                    .then((result) => {
                    if (result) {
                        resolve(result);
                    }
                    else {
                        timeoutId = setTimeout(tick, interval);
                    }
                })
                    .catch((error) => reject(error));
            }
            catch (error) {
                reject(error);
            }
        };
        timeoutId = setTimeout(tick, 0);
    });

    function isReadyPoll({ file, publicKey, baseURL, source, integration, userAgent, retryThrottledRequestMaxTimes, signal, onProgress }) {
        return poll({
            check: (signal) => info(file, {
                publicKey,
                baseURL,
                signal,
                source,
                integration,
                userAgent,
                retryThrottledRequestMaxTimes
            }).then((response) => {
                if (response.isReady) {
                    return response;
                }
                onProgress && onProgress({ isComputable: true, value: 1 });
                return false;
            }),
            signal
        });
    }

    const uploadFromObject = (file, { publicKey, fileName, baseURL, secureSignature, secureExpire, store, signal, onProgress, source, integration, userAgent, retryThrottledRequestMaxTimes, baseCDN }) => {
        return base(file, {
            publicKey,
            fileName,
            baseURL,
            secureSignature,
            secureExpire,
            store,
            signal,
            onProgress,
            source,
            integration,
            userAgent,
            retryThrottledRequestMaxTimes
        })
            .then(({ file }) => {
            return isReadyPoll({
                file,
                publicKey,
                baseURL,
                source,
                integration,
                userAgent,
                retryThrottledRequestMaxTimes,
                onProgress,
                signal
            });
        })
            .then((fileInfo) => new UploadcareFile(fileInfo, { baseCDN }));
    };

    /*globals self, window */

    /*eslint-disable @mysticatea/prettier */
    const { AbortController, AbortSignal } =
        typeof self !== "undefined" ? self :
        typeof window !== "undefined" ? window :
        /* otherwise */ undefined;

    const race = (fns, { signal } = {}) => {
        let lastError = null;
        let winnerIndex = null;
        const controllers = fns.map(() => new AbortController());
        const createStopRaceCallback = (i) => () => {
            winnerIndex = i;
            controllers.forEach((controller, index) => index !== i && controller.abort());
        };
        onCancel(signal, () => {
            controllers.forEach((controller) => controller.abort());
        });
        return Promise.all(fns.map((fn, i) => {
            const stopRace = createStopRaceCallback(i);
            return Promise.resolve()
                .then(() => fn({ stopRace, signal: controllers[i].signal }))
                .then((result) => {
                stopRace();
                return result;
            })
                .catch((error) => {
                lastError = error;
                return null;
            });
        })).then((results) => {
            if (winnerIndex === null) {
                throw lastError;
            }
            else {
                return results[winnerIndex];
            }
        });
    };

    var WebSocket = window.WebSocket;

    class Events {
        constructor() {
            this.events = Object.create({});
        }
        emit(event, data) {
            var _a;
            (_a = this.events[event]) === null || _a === void 0 ? void 0 : _a.forEach((fn) => fn(data));
        }
        on(event, callback) {
            this.events[event] = this.events[event] || [];
            this.events[event].push(callback);
        }
        off(event, callback) {
            if (callback) {
                this.events[event] = this.events[event].filter((fn) => fn !== callback);
            }
            else {
                this.events[event] = [];
            }
        }
    }

    const response = (type, data) => {
        if (type === 'success') {
            return Object.assign({ status: Status.Success }, data);
        }
        if (type === 'progress') {
            return Object.assign({ status: Status.Progress }, data);
        }
        return Object.assign({ status: Status.Error }, data);
    };
    class Pusher {
        constructor(pusherKey, disconnectTime = 30000) {
            this.ws = undefined;
            this.queue = [];
            this.isConnected = false;
            this.subscribers = 0;
            this.emmitter = new Events();
            this.disconnectTimeoutId = null;
            this.key = pusherKey;
            this.disconnectTime = disconnectTime;
        }
        connect() {
            this.disconnectTimeoutId && clearTimeout(this.disconnectTimeoutId);
            if (!this.isConnected && !this.ws) {
                const pusherUrl = `wss://ws.pusherapp.com/app/${this.key}?protocol=5&client=js&version=1.12.2`;
                this.ws = new WebSocket(pusherUrl);
                this.ws.addEventListener('error', (error) => {
                    this.emmitter.emit('error', new Error(error.message));
                });
                this.emmitter.on('connected', () => {
                    this.isConnected = true;
                    this.queue.forEach((message) => this.send(message.event, message.data));
                    this.queue = [];
                });
                this.ws.addEventListener('message', (e) => {
                    const data = JSON.parse(e.data.toString());
                    switch (data.event) {
                        case 'pusher:connection_established': {
                            this.emmitter.emit('connected', undefined);
                            break;
                        }
                        case 'pusher:ping': {
                            this.send('pusher:pong', {});
                            break;
                        }
                        case 'progress':
                        case 'success':
                        case 'fail': {
                            this.emmitter.emit(data.channel, response(data.event, JSON.parse(data.data)));
                        }
                    }
                });
            }
        }
        disconnect() {
            const actualDisconect = () => {
                var _a;
                (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
                this.ws = undefined;
                this.isConnected = false;
            };
            if (this.disconnectTime) {
                this.disconnectTimeoutId = setTimeout(() => {
                    actualDisconect();
                }, this.disconnectTime);
            }
            else {
                actualDisconect();
            }
        }
        send(event, data) {
            var _a;
            const str = JSON.stringify({ event, data });
            (_a = this.ws) === null || _a === void 0 ? void 0 : _a.send(str);
        }
        subscribe(token, handler) {
            this.subscribers += 1;
            this.connect();
            const channel = `task-status-${token}`;
            const message = {
                event: 'pusher:subscribe',
                data: { channel }
            };
            this.emmitter.on(channel, handler);
            if (this.isConnected) {
                this.send(message.event, message.data);
            }
            else {
                this.queue.push(message);
            }
        }
        unsubscribe(token) {
            this.subscribers -= 1;
            const channel = `task-status-${token}`;
            const message = {
                event: 'pusher:unsubscribe',
                data: { channel }
            };
            this.emmitter.off(channel);
            if (this.isConnected) {
                this.send(message.event, message.data);
            }
            else {
                this.queue = this.queue.filter((msg) => msg.data.channel !== channel);
            }
            if (this.subscribers === 0) {
                this.disconnect();
            }
        }
        onError(callback) {
            this.emmitter.on('error', callback);
            return () => this.emmitter.off('error', callback);
        }
    }
    let pusher = null;
    const getPusher = (key) => {
        if (!pusher) {
            // no timeout for nodeJS and 30000 ms for browser
            const disconectTimeout = typeof window === 'undefined' ? 0 : 30000;
            pusher = new Pusher(key, disconectTimeout);
        }
        return pusher;
    };
    const preconnect = (key) => {
        getPusher(key).connect();
    };

    function pollStrategy({ token, publicKey, baseURL, integration, userAgent, retryThrottledRequestMaxTimes, onProgress, signal }) {
        return poll({
            check: (signal) => fromUrlStatus(token, {
                publicKey,
                baseURL,
                integration,
                userAgent,
                retryThrottledRequestMaxTimes,
                signal
            }).then((response) => {
                switch (response.status) {
                    case Status.Error: {
                        return new UploadClientError(response.error, response.errorCode);
                    }
                    case Status.Waiting: {
                        return false;
                    }
                    case Status.Unknown: {
                        return new UploadClientError(`Token "${token}" was not found.`);
                    }
                    case Status.Progress: {
                        if (onProgress) {
                            if (response.total === 'unknown') {
                                onProgress({ isComputable: false });
                            }
                            else {
                                onProgress({
                                    isComputable: true,
                                    value: response.done / response.total
                                });
                            }
                        }
                        return false;
                    }
                    case Status.Success: {
                        if (onProgress)
                            onProgress({
                                isComputable: true,
                                value: response.done / response.total
                            });
                        return response;
                    }
                    default: {
                        throw new Error('Unknown status');
                    }
                }
            }),
            signal
        });
    }
    const pushStrategy = ({ token, pusherKey, signal, onProgress }) => new Promise((resolve, reject) => {
        const pusher = getPusher(pusherKey);
        const unsubErrorHandler = pusher.onError(reject);
        const destroy = () => {
            unsubErrorHandler();
            pusher.unsubscribe(token);
        };
        onCancel(signal, () => {
            destroy();
            reject(cancelError('pusher cancelled'));
        });
        pusher.subscribe(token, (result) => {
            switch (result.status) {
                case Status.Progress: {
                    if (onProgress) {
                        if (result.total === 'unknown') {
                            onProgress({ isComputable: false });
                        }
                        else {
                            onProgress({
                                isComputable: true,
                                value: result.done / result.total
                            });
                        }
                    }
                    break;
                }
                case Status.Success: {
                    destroy();
                    if (onProgress)
                        onProgress({
                            isComputable: true,
                            value: result.done / result.total
                        });
                    resolve(result);
                    break;
                }
                case Status.Error: {
                    destroy();
                    reject(new UploadClientError(result.msg, result.error_code));
                }
            }
        });
    });
    const uploadFromUrl = (sourceUrl, { publicKey, fileName, baseURL, baseCDN, checkForUrlDuplicates, saveUrlForRecurrentUploads, secureSignature, secureExpire, store, signal, onProgress, source, integration, userAgent, retryThrottledRequestMaxTimes, pusherKey = defaultSettings.pusherKey }) => Promise.resolve(preconnect(pusherKey))
        .then(() => fromUrl(sourceUrl, {
        publicKey,
        fileName,
        baseURL,
        checkForUrlDuplicates,
        saveUrlForRecurrentUploads,
        secureSignature,
        secureExpire,
        store,
        signal,
        source,
        integration,
        userAgent,
        retryThrottledRequestMaxTimes
    }))
        .catch((error) => {
        const pusher = getPusher(pusherKey);
        pusher === null || pusher === void 0 ? void 0 : pusher.disconnect();
        return Promise.reject(error);
    })
        .then((urlResponse) => {
        if (urlResponse.type === TypeEnum.FileInfo) {
            return urlResponse;
        }
        else {
            return race([
                ({ signal }) => pollStrategy({
                    token: urlResponse.token,
                    publicKey,
                    baseURL,
                    integration,
                    userAgent,
                    retryThrottledRequestMaxTimes,
                    onProgress,
                    signal
                }),
                ({ signal }) => pushStrategy({
                    token: urlResponse.token,
                    pusherKey,
                    signal,
                    onProgress
                })
            ], { signal });
        }
    })
        .then((result) => {
        if (result instanceof UploadClientError)
            throw result;
        return result;
    })
        .then((result) => isReadyPoll({
        file: result.uuid,
        publicKey,
        baseURL,
        integration,
        userAgent,
        retryThrottledRequestMaxTimes,
        onProgress,
        signal
    }))
        .then((fileInfo) => new UploadcareFile(fileInfo, { baseCDN }));

    const uploadFromUploaded = (uuid, { publicKey, fileName, baseURL, signal, onProgress, source, integration, userAgent, retryThrottledRequestMaxTimes, baseCDN }) => {
        return info(uuid, {
            publicKey,
            baseURL,
            signal,
            source,
            integration,
            userAgent,
            retryThrottledRequestMaxTimes
        })
            .then((fileInfo) => new UploadcareFile(fileInfo, { baseCDN, fileName }))
            .then((result) => {
            // hack for node ¯\_(ツ)_/¯
            if (onProgress)
                onProgress({
                    isComputable: true,
                    value: 1
                });
            return result;
        });
    };

    /**
     * FileData type guard.
     */
    const isFileData = (data) => {
        return (data !== undefined &&
            ((typeof Blob !== 'undefined' && data instanceof Blob) ||
                (typeof File !== 'undefined' && data instanceof File) ||
                (typeof Buffer !== 'undefined' && data instanceof Buffer)));
    };
    /**
     * Uuid type guard.
     */
    const isUuid = (data) => {
        const UUID_REGEX = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}';
        const regExp = new RegExp(UUID_REGEX);
        return !isFileData(data) && regExp.test(data);
    };
    /**
     * Url type guard.
     *
     * @param {NodeFile | BrowserFile | Url | Uuid} data
     */
    const isUrl = (data) => {
        const URL_REGEX = '^(?:\\w+:)?\\/\\/([^\\s\\.]+\\.\\S{2}|localhost[\\:?\\d]*)\\S*$';
        const regExp = new RegExp(URL_REGEX);
        return !isFileData(data) && regExp.test(data);
    };

    /**
     * Get file size.
     */
    const getFileSize = (file) => {
        return file.length || file.size;
    };
    /**
     * Check if FileData is multipart data.
     */
    const isMultipart = (fileSize, multipartMinFileSize = defaultSettings.multipartMinFileSize) => {
        return fileSize >= multipartMinFileSize;
    };

    const sliceChunk = (file, index, fileSize, chunkSize) => {
        const start = chunkSize * index;
        const end = Math.min(start + chunkSize, fileSize);
        return file.slice(start, end);
    };

    function prepareChunks(file, fileSize, chunkSize) {
        return (index) => sliceChunk(file, index, fileSize, chunkSize);
    }

    const runWithConcurrency = (concurrency, tasks) => {
        return new Promise((resolve, reject) => {
            const results = [];
            let rejected = false;
            let settled = tasks.length;
            const forRun = [...tasks];
            const run = () => {
                const index = tasks.length - forRun.length;
                const next = forRun.shift();
                if (next) {
                    next()
                        .then((result) => {
                        if (rejected)
                            return;
                        results[index] = result;
                        settled -= 1;
                        if (settled) {
                            run();
                        }
                        else {
                            resolve(results);
                        }
                    })
                        .catch((error) => {
                        rejected = true;
                        reject(error);
                    });
                }
            };
            for (let i = 0; i < concurrency; i++) {
                run();
            }
        });
    };

    const uploadPartWithRetry = (chunk, url, { publicKey, onProgress, signal, integration, multipartMaxAttempts }) => retrier(({ attempt, retry }) => multipartUpload(chunk, url, {
        publicKey,
        onProgress,
        signal,
        integration
    }).catch((error) => {
        if (attempt < multipartMaxAttempts) {
            return retry();
        }
        throw error;
    }));
    const uploadMultipart = (file, { publicKey, fileName, fileSize, baseURL, secureSignature, secureExpire, store, signal, onProgress, source, integration, userAgent, retryThrottledRequestMaxTimes, contentType, multipartChunkSize = defaultSettings.multipartChunkSize, maxConcurrentRequests = defaultSettings.maxConcurrentRequests, multipartMaxAttempts = defaultSettings.multipartMaxAttempts, baseCDN }) => {
        const size = fileSize || getFileSize(file);
        let progressValues;
        const createProgressHandler = (totalChunks, chunkIdx) => {
            if (!onProgress)
                return;
            if (!progressValues) {
                progressValues = Array(totalChunks).fill(0);
            }
            const sum = (values) => values.reduce((sum, next) => sum + next, 0);
            return (info) => {
                if (!info.isComputable) {
                    return;
                }
                progressValues[chunkIdx] = info.value;
                onProgress({
                    isComputable: true,
                    value: sum(progressValues) / totalChunks
                });
            };
        };
        return multipartStart(size, {
            publicKey,
            contentType,
            fileName: fileName !== null && fileName !== void 0 ? fileName : file.name,
            baseURL,
            secureSignature,
            secureExpire,
            store,
            signal,
            source,
            integration,
            userAgent,
            retryThrottledRequestMaxTimes
        })
            .then(({ uuid, parts }) => {
            const getChunk = prepareChunks(file, size, multipartChunkSize);
            return Promise.all([
                uuid,
                runWithConcurrency(maxConcurrentRequests, parts.map((url, index) => () => uploadPartWithRetry(getChunk(index), url, {
                    publicKey,
                    onProgress: createProgressHandler(parts.length, index),
                    signal,
                    integration,
                    multipartMaxAttempts
                })))
            ]);
        })
            .then(([uuid]) => multipartComplete(uuid, {
            publicKey,
            baseURL,
            source,
            integration,
            userAgent,
            retryThrottledRequestMaxTimes
        }))
            .then((fileInfo) => {
            if (fileInfo.isReady) {
                return fileInfo;
            }
            else {
                return isReadyPoll({
                    file: fileInfo.uuid,
                    publicKey,
                    baseURL,
                    source,
                    integration,
                    userAgent,
                    retryThrottledRequestMaxTimes,
                    onProgress,
                    signal
                });
            }
        })
            .then((fileInfo) => new UploadcareFile(fileInfo, { baseCDN }));
    };

    /**
     * Uploads file from provided data.
     */
    function uploadFile(data, { publicKey, fileName, baseURL = defaultSettings.baseURL, secureSignature, secureExpire, store, signal, onProgress, source, integration, userAgent, retryThrottledRequestMaxTimes, contentType, multipartChunkSize, multipartMaxAttempts, maxConcurrentRequests, baseCDN = defaultSettings.baseCDN, checkForUrlDuplicates, saveUrlForRecurrentUploads, pusherKey }) {
        if (isFileData(data)) {
            const fileSize = getFileSize(data);
            if (isMultipart(fileSize)) {
                return uploadMultipart(data, {
                    publicKey,
                    contentType,
                    multipartChunkSize,
                    multipartMaxAttempts,
                    fileName,
                    baseURL,
                    secureSignature,
                    secureExpire,
                    store,
                    signal,
                    onProgress,
                    source,
                    integration,
                    userAgent,
                    maxConcurrentRequests,
                    retryThrottledRequestMaxTimes,
                    baseCDN
                });
            }
            return uploadFromObject(data, {
                publicKey,
                fileName,
                baseURL,
                secureSignature,
                secureExpire,
                store,
                signal,
                onProgress,
                source,
                integration,
                userAgent,
                retryThrottledRequestMaxTimes,
                baseCDN
            });
        }
        if (isUrl(data)) {
            return uploadFromUrl(data, {
                publicKey,
                fileName,
                baseURL,
                baseCDN,
                checkForUrlDuplicates,
                saveUrlForRecurrentUploads,
                secureSignature,
                secureExpire,
                store,
                signal,
                onProgress,
                source,
                integration,
                userAgent,
                retryThrottledRequestMaxTimes,
                pusherKey
            });
        }
        if (isUuid(data)) {
            return uploadFromUploaded(data, {
                publicKey,
                fileName,
                baseURL,
                signal,
                onProgress,
                source,
                integration,
                userAgent,
                retryThrottledRequestMaxTimes,
                baseCDN
            });
        }
        throw new TypeError(`File uploading from "${data}" is not supported`);
    }

    /** @enum {{ type; value; nullable?: Boolean }} */
    const uploadEntrySchema = Object.freeze({
      file: {
        type: File,
        value: null,
      },
      externalUrl: {
        type: String,
        value: null,
      },
      fileName: {
        type: String,
        value: null,
      },
      fileSize: {
        type: Number,
        value: null,
      },
      lastModified: {
        type: Number,
        value: Date.now(),
      },
      uploadProgress: {
        type: Number,
        value: 0,
      },
      uuid: {
        type: String,
        value: null,
      },
      isImage: {
        type: Boolean,
        value: false,
      },
      mimeType: {
        type: String,
        value: null,
      },
      uploadError: {
        type: UploadClientError,
        value: null,
        nullable: true,
      },
      validationErrorMsg: {
        type: String,
        value: null,
        nullable: true,
      },
      ctxName: {
        type: String,
        value: null,
      },
      transformationsUrl: {
        type: String,
        value: null,
      },
      fileInfo: {
        type: UploadcareFile,
        value: null,
      },
      isUploading: {
        type: Boolean,
        value: false,
      },
    });

    const ACTIVE_ATTR = 'active';
    const ACTIVE_PROP = '___ACTIVITY_IS_ACTIVE___';
    const TAG_PREFIX = 'uc-';
    const CSS_ATTRIBUTE = 'css-src';

    let DOC_READY = document.readyState === 'complete';
    if (!DOC_READY) {
      window.addEventListener('load', () => {
        DOC_READY = true;
      });
    }

    class Block extends BaseComponent {
      /**
       * @param {String} str
       * @returns {String}
       */
      l10n(str) {
        return this.getCssData('--l10n-' + str, true) || str;
      }

      constructor() {
        super();
        /** @type {String} */
        this.activityType = null;
        this.addTemplateProcessor(l10nProcessor);
        /**
         * @private
         * @type {String[]}
         */
        this.__l10nKeys = [];
        /** @private */
        this.__l10nUpdate = () => {
          this.dropCssDataCache();
          for (let key of this.__l10nKeys) {
            this.notify(key);
          }
        };
        window.addEventListener('uc-l10n-update', this.__l10nUpdate);
      }

      /**
       * @param {String} localPropKey
       * @param {String} l10nKey
       */
      applyL10nKey(localPropKey, l10nKey) {
        this.$['l10n:' + localPropKey] = l10nKey;
      }

      historyBack() {
        /** @type {String[]} */
        let history = this.$['*history'];
        history.pop();
        let prevActivity = history.pop();
        this.$['*currentActivity'] = prevActivity;
        this.$['*history'] = history;
      }

      /** @param {File[]} files */
      addFiles(files) {
        files.forEach((/** @type {File} */ file) => {
          this.uploadCollection.add({
            file,
            isImage: file.type.includes('image'),
            mimeType: file.type,
            fileName: file.name,
            fileSize: file.size,
          });
        });
      }

      connectedCallback() {
        let handleReadyState = () => {
          if (DOC_READY) {
            this.connected();
          } else {
            window.addEventListener('load', () => {
              this.connected();
            });
          }
        };
        let href = this.getAttribute(CSS_ATTRIBUTE);
        if (href) {
          this.renderShadow = true;
          this.attachShadow({
            mode: 'open',
          });
          let link = document.createElement('link');
          link.rel = 'stylesheet';
          link.type = 'text/css';
          link.href = href;
          link.onload = () => {
            // CSS modules can be not loaded at this moment
            // TODO: investigate better solution
            window.requestAnimationFrame(() => {
              handleReadyState();
            });
          };
          this.shadowRoot.appendChild(link);
        } else {
          handleReadyState();
        }
      }

      /** @private */
      __bindBasicCssData() {
        if (!Block._cssDataBindingsList.includes(this.ctxName)) {
          let unprefixedCfgProps = [
            'pubkey',
            'store',
            'multiple',
            'max-files',
            'accept',
            'confirm-upload',
            'init-activity',
            'done-activity',
          ];
          unprefixedCfgProps.forEach((prop) => {
            this.bindCssData(`--cfg-${prop}`);
          }, true);
          Block._cssDataBindingsList.push(this.ctxName);
        }
      }

      initCallback() {
        // TODO: rethink initiation flow for the common context parameters
        this.__bindBasicCssData();
        // ^ in this case css-data-props will be initiated when there is one or more components without initCallback call
      }

      connected() {
        if (!this.__connectedOnce) {
          if (!Block._ctxConnectionsList.includes(this.ctxName)) {
            this.add$({
              '*ctxTargetsRegistry': new Set(),
              '*currentActivity': '',
              '*currentActivityParams': {},
              '*history': [],
              '*commonProgress': 0,
              '*uploadList': [],
              '*outputData': null,
              '*focusedEntry': null,
            });
            Block._ctxConnectionsList.push(this.ctxName);
          }
          this.$['*ctxTargetsRegistry'].add(this.constructor['is']);

          super.connectedCallback();

          if (this.activityType) {
            if (!this.hasAttribute('activity')) {
              this.setAttribute('activity', this.activityType);
            }
            this.sub('*currentActivity', (/** @type {String} */ val) => {
              let activityKey = this.ctxName + this.activityType;
              let actDesc = Block._activityRegistry[activityKey];

              if (this.activityType !== val && this[ACTIVE_PROP]) {
                /** @private */
                this[ACTIVE_PROP] = false;
                this.removeAttribute(ACTIVE_ATTR);
                actDesc?.deactivateCallback?.();
                // console.log(`Activity "${this.activityType}" deactivated`);
              } else if (this.activityType === val && !this[ACTIVE_PROP]) {
                /** @private */
                this[ACTIVE_PROP] = true;
                this.setAttribute(ACTIVE_ATTR, '');
                actDesc?.activateCallback?.();
                // console.log(`Activity "${this.activityType}" activated`);

                let history = this.$['*history'];
                if (history.length > 10) {
                  history = history.slice(history.length - 11, history.length - 1);
                }
                history.push(this.activityType);
                this.$['*history'] = history;
              }
            });
          }
          /** @private */
          this.__connectedOnce = true;
        } else {
          super.connectedCallback();
        }
      }

      openSystemDialog() {
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.multiple = !!this.$['*--cfg-multiple'];
        this.fileInput.max = this.$['*--cfg-max-files'];
        this.fileInput.accept = this.$['*--cfg-accept'];
        this.fileInput.dispatchEvent(new MouseEvent('click'));
        this.fileInput.onchange = () => {
          this.addFiles([...this.fileInput['files']]);
          // To call uploadTrigger UploadList should draw file items first:
          this.$['*currentActivity'] = Block.activities.UPLOAD_LIST;
          this.fileInput['value'] = '';
          this.fileInput = null;
        };
      }

      /** @type {String[]} */
      get sourceList() {
        let list = null;
        if (this.$['*--cfg-source-list']) {
          list = this.$['*--cfg-source-list'].split(',').map((/** @type {String} */ item) => {
            return item.trim();
          });
        }
        return list;
      }

      /** @type {String} */
      get initActivity() {
        return this.$['*--cfg-init-activity'];
      }

      /** @type {String} */
      get doneActivity() {
        return this.$['*--cfg-done-activity'];
      }

      get isActivityActive() {
        return this[ACTIVE_PROP];
      }

      /** @param {Boolean} [force] */
      initFlow(force = false) {
        if (this.$['*uploadList']?.length && !force) {
          this.set$({
            '*currentActivity': Block.activities.UPLOAD_LIST,
          });
          this.setForCtxTarget('uc-modal', '*modalActive', true);
        } else {
          if (this.sourceList?.length === 1) {
            let srcKey = this.sourceList[0];
            // Single source case:
            if (srcKey === 'local') {
              this.$['*currentActivity'] = Block.activities.UPLOAD_LIST;
              this.openSystemDialog();
            } else {
              if (Object.values(Block.extSrcList).includes(srcKey)) {
                this.set$({
                  '*currentActivityParams': {
                    externalSourceType: srcKey,
                  },
                  '*currentActivity': Block.activities.EXTERNAL,
                });
              } else {
                this.$['*currentActivity'] = srcKey;
              }
              this.setForCtxTarget('uc-modal', '*modalActive', true);
            }
          } else {
            // Multiple sources case:
            this.set$({
              '*currentActivity': Block.activities.START_FROM,
            });
            this.setForCtxTarget('uc-modal', '*modalActive', true);
          }
        }
      }

      cancelFlow() {
        if (this.sourceList?.length === 1) {
          this.$['*currentActivity'] = null;
          this.setForCtxTarget('uc-modal', '*modalActive', false);
        } else {
          this.historyBack();
          if (!this.$['*currentActivity']) {
            this.setForCtxTarget('uc-modal', '*modalActive', false);
          }
        }
      }

      /**
       * @param {String} targetTagName
       * @returns {Boolean}
       */
      checkCtxTarget(targetTagName) {
        /** @type {Set} */
        let registry = this.$['*ctxTargetsRegistry'];
        return registry.has(targetTagName);
      }

      /**
       * @param {String} targetTagName
       * @param {String} prop
       * @param {any} newVal
       */
      setForCtxTarget(targetTagName, prop, newVal) {
        if (this.checkCtxTarget(targetTagName)) {
          this.$[prop] = newVal;
        }
      }

      /**
       * @param {String} name
       * @param {() => void} [activateCallback]
       * @param {() => void} [deactivateCallback]
       */
      registerActivity(name, activateCallback, deactivateCallback) {
        if (!Block._activityRegistry) {
          Block._activityRegistry = Object.create(null);
        }
        let actKey = this.ctxName + name;
        Block._activityRegistry[actKey] = {
          activateCallback,
          deactivateCallback,
        };
      }

      get activityParams() {
        return this.$['*currentActivityParams'];
      }

      /** @returns {import('../submodules/symbiote/core/symbiote.js').TypedCollection} */
      get uploadCollection() {
        if (!this.has('*uploadCollection')) {
          let uploadCollection = new TypedCollection({
            typedSchema: uploadEntrySchema,
            watchList: ['uploadProgress', 'uuid'],
            handler: (entries) => {
              this.$['*uploadList'] = entries;
            },
          });
          uploadCollection.observe((changeMap) => {
            if (changeMap.uploadProgress) {
              let commonProgress = 0;
              /** @type {String[]} */
              let items = uploadCollection.findItems((entry) => {
                return !entry.getValue('uploadError');
              });
              items.forEach((id) => {
                commonProgress += uploadCollection.readProp(id, 'uploadProgress');
              });
              this.$['*commonProgress'] = commonProgress / items.length;
            }
          });
          this.add('*uploadCollection', uploadCollection);
        }
        return this.$['*uploadCollection'];
      }

      /**
       * @param {Number} bytes
       * @param {Number} [decimals]
       */
      fileSizeFmt(bytes, decimals = 2) {
        let units = ['B', 'KB', 'MB', 'GB', 'TB'];
        /**
         * @param {String} str
         * @returns {String}
         */
        let getUnit = (str) => {
          return this.getCssData('--l10n-unit-' + str.toLowerCase(), true) || str;
        };
        if (bytes === 0) {
          return `0 ${getUnit(units[0])}`;
        }
        let k = 1024;
        let dm = decimals < 0 ? 0 : decimals;
        let i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / k ** i).toFixed(dm)) + ' ' + getUnit(units[i]);
      }

      output() {
        let data = [];
        let items = this.uploadCollection.items();
        items.forEach((itemId) => {
          let uploadEntryData = Data.getNamedCtx(itemId).store;
          let info = uploadEntryData.fileInfo;
          data.push(info);
        });
        this.$['*outputData'] = data;
      }

      destroyCallback() {
        window.removeEventListener('uc-l10n-update', this.__l10nUpdate);
        /** @private */
        this.__l10nKeys = null;
        // TODO: destroy uploadCollection
      }

      /** @param {String} name? */
      static reg(name) {
        if (!name) {
          super.reg();
          return;
        }
        super.reg(name.startsWith(TAG_PREFIX) ? name : TAG_PREFIX + name);
      }

      /**
       * @private
       * @type {{ string: { activateCallback: Function; deactivateCallback: Function } }}
       */
      static _activityRegistry = Object.create(null);

      /**
       * @private
       * @type {String[]}
       */
      static _ctxConnectionsList = [];

      /**
       * @private
       * @type {String[]}
       */
      static _cssDataBindingsList = [];
    }

    /** @enum {String} */
    Block.activities = Object.freeze({
      START_FROM: 'start-from',
      CAMERA: 'camera',
      DRAW: 'draw',
      UPLOAD_LIST: 'upload-list',
      URL: 'url',
      CONFIRMATION: 'confirmation',
      CLOUD_IMG_EDIT: 'cloud-image-edit',
      EXTERNAL: 'external',
      DETAILS: 'details',
    });

    /** @enum {String} */
    Block.extSrcList = Object.freeze({
      FACEBOOK: 'facebook',
      DROPBOX: 'dropbox',
      GDRIVE: 'gdrive',
      GPHOTOS: 'gphotos',
      INSTAGRAM: 'instagram',
      FLICKR: 'flickr',
      VK: 'vk',
      EVERNOTE: 'evernote',
      BOX: 'box',
      ONEDRIVE: 'onedrive',
      HUDDLE: 'huddle',
    });

    /** @enum {String} */
    Block.sourceTypes = Object.freeze({
      LOCAL: 'local',
      URL: 'url',
      CAMERA: 'camera',
      DRAW: 'draw',
      ...Block.extSrcList,
    });

    class Icon extends Block {
      init$ = {
        name: '',
        path: '',
        size: '24',
        viewBox: '',
      };

      initCallback() {
        super.initCallback();
        this.sub('name', (val) => {
          if (!val) {
            return;
          }
          let path = this.getCssData(`--icon-${val}`);
          if (path) {
            this.$.path = path;
          }
        });

        this.sub('path', (path) => {
          if (!path) {
            return;
          }
          let isRaw = path.trimStart().startsWith('<');
          if (isRaw) {
            this.setAttribute('raw', '');
            this.ref.svg.innerHTML = path;
          } else {
            this.removeAttribute('raw');
            this.ref.svg.innerHTML = `<path d="${path}"></path>`;
          }
        });

        this.sub('size', (size) => {
          this.$.viewBox = `0 0 ${size} ${size}`;
        });
      }
    }

    Icon.template = /*html*/ `
<svg
  ref="svg"
  xmlns="http://www.w3.org/2000/svg"
  set="@viewBox: viewBox; @height: size; @width: size">
</svg>
`;

    Icon.bindAttributes({
      name: 'name',
      size: 'size',
    });

    const PROPS_MAP = {
      'dev-mode': {},
      pubkey: {},
      uuid: {},
      src: {},
      // alt: {},
      // 'placeholder-src': {}, // available via CSS
      lazy: {
        default: 1,
      },
      intersection: {},
      breakpoints: {
        // '200, 300, 400'
      },
      'cdn-cname': {},
      'proxy-cname': {},
      'hi-res-support': {
        default: 1,
      },
      'ultra-res-support': {}, // ?
      format: {
        default: 'auto',
      },
      'cdn-operations': {},
      progressive: {},
      quality: {
        default: 'smart',
      },
      'is-background-for': {},
    };

    const CSS_PREF = '--uc-img-';
    const UNRESOLVED_ATTR = 'unresolved';
    const HI_RES_K = 2;
    const ULTRA_RES_K = 3;
    const DEV_MODE =
      !window.location.host.trim() || window.location.host.includes(':') || window.location.hostname.includes('localhost');

    /**
     * @param {...String} args
     * @returns {any}
     */
    function join(...args) {
      return args
        .map((subStr) => {
          if (subStr?.trim() && !subStr.endsWith('/')) {
            subStr += '/';
          }
          return subStr;
        })
        .join('');
    }

    class ImgBase extends BaseComponent {
      /**
       * @param {String} key
       * @returns {any}
       */
      $$(key) {
        return this.$[CSS_PREF + key];
      }

      /** @param {Object<String, String | Number>} kvObj */
      set$$(kvObj) {
        for (let key in kvObj) {
          this.$[CSS_PREF + key] = kvObj[key];
        }
      }

      /**
       * @param {String} key
       * @param {(val: any) => void} kbFn
       */
      sub$$(key, kbFn) {
        this.sub(CSS_PREF + key, (val) => {
          // null comes from CSS context property
          // empty string comes from attribute value
          if (val === null || val === '') {
            return;
          }
          kbFn(val);
        });
      }

      /**
       * @private
       * @param {String} src
       */
      _fmtAbs(src) {
        let isRel = !src.includes('//');
        if (isRel && !DEV_MODE) {
          src = new URL(src, document.baseURI).href;
        }
        return src;
      }

      /**
       * Image operations
       *
       * @param {String} [size]
       */
      _getOps(size = '') {
        return join(
          //
          size ? '-/resize/' + size : '',
          this.$$('cdn-operations') ? '-/' + this.$$('cdn-operations') : '',
          '-/format/' + this.$$('format'),
          '-/quality/' + this.$$('quality')
        );
      }

      /**
       * @private
       * @param {String} size
       * @returns {any}
       */
      _getUrlBase(size = '') {
        // console.log(this.localCtx);

        // Localhost + relative image path (DO NOTHING):
        if (DEV_MODE && this.$$('src') && !this.$$('src').includes('//')) {
          return this.$$('src');
        }

        let ops = this._getOps(size);

        // Alternative CDN name:
        if (this.$$('cdn-cname') && this.$$('uuid')) {
          return join(
            //
            this.$$('cdn-cname'),
            this.$$('uuid'),
            ops
          );
        }

        // UUID only:
        if (this.$$('uuid')) {
          return join(
            //
            'https://ucarecdn.com/',
            this.$$('uuid'),
            ops
          );
        }

        // Alternative proxy name:
        if (this.$$('proxy-cname')) {
          let base = join(
            //
            this.$$('proxy-cname'),
            ops,
            this._fmtAbs(this.$$('src'))
          );
          return base + this._fmtAbs(this.$$('src'));
        }

        // Project pubkey only:
        if (this.$$('pubkey')) {
          let base = join(
            //
            `https://${this.$$('pubkey')}.ucr.io/`,
            ops
          );
          return base + this._fmtAbs(this.$$('src'));
        }
      }

      /**
       * @param {HTMLElement} el
       * @param {Number} [k]
       * @param {Boolean} [wOnly]
       */
      _getElSize(el, k = 1, wOnly = true) {
        let rect = el.getBoundingClientRect();
        let w = k * Math.round(rect.width);
        let h = wOnly ? '' : k * Math.round(rect.height);
        return `${w ? w : ''}x${h ? h : ''}`;
      }

      initCallback() {
        for (let propKey in PROPS_MAP) {
          let cssKey = CSS_PREF + propKey;
          this.bindCssData(cssKey, false);
          if (this.$$(propKey) === null && PROPS_MAP[propKey].hasOwnProperty('default')) {
            this.set$$({
              [propKey]: PROPS_MAP[propKey].default,
            });
          }
        }
      }

      /** @type {HTMLImageElement} */
      get img() {
        if (!this._img) {
          /** @private */
          this._img = new Image();
          this._img.setAttribute(UNRESOLVED_ATTR, '');
          this.img.onload = () => {
            this.img.removeAttribute(UNRESOLVED_ATTR);
          };
          this.initAttributes();
          this.appendChild(this._img);
        }
        return this._img;
      }

      get bgSelector() {
        return this.$$('is-background-for');
      }

      initAttributes() {
        [...this.attributes].forEach((attr) => {
          if (!PROPS_MAP[attr.name]) {
            this.img.setAttribute(attr.name, attr.value);
          }
        });
      }

      get breakpoints() {
        return this.$$('breakpoints')
          ? this.$$('breakpoints')
              .split(',')
              .map((bpStr) => {
                return parseFloat(bpStr.trim());
              })
          : null;
      }

      /** @param {HTMLElement} el */
      renderBg(el) {
        let imgSet = [];
        if (this.breakpoints) {
          this.breakpoints.forEach((bp) => {
            imgSet.push(`url("${this._getUrlBase(bp + 'x')}") ${bp}w`);
            if (this.$$('hi-res-support')) {
              imgSet.push(`url("${this._getUrlBase(bp * HI_RES_K + 'x')}") ${bp * HI_RES_K}w`);
            }
            if (this.$$('ultra-res-support')) {
              imgSet.push(`url("${this._getUrlBase(bp * ULTRA_RES_K + 'x')}") ${bp * ULTRA_RES_K}w`);
            }
          });
        } else {
          imgSet.push(`url("${this._getUrlBase(this._getElSize(el))}") 1x`);
          if (this.$$('hi-res-support')) {
            imgSet.push(`url("${this._getUrlBase(this._getElSize(el, HI_RES_K))}") ${HI_RES_K}x`);
          }
          if (this.$$('ultra-res-support')) {
            imgSet.push(`url("${this._getUrlBase(this._getElSize(el, ULTRA_RES_K))}") ${ULTRA_RES_K}x`);
          }
        }
        let iSet = `image-set(${imgSet.join(', ')})`;
        el.style.setProperty('background-image', iSet);
        el.style.setProperty('background-image', '-webkit-' + iSet);
      }

      getSrcset() {
        let srcset = [];
        if (this.breakpoints) {
          this.breakpoints.forEach((bp) => {
            srcset.push(this._getUrlBase(bp + 'x') + ` ${bp}w`);
            if (this.$$('hi-res-support')) {
              srcset.push(this._getUrlBase(bp * HI_RES_K + 'x') + ` ${bp * HI_RES_K}w`);
            }
            if (this.$$('ultra-res-support')) {
              srcset.push(this._getUrlBase(bp * ULTRA_RES_K + 'x') + ` ${bp * ULTRA_RES_K}w`);
            }
          });
        } else {
          srcset.push(this._getUrlBase(this._getElSize(this.img)) + ' 1x');
          if (this.$$('hi-res-support')) {
            srcset.push(this._getUrlBase(this._getElSize(this.img, 2)) + ' 2x');
          }
          if (this.$$('ultra-res-support')) {
            srcset.push(this._getUrlBase(this._getElSize(this.img, 3)) + ' 3x');
          }
        }
        return srcset.join();
      }

      init() {
        if (this.bgSelector) {
          [...document.querySelectorAll(this.bgSelector)].forEach((el) => {
            if (this.$$('intersection')) {
              this.initIntersection(el, () => {
                this.renderBg(el);
              });
            } else {
              this.renderBg(el);
            }
          });
        } else if (this.$$('intersection')) {
          this.initIntersection(this.img, () => {
            this.img.srcset = this.getSrcset();
          });
        } else {
          this.img.srcset = this.getSrcset();
        }
      }

      /**
       * @param {HTMLElement} el
       * @param {() => void} cbkFn
       */
      initIntersection(el, cbkFn) {
        let opts = {
          root: null,
          rootMargin: '0px',
        };
        /** @private */
        this._isnObserver = new IntersectionObserver((entries) => {
          entries.forEach((ent) => {
            if (ent.isIntersecting) {
              cbkFn();
              this._isnObserver.unobserve(el);
            }
          });
        }, opts);
        this._isnObserver.observe(el);
        if (!this._observed) {
          /** @private */
          this._observed = new Set();
        }
        this._observed.add(el);
      }

      destroyCallback() {
        if (this._isnObserver) {
          this._observed.forEach((el) => {
            this._isnObserver.unobserve(el);
          });
          this._isnObserver = null;
        }
      }

      static get observedAttributes() {
        return Object.keys(PROPS_MAP);
      }

      attributeChangedCallback(name, oldVal, newVal) {
        window.setTimeout(() => {
          this.$[CSS_PREF + name] = newVal;
        });
      }
    }

    class Img extends ImgBase {
      initCallback() {
        super.initCallback();

        this.sub$$('src', () => {
          this.init();
        });

        this.sub$$('uuid', () => {
          this.init();
        });

        this.sub$$('lazy', (val) => {
          if (!this.$$('is-background-for')) {
            this.img.loading = val ? 'lazy' : 'eager';
          }
        });
      }
    }

    class SimpleBtn extends Block {
      init$ = {
        '*simpleButtonText': '',
        onClick: () => {
          this.initFlow();
        },
      };

      initCallback() {
        super.initCallback();
        let multipleStateKey = this.bindCssData('--cfg-multiple');
        this.sub(multipleStateKey, (val) => {
          this.$['*simpleButtonText'] = val ? this.l10n('upload-files') : this.l10n('upload-file');
        });
      }
    }

    SimpleBtn.template = /*html*/ `
<uc-drop-area>
  <button set="onclick: onClick">
    <uc-icon name="upload"></uc-icon>
    <span>{{*simpleButtonText}}</span>
    <slot></slot>
  </button>
</uc-drop-area>
`;

    class StartFrom extends Block {
      activityType = 'start-from';

      init$ = {
        '*activityCaption': '',
        '*activityIcon': '',
      };

      initCallback() {
        super.initCallback();
        this.registerActivity(this.activityType, () => {
          this.set$({
            '*activityCaption': this.l10n('select-file-source'),
            '*activityIcon': 'default',
          });
        });
      }
    }

    /**
     * @param {File} file
     * @returns {Promise<boolean>}
     */
    function checkIsDirectory(file) {
      return new Promise((resolve) => {
        if (typeof window.FileReader !== 'function') {
          resolve(false);
        }

        try {
          let reader = new FileReader();
          reader.onerror = () => {
            resolve(true);
          };
          let onLoad = (e) => {
            if (e.type !== 'loadend') {
              reader.abort();
            }
            resolve(false);
          };
          reader.onloadend = onLoad;
          reader.onprogress = onLoad;

          reader.readAsDataURL(file);
        } catch (err) {
          resolve(false);
        }
      });
    }

    function readEntryContentAsync(webkitEntry) {
      return new Promise((resolve, reject) => {
        let reading = 0;
        let contents = [];

        let readEntry = (entry) => {
          if (!entry) {
            console.warn('Unexpectedly received empty content entry', { scope: 'drag-and-drop' });
            resolve(null);
          }
          if (entry.isFile) {
            reading++;
            entry.file((file) => {
              reading--;
              contents.push(file);

              if (reading === 0) {
                resolve(contents);
              }
            });
          } else if (entry.isDirectory) {
            readReaderContent(entry.createReader());
          }
        };

        let readReaderContent = (reader) => {
          reading++;

          reader.readEntries((entries) => {
            reading--;
            for (let entry of entries) {
              readEntry(entry);
            }

            if (reading === 0) {
              resolve(contents);
            }
          });
        };

        readEntry(webkitEntry);
      });
    }

    /**
     * Note: dataTransfer will be destroyed outside of the call stack. So, do not try to process it asynchronous.
     *
     * @param {DataTransfer} dataTransfer
     * @returns {Promise<File[]>}
     */
    function getDropFiles(dataTransfer) {
      let files = [];
      let promises = [];
      for (let i = 0; i < dataTransfer.items.length; i++) {
        let item = dataTransfer.items[i];
        if (item && item.kind === 'file') {
          if (typeof item.webkitGetAsEntry === 'function' || typeof (/** @type {any} */ (item).getAsEntry) === 'function') {
            let entry =
              typeof item.webkitGetAsEntry === 'function'
                ? item.webkitGetAsEntry()
                : /** @type {any} */ (item).getAsEntry();
            promises.push(
              readEntryContentAsync(entry).then((entryContent) => {
                files.push(...entryContent);
              })
            );
            continue;
          }

          let file = item.getAsFile();
          promises.push(
            checkIsDirectory(file).then((isDirectory) => {
              if (isDirectory) ; else {
                files.push(file);
              }
            })
          );
        }
      }

      return Promise.all(promises).then(() => files);
    }

    const DropzoneState = {
      ACTIVE: 0,
      INACTIVE: 1,
      NEAR: 2,
      OVER: 3,
    };

    let FINAL_EVENTS = ['dragleave', 'dragexit', 'dragend', 'drop', 'mouseleave', 'mouseout'];
    let NEAR_OFFSET = 100;
    let nearnessRegistry = new Map();

    /**
     * @param {[x: number, y: number]} p
     * @param {{ x: number; y: number; width: number; height: number }} r
     * @returns {number}
     */
    function distance(p, r) {
      let cx = Math.max(Math.min(p[0], r.x + r.width), r.x);
      let cy = Math.max(Math.min(p[1], r.y + r.height), r.y);

      return Math.sqrt((p[0] - cx) * (p[0] - cx) + (p[1] - cy) * (p[1] - cy));
    }

    /**
     * @param {Object} desc
     * @param {HTMLElement} desc.element
     * @param {Function} desc.onChange
     * @param {Function} desc.onFiles
     */
    function addDropzone(desc) {
      let switchHandlers = new Set();
      let handleSwitch = (fn) => switchHandlers.add(fn);
      let state = DropzoneState.INACTIVE;

      let setState = (newState) => {
        if (state !== newState) {
          switchHandlers.forEach((fn) => fn(newState));
        }
        state = newState;
      };

      let onFinalEvent = (e) => {
        let { clientX, clientY } = e;
        let bodyBounds = document.body.getBoundingClientRect();
        let isDrop = e.type === 'drop';
        let isOuterDrag = ['dragleave', 'dragexit', 'dragend'].includes(e.type) && clientX === 0 && clientY === 0;
        let isOuterMouse =
          ['mouseleave', 'mouseout'].includes(e.type) &&
          (clientX < 0 || clientX > bodyBounds.width || clientY < 0 || clientY > bodyBounds.height);
        if (isDrop || isOuterDrag || isOuterMouse) {
          setState(DropzoneState.INACTIVE);
        }
        e.preventDefault();
      };

      handleSwitch((newState) => desc.onChange(newState));
      handleSwitch((newState) => {
        if (newState === DropzoneState.ACTIVE) {
          FINAL_EVENTS.forEach((eventName) => {
            window.addEventListener(eventName, onFinalEvent, false);
          });
        }
      });
      handleSwitch((newState) => {
        if (newState === DropzoneState.INACTIVE) {
          FINAL_EVENTS.forEach((eventName) => {
            window.removeEventListener(eventName, onFinalEvent, false);
          });
        }
      });

      let onDragOver = (e) => {
        // Not sure that it won't conflict with other dnd elements on the page
        e.preventDefault();
        if (state === DropzoneState.INACTIVE) {
          setState(DropzoneState.ACTIVE);
        }

        /** @type {any} [number, number] */
        let dragPoint = [e.x, e.y];
        let targetRect = desc.element.getBoundingClientRect();
        let nearness = Math.floor(distance(dragPoint, targetRect));
        let isNear = nearness < NEAR_OFFSET;
        let isOver = e.composedPath().includes(desc.element);

        nearnessRegistry.set(desc.element, nearness);
        let isNearest = Math.min(...nearnessRegistry.values()) === nearness;

        if (isOver && isNearest) {
          setState(DropzoneState.OVER);
        } else if (isNear && isNearest) {
          setState(DropzoneState.NEAR);
        } else {
          setState(DropzoneState.ACTIVE);
        }
      };
      window.addEventListener('dragover', onDragOver, false);

      let onDrop = async (e) => {
        e.preventDefault();
        let files = await getDropFiles(e.dataTransfer);
        desc.onFiles(files);
        setState(DropzoneState.INACTIVE);
      };
      desc.element.addEventListener('drop', onDrop);

      return () => {
        nearnessRegistry.delete(desc.element);
        window.removeEventListener('dragover', onDragOver, false);
        desc.element.removeEventListener('drop', onDrop);
        FINAL_EVENTS.forEach((eventName) => {
          window.removeEventListener(eventName, onFinalEvent, false);
        });
      };
    }

    class DropArea extends Block {
      init$ = {
        state: DropzoneState.INACTIVE,
      };
      initCallback() {
        /** @private */
        this._destroyDropzone = addDropzone({
          element: this,
          onChange: (state) => {
            this.$.state = state;
          },
          onFiles: (files) => {
            files.forEach((/** @type {File} */ file) => {
              this.uploadCollection.add({
                file,
                isImage: file.type.includes('image'),
                mimeType: file.type,
                fileName: file.name,
                fileSize: file.size,
              });
            });
            this.set$({
              '*currentActivity': Block.activities.UPLOAD_LIST,
            });
          },
        });

        this.sub('state', (state) => {
          const stateText = Object.entries(DropzoneState)
            .find(([, value]) => value === state)?.[0]
            .toLowerCase();
          if (stateText) {
            this.setAttribute('drag-state', stateText);
          }
        });
      }

      destroyCallback() {
        this._destroyDropzone?.();
      }
    }

    const L10N_PREFIX = 'src-type-';

    class SourceBtn extends Block {
      /** @private */
      _registeredTypes = {};

      init$ = {
        iconName: 'default',
      };

      initTypes() {
        this.registerType({
          type: Block.sourceTypes.LOCAL,
          // activity: '',
          onClick: () => {
            this.openSystemDialog();
          },
        });
        this.registerType({
          type: Block.sourceTypes.URL,
          activity: Block.activities.URL,
          textKey: 'from-url',
        });
        this.registerType({
          type: Block.sourceTypes.CAMERA,
          activity: Block.activities.CAMERA,
        });
        this.registerType({
          type: 'draw',
          activity: Block.activities.DRAW,
          icon: 'edit-draw',
        });

        for (let externalSourceType of Object.values(Block.extSrcList)) {
          this.registerType({
            type: externalSourceType,
            activity: Block.activities.EXTERNAL,
            activityParams: {
              externalSourceType: externalSourceType,
            },
          });
        }
      }

      initCallback() {
        this.initTypes();

        this.setAttribute('role', 'button');
        this.defineAccessor('type', (val) => {
          if (!val) {
            return;
          }
          this.applyType(val);
        });
      }

      registerType(typeConfig) {
        this._registeredTypes[typeConfig.type] = typeConfig;
      }

      getType(type) {
        return this._registeredTypes[type];
      }

      applyType(type) {
        const configType = this._registeredTypes[type];
        if (!configType) {
          console.warn('Unsupported source type: ' + type);
          return;
        }
        const { textKey = type, icon = type, activity, onClick, activityParams = {} } = configType;

        this.applyL10nKey('src-type', `${L10N_PREFIX}${textKey}`);
        this.$.iconName = icon;
        this.onclick = (e) => {
          activity &&
            this.set$({
              '*currentActivityParams': activityParams,
              '*currentActivity': activity,
            });
          onClick && onClick(e);
        };
      }
    }
    SourceBtn.template = /*html*/ `
<uc-icon set="@name: iconName"></uc-icon>
<div class="txt" l10n="src-type"></div>
`;
    SourceBtn.bindAttributes({
      type: null,
    });

    class SourceList extends Block {
      initCallback() {
        super.initCallback();
        this.bindCssData('--cfg-source-list');
        this.sub('*--cfg-source-list', (val) => {
          if (!val) {
            return;
          }
          let list = val.split(',').map((srcName) => {
            return srcName.trim();
          });
          let html = '';
          list.forEach((srcName) => {
            html += /*html*/ `<uc-source-btn type="${srcName}"></uc-source-btn>`;
          });
          if (this.getCssData('--cfg-source-list-wrap')) {
            this.innerHTML = html;
          } else {
            this.outerHTML = html;
          }
        });
      }
    }

    /**
     * @param {File} imgFile
     * @param {Number} [size]
     */
    function resizeImage(imgFile, size = 40) {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      let img = new Image();
      let promise = new Promise((resolve, reject) => {
        img.onload = () => {
          let ratio = img.height / img.width;
          if (ratio > 1) {
            canvas.width = size;
            canvas.height = size * ratio;
          } else {
            canvas.height = size;
            canvas.width = size / ratio;
          }
          ctx.fillStyle = 'rgb(240, 240, 240)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            let url = URL.createObjectURL(blob);
            resolve(url);
          }, 'image/png');
        };
        img.onerror = (err) => {
          console.warn('Resize error...');
          reject(err);
        };
      });
      img.src = URL.createObjectURL(imgFile);
      return promise;
    }

    class UiMessage {
      caption = '';
      text = '';
      iconName = '';
      isError = false;
    }

    class MessageBox extends Block {
      init$ = {
        iconName: 'info',
        captionTxt: 'Message caption',
        msgTxt: 'Message...',
        '*message': null,
        onClose: () => {
          this.$['*message'] = null;
        },
      };

      initCallback() {
        this.sub('*message', (/** @type {UiMessage} */ msg) => {
          if (msg) {
            this.setAttribute('active', '');
            this.set$({
              captionTxt: msg.caption,
              msgTxt: msg.text,
              iconName: msg.isError ? 'error' : 'info',
            });
            if (msg.isError) {
              this.setAttribute('error', '');
            } else {
              this.removeAttribute('error');
            }
          } else {
            this.removeAttribute('active');
          }
        });
      }
    }

    MessageBox.template = /*html*/ `
<div class="heading">
  <uc-icon set="@name: iconName"></uc-icon>
  <div class="caption">{{captionTxt}}</div>
  <button set="onclick: onClose">
    <uc-icon name="close"></uc-icon>
  </button>
</div>
<div class="msg">{{msgTxt}}</div>
`;

    /**
     * @param {String} svg
     * @returns {String}
     */
    function createSvgBlobUrl(svg) {
      let blob = new Blob([svg], {
        type: 'image/svg+xml',
      });
      return URL.createObjectURL(blob);
    }

    /**
     * @param {String} [color1]
     * @param {String} [color2]
     * @returns {String}
     */
    function checkerboardCssBg(color1 = '#fff', color2 = 'rgba(0, 0, 0, .1)') {
      return createSvgBlobUrl(/*svg*/ `<svg height="20" width="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="20" height="20" fill="${color1}" />
    <rect x="0" y="0" width="10" height="10" fill="${color2}" />
    <rect x="10" y="10" width="10" height="10" fill="${color2}" />
  </svg>`);
    }

    /**
     * @param {String} [color]
     * @returns {String}
     */
    function strokesCssBg(color = 'rgba(0, 0, 0, .1)') {
      return createSvgBlobUrl(/*svg*/ `<svg height="10" width="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="10" x2="10" y2="0" stroke="${color}" />
  </svg>`);
    }

    /**
     * @param {String} [color]
     * @returns {String}
     */
    function fileCssBg(color = 'hsl(0, 0%, 100%)', width = 36, height = 36) {
      return createSvgBlobUrl(/*svg*/ `
  <svg width="${width}" height="${height}" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5 28L25.5 27.9997V29.0024L10.5 29.0027V28Z" fill="black" fill-opacity="0.06"/>
    <path d="M9.5 7.50029L21.25 7.5L26.5 12.75V28.4998L9.5 28.5001V7.50029Z" fill="black" fill-opacity="0.06"/>
    <path d="M10 8.00298L21 8.00269L26 12.9998V28.0025L10 28.0027V8.00298Z" fill="${color}"/>
    <path d="M10 8.00298L21 8.00269L26 12.9998V28.0025L10 28.0027V8.00298Z" fill="url(#paint0_linear_2735_2136)"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.793 8.50269L10.5 8.50296V27.5027L25.5 27.5025V13.2069L20.793 8.50269ZM21 8.00269L10 8.00298V28.0027L26 28.0025V12.9998L21 8.00269Z" fill="url(#paint1_radial_2735_2136)"/>
    <path d="M21 8L26 13V14H20V8H21Z" fill="black" fill-opacity="0.03"/>
    <path d="M21 8L26 13V13.5H20.5V8H21Z" fill="black" fill-opacity="0.08"/>
    <path d="M21 8L26 13H21V8Z" fill="${color}"/>
    <path d="M21 8L26 13H21V8Z" fill="url(#paint2_linear_2735_2136)"/>
    <path d="M21 8L26 13H21V8Z" fill="url(#paint3_linear_2735_2136)"/>
    <path d="M21.5 8.5L21 8V13H26L25.5 12.5H21.5V8.5Z" fill="url(#paint4_linear_2735_2136)"/>
    <defs>
      <linearGradient id="paint0_linear_2735_2136" x1="18" y1="8" x2="18" y2="28.0027" gradientUnits="userSpaceOnUse">
        <stop stop-color="white" stop-opacity="0.06"/>
        <stop offset="1" stop-color="white" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="paint1_radial_2735_2136" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(10 11) rotate(53.7462) scale(18.6011 18.0323)">
        <stop stop-color="white" stop-opacity="0.12"/>
        <stop offset="1" stop-color="white" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="paint2_linear_2735_2136" x1="21" y1="13" x2="23.5" y2="10.5" gradientUnits="userSpaceOnUse">
        <stop offset="0.40625" stop-opacity="0"/>
        <stop offset="1" stop-opacity="0.04"/>
      </linearGradient>
      <linearGradient id="paint3_linear_2735_2136" x1="21" y1="13" x2="23.5" y2="10.5" gradientUnits="userSpaceOnUse">
        <stop stop-color="white" stop-opacity="0.16"/>
        <stop offset="1" stop-color="white" stop-opacity="0.06"/>
      </linearGradient>
      <linearGradient id="paint4_linear_2735_2136" x1="21" y1="13" x2="23.5" y2="10.5" gradientUnits="userSpaceOnUse">
        <stop stop-color="white" stop-opacity="0.15"/>
        <stop offset="1" stop-color="white" stop-opacity="0"/>
      </linearGradient>
    </defs>
</svg>
  `);
    }

    /** Do not edit this file manually. It's generated during build process. */
    const PACKAGE_NAME = 'uc-blocks';
    const PACKAGE_VERSION = '0.1.1';

    /**
     * @param {{
     *   publicKey: string;
     *   libraryName: string;
     *   libraryVersion: string;
     *   languageName: string;
     *   integration?: string;
     * }} options
     * @returns {string}
     */
    function customUserAgent({ publicKey, languageName }) {
      return `${PACKAGE_NAME}/${PACKAGE_VERSION}/${publicKey} (${languageName})`;
    }

    class FileItem extends Block {
      pauseRender = true;

      init$ = {
        itemName: '',
        thumb: '',
        thumbUrl: '',
        progressValue: 0,
        progressVisible: false,
        progressUnknown: false,
        notImage: true,
        badgeIcon: 'check',
        '*uploadTrigger': null,

        onEdit: () => {
          this.set$({
            '*focusedEntry': this.entry,
            '*currentActivity': Block.activities.DETAILS,
          });
        },
        onRemove: () => {
          this.uploadCollection.remove(this.uid);
        },
        onUpload: () => {
          this.upload();
        },
      };

      /** @private */
      _observerCallback(entries) {
        let [entry] = entries;
        if (entry.intersectionRatio === 0) {
          clearTimeout(this._thumbTimeoutId);
          /** @private */
          this._thumbTimeoutId = undefined;
        } else if (!this._thumbTimeoutId) {
          /** @private */
          this._thumbTimeoutId = window.setTimeout(() => this._generateThumbnail(), 100);
        }
      }

      /** @private */
      _generateThumbnail() {
        if (this.$.thumbUrl) {
          return;
        }
        if (this.file?.type.includes('image')) {
          resizeImage(this.file, this.$['*--cfg-thumb-size'] || 76).then((url) => {
            this.$.thumbUrl = `url(${url})`;
          });
        } else {
          let color = window.getComputedStyle(this).getPropertyValue('--clr-generic-file-icon');
          this.$.thumbUrl = `url(${fileCssBg(color)})`;
        }
      }

      /** @private */
      _revokeThumbUrl() {
        if (this.$.thumbUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(this.$.thumbUrl);
        }
      }

      initCallback() {
        super.initCallback();
        this.bindCssData('--cfg-thumb-size');
        this.defineAccessor('entry-id', (id) => {
          if (!id || id === this.uid) {
            return;
          }
          /** @type {String} */
          this.uid = id;

          /** @type {import('../../submodules/symbiote/core/symbiote.js').TypedData} */
          this.entry = this.uploadCollection?.read(id);

          if (!this.entry) {
            return;
          }

          this.entry.subscribe('isUploading', (isUploading) => {
            this.$.progressVisible = isUploading;
          });

          this.entry.subscribe('uploadProgress', (uploadProgress) => {
            this.$.progressValue = uploadProgress;
          });

          this.entry.subscribe('fileName', (name) => {
            this.$.itemName = name || this.externalUrl || this.l10n('file-no-name');
          });

          this.entry.subscribe('externalUrl', (externalUrl) => {
            this.$.itemName = this.entry.getValue('fileName') || externalUrl || this.l10n('file-no-name');
          });

          this.entry.subscribe('uuid', (uuid) => {
            if (!uuid) {
              return;
            }
            this._observer.unobserve(this);
            this.setAttribute('loaded', '');

            if (this.entry.getValue('isImage')) {
              let url = `https://ucarecdn.com/${uuid}/`;
              this._revokeThumbUrl();
              let size = this.$['*--cfg-thumb-size'] || 76;
              this.$.thumbUrl = `url(${url}-/scale_crop/${size}x${size}/center/)`;
            }
          });

          this.entry.subscribe('transformationsUrl', (transformationsUrl) => {
            if (!transformationsUrl) {
              return;
            }
            if (this.entry.getValue('isImage')) {
              this._revokeThumbUrl();
              let size = this.$['*--cfg-thumb-size'] || 76;
              this.$.thumbUrl = `url(${transformationsUrl}-/scale_crop/${size}x${size}/center/)`;
            }
          });

          /** @type {File} */
          this.file = this.entry.getValue('file');
          /** @type {String} */
          this.externalUrl = this.entry.getValue('externalUrl');

          if (!this.$['*--cfg-confirm-upload']) {
            this.upload();
          }

          /** @private */
          this._observer = new window.IntersectionObserver(this._observerCallback.bind(this), {
            root: this.parentElement,
            rootMargin: '50% 0px 50% 0px',
            threshold: [0, 1],
          });
          this._observer.observe(this);
        });

        this.$['*uploadTrigger'] = null;
        FileItem.activeInstances.add(this);

        this.sub('*uploadTrigger', (val) => {
          if (!val || !this.isConnected) {
            return;
          }
          this.upload();
        });
        this.onclick = () => {
          FileItem.activeInstances.forEach((inst) => {
            if (inst === this) {
              inst.setAttribute('focused', '');
            } else {
              inst.removeAttribute('focused');
            }
          });
        };
      }

      destroyCallback() {
        FileItem.activeInstances.delete(this);
        this._observer.unobserve(this);
        clearTimeout(this._thumbTimeoutId);
      }

      async upload() {
        if (this.hasAttribute('loaded') || this.entry.getValue('uuid')) {
          return;
        }
        this.entry.setValue('isUploading', true);
        this.entry.setValue('uploadError', null);

        this.removeAttribute('focused');
        this.removeAttribute('error');
        this.setAttribute('uploading', '');
        let storeSetting = {};
        let store = this.$['*--cfg-store'];
        if (store !== null) {
          storeSetting.store = !!store;
        }
        if (!this.file && this.externalUrl) {
          this.$.progressUnknown = true;
        }
        try {
          // @ts-ignore
          let fileInfo = await uploadFile(this.file || this.externalUrl, {
            ...storeSetting,
            publicKey: this.$['*--cfg-pubkey'],
            userAgent: customUserAgent,
            fileName: this.entry.getValue('fileName'),
            onProgress: (progress) => {
              if (progress.isComputable) {
                let percentage = progress.value * 100;
                this.entry.setValue('uploadProgress', percentage);
              }
              this.$.progressUnknown = !progress.isComputable;
            },
          });
          this.entry.setValue('isUploading', false);
          this.setAttribute('loaded', '');
          this.removeAttribute('uploading');
          this.$.badgeIcon = 'badge-success';
          this.entry.setMultipleValues({
            fileInfo,
            uploadProgress: 100,
            fileName: fileInfo.name,
            fileSize: fileInfo.size,
            isImage: fileInfo.isImage,
            mimeType: fileInfo.mimeType,
            uuid: fileInfo.uuid,
          });
        } catch (error) {
          this.entry.setValue('isUploading', false);
          this.$.progressValue = 0;
          this.setAttribute('error', '');
          this.removeAttribute('uploading');
          let msg = new UiMessage();
          msg.caption = this.l10n('upload-error') + ': ' + (this.file?.name || this.externalUrl);
          msg.text = error;
          msg.isError = true;
          this.set$({
            badgeIcon: 'badge-error',
            '*message': msg,
          });
          this.entry.setValue('uploadProgress', 0);
          this.entry.setValue('uploadError', error);
        }
      }
    }

    FileItem.template = /*html*/ `
<div
  class="thumb"
  set="style.backgroundImage: thumbUrl">
  <div class="badge">
    <uc-icon set="@name: badgeIcon"></uc-icon>
  </div>
</div>
<div class="file-name-wrapper">
  <span class="file-name" set="@title: itemName">{{itemName}}</span>
</div>
<button class="edit-btn" set="onclick: onEdit;">
  <uc-icon name="edit-file"></uc-icon>
</button>
<button class="remove-btn" set="onclick: onRemove;">
  <uc-icon name="remove-file"></uc-icon>
</button>
<button class="upload-btn" set="onclick: onUpload;">
  <uc-icon name="upload"></uc-icon>
</button>
<uc-progress-bar
  class="progress-bar"
  set="value: progressValue; visible: progressVisible; unknown: progressUnknown">
</uc-progress-bar>
`;
    FileItem.activeInstances = new Set();

    FileItem.bindAttributes({
      'entry-id': null,
    });

    class Modal extends Block {
      init$ = {
        '*modalActive': false,
        '*modalHeaderHidden': false,
        closeClicked: () => {
          this.set$({
            '*modalActive': false,
            '*currentActivity': '',
          });
        },
      };

      initCallback() {
        this.sub('*modalActive', (val) => {
          val ? this.setAttribute('active', '') : this.removeAttribute('active');
          if (val && this.getCssData('--cfg-modal-scroll-lock')) {
            document.body.style.overflow = 'hidden';
          } else {
            document.body.style.overflow = null;
          }
        });
        if (this.getCssData('--cfg-modal-backdrop-strokes')) {
          this.style.backgroundImage = `url(${strokesCssBg()})`;
        }
      }
    }

    Modal.template = /*html*/ `
<div class="dialog">
  <div class="heading" set="@hidden: *modalHeaderHidden">
    <slot name="heading"></slot>
    <button
      class="close-btn"
      set="onclick: closeClicked">
      <uc-icon name="close"></uc-icon>
    </button>
  </div>
  <div class="content">
    <slot></slot>
  </div>
</div>
`;

    class UiConfirmation {
      captionL10nStr = 'confirm-your-action';
      messageL10Str = 'are-you-sure';
      confirmL10nStr = 'yes';
      denyL10nStr = 'no';
      confirmAction() {
        console.log('Confirmed');
      }
      denyAction() {
        this['historyBack']();
      }
    }

    class ConfirmationDialog extends Block {
      activityType = Block.activities.CONFIRMATION;

      /** @private */
      _defaults = new UiConfirmation();

      init$ = {
        messageTxt: '',
        confirmBtnTxt: '',
        denyBtnTxt: '',
        '*confirmation': null,
        onConfirm: this._defaults.confirmAction,
        onDeny: this._defaults.denyAction.bind(this),
      };

      initCallback() {
        super.initCallback();
        this.set$({
          messageTxt: this.l10n(this._defaults.messageL10Str),
          confirmBtnTxt: this.l10n(this._defaults.confirmL10nStr),
          denyBtnTxt: this.l10n(this._defaults.denyL10nStr),
        });
        this.sub('*confirmation', (/** @type {UiConfirmation} */ cfn) => {
          if (!cfn) {
            return;
          }
          this.set$({
            '*modalHeaderHidden': true,
            '*currentActivity': Block.activities.CONFIRMATION,
            '*activityCaption': this.l10n(cfn.captionL10nStr),
            messageTxt: this.l10n(cfn.messageL10Str),
            confirmBtnTxt: this.l10n(cfn.confirmL10nStr),
            denyBtnTxt: this.l10n(cfn.denyL10nStr),
            onDeny: () => {
              this.$['*modalHeaderHidden'] = false;
              cfn.denyAction();
            },
            onConfirm: () => {
              this.$['*modalHeaderHidden'] = false;
              cfn.confirmAction();
            },
          });
        });
      }
    }

    ConfirmationDialog.template = /*html*/ `
<div class="message">{{messageTxt}}</div>
<div class="toolbar">
  <button
    class="deny-btn secondary-btn"
    set="onclick: onDeny">{{denyBtnTxt}}</button>
  <button
    class="confirm-btn primary-btn"
    set="onclick: onConfirm">{{confirmBtnTxt}}</button>
</div>
`;

    class UploadList extends Block {
      activityType = Block.activities.UPLOAD_LIST;

      init$ = {
        doneBtnHidden: true,
        uploadBtnHidden: false,
        uploadBtnDisabled: false,
        hasFiles: false,
        moreBtnDisabled: true,
        onAdd: () => {
          this.initFlow(true);
        },
        onUpload: () => {
          this.set$({
            uploadBtnHidden: false,
            doneBtnHidden: true,
            uploadBtnDisabled: true,
            '*uploadTrigger': {},
          });
        },
        onDone: () => {
          this.set$({
            '*currentActivity': this.doneActivity || '',
          });
          this.setForCtxTarget('uc-modal', '*modalActive', false);
          this.output();
        },
        onCancel: () => {
          let cfn = new UiConfirmation();
          cfn.confirmAction = () => {
            this.cancelFlow();
            this.uploadCollection.clearAll();
            this.output();
          };
          cfn.denyAction = () => {
            this.historyBack();
          };
          this.$['*confirmation'] = cfn;
        },
      };

      /** @private */
      _renderMap = Object.create(null);

      updateButtonsState() {
        let itemIds = this.uploadCollection.items();
        let summary = {
          total: itemIds.length,
          uploaded: 0,
          uploading: 0,
        };
        for (let id of itemIds) {
          let item = this.uploadCollection.read(id);
          if (item.getValue('uuid')) {
            summary.uploaded += 1;
          } else if (item.getValue('isUploading')) {
            summary.uploading += 1;
          }
        }
        let allUploaded = summary.total === summary.uploaded;
        this.set$({
          uploadBtnHidden: allUploaded,
          doneBtnHidden: !allUploaded,
          uploadBtnDisabled: summary.uploading > 0,
        });

        if (!this.$['*--cfg-confirm-upload'] && allUploaded) {
          this.$.onDone();
        }
      }

      initCallback() {
        super.initCallback();

        this.bindCssData('--cfg-show-empty-list');

        this.registerActivity(this.activityType, () => {
          this.set$({
            '*activityCaption': this.l10n('selected'),
            '*activityIcon': 'local',
          });
        });

        this.sub('*--cfg-multiple', (val) => {
          this.$.moreBtnDisabled = !val;
        });

        this.uploadCollection.observe(() => {
          this.updateButtonsState();
        });

        this.sub('*uploadList', (/** @type {String[]} */ list) => {
          if (list?.length === 0 && !this.$['*--cfg-show-empty-list']) {
            this.cancelFlow();
            this.ref.files.innerHTML = '';
            return;
          }

          this.updateButtonsState();
          this.set$({
            hasFiles: list.length > 0,
          });

          list.forEach((id) => {
            if (!this._renderMap[id]) {
              let item = new FileItem();
              this._renderMap[id] = item;
            }
          });

          for (let id in this._renderMap) {
            if (!list.includes(id)) {
              this._renderMap[id].remove();
              delete this._renderMap[id];
            }
          }

          let fr = document.createDocumentFragment();
          Object.values(this._renderMap).forEach((el) => fr.appendChild(el));
          this.ref.files.replaceChildren(fr);
          Object.keys(this._renderMap).forEach((id) => {
            /** @type {Block} */
            let el = this._renderMap[id];
            // rendering components async improves initial list render time a bit
            setTimeout(() => {
              el['entry-id'] = id;
              if (!el.innerHTML) {
                el.render();
              }
            });
          });
          this.setForCtxTarget('uc-modal', '*modalActive', true);
        });
      }
    }

    UploadList.template = /*html*/ `
<div class="no-files" set="@hidden: hasFiles">
  <slot name="empty"><span l10n="no-files"></span></slot>
</div>
<div class="files" ref="files"></div>
<div class="toolbar">
  <button
    class="cancel-btn secondary-btn"
    set="onclick: onCancel;"
    l10n="clear"></button>
  <div></div>
  <button
    class="add-more-btn secondary-btn"
    set="onclick: onAdd; @disabled: moreBtnDisabled"
    l10n="add-more"></button>
  <button
    class="upload-btn primary-btn"
    set="@hidden: uploadBtnHidden; onclick: onUpload; @disabled: uploadBtnDisabled"
    l10n="upload"></button>
  <button
    class="done-btn primary-btn"
    set="@hidden: doneBtnHidden; onclick: onDone"
    l10n="done"></button>
</div>
`;

    class UrlSource extends Block {
      activityType = Block.activities.URL;

      init$ = {
        importDisabled: true,
        onUpload: () => {
          let url = this.ref.input['value'];
          this.uploadCollection.add({
            externalUrl: url,
          });
          this.$['*currentActivity'] = Block.activities.UPLOAD_LIST;
        },
        onCancel: () => {
          this.cancelFlow();
        },
        onInput: (e) => {
          let value = e.target.value;
          this.set$({ importDisabled: !value });
        },
      };

      initCallback() {
        this.registerActivity(this.activityType, () => {
          this.set$({
            '*activityCaption': this.l10n('caption-from-url'),
            '*activityIcon': 'url',
          });
        });
      }
    }

    UrlSource.template = /*html*/ `
<input placeholder="https://..." .url-input type="text" ref="input" set="oninput: onInput"/>
<button
  class="url-upload-btn primary-btn"
  set="onclick: onUpload; @disabled: importDisabled">
</button>
<button
  class="cancel-btn secondary-btn"
  set="onclick: onCancel"
  l10n="cancel">
</button>
`;

    const canUsePermissionsApi = () => {
      return typeof navigator.permissions !== 'undefined';
    };

    /**
     * @param {function} callback
     * @param {number} wait
     * @returns {function}
     */
    function debounce$1(callback, wait) {
      let timer;
      let debounced = (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), wait);
      };
      debounced.cancel = () => {
        clearTimeout(timer);
      };
      return debounced;
    }

    class CameraSource extends Block {
      activityType = Block.activities.CAMERA;

      /** @private */
      _unsubPermissions = null;

      init$ = {
        video: null,
        videoTransformCss: null,
        shotBtnDisabled: false,
        videoHidden: false,
        messageHidden: true,
        requestBtnHidden: canUsePermissionsApi(),
        l10nMessage: null,

        onCancel: () => {
          this.cancelFlow();
        },
        onShot: () => {
          this._shot();
        },
        onRequestPermissions: () => {
          this._capture();
        },
      };

      /** @private */
      _onActivate = () => {
        this.set$({
          '*activityCaption': this.l10n('caption-camera'),
          '*activityIcon': 'camera',
        });

        if (canUsePermissionsApi()) {
          this._subscribePermissions();
        }
        this._capture();
      };

      /** @private */
      _onDeactivate = () => {
        if (this._unsubPermissions) {
          this._unsubPermissions();
        }

        this._stopCapture();
      };

      /** @private */
      _handlePermissionsChange = () => {
        this._capture();
      };

      /**
       * @private
       * @param {'granted' | 'denied' | 'prompt'} state
       */
      _setPermissionsState = debounce$1((state) => {
        if (state === 'granted') {
          this.set$({
            videoHidden: false,
            shotBtnDisabled: false,
            messageHidden: true,
          });
        } else if (state === 'prompt') {
          this.$.l10nMessage = this.l10n('camera-permissions-prompt');
          this.set$({
            videoHidden: true,
            shotBtnDisabled: true,
            messageHidden: false,
          });
          this._stopCapture();
        } else {
          this.$.l10nMessage = this.l10n('camera-permissions-denied');

          this.set$({
            videoHidden: true,
            shotBtnDisabled: true,
            messageHidden: false,
          });
          this._stopCapture();
        }
      }, 300);

      /** @private */
      async _subscribePermissions() {
        try {
          // @ts-ignore
          let permissionsResponse = await navigator.permissions.query({ name: 'camera' });
          permissionsResponse.addEventListener('change', this._handlePermissionsChange);
        } catch (err) {
          console.log('Failed to use permissions API. Fallback to manual request mode.', err);
          this._capture();
        }
      }

      /** @private */
      async _capture() {
        let constr = {
          video: {
            width: {
              ideal: 1920,
            },
            height: {
              ideal: 1080,
            },
            frameRate: {
              ideal: 30,
            },
          },
          audio: false,
        };
        /** @private */
        this._canvas = document.createElement('canvas');
        /** @private */
        this._ctx = this._canvas.getContext('2d');

        try {
          this._setPermissionsState('prompt');
          let stream = await navigator.mediaDevices.getUserMedia(constr);
          stream.addEventListener('inactive', () => {
            this._setPermissionsState('denied');
          });
          this.$.video = stream;
          /** @private */
          this._capturing = true;
          this._setPermissionsState('granted');
        } catch (err) {
          this._setPermissionsState('denied');
        }
      }

      /** @private */
      _stopCapture() {
        if (this._capturing) {
          this.$.video?.getTracks()[0].stop();
          this.$.video = null;
          this._capturing = false;
        }
      }

      /** @private */
      _shot() {
        this._canvas.height = this.ref.video['videoHeight'];
        this._canvas.width = this.ref.video['videoWidth'];
        // @ts-ignore
        this._ctx.drawImage(this.ref.video, 0, 0);
        let date = Date.now();
        let name = `camera-${date}.png`;
        this._canvas.toBlob((blob) => {
          let file = new File([blob], name, {
            lastModified: date,
            type: 'image/png',
          });
          this.uploadCollection.add({
            file,
            fileName: name,
            fileSize: file.size,
            isImage: true,
            mimeType: file.type,
          });
          this.set$({
            '*currentActivity': Block.activities.UPLOAD_LIST,
          });
        });
      }

      initCallback() {
        this.registerActivity(this.activityType, this._onActivate, this._onDeactivate);

        let camMirrProp = this.bindCssData('--cfg-camera-mirror');
        this.sub(camMirrProp, (val) => {
          if (!this.isActivityActive) {
            return;
          }
          this.$.videoTransformCss = val ? 'scaleX(-1)' : null;
        });
      }
    }

    CameraSource.template = /*html*/ `
<div class="content">
  <video
    autoplay
    playsinline
    set="srcObject: video; style.transform: videoTransformCss; @hidden: videoHidden"
    ref="video">
  </video>
  <div class="message-box" set="@hidden: messageHidden">
    <span>{{l10nMessage}}</span>
    <button set="onclick: onRequestPermissions; @hidden: requestBtnHidden" l10n="camera-permissions-request"></button>
  </div>
</div>

<div class="toolbar">
  <button
    class="cancel-btn secondary-btn"
    set="onclick: onCancel"
    l10n="cancel">
  </button>
  <button
    class="shot-btn primary-btn"
    set="onclick: onShot; @disabled: shotBtnDisabled"
    l10n="camera-shot">
  </button>
</div>
`;

    class UploadDetails extends Block {
      activityType = Block.activities.DETAILS;

      init$ = {
        checkerboard: false,
        localImageEditDisabled: true,
        cloudImageEditDisabled: true,
        fileSize: null,
        fileName: '',
        notUploaded: true,
        imageUrl: '',
        errorTxt: '',
        editBtnHidden: true,
        onNameInput: null,
        onBack: () => {
          this.historyBack();
        },
        onRemove: () => {
          /** @type {File[]} */
          this.uploadCollection.remove(this.entry.uid);
          this.historyBack();
        },
        onEdit: () => {
          if (this.entry.getValue('uuid')) {
            this.$['*currentActivity'] = Block.activities.CLOUD_IMG_EDIT;
          }
        },
      };

      showNonImageThumb() {
        let color = window.getComputedStyle(this).getPropertyValue('--clr-generic-file-icon');
        let url = fileCssBg(color, 108, 108);
        this.eCanvas.setImageUrl(url);
        this.set$({
          checkerboard: false,
        });
      }

      initCallback() {
        this.bindCssData('--cfg-use-local-image-editor');
        this.sub('*--cfg-use-local-image-editor', (val) => {
          this.$.localImageEditDisabled = !val;
        });

        this.bindCssData('--cfg-use-cloud-image-editor');
        this.sub('*--cfg-use-cloud-image-editor', (val) => {
          this.$.cloudImageEditDisabled = !val;
        });

        this.$.fileSize = this.l10n('file-size-unknown');
        this.registerActivity(this.activityType, () => {
          this.set$({
            '*activityCaption': this.l10n('caption-edit-file'),
          });
        });
        // this.sub('editBtnHidden', (val) => {
        //   this.$.localImageEditDisabled = !!val;
        // });
        /** @type {import('../EditableCanvas/EditableCanvas.js').EditableCanvas} */
        // @ts-ignore
        this.eCanvas = this.ref.canvas;
        this.sub('*focusedEntry', (/** @type {import('../../submodules/symbiote/core/symbiote.js').TypedData} */ entry) => {
          if (!entry) {
            return;
          }
          if (this._entrySubs) {
            this._entrySubs.forEach((sub) => {
              this._entrySubs.delete(sub);
              sub.remove();
            });
          } else {
            /** @private */
            this._entrySubs = new Set();
          }
          this.entry = entry;
          /** @type {File} */
          let file = entry.getValue('file');
          this.eCanvas.clear();
          if (file) {
            /**
             * @private
             * @type {File}
             */
            this._file = file;
            let isImage = this._file.type.includes('image');
            if (isImage && !entry.getValue('transformationsUrl')) {
              this.eCanvas.setImageFile(this._file);
              this.set$({
                checkerboard: true,
                editBtnHidden: !this.$['*--cfg-use-local-image-editor'],
              });
            }
            if (!isImage) {
              this.showNonImageThumb();
            }
          }
          let tmpSub = (prop, callback) => {
            this._entrySubs.add(this.entry.subscribe(prop, callback));
          };
          tmpSub('fileName', (name) => {
            this.$.fileName = name;
            this.$.onNameInput = () => {
              let name = this.ref.file_name_input['value'];
              Object.defineProperty(this._file, 'name', {
                writable: true,
                value: name,
              });
              this.entry.setValue('fileName', name);
            };
          });
          tmpSub('fileSize', (size) => {
            this.$.fileSize = Number.isFinite(size) ? this.fileSizeFmt(size) : this.l10n('file-size-unknown');
          });
          tmpSub('uuid', (uuid) => {
            if (uuid && !this.entry.getValue('transformationsUrl')) {
              this.eCanvas.clear();
              this.set$({
                imageUrl: `https://ucarecdn.com/${uuid}/`,
                notUploaded: false,
                editBtnHidden: !this.entry.getValue('isImage') && !this.$['*--cfg-use-cloud-image-editor'],
              });
              this.eCanvas.setImageUrl(this.$.imageUrl);
            } else {
              this.$.imageUrl = 'Not uploaded yet...';
            }
          });
          tmpSub('uploadError', (error) => {
            this.$.errorTxt = error?.message;
          });

          tmpSub('externalUrl', (url) => {
            if (!url) {
              return;
            }
            if (!this.entry.getValue('uuid')) {
              this.showNonImageThumb();
            }
          });
          tmpSub('transformationsUrl', (url) => {
            if (!url) {
              return;
            }
            if (this.entry.getValue('isImage')) {
              this.eCanvas.setImageUrl(url);
            }
          });
        });
      }
    }

    UploadDetails.template = /*html*/ `
<uc-tabs
  tab-list="tab-view, tab-details">

  <div
    tab-ctx="tab-details"
    class="details">

    <div class="info-block">
      <div class="info-block_name" l10n="file-name"></div>
      <input
        name="name-input"
        ref="file_name_input"
        set="value: fileName; oninput: onNameInput"
        type="text" />
    </div>

    <div class="info-block">
      <div class="info-block_name" l10n="file-size"></div>
      <div>{{fileSize}}</div>
    </div>

    <div class="info-block">
      <div class="info-block_name" l10n="cdn-url"></div>
      <a
        target="_blank"
        set="@href: imageUrl; @disabled: notUploaded">{{imageUrl}}</a>
    </div>

    <div>{{errorTxt}}</div>

  </div>

  <uc-editable-canvas
    tab-ctx="tab-view"
    set="@disabled: localImageEditDisabled; @checkerboard: checkerboard;"
    ref="canvas">
  </uc-editable-canvas>
</uc-tabs>

<div class="toolbar" set="@edit-disabled: editBtnHidden">
  <button
    class="edit-btn secondary-btn"
    set="onclick: onEdit; @hidden: editBtnHidden;">
    <uc-icon name="edit"></uc-icon>
    <span l10n="edit-image"></span>
  </button>
  <button
    class="remove-btn secondary-btn"
    set="onclick: onRemove">
    <uc-icon name="remove"></uc-icon>
    <span l10n="remove-from-list"></span>
  </button>
  <div></div>
  <button
    class="back-btn primary-btn"
    set="onclick: onBack">
    <span l10n="done"></span>
  </button>
</div>
`;

    class ProgressBarCommon extends Block {
      init$ = {
        visible: false,
        unknown: false,
        value: 0,

        '*commonProgress': 0,
      };

      initCallback() {
        this.uploadCollection.observe(() => {
          let anyUploading = this.uploadCollection.items().some((id) => {
            let item = this.uploadCollection.read(id);
            return item.getValue('isUploading');
          });

          this.$.visible = anyUploading;
        });

        this.sub('visible', (visible) => {
          if (visible) {
            this.setAttribute('active', '');
          } else {
            this.removeAttribute('active');
          }
        });

        this.sub('*commonProgress', (progress) => {
          this.$.value = progress;
        });
      }
    }

    ProgressBarCommon.template = /*html*/ `
<uc-progress-bar set="visible: visible; unknown: unknown; value: value"></uc-progress-bar>
`;

    class ProgressBar extends Block {
      /** @type {Number} */
      _value = 0;
      /** @type {Boolean} */
      _unknownMode = false;

      init$ = {
        width: 0,
        opacity: 0,
      };

      initCallback() {
        this.defineAccessor('value', (value) => {
          if (value === undefined) {
            return;
          }
          this._value = value;

          if (!this._unknownMode) {
            this.style.setProperty('--l-width', this._value.toString());
          }
        });
        this.defineAccessor('visible', (visible) => {
          this.ref.line.classList.toggle('progress--hidden', !visible);
        });
        this.defineAccessor('unknown', (unknown) => {
          this._unknownMode = unknown;
          this.ref.line.classList.toggle('progress--unknown', unknown);
        });
      }
    }

    ProgressBar.template = /*html*/ `
<div
  ref="line"
  class="progress">
</div>
`;

    class EditableCanvas extends Block {
      init$ = {
        refMap: null,
        disabled: true,
        toolbarHidden: true,
        checkerboard: false,
      };

      constructor() {
        super();
        applyStyles(this, {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        });
      }

      initCallback() {
        this.sub('disabled', () => {
          this.$.toolbarHidden = this.hasAttribute('disabled') && this.getAttribute('disabled') !== 'false';
        });
        this.sub('checkerboard', () => {
          this.style.backgroundImage = this.hasAttribute('checkerboard') ? `url(${checkerboardCssBg()})` : 'unset';
        });
        /** @type {HTMLCanvasElement} */
        // @ts-ignore
        this.canvas = this.ref.cvs;
        this.canvCtx = this.canvas.getContext('2d');
        this.$.refMap = {
          parent: this,
          canvas: this.canvas,
          canvCtx: this.canvCtx,
          svg: this.ref.svg,
          svgGroup: this.ref.svg_g,
          svgImg: this.ref.svg_img,
        };
      }

      /** @param {HTMLImageElement} img */
      setImage(img) {
        if (img.height && img.width) {
          this.canvas.height = img.height;
          this.canvas.width = img.width;
          this.canvCtx.drawImage(img, 0, 0, img.width, img.height);
        } else {
          this.clear();
          img.onload = () => {
            this.canvas.height = img.height;
            this.canvas.width = img.width;
            this.canvCtx.drawImage(img, 0, 0, img.width, img.height);
          };
        }
      }

      /** @param {File} imgFile */
      setImageFile(imgFile) {
        let img = new Image();
        let url = URL.createObjectURL(imgFile);
        img.src = url;
        this.setImage(img);
      }

      /** @param {String} url */
      setImageUrl(url) {
        let img = new Image();
        img.src = url;
        this.setImage(img);
      }

      clear() {
        this.canvCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }

    EditableCanvas.template = /*html*/ `
<canvas class="img-view" ref="cvs"></canvas>
<svg class="img-view" xmlns="http://www.w3.org/2000/svg" ref="svg">
  <g ref="svg_g">
    <image ref="svg_img" x="0" y="0"></image>
  </g>
</svg>
<editable-canvas-toolbar
  set="refMap: refMap; @hidden: toolbarHidden">
</editable-canvas-toolbar>
`;

    EditableCanvas.bindAttributes({
      disabled: 'disabled',
      checkerboard: 'checkerboard',
    });

    function normalize(...args) {
      return args.reduce((result, arg) => {
        if (typeof arg === 'string') {
          result[arg] = true;
          return result;
        }

        for (let token of Object.keys(arg)) {
          result[token] = arg[token];
        }

        return result;
      }, {});
    }

    function classNames(...args) {
      let mapping = normalize(...args);
      return Object.keys(mapping)
        .reduce((result, token) => {
          if (mapping[token]) {
            result.push(token);
          }

          return result;
        }, [])
        .join(' ');
    }

    function applyClassNames(element, ...args) {
      let mapping = normalize(...args);
      for (let token of Object.keys(mapping)) {
        element.classList.toggle(token, mapping[token]);
      }
    }

    /**
     * @param {function} callback
     * @param {Number} wait
     * @returns {function}
     */
    function debounce(callback, wait) {
      let timer;
      let debounced = (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), wait);
      };
      debounced.cancel = () => {
        clearTimeout(timer);
      };
      return debounced;
    }

    const TRANSPARENT_PIXEL_SRC =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

    function preloadImage(src) {
      let image = new Image();

      let promise = new Promise((resolve, reject) => {
        image.src = src;
        image.onload = resolve;
        image.onerror = reject;
      });

      let cancel = () => {
        if (image.naturalWidth === 0) {
          image.src = TRANSPARENT_PIXEL_SRC;
        }
      };

      return { promise, image, cancel };
    }

    function batchPreloadImages(list) {
      let preloaders = [];

      for (let src of list) {
        let preload = preloadImage(src);
        preloaders.push(preload);
      }

      let images = preloaders.map((preload) => preload.image);
      let promise = Promise.allSettled(preloaders.map((preload) => preload.promise));
      let cancel = () => {
        preloaders.forEach((preload) => {
          preload.cancel();
        });
      };

      return { promise, images, cancel };
    }

    const OPERATIONS_ZEROS = {
      brightness: 0,
      exposure: 0,
      gamma: 100,
      contrast: 0,
      saturation: 0,
      vibrance: 0,
      warmth: 0,
      enhance: 0,
      filter: 0,
      rotate: 0,
    };

    /**
     * @param {String} operation
     * @param {Number | String | object} options
     * @returns {String}
     */
    function operationToStr(operation, options) {
      if (typeof options === 'number') {
        return OPERATIONS_ZEROS[operation] !== options ? `${operation}/${options}` : '';
      }

      if (typeof options === 'boolean') {
        return options && OPERATIONS_ZEROS[operation] !== options ? `${operation}` : '';
      }

      if (operation === 'filter') {
        if (!options || OPERATIONS_ZEROS[operation] === options.amount) {
          return '';
        }
        let { name, amount } = options;
        return `${operation}/${name}/${amount}`;
      }

      if (operation === 'crop') {
        if (!options) {
          return '';
        }
        let { dimensions, coords } = options;
        return `${operation}/${dimensions.join('x')}/${coords.join(',')}`;
      }

      return '';
    }

    /**
     * @param {String[]} list
     * @returns {String}
     */
    function joinCdnOperations(...list) {
      return list.join('/-/').replace(/\/\//g, '/');
    }

    const ORDER = [
      'enhance',
      'brightness',
      'exposure',
      'gamma',
      'contrast',
      'saturation',
      'vibrance',
      'warmth',
      'filter',
      'mirror',
      'flip',
      'rotate',
      'crop',
    ];

    /**
     * @param {any} transformations
     * @returns {String}
     */
    function transformationsToString(transformations) {
      return joinCdnOperations(
        ...ORDER.filter(
          (operation) => typeof transformations[operation] !== 'undefined' && transformations[operation] !== null
        )
          .map((operation) => {
            let options = transformations[operation];
            return operationToStr(operation, options);
          })
          .filter((str) => str && str.length > 0)
      );
    }

    /**
     * @param {String} originalUrl
     * @param {String[]} list
     * @returns {String}
     */
    function constructCdnUrl(originalUrl, ...list) {
      return (
        originalUrl.replace(/\/$/g, '') + '/-/' + joinCdnOperations(...list.filter((str) => str && str.length > 0)) + '/'
      );
    }

    const COMMON_OPERATIONS = ['format/auto', 'progressive/yes'].join('/-/');

    function initState(fnCtx) {
      return {
        '*originalUrl': null,
        '*tabId': null,
        '*faderEl': null,
        '*cropperEl': null,
        '*imgEl': null,
        '*imgContainerEl': null,
        '*modalEl': fnCtx,
        '*networkProblems': false,
        '*imageSize': null,

        entry: null,
        extension: null,
        editorMode: false,
        modalCaption: '',
        isImage: false,
        msg: '',
        src: TRANSPARENT_PIXEL_SRC,
        fileType: '',
        showLoader: false,
        uuid: null,

        'presence.networkProblems': false,
        'presence.modalCaption': true,
        'presence.editorToolbar': false,
        'presence.viewerToolbar': true,

        '*on.retryNetwork': () => {
          let images = fnCtx.querySelectorAll('img');
          for (let img of images) {
            let originalSrc = img.src;
            img.src = TRANSPARENT_PIXEL_SRC;
            img.src = originalSrc;
          }
          fnCtx.$['*networkProblems'] = false;
        },
        '*on.apply': (transformations) => {
          if (!transformations) {
            return;
          }
          let transformationsUrl = constructCdnUrl(
            fnCtx.$['*originalUrl'],
            transformationsToString(transformations),
            'preview'
          );
          fnCtx.dispatchEvent(
            new CustomEvent('apply', {
              detail: {
                originalUrl: fnCtx.$['*originalUrl'],
                transformationsUrl,
                transformations,
              },
            })
          );
          fnCtx.remove();
        },
        '*on.cancel': () => {
          fnCtx.remove();

          fnCtx.dispatchEvent(new CustomEvent('cancel'));
        },
      };
    }

    const TEMPLATE = /*html*/ `
<div class="wrapper wrapper_desktop">
  <uc-presence-toggle class="network_problems_splash" set="visible: presence.networkProblems;">
    <div class="network_problems_content">
      <div class="network_problems_icon">
        <uc-icon size="20" name="sad"></uc-icon>
      </div>
      <div class="network_problems_text">
        Network error
      </div>
    </div>
    <div class="network_problems_footer">
      <uc-btn-ui theme="primary" text="Retry" set="onclick: *on.retryNetwork"></uc-btn-ui>
    </div>
  </uc-presence-toggle>
  <div class="viewport">
    <div class="file_type_outer">
      <div class="file_type">{{fileType}}</div>
    </div>
    <div class="image_container" ref="img-container-el">
      <img src="${TRANSPARENT_PIXEL_SRC}" class="image image_visible_from_editor" ref="img-el">
      <uc-editor-image-cropper ref="cropper-el"></uc-editor-image-cropper>
      <uc-editor-image-fader ref="fader-el"></uc-editor-image-fader>
    </div>
    <div class="info_pan">{{msg}}</div>
  </div>
  <div class="toolbar">
    <uc-line-loader-ui set="active: showLoader"></uc-line-loader-ui>
    <div class="toolbar_content toolbar_content__editor">
      <uc-editor-toolbar></uc-editor-toolbar>
    </div>
  </div>
</div>
`;

    const TabId = {
      CROP: 'crop',
      SLIDERS: 'sliders',
      FILTERS: 'filters',
    };
    const TABS = [TabId.CROP, TabId.SLIDERS, TabId.FILTERS];

    const ALL_COLOR_OPERATIONS = [
      'brightness',
      'exposure',
      'gamma',
      'contrast',
      'saturation',
      'vibrance',
      'warmth',
      'enhance',
    ];

    const ALL_FILTERS = [
      'adaris',
      'briaril',
      'calarel',
      'carris',
      'cynarel',
      'cyren',
      'elmet',
      'elonni',
      'enzana',
      'erydark',
      'fenralan',
      'ferand',
      'galen',
      'gavin',
      'gethriel',
      'iorill',
      'iothari',
      'iselva',
      'jadis',
      'lavra',
      'misiara',
      'namala',
      'nerion',
      'nethari',
      'pamaya',
      'sarnar',
      'sedis',
      'sewen',
      'sorahel',
      'sorlen',
      'tarian',
      'thellassan',
      'varriel',
      'varven',
      'vevera',
      'virkas',
      'yedis',
      'yllara',
      'zatvel',
      'zevcen',
    ];

    const ALL_CROP_OPERATIONS = ['rotate', 'mirror', 'flip'];

    /** KeypointsNumber is the number of keypoints loaded from each side of zero, not total number */
    const COLOR_OPERATIONS_CONFIG = {
      brightness: {
        zero: OPERATIONS_ZEROS.brightness,
        range: [-100, 100],
        keypointsNumber: 2,
      },
      exposure: {
        zero: OPERATIONS_ZEROS.exposure,
        range: [-500, 500],
        keypointsNumber: 2,
      },
      gamma: {
        zero: OPERATIONS_ZEROS.gamma,
        range: [0, 1000],
        keypointsNumber: 2,
      },
      contrast: {
        zero: OPERATIONS_ZEROS.contrast,
        range: [-100, 500],
        keypointsNumber: 2,
      },
      saturation: {
        zero: OPERATIONS_ZEROS.saturation,
        range: [-100, 500],
        keypointsNumber: 1,
      },
      vibrance: {
        zero: OPERATIONS_ZEROS.vibrance,
        range: [-100, 500],
        keypointsNumber: 1,
      },
      warmth: {
        zero: OPERATIONS_ZEROS.warmth,
        range: [-100, 100],
        keypointsNumber: 1,
      },
      enhance: {
        zero: OPERATIONS_ZEROS.enhance,
        range: [0, 100],
        keypointsNumber: 1,
      },
      filter: {
        zero: OPERATIONS_ZEROS.filter,
        range: [0, 100],
        keypointsNumber: 1,
      },
    };

    function viewerImageSrc(originalUrl, width, transformations) {
      const MAX_CDN_DIMENSION = 3000;
      let dpr = window.devicePixelRatio;
      let size = Math.min(Math.ceil(width * dpr), MAX_CDN_DIMENSION);
      let quality = dpr >= 2 ? 'lightest' : 'normal';

      return constructCdnUrl(
        originalUrl,
        COMMON_OPERATIONS,
        transformationsToString(transformations),
        `quality/${quality}`,
        `stretch/off/-/resize/${size}x`
      );
    }

    class CloudEditor extends Block {
      init$ = initState(this);

      /** @private */
      _debouncedShowLoader = debounce(this._showLoader.bind(this), 300);

      _showLoader(show) {
        this.$.showLoader = show;
      }

      _loadImageFromCdn() {
        this._debouncedShowLoader(true);
        let src = this._imageSrc();
        let { promise, cancel } = preloadImage(src);
        promise
          .then(() => {
            this.$.src = src;
          })
          .catch((err) => {
            this.$['*networkProblems'] = true;
            this._debouncedShowLoader(false);
            this.$.src = src;
          });
        this._cancelPreload && this._cancelPreload();
        this._cancelPreload = cancel;
      }

      _imageSrc() {
        let { width } = this.ref['img-container-el'].getBoundingClientRect();
        return viewerImageSrc(this.$['*originalUrl'], width, {});
      }

      /**
       * To proper work, we need non-zero size the element. So, we'll wait for it.
       *
       * @private
       * @returns {Promise<void>}
       */
      _waitForSize() {
        return new Promise((resolve, reject) => {
          let timeout = 300;
          let start = Date.now();

          let callback = () => {
            // there could be problem when element disconnected and connected again between ticks
            if (!this.isConnected) {
              clearInterval(interval);
              reject();
              return;
            }
            if (Date.now() - start > timeout) {
              clearInterval(interval);
              reject(new Error('[cloud-image-editor] timout waiting for non-zero container size'));
              return;
            }
            let { width, height } = this.getBoundingClientRect();

            if (width > 0 && height > 0) {
              clearInterval(interval);
              resolve();
            }
          };
          let interval = setInterval(callback, 50);
          callback();
        });
      }

      async initCallback() {
        super.initCallback();

        try {
          await this._waitForSize();
        } catch (err) {
          if (err) {
            console.error(err);
          }
          // no error - element become disconnected from dom - stop init
          return;
        }

        // TODO: fix hardcode
        this.$['*originalUrl'] = `https://ucarecdn.com/${this.$.uuid}/`;

        fetch(`${this.$['*originalUrl']}-/json/`)
          .then((response) => response.json())
          .then(({ width, height }) => {
            this.$['*imageSize'] = { width, height };
          });

        this._loadImageFromCdn();

        this.$['*faderEl'] = this.ref['fader-el'];
        this.$['*cropperEl'] = this.ref['cropper-el'];
        this.$['*imgContainerEl'] = this.ref['img-container-el'];

        this.classList.add('editor_ON');

        this.sub('*networkProblems', (networkProblems) => {
          this.$['presence.networkProblems'] = networkProblems;
          this.$['presence.modalCaption'] = !networkProblems;
        });

        this.ref['img-el'].addEventListener('load', (e) => {
          this._imgLoading = false;
          this._debouncedShowLoader(false);

          if (this.$.src !== TRANSPARENT_PIXEL_SRC) {
            this.$['*networkProblems'] = false;
          }
        });

        this.ref['img-el'].addEventListener('error', (e) => {
          this._imgLoading = false;
          this._debouncedShowLoader(false);

          this.$['*networkProblems'] = true;
        });

        this.sub('src', (src) => {
          let el = this.ref['img-el'];
          if (el.src !== src) {
            this._imgLoading = true;
            el.src = src || TRANSPARENT_PIXEL_SRC;
          }
        });

        this.sub('*tabId', (tabId) => {
          this.ref['img-el'].className = classNames('image', {
            image_hidden_to_cropper: tabId === TabId.CROP,
            image_hidden_effects: tabId !== TabId.CROP,
          });
        });
      }

      disconnectedCallback() {
        super.disconnectedCallback();
      }
    }

    CloudEditor.template = TEMPLATE;
    CloudEditor.bindAttributes({
      uuid: 'uuid',
    });

    const CROP_PADDING = 20;
    const THUMB_CORNER_SIZE = 24;
    const THUMB_SIDE_SIZE = 34;
    const THUMB_STROKE_WIDTH = 3;
    const THUMB_OFFSET = THUMB_STROKE_WIDTH / 2;

    const GUIDE_STROKE_WIDTH = 1;
    const GUIDE_THIRD = 100 / 3;
    const MIN_CROP_SIZE = THUMB_CORNER_SIZE * 2 + THUMB_SIDE_SIZE;

    /**
     * @param {SVGElement} node
     * @param {{ [key: String]: String | Number }} attrs
     */
    function setSvgNodeAttrs(node, attrs) {
      for (let p in attrs) node.setAttributeNS(null, p, attrs[p].toString());
    }

    /**
     * @param {String} name
     * @param {{ [key: String]: String | Number }} attrs
     * @returns {SVGElement}
     */
    function createSvgNode(name, attrs = {}) {
      let node = document.createElementNS('http://www.w3.org/2000/svg', name);
      setSvgNodeAttrs(node, attrs);
      return node;
    }

    /**
     * @param {import('./types.js').Rectangle} rect
     * @param {String} direction
     */
    function cornerPath(rect, direction) {
      let { x, y, width, height } = rect;

      let wMul = direction.includes('w') ? 0 : 1;
      let hMul = direction.includes('n') ? 0 : 1;
      let xSide = [-1, 1][wMul];
      let ySide = [-1, 1][hMul];

      let p1 = [
        x + wMul * width + THUMB_OFFSET * xSide,
        y + hMul * height + THUMB_OFFSET * ySide - THUMB_CORNER_SIZE * ySide,
      ];
      let p2 = [x + wMul * width + THUMB_OFFSET * xSide, y + hMul * height + THUMB_OFFSET * ySide];
      let p3 = [
        x + wMul * width - THUMB_CORNER_SIZE * xSide + THUMB_OFFSET * xSide,
        y + hMul * height + THUMB_OFFSET * ySide,
      ];

      let path = `M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]}`;
      let center = p2;

      return {
        d: path,
        center,
      };
    }

    /**
     * @param {import('./types.js').Rectangle} rect
     * @param {String} direction
     */
    function sidePath(rect, direction) {
      let { x, y, width, height } = rect;

      let wMul = ['n', 's'].includes(direction) ? 0.5 : { w: 0, e: 1 }[direction];
      let hMul = ['w', 'e'].includes(direction) ? 0.5 : { n: 0, s: 1 }[direction];
      let xSide = [-1, 1][wMul];
      let ySide = [-1, 1][hMul];

      let p1, p2;
      if (['n', 's'].includes(direction)) {
        p1 = [x + wMul * width - THUMB_SIDE_SIZE / 2, y + hMul * height + THUMB_OFFSET * ySide];
        p2 = [x + wMul * width + THUMB_SIDE_SIZE / 2, y + hMul * height + THUMB_OFFSET * ySide];
      } else {
        p1 = [x + wMul * width + THUMB_OFFSET * xSide, y + hMul * height - THUMB_SIDE_SIZE / 2];
        p2 = [x + wMul * width + THUMB_OFFSET * xSide, y + hMul * height + THUMB_SIDE_SIZE / 2];
      }
      let path = `M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]}`;
      let center = [p2[0] - (p2[0] - p1[0]) / 2, p2[1] - (p2[1] - p1[1]) / 2];

      return { d: path, center };
    }

    /** @param {String} direction */
    function thumbCursor(direction) {
      if (direction === '') {
        return 'move';
      }
      if (['e', 'w'].includes(direction)) {
        return 'ew-resize';
      }
      if (['n', 's'].includes(direction)) {
        return 'ns-resize';
      }
      if (['nw', 'se'].includes(direction)) {
        return 'nwse-resize';
      }
      return 'nesw-resize';
    }

    /**
     * @param {import('./types.js').Rectangle} rect
     * @param {[Number, Number]} delta
     */
    function moveRect(rect, [dx, dy]) {
      return {
        ...rect,
        x: rect.x + dx,
        y: rect.y + dy,
      };
    }

    /**
     * @param {import('./types.js').Rectangle} rect1
     * @param {import('./types.js').Rectangle} rect2
     */
    function constraintRect(rect1, rect2) {
      let { x } = rect1;
      let { y } = rect1;
      if (rect1.x < rect2.x) {
        x = rect2.x;
      } else if (rect1.x + rect1.width > rect2.x + rect2.width) {
        x = rect2.x + rect2.width - rect1.width;
      }
      if (rect1.y < rect2.y) {
        y = rect2.y;
      } else if (rect1.y + rect1.height > rect2.y + rect2.height) {
        y = rect2.y + rect2.height - rect1.height;
      }

      return {
        ...rect1,
        x,
        y,
      };
    }

    /**
     * @param {import('./types.js').Rectangle} rect
     * @param {[Number, Number]} delta
     * @param {String} direction
     */
    function expandRect(rect, [dx, dy], direction) {
      let { x, y, width, height } = rect;

      if (direction.includes('n')) {
        y += dy;
        height -= dy;
      }
      if (direction.includes('s')) {
        height += dy;
      }
      if (direction.includes('w')) {
        x += dx;
        width -= dx;
      }
      if (direction.includes('e')) {
        width += dx;
      }
      return {
        x,
        y,
        width,
        height,
      };
    }

    /**
     * @param {import('./types.js').Rectangle} rect1
     * @param {import('./types.js').Rectangle} rect2
     */
    function intersectionRect(rect1, rect2) {
      let leftX = Math.max(rect1.x, rect2.x);
      let rightX = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
      let topY = Math.max(rect1.y, rect2.y);
      let bottomY = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);

      return { x: leftX, y: topY, width: rightX - leftX, height: bottomY - topY };
    }

    /**
     * @param {import('./types.js').Rectangle} rect
     * @param {[Number, Number]} minSize
     * @param {String} direction
     */
    function minRectSize(rect, [minWidth, minHeight], direction) {
      let { x, y, width, height } = rect;

      if (direction.includes('n')) {
        let prevHeight = height;
        height = Math.max(minHeight, height);
        y = y + prevHeight - height;
      }
      if (direction.includes('s')) {
        height = Math.max(minHeight, height);
      }
      if (direction.includes('w')) {
        let prevWidth = width;
        width = Math.max(minWidth, width);
        x = x + prevWidth - width;
      }
      if (direction.includes('e')) {
        width = Math.max(minWidth, width);
      }

      return { x, y, width, height };
    }

    /**
     * @param {import('./types.js').Rectangle} rect
     * @param {[Number, Number]} point
     */
    function rectContainsPoint(rect, [x, y]) {
      return rect.x <= x && x <= rect.x + rect.width && rect.y <= y && y <= rect.y + rect.height;
    }

    class CropFrame extends Block {
      init$ = {
        dragging: false,
      };

      constructor() {
        super();

        /** @private */
        this._handlePointerUp = this._handlePointerUp_.bind(this);

        /** @private */
        this._handlePointerMove = this._handlePointerMove_.bind(this);

        /** @private */
        this._handleSvgPointerMove = this._handleSvgPointerMove_.bind(this);
      }

      _shouldThumbBeDisabled(direction) {
        let imageBox = this.$['*imageBox'];
        if (!imageBox) {
          return;
        }

        if (direction === '' && imageBox.height <= MIN_CROP_SIZE && imageBox.width <= MIN_CROP_SIZE) {
          return true;
        }

        let tooHigh = imageBox.height <= MIN_CROP_SIZE && (direction.includes('n') || direction.includes('s'));
        let tooWide = imageBox.width <= MIN_CROP_SIZE && (direction.includes('e') || direction.includes('w'));
        return tooHigh || tooWide;
      }

      _createBackdrop() {
        /** @type {import('./types.js').Rectangle} */
        let cropBox = this.$['*cropBox'];
        if (!cropBox) {
          return;
        }
        let { x, y, width, height } = cropBox;
        let svg = this.ref['svg-el'];

        let mask = createSvgNode('mask', { id: 'backdrop-mask' });
        let maskRectOuter = createSvgNode('rect', {
          x: 0,
          y: 0,
          width: '100%',
          height: '100%',
          fill: 'white',
        });
        let maskRectInner = createSvgNode('rect', {
          x,
          y,
          width,
          height,
          fill: 'black',
        });
        mask.appendChild(maskRectOuter);
        mask.appendChild(maskRectInner);

        let backdropRect = createSvgNode('rect', {
          x: 0,
          y: 0,
          width: '100%',
          height: '100%',
          fill: 'var(--color-image-background)',
          'fill-opacity': 0.85,
          mask: 'url(#backdrop-mask)',
        });
        svg.appendChild(backdropRect);
        svg.appendChild(mask);

        this._backdropMask = mask;
        this._backdropMaskInner = maskRectInner;
      }

      /** Super tricky workaround for the chromium bug See https://bugs.chromium.org/p/chromium/issues/detail?id=330815 */
      _resizeBackdrop() {
        if (!this._backdropMask) {
          return;
        }
        this._backdropMask.style.display = 'none';
        window.requestAnimationFrame(() => {
          this._backdropMask.style.display = 'block';
        });
      }

      _updateBackdrop() {
        /** @type {import('./types.js').Rectangle} */
        let cropBox = this.$['*cropBox'];
        if (!cropBox) {
          return;
        }
        let { x, y, width, height } = cropBox;

        setSvgNodeAttrs(this._backdropMaskInner, { x, y, width, height });
      }

      _updateFrame() {
        /** @type {import('./types.js').Rectangle} */
        let cropBox = this.$['*cropBox'];
        if (!cropBox) {
          return;
        }
        for (let thumb of Object.values(this._frameThumbs)) {
          let { direction, pathNode, interactionNode, groupNode } = thumb;
          let isCenter = direction === '';
          let isCorner = direction.length === 2;

          if (isCenter) {
            let { x, y, width, height } = cropBox;
            let center = [x + width / 2, y + height / 2];
            setSvgNodeAttrs(interactionNode, {
              r: Math.min(width, height) / 3,
              cx: center[0],
              cy: center[1],
            });
          } else {
            let { d, center } = isCorner ? cornerPath(cropBox, direction) : sidePath(cropBox, direction);
            setSvgNodeAttrs(interactionNode, { cx: center[0], cy: center[1] });
            setSvgNodeAttrs(pathNode, { d });
          }

          let disableThumb = this._shouldThumbBeDisabled(direction);
          groupNode.setAttribute(
            'class',
            classNames('thumb', {
              'thumb--hidden': disableThumb,
              'thumb--visible': !disableThumb,
            })
          );
        }

        let frameGuides = this._frameGuides;
        setSvgNodeAttrs(frameGuides, {
          x: cropBox.x - GUIDE_STROKE_WIDTH * 0.5,
          y: cropBox.y - GUIDE_STROKE_WIDTH * 0.5,
          width: cropBox.width + GUIDE_STROKE_WIDTH,
          height: cropBox.height + GUIDE_STROKE_WIDTH,
        });
      }

      _createThumbs() {
        let frameThumbs = {};

        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            let direction = `${['n', '', 's'][i]}${['w', '', 'e'][j]}`;
            let groupNode = createSvgNode('g');
            groupNode.classList.add('thumb');
            groupNode.setAttribute('with-effects', '');
            let interactionNode = createSvgNode('circle', {
              r: THUMB_CORNER_SIZE + THUMB_OFFSET,
              fill: 'transparent',
            });
            let pathNode = createSvgNode('path', {
              stroke: 'currentColor',
              fill: 'none',
              'stroke-width': THUMB_STROKE_WIDTH,
            });
            groupNode.appendChild(pathNode);
            groupNode.appendChild(interactionNode);
            frameThumbs[direction] = {
              direction,
              pathNode,
              interactionNode,
              groupNode,
            };

            interactionNode.addEventListener('pointerdown', this._handlePointerDown.bind(this, direction));
          }
        }

        return frameThumbs;
      }

      _createGuides() {
        let svg = createSvgNode('svg');

        let rect = createSvgNode('rect', {
          x: 0,
          y: 0,
          width: '100%',
          height: '100%',
          fill: 'none',
          stroke: '#000000',
          'stroke-width': GUIDE_STROKE_WIDTH,
          'stroke-opacity': 0.5,
        });
        svg.appendChild(rect);

        for (let i = 1; i <= 2; i++) {
          let line = createSvgNode('line', {
            x1: `${GUIDE_THIRD * i}%`,
            y1: `0%`,
            x2: `${GUIDE_THIRD * i}%`,
            y2: `100%`,
            stroke: '#000000',
            'stroke-width': GUIDE_STROKE_WIDTH,
            'stroke-opacity': 0.3,
          });
          svg.appendChild(line);
        }

        for (let i = 1; i <= 2; i++) {
          let line = createSvgNode('line', {
            x1: `0%`,
            y1: `${GUIDE_THIRD * i}%`,
            x2: `100%`,
            y2: `${GUIDE_THIRD * i}%`,
            stroke: '#000000',
            'stroke-width': GUIDE_STROKE_WIDTH,
            'stroke-opacity': 0.3,
          });
          svg.appendChild(line);
        }

        svg.classList.add('guides', 'guides--semi-hidden');

        return svg;
      }

      _createFrame() {
        let svg = this.ref['svg-el'];
        let fr = document.createDocumentFragment();

        let frameGuides = this._createGuides();
        fr.appendChild(frameGuides);

        let frameThumbs = this._createThumbs();
        for (let { groupNode } of Object.values(frameThumbs)) {
          fr.appendChild(groupNode);
        }

        svg.appendChild(fr);
        this._frameThumbs = frameThumbs;
        this._frameGuides = frameGuides;
      }

      _handlePointerDown(direction, e) {
        let thumb = this._frameThumbs[direction];
        if (this._shouldThumbBeDisabled(direction)) {
          return;
        }

        let cropBox = this.$['*cropBox'];
        let { x: svgX, y: svgY } = this.ref['svg-el'].getBoundingClientRect();
        let x = e.x - svgX;
        let y = e.y - svgY;

        this.$.dragging = true;
        this._draggingThumb = thumb;
        this._dragStartPoint = [x, y];
        /** @type {import('./types.js').Rectangle} */
        this._dragStartCrop = { ...cropBox };
      }

      _handlePointerUp_(e) {
        this._updateCursor();

        if (!this.$.dragging) {
          return;
        }
        e.stopPropagation();
        e.preventDefault();

        this.$.dragging = false;
      }

      _handlePointerMove_(e) {
        if (!this.$.dragging) {
          return;
        }
        e.stopPropagation();
        e.preventDefault();

        let svg = this.ref['svg-el'];
        let { x: svgX, y: svgY } = svg.getBoundingClientRect();
        let x = e.x - svgX;
        let y = e.y - svgY;
        let dx = x - this._dragStartPoint[0];
        let dy = y - this._dragStartPoint[1];
        let { direction } = this._draggingThumb;

        /** @type {import('./types.js').Rectangle} */
        let imageBox = this.$['*imageBox'];
        let rect = this._dragStartCrop;

        if (direction === '') {
          rect = moveRect(rect, [dx, dy]);
          rect = constraintRect(rect, imageBox);
        } else {
          rect = expandRect(rect, [dx, dy], direction);
          rect = intersectionRect(rect, imageBox);
        }
        /** @type {[Number, Number]} */
        let minCropRect = [Math.min(imageBox.width, MIN_CROP_SIZE), Math.min(imageBox.height, MIN_CROP_SIZE)];
        rect = minRectSize(rect, minCropRect, direction);

        if (!Object.values(rect).every((number) => Number.isFinite(number) && number >= 0)) {
          console.error('CropFrame is trying to create invalid rectangle', {
            payload: rect,
          });
          return;
        }
        this.$['*cropBox'] = rect;
      }

      _handleSvgPointerMove_(e) {
        let hoverThumb = Object.values(this._frameThumbs).find((thumb) => {
          if (this._shouldThumbBeDisabled(thumb.direction)) {
            return false;
          }
          let node = thumb.groupNode;
          let bounds = node.getBoundingClientRect();
          let rect = {
            x: bounds.x,
            y: bounds.y,
            width: bounds.width,
            height: bounds.height,
          };
          let hover = rectContainsPoint(rect, [e.x, e.y]);
          return hover;
        });

        this._hoverThumb = hoverThumb;
        this._updateCursor();
      }

      _updateCursor() {
        let hoverThumb = this._hoverThumb;
        this.ref['svg-el'].style.cursor = hoverThumb ? thumbCursor(hoverThumb.direction) : 'initial';
      }

      _render() {
        this._updateBackdrop();
        this._updateFrame();
      }

      toggleThumbs(visible) {
        Object.values(this._frameThumbs)
          .map(({ groupNode }) => groupNode)
          .forEach((groupNode) => {
            groupNode.setAttribute(
              'class',
              classNames('thumb', {
                'thumb--hidden': !visible,
                'thumb--visible': visible,
              })
            );
          });
      }

      initCallback() {
        super.initCallback();

        this._createBackdrop();
        this._createFrame();

        this.sub('*imageBox', () => {
          this._resizeBackdrop();
          window.requestAnimationFrame(() => {
            this._render();
          });
        });

        this.sub('*cropBox', (cropBox) => {
          if (!cropBox) {
            return;
          }
          this._guidesHidden = cropBox.height <= MIN_CROP_SIZE || cropBox.width <= MIN_CROP_SIZE;
          window.requestAnimationFrame(() => {
            this._render();
          });
        });

        this.sub('dragging', (dragging) => {
          this._frameGuides.setAttribute(
            'class',
            classNames({
              'guides--hidden': this._guidesHidden,
              'guides--visible': !this._guidesHidden && dragging,
              'guides--semi-hidden': !this._guidesHidden && !dragging,
            })
          );
        });

        this.ref['svg-el'].addEventListener('pointermove', this._handleSvgPointerMove, true);
        document.addEventListener('pointermove', this._handlePointerMove, true);
        document.addEventListener('pointerup', this._handlePointerUp, true);
      }

      disconnectedCallback() {
        super.disconnectedCallback();

        document.removeEventListener('pointermove', this._handlePointerMove);
        document.removeEventListener('pointerup', this._handlePointerUp);
      }
    }

    CropFrame.template = /*html*/ `
  <svg class='svg' ref='svg-el' xmlns="http://www.w3.org/2000/svg">
  </svg>
`;

    class EditorButtonControl extends Block {
      init$ = {
        active: false,
        title: '',
        icon: '',
        'on.click': null,
      };

      initCallback() {
        super.initCallback();

        this._titleEl = this.ref['title-el'];
        this._iconEl = this.ref['icon-el'];

        this.setAttribute('role', 'button');
        if (this.tabIndex === -1) {
          this.tabIndex = 0;
        }

        this.sub('title', (title) => {
          let titleEl = this._titleEl;
          if (titleEl) {
            this._titleEl.style.display = title ? 'block' : 'none';
          }
        });

        this.sub('active', (active) => {
          this.className = classNames({
            active: active,
            not_active: !active,
          });
        });

        this.sub('on.click', (onClick) => {
          this.onclick = onClick;
        });
      }
    }

    EditorButtonControl.template = /*html*/ `
  <div class="before"></div>
  <uc-icon size="20" set="@name: icon;"></uc-icon>
  <div class="title" ref="title-el">{{title}}</div>
`;

    function nextAngle(prev) {
      let angle = prev + 90;
      angle = angle >= 360 ? 0 : angle;
      return angle;
    }

    function nextValue(operation, prev) {
      if (operation === 'rotate') {
        return nextAngle(prev);
      }
      if (['mirror', 'flip'].includes(operation)) {
        return !prev;
      }
      return null;
    }

    class EditorCropButtonControl extends EditorButtonControl {
      initCallback() {
        super.initCallback();

        this.defineAccessor('operation', (operation) => {
          if (!operation) {
            return;
          }

          /** @private */
          this._operation = operation;
          this.$['icon'] = operation;
        });

        this.$['on.click'] = (e) => {
          let prev = this.$['*cropperEl'].getValue(this._operation);
          let next = nextValue(this._operation, prev);
          this.$['*cropperEl'].setValue(this._operation, next);
        };
      }
    }

    const ControlType = {
      FILTER: 'filter',
      COLOR_OPERATION: 'color_operation',
    };

    const FAKE_ORIGINAL_FILTER = 'original';

    class EditorSlider extends Block {
      init$ = {
        disabled: false,
        min: 0,
        max: 100,
        value: 0,
        defaultValue: 0,
        zero: 0,
        'on.input': (value) => {
          this.$['*faderEl'].set(value);
          this.$.value = value;
        },
      };

      /**
       * @param {String} operation
       * @param {String} [filter]
       */
      setOperation(operation, filter) {
        this._controlType = operation === 'filter' ? ControlType.FILTER : ControlType.COLOR_OPERATION;
        this._operation = operation;
        this._iconName = operation;
        this._title = operation.toUpperCase();
        this._filter = filter;

        this._initializeValues();

        this.$['*faderEl'].activate({
          url: this.$['*originalUrl'],
          operation: this._operation,
          value: this._filter === FAKE_ORIGINAL_FILTER ? undefined : this.$.value,
          filter: this._filter === FAKE_ORIGINAL_FILTER ? undefined : this._filter,
          fromViewer: false,
        });
      }

      /** @private */
      _initializeValues() {
        let { range, zero } = COLOR_OPERATIONS_CONFIG[this._operation];
        let [min, max] = range;

        this.$.min = min;
        this.$.max = max;
        this.$.zero = zero;

        let transformation = this.$['*editorTransformations'][this._operation];
        if (this._controlType === ControlType.FILTER) {
          let value = max;
          if (transformation) {
            let { name, amount } = transformation;
            value = name === this._filter ? amount : max;
          }
          this.$.value = value;
          this.$.defaultValue = value;
        }
        if (this._controlType === ControlType.COLOR_OPERATION) {
          let value = typeof transformation !== 'undefined' ? transformation : zero;
          this.$.value = value;
          this.$.defaultValue = value;
        }
      }

      apply() {
        let operationValue;
        if (this._controlType === ControlType.FILTER) {
          if (this._filter === FAKE_ORIGINAL_FILTER) {
            operationValue = null;
          } else {
            operationValue = { name: this._filter, amount: this.$.value };
          }
        } else {
          operationValue = this.$.value;
        }

        /** @type {import('./types.js').Transformations} */
        let transformations = {
          ...this.$['*editorTransformations'],
          [this._operation]: operationValue,
        };

        this.$['*editorTransformations'] = transformations;
      }

      cancel() {
        this.$['*faderEl'].deactivate({ hide: false });
      }

      connectedCallback() {
        super.connectedCallback();

        this.sub('*originalUrl', (originalUrl) => {
          this._originalUrl = originalUrl;
        });

        this.sub('value', (value) => {
          let tooltip = `${this._filter || this._operation} ${value}`;
          this.$['*operationTooltip'] = tooltip;
        });
      }
    }

    EditorSlider.template = /*html*/ `
<uc-slider-ui ref="slider-el" set="disabled: disabled; min: min; max: max; defaultValue: defaultValue; zero: zero; onInput: on.input;"></uc-slider-ui>
`;

    class EditorFilterControl extends EditorButtonControl {
      init$ = {
        active: false,
        title: '',
        icon: '',
        isOriginal: false,
        iconSize: '20',
        'on.click': null,
      };

      _previewSrc() {
        let previewSize = parseInt(window.getComputedStyle(this).getPropertyValue('--l-base-min-width'), 10);
        let dpr = window.devicePixelRatio;
        let size = Math.ceil(dpr * previewSize);
        let quality = dpr >= 2 ? 'lightest' : 'normal';
        let filterValue = 100;

        /** @type {import('./types.js').Transformations} */
        let transformations = { ...this.$['*editorTransformations'] };
        transformations[this._operation] =
          this._filter !== FAKE_ORIGINAL_FILTER
            ? {
                name: this._filter,
                amount: filterValue,
              }
            : undefined;

        return constructCdnUrl(
          this._originalUrl,
          COMMON_OPERATIONS,
          transformationsToString(transformations),
          `quality/${quality}`,
          `scale_crop/${size}x${size}/center`
        );
      }

      /**
       * @param {IntersectionObserverEntry[]} entries
       * @param {IntersectionObserver} observer
       */
      _observerCallback(entries, observer) {
        let intersectionEntry = entries[0];
        if (intersectionEntry.isIntersecting) {
          let src = this._previewSrc();
          let previewEl = this.ref['preview-el'];
          let { promise, cancel } = preloadImage(src);
          this._cancelPreload = cancel;
          promise
            .catch((err) => {
              this.$['*networkProblems'] = true;
              console.error('Failed to load image', { error: err });
            })
            .finally(() => {
              previewEl.style.backgroundImage = `url(${src})`;
              setTimeout(() => {
                previewEl.style.opacity = '1';
              });

              // @ts-ignore
              observer.unobserve(this);
            });
        } else {
          this._cancelPreload && this._cancelPreload();
        }
      }

      initCallback() {
        super.initCallback();

        this.$['on.click'] = (e) => {
          if (!this.$.active) {
            this.$['*sliderEl'].setOperation(this._operation, this._filter);
            this.$['*sliderEl'].apply();
          } else if (!this.$.isOriginal) {
            this.$['*sliderEl'].setOperation(this._operation, this._filter);
            this.$['*showSlider'] = true;
          }

          this.$['*currentFilter'] = this._filter;
        };

        this.defineAccessor('filter', (filter) => {
          this._operation = 'filter';
          this._filter = filter;
          this.$.isOriginal = filter === FAKE_ORIGINAL_FILTER;
          this.$.icon = this.$.isOriginal ? 'original' : 'slider';
        });

        this._observer = new window.IntersectionObserver(this._observerCallback.bind(this), {
          threshold: [0, 1],
        });

        let originalUrl = this.$['*originalUrl'];
        this._originalUrl = originalUrl;

        if (this.$.isOriginal) {
          this.ref['icon-el'].classList.add('original-icon');
        } else {
          this._observer.observe(this);
        }

        this.sub('*currentFilter', (currentFilter) => {
          this.$.active = currentFilter && currentFilter === this._filter;
        });

        this.sub('isOriginal', (isOriginal) => {
          this.$.iconSize = isOriginal ? 40 : 20;
        });

        this.sub('active', (active) => {
          if (this.$.isOriginal) {
            return;
          }
          let iconEl = this.ref['icon-el'];
          iconEl.style.opacity = active ? '1' : '0';

          let previewEl = this.ref['preview-el'];
          if (active) {
            previewEl.style.opacity = '0';
          } else if (previewEl.style.backgroundImage) {
            previewEl.style.opacity = '1';
          }
        });

        this.sub('*networkProblems', (networkProblems) => {
          if (!networkProblems) {
            let src = this._previewSrc();
            let previewEl = this.ref['preview-el'];
            if (previewEl.style.backgroundImage) {
              previewEl.style.backgroundImage = 'none';
              previewEl.style.backgroundImage = `url(${src})`;
            }
          }
        });
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        // @ts-ignore
        this._observer.unobserve(this);
        this._observer = undefined;
        this._cancelPreload && this._cancelPreload();
      }
    }

    EditorFilterControl.template = /*html*/ `
  <div class="before"></div>
  <div class="preview" ref="preview-el"></div>
  <uc-icon size="40" ref="icon-el" set="@name: icon; @size: iconSize;"></uc-icon>
`;

    class EditorOperationControl extends EditorButtonControl {
      /**
       * @private
       * @type {String}
       */
      _operation = '';

      initCallback() {
        super.initCallback();

        this.$['on.click'] = (e) => {
          this.$['*sliderEl'].setOperation(this._operation);
          this.$['*showSlider'] = true;
          this.$['*currentOperation'] = this._operation;
        };

        this.defineAccessor('operation', (operation) => {
          if (operation) {
            this._operation = operation;
            this.$['icon'] = operation;
            this.$.title = this.l10n(operation);
          }
        });

        this.sub('*editorTransformations', (editorTransformations) => {
          if (!this._operation) {
            return;
          }

          let { zero } = COLOR_OPERATIONS_CONFIG[this._operation];
          let value = editorTransformations[this._operation];
          let isActive = typeof value !== 'undefined' ? value !== zero : false;
          this.$.active = isActive;
        });
      }
    }

    /**
     * @param {{}} obj
     * @param {String[]} keys
     * @returns {{}}
     */
    function pick(obj, keys) {
      let result = {};
      for (let key of keys) {
        let value = obj[key];
        if (obj.hasOwnProperty(key) || value !== undefined) {
          result[key] = value;
        }
      }
      return result;
    }

    const ResizeObserver =
      window.ResizeObserver ||
      class UcResizeObserver {
        /** @param {Function} callback */
        constructor(callback) {
          this._callback = callback;
        }

        /** @param {Element} el */
        _flush(el) {
          let rect = el.getBoundingClientRect();
          if (JSON.stringify(rect) !== JSON.stringify(this._lastRect)) {
            this._callback([
              {
                borderBoxSize: [
                  {
                    inlineSize: rect.width,
                    blockSize: rect.height,
                  },
                ],
                contentBoxSize: [
                  {
                    inlineSize: rect.width,
                    blockSize: rect.height,
                  },
                ],
                contentRect: rect,
                target: el,
              },
            ]);
          }
          this._lastRect = rect;
        }

        /** @param {Element} el */
        observe(el) {
          this.unobserve();
          this._observeInterval = window.setInterval(() => this._flush(el), 500);
          this._flush(el);
        }

        /** @param {Element} [el] */
        unobserve(el) {
          if (this._observeInterval) {
            window.clearInterval(this._observeInterval);
          }
        }
      };

    // @ts-nocheck

    /**
     * @typedef {Object} Operations
     * @property {boolean} flip
     * @property {boolean} mirror
     * @property {Number} rotate
     */

    /**
     * @param {Number} value
     * @param {Number} min
     * @param {Number} max
     * @returns {Number}
     */
    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    /**
     * @param {import('./types.js').ImageSize} imageSize
     * @param {Number} angle
     * @returns {import('./types.js').ImageSize}
     */
    function rotateSize({ width, height }, angle) {
      let swap = (angle / 90) % 2 !== 0;
      return { width: swap ? height : width, height: swap ? width : height };
    }

    /**
     * @param {import('./types.js').Transformations['crop']} crop
     * @returns {boolean}
     */
    function validateCrop(crop) {
      if (!crop) {
        return true;
      }
      /** @type {((arg: typeof crop) => boolean)[]} */
      let shouldMatch = [
        ({ dimensions, coords }) =>
          [...dimensions, ...coords].every((number) => Number.isInteger(number) && Number.isFinite(number)),
        ({ dimensions, coords }) => dimensions.every((d) => d > 0) && coords.every((c) => c >= 0),
      ];
      return shouldMatch.every((matcher) => matcher(crop));
    }

    class EditorImageCropper extends Block {
      init$ = {
        image: null,
        '*padding': CROP_PADDING,
        /** @type {Operations} */
        '*operations': {
          rotate: 0,
          mirror: false,
          flip: false,
        },
        /** @type {import('./types.js).Rectangle} */
        '*imageBox': {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        },
        /** @type {import('./types.js).Rectangle} */
        '*cropBox': {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        },
      };

      constructor() {
        super();

        /** @private */
        this._commitDebounced = debounce(this._commit.bind(this), 300);

        /** @private */
        this._handleResizeDebounced = debounce(this._handleResize.bind(this), 10);
      }

      /** @private */
      _handleResize() {
        this._initCanvas();
        this._alignImage();
        this._alignCrop();
        this._draw();
      }

      /** @private */
      _syncTransformations() {
        let transformations = this.$['*editorTransformations'];
        let pickedTransformations = pick(transformations, Object.keys(this.$['*operations']));
        let operations = { ...this.$['*operations'], ...pickedTransformations };
        this.$['*operations'] = operations;
      }

      /** @private */
      _initCanvas() {
        /** @type {HTMLCanvasElement} */
        let canvas = this.ref['canvas-el'];
        let ctx = canvas.getContext('2d');

        let width = this.offsetWidth;
        let height = this.offsetHeight;
        let dpr = window.devicePixelRatio;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        this._canvas = canvas;
        this._ctx = ctx;
      }

      /** @private */
      _alignImage() {
        if (!this._isActive || !this.$.image) {
          return;
        }

        let image = this.$.image;
        let padding = this.$['*padding'];
        let operations = this.$['*operations'];
        let { rotate } = operations;

        let bounds = { width: this.offsetWidth, height: this.offsetHeight };
        let naturalSize = rotateSize({ width: image.naturalWidth, height: image.naturalHeight }, rotate);

        if (naturalSize.width > bounds.width - padding * 2 || naturalSize.height > bounds.height - padding * 2) {
          let imageAspectRatio = naturalSize.width / naturalSize.height;
          let viewportAspectRatio = bounds.width / bounds.height;

          if (imageAspectRatio > viewportAspectRatio) {
            let width = bounds.width - padding * 2;
            let height = width / imageAspectRatio;
            let x = 0 + padding;
            let y = padding + (bounds.height - padding * 2) / 2 - height / 2;
            this.$['*imageBox'] = { x, y, width, height };
          } else {
            let height = bounds.height - padding * 2;
            let width = height * imageAspectRatio;
            let x = padding + (bounds.width - padding * 2) / 2 - width / 2;
            let y = 0 + padding;
            this.$['*imageBox'] = { x, y, width, height };
          }
        } else {
          let { width, height } = naturalSize;
          let x = padding + (bounds.width - padding * 2) / 2 - width / 2;
          let y = padding + (bounds.height - padding * 2) / 2 - height / 2;
          this.$['*imageBox'] = { x, y, width, height };
        }
      }

      /** @private */
      _alignCrop() {
        let cropBox = this.$['*cropBox'];
        let imageBox = this.$['*imageBox'];
        let operations = this.$['*operations'];
        let { rotate } = operations;
        let transformation = this.$['*editorTransformations']['crop'];

        if (transformation) {
          let {
            dimensions: [width, height],
            coords: [x, y],
          } = transformation;
          let { width: previewWidth, x: previewX, y: previewY } = this.$['*imageBox'];
          let { width: sourceWidth } = rotateSize(this._imageSize, rotate);
          let ratio = previewWidth / sourceWidth;
          cropBox = {
            x: previewX + x * ratio,
            y: previewY + y * ratio,
            width: width * ratio,
            height: height * ratio,
          };
        } else {
          cropBox = {
            x: imageBox.x,
            y: imageBox.y,
            width: imageBox.width,
            height: imageBox.height,
          };
        }
        /** @type {[Number, Number]} */
        let minCropRect = [Math.min(imageBox.width, MIN_CROP_SIZE), Math.min(imageBox.height, MIN_CROP_SIZE)];
        cropBox = minRectSize(cropBox, minCropRect, 'se');
        cropBox = constraintRect(cropBox, imageBox);

        this.$['*cropBox'] = cropBox;
      }

      /** @private */
      _drawImage() {
        let image = this.$.image;
        let imageBox = this.$['*imageBox'];
        let operations = this.$['*operations'];
        let { mirror, flip, rotate } = operations;
        let ctx = this._ctx;
        let rotated = rotateSize({ width: imageBox.width, height: imageBox.height }, rotate);
        ctx.save();
        ctx.translate(imageBox.x + imageBox.width / 2, imageBox.y + imageBox.height / 2);
        ctx.rotate((rotate * Math.PI * -1) / 180);
        ctx.scale(mirror ? -1 : 1, flip ? -1 : 1);
        ctx.drawImage(image, -rotated.width / 2, -rotated.height / 2, rotated.width, rotated.height);
        ctx.restore();
      }

      /** @private */
      _draw() {
        if (!this._isActive || !this.$.image) {
          return;
        }
        let canvas = this._canvas;
        let ctx = this._ctx;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this._drawImage();
      }

      /** @private */
      _animateIn({ fromViewer }) {
        if (this.$.image) {
          this.ref['frame-el'].toggleThumbs(true);
          this._alignTransition();
          setTimeout(() => {
            this.className = classNames({
              active_from_viewer: fromViewer,
              active_from_editor: !fromViewer,
              inactive_to_editor: false,
              inactive_instant: false,
            });
          });
        }
      }

      /**
       * @private
       * @returns {import('./types.js').Transformations['crop']['dimensions']}
       */
      _calculateDimensions() {
        let cropBox = this.$['*cropBox'];
        let imageBox = this.$['*imageBox'];
        let operations = this.$['*operations'];
        let { rotate } = operations;
        let { width: previewWidth, height: previewHeight } = imageBox;
        let { width: sourceWidth, height: sourceHeight } = rotateSize(this._imageSize, rotate);
        let { width: cropWidth, height: cropHeight } = cropBox;
        let ratioW = previewWidth / sourceWidth;
        let ratioH = previewHeight / sourceHeight;

        /** @type {[Number, Number]} */
        let dimensions = [
          clamp(Math.round(cropWidth / ratioW), 1, sourceWidth),
          clamp(Math.round(cropHeight / ratioH), 1, sourceHeight),
        ];

        return dimensions;
      }

      /**
       * @private
       * @returns {import('./types.js').Transformations['crop']}
       */
      _calculateCrop() {
        let cropBox = this.$['*cropBox'];
        let imageBox = this.$['*imageBox'];
        let operations = this.$['*operations'];
        let { rotate } = operations;
        let { width: previewWidth, height: previewHeight, x: previewX, y: previewY } = imageBox;
        let { width: sourceWidth, height: sourceHeight } = rotateSize(this._imageSize, rotate);
        let { x: cropX, y: cropY } = cropBox;
        let ratioW = previewWidth / sourceWidth;
        let ratioH = previewHeight / sourceHeight;

        let dimensions = this._calculateDimensions();
        let crop = {
          dimensions,
          coords: /** @type {[Number, Number]} */ ([
            clamp(Math.round((cropX - previewX) / ratioW), 0, sourceWidth - dimensions[0]),
            clamp(Math.round((cropY - previewY) / ratioH), 0, sourceHeight - dimensions[1]),
          ]),
        };
        if (!validateCrop(crop)) {
          console.error('Cropper is trying to create invalid crop object', {
            payload: crop,
          });
          return undefined;
        }
        if (dimensions[0] === sourceWidth && dimensions[1] === sourceHeight) {
          return undefined;
        }

        return crop;
      }

      /** @private */
      _commit() {
        let operations = this.$['*operations'];
        let { rotate, mirror, flip } = operations;
        let crop = this._calculateCrop();
        /** @type {import('./types.js').Transformations} */
        let editorTransformations = this.$['*editorTransformations'];
        let transformations = {
          ...editorTransformations,
          crop,
          rotate,
          mirror,
          flip,
        };

        this.$['*editorTransformations'] = transformations;
      }

      /**
       * @param {String} operation
       * @param {Number} value
       * @returns {void}
       */
      setValue(operation, value) {
        console.log(`Apply cropper operation [${operation}=${value}]`);
        this.$['*operations'] = {
          ...this.$['*operations'],
          [operation]: value,
        };

        if (!this._isActive) {
          return;
        }

        this._alignImage();
        this._alignCrop();
        this._draw();
      }

      /**
       * @param {keyof Operations} operation
       * @returns {Number | boolean}
       */
      getValue(operation) {
        return this.$['*operations'][operation];
      }

      /**
       * @param {import('./types.js').ImageSize} imageSize
       * @param {{ fromViewer?: boolean }} options
       */
      async activate(imageSize, { fromViewer }) {
        if (this._isActive) {
          return;
        }
        this._isActive = true;
        this._imageSize = imageSize;
        this.removeEventListener('transitionend', this._reset);
        this._initCanvas();

        try {
          this.$.image = await this._waitForImage(this.$['*originalUrl'], this.$['*editorTransformations']);
          this._syncTransformations();
          this._alignImage();
          this._alignCrop();
          this._draw();
          this._animateIn({ fromViewer });
        } catch (err) {
          console.error('Failed to activate cropper', { error: err });
        }
      }
      /** @param {{ seamlessTransition?: boolean = false }} options */
      deactivate({ seamlessTransition = false } = {}) {
        if (!this._isActive) {
          return;
        }
        this._commit();
        this._isActive = false;

        if (seamlessTransition) {
          this._alignTransition();
        }

        this.className = classNames({
          active_from_viewer: false,
          active_from_editor: false,
          inactive_to_editor: seamlessTransition,
          inactive_instant: !seamlessTransition,
        });

        this.ref['frame-el'].toggleThumbs(false);
        this.addEventListener('transitionend', this._reset, { once: true });
      }

      /** @private */
      _alignTransition() {
        let dimensions = this._calculateDimensions();
        let scaleX = Math.min(this.offsetWidth - this.$['*padding'] * 2, dimensions[0]) / this.$['*cropBox'].width;
        let scaleY = Math.min(this.offsetHeight - this.$['*padding'] * 2, dimensions[1]) / this.$['*cropBox'].height;
        let scale = Math.min(scaleX, scaleY);
        let cropCenterX = this.$['*cropBox'].x + this.$['*cropBox'].width / 2;
        let cropCenterY = this.$['*cropBox'].y + this.$['*cropBox'].height / 2;

        this.style.transform = `scale(${scale}) translate(${(this.offsetWidth / 2 - cropCenterX) / scale}px, ${
      (this.offsetHeight / 2 - cropCenterY) / scale
    }px)`;
        this.style.transformOrigin = `${cropCenterX}px ${cropCenterY}px`;
      }

      /** @private */
      _reset() {
        if (this._isActive) {
          return;
        }
        this.$.image = null;
      }

      /**
       * @private
       * @param {String} originalUrl
       * @param {import('./types.js').Transformations} transformations
       * @returns {Promise<HTMLImageElement>}
       */
      _waitForImage(originalUrl, transformations) {
        let width = this.offsetWidth;
        transformations = {
          ...transformations,
          crop: undefined,
          rotate: undefined,
          flip: undefined,
          mirror: undefined,
        };
        let src = viewerImageSrc(originalUrl, width, transformations);
        let { promise, cancel, image } = preloadImage(src);

        let stop = this._handleImageLoading(src);
        image.addEventListener('load', stop, { once: true });
        image.addEventListener('error', stop, { once: true });
        this._cancelPreload && this._cancelPreload();
        this._cancelPreload = cancel;

        return promise
          .then(() => image)
          .catch((err) => {
            console.error('Failed to load image', { error: err });
            this.$['*networProblems'] = true;
            return Promise.resolve(image);
          });
      }

      /**
       * @private
       * @param {String} src
       * @returns {() => void} Destructor
       */
      _handleImageLoading(src) {
        let operation = 'crop';
        /** @type {import('./type.js.js').LoadingOperations} */
        let loadingOperations = this.$['*loadingOperations'];
        if (!loadingOperations.get(operation)) {
          loadingOperations.set(operation, new Map());
        }

        if (!loadingOperations.get(operation).get(src)) {
          loadingOperations.set(operation, loadingOperations.get(operation).set(src, true));
          this.$['*loadingOperations'] = loadingOperations;
        }

        return () => {
          if (loadingOperations?.get(operation)?.has(src)) {
            loadingOperations.get(operation).delete(src);
            this.$['*loadingOperations'] = loadingOperations;
          }
        };
      }

      initCallback() {
        super.initCallback();

        this._observer = new ResizeObserver(() => {
          if (this._isActive && this.$.image) {
            this._handleResizeDebounced();
          }
        });
        this._observer.observe(this);

        this.sub('*imageBox', () => {
          this._draw();
        });

        this.sub('*cropBox', (cropBox) => {
          if (this.$.image) {
            this._commitDebounced();
          }
        });

        setTimeout(() => {
          this.sub('*networkProblems', (networkProblems) => {
            if (!networkProblems) {
              this._isActive && this.activate(this._imageSize, { fromViewer: false });
            }
          });
        }, 0);
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        this._observer.unobserve(this);
        this._observer = undefined;
      }
    }

    EditorImageCropper.template = /*html*/ `
  <canvas class='canvas' ref='canvas-el'></canvas>
  <uc-crop-frame ref='frame-el'></uc-crop-frame>
`;

    /**
     * @param {Number} a Start of sample (int)
     * @param {Number} b End of sample (int)
     * @param {Number} n Number of elements (int)
     * @returns {Number[]}
     */
    function linspace(a, b, n) {
      let ret = Array(n);
      n--;
      for (let i = n; i >= 0; i--) {
        ret[i] = Math.ceil((i * b + (n - i) * a) / n);
      }
      return ret;
    }

    /**
     * @param {Number[]} numbers
     * @returns {[Number, Number][]}
     */
    function splitBySections(numbers) {
      return numbers.reduce(
        (acc, point, idx) => (idx < numbers.length - 1 ? [...acc, [point, numbers[idx + 1]]] : acc),
        []
      );
    }

    /**
     * @param {Number[]} keypoints
     * @param {Number} value
     * @param {Number} zero
     */
    function calculateOpacities(keypoints, value, zero) {
      let section = splitBySections(keypoints).find(([left, right]) => left <= value && value <= right);
      return keypoints.map((point) => {
        let distance = Math.abs(section[0] - section[1]);
        let relation = Math.abs(value - section[0]) / distance;

        if (section[0] === point) {
          return value > zero ? 1 : 1 - relation;
        }
        if (section[1] === point) {
          return value >= zero ? relation : 1;
        }
        return 0;
      });
    }

    /**
     * @param {Number[]} keypoints
     * @param {Number} zero
     */
    function calculateZIndices(keypoints, zero) {
      return keypoints.map((point, idx) => (point < zero ? keypoints.length - idx : idx));
    }

    /**
     * @param {String} operation
     * @param {Number} value
     * @returns {Number[]}
     */
    function keypointsRange(operation, value) {
      let n = COLOR_OPERATIONS_CONFIG[operation].keypointsNumber;
      let { range, zero } = COLOR_OPERATIONS_CONFIG[operation];

      return [...new Set([...linspace(range[0], zero, n + 1), ...linspace(zero, range[1], n + 1), zero, value])].sort(
        (a, b) => a - b
      );
    }

    /**
     * @typedef {Object} Keypoint
     * @property {String} src
     * @property {Number} opacity
     * @property {Number} zIndex
     * @property {HTMLImageElement} image
     * @property {Number} value
     */

    class EditorImageFader extends Block {
      constructor() {
        super();

        /**
         * @private
         * @type {boolean}
         */
        this._isActive = false;

        /**
         * @private
         * @type {boolean}
         */
        this._hidden = true;

        /** @private */
        this._addKeypointDebounced = debounce(this._addKeypoint.bind(this), 600);

        this.classList.add('inactive_to_cropper');
      }

      /**
       * @private
       * @param {String} src
       * @returns {() => void} Destructor
       */
      _handleImageLoading(src) {
        let operation = this._operation;

        /** @type {import('./types.js').LoadingOperations} */
        let loadingOperations = this.$['*loadingOperations'];
        if (!loadingOperations.get(operation)) {
          loadingOperations.set(operation, new Map());
        }

        if (!loadingOperations.get(operation).get(src)) {
          loadingOperations.set(operation, loadingOperations.get(operation).set(src, true));
          this.$['*loadingOperations'] = loadingOperations;
        }

        return () => {
          if (loadingOperations?.get(operation)?.has(src)) {
            loadingOperations.get(operation).delete(src);
            this.$['*loadingOperations'] = loadingOperations;
          }
        };
      }

      /** @private */
      _flush() {
        window.cancelAnimationFrame(this._raf);
        this._raf = window.requestAnimationFrame(() => {
          for (let kp of this._keypoints) {
            let { image } = kp;
            if (image) {
              image.style.opacity = kp.opacity.toString();
              image.style.zIndex = kp.zIndex.toString();
            }
          }
        });
      }

      /**
       * @private
       * @param {Object} options
       * @param {String} [options.url]
       * @param {String} [options.filter]
       * @param {String} [options.operation]
       * @param {Number} [options.value]
       * @returns {String}
       */
      _imageSrc({ url = this._url, filter = this._filter, operation, value } = {}) {
        let transformations = { ...this._transformations };

        if (operation) {
          transformations[operation] = filter ? { name: filter, amount: value } : value;
        }

        // do not use getBoundingClientRect because scale transform affects it
        let width = this.offsetWidth;
        return viewerImageSrc(url, width, transformations);
      }

      /**
       * @private
       * @param {String} operation
       * @param {Number} value
       * @returns {Keypoint}
       */
      _constructKeypoint(operation, value) {
        let src = this._imageSrc({ operation, value });
        return {
          src,
          image: null,
          opacity: 0,
          zIndex: 0,
          value,
        };
      }

      /**
       * Check if current operation and filter equals passed ones
       *
       * @private
       * @param {String} operation
       * @param {String} [filter]
       * @returns {boolean}
       */
      _isSame(operation, filter) {
        return this._operation === operation && this._filter === filter;
      }

      /**
       * @private
       * @param {String} operation
       * @param {String | null} filter
       * @param {Number} value
       */
      _addKeypoint(operation, filter, value) {
        let shouldSkip = () =>
          !this._isSame(operation, filter) || this._value !== value || !!this._keypoints.find((kp) => kp.value === value);

        if (shouldSkip()) {
          return;
        }
        let keypoint = this._constructKeypoint(operation, value);
        let image = new Image();
        image.src = keypoint.src;
        let stop = this._handleImageLoading(keypoint.src);
        image.addEventListener('load', stop, { once: true });
        image.addEventListener('error', stop, { once: true });
        keypoint.image = image;
        image.classList.add('fader-image');

        image.addEventListener(
          'load',
          () => {
            if (shouldSkip()) {
              return;
            }
            let keypoints = this._keypoints;
            let idx = keypoints.findIndex((kp) => kp.value > value);
            let insertBeforeNode = idx < keypoints.length ? keypoints[idx].image : null;
            if (!this._container || (insertBeforeNode && !this._container.contains(insertBeforeNode))) {
              return;
            }
            keypoints.splice(idx, 0, keypoint);
            this._container.insertBefore(image, insertBeforeNode);
            this._update(operation, value);
          },
          { once: true }
        );

        image.addEventListener(
          'error',
          () => {
            this.$['*networkProblems'] = true;
          },
          { once: true }
        );
      }

      /** @param {String | Number} value */
      set(value) {
        value = typeof value === 'string' ? parseInt(value, 10) : value;
        this._update(this._operation, value);
        this._addKeypointDebounced(this._operation, this._filter, value);
      }

      /**
       * @private
       * @param {String} operation
       * @param {Number} value
       */
      _update(operation, value) {
        this._operation = operation;
        this._value = value;

        let { zero } = COLOR_OPERATIONS_CONFIG[operation];

        let keypointValues = this._keypoints.map((kp) => kp.value);
        let opacities = calculateOpacities(keypointValues, value, zero);
        let zIndices = calculateZIndices(keypointValues, zero);

        for (let [idx, kp] of Object.entries(this._keypoints)) {
          kp.opacity = opacities[idx];
          kp.zIndex = zIndices[idx];
        }

        this._flush();
      }

      /** @private */
      _createPreviewImage() {
        let image = new Image();
        image.classList.add('fader-image', 'fader-image--preview');
        image.style.opacity = '0';
        return image;
      }

      /** @private */
      async _initNodes() {
        let fr = document.createDocumentFragment();
        this._previewImage = this._previewImage || this._createPreviewImage();
        !this.contains(this._previewImage) && fr.appendChild(this._previewImage);

        let container = document.createElement('div');
        fr.appendChild(container);

        let srcList = this._keypoints.map((kp) => kp.src);

        let { images, promise, cancel } = batchPreloadImages(srcList);
        images.forEach((node) => {
          let stop = this._handleImageLoading(node.src);
          node.addEventListener('load', stop);
          node.addEventListener('error', stop);
        });
        this._cancelLastImages = () => {
          cancel();
          this._cancelLastImages = undefined;
        };
        let operation = this._operation;
        let filter = this._filter;
        await promise;
        if (this._isActive && this._isSame(operation, filter)) {
          this._container && this._container.remove();
          this._container = container;
          this._keypoints.forEach((kp, idx) => {
            let kpImage = images[idx];
            kpImage.classList.add('fader-image');
            kp.image = kpImage;
            this._container.appendChild(kpImage);
          });
          this.appendChild(fr);
          this._flush();
        }
      }

      /** @param {import('./types.js').Transformations} transformations */
      setTransformations(transformations) {
        this._transformations = transformations;
        if (this._previewImage) {
          let src = this._imageSrc();
          let stop = this._handleImageLoading(src);
          this._previewImage.src = src;
          this._previewImage.addEventListener('load', stop, { once: true });
          this._previewImage.addEventListener('error', stop, { once: true });
          this._previewImage.style.opacity = '1';

          this._previewImage.addEventListener(
            'error',
            () => {
              this.$['*networkProblems'] = true;
            },
            { once: true }
          );
        }
      }

      /**
       * @param {object} options
       * @param {String} options.url
       * @param {String} options.operation
       * @param {Number} options.value
       * @param {String} [options.filter]
       */
      preload({ url, filter, operation, value }) {
        this._cancelBatchPreload && this._cancelBatchPreload();

        let keypoints = keypointsRange(operation, value);
        let srcList = keypoints.map((kp) => this._imageSrc({ url, filter, operation, value: kp }));
        let { cancel } = batchPreloadImages(srcList);

        this._cancelBatchPreload = cancel;
      }

      /** @private */
      _setOriginalSrc(src) {
        let image = this._previewImage || this._createPreviewImage();
        !this.contains(image) && this.appendChild(image);
        this._previewImage = image;

        if (image.src === src) {
          image.style.opacity = '1';
          image.style.transform = 'scale(1)';
          this.className = classNames({
            active_from_viewer: this._fromViewer,
            active_from_cropper: !this._fromViewer,
            inactive_to_cropper: false,
            inactive_rough: false,
          });
          return;
        }
        image.style.opacity = '0';
        let stop = this._handleImageLoading(src);
        image.addEventListener('error', stop, { once: true });
        image.src = src;
        image.addEventListener(
          'load',
          () => {
            stop();
            if (image) {
              image.style.opacity = '1';
              image.style.transform = 'scale(1)';
              this.className = classNames({
                active_from_viewer: this._fromViewer,
                active_from_cropper: !this._fromViewer,
                inactive_to_cropper: false,
                inactive_rough: false,
              });
            }
          },
          { once: true }
        );
        image.addEventListener(
          'error',
          () => {
            this.$['*networkProblems'] = true;
          },
          { once: true }
        );
      }

      /**
       * @param {object} options
       * @param {String} options.url
       * @param {String} [options.operation]
       * @param {Number} [options.value]
       * @param {String} [options.filter]
       * @param {boolean} [options.fromViewer]
       */
      activate({ url, operation, value, filter, fromViewer }) {
        this._isActive = true;
        this._hidden = false;
        this._url = url;
        this._operation = operation || 'initial';
        this._value = value;
        this._filter = filter;
        this._fromViewer = fromViewer;

        let isOriginal = typeof value !== 'number' && !filter;
        if (isOriginal) {
          let src = this._imageSrc({ operation, value });
          this._setOriginalSrc(src);
          this._container && this._container.remove();
          return;
        }
        this._keypoints = keypointsRange(operation, value).map((keyValue) => this._constructKeypoint(operation, keyValue));

        this._update(operation, value);
        this._initNodes();
      }

      /** @param {{ hide?: boolean; seamlessTransition?: boolean }} options */
      deactivate({ hide = true, seamlessTransition = true } = {}) {
        this._isActive = false;

        this._cancelLastImages && this._cancelLastImages();
        this._cancelBatchPreload && this._cancelBatchPreload();

        if (hide && !this._hidden) {
          this._hidden = true;
          if (this._previewImage) {
            this._previewImage.style.transform = 'scale(1)';
          }
          this.className = classNames({
            active_from_viewer: false,
            active_from_cropper: false,
            inactive_to_cropper: seamlessTransition,
            inactive_rough: !seamlessTransition,
          });
          this.addEventListener(
            'transitionend',
            () => {
              this._container && this._container.remove();
            },
            { once: true }
          );
        } else {
          this._container && this._container.remove();
        }
      }
    }

    const X_THRESHOLD = 1;

    class EditorScroller extends Block {
      initCallback() {
        super.initCallback();

        this.addEventListener('wheel', (e) => {
          e.preventDefault();
          let { deltaY, deltaX } = e;
          if (Math.abs(deltaX) > X_THRESHOLD) {
            this.scrollLeft += deltaX;
          } else {
            this.scrollLeft += deltaY;
          }
        });
      }
    }

    EditorScroller.template = /*html*/ `
<slot></slot>
`;

    /** @param {String} id */
    function renderTabToggle(id) {
      return /*html*/ `
    <uc-btn-ui theme="boring" ref="tab-toggle-${id}" data-id="${id}" icon="${id}" tabindex="0" set="onclick: on.clickTab;">
    </uc-btn-ui>
  `;
    }

    /** @param {String} id */
    function renderTabContent(id) {
      return /*html*/ `
    <uc-presence-toggle class="tab-content" set="visible: presence.tabContent${id}; styles: presence.tabContentStyles">
        <uc-editor-scroller hidden-scrollbar>
          <div class="controls-list_align">
            <div class="controls-list_inner" ref="controls-list-${id}">
            </div>
          </div>
        </uc-editor-scroller>
    </uc-presence-toggle>
  `;
    }

    class EditorToolbar extends Block {
      constructor() {
        super();

        this.init$ = {
          '*sliderEl': null,
          /** @type {import('./types.js').LoadingOperations} */
          '*loadingOperations': new Map(),
          '*showSlider': false,
          /** @type {import('./types.js').Transformations} */
          '*editorTransformations': {},
          '*currentFilter': FAKE_ORIGINAL_FILTER,
          '*currentOperation': null,
          showLoader: false,
          tabId: TabId.CROP,
          filters: ALL_FILTERS,
          colorOperations: ALL_COLOR_OPERATIONS,
          cropOperations: ALL_CROP_OPERATIONS,
          '*operationTooltip': null,

          'l10n.cancel': this.l10n('cancel'),
          'l10n.apply': this.l10n('apply'),

          'presence.mainToolbar': true,
          'presence.subToolbar': false,
          [`presence.tabContent${TabId.CROP}`]: false,
          [`presence.tabContent${TabId.SLIDERS}`]: false,
          [`presence.tabContent${TabId.FILTERS}`]: false,
          'presence.subTopToolbarStyles': {
            hidden: 'sub-toolbar--top-hidden',
            visible: 'sub-toolbar--visible',
          },
          'presence.subBottomToolbarStyles': {
            hidden: 'sub-toolbar--bottom-hidden',
            visible: 'sub-toolbar--visible',
          },
          'presence.tabContentStyles': {
            hidden: 'tab-content--hidden',
            visible: 'tab-content--visible',
          },
          'on.cancel': (e) => {
            this._cancelPreload && this._cancelPreload();
            this.$['*on.cancel']();
          },
          'on.apply': (e) => {
            this.$['*on.apply'](this.$['*editorTransformations']);
          },
          'on.applySlider': (e) => {
            this.ref['slider-el'].apply();
            this._onSliderClose();
          },
          'on.cancelSlider': (e) => {
            this.ref['slider-el'].cancel();
            this._onSliderClose();
          },
          'on.clickTab': (e) => {
            let id = e.currentTarget.getAttribute('data-id');
            this._activateTab(id, { fromViewer: false });
          },
        };

        /** @private */

        this._debouncedShowLoader = debounce(this._showLoader.bind(this), 500);
      }

      get tabId() {
        return this.$.tabId;
      }

      /** @private */
      _onSliderClose() {
        this.$['*showSlider'] = false;
        if (this.$.tabId === TabId.SLIDERS) {
          this.ref['tooltip-el'].className = classNames('filter-tooltip', {
            'filter-tooltip_visible': false,
            'filter-tooltip_hidden': true,
          });
        }
      }

      /**
       * @private
       * @param {String} operation
       */
      _createOperationControl(operation) {
        let el = EditorOperationControl.is && new EditorOperationControl();
        el['operation'] = operation;
        return el;
      }

      /**
       * @private
       * @param {String} filter
       */
      _createFilterControl(filter) {
        let el = EditorFilterControl.is && new EditorFilterControl();
        el['filter'] = filter;
        return el;
      }

      /**
       * @private
       * @param {String} operation
       */
      _createToggleControl(operation) {
        let el = EditorCropButtonControl.is && new EditorCropButtonControl();
        el['operation'] = operation;
        return el;
      }

      /**
       * @private
       * @param {String} tabId
       */
      _renderControlsList(tabId) {
        let listEl = this.ref[`controls-list-${tabId}`];
        let fr = document.createDocumentFragment();

        if (tabId === TabId.CROP) {
          this.$.cropOperations.forEach((operation) => {
            let el = this._createToggleControl(operation);
            // @ts-ignore
            fr.appendChild(el);
          });
        } else if (tabId === TabId.FILTERS) {
          [FAKE_ORIGINAL_FILTER, ...this.$.filters].forEach((filterId) => {
            let el = this._createFilterControl(filterId);
            // @ts-ignore
            fr.appendChild(el);
          });
        } else if (tabId === TabId.SLIDERS) {
          this.$.colorOperations.forEach((operation) => {
            let el = this._createOperationControl(operation);
            // @ts-ignore
            fr.appendChild(el);
          });
        }

        fr.childNodes.forEach((/** @type {HTMLElement} */ el, idx) => {
          if (idx === fr.childNodes.length - 1) {
            el.classList.add('controls-list_last-item');
          }
        });

        listEl.innerHTML = '';
        listEl.appendChild(fr);
      }

      /**
       * @private
       * @param {String} id
       * @param {{ fromViewer?: boolean }} options
       */
      _activateTab(id, { fromViewer }) {
        this.$.tabId = id;

        if (id === TabId.CROP) {
          this.$['*faderEl'].deactivate();
          this.$['*cropperEl'].activate(this.$['*imageSize'], { fromViewer });
        } else {
          this.$['*faderEl'].activate({ url: this.$['*originalUrl'], fromViewer });
          this.$['*cropperEl'].deactivate({ seamlessTransition: true });
        }

        for (let tabId of TABS) {
          let isCurrentTab = tabId === id;

          let tabToggleEl = this.ref[`tab-toggle-${tabId}`];
          tabToggleEl.active = isCurrentTab;

          if (isCurrentTab) {
            this._renderControlsList(id);
            this._syncTabIndicator();
          } else {
            this._unmountTabControls(tabId);
          }
          this.$[`presence.tabContent${tabId}`] = isCurrentTab;
        }
      }

      /**
       * @private
       * @param {String} tabId
       */
      _unmountTabControls(tabId) {
        let listEl = this.ref[`controls-list-${tabId}`];
        if (listEl) {
          listEl.innerHTML = '';
        }
      }

      /** @private */
      _syncTabIndicator() {
        let tabToggleEl = this.ref[`tab-toggle-${this.$.tabId}`];
        let indicatorEl = this.ref['tabs-indicator'];
        indicatorEl.style.transform = `translateX(${tabToggleEl.offsetLeft}px)`;
      }

      /** @private */
      _preloadEditedImage() {
        if (this.$['*imgContainerEl'] && this.$['*originalUrl']) {
          let width = this.$['*imgContainerEl'].offsetWidth;
          let src = viewerImageSrc(this.$['*originalUrl'], width, this.$['*editorTransformations']);
          this._cancelPreload && this._cancelPreload();
          let { cancel } = batchPreloadImages([src]);
          this._cancelPreload = () => {
            cancel();
            this._cancelPreload = undefined;
          };
        }
      }

      /** @private */
      _showLoader(show) {
        this.$.showLoader = show;
      }

      initCallback() {
        super.initCallback();

        this.$['*sliderEl'] = this.ref['slider-el'];

        this.sub('*imageSize', (imageSize) => {
          if (imageSize) {
            setTimeout(() => {
              this._activateTab(this.$.tabId, { fromViewer: true });
            }, 0);
          }
        });

        this.sub('*currentFilter', (currentFilter) => {
          this.$['*operationTooltip'] = this.l10n(currentFilter || FAKE_ORIGINAL_FILTER);
          this.ref['tooltip-el'].className = classNames('filter-tooltip', {
            'filter-tooltip_visible': currentFilter,
            'filter-tooltip_hidden': !currentFilter,
          });
        });

        this.sub('*currentOperation', (currentOperation) => {
          if (this.$.tabId !== TabId.SLIDERS) {
            return;
          }
          this.$['*operationTooltip'] = currentOperation;
          this.ref['tooltip-el'].className = classNames('filter-tooltip', {
            'filter-tooltip_visible': currentOperation,
            'filter-tooltip_hidden': !currentOperation,
          });
        });

        this.sub('*tabId', (tabId) => {
          if (tabId === TabId.FILTERS) {
            this.$['*operationTooltip'] = this.$['*currentFilter'];
          }
          this.ref['tooltip-el'].className = classNames('filter-tooltip', {
            'filter-tooltip_visible': tabId === TabId.FILTERS,
            'filter-tooltip_hidden': tabId !== TabId.FILTERS,
          });
        });

        this.sub('*originalUrl', (originalUrl) => {
          this.$['*faderEl'] && this.$['*faderEl'].deactivate();
        });

        this.sub('*editorTransformations', (transformations) => {
          this._preloadEditedImage();
          if (this.$['*faderEl']) {
            this.$['*faderEl'].setTransformations(transformations);
          }
        });

        this.sub('*loadingOperations', (/** @type {import('./types.js').LoadingOperations} */ loadingOperations) => {
          let anyLoading = false;
          for (let [, mapping] of loadingOperations.entries()) {
            if (anyLoading) {
              break;
            }
            for (let [, loading] of mapping.entries()) {
              if (loading) {
                anyLoading = true;
                break;
              }
            }
          }
          this._debouncedShowLoader(anyLoading);
        });

        this.sub('*showSlider', (showSlider) => {
          this.$['presence.subToolbar'] = showSlider;
          this.$['presence.mainToolbar'] = !showSlider;
        });
      }
    }

    EditorToolbar.template = /*html*/ `
<uc-line-loader-ui set="active: showLoader"></uc-line-loader-ui>
<div class="filter-tooltip_container">
  <div class="filter-tooltip_wrapper">
    <div ref="tooltip-el" class="filter-tooltip filter-tooltip_visible">
      {{*operationTooltip}}
    </div>
  </div>
</div>
<div class="toolbar-container">
  <uc-presence-toggle class="sub-toolbar" set="visible: presence.mainToolbar; styles: presence.subTopToolbarStyles">
      <div class="tab-content-row">
      ${TABS.map(renderTabContent).join('')}
      </div>
      <div class="controls-row">
        <uc-btn-ui theme="boring" icon="closeMax" set="onclick: on.cancel">
        </uc-btn-ui>
        <div class="tab-toggles">
          <div ref="tabs-indicator" class="tab-toggles_indicator"></div>
          ${TABS.map(renderTabToggle).join('')}
        </div>
        <uc-btn-ui theme="primary" icon="done" set="onclick: on.apply">
        </uc-btn-ui>
      </div>
  </uc-presence-toggle>
  <uc-presence-toggle class="sub-toolbar" set="visible: presence.subToolbar; styles: presence.subBottomToolbarStyles">
      <div class="slider">
        <uc-editor-slider ref="slider-el"></uc-editor-slider>
      </div>
      <div class="controls-row">
        <uc-btn-ui theme="boring" set="@text: l10n.cancel; onclick: on.cancelSlider;">
        </uc-btn-ui>
        <uc-btn-ui theme="primary" set="@text: l10n.apply; onclick: on.applySlider;">
        </uc-btn-ui>
      </div>
  </uc-presence-toggle>
</div>
`;

    class UcBtnUi extends Block {
      constructor() {
        super();

        this._iconReversed = false;
        this._iconSingle = false;
        this._iconHidden = false;

        this.init$ = {
          text: '',
          icon: '',
          iconCss: this._iconCss(),
          theme: null,
        };

        this.defineAccessor('active', (active) => {
          if (active) {
            this.setAttribute('active', '');
          } else {
            this.removeAttribute('active');
          }
        });
      }

      _iconCss() {
        return classNames('icon', {
          icon_left: !this._iconReversed,
          icon_right: this._iconReversed,
          icon_hidden: this._iconHidden,
          icon_single: this._iconSingle,
        });
      }

      initCallback() {
        super.initCallback();

        this.sub('icon', (iconName) => {
            this._iconSingle = !this.$.text;
            this._iconHidden = !iconName;
            this.$.iconCss = this._iconCss();
          }
        );

        this.sub('theme', (theme) => {
          if (theme !== 'custom') {
            this.className = theme;
          }
        });

        this.sub('text', (txt) => {
          this._iconSingle = false;
        });

        this.setAttribute('role', 'button');
        if (this.tabIndex === -1) {
          this.tabIndex = 0;
        }
        if (!this.hasAttribute('theme')) {
          this.setAttribute('theme', 'default');
        }
      }

      set reverse(val) {
        if (this.hasAttribute('reverse')) {
          this.style.flexDirection = 'row-reverse';
          this._iconReversed = true;
        } else {
          this._iconReversed = false;
          this.style.flexDirection = null;
        }
      }
    }
    UcBtnUi.bindAttributes({ text: 'text', icon: 'icon', reverse: 'reverse', theme: 'theme' });

    UcBtnUi.template = /*html*/ `
<uc-icon size="20" set="className: iconCss; @name: icon;"></uc-icon>
<div class="text">{{text}}</div>
`;

    class LineLoaderUi extends Block {
      constructor() {
        super();

        this._active = false;

        this._handleTransitionEndRight = () => {
          let lineEl = this.ref['line-el'];
          lineEl.style.transition = `initial`;
          lineEl.style.opacity = '0';
          lineEl.style.transform = `translateX(-101%)`;
          this._active && this._start();
        };
      }

      initCallback() {
        super.initCallback();
        this.defineAccessor('active', (active) => {
          if (typeof active === 'boolean') {
            if (active) {
              this._start();
            } else {
              this._stop();
            }
          }
        });
      }

      _start() {
        this._active = true;
        let { width } = this.getBoundingClientRect();
        let lineEl = this.ref['line-el'];
        lineEl.style.transition = `transform 1s`;
        lineEl.style.opacity = '1';
        lineEl.style.transform = `translateX(${width}px)`;
        lineEl.addEventListener('transitionend', this._handleTransitionEndRight, {
          once: true,
        });
      }

      _stop() {
        this._active = false;
      }
    }

    LineLoaderUi.template = /*html*/ `
  <div class="inner">
    <div class="line" ref="line-el"></div>
  </div>
`;

    const DEFAULT_STYLE = {
      transition: 'transition',
      visible: 'visible',
      hidden: 'hidden',
    };

    class PresenceToggle extends Block {
      constructor() {
        super();

        this._visible = false;
        this._visibleStyle = DEFAULT_STYLE.visible;
        this._hiddenStyle = DEFAULT_STYLE.hidden;
        this._externalTransitions = false;

        this.defineAccessor('styles', (styles) => {
          if (!styles) {
            return;
          }
          this._externalTransitions = true;
          this._visibleStyle = styles.visible;
          this._hiddenStyle = styles.hidden;
        });

        this.defineAccessor('visible', (visible) => {
          if (typeof visible !== 'boolean') {
            return;
          }

          this._visible = visible;
          this._handleVisible();
        });
      }

      _handleVisible() {
        this.style.visibility = this._visible ? 'inherit' : 'hidden';
        applyClassNames(this, {
          [DEFAULT_STYLE.transition]: !this._externalTransitions,
          [this._visibleStyle]: this._visible,
          [this._hiddenStyle]: !this._visible,
        });
        this.setAttribute('aria-hidden', this._visible ? 'false' : 'true');
      }

      initCallback() {
        super.initCallback();
        this.setAttribute('hidden', '');

        if (!this._externalTransitions) {
          this.classList.add(DEFAULT_STYLE.transition);
        }

        this._handleVisible();
        setTimeout(() => this.removeAttribute('hidden'), 0);
      }
    }
    PresenceToggle.template = /*html*/ `
<slot></slot>
`;

    class SliderUi extends Block {
      init$ = {
        disabled: false,
        min: 0,
        max: 100,
        onInput: null,
        onChange: null,
        defaultValue: null,
        'on.sliderInput': () => {
          let value = parseInt(this.ref['input-el'].value, 10);
          this._updateValue(value);
          this.$.onInput && this.$.onInput(value);
        },
        'on.sliderChange': () => {
          let value = parseInt(this.ref['input-el'].value, 10);
          this.$.onChange && this.$.onChange(value);
        },
      };

      constructor() {
        super();
        this.setAttribute('with-effects', '');
      }

      initCallback() {
        super.initCallback();

        this.defineAccessor('disabled', (disabled) => {
          this.$.disabled = disabled;
        });

        this.defineAccessor('min', (min) => {
          this.$.min = min;
        });

        this.defineAccessor('max', (max) => {
          this.$.max = max;
        });

        this.defineAccessor('defaultValue', (defaultValue) => {
          this.$.defaultValue = defaultValue;
          this.ref['input-el'].value = defaultValue;
          this._updateValue(defaultValue);
        });

        this.defineAccessor('zero', (zero) => {
          this._zero = zero;
        });

        this.defineAccessor('onInput', (onInput) => {
          if (!onInput) return;
          this.$.onInput = onInput;
        });

        this.defineAccessor('onChange', (onChange) => {
          if (!onChange) return;
          this.$.onChange = onChange;
        });
      }

      _updateValue(value) {
        this._updateZeroDot(value);

        let { width } = this.getBoundingClientRect();
        let slope = 100 / (this.$.max - this.$.min);
        let mappedValue = slope * (value - this.$.min);
        let offset = (mappedValue * (width - this._thumbSize)) / 100;

        window.requestAnimationFrame(() => {
          this.ref['thumb-el'].style.transform = `translateX(${offset}px)`;
        });
      }

      _updateZeroDot(value) {
        if (!this._zeroDotEl) {
          return;
        }
        if (value === this._zero) {
          this._zeroDotEl.style.opacity = '0';
        } else {
          this._zeroDotEl.style.opacity = '0.2';
        }
        let { width } = this.getBoundingClientRect();
        let slope = 100 / (this.$.max - this.$.min);
        let mappedValue = slope * (this._zero - this.$.min);
        let offset = (mappedValue * (width - this._thumbSize)) / 100;
        window.requestAnimationFrame(() => {
          this._zeroDotEl.style.transform = `translateX(${offset}px)`;
        });
      }

      _updateSteps() {
        const STEP_GAP = 15;

        let stepsEl = this.ref['steps-el'];
        let { width } = stepsEl.getBoundingClientRect();
        let half = Math.ceil(width / 2);
        let count = Math.ceil(half / STEP_GAP) - 2;

        if (this._stepsCount === count) {
          return;
        }

        let fr = document.createDocumentFragment();
        let minorStepEl = document.createElement('div');
        let borderStepEl = document.createElement('div');
        minorStepEl.className = 'minor-step';
        borderStepEl.className = 'border-step';
        fr.appendChild(borderStepEl);
        for (let i = 0; i < count; i++) {
          fr.appendChild(minorStepEl.cloneNode());
        }
        fr.appendChild(borderStepEl.cloneNode());
        for (let i = 0; i < count; i++) {
          fr.appendChild(minorStepEl.cloneNode());
        }
        fr.appendChild(borderStepEl.cloneNode());

        let zeroDotEl = document.createElement('div');
        zeroDotEl.className = 'zero-dot';
        fr.appendChild(zeroDotEl);
        this._zeroDotEl = zeroDotEl;

        stepsEl.innerHTML = '';
        stepsEl.appendChild(fr);
        this._stepsCount = count;
      }

      connectedCallback() {
        super.connectedCallback();

        this._updateSteps();

        this._observer = new ResizeObserver(() => {
          this._updateSteps();
          let value = parseInt(this.ref['input-el'].value, 10);
          this._updateValue(value);
        });
        this._observer.observe(this);

        this._thumbSize = parseInt(window.getComputedStyle(this).getPropertyValue('--l-thumb-size'), 10);

        setTimeout(() => {
          let value = parseInt(this.ref['input-el'].value, 10);
          this._updateValue(value);
        }, 0);

        this.sub('disabled', (disabled) => {
          let el = this.ref['input-el'];
          if (disabled) {
            el.setAttribute('disabled', 'disabled');
          } else {
            el.removeAttribute('disabled');
          }
        });

        let inputEl = this.ref['input-el'];
        inputEl.addEventListener('focus', () => {
          this.style.setProperty('--color-effect', 'var(--hover-color-rgb)');
        });
        inputEl.addEventListener('blur', () => {
          this.style.setProperty('--color-effect', 'var(--idle-color-rgb)');
        });
      }

      disconnectedCallback() {
        this._observer.unobserve(this);
        this._observer = undefined;
      }
    }
    SliderUi.template = /*html*/ `
  <div class="steps" ref="steps-el">
  </div>
  <div ref="thumb-el" class="thumb"></div>
  <input class="input" type='range' ref='input-el' tabindex="0" set="oninput: on.sliderInput; onchange: on.sliderChange; @min: min; @max: max; @value: defaultValue;">
`;

    class CloudImageEditor extends Block {
      activityType = Block.activities.CLOUD_IMG_EDIT;

      init$ = {
        uuid: null,
      };

      initCallback() {
        this.bindCssData('--cfg-pubkey');

        this.sub('*currentActivity', (val) => {
          if (val === Block.activities.CLOUD_IMG_EDIT) {
            this.mountEditor();
          } else {
            this.unmountEditor();
          }
        });

        this.sub('*focusedEntry', (/** @type {import('../../submodules/symbiote/core/symbiote.js').TypedData} */ entry) => {
          if (!entry) {
            return;
          }
          this.entry = entry;

          this.entry.subscribe('uuid', (uuid) => {
            if (uuid) {
              this.$.uuid = uuid;
            }
          });
        });
      }

      handleApply(e) {
        let result = e.detail;
        let { transformationsUrl } = result;
        this.entry.setValue('transformationsUrl', transformationsUrl);
        this.historyBack();
      }

      handleCancel() {
        this.historyBack();
      }

      mountEditor() {
        let instance = new CloudEditor();
        instance.classList.add('uc-cldtr-common');
        let uuid = this.$.uuid;
        // let publicKey = this.$['*--cfg-pubkey'];
        instance.setAttribute('uuid', uuid);
        // instance.setAttribute('public-key', publicKey);

        instance.addEventListener('apply', (result) => this.handleApply(result));
        instance.addEventListener('cancel', () => this.handleCancel());

        this.innerHTML = '';
        this.appendChild(instance);
      }

      unmountEditor() {
        this.innerHTML = '';
      }
    }

    let cbMapping = {};

    window.addEventListener('message', (e) => {
      let message;
      try {
        message = JSON.parse(e.data);
      } catch (err) {
        return
      }

      if (message?.type in cbMapping) {
        let cbList = cbMapping[message.type];
        for (let [sender, callback] of cbList) {
          if (e.source === sender) {
            callback(message);
          }
        }
      }
    });

    const registerMessage = function (type, sender, callback) {
      if (!(type in cbMapping)) {
        cbMapping[type] = [];
      }

      cbMapping[type].push([sender, callback]);
    };

    const unregisterMessage = function (type, sender) {
      if (type in cbMapping) {
        cbMapping[type] = cbMapping[type].filter((item) => item[0] !== sender);
      }
    };

    let styleToCss = (style) => {
      let css = Object.keys(style).reduce((acc, selector) => {
        let propertiesObj = style[selector];
        let propertiesStr = Object.keys(propertiesObj).reduce((acc, prop) => {
          let value = propertiesObj[prop];
          return acc + `${prop}: ${value};`;
        }, '');
        return acc + `${selector}{${propertiesStr}}`;
      }, '');
      return css;
    };

    function buildStyles({ textColor, backgroundColor, linkColor, linkColorHover, shadeColor }) {
      let border = `solid 1px ${shadeColor}`;

      // TODO: we need to update source source styles, add css custom properties to control theme
      return styleToCss({
        body: {
          color: textColor,
          'background-color': backgroundColor,
        },
        '.side-bar': {
          background: 'inherit',
          'border-right': border,
        },
        '.main-content': {
          background: 'inherit',
        },
        '.main-content-header': {
          background: 'inherit',
        },
        '.main-content-footer': {
          background: 'inherit',
        },
        '.list-table-row': {
          color: 'inherit',
        },
        '.list-table-row:hover': {
          background: shadeColor,
        },
        '.list-table-row .list-table-cell-a, .list-table-row .list-table-cell-b': {
          'border-top': border,
        },
        '.list-table-body .list-items': {
          'border-bottom': border,
        },
        '.bread-crumbs a': {
          color: linkColor,
        },
        '.bread-crumbs a:hover': {
          color: linkColorHover,
        },
        '.main-content.loading': {
          background: `${backgroundColor} url(/static/images/loading_spinner.gif) center no-repeat`,
          'background-size': '25px 25px',
        },
        '.list-icons-item': {
          background: `center no-repeat ${shadeColor}`,
        },
        '.source-gdrive .side-bar-menu a, .source-gphotos .side-bar-menu a': {
          color: linkColor,
        },
        '.source-gdrive .side-bar-menu a, .source-gphotos .side-bar-menu a:hover': {
          color: linkColorHover,
        },
        '.side-bar-menu a': {
          color: linkColor,
        },
        '.side-bar-menu a:hover': {
          color: linkColorHover,
        },
        '.source-gdrive .side-bar-menu .current, .source-gdrive .side-bar-menu a:hover, .source-gphotos .side-bar-menu .current, .source-gphotos .side-bar-menu a:hover':
          {
            color: linkColorHover,
          },
        '.source-vk .side-bar-menu a': {
          color: linkColor,
        },
        '.source-vk .side-bar-menu a:hover': {
          color: linkColorHover,
          background: 'none',
        },
      });
    }

    class ExternalSource extends Block {
      activityType = Block.activities.EXTERNAL;

      init$ = {
        counter: 0,
        onDone: () => {
          this.$['*currentActivity'] = Block.activities.UPLOAD_LIST;
        },
        onCancel: () => {
          this.cancelFlow();
        },
      };

      /** @private */
      _iframe = null;

      initCallback() {
        this.registerActivity(this.activityType, () => {
          let { externalSourceType } = this.activityParams;

          this.set$({
            '*activityCaption': `${externalSourceType[0].toUpperCase()}${externalSourceType.slice(1)}`,
            '*activityIcon': externalSourceType,
          });

          this.$.counter = 0;
          this.mountIframe();
        });
        this.sub('*currentActivity', (val) => {
          if (val !== this.activityType) {
            this.unmountIframe();
          }
        });
      }

      sendMessage(message) {
        this._iframe.contentWindow.postMessage(JSON.stringify(message), '*');
      }

      async handleFileSelected(message) {
        this.$.counter = this.$.counter + 1;

        // TODO: check for alternatives, see https://github.com/uploadcare/uploadcare-widget/blob/f5d3e8c9f67781bed2eb69814c8f86a4cc035473/src/widget/tabs/remote-tab.js#L102
        let { url, filename } = message;
        this.uploadCollection.add({
          externalUrl: url,
          fileName: filename,
        });
      }

      handleIframeLoad(e) {
        this.applyStyles();
      }

      getCssValue(propName) {
        let style = window.getComputedStyle(this);
        return style.getPropertyValue(propName).trim();
      }

      applyStyles() {
        let colors = {
          backgroundColor: this.getCssValue('--clr-background-light'),
          textColor: this.getCssValue('--clr-txt'),
          shadeColor: this.getCssValue('--clr-shade-lv1'),
          linkColor: '#157cfc',
          linkColorHover: '#3891ff',
        };

        this.sendMessage({
          type: 'embed-css',
          style: buildStyles(colors),
        });
      }

      remoteUrl() {
        let pubkey = this.$['*--cfg-pubkey'];
        let version = '3.11.3';
        let imagesOnly = false.toString();
        let { externalSourceType } = this.activityParams;
        return `https://social.uploadcare.com/window3/${externalSourceType}?lang=en&public_key=${pubkey}&widget_version=${version}&images_only=${imagesOnly}&pass_window_open=false`;
      }

      mountIframe() {
        /** @type {HTMLIFrameElement} */
        // @ts-ignore
        let iframe = create({
          tag: 'iframe',
          attributes: {
            src: this.remoteUrl(),
            marginheight: 0,
            marginwidth: 0,
            frameborder: 0,
            allowTransparency: true,
          },
        });
        iframe.addEventListener('load', this.handleIframeLoad.bind(this));

        this.ref.iframeWrapper.innerHTML = '';
        this.ref.iframeWrapper.appendChild(iframe);

        registerMessage('file-selected', iframe.contentWindow, this.handleFileSelected.bind(this));

        this._iframe = iframe;
      }

      unmountIframe() {
        this._iframe && unregisterMessage('file-selected', this._iframe.contentWindow);
        this.ref.iframeWrapper.innerHTML = '';
        this._iframe = undefined;
      }
    }

    ExternalSource.template = /*html*/ `
<div
  ref="iframeWrapper"
  class="iframe-wrapper">
</div>
<div class="toolbar">
  <button
    class="cancel-btn secondary-btn"
    set="onclick: onCancel"
    l10n="cancel">
  </button>
  <div></div>
  <div class="selected-counter">
    <span l10n="selected-count"></span>{{counter}}</div>
  <button class="done-btn primary-btn" set="onclick: onDone">
    <uc-icon name="check"></uc-icon>
  </button>
</div>
`;

    class Tabs extends Block {
      /** @param {String} tabL10nStr */
      setCurrentTab(tabL10nStr) {
        if (!tabL10nStr) {
          return;
        }
        let ctxList = [...this.ref.context.querySelectorAll('[tab-ctx]')];
        ctxList.forEach((ctxEl) => {
          if (ctxEl.getAttribute('tab-ctx') === tabL10nStr) {
            ctxEl.removeAttribute('hidden');
          } else {
            ctxEl.setAttribute('hidden', '');
          }
        });
        for (let lStr in this._tabMap) {
          if (lStr === tabL10nStr) {
            this._tabMap[lStr].setAttribute('current', '');
          } else {
            this._tabMap[lStr].removeAttribute('current');
          }
        }
      }

      initCallback() {
        /**
         * @private
         * @type {Object<string, HTMLElement>}
         */
        this._tabMap = {};
        this.defineAccessor('tab-list', (/** @type {String} */ val) => {
          if (!val) {
            return;
          }
          let tabList = val.split(',').map((tabName) => {
            return tabName.trim();
          });
          tabList.forEach((tabL10nStr) => {
            let tabEl = create({
              tag: 'div',
              attributes: {
                class: 'tab',
              },
              properties: {
                onclick: () => {
                  this.setCurrentTab(tabL10nStr);
                },
              },
            });
            tabEl.textContent = this.l10n(tabL10nStr);
            this.ref.row.appendChild(tabEl);
            this._tabMap[tabL10nStr] = tabEl;
          });
        });

        this.defineAccessor('default', (val) => {
          this.setCurrentTab(val);
        });

        if (!this.hasAttribute('default')) {
          this.setCurrentTab(Object.keys(this._tabMap)[0]);
        }
      }
    }

    Tabs.bindAttributes({
      'tab-list': null,
      default: null,
    });

    Tabs.template = /*html*/ `
<div ref="row" class="tabs-row"></div>
<div ref="context" class="tabs-context">
  <slot></slot>
</div>
`;

    class DataOutput extends Block {
      initCallback() {
        let from = this.getAttribute('from');
        this.sub(
          from || DataOutput.defaultFrom,
          (/** @type {import('../../submodules/upload-client.js').UploadcareFile[]} */ data) => {
            if (!data) {
              this.innerHTML = '';
              return;
            }
            if (this.hasAttribute(DataOutput.fireEventAttrName)) {
              this.dispatchEvent(
                new CustomEvent(DataOutput.outputEventName, {
                  bubbles: true,
                  composed: true,
                  detail: {
                    timestamp: Date.now(),
                    ctxName: this.ctxName,
                    data,
                  },
                })
              );
            }
            if (this.hasAttribute(DataOutput.templateAttrName)) {
              let tpl = this.getAttribute(DataOutput.templateAttrName);
              let html = '';
              data.forEach((fileItem) => {
                let itemHtml = tpl;
                for (let prop in fileItem) {
                  itemHtml = itemHtml.split(`{{${prop}}}`).join(fileItem[prop]);
                }
                html += itemHtml;
              });
              this.innerHTML = html;
            }
            this.value = data;
            if (this.hasAttribute(DataOutput.formValueAttrName)) {
              if (!this._input) {
                /** @private */
                this._input = document.createElement('input');
                this._input.type = 'text';
                this.appendChild(this._input);
              }
              this._input.value = JSON.stringify(data);
            }
            if (this.hasAttribute(DataOutput.consoleAttrName)) {
              console.log(data);
            }
          }
        );
      }
    }

    DataOutput.outputEventName = 'data-output';
    DataOutput.templateAttrName = 'item-template';
    DataOutput.fireEventAttrName = 'fire-event';
    DataOutput.consoleAttrName = 'console';
    DataOutput.formValueAttrName = 'form-value';
    DataOutput.defaultFrom = '*outputData';

    class ActivityCaption extends Block {
      init$ = {
        '*activityCaption': undefined,
      };
    }

    ActivityCaption.template = /* html */ `
<div class="caption">{{*activityCaption}}</div>
`;

    class ActivityIcon extends Block {
      init$ = {
        '*activityIcon': 'default',
      };
    }

    ActivityIcon.template = /* html */ `
<uc-icon set="@name: *activityIcon"></uc-icon>
`;

    class FileUploaderRegular extends Block {}

    FileUploaderRegular.template = /*html*/ `
<uc-simple-btn></uc-simple-btn>

<uc-modal strokes block-body-scrolling>
  <uc-activity-icon slot="heading"></uc-activity-icon>
  <uc-activity-caption slot="heading"></uc-activity-caption>
  <uc-start-from>
    <uc-source-list wrap></uc-source-list>
    <uc-drop-area></uc-drop-area>
  </uc-start-from>
  <uc-upload-list></uc-upload-list>
  <uc-camera-source></uc-camera-source>
  <uc-url-source></uc-url-source>
  <uc-external-source></uc-external-source>
  <uc-upload-details></uc-upload-details>
  <uc-confirmation-dialog></uc-confirmation-dialog>
  <uc-cloud-image-editor></uc-cloud-image-editor>
</uc-modal>

<uc-message-box></uc-message-box>
<uc-progress-bar-common></uc-progress-bar-common>
`;

    class FileUploaderMinimal extends Block {
      init$ = {
        selectClicked: () => {
          this.openSystemDialog();
        },
      };

      initCallback() {
        this.$['*currentActivity'] = this.initActivity || Block.activities.START_FROM;
      }
    }

    FileUploaderMinimal.template = /*html*/ `
  <uc-start-from>
    <uc-drop-area>
      <button 
        l10n="drop-files-here"
        set="onclick: selectClicked">
      </button>
    </uc-drop-area>
  </uc-start-from>
  <uc-upload-list></uc-upload-list>
  <uc-message-box></uc-message-box>
`;

    /** @param {Object<string, any>} blockExports */
    function registerBlocks(blockExports) {
      for (let blockName in blockExports) {
        let tagName = [...blockName].reduce((name, char) => {
          if (char.toUpperCase() === char) {
            char = '-' + char.toLowerCase();
          }
          return (name += char);
        }, '');
        if (tagName.startsWith('-')) {
          tagName = tagName.replace('-', '');
        }
        if (!tagName.startsWith('uc-')) {
          tagName = 'uc-' + tagName;
        }
        blockExports[blockName].reg?.(tagName);
      }
    }

    // Symbiote.js

    var UC = /*#__PURE__*/Object.freeze({
        __proto__: null,
        BaseComponent: BaseComponent,
        Data: Data,
        TypedCollection: TypedCollection,
        TypedData: TypedData,
        Block: Block,
        Icon: Icon,
        Img: Img,
        SimpleBtn: SimpleBtn,
        StartFrom: StartFrom,
        DropArea: DropArea,
        SourceBtn: SourceBtn,
        SourceList: SourceList,
        FileItem: FileItem,
        Modal: Modal,
        UploadList: UploadList,
        UrlSource: UrlSource,
        CameraSource: CameraSource,
        UploadDetails: UploadDetails,
        MessageBox: MessageBox,
        ConfirmationDialog: ConfirmationDialog,
        ProgressBarCommon: ProgressBarCommon,
        ProgressBar: ProgressBar,
        EditableCanvas: EditableCanvas,
        CloudImageEditor: CloudImageEditor,
        ExternalSource: ExternalSource,
        Tabs: Tabs,
        DataOutput: DataOutput,
        ActivityCaption: ActivityCaption,
        ActivityIcon: ActivityIcon,
        FileUploaderRegular: FileUploaderRegular,
        FileUploaderMinimal: FileUploaderMinimal,
        registerBlocks: registerBlocks,
        CloudEditor: CloudEditor,
        CropFrame: CropFrame,
        EditorCropButtonControl: EditorCropButtonControl,
        EditorFilterControl: EditorFilterControl,
        EditorOperationControl: EditorOperationControl,
        EditorImageCropper: EditorImageCropper,
        EditorImageFader: EditorImageFader,
        EditorScroller: EditorScroller,
        EditorSlider: EditorSlider,
        EditorToolbar: EditorToolbar,
        UcBtnUi: UcBtnUi,
        LineLoaderUi: LineLoaderUi,
        PresenceToggle: PresenceToggle,
        SliderUi: SliderUi
    });

    /* src/App.svelte generated by Svelte v3.47.0 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (23:4) {#each files as file}
    function create_each_block(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "https://ucarecdn.com/" + /*file*/ ctx[2].uuid + "/-/preview/-/scale_crop/400x400/")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "200");
    			attr_dev(img, "alt", "Uploadcare uploaded file");
    			add_location(img, file, 23, 6, 530);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*files*/ 1 && !src_url_equal(img.src, img_src_value = "https://ucarecdn.com/" + /*file*/ ctx[2].uuid + "/-/preview/-/scale_crop/400x400/")) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(23:4) {#each files as file}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div1;
    	let uc_file_uploader_regular;
    	let t0;
    	let uc_data_output;
    	let t1;
    	let div0;
    	let mounted;
    	let dispose;
    	let each_value = /*files*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			uc_file_uploader_regular = element("uc-file-uploader-regular");
    			t0 = space();
    			uc_data_output = element("uc-data-output");
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_custom_element_data(uc_file_uploader_regular, "class", "uploader-cfg uc-wgt-common svelte-1d53i1x");
    			add_location(uc_file_uploader_regular, file, 14, 2, 292);
    			set_custom_element_data(uc_data_output, "fire-event", "");
    			set_custom_element_data(uc_data_output, "class", "uploader-cfg uc-wgt-common svelte-1d53i1x");
    			add_location(uc_data_output, file, 16, 2, 359);
    			attr_dev(div0, "class", "output svelte-1d53i1x");
    			add_location(div0, file, 21, 2, 477);
    			attr_dev(div1, "class", "wrapper svelte-1d53i1x");
    			add_location(div1, file, 13, 0, 268);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, uc_file_uploader_regular);
    			append_dev(div1, t0);
    			append_dev(div1, uc_data_output);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(uc_data_output, "data-output", /*handleUploaderEvent*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*files*/ 1) {
    				each_value = /*files*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	registerBlocks(UC);
    	let files = [];

    	function handleUploaderEvent(e) {
    		const { data } = e.detail;
    		$$invalidate(0, files = data);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ UC, files, handleUploaderEvent });

    	$$self.$inject_state = $$props => {
    		if ('files' in $$props) $$invalidate(0, files = $$props.files);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [files, handleUploaderEvent];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
