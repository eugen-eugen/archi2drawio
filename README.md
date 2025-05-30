# todrawio-isyfact

A toolkit for exporting ArchiMate models and views to draw.io (diagrams.net) using IsyFact conventions and C4 shapes.

## Features

- **Exports ArchiMate views** to draw.io XML format with C4-style shapes.
- **Supports IsyFact conventions** for element naming, coloring, and structure.
- **Handles relationships, bendpoints, and custom styles**.
- **Modular codebase** with reusable functions and constants.
- **Test suite** for key transformation functions.

## Folder Structure

```
.
├── data/                # Static data files (e.g., IsyFact.drawiolib.xml)
├── dist/                # Build output (bundle and copied resources)
├── scripts/             # (Optional) CLI or utility scripts
├── src/
│   ├── lib/             # Third-party or utility libraries (e.g., fxp.cjs)
│   └── main/            # Main source code (modules, constants, main script)
├── tests/               # Unit and integration tests
├── package.json         # Project metadata and scripts
└── README.md            # This file
```

## Usage

### 1. Install dependencies

```sh
npm install
```

### 2. Build the project

This will bundle the main script and copy the XML library to `dist/`:

```sh
npm run build
```

### 3. Run tests

```sh
npm test
```

### 4. Use in your workflow

- The main entry point is `src/main/todrawio-isyfact.js`.
- The bundled output is in `dist/todrawio-isyfact.bundle.ajs`.
- The draw.io library XML is available in `dist/IsyFact.drawiolib.xml`.

## Development Notes

- **Constants** are defined in `src/main/constants.js` and imported where needed.
- **XML parsing and building** uses [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser).
- **Resource loading**: The code is designed to work both in development (loading XML from `data/`) and in production (from `dist/`), with a fallback mechanism.
- **Tests** are located in the `tests/` directory and can be run with Node.js.

## License

MIT License

---

**Credits & Inspiration:**
- Pedro Duque (original author)
- C4 Model (https://c4model.com/)
- jArchi, draw.io, and the open-source community