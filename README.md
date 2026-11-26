# 🌐 Dufewe's Personal Homepage

> *Love makes Miracle*

## About

This is my personal homepage, built on the **Vno** theme and hosted on [GitHub Pages](https://dufewe.github.io).

## 📄 Page Structure

| Page | Path | Status |
|------|------|--------|
| Home | `/` | ✅ Live |
| Resume | `/resume/` | ✅ Live (standalone) |
| 404 | `/404.html` | ✅ Live |
| Blog | `/blog/` | ✅ Live |
| Library | `/library/` | 🚧 Planned |
| FlavData | [flav-data.streamlit.app](https://flav-data.streamlit.app) | ✅ Live (external) |

## 🧭 Navigation Links

- **Home** — Landing page: personal intro, social links, and a Google search box
- **Blog** — Post list and article pages: physics notes, tool notes, and reading notes
- **Library** — Planned knowledge base; the link is reserved and will 404 until the page is built
- **FlavData** — Flavour-physics data app hosted on [Streamlit](https://flav-data.streamlit.app), linked from Resume
- **Resume** — Standalone intro page: education, publications, and skills; no links back to Home

## 🛠 Tech Stack

- **Frontend**: Pure HTML / CSS / JavaScript, no framework dependencies
- **Theme**: [Vno](https://github.com/OneNeko/hexo-theme-vno) — Clean personal homepage theme
- **Fonts**: Great Vibes (handwritten titles), three custom iconfont sets (work, life, tools)
- **Background**: Bing image, rotated per session via `assets/json/images.json`
- **Deployment**: GitHub Pages

## 📂 Directory Structure

```
├── index.html                  # Home page
├── blog/
│   ├── index.html              # Post list
│   └── posts/                  # Article pages
├── resume/
│   └── index.html              # Resume page
├── 404.html                    # 404 error page
├── assets/
│   ├── css/                    # Stylesheets
│   │   ├── vno.css             # Theme main stylesheet
│   │   ├── blog.css            # Blog layout and article typography
│   │   ├── iconfont_work/      # Work-related icons
│   │   ├── iconfont_life/      # Life-related icons
│   │   └── iconfont_tools/     # Tool icons
│   ├── img/
│   │   └── portrait.jpg        # Profile photo
│   ├── js/
│   │   └── main.js             # Background rotation and mobile menu
│   └── json/
│       └── images.json         # Bing image list
├── favicon.ico                 # Site favicon
└── homeicon.jpg                # Apple touch icon
```

## 👤 About Me

Ph.D. candidate in Particle Physics and Nuclear Physics at Central China Normal University. Research interests: particle physics (physics beyond the Standard Model, effective field theory in both phenomenological analysis and theoretical calculations) and partial focus on cosmology. Also passionate about applying modern AI technologies to high energy physics research.

## 📝 License

Personal website, all rights reserved.

---

Built with ❤️ by [Dufewe](https://github.com/dufewe) and Powered by LLM