(function () {
  "use strict";

  var data = window.BlogData;
  var logic = window.BlogLogic;
  var root = document.getElementById("post-root");
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var posts = logic.sortByDate(logic.visiblePosts(data.posts));
  var post = posts.find(function (item) {
    return item.id === id;
  });

  function esc(value) {
    return logic.escapeHtml(value);
  }

  if (!post) {
    document.title = "Post not found - Dufewe Fangu";
    document.body.removeAttribute("data-hero");
    root.innerHTML =
      '<a class="back-link" href="./">← All posts</a>' +
      '<div class="empty-state">Post not found. <a href="./">Back to the blog</a>.</div>';
    return;
  }

  var category = logic.categoryOf(data.categories, post.category);
  var doc = logic.docUrl(post.id);

  document.title = post.title + " - Dufewe Fangu";
  var description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute("content", post.excerpt || "");

  document.getElementById("post-title").textContent = post.title;

  var meta = [];
  meta.push('<time datetime="' + esc(post.date) + '">' + esc(post.date) + "</time>");
  if (category) {
    meta.push(
      '<a href="archive.html?category=' + encodeURIComponent(category.slug) + '">' +
        esc(category.name) +
        "</a>"
    );
  }
  (post.tags || []).forEach(function (tag) {
    meta.push(
      '<a class="tag" href="archive.html?tag=' +
        encodeURIComponent(tag) +
        '">' +
        esc(tag) +
        "</a>"
    );
  });
  if (post.authors) {
    meta.push(
      '<span class="post-byline">' +
        esc(Array.isArray(post.authors) ? post.authors.join(", ") : post.authors) +
        "</span>"
    );
  }
  if (post.venue) {
    meta.push('<span class="post-venue">' + esc(post.venue) + "</span>");
  }
  document.getElementById("post-meta").innerHTML = meta.join("");

  var links = [];
  (post.links || []).forEach(function (link) {
    links.push(
      '<a class="ghost-btn" href="' + esc(link.href) + '" target="_blank" rel="noopener">' +
        esc(link.label) +
        "</a>"
    );
  });
  links.push(
    '<button class="ghost-btn" id="doc-fullscreen" type="button">Full screen</button>'
  );
  document.getElementById("post-links").innerHTML = links.join("");

  var shell = document.getElementById("doc-shell");
  var frame = document.getElementById("doc-frame");
  var missing = document.getElementById("doc-missing");
  var fullscreenBtn = document.getElementById("doc-fullscreen");
  var closeBtn = document.getElementById("doc-close");
  var themeBtn = document.getElementById("doc-theme");

  var THEME_KEY = "blog-doc-theme";
  var THEME_CSS = [
    "html.qd-dark{--qd-color-scheme:dark;--qd-background-color:#0f1411;--qd-main-color:#dfe7e0;--qd-link-color:#7fd48a;--qd-primary-color:#2a312b;--qd-nested-navigation-line-color:rgba(255,255,255,.18);--qd-docs-header-background-color:#151b16;--qd-docs-separator-border-color:#232b25;--qd-docs-search-border-color:#39423b}",
    "html.qd-dark .quarkdown blockquote{border-color:rgba(255,255,255,.2)}",
    "html.qd-dark .hljs{background:#0d1117;color:#c9d1d9}",
    "html.qd-dark .hljs-comment,html.qd-dark .hljs-quote{color:#8b949e}",
    "html.qd-dark .hljs-keyword,html.qd-dark .hljs-attribute,html.qd-dark .hljs-selector-tag,html.qd-dark .hljs-doctag,html.qd-dark .hljs-name,html.qd-dark .hljs-tag{color:#ff7b72}",
    "html.qd-dark .hljs-type,html.qd-dark .hljs-string,html.qd-dark .hljs-number,html.qd-dark .hljs-selector-id,html.qd-dark .hljs-selector-class,html.qd-dark .hljs-template-tag{color:#a5d6ff}",
    "html.qd-dark .hljs-title,html.qd-dark .hljs-section{color:#d2a8ff}",
    "html.qd-dark .hljs-regexp,html.qd-dark .hljs-symbol,html.qd-dark .hljs-variable,html.qd-dark .hljs-template-variable,html.qd-dark .hljs-link,html.qd-dark .hljs-operator,html.qd-dark .hljs-selector-pseudo,html.qd-dark .hljs-literal,html.qd-dark .hljs-built_in,html.qd-dark .hljs-bullet,html.qd-dark .hljs-code{color:#79c0ff}",
    "html.qd-dark .hljs-addition{color:#aff5b4}",
    "html.qd-dark .hljs-deletion{color:#ffa198}",
    "html.qd-dark .hljs-meta{color:#8b949e}",
    ".doc-theme-toggle{position:fixed;top:14px;left:14px;z-index:2147483647;display:grid;place-items:center;width:36px;height:36px;padding:0;border:1px solid rgba(0,0,0,.18);border-radius:50%;background:rgba(255,255,255,.88);color:#151a16;font:16px/1 sans-serif;cursor:pointer;box-shadow:0 2px 10px rgba(0,0,0,.15)}",
    "html.qd-dark .doc-theme-toggle{border-color:rgba(255,255,255,.25);background:rgba(12,17,13,.85);color:#e8efe9}",
    "html.doc-fullscreen .doc-theme-toggle{display:none}"
  ].join("");
  var dark = false;
  try {
    dark = localStorage.getItem(THEME_KEY) === "dark";
  } catch (e) {}

  function frameDoc() {
    try {
      return frame.contentDocument;
    } catch (e) {
      return null;
    }
  }

  function syncTheme() {
    var icon = dark ? "☀" : "☾";
    var label = dark ? "Switch to light theme" : "Switch to dark theme";
    themeBtn.textContent = icon;
    themeBtn.setAttribute("aria-label", label);
    var doc = frameDoc();
    var btn = doc && doc.getElementById("doc-theme-toggle");
    if (btn) {
      btn.textContent = icon;
      btn.setAttribute("aria-label", label);
    }
  }

  function applyTheme() {
    var doc = frameDoc();
    if (doc) doc.documentElement.classList.toggle("qd-dark", dark);
    syncTheme();
  }

  function setTheme(next) {
    dark = next;
    try {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch (e) {}
    applyTheme();
  }

  function setupFrame() {
    var doc = frameDoc();
    if (!doc || doc.getElementById("doc-theme-toggle")) return;
    var style = doc.createElement("style");
    style.textContent = THEME_CSS;
    (doc.head || doc.documentElement).appendChild(style);
    var btn = doc.createElement("button");
    btn.type = "button";
    btn.id = "doc-theme-toggle";
    btn.className = "doc-theme-toggle";
    btn.addEventListener("click", function () {
      setTheme(!dark);
    });
    (doc.body || doc.documentElement).appendChild(btn);
    applyTheme();
  }

  frame.title = post.title;
  frame.addEventListener("load", setupFrame);
  frame.src = doc;

  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    fetch(doc, { method: "HEAD" })
      .then(function (response) {
        if (!response.ok) {
          frame.hidden = true;
          missing.hidden = false;
        }
      })
      .catch(function () {});
  }

  function setFullscreen(on) {
    shell.classList.toggle("is-full", on);
    document.body.classList.toggle("doc-expanded", on);
    fullscreenBtn.textContent = on ? "Exit full screen" : "Full screen";
    var doc = frameDoc();
    if (doc) doc.documentElement.classList.toggle("doc-fullscreen", on);
  }

  fullscreenBtn.addEventListener("click", function () {
    setFullscreen(!shell.classList.contains("is-full"));
  });
  closeBtn.addEventListener("click", function () {
    setFullscreen(false);
  });
  themeBtn.addEventListener("click", function () {
    setTheme(!dark);
  });
  syncTheme();
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && shell.classList.contains("is-full")) {
      setFullscreen(false);
    }
  });

  var relations = logic.prevNext(posts, post.id);
  var navItems = [];
  if (relations.newer) {
    navItems.push(
      '<a class="post-nav__item" href="' + logic.postUrl(relations.newer.id) + '">' +
        '<span class="post-nav__label">Newer</span>' +
        '<span class="post-nav__title">' + esc(relations.newer.title) + "</span>" +
        "</a>"
    );
  }
  if (relations.older) {
    navItems.push(
      '<a class="post-nav__item post-nav__item--older" href="' +
        logic.postUrl(relations.older.id) + '">' +
        '<span class="post-nav__label">Older</span>' +
        '<span class="post-nav__title">' + esc(relations.older.title) + "</span>" +
        "</a>"
    );
  }
  if (navItems.length) {
    document.getElementById("post-nav").innerHTML = navItems.join("");
  } else {
    document.getElementById("post-nav").hidden = true;
  }
})();