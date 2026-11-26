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
  var pdf = logic.pdfUrl(post.id);

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
    '<a class="ghost-btn ghost-btn--primary" href="' + pdf + '" target="_blank" rel="noopener">Open PDF</a>'
  );
  links.push('<a class="ghost-btn" href="' + pdf + '" download>Download</a>');
  if (post.source) {
    links.push(
      '<a class="ghost-btn" href="' + esc(post.source) + '" download>Source (.qd)</a>'
    );
  }
  links.push(
    '<button class="ghost-btn" id="pdf-fullscreen" type="button">Full screen</button>'
  );
  document.getElementById("post-links").innerHTML = links.join("");

  var shell = document.getElementById("pdf-shell");
  var frame = document.getElementById("pdf-frame");
  var missing = document.getElementById("pdf-missing");
  var fullscreenBtn = document.getElementById("pdf-fullscreen");
  var closeBtn = document.getElementById("pdf-close");
  frame.title = post.title + " (PDF)";
  frame.src = pdf + "#view=FitH&navpanes=0";

  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    fetch(pdf, { method: "HEAD" })
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
    document.body.classList.toggle("pdf-expanded", on);
    fullscreenBtn.textContent = on ? "Exit full screen" : "Full screen";
  }

  fullscreenBtn.addEventListener("click", function () {
    setFullscreen(!shell.classList.contains("is-full"));
  });
  closeBtn.addEventListener("click", function () {
    setFullscreen(false);
  });
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