// Font catalog + loader, shared by the public site and the admin panel.
// Only fonts listed in CATALOG can ever be used, so edited/tampered content can't inject
// arbitrary URLs or CSS. Each font is loaded with its own <link>, so one failing font never
// takes the others down with it.
(function (root) {
  "use strict";

  // w = weights that really exist for that family on Google Fonts (asking for a missing weight makes Google reject the request).
  var CATALOG = [
    // Serif
    { name: "Playfair Display",   cat: "serif",  w: [400, 500, 600, 700] },
    { name: "Lora",               cat: "serif",  w: [400, 500, 600, 700] },
    { name: "Merriweather",       cat: "serif",  w: [400, 700] },
    { name: "Cormorant Garamond", cat: "serif",  w: [400, 500, 600, 700] },
    { name: "DM Serif Display",   cat: "serif",  w: [400] },
    { name: "Libre Baskerville",  cat: "serif",  w: [400, 700] },
    { name: "Source Serif 4",     cat: "serif",  w: [400, 500, 600, 700] },
    { name: "Bitter",             cat: "serif",  w: [400, 500, 600, 700] },
    // Sans-serif
    { name: "Quicksand",          cat: "sans",   w: [400, 500, 600, 700] },
    { name: "Inter",              cat: "sans",   w: [400, 500, 600, 700] },
    { name: "Poppins",            cat: "sans",   w: [400, 500, 600, 700] },
    { name: "Nunito",             cat: "sans",   w: [400, 500, 600, 700] },
    { name: "DM Sans",            cat: "sans",   w: [400, 500, 600, 700] },
    { name: "Manrope",            cat: "sans",   w: [400, 500, 600, 700] },
    { name: "Outfit",             cat: "sans",   w: [400, 500, 600, 700] },
    { name: "Work Sans",          cat: "sans",   w: [400, 500, 600, 700] },
    { name: "Plus Jakarta Sans",  cat: "sans",   w: [400, 500, 600, 700] },
    { name: "Space Grotesk",      cat: "sans",   w: [400, 500, 600, 700] },
    { name: "Sora",               cat: "sans",   w: [400, 500, 600, 700] },
    { name: "Raleway",            cat: "sans",   w: [400, 500, 600, 700] },
    { name: "Montserrat",         cat: "sans",   w: [400, 500, 600, 700] },
    { name: "Open Sans",          cat: "sans",   w: [400, 500, 600, 700] },
    { name: "Lato",               cat: "sans",   w: [400, 700] },
    // Script / handwriting
    { name: "Dancing Script",     cat: "script", w: [400, 500, 600, 700] },
    { name: "Caveat",             cat: "script", w: [400, 500, 600, 700] },
    { name: "Pacifico",           cat: "script", w: [400] },
    { name: "Great Vibes",        cat: "script", w: [400] },
    { name: "Satisfy",            cat: "script", w: [400] },
    { name: "Sacramento",         cat: "script", w: [400] },
    { name: "Kaushan Script",     cat: "script", w: [400] },
    { name: "Allura",             cat: "script", w: [400] },
    // Monospace (a nice touch for a developer)
    { name: "JetBrains Mono",     cat: "mono",   w: [400, 500, 600, 700] },
    { name: "Fira Code",          cat: "mono",   w: [400, 500, 600, 700] },
    { name: "IBM Plex Mono",      cat: "mono",   w: [400, 500, 600, 700] },
    { name: "Space Mono",         cat: "mono",   w: [400, 700] }
  ];

  var DEFAULTS = { heading: "Playfair Display", accent: "Dancing Script", body: "Quicksand" };
  var ROLES = ["heading", "accent", "body"];

  var FALLBACK = {
    serif:  'Georgia, "Times New Roman", serif',
    sans:   '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    script: '"Segoe Script", "Brush Script MT", cursive',
    mono:   'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
  };
  var CAT_LABEL = { serif: "Serif", sans: "Sans-serif", script: "Script", mono: "Monospace" };

  var CACHE_KEY = "siteFonts";
  var byName = {};
  CATALOG.forEach(function (f) { byName[f.name] = f; });

  function find(name) { return byName[name] || null; }

  // Returns a complete, valid { heading, accent, body } - unknown names fall back to the defaults.
  function normalize(f) {
    f = f && typeof f === "object" ? f : {};
    var out = {};
    ROLES.forEach(function (r) { out[r] = byName[f[r]] ? f[r] : DEFAULTS[r]; });
    return out;
  }

  function href(font, allWeights) {
    var fam = encodeURIComponent(font.name).replace(/%20/g, "+");
    var w = allWeights === false ? [400] : font.w;
    var spec = w.length > 1 ? ":wght@" + w.join(";") : "";
    return "https://fonts.googleapis.com/css2?family=" + fam + spec + "&display=swap";
  }

  var requested = {};
  // Adds the stylesheet link for one font (once). weights:false loads only the regular weight (used by the admin picker).
  function load(name, weights) {
    var font = find(name);
    if (!font) return;
    var key = name + (weights === false ? "|reg" : "|all");
    if (requested[key] || requested[name + "|all"]) return;
    requested[key] = true;
    if (!document.querySelector('link[rel="preconnect"][href="https://fonts.gstatic.com"]')) {
      var pc = document.createElement("link");
      pc.rel = "preconnect"; pc.href = "https://fonts.gstatic.com"; pc.crossOrigin = "anonymous";
      document.head.appendChild(pc);
    }
    var l = document.createElement("link");
    l.rel = "stylesheet"; l.href = href(font, weights);
    document.head.appendChild(l);
  }

  function stack(name) {
    var font = find(name);
    return '"' + name + '", ' + FALLBACK[font ? font.cat : "sans"];
  }

  // Sets the CSS variables on a node (default: <html>) and loads the font files.
  function setVars(fonts, node) {
    node = node || document.documentElement;
    node.style.setProperty("--serif", stack(fonts.heading));
    node.style.setProperty("--script", stack(fonts.accent));
    node.style.setProperty("--sans", stack(fonts.body));
    if (node === document.documentElement) node.setAttribute("data-accent", find(fonts.accent).cat);
  }

  // Applies the fonts to the page. Resolves when the fonts are ready (or after `wait` ms, whichever is first),
  // so the page can be drawn without a visible font swap.
  function apply(fonts, opts) {
    opts = opts || {};
    fonts = normalize(fonts);
    ROLES.forEach(function (r) { load(fonts[r]); });
    setVars(fonts);
    if (opts.cache !== false) { try { localStorage.setItem(CACHE_KEY, JSON.stringify(fonts)); } catch (e) { /* storage blocked */ } }
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var ready = Promise.all(ROLES.map(function (r) {
      var font = find(fonts[r]);
      return document.fonts.load("400 1em " + JSON.stringify(font.name)).catch(function () {});
    }));
    return Promise.race([ready, new Promise(function (res) { setTimeout(res, opts.wait == null ? 1500 : opts.wait); })]);
  }

  // Runs in <head>: repeat visitors get their chosen fonts on the very first paint.
  function applyCached() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(CACHE_KEY) || "null"); } catch (e) { /* ignore */ }
    var fonts = normalize(saved);
    ROLES.forEach(function (r) { load(fonts[r]); });
    setVars(fonts);
  }

  root.SiteFonts = {
    CATALOG: CATALOG, DEFAULTS: DEFAULTS, ROLES: ROLES, CAT_LABEL: CAT_LABEL,
    find: find, normalize: normalize, load: load, stack: stack, setVars: setVars, apply: apply, applyCached: applyCached
  };
})(window);
