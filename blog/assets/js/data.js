(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.BlogData = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  return {
    site: {
      name: "Dufewe Fangu",
      title: "Blog",
      intro: "Notes on physics, tools, and whatever survives a second look."
    },

    categories: [
      {
        slug: "physics",
        name: "Physics",
        short: "Physics",
        glyph: "理"
      },
      {
        slug: "notes",
        name: "Notes",
        short: "Notes",
        glyph: "记"
      },
      {
        slug: "tools",
        name: "Tools",
        short: "Tools",
        glyph: "器"
      }
    ],

    // Every post is a Quarkdown document compiled to blog/posts/<id>.pdf.
    // Fields: id, title, date, category, tags, excerpt, source,
    //         authors (optional), venue (optional), links (optional), draft (optional)
    posts: []
  };
});