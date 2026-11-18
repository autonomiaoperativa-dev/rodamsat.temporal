/* Tienda RODAMSAT — catálogo, filtros, buscador y ficha de producto.
   Hoy lee assets/catalogo.js (muestra tomada de syscom.mx). En producción, los mismos campos
   llegan de la API de Syscom (GET /productos): titulo, marca, modelo, img_portada, precios, existencia. */
(function () {
  var R = window.RODAMSAT, $ = R.$, $$ = R.$$, esc = R.esc;
  var ALL = window.CATALOGO || [], DEPTS = window.DEPARTAMENTOS || [];
  var PAGE = 24;
  var state = { depto: "", marcas: [], q: "", sort: "rel", shown: PAGE };

  // Estado inicial desde la URL (?depto=solar&q=...)
  try {
    var sp = new URLSearchParams(location.search);
    if (sp.get("depto")) state.depto = sp.get("depto");
    if (sp.get("q")) state.q = sp.get("q");
  } catch (e) {}

  var grid = $("#grid"), tabs = $("#dept-tabs"), brandList = $("#brand-list"), chips = $("#active-chips");
  var title = $("#results-title"), countEl = $("#results-count"), more = $("#more"), q = $("#q"), filters = $("#filters");
  q.value = state.q;

  function norm(t) { return String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function deptName(slug) { for (var k = 0; k < DEPTS.length; k++) if (DEPTS[k].slug === slug) return DEPTS[k].nombre; return ""; }

  function filtered(ignoreBrand) {
    var words = norm(state.q).split(/\s+/).filter(Boolean);
    var list = ALL.filter(function (p) {
      if (state.depto && p.depto !== state.depto) return false;
      if (!ignoreBrand && state.marcas.length && state.marcas.indexOf(p.marca) < 0) return false;
      if (words.length) {
        var hay = norm(p.titulo + " " + p.marca + " " + p.modelo);
        for (var k = 0; k < words.length; k++) if (hay.indexOf(words[k]) < 0) return false;
      }
      return true;
    });
    if (state.sort === "marca") list = list.slice().sort(function (a, b) { return a.marca.localeCompare(b.marca) || a.modelo.localeCompare(b.modelo); });
    if (state.sort === "modelo") list = list.slice().sort(function (a, b) { return a.modelo.localeCompare(b.modelo); });
    return list;
  }

  function renderTabs() {
    var html = '<button class="dept-tab' + (state.depto ? "" : " active") + '" data-depto="" role="tab">Todo <small>' + ALL.length + '</small></button>';
    DEPTS.forEach(function (d) {
      var n = ALL.filter(function (p) { return p.depto === d.slug; }).length;
      html += '<button class="dept-tab' + (state.depto === d.slug ? " active" : "") + '" data-depto="' + d.slug + '" role="tab">' + esc(d.nombre) + ' <small>' + n + '</small></button>';
    });
    tabs.innerHTML = html;
    var fd = $("#footer-depts");
    if (fd) fd.innerHTML = DEPTS.slice(0, 6).map(function (d) { return '<li><a href="tienda.html?depto=' + d.slug + '">' + esc(d.nombre) + '</a></li>'; }).join("");
  }

  function renderBrands() {
    var counts = {};
    filtered(true).forEach(function (p) { counts[p.marca] = (counts[p.marca] || 0) + 1; });
    var names = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a] || a.localeCompare(b); });
    state.marcas = state.marcas.filter(function (m) { return counts[m]; });
    brandList.innerHTML = names.map(function (m) {
      return '<label class="brand-opt"><input type="checkbox" value="' + esc(m) + '"' + (state.marcas.indexOf(m) >= 0 ? " checked" : "") + '> ' + esc(m) + ' <small>' + counts[m] + '</small></label>';
    }).join("") || '<span style="color:var(--muted);font-size:14px">Sin marcas para esta búsqueda</span>';
  }

  function render() {
    renderBrands();
    var list = filtered();
    title.textContent = state.q ? 'Resultados para "' + state.q + '"' : (deptName(state.depto) || "Todos los productos");
    countEl.textContent = list.length + (list.length === 1 ? " producto" : " productos");
    var c = "";
    if (state.depto) c += '<button type="button" data-clear="depto">' + esc(deptName(state.depto)) + ' ✕</button>';
    state.marcas.forEach(function (m) { c += '<button type="button" data-clear="marca" data-v="' + esc(m) + '">' + esc(m) + ' ✕</button>'; });
    if (state.q) c += '<button type="button" data-clear="q">"' + esc(state.q) + '" ✕</button>';
    chips.innerHTML = c;
    if (!list.length) {
      grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><b>No encontramos ese equipo en la muestra</b>Tenemos acceso al catálogo completo. Escríbenos el modelo y te lo cotizamos.</div>';
      more.hidden = true; return;
    }
    grid.innerHTML = list.slice(0, state.shown).map(R.productCard).join("");
    more.hidden = list.length <= state.shown;
  }

  function set(patch) { for (var k in patch) state[k] = patch[k]; state.shown = PAGE; renderTabs(); render(); }

  tabs.addEventListener("click", function (e) {
    var b = e.target.closest("[data-depto]"); if (!b) return;
    set({ depto: b.getAttribute("data-depto"), marcas: [] });
    b = tabs.querySelector(".active"); if (b && b.scrollIntoView) b.scrollIntoView({ inline: "center", block: "nearest" });
  });
  brandList.addEventListener("change", function () {
    set({ marcas: $$("input:checked", brandList).map(function (i) { return i.value; }) });
  });
  chips.addEventListener("click", function (e) {
    var b = e.target.closest("[data-clear]"); if (!b) return;
    var t = b.getAttribute("data-clear");
    if (t === "depto") set({ depto: "" });
    if (t === "q") { q.value = ""; set({ q: "" }); }
    if (t === "marca") set({ marcas: state.marcas.filter(function (m) { return m !== b.getAttribute("data-v"); }) });
  });
  $("#search-form").addEventListener("submit", function (e) { e.preventDefault(); set({ q: q.value.trim() }); grid.scrollIntoView({ block: "start" }); });
  var deb; q.addEventListener("input", function () { clearTimeout(deb); deb = setTimeout(function () { set({ q: q.value.trim() }); }, 220); });
  $("#sort").addEventListener("change", function (e) { set({ sort: e.target.value }); });
  more.addEventListener("click", function () { state.shown += PAGE; render(); });
  $("#filters-toggle").addEventListener("click", function () { filters.classList.add("open"); $(".overlay").classList.add("show"); });

  /* ---------- Ficha ---------- */
  var modal = $("#modal"), current = null, mq = $("#m-qty");
  function openModal(p) {
    current = p; mq.value = 1;
    var big = p.imagen.replace("width=220,height=220", "width=520,height=520");
    $("#m-img").src = big; $("#m-img").alt = p.titulo;
    $("#m-brand").textContent = p.marca; $("#m-title").textContent = p.titulo;
    $("#m-specs").innerHTML = "<dt>Modelo</dt><dd>" + esc(p.modelo) + "</dd><dt>Marca</dt><dd>" + esc(p.marca) + "</dd><dt>Categoría</dt><dd>" + esc(deptName(p.depto)) + "</dd><dt>Garantía</dt><dd>De fábrica, gestionada por RODAMSAT</dd><dt>Instalación</dt><dd>Opcional, con ingenieros propios</dd>";
    modal.classList.add("open"); $(".overlay").classList.add("show");
  }
  R.bindProducts(grid, ALL, openModal);
  $("#m-minus").addEventListener("click", function () { mq.value = Math.max(1, (+mq.value || 1) - 1); });
  $("#m-plus").addEventListener("click", function () { mq.value = Math.min(999, (+mq.value || 1) + 1); });
  $("#m-add").addEventListener("click", function () { if (!current) return; R.cart.add(current, Math.max(1, +mq.value || 1)); R.closeAll(); R.openDrawer(); });
  modal.addEventListener("click", function (e) { if (e.target === modal) R.closeAll(); });

  renderTabs(); render();
})();
