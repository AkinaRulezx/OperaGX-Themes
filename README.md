# Opera GX Themes

A collection of custom, premium Opera GX themes.

Currently featuring:

- **Kaiju Girl Caramelise**: An animated theme with custom amethyst purple layouts, glowing hot pink highlights, dynamic wave background shader, and global custom scrollbars/highlights.

---

## Developer Guide

This repository contains local CLI utilities and formatting rules to validate and package themes before uploading to the store or git.

### Install Dependencies

Before running the tools for the first time, install the dev dependencies:

```bash
npm install
```

### CLI Utilities (`pmd`)

We use a unified CLI binary to validate, build, and lint theme files:

- **Validate and build a theme**:
  Checks the syntax of `manifest.json` and verifies that all referenced assets exist. If validation passes, it automatically packages the theme into a `.zip` file:

  ```bash
  npx pmd build "Kaiju Girl Caramelise" --validate
  ```

- **Build/Package a theme**:
  Directly packages the theme folder into a `.zip` file without validation:

  ```bash
  npx pmd build "Kaiju Girl Caramelise"
  ```

- **Linting files or folders**:
  Run ESLint directly using `npx eslint` for a specific file or folder (wrapping the entire path in quotes if it contains spaces):

  ```bash
  npx eslint "Kaiju Girl Caramelise/manifest.json"
  ```

  Use `--fix` to auto-fix styling issues:

  ```bash
  npx eslint "Kaiju Girl Caramelise/manifest.json" --fix
  ```

- **Linting the entire workspace**:
  To lint all JavaScript, CSS, and JSON files across the entire workspace at once:

  ```bash
  npx eslint .
  ```

  And to auto-fix the entire workspace:

  ```bash
  npx eslint . --fix
  ```
