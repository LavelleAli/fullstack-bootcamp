// Theme-aware SVG diagrams. Classes are styled by the app's CSS tokens:
// .bx neutral box, .sk sky box, .sn sun box, .rd red outline, .ln line, .ar arrow line, .t text, .tm muted text, .tb bold text
const arrow = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="ah"/></marker></defs>`;

export const diagrams = {
  "dom-tree": { title: "The DOM is a tree of elements", svg:
`<svg viewBox="0 0 620 270" role="img" aria-labelledby="d1">${arrow}<title id="d1">DOM tree: html contains head and body; body contains header, main and footer; header contains h1 and nav.</title>
<g class="ln"><path d="M310 52 V70 M310 70 H170 V92 M310 70 H450 V92 M450 128 V146 M450 146 H310 V168 M450 146 H450 V168 M450 146 H590 V168 M310 204 V222 M310 222 H250 V236 M310 222 H370 V236"/></g>
<rect class="sn" x="250" y="16" width="120" height="36" rx="6"/><text class="tb" x="310" y="39" text-anchor="middle">html</text>
<rect class="bx" x="110" y="92" width="120" height="36" rx="6"/><text class="t" x="170" y="115" text-anchor="middle">head</text>
<rect class="sk" x="390" y="92" width="120" height="36" rx="6"/><text class="t" x="450" y="115" text-anchor="middle">body</text>
<rect class="sk" x="250" y="168" width="120" height="36" rx="6"/><text class="t" x="310" y="191" text-anchor="middle">header</text>
<rect class="sk" x="400" y="168" width="100" height="36" rx="6"/><text class="t" x="450" y="191" text-anchor="middle">main</text>
<rect class="sk" x="530" y="168" width="84" height="36" rx="6"/><text class="t" x="572" y="191" text-anchor="middle">footer</text>
<rect class="bx" x="214" y="236" width="72" height="28" rx="6"/><text class="t" x="250" y="255" text-anchor="middle">h1</text>
<rect class="bx" x="334" y="236" width="72" height="28" rx="6"/><text class="t" x="370" y="255" text-anchor="middle">nav</text>
<text class="tm" x="20" y="200">JavaScript finds and</text><text class="tm" x="20" y="218">changes these nodes</text>
</svg>` },

  "box-model": { title: "The box model: content, padding, border, margin", svg:
`<svg viewBox="0 0 620 300" role="img" aria-labelledby="d2"><title id="d2">Nested boxes: margin outside, then border, then padding, then content in the center.</title>
<rect x="20" y="16" width="580" height="268" rx="4" class="rd-fill"/>
<text class="tb" x="36" y="40">margin</text><text class="tm" x="120" y="40">space outside, pushes neighbours away</text>
<rect x="70" y="56" width="480" height="198" rx="4" class="border-fill"/>
<text class="tb" x="84" y="78">border</text>
<rect x="84" y="88" width="452" height="152" rx="2" class="sn"/>
<text class="tb" x="98" y="110">padding</text><text class="tm" x="174" y="110">space inside the border</text>
<rect x="180" y="124" width="260" height="96" rx="2" class="sk"/>
<text class="tb" x="310" y="166" text-anchor="middle">content</text>
<text class="tm" x="310" y="190" text-anchor="middle">width × height</text>
</svg>` },

  "flex-axes": { title: "Flexbox: main axis and cross axis", svg:
`<svg viewBox="0 0 620 230" role="img" aria-labelledby="d3">${arrow}<title id="d3">A flex row: items sit along the main axis left to right; justify-content spaces them along it; align-items positions them on the vertical cross axis.</title>
<rect class="bx" x="40" y="30" width="540" height="150" rx="8"/>
<rect class="sk" x="70" y="70" width="110" height="70" rx="6"/><text class="t" x="125" y="110" text-anchor="middle">item</text>
<rect class="sk" x="255" y="70" width="110" height="70" rx="6"/><text class="t" x="310" y="110" text-anchor="middle">item</text>
<rect class="sk" x="440" y="70" width="110" height="70" rx="6"/><text class="t" x="495" y="110" text-anchor="middle">item</text>
<line class="ar sun-ar" x1="70" y1="205" x2="550" y2="205" marker-end="url(#ah)"/>
<text class="tb" x="310" y="226" text-anchor="middle">main axis → justify-content</text>
<line class="ar red-ar" x1="20" y1="40" x2="20" y2="170" marker-end="url(#ah)"/>
<text class="tb" x="200" y="22" text-anchor="middle">cross axis ↓ align-items</text>
<text class="tm" x="196" y="110" text-anchor="middle">gap</text><text class="tm" x="404" y="110" text-anchor="middle">gap</text>
</svg>` },

  "http-cycle": { title: "Request and response over HTTP", svg:
`<svg viewBox="0 0 620 230" role="img" aria-labelledby="d4">${arrow}<title id="d4">The client sends a request with a method and URL to the server; the server sends back a status code and JSON.</title>
<rect class="sk" x="20" y="60" width="160" height="110" rx="10"/><text class="tb" x="100" y="102" text-anchor="middle">Client</text><text class="tm" x="100" y="126" text-anchor="middle">browser or app</text>
<rect class="sn" x="440" y="60" width="160" height="110" rx="10"/><text class="tb" x="520" y="102" text-anchor="middle">Server</text><text class="tm" x="520" y="126" text-anchor="middle">API / Express</text>
<line class="ar" x1="190" y1="88" x2="430" y2="88" marker-end="url(#ah)"/>
<text class="t" x="310" y="70" text-anchor="middle">Request: GET /api/books/1</text>
<line class="ar" x1="430" y1="144" x2="190" y2="144" marker-end="url(#ah)"/>
<text class="t" x="310" y="170" text-anchor="middle">Response: 200 OK</text>
<text class="tm" x="310" y="192" text-anchor="middle">{ "id": 1, "title": "Dune" }</text>
</svg>` },

  "component-tree": { title: "React: a tree of components, props flow down", svg:
`<svg viewBox="0 0 620 250" role="img" aria-labelledby="d5">${arrow}<title id="d5">App renders Header and ProductList; ProductList renders several ProductCard components, passing props down.</title>
<rect class="sn" x="250" y="16" width="120" height="40" rx="8"/><text class="tb" x="310" y="41" text-anchor="middle">&lt;App&gt;</text>
<line class="ar" x1="290" y1="58" x2="170" y2="100" marker-end="url(#ah)"/>
<line class="ar" x1="330" y1="58" x2="450" y2="100" marker-end="url(#ah)"/>
<rect class="sk" x="100" y="102" width="140" height="40" rx="8"/><text class="t" x="170" y="127" text-anchor="middle">&lt;Header&gt;</text>
<rect class="sk" x="370" y="102" width="160" height="40" rx="8"/><text class="t" x="450" y="127" text-anchor="middle">&lt;ProductList&gt;</text>
<line class="ar" x1="420" y1="144" x2="330" y2="190" marker-end="url(#ah)"/>
<line class="ar" x1="450" y1="144" x2="450" y2="190" marker-end="url(#ah)"/>
<line class="ar" x1="480" y1="144" x2="570" y2="190" marker-end="url(#ah)"/>
<rect class="bx" x="270" y="192" width="110" height="36" rx="8"/><text class="t" x="325" y="215" text-anchor="middle">Card</text>
<rect class="bx" x="395" y="192" width="110" height="36" rx="8"/><text class="t" x="450" y="215" text-anchor="middle">Card</text>
<rect class="bx" x="520" y="192" width="90" height="36" rx="8"/><text class="t" x="565" y="215" text-anchor="middle">Card</text>
<text class="tm" x="530" y="172">props ↓</text>
<text class="tm" x="20" y="215">data flows down</text>
</svg>` },

  "client-server-db": { title: "Where the database sits", svg:
`<svg viewBox="0 0 620 200" role="img" aria-labelledby="d6">${arrow}<title id="d6">Browser talks to the server over HTTP; the server talks to PostgreSQL using SQL.</title>
<rect class="sk" x="20" y="50" width="150" height="90" rx="10"/><text class="tb" x="95" y="92" text-anchor="middle">Browser</text><text class="tm" x="95" y="114" text-anchor="middle">React page</text>
<rect class="sn" x="235" y="50" width="150" height="90" rx="10"/><text class="tb" x="310" y="92" text-anchor="middle">Server</text><text class="tm" x="310" y="114" text-anchor="middle">Express API</text>
<rect class="bx" x="450" y="50" width="150" height="90" rx="10"/><text class="tb" x="525" y="92" text-anchor="middle">PostgreSQL</text><text class="tm" x="525" y="114" text-anchor="middle">tables of rows</text>
<line class="ar" x1="172" y1="95" x2="230" y2="95" marker-end="url(#ah)" marker-start="url(#ah)"/>
<line class="ar" x1="387" y1="95" x2="445" y2="95" marker-end="url(#ah)" marker-start="url(#ah)"/>
<text class="t" x="201" y="168" text-anchor="middle">HTTP + JSON</text>
<text class="t" x="416" y="168" text-anchor="middle">SQL</text>
<text class="tm" x="310" y="30" text-anchor="middle">The browser never talks to the database directly</text>
</svg>` },

  "firestore": { title: "Firestore: collections hold documents", svg:
`<svg viewBox="0 0 620 220" role="img" aria-labelledby="d7"><title id="d7">The notes collection holds documents, each with an id and fields like text, owner and createdAt.</title>
<rect class="sn" x="20" y="30" width="160" height="160" rx="10"/><text class="tb" x="100" y="62" text-anchor="middle">collection</text><text class="t" x="100" y="88" text-anchor="middle">notes</text>
<rect class="sk" x="220" y="30" width="180" height="70" rx="8"/><text class="tb" x="236" y="54">doc aB3x</text><text class="tm" x="236" y="76">text: "Buy milk"</text><text class="tm" x="236" y="92">owner: "u_19"</text>
<rect class="sk" x="220" y="120" width="180" height="70" rx="8"/><text class="tb" x="236" y="144">doc Q7pk</text><text class="tm" x="236" y="166">text: "Call Sam"</text><text class="tm" x="236" y="182">owner: "u_42"</text>
<g class="ln"><path d="M180 110 H200 V65 H218 M200 110 V155 H218"/></g>
<rect class="bx" x="430" y="30" width="170" height="160" rx="8"/><text class="tb" x="446" y="56">A document is</text><text class="tm" x="446" y="80">JSON-like fields</text><text class="tm" x="446" y="100">+ an id</text><text class="tm" x="446" y="128">Security Rules decide</text><text class="tm" x="446" y="146">who can read it</text>
</svg>` },

  "aaa": { title: "Every test: Arrange, Act, Assert", svg:
`<svg viewBox="0 0 620 170" role="img" aria-labelledby="d8">${arrow}<title id="d8">Three steps: Arrange the inputs, Act by calling the code, Assert the result matches what you expect.</title>
<rect class="sk" x="20" y="40" width="170" height="90" rx="10"/><text class="tb" x="105" y="78" text-anchor="middle">1 · Arrange</text><text class="tm" x="105" y="102" text-anchor="middle">set up the input</text>
<rect class="sn" x="225" y="40" width="170" height="90" rx="10"/><text class="tb" x="310" y="78" text-anchor="middle">2 · Act</text><text class="tm" x="310" y="102" text-anchor="middle">call the code</text>
<rect class="bx rd" x="430" y="40" width="170" height="90" rx="10"/><text class="tb" x="515" y="78" text-anchor="middle">3 · Assert</text><text class="tm" x="515" y="102" text-anchor="middle">check the result</text>
<line class="ar" x1="192" y1="85" x2="221" y2="85" marker-end="url(#ah)"/>
<line class="ar" x1="397" y1="85" x2="426" y2="85" marker-end="url(#ah)"/>
<text class="tm" x="310" y="160" text-anchor="middle">expect(cartTotal(items)).toBe(13)</text>
</svg>` },
};
