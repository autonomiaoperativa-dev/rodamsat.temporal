/* Sprite de íconos (trazo 1.8, estilo lineal). Se inserta al inicio del <body>. */
(function () {
  var s = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  var i = {
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    cart: '<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    satellite: '<path d="M13 7 9 3 5 7l4 4"/><path d="m17 11 4 4-4 4-4-4"/><path d="m8 12 4 4 6-6-4-4-6 6z"/><path d="m16 8 3-3"/><path d="M9 21a6 6 0 0 0-6-6"/>',
    tower: '<path d="M12 9v13M8 22l4-13 4 13M9.5 17h5"/><circle cx="12" cy="7" r="2"/><path d="M7.8 3.8a6 6 0 0 0 0 6.4M16.2 3.8a6 6 0 0 1 0 6.4M5 1.5a10 10 0 0 0 0 11M19 1.5a10 10 0 0 1 0 11"/>',
    signal: '<path d="M2 20h.01M7 20v-4M12 20v-8M17 20V8M22 4v16"/>',
    camera: '<path d="M3 7h12l4-3v14l-4-3H3z"/><circle cx="9" cy="11" r="2.5"/>',
    cctv: '<path d="M3 9l13-5 2 5-13 5z"/><path d="M8 12l1.5 4H14M14 13v6M14 19H8"/><path d="m18 9 3 1"/>',
    finger: '<path d="M12 11v4M8.5 7.5A5 5 0 0 1 17 11v2a12 12 0 0 1-1 5M7 11a5 5 0 0 1 .4-2M7 15v-4M4.5 13a8 8 0 0 1 2-8.6A8 8 0 0 1 20 11v1M10 19.5a12 12 0 0 0 1-4.5M13.5 21a16 16 0 0 0 .5-4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    solar: '<path d="M4 4h16l2 10H2z"/><path d="M8 4l-1 10M16 4l1 10M3 9h18M12 14v4M8 21h8"/>',
    network: '<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-2a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2M12 12v2"/>',
    pbx: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h10v3H7zM7 14h2M11 14h2M15 14h2M7 17h2M11 17h2M15 17h2"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    truck: '<path d="M1 4h14v12H1zM15 9h4l3 3v4h-7"/><circle cx="6" cy="18.5" r="2"/><circle cx="18" cy="18.5" r="2"/>',
    receipt: '<path d="M5 2v20l3-2 2 2 2-2 2 2 2-2 3 2V2l-3 2-2-2-2 2-2-2-2 2z"/><path d="M9 8h6M9 12h6"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    mine: '<path d="M2 20h20M5 20l5-9 3 4 2-3 4 8"/><path d="M14 4l3 3M17 4l-3 3"/>',
    factory: '<path d="M2 20V9l6 4V9l6 4V4h6v16z"/><path d="M6 17h2M11 17h2M16 17h2"/>',
    gov: '<path d="M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M2 10h20L12 3z"/>',
    store: '<path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18"/><path d="M9 20v-6h6v6"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15"/>',
    whatsapp: '<path d="M3 21l1.7-5A9 9 0 1 1 8 19.3z" /><path d="M8.5 9.5c.3 1.6 1.4 3.5 3 4.8 1.4 1.1 2.7 1.6 3.6 1.7.6 0 1.4-.6 1.5-1.2l.1-.6-2-1-1 1c-1.1-.4-2.5-1.6-3-2.9l1-1-.9-2.1h-.7c-.8.1-1.7.8-1.6 1.3z"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h2M14 6h2M8 10h2M14 10h2M8 14h2M14 14h2"/>',
    headset: '<path d="M3 14v-2a9 9 0 0 1 18 0v2"/><path d="M21 15a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z"/><path d="M18 17v1a3 3 0 0 1-3 3h-3"/>'
  };
  var out = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">';
  for (var k in i) out += '<symbol id="i-' + k + '" viewBox="0 0 24 24" ' + s + '>' + i[k] + '</symbol>';
  out += '</svg>';
  document.body.insertAdjacentHTML('afterbegin', out);
})();
