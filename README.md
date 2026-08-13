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
  npx pmd validate "Kaiju Girl Caramelise"
  ```

- **Build/Package a theme**:
  Directly packages the theme folder into a `.zip` file without validation:

  ```bash
  npx pmd build "Kaiju Girl Caramelise"
  ```

- **Check code style & formatting**:
  Runs Prettier checks and ESLint rules:

  ```bash
  npx pmd lint
  ```

- **Auto-fix code style & formatting**:
  Automatically fixes code formatting and linting errors:

  ```bash
  npx pmd lint --fix
  ```
