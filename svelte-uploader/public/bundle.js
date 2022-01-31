
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
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
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

    /**
     * @license
     * MIT License
     * 
     * Copyright (c) 2021 Uploadcare (hello@uploadcare.com). All rights reserved.
     * 
     * Permission is hereby granted, free of charge, to any person obtaining a copy
     * of this software and associated documentation files (the "Software"), to deal
     * in the Software without restriction, including without limitation the rights
     * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the Software is
     * furnished to do so, subject to the following conditions:
     * 
     * The above copyright notice and this permission notice shall be included in all
     * copies or substantial portions of the Software.
     * 
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
     * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     * SOFTWARE.
     */
    var yt=Object.defineProperty;var ve=(r,t,e)=>t in r?yt(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var ye=r=>yt(r,"__esModule",{value:!0});var _e=(r,t)=>{ye(r);for(var e in t)yt(r,e,{get:t[e],enumerable:!0});};var d=(r,t,e)=>(ve(r,typeof t!="symbol"?t+"":t,e),e);var Pt={};_e(Pt,{ActivityCaption:()=>ft,ActivityIcon:()=>gt,BlockComponent:()=>c,CameraSource:()=>lt,CloudImageEditor:()=>Dt,ConfirmationDialog:()=>nt,DataOutput:()=>A,DropArea:()=>Rt,EditableCanvas:()=>q,ExternalSource:()=>mt,FileItem:()=>$,Icon:()=>G,MessageBox:()=>et,Modal:()=>st,ProgressBar:()=>ut,SimpleBtn:()=>tt,SourceBtn:()=>W,SourceList:()=>Bt,StartFrom:()=>It,Tabs:()=>J,UploadDetails:()=>ct,UploadList:()=>ot,UrlSource:()=>at});function Ce(r){let t=e=>{var i;for(let s in e)((i=e[s])==null?void 0:i.constructor)===Object&&(e[s]=t(e[s]));return {...e}};return t(r)}var y=class{constructor(t){this.uid=Symbol(),this.name=t.name||null,t.schema.constructor===Object?this.store=Ce(t.schema):(this._storeIsProxy=!0,this.store=t.schema),this.callbackMap=Object.create(null);}static warn(t,e){console.warn(`Symbiote Data: cannot ${t}. Prop name: `+e);}read(t){return !this._storeIsProxy&&!this.store.hasOwnProperty(t)?(y.warn("read",t),null):this.store[t]}has(t){return this._storeIsProxy?this.store[t]!==void 0:this.store.hasOwnProperty(t)}add(t,e,i=!0){!i&&Object.keys(this.store).includes(t)||(this.store[t]=e,this.callbackMap[t]&&this.callbackMap[t].forEach(s=>{s(this.store[t]);}));}pub(t,e){if(!this._storeIsProxy&&!this.store.hasOwnProperty(t)){y.warn("publish",t);return}this.add(t,e);}multiPub(t){for(let e in t)this.pub(e,t[e]);}notify(t){this.callbackMap[t]&&this.callbackMap[t].forEach(e=>{e(this.store[t]);});}sub(t,e,i=!0){return !this._storeIsProxy&&!this.store.hasOwnProperty(t)?(y.warn("subscribe",t),null):(this.callbackMap[t]||(this.callbackMap[t]=new Set),this.callbackMap[t].add(e),i&&e(this.store[t]),{remove:()=>{this.callbackMap[t].delete(e),this.callbackMap[t].size||delete this.callbackMap[t];},callback:e})}remove(){delete y.globalStore[this.uid];}static registerLocalCtx(t){let e=new y({schema:t});return y.globalStore[e.uid]=e,e}static registerNamedCtx(t,e){let i=y.globalStore[t];return i?console.warn('State: context name "'+t+'" already in use'):(i=new y({name:t,schema:e}),y.globalStore[t]=i),i}static clearNamedCtx(t){delete y.globalStore[t];}static getNamedCtx(t,e=!0){return y.globalStore[t]||(e&&console.warn('State: wrong context name - "'+t+'"'),null)}};y.globalStore=Object.create(null);var _=Object.freeze({BIND_ATTR:"set",ATTR_BIND_PRFX:"@",EXT_DATA_CTX_PRFX:"*",NAMED_DATA_CTX_SPLTR:"/",CTX_NAME_ATTR:"ctx-name",CSS_CTX_PROP:"--ctx-name",EL_REF_ATTR:"ref",AUTO_TAG_PRFX:"sym"}),Ft="1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm",we=Ft.length-1,K=class{static generate(t="XXXXXXXXX-XXX"){let e="";for(let i=0;i<t.length;i++)e+=t[i]==="-"?t[i]:Ft.charAt(Math.random()*we);return e}};function xe(r,t){if(t.renderShadow)return;let e=[...r.querySelectorAll("slot")];if(t.__initChildren.length&&e.length){let i={};e.forEach(s=>{let n=s.getAttribute("name");n?i[n]={slot:s,fr:document.createDocumentFragment()}:i.__default__={slot:s,fr:document.createDocumentFragment()};}),t.__initChildren.forEach(s=>{var o;let n=(o=s.getAttribute)==null?void 0:o.call(s,"slot");n?(s.removeAttribute("slot"),i[n].fr.appendChild(s)):i.__default__&&i.__default__.fr.appendChild(s);}),Object.values(i).forEach(s=>{s.slot.parentNode.insertBefore(s.fr,s.slot),s.slot.remove();});}else t.innerHTML="";}function Ae(r,t){[...r.querySelectorAll(`[${_.EL_REF_ATTR}]`)].forEach(e=>{let i=e.getAttribute(_.EL_REF_ATTR);t.ref[i]=e,e.removeAttribute(_.EL_REF_ATTR);});}function Te(r,t){[...r.querySelectorAll(`[${_.BIND_ATTR}]`)].forEach(e=>{e.getAttribute(_.BIND_ATTR).split(";").forEach(n=>{if(!n)return;let o=n.split(":").map(g=>g.trim()),l=o[0],a;l.indexOf(_.ATTR_BIND_PRFX)===0&&(a=!0,l=l.replace(_.ATTR_BIND_PRFX,""));let u=o[1].split(",").map(g=>g.trim()),p,h,b,f;if(l.includes(".")){p=!0;let g=l.split(".");f=()=>{h=e,g.forEach((v,w)=>{w<g.length-1?h=h[v]:b=v;});},f();}for(let g of u)t.sub(g,v=>{a?(v==null?void 0:v.constructor)===Boolean?v?e.setAttribute(l,""):e.removeAttribute(l):e.setAttribute(l,v):p?h?h[b]=v:window.setTimeout(()=>{f(),h[b]=v;}):e[l]=v;});}),e.removeAttribute(_.BIND_ATTR);});}var Ee=[xe,Ae,Te],Vt=0,I=class extends HTMLElement{render(t,e=this.renderShadow){let i;if(t||this.constructor.template){for(this.constructor.template&&!this.constructor.__tpl&&(this.constructor.__tpl=document.createElement("template"),this.constructor.__tpl.innerHTML=this.constructor.template);this.firstChild;)this.firstChild.remove();if((t==null?void 0:t.constructor)===DocumentFragment)i=t;else if((t==null?void 0:t.constructor)===String){let s=document.createElement("template");s.innerHTML=t,i=s.content.cloneNode(!0);}else this.constructor.__tpl&&(i=this.constructor.__tpl.content.cloneNode(!0));for(let s of this.tplProcessors)s(i,this);}e?(this.shadowRoot||this.attachShadow({mode:"open"}),i&&this.shadowRoot.appendChild(i)):i&&this.appendChild(i);}addTemplateProcessor(t){this.tplProcessors.add(t);}constructor(){super();this.init$=Object.create(null),this.tplProcessors=new Set,this.ref=Object.create(null),this.allSubs=new Set,this.pauseRender=!1,this.renderShadow=!1,this.readyToDestroy=!0;}get autoCtxName(){return this.__autoCtxName||(this.__autoCtxName=K.generate(),this.style.setProperty(_.CSS_CTX_PROP,`'${this.__autoCtxName}'`)),this.__autoCtxName}get cssCtxName(){return this.getCssData(_.CSS_CTX_PROP,!0)}get ctxName(){var t;return ((t=this.getAttribute(_.CTX_NAME_ATTR))==null?void 0:t.trim())||this.cssCtxName||this.autoCtxName}get localCtx(){return this.__localCtx||(this.__localCtx=y.registerLocalCtx({})),this.__localCtx}get nodeCtx(){return y.getNamedCtx(this.ctxName,!1)||y.registerNamedCtx(this.ctxName,{})}static __parseProp(t,e){let i,s;if(t.startsWith(_.EXT_DATA_CTX_PRFX))i=e.nodeCtx,s=t.replace(_.EXT_DATA_CTX_PRFX,"");else if(t.includes(_.NAMED_DATA_CTX_SPLTR)){let n=t.split(_.NAMED_DATA_CTX_SPLTR);i=y.getNamedCtx(n[0]),s=n[1];}else i=e.localCtx,s=t;return {ctx:i,name:s}}sub(t,e){let i=I.__parseProp(t,this);this.allSubs.add(i.ctx.sub(i.name,e));}notify(t){let e=I.__parseProp(t,this);e.ctx.notify(e.name);}has(t){let e=I.__parseProp(t,this);return e.ctx.has(e.name)}add(t,e){let i=I.__parseProp(t,this);i.ctx.add(i.name,e,!1);}add$(t){for(let e in t)this.add(e,t[e]);}get $(){if(!this.__stateProxy){let t=Object.create(null);this.__stateProxy=new Proxy(t,{set:(e,i,s)=>{let n=I.__parseProp(i,this);return n.ctx.pub(n.name,s),!0},get:(e,i)=>{let s=I.__parseProp(i,this);return s.ctx.read(s.name)}});}return this.__stateProxy}set$(t){for(let e in t)this.$[e]=t[e];}initCallback(){}__initDataCtx(){let t=this.constructor.__attrDesc;if(t)for(let e of Object.values(t))Object.keys(this.init$).includes(e)||(this.init$[e]="");for(let e in this.init$)if(e.startsWith(_.EXT_DATA_CTX_PRFX))this.nodeCtx.add(e.replace(_.EXT_DATA_CTX_PRFX,""),this.init$[e]);else if(e.includes(_.NAMED_DATA_CTX_SPLTR)){let i=e.split(_.NAMED_DATA_CTX_SPLTR),s=i[0].trim(),n=i[1].trim();if(s&&n){let o=y.getNamedCtx(s,!1);o||(o=y.registerNamedCtx(s,{})),o.add(n,this.init$[e]);}}else this.localCtx.add(e,this.init$[e]);this.__dataCtxInitialized=!0;}connectedCallback(){var t,e;if(this.__disconnectTimeout&&window.clearTimeout(this.__disconnectTimeout),!this.connectedOnce){let i=(t=this.getAttribute(_.CTX_NAME_ATTR))==null?void 0:t.trim();i&&this.style.setProperty(_.CSS_CTX_PROP,`'${i}'`),this.__initDataCtx(),this.__initChildren=[...this.childNodes];for(let s of Ee)this.addTemplateProcessor(s);this.pauseRender||this.render(),(e=this.initCallback)==null||e.call(this);}this.connectedOnce=!0;}destroyCallback(){}disconnectedCallback(){this.dropCssDataCache(),!!this.readyToDestroy&&(this.__disconnectTimeout&&window.clearTimeout(this.__disconnectTimeout),this.__disconnectTimeout=window.setTimeout(()=>{this.destroyCallback();for(let t of this.allSubs)t.remove(),this.allSubs.delete(t);for(let t of this.tplProcessors)this.tplProcessors.delete(t);},100));}static reg(t,e=!1){if(t||(Vt++,t=`${_.AUTO_TAG_PRFX}-${Vt}`),this.__tag=t,window.customElements.get(t)){console.warn(`${t} - is already in "customElements" registry`);return}window.customElements.define(t,e?class extends this{}:this);}static get is(){return this.__tag||this.reg(),this.__tag}static bindAttributes(t){this.observedAttributes=Object.keys(t),this.__attrDesc=t;}attributeChangedCallback(t,e,i){if(e===i)return;let s=this.constructor.__attrDesc[t];s?this.__dataCtxInitialized?this.$[s]=i:this.init$[s]=i:this[t]=i;}getCssData(t,e=!1){if(this.__cssDataCache||(this.__cssDataCache=Object.create(null)),!Object.keys(this.__cssDataCache).includes(t)){this.__computedStyle||(this.__computedStyle=window.getComputedStyle(this));let i=this.__computedStyle.getPropertyValue(t).trim();i.startsWith("'")&&i.endsWith("'")&&(i=i.replace(/\'/g,'"'));try{this.__cssDataCache[t]=JSON.parse(i);}catch(s){!e&&console.warn(`CSS Data error: ${t}`),this.__cssDataCache[t]=null;}}return this.__cssDataCache[t]}dropCssDataCache(){this.__cssDataCache=null,this.__computedStyle=null;}defineAccessor(t,e,i){let s="__"+t;this[s]=this[t],Object.defineProperty(this,t,{set:n=>{this[s]=n,i?window.setTimeout(()=>{e==null||e(n);}):e==null||e(n);},get:()=>this[s]}),this[t]=this[s];}},zt="[Typed State] Wrong property name: ",ke="[Typed State] Wrong property type: ",Xt=class{constructor(t,e){this.__typedSchema=t,this.__ctxId=e||K.generate(),this.__schema=Object.keys(t).reduce((i,s)=>(i[s]=t[s].value,i),{}),this.__state=y.registerNamedCtx(this.__ctxId,this.__schema);}setValue(t,e){if(!this.__typedSchema.hasOwnProperty(t)){console.warn(zt+t);return}if((e==null?void 0:e.constructor)!==this.__typedSchema[t].type){console.warn(ke+t);return}this.__state.pub(t,e);}setMultipleValues(t){for(let e in t)this.setValue(e,t[e]);}getValue(t){if(!this.__typedSchema.hasOwnProperty(t)){console.warn(zt+t);return}return this.__state.read(t)}subscribe(t,e){return this.__state.sub(t,e)}remove(){this.__state.remove();}},_t=class{constructor(t){this.__typedSchema=t.typedSchema,this.__ctxId=t.ctxName||K.generate(),this.__state=y.registerNamedCtx(this.__ctxId,{}),this.__watchList=t.watchList||[],this.__handler=t.handler||null,this.__subsMap=Object.create(null),this.__observers=new Set,this.__items=new Set;let e=Object.create(null);this.__notifyObservers=(i,s)=>{this.__observeTimeout&&window.clearTimeout(this.__observeTimeout),e[i]||(e[i]=new Set),e[i].add(s),this.__observeTimeout=window.setTimeout(()=>{this.__observers.forEach(n=>{n({...e});}),e=Object.create(null);});};}notify(){this.__notifyTimeout&&window.clearTimeout(this.__notifyTimeout),this.__notifyTimeout=window.setTimeout(()=>{var t;(t=this.__handler)==null||t.call(this,[...this.__items]);});}add(t){let e=new Xt(this.__typedSchema);for(let i in t)e.setValue(i,t[i]);return this.__state.add(e.__ctxId,e),this.__watchList.forEach(i=>{this.__subsMap[e.__ctxId]||(this.__subsMap[e.__ctxId]=[]),this.__subsMap[e.__ctxId].push(e.subscribe(i,()=>{this.__notifyObservers(i,e.__ctxId);}));}),this.__items.add(e.__ctxId),this.notify(),e}read(t){return this.__state.read(t)}readProp(t,e){return this.read(t).getValue(e)}publishProp(t,e,i){this.read(t).setValue(e,i);}remove(t){this.__items.delete(t),this.notify(),this.__state.pub(t,null),delete this.__subsMap[t];}clearAll(){this.__items.forEach(t=>{this.remove(t);});}observe(t){this.__observers.add(t);}unobserve(t){this.__observers.delete(t);}findItems(t){let e=[];return this.__items.forEach(i=>{let s=this.read(i);t(s)&&e.push(i);}),e}items(){return [...this.__items]}destroy(){this.__state.remove(),this.__observers=null;for(let t in this.__subsMap)this.__subsMap[t].forEach(e=>{e.remove();}),delete this.__subsMap[t];}},D=class{static _print(t){console.warn(t);}static setDefaultTitle(t){this.defaultTitle=t;}static setRoutingMap(t){Object.assign(this.appMap,t);for(let e in this.appMap)!this.defaultRoute&&this.appMap[e].default===!0?this.defaultRoute=e:!this.errorRoute&&this.appMap[e].error===!0&&(this.errorRoute=e);}static set routingEventName(t){this.__routingEventName=t;}static get routingEventName(){return this.__routingEventName||"sym-on-route"}static readAddressBar(){let t={route:null,options:{}};return window.location.search.split(this.separator).forEach(i=>{if(i.includes("?"))t.route=i.replace("?","");else if(i.includes("=")){let s=i.split("=");t.options[s[0]]=decodeURI(s[1]);}else t.options[i]=!0;}),t}static notify(){let t=this.readAddressBar(),e=this.appMap[t.route];if(e&&e.title&&(document.title=e.title),t.route===null&&this.defaultRoute){this.applyRoute(this.defaultRoute);return}else if(!e&&this.errorRoute){this.applyRoute(this.errorRoute);return}else if(!e&&this.defaultRoute){this.applyRoute(this.defaultRoute);return}else if(!e){this._print(`Route "${t.route}" not found...`);return}let i=new CustomEvent(D.routingEventName,{detail:{route:t.route,options:Object.assign(e||{},t.options)}});window.dispatchEvent(i);}static reflect(t,e={}){let i=this.appMap[t];if(!i){this._print("Wrong route: "+t);return}let s="?"+t;for(let o in e)e[o]===!0?s+=this.separator+o:s+=this.separator+o+`=${e[o]}`;let n=i.title||this.defaultTitle||"";window.history.pushState(null,n,s),document.title=n;}static applyRoute(t,e={}){this.reflect(t,e),this.notify();}static setSeparator(t){this._separator=t;}static get separator(){return this._separator||"&"}static createRouterData(t,e){this.setRoutingMap(e);let i=y.registerNamedCtx(t,{route:null,options:null,title:null});return window.addEventListener(this.routingEventName,s=>{var n;i.multiPub({route:s.detail.route,options:s.detail.options,title:((n=s.detail.options)==null?void 0:n.title)||this.defaultTitle||""});}),D.notify(),i}};D.appMap=Object.create(null);window.onpopstate=()=>{D.notify();};function X(r,t){for(let e in t)e.includes("-")?r.style.setProperty(e,t[e]):r.style[e]=t[e];}function R(r,t){for(let e in t)t[e].constructor===Boolean?t[e]?r.setAttribute(e,""):r.removeAttribute(e):r.setAttribute(e,t[e]);}function H(r={tag:"div"}){let t=document.createElement(r.tag);if(r.attributes&&R(t,r.attributes),r.styles&&X(t,r.styles),r.properties)for(let e in r.properties)t[e]=r.properties[e];return r.processors&&r.processors.forEach(e=>{e(t);}),r.children&&r.children.forEach(e=>{let i=H(e);t.appendChild(i);}),t}function Wt(r,t){[...r.querySelectorAll("[l10n]")].forEach(e=>{let i=e.getAttribute("l10n"),s="textContent";if(i.includes(":")){let o=i.split(":");s=o[0],i=o[1];}let n="l10n:"+i;t.__l10nKeys.push(n),t.add(n,i),t.sub(n,o=>{e[s]=t.l10n(o);}),e.removeAttribute("l10n");});}var T=class extends Error{constructor(t,e,i,s,n){super();this.name="UploadClientError",this.message=t,this.code=e,this.request=i,this.response=s,this.headers=n,Object.setPrototypeOf(this,T.prototype);}},wt=(r="Request canceled")=>{let t=new T(r);return t.isCancel=!0,t},Q=(r,t)=>{r&&(r.aborted?Promise.resolve().then(t):r.addEventListener("abort",()=>t(),{once:!0}));},B=({method:r,url:t,data:e,headers:i={},signal:s,onProgress:n})=>new Promise((o,l)=>{let a=new XMLHttpRequest,u=(r==null?void 0:r.toUpperCase())||"GET",p=!1;a.open(u,t),i&&Object.entries(i).forEach(h=>{let[b,f]=h;typeof f!="undefined"&&!Array.isArray(f)&&a.setRequestHeader(b,f);}),a.responseType="text",Q(s,()=>{p=!0,a.abort(),l(wt());}),a.onload=()=>{if(a.status!=200)l(new Error(`Error ${a.status}: ${a.statusText}`));else {let h={method:u,url:t,data:e,headers:i||void 0,signal:s,onProgress:n},b=a.getAllResponseHeaders().trim().split(/[\r\n]+/),f={};b.forEach(function(w){let m=w.split(": "),x=m.shift(),O=m.join(": ");x&&typeof x!="undefined"&&(f[x]=O);});let g=a.response,v=a.status;o({request:h,data:g,headers:f,status:v});}},a.onerror=()=>{p||l(new Error("Network error"));},n&&typeof n=="function"&&(a.upload.onprogress=h=>{n({value:h.loaded/h.total});}),e?a.send(e):a.send();});function Ie(r){return r}var Ue=Ie,Le=()=>new FormData,Re=r=>r[0]==="file";function xt(r){let t=Le();for(let e of r)if(Array.isArray(e[1]))e[1].forEach(i=>i&&t.append(e[0]+"[]",`${i}`));else if(Re(e)){let i=e[2],s=Ue(e[1]);t.append(e[0],s,i);}else e[1]!=null&&t.append(e[0],`${e[1]}`);return t}var qt=(r,t)=>typeof t!="undefined"?`${r}=${encodeURIComponent(t)}`:null,Be=r=>Object.entries(r).reduce((t,[e,i])=>t.concat(Array.isArray(i)?i.map(s=>qt(`${e}[]`,s)):qt(e,i)),[]).filter(t=>!!t).join("&"),P=(r,t,e)=>[r,t,e&&Object.keys(e).length>0?"?":"",e&&Be(e)].filter(Boolean).join(""),C={baseCDN:"https://ucarecdn.com",baseURL:"https://upload.uploadcare.com",maxContentLength:50*1024*1024,retryThrottledRequestMaxTimes:1,multipartMinFileSize:25*1024*1024,multipartChunkSize:5*1024*1024,multipartMinLastPartSize:1024*1024,maxConcurrentRequests:4,multipartMaxAttempts:3,pollingTimeoutMilliseconds:1e4,pusherKey:"79ae88bd931ea68464d9"},Me="application/octet-stream",Jt="original",Oe="2.1.0";function N({userAgent:r,publicKey:t="",integration:e=""}={}){let i="UploadcareUploadClient",s=Oe,n="JavaScript";if(typeof r=="string")return r;if(typeof r=="function")return r({publicKey:t,libraryName:i,libraryVersion:s,languageName:n,integration:e});let o=[i,s,t].filter(Boolean).join("/"),l=[n,e].filter(Boolean).join("; ");return `${o} (${l})`}var je=/\W|_/g;function De(r){return r.split(je).map((t,e)=>t.charAt(0)[e>0?"toUpperCase":"toLowerCase"]()+t.slice(1)).join("")}function U(r){return !r||typeof r!="object"?r:Object.keys(r).reduce((t,e)=>(t[De(e)]=typeof r[e]=="object"?U(r[e]):r[e],t),{})}var Pe=r=>new Promise(t=>setTimeout(t,r)),Ne={factor:2,time:100};function Zt(r,t=Ne){let e=0;function i(s){let n=Math.round(t.time*Math.pow(t.factor,e));return s({attempt:e,retry:l=>Pe(l!=null?l:n).then(()=>(e+=1,i(s)))})}return i(r)}var Fe="RequestThrottledError",Ve=15e3;function ze(r){let{headers:t}=r||{};return t&&Number.parseInt(t["x-throttle-wait-seconds"])*1e3||Ve}function F(r,t){return Zt(({attempt:e,retry:i})=>r().catch(s=>{if("response"in s&&(s==null?void 0:s.code)===Fe&&e<t)return i(ze(s));throw s}))}function Xe(r,{publicKey:t,fileName:e,baseURL:i=C.baseURL,secureSignature:s,secureExpire:n,store:o,signal:l,onProgress:a,source:u="local",integration:p,userAgent:h,retryThrottledRequestMaxTimes:b=C.retryThrottledRequestMaxTimes}){return F(()=>{var f;return B({method:"POST",url:P(i,"/base/",{jsonerrors:1}),headers:{"X-UC-User-Agent":N({publicKey:t,integration:p,userAgent:h})},data:xt([["file",r,(f=e!=null?e:r.name)!==null&&f!==void 0?f:Jt],["UPLOADCARE_PUB_KEY",t],["UPLOADCARE_STORE",typeof o=="undefined"?"auto":o?1:0],["signature",s],["expire",n],["source",u]]),signal:l,onProgress:a}).then(({data:g,headers:v,request:w})=>{let m=U(JSON.parse(g));if("error"in m)throw new T(m.error.content,m.error.errorCode,w,m,v);return m})},b)}var At;(function(r){r.Token="token",r.FileInfo="file_info";})(At||(At={}));function He(r,{publicKey:t,baseURL:e=C.baseURL,store:i,fileName:s,checkForUrlDuplicates:n,saveUrlForRecurrentUploads:o,secureSignature:l,secureExpire:a,source:u="url",signal:p,integration:h,userAgent:b,retryThrottledRequestMaxTimes:f=C.retryThrottledRequestMaxTimes}){return F(()=>B({method:"POST",headers:{"X-UC-User-Agent":N({publicKey:t,integration:h,userAgent:b})},url:P(e,"/from_url/",{jsonerrors:1,pub_key:t,source_url:r,store:typeof i=="undefined"?"auto":i?1:void 0,filename:s,check_URL_duplicates:n?1:void 0,save_URL_duplicates:o?1:void 0,signature:l,expire:a,source:u}),signal:p}).then(({data:g,headers:v,request:w})=>{let m=U(JSON.parse(g));if("error"in m)throw new T(m.error.content,m.error.errorCode,w,m,v);return m}),f)}var E;(function(r){r.Unknown="unknown",r.Waiting="waiting",r.Progress="progress",r.Error="error",r.Success="success";})(E||(E={}));var Ge=r=>"status"in r&&r.status===E.Error;function We(r,{publicKey:t,baseURL:e=C.baseURL,signal:i,integration:s,userAgent:n,retryThrottledRequestMaxTimes:o=C.retryThrottledRequestMaxTimes}={}){return F(()=>B({method:"GET",headers:t?{"X-UC-User-Agent":N({publicKey:t,integration:s,userAgent:n})}:void 0,url:P(e,"/from_url/status/",{jsonerrors:1,token:r}),signal:i}).then(({data:l,headers:a,request:u})=>{let p=U(JSON.parse(l));if("error"in p&&!Ge(p))throw new T(p.error.content,void 0,u,p,a);return p}),o)}function Yt(r,{publicKey:t,baseURL:e=C.baseURL,signal:i,source:s,integration:n,userAgent:o,retryThrottledRequestMaxTimes:l=C.retryThrottledRequestMaxTimes}){return F(()=>B({method:"GET",headers:{"X-UC-User-Agent":N({publicKey:t,integration:n,userAgent:o})},url:P(e,"/info/",{jsonerrors:1,pub_key:t,file_id:r,source:s}),signal:i}).then(({data:a,headers:u,request:p})=>{let h=U(JSON.parse(a));if("error"in h)throw new T(h.error.content,h.error.errorCode,p,h,u);return h}),l)}function qe(r,{publicKey:t,contentType:e,fileName:i,multipartChunkSize:s=C.multipartChunkSize,baseURL:n="",secureSignature:o,secureExpire:l,store:a,signal:u,source:p="local",integration:h,userAgent:b,retryThrottledRequestMaxTimes:f=C.retryThrottledRequestMaxTimes}){return F(()=>B({method:"POST",url:P(n,"/multipart/start/",{jsonerrors:1}),headers:{"X-UC-User-Agent":N({publicKey:t,integration:h,userAgent:b})},data:xt([["filename",i!=null?i:Jt],["size",r],["content_type",e!=null?e:Me],["part_size",s],["UPLOADCARE_STORE",a?"":"auto"],["UPLOADCARE_PUB_KEY",t],["signature",o],["expire",l],["source",p]]),signal:u}).then(({data:g,headers:v,request:w})=>{let m=U(JSON.parse(g));if("error"in m)throw new T(m.error.content,m.error.errorCode,w,m,v);return m.parts=Object.keys(m.parts).map(x=>m.parts[x]),m}),f)}function Je(r,t,{signal:e,onProgress:i}){return B({method:"PUT",url:t,data:r,onProgress:i,signal:e}).then(s=>(i&&i({value:1}),s)).then(({status:s})=>({code:s}))}function Ze(r,{publicKey:t,baseURL:e=C.baseURL,source:i="local",signal:s,integration:n,userAgent:o,retryThrottledRequestMaxTimes:l=C.retryThrottledRequestMaxTimes}){return F(()=>B({method:"POST",url:P(e,"/multipart/complete/",{jsonerrors:1}),headers:{"X-UC-User-Agent":N({publicKey:t,integration:n,userAgent:o})},data:xt([["uuid",r],["UPLOADCARE_PUB_KEY",t],["source",i]]),signal:s}).then(({data:a,headers:u,request:p})=>{let h=U(JSON.parse(a));if("error"in h)throw new T(h.error.content,h.error.errorCode,p,h,u);return h}),l)}var M=class{constructor(t,{baseCDN:e,defaultEffects:i,fileName:s}){this.name=null,this.size=null,this.isStored=null,this.isImage=null,this.mimeType=null,this.cdnUrl=null,this.cdnUrlModifiers=null,this.originalUrl=null,this.originalFilename=null,this.imageInfo=null,this.videoInfo=null;let{uuid:n,s3Bucket:o}=t,l=o?`https://${o}.s3.amazonaws.com/${n}/${t.filename}`:`${e}/${n}/`,a=i?`-/${i}`:null,u=`${l}${a||""}`,p=n?l:null;this.uuid=n,this.name=s||t.filename,this.size=t.size,this.isStored=t.isStored,this.isImage=t.isImage,this.mimeType=t.mimeType,this.cdnUrl=u,this.cdnUrlModifiers=a,this.originalUrl=p,this.originalFilename=t.originalFilename,this.imageInfo=U(t.imageInfo),this.videoInfo=U(t.videoInfo);}},Ye=500,Kt=({check:r,interval:t=Ye,signal:e})=>new Promise((i,s)=>{let n;Q(e,()=>{n&&clearTimeout(n),s(wt("Poll cancelled"));});let o=()=>{try{Promise.resolve(r(e)).then(l=>{l?i(l):n=setTimeout(o,t);}).catch(l=>s(l));}catch(l){s(l);}};n=setTimeout(o,0);});function Tt({file:r,publicKey:t,baseURL:e,source:i,integration:s,userAgent:n,retryThrottledRequestMaxTimes:o,signal:l,onProgress:a}){return Kt({check:u=>Yt(r,{publicKey:t,baseURL:e,signal:u,source:i,integration:s,userAgent:n,retryThrottledRequestMaxTimes:o}).then(p=>p.isReady?p:(a&&a({value:1}),!1)),signal:l})}var Ke=(r,{publicKey:t,fileName:e,baseURL:i,secureSignature:s,secureExpire:n,store:o,signal:l,onProgress:a,source:u,integration:p,userAgent:h,retryThrottledRequestMaxTimes:b,baseCDN:f})=>Xe(r,{publicKey:t,fileName:e,baseURL:i,secureSignature:s,secureExpire:n,store:o,signal:l,onProgress:a,source:u,integration:p,userAgent:h,retryThrottledRequestMaxTimes:b}).then(({file:g})=>Tt({file:g,publicKey:t,baseURL:i,source:u,integration:p,userAgent:h,retryThrottledRequestMaxTimes:b,onProgress:a,signal:l})).then(g=>new M(g,{baseCDN:f})),{AbortController:Qe,AbortSignal:Ii}=typeof self!="undefined"?self:typeof window!="undefined"?window:void 0,ti=(r,{signal:t}={})=>{let e=null,i=null,s=r.map(()=>new Qe),n=o=>()=>{i=o,s.forEach((l,a)=>a!==o&&l.abort());};return Q(t,()=>{s.forEach(o=>o.abort());}),Promise.all(r.map((o,l)=>{let a=n(l);return Promise.resolve().then(()=>o({stopRace:a,signal:s[l].signal})).then(u=>(a(),u)).catch(u=>(e=u,null))})).then(o=>{if(i===null)throw e;return o[i]})},ei=window.WebSocket,Qt=class{constructor(){this.events=Object.create({});}emit(t,e){var i;(i=this.events[t])===null||i===void 0||i.forEach(s=>s(e));}on(t,e){this.events[t]=this.events[t]||[],this.events[t].push(e);}off(t,e){e?this.events[t]=this.events[t].filter(i=>i!==e):this.events[t]=[];}},ii=(r,t)=>Object.assign(r==="success"?{status:E.Success}:r==="progress"?{status:E.Progress}:{status:E.Error},t),te=class{constructor(t,e=3e4){this.ws=void 0,this.queue=[],this.isConnected=!1,this.subscribers=0,this.emmitter=new Qt,this.disconnectTimeoutId=null,this.key=t,this.disconnectTime=e;}connect(){if(this.disconnectTimeoutId&&clearTimeout(this.disconnectTimeoutId),!this.isConnected&&!this.ws){let t=`wss://ws.pusherapp.com/app/${this.key}?protocol=5&client=js&version=1.12.2`;this.ws=new ei(t),this.ws.addEventListener("error",e=>{this.emmitter.emit("error",new Error(e.message));}),this.emmitter.on("connected",()=>{this.isConnected=!0,this.queue.forEach(e=>this.send(e.event,e.data)),this.queue=[];}),this.ws.addEventListener("message",e=>{let i=JSON.parse(e.data.toString());switch(i.event){case"pusher:connection_established":{this.emmitter.emit("connected",void 0);break}case"pusher:ping":{this.send("pusher:pong",{});break}case"progress":case"success":case"fail":this.emmitter.emit(i.channel,ii(i.event,JSON.parse(i.data)));}});}}disconnect(){let t=()=>{var e;(e=this.ws)===null||e===void 0||e.close(),this.ws=void 0,this.isConnected=!1;};this.disconnectTime?this.disconnectTimeoutId=setTimeout(()=>{t();},this.disconnectTime):t();}send(t,e){var i;let s=JSON.stringify({event:t,data:e});(i=this.ws)===null||i===void 0||i.send(s);}subscribe(t,e){this.subscribers+=1,this.connect();let i=`task-status-${t}`,s={event:"pusher:subscribe",data:{channel:i}};this.emmitter.on(i,e),this.isConnected?this.send(s.event,s.data):this.queue.push(s);}unsubscribe(t){this.subscribers-=1;let e=`task-status-${t}`,i={event:"pusher:unsubscribe",data:{channel:e}};this.emmitter.off(e),this.isConnected?this.send(i.event,i.data):this.queue=this.queue.filter(s=>s.data.channel!==e),this.subscribers===0&&this.disconnect();}onError(t){return this.emmitter.on("error",t),()=>this.emmitter.off("error",t)}},Et=null,kt=r=>{if(!Et){let t=typeof window=="undefined"?0:3e4;Et=new te(r,t);}return Et},si=r=>{kt(r).connect();};function ri({token:r,publicKey:t,baseURL:e,integration:i,userAgent:s,retryThrottledRequestMaxTimes:n,onProgress:o,signal:l}){return Kt({check:a=>We(r,{publicKey:t,baseURL:e,integration:i,userAgent:s,retryThrottledRequestMaxTimes:n,signal:a}).then(u=>{switch(u.status){case E.Error:return new T(u.error,u.errorCode);case E.Waiting:return !1;case E.Unknown:return new T(`Token "${r}" was not found.`);case E.Progress:return o&&o({value:u.done/u.total}),!1;case E.Success:return o&&o({value:u.done/u.total}),u;default:throw new Error("Unknown status")}}),signal:l})}var ni=({token:r,pusherKey:t,signal:e,onProgress:i})=>new Promise((s,n)=>{let o=kt(t),l=o.onError(n),a=()=>{l(),o.unsubscribe(r);};Q(e,()=>{a(),n(wt("pusher cancelled"));}),o.subscribe(r,u=>{switch(u.status){case E.Progress:{i&&i({value:u.done/u.total});break}case E.Success:{a(),i&&i({value:u.done/u.total}),s(u);break}case E.Error:a(),n(new T(u.msg,u.error_code));}});}),oi=(r,{publicKey:t,fileName:e,baseURL:i,baseCDN:s,checkForUrlDuplicates:n,saveUrlForRecurrentUploads:o,secureSignature:l,secureExpire:a,store:u,signal:p,onProgress:h,source:b,integration:f,userAgent:g,retryThrottledRequestMaxTimes:v,pusherKey:w=C.pusherKey})=>Promise.resolve(si(w)).then(()=>He(r,{publicKey:t,fileName:e,baseURL:i,checkForUrlDuplicates:n,saveUrlForRecurrentUploads:o,secureSignature:l,secureExpire:a,store:u,signal:p,source:b,integration:f,userAgent:g,retryThrottledRequestMaxTimes:v})).catch(m=>{let x=kt(w);return x==null||x.disconnect(),Promise.reject(m)}).then(m=>m.type===At.FileInfo?m:ti([({signal:x})=>ri({token:m.token,publicKey:t,baseURL:i,integration:f,userAgent:g,retryThrottledRequestMaxTimes:v,onProgress:h,signal:x}),({signal:x})=>ni({token:m.token,pusherKey:w,signal:x,onProgress:h})],{signal:p})).then(m=>{if(m instanceof T)throw m;return m}).then(m=>Tt({file:m.uuid,publicKey:t,baseURL:i,integration:f,userAgent:g,retryThrottledRequestMaxTimes:v,onProgress:h,signal:p})).then(m=>new M(m,{baseCDN:s})),ai=(r,{publicKey:t,fileName:e,baseURL:i,signal:s,onProgress:n,source:o,integration:l,userAgent:a,retryThrottledRequestMaxTimes:u,baseCDN:p})=>Yt(r,{publicKey:t,baseURL:i,signal:s,source:o,integration:l,userAgent:a,retryThrottledRequestMaxTimes:u}).then(h=>new M(h,{baseCDN:p,fileName:e})).then(h=>(n&&n({value:1}),h)),St=r=>r!==void 0&&(typeof Blob!="undefined"&&r instanceof Blob||typeof File!="undefined"&&r instanceof File||typeof Buffer!="undefined"&&r instanceof Buffer),li=r=>{let t="[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}",e=new RegExp(t);return !St(r)&&e.test(r)},ci=r=>{let t="^(?:\\w+:)?\\/\\/([^\\s\\.]+\\.\\S{2}|localhost[\\:?\\d]*)\\S*$",e=new RegExp(t);return !St(r)&&e.test(r)},ee=r=>r.length||r.size,ui=(r,t=C.multipartMinFileSize)=>r>=t,di=(r,t,e,i)=>{let s=i*t,n=Math.min(s+i,e);return r.slice(s,n)};function hi(r,t,e){return i=>di(r,i,t,e)}var pi=(r,t)=>new Promise((e,i)=>{let s=[],n=!1,o=t.length,l=[...t],a=()=>{let u=t.length-l.length,p=l.shift();p&&p().then(h=>{n||(s[u]=h,o-=1,o?a():e(s));}).catch(h=>{n=!0,i(h);});};for(let u=0;u<r;u++)a();}),mi=(r,t,{publicKey:e,onProgress:i,signal:s,integration:n,multipartMaxAttempts:o})=>Zt(({attempt:l,retry:a})=>Je(r,t,{publicKey:e,onProgress:i,signal:s,integration:n}).catch(u=>{if(l<o)return a();throw u})),fi=(r,{publicKey:t,fileName:e,fileSize:i,baseURL:s,secureSignature:n,secureExpire:o,store:l,signal:a,onProgress:u,source:p,integration:h,userAgent:b,retryThrottledRequestMaxTimes:f,contentType:g,multipartChunkSize:v=C.multipartChunkSize,maxConcurrentRequests:w=C.maxConcurrentRequests,multipartMaxAttempts:m=C.multipartMaxAttempts,baseCDN:x})=>{let O=i||ee(r),j,bt=(S,Z)=>{if(!u)return;j||(j=Array(S).fill(0));let vt=z=>z.reduce((Y,be)=>Y+be,0);return ({value:z})=>{j[Z]=z,u({value:vt(j)/S});}};return qe(O,{publicKey:t,contentType:g,fileName:e!=null?e:r.name,baseURL:s,secureSignature:n,secureExpire:o,store:l,signal:a,source:p,integration:h,userAgent:b,retryThrottledRequestMaxTimes:f}).then(({uuid:S,parts:Z})=>{let vt=hi(r,O,v);return Promise.all([S,pi(w,Z.map((z,Y)=>()=>mi(vt(Y),z,{publicKey:t,onProgress:bt(Z.length,Y),signal:a,integration:h,multipartMaxAttempts:m})))])}).then(([S])=>Ze(S,{publicKey:t,baseURL:s,source:p,integration:h,userAgent:b,retryThrottledRequestMaxTimes:f})).then(S=>S.isReady?S:Tt({file:S.uuid,publicKey:t,baseURL:s,source:p,integration:h,userAgent:b,retryThrottledRequestMaxTimes:f,onProgress:u,signal:a})).then(S=>new M(S,{baseCDN:x}))};function ie(r,{publicKey:t,fileName:e,baseURL:i=C.baseURL,secureSignature:s,secureExpire:n,store:o,signal:l,onProgress:a,source:u,integration:p,userAgent:h,retryThrottledRequestMaxTimes:b,contentType:f,multipartChunkSize:g,multipartMaxAttempts:v,maxConcurrentRequests:w,baseCDN:m=C.baseCDN,checkForUrlDuplicates:x,saveUrlForRecurrentUploads:O,pusherKey:j}){if(St(r)){let bt=ee(r);return ui(bt)?fi(r,{publicKey:t,contentType:f,multipartChunkSize:g,multipartMaxAttempts:v,fileName:e,baseURL:i,secureSignature:s,secureExpire:n,store:o,signal:l,onProgress:a,source:u,integration:p,userAgent:h,maxConcurrentRequests:w,retryThrottledRequestMaxTimes:b,baseCDN:m}):Ke(r,{publicKey:t,fileName:e,baseURL:i,secureSignature:s,secureExpire:n,store:o,signal:l,onProgress:a,source:u,integration:p,userAgent:h,retryThrottledRequestMaxTimes:b,baseCDN:m})}if(ci(r))return oi(r,{publicKey:t,fileName:e,baseURL:i,baseCDN:m,checkForUrlDuplicates:x,saveUrlForRecurrentUploads:O,secureSignature:s,secureExpire:n,store:o,signal:l,onProgress:a,source:u,integration:p,userAgent:h,retryThrottledRequestMaxTimes:b,pusherKey:j});if(li(r))return ai(r,{publicKey:t,fileName:e,baseURL:i,signal:l,onProgress:a,source:u,integration:p,userAgent:h,retryThrottledRequestMaxTimes:b,baseCDN:m});throw new TypeError(`File uploading from "${r}" is not supported`)}var se=Object.freeze({file:{type:File,value:null},externalUrl:{type:String,value:null},fileName:{type:String,value:null},fileSize:{type:Number,value:null},lastModified:{type:Number,value:Date.now()},uploadProgress:{type:Number,value:0},uuid:{type:String,value:null},isImage:{type:Boolean,value:!1},mimeType:{type:String,value:null},uploadErrorMsg:{type:String,value:null},validationErrorMsg:{type:String,value:null},ctxName:{type:String,value:null},transformationsUrl:{type:String,value:null},fileInfo:{type:M,value:null}});var re="active",ne="uc-",gi="css-src",$t=document.readyState==="complete";$t||window.addEventListener("load",()=>{$t=!0;});var c=class extends I{l10n(t){return this.getCssData("--l10n-"+t,!0)||t}constructor(){super();this.activityType=null,this.addTemplateProcessor(Wt),this.__l10nKeys=[],this.__l10nUpdate=()=>{this.dropCssDataCache();for(let t of this.__l10nKeys)this.notify(t);},window.addEventListener("uc-l10n-update",this.__l10nUpdate);}applyL10nKey(t,e){this.$["l10n:"+t]=e;}historyBack(){let t=this.$["*history"];t.pop();let e=t.pop();this.$["*currentActivity"]=e,t.length>10&&(t=t.slice(t.length-11,t.length-1)),this.$["*history"]=t;}addFiles(t){t.forEach(e=>{this.uploadCollection.add({file:e,isImage:e.type.includes("image"),mimeType:e.type,fileName:e.name,fileSize:e.size});});}openSystemDialog(){this.fileInput=document.createElement("input"),this.fileInput.type="file",this.fileInput.multiple=!!this.cfg("multiple"),this.fileInput.max=this.cfg("max-files"),this.fileInput.accept=this.cfg("accept"),this.fileInput.dispatchEvent(new MouseEvent("click")),this.fileInput.onchange=()=>{this.addFiles([...this.fileInput.files]),this.$["*currentActivity"]=c.activities.UPLOAD_LIST,this.cfg("confirm-upload")||(this.$["*currentActivity"]=""),this.fileInput.value="",this.fileInput=null;};}connectedCallback(){let t=()=>{$t?this.connected():window.addEventListener("load",()=>{this.connected();});},e=this.getAttribute(gi);if(e){this.renderShadow=!0,this.attachShadow({mode:"open"});let i=document.createElement("link");i.rel="stylesheet",i.type="text/css",i.href=e,i.onload=()=>{window.requestAnimationFrame(()=>{t();});},this.shadowRoot.appendChild(i);}else t();}connected(){this.__connectedOnce?super.connectedCallback():(c._ctxConnectionsList.includes(this.ctxName)||(this.add$({"*currentActivity":"","*currentActivityParams":{},"*history":[],"*commonProgress":0,"*uploadList":[],"*outputData":null}),c._ctxConnectionsList.push(this.ctxName)),super.connectedCallback(),this.activityType&&(this.hasAttribute("activity")||this.setAttribute("activity",this.activityType),this.sub("*currentActivity",t=>{var i,s;let e=t?this.ctxName+t:"";if(!t||this.activityType!==t)this.removeAttribute(re);else {let n=this.$["*history"];t&&n[n.length-1]!==t&&n.push(t),this.setAttribute(re,"");let o=c._activityRegistry[e];if(o&&((i=o.activateCallback)==null||i.call(o),c._lastActivity)){let l=c._activityRegistry[c._lastActivity];l&&((s=l.deactivateCallback)==null||s.call(l));}}c._lastActivity=e;})),this.__connectedOnce=!0);}get doneActivity(){return this.getAttribute("done-activity")}get cancelActivity(){return this.getAttribute("cancel-activity")}registerActivity(t,e,i){c._activityRegistry||(c._activityRegistry=Object.create(null));let s=this.ctxName+t;c._activityRegistry[s]={activateCallback:e,deactivateCallback:i};}get activityParams(){return this.$["*currentActivityParams"]}get uploadCollection(){if(!this.has("*uploadCollection")){let t=new _t({typedSchema:se,watchList:["uploadProgress","uuid"],handler:e=>{this.$["*uploadList"]=e;}});t.observe(e=>{if(e.uploadProgress){let i=0,s=t.findItems(n=>!n.getValue("uploadErrorMsg"));s.forEach(n=>{i+=t.readProp(n,"uploadProgress");}),this.$["*commonProgress"]=i/s.length;}}),this.add("*uploadCollection",t);}return this.$["*uploadCollection"]}cfg(t){return this.getCssData("--cfg-"+t,!0)}fileSizeFmt(t,e=2){let i=["B","KB","MB","GB","TB"],s=a=>this.getCssData("--l10n-unit-"+a.toLowerCase(),!0)||a;if(t===0)return `0 ${s(i[0])}`;let n=1024,o=e<0?0:e,l=Math.floor(Math.log(t)/Math.log(n));return parseFloat((t/n**l).toFixed(o))+" "+s(i[l])}output(){let t=[];this.uploadCollection.items().forEach(i=>{let n=y.getNamedCtx(i).store.fileInfo;t.push(n);}),this.$["*outputData"]=t;}destroyCallback(){window.removeEventListener("uc-l10n-update",this.__l10nUpdate),this.__l10nKeys=null;}static reg(t){super.reg(t.startsWith(ne)?t:ne+t);}};c._activityRegistry=Object.create(null);c._lastActivity="";c._ctxConnectionsList=[];c.activities=Object.freeze({SOURCE_SELECT:"source-select",CAMERA:"camera",DRAW:"draw",UPLOAD_LIST:"upload-list",URL:"url",CONFIRMATION:"confirmation",CLOUD_IMG_EDIT:"cloud-image-edit",EXTERNAL:"external",DETAILS:"details"});c.extSrcList=Object.freeze({FACEBOOK:"facebook",DROPBOX:"dropbox",GDRIVE:"gdrive",GPHOTOS:"gphotos",INSTAGRAM:"instagram",FLICKR:"flickr",VK:"vk",EVERNOTE:"evernote",BOX:"box",ONEDRIVE:"onedrive",HUDDLE:"huddle"});c.sourceTypes=Object.freeze({LOCAL:"local",URL:"url",CAMERA:"camera",DRAW:"draw",...c.extSrcList});var G=class extends c{constructor(){super(...arguments);d(this,"init$",{path:""});}initCallback(){this.defineAccessor("name",t=>{!t||(this.$.path=this.getCssData(`--icon-${t}`));});}};G.template=`<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path set="@d: path"></path></svg>`;G.bindAttributes({name:null});var tt=class extends c{constructor(){super(...arguments);d(this,"init$",{"*simpleButtonText":""});}initCallback(){this.$["*simpleButtonText"]=this.cfg("multiple")?this.l10n("upload-files"):this.l10n("upload-file"),this.onclick=()=>{var t;this.$["*modalActive"]=!0,((t=this.$["*uploadList"])==null?void 0:t.length)?this.set$({"*currentActivity":c.activities.UPLOAD_LIST}):this.set$({"*currentActivity":c.activities.SOURCE_SELECT});};}};tt.template=`<button><uc-icon name="upload"></uc-icon><span set="textContent: *simpleButtonText"></span><slot></slot></button>`;var It=class extends c{constructor(){super(...arguments);d(this,"activityType","source-select");}initCallback(){this.registerActivity(this.activityType,()=>{this.set$({"*modalCaption":this.l10n("select-file-source"),"*modalIcon":"default"});});}};function bi(r){return new Promise(t=>{typeof window.FileReader!="function"&&t(!1);try{let e=new FileReader;e.onerror=()=>{t(!0);};let i=s=>{s.type!=="loadend"&&e.abort(),t(!1);};e.onloadend=i,e.onprogress=i,e.readAsDataURL(r);}catch(e){t(!1);}})}function vi(r){return new Promise((t,e)=>{let i=0,s=[],n=l=>{l||(console.warn("Unexpectedly received empty content entry",{scope:"drag-and-drop"}),t(null)),l.isFile?(i++,l.file(a=>{i--,s.push(a),i===0&&t(s);})):l.isDirectory&&o(l.createReader());},o=l=>{i++,l.readEntries(a=>{i--;for(let u of a)n(u);i===0&&t(s);});};n(r);})}function oe(r){let t=[],e=[];for(let i=0;i<r.items.length;i++){let s=r.items[i];if(s&&s.kind==="file"){if(typeof s.webkitGetAsEntry=="function"||typeof s.getAsEntry=="function"){let o=typeof s.webkitGetAsEntry=="function"?s.webkitGetAsEntry():s.getAsEntry();e.push(vi(o).then(l=>{t.push(...l);}));continue}let n=s.getAsFile();e.push(bi(n).then(o=>{o||t.push(n);}));}}return Promise.all(e).then(()=>t)}var k={ACTIVE:0,INACTIVE:1,NEAR:2,OVER:3},Ut=["dragleave","dragexit","dragend","drop","mouseleave","mouseout"],yi=100,Lt=new Map;function _i(r,t){let e=Math.max(Math.min(r[0],t.x+t.width),t.x),i=Math.max(Math.min(r[1],t.y+t.height),t.y);return Math.sqrt((r[0]-e)*(r[0]-e)+(r[1]-i)*(r[1]-i))}function ae(r){let t=new Set,e=a=>t.add(a),i=k.INACTIVE,s=a=>{i!==a&&t.forEach(u=>u(a)),i=a;},n=a=>{let{clientX:u,clientY:p}=a,h=document.body.getBoundingClientRect(),b=a.type==="drop",f=["dragleave","dragexit","dragend"].includes(a.type)&&u===0&&p===0,g=["mouseleave","mouseout"].includes(a.type)&&(u<0||u>h.width||p<0||p>h.height);(b||f||g)&&s(k.INACTIVE),a.preventDefault();};e(a=>r.onChange(a)),e(a=>{a===k.ACTIVE&&Ut.forEach(u=>{window.addEventListener(u,n,!1);});}),e(a=>{a===k.INACTIVE&&Ut.forEach(u=>{window.removeEventListener(u,n,!1);});});let o=a=>{a.preventDefault(),i===k.INACTIVE&&s(k.ACTIVE);let u=[a.x,a.y],p=r.element.getBoundingClientRect(),h=Math.floor(_i(u,p)),b=h<yi,f=a.composedPath().includes(r.element);Lt.set(r.element,h);let g=Math.min(...Lt.values())===h;s(f&&g?k.OVER:b&&g?k.NEAR:k.ACTIVE);};window.addEventListener("dragover",o,!1);let l=async a=>{a.preventDefault();let u=await oe(a.dataTransfer);r.onFiles(u),s(k.INACTIVE);};return r.element.addEventListener("drop",l),()=>{Lt.delete(r.element),window.removeEventListener("dragover",o,!1),r.element.removeEventListener("drop",l),Ut.forEach(a=>{window.removeEventListener(a,n,!1);});}}var Rt=class extends c{constructor(){super(...arguments);d(this,"init$",{state:k.INACTIVE});}initCallback(){this._destroyDropzone=ae({element:this,onChange:t=>{this.$.state=t;},onFiles:t=>{t.forEach(e=>{this.uploadCollection.add({file:e,isImage:e.type.includes("image"),mimeType:e.type,fileName:e.name,fileSize:e.size});}),this.set$({"*currentActivity":c.activities.UPLOAD_LIST});}}),this.sub("state",t=>{var i;let e=(i=Object.entries(k).find(([,s])=>s===t))==null?void 0:i[0].toLowerCase();e&&this.setAttribute("drag-state",e);});}destroyCallback(){var t;(t=this._destroyDropzone)==null||t.call(this);}};var Ci="src-type-",W=class extends c{constructor(){super(...arguments);d(this,"_registeredTypes",{});d(this,"init$",{iconName:"default"});}initTypes(){this.registerType({type:c.sourceTypes.LOCAL,onClick:()=>{this.openSystemDialog();}}),this.registerType({type:c.sourceTypes.URL,activity:c.activities.URL,textKey:"from-url"}),this.registerType({type:c.sourceTypes.CAMERA,activity:c.activities.CAMERA}),this.registerType({type:"draw",activity:c.activities.DRAW,icon:"edit-draw"});for(let t of Object.values(c.extSrcList))this.registerType({type:t,activity:c.activities.EXTERNAL,activityParams:{externalSourceType:t}});}initCallback(){this.initTypes(),this.setAttribute("role","button"),this.defineAccessor("type",t=>{!t||this.applyType(t);});}registerType(t){this._registeredTypes[t.type]=t;}getType(t){return this._registeredTypes[t]}applyType(t){let e=this._registeredTypes[t],{textKey:i=t,icon:s=t,activity:n,onClick:o,activityParams:l={}}=e;this.applyL10nKey("src-type",`${Ci}${i}`),this.$.iconName=s,this.onclick=a=>{n&&this.set$({"*currentActivityParams":l,"*currentActivity":n}),o&&o(a);};}};W.template=`<uc-icon set="@name: iconName"></uc-icon><div class="txt" l10n="src-type"></div>`;W.bindAttributes({type:null});var Bt=class extends c{initCallback(){let t=this.cfg("source-list");if(!t)return;let e=t.split(",").map(s=>s.trim()),i="";e.forEach(s=>{i+=`<uc-source-btn type="${s}"></uc-source-btn>`;}),this.hasAttribute("wrap")?this.innerHTML=i:this.outerHTML=i;}};function le(r,t=40){let e=document.createElement("canvas"),i=e.getContext("2d"),s=new Image,n=new Promise((o,l)=>{s.onload=()=>{let a=s.height/s.width;a>1?(e.width=t,e.height=t*a):(e.height=t,e.width=t/a),i.fillStyle="rgb(240, 240, 240)",i.fillRect(0,0,e.width,e.height),i.drawImage(s,0,0,e.width,e.height),e.toBlob(u=>{let p=URL.createObjectURL(u);o(p);},"image/png");},s.onerror=a=>{console.warn("Resize error..."),l(a);};});return s.src=URL.createObjectURL(r),n}var Mt=class{constructor(){d(this,"caption","");d(this,"text","");d(this,"iconName","");d(this,"isError",!1);}},et=class extends c{constructor(){super(...arguments);d(this,"init$",{iconName:"info",captionTxt:"Message caption",msgTxt:"Message...","*message":null,onClose:()=>{this.$["*message"]=null;}});}initCallback(){this.sub("*message",t=>{t?(this.setAttribute("active",""),this.set$({captionTxt:t.caption,msgTxt:t.text,iconName:t.isError?"error":"info"}),t.isError?this.setAttribute("error",""):this.removeAttribute("error")):this.removeAttribute("active");});}};et.template=`<div class="heading"><uc-icon set="@name: iconName"></uc-icon><div class="caption" set="textContent: captionTxt"></div><button set="onclick: onClose"><uc-icon name="close"></uc-icon></button></div><div class="msg" set="textContent: msgTxt"></div>`;function Ot(r){let t=new Blob([r],{type:"image/svg+xml"});return URL.createObjectURL(t)}function ce(r="#fff",t="rgba(0, 0, 0, .1)"){return Ot(`<svg height="20" width="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="20" height="20" fill="${r}" /><rect x="0" y="0" width="10" height="10" fill="${t}" /><rect x="10" y="10" width="10" height="10" fill="${t}" /></svg>`)}function ue(r="rgba(0, 0, 0, .1)"){return Ot(`<svg height="10" width="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="10" x2="10" y2="0" stroke="${r}" /></svg>`)}function it(r="hsl(0, 0%, 100%)",t=36,e=36){return Ot(`<svg width="${t}" height="${e}" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 28L25.5 27.9997V29.0024L10.5 29.0027V28Z" fill="black" fill-opacity="0.06"/><path d="M9.5 7.50029L21.25 7.5L26.5 12.75V28.4998L9.5 28.5001V7.50029Z" fill="black" fill-opacity="0.06"/><path d="M10 8.00298L21 8.00269L26 12.9998V28.0025L10 28.0027V8.00298Z" fill="${r}"/><path d="M10 8.00298L21 8.00269L26 12.9998V28.0025L10 28.0027V8.00298Z" fill="url(#paint0_linear_2735_2136)"/><path fill-rule="evenodd" clip-rule="evenodd" d="M20.793 8.50269L10.5 8.50296V27.5027L25.5 27.5025V13.2069L20.793 8.50269ZM21 8.00269L10 8.00298V28.0027L26 28.0025V12.9998L21 8.00269Z" fill="url(#paint1_radial_2735_2136)"/><path d="M21 8L26 13V14H20V8H21Z" fill="black" fill-opacity="0.03"/><path d="M21 8L26 13V13.5H20.5V8H21Z" fill="black" fill-opacity="0.08"/><path d="M21 8L26 13H21V8Z" fill="${r}"/><path d="M21 8L26 13H21V8Z" fill="url(#paint2_linear_2735_2136)"/><path d="M21 8L26 13H21V8Z" fill="url(#paint3_linear_2735_2136)"/><path d="M21.5 8.5L21 8V13H26L25.5 12.5H21.5V8.5Z" fill="url(#paint4_linear_2735_2136)"/><defs><linearGradient id="paint0_linear_2735_2136" x1="18" y1="8" x2="18" y2="28.0027" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0.06"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient><radialGradient id="paint1_radial_2735_2136" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(10 11) rotate(53.7462) scale(18.6011 18.0323)"><stop stop-color="white" stop-opacity="0.12"/><stop offset="1" stop-color="white" stop-opacity="0"/></radialGradient><linearGradient id="paint2_linear_2735_2136" x1="21" y1="13" x2="23.5" y2="10.5" gradientUnits="userSpaceOnUse"><stop offset="0.40625" stop-opacity="0"/><stop offset="1" stop-opacity="0.04"/></linearGradient><linearGradient id="paint3_linear_2735_2136" x1="21" y1="13" x2="23.5" y2="10.5" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0.16"/><stop offset="1" stop-color="white" stop-opacity="0.06"/></linearGradient><linearGradient id="paint4_linear_2735_2136" x1="21" y1="13" x2="23.5" y2="10.5" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0.15"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient></defs></svg>`)}var $=class extends c{constructor(){super(...arguments);d(this,"pauseRender",!0);d(this,"init$",{itemName:"",thumb:"",thumbUrl:"",progressWidth:0,progressOpacity:1,notImage:!0,badgeIcon:"check","*focusedEntry":null,"*uploadTrigger":null,onEdit:()=>{this.set$({"*focusedEntry":this.entry,"*currentActivity":c.activities.DETAILS});},onRemove:()=>{this.uploadCollection.remove(this.uid);},onUpload:()=>{this.upload();}});}_observerCallback(t){let[e]=t;e.intersectionRatio===0?(clearTimeout(this._thumbTimeoutId),this._thumbTimeoutId=void 0):this._thumbTimeoutId||(this._thumbTimeoutId=setTimeout(()=>this._generateThumbnail(),100));}_generateThumbnail(){var t;if(!this.$.thumbUrl)if((t=this.file)==null?void 0:t.type.includes("image"))le(this.file,this.cfg("thumb-size")||76).then(e=>{this.$.thumbUrl=`url(${e})`;});else {let e=window.getComputedStyle(this).getPropertyValue("--clr-generic-file-icon");this.$.thumbUrl=`url(${it(e)})`;}}_revokeThumbUrl(){var t;((t=this.$.thumbUrl)==null?void 0:t.startsWith("blob:"))&&URL.revokeObjectURL(this.$.thumbUrl);}initCallback(){this.defineAccessor("entry-id",t=>{var e;!t||(this.uid=t,this.entry=(e=this.uploadCollection)==null?void 0:e.read(t),this.entry.subscribe("fileName",i=>{this.$.itemName=i||this.externalUrl||this.l10n("file-no-name");}),this.entry.subscribe("externalUrl",i=>{this.$.itemName=this.entry.getValue("fileName")||i||this.l10n("file-no-name");}),this.entry.subscribe("uuid",i=>{if(!!i&&(this._observer.unobserve(this),this.setAttribute("loaded",""),this.entry.getValue("isImage"))){let s=`https://ucarecdn.com/${i}/`;this._revokeThumbUrl();let n=this.cfg("thumb-size")||76;this.$.thumbUrl=`url(${s}-/scale_crop/${n}x${n}/center/)`;}}),this.entry.subscribe("transformationsUrl",i=>{if(!!i&&this.entry.getValue("isImage")){this._revokeThumbUrl();let s=this.cfg("thumb-size")||76;this.$.thumbUrl=`url(${i}-/scale_crop/${s}x${s}/center/)`;}}),this.file=this.entry.getValue("file"),this.externalUrl=this.entry.getValue("externalUrl"),this.cfg("confirm-upload")||this.upload(),this._observer=new window.IntersectionObserver(this._observerCallback.bind(this),{root:this.parentElement,rootMargin:"50% 0px 50% 0px",threshold:[0,1]}),this._observer.observe(this));}),this.$["*uploadTrigger"]=null,$.activeInstances.add(this),this.sub("*uploadTrigger",t=>{!t||!this.isConnected||this.upload();}),this.onclick=()=>{$.activeInstances.forEach(t=>{t===this?t.setAttribute("focused",""):t.removeAttribute("focused");});};}destroyCallback(){$.activeInstances.delete(this),this._observer.unobserve(this),clearTimeout(this._thumbTimeoutId);}async upload(){var i;if(this.hasAttribute("loaded")||this.entry.getValue("uuid"))return;this.$.progressWidth=0,this.$.progressOpacity=1,this.removeAttribute("focused"),this.removeAttribute("error"),this.setAttribute("uploading","");let t={},e=this.cfg("store");e!==null&&(t.store=!!e);try{let s=await ie(this.file||this.externalUrl,{...t,publicKey:this.cfg("pubkey"),onProgress:n=>{let o=n.value*100;this.$.progressWidth=o+"%",this.entry.setValue("uploadProgress",o);}});this.$.progressOpacity=0,this.setAttribute("loaded",""),this.removeAttribute("uploading"),this.$.badgeIcon="badge-success",this.entry.setMultipleValues({fileInfo:s,uploadProgress:100,fileName:s.name,fileSize:s.size,isImage:s.isImage,mimeType:s.mimeType,uuid:s.uuid});}catch(s){this.$.progressOpacity=0,this.$.progressWidth=0,this.setAttribute("error",""),this.removeAttribute("uploading");let n=new Mt;n.caption=this.l10n("upload-error")+": "+(((i=this.file)==null?void 0:i.name)||this.externalUrl),n.text=s,n.isError=!0,this.set$({badgeIcon:"badge-error","*message":n}),this.entry.setValue("uploadErrorMsg",s);}}};$.template=`<div class="thumb" set="style.backgroundImage: thumbUrl"><div class="badge"><uc-icon set="@name: badgeIcon"></uc-icon></div></div><div class="file-name-wrapper"><span class="file-name" set="textContent: itemName; @title: itemName"></span></div><button class="edit-btn" set="onclick: onEdit;"><uc-icon name="edit-file"></uc-icon></button><button class="remove-btn" set="onclick: onRemove;"><uc-icon name="remove-file"></uc-icon></button><button class="upload-btn" set="onclick: onUpload;"><uc-icon name="upload"></uc-icon></button><div class="progress" set="style.width: progressWidth; style.opacity: progressOpacity"></div>`;$.activeInstances=new Set;$.bindAttributes({"entry-id":null});var st=class extends c{constructor(){super(...arguments);d(this,"init$",{"*modalActive":!1,"*modalHeaderHidden":!1,closeClicked:()=>{this.$["*modalActive"]=!1;}});}initCallback(){this.sub("*modalActive",t=>{t?this.setAttribute("active",""):this.removeAttribute("active"),t&&this.hasAttribute("block-body-scrolling")?document.body.style.overflow="hidden":document.body.style.overflow=null;}),this.hasAttribute("strokes")&&(this.style.backgroundImage=`url(${ue()})`);}};st.template=`<div class="dialog"><div class="heading" set="@hidden: *modalHeaderHidden"><slot name="heading"></slot><button class="close-btn" set="onclick: closeClicked"><uc-icon name="close"></uc-icon></button></div><div class="content"><slot></slot></div></div>`;var rt=class{constructor(){d(this,"captionL10nStr","confirm-your-action");d(this,"messageL10Str","are-you-sure");d(this,"confirmL10nStr","yes");d(this,"denyL10nStr","no");}confirmAction(){console.log("Confirmed");}denyAction(){this.historyBack();}},nt=class extends c{constructor(){super(...arguments);d(this,"activityType",c.activities.CONFIRMATION);d(this,"_defaults",new rt);d(this,"init$",{messageTxt:"",confirmBtnTxt:"",denyBtnTxt:"","*confirmation":null,onConfirm:this._defaults.confirmAction,onDeny:this._defaults.denyAction.bind(this)});}initCallback(){super.initCallback(),this.set$({messageTxt:this.l10n(this._defaults.messageL10Str),confirmBtnTxt:this.l10n(this._defaults.confirmL10nStr),denyBtnTxt:this.l10n(this._defaults.denyL10nStr)}),this.sub("*confirmation",t=>{!t||this.set$({"*modalHeaderHidden":!0,"*currentActivity":c.activities.CONFIRMATION,"*modalCaption":this.l10n(t.captionL10nStr),messageTxt:this.l10n(t.messageL10Str),confirmBtnTxt:this.l10n(t.confirmL10nStr),denyBtnTxt:this.l10n(t.denyL10nStr),onDeny:()=>{this.$["*modalHeaderHidden"]=!1,t.denyAction();},onConfirm:()=>{this.$["*modalHeaderHidden"]=!1,t.confirmAction();}});});}};nt.template=`<div class="message" set="textContent: messageTxt"></div><div class="toolbar"><button class="deny-btn secondary-btn" set="textContent: denyBtnTxt; onclick: onDeny"></button><button class="confirm-btn primary-btn" set="textContent: confirmBtnTxt; onclick: onConfirm"></button></div>`;var ot=class extends c{constructor(){super(...arguments);d(this,"activityType",c.activities.UPLOAD_LIST);d(this,"init$",{doneBtnHidden:!0,uploadBtnHidden:!1,uploadBtnDisabled:!1,hasFiles:!1,moreBtnDisabled:!0,onAdd:()=>{this.$["*currentActivity"]=c.activities.SOURCE_SELECT;},onUpload:()=>{this.set$({"*uploadTrigger":{}});},onDone:()=>{this.set$({"*currentActivity":this.doneActivity||"","*modalActive":!1}),this.output();},onCancel:()=>{let t=new rt;t.confirmAction=()=>{this.set$({"*currentActivity":this.cancelActivity||"","*modalActive":!1}),this.uploadCollection.clearAll(),this.output();},t.denyAction=()=>{this.historyBack();},this.$["*confirmation"]=t;}});d(this,"_renderMap",Object.create(null));}initCallback(){this.registerActivity(this.activityType,()=>{this.set$({"*modalCaption":this.l10n("selected"),"*modalIcon":"local"});}),this.$.moreBtnDisabled=!this.cfg("multiple"),this.uploadCollection.observe(()=>{let t=this.uploadCollection.findItems(n=>!n.getValue("uuid")),e=this.uploadCollection.findItems(n=>!n.getValue("uuid")&&n.getValue("uploadProgress")>0),i=t.length===0,s=e.length>0;this.set$({uploadBtnHidden:i,uploadBtnDisabled:s,doneBtnHidden:!i}),!this.cfg("confirm-upload")&&i&&this.$.onDone();}),this.sub("*uploadList",t=>{if(t&&t.length===0&&!this.cfg("show-empty-list")){this.$["*currentActivity"]=c.activities.SOURCE_SELECT;return}this.set$({uploadBtnDisabled:!t.length,hasFiles:t.length>0}),t.forEach(i=>{if(!this._renderMap[i]){let s=new $;this._renderMap[i]=s;}});for(let i in this._renderMap)t.includes(i)||(this._renderMap[i].remove(),delete this._renderMap[i]);let e=document.createDocumentFragment();Object.values(this._renderMap).forEach(i=>e.appendChild(i)),this.ref.files.replaceChildren(e),Object.entries(this._renderMap).forEach(([i,s])=>{setTimeout(()=>{s["entry-id"]=i,s.render();});});});}};ot.template=`<div class="no-files" set="@hidden: hasFiles"><slot name="empty"><span l10n="no-files"></span></slot></div><div class="files" ref="files"></div><div class="toolbar"><button class="cancel-btn secondary-btn" set="onclick: onCancel;" l10n="clear"></button><div></div><button class="add-more-btn secondary-btn" set="onclick: onAdd; @disabled: moreBtnDisabled" l10n="add-more"></button><button class="upload-btn primary-btn" set="@hidden: uploadBtnHidden; onclick: onUpload; @disabled: uploadBtnDisabled" l10n="upload"></button><button class="done-btn primary-btn" set="@hidden: doneBtnHidden; onclick: onDone" l10n="done"></button></div>`;var at=class extends c{constructor(){super(...arguments);d(this,"activityType",c.activities.URL);d(this,"init$",{onUpload:()=>{let t=this.ref.input.value;this.uploadCollection.add({externalUrl:t}),this.$["*currentActivity"]=c.activities.UPLOAD_LIST;},onCancel:()=>{this.set$({"*currentActivity":c.activities.SOURCE_SELECT});}});}initCallback(){this.registerActivity(this.activityType,()=>{this.set$({"*modalCaption":this.l10n("caption-from-url"),"*modalIcon":"url"});});}};at.template=`<input placeholder="https://..." .url-input type="text" ref="input" /><button class="url-upload-btn primary-btn " set="onclick: onUpload"></button><button class="cancel-btn secondary-btn" set="onclick: onCancel" l10n="cancel"></button>`;var lt=class extends c{constructor(){super(...arguments);d(this,"activityType",c.activities.CAMERA);d(this,"init$",{video:null,videoTransformCss:null,onCancel:()=>{this.set$({"*currentActivity":c.activities.SOURCE_SELECT});},onShot:()=>{this._shot();}});}async _init(){let t={video:{width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:30}},audio:!1};this._canvas=document.createElement("canvas"),this._ctx=this._canvas.getContext("2d"),this._stream=await navigator.mediaDevices.getUserMedia(t),this.$.video=this._stream,this._initialized=!0;}_deInit(){var t;this._initialized&&((t=this._stream)==null||t.getTracks()[0].stop(),this.$.video=null,this._initialized=!1);}_shot(){this._canvas.height=this.ref.video.videoHeight,this._canvas.width=this.ref.video.videoWidth,this._ctx.drawImage(this.ref.video,0,0);let t=Date.now(),e=`camera-${t}.png`;this._canvas.toBlob(i=>{let s=new File([i],e,{lastModified:t,type:"image/png"});this.uploadCollection.add({file:s,fileName:e,fileSize:s.size,isImage:!0,mimeType:s.type}),this.set$({"*currentActivity":c.activities.UPLOAD_LIST});});}initCallback(){this.registerActivity(this.activityType,()=>{this.set$({videoTransformCss:this.cfg("camera-mirror")?"scaleX(-1)":null,"*modalCaption":this.l10n("caption-camera"),"*modalIcon":"camera"}),this._init();}),this.sub("*currentActivity",t=>{t!==this.activityType&&this._deInit();});}};lt.template=`<video autoplay playsinline set="srcObject: video; style.transform: videoTransformCss" ref="video"></video><div class="toolbar"><button class="cancel-btn secondary-btn" set="onclick: onCancel" l10n="cancel"></button><button class="shot-btn primary-btn" set="onclick: onShot" l10n="camera-shot"></button></div>`;var ct=class extends c{constructor(){super(...arguments);d(this,"activityType",c.activities.DETAILS);d(this,"init$",{checkerboard:!1,localImageEditDisabled:!0,fileSize:null,fileName:"",notUploaded:!0,cdnUrl:"",errorTxt:"",editBtnHidden:!0,onNameInput:null,"*focusedEntry":null,onBack:()=>{this.historyBack();},onRemove:()=>{this.uploadCollection.remove(this.entry.__ctxId),this.historyBack();},onEdit:()=>{this.entry.getValue("uuid")&&(this.$["*currentActivity"]=c.activities.CLOUD_IMG_EDIT);}});}showNonImageThumb(){let t=window.getComputedStyle(this).getPropertyValue("--clr-generic-file-icon"),e=it(t,108,108);this.eCanvas.setImageUrl(e),this.set$({checkerboard:!1});}initCallback(){this.$.localImageEditDisabled=!this.cfg("use-local-image-editor"),this.$.fileSize=this.l10n("file-size-unknown"),this.registerActivity(this.activityType,()=>{this.set$({"*modalCaption":this.l10n("caption-edit-file")});}),this.eCanvas=this.ref.canvas,this.sub("*focusedEntry",t=>{if(!t)return;this._entrySubs?this._entrySubs.forEach(s=>{this._entrySubs.delete(s),s.remove();}):this._entrySubs=new Set,this.entry=t;let e=t.getValue("file");if(this.eCanvas.clear(),e){this._file=e;let s=this._file.type.includes("image");s&&!t.getValue("transformationsUrl")&&(this.eCanvas.setImageFile(this._file),this.set$({checkerboard:!0,editBtnHidden:!this.cfg("use-local-image-editor")&&!this.cfg("use-cloud-image-editor")})),s||this.showNonImageThumb();}let i=(s,n)=>{this._entrySubs.add(this.entry.subscribe(s,n));};i("fileName",s=>{this.$.fileName=s,this.$.onNameInput=()=>{Object.defineProperty(this._file,"name",{writable:!0,value:this.ref.file_name_input.value});};}),i("fileSize",s=>{this.$.fileSize=Number.isFinite(s)?this.fileSizeFmt(s):this.l10n("file-size-unknown");}),i("uuid",s=>{s?(this.eCanvas.clear(),this.set$({cdnUrl:`https://ucarecdn.com/${s}/`,notUploaded:!1}),this.eCanvas.setImageUrl(this.$.cdnUrl)):this.$.cdnUrl="Not uploaded yet...";}),i("uploadErrorMsg",s=>{this.$.errorTxt=s;}),i("externalUrl",s=>{!s||this.entry.getValue("uuid")||this.showNonImageThumb();}),i("transformationsUrl",s=>{!s||this.entry.getValue("isImage")&&this.eCanvas.setImageUrl(s);});});}};ct.template=`<uc-tabs tab-list="tab-view, tab-details"><div tab-ctx="tab-details" class="details"><div class="info-block"><div class="info-block_name" l10n="file-name"></div><input name="name-input" ref="file_name_input" set="value: fileName; oninput: onNameInput" type="text" /></div><div class="info-block"><div class="info-block_name" l10n="file-size"></div><div set="textContent: fileSize"></div></div><div class="info-block"><div class="info-block_name" l10n="cdn-url"></div><a target="_blank" set="textContent: cdnUrl; @href: cdnUrl; @disabled: notUploaded"></a></div><div set="textContent: errorTxt;"></div></div><uc-editable-canvas tab-ctx="tab-view" set="@disabled: localImageEditDisabled; @checkerboard: checkerboard;" ref="canvas"></uc-editable-canvas></uc-tabs><div class="toolbar" set="@edit-disabled: editBtnHidden"><button class="edit-btn secondary-btn" set="onclick: onEdit; @hidden: editBtnHidden;"><uc-icon name="edit"></uc-icon><span l10n="edit-image"></span></button><button class="remove-btn secondary-btn" set="onclick: onRemove"><uc-icon name="remove"></uc-icon><span l10n="remove-from-list"></span></button><div></div><button class="back-btn primary-btn" set="onclick: onBack"><span l10n="done"></span></button></div>`;var ut=class extends c{constructor(){super(...arguments);d(this,"init$",{cssWidth:0,"*commonProgress":0});}initCallback(){this.sub("*commonProgress",t=>{t===0||t===100?this.removeAttribute("active"):this.setAttribute("active",""),this.$.cssWidth=t+"%";});}};ut.template=`<div class="bar" set="style.width: cssWidth"></div>`;var de="http://www.w3.org/2000/svg",V=class{_syncSvgSize(){let t=this.svgGroupEl.getBoundingClientRect();R(this.svgEl,{viewBox:`0, 0, ${t.width}, ${t.height}`,width:t.width,height:t.height});}_syncCanvas(){return new Promise((t,e)=>{let i=URL.createObjectURL(new Blob([this.svgEl.outerHTML],{type:"image/svg+xml"}));this.vImg.onload=()=>{this.can.height=this.vImg.height,this.can.width=this.vImg.width,this.ctx.drawImage(this.vImg,0,0,this.vImg.width,this.vImg.height),t();},this.vImg.onerror=()=>{e();},this.vImg.src=i;})}_backSyncSvg(){return this.svgGroupEl.style.transform=null,this.svgGroupEl.style.filter=null,R(this.svgEl,{viewBox:`0, 0, ${this.can.width}, ${this.can.height}`,width:this.can.width,height:this.can.height}),R(this.svgImgEl,{href:this.can.toDataURL("image/png"),width:this.can.width,height:this.can.height}),this._addedObjects.forEach(t=>{t.remove();}),new Promise((t,e)=>{this.svgImgEl.onload=()=>{t();},this.svgImgEl.onerror=()=>{e();};})}async _syncAll(){this._syncSvgSize(),await this._syncCanvas(),await this._backSyncSvg();}constructor(t){this.can=t.canvas,this.svgEl=t.svg,this.svgGroupEl=t.svgGroup,this.svgImgEl=t.svgImg,this.vImg=new Image,this.ctx=t.canvCtx,this.currentColor=V.defaultColor,this._addedObjects=new Set,window.setTimeout(()=>{this._backSyncSvg();},100);}applyCss(t){X(this.svgGroupEl,t);}getImg(){let t=new Image;return t.src=this.can.toDataURL("image/png"),new Promise((e,i)=>{t.onload=()=>{e(t);},t.onerror=()=>{i(t);};})}rotate(){this.applyCss({"transform-origin":"0 0",transform:`rotate(90deg) translateY(-${this.can.height}px)`}),this._syncAll();}flip(t){this.applyCss({"transform-origin":"50% 50%",transform:`scale(${t==="vertical"?"1, -1":"-1, 1"})`}),this._syncAll();}brightness(t){this.applyCss({filter:`brightness(${t}%)`});}contrast(t){this.applyCss({filter:`contrast(${t}%)`});}saturate(t){this.applyCss({filter:`saturate(${t}%)`});}setColor(t){this.currentColor=t;}startText(){let t=e=>{let i=document.createElementNS(de,"text");R(i,{fill:this.currentColor,x:e.offsetX,y:e.offsetY}),i.textContent="TEXT",this.svgGroupEl.appendChild(i),this._addedObjects.add(i),i.focus(),this.svgEl.removeEventListener("mousedown",t);};this.svgEl.addEventListener("mousedown",t);}stopText(){this.bake();}startDraw(){this.svgEl.addEventListener("mousedown",t=>{let e=document.createElementNS(de,"polyline");R(e,{fill:"none",stroke:this.currentColor,"stroke-width":"4px"}),this.svgGroupEl.appendChild(e),this._addedObjects.add(e);let i=[];this.svgEl.onmousemove=s=>{i.push(`${s.offsetX},${s.offsetY}`),e.setAttribute("points",i.join(" "));};}),window.addEventListener("mouseup",()=>{this.svgEl.onmousemove=null,this.bake();}),window.addEventListener("mouseleave",()=>{this.svgEl.onmousemove=null,this.bake();});}removeMode(t){}resize(){}crop(){}bake(){this._syncAll();}restore(){}};V.defaultColor="#f00";var dt=class extends c{constructor(){super(...arguments);d(this,"init$",{cssLeft:"50%",caption:"CAPTION",barActive:!1,"*rangeValue":100,onChange:()=>{this.$["*rangeValue"]=this.ref.range.value;}});}initCallback(){[...this.attributes].forEach(t=>{["style","ref"].includes(t.name)||this.ref.range.setAttribute(t.name,t.value);}),this.sub("*rangeValue",t=>{let e=t/this.ref.range.max*100;this.$.cssLeft=`${e}%`;});}};dt.template=`<datalist id="range-values"><option value="0" label="min"></option><option value="100" label="0"></option><option value="200" label="max"></option></datalist><div class="track"><div class="bar" set="style.width: cssLeft; @active: barActive"></div><div class="slider" set="style.left: cssLeft"></div><div class="center"></div><div class="caption" set="textContent: caption; @text: caption"></div></div><input type="range" ref="range" list="range-values" set="@value: *rangeValue; oninput: onChange">`;var ht=class extends c{constructor(){super(...arguments);d(this,"init$",{inputOpacity:0,"*selectedColor":"#f00",onChange:()=>{this.$["*selectedColor"]=this.ref.input.value;}});}};ht.template=`<input ref="input" type="color" set="oninput: onChange; style.opacity: inputOpacity"><div class="current-color" set="style.backgroundColor: *selectedColor"></div>`;var wi=[{action:"fullscreen",icon:"",l10n_name:"toggle-fullscreen",set:"@name: fsIcon"},{action:"rotate_cw",icon:"edit-rotate",l10n_name:"rotate",set:""},{action:"flip_v",icon:"edit-flip-v",l10n_name:"flip-vertical",set:""},{action:"flip_h",icon:"edit-flip-h",l10n_name:"flip-horizontal",set:""},{action:"brightness",icon:"edit-brightness",l10n_name:"brightness",set:""},{action:"contrast",icon:"edit-contrast",l10n_name:"contrast",set:""},{action:"saturation",icon:"edit-saturation",l10n_name:"saturation",set:""},{clr:!0},{action:"text",icon:"edit-text",l10n_name:"text",set:""},{action:"draw",icon:"edit-draw",l10n_name:"draw",set:""},{action:"cancel",icon:"close",l10n_name:"cancel-edit",set:""}];function xi(r){return `<button action="${r.action}" ref="${r.ref}" l10n="title:${r.l10n_name}"><uc-icon set="${r.set}" name="${r.icon}"></uc-icon></button>`.trim()}var Ai=`<uc-color ref="color" action="color" set="onchange: onColor" l10n="title:select-color"></uc-color>`;function he(){return wi.reduce((r,t)=>r+=t.clr?Ai:xi(t),"")}dt.reg("range");ht.reg("color");var jt={FS:"fullscreen",EXIT:"fullscreen-exit"},pt=class extends c{constructor(){super(...arguments);d(this,"init$",{fsIcon:jt.FS,rangeActive:!1,rangeCaption:"",onBtnClick:t=>{this.canMan.stopText(),this.rangeCtx=null,this.set$({rangeActive:!1,rangeCaption:"","*rangeValue":100});let e=t.target.closest("[action]");e&&(this.buttons.add(e),this.buttons.forEach(s=>{s===e?s.setAttribute("current",""):s.removeAttribute("current","");}));let i=e.getAttribute("action");console.log(i),!!i&&this.actionsMap[i]();}});d(this,"buttons",new Set);d(this,"editor",null);}get actionsMap(){return {fullscreen:()=>{document.fullscreenElement===this.rMap.parent?(document.exitFullscreen(),this.$.fsIcon=jt.FS):(this.rMap.parent.requestFullscreen(),this.$.fsIcon=jt.EXIT);},rotate_cw:()=>{this.canMan.rotate();},flip_v:()=>{this.canMan.flip("vertical");},flip_h:()=>{this.canMan.flip("horizontal");},brightness:()=>{this.rangeCtx="brightness",this.set$({rangeActive:!0,rangeCaption:this.l10n("brightness")});},contrast:()=>{this.rangeCtx="contrast",this.set$({rangeActive:!0,rangeCaption:this.l10n("contrast")});},saturation:()=>{this.rangeCtx="saturate",this.set$({rangeActive:!0,rangeCaption:this.l10n("saturation")});},resize:()=>{this.canMan.resize();},crop:()=>{this.canMan.crop();},color:()=>{this.ref.color.dispatchEvent(new MouseEvent("click"));},text:()=>{this.canMan.startText();},draw:()=>{this.canMan.startDraw();},cancel:()=>{this.canMan.restore();}}}initCallback(){this.defineAccessor("refMap",t=>{!t||(this.rMap=t,this.canMan=new V(t));}),this.sub("*rangeValue",t=>{var e,i;(i=(e=this.canMan)==null?void 0:e[this.rangeCtx])==null||i.call(e,t);}),this.sub("*selectedColor",t=>{var e;(e=this.canMan)==null||e.setColor(t);});}};pt.template=`<div class="btns" ref="btns" set="onclick: onBtnClick">${he()}</div><uc-range min="0" max="200" ref="range" set="@visible: rangeActive; $.caption: rangeCaption"></uc-range>`;pt.reg("editor-toolbar");var q=class extends c{constructor(){super();d(this,"init$",{refMap:null,disabled:!0,toolbarHidden:!0,checkerboard:!1});X(this,{display:"flex",justifyContent:"center",alignItems:"center"});}initCallback(){this.sub("disabled",()=>{this.$.toolbarHidden=this.hasAttribute("disabled")&&this.getAttribute("disabled")!=="false";}),this.sub("checkerboard",()=>{this.style.backgroundImage=this.hasAttribute("checkerboard")?`url(${ce()})`:"unset";}),this.canvas=this.ref.cvs,this.canvCtx=this.canvas.getContext("2d"),this.$.refMap={parent:this,canvas:this.canvas,canvCtx:this.canvCtx,svg:this.ref.svg,svgGroup:this.ref.svg_g,svgImg:this.ref.svg_img};}setImage(t){t.height&&t.width?(this.canvas.height=t.height,this.canvas.width=t.width,this.canvCtx.drawImage(t,0,0,t.width,t.height)):t.onload=()=>{this.canvas.height=t.height,this.canvas.width=t.width,this.canvCtx.drawImage(t,0,0,t.width,t.height);};}setImageFile(t){let e=new Image,i=URL.createObjectURL(t);e.src=i,this.setImage(e);}setImageUrl(t){let e=new Image;e.src=t,this.setImage(e);}clear(){this.canvCtx.clearRect(0,0,this.canvas.width,this.canvas.height);}};q.template=`<canvas class="img-view" ref="cvs"></canvas><svg class="img-view" xmlns="http://www.w3.org/2000/svg" ref="svg"><g ref="svg_g"><image ref="svg_img" x="0" y="0"></image></g></svg><uc-editor-toolbar set="refMap: refMap; @hidden: toolbarHidden"></uc-editor-toolbar>`;q.bindAttributes({disabled:"disabled",checkerboard:"checkerboard"});var Ti="https://ucarecdn.com/libs/editor/0.0.1-alpha.0.9/uploadcare-editor.js",Dt=class extends c{constructor(){super(...arguments);d(this,"activityType",c.activities.CLOUD_IMG_EDIT);d(this,"init$",{uuid:null});}loadScript(){let t=document.createElement("script");t.src=Ti,t.setAttribute("type","module"),document.body.appendChild(t);}initCallback(){this.style.display="flex",this.style.position="relative",this.loadScript(),this.sub("*currentActivity",t=>{t===c.activities.CLOUD_IMG_EDIT?this.mountEditor():this.unmountEditor();}),this.sub("*focusedEntry",t=>{!t||(this.entry=t,this.entry.subscribe("uuid",e=>{e&&(this.$.uuid=e);}));});}handleApply(t){let e=t.detail,{transformationsUrl:i}=e;this.entry.setValue("transformationsUrl",i),this.historyBack();}handleCancel(){this.historyBack();}mountEditor(){let t=window.customElements.get("uc-editor"),e=new t,i=this.$.uuid,s=this.cfg("pubkey");e.setAttribute("uuid",i),e.setAttribute("public-key",s),e.addEventListener("apply",n=>this.handleApply(n)),e.addEventListener("cancel",()=>this.handleCancel()),this.innerHTML="",this.style.width="600px",this.style.height="400px",this.appendChild(e);}unmountEditor(){this.style.width="0px",this.style.height="0px",this.innerHTML="";}};var L={};window.addEventListener("message",r=>{let t;try{t=JSON.parse(r.data);}catch(e){return}if((t==null?void 0:t.type)in L){let e=L[t.type];for(let[i,s]of e)r.source===i&&s(t);}});var pe=function(r,t,e){r in L||(L[r]=[]),L[r].push([t,e]);},me=function(r,t){r in L&&(L[r]=L[r].filter(e=>e[0]!==t));};var Ei=r=>Object.keys(r).reduce((e,i)=>{let s=r[i],n=Object.keys(s).reduce((o,l)=>{let a=s[l];return o+`${l}: ${a};`},"");return e+`${i}{${n}}`},"");function fe({textColor:r,backgroundColor:t,linkColor:e,linkColorHover:i,shadeColor:s}){let n=`solid 1px ${s}`;return Ei({body:{color:r,"background-color":t},".side-bar":{background:"inherit","border-right":n},".main-content":{background:"inherit"},".main-content-header":{background:"inherit"},".main-content-footer":{background:"inherit"},".list-table-row":{color:"inherit"},".list-table-row:hover":{background:s},".list-table-row .list-table-cell-a, .list-table-row .list-table-cell-b":{"border-top":n},".list-table-body .list-items":{"border-bottom":n},".bread-crumbs a":{color:e},".bread-crumbs a:hover":{color:i},".main-content.loading":{background:`${t} url(/static/images/loading_spinner.gif) center no-repeat`,"background-size":"25px 25px"},".list-icons-item":{background:`center no-repeat ${s}`},".source-gdrive .side-bar-menu a, .source-gphotos .side-bar-menu a":{color:e},".source-gdrive .side-bar-menu a, .source-gphotos .side-bar-menu a:hover":{color:i},".side-bar-menu a":{color:e},".side-bar-menu a:hover":{color:i},".source-gdrive .side-bar-menu .current, .source-gdrive .side-bar-menu a:hover, .source-gphotos .side-bar-menu .current, .source-gphotos .side-bar-menu a:hover":{color:i},".source-vk .side-bar-menu a":{color:e},".source-vk .side-bar-menu a:hover":{color:i,background:"none"}})}var mt=class extends c{constructor(){super(...arguments);d(this,"activityType",c.activities.EXTERNAL);d(this,"init$",{counter:0,onDone:()=>{this.$["*currentActivity"]=c.activities.UPLOAD_LIST;},onCancel:()=>{this.set$({"*currentActivity":c.activities.SOURCE_SELECT});}});d(this,"_iframe",null);}initCallback(){this.registerActivity(this.activityType,()=>{let{externalSourceType:t}=this.activityParams;this.set$({"*modalCaption":`${t[0].toUpperCase()}${t.slice(1)}`,"*modalIcon":t}),this.$.counter=0,this.mountIframe();}),this.sub("*currentActivity",t=>{t!==this.activityType&&this.unmountIframe();});}sendMessage(t){this._iframe.contentWindow.postMessage(JSON.stringify(t),"*");}async handleFileSelected(t){this.$.counter=this.$.counter+1;let{url:e,filename:i}=t;this.uploadCollection.add({externalUrl:e,fileName:i});}handleIframeLoad(t){this.applyStyles();}getCssValue(t){return window.getComputedStyle(this).getPropertyValue(t).trim()}applyStyles(){let t={backgroundColor:this.getCssValue("--clr-background-light"),textColor:this.getCssValue("--clr-txt"),shadeColor:this.getCssValue("--clr-shade-lv1"),linkColor:"#157cfc",linkColorHover:"#3891ff"};this.sendMessage({type:"embed-css",style:fe(t)});}remoteUrl(){let t=this.cfg("pubkey"),e="3.11.3",i=(!1).toString(),{externalSourceType:s}=this.activityParams;return `https://social.uploadcare.com/window3/${s}?lang=en&public_key=${t}&widget_version=${e}&images_only=${i}&pass_window_open=false`}mountIframe(){console.log("IFRAME");let t=H({tag:"iframe",attributes:{src:this.remoteUrl(),marginheight:0,marginwidth:0,frameborder:0,allowTransparency:!0}});t.addEventListener("load",this.handleIframeLoad.bind(this)),this.ref.iframeWrapper.innerHTML="",this.ref.iframeWrapper.appendChild(t),pe("file-selected",t.contentWindow,this.handleFileSelected.bind(this)),this._iframe=t;}unmountIframe(){this._iframe&&me("file-selected",this._iframe.contentWindow),this.ref.iframeWrapper.innerHTML="",this._iframe=void 0;}};mt.template=`<div ref="iframeWrapper" class="iframe-wrapper"></div><div class="toolbar"><button class="cancel-btn secondary-btn" set="onclick: onCancel" l10n="cancel"></button><div></div><div class="selected-counter"><span l10n="selected-count"></span><span set="textContent: counter"></span></div><button class="done-btn primary-btn" set="onclick: onDone"><uc-icon name="check"></uc-icon></button></div>`;var J=class extends c{setCurrentTab(t){if(!t)return;[...this.ref.context.querySelectorAll("[tab-ctx]")].forEach(i=>{i.getAttribute("tab-ctx")===t?i.removeAttribute("hidden"):i.setAttribute("hidden","");});for(let i in this._tabMap)i===t?this._tabMap[i].setAttribute("current",""):this._tabMap[i].removeAttribute("current");}initCallback(){this._tabMap={},this.defineAccessor("tab-list",t=>{if(!t)return;t.split(",").map(i=>i.trim()).forEach(i=>{let s=H({tag:"div",attributes:{class:"tab"},properties:{onclick:()=>{this.setCurrentTab(i);}}});s.textContent=this.l10n(i),this.ref.row.appendChild(s),this._tabMap[i]=s;});}),this.defineAccessor("default",t=>{this.setCurrentTab(t);}),this.hasAttribute("default")||this.setCurrentTab(Object.keys(this._tabMap)[0]);}};J.bindAttributes({"tab-list":null,default:null});J.template=`<div ref="row" class="tabs-row"></div><div ref="context" class="tabs-context"><slot></slot></div>`;var A=class extends c{initCallback(){let t=this.getAttribute("from");this.sub(t||A.defaultFrom,e=>{if(!e){this.innerHTML="";return}if(this.hasAttribute(A.fireEventAttrName)&&this.dispatchEvent(new CustomEvent(A.outputEventName,{bubbles:!0,composed:!0,detail:{timestamp:Date.now(),ctxName:this.ctxName,data:e}})),this.hasAttribute(A.templateAttrName)){let i=this.getAttribute(A.templateAttrName),s="";e.forEach(n=>{let o=i;for(let l in n)o=o.split(`{{${l}}}`).join(n[l]);s+=o;}),this.innerHTML=s;}this.value=e,this.hasAttribute(A.formValueAttrName)&&(this._input||(this._input=document.createElement("input"),this._input.type="text",this.appendChild(this._input)),this._input.value=JSON.stringify(e)),this.hasAttribute(A.consoleAttrName)&&console.log(e);});}};A.outputEventName="data-output";A.templateAttrName="item-template";A.fireEventAttrName="fire-event";A.consoleAttrName="console";A.formValueAttrName="form-value";A.defaultFrom="*outputData";var ft=class extends c{constructor(){super(...arguments);d(this,"init$",{"*modalCaption":void 0});}};ft.template=`<div class="caption" set="textContent: *modalCaption"></div>`;var gt=class extends c{constructor(){super(...arguments);d(this,"init$",{"*modalIcon":"default"});}};gt.template=`<uc-icon set="@name: *modalIcon"></uc-icon>`;function ge(r){var t,e;for(let i in r){let s=[...i].reduce((n,o)=>(o.toUpperCase()===o&&(o="-"+o.toLowerCase()),n+=o),"");s.startsWith("-")&&(s=s.replace("-","")),(e=(t=r[i]).reg)==null||e.call(t,s);}}ge(Pt);var Nt=class extends c{};Nt.template=`<uc-simple-btn></uc-simple-btn><uc-modal strokes block-body-scrolling><uc-activity-icon slot="heading"></uc-activity-icon><uc-activity-caption slot="heading"></uc-activity-caption><uc-start-from><uc-source-list wrap></uc-source-list><uc-drop-area></uc-drop-area></uc-start-from><uc-upload-list></uc-upload-list><uc-camera-source></uc-camera-source><uc-url-source></uc-url-source><uc-external-source></uc-external-source><uc-upload-details></uc-upload-details><uc-confirmation-dialog></uc-confirmation-dialog></uc-modal><uc-message-box></uc-message-box><uc-progress-bar></uc-progress-bar>`;Nt.reg("uploader");

    /* src/App.svelte generated by Svelte v3.44.2 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (21:4) {#each files as file}
    function create_each_block(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "https://ucarecdn.com/" + /*file*/ ctx[2].uuid + "/-/preview/-/scale_crop/400x400/")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "width", "200");
    			attr_dev(img, "alt", "Uploadcare uploaded file");
    			add_location(img, file, 21, 6, 506);
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
    		source: "(21:4) {#each files as file}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div1;
    	let uc_uploader;
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
    			uc_uploader = element("uc-uploader");
    			t0 = space();
    			uc_data_output = element("uc-data-output");
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_custom_element_data(uc_uploader, "class", "uploader-cfg uc-wgt-common svelte-xky04k");
    			add_location(uc_uploader, file, 12, 2, 281);
    			set_custom_element_data(uc_data_output, "fire-event", "");
    			set_custom_element_data(uc_data_output, "class", "uploader-cfg uc-wgt-common svelte-xky04k");
    			add_location(uc_data_output, file, 14, 2, 335);
    			attr_dev(div0, "class", "output svelte-xky04k");
    			add_location(div0, file, 19, 2, 453);
    			attr_dev(div1, "class", "wrapper svelte-xky04k");
    			add_location(div1, file, 11, 0, 257);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, uc_uploader);
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
    	let files = [];

    	function handleUploaderEvent(e) {
    		const { data } = e.detail;
    		$$invalidate(0, files = data);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ files, handleUploaderEvent });

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