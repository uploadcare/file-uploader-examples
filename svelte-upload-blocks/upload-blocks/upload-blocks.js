var _t = Object.defineProperty;
var de = (r, t, e) =>
  t in r
    ? _t(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e })
    : (r[t] = e);
var pe = (r) => _t(r, "__esModule", { value: !0 });
var me = (r, t) => {
  pe(r);
  for (var e in t) _t(r, e, { get: t[e], enumerable: !0 });
};
var h = (r, t, e) => (de(r, typeof t != "symbol" ? t + "" : t, e), e);
var X = {};
me(X, {
  ActivityCaption: () => ft,
  ActivityIcon: () => gt,
  BlockComponent: () => a,
  CameraSource: () => at,
  CloudImageEditor: () => Mt,
  ConfirmationDialog: () => rt,
  DataOutput: () => T,
  DefaultWidget: () => J,
  DropArea: () => At,
  EditableCanvas: () => pt,
  ExternalSource: () => mt,
  FileItem: () => k,
  Icon: () => H,
  MessageBox: () => et,
  Modal: () => st,
  ProgressBar: () => ct,
  SimpleBtn: () => Z,
  SourceBtn: () => G,
  SourceList: () => Et,
  StartFrom: () => Tt,
  Tabs: () => q,
  UploadDetails: () => lt,
  UploadList: () => nt,
  UrlSource: () => ot,
});
function fe(r) {
  let t = (e) => {
    var s;
    for (let i in e)
      ((s = e[i]) == null ? void 0 : s.constructor) === Object &&
        (e[i] = t(e[i]));
    return { ...e };
  };
  return t(r);
}
var _ = class {
  constructor(t) {
    (this.uid = Symbol()),
      (this.name = t.name || null),
      t.schema.constructor === Object
        ? (this.store = fe(t.schema))
        : ((this._storeIsProxy = !0), (this.store = t.schema)),
      (this.callbackMap = Object.create(null));
  }
  static warn(t, e) {
    console.warn(`Symbiote Data: cannot ${t}. Prop name: ` + e);
  }
  read(t) {
    return !this._storeIsProxy && !this.store.hasOwnProperty(t)
      ? (_.warn("read", t), null)
      : this.store[t];
  }
  has(t) {
    return this._storeIsProxy
      ? this.store[t] !== void 0
      : this.store.hasOwnProperty(t);
  }
  add(t, e, s = !0) {
    (!s && Object.keys(this.store).includes(t)) ||
      ((this.store[t] = e),
      this.callbackMap[t] &&
        this.callbackMap[t].forEach((i) => {
          i(this.store[t]);
        }));
  }
  pub(t, e) {
    if (!this._storeIsProxy && !this.store.hasOwnProperty(t)) {
      _.warn("publish", t);
      return;
    }
    this.add(t, e);
  }
  multiPub(t) {
    for (let e in t) this.pub(e, t[e]);
  }
  notify(t) {
    this.callbackMap[t] &&
      this.callbackMap[t].forEach((e) => {
        e(this.store[t]);
      });
  }
  sub(t, e, s = !0) {
    return !this._storeIsProxy && !this.store.hasOwnProperty(t)
      ? (_.warn("subscribe", t), null)
      : (this.callbackMap[t] || (this.callbackMap[t] = new Set()),
        this.callbackMap[t].add(e),
        s && e(this.store[t]),
        {
          remove: () => {
            this.callbackMap[t].delete(e),
              this.callbackMap[t].size || delete this.callbackMap[t];
          },
          callback: e,
        });
  }
  remove() {
    delete _.globalStore[this.uid];
  }
  static registerLocalCtx(t) {
    let e = new _({ schema: t });
    return (_.globalStore[e.uid] = e), e;
  }
  static registerNamedCtx(t, e) {
    let s = _.globalStore[t];
    return (
      s
        ? console.warn('State: context name "' + t + '" already in use')
        : ((s = new _({ name: t, schema: e })), (_.globalStore[t] = s)),
      s
    );
  }
  static clearNamedCtx(t) {
    delete _.globalStore[t];
  }
  static getNamedCtx(t, e = !0) {
    return (
      _.globalStore[t] ||
      (e && console.warn('State: wrong context name - "' + t + '"'), null)
    );
  }
};
_.globalStore = Object.create(null);
var y = Object.freeze({
    BIND_ATTR: "set",
    ATTR_BIND_PRFX: "@",
    EXT_DATA_CTX_PRFX: "*",
    NAMED_DATA_CTX_SPLTR: "/",
    CTX_NAME_ATTR: "ctx-name",
    CSS_CTX_PROP: "--ctx-name",
    EL_REF_ATTR: "ref",
    AUTO_TAG_PRFX: "sym",
  }),
  Pt = "1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm",
  ge = Pt.length - 1,
  Q = class {
    static generate(t = "XXXXXXXXX-XXX") {
      let e = "";
      for (let s = 0; s < t.length; s++)
        e += t[s] === "-" ? t[s] : Pt.charAt(Math.random() * ge);
      return e;
    }
  };
function be(r, t) {
  if (t.renderShadow) return;
  let e = [...r.querySelectorAll("slot")];
  if (t.__initChildren.length && e.length) {
    let s = {};
    e.forEach((i) => {
      let n = i.getAttribute("name");
      n
        ? (s[n] = { slot: i, fr: document.createDocumentFragment() })
        : (s.__default__ = { slot: i, fr: document.createDocumentFragment() });
    }),
      t.__initChildren.forEach((i) => {
        var o;
        let n = (o = i.getAttribute) == null ? void 0 : o.call(i, "slot");
        n
          ? s[n].fr.appendChild(i)
          : s.__default__ && s.__default__.fr.appendChild(i);
      }),
      Object.values(s).forEach((i) => {
        i.slot.parentNode.insertBefore(i.fr, i.slot), i.slot.remove();
      });
  } else t.innerHTML = "";
}
function ve(r, t) {
  [...r.querySelectorAll(`[${y.EL_REF_ATTR}]`)].forEach((e) => {
    let s = e.getAttribute(y.EL_REF_ATTR);
    (t.ref[s] = e), e.removeAttribute(y.EL_REF_ATTR);
  });
}
function _e(r, t) {
  [...r.querySelectorAll(`[${y.BIND_ATTR}]`)].forEach((e) => {
    e
      .getAttribute(y.BIND_ATTR)
      .split(";")
      .forEach((n) => {
        if (!n) return;
        let o = n.split(":").map((g) => g.trim()),
          l = o[0],
          c;
        l.indexOf(y.ATTR_BIND_PRFX) === 0 &&
          ((c = !0), (l = l.replace(y.ATTR_BIND_PRFX, "")));
        let u = o[1].split(",").map((g) => g.trim()),
          p,
          d,
          b,
          f;
        if (l.includes(".")) {
          p = !0;
          let g = l.split(".");
          (f = () => {
            (d = e),
              g.forEach((v, w) => {
                w < g.length - 1 ? (d = d[v]) : (b = v);
              });
          }),
            f();
        }
        for (let g of u)
          t.sub(g, (v) => {
            c
              ? (v == null ? void 0 : v.constructor) === Boolean
                ? v
                  ? e.setAttribute(l, "")
                  : e.removeAttribute(l)
                : e.setAttribute(l, v)
              : p
              ? d
                ? (d[b] = v)
                : window.setTimeout(() => {
                    f(), (d[b] = v);
                  })
              : (e[l] = v);
          });
      }),
      e.removeAttribute(y.BIND_ATTR);
  });
}
var ye = [be, ve, _e],
  Dt = 0,
  $ = class extends HTMLElement {
    render(t, e = this.renderShadow) {
      let s;
      if (t || this.constructor.template) {
        for (
          this.constructor.template &&
          !this.constructor.__tpl &&
          ((this.constructor.__tpl = document.createElement("template")),
          (this.constructor.__tpl.innerHTML = this.constructor.template));
          this.firstChild;

        )
          this.firstChild.remove();
        if ((t == null ? void 0 : t.constructor) === DocumentFragment) s = t;
        else if ((t == null ? void 0 : t.constructor) === String) {
          let i = document.createElement("template");
          (i.innerHTML = t), (s = i.content.cloneNode(!0));
        } else
          this.constructor.__tpl &&
            (s = this.constructor.__tpl.content.cloneNode(!0));
        for (let i of this.tplProcessors) i(s, this);
      }
      e
        ? (this.shadowRoot || this.attachShadow({ mode: "open" }),
          s && this.shadowRoot.appendChild(s))
        : s && this.appendChild(s);
    }
    addTemplateProcessor(t) {
      this.tplProcessors.add(t);
    }
    constructor() {
      super();
      (this.init$ = Object.create(null)),
        (this.tplProcessors = new Set()),
        (this.ref = Object.create(null)),
        (this.allSubs = new Set()),
        (this.pauseRender = !1),
        (this.renderShadow = !1),
        (this.readyToDestroy = !0);
    }
    get autoCtxName() {
      return (
        this.__autoCtxName ||
          ((this.__autoCtxName = Q.generate()),
          this.style.setProperty(y.CSS_CTX_PROP, `'${this.__autoCtxName}'`)),
        this.__autoCtxName
      );
    }
    get cssCtxName() {
      return this.getCssData(y.CSS_CTX_PROP, !0);
    }
    get ctxName() {
      var t;
      return (
        ((t = this.getAttribute(y.CTX_NAME_ATTR)) == null
          ? void 0
          : t.trim()) ||
        this.cssCtxName ||
        this.autoCtxName
      );
    }
    get localCtx() {
      return (
        this.__localCtx || (this.__localCtx = _.registerLocalCtx({})),
        this.__localCtx
      );
    }
    get nodeCtx() {
      return (
        _.getNamedCtx(this.ctxName, !1) || _.registerNamedCtx(this.ctxName, {})
      );
    }
    static __parseProp(t, e) {
      let s, i;
      if (t.startsWith(y.EXT_DATA_CTX_PRFX))
        (s = e.nodeCtx), (i = t.replace(y.EXT_DATA_CTX_PRFX, ""));
      else if (t.includes(y.NAMED_DATA_CTX_SPLTR)) {
        let n = t.split(y.NAMED_DATA_CTX_SPLTR);
        (s = _.getNamedCtx(n[0])), (i = n[1]);
      } else (s = e.localCtx), (i = t);
      return { ctx: s, name: i };
    }
    sub(t, e) {
      let s = $.__parseProp(t, this);
      this.allSubs.add(s.ctx.sub(s.name, e));
    }
    notify(t) {
      let e = $.__parseProp(t, this);
      e.ctx.notify(e.name);
    }
    has(t) {
      let e = $.__parseProp(t, this);
      return e.ctx.has(e.name);
    }
    add(t, e) {
      let s = $.__parseProp(t, this);
      s.ctx.add(s.name, e, !1);
    }
    add$(t) {
      for (let e in t) this.add(e, t[e]);
    }
    get $() {
      if (!this.__stateProxy) {
        let t = Object.create(null);
        this.__stateProxy = new Proxy(t, {
          set: (e, s, i) => {
            let n = $.__parseProp(s, this);
            return n.ctx.pub(n.name, i), !0;
          },
          get: (e, s) => {
            let i = $.__parseProp(s, this);
            return i.ctx.read(i.name);
          },
        });
      }
      return this.__stateProxy;
    }
    set$(t) {
      for (let e in t) this.$[e] = t[e];
    }
    initCallback() {}
    __initDataCtx() {
      let t = this.constructor.__attrDesc;
      if (t)
        for (let e of Object.values(t))
          Object.keys(this.init$).includes(e) || (this.init$[e] = "");
      for (let e in this.init$)
        if (e.startsWith(y.EXT_DATA_CTX_PRFX))
          this.nodeCtx.add(e.replace(y.EXT_DATA_CTX_PRFX, ""), this.init$[e]);
        else if (e.includes(y.NAMED_DATA_CTX_SPLTR)) {
          let s = e.split(y.NAMED_DATA_CTX_SPLTR),
            i = s[0].trim(),
            n = s[1].trim();
          if (i && n) {
            let o = _.getNamedCtx(i, !1);
            o || (o = _.registerNamedCtx(i, {})), o.add(n, this.init$[e]);
          }
        } else this.localCtx.add(e, this.init$[e]);
      this.__dataCtxInitialized = !0;
    }
    connectedCallback() {
      var t, e;
      if (
        (this.__disconnectTimeout &&
          window.clearTimeout(this.__disconnectTimeout),
        !this.connectedOnce)
      ) {
        let s =
          (t = this.getAttribute(y.CTX_NAME_ATTR)) == null ? void 0 : t.trim();
        s && this.style.setProperty(y.CSS_CTX_PROP, `'${s}'`),
          this.__initDataCtx(),
          (this.__initChildren = [...this.childNodes]);
        for (let i of ye) this.addTemplateProcessor(i);
        this.pauseRender || this.render(),
          (e = this.initCallback) == null || e.call(this);
      }
      this.connectedOnce = !0;
    }
    destroyCallback() {}
    disconnectedCallback() {
      this.dropCssDataCache(),
        !!this.readyToDestroy &&
          (this.__disconnectTimeout &&
            window.clearTimeout(this.__disconnectTimeout),
          (this.__disconnectTimeout = window.setTimeout(() => {
            this.destroyCallback();
            for (let t of this.allSubs) t.remove(), this.allSubs.delete(t);
            for (let t of this.tplProcessors) this.tplProcessors.delete(t);
          }, 100)));
    }
    static reg(t, e = !1) {
      if (
        (t || (Dt++, (t = `${y.AUTO_TAG_PRFX}-${Dt}`)),
        (this.__tag = t),
        window.customElements.get(t))
      ) {
        console.warn(`${t} - is already in "customElements" registry`);
        return;
      }
      window.customElements.define(t, e ? class extends this {} : this);
    }
    static get is() {
      return this.__tag || this.reg(), this.__tag;
    }
    static bindAttributes(t) {
      (this.observedAttributes = Object.keys(t)), (this.__attrDesc = t);
    }
    attributeChangedCallback(t, e, s) {
      if (e === s) return;
      let i = this.constructor.__attrDesc[t];
      i
        ? this.__dataCtxInitialized
          ? (this.$[i] = s)
          : (this.init$[i] = s)
        : (this[t] = s);
    }
    getCssData(t, e = !1) {
      if (
        (this.__cssDataCache || (this.__cssDataCache = Object.create(null)),
        !Object.keys(this.__cssDataCache).includes(t))
      ) {
        this.__computedStyle ||
          (this.__computedStyle = window.getComputedStyle(this));
        let s = this.__computedStyle.getPropertyValue(t).trim();
        s.startsWith("'") && s.endsWith("'") && (s = s.replace(/\'/g, '"'));
        try {
          this.__cssDataCache[t] = JSON.parse(s);
        } catch (i) {
          !e && console.warn(`CSS Data error: ${t}`),
            (this.__cssDataCache[t] = null);
        }
      }
      return this.__cssDataCache[t];
    }
    dropCssDataCache() {
      (this.__cssDataCache = null), (this.__computedStyle = null);
    }
    defineAccessor(t, e, s) {
      let i = "__" + t;
      (this[i] = this[t]),
        Object.defineProperty(this, t, {
          set: (n) => {
            (this[i] = n),
              s
                ? window.setTimeout(() => {
                    e == null || e(n);
                  })
                : e == null || e(n);
          },
          get: () => this[i],
        }),
        (this[t] = this[i]);
    }
  },
  Nt = "[Typed State] Wrong property name: ",
  Ce = "[Typed State] Wrong property type: ",
  Ft = class {
    constructor(t, e) {
      (this.__typedSchema = t),
        (this.__ctxId = e || Q.generate()),
        (this.__schema = Object.keys(t).reduce(
          (s, i) => ((s[i] = t[i].value), s),
          {}
        )),
        (this.__state = _.registerNamedCtx(this.__ctxId, this.__schema));
    }
    setValue(t, e) {
      if (!this.__typedSchema.hasOwnProperty(t)) {
        console.warn(Nt + t);
        return;
      }
      if ((e == null ? void 0 : e.constructor) !== this.__typedSchema[t].type) {
        console.warn(Ce + t);
        return;
      }
      this.__state.pub(t, e);
    }
    setMultipleValues(t) {
      for (let e in t) this.setValue(e, t[e]);
    }
    getValue(t) {
      if (!this.__typedSchema.hasOwnProperty(t)) {
        console.warn(Nt + t);
        return;
      }
      return this.__state.read(t);
    }
    subscribe(t, e) {
      return this.__state.sub(t, e);
    }
    remove() {
      this.__state.remove();
    }
  },
  yt = class {
    constructor(t) {
      (this.__typedSchema = t.typedSchema),
        (this.__ctxId = t.ctxName || Q.generate()),
        (this.__state = _.registerNamedCtx(this.__ctxId, {})),
        (this.__watchList = t.watchList || []),
        (this.__handler = t.handler || null),
        (this.__subsMap = Object.create(null)),
        (this.__observers = new Set()),
        (this.__items = new Set());
      let e = Object.create(null);
      this.__notifyObservers = (s, i) => {
        this.__observeTimeout && window.clearTimeout(this.__observeTimeout),
          e[s] || (e[s] = new Set()),
          e[s].add(i),
          (this.__observeTimeout = window.setTimeout(() => {
            this.__observers.forEach((n) => {
              n({ ...e });
            }),
              (e = Object.create(null));
          }));
      };
    }
    notify() {
      this.__notifyTimeout && window.clearTimeout(this.__notifyTimeout),
        (this.__notifyTimeout = window.setTimeout(() => {
          var t;
          (t = this.__handler) == null || t.call(this, [...this.__items]);
        }));
    }
    add(t) {
      let e = new Ft(this.__typedSchema);
      for (let s in t) e.setValue(s, t[s]);
      return (
        this.__state.add(e.__ctxId, e),
        this.__watchList.forEach((s) => {
          this.__subsMap[e.__ctxId] || (this.__subsMap[e.__ctxId] = []),
            this.__subsMap[e.__ctxId].push(
              e.subscribe(s, () => {
                this.__notifyObservers(s, e.__ctxId);
              })
            );
        }),
        this.__items.add(e.__ctxId),
        this.notify(),
        e
      );
    }
    read(t) {
      return this.__state.read(t);
    }
    readProp(t, e) {
      return this.read(t).getValue(e);
    }
    publishProp(t, e, s) {
      this.read(t).setValue(e, s);
    }
    remove(t) {
      this.__items.delete(t),
        this.notify(),
        this.__state.pub(t, null),
        delete this.__subsMap[t];
    }
    clearAll() {
      this.__items.forEach((t) => {
        this.remove(t);
      });
    }
    observe(t) {
      this.__observers.add(t);
    }
    unobserve(t) {
      this.__observers.delete(t);
    }
    findItems(t) {
      let e = [];
      return (
        this.__items.forEach((s) => {
          let i = this.read(s);
          t(i) && e.push(s);
        }),
        e
      );
    }
    items() {
      return [...this.__items];
    }
    destroy() {
      this.__state.remove(), (this.__observers = null);
      for (let t in this.__subsMap)
        this.__subsMap[t].forEach((e) => {
          e.remove();
        }),
          delete this.__subsMap[t];
    }
  },
  j = class {
    static _print(t) {
      console.warn(t);
    }
    static setDefaultTitle(t) {
      this.defaultTitle = t;
    }
    static setRoutingMap(t) {
      Object.assign(this.appMap, t);
      for (let e in this.appMap)
        !this.defaultRoute && this.appMap[e].default === !0
          ? (this.defaultRoute = e)
          : !this.errorRoute &&
            this.appMap[e].error === !0 &&
            (this.errorRoute = e);
    }
    static set routingEventName(t) {
      this.__routingEventName = t;
    }
    static get routingEventName() {
      return this.__routingEventName || "sym-on-route";
    }
    static readAddressBar() {
      let t = { route: null, options: {} };
      return (
        window.location.search.split(this.separator).forEach((s) => {
          if (s.includes("?")) t.route = s.replace("?", "");
          else if (s.includes("=")) {
            let i = s.split("=");
            t.options[i[0]] = decodeURI(i[1]);
          } else t.options[s] = !0;
        }),
        t
      );
    }
    static notify() {
      let t = this.readAddressBar(),
        e = this.appMap[t.route];
      if (
        (e && e.title && (document.title = e.title),
        t.route === null && this.defaultRoute)
      ) {
        this.applyRoute(this.defaultRoute);
        return;
      } else if (!e && this.errorRoute) {
        this.applyRoute(this.errorRoute);
        return;
      } else if (!e && this.defaultRoute) {
        this.applyRoute(this.defaultRoute);
        return;
      } else if (!e) {
        this._print(`Route "${t.route}" not found...`);
        return;
      }
      let s = new CustomEvent(j.routingEventName, {
        detail: { route: t.route, options: Object.assign(e || {}, t.options) },
      });
      window.dispatchEvent(s);
    }
    static reflect(t, e = {}) {
      let s = this.appMap[t];
      if (!s) {
        this._print("Wrong route: " + t);
        return;
      }
      let i = "?" + t;
      for (let o in e)
        e[o] === !0
          ? (i += this.separator + o)
          : (i += this.separator + o + `=${e[o]}`);
      let n = s.title || this.defaultTitle || "";
      window.history.pushState(null, n, i), (document.title = n);
    }
    static applyRoute(t, e = {}) {
      this.reflect(t, e), this.notify();
    }
    static setSeparator(t) {
      this._separator = t;
    }
    static get separator() {
      return this._separator || "&";
    }
    static createRouterData(t, e) {
      this.setRoutingMap(e);
      let s = _.registerNamedCtx(t, {
        route: null,
        options: null,
        title: null,
      });
      return (
        window.addEventListener(this.routingEventName, (i) => {
          var n;
          s.multiPub({
            route: i.detail.route,
            options: i.detail.options,
            title:
              ((n = i.detail.options) == null ? void 0 : n.title) ||
              this.defaultTitle ||
              "",
          });
        }),
        j.notify(),
        s
      );
    }
  };
j.appMap = Object.create(null);
window.onpopstate = () => {
  j.notify();
};
function z(r, t) {
  for (let e in t)
    e.includes("-") ? r.style.setProperty(e, t[e]) : (r.style[e] = t[e]);
}
function B(r, t) {
  for (let e in t)
    t[e].constructor === Boolean
      ? t[e]
        ? r.setAttribute(e, "")
        : r.removeAttribute(e)
      : r.setAttribute(e, t[e]);
}
function Ct(r = { tag: "div" }) {
  let t = document.createElement(r.tag);
  if (
    (r.attributes && B(t, r.attributes),
    r.styles && z(t, r.styles),
    r.properties)
  )
    for (let e in r.properties) t[e] = r.properties[e];
  return (
    r.processors &&
      r.processors.forEach((e) => {
        e(t);
      }),
    r.children &&
      r.children.forEach((e) => {
        let s = Ct(e);
        t.appendChild(s);
      }),
    t
  );
}
var Xt = "idb-store-ready",
  we = "symbiote-db",
  xe = "symbiote-idb-update_",
  Vt = class {
    _notifyWhenReady(t = null) {
      window.dispatchEvent(
        new CustomEvent(Xt, {
          detail: { dbName: this.name, storeName: this.storeName, event: t },
        })
      );
    }
    get _updEventName() {
      return xe + this.name;
    }
    _getUpdateEvent(t) {
      return new CustomEvent(this._updEventName, {
        detail: { key: this.name, newValue: t },
      });
    }
    _notifySubscribers(t) {
      window.localStorage.removeItem(this.name),
        window.localStorage.setItem(this.name, t),
        window.dispatchEvent(this._getUpdateEvent(t));
    }
    constructor(t, e) {
      (this.name = t),
        (this.storeName = e),
        (this.version = 1),
        (this.request = window.indexedDB.open(this.name, this.version)),
        (this.request.onupgradeneeded = (s) => {
          (this.db = s.target.result),
            (this.objStore = this.db.createObjectStore(e, { keyPath: "_key" })),
            (this.objStore.transaction.oncomplete = (i) => {
              this._notifyWhenReady(i);
            });
        }),
        (this.request.onsuccess = (s) => {
          (this.db = s.target.result), this._notifyWhenReady(s);
        }),
        (this.request.onerror = (s) => {
          console.error(s);
        }),
        (this._subscribtionsMap = {}),
        (this._updateHandler = (s) => {
          s.key === this.name &&
            this._subscribtionsMap[s.newValue] &&
            this._subscribtionsMap[s.newValue].forEach(async (n) => {
              n(await this.read(s.newValue));
            });
        }),
        (this._localUpdateHanler = (s) => {
          this._updateHandler(s.detail);
        }),
        window.addEventListener("storage", this._updateHandler),
        window.addEventListener(this._updEventName, this._localUpdateHanler);
    }
    read(t) {
      let s = this.db
        .transaction(this.storeName, "readwrite")
        .objectStore(this.storeName)
        .get(t);
      return new Promise((i, n) => {
        (s.onsuccess = (o) => {
          var l;
          ((l = o.target.result) == null ? void 0 : l._value)
            ? i(o.target.result._value)
            : (i(null), console.warn(`IDB: cannot read "${t}"`));
        }),
          (s.onerror = (o) => {
            n(o);
          });
      });
    }
    write(t, e, s = !1) {
      let i = { _key: t, _value: e },
        o = this.db
          .transaction(this.storeName, "readwrite")
          .objectStore(this.storeName)
          .put(i);
      return new Promise((l, c) => {
        (o.onsuccess = (u) => {
          s || this._notifySubscribers(t), l(u.target.result);
        }),
          (o.onerror = (u) => {
            c(u);
          });
      });
    }
    delete(t, e = !1) {
      let i = this.db
        .transaction(this.storeName, "readwrite")
        .objectStore(this.storeName)
        .delete(t);
      return new Promise((n, o) => {
        (i.onsuccess = (l) => {
          e || this._notifySubscribers(t), n(l);
        }),
          (i.onerror = (l) => {
            o(l);
          });
      });
    }
    getAll() {
      let e = this.db
        .transaction(this.storeName, "readwrite")
        .objectStore(this.storeName)
        .getAll();
      return new Promise((s, i) => {
        (e.onsuccess = (n) => {
          let o = n.target.result;
          s(o.map((l) => l._value));
        }),
          (e.onerror = (n) => {
            i(n);
          });
      });
    }
    subscribe(t, e) {
      this._subscribtionsMap[t] || (this._subscribtionsMap[t] = new Set());
      let s = this._subscribtionsMap[t];
      return (
        s.add(e),
        {
          remove: () => {
            s.delete(e), s.size || delete this._subscribtionsMap[t];
          },
        }
      );
    }
    stop() {
      window.removeEventListener("storage", this._updateHandler),
        (this.__subscribtionsMap = null),
        wt.clear(this.name);
    }
  },
  wt = class {
    static get readyEventName() {
      return Xt;
    }
    static open(t = we, e = "store") {
      let s = `${t}/${e}`;
      return this._reg[s] || (this._reg[s] = new Vt(t, e)), this._reg[s];
    }
    static clear(t) {
      window.indexedDB.deleteDatabase(t);
      for (let e in this._reg) e.split("/")[0] === t && delete this._reg[e];
    }
  };
wt._reg = Object.create(null);
function zt(r, t) {
  [...r.querySelectorAll("[l10n]")].forEach((e) => {
    let s = e.getAttribute("l10n"),
      i = "textContent";
    if (s.includes(":")) {
      let o = s.split(":");
      (i = o[0]), (s = o[1]);
    }
    let n = "l10n:" + s;
    t.__l10nKeys.push(n),
      t.add(n, s),
      t.sub(n, (o) => {
        e[i] = t.l10n(o);
      }),
      e.removeAttribute("l10n");
  });
}
var Ht = Object.freeze({
  file: { type: File, value: null },
  externalUrl: { type: String, value: null },
  fileName: { type: String, value: null },
  fileSize: { type: Number, value: null },
  lastModified: { type: Number, value: Date.now() },
  uploadProgress: { type: Number, value: 0 },
  uuid: { type: String, value: null },
  isImage: { type: Boolean, value: !1 },
  mimeType: { type: String, value: null },
  uploadErrorMsg: { type: String, value: null },
  validationErrorMsg: { type: String, value: null },
  ctxName: { type: String, value: null },
  transformationsUrl: { type: String, value: null },
});
var Gt = "active",
  Wt = "uc-",
  Te = "css-src",
  xt = document.readyState === "complete";
xt ||
  window.addEventListener("load", () => {
    xt = !0;
  });
var qt = !1,
  a = class extends $ {
    l10n(t) {
      return this.getCssData("--l10n-" + t);
    }
    constructor() {
      super();
      (this.activityType = null),
        this.addTemplateProcessor(zt),
        (this.__l10nKeys = []),
        (this.__l10nUpdate = () => {
          this.dropCssDataCache();
          for (let t of this.__l10nKeys) this.notify(t);
        }),
        window.addEventListener("uc-l10n-update", this.__l10nUpdate);
    }
    applyL10nKey(t, e) {
      this.$["l10n:" + t] = e;
    }
    historyBack() {
      let t = this.$["*history"];
      t.pop();
      let e = t.pop();
      (this.$["*currentActivity"] = e),
        t.length > 10 && (t = t.slice(t.length - 11, t.length - 1)),
        (this.$["*history"] = t);
    }
    addFiles(t) {
      t.forEach((e) => {
        this.uploadCollection.add({
          file: e,
          isImage: e.type.includes("image"),
          mimeType: e.type,
          fileName: e.name,
          fileSize: e.size,
        });
      });
    }
    openSystemDialog() {
      (this.fileInput = document.createElement("input")),
        (this.fileInput.type = "file"),
        (this.fileInput.multiple = !!this.cfg("multiple")),
        (this.fileInput.max = this.cfg("max-files")),
        (this.fileInput.accept = this.cfg("accept")),
        this.fileInput.dispatchEvent(new MouseEvent("click")),
        (this.fileInput.onchange = () => {
          this.addFiles([...this.fileInput.files]),
            (this.$["*currentActivity"] = a.activities.UPLOAD_LIST),
            this.cfg("confirm-upload") || (this.$["*currentActivity"] = ""),
            (this.fileInput.value = ""),
            (this.fileInput = null);
        });
    }
    connectedCallback() {
      let t = () => {
          xt
            ? this.connected()
            : window.addEventListener("load", () => {
                this.connected();
              });
        },
        e = this.getAttribute(Te);
      if (e) {
        (this.renderShadow = !0), this.attachShadow({ mode: "open" });
        let s = document.createElement("link");
        (s.rel = "stylesheet"),
          (s.type = "text/css"),
          (s.href = e),
          (s.onload = () => {
            window.requestAnimationFrame(() => {
              t();
            });
          }),
          this.shadowRoot.appendChild(s);
      } else t();
    }
    connected() {
      this.__connectedOnce
        ? super.connectedCallback()
        : (qt ||
            (this.add$({
              "*currentActivity": "",
              "*currentActivityParams": {},
              "*history": [],
              "*commonProgress": 0,
              "*uploadList": [],
              "*outputData": null,
            }),
            (qt = !0)),
          super.connectedCallback(),
          this.activityType &&
            (this.hasAttribute("activity") ||
              this.setAttribute("activity", this.activityType),
            this.sub("*currentActivity", (t) => {
              var e, s;
              if (!t || this.activityType !== t) this.removeAttribute(Gt);
              else {
                let i = this.$["*history"];
                t && i[i.length - 1] !== t && i.push(t),
                  this.setAttribute(Gt, "");
                let n = a._activityRegistry[t];
                if (
                  n &&
                  ((e = n.activateCallback) == null || e.call(n),
                  a._lastActivity)
                ) {
                  let o = a._activityRegistry[a._lastActivity];
                  o && ((s = o.deactivateCallback) == null || s.call(o));
                }
              }
              a._lastActivity = t;
            })),
          (this.__connectedOnce = !0));
    }
    registerActivity(t, e, s) {
      a._activityRegistry || (a._activityRegistry = Object.create(null)),
        (a._activityRegistry[t] = {
          activateCallback: e,
          deactivateCallback: s,
        });
    }
    get activityParams() {
      return this.$["*currentActivityParams"];
    }
    get uploadCollection() {
      if (!this.has("*uploadCollection")) {
        let t = new yt({
          typedSchema: Ht,
          watchList: ["uploadProgress", "uuid"],
          handler: (e) => {
            this.$["*uploadList"] = e;
          },
        });
        t.observe((e) => {
          if (e.uploadProgress) {
            let s = 0,
              i = t.findItems((n) => !n.getValue("uploadErrorMsg"));
            i.forEach((n) => {
              s += t.readProp(n, "uploadProgress");
            }),
              (this.$["*commonProgress"] = s / i.length);
          }
        }),
          this.add("*uploadCollection", t);
      }
      return this.$["*uploadCollection"];
    }
    cfg(t) {
      return this.getCssData("--cfg-" + t, !0);
    }
    output() {
      let t = [];
      this.uploadCollection.items().forEach((s) => {
        t.push(_.getNamedCtx(s).store);
      }),
        (this.$["*outputData"] = t);
    }
    destroyCallback() {
      window.removeEventListener("uc-l10n-update", this.__l10nUpdate),
        (this.__l10nKeys = null);
    }
    static reg(t) {
      super.reg(t.startsWith(Wt) ? t : Wt + t);
    }
  };
a._activityRegistry = Object.create(null);
a._lastActivity = "";
a.activities = Object.freeze({
  SOURCE_SELECT: "source-select",
  CAMERA: "camera",
  DRAW: "draw",
  UPLOAD_LIST: "upload-list",
  URL: "url",
  CONFIRMATION: "confirmation",
  CLOUD_IMG_EDIT: "cloud-image-edit",
  EXTERNAL: "external",
  DETAILS: "details",
});
a.extSrcList = Object.freeze({
  FACEBOOK: "facebook",
  DROPBOX: "dropbox",
  GDRIVE: "gdrive",
  GPHOTOS: "gphotos",
  INSTAGRAM: "instagram",
  FLICKR: "flickr",
  VK: "vk",
  EVERNOTE: "evernote",
  BOX: "box",
  ONEDRIVE: "onedrive",
  HUDDLE: "huddle",
});
a.sourceTypes = Object.freeze({
  LOCAL: "local",
  URL: "url",
  CAMERA: "camera",
  DRAW: "draw",
  ...a.extSrcList,
});
var H = class extends a {
  constructor() {
    super(...arguments);
    h(this, "init$", { path: "" });
  }
  initCallback() {
    this.defineAccessor("name", (t) => {
      !t || (this.$.path = this.getCssData(`--icon-${t}`));
    });
  }
};
H.template = `
<svg
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg">
  <path set="@d: path"></path>
</svg>
`;
H.bindAttributes({ name: null });
var Z = class extends a {
  constructor() {
    super(...arguments);
    h(this, "init$", { "*simpleButtonText": "" });
  }
  initCallback() {
    (this.$["*simpleButtonText"] = this.cfg("multiple")
      ? this.l10n("upload-files")
      : this.l10n("upload-file")),
      (this.onclick = () => {
        this.$["*uploadList"].length
          ? this.set$({ "*currentActivity": a.activities.UPLOAD_LIST })
          : this.set$({ "*currentActivity": a.activities.SOURCE_SELECT });
      });
  }
};
Z.template = `
<button>
  <uc-icon name="upload"></uc-icon>
  <span set="textContent: *simpleButtonText"></span>
  <slot></slot>
</button>`;
var Tt = class extends a {
  constructor() {
    super(...arguments);
    h(this, "activityType", "source-select");
  }
  initCallback() {
    this.registerActivity(this.activityType, () => {
      this.set$({
        "*modalCaption": this.l10n("select-file-source"),
        "*modalIcon": "default",
      });
    });
  }
};
var At = class extends a {
  initCallback() {
    this.addEventListener("dragover", (t) => {
      t.stopPropagation(), t.preventDefault();
    }),
      this.addEventListener(
        "drop",
        (t) => {
          t.stopPropagation(),
            t.preventDefault(),
            t.dataTransfer.files &&
              ([...t.dataTransfer.files].forEach((e) => {
                this.uploadCollection.add({
                  file: e,
                  isImage: e.type.includes("image"),
                  mimeType: e.type,
                  fileName: e.name,
                  fileSize: e.size,
                });
              }),
              this.set$({ "*currentActivity": a.activities.UPLOAD_LIST }));
        },
        !1
      );
  }
};
var Ae = "src-type-",
  G = class extends a {
    constructor() {
      super();
      h(this, "init$", { iconName: "default" });
      this._registeredTypes = {};
    }
    initTypes() {
      this.registerType({
        type: a.sourceTypes.LOCAL,
        activity: "",
        onClick: () => {
          this.openSystemDialog();
        },
      }),
        this.registerType({
          type: a.sourceTypes.URL,
          activity: a.activities.URL,
          textKey: "from-url",
        }),
        this.registerType({
          type: a.sourceTypes.CAMERA,
          activity: a.activities.CAMERA,
        }),
        this.registerType({
          type: "draw",
          activity: a.activities.DRAW,
          icon: "edit-draw",
        });
      for (let t of Object.values(a.extSrcList))
        this.registerType({
          type: t,
          activity: a.activities.EXTERNAL,
          activityParams: { externalSourceType: t },
        });
    }
    initCallback() {
      this.initTypes(),
        this.setAttribute("role", "button"),
        this.defineAccessor("type", (t) => {
          !t || this.applyType(t);
        });
    }
    registerType(t) {
      this._registeredTypes[t.type] = t;
    }
    getType(t) {
      return this._registeredTypes[t];
    }
    applyType(t) {
      let e = this._registeredTypes[t],
        {
          textKey: s = t,
          icon: i = t,
          activity: n,
          onClick: o,
          activityParams: l = {},
        } = e;
      this.applyL10nKey("src-type", `${Ae}${s}`),
        (this.$.iconName = i),
        (this.onclick = (c) => {
          this.set$({ "*currentActivityParams": l, "*currentActivity": n }),
            o && o(c);
        });
    }
  };
G.template = `
<uc-icon set="@name: iconName"></uc-icon>
<div class="txt" l10n="src-type"></div>
`;
G.bindAttributes({ type: null });
var Et = class extends a {
  initCallback() {
    let t = this.cfg("source-list");
    if (!t) return;
    let e = t.split(",").map((i) => i.trim()),
      s = "";
    e.forEach((i) => {
      s += `<uc-source-btn type="${i}"></uc-source-btn>`;
    }),
      this.hasAttribute("wrap") ? (this.innerHTML = s) : (this.outerHTML = s);
  }
};
function Jt(r, t = 40) {
  let e = document.createElement("canvas"),
    s = e.getContext("2d"),
    i = new Image(),
    n = new Promise((o, l) => {
      (i.onload = () => {
        let c = i.height / i.width;
        c > 1
          ? ((e.width = t), (e.height = t * c))
          : ((e.height = t), (e.width = t / c)),
          (s.fillStyle = "rgb(240, 240, 240)"),
          s.fillRect(0, 0, e.width, e.height),
          s.drawImage(i, 0, 0, e.width, e.height),
          e.toBlob((u) => {
            let p = URL.createObjectURL(u);
            o(p);
          }, "image/png");
      }),
        (i.onerror = (c) => {
          console.warn("Resize error..."), l(c);
        });
    });
  return (i.src = URL.createObjectURL(r)), n;
}
var A = class extends Error {
    constructor(t, e, s, i, n) {
      super();
      (this.name = "UploadClientError"),
        (this.message = t),
        (this.code = e),
        (this.request = s),
        (this.response = i),
        (this.headers = n),
        Object.setPrototypeOf(this, A.prototype);
    }
  },
  St = (r = "Request canceled") => {
    let t = new A(r);
    return (t.isCancel = !0), t;
  },
  tt = (r, t) => {
    r &&
      (r.aborted
        ? Promise.resolve().then(t)
        : r.addEventListener("abort", () => t(), { once: !0 }));
  },
  R = ({
    method: r,
    url: t,
    data: e,
    headers: s = {},
    signal: i,
    onProgress: n,
  }) =>
    new Promise((o, l) => {
      let c = new XMLHttpRequest(),
        u = (r == null ? void 0 : r.toUpperCase()) || "GET",
        p = !1;
      c.open(u, t),
        s &&
          Object.entries(s).forEach((d) => {
            let [b, f] = d;
            typeof f != "undefined" &&
              !Array.isArray(f) &&
              c.setRequestHeader(b, f);
          }),
        (c.responseType = "text"),
        tt(i, () => {
          (p = !0), c.abort(), l(St());
        }),
        (c.onload = () => {
          if (c.status != 200)
            l(new Error(`Error ${c.status}: ${c.statusText}`));
          else {
            let d = {
                method: u,
                url: t,
                data: e,
                headers: s || void 0,
                signal: i,
                onProgress: n,
              },
              b = c
                .getAllResponseHeaders()
                .trim()
                .split(/[\r\n]+/),
              f = {};
            b.forEach(function (w) {
              let m = w.split(": "),
                x = m.shift(),
                O = m.join(": ");
              x && typeof x != "undefined" && (f[x] = O);
            });
            let g = c.response,
              v = c.status;
            o({ request: d, data: g, headers: f, status: v });
          }
        }),
        (c.onerror = () => {
          p || l(new Error("Network error"));
        }),
        n &&
          typeof n == "function" &&
          (c.upload.onprogress = (d) => {
            n({ value: d.loaded / d.total });
          }),
        e ? c.send(e) : c.send();
    });
function Ee(r) {
  return r;
}
var Se = Ee,
  ke = () => new FormData(),
  $e = (r) => r[0] === "file";
function kt(r) {
  let t = ke();
  for (let e of r)
    if (Array.isArray(e[1]))
      e[1].forEach((s) => s && t.append(e[0] + "[]", `${s}`));
    else if ($e(e)) {
      let s = e[2],
        i = Se(e[1]);
      t.append(e[0], i, s);
    } else e[1] != null && t.append(e[0], `${e[1]}`);
  return t;
}
var Yt = (r, t) =>
    typeof t != "undefined" ? `${r}=${encodeURIComponent(t)}` : null,
  Ie = (r) =>
    Object.entries(r)
      .reduce(
        (t, [e, s]) =>
          t.concat(Array.isArray(s) ? s.map((i) => Yt(`${e}[]`, i)) : Yt(e, s)),
        []
      )
      .filter((t) => !!t)
      .join("&"),
  M = (r, t, e) =>
    [r, t, e && Object.keys(e).length > 0 ? "?" : "", e && Ie(e)]
      .filter(Boolean)
      .join(""),
  C = {
    baseCDN: "https://ucarecdn.com",
    baseURL: "https://upload.uploadcare.com",
    maxContentLength: 50 * 1024 * 1024,
    retryThrottledRequestMaxTimes: 1,
    multipartMinFileSize: 25 * 1024 * 1024,
    multipartChunkSize: 5 * 1024 * 1024,
    multipartMinLastPartSize: 1024 * 1024,
    maxConcurrentRequests: 4,
    multipartMaxAttempts: 3,
    pollingTimeoutMilliseconds: 1e4,
    pusherKey: "79ae88bd931ea68464d9",
  },
  Ue = "application/octet-stream",
  Kt = "original",
  Be = "2.0.0";
function P({ userAgent: r, publicKey: t = "", integration: e = "" } = {}) {
  let s = "UploadcareUploadClient",
    i = Be,
    n = "JavaScript";
  if (typeof r == "string") return r;
  if (typeof r == "function")
    return r({
      publicKey: t,
      libraryName: s,
      libraryVersion: i,
      languageName: n,
      integration: e,
    });
  let o = [s, i, t].filter(Boolean).join("/"),
    l = [n, e].filter(Boolean).join("; ");
  return `${o} (${l})`;
}
var Re = /\W|_/g;
function Oe(r) {
  return r
    .split(Re)
    .map(
      (t, e) =>
        t.charAt(0)[e > 0 ? "toUpperCase" : "toLowerCase"]() + t.slice(1)
    )
    .join("");
}
function I(r) {
  return !r || typeof r != "object"
    ? r
    : Object.keys(r).reduce(
        (t, e) => ((t[Oe(e)] = typeof r[e] == "object" ? I(r[e]) : r[e]), t),
        {}
      );
}
var Le = (r) => new Promise((t) => setTimeout(t, r)),
  je = { factor: 2, time: 100 };
function Qt(r, t = je) {
  let e = 0;
  function s(i) {
    let n = Math.round(t.time * Math.pow(t.factor, e));
    return i({
      attempt: e,
      retry: (l) => Le(l != null ? l : n).then(() => ((e += 1), s(i))),
    });
  }
  return s(r);
}
var Me = "RequestThrottledError",
  Pe = 15e3;
function De(r) {
  let { headers: t } = r || {};
  return (t && Number.parseInt(t["x-throttle-wait-seconds"]) * 1e3) || Pe;
}
function D(r, t) {
  return Qt(({ attempt: e, retry: s }) =>
    r().catch((i) => {
      if ("response" in i && (i == null ? void 0 : i.code) === Me && e < t)
        return s(De(i));
      throw i;
    })
  );
}
function Ne(
  r,
  {
    publicKey: t,
    fileName: e,
    baseURL: s = C.baseURL,
    secureSignature: i,
    secureExpire: n,
    store: o,
    signal: l,
    onProgress: c,
    source: u = "local",
    integration: p,
    userAgent: d,
    retryThrottledRequestMaxTimes: b = C.retryThrottledRequestMaxTimes,
  }
) {
  return D(() => {
    var f;
    return R({
      method: "POST",
      url: M(s, "/base/", { jsonerrors: 1 }),
      headers: {
        "X-UC-User-Agent": P({ publicKey: t, integration: p, userAgent: d }),
      },
      data: kt([
        [
          "file",
          r,
          (f = e != null ? e : r.name) !== null && f !== void 0 ? f : Kt,
        ],
        ["UPLOADCARE_PUB_KEY", t],
        ["UPLOADCARE_STORE", typeof o == "undefined" ? "auto" : o ? 1 : 0],
        ["signature", i],
        ["expire", n],
        ["source", u],
      ]),
      signal: l,
      onProgress: c,
    }).then(({ data: g, headers: v, request: w }) => {
      let m = I(JSON.parse(g));
      if ("error" in m)
        throw new A(m.error.content, m.error.errorCode, w, m, v);
      return m;
    });
  }, b);
}
var $t;
(function (r) {
  (r.Token = "token"), (r.FileInfo = "file_info");
})($t || ($t = {}));
function Fe(
  r,
  {
    publicKey: t,
    baseURL: e = C.baseURL,
    store: s,
    fileName: i,
    checkForUrlDuplicates: n,
    saveUrlForRecurrentUploads: o,
    secureSignature: l,
    secureExpire: c,
    source: u = "url",
    signal: p,
    integration: d,
    userAgent: b,
    retryThrottledRequestMaxTimes: f = C.retryThrottledRequestMaxTimes,
  }
) {
  return D(
    () =>
      R({
        method: "POST",
        headers: {
          "X-UC-User-Agent": P({ publicKey: t, integration: d, userAgent: b }),
        },
        url: M(e, "/from_url/", {
          jsonerrors: 1,
          pub_key: t,
          source_url: r,
          store: typeof s == "undefined" ? "auto" : s ? 1 : void 0,
          filename: i,
          check_URL_duplicates: n ? 1 : void 0,
          save_URL_duplicates: o ? 1 : void 0,
          signature: l,
          expire: c,
          source: u,
        }),
        signal: p,
      }).then(({ data: g, headers: v, request: w }) => {
        let m = I(JSON.parse(g));
        if ("error" in m)
          throw new A(m.error.content, m.error.errorCode, w, m, v);
        return m;
      }),
    f
  );
}
var E;
(function (r) {
  (r.Unknown = "unknown"),
    (r.Waiting = "waiting"),
    (r.Progress = "progress"),
    (r.Error = "error"),
    (r.Success = "success");
})(E || (E = {}));
var Xe = (r) => "status" in r && r.status === E.Error;
function Ve(
  r,
  {
    publicKey: t,
    baseURL: e = C.baseURL,
    signal: s,
    integration: i,
    userAgent: n,
    retryThrottledRequestMaxTimes: o = C.retryThrottledRequestMaxTimes,
  } = {}
) {
  return D(
    () =>
      R({
        method: "GET",
        headers: t
          ? {
              "X-UC-User-Agent": P({
                publicKey: t,
                integration: i,
                userAgent: n,
              }),
            }
          : void 0,
        url: M(e, "/from_url/status/", { jsonerrors: 1, token: r }),
        signal: s,
      }).then(({ data: l, headers: c, request: u }) => {
        let p = I(JSON.parse(l));
        if ("error" in p && !Xe(p))
          throw new A(p.error.content, void 0, u, p, c);
        return p;
      }),
    o
  );
}
function Zt(
  r,
  {
    publicKey: t,
    baseURL: e = C.baseURL,
    signal: s,
    source: i,
    integration: n,
    userAgent: o,
    retryThrottledRequestMaxTimes: l = C.retryThrottledRequestMaxTimes,
  }
) {
  return D(
    () =>
      R({
        method: "GET",
        headers: {
          "X-UC-User-Agent": P({ publicKey: t, integration: n, userAgent: o }),
        },
        url: M(e, "/info/", {
          jsonerrors: 1,
          pub_key: t,
          file_id: r,
          source: i,
        }),
        signal: s,
      }).then(({ data: c, headers: u, request: p }) => {
        let d = I(JSON.parse(c));
        if ("error" in d)
          throw new A(d.error.content, d.error.errorCode, p, d, u);
        return d;
      }),
    l
  );
}
function ze(
  r,
  {
    publicKey: t,
    contentType: e,
    fileName: s,
    multipartChunkSize: i = C.multipartChunkSize,
    baseURL: n = "",
    secureSignature: o,
    secureExpire: l,
    store: c,
    signal: u,
    source: p = "local",
    integration: d,
    userAgent: b,
    retryThrottledRequestMaxTimes: f = C.retryThrottledRequestMaxTimes,
  }
) {
  return D(
    () =>
      R({
        method: "POST",
        url: M(n, "/multipart/start/", { jsonerrors: 1 }),
        headers: {
          "X-UC-User-Agent": P({ publicKey: t, integration: d, userAgent: b }),
        },
        data: kt([
          ["filename", s != null ? s : Kt],
          ["size", r],
          ["content_type", e != null ? e : Ue],
          ["part_size", i],
          ["UPLOADCARE_STORE", c ? "" : "auto"],
          ["UPLOADCARE_PUB_KEY", t],
          ["signature", o],
          ["expire", l],
          ["source", p],
        ]),
        signal: u,
      }).then(({ data: g, headers: v, request: w }) => {
        let m = I(JSON.parse(g));
        if ("error" in m)
          throw new A(m.error.content, m.error.errorCode, w, m, v);
        return (m.parts = Object.keys(m.parts).map((x) => m.parts[x])), m;
      }),
    f
  );
}
function He(r, t, { signal: e, onProgress: s }) {
  return R({ method: "PUT", url: t, data: r, onProgress: s, signal: e })
    .then((i) => (s && s({ value: 1 }), i))
    .then(({ status: i }) => ({ code: i }));
}
function Ge(
  r,
  {
    publicKey: t,
    baseURL: e = C.baseURL,
    source: s = "local",
    signal: i,
    integration: n,
    userAgent: o,
    retryThrottledRequestMaxTimes: l = C.retryThrottledRequestMaxTimes,
  }
) {
  return D(
    () =>
      R({
        method: "POST",
        url: M(e, "/multipart/complete/", { jsonerrors: 1 }),
        headers: {
          "X-UC-User-Agent": P({ publicKey: t, integration: n, userAgent: o }),
        },
        data: kt([
          ["uuid", r],
          ["UPLOADCARE_PUB_KEY", t],
          ["source", s],
        ]),
        signal: i,
      }).then(({ data: c, headers: u, request: p }) => {
        let d = I(JSON.parse(c));
        if ("error" in d)
          throw new A(d.error.content, d.error.errorCode, p, d, u);
        return d;
      }),
    l
  );
}
var W = class {
    constructor(t, { baseCDN: e, defaultEffects: s, fileName: i }) {
      (this.name = null),
        (this.size = null),
        (this.isStored = null),
        (this.isImage = null),
        (this.mimeType = null),
        (this.cdnUrl = null),
        (this.cdnUrlModifiers = null),
        (this.originalUrl = null),
        (this.originalFilename = null),
        (this.imageInfo = null),
        (this.videoInfo = null);
      let { uuid: n, s3Bucket: o } = t,
        l = o
          ? `https://${o}.s3.amazonaws.com/${n}/${t.filename}`
          : `${e}/${n}/`,
        c = s ? `-/${s}` : null,
        u = `${l}${c || ""}`,
        p = n ? l : null;
      (this.uuid = n),
        (this.name = i || t.filename),
        (this.size = t.size),
        (this.isStored = t.isStored),
        (this.isImage = t.isImage),
        (this.mimeType = t.mimeType),
        (this.cdnUrl = u),
        (this.cdnUrlModifiers = c),
        (this.originalUrl = p),
        (this.originalFilename = t.originalFilename),
        (this.imageInfo = I(t.imageInfo)),
        (this.videoInfo = I(t.videoInfo));
    }
  },
  We = 500,
  te = ({ check: r, interval: t = We, signal: e }) =>
    new Promise((s, i) => {
      let n;
      tt(e, () => {
        n && clearTimeout(n), i(St("Poll cancelled"));
      });
      let o = () => {
        try {
          Promise.resolve(r(e))
            .then((l) => {
              l ? s(l) : (n = setTimeout(o, t));
            })
            .catch((l) => i(l));
        } catch (l) {
          i(l);
        }
      };
      n = setTimeout(o, 0);
    });
function It({
  file: r,
  publicKey: t,
  baseURL: e,
  source: s,
  integration: i,
  userAgent: n,
  retryThrottledRequestMaxTimes: o,
  signal: l,
  onProgress: c,
}) {
  return te({
    check: (u) =>
      Zt(r, {
        publicKey: t,
        baseURL: e,
        signal: u,
        source: s,
        integration: i,
        userAgent: n,
        retryThrottledRequestMaxTimes: o,
      }).then((p) => (p.isReady ? p : (c && c({ value: 1 }), !1))),
    signal: l,
  });
}
var qe = (
    r,
    {
      publicKey: t,
      fileName: e,
      baseURL: s,
      secureSignature: i,
      secureExpire: n,
      store: o,
      signal: l,
      onProgress: c,
      source: u,
      integration: p,
      userAgent: d,
      retryThrottledRequestMaxTimes: b,
      baseCDN: f,
    }
  ) =>
    Ne(r, {
      publicKey: t,
      fileName: e,
      baseURL: s,
      secureSignature: i,
      secureExpire: n,
      store: o,
      signal: l,
      onProgress: c,
      source: u,
      integration: p,
      userAgent: d,
      retryThrottledRequestMaxTimes: b,
    })
      .then(({ file: g }) =>
        It({
          file: g,
          publicKey: t,
          baseURL: s,
          source: u,
          integration: p,
          userAgent: d,
          retryThrottledRequestMaxTimes: b,
          onProgress: c,
          signal: l,
        })
      )
      .then((g) => new W(g, { baseCDN: f })),
  { AbortController: Je, AbortSignal: Ds } =
    typeof self != "undefined"
      ? self
      : typeof window != "undefined"
      ? window
      : void 0,
  Ye = (r, { signal: t } = {}) => {
    let e = null,
      s = null,
      i = r.map(() => new Je()),
      n = (o) => () => {
        (s = o), i.forEach((l, c) => c !== o && l.abort());
      };
    return (
      tt(t, () => {
        i.forEach((o) => o.abort());
      }),
      Promise.all(
        r.map((o, l) => {
          let c = n(l);
          return Promise.resolve()
            .then(() => o({ stopRace: c, signal: i[l].signal }))
            .then((u) => (c(), u))
            .catch((u) => ((e = u), null));
        })
      ).then((o) => {
        if (s === null) throw e;
        return o[s];
      })
    );
  },
  Ke = window.WebSocket,
  ee = class {
    constructor() {
      this.events = Object.create({});
    }
    emit(t, e) {
      var s;
      (s = this.events[t]) === null || s === void 0 || s.forEach((i) => i(e));
    }
    on(t, e) {
      (this.events[t] = this.events[t] || []), this.events[t].push(e);
    }
    off(t, e) {
      e
        ? (this.events[t] = this.events[t].filter((s) => s !== e))
        : (this.events[t] = []);
    }
  },
  Qe = (r, t) =>
    Object.assign(
      r === "success"
        ? { status: E.Success }
        : r === "progress"
        ? { status: E.Progress }
        : { status: E.Error },
      t
    ),
  se = class {
    constructor(t, e = 3e4) {
      (this.ws = void 0),
        (this.queue = []),
        (this.isConnected = !1),
        (this.subscribers = 0),
        (this.emmitter = new ee()),
        (this.disconnectTimeoutId = null),
        (this.key = t),
        (this.disconnectTime = e);
    }
    connect() {
      if (
        (this.disconnectTimeoutId && clearTimeout(this.disconnectTimeoutId),
        !this.isConnected && !this.ws)
      ) {
        let t = `wss://ws.pusherapp.com/app/${this.key}?protocol=5&client=js&version=1.12.2`;
        (this.ws = new Ke(t)),
          this.ws.addEventListener("error", (e) => {
            this.emmitter.emit("error", new Error(e.message));
          }),
          this.emmitter.on("connected", () => {
            (this.isConnected = !0),
              this.queue.forEach((e) => this.send(e.event, e.data)),
              (this.queue = []);
          }),
          this.ws.addEventListener("message", (e) => {
            let s = JSON.parse(e.data.toString());
            switch (s.event) {
              case "pusher:connection_established": {
                this.emmitter.emit("connected", void 0);
                break;
              }
              case "pusher:ping": {
                this.send("pusher:pong", {});
                break;
              }
              case "progress":
              case "success":
              case "fail":
                this.emmitter.emit(s.channel, Qe(s.event, JSON.parse(s.data)));
            }
          });
      }
    }
    disconnect() {
      let t = () => {
        var e;
        (e = this.ws) === null || e === void 0 || e.close(),
          (this.ws = void 0),
          (this.isConnected = !1);
      };
      this.disconnectTime
        ? (this.disconnectTimeoutId = setTimeout(() => {
            t();
          }, this.disconnectTime))
        : t();
    }
    send(t, e) {
      var s;
      let i = JSON.stringify({ event: t, data: e });
      (s = this.ws) === null || s === void 0 || s.send(i);
    }
    subscribe(t, e) {
      (this.subscribers += 1), this.connect();
      let s = `task-status-${t}`,
        i = { event: "pusher:subscribe", data: { channel: s } };
      this.emmitter.on(s, e),
        this.isConnected ? this.send(i.event, i.data) : this.queue.push(i);
    }
    unsubscribe(t) {
      this.subscribers -= 1;
      let e = `task-status-${t}`,
        s = { event: "pusher:unsubscribe", data: { channel: e } };
      this.emmitter.off(e),
        this.isConnected
          ? this.send(s.event, s.data)
          : (this.queue = this.queue.filter((i) => i.data.channel !== e)),
        this.subscribers === 0 && this.disconnect();
    }
    onError(t) {
      return this.emmitter.on("error", t), () => this.emmitter.off("error", t);
    }
  },
  Ut = null,
  Bt = (r) => {
    if (!Ut) {
      let t = typeof window == "undefined" ? 0 : 3e4;
      Ut = new se(r, t);
    }
    return Ut;
  },
  Ze = (r) => {
    Bt(r).connect();
  };
function ts({
  token: r,
  publicKey: t,
  baseURL: e,
  integration: s,
  userAgent: i,
  retryThrottledRequestMaxTimes: n,
  onProgress: o,
  signal: l,
}) {
  return te({
    check: (c) =>
      Ve(r, {
        publicKey: t,
        baseURL: e,
        integration: s,
        userAgent: i,
        retryThrottledRequestMaxTimes: n,
        signal: c,
      }).then((u) => {
        switch (u.status) {
          case E.Error:
            return new A(u.error, u.errorCode);
          case E.Waiting:
            return !1;
          case E.Unknown:
            return new A(`Token "${r}" was not found.`);
          case E.Progress:
            return o && o({ value: u.done / u.total }), !1;
          case E.Success:
            return o && o({ value: u.done / u.total }), u;
          default:
            throw new Error("Unknown status");
        }
      }),
    signal: l,
  });
}
var es = ({ token: r, pusherKey: t, signal: e, onProgress: s }) =>
    new Promise((i, n) => {
      let o = Bt(t),
        l = o.onError(n),
        c = () => {
          l(), o.unsubscribe(r);
        };
      tt(e, () => {
        c(), n(St("pusher cancelled"));
      }),
        o.subscribe(r, (u) => {
          switch (u.status) {
            case E.Progress: {
              s && s({ value: u.done / u.total });
              break;
            }
            case E.Success: {
              c(), s && s({ value: u.done / u.total }), i(u);
              break;
            }
            case E.Error:
              c(), n(new A(u.msg, u.error_code));
          }
        });
    }),
  ss = (
    r,
    {
      publicKey: t,
      fileName: e,
      baseURL: s,
      baseCDN: i,
      checkForUrlDuplicates: n,
      saveUrlForRecurrentUploads: o,
      secureSignature: l,
      secureExpire: c,
      store: u,
      signal: p,
      onProgress: d,
      source: b,
      integration: f,
      userAgent: g,
      retryThrottledRequestMaxTimes: v,
      pusherKey: w = C.pusherKey,
    }
  ) =>
    Promise.resolve(Ze(w))
      .then(() =>
        Fe(r, {
          publicKey: t,
          fileName: e,
          baseURL: s,
          checkForUrlDuplicates: n,
          saveUrlForRecurrentUploads: o,
          secureSignature: l,
          secureExpire: c,
          store: u,
          signal: p,
          source: b,
          integration: f,
          userAgent: g,
          retryThrottledRequestMaxTimes: v,
        })
      )
      .catch((m) => {
        let x = Bt(w);
        return x == null || x.disconnect(), Promise.reject(m);
      })
      .then((m) =>
        m.type === $t.FileInfo
          ? m
          : Ye(
              [
                ({ signal: x }) =>
                  ts({
                    token: m.token,
                    publicKey: t,
                    baseURL: s,
                    integration: f,
                    userAgent: g,
                    retryThrottledRequestMaxTimes: v,
                    onProgress: d,
                    signal: x,
                  }),
                ({ signal: x }) =>
                  es({
                    token: m.token,
                    pusherKey: w,
                    signal: x,
                    onProgress: d,
                  }),
              ],
              { signal: p }
            )
      )
      .then((m) => {
        if (m instanceof A) throw m;
        return m;
      })
      .then((m) =>
        It({
          file: m.uuid,
          publicKey: t,
          baseURL: s,
          integration: f,
          userAgent: g,
          retryThrottledRequestMaxTimes: v,
          onProgress: d,
          signal: p,
        })
      )
      .then((m) => new W(m, { baseCDN: i })),
  is = (
    r,
    {
      publicKey: t,
      fileName: e,
      baseURL: s,
      signal: i,
      onProgress: n,
      source: o,
      integration: l,
      userAgent: c,
      retryThrottledRequestMaxTimes: u,
      baseCDN: p,
    }
  ) =>
    Zt(r, {
      publicKey: t,
      baseURL: s,
      signal: i,
      source: o,
      integration: l,
      userAgent: c,
      retryThrottledRequestMaxTimes: u,
    })
      .then((d) => new W(d, { baseCDN: p, fileName: e }))
      .then((d) => (n && n({ value: 1 }), d)),
  Rt = (r) =>
    r !== void 0 &&
    ((typeof Blob != "undefined" && r instanceof Blob) ||
      (typeof File != "undefined" && r instanceof File) ||
      (typeof Buffer != "undefined" && r instanceof Buffer)),
  rs = (r) => {
    let t = "[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}",
      e = new RegExp(t);
    return !Rt(r) && e.test(r);
  },
  ns = (r) => {
    let t = "^(?:\\w+:)?\\/\\/([^\\s\\.]+\\.\\S{2}|localhost[\\:?\\d]*)\\S*$",
      e = new RegExp(t);
    return !Rt(r) && e.test(r);
  },
  ie = (r) => r.length || r.size,
  os = (r, t = C.multipartMinFileSize) => r >= t,
  as = (r, t, e, s) => {
    let i = s * t,
      n = Math.min(i + s, e);
    return r.slice(i, n);
  };
function ls(r, t, e) {
  return (s) => as(r, s, t, e);
}
var cs = (r, t) =>
    new Promise((e, s) => {
      let i = [],
        n = !1,
        o = t.length,
        l = [...t],
        c = () => {
          let u = t.length - l.length,
            p = l.shift();
          p &&
            p()
              .then((d) => {
                n || ((i[u] = d), (o -= 1), o ? c() : e(i));
              })
              .catch((d) => {
                (n = !0), s(d);
              });
        };
      for (let u = 0; u < r; u++) c();
    }),
  us = (
    r,
    t,
    {
      publicKey: e,
      onProgress: s,
      signal: i,
      integration: n,
      multipartMaxAttempts: o,
    }
  ) =>
    Qt(({ attempt: l, retry: c }) =>
      He(r, t, {
        publicKey: e,
        onProgress: s,
        signal: i,
        integration: n,
      }).catch((u) => {
        if (l < o) return c();
        throw u;
      })
    ),
  hs = (
    r,
    {
      publicKey: t,
      fileName: e,
      fileSize: s,
      baseURL: i,
      secureSignature: n,
      secureExpire: o,
      store: l,
      signal: c,
      onProgress: u,
      source: p,
      integration: d,
      userAgent: b,
      retryThrottledRequestMaxTimes: f,
      contentType: g,
      multipartChunkSize: v = C.multipartChunkSize,
      maxConcurrentRequests: w = C.maxConcurrentRequests,
      multipartMaxAttempts: m = C.multipartMaxAttempts,
      baseCDN: x,
    }
  ) => {
    let O = s || ie(r),
      L,
      bt = (S, Y) => {
        if (!u) return;
        L || (L = Array(S).fill(0));
        let vt = (V) => V.reduce((K, he) => K + he, 0);
        return ({ value: V }) => {
          (L[Y] = V), u({ value: vt(L) / S });
        };
      };
    return ze(O, {
      publicKey: t,
      contentType: g,
      fileName: e != null ? e : r.name,
      baseURL: i,
      secureSignature: n,
      secureExpire: o,
      store: l,
      signal: c,
      source: p,
      integration: d,
      userAgent: b,
      retryThrottledRequestMaxTimes: f,
    })
      .then(({ uuid: S, parts: Y }) => {
        let vt = ls(r, O, v);
        return Promise.all([
          S,
          cs(
            w,
            Y.map(
              (V, K) => () =>
                us(vt(K), V, {
                  publicKey: t,
                  onProgress: bt(Y.length, K),
                  signal: c,
                  integration: d,
                  multipartMaxAttempts: m,
                })
            )
          ),
        ]);
      })
      .then(([S]) =>
        Ge(S, {
          publicKey: t,
          baseURL: i,
          source: p,
          integration: d,
          userAgent: b,
          retryThrottledRequestMaxTimes: f,
        })
      )
      .then((S) =>
        S.isReady
          ? S
          : It({
              file: S.uuid,
              publicKey: t,
              baseURL: i,
              source: p,
              integration: d,
              userAgent: b,
              retryThrottledRequestMaxTimes: f,
              onProgress: u,
              signal: c,
            })
      )
      .then((S) => new W(S, { baseCDN: x }));
  };
function N(
  r,
  {
    publicKey: t,
    fileName: e,
    baseURL: s = C.baseURL,
    secureSignature: i,
    secureExpire: n,
    store: o,
    signal: l,
    onProgress: c,
    source: u,
    integration: p,
    userAgent: d,
    retryThrottledRequestMaxTimes: b,
    contentType: f,
    multipartChunkSize: g,
    multipartMaxAttempts: v,
    maxConcurrentRequests: w,
    baseCDN: m = C.baseCDN,
    checkForUrlDuplicates: x,
    saveUrlForRecurrentUploads: O,
    pusherKey: L,
  }
) {
  if (Rt(r)) {
    let bt = ie(r);
    return os(bt)
      ? hs(r, {
          publicKey: t,
          contentType: f,
          multipartChunkSize: g,
          multipartMaxAttempts: v,
          fileName: e,
          baseURL: s,
          secureSignature: i,
          secureExpire: n,
          store: o,
          signal: l,
          onProgress: c,
          source: u,
          integration: p,
          userAgent: d,
          maxConcurrentRequests: w,
          retryThrottledRequestMaxTimes: b,
          baseCDN: m,
        })
      : qe(r, {
          publicKey: t,
          fileName: e,
          baseURL: s,
          secureSignature: i,
          secureExpire: n,
          store: o,
          signal: l,
          onProgress: c,
          source: u,
          integration: p,
          userAgent: d,
          retryThrottledRequestMaxTimes: b,
          baseCDN: m,
        });
  }
  if (ns(r))
    return ss(r, {
      publicKey: t,
      fileName: e,
      baseURL: s,
      baseCDN: m,
      checkForUrlDuplicates: x,
      saveUrlForRecurrentUploads: O,
      secureSignature: i,
      secureExpire: n,
      store: o,
      signal: l,
      onProgress: c,
      source: u,
      integration: p,
      userAgent: d,
      retryThrottledRequestMaxTimes: b,
      pusherKey: L,
    });
  if (rs(r))
    return is(r, {
      publicKey: t,
      fileName: e,
      baseURL: s,
      signal: l,
      onProgress: c,
      source: u,
      integration: p,
      userAgent: d,
      retryThrottledRequestMaxTimes: b,
      baseCDN: m,
    });
  throw new TypeError(`File uploading from "${r}" is not supported`);
}
var Ot = class {
    constructor() {
      h(this, "caption", "");
      h(this, "text", "");
      h(this, "iconName", "");
      h(this, "isError", !1);
    }
  },
  et = class extends a {
    constructor() {
      super(...arguments);
      h(this, "init$", {
        iconName: "info",
        captionTxt: "Message caption",
        msgTxt: "Message...",
        "*message": null,
        onClose: () => {
          this.$["*message"] = null;
        },
      });
    }
    initCallback() {
      this.sub("*message", (t) => {
        t
          ? (this.setAttribute("active", ""),
            this.set$({
              captionTxt: t.caption,
              msgTxt: t.text,
              iconName: t.isError ? "error" : "info",
            }),
            t.isError
              ? this.setAttribute("error", "")
              : this.removeAttribute("error"))
          : this.removeAttribute("active");
      });
    }
  };
et.template = `
<div class="heading">
  <uc-icon set="@name: iconName"></uc-icon>
  <div class="caption" set="textContent: captionTxt"></div>
  <button set="onclick: onClose">
    <uc-icon name="close"></uc-icon>
  </button>
</div>
<div class="msg" set="textContent: msgTxt"></div>
`;
var Lt = "data:image/svg+xml;base64,";
function re(r = "#fff", t = "rgba(0, 0, 0, .1)") {
  return (
    Lt +
    btoa(`<svg height="20" width="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="20" height="20" fill="${r}" />
    <rect x="0" y="0" width="10" height="10" fill="${t}" />
    <rect x="10" y="10" width="10" height="10" fill="${t}" />
  </svg>`)
  );
}
function ne(r = "rgba(0, 0, 0, .1)") {
  return (
    Lt +
    btoa(`<svg height="10" width="10" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
    <line x1="0" y1="10" x2="10" y2="0" stroke="${r}" />
  </svg>`)
  );
}
function oe() {
  return (
    Lt +
    btoa(`
    <svg width="36" height="36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#a)">
        <path d="m10 8.00298 11-.00029 5 4.99711v15.0027l-16 .0002V8.00298Z" fill="#fff"/>
      </g>
      <g filter="url(#b)">
        <path d="m21 8 5 5h-5V8Z" fill="#fff"/>
      </g>
      <defs>
        <filter id="a" x="8" y="6.50269" width="20" height="24" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy=".5"/>
          <feGaussianBlur stdDeviation="1"/>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0"/>
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2684_2129"/>
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_2684_2129" result="shape"/>
        </filter>
        <filter id="b" x="19" y="7" width="8" height="8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dx="-.5" dy=".5"/>
          <feGaussianBlur stdDeviation=".75"/>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
          <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_2684_2129"/>
          <feBlend in="SourceGraphic" in2="effect1_dropShadow_2684_2129" result="shape"/>
        </filter>
      </defs>
    </svg>`)
  );
}
var k = class extends a {
  constructor() {
    super(...arguments);
    h(this, "pauseRender", !0);
    h(this, "init$", {
      fileName: "",
      thumb: "",
      thumbUrl: "",
      progressWidth: 0,
      progressOpacity: 1,
      notImage: !0,
      badgeIcon: "check",
      "*focusedEntry": null,
      "*uploadTrigger": null,
      onEdit: () => {
        this.set$({
          "*focusedEntry": this.entry,
          "*currentActivity": a.activities.DETAILS,
        });
      },
      onRemove: () => {
        this.uploadCollection.remove(this.uid);
      },
      onUpload: () => {
        this.upload();
      },
    });
  }
  _observerCallback(t) {
    let [e] = t;
    e.intersectionRatio === 0
      ? (clearTimeout(this._thumbTimeoutId), (this._thumbTimeoutId = void 0))
      : this._thumbTimeoutId ||
        (this._thumbTimeoutId = setTimeout(
          () => this._generateThumbnail(),
          100
        ));
  }
  _generateThumbnail() {
    var t;
    this.$.thumbUrl ||
      (((t = this.file) == null ? void 0 : t.type.includes("image"))
        ? Jt(this.file, this.cfg("thumb-size") || 76).then((e) => {
            this.$.thumbUrl = `url(${e})`;
          })
        : (this.$.thumbUrl = `url(${oe()})`));
  }
  _revokeThumbUrl() {
    var t;
    ((t = this.$.thumbUrl) == null ? void 0 : t.startsWith("blob:")) &&
      URL.revokeObjectURL(this.$.thumbUrl);
  }
  initCallback() {
    this.defineAccessor("entry-id", (t) => {
      var e;
      !t ||
        ((this.uid = t),
        (this.entry = (e = this.uploadCollection) == null ? void 0 : e.read(t)),
        this.entry.subscribe("fileName", (s) => {
          this.$.fileName = s || this.l10n("file-no-name");
        }),
        this.entry.subscribe("uuid", (s) => {
          if (!s) return;
          this._observer.unobserve(this), this.setAttribute("loaded", "");
          let i = `https://ucarecdn.com/${s}/`;
          this._revokeThumbUrl();
          let n = this.cfg("thumb-size") || 76;
          this.$.thumbUrl = `url(${i}-/scale_crop/${n}x${n}/)`;
        }),
        this.entry.subscribe("transformationsUrl", (s) => {
          if (!s) return;
          this._revokeThumbUrl();
          let i = this.cfg("thumb-size") || 76;
          this.$.thumbUrl = `url(${s}-/scale_crop/${i}x${i}/)`;
        }),
        (this.file = this.entry.getValue("file")),
        this.cfg("confirm-upload") || this.upload(),
        (this._observer = new window.IntersectionObserver(
          this._observerCallback.bind(this),
          {
            root: this.parentElement,
            rootMargin: "50% 0px 50% 0px",
            threshold: [0, 1],
          }
        )),
        this._observer.observe(this));
    }),
      (this.$["*uploadTrigger"] = null),
      k.activeInstances.add(this),
      this.sub("*uploadTrigger", (t) => {
        !t || !this.isConnected || this.upload();
      }),
      (this.onclick = () => {
        k.activeInstances.forEach((t) => {
          t === this
            ? t.setAttribute("focused", "")
            : t.removeAttribute("focused");
        });
      });
  }
  destroyCallback() {
    k.activeInstances.delete(this),
      this._observer.unobserve(this),
      clearTimeout(this._thumbTimeoutId);
  }
  async upload() {
    if (this.hasAttribute("loaded") || this.entry.getValue("uuid")) return;
    (this.$.progressWidth = 0),
      this.removeAttribute("focused"),
      this.removeAttribute("error"),
      this.setAttribute("uploading", "");
    let t = {},
      e = this.cfg("store");
    e !== null && (t.store = !!e);
    try {
      let s = await N(this.file, {
        ...t,
        publicKey: this.cfg("pubkey"),
        onProgress: (i) => {
          let n = i.value * 100;
          (this.$.progressWidth = n + "%"),
            this.entry.setValue("uploadProgress", n);
        },
      });
      (this.$.progressOpacity = 0),
        this.setAttribute("loaded", ""),
        this.removeAttribute("uploading"),
        (this.$.badgeIcon = "badge-success"),
        this.entry.setMultipleValues({ uuid: s.uuid, uploadProgress: 100 });
    } catch (s) {
      this.setAttribute("error", ""), this.removeAttribute("uploading");
      let i = new Ot();
      (i.caption = this.l10n("upload-error") + ": " + this.file.name),
        (i.text = s),
        (i.isError = !0),
        this.set$({ badgeIcon: "badge-error", "*message": i }),
        this.entry.setValue("uploadErrorMsg", s);
    }
  }
};
k.template = `
<div
  class="thumb"
  set="style.backgroundImage: thumbUrl">
  <div class="badge">
    <uc-icon set="@name: badgeIcon"></uc-icon>
  </div>
</div>
<div class="file-name" set="textContent: fileName"></div>
<button class="edit-btn" set="onclick: onEdit;">
  <uc-icon name="edit-file"></uc-icon>
</button>
<button class="remove-btn" set="onclick: onRemove;">
  <uc-icon name="remove-file"></uc-icon>
</button>
<button class="upload-btn" set="onclick: onUpload;">
  <uc-icon name="upload"></uc-icon>
</button>
<div
  class="progress"
  set="style.width: progressWidth; style.opacity: progressOpacity">
</div>
`;
k.activeInstances = new Set();
k.bindAttributes({ "entry-id": null });
var st = class extends a {
  constructor() {
    super(...arguments);
    h(this, "init$", {
      "*modalActive": !1,
      "*modalHeaderHidden": !1,
      closeClicked: () => {
        this.$["*currentActivity"] = "";
      },
    });
  }
  initCallback() {
    this.sub("*currentActivity", (t) => {
      this.set$({ "*modalActive": !!t });
    }),
      this.sub("*uploadList", (t) => {
        !t.length &&
          this.$["*modalActive"] &&
          (this.$["*currentActivity"] = a.activities.SOURCE_SELECT);
      }),
      this.sub("*modalActive", (t) => {
        t ? this.setAttribute("active", "") : this.removeAttribute("active");
      }),
      this.hasAttribute("strokes") &&
        (this.style.backgroundImage = `url(${ne()})`);
  }
};
st.template = `
<div class="dialog">
  <div class="heading" set="@hidden: *modalHeaderHidden">
    <uc-activity-icon></uc-activity-icon>
    <uc-activity-caption></uc-activity-caption>
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
var it = class {
    constructor() {
      h(this, "captionL10nStr", "confirm-your-action");
      h(this, "messsageL10Str", "are-you-sure");
      h(this, "confirmL10nStr", "yes");
      h(this, "denyL10nStr", "no");
    }
    confirmAction() {
      console.log("Confirmed");
    }
    denyAction() {
      this.historyBack();
    }
  },
  rt = class extends a {
    constructor() {
      super(...arguments);
      h(this, "activityType", a.activities.CONFIRMATION);
      h(this, "_defaults", new it());
      h(this, "init$", {
        messageTxt: "",
        confirmBtnTxt: "",
        denyBtnTxt: "",
        "*confirmation": null,
        onConfirm: this._defaults.confirmAction,
        onDeny: this._defaults.denyAction.bind(this),
      });
    }
    initCallback() {
      super.initCallback(),
        this.set$({
          messageTxt: this.l10n(this._defaults.messsageL10Str),
          confirmBtnTxt: this.l10n(this._defaults.confirmL10nStr),
          denyBtnTxt: this.l10n(this._defaults.denyL10nStr),
        }),
        this.sub("*confirmation", (t) => {
          !t ||
            this.set$({
              "*modalHeaderHidden": !0,
              "*currentActivity": a.activities.CONFIRMATION,
              "*modalCaption": this.l10n(t.captionL10nStr),
              messageTxt: this.l10n(t.messsageL10Str),
              confirmBtnTxt: this.l10n(t.confirmL10nStr),
              denyBtnTxt: this.l10n(t.denyL10nStr),
              onDeny: () => {
                (this.$["*modalHeaderHidden"] = !1), t.denyAction();
              },
              onConfirm: () => {
                (this.$["*modalHeaderHidden"] = !1), t.confirmAction();
              },
            });
        });
    }
  };
rt.template = `
<div
  class="message"
  set="textContent: messageTxt">
</div>
<div class="toolbar">
  <button
    class="deny-btn secondary-btn"
    set="textContent: denyBtnTxt; onclick: onDeny">
  </button>
  <button
    class="confirm-btn primary-btn"
    set="textContent: confirmBtnTxt; onclick: onConfirm">
  </button>
</div>
`;
var nt = class extends a {
  constructor() {
    super(...arguments);
    h(this, "activityType", a.activities.UPLOAD_LIST);
    h(this, "init$", {
      doneBtnHidden: !0,
      uploadBtnHidden: !1,
      uploadBtnDisabled: !1,
      hasFiles: !1,
      moreBtnDisabled: !0,
      onAdd: () => {
        this.$["*currentActivity"] = a.activities.SOURCE_SELECT;
      },
      onUpload: () => {
        this.set$({ "*uploadTrigger": {} });
      },
      onDone: () => {
        this.set$({ "*currentActivity": "" }), this.output();
      },
      onCancel: () => {
        let t = new it();
        (t.confirmAction = () => {
          (this.$["*currentActivity"] = ""), this.uploadCollection.clearAll();
        }),
          (t.denyAction = () => {
            this.historyBack();
          }),
          (this.$["*confirmation"] = t);
      },
    });
    h(this, "_renderMap", Object.create(null));
  }
  initCallback() {
    this.registerActivity(this.activityType, () => {
      this.set$({
        "*modalCaption": this.l10n("selected"),
        "*modalIcon": "local",
      });
    }),
      (this.$.moreBtnDisabled = !this.cfg("multiple")),
      this.uploadCollection.observe(() => {
        let t = this.uploadCollection.findItems((n) => !n.getValue("uuid")),
          e = this.uploadCollection.findItems(
            (n) => !n.getValue("uuid") && n.getValue("uploadProgress") > 0
          ),
          s = t.length === 0,
          i = e.length > 0;
        this.set$({
          uploadBtnHidden: s,
          uploadBtnDisabled: i,
          doneBtnHidden: !s,
        }),
          !this.cfg("confirm-upload") && s && this.$.onDone();
      }),
      this.sub("*uploadList", (t) => {
        if (t.length === 0 && !this.cfg("show-empty-list")) {
          this.$["*currentActivity"] = a.activities.SOURCE_SELECT;
          return;
        }
        (this.$.hasFiles = t.length > 0),
          t.forEach((s) => {
            if (!this._renderMap[s]) {
              let i = new k();
              this._renderMap[s] = i;
            }
          });
        for (let s in this._renderMap)
          t.includes(s) ||
            (this._renderMap[s].remove(), delete this._renderMap[s]);
        let e = document.createDocumentFragment();
        Object.values(this._renderMap).forEach((s) => e.appendChild(s)),
          this.ref.files.replaceChildren(e),
          Object.entries(this._renderMap).forEach(([s, i]) => {
            setTimeout(() => {
              (i["entry-id"] = s), i.render();
            });
          });
      });
  }
};
nt.template = `
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
var ot = class extends a {
  constructor() {
    super(...arguments);
    h(this, "activityType", a.activities.URL);
    h(this, "init$", {
      onUpload: async () => {
        let t = this.ref.input.value,
          e = this.cfg("pubkey"),
          s = this.uploadCollection.add({ externalUrl: t }),
          i = await N(t, {
            publicKey: e,
            onProgress: (n) => {
              let o = n.value;
              s.setValue("uploadProgress", o);
            },
          });
        console.log(i),
          s.setMultipleValues({
            uuid: i.uuid,
            fileName: i.name,
            fileSize: i.size,
            isImage: i.isImage,
            mimeType: i.mimeType,
          }),
          (this.$["*currentActivity"] = a.activities.UPLOAD_LIST);
      },
      onCancel: () => {
        this.set$({ "*currentActivity": a.activities.SOURCE_SELECT });
      },
    });
  }
  initCallback() {
    this.registerActivity(this.activityType, () => {
      this.set$({
        "*modalCaption": this.l10n("caption-from-url"),
        "*modalIcon": "url",
      });
    });
  }
};
ot.template = `
<input placeholder="https://..." .url-input type="text" ref="input" />
<button 
  class="url-upload-btn primary-btn "
  set="onclick: onUpload">
</button>
<button
  class="cancel-btn secondary-btn"
  set="onclick: onCancel"
  l10n="cancel">
</button>
`;
var at = class extends a {
  constructor() {
    super(...arguments);
    h(this, "activityType", a.activities.CAMERA);
    h(this, "init$", {
      video: null,
      videoTransformCss: this.cfg("camera-mirror") ? "scaleX(-1)" : null,
      onCancel: () => {
        this.set$({ "*currentActivity": a.activities.SOURCE_SELECT });
      },
      onShot: () => {
        this._shot();
      },
    });
  }
  async _init() {
    let t = {
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        frameRate: { ideal: 30 },
      },
      audio: !1,
    };
    (this._canvas = document.createElement("canvas")),
      (this._ctx = this._canvas.getContext("2d")),
      (this._stream = await navigator.mediaDevices.getUserMedia(t)),
      (this.$.video = this._stream);
  }
  _shot() {
    (this._canvas.height = this.ref.video.videoHeight),
      (this._canvas.width = this.ref.video.videoWidth),
      this._ctx.drawImage(this.ref.video, 0, 0);
    let t = Date.now(),
      e = `camera-${t}.png`;
    this._canvas.toBlob((s) => {
      let i = new File([s], e, { lastModified: t, type: "image/png" });
      this.uploadCollection.add({
        file: i,
        fileName: e,
        fileSize: i.size,
        isImage: !0,
        mimeType: i.type,
      }),
        this.set$({ "*currentActivity": a.activities.UPLOAD_LIST });
    });
  }
  initCallback() {
    this.registerActivity(
      this.activityType,
      () => {
        this.set$({
          "*modalCaption": this.l10n("caption-camera"),
          "*modalIcon": "camera",
        });
      },
      () => {
        var t;
        (t = this._stream) == null || t.getTracks()[0].stop(),
          (this.$.video = null);
      }
    );
  }
};
at.template = `
<div .video-wrapper>
  <video
    autoplay
    playsinline
    set="srcObject: video; style.transform: videoTransformCss"
    ref="video">
  </video>
</div>
<div class="toolbar">
  <button
    class="cancel-btn secondary-btn"
    set="onclick: onCancel"
    l10n="cancel">
  </button>
  <button
    class="shot-btn primary-btn"
    set="onclick: onShot"
    l10n="camera-shot">
  </button>
</div>
`;
var lt = class extends a {
  constructor() {
    super(...arguments);
    h(this, "activityType", a.activities.DETAILS);
    h(this, "init$", {
      fileSize: 0,
      fileName: "",
      cdnUrl: "",
      errorTxt: "",
      editBtnHidden: !0,
      onNameInput: null,
      "*focusedEntry": null,
      onBack: () => {
        this.historyBack();
      },
      onRemove: () => {
        this.uploadCollection.remove(this.entry.__ctxId), this.historyBack();
      },
      onEdit: () => {
        this.entry.getValue("uuid") &&
          (this.$["*currentActivity"] = a.activities.CLOUD_IMG_EDIT);
      },
    });
  }
  initCallback() {
    this.registerActivity(this.activityType, () => {
      this.set$({ "*modalCaption": this.l10n("caption-edit-file") });
    }),
      (this.eCanvas = this.ref.canvas),
      this.sub("*focusedEntry", (t) => {
        if (!t) return;
        this._entrySubs
          ? this._entrySubs.forEach((i) => {
              this._entrySubs.delete(i), i.remove();
            })
          : (this._entrySubs = new Set()),
          (this.entry = t);
        let e = t.getValue("file");
        e &&
          ((this._file = e),
          this._file.type.includes("image") &&
            !t.getValue("transformationsUrl") &&
            (this.eCanvas.setImageFile(this._file),
            this.set$({ editBtnHidden: !1 })));
        let s = (i, n) => {
          this._entrySubs.add(this.entry.subscribe(i, n));
        };
        s("fileName", (i) => {
          (this.$.fileName = i),
            (this.$.onNameInput = () => {
              Object.defineProperty(this._file, "name", {
                writable: !0,
                value: this.ref.file_name_input.value,
              });
            });
        }),
          s("fileSize", (i) => {
            this.$.fileSize = i;
          }),
          s("uuid", (i) => {
            i
              ? (this.$.cdnUrl = `https://ucarecdn.com/${i}/`)
              : (this.$.cdnUrl = "Not uploaded yet...");
          }),
          s("uploadErrorMsg", (i) => {
            this.$.errorTxt = i;
          }),
          s("externalUrl", (i) => {
            !i ||
              (this.entry.getValue("isImage") &&
                !this.entry.getValue("transformationsUrl") &&
                this.eCanvas.setImageUrl(this.$.cdnUrl));
          }),
          s("transformationsUrl", (i) => {
            !i ||
              (this.entry.getValue("isImage") && this.eCanvas.setImageUrl(i));
          });
      });
  }
};
lt.template = `
<div .wrapper>
  <uc-tabs
    tab-list="tab-view, tab-details">
    <div 
      tab-ctx="tab-details"
      ref="details" 
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
        <div set="textContent: fileSize"></div>
      </div>

      <div class="info-block">
        <div class="info-block_name" l10n="cdn-url"></div>
        <a
          target="_blank"
          set="textContent: cdnUrl; @href: cdnUrl;"></a>
      </div>

      <div set="textContent: errorTxt;"></div>

    </div>

    <div tab-ctx="tab-view" ref="viewport" class="viewport">
      <uc-editable-canvas
        tab-ctx="tab-view"
        ref="canvas">
      </uc-editable-canvas>
    </div>
  </uc-tabs>

  <div class="toolbar">
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
</div>
`;
var ct = class extends a {
  constructor() {
    super(...arguments);
    h(this, "init$", { cssWidth: 0, "*commonProgress": 0 });
  }
  initCallback() {
    this.sub("*commonProgress", (t) => {
      t === 0 || t === 100
        ? this.removeAttribute("active")
        : this.setAttribute("active", ""),
        (this.$.cssWidth = t + "%");
    });
  }
};
ct.template = `
<div
  class="bar"
  set="style.width: cssWidth">
</div>
`;
var ae = "http://www.w3.org/2000/svg",
  F = class {
    _syncSvgSize() {
      let t = this.svgGroupEl.getBoundingClientRect();
      B(this.svgEl, {
        viewBox: `0, 0, ${t.width}, ${t.height}`,
        width: t.width,
        height: t.height,
      });
    }
    _syncCanvas() {
      return new Promise((t, e) => {
        let s = URL.createObjectURL(
          new Blob([this.svgEl.outerHTML], { type: "image/svg+xml" })
        );
        (this.vImg.onload = () => {
          (this.can.height = this.vImg.height),
            (this.can.width = this.vImg.width),
            this.ctx.drawImage(
              this.vImg,
              0,
              0,
              this.vImg.width,
              this.vImg.height
            ),
            t();
        }),
          (this.vImg.onerror = () => {
            e();
          }),
          (this.vImg.src = s);
      });
    }
    _backSyncSvg() {
      return (
        (this.svgGroupEl.style.transform = null),
        (this.svgGroupEl.style.filter = null),
        B(this.svgEl, {
          viewBox: `0, 0, ${this.can.width}, ${this.can.height}`,
          width: this.can.width,
          height: this.can.height,
        }),
        B(this.svgImgEl, {
          href: this.can.toDataURL("image/png"),
          width: this.can.width,
          height: this.can.height,
        }),
        this._addedObjects.forEach((t) => {
          t.remove();
        }),
        new Promise((t, e) => {
          (this.svgImgEl.onload = () => {
            t();
          }),
            (this.svgImgEl.onerror = () => {
              e();
            });
        })
      );
    }
    async _syncAll() {
      this._syncSvgSize(), await this._syncCanvas(), await this._backSyncSvg();
    }
    constructor(t) {
      (this.can = t.canvas),
        (this.svgEl = t.svg),
        (this.svgGroupEl = t.svgGroup),
        (this.svgImgEl = t.svgImg),
        (this.vImg = new Image()),
        (this.ctx = t.canvCtx),
        (this.currentColor = F.defaultColor),
        (this._addedObjects = new Set()),
        window.setTimeout(() => {
          this._backSyncSvg();
        }, 100);
    }
    applyCss(t) {
      z(this.svgGroupEl, t);
    }
    getImg() {
      let t = new Image();
      return (
        (t.src = this.can.toDataURL("image/png")),
        new Promise((e, s) => {
          (t.onload = () => {
            e(t);
          }),
            (t.onerror = () => {
              s(t);
            });
        })
      );
    }
    rotate() {
      this.applyCss({
        "transform-origin": "0 0",
        transform: `rotate(90deg) translateY(-${this.can.height}px)`,
      }),
        this._syncAll();
    }
    flip(t) {
      this.applyCss({
        "transform-origin": "50% 50%",
        transform: `scale(${t === "vertical" ? "1, -1" : "-1, 1"})`,
      }),
        this._syncAll();
    }
    brightness(t) {
      this.applyCss({ filter: `brightness(${t}%)` });
    }
    contrast(t) {
      this.applyCss({ filter: `contrast(${t}%)` });
    }
    saturate(t) {
      this.applyCss({ filter: `saturate(${t}%)` });
    }
    setColor(t) {
      this.currentColor = t;
    }
    startText() {
      let t = (e) => {
        let s = document.createElementNS(ae, "text");
        B(s, { fill: this.currentColor, x: e.offsetX, y: e.offsetY }),
          (s.textContent = "TEXT"),
          this.svgGroupEl.appendChild(s),
          this._addedObjects.add(s),
          s.focus(),
          this.svgEl.removeEventListener("mousedown", t);
      };
      this.svgEl.addEventListener("mousedown", t);
    }
    stopText() {
      this.bake();
    }
    startDraw() {
      this.svgEl.addEventListener("mousedown", (t) => {
        let e = document.createElementNS(ae, "polyline");
        B(e, {
          fill: "none",
          stroke: this.currentColor,
          "stroke-width": "4px",
        }),
          this.svgGroupEl.appendChild(e),
          this._addedObjects.add(e);
        let s = [];
        this.svgEl.onmousemove = (i) => {
          s.push(`${i.offsetX},${i.offsetY}`),
            e.setAttribute("points", s.join(" "));
        };
      }),
        window.addEventListener("mouseup", () => {
          (this.svgEl.onmousemove = null), this.bake();
        }),
        window.addEventListener("mouseleave", () => {
          (this.svgEl.onmousemove = null), this.bake();
        });
    }
    removeMode(t) {}
    resize() {}
    crop() {}
    bake() {
      this._syncAll();
    }
    restore() {}
  };
F.defaultColor = "#f00";
var ut = class extends a {
  constructor() {
    super(...arguments);
    h(this, "init$", {
      cssLeft: "50%",
      caption: "CAPTION",
      barActive: !1,
      "*rangeValue": 100,
      onChange: () => {
        this.$["*rangeValue"] = this.ref.range.value;
      },
    });
  }
  initCallback() {
    [...this.attributes].forEach((t) => {
      ["style", "ref"].includes(t.name) ||
        this.ref.range.setAttribute(t.name, t.value);
    }),
      this.sub("*rangeValue", (t) => {
        let e = (t / this.ref.range.max) * 100;
        this.$.cssLeft = `${e}%`;
      });
  }
};
ut.template = `
<datalist id="range-values">
  <option value="0" label="min"></option>
  <option value="100" label="0"></option>
  <option value="200" label="max"></option>
</datalist>
<div class="track">
  <div class="bar" set="style.width: cssLeft; @active: barActive"></div>
  <div class="slider" set="style.left: cssLeft"></div>
  <div class="center"></div>
  <div class="caption" set="textContent: caption; @text: caption"></div>
</div>
<input 
  type="range"
  ref="range"
  list="range-values" 
  set="@value: *rangeValue; oninput: onChange">
`;
var ht = class extends a {
  constructor() {
    super(...arguments);
    h(this, "init$", {
      inputOpacity: 0,
      "*selectedColor": "#f00",
      onChange: () => {
        this.$["*selectedColor"] = this.ref.input.value;
      },
    });
  }
};
ht.template = `
<input 
  ref="input"
  type="color" 
  set="oninput: onChange; style.opacity: inputOpacity">
<div 
  class="current-color"
  set="style.backgroundColor: *selectedColor">
</div>
`;
var ds = [
  {
    action: "fullscreen",
    icon: "",
    l10n_name: "toggle-fullscreen",
    set: "@name: fsIcon",
  },
  { action: "rotate_cw", icon: "edit-rotate", l10n_name: "rotate", set: "" },
  {
    action: "flip_v",
    icon: "edit-flip-v",
    l10n_name: "flip-vertical",
    set: "",
  },
  {
    action: "flip_h",
    icon: "edit-flip-h",
    l10n_name: "flip-horizontal",
    set: "",
  },
  {
    action: "brightness",
    icon: "edit-brightness",
    l10n_name: "brightness",
    set: "",
  },
  { action: "contrast", icon: "edit-contrast", l10n_name: "contrast", set: "" },
  {
    action: "saturation",
    icon: "edit-saturation",
    l10n_name: "saturation",
    set: "",
  },
  { clr: !0 },
  { action: "text", icon: "edit-text", l10n_name: "text", set: "" },
  { action: "draw", icon: "edit-draw", l10n_name: "draw", set: "" },
  { action: "cancel", icon: "close", l10n_name: "cancel-edit", set: "" },
];
function ps(r) {
  return `<button 
  action="${r.action}" 
  ref="${r.ref}"
  l10n="title:${r.l10n_name}">
  <uc-icon
    set="${r.set}" 
    name="${r.icon}">
  </uc-icon>
</button>`.trim();
}
var ms = `<uc-color 
  ref="color" 
  action="color"
  set="onchange: onColor" 
  l10n="title:select-color"></uc-color>`;
function le() {
  return ds.reduce((r, t) => (r += t.clr ? ms : ps(t)), "");
}
ut.reg("range");
ht.reg("color");
var jt = { FS: "fullscreen", EXIT: "fullscreen-exit" },
  dt = class extends a {
    constructor() {
      super(...arguments);
      h(this, "init$", {
        fsIcon: jt.FS,
        rangeActive: !1,
        rangeCaption: "",
        onBtnClick: (t) => {
          this.canMan.stopText(),
            (this.rangeCtx = null),
            this.set$({
              rangeActive: !1,
              rangeCaption: "",
              "*rangeValue": 100,
            });
          let e = t.target.closest("[action]");
          e &&
            (this.buttons.add(e),
            this.buttons.forEach((i) => {
              i === e
                ? i.setAttribute("current", "")
                : i.removeAttribute("current", "");
            }));
          let s = e.getAttribute("action");
          console.log(s), !!s && this.actionsMap[s]();
        },
      });
      h(this, "buttons", new Set());
      h(this, "editor", null);
    }
    get actionsMap() {
      return {
        fullscreen: () => {
          document.fullscreenElement === this.rMap.parent
            ? (document.exitFullscreen(), (this.$.fsIcon = jt.FS))
            : (this.rMap.parent.requestFullscreen(), (this.$.fsIcon = jt.EXIT));
        },
        rotate_cw: () => {
          this.canMan.rotate();
        },
        flip_v: () => {
          this.canMan.flip("vertical");
        },
        flip_h: () => {
          this.canMan.flip("horizontal");
        },
        brightness: () => {
          (this.rangeCtx = "brightness"),
            this.set$({
              rangeActive: !0,
              rangeCaption: this.l10n("brightness"),
            });
        },
        contrast: () => {
          (this.rangeCtx = "contrast"),
            this.set$({ rangeActive: !0, rangeCaption: this.l10n("contrast") });
        },
        saturation: () => {
          (this.rangeCtx = "saturate"),
            this.set$({
              rangeActive: !0,
              rangeCaption: this.l10n("saturation"),
            });
        },
        resize: () => {
          this.canMan.resize();
        },
        crop: () => {
          this.canMan.crop();
        },
        color: () => {
          this.ref.color.dispatchEvent(new MouseEvent("click"));
        },
        text: () => {
          this.canMan.startText();
        },
        draw: () => {
          this.canMan.startDraw();
        },
        cancel: () => {
          this.canMan.restore();
        },
      };
    }
    initCallback() {
      this.defineAccessor("refMap", (t) => {
        !t || ((this.rMap = t), (this.canMan = new F(t)), console.log(t));
      }),
        this.sub("*rangeValue", (t) => {
          var e, s;
          (s = (e = this.canMan) == null ? void 0 : e[this.rangeCtx]) == null ||
            s.call(e, t);
        }),
        this.sub("*selectedColor", (t) => {
          var e;
          (e = this.canMan) == null || e.setColor(t);
        });
    }
  };
dt.template = `
<div 
  class="btns"
  ref="btns" 
  set="onclick: onBtnClick">${le()}</div>
<uc-range 
  min="0" 
  max="200" 
  ref="range"
  set="@visible: rangeActive; $.caption: rangeCaption">
</uc-range>
`;
dt.reg("editor-toolbar");
var pt = class extends a {
  constructor() {
    super();
    h(this, "init$", { refMap: null });
    z(this, {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    });
  }
  initCallback() {
    (this.style.backgroundImage = `url(${re()})`),
      (this.canvas = this.ref.cvs),
      (this.canvCtx = this.canvas.getContext("2d")),
      (this.$.refMap = {
        parent: this,
        canvas: this.canvas,
        canvCtx: this.canvCtx,
        svg: this.ref.svg,
        svgGroup: this.ref.svg_g,
        svgImg: this.ref.svg_img,
      });
  }
  setImage(t) {
    t.height && t.width
      ? ((this.canvas.height = t.height),
        (this.canvas.width = t.width),
        this.canvCtx.drawImage(t, 0, 0, t.width, t.height))
      : (t.onload = () => {
          (this.canvas.height = t.height),
            (this.canvas.width = t.width),
            this.canvCtx.drawImage(t, 0, 0, t.width, t.height);
        });
  }
  setImageFile(t) {
    let e = new Image(),
      s = URL.createObjectURL(t);
    (e.src = s), this.setImage(e);
  }
  setImageUrl(t) {
    let e = new Image();
    (e.src = t), this.setImage(e);
  }
};
pt.template = `
<canvas class="img-view" ref="cvs"></canvas>
<svg class="img-view" xmlns="http://www.w3.org/2000/svg" ref="svg">
  <g ref="svg_g">
    <image ref="svg_img" x="0" y="0"></image>
  </g>
</svg>
<uc-editor-toolbar 
  set="refMap: refMap">
</uc-editor-toolbar>
`;
var fs =
    "https://ucarecdn.com/libs/editor/0.0.1-alpha.0.9/uploadcare-editor.js",
  Mt = class extends a {
    constructor() {
      super(...arguments);
      h(this, "activityType", a.activities.CLOUD_IMG_EDIT);
      h(this, "init$", { uuid: null });
    }
    loadScript() {
      let t = document.createElement("script");
      (t.src = fs),
        t.setAttribute("type", "module"),
        document.body.appendChild(t);
    }
    initCallback() {
      (this.style.display = "flex"),
        (this.style.position = "relative"),
        this.loadScript(),
        this.sub("*currentActivity", (t) => {
          t === a.activities.CLOUD_IMG_EDIT
            ? this.mountEditor()
            : this.unmountEditor();
        }),
        this.sub("*focusedEntry", (t) => {
          !t ||
            ((this.entry = t),
            this.entry.subscribe("uuid", (e) => {
              e && (this.$.uuid = e);
            }));
        });
    }
    handleApply(t) {
      let e = t.detail,
        { transformationsUrl: s } = e;
      this.entry.setValue("transformationsUrl", s), this.historyBack();
    }
    handleCancel() {
      this.historyBack();
    }
    mountEditor() {
      let t = window.customElements.get("uc-editor"),
        e = new t(),
        s = this.$.uuid,
        i = this.cfg("pubkey");
      e.setAttribute("uuid", s),
        e.setAttribute("public-key", i),
        e.addEventListener("apply", (n) => this.handleApply(n)),
        e.addEventListener("cancel", () => this.handleCancel()),
        (this.innerHTML = ""),
        (this.style.width = "600px"),
        (this.style.height = "400px"),
        this.appendChild(e);
    }
    unmountEditor() {
      (this.style.width = "0px"),
        (this.style.height = "0px"),
        (this.innerHTML = "");
    }
  };
var U = {};
window.addEventListener("message", (r) => {
  let t;
  try {
    t = JSON.parse(r.data);
  } catch (e) {
    return;
  }
  if ((t == null ? void 0 : t.type) in U) {
    let e = U[t.type];
    for (let [s, i] of e) r.source === s && i(t);
  }
});
var ce = function (r, t, e) {
    r in U || (U[r] = []), U[r].push([t, e]);
  },
  ue = function (r, t) {
    r in U && (U[r] = U[r].filter((e) => e[0] !== t));
  };
var gs = (r) =>
    Object.keys(r).reduce((e, s) => {
      let i = r[s],
        n = Object.keys(i).reduce((o, l) => {
          let c = i[l];
          return o + `${l}: ${c};`;
        }, "");
      return e + `${s}{${n}}`;
    }, ""),
  mt = class extends a {
    constructor() {
      super(...arguments);
      h(this, "activityType", a.activities.EXTERNAL);
      h(this, "init$", {
        counter: 0,
        onDone: () => {
          this.$["*currentActivity"] = a.activities.UPLOAD_LIST;
        },
        onCancel: () => {
          this.set$({ "*currentActivity": a.activities.SOURCE_SELECT });
        },
      });
      h(this, "_iframe", null);
    }
    initCallback() {
      this.registerActivity(
        this.activityType,
        () => {
          let { externalSourceType: t } = this.activityParams;
          this.set$({
            "*modalCaption": `${t[0].toUpperCase()}${t.slice(1)}`,
            "*modalIcon": t,
          }),
            (this.$.counter = 0),
            this.mountIframe();
        },
        () => {
          this.unmountIframe();
        }
      );
    }
    sendMessage(t) {
      this._iframe.contentWindow.postMessage(JSON.stringify(t), "*");
    }
    async handleFileSelected(t) {
      this.$.counter = this.$.counter + 1;
      let { url: e } = t,
        s = this.cfg("pubkey"),
        i = this.uploadCollection.add({ externalUrl: e }),
        n = await N(e, {
          publicKey: s,
          onProgress: (o) => {
            let l = o.value * 100;
            i.setValue("uploadProgress", l);
          },
        });
      console.log(n),
        i.setMultipleValues({
          uuid: n.uuid,
          fileName: n.name,
          fileSize: n.size,
          isImage: n.isImage,
          mimeType: n.mimeType,
        });
    }
    handleIframeLoad(t) {
      this.applyStyles();
    }
    getCssValue(t) {
      return window.getComputedStyle(this).getPropertyValue(t).trim();
    }
    applyStyles() {
      let t = {
        body: { color: this.getCssValue("--clr-txt") },
        ".side-bar": {
          "background-color": this.getCssValue("--clr-background-light"),
        },
        ".list-table-row": { color: this.getCssValue("--clr-txt") },
        ".list-table-row:hover": {
          background: this.getCssValue("--clr-shade-lv1"),
        },
      };
      this.sendMessage({ type: "embed-css", style: gs(t) });
    }
    remoteUrl() {
      let t = this.cfg("pubkey"),
        e = "3.11.3",
        s = (!1).toString(),
        { externalSourceType: i } = this.activityParams;
      return `https://social.uploadcare.com/window3/${i}?lang=en&public_key=${t}&widget_version=${e}&images_only=${s}&pass_window_open=false`;
    }
    mountIframe() {
      let t = document.createElement("iframe");
      t.addEventListener("load", this.handleIframeLoad.bind(this)),
        t.setAttribute("src", this.remoteUrl()),
        t.setAttribute("marginheight", "0"),
        t.setAttribute("marginwidth", "0"),
        t.setAttribute("frameborder", "0"),
        t.setAttribute("allowTransparency", "true");
      let e = this.ref["iframe-wrapper"];
      (e.innerHTML = ""),
        e.appendChild(t),
        ce(
          "file-selected",
          t.contentWindow,
          this.handleFileSelected.bind(this)
        ),
        (this._iframe = t);
    }
    unmountIframe() {
      ue("file-selected", this._iframe.contentWindow);
      let t = this.ref["iframe-wrapper"];
      (t.innerHTML = ""), (this._iframe = void 0);
    }
  };
mt.template = `
<div ref="iframe-wrapper" class="iframe-wrapper">
</div>
<div class="toolbar">
  <button
    class="cancel-btn secondary-btn"
    set="onclick: onCancel"
    l10n="cancel">
  </button>
  <div></div>
  <div class="selected-counter">
    <span l10n="selected-count"></span>
    <span set="textContent: counter"></span>
  </div>
  <button class="done-btn primary-btn" set="onclick: onDone">
    <uc-icon name="check"></uc-icon>
  </button>
</div>
`;
var q = class extends a {
  setCurrentTab(t) {
    if (!t) return;
    [...this.ref.context.querySelectorAll("[tab-ctx]")].forEach((s) => {
      s.getAttribute("tab-ctx") === t
        ? s.removeAttribute("hidden")
        : s.setAttribute("hidden", "");
    });
    for (let s in this._tabMap)
      s === t
        ? this._tabMap[s].setAttribute("current", "")
        : this._tabMap[s].removeAttribute("current");
  }
  initCallback() {
    (this._tabMap = {}),
      this.defineAccessor("tab-list", (t) => {
        if (!t) return;
        t.split(",")
          .map((s) => s.trim())
          .forEach((s) => {
            let i = Ct({
              tag: "div",
              attributes: { class: "tab" },
              properties: {
                onclick: () => {
                  this.setCurrentTab(s);
                },
              },
            });
            (i.textContent = this.l10n(s)),
              this.ref.row.appendChild(i),
              (this._tabMap[s] = i);
          });
      }),
      this.defineAccessor("default", (t) => {
        this.setCurrentTab(t);
      }),
      this.hasAttribute("default") ||
        this.setCurrentTab(Object.keys(this._tabMap)[0]);
  }
};
q.bindAttributes({ "tab-list": null, default: null });
q.template = `
<div ref="row" class="tabs-row"></div>
<div ref="context" class="tabs-context">
  <slot></slot>
</div>
`;
var T = class extends a {
  initCallback() {
    let t = this.getAttribute("from");
    this.sub(t || T.defaultFrom, (e) => {
      if (!e) {
        this.innerHTML = "";
        return;
      }
      if (
        (this.hasAttribute(T.fireEventAttrName) &&
          this.dispatchEvent(
            new CustomEvent(T.outputEventName, {
              bubbles: !0,
              composed: !0,
              detail: { timestamp: Date.now(), ctxName: this.ctxName, data: e },
            })
          ),
        this.hasAttribute(T.templateAttrName))
      ) {
        let s = this.getAttribute(T.templateAttrName),
          i = "";
        e.forEach((n) => {
          let o = s;
          for (let l in n) o = o.split(`{{${l}}}`).join(n[l]);
          i += o;
        }),
          (this.innerHTML = i);
      }
      (this.value = e),
        this.hasAttribute(T.formValueAttrName) &&
          (this._input ||
            ((this._input = document.createElement("input")),
            (this._input.type = "text"),
            this.appendChild(this._input)),
          (this._input.value = JSON.stringify(e)));
    });
  }
};
T.outputEventName = "data-output";
T.templateAttrName = "item-template";
T.fireEventAttrName = "fire-event";
T.formValueAttrName = "form-value";
T.defaultFrom = "*outputData";
var ft = class extends a {
  constructor() {
    super(...arguments);
    h(this, "init$", { "*modalCaption": void 0 });
  }
};
ft.template = `
<div
  class="caption"
  set="textContent: *modalCaption">
</div>
`;
var gt = class extends a {
  constructor() {
    super(...arguments);
    h(this, "init$", { "*modalIcon": "default" });
  }
};
gt.template = `
<uc-icon set="@name: *modalIcon"></uc-icon>
`;
var J = class extends X.BlockComponent {};
J.template = `
<uc-simple-btn></uc-simple-btn>

<uc-modal strokes>
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
</uc-modal>

<uc-message-box></uc-message-box>
<uc-progress-bar></uc-progress-bar>
`;
J.reg("default-widget");
function bs() {
  var r, t;
  for (let e in X) {
    let s = [...e].reduce(
      (i, n) => (
        n.toUpperCase() === n && (n = "-" + n.toLowerCase()), (i += n)
      ),
      ""
    );
    s.startsWith("-") && (s = s.replace("-", "")),
      (t = (r = X[e]).reg) == null || t.call(r, s);
  }
}
typeof window != "undefined" && bs();
export { X as UC, bs as registerBlocks };
