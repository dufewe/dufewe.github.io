(function (root) {
  "use strict";

  var data = root.BlogData;
  var logic = root.BlogLogic;

  function category(slug) {
    return logic.categoryOf(data.categories, slug);
  }

  function tagsHtml(tags) {
    return (tags || [])
      .map(function (tag) {
        return '<span class="tag">' + logic.escapeHtml(tag) + "</span>";
      })
      .join("");
  }

  function postItem(post) {
    var cat = category(post.category);
    return (
      '<a class="post-item" href="' + logic.postUrl(post.id) + '">' +
      '<div class="item-head">' +
      '<span class="item-period">' + logic.escapeHtml(post.date) + "</span>" +
      (cat
        ? '<span class="item-cat">' + logic.escapeHtml(cat.name) + "</span>"
        : "") +
      '<span class="item-arrow" aria-hidden="true">→</span>' +
      "</div>" +
      '<h2 class="item-title">' + logic.escapeHtml(post.title) + "</h2>" +
      '<p class="post-excerpt">' + logic.escapeHtml(post.excerpt) + "</p>" +
      '<div class="post-tags">' + tagsHtml(post.tags) + "</div>" +
      "</a>"
    );
  }

  function archiveItem(post) {
    var cat = category(post.category);
    return (
      '<a class="archive-item" href="' + logic.postUrl(post.id) + '">' +
      '<span class="archive-thumb" aria-hidden="true">' +
      logic.escapeHtml(cat ? cat.glyph : "·") +
      "</span>" +
      '<div class="archive-body">' +
      '<h2 class="item-title">' + logic.escapeHtml(post.title) + "</h2>" +
      '<div class="item-head">' +
      '<span class="item-period">' + logic.escapeHtml(post.date) + "</span>" +
      (cat
        ? '<span class="item-cat">' + logic.escapeHtml(cat.name) + "</span>"
        : "") +
      "</div>" +
      '<p class="post-excerpt">' + logic.escapeHtml(post.excerpt) + "</p>" +
      '<div class="post-tags">' + tagsHtml(post.tags) + "</div>" +
      "</div>" +
      "</a>"
    );
  }

  function tagCloud(posts, activeTag) {
    return logic
      .tagCounts(posts)
      .map(function (entry) {
        return (
          '<a class="tag' + (entry.tag === activeTag ? " is-active" : "") +
          '" href="archive.html?tag=' + encodeURIComponent(entry.tag) + '">' +
          logic.escapeHtml(entry.tag) +
          '<span class="tag__count">' + entry.count + "</span></a>"
        );
      })
      .join("");
  }

  function timeline(posts) {
    return logic
      .groupByYear(posts)
      .map(function (group) {
        var items = group.posts
          .map(function (post) {
            var cat = category(post.category);
            return (
              '<div class="timeline__item">' +
              '<span class="timeline__date">' +
              logic.escapeHtml(post.date.slice(5)) +
              "</span>" +
              '<a class="timeline__link" href="' + logic.postUrl(post.id) + '">' +
              logic.escapeHtml(post.title) +
              "</a>" +
              '<span class="timeline__cat">' +
              logic.escapeHtml(cat ? cat.name : "") +
              "</span>" +
              "</div>"
            );
          })
          .join("");
        return (
          '<div class="timeline__year">' + logic.escapeHtml(group.year) + "</div>" +
          items
        );
      })
      .join("");
  }

  root.BlogComponents = {
    category: category,
    tagsHtml: tagsHtml,
    postItem: postItem,
    archiveItem: archiveItem,
    tagCloud: tagCloud,
    timeline: timeline
  };
})(typeof self !== "undefined" ? self : this);