"""Build the small client-side search index from published HTML pages."""

import json
import re
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "public"
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class PageText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.main_depth = 0
        self.skip_depth = 0
        self.title_depth = 0
        self.title = []
        self.text = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.title_depth += 1
        if tag == "main":
            self.main_depth += 1
        elif self.main_depth and tag not in VOID:
            self.main_depth += 1
            if self.skip_depth:
                self.skip_depth += 1
            elif tag in {"script", "style", "svg", "noscript"} or attrs.get("aria-hidden") == "true":
                self.skip_depth = 1

    def handle_endtag(self, tag):
        if tag == "title" and self.title_depth:
            self.title_depth -= 1
        if self.main_depth:
            if self.skip_depth:
                self.skip_depth -= 1
            self.main_depth -= 1

    def handle_data(self, data):
        if self.title_depth:
            self.title.append(data)
        if self.main_depth and not self.skip_depth:
            self.text.append(data)


def clean(text):
    return re.sub(r"\s+", " ", text).strip()


pages = []
for path in sorted(ROOT.rglob("index.html")):
    page = PageText()
    page.feed(path.read_text(encoding="utf-8"))
    url = "/" if path.parent == ROOT else "/" + path.parent.relative_to(ROOT).as_posix() + "/"
    pages.append({"url": url, "title": clean(" ".join(page.title)).split(" | ")[0], "text": clean(" ".join(page.text))})

(ROOT / "search-index.json").write_text(json.dumps(pages, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
print(f"Indexed {len(pages)} pages")
