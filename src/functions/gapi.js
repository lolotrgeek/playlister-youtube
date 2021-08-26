var gapi = window.gapi = window.gapi || { }; gapi._bs = new Date().getTime(); (function () {/*

    Copyright The Closure Library Authors.
    SPDX-License-Identifier: Apache-2.0
   */
    var g = this || self, h = "closure_uid_" + (1E9 * Math.random() >>> 0), aa = 0, m = function (a) { return a };/*
    gapi.loader.OBJECT_CREATE_TEST_OVERRIDE &&*/
    var q = window, t = document, ba = q.location, ca = function () { }, da = /\[native code\]/, x = function (a, b, c) { return a[b] = a[b] || c }, ea = function (a) { a = a.sort(); for (var b = [], c = void 0, d = 0; d < a.length; d++) { var e = a[d]; e != c && b.push(e); c = e } return b }, z = function () { var a; if ((a = Object.create) && da.test(a)) a = a(null); else { a = { }; for (var b in a) a[b] = void 0 } return a }, C = x(q, "gapi", { }); var D; D = x(q, "___jsl", z()); x(D, "I", 0); x(D, "hel", 10); var E = function () { var a = ba.href; if (D.dpo) var b = D.h; else { b = D.h; var c = RegExp("([#].*&|[#])jsh=([^&#]*)", "g"), d = RegExp("([?#].*&|[?#])jsh=([^&#]*)", "g"); if (a = a && (c.exec(a) || d.exec(a))) try { b = decodeURIComponent(a[2]) } catch (e) { } } return b }, ha = function (a) { var b = x(D, "PQ", []); D.PQ = []; var c = b.length; if (0 === c) a(); else for (var d = 0, e = function () { ++d === c && a() }, f = 0; f < c; f++)b[f](e) }, F = function (a) { return x(x(D, "H", z()), a, z()) }; var G = x(D, "perf", z()), H = x(G, "g", z()), ia = x(G, "i", z()); x(G, "r", []); z(); z(); var K = function (a, b, c) { var d = G.r; "function" === typeof d ? d(a, b, c) : d.push([a, b, c]) }, M = function (a, b, c) { b && 0 < b.length && (b = L(b), c && 0 < c.length && (b += "___" + L(c)), 28 < b.length && (b = b.substr(0, 28) + (b.length - 28)), c = b, b = x(ia, "_p", z()), x(b, c, z())[a] = (new Date).getTime(), K(a, "_p", c)) }, L = function (a) { return a.join("__").replace(/\./g, "_").replace(/\-/g, "_").replace(/,/g, "_") }; var N = z(), O = [], R = function (a) { throw Error("Bad hint" + (a ? ": " + a : "")); }; O.push(["jsl", function (a) { for (var b in a) if (Object.prototype.hasOwnProperty.call(a, b)) { var c = a[b]; "object" == typeof c ? D[b] = x(D, b, []).concat(c) : x(D, b, c) } if (b = a.u) a = x(D, "us", []), a.push(b), (b = /^https:(.*)$/.exec(b)) && a.push("http:" + b[1]) }]); var ja = /^(\/[a-zA-Z0-9_\-]+)+$/, S = [/\/amp\//, /\/amp$/, /^\/amp$/], ka = /^[a-zA-Z0-9\-_\.,!]+$/, la = /^gapi\.loaded_[0-9]+$/, ma = /^[a-zA-Z0-9,._-]+$/, qa = function (a, b, c, d, e) {
        var f = a.split(";"), l = f.shift(), k = N[l], p = null; k ? p = k(f, b, c, d) : R("no hint processor for: " + l); p || R("failed to generate load url"); b = p; c = b.match(na); (d = b.match(oa)) && 1 === d.length && pa.test(b) && c && 1 === c.length || R("failed sanity: " + a); try {
            if (e && 0 < e.length) {
                b = a = 0; for (c = { }; b < e.length;) {
                    var n = e[b++]; d = void 0; f = typeof n; d = "object" == f && null != n ||
                        "function" == f ? "o" + (Object.prototype.hasOwnProperty.call(n, h) && n[h] || (n[h] = ++aa)) : (typeof n).charAt(0) + n; Object.prototype.hasOwnProperty.call(c, d) || (c[d] = !0, e[a++] = n)
                } e.length = a; p = p + "?le=" + e.join(",")
            }
        } catch (y) { } return p
    }, sa = function (a, b, c, d) {
        a = ra(a); la.test(c) || R("invalid_callback"); b = T(b); d = d && d.length ? T(d) : null; var e = function (f) { return encodeURIComponent(f).replace(/%2C/g, ",") }; return [encodeURIComponent(a.pathPrefix).replace(/%2C/g, ",").replace(/%2F/g, "/"), "/k=", e(a.version), "/m=", e(b), d ? "/exm=" +
            e(d) : "", "/rt=j/sv=1/d=1/ed=1", a.g ? "/am=" + e(a.g) : "", a.i ? "/rs=" + e(a.i) : "", a.j ? "/t=" + e(a.j) : "", "/cb=", e(c)].join("")
    }, ra = function (a) {
        "/" !== a.charAt(0) && R("relative path"); for (var b = a.substring(1).split("/"), c = []; b.length;) { a = b.shift(); if (!a.length || 0 == a.indexOf(".")) R("empty/relative directory"); else if (0 < a.indexOf("=")) { b.unshift(a); break } c.push(a) } a = { }; for (var d = 0, e = b.length; d < e; ++d) { var f = b[d].split("="), l = decodeURIComponent(f[0]), k = decodeURIComponent(f[1]); 2 == f.length && l && k && (a[l] = a[l] || k) } b = "/" +
            c.join("/"); ja.test(b) || R("invalid_prefix"); c = 0; for (d = S.length; c < d; ++c)S[c].test(b) && R("invalid_prefix"); c = U(a, "k", !0); d = U(a, "am"); e = U(a, "rs"); a = U(a, "t"); return { pathPrefix: b, version: c, g: d, i: e, j: a }
    }, T = function (a) { for (var b = [], c = 0, d = a.length; c < d; ++c) { var e = a[c].replace(/\./g, "_").replace(/-/g, "_"); ma.test(e) && b.push(e) } return b.join(",") }, U = function (a, b, c) { a = a[b]; !a && c && R("missing: " + b); if (a) { if (ka.test(a)) return a; R("invalid: " + b) } return null }, pa = /^https?:\/\/[a-z0-9_.-]+\.google(rs)?\.com(:\d+)?\/[a-zA-Z0-9_.,!=\-\/]+$/,
        oa = /\/cb=/g, na = /\/\//g, ta = function () { var a = E(); if (!a) throw Error("Bad hint"); return a }; N.m = function (a, b, c, d) { (a = a[0]) || R("missing_hint"); return "https://apis.google.com" + sa(a, b, c, d) }; var V = decodeURI("%73cript"), W = /^[-+_0-9\/A-Za-z]+={0,2}$/, X = function (a, b) { for (var c = [], d = 0; d < a.length; ++d) { var e = a[d], f; if (f = e) { a: { for (f = 0; f < b.length; f++)if (b[f] === e) break a; f = -1 } f = 0 > f } f && c.push(e) } return c }, ua = function () { var a = D.nonce; return void 0 !== a ? a && a === String(a) && a.match(W) ? a : D.nonce = null : t.querySelector ? (a = t.querySelector("script[nonce]")) ? (a = a.nonce || a.getAttribute("nonce") || "", a && a === String(a) && a.match(W) ? D.nonce = a : D.nonce = null) : null : null }, wa = function (a) {
            if ("loading" != t.readyState) va(a);
            else { var b = ua(), c = ""; null !== b && (c = ' nonce="' + b + '"'); a = "<" + V + ' src="' + encodeURI(a) + '"' + c + "></" + V + ">"; t.write(Y ? Y.createHTML(a) : a) }
        }, va = function (a) { var b = t.createElement(V); b.setAttribute("src", Y ? Y.createScriptURL(a) : a); a = ua(); null !== a && b.setAttribute("nonce", a); b.async = "true"; (a = t.getElementsByTagName(V)[0]) ? a.parentNode.insertBefore(b, a) : (t.head || t.body || t.documentElement).appendChild(b) }, xa = function (a, b) {
            var c = b && b._c; if (c) for (var d = 0; d < O.length; d++) {
                var e = O[d][0], f = O[d][1]; f && Object.prototype.hasOwnProperty.call(c,
                    e) && f(c[e], a, b)
            }
        }, za = function (a, b, c) { ya(function () { var d = b === E() ? x(C, "_", z()) : z(); d = x(F(b), "_", d); a(d) }, c) }, Ba = function (a, b) {
            var c = b || { }; "function" == typeof b && (c = { }, c.callback = b); xa(a, c); b = []; a ? b = a.split(":") : c.features && (b = c.features); var d = c.h || ta(), e = x(D, "ah", z()); if (e["::"] && b.length) {
                a = []; for (var f = null; f = b.shift();) { var l = f.split("."); l = e[f] || e[l[1] && "ns:" + l[0] || ""] || d; var k = a.length && a[a.length - 1] || null, p = k; k && k.hint == l || (p = { hint: l, features: [] }, a.push(p)); p.features.push(f) } var n = a.length;
                if (1 < n) { var y = c.callback; y && (c.callback = function () { 0 == --n && y() }) } for (; b = a.shift();)Aa(b.features, c, b.hint)
            } else Aa(b || [], c, d)
        }, Aa = function (a, b, c) {
            a = ea(a) || []; var d = b.callback, e = b.config, f = b.timeout, l = b.ontimeout, k = b.onerror, p = void 0; "function" == typeof k && (p = k); var n = null, y = !1; if (f && !l || !f && l) throw "Timeout requires both the timeout parameter and ontimeout parameter to be set"; k = x(F(c), "r", []).sort(); var P = x(F(c), "L", []).sort(), Ea = D.le, I = [].concat(k), fa = function (w, A) {
                if (y) return 0; q.clearTimeout(n);
                P.push.apply(P, r); var B = ((C || { }).config || { }).update; B ? B(e) : e && x(D, "cu", []).push(e); if (A) { M("me0", w, I); try { za(A, c, p) } finally { M("me1", w, I) } } return 1
            }; 0 < f && (n = q.setTimeout(function () { y = !0; l() }, f)); var r = X(a, P); if (r.length) {
                r = X(a, k); var u = x(D, "CP", []), v = u.length; u[v] = function (w) { if (!w) return 0; M("ml1", r, I); var A = function (J) { u[v] = null; fa(r, w) && ha(function () { d && d(); J() }) }, B = function () { var J = u[v + 1]; J && J() }; 0 < v && u[v - 1] ? u[v] = function () { A(B) } : A(B) }; if (r.length) {
                    var Q = "loaded_" + D.I++; C[Q] = function (w) {
                        u[v](w);
                        C[Q] = null
                    }; a = qa(c, r, "gapi." + Q, k, Ea); k.push.apply(k, r); M("ml0", r, I); b.sync || q.___gapisync ? wa(a) : va(a)
                } else u[v](ca)
            } else fa(r) && d && d()
        }, Ca; var Da = null, Z = g.trustedTypes; if (Z && Z.createPolicy) try { Da = Z.createPolicy("gapi#gapi", { createHTML: m, createScript: m, createScriptURL: m }) } catch (a) { g.console && g.console.error(a.message) } Ca = Da; var Y = Ca; var ya = function (a, b) { if (D.hee && 0 < D.hel) try { return a() } catch (c) { b && b(c), D.hel--, Ba("debug_error", function () { try { window.___jsl.hefn(c) } catch (d) { throw c; } }) } else try { return a() } catch (c) { throw b && b(c), c; } }; C.load = function (a, b) { return ya(function () { return Ba(a, b) }) }; H.bs0 = window.gapi._bs || (new Date).getTime(); K("bs0"); H.bs1 = (new Date).getTime(); K("bs1"); delete window.gapi._bs;
}).call(this);
gapi.load("", { callback: window["gapi_onload"], _c: { "jsl": { "ci": { "deviceType": "desktop", "oauth-flow": { "authUrl": "https://accounts.google.com/o/oauth2/auth", "proxyUrl": "https://accounts.google.com/o/oauth2/postmessageRelay", "disableOpt": true, "idpIframeUrl": "https://accounts.google.com/o/oauth2/iframe", "usegapi": false }, "debug": { "reportExceptionRate": 0.05, "forceIm": false, "rethrowException": false, "host": "https://apis.google.com" }, "enableMultilogin": true, "googleapis.config": { "auth": { "useFirstPartyAuthV2": true } }, "inline": { "css": 1 }, "disableRealtimeCallback": false, "drive_share": { "skipInitCommand": true }, "csi": { "rate": 0.01 }, "client": { "cors": false }, "signInDeprecation": { "rate": 0.0 }, "include_granted_scopes": true, "llang": "en", "iframes": { "youtube": { "params": { "location": ["search", "hash"] }, "url": ":socialhost:/:session_prefix:_/widget/render/youtube?usegapi\u003d1", "methods": ["scroll", "openwindow"] }, "ytsubscribe": { "url": "https://www.youtube.com/subscribe_embed?usegapi\u003d1" }, "plus_circle": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix::se:_/widget/plus/circle?usegapi\u003d1" }, "plus_share": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix::se:_/+1/sharebutton?plusShare\u003dtrue\u0026usegapi\u003d1" }, "rbr_s": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix::se:_/widget/render/recobarsimplescroller" }, ":source:": "3p", "playemm": { "url": "https://play.google.com/work/embedded/search?usegapi\u003d1\u0026usegapi\u003d1" }, "savetoandroidpay": { "url": "https://pay.google.com/gp/v/widget/save" }, "blogger": { "params": { "location": ["search", "hash"] }, "url": ":socialhost:/:session_prefix:_/widget/render/blogger?usegapi\u003d1", "methods": ["scroll", "openwindow"] }, "evwidget": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix:_/events/widget?usegapi\u003d1" }, "partnersbadge": { "url": "https://www.gstatic.com/partners/badge/templates/badge.html?usegapi\u003d1" }, "dataconnector": { "url": "https://dataconnector.corp.google.com/:session_prefix:ui/widgetview?usegapi\u003d1" }, "surveyoptin": { "url": "https://www.google.com/shopping/customerreviews/optin?usegapi\u003d1" }, ":socialhost:": "https://apis.google.com", "shortlists": { "url": "" }, "hangout": { "url": "https://talkgadget.google.com/:session_prefix:talkgadget/_/widget" }, "plus_followers": { "params": { "url": "" }, "url": ":socialhost:/_/im/_/widget/render/plus/followers?usegapi\u003d1" }, "post": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix::im_prefix:_/widget/render/post?usegapi\u003d1" }, ":gplus_url:": "https://plus.google.com", "signin": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix:_/widget/render/signin?usegapi\u003d1", "methods": ["onauth"] }, "rbr_i": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix::se:_/widget/render/recobarinvitation" }, "share": { "url": ":socialhost:/:session_prefix::im_prefix:_/widget/render/share?usegapi\u003d1" }, "plusone": { "params": { "count": "", "size": "", "url": "" }, "url": ":socialhost:/:session_prefix::se:_/+1/fastbutton?usegapi\u003d1" }, "comments": { "params": { "location": ["search", "hash"] }, "url": ":socialhost:/:session_prefix:_/widget/render/comments?usegapi\u003d1", "methods": ["scroll", "openwindow"] }, ":im_socialhost:": "https://plus.googleapis.com", "backdrop": { "url": "https://clients3.google.com/cast/chromecast/home/widget/backdrop?usegapi\u003d1" }, "visibility": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix:_/widget/render/visibility?usegapi\u003d1" }, "autocomplete": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix:_/widget/render/autocomplete" }, "additnow": { "url": "https://apis.google.com/marketplace/button?usegapi\u003d1", "methods": ["launchurl"] }, ":signuphost:": "https://plus.google.com", "ratingbadge": { "url": "https://www.google.com/shopping/customerreviews/badge?usegapi\u003d1" }, "appcirclepicker": { "url": ":socialhost:/:session_prefix:_/widget/render/appcirclepicker" }, "follow": { "url": ":socialhost:/:session_prefix:_/widget/render/follow?usegapi\u003d1" }, "community": { "url": ":ctx_socialhost:/:session_prefix::im_prefix:_/widget/render/community?usegapi\u003d1" }, "sharetoclassroom": { "url": "https://classroom.google.com/sharewidget?usegapi\u003d1" }, "ytshare": { "params": { "url": "" }, "url": ":socialhost:/:session_prefix:_/widget/render/ytshare?usegapi\u003d1" }, "plus": { "url": ":socialhost:/:session_prefix:_/widget/render/badge?usegapi\u003d1" }, "family_creation": { "params": { "url": "" }, "url": "https://families.google.com/webcreation?usegapi\u003d1\u0026usegapi\u003d1" }, "commentcount": { "url": ":socialhost:/:session_prefix:_/widget/render/commentcount?usegapi\u003d1" }, "configurator": { "url": ":socialhost:/:session_prefix:_/plusbuttonconfigurator?usegapi\u003d1" }, "zoomableimage": { "url": "https://ssl.gstatic.com/microscope/embed/" }, "appfinder": { "url": "https://workspace.google.com/:session_prefix:marketplace/appfinder?usegapi\u003d1" }, "savetowallet": { "url": "https://pay.google.com/gp/v/widget/save" }, "person": { "url": ":socialhost:/:session_prefix:_/widget/render/person?usegapi\u003d1" }, "savetodrive": { "url": "https://drive.google.com/savetodrivebutton?usegapi\u003d1", "methods": ["save"] }, "page": { "url": ":socialhost:/:session_prefix:_/widget/render/page?usegapi\u003d1" }, "card": { "url": ":socialhost:/:session_prefix:_/hovercard/card" } } }, "h": "m;/_/scs/apps-static/_/js/k\u003doz.gapi.en.8YYQ9IOjs4Q.O/am\u003dAQ/d\u003d1/rs\u003dAGLTcCObT4A5h9NGeZYjwVbQG0w-eydoeg/m\u003d__features__", "u": "https://apis.google.com/js/api.js", "hee": true, "dpo": false, "le": [] }, "annotation": ["interactivepost", "recobar", "signin2", "autocomplete", "profile"] } });