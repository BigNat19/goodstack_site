(() => {
const C = window.SITE, G = window.gsap, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
Object.entries(C.colors).forEach(([k, v]) => document.documentElement.style.setProperty("--" + k, v));
$$("[data-cta]").forEach(a => { a.textContent = C.cta.label; a.href = C.cta.href; });
const links = x => x.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join("");
$("#soc").innerHTML = links([{ label: C.site, href: "https://" + C.site }, ...C.socials]); $("#legal").innerHTML = links(C.legal);
const stack = n => `<svg viewBox="0 0 200 160" aria-hidden="true">${Array.from({ length: n + 1 }, (_, i) => `<rect x="${28 + (i % 2) * 14}" y="${126 - i * 28}" width="116" height="24" rx="9" fill="${i === n ? "var(--accent)" : "var(--tint)"}" stroke="var(--ink)" stroke-width="1.5"/>`).join("")}</svg>`;

// smooth scroll
let lenis;
if (G && window.Lenis && !reduce) {
  G.registerPlugin(ScrollTrigger); lenis = new Lenis(); lenis.on("scroll", ScrollTrigger.update);
  G.ticker.add(t => lenis.raf(t * 1000)); G.ticker.lagSmoothing(0);
}
document.addEventListener("click", e => { const a = e.target.closest('a[href^="#"]'); if (a && a.hash.length > 1 && lenis) { e.preventDefault(); lenis.scrollTo(a.hash, { offset: -16 }); } });

// header + mobile menu
const hdr = $("#hdr"), bg = $(".burger"), mn = $("#mnav"), onScroll = () => hdr.classList.toggle("on", scrollY > 40);
onScroll(); addEventListener("scroll", onScroll, { passive: true });
const tog = v => { mn.hidden = !v; bg.setAttribute("aria-expanded", v); bg.textContent = v ? "✕" : "☰"; };
bg.onclick = () => tog(mn.hidden); mn.onclick = e => e.target.closest("a") && tog(false);
addEventListener("keydown", e => e.key === "Escape" && tog(false));

// hero reveal + magnetic buttons
if (G && !reduce) {
  G.from(".hi", { y: 48, opacity: 0, duration: 1.1, stagger: 0.12, ease: "power3.out" });
  $$(".cta").forEach(a => {
    a.onpointermove = e => { if (e.pointerType !== "mouse") return; const b = a.getBoundingClientRect(); G.to(a, { x: (e.clientX - b.left - b.width / 2) * 0.25, y: (e.clientY - b.top - b.height / 2) * 0.35, duration: 0.4, ease: "power3.out" }); };
    a.onpointerleave = () => G.to(a, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,.4)" });
  });
}

// about: scroll-linked reveal + marquee rows
const st = $("#stmt");
st.innerHTML = st.textContent.trim().split(/\s+/).map(w => `<span>${w} </span>`).join("");
if (G && window.ScrollTrigger && !reduce) G.fromTo($$("span", st), { opacity: 0.18 }, { opacity: 1, ease: "none", stagger: 0.15, scrollTrigger: { trigger: st, start: "top 80%", end: "bottom 50%", scrub: true } });
$$(".drift").forEach(u => { u.innerHTML += u.innerHTML.replace(/<li>/g, '<li aria-hidden="true">'); });
const row = $(".row"), r2 = row.cloneNode(true); r2.classList.add("rev"); row.after(r2);

// services: cursor-following preview (tap-to-expand on touch)
const pv = $("#pv"), sv = $$(".svc");
sv.forEach((a, i) => {
  $(".mob", a).insertAdjacentHTML("afterbegin", stack(i));
  a.onpointerenter = e => { if (e.pointerType === "mouse" && G) { pv.innerHTML = stack(i); G.to(pv, { opacity: 1, scale: 1, duration: 0.3 }); } };
  a.onpointerleave = () => G && G.to(pv, { opacity: 0, scale: 0.9, duration: 0.3 });
  a.onclick = e => { if (matchMedia("(hover:none)").matches && !a.classList.contains("open")) { e.preventDefault(); sv.forEach(x => x.classList.remove("open")); a.classList.add("open"); } };
});
if (G) { const x = G.quickTo(pv, "x", { duration: 0.5, ease: "power3" }), y = G.quickTo(pv, "y", { duration: 0.5, ease: "power3" }); addEventListener("pointermove", e => { if (e.pointerType === "mouse") { x(e.clientX + 24); y(e.clientY - 70); } }); }

// stories carousel
const S = C.stories, tr = $("#track"), car = $("#car"), dlg = $("#dlg"), pad = n => String(n).padStart(2, "0"); let i = 0, x0 = null;
tr.innerHTML = S.map((s, n) => `<li><div class="lens"><div class="art" style="background:linear-gradient(${150 + n * 28}deg,var(--tint),color-mix(in srgb,var(--accent) ${30 + n * 9}%,var(--bg)))">${stack(n % 4)}</div><h3>${s.title}</h3><p>${s.before} to ${s.after}</p></div></li>`).join("");
const go = n => { i = Math.min(S.length - 1, Math.max(0, n)); tr.style.setProperty("--i", i); $$("li", tr).forEach((l, k) => l.classList.toggle("on", k === i)); $("#cnt").textContent = `${pad(i + 1)} of ${pad(S.length)}`; $("#prev").disabled = !i; $("#next").disabled = i === S.length - 1; };
const open = v => { dlg.hidden = !v; if (v) { $("#dt").textContent = S[i].title; $("#db").textContent = S[i].before; $("#da").textContent = S[i].after; $("#cls").focus(); } else car.focus(); };
$("#prev").onclick = () => go(i - 1); $("#next").onclick = () => go(i + 1); $("#view").onclick = () => open(true); $("#cls").onclick = () => open(false);
dlg.onclick = e => e.target === dlg && open(false);
car.onkeydown = e => {
  if (e.key === "Escape") { if (!dlg.hidden) open(false); }
  else if (dlg.hidden) { if (e.key === "ArrowRight") go(i + 1); else if (e.key === "ArrowLeft") go(i - 1); else if (e.key === "Enter" && e.target === car) open(true); }
};
const vp = $(".viewport"); vp.onpointerdown = e => { x0 = e.clientX; }; vp.onpointerup = e => { if (x0 !== null && Math.abs(e.clientX - x0) > 50) go(i + (e.clientX < x0 ? 1 : -1)); x0 = null; };
go(0);

// hero shader (raw WebGL; falls back to the CSS gradient)
(() => {
  const cv = $("#sh"), gl = cv.getContext("webgl", { antialias: false, powerPreference: "low-power" }); if (!gl) return;
  const FS = `precision highp float;uniform float t,g,k;uniform vec2 r,m;uniform vec3 c0,c1,c2,c3;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){vec2 uv=gl_FragCoord.xy/r;vec2 q=(uv-.5)*vec2(r.x/r.y,1.)*k+(m-.5)*.8;
for(int i=1;i<5;i++){float fi=float(i);q+=vec2(sin(q.y*fi*.9+t),cos(q.x*fi*.8-t*.8))/fi;}
float v=.5+.5*sin(q.x+q.y+n(q)*2.);
vec3 c=mix(c0,c1,smoothstep(.15,.65,v));c=mix(c,c2,smoothstep(.82,1.,v)*.5);
c+=c3*pow(max(0.,1.-abs(v-.55)*4.),3.)*g;
c=mix(c0,c,.6+.4*smoothstep(1.,.1,length(uv-vec2(.5,.45))));
gl_FragColor=vec4(c,1.);}`;
  const s = C.shader, hex = h => [1, 3, 5].map(k => parseInt(h.slice(k, k + 2), 16) / 255);
  const mk = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); return o; };
  const p = gl.createProgram(); gl.attachShader(p, mk(gl.VERTEX_SHADER, "attribute vec2 a;void main(){gl_Position=vec4(a,0,1);}")); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return;
  gl.useProgram(p); gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const a = gl.getAttribLocation(p, "a"); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
  const u = n => gl.getUniformLocation(p, n);
  s.palette.forEach((c, k) => gl.uniform3fv(u("c" + k), hex(c))); gl.uniform1f(u("g"), s.glow); gl.uniform1f(u("k"), s.folds);
  let vis = true, raf = 0, mx = 0.5, my = 0.5, px = 0.5, py = 0.5;
  const size = () => { const d = Math.min(devicePixelRatio, s.maxDpr); cv.width = cv.clientWidth * d; cv.height = cv.clientHeight * d; gl.viewport(0, 0, cv.width, cv.height); };
  function draw(now = 0) {
    raf = 0; if (!vis) return; px += (mx - px) * 0.05; py += (my - py) * 0.05;
    gl.uniform1f(u("t"), (reduce ? 0 : now / 1000) * s.speed * 6 + scrollY * 0.0015);
    gl.uniform2f(u("m"), 0.5 + (px - 0.5) * s.pointer, 0.5 + (py - 0.5) * s.pointer); gl.uniform2f(u("r"), cv.width, cv.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3); raf = requestAnimationFrame(draw);
  }
  size(); new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(draw); }).observe(cv);
  addEventListener("pointermove", e => { mx = e.clientX / innerWidth; my = 1 - e.clientY / innerHeight; }); addEventListener("resize", size); draw();
})();

// 3D stack (three.js loaded lazily when near the viewport)
const box = $("#scene"), poster = $(".poster", box); poster.innerHTML = stack(4);
new IntersectionObserver((es, io) => {
  if (!es[0].isIntersecting) return; io.disconnect();
  const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"; s.onload = scene; document.head.appendChild(s);
}, { rootMargin: "200px" }).observe(box);
function scene() {
  const T = window.THREE; let r; try { r = new T.WebGLRenderer({ alpha: true, antialias: true }); } catch (e) { return; }
  r.setPixelRatio(Math.min(devicePixelRatio, 1.5)); r.setSize(box.clientWidth, box.clientHeight, false); r.domElement.setAttribute("aria-hidden", "true"); box.appendChild(r.domElement);
  const sc = new T.Scene(), cam = new T.PerspectiveCamera(35, box.clientWidth / box.clientHeight, 0.1, 50), g = new T.Group(); cam.position.set(0, 1, 10);
  const dl = new T.DirectionalLight(0xffffff, 1.1); dl.position.set(4, 6, 5); sc.add(new T.HemisphereLight(0xffffff, 0xc9c6ff, 0.9), dl, g);
  const k = C.colors, bl = [k.tint, "#ffffff", k.tint, "#ffffff", k.accent].map((c, n) => { const m = new T.Mesh(new T.BoxGeometry(3.4, 0.55, 3.4), new T.MeshPhysicalMaterial({ color: c, roughness: 0.3, clearcoat: 1 })); m.rotation.y = n * 0.3; g.add(m); return m; });
  let mx = 0, my = 0;
  const tick = () => {
    const b = box.getBoundingClientRect(), p = Math.min(1, Math.max(0, 1 - (b.top + b.height / 2) / innerHeight)), gap = 0.06 + Math.sin(p * Math.PI) * 0.55;
    bl.forEach((m, n) => { m.position.y = (n - 2) * (0.6 + gap); });
    g.rotation.y += (mx * 0.9 + p * 3 - g.rotation.y) * 0.06; g.rotation.x += (my * 0.2 + 0.3 - g.rotation.x) * 0.06; r.render(sc, cam);
  };
  new IntersectionObserver(([e]) => r.setAnimationLoop(e.isIntersecting && !reduce ? tick : null)).observe(box);
  if (!reduce) addEventListener("pointermove", e => { mx = e.clientX / innerWidth * 2 - 1; my = e.clientY / innerHeight * 2 - 1; });
  addEventListener("resize", () => { r.setSize(box.clientWidth, box.clientHeight, false); cam.aspect = box.clientWidth / box.clientHeight; cam.updateProjectionMatrix(); });
  tick(); poster.classList.add("off");
}

// contact form
const f = $("form");
f.onsubmit = async e => {
  e.preventDefault(); const d = Object.fromEntries(new FormData(f)), x = {};
  if (!d.name.trim()) x.name = "Tell us your name."; if (!/^\S+@\S+\.\S+$/.test(d.email)) x.email = "Enter a valid email, like you@store.com.";
  if (!d.sell.trim()) x.sell = "Tell us what you sell or want to sell."; if (!d.stage) x.stage = "Pick the stage that fits best.";
  ["name", "email", "sell", "stage"].forEach(n => { $("#" + n + "-e").textContent = x[n] || ""; f.elements[n].setAttribute("aria-invalid", !!x[n]); });
  if (Object.keys(x).length || d._honey) return;
  const b = $("button", f); b.disabled = true; b.textContent = "Sending…"; $("#msg").textContent = "";
  try {
    const r = await fetch(C.form.endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ ...d, _subject: "New application from " + d.name }) });
    if (!r.ok) throw 0; f.hidden = true; $("#who").textContent = d.name; $("#ok").hidden = false; $("#ok").focus();
  } catch (_) { $("#msg").textContent = "That didn't send. Check your connection and try again."; b.disabled = false; b.textContent = C.cta.label; }
};
})();
