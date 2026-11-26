(function () {
  "use strict";

  var data = window.BlogData;
  var logic = window.BlogLogic;
  if (!data || !logic) return;

  var posts = logic.sortByDate(logic.visiblePosts(data.posts));
  var postDays = {};
  posts.forEach(function (post) {
    postDays[post.date] = true;
  });

  function pad(value) {
    return (value < 10 ? "0" : "") + value;
  }

  var DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  var today = new Date();
  var viewYear = today.getFullYear();
  var viewMonth = today.getMonth();

  function renderCalendar() {
    var host = document.getElementById("calendar");
    if (!host) return;

    var offset = new Date(viewYear, viewMonth, 1).getDay();
    var total = new Date(viewYear, viewMonth + 1, 0).getDate();
    var cells = [];
    var i;
    for (i = 0; i < offset; i++) {
      cells.push('<span class="calendar__day is-blank"></span>');
    }
    for (var day = 1; day <= total; day++) {
      var date = viewYear + "-" + pad(viewMonth + 1) + "-" + pad(day);
      var classes = "calendar__day";
      if (day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
        classes += " is-today";
      }
      if (postDays[date]) classes += " has-post";
      cells.push('<span class="' + classes + '">' + day + "</span>");
    }

    host.innerHTML =
      '<div class="calendar__head">' +
      '<button class="calendar__nav" type="button" data-calendar="prev" aria-label="Previous month">‹</button>' +
      '<span class="calendar__month">' +
      new Date(viewYear, viewMonth, 1).toLocaleString("en-US", { month: "long", year: "numeric" }) +
      "</span>" +
      '<button class="calendar__nav" type="button" data-calendar="next" aria-label="Next month">›</button>' +
      "</div>" +
      '<div class="calendar__grid">' +
      DAY_NAMES.map(function (name) {
        return '<span class="calendar__dow">' + name + "</span>";
      }).join("") +
      cells.join("") +
      "</div>";
  }

  renderCalendar();

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-calendar]");
    if (!button) return;
    if (button.getAttribute("data-calendar") === "prev") {
      viewMonth -= 1;
      if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
    } else {
      viewMonth += 1;
      if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
    }
    renderCalendar();
  });

  var stats = document.getElementById("site-stats");
  if (stats) {
    stats.innerHTML =
      '<div class="stats__item"><span class="stats__value">' + posts.length + '</span><span class="stats__label">Posts</span></div>' +
      '<div class="stats__item"><span class="stats__value">' + (data.categories || []).length + '</span><span class="stats__label">Categories</span></div>' +
      '<div class="stats__item"><span class="stats__value">' + logic.tagCounts(posts).length + '</span><span class="stats__label">Tags</span></div>' +
      '<div class="stats__item"><span class="stats__value stats__value--date">' + (posts.length ? posts[0].date : "—") + '</span><span class="stats__label">Latest</span></div>';
  }

  var meta = document.getElementById("site-meta");
  if (meta && data.site) {
    var text = "© " + new Date().getFullYear() + " " + (data.site.copyright || data.site.name);
    if (data.site.since) {
      var since = new Date(data.site.since + "T00:00:00").getTime();
      var days = Math.floor((Date.now() - since) / 86400000);
      if (!isNaN(days)) text += " · 已运行 " + Math.max(days, 0) + " 天";
    }
    meta.textContent = text;
  }
})();