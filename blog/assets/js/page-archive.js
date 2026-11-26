(function () {
  "use strict";

  var data = window.BlogData;
  var logic = window.BlogLogic;
  var components = window.BlogComponents;
  var filtersHost = document.getElementById("archive-filters");
  var hintHost = document.getElementById("archive-hint");
  var listHost = document.getElementById("archive-list");
  var tagHost = document.getElementById("tag-cloud");
  var timelineHost = document.getElementById("timeline");
  var posts = logic.sortByDate(logic.visiblePosts(data.posts));
  var params = new URLSearchParams(window.location.search);
  var state = {
    category: params.get("category") || "all",
    tag: params.get("tag") || ""
  };

  if (state.category !== "all" && !logic.categoryOf(data.categories, state.category)) {
    state.category = "all";
  }

  function countFor(slug) {
    return logic.filterPosts(posts, { category: slug }).length;
  }

  function renderFilters() {
    var chips = [{ slug: "all", name: "All", count: posts.length }].concat(
      data.categories.map(function (cat) {
        return { slug: cat.slug, name: cat.short, count: countFor(cat.slug) };
      })
    );
    filtersHost.innerHTML = chips
      .map(function (chip) {
        return (
          '<button type="button" class="filter-chip' +
          (state.category === chip.slug ? " is-active" : "") +
          '" data-category="' + logic.escapeHtml(chip.slug) + '">' +
          logic.escapeHtml(chip.name) +
          '<span class="filter-chip__count">' + chip.count + "</span></button>"
        );
      })
      .join("");
  }

  function currentPosts() {
    return logic.filterPosts(posts, {
      category: state.category,
      tag: state.tag
    });
  }

  function renderList() {
    var visible = currentPosts();
    listHost.innerHTML = visible.length
      ? visible.map(components.archiveItem).join("")
      : '<p class="empty-state">No posts match this filter.</p>';

    var parts = [];
    if (state.category !== "all") {
      var cat = logic.categoryOf(data.categories, state.category);
      if (cat) parts.push(cat.name);
    }
    if (state.tag) parts.push('tag: ' + state.tag);
    parts.push(visible.length + (visible.length === 1 ? " post" : " posts"));
    hintHost.textContent = parts.join(" · ");
  }

  function renderTags() {
    tagHost.innerHTML = posts.length
      ? components.tagCloud(posts, state.tag)
      : '<p class="empty-state">No tags yet.</p>';
  }

  function renderTimeline() {
    timelineHost.innerHTML = posts.length
      ? components.timeline(posts)
      : '<p class="empty-state">No posts yet.</p>';
  }

  function syncUrl() {
    var query = [];
    if (state.category !== "all") {
      query.push("category=" + encodeURIComponent(state.category));
    }
    if (state.tag) {
      query.push("tag=" + encodeURIComponent(state.tag));
    }
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (query.length ? "?" + query.join("&") : "")
    );
  }

  filtersHost.addEventListener("click", function (event) {
    var chip = event.target.closest("[data-category]");
    if (!chip) return;
    state.category = chip.dataset.category;
    renderFilters();
    renderList();
    syncUrl();
  });

  renderFilters();
  renderList();
  renderTags();
  renderTimeline();
})();