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
      intro: "Notes on physics, tools, and whatever survives a second look.",
      since: "2026-11-18"
    },

    categories: [
      {
        slug: "physics",
        name: "Physics",
        short: "Physics",
        glyph: "P"
      },
      {
        slug: "ai",
        name: "AI",
        short: "AI",
        glyph: "A"
      },
      {
        slug: "life",
        name: "Life",
        short: "Life",
        glyph: "L"
      }
    ],

    // Every post is a Quarkdown document compiled to blog/posts/<id>/index.html.
    // Fields: id, title, date, category, tags, excerpt, source,
    //         authors (optional), venue (optional), links (optional), draft (optional)
    posts: [
      {
        id: "naturalness",
        title: "自然与自然性",
        date: "2026-11-27",
        category: "physics",
        tags: ["naturalness", "hierarchy", "NOTE"],
        excerpt: "自然性问题及其解释方案的简要回顾。",
        source: "posts/自然与自然性/自然与自然性.qd"
      },
      {
        id: "helicity-amplitude",
        title: "Chiral-Weyl-Helicity-Amplitude",
        date: "2026-11-28",
        category: "physics",
        tags: ["helicity", "amplitude", "NOTE"],
        excerpt: "Helicity amplitudes in a nutshell: phase-space decomposition, particle representations, and worked differential decay rates.",
        source: "posts/Chiral-Weyl-Helicity-Amplitude/Chiral-Weyl-Helicity-Amplitude.qd"
      }
    ]
  };
});