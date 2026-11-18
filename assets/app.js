/* RODAMSAT — lógica común: menú, animaciones, lista de cotización, formularios. */
var RODAMSAT = {
  // POR CONFIRMAR con RODAMSAT: número de WhatsApp (formato internacional sin "+").
  whatsapp: "524448206058",
  email: "info@rodamsat.com.mx",
  telefono: "(444) 820 6058"
};

(function () {
  var doc = document.documentElement;
  doc.classList.remove("no-js");

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function ico(n) { return '<svg aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  RODAMSAT.$ = $; RODAMSAT.$$ = $$; RODAMSAT.esc = esc; RODAMSAT.ico = ico;

  /* ---------- Header ---------- */
  var header = $(".header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var menuBtn = $(".menu-btn"), nav = $(".nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open);
      menuBtn.innerHTML = ico(open ? "close" : "menu");
    });
    $$(".nav a").forEach(function (a) { a.addEventListener("click", function () { nav.classList.remove("open"); menuBtn.innerHTML = ico("menu"); }); });
  }

  /* ---------- Reveal + counters ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      if (e.target.hasAttribute("data-count")) count(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }) : null;
  $$(".reveal, [data-count]").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); });
  function count(el) {
    var end = +el.getAttribute("data-count"), start = performance.now(), dur = 1400;
    var sup = el.querySelector("sup"); var supHtml = sup ? sup.outerHTML : "";
    (function tick(now) {
      var p = Math.min(1, (now - start) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.innerHTML = v.toLocaleString("es-MX") + supHtml;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  /* ---------- Toast ---------- */
  var toast = document.createElement("div");
  toast.className = "toast"; toast.setAttribute("role", "status");
  document.body.appendChild(toast);
  var tt;
  RODAMSAT.toast = function (msg) {
    toast.innerHTML = ico("check") + "<span>" + esc(msg) + "</span>";
    toast.classList.add("show"); clearTimeout(tt);
    tt = setTimeout(function () { toast.classList.remove("show"); }, 2400);
  };

  /* ---------- Lista de cotización (persistente en este navegador) ---------- */
  var KEY = "rodamsat-cotizacion";
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} render(); }
  function find(id) { for (var k = 0; k < cart.length; k++) if (cart[k].id === id) return cart[k]; return null; }
  RODAMSAT.cart = {
    add: function (p, qty) {
      var it = find(p.id);
      if (it) it.qty += qty || 1;
      else cart.push({ id: p.id, titulo: p.titulo, marca: p.marca, modelo: p.modelo, imagen: p.imagen, qty: qty || 1 });
      save(); RODAMSAT.toast("Agregado a tu cotización");
    },
    set: function (id, q) { var it = find(id); if (!it) return; it.qty = Math.max(1, Math.min(999, q | 0 || 1)); save(); },
    remove: function (id) { cart = cart.filter(function (x) { return x.id !== id; }); save(); },
    clear: function () { cart = []; save(); },
    items: function () { return cart; }
  };

  var overlay = $(".overlay"), drawer = $(".drawer");
  RODAMSAT.openDrawer = function () { if (!drawer) return; drawer.classList.add("open"); overlay.classList.add("show"); drawer.setAttribute("aria-hidden", "false"); var c = $(".drawer .icon-btn", drawer); if (c) c.focus(); };
  RODAMSAT.closeAll = function () {
    if (drawer) { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); }
    var m = $(".modal.open"); if (m) m.classList.remove("open");
    var f = $(".filters.open"); if (f) f.classList.remove("open");
    if (overlay) overlay.classList.remove("show");
    document.body.style.overflow = "";
  };
  if (overlay) overlay.addEventListener("click", RODAMSAT.closeAll);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") RODAMSAT.closeAll(); });
  $$("[data-open-cart]").forEach(function (b) { b.addEventListener("click", RODAMSAT.openDrawer); });
  $$("[data-close]").forEach(function (b) { b.addEventListener("click", RODAMSAT.closeAll); });

  function render() {
    var n = cart.reduce(function (a, b) { return a + b.qty; }, 0);
    $$(".cart-count").forEach(function (c) { c.textContent = n; c.setAttribute("data-n", n); });
    var sub = $(".drawer-head p"); if (sub) sub.textContent = cart.length ? cart.length + (cart.length === 1 ? " producto" : " productos") + " · " + n + " piezas" : "Aún no agregas productos";
    var body = $(".drawer-body"); if (!body) return;
    var foot = $(".drawer-foot");
    if (!cart.length) {
      body.innerHTML = '<div class="drawer-empty"><b>Tu lista está vacía</b>Agrega equipos desde la tienda y te enviamos precio, disponibilidad y tiempo de entrega.<br><br><a class="btn btn-dark btn-sm" href="tienda.html">Ir a la tienda</a></div>';
      if (foot) foot.style.display = "none";
      return;
    }
    if (foot) foot.style.display = "";
    body.innerHTML = cart.map(function (it) {
      return '<div class="line" data-id="' + esc(it.id) + '">' +
        '<img src="' + esc(it.imagen) + '" alt="" loading="lazy">' +
        '<div><div class="line-title">' + esc(it.titulo) + '</div><div class="line-meta">' + esc(it.marca) + ' · ' + esc(it.modelo) + '</div>' +
        '<button class="line-remove" type="button">Quitar</button></div>' +
        '<div class="qty"><button type="button" data-d="-1" aria-label="Menos">−</button><input type="number" min="1" max="999" value="' + it.qty + '" aria-label="Cantidad"><button type="button" data-d="1" aria-label="Más">+</button></div>' +
        '</div>';
    }).join("");
  }
  var dbody = $(".drawer-body");
  if (dbody) {
    dbody.addEventListener("click", function (e) {
      var line = e.target.closest(".line"); if (!line) return;
      var id = line.getAttribute("data-id"), it = find(id);
      if (e.target.closest(".line-remove")) RODAMSAT.cart.remove(id);
      var d = e.target.closest("[data-d]"); if (d && it) RODAMSAT.cart.set(id, it.qty + +d.getAttribute("data-d"));
    });
    dbody.addEventListener("change", function (e) {
      var line = e.target.closest(".line"); if (line && e.target.matches("input")) RODAMSAT.cart.set(line.getAttribute("data-id"), +e.target.value);
    });
  }
  render();

  function quoteText(data) {
    var t = "Hola RODAMSAT, solicito cotización de:\n\n";
    cart.forEach(function (it, k) { t += (k + 1) + ". " + it.qty + " x " + it.modelo + " (" + it.marca + ") — " + it.titulo + "\n"; });
    t += "\nNombre: " + data.nombre + (data.empresa ? "\nEmpresa: " + data.empresa : "") + "\nCorreo: " + data.correo + (data.telefono ? "\nTeléfono: " + data.telefono : "") + (data.cp ? "\nCP de entrega: " + data.cp : "");
    return t;
  }
  var qform = $("#quote-form");
  if (qform) {
    qform.addEventListener("submit", function (e) { e.preventDefault(); });
    $$("[data-send]", qform).forEach(function (b) {
      b.addEventListener("click", function () {
        var data = validate(qform); if (!data || !cart.length) return;
        var txt = quoteText(data);
        var url = b.getAttribute("data-send") === "wa"
          ? "https://wa.me/" + RODAMSAT.whatsapp + "?text=" + encodeURIComponent(txt)
          : "mailto:" + RODAMSAT.email + "?subject=" + encodeURIComponent("Solicitud de cotización — tienda en línea") + "&body=" + encodeURIComponent(txt);
        window.open(url, "_blank", "noopener");
        RODAMSAT.toast("Abrimos tu solicitud para enviarla");
      });
    });
  }

  /* ---------- Validación de formularios ---------- */
  function validate(form) {
    var ok = true, data = {};
    $$(".field", form).forEach(function (f) {
      var inp = f.querySelector("input, select, textarea"); if (!inp) return;
      var v = inp.value.trim(); data[inp.name] = v;
      var bad = (inp.required && !v) || (inp.type === "email" && v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v));
      f.classList.toggle("invalid", bad); if (bad) ok = false;
    });
    var chk = form.querySelector('.check input[required]');
    if (chk && !chk.checked) { ok = false; chk.closest(".check").style.color = "var(--red-600)"; }
    else if (chk) chk.closest(".check").style.color = "";
    if (!ok) { var first = form.querySelector(".invalid input, .invalid select, .invalid textarea"); if (first) first.focus(); }
    return ok ? data : null;
  }
  RODAMSAT.validate = validate;

  var cform = $("#contact-form");
  if (cform) {
    cform.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = validate(cform); if (!data) return;
      // Fase 1: se abre el correo con los datos. En producción: enviar a un endpoint (correo + CRM) con Turnstile/reCAPTCHA.
      var body = "Nombre: " + data.nombre + "\nEmpresa: " + (data.empresa || "—") + "\nCorreo: " + data.correo + "\nTeléfono: " + (data.telefono || "—") + "\nSolución: " + data.solucion + "\nUbicación del sitio: " + (data.ubicacion || "—") + "\n\n" + data.mensaje;
      window.location.href = "mailto:" + RODAMSAT.email + "?subject=" + encodeURIComponent("Cotización: " + data.solucion) + "&body=" + encodeURIComponent(body);
      $(".form-ok", cform).classList.add("show");
    });
    $$("[data-solucion]").forEach(function (b) {
      b.addEventListener("click", function () {
        var sel = cform.querySelector('select[name="solucion"]');
        if (sel) sel.value = b.getAttribute("data-solucion");
        document.getElementById("contacto").scrollIntoView();
        setTimeout(function () { var n = cform.querySelector('input[name="nombre"]'); if (n) n.focus({ preventScroll: true }); }, 500);
      });
    });
  }

  $$("[data-wa]").forEach(function (a) {
    a.href = "https://wa.me/" + RODAMSAT.whatsapp + "?text=" + encodeURIComponent(a.getAttribute("data-wa") || "Hola RODAMSAT, me interesa una cotización.");
    a.target = "_blank"; a.rel = "noopener";
  });
  $$("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });

  /* ---------- Tarjeta de producto (home y tienda) ---------- */
  RODAMSAT.productCard = function (p) {
    return '<article class="product" data-id="' + esc(p.id) + '">' +
      '<div class="product-img" data-view><img src="' + esc(p.imagen) + '" alt="' + esc(p.titulo) + '" loading="lazy" onerror="this.style.opacity=0"></div>' +
      '<div class="product-body"><span class="product-brand">' + esc(p.marca) + '</span>' +
      '<h3 class="product-title">' + esc(p.titulo) + '</h3>' +
      '<span class="product-model">' + esc(p.modelo) + '</span>' +
      '<div class="product-foot"><span class="price-ask"><b>Por cotización</b>Precio y existencia</span>' +
      '<button class="add-btn" type="button" data-add aria-label="Agregar ' + esc(p.modelo) + ' a la cotización">' + ico("plus") + '</button></div></div></article>';
  };
  RODAMSAT.bindProducts = function (root, list, onView) {
    root.addEventListener("click", function (e) {
      var card = e.target.closest(".product"); if (!card) return;
      var id = card.getAttribute("data-id"), p = null;
      for (var k = 0; k < list.length; k++) if (list[k].id === id) p = list[k];
      if (!p) return;
      var add = e.target.closest("[data-add]");
      if (add) { RODAMSAT.cart.add(p, 1); add.classList.add("added"); add.innerHTML = ico("check"); setTimeout(function () { add.classList.remove("added"); add.innerHTML = ico("plus"); }, 1400); }
      else if (e.target.closest("[data-view]") || e.target.closest(".product-title")) { if (onView) onView(p); }
    });
  };

  /* Home: equipos destacados (Syscom pide destacar productos SYSCOM/HIKVISION en portada). */
  var feat = $("#featured-products");
  if (feat && window.CATALOGO) {
    // HIKVISION y EPCOM (marca propia de Syscom) van primero.
    var want = ["DS-2CD1143G3-LIUF", "DS-K1T321EFWX-B/S", "EP-OA1900-CMC", "LBE-5AC-GEN2", "MIN6000TLX2", "RUT956", "U6-PRO", "V66-PRO"];
    var picks = [];
    want.forEach(function (m) { window.CATALOGO.forEach(function (p) { if (p.modelo === m && picks.indexOf(p) < 0) picks.push(p); }); });
    picks = picks.slice(0, 8);
    feat.innerHTML = picks.map(RODAMSAT.productCard).join("");
    RODAMSAT.bindProducts(feat, picks, function () { window.location.href = "tienda.html"; });
  }
})();
