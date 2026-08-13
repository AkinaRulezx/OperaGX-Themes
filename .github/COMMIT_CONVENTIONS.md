# Commit Conventions

We follow the **Conventional Commits** specification. This keeps our commit history clean, structured, and easy to read.

## Message Format

Each commit message consists of a **header**, an optional **body**, and an optional **footer**.

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 1. Type

Must be one of the following:

- **feat**: A new feature (e.g. adding a new theme, shader, or sound effect).
- **fix**: A bug fix (e.g. correcting a broken icon path or layout color).
- **docs**: Documentation only changes.
- **style**: Changes that do not affect the meaning of the code (formatting, white-space, missing semi-colons).
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **chore**: Updating build tasks, package dependencies, or git configs.

### 2. Scope (Optional)

The folder or component affected (e.g., `theme`, `validator`, `workflow`).

### 3. Description

A short description of the change:

- Use the imperative, present tense: "change" not "changed" nor "changes".
- Don't capitalize the first letter.
- No dot (`.`) at the end.

---

## Linking & Closing Issues

To link commits to issues or automatically close them when merged into the `main` branch, reference the issue number in the commit footer or description using a closing keyword.

### Auto-Closing Keywords:

- `close` / `closes` / `closed`
- `fix` / `fixes` / `fixed`
- `resolve` / `resolves` / `resolved`

### Examples:

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
