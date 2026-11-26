(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.BlogLogic = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  function visiblePosts(posts) {
    return (posts || []).filter(function (post) {
      return !post.draft;
    });
  }

  function sortByDate(posts) {
    return posts.slice().sort(function (a, b) {
      return a.date < b.date ? 1 : -1;
    });
  }

  function categoryOf(categories, slug) {
    return (categories || []).find(function (item) {
      return item.slug === slug;
    });
  }

  function filterPosts(posts, options) {
    var category = options && options.category;
    var tag = options && options.tag;
    return posts.filter(function (post) {
      if (category && category !== "all" && post.category !== category) {
        return false;
      }
      if (tag && (post.tags || []).indexOf(tag) === -1) {
        return false;
      }
      return true;
    });
  }

  function tagCounts(posts) {
    var counts = {};
    posts.forEach(function (post) {
      (post.tags || []).forEach(function (tag) {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.keys(counts)
      .map(function (tag) {
        return { tag: tag, count: counts[tag] };
      })
      .sort(function (a, b) {
        return b.count - a.count || a.tag.localeCompare(b.tag);
      });
  }

  function groupByYear(posts) {
    var groups = [];
    var index = {};
    sortByDate(posts).forEach(function (post) {
      var year = String(post.date || "").slice(0, 4);
      if (!index[year]) {
        index[year] = { year: year, posts: [] };
        groups.push(index[year]);
      }
      index[year].posts.push(post);
    });
    return groups;
  }

  function prevNext(posts, id) {
    var ordered = sortByDate(posts);
    var index = ordered.findIndex(function (post) {
      return post.id === id;
    });
    if (index === -1) return { newer: null, older: null };
    return {
      newer: index > 0 ? ordered[index - 1] : null,
      older: index < ordered.length - 1 ? ordered[index + 1] : null
    };
  }

  function postUrl(id) {
    return "post.html?id=" + encodeURIComponent(id);
  }

  function pdfUrl(id) {
    return "posts/" + encodeURIComponent(id) + ".pdf";
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  return {
    visiblePosts: visiblePosts,
    sortByDate: sortByDate,
    categoryOf: categoryOf,
    filterPosts: filterPosts,
    tagCounts: tagCounts,
    groupByYear: groupByYear,
    prevNext: prevNext,
    postUrl: postUrl,
    pdfUrl: pdfUrl,
    escapeHtml: escapeHtml
  };
});