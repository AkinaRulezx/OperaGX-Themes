# Opera GX Themes

A collection of custom, premium Opera GX themes. 

Currently featuring:
* **Kaiju Girl Caramelise**: An animated theme with custom amethyst purple layouts, glowing hot pink highlights, dynamic wave background shader, and global custom scrollbars/highlights.

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

* **Validate a theme**:
  Checks the syntax of `manifest.json` and verifies that all referenced assets (wallpapers, shaders, icons, sound effects) exist on disk:
  ```bash
  npx pmd build "Kaiju Girl Caramelise" --validate
  ```

* **Build/Package a theme**:
  Validates and packages the theme folder into a `.zip` file located directly inside the extension folder:
  ```bash
  npx pmd build "Kaiju Girl Caramelise"
  ```

* **Check code style & formatting**:
  Runs Prettier checks and ESLint rules:
  ```bash
  npx pmd lint
  ```

* **Auto-fix code style & formatting**:
  Automatically fixes code formatting and linting errors:
  ```bash
  npx pmd lint --fix
  ```

---

## Commit Conventions

We follow the **Conventional Commits** specification. This keeps our commit history clean, structured, and easy to read.

### Message Format
Each commit message consists of a **header**, an optional **body**, and an optional **footer**.

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

#### 1. Type
Must be one of the following:
* **feat**: A new feature (e.g. adding a new theme, shader, or sound effect).
* **fix**: A bug fix (e.g. correcting a broken icon path or layout color).
* **docs**: Documentation only changes (e.g. updating the README).
* **style**: Changes that do not affect the meaning of the code (formatting, white-space, missing semi-colons).
* **refactor**: A code change that neither fixes a bug nor adds a feature.
* **chore**: Updating build tasks, package dependencies, or git configs.

#### 2. Scope (Optional)
The folder or component affected (e.g., `theme`, `validator`, `workflow`).

#### 3. Description
A short description of the change:
* Use the imperative, present tense: "change" not "changed" nor "changes".
* Don't capitalize the first letter.
* No dot (`.`) at the end.

---

### Linking & Closing Issues
To link commits to issues or automatically close them when merged into the `main` branch, reference the issue number in the commit footer or description using a closing keyword.

#### Auto-Closing Keywords:
* `close` / `closes` / `closed`
* `fix` / `fixes` / `fixed`
* `resolve` / `resolves` / `resolved`

#### Examples:

```bash
# Add a feature and link/close issue #21
feat(theme): add global webmodding css scrollbars

Closes #21
```

```bash
# Fix a bug and close issue #42
fix(validator): resolve unused error variable in catch block

Fixes #42
```
