! function(e) {
    var t = {};

    function n(r) {
        if (t[r]) return t[r].exports;
        var o = t[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return e[r].call(o.exports, o, o.exports, n), o.l = !0, o.exports
    }
    n.m = e, n.c = t, n.d = function(e, t, r) {
        n.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: r
        })
    }, n.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    }, n.t = function(e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var r = Object.create(null);
        if (n.r(r), Object.defineProperty(r, "default", {
                enumerable: !0,
                value: e
            }), 2 & t && "string" != typeof e)
            for (var o in e) n.d(r, o, function(t) {
                return e[t]
            }.bind(null, o));
        return r
    }, n.n = function(e) {
        var t = e && e.__esModule ? function() {
            return e.default
        } : function() {
            return e
        };
        return n.d(t, "a", t), t
    }, n.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }, n.p = "", n(n.s = 5)
}([function(e, t, n) {
    e.exports = n(6)
}, function(e, t) {
    function n(e, t, n, r, o, i, a) {
        try {
            var u = e[i](a),
                c = u.value
        } catch (e) {
            return void n(e)
        }
        u.done ? t(c) : Promise.resolve(c).then(r, o)
    }
    e.exports = function(e) {
        return function() {
            var t = this,
                r = arguments;
            return new Promise((function(o, i) {
                var a = e.apply(t, r);

                function u(e) {
                    n(a, o, i, u, c, "next", e)
                }

                function c(e) {
                    n(a, o, i, u, c, "throw", e)
                }
                u(void 0)
            }))
        }
    }
}, function(e, t) {
    e.exports = function(e, t, n) {
        return t in e ? Object.defineProperty(e, t, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : e[t] = n, e
    }
}, function(e, t) {
    e.exports = OSjs
}, function(e) {
    e.exports = JSON.parse('{"a":"FileManager"}')
}, function(e, t, n) {
    e.exports = n(8)
}, function(e, t, n) {
    var r = function(e) {
        "use strict";
        var t = Object.prototype,
            n = t.hasOwnProperty,
            r = "function" == typeof Symbol ? Symbol : {},
            o = r.iterator || "@@iterator",
            i = r.asyncIterator || "@@asyncIterator",
            a = r.toStringTag || "@@toStringTag";

        function u(e, t, n, r) {
            var o = t && t.prototype instanceof l ? t : l,
                i = Object.create(o.prototype),
                a = new b(r || []);
            return i._invoke = function(e, t, n) {
                var r = "suspendedStart";
                return function(o, i) {
                    if ("executing" === r) throw new Error("Generator is already running");
                    if ("completed" === r) {
                        if ("throw" === o) throw i;
                        return R()
                    }
                    for (n.method = o, n.arg = i;;) {
                        var a = n.delegate;
                        if (a) {
                            var u = E(a, n);
                            if (u) {
                                if (u === s) continue;
                                return u
                            }
                        }
                        if ("next" === n.method) n.sent = n._sent = n.arg;
                        else if ("throw" === n.method) {
                            if ("suspendedStart" === r) throw r = "completed", n.arg;
                            n.dispatchException(n.arg)
                        } else "return" === n.method && n.abrupt("return", n.arg);
                        r = "executing";
                        var l = c(e, t, n);
                        if ("normal" === l.type) {
                            if (r = n.done ? "completed" : "suspendedYield", l.arg === s) continue;
                            return {
                                value: l.arg,
                                done: n.done
                            }
                        }
                        "throw" === l.type && (r = "completed", n.method = "throw", n.arg = l.arg)
                    }
                }
            }(e, n, a), i
        }

        function c(e, t, n) {
            try {
                return {
                    type: "normal",
                    arg: e.call(t, n)
                }
            } catch (e) {
                return {
                    type: "throw",
                    arg: e
                }
            }
        }
        e.wrap = u;
        var s = {};

        function l() {}

        function f() {}

        function d() {}
        var h = {};
        h[o] = function() {
            return this
        };
        var p = Object.getPrototypeOf,
            m = p && p(p(w([])));
        m && m !== t && n.call(m, o) && (h = m);
        var v = d.prototype = l.prototype = Object.create(h);

        function g(e) {
            ["next", "throw", "return"].forEach((function(t) {
                e[t] = function(e) {
                    return this._invoke(t, e)
                }
            }))
        }

        function y(e) {
            var t;
            this._invoke = function(r, o) {
                function i() {
                    return new Promise((function(t, i) {
                        ! function t(r, o, i, a) {
                            var u = c(e[r], e, o);
                            if ("throw" !== u.type) {
                                var s = u.arg,
                                    l = s.value;
                                return l && "object" == typeof l && n.call(l, "__await") ? Promise.resolve(l.__await).then((function(e) {
                                    t("next", e, i, a)
                                }), (function(e) {
                                    t("throw", e, i, a)
                                })) : Promise.resolve(l).then((function(e) {
                                    s.value = e, i(s)
                                }), (function(e) {
                                    return t("throw", e, i, a)
                                }))
                            }
                            a(u.arg)
                        }(r, o, t, i)
                    }))
                }
                return t = t ? t.then(i, i) : i()
            }
        }

        function E(e, t) {
            var n = e.iterator[t.method];
            if (void 0 === n) {
                if (t.delegate = null, "throw" === t.method) {
                    if (e.iterator.return && (t.method = "return", t.arg = void 0, E(e, t), "throw" === t.method)) return s;
                    t.method = "throw", t.arg = new TypeError("The iterator does not provide a 'throw' method")
                }
                return s
            }
            var r = c(n, e.iterator, t.arg);
            if ("throw" === r.type) return t.method = "throw", t.arg = r.arg, t.delegate = null, s;
            var o = r.arg;
            return o ? o.done ? (t[e.resultName] = o.value, t.next = e.nextLoc, "return" !== t.method && (t.method = "next", t.arg = void 0), t.delegate = null, s) : o : (t.method = "throw", t.arg = new TypeError("iterator result is not an object"), t.delegate = null, s)
        }

        function L(e) {
            var t = {
                tryLoc: e[0]
            };
            1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
        }

        function _(e) {
            var t = e.completion || {};
            t.type = "normal", delete t.arg, e.completion = t
        }

        function b(e) {
            this.tryEntries = [{
                tryLoc: "root"
            }], e.forEach(L, this), this.reset(!0)
        }

        function w(e) {
            if (e) {
                var t = e[o];
                if (t) return t.call(e);
                if ("function" == typeof e.next) return e;
                if (!isNaN(e.length)) {
                    var r = -1,
                        i = function t() {
                            for (; ++r < e.length;)
                                if (n.call(e, r)) return t.value = e[r], t.done = !1, t;
                            return t.value = void 0, t.done = !0, t
                        };
                    return i.next = i
                }
            }
            return {
                next: R
            }
        }

        function R() {
            return {
                value: void 0,
                done: !0
            }
        }
        return f.prototype = v.constructor = d, d.constructor = f, d[a] = f.displayName = "GeneratorFunction", e.isGeneratorFunction = function(e) {
            var t = "function" == typeof e && e.constructor;
            return !!t && (t === f || "GeneratorFunction" === (t.displayName || t.name))
        }, e.mark = function(e) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(e, d) : (e.__proto__ = d, a in e || (e[a] = "GeneratorFunction")), e.prototype = Object.create(v), e
        }, e.awrap = function(e) {
            return {
                __await: e
            }
        }, g(y.prototype), y.prototype[i] = function() {
            return this
        }, e.AsyncIterator = y, e.async = function(t, n, r, o) {
            var i = new y(u(t, n, r, o));
            return e.isGeneratorFunction(n) ? i : i.next().then((function(e) {
                return e.done ? e.value : i.next()
            }))
        }, g(v), v[a] = "Generator", v[o] = function() {
            return this
        }, v.toString = function() {
            return "[object Generator]"
        }, e.keys = function(e) {
            var t = [];
            for (var n in e) t.push(n);
            return t.reverse(),
                function n() {
                    for (; t.length;) {
                        var r = t.pop();
                        if (r in e) return n.value = r, n.done = !1, n
                    }
                    return n.done = !0, n
                }
        }, e.values = w, b.prototype = {
            constructor: b,
            reset: function(e) {
                if (this.prev = 0, this.next = 0, this.sent = this._sent = void 0, this.done = !1, this.delegate = null, this.method = "next", this.arg = void 0, this.tryEntries.forEach(_), !e)
                    for (var t in this) "t" === t.charAt(0) && n.call(this, t) && !isNaN(+t.slice(1)) && (this[t] = void 0)
            },
            stop: function() {
                this.done = !0;
                var e = this.tryEntries[0].completion;
                if ("throw" === e.type) throw e.arg;
                return this.rval
            },
            dispatchException: function(e) {
                if (this.done) throw e;
                var t = this;

                function r(n, r) {
                    return a.type = "throw", a.arg = e, t.next = n, r && (t.method = "next", t.arg = void 0), !!r
                }
                for (var o = this.tryEntries.length - 1; o >= 0; --o) {
                    var i = this.tryEntries[o],
                        a = i.completion;
                    if ("root" === i.tryLoc) return r("end");
                    if (i.tryLoc <= this.prev) {
                        var u = n.call(i, "catchLoc"),
                            c = n.call(i, "finallyLoc");
                        if (u && c) {
                            if (this.prev < i.catchLoc) return r(i.catchLoc, !0);
                            if (this.prev < i.finallyLoc) return r(i.finallyLoc)
                        } else if (u) {
                            if (this.prev < i.catchLoc) return r(i.catchLoc, !0)
                        } else {
                            if (!c) throw new Error("try statement without catch or finally");
                            if (this.prev < i.finallyLoc) return r(i.finallyLoc)
                        }
                    }
                }
            },
            abrupt: function(e, t) {
                for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                    var o = this.tryEntries[r];
                    if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
                        var i = o;
                        break
                    }
                }
                i && ("break" === e || "continue" === e) && i.tryLoc <= t && t <= i.finallyLoc && (i = null);
                var a = i ? i.completion : {};
                return a.type = e, a.arg = t, i ? (this.method = "next", this.next = i.finallyLoc, s) : this.complete(a)
            },
            complete: function(e, t) {
                if ("throw" === e.type) throw e.arg;
                return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), s
            },
            finish: function(e) {
                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                    var n = this.tryEntries[t];
                    if (n.finallyLoc === e) return this.complete(n.completion, n.afterLoc), _(n), s
                }
            },
            catch: function(e) {
                for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                    var n = this.tryEntries[t];
                    if (n.tryLoc === e) {
                        var r = n.completion;
                        if ("throw" === r.type) {
                            var o = r.arg;
                            _(n)
                        }
                        return o
                    }
                }
                throw new Error("illegal catch attempt")
            },
            delegateYield: function(e, t, n) {
                return this.delegate = {
                    iterator: w(e),
                    resultName: t,
                    nextLoc: n
                }, "next" === this.method && (this.arg = void 0), s
            }
        }, e
    }(e.exports);
    try {
        regeneratorRuntime = r
    } catch (e) {
        Function("r", "regeneratorRuntime = r")(r)
    }
}, function(e, t, n) {}, function(e, t, n) {
    "use strict";
    n.r(t);
    var r = {};
    n.r(r), n.d(r, "en_EN", (function() {
        return p
    })), n.d(r, "nb_NO", (function() {
        return m
    })), n.d(r, "vi_VN", (function() {
        return v
    })), n.d(r, "pt_BR", (function() {
        return g
    })), n.d(r, "fr_FR", (function() {
        return y
    }));
    var o = n(2),
        i = n.n(o),
        a = n(0),
        u = n.n(a),
        c = n(1),
        s = n.n(c),
        l = n(3),
        f = n.n(l);

    function d(e, t) {
        for (var n = [], r = [], o = arguments.length; o-- > 2;) n.push(arguments[o]);
        for (; n.length;) {
            var i = n.pop();
            if (i && i.pop)
                for (o = i.length; o--;) n.push(i[o]);
            else null != i && !0 !== i && !1 !== i && r.push(i)
        }
        return "function" == typeof e ? e(t || {}, r) : {
            nodeName: e,
            attributes: t || {},
            children: r,
            key: t && t.key
        }
    }

    function h(e, t, n, r) {
        var o, i = [].map,
            a = r && r.children[0] || null,
            u = a && function e(t) {
                return {
                    nodeName: t.nodeName.toLowerCase(),
                    attributes: {},
                    children: i.call(t.childNodes, (function(t) {
                        return 3 === t.nodeType ? t.nodeValue : e(t)
                    }))
                }
            }(a),
            c = [],
            s = !0,
            l = m(e),
            f = function e(t, n, r) {
                for (var o in r) "function" == typeof r[o] ? function(e, o) {
                    r[e] = function(e) {
                        var i = o(e);
                        return "function" == typeof i && (i = i(g(t, l), r)), i && i !== (n = g(t, l)) && !i.then && p(l = v(t, m(n, i), l)), i
                    }
                }(o, r[o]) : e(t.concat(o), n[o] = m(n[o]), r[o] = m(r[o]));
                return r
            }([], l, m(t));
        return p(), f;

        function d(e) {
            return "function" == typeof e ? d(e(l, f)) : null != e ? e : ""
        }

        function h() {
            o = !o;
            var e = d(n);
            for (r && !o && (a = function e(t, n, r, o, i) {
                    if (o === r);
                    else if (null == r || r.nodeName !== o.nodeName) {
                        var a = function e(t, n) {
                            var r = "string" == typeof t || "number" == typeof t ? document.createTextNode(t) : (n = n || "svg" === t.nodeName) ? document.createElementNS("http://www.w3.org/2000/svg", t.nodeName) : document.createElement(t.nodeName),
                                o = t.attributes;
                            if (o) {
                                o.oncreate && c.push((function() {
                                    o.oncreate(r)
                                }));
                                for (var i = 0; i < t.children.length; i++) r.appendChild(e(t.children[i] = d(t.children[i]), n));
                                for (var a in o) L(r, a, o[a], null, n)
                            }
                            return r
                        }(o, i);
                        t.insertBefore(a, n), null != r && _(t, n, r), n = a
                    } else if (null == r.nodeName) n.nodeValue = o;
                    else {
                        ! function(e, t, n, r) {
                            for (var o in m(t, n)) n[o] !== ("value" === o || "checked" === o ? e[o] : t[o]) && L(e, o, n[o], t[o], r);
                            var i = s ? n.oncreate : n.onupdate;
                            i && c.push((function() {
                                i(e, t)
                            }))
                        }(n, r.attributes, o.attributes, i = i || "svg" === o.nodeName);
                        for (var u = {}, l = {}, f = [], h = r.children, p = o.children, v = 0; v < h.length; v++) {
                            f[v] = n.childNodes[v], null != (E = y(h[v])) && (u[E] = [f[v], h[v]])
                        }
                        v = 0;
                        for (var g = 0; g < p.length;) {
                            var E = y(h[v]),
                                b = y(p[g] = d(p[g]));
                            if (l[E]) v++;
                            else if (null == b || b !== y(h[v + 1]))
                                if (null == b || s) null == E && (e(n, f[v], h[v], p[g], i), g++), v++;
                                else {
                                    var w = u[b] || [];
                                    E === b ? (e(n, w[0], w[1], p[g], i), v++) : w[0] ? e(n, n.insertBefore(w[0], f[v]), w[1], p[g], i) : e(n, f[v], null, p[g], i), l[b] = p[g], g++
                                }
                            else null == E && _(n, f[v], h[v]), v++
                        }
                        for (; v < h.length;) null == y(h[v]) && _(n, f[v], h[v]), v++;
                        for (var v in u) l[v] || _(n, u[v][0], u[v][1])
                    }
                    return n
                }(r, a, u, u = e)), s = !1; c.length;) c.pop()()
        }

        function p() {
            o || (o = !0, setTimeout(h))
        }

        function m(e, t) {
            var n = {};
            for (var r in e) n[r] = e[r];
            for (var r in t) n[r] = t[r];
            return n
        }

        function v(e, t, n) {
            var r = {};
            return e.length ? (r[e[0]] = e.length > 1 ? v(e.slice(1), t, n[e[0]]) : t, m(n, r)) : t
        }

        function g(e, t) {
            for (var n = 0; n < e.length;) t = t[e[n++]];
            return t
        }

        function y(e) {
            return e ? e.key : null
        }

        function E(e) {
            return e.currentTarget.events[e.type](e)
        }

        function L(e, t, n, r, o) {
            if ("key" === t);
            else if ("style" === t)
                if ("string" == typeof n) e.style.cssText = n;
                else
                    for (var i in "string" == typeof r && (r = e.style.cssText = ""), m(r, n)) {
                        var a = null == n || null == n[i] ? "" : n[i];
                        "-" === i[0] ? e.style.setProperty(i, a) : e.style[i] = a
                    } else "o" === t[0] && "n" === t[1] ? (t = t.slice(2), e.events ? r || (r = e.events[t]) : e.events = {}, e.events[t] = n, n ? r || e.addEventListener(t, E) : e.removeEventListener(t, E)) : t in e && "list" !== t && "type" !== t && "draggable" !== t && "spellcheck" !== t && "translate" !== t && !o ? e[t] = null == n ? "" : n : null != n && !1 !== n && e.setAttribute(t, n), null != n && !1 !== n || e.removeAttribute(t)
        }

        function _(e, t, n) {
            function r() {
                e.removeChild(function e(t, n) {
                    var r = n.attributes;
                    if (r) {
                        for (var o = 0; o < n.children.length; o++) e(t.childNodes[o], n.children[o]);
                        r.ondestroy && r.ondestroy(t)
                    }
                    return t
                }(t, n))
            }
            var o = n.attributes && n.attributes.onremove;
            o ? o(t, r) : r()
        }
    }
    n(7);
    var p = {
            LBL_SHOW_HIDDEN_FILES: "Show hidden files",
            LBL_MINIMALISTIC: "Minimalistic",
            LBL_OPEN_WITH: "Open with...",
            LBL_SHOW_DATE: "Show date column",
            LBL_STATUS: "{0} directories, {1} files, {2} bytes total",
            LBL_DATE: "Date",
            LBL_LOADING: "Loading {0}",
            DIALOG_MKDIR_MESSAGE: "Create new directory",
            DIALOG_MKDIR_PLACEHOLDER: "New directory",
            DIALOG_RENAME_MESSAGE: "Rename {0} ?",
            DIALOG_DELETE_MESSAGE: "Delete {0} ?",
            MSG_ERROR: "An error occurred",
            MSG_UPLOAD_ERROR: "Failed to upload file(s)",
            MSG_READDIR_ERROR: "An error occurred while reading directory: {0}",
            MSG_PASTE_ERROR: "Failed to paste file(s)",
            MSG_MKDIR_ERROR: "Failed to create directory",
            MSG_RENAME_ERROR: "Failed to rename",
            MSG_DELETE_ERROR: "Failed to delete"
        },
        m = {
            LBL_SHOW_HIDDEN_FILES: "Vis skjulte filer",
            LBL_MINIMALISTIC: "Minimalistisk",
            LBL_OPEN_WITH: "Åpne med...",
            LBL_SHOW_DATE: "Vis dato kolonne",
            LBL_STATUS: "{0} mapper, {1} filer, {2} bytes totalt",
            LBL_DATE: "Dato",
            LBL_LOADING: "Laster {0}",
            DIALOG_MKDIR_MESSAGE: "Lag ny mappe",
            DIALOG_MKDIR_PLACEHOLDER: "Ny mappe",
            DIALOG_RENAME_MESSAGE: "Omdøpe {0} ?",
            DIALOG_DELETE_MESSAGE: "Slette {0} ?",
            MSG_ERROR: "En feil oppstod",
            MSG_UPLOAD_ERROR: "Feil under opplasting av fil(er)",
            MSG_READDIR_ERROR: "En feil oppstod under lesing av mappe: {0}",
            MSG_PASTE_ERROR: "Feil oppstod under liming av fil(er)",
            MSG_MKDIR_ERROR: "Feil oppstod under opprettelse av mappe",
            MSG_RENAME_ERROR: "Feil oppstod under omdøping",
            MSG_DELETE_ERROR: "Feil oppstod under sletting"
        },
        v = {
            LBL_SHOW_HIDDEN_FILES: "Hiển thị tập tin ẩn",
            LBL_MINIMALISTIC: "Tối giản",
            LBL_OPEN_WITH: "Mở bằng...",
            LBL_SHOW_DATE: "Hiện cột thời gian",
            LBL_STATUS: "{0} thư mục, {1} tập tin, tổng dung lượng {2} bytes",
            LBL_DATE: "Thời gian",
            LBL_LOADING: "Đang tải {0}",
            DIALOG_MKDIR_MESSAGE: "Tạo thư mục mới",
            DIALOG_MKDIR_PLACEHOLDER: "Thư mục mới",
            DIALOG_RENAME_MESSAGE: "Đổi tên {0} ?",
            DIALOG_DELETE_MESSAGE: "Xoá {0} ?",
            MSG_ERROR: "Đã xảy ra lỗi",
            MSG_UPLOAD_ERROR: "Không thể tải lên tập tin",
            MSG_READDIR_ERROR: "Đã xảy ra lỗi trong khi đọc thư mục: {0}",
            MSG_PASTE_ERROR: "Không thể dán tập tin",
            MSG_MKDIR_ERROR: "Không thể tạo thư mục",
            MSG_RENAME_ERROR: "Không thể đổi tên",
            MSG_DELETE_ERROR: "Không thể xóa"
        },
        g = {
            LBL_SHOW_HIDDEN_FILES: "Mostrar arquivos ocultos",
            LBL_MINIMALISTIC: "Minimalista",
            LBL_OPEN_WITH: "Abrir com...",
            LBL_SHOW_DATE: "Mostrar coluna Data",
            LBL_STATUS: "{0} diretórios, {1} arquivos, {2} bytes no total",
            LBL_DATE: "Data",
            LBL_LOADING: "Carregando {0}",
            DIALOG_MKDIR_MESSAGE: "Criar novo diretório",
            DIALOG_MKDIR_PLACEHOLDER: "Novo diretório",
            DIALOG_RENAME_MESSAGE: "Renomear {0} ?",
            DIALOG_DELETE_MESSAGE: "Deletar {0} ?",
            MSG_ERROR: "Um erro ocorreu",
            MSG_UPLOAD_ERROR: "Falha ao fazer upload do(s) arquivo(s)",
            MSG_READDIR_ERROR: "Um erro ocorreu ao ler o diretório: {0}",
            MSG_PASTE_ERROR: "Falha ao colar arquivo(s)",
            MSG_MKDIR_ERROR: "Falha ao criar diretório",
            MSG_RENAME_ERROR: "Falha ao renomear",
            MSG_DELETE_ERROR: "Falha ao deletar"
        },
        y = {
            LBL_SHOW_HIDDEN_FILES: "Afficher les fichiers cachés",
            LBL_MINIMALISTIC: "Minimaliste",
            LBL_OPEN_WITH: "Ouvrir avec...",
            LBL_SHOW_DATE: "Affichier la colonne date",
            LBL_STATUS: "{0} dossiers, {1} fichiers, {2} bytes au total",
            LBL_DATE: "Date",
            LBL_LOADING: "Chargement en cours {0}",
            DIALOG_MKDIR_MESSAGE: "Créer nouveau dossier",
            DIALOG_MKDIR_PLACEHOLDER: "Nouveau dossier",
            DIALOG_RENAME_MESSAGE: "Renommer {0} ?",
            DIALOG_DELETE_MESSAGE: "Supprimer {0} ?",
            MSG_ERROR: "Une erreur est survenue",
            MSG_UPLOAD_ERROR: "Echec du chargement du(des) fichier(s)",
            MSG_READDIR_ERROR: "Une erreur est survenue lors de la lecture du répertoire : {0}",
            MSG_PASTE_ERROR: "Impossible de coller le(s) file(s)",
            MSG_MKDIR_ERROR: "Impossible de créer le répertoire",
            MSG_RENAME_ERROR: "Echec du renommage",
            MSG_DELETE_ERROR: "Echec de la suppression"
        },
        E = n(4);
    var L = function(e) {
        if (Array.isArray(e)) {
            for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t];
            return n
        }
    };
    var _ = function(e) {
        if (Symbol.iterator in Object(e) || "[object Arguments]" === Object.prototype.toString.call(e)) return Array.from(e)
    };
    var b = function() {
        throw new TypeError("Invalid attempt to spread non-iterable instance")
    };
    var w = function(e) {
        return L(e) || _(e) || b()
    };

    function R(e, t) {
        for (var n = [], r = [], o = arguments.length; 2 < o--;) n.push(arguments[o]);
        for (; n.length;) {
            var i = n.pop();
            if (i && i.pop)
                for (o = i.length; o--;) n.push(i[o]);
            else null != i && !0 !== i && !1 !== i && r.push(i)
        }
        return "function" == typeof e ? e(t || {}, r) : {
            nodeName: e,
            attributes: t || {},
            children: r,
            key: t && t.key
        }
    }

    function x(e, t, n, r) {
        function o(e) {
            return "function" == typeof e ? o(e(b, w)) : null == e ? "" : e
        }

        function i() {
            v = !v;
            var e = o(n);
            for (r && !v && (y = function e(t, n, r, i, a) {
                    if (i === r);
                    else if (null == r || r.nodeName !== i.nodeName) {
                        var u = h(i, a);
                        t.insertBefore(u, n), null != r && m(t, n, r), n = u
                    } else if (null == r.nodeName) n.nodeValue = i;
                    else {
                        p(n, r.attributes, i.attributes, a = a || "svg" === i.nodeName);
                        for (var c = {}, s = {}, f = [], d = r.children, v = i.children, g = 0; g < d.length; g++) {
                            f[g] = n.childNodes[g], null != (E = l(d[g])) && (c[E] = [f[g], d[g]])
                        }
                        g = 0;
                        for (var y = 0; y < v.length;) {
                            var E = l(d[g]),
                                L = l(v[y] = o(v[y]));
                            if (s[E]) g++;
                            else if (null == L || L !== l(d[g + 1]))
                                if (null == L || _) null == E && (e(n, f[g], d[g], v[y], a), y++), g++;
                                else {
                                    var b = c[L] || [];
                                    E === L ? (e(n, b[0], b[1], v[y], a), g++) : b[0] ? e(n, n.insertBefore(b[0], f[g]), b[1], v[y], a) : e(n, f[g], null, v[y], a), s[L] = v[y], y++
                                }
                            else null == E && m(n, f[g], d[g]), g++
                        }
                        for (; g < d.length;) null == l(d[g]) && m(n, f[g], d[g]), g++;
                        for (var g in c) s[g] || m(n, c[g][0], c[g][1])
                    }
                    return n
                }(r, y, E, E = e)), _ = !1; L.length;) L.pop()()
        }

        function a() {
            v || (v = !0, setTimeout(i))
        }

        function u(e, t) {
            var n = {};
            for (var r in e) n[r] = e[r];
            for (var r in t) n[r] = t[r];
            return n
        }

        function c(e, t, n) {
            var r = {};
            return e.length ? (r[e[0]] = 1 < e.length ? c(e.slice(1), t, n[e[0]]) : t, u(n, r)) : t
        }

        function s(e, t) {
            for (var n = 0; n < e.length;) t = t[e[n++]];
            return t
        }

        function l(e) {
            return e ? e.key : null
        }

        function f(e) {
            return e.currentTarget.events[e.type](e)
        }

        function d(e, t, n, r, o) {
            if ("key" === t);
            else if ("style" !== t) "o" === t[0] && "n" === t[1] ? (t = t.slice(2), e.events ? !r && (r = e.events[t]) : e.events = {}, e.events[t] = n, n ? !r && e.addEventListener(t, f) : e.removeEventListener(t, f)) : t in e && "list" !== t && "type" !== t && "draggable" !== t && "spellcheck" !== t && "translate" !== t && !o ? e[t] = null == n ? "" : n : null != n && !1 !== n && e.setAttribute(t, n), (null == n || !1 === n) && e.removeAttribute(t);
            else if ("string" == typeof n) e.style.cssText = n;
            else
                for (var i in "string" == typeof r && (r = e.style.cssText = ""), u(r, n)) {
                    var a = null == n || null == n[i] ? "" : n[i];
                    "-" === i[0] ? e.style.setProperty(i, a) : e.style[i] = a
                }
        }

        function h(e, t) {
            var n = "string" == typeof e || "number" == typeof e ? document.createTextNode(e) : (t = t || "svg" === e.nodeName) ? document.createElementNS("http://www.w3.org/2000/svg", e.nodeName) : document.createElement(e.nodeName),
                r = e.attributes;
            if (r) {
                r.oncreate && L.push((function() {
                    r.oncreate(n)
                }));
                for (var i = 0; i < e.children.length; i++) n.appendChild(h(e.children[i] = o(e.children[i]), t));
                for (var a in r) d(n, a, r[a], null, t)
            }
            return n
        }

        function p(e, t, n, r) {
            for (var o in u(t, n)) n[o] !== ("value" == o || "checked" === o ? e[o] : t[o]) && d(e, o, n[o], t[o], r);
            var i = _ ? n.oncreate : n.onupdate;
            i && L.push((function() {
                i(e, t)
            }))
        }

        function m(e, t, n) {
            function r() {
                e.removeChild(function e(t, n) {
                    var r = n.attributes;
                    if (r) {
                        for (var o = 0; o < n.children.length; o++) e(t.childNodes[o], n.children[o]);
                        r.ondestroy && r.ondestroy(t)
                    }
                    return t
                }(t, n))
            }
            var o = n.attributes && n.attributes.onremove;
            o ? o(t, r) : r()
        }
        var v, g = [].map,
            y = r && r.children[0] || null,
            E = y && function e(t) {
                return {
                    nodeName: t.nodeName.toLowerCase(),
                    attributes: {},
                    children: g.call(t.childNodes, (function(t) {
                        return 3 === t.nodeType ? t.nodeValue : e(t)
                    }))
                }
            }(y),
            L = [],
            _ = !0,
            b = u(e),
            w = function e(t, n, r) {
                for (var o in r) "function" == typeof r[o] ? function(e, o) {
                    r[e] = function(e) {
                        var i = o(e);
                        return "function" == typeof i && (i = i(s(t, b), r)), i && i !== (n = s(t, b)) && !i.then && a(b = c(t, u(n, i), b)), i
                    }
                }(o, r[o]) : e(t.concat(o), n[o] = u(n[o]), r[o] = u(r[o]));
                return r
            }([], b, u(t));
        return a(), w
    }
    var O = function(e, t) {
            return "number" == typeof e ? "".concat(e, "px") : !1 === e ? t : e
        },
        S = {
            grow: function(e) {
                return {
                    flexGrow: e
                }
            },
            shrink: function(e) {
                return {
                    flexShrink: e
                }
            },
            basis: function(e) {
                return {
                    flexBasis: O(e, "auto")
                }
            },
            align: function(e) {
                return {
                    alignItems: e
                }
            },
            justify: function(e) {
                return {
                    justifyContent: e
                }
            },
            padding: function(e) {
                return {
                    margin: O(e, "0")
                }
            },
            margin: function(e) {
                return {
                    margin: O(e, "0")
                }
            }
        },
        k = function(e) {
            var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : [],
                n = e.class instanceof Array ? e.class : [e.class],
                r = ["osjs-gui"].concat(w(n));
            e.orientation && r.push("osjs-gui-" + e.orientation);
            var o = "string" == typeof e.style ? {} : Object.assign({}, e.style || {}),
                i = Object.keys(e).reduce((function(t, n) {
                    var r = S[n] ? S[n](e[n]) : void 0;
                    return Object.assign({}, t, r)
                }), o);
            return R("div", {
                oncreate: e.oncreate,
                ondestroy: e.ondestroy,
                class: r.filter((function(e) {
                    return !!e
                })).join(" "),
                style: i
            }, t)
        },
        D = function(e, t) {
            return R(k, Object.assign({
                orientation: "horizontal"
            }, e, {
                class: ["osjs-gui-box", e.class]
            }), t)
        };

    function A(e, t) {
        return e(t = {
            exports: {}
        }, t.exports), t.exports
    }
    var j = A((function(e) {
            function t(n) {
                return e.exports = t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
                }, t(n)
            }
            e.exports = t
        })),
        I = function(e) {
            var t = e && "object" === j(e) ? e.src : e;
            return R("i", {
                "data-icon": e && "object" === j(e) ? e.name : void 0,
                class: "osjs-icon",
                style: {
                    backgroundImage: "string" == typeof e ? "url(".concat(t, ")") : void 0
                }
            })
        };
    var M = function(e, t, n) {
            return t in e ? Object.defineProperty(e, t, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = n, e
        },
        G = function(e, t) {
            return Object.keys(e).filter((function(e) {
                return -1 === t.indexOf(e)
            })).reduce((function(t, n) {
                return Object.assign(M({}, n, e[n]), t)
            }), {})
        },
        T = function() {
            var e, t = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : 250,
                n = !1;
            return function(r, o) {
                return e = clearTimeout(e), e = setTimeout((function() {
                    return n = !1
                }), t), n ? (r.preventDefault(), o(r)) : (n = !0, !1)
            }
        },
        N = function(e, t, n, r, o) {
            var i = t.oninput || function() {},
                a = t.onchange || function() {},
                u = t.onkeydown || function() {},
                c = o || function(e) {
                    return [e.target.value]
                },
                s = Object.assign({
                    oninput: function(e) {
                        return i.apply(void 0, [e].concat(w(c(e))))
                    },
                    onchange: function(e) {
                        return a.apply(void 0, [e].concat(w(c(e))))
                    },
                    onkeydown: function(e) {
                        13 === e.keyCode && t.onenter && t.onenter.apply(t, [e].concat(w(c(e)))), u(e)
                    }
                }, n, G(t, ["choices", "label", "box", "oninput", "onchange"]));
            return R(k, Object.assign({}, t.box || {}, {
                class: "osjs-gui-field osjs-gui-" + e
            }), r(s))
        },
        P = function() {
            var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {},
                t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : [];
            return N("button", e, {}, (function(n) {
                var r = [];
                return e.icon && r.push(R(I, e.icon)), "string" == typeof e.label && r.push(R("span", {
                    class: "osjs-label"
                }, e.label)), R("button", n, [].concat(r, w(t)))
            }))
        },
        B = function(e) {
            return R("div", {
                id: "osjs-context-menu",
                className: "osjs-gui osjs-gui-menu",
                oncreate: e.oncreate,
                onupdate: e.onupdate,
                style: {
                    display: !1 === e.visible ? "none" : "block",
                    top: e.position ? e.position.top + "px" : 0,
                    left: e.position ? e.position.left + "px" : 0
                }
            }, function e(t) {
                var n = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : [],
                    r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : 0,
                    o = function(e) {
                        var t = [];
                        return "checkbox" === e.type || "boolean" == typeof e.checked ? t.push(R("span", {
                            class: "osjs-gui-menu-checkbox " + (e.checked ? "active" : "")
                        })) : e.icon && t.push(R(I, e.icon)), t.push(R("span", {}, e.label)), t
                    },
                    i = function(t, n) {
                        if ("function" == typeof n.element) return n.element();
                        var i = [R("span", {
                            class: "separator" === n.type ? "osjs-gui-menu-separator" : "osjs-gui-menu-label " + (n.disabled ? "osjs__disabled" : "")
                        }, o(n))];
                        return n.items && i.push(e(t, n.items, r + 1)), i
                    };
                return R("ul", {
                    class: ""
                }, n.map((function(e) {
                    return R("li", {
                        class: "osjs-gui-menu-entry"
                    }, [R("div", {
                        class: "osjs-gui-menu-container",
                        "data-has-image": !!e.icon || void 0,
                        "data-has-children": !!e.items || void 0,
                        onmouseover: e.items ? t.onshow : void 0,
                        ontouchend: e.items ? t.onshow : void 0,
                        onclick: function(n) {
                            e.items || (e.onclick && e.onclick(e, n), t.onclick && t.onclick(e, n, e))
                        }
                    }, i(t, e))])
                })))
            }(e, e.menu))
        },
        F = function(e, t) {
            return R(k, Object.assign({
                orientation: "vertical"
            }, e, {
                class: ["osjs-gui-toolbar", e.class]
            }), t)
        },
        H = function(e, t) {
            return R(k, Object.assign({}, e.box || {}, {
                class: ["osjs-gui-statusbar", e.class]
            }), t)
        },
        C = function(e) {
            var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : [],
                n = e.onclick,
                r = e.data;
            return R("div", {
                onclick: function(e) {
                    if ("function" == typeof n) {
                        var t = e.target.parentNode,
                            o = Array.prototype.indexOf.call(t.children, e.target);
                        n(e, r || {}, o)
                    }
                }
            }, R("span", {}, t))
        },
        W = function(e) {
            var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : [];
            return R(k, Object.assign({}, e, {
                class: ["osjs-gui-menubar", e.class]
            }), [].concat(w((e.items || []).map((function(t) {
                return R(C, {
                    data: t.data,
                    onclick: t.onclick || e.onclick
                }, t.label)
            }))), w(t)))
        };

    function K(e, t, n, r) {
        return t._$r = function() {
                return {}
            },
            function(o, i) {
                return R(r || "x-", {
                    key: o.key,
                    id: o.id,
                    class: o.class,
                    oncreate: function(r) {
                        var a = x(e, t, (function(e, t) {
                            var o = n(e, t);
                            return "function" == typeof o && (o = o(r._$p, r._$c)), o
                        }), r);
                        r._$p = o, r._$c = i, r._$r = a._$r, r._$u = a.uninit, a.init && a.init(o), o.oncreate && o.oncreate(r)
                    },
                    onupdate: function(e) {
                        e._$p = o, e._$c = i, e._$r(), o.onupdate && o.onupdate(e)
                    },
                    ondestroy: function(e) {
                        e._$u && e._$u()
                    },
                    onremove: function(e, t) {
                        return o.onremove ? void o.onremove(e, t) : t()
                    }
                })
            }
    }
    var $ = function(e, t, n, r) {
            var o = Array(Math.ceil(n.length / 2)).fill(null).map((function() {
                return R("div", {
                    class: "osjs-gui-panes-spacer",
                    onmousedown: function(e) {
                        return function(e, t, n) {
                            var r = e.target,
                                o = e.clientX,
                                i = e.clientY,
                                a = r.previousSibling,
                                u = a.offsetWidth,
                                c = a.offsetHeight,
                                s = Array.from(r.parentNode.children).indexOf(a),
                                l = .8 * a.parentNode.offsetWidth,
                                f = .8 * a.parentNode.offsetHeight;
                            if (!(0 > s)) {
                                var d = function(e) {
                                    var r = Math.min;
                                    e.preventDefault();
                                    var a = "vertical" === n ? u : c;
                                    if ("vertical" === n) {
                                        var d = e.clientX - o;
                                        a = r(l, a + d)
                                    } else {
                                        var h = e.clientY - i;
                                        a = r(f, a + h)
                                    }
                                    t.setSize({
                                        index: s,
                                        size: a
                                    })
                                };
                                e.preventDefault(), document.addEventListener("mousemove", d), document.addEventListener("mouseup", (function e(t) {
                                    t.preventDefault(), document.removeEventListener("mousemove", d), document.removeEventListener("mouseup", e)
                                }))
                            }
                        }(e, t, r)
                    }
                })
            }));
            return n.map((function(t, n) {
                var r = e.sizes[n] ? e.sizes[n] + "px" : void 0;
                return R("div", {
                    class: "osjs-gui-panes-pane",
                    style: {
                        flex: r ? "0 0 ".concat(r) : r
                    }
                }, t)
            })).map((function(e, t) {
                return [e, o[t]]
            })).reduce((function(e, t) {
                return e.concat(t)
            })).filter((function(e) {
                return void 0 !== e
            }))
        },
        U = K({
            sizes: []
        }, {
            init: function(e) {
                return {
                    sizes: e.sizes || [150]
                }
            },
            setSize: function(e) {
                var t = e.index,
                    n = e.size;
                return function(e) {
                    var r = [].concat(e.sizes);
                    return r[t] = n, {
                        sizes: r
                    }
                }
            }
        }, (function(e, t) {
            return function(n, r) {
                var o = n.orientation || "vertical";
                return R(k, {
                    orientation: o,
                    class: "osjs-gui-panes-inner"
                }, $(e, t, r, o))
            }
        }), "div"),
        z = function(e, t) {
            return R(U, {
                class: "osjs-gui-panes"
            }, t)
        },
        Y = T(),
        q = function(e) {
            return R(k, Object.assign({
                class: "osjs-gui-list-view"
            }, e.box || {}), function(e) {
                var t = function(t) {
                        return function(n, r) {
                            var o = n.columns[t] || {},
                                i = e.selectedIndex === r,
                                a = o.icon ? R(I, o.icon) : null,
                                u = [R("span", {}, ["object" === j(o) ? o.label : o])];
                            return a && u.unshift(a), R("div", {
                                key: n.key,
                                "data-has-icon": !!o.icon || void 0,
                                class: "osjs-gui-list-view-cell" + (i ? " osjs__active" : ""),
                                ontouchstart: function(t) {
                                    return Y(t, (function() {
                                        return e.onactivate({
                                            data: n.data,
                                            index: r,
                                            ev: t
                                        })
                                    }))
                                },
                                ondblclick: function(t) {
                                    return e.onactivate({
                                        data: n.data,
                                        index: r,
                                        ev: t
                                    })
                                },
                                onclick: function(t) {
                                    return e.onselect({
                                        data: n.data,
                                        index: r,
                                        ev: t
                                    })
                                },
                                oncontextmenu: function(t) {
                                    return e.oncontextmenu({
                                        data: n.data,
                                        index: r,
                                        ev: t
                                    })
                                },
                                oncreate: function(t) {
                                    return e.oncreate({
                                        data: n.data,
                                        index: r,
                                        el: t
                                    })
                                }
                            }, u)
                        }
                    },
                    n = function(n, r) {
                        return R("div", {
                            class: "osjs-gui-list-view-pane",
                            style: r.style || {}
                        }, [R("div", {
                            class: "osjs-gui-list-view-header",
                            style: {
                                display: e.hideColumns ? "none" : void 0
                            }
                        }, R("span", {}, "object" === j(r) ? r.label : r)), R("div", {
                            class: "rows",
                            "data-zebra": e.zebra + ""
                        }, e.rows.map(t(n)))])
                    };
                return R("div", {
                    class: "osjs-gui-list-view-wrapper",
                    oncreate: function(t) {
                        return t.scrollTop = e.scrollTop
                    },
                    onupdate: function(t) {
                        0 > e.selectedIndex && (t.scrollTop = e.scrollTop)
                    }
                }, e.columns.map((function(e, t) {
                    return n(t, e)
                })))
            }(G(e, ["box"])))
        },
        V = function(e, t) {
            var n = Object.assign({
                zebra: !0,
                columns: [],
                rows: [],
                onselect: function(e) {
                    var n = e.data,
                        r = e.index,
                        o = e.ev;
                    t.select({
                        data: n,
                        index: r,
                        ev: o
                    }), t.setSelectedIndex(r)
                },
                onactivate: function(e) {
                    var n = e.data,
                        r = e.index,
                        o = e.ev;
                    t.activate({
                        data: n,
                        index: r,
                        ev: o
                    }), t.setSelectedIndex(-1)
                },
                oncontextmenu: function(e) {
                    var n = e.data,
                        r = e.index,
                        o = e.ev;
                    t.select({
                        data: n,
                        index: r,
                        ev: o
                    }), t.contextmenu({
                        data: n,
                        index: r,
                        ev: o
                    }), t.setSelectedIndex(r)
                },
                oncreate: function(e) {
                    t.created(e)
                }
            }, e);
            return function() {
                var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
                return q(Object.assign(n, e))
            }
        },
        X = function(e) {
            return Object.assign({
                selectedIndex: -1,
                scrollTop: 0
            }, e)
        },
        J = function(e) {
            return Object.assign({
                select: function() {
                    return function() {
                        return {}
                    }
                },
                activate: function() {
                    return function() {
                        return {}
                    }
                },
                contextmenu: function() {
                    return function() {
                        return {}
                    }
                },
                created: function() {
                    return function() {
                        return {}
                    }
                },
                setRows: function(e) {
                    return {
                        rows: e
                    }
                },
                setColumns: function(e) {
                    return {
                        columns: e
                    }
                },
                setScrollTop: function(e) {
                    return function() {
                        return {
                            scrollTop: e
                        }
                    }
                },
                setSelectedIndex: function(e) {
                    return function() {
                        return {
                            selectedIndex: e
                        }
                    }
                }
            }, e || {})
        },
        Q = (T(), function(e, t, n) {
            var r = e.labels,
                o = e.onchange,
                i = e.oncontextmenu;
            return (r || []).map((function(e, r) {
                return R("div", {
                    class: t.selectedIndex === r ? "osjs__active" : "",
                    oncontextmenu: function(t) {
                        (i || function() {})(t, r, e)
                    },
                    onclick: function(t) {
                        n.setSelectedIndex(r), (o || function() {})(t, r, e)
                    }
                }, R("span", {}, e))
            }))
        }),
        Z = function(e, t) {
            return t.map((function(t, n) {
                return R("div", {
                    class: e.selectedIndex === n ? "osjs__active" : ""
                }, t)
            }))
        },
        ee = (K({
            selectedIndex: 0
        }, {
            init: function(e) {
                return {
                    selectedIndex: e.selectedIndex || 0
                }
            },
            setSelectedIndex: function(e) {
                return function() {
                    return {
                        selectedIndex: e
                    }
                }
            }
        }, (function(e, t) {
            return function(n, r) {
                return R("div", {
                    class: "osjs-gui-tabs-wrapper"
                }, [R("div", {
                    class: "osjs-gui-tabs-header"
                }, Q(n, e, t)), R("div", {
                    class: "osjs-gui-tabs-panes"
                }, Z(e, r))])
            }
        }), "div"), function() {
            var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
            return N("text-field", e, {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                spellcheck: "false",
                type: "text"
            }, (function(e) {
                return R("input", e)
            }))
        }),
        te = (K({
            active: !0
        }, {
            init: function(e) {
                return {
                    ative: !1 !== e.active
                }
            },
            ontoggle: function(e) {
                var t = e.ev,
                    n = e.active;
                return (e.ontoggle || function() {})(t, n), {
                    active: n
                }
            }
        }, (function(e, t) {
            return function(n, r) {
                return R(k, Object.assign({}, n.box || {}, {
                    class: ["osjs-gui-expander-wrapper"]
                }), [R("div", {
                    class: "osjs-gui-expander-header",
                    onclick: function(r) {
                        return t.ontoggle({
                            ev: r,
                            active: !e.active,
                            ontoggle: n.ontoggle
                        })
                    }
                }, [R("div", {
                    class: "osjs-gui-expander-header-icon",
                    "data-active": e.active + ""
                }), R("div", {
                    class: "osjs-gui-expander-header-label"
                }, n.label)]), R("div", {
                    class: "osjs-gui-expander-content",
                    style: {
                        display: !1 === e.active ? "none" : void 0
                    }
                }, r)])
            }
        }), "div"), A((function(e) {
            var t = function(e) {
                function t(e, t, n, o) {
                    var i = t && t.prototype instanceof r ? t : r,
                        a = Object.create(i.prototype),
                        u = new d(o || []);
                    return a._invoke = c(e, n, u), a
                }

                function n(e, t, n) {
                    try {
                        return {
                            type: "normal",
                            arg: e.call(t, n)
                        }
                    } catch (e) {
                        return {
                            type: "throw",
                            arg: e
                        }
                    }
                }

                function r() {}

                function o() {}

                function i() {}

                function a(e) {
                    ["next", "throw", "return"].forEach((function(t) {
                        e[t] = function(e) {
                            return this._invoke(t, e)
                        }
                    }))
                }

                function u(e) {
                    function t(r, o, i, a) {
                        var u = n(e[r], e, o);
                        if ("throw" !== u.type) {
                            var c = u.arg,
                                s = c.value;
                            return s && "object" == typeof s && g.call(s, "__await") ? Promise.resolve(s.__await).then((function(e) {
                                t("next", e, i, a)
                            }), (function(e) {
                                t("throw", e, i, a)
                            })) : Promise.resolve(s).then((function(e) {
                                c.value = e, i(c)
                            }), (function(e) {
                                return t("throw", e, i, a)
                            }))
                        }
                        a(u.arg)
                    }
                    var r;
                    this._invoke = function(e, n) {
                        function o() {
                            return new Promise((function(r, o) {
                                t(e, n, r, o)
                            }))
                        }
                        return r = r ? r.then(o, o) : o()
                    }
                }

                function c(e, t, r) {
                    var o = "suspendedStart";
                    return function(i, a) {
                        if ("executing" === o) throw new Error("Generator is already running");
                        if ("completed" === o) {
                            if ("throw" === i) throw a;
                            return p()
                        }
                        for (r.method = i, r.arg = a;;) {
                            var u = r.delegate;
                            if (u) {
                                var c = s(u, r);
                                if (c) {
                                    if (c === b) continue;
                                    return c
                                }
                            }
                            if ("next" === r.method) r.sent = r._sent = r.arg;
                            else if ("throw" === r.method) {
                                if ("suspendedStart" === o) throw o = "completed", r.arg;
                                r.dispatchException(r.arg)
                            } else "return" === r.method && r.abrupt("return", r.arg);
                            o = "executing";
                            var l = n(e, t, r);
                            if ("normal" === l.type) {
                                if (o = r.done ? "completed" : "suspendedYield", l.arg === b) continue;
                                return {
                                    value: l.arg,
                                    done: r.done
                                }
                            }
                            "throw" === l.type && (o = "completed", r.method = "throw", r.arg = l.arg)
                        }
                    }
                }

                function s(e, t) {
                    var r = e.iterator[t.method];
                    if (r === m) {
                        if (t.delegate = null, "throw" === t.method) {
                            if (e.iterator.return && (t.method = "return", t.arg = m, s(e, t), "throw" === t.method)) return b;
                            t.method = "throw", t.arg = new TypeError("The iterator does not provide a 'throw' method")
                        }
                        return b
                    }
                    var o = n(r, e.iterator, t.arg);
                    if ("throw" === o.type) return t.method = "throw", t.arg = o.arg, t.delegate = null, b;
                    var i = o.arg;
                    return i ? i.done ? (t[e.resultName] = i.value, t.next = e.nextLoc, "return" !== t.method && (t.method = "next", t.arg = m), t.delegate = null, b) : i : (t.method = "throw", t.arg = new TypeError("iterator result is not an object"), t.delegate = null, b)
                }

                function l(e) {
                    var t = {
                        tryLoc: e[0]
                    };
                    1 in e && (t.catchLoc = e[1]), 2 in e && (t.finallyLoc = e[2], t.afterLoc = e[3]), this.tryEntries.push(t)
                }

                function f(e) {
                    var t = e.completion || {};
                    t.type = "normal", delete t.arg, e.completion = t
                }

                function d(e) {
                    this.tryEntries = [{
                        tryLoc: "root"
                    }], e.forEach(l, this), this.reset(!0)
                }

                function h(e) {
                    if (e) {
                        var t = e[E];
                        if (t) return t.call(e);
                        if ("function" == typeof e.next) return e;
                        if (!isNaN(e.length)) {
                            var n = -1,
                                r = function t() {
                                    for (; ++n < e.length;)
                                        if (g.call(e, n)) return t.value = e[n], t.done = !1, t;
                                    return t.value = m, t.done = !0, t
                                };
                            return r.next = r
                        }
                    }
                    return {
                        next: p
                    }
                }

                function p() {
                    return {
                        value: m,
                        done: !0
                    }
                }
                var m, v = Object.prototype,
                    g = v.hasOwnProperty,
                    y = "function" == typeof Symbol ? Symbol : {},
                    E = y.iterator || "@@iterator",
                    L = y.asyncIterator || "@@asyncIterator",
                    _ = y.toStringTag || "@@toStringTag";
                e.wrap = t;
                var b = {},
                    w = {};
                w[E] = function() {
                    return this
                };
                var R = Object.getPrototypeOf,
                    x = R && R(R(h([])));
                x && x !== v && g.call(x, E) && (w = x);
                var O = i.prototype = r.prototype = Object.create(w);
                return o.prototype = O.constructor = i, i.constructor = o, i[_] = o.displayName = "GeneratorFunction", e.isGeneratorFunction = function(e) {
                    var t = "function" == typeof e && e.constructor;
                    return !!t && (t === o || "GeneratorFunction" === (t.displayName || t.name))
                }, e.mark = function(e) {
                    return Object.setPrototypeOf ? Object.setPrototypeOf(e, i) : (e.__proto__ = i, !(_ in e) && (e[_] = "GeneratorFunction")), e.prototype = Object.create(O), e
                }, e.awrap = function(e) {
                    return {
                        __await: e
                    }
                }, a(u.prototype), u.prototype[L] = function() {
                    return this
                }, e.AsyncIterator = u, e.async = function(n, r, o, i) {
                    var a = new u(t(n, r, o, i));
                    return e.isGeneratorFunction(r) ? a : a.next().then((function(e) {
                        return e.done ? e.value : a.next()
                    }))
                }, a(O), O[_] = "Generator", O[E] = function() {
                    return this
                }, O.toString = function() {
                    return "[object Generator]"
                }, e.keys = function(e) {
                    var t = [];
                    for (var n in e) t.push(n);
                    return t.reverse(),
                        function n() {
                            for (; t.length;) {
                                var r = t.pop();
                                if (r in e) return n.value = r, n.done = !1, n
                            }
                            return n.done = !0, n
                        }
                }, e.values = h, d.prototype = {
                    constructor: d,
                    reset: function(e) {
                        if (this.prev = 0, this.next = 0, this.sent = this._sent = m, this.done = !1, this.delegate = null, this.method = "next", this.arg = m, this.tryEntries.forEach(f), !e)
                            for (var t in this) "t" === t.charAt(0) && g.call(this, t) && !isNaN(+t.slice(1)) && (this[t] = m)
                    },
                    stop: function() {
                        this.done = !0;
                        var e = this.tryEntries[0].completion;
                        if ("throw" === e.type) throw e.arg;
                        return this.rval
                    },
                    dispatchException: function(e) {
                        function t(t, r) {
                            return i.type = "throw", i.arg = e, n.next = t, r && (n.method = "next", n.arg = m), !!r
                        }
                        if (this.done) throw e;
                        for (var n = this, r = this.tryEntries.length - 1; 0 <= r; --r) {
                            var o = this.tryEntries[r],
                                i = o.completion;
                            if ("root" === o.tryLoc) return t("end");
                            if (o.tryLoc <= this.prev) {
                                var a = g.call(o, "catchLoc"),
                                    u = g.call(o, "finallyLoc");
                                if (a && u) {
                                    if (this.prev < o.catchLoc) return t(o.catchLoc, !0);
                                    if (this.prev < o.finallyLoc) return t(o.finallyLoc)
                                } else if (a) {
                                    if (this.prev < o.catchLoc) return t(o.catchLoc, !0)
                                } else {
                                    if (!u) throw new Error("try statement without catch or finally");
                                    if (this.prev < o.finallyLoc) return t(o.finallyLoc)
                                }
                            }
                        }
                    },
                    abrupt: function(e, t) {
                        for (var n, r = this.tryEntries.length - 1; 0 <= r; --r)
                            if ((n = this.tryEntries[r]).tryLoc <= this.prev && g.call(n, "finallyLoc") && this.prev < n.finallyLoc) {
                                var o = n;
                                break
                            } o && ("break" === e || "continue" === e) && o.tryLoc <= t && t <= o.finallyLoc && (o = null);
                        var i = o ? o.completion : {};
                        return i.type = e, i.arg = t, o ? (this.method = "next", this.next = o.finallyLoc, b) : this.complete(i)
                    },
                    complete: function(e, t) {
                        if ("throw" === e.type) throw e.arg;
                        return "break" === e.type || "continue" === e.type ? this.next = e.arg : "return" === e.type ? (this.rval = this.arg = e.arg, this.method = "return", this.next = "end") : "normal" === e.type && t && (this.next = t), b
                    },
                    finish: function(e) {
                        for (var t, n = this.tryEntries.length - 1; 0 <= n; --n)
                            if ((t = this.tryEntries[n]).finallyLoc === e) return this.complete(t.completion, t.afterLoc), f(t), b
                    },
                    catch: function(e) {
                        for (var t, n = this.tryEntries.length - 1; 0 <= n; --n)
                            if ((t = this.tryEntries[n]).tryLoc === e) {
                                var r = t.completion;
                                if ("throw" === r.type) {
                                    var o = r.arg;
                                    f(t)
                                }
                                return o
                            } throw new Error("illegal catch attempt")
                    },
                    delegateYield: function(e, t, n) {
                        return this.delegate = {
                            iterator: h(e),
                            resultName: t,
                            nextLoc: n
                        }, "next" === this.method && (this.arg = m), b
                    }
                }, e
            }(e.exports);
            try {
                regeneratorRuntime = t
            } catch (e) {
                Function("r", "regeneratorRuntime = r")(t)
            }
        })));

    function ne(e, t, n, r, o, i, a) {
        try {
            var u = e[i](a),
                c = u.value
        } catch (e) {
            return void n(e)
        }
        u.done ? t(c) : Promise.resolve(c).then(r, o)
    }
    var re = function(e) {
        return function() {
            var t = this,
                n = arguments;
            return new Promise((function(r, o) {
                function i(e) {
                    ne(u, r, o, i, a, "next", e)
                }

                function a(e) {
                    ne(u, r, o, i, a, "throw", e)
                }
                var u = e.apply(t, n);
                i(void 0)
            }))
        }
    };
    var oe = function(e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
    };

    function ie(e, t) {
        for (var n, r = 0; r < t.length; r++)(n = t[r]).enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
    }
    var ae = function(e, t, n) {
            return t && ie(e.prototype, t), n && ie(e, n), e
        },
        ue = function(e) {
            return e(), setTimeout(e, 100)
        },
        ce = function() {
            function e(t) {
                oe(this, e), this.core = t, this.callback = function() {}, this.actions = null, this.$element = document.createElement("div")
            }
            return ae(e, [{
                key: "destroy",
                value: function() {
                    this.callback = null, this.actions = null
                }
            }, {
                key: "init",
                value: function() {
                    var e, t = this;
                    this.$element.className = "osjs-system-context-menu", this.core.$root.appendChild(this.$element);
                    var n = !1;
                    this.actions = x({
                        visible: !1,
                        menu: [],
                        position: {
                            top: 0,
                            left: 0
                        }
                    }, {
                        clamp: function(n) {
                            return function(r) {
                                if (n = n || document.querySelector("#osjs-context-menu"), clearTimeout(e), n) {
                                    var o = function(e, t, n) {
                                        var r = {},
                                            o = n.top + t.offsetHeight,
                                            i = n.left + t.offsetWidth,
                                            a = e.offsetHeight - n.top,
                                            u = e.offsetWidth - n.left,
                                            c = i > e.offsetWidth,
                                            s = o > e.offsetHeight;
                                        return s && e.offsetHeight > t.offsetHeight && (r.top = e.offsetHeight - t.offsetHeight - a), c && (r.left = e.offsetWidth - t.offsetWidth - u), s || c ? r : null
                                    }(t.core.$root, n, r.position);
                                    if (o) return {
                                        position: o
                                    }
                                }
                                return {}
                            }
                        },
                        onshow: function(n) {
                            return function() {
                                e = ue((function() {
                                    return function(e, t) {
                                        var n = t.target.querySelector("ul");
                                        n && (n.classList.contains("osjs-gui-menu-container") && (n = n.parentNode.parentNode), n && n.offsetParent) && (n.classList.remove("clamp-right"), n.getBoundingClientRect().right > e.offsetWidth && n.classList.add("clamp-right"))
                                    }(t.core.$root, n)
                                }))
                            }
                        },
                        show: function(e) {
                            return function(r, o) {
                                var i = e.menu,
                                    a = e.position;
                                if (e.toggle && n) return o.hide();
                                if (a instanceof Event) a = {
                                    left: a.clientX,
                                    top: a.clientY
                                };
                                else if (a instanceof Element) {
                                    var u = a.getBoundingClientRect();
                                    a = {
                                        left: u.left,
                                        top: u.top + u.height
                                    }
                                }
                                return t.callback = function(t, n, r) {
                                    e.callback && e.callback(t, n), !1 !== r.closeable && o.hide()
                                }, n = !0, t.onclose = e.onclose, ue((function() {
                                    return o.clamp()
                                })), {
                                    visible: !0,
                                    menu: i || [],
                                    position: a || {
                                        top: 0,
                                        left: 0
                                    }
                                }
                            }
                        },
                        hide: function() {
                            return function() {
                                return n && setTimeout((function() {
                                    return n = !1
                                }), 0), t.onclose && t.onclose(), t.onclose = null, t.callback = null, {
                                    visible: !1
                                }
                            }
                        }
                    }, function(e) {
                        return function(t, n) {
                            return R(B, {
                                position: t.position,
                                visible: t.visible,
                                menu: t.menu,
                                onclick: e,
                                onshow: n.onshow
                            })
                        }
                    }((function() {
                        !t.core.destroyed && t.callback && t.callback.apply(t, arguments)
                    })), this.$element)
                }
            }, {
                key: "show",
                value: function() {
                    var e;
                    return this.actions ? (e = this.actions).show.apply(e, arguments) : null
                }
            }, {
                key: "hide",
                value: function() {
                    var e;
                    return this.actions ? (e = this.actions).hide.apply(e, arguments) : null
                }
            }]), e
        }(),
        se = function(e) {
            var t = e.target,
                n = "TEXTAREA" === t.tagName;
            return n || "INPUT" !== t.tagName || (n = -1 !== ["text", "password", "number", "email"].indexOf(t.type)), n
        },
        le = (function() {
            function e(t) {
                oe(this, e), this.core = t, this.contextmenu = new ce(t)
            }
            ae(e, [{
                key: "destroy",
                value: function() {
                    var e = document.getElementById("osjs-context-menu");
                    e && e.remove(), this.contextmenu.destroy()
                }
            }, {
                key: "init",
                value: function() {
                    var e = re(te.mark((function e() {
                        var t, n = this;
                        return te.wrap((function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    t = {
                                        show: function() {
                                            var e;
                                            return (e = n.contextmenu).show.apply(e, arguments)
                                        },
                                        hide: function() {
                                            var e;
                                            return (e = n.contextmenu).hide.apply(e, arguments)
                                        }
                                    }, this.core.instance("osjs/contextmenu", (function() {
                                        return arguments.length ? t.show.apply(t, arguments) : t
                                    })), this.core.$root.addEventListener("contextmenu", (function(e) {
                                        se(e) || (e.stopPropagation(), e.preventDefault())
                                    }));
                                case 3:
                                case "end":
                                    return e.stop()
                            }
                        }), e, this)
                    })));
                    return function() {
                        return e.apply(this, arguments)
                    }
                }()
            }, {
                key: "start",
                value: function() {
                    var e = this,
                        t = function(t) {
                            var n = document.getElementById("osjs-context-menu");
                            !(n && n.contains(t.target)) && e.contextmenu && e.contextmenu.hide()
                        };
                    this.core.$root.addEventListener("click", t, !0), this.core.once("destroy", (function() {
                        e.core.$root.removeEventListener("click", t, !0)
                    })), this.contextmenu.init()
                }
            }])
        }(), function(e) {
            return function(t, n) {
                -1 !== ["yes", "ok"].indexOf(t) && e(n)
            }
        }),
        fe = function(e) {
            return -1 !== ["..", "."].indexOf(e)
        },
        de = function(e) {
            var t = e.make("osjs/fs");
            return function() {
                return t.mountpoints(!0).map((function(e) {
                    return {
                        columns: [{
                            icon: e.icon,
                            label: e.label
                        }],
                        data: e
                    }
                }))
            }
        },
        he = function(e, t) {
            var n = e.make("osjs/fs"),
                r = e.make("osjs/locale").format;
            return function(e) {
                return e.map((function(e) {
                    var o, i = [{
                        label: e.filename,
                        icon: (o = e, o.icon || n.icon(o))
                    }];
                    return t.settings.showDate && i.push(function(e) {
                        if (e.stat) {
                            var t = e.stat.mtime || e.stat.ctime;
                            if (t) try {
                                var n = new Date(t);
                                return "".concat(r(n, "shortDate"), " ").concat(r(n, "shortTime"))
                            } catch (e) {
                                return t
                            }
                        }
                        return ""
                    }(e)), {
                        key: e.path,
                        data: e,
                        columns: [].concat(i, [e.mime, e.humanSize])
                    }
                }))
            }
        },
        pe = function(e, t, n, o, i) {
            var a, c, l = e.make("osjs/vfs"),
                f = e.make("osjs/fs").pathJoin,
                d = (0, e.make("osjs/locale").translatable)(r),
                h = function(e) {
                    n.emit("filemanager:navigate", i.currentPath, void 0, e)
                },
                p = function() {
                    var e = s()(u.a.mark((function e(t, r, i) {
                        var a;
                        return u.a.wrap((function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    return e.prev = 0, n.setState("loading", !0), e.next = 4, t();
                                case 4:
                                    return a = e.sent, h(r), e.abrupt("return", a);
                                case 9:
                                    e.prev = 9, e.t0 = e.catch(0), o("error", e.t0, i || d("MSG_ERROR"));
                                case 12:
                                    return e.prev = 12, n.setState("loading", !1), e.finish(12);
                                case 15:
                                    return e.abrupt("return", []);
                                case 16:
                                case "end":
                                    return e.stop()
                            }
                        }), e, null, [
                            [0, 9, 12, 15]
                        ])
                    })));
                    return function(t, n, r) {
                        return e.apply(this, arguments)
                    }
                }(),
                m = function(e) {
                    return l.writefile({
                        path: f(i.currentPath.path, e.name)
                    }, e, {
                        pid: t.pid
                    })
                },
                v = (a = function(e) {
                    Promise.all(e.map(m)).then((function() {
                        return h(e[0].name)
                    })).catch((function(e) {
                        return o("error", e, d("MSG_UPLOAD_ERROR"))
                    }))
                }, c = function(e) {
                    var n = {
                        path: f(i.currentPath.path, e.filename)
                    };
                    n.path !== e.path && p((function() {
                        return l.copy(e, n, {
                            pid: t.pid
                        })
                    }), !0, d("MSG_UPLOAD_ERROR"))
                }, function(e, t, n) {
                    n.length ? a(n) : t && t.path && t.filename && c(t)
                });
            return {
                download: function(e) {
                    return l.download(e)
                },
                upload: function() {
                    return e = function(e) {
                        m(e[0]).then((function() {
                            return h(e[0].name)
                        })).catch((function(e) {
                            return o("error", e, d("MSG_UPLOAD_ERROR"))
                        }))
                    }, (t = document.createElement("input")).type = "file", t.onchange = function() {
                        t.files.length > 0 && e(t.files)
                    }, void t.click();
                    var e, t
                },
                refresh: h,
                action: p,
                drop: v,
                readdir: function() {
                    var e = s()(u.a.mark((function e(r, a, c) {
                        var s, f, h;
                        return u.a.wrap((function(e) {
                            for (;;) switch (e.prev = e.next) {
                                case 0:
                                    if (!n.getState("loading")) {
                                        e.next = 2;
                                        break
                                    }
                                    return e.abrupt("return");
                                case 2:
                                    return e.prev = 2, s = d("LBL_LOADING", r.path), f = {
                                        showHiddenFiles: t.settings.showHiddenFiles
                                    }, n.setState("loading", !0), n.emit("filemanager:status", s), e.next = 9;//, l.readdir(r, f);
                                case 9:
                                    h = e.sent, t.args.path = r, i.currentPath = r, void 0 === a || !1 === a ? n.emit("filemanager:historyPush", r) : "clear" === a && n.emit("filemanager:historyClear"), /*n.emit("filemanager:readdir", {
                                        list: h,
                                        path: r.path,
                                        selectFile: c
                                    }),*/ n.emit("filemanager:title", r.path), e.next = 20;
                                    break;
                                case 17:
                                    e.prev = 17, e.t0 = e.catch(2), o("error", e.t0, d("MSG_READDIR_ERROR", r.path));
                                case 20:
                                    return e.prev = 20, i.currentFile = void 0, n.setState("loading", !1), e.finish(20);
                                case 24:
                                case "end":
                                    return e.stop()
                            }
                        }), e, null, [
                            [2, 17, 20, 24]
                        ])
                    })));
                    return function(t, n, r) {
                        return e.apply(this, arguments)
                    }
                }(),
                paste: function(e, n) {
                    return function(r) {
                        var i = r.item,
                            a = r.callback,
                            u = {
                                path: f(n.path, i.filename)
                            };
                        return (e ? l.move(i, u, {
                            pid: t.pid
                        }) : l.copy(i, u, {
                            pid: t.pid
                        })).then((function() {
                            h(!0), "function" == typeof a && a()
                        })).catch((function(e) {
                            return o("error", e, d("MSG_PASTE_ERROR"))
                        }))
                    }
                }
            }
        },
        me = function(e, t, n) {
            var o = e.make("osjs/fs"),
                i = e.make("osjs/clipboard"),
                a = e.make("osjs/contextmenu"),
                u = e.make("osjs/locale"),
                c = u.translate,
                s = (0, u.translatable)(r),
                l = {
                    file: function() {
                        return [{
                            label: c("LBL_UPLOAD"),
                            onclick: function() {
                                return n.emit("filemanager:menu:upload")
                            }
                        }, {
                            label: c("LBL_MKDIR"),
                            onclick: function() {
                                return n.emit("filemanager:menu:mkdir")
                            }
                        }, {
                            label: c("LBL_QUIT"),
                            onclick: function() {
                                return n.emit("filemanager:menu:quit")
                            }
                        }]
                    },
                    edit: function(e, t) {
                        var r = function(t) {
                            return n.emit(t, e)
                        };
                        if (e && fe(e.filename)) return [{
                            label: c("LBL_GO"),
                            onclick: function() {
                                return r("filemanager:navigate")
                            }
                        }];
                        var o = e && !fe(e.filename),
                            a = e && e.isDirectory,
                            u = a ? [{
                                label: c("LBL_GO"),
                                disabled: !e,
                                onclick: function() {
                                    return r("filemanager:navigate")
                                }
                            }] : [{
                                label: c("LBL_OPEN"),
                                disabled: !e,
                                onclick: function() {
                                    return r("filemanager:open")
                                }
                            }, {
                                label: s("LBL_OPEN_WITH"),
                                disabled: !e,
                                onclick: function() {
                                    return r("filemanager:openWith")
                                }
                            }],
                            l = [{
                                label: c("LBL_COPY"),
                                disabled: !o,
                                onclick: function() {
                                    return r("filemanager:menu:copy")
                                }
                            }, {
                                label: c("LBL_CUT"),
                                disabled: !o,
                                onclick: function() {
                                    return r("filemanager:menu:cut")
                                }
                            }];
                        return t || l.push({
                            label: c("LBL_PASTE"),
                            disabled: !i.has(/^filemanager:/),
                            onclick: function() {
                                return r("filemanager:menu:paste")
                            }
                        }), [].concat(u, [{
                            label: c("LBL_RENAME"),
                            disabled: !o,
                            onclick: function() {
                                return r("filemanager:menu:rename")
                            }
                        }, {
                            label: c("LBL_DELETE"),
                            disabled: !o,
                            onclick: function() {
                                return r("filemanager:menu:delete")
                            }
                        }], l, [{
                            label: c("LBL_DOWNLOAD"),
                            disabled: !e || a || !o,
                            onclick: function() {
                                return r("filemanager:menu:download")
                            }
                        }])
                    },
                    view: function(e) {
                        return [{
                            label: c("LBL_REFRESH"),
                            onclick: function() {
                                return n.emit("filemanager:menu:refresh")
                            }
                        }, {
                            label: s("LBL_MINIMALISTIC"),
                            checked: e.minimalistic,
                            onclick: function() {
                                return n.emit("filemanager:menu:toggleMinimalistic")
                            }
                        }, {
                            label: s("LBL_SHOW_DATE"),
                            checked: t.settings.showDate,
                            onclick: function() {
                                return n.emit("filemanager:menu:showDate")
                            }
                        }, {
                            label: s("LBL_SHOW_HIDDEN_FILES"),
                            checked: t.settings.showHiddenFiles,
                            onclick: function() {
                                return n.emit("filemanager:menu:showHidden")
                            }
                        }]
                    },
                    go: function() {
                        return o.mountpoints(!0).map((function(e) {
                            return {
                                label: e.label,
                                icon: e.icon,
                                onclick: function() {
                                    return n.emit("filemanager:navigate", {
                                        path: e.root
                                    })
                                }
                            }
                        }))
                    }
                };
            return function(e, t) {
                var n = e.name,
                    r = e.ev,
                    o = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                if (!l[n]) throw new Error("Invalid menu: ".concat(n));
                a.show({
                    menu: l[n](t, o),
                    position: o ? r : r.target
                })
            }
        },
        ve = function(e, t) {
            var n = function(e, t) {
                    var n = e.make("osjs/locale"),
                        o = n.translate,
                        i = (0, n.translatable)(r);
                    return function() {
                        var e = [{
                            label: o("LBL_NAME"),
                            style: {
                                minWidth: "20em"
                            }
                        }];
                        return t.settings.showDate && e.push({
                            label: i("LBL_DATE")
                        }), [].concat(e, [{
                            label: o("LBL_TYPE"),
                            style: {
                                maxWidth: "150px"
                            }
                        }, {
                            label: o("LBL_SIZE"),
                            style: {
                                flex: "0 0 7em",
                                textAlign: "right"
                            }
                        }])
                    }
                }(e, t),
                o = he(e, t),
                i = de(e),
                a = e.make("osjs/dnd").draggable,
                u = function(e) {
                    var t = (0, e.make("osjs/locale").translatable)(r);
                    return function(e, n) {
                        var r = n.filter((function(e) {
                                return e.isDirectory
                            })).length,
                            o = n.filter((function(e) {
                                return !e.isDirectory
                            })).length,
                            i = n.reduce((function(e, t) {
                                return e + (t.size || 0)
                            }), 0);
                        return t("LBL_STATUS", r, o, i)
                    }
                }(e),
                c = {
                    path: "",
                    status: "",
                    minimalistic: !1,
                    history: {
                        index: -1,
                        list: []
                    },
                    mountview: X({
                        class: "osjs-gui-fill",
                        columns: ["Name"],
                        hideColumns: !0,
                        rows: i()
                    }),
                    fileview: X({
                        columns: []
                    })
                };
            return function(t, r) {
                var s = function(e) {
                        return {
                            history: {
                                clear: function() {
                                    return {
                                        index: -1,
                                        list: []
                                    }
                                },
                                push: function(e) {
                                    return function(t) {
                                        var n = t.index,
                                            r = t.list,
                                            o = -1 === n ? [] : r,
                                            i = o[o.length - 1] === e ? o.length - 1 : o.push(e) - 1;
                                        return {
                                            list: o,
                                            index: i
                                        }
                                    }
                                },
                                back: function() {
                                    return function(t) {
                                        var n = t.index,
                                            r = t.list,
                                            o = Math.max(0, n - 1);
                                        return e.emit("filemanager:navigate", r[o], !0), {
                                            index: o
                                        }
                                    }
                                },
                                forward: function() {
                                    return function(t) {
                                        var n = t.index,
                                            r = t.list,
                                            o = Math.min(r.length - 1, n + 1);
                                        return e.emit("filemanager:navigate", r[o], !0), {
                                            index: o
                                        }
                                    }
                                }
                            },
                            toggleMinimalistic: function() {
                                return function(e) {
                                    return {
                                        minimalistic: !e.minimalistic
                                    }
                                }
                            },
                            setPath: function(e) {
                                return {
                                    path: e
                                }
                            },
                            setStatus: function(e) {
                                return {
                                    status: e
                                }
                            },
                            setMinimalistic: function(e) {
                                return {
                                    minimalistic: e
                                }
                            },
                            setList: function(e) {
                                var t = e.list,
                                    r = e.path,
                                    a = e.selectFile;
                                return function(e) {
                                    var c, s = e.fileview,
                                        l = e.mountview;
                                    if (a) {
                                        var f = t.findIndex((function(e) {
                                            return e.filename === a
                                        })); - 1 !== f && (c = f)
                                    }
                                    return {
                                        path: r,
                                        status: u(r, t),
                                        mountview: Object.assign({}, l, {
                                            rows: i()
                                        }),
                                        fileview: Object.assign({}, s, {
                                            selectedIndex: c,
                                            columns: n(),
                                            rows: o(t)
                                        })
                                    }
                                }
                            },
                            mountview: J({
                                select: function(t) {
                                    var n = t.data;
                                    return e.emit("filemanager:navigate", {
                                        path: n.root
                                    })
                                }
                            }),
                            fileview: J({
                                select: function(t) {
                                    var n = t.data;
                                    return e.emit("filemanager:select", n)
                                },
                                activate: function(t) {
                                    var n = t.data;
                                    return e.emit("filemanager:".concat(n.isFile ? "open" : "navigate"), n)
                                },
                                contextmenu: function(t) {
                                    return e.emit("filemanager:contextmenu", t)
                                },
                                created: function(e) {
                                    var t = e.el,
                                        n = e.data;
                                    n.isFile && a(t, {
                                        data: n
                                    })
                                }
                            })
                        }
                    }(r),
                    l = function(e, t, n) {
                        var r = e.make("osjs/theme").icon,
                            o = e.make("osjs/locale").translate,
                            i = function(e, t) {
                                return function(r) {
                                    return n.emit("filemanager:menu", {
                                        ev: r,
                                        name: e
                                    }, t)
                                }
                            },
                            a = function(e, t) {
                                return n.emit("filemanager:navigate", {
                                    path: t
                                })
                            },
                            u = function(e) {
                                var t = e.list,
                                    n = e.index;
                                return !t.length || n <= 0
                            },
                            c = function(e) {
                                var t = e.list,
                                    n = e.index;
                                return !t.length || n === t.length - 1
                            };
                        return function(e, t) {
                            var s = V(e.fileview, t.fileview),
                                l = V(e.mountview, t.mountview);
                            return d(D, {
                                class: e.minimalistic ? "osjs-filemanager-minimalistic" : ""
                            }, [d(W, {}, [d(C, {
                                onclick: i("file")
                            }, o("LBL_FILE")), d(C, {
                                onclick: i("edit")
                            }, o("LBL_EDIT")), d(C, {
                                onclick: i("view", e)
                            }, o("LBL_VIEW")), d(C, {
                                onclick: i("go")
                            }, o("LBL_GO"))]), d(F, {}, [d(P, {
                                title: o("LBL_BACK"),
                                icon: r("go-previous"),
                                disabled: u(e.history),
                                onclick: function() {
                                    return t.history.back()
                                }
                            }), d(P, {
                                title: o("LBL_FORWARD"),
                                icon: r("go-next"),
                                disabled: c(e.history),
                                onclick: function() {
                                    return t.history.forward()
                                }
                            }), d(P, {
                                title: o("LBL_HOME"),
                                icon: r("go-home"),
                                onclick: function() {
                                    return n.emit("filemanager:home")
                                }
                            }), d(ee, {
                                value: e.path,
                                box: {
                                    grow: 1,
                                    shrink: 1
                                },
                                onenter: a
                            })]), d(z, {
                                style: {
                                    flex: "1 1"
                                }
                            }, [d(l), d(s)]), d(H, {}, d("span", {}, e.status))])
                        }
                    }(e, 0, r);
                return h(c, s, l, t)
            }
        },
        ge = function(e, t) {
            var n, o = {
                    currentFile: void 0,
                    currentPath: void 0
                },
                i = function(e, t) {
                    var n = {
                        path: e.config("vfs.defaultPath", "home:/")
                    };
                    return {
                        homePath: n,
                        initialPath: t.args.path ? Object.assign({}, n, t.args.path) : n
                    }
                }(e, t),
                a = i.homePath,
                u = i.initialPath,
                c = e.make("osjs/locale").translatableFlat(t.metadata.title),
                s = t.createWindow(function(e, t, n) {
                    return {
                        id: "FileManager",
                        icon: t.resource(t.metadata.icon),
                        title: n,
                        attributes: {
                            mediaQueries: {
                                small: "screen and (max-width: 400px)"
                            }
                        },
                        dimension: Object.assign({
                            width: 400,
                            height: 400
                        }, e.config("filemanager.defaultWindowSize", {}))
                    }
                }(e, t, c)),
                l = ve(e, t),
                f = function(e, t, n) {
                    var o = e.make("osjs/vfs"),
                        i = e.make("osjs/fs").pathJoin,
                        a = (0, e.make("osjs/locale").translatable)(r),
                        u = function(t, r, o) {
                            return e.make("osjs/dialog", t, r, {
                                parent: n,
                                attributes: {
                                    modal: !0
                                }
                            }, o)
                        },
                        c = {
                            mkdir: function(e, n) {
                                return u("prompt", {
                                    message: a("DIALOG_MKDIR_MESSAGE"),
                                    value: a("DIALOG_MKDIR_PLACEHOLDER")
                                }, le((function(r) {
                                    var u = i(n.path, r);
                                    e((function() {
                                        return o.mkdir({
                                            path: u
                                        }, {
                                            pid: t.pid
                                        })
                                    }), r, a("MSG_MKDIR_ERROR"))
                                })))
                            },
                            rename: function(e, t) {
                                return u("prompt", {
                                    message: a("DIALOG_RENAME_MESSAGE", t.filename),
                                    value: t.filename
                                }, le((function(n) {
                                    var r = t.path.lastIndexOf(t.filename),
                                        i = t.path.substr(0, r) + n;
                                    e((function() {
                                        return o.rename(t, {
                                            path: i
                                        })
                                    }), n, a("MSG_RENAME_ERROR"))
                                })))
                            },
                            delete: function(e, n) {
                                return u("confirm", {
                                    message: a("DIALOG_DELETE_MESSAGE", n.filename)
                                }, le((function() {
                                    e((function() {
                                        return o.unlink(n, {
                                            pid: t.pid
                                        })
                                    }), !0, a("MSG_DELETE_ERROR"))
                                })))
                            },
                            error: function(e, t) {
                                return u("alert", {
                                    type: "error",
                                    error: e,
                                    message: t
                                }, (function() {}))
                            }
                        };
                    return function(e) {
                        if (!c[e]) throw new Error("Invalid dialog: ".concat(e));
                        for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++) n[r - 1] = arguments[r];
                        c[e].apply(c, n)
                    }
                }(e, t, s),
                d = me(e, t, s),
                h = pe(e, t, s, f, o),
                p = function(e, t, n) {
                    var r = e.make("osjs/clipboard");
                    return {
                        set: function(e) {
                            return r.set({
                                item: e
                            }, "filemanager:copy")
                        },
                        cut: function(t) {
                            return r.set({
                                item: t,
                                callback: function() {
                                    return e.config("vfs.watch") ? void 0 : n.refresh(!0)
                                }
                            }, "filemanager:move")
                        },
                        paste: function() {
                            if (r.has(/^filemanager:/)) {
                                var e = r.has("filemanager:move");
                                r.get(e).then(n.paste(e, t.currentPath))
                            }
                        }
                    }
                }(e, o, h),
                m = function(e, n) {
                    return t.emit("filemanager:setting", e, n)
                };
            return s.once("render", (function() {
                return s.focus()
            })).once("destroy", (function() {
                return n = void 0
            })).once("render", (function() {
                return h.readdir(u)
            })).once("destroy", (function() {
                return t.destroy()
            })).on("drop", (function() {
                return h.drop.apply(h, arguments)
            })).on("filemanager:title", (function(e) {
                return s.setTitle("".concat(c, " - ").concat(e))
            })).on("filemanager:status", (function(e) {
                return n.setStatus(e)
            })).on("filemanager:menu", (function(e, t) {
                return d(e, t || o.currentFile)
            })).on("filemanager:home", (function() {
                return h.readdir(a, "clear")
            })).on("filemanager:navigate", (function() {
                return h.readdir.apply(h, arguments)
            })).on("filemanager:select", (function(e) {
                return o.currentFile = e
            })).on("filemanager:select", (function(e) {
                return s.emit("filemanager:status", function(e) {
                    return "".concat(e.filename, " (").concat(e.size, " bytes)")
                }(e))
            })).on("filemanager:contextmenu", (function(e) {
                var t = e.ev,
                    n = e.data;
                return d({
                    ev: t,
                    name: "edit"
                }, n, !0)
            })).on("filemanager:readdir", (function(e) {
                return n.setList(e)
            })).on("filemanager:refresh", (function() {
                return h.refresh.apply(h, arguments)
            })).on("filemanager:open", (function(t) {
                return e.open(t, {
                    useDefault: !0
                })
            })).on("filemanager:openWith", (function(t) {
                return e.open(t, {
                    useDefault: !0,
                    forceDialog: !0
                })
            })).on("filemanager:historyPush", (function(e) {
                return n.history.push(e)
            })).on("filemanager:historyClear", (function() {
                return n.history.clear()
            })).on("filemanager:menu:upload", (function() {
                return h.upload.apply(h, arguments)
            })).on("filemanager:menu:mkdir", (function() {
                return f("mkdir", h.action, o.currentPath)
            })).on("filemanager:menu:quit", (function() {
                return t.destroy()
            })).on("filemanager:menu:refresh", (function() {
                return h.refresh()
            })).on("filemanager:menu:toggleMinimalistic", (function() {
                return n.toggleMinimalistic()
            })).on("filemanager:menu:showDate", (function() {
                return m("showDate", !t.settings.showDate)
            })).on("filemanager:menu:showHidden", (function() {
                return m("showHiddenFiles", !t.settings.showHiddenFiles)
            })).on("filemanager:menu:copy", (function(e) {
                return p.set(e)
            })).on("filemanager:menu:cut", (function(e) {
                return p.cut(e)
            })).on("filemanager:menu:paste", (function() {
                return p.paste()
            })).on("filemanager:menu:rename", (function(e) {
                return f("rename", h.action, e)
            })).on("filemanager:menu:delete", (function(e) {
                return f("delete", h.action, e)
            })).on("filemanager:menu:download", (function() {
                return h.download.apply(h, arguments)
            })).render((function(e, t) {
                return n = l(e, t)
            }))
        };
    /*!
     * OS.js - JavaScript Cloud/Web Desktop Platform
     *
     * Copyright (c) 2011-2020, Anders Evenrud <andersevenrud@gmail.com>
     * All rights reserved.
     *
     * Redistribution and use in source and binary forms, with or without
     * modification, are permitted provided that the following conditions are met:
     *
     * 1. Redistributions of source code must retain the above copyright notice, this
     *    list of conditions and the following disclaimer
     * 2. Redistributions in binary form must reproduce the above copyright notice,
     *    this list of conditions and the following disclaimer in the documentation
     *    and/or other materials provided with the distribution
     *
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
     * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
     * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
     * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
     * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
     * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
     * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
     * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
     * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
     * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     *
     * @author  Anders Evenrud <andersevenrud@gmail.com>
     * @licence Simplified BSD License
     */
    f.a.register(E.a, (function(e, t, n, r) {
        var o = e.make("osjs/application", {
                args: t,
                metadata: r,
                options: Object.assign({}, n, {
                    settings: {
                        showHiddenFiles: !1,
                        showDate: !1
                    }
                })
            }),
            a = o.emitAll(),
            u = ge(e, o),
            c = function(e) {
                o.settings = Object.assign({}, o.settings, e), u.emit("filemanager:refresh")
            };
        o.on("osjs:filemanager:remote", c), o.on("filemanager:setting", (function(e, t) {
            c(i()({}, e, t)), o.saveSettings().then((function() {
                return a("osjs:filemanager:remote", o.settings)
            })).catch((function(e) {
                return console.warn(e)
            }))
        }));
        var s = function(e) {
            e.pid !== o.pid && (String(o.args.path.path).replace(/\/$/, "") === String(e.path).replace(/\/$/, "") && u.emit("filemanager:refresh"))
        };
        return e.on("osjs/vfs:directoryChanged", s), o.on("destroy", (function() {
            return e.off("osjs/vfs:directoryChanged", s)
        })), o
    }))
}]);
//# sourceMappingURL=main.js.map