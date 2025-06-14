/* eslint-disable */
import {
	rectToClientRect as t,
	detectOverflow as e,
	offset as n,
	autoPlacement as o,
	shift as i,
	flip as r,
	size as c,
	hide as l,
	arrow as s,
	inline as u,
	limitShift as f,
	computePosition as a,
} from "./Module_FloatingUI_Core.js"
const d = Math.min,
	h = Math.max,
	p = Math.round,
	g = Math.floor,
	m = (t) => ({ x: t, y: t })
function y() {
	return "undefined" != typeof window
}
function w(t) {
	return b(t) ? (t.nodeName || "").toLowerCase() : "#document"
}
function x(t) {
	var e
	return (null == t || null == (e = t.ownerDocument) ? void 0 : e.defaultView) || window
}
function v(t) {
	var e
	return null == (e = (b(t) ? t.ownerDocument : t.document) || window.document) ? void 0 : e.documentElement
}
function b(t) {
	return !!y() && (t instanceof Node || t instanceof x(t).Node)
}
function L(t) {
	return !!y() && (t instanceof Element || t instanceof x(t).Element)
}
function T(t) {
	return !!y() && (t instanceof HTMLElement || t instanceof x(t).HTMLElement)
}
function R(t) {
	return !(!y() || "undefined" == typeof ShadowRoot) && (t instanceof ShadowRoot || t instanceof x(t).ShadowRoot)
}
function E(t) {
	const { overflow: e, overflowX: n, overflowY: o, display: i } = H(t)
	return /auto|scroll|overlay|hidden|clip/.test(e + o + n) && !["inline", "contents"].includes(i)
}
function C(t) {
	return ["table", "td", "th"].includes(w(t))
}
function S(t) {
	return [":popover-open", ":modal"].some((e) => {
		try {
			return t.matches(e)
		} catch (t) {
			return !1
		}
	})
}
function F(t) {
	const e = D(),
		n = L(t) ? H(t) : t
	return (
		["transform", "translate", "scale", "rotate", "perspective"].some((t) => !!n[t] && "none" !== n[t]) ||
		(!!n.containerType && "normal" !== n.containerType) ||
		(!e && !!n.backdropFilter && "none" !== n.backdropFilter) ||
		(!e && !!n.filter && "none" !== n.filter) ||
		["transform", "translate", "scale", "rotate", "perspective", "filter"].some((t) => (n.willChange || "").includes(t)) ||
		["paint", "layout", "strict", "content"].some((t) => (n.contain || "").includes(t))
	)
}
function D() {
	return !("undefined" == typeof CSS || !CSS.supports) && CSS.supports("-webkit-backdrop-filter", "none")
}
function O(t) {
	return ["html", "body", "#document"].includes(w(t))
}
function H(t) {
	return x(t).getComputedStyle(t)
}
function W(t) {
	return L(t) ? { scrollLeft: t.scrollLeft, scrollTop: t.scrollTop } : { scrollLeft: t.scrollX, scrollTop: t.scrollY }
}
function M(t) {
	if ("html" === w(t)) return t
	const e = t.assignedSlot || t.parentNode || (R(t) && t.host) || v(t)
	return R(e) ? e.host : e
}
function P(t) {
	const e = M(t)
	return O(e) ? (t.ownerDocument ? t.ownerDocument.body : t.body) : T(e) && E(e) ? e : P(e)
}
function z(t, e, n) {
	var o
	void 0 === e && (e = []), void 0 === n && (n = !0)
	const i = P(t),
		r = i === (null == (o = t.ownerDocument) ? void 0 : o.body),
		c = x(i)
	if (r) {
		const t = B(c)
		return e.concat(c, c.visualViewport || [], E(i) ? i : [], t && n ? z(t) : [])
	}
	return e.concat(i, z(i, [], n))
}
function B(t) {
	return t.parent && Object.getPrototypeOf(t.parent) ? t.frameElement : null
}
function V(t) {
	const e = H(t)
	let n = parseFloat(e.width) || 0,
		o = parseFloat(e.height) || 0
	const i = T(t),
		r = i ? t.offsetWidth : n,
		c = i ? t.offsetHeight : o,
		l = p(n) !== r || p(o) !== c
	return l && ((n = r), (o = c)), { width: n, height: o, $: l }
}
function A(t) {
	return L(t) ? t : t.contextElement
}
function N(t) {
	const e = A(t)
	if (!T(e)) return m(1)
	const n = e.getBoundingClientRect(),
		{ width: o, height: i, $: r } = V(e)
	let c = (r ? p(n.width) : n.width) / o,
		l = (r ? p(n.height) : n.height) / i
	return (c && Number.isFinite(c)) || (c = 1), (l && Number.isFinite(l)) || (l = 1), { x: c, y: l }
}
const k = m(0)
function I(t) {
	const e = x(t)
	return D() && e.visualViewport ? { x: e.visualViewport.offsetLeft, y: e.visualViewport.offsetTop } : k
}
function q(e, n, o, i) {
	void 0 === n && (n = !1), void 0 === o && (o = !1)
	const r = e.getBoundingClientRect(),
		c = A(e)
	let l = m(1)
	n && (i ? L(i) && (l = N(i)) : (l = N(e)))
	const s = (function (t, e, n) {
		return void 0 === e && (e = !1), !(!n || (e && n !== x(t))) && e
	})(c, o, i)
		? I(c)
		: m(0)
	let u = (r.left + s.x) / l.x,
		f = (r.top + s.y) / l.y,
		a = r.width / l.x,
		d = r.height / l.y
	if (c) {
		const t = x(c),
			e = i && L(i) ? x(i) : i
		let n = t,
			o = B(n)
		for (; o && i && e !== n; ) {
			const t = N(o),
				e = o.getBoundingClientRect(),
				i = H(o),
				r = e.left + (o.clientLeft + parseFloat(i.paddingLeft)) * t.x,
				c = e.top + (o.clientTop + parseFloat(i.paddingTop)) * t.y
			;(u *= t.x), (f *= t.y), (a *= t.x), (d *= t.y), (u += r), (f += c), (n = x(o)), (o = B(n))
		}
	}
	return t({ width: a, height: d, x: u, y: f })
}
function X(t, e) {
	const n = W(t).scrollLeft
	return e ? e.left + n : q(v(t)).left + n
}
function Y(t, e, n) {
	void 0 === n && (n = !1)
	const o = t.getBoundingClientRect()
	return { x: o.left + e.scrollLeft - (n ? 0 : X(t, o)), y: o.top + e.scrollTop }
}
function $(e, n, o) {
	let i
	if ("viewport" === n)
		i = (function (t, e) {
			const n = x(t),
				o = v(t),
				i = n.visualViewport
			let r = o.clientWidth,
				c = o.clientHeight,
				l = 0,
				s = 0
			if (i) {
				;(r = i.width), (c = i.height)
				const t = D()
				;(!t || (t && "fixed" === e)) && ((l = i.offsetLeft), (s = i.offsetTop))
			}
			return { width: r, height: c, x: l, y: s }
		})(e, o)
	else if ("document" === n)
		i = (function (t) {
			const e = v(t),
				n = W(t),
				o = t.ownerDocument.body,
				i = h(e.scrollWidth, e.clientWidth, o.scrollWidth, o.clientWidth),
				r = h(e.scrollHeight, e.clientHeight, o.scrollHeight, o.clientHeight)
			let c = -n.scrollLeft + X(t)
			const l = -n.scrollTop
			return "rtl" === H(o).direction && (c += h(e.clientWidth, o.clientWidth) - i), { width: i, height: r, x: c, y: l }
		})(v(e))
	else if (L(n))
		i = (function (t, e) {
			const n = q(t, !0, "fixed" === e),
				o = n.top + t.clientTop,
				i = n.left + t.clientLeft,
				r = T(t) ? N(t) : m(1)
			return { width: t.clientWidth * r.x, height: t.clientHeight * r.y, x: i * r.x, y: o * r.y }
		})(n, o)
	else {
		const t = I(e)
		i = { x: n.x - t.x, y: n.y - t.y, width: n.width, height: n.height }
	}
	return t(i)
}
function _(t, e) {
	const n = M(t)
	return !(n === e || !L(n) || O(n)) && ("fixed" === H(n).position || _(n, e))
}
function j(t, e, n) {
	const o = T(e),
		i = v(e),
		r = "fixed" === n,
		c = q(t, !0, r, e)
	let l = { scrollLeft: 0, scrollTop: 0 }
	const s = m(0)
	if (o || (!o && !r))
		if ((("body" !== w(e) || E(i)) && (l = W(e)), o)) {
			const t = q(e, !0, r, e)
			;(s.x = t.x + e.clientLeft), (s.y = t.y + e.clientTop)
		} else i && (s.x = X(i))
	const u = !i || o || r ? m(0) : Y(i, l)
	return { x: c.left + l.scrollLeft - s.x - u.x, y: c.top + l.scrollTop - s.y - u.y, width: c.width, height: c.height }
}
function G(t) {
	return "static" === H(t).position
}
function J(t, e) {
	if (!T(t) || "fixed" === H(t).position) return null
	if (e) return e(t)
	let n = t.offsetParent
	return v(t) === n && (n = n.ownerDocument.body), n
}
function K(t, e) {
	const n = x(t)
	if (S(t)) return n
	if (!T(t)) {
		let e = M(t)
		for (; e && !O(e); ) {
			if (L(e) && !G(e)) return e
			e = M(e)
		}
		return n
	}
	let o = J(t, e)
	for (; o && C(o) && G(o); ) o = J(o, e)
	return o && O(o) && G(o) && !F(o)
		? n
		: o ||
				(function (t) {
					let e = M(t)
					for (; T(e) && !O(e); ) {
						if (F(e)) return e
						if (S(e)) return null
						e = M(e)
					}
					return null
				})(t) ||
				n
}
const Q = {
	convertOffsetParentRelativeRectToViewportRelativeRect: function (t) {
		let { elements: e, rect: n, offsetParent: o, strategy: i } = t
		const r = "fixed" === i,
			c = v(o),
			l = !!e && S(e.floating)
		if (o === c || (l && r)) return n
		let s = { scrollLeft: 0, scrollTop: 0 },
			u = m(1)
		const f = m(0),
			a = T(o)
		if ((a || (!a && !r)) && (("body" !== w(o) || E(c)) && (s = W(o)), T(o))) {
			const t = q(o)
			;(u = N(o)), (f.x = t.x + o.clientLeft), (f.y = t.y + o.clientTop)
		}
		const d = !c || a || r ? m(0) : Y(c, s, !0)
		return {
			width: n.width * u.x,
			height: n.height * u.y,
			x: n.x * u.x - s.scrollLeft * u.x + f.x + d.x,
			y: n.y * u.y - s.scrollTop * u.y + f.y + d.y,
		}
	},
	getDocumentElement: v,
	getClippingRect: function (t) {
		let { element: e, boundary: n, rootBoundary: o, strategy: i } = t
		const r = [
				...("clippingAncestors" === n
					? S(e)
						? []
						: (function (t, e) {
								const n = e.get(t)
								if (n) return n
								let o = z(t, [], !1).filter((t) => L(t) && "body" !== w(t)),
									i = null
								const r = "fixed" === H(t).position
								let c = r ? M(t) : t
								for (; L(c) && !O(c); ) {
									const e = H(c),
										n = F(c)
									n || "fixed" !== e.position || (i = null),
										(
											r
												? !n && !i
												: (!n && "static" === e.position && i && ["absolute", "fixed"].includes(i.position)) ||
												  (E(c) && !n && _(t, c))
										)
											? (o = o.filter((t) => t !== c))
											: (i = e),
										(c = M(c))
								}
								return e.set(t, o), o
						  })(e, this._c)
					: [].concat(n)),
				o,
			],
			c = r[0],
			l = r.reduce((t, n) => {
				const o = $(e, n, i)
				return (t.top = h(o.top, t.top)), (t.right = d(o.right, t.right)), (t.bottom = d(o.bottom, t.bottom)), (t.left = h(o.left, t.left)), t
			}, $(e, c, i))
		return { width: l.right - l.left, height: l.bottom - l.top, x: l.left, y: l.top }
	},
	getOffsetParent: K,
	getElementRects: async function (t) {
		const e = this.getOffsetParent || K,
			n = this.getDimensions,
			o = await n(t.floating)
		return { reference: j(t.reference, await e(t.floating), t.strategy), floating: { x: 0, y: 0, width: o.width, height: o.height } }
	},
	getClientRects: function (t) {
		return Array.from(t.getClientRects())
	},
	getDimensions: function (t) {
		const { width: e, height: n } = V(t)
		return { width: e, height: n }
	},
	getScale: N,
	isElement: L,
	isRTL: function (t) {
		return "rtl" === H(t).direction
	},
}
function U(t, e) {
	return t.x === e.x && t.y === e.y && t.width === e.width && t.height === e.height
}
function Z(t, e, n, o) {
	void 0 === o && (o = {})
	const {
			ancestorScroll: i = !0,
			ancestorResize: r = !0,
			elementResize: c = "function" == typeof ResizeObserver,
			layoutShift: l = "function" == typeof IntersectionObserver,
			animationFrame: s = !1,
		} = o,
		u = A(t),
		f = i || r ? [...(u ? z(u) : []), ...z(e)] : []
	f.forEach((t) => {
		i && t.addEventListener("scroll", n, { passive: !0 }), r && t.addEventListener("resize", n)
	})
	const a =
		u && l
			? (function (t, e) {
					let n,
						o = null
					const i = v(t)
					function r() {
						var t
						clearTimeout(n), null == (t = o) || t.disconnect(), (o = null)
					}
					return (
						(function c(l, s) {
							void 0 === l && (l = !1), void 0 === s && (s = 1), r()
							const u = t.getBoundingClientRect(),
								{ left: f, top: a, width: p, height: m } = u
							if ((l || e(), !p || !m)) return
							const y = {
								rootMargin: -g(a) + "px " + -g(i.clientWidth - (f + p)) + "px " + -g(i.clientHeight - (a + m)) + "px " + -g(f) + "px",
								threshold: h(0, d(1, s)) || 1,
							}
							let w = !0
							function x(e) {
								const o = e[0].intersectionRatio
								if (o !== s) {
									if (!w) return c()
									o
										? c(!1, o)
										: (n = setTimeout(() => {
												c(!1, 1e-7)
										  }, 1e3))
								}
								1 !== o || U(u, t.getBoundingClientRect()) || c(), (w = !1)
							}
							try {
								o = new IntersectionObserver(x, { ...y, root: i.ownerDocument })
							} catch (t) {
								o = new IntersectionObserver(x, y)
							}
							o.observe(t)
						})(!0),
						r
					)
			  })(u, n)
			: null
	let p,
		m = -1,
		y = null
	c &&
		((y = new ResizeObserver((t) => {
			let [o] = t
			o &&
				o.target === u &&
				y &&
				(y.unobserve(e),
				cancelAnimationFrame(m),
				(m = requestAnimationFrame(() => {
					var t
					null == (t = y) || t.observe(e)
				}))),
				n()
		})),
		u && !s && y.observe(u),
		y.observe(e))
	let w = s ? q(t) : null
	return (
		s &&
			(function e() {
				const o = q(t)
				w && !U(w, o) && n()
				;(w = o), (p = requestAnimationFrame(e))
			})(),
		n(),
		() => {
			var t
			f.forEach((t) => {
				i && t.removeEventListener("scroll", n), r && t.removeEventListener("resize", n)
			}),
				null == a || a(),
				null == (t = y) || t.disconnect(),
				(y = null),
				s && cancelAnimationFrame(p)
		}
	)
}
const tt = e,
	et = n,
	nt = o,
	ot = i,
	it = r,
	rt = c,
	ct = l,
	lt = s,
	st = u,
	ut = f,
	ft = (t, e, n) => {
		const o = new Map(),
			i = { platform: Q, ...n },
			r = { ...i.platform, _c: o }
		return a(t, e, { ...i, platform: r })
	}
export {
	lt as arrow,
	nt as autoPlacement,
	Z as autoUpdate,
	ft as computePosition,
	tt as detectOverflow,
	it as flip,
	z as getOverflowAncestors,
	ct as hide,
	st as inline,
	ut as limitShift,
	et as offset,
	Q as platform,
	ot as shift,
	rt as size,
}
