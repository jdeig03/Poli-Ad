# Miller for Ward 3: campaign logos

Six logo concepts for the Evansville City Council, Ward 3 race: three for **Glen Miller** and three for **Scott Miller**.

| # | Name | Concept | Idea |
|---|------|---------|------|
| 1 | Glen | River Rise | A sun rising over the Ohio River's bend. Three river ribbons stand for Ward 3. |
| 2 | Glen | The Torch | The torch from Indiana's flag forms the I in MILLER. Its flame has three tongues, and there are 19 stars in all. |
| 2B | Glen | The Flag Torch | Concept 2 refined. The torch is drawn to the Indiana flag's own proportions and keeps the flag's rays and star. |
| 3 | Glen | Bridge Builder | The M is a twin-span truss bridge (a nod to the U.S. 41 Twin Bridges), with three piers. |
| 4 | Scott | Sunset on the Ohio | The O in SCOTT is the sun setting over the Ohio River, with three ribbons. |
| 5 | Scott | River S | The S is the Ohio's bend at Evansville, drawn as three parallel lines. |
| 6 | Scott | Tulip Tree | The state tree's bloom with three petals: "Rooted in Ward 3. Growing Evansville." |

- `exports/`: a 2× PNG and an SVG for every banner (1500×500, 3:1) and yard sign (1200×900, 24×18 in.).
- `logos.js`: the source for all six designs (vector, fonts fitted at render time).
- `index.html`: the presentation page. `dev.html` + `render.js` regenerate `exports/` (`node render.js exports 2`).

The SVGs load their fonts from Google Fonts. Before you send them to a print shop, open them in Illustrator or Inkscape and convert the text to outlines.
Add the required "Paid for by …" disclaimer to the signs before printing.
