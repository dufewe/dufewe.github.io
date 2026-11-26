(function () {
  "use strict";

  var data = window.BlogData;
  var logic = window.BlogLogic;
  var components = window.BlogComponents;
  var listHost = document.getElementById("post-list");
  var filtersHost = document.getElementById("post-filters");
  var posts = logic.sortByDate(logic.visiblePosts(data.posts));
  var params = new URLSearchParams(window.location.search);
  var state = { category: params.get("category") || "all" };

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

  function renderPosts() {
    var visible = logic.filterPosts(posts, { category: state.category });
    listHost.innerHTML = visible.length
      ? visible.map(components.postItem).join("")
      : '<p class="empty-state">' +
        (state.category === "all"
          ? "No posts yet."
          : "No posts in this category yet.") +
        "</p>";
  }

  function syncUrl() {
    var url = window.location.pathname;
    if (state.category !== "all") {
      url += "?category=" + encodeURIComponent(state.category);
    }
    window.history.replaceState(null, "", url);
  }

  filtersHost.addEventListener("click", function (event) {
    var chip = event.target.closest("[data-category]");
    if (!chip) return;
    state.category = chip.dataset.category;
    renderFilters();
    renderPosts();
    syncUrl();
  });

  renderFilters();
  renderPosts();
})();