#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const IGNORED_DIRS = ["node_modules", ".git"];

function findThemeDirectories(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of list) {
    if (file.isDirectory() && !IGNORED_DIRS.includes(file.name)) {
      const subDir = path.join(dir, file.name);
      if (fs.existsSync(path.join(subDir, "manifest.json"))) {
        results.push(subDir);
      } else {
        results = results.concat(findThemeDirectories(subDir));
      }
    }
  }
  return results;
}

function validateTheme(themeDir) {
  const relativeThemeDir = path.relative(process.cwd(), themeDir);
  const manifestPath = path.join(themeDir, "manifest.json");
  let manifest;

  try {
    const content = fs.readFileSync(manifestPath, "utf8");
    manifest = JSON.parse(content);
  } catch (err) {
    console.error(
      `\x1b[31m✘ Failed to parse manifest.json for "${relativeThemeDir}": ${err.message}\x1b[0m`,
    );
    return false;
  }

  let errors = [];

  function logError(msg) {
    errors.push(msg);
  }

  if (manifest.manifest_version !== 3) {
    logError(`manifest_version must be 3, found ${manifest.manifest_version}`);
  }
  if (!manifest.name) {
    logError(`Missing mandatory root key: "name"`);
  }
  if (!manifest.version) {
    logError(`Missing mandatory root key: "version"`);
  }
  if (!manifest.mod) {
    logError(`Missing mandatory root key: "mod"`);
    return false;
  }

  const mod = manifest.mod;
  if (mod.schema_version !== 1 && mod.schema_version !== 2) {
    logError(`mod.schema_version must be 1 or 2, found ${mod.schema_version}`);
  }

  if (!mod.payload) {
    logError(`Missing mandatory key: "mod.payload"`);
    return false;
  }

  const payload = mod.payload;

  function checkFileExists(relativeFilePath, description) {
    if (!relativeFilePath) return;
    const fullPath = path.join(themeDir, relativeFilePath);
    if (!fs.existsSync(fullPath)) {
      logError(`${description} file does not exist: "${relativeFilePath}"`);
    }
  }

  if (manifest.icons) {
    for (const size in manifest.icons) {
      checkFileExists(manifest.icons[size], `Icon size ${size}`);
    }
  } else {
    logError(`Missing mandatory key: "icons"`);
  }

  if (mod.license) {
    checkFileExists(mod.license, "License file");
  }

  if (payload.wallpaper) {
    const wp = payload.wallpaper;
    const modes = ["dark", "light"];
    for (const mode of modes) {
      if (wp[mode]) {
        const config = wp[mode];
        if (config.image) {
          checkFileExists(config.image, `Wallpaper ${mode} image/video`);
        }
        if (config.first_frame) {
          checkFileExists(config.first_frame, `Wallpaper ${mode} first_frame`);
        }
      }
    }
  }

  if (payload.page_styles && Array.isArray(payload.page_styles)) {
    payload.page_styles.forEach((style, index) => {
      if (!style.matches || !Array.isArray(style.matches)) {
        logError(`page_styles[${index}] missing matching URLs array`);
      }
      if (style.css && Array.isArray(style.css)) {
        style.css.forEach((cssFile) => {
          checkFileExists(cssFile, `Webmodding CSS page_styles[${index}]`);
        });
      } else {
        logError(`page_styles[${index}] missing css array`);
      }
    });
  }

  if (payload.shaders) {
    for (const name in payload.shaders) {
      const shader = payload.shaders[name];
      if (shader.path) {
        checkFileExists(shader.path, `Shader "${name}"`);
      } else {
        logError(`Shader "${name}" missing path key`);
      }
    }
  }

  if (payload.background_music && Array.isArray(payload.background_music)) {
    payload.background_music.forEach((musicFile) => {
      checkFileExists(musicFile, "Background music track");
    });
  }

  const soundCategories = ["browser_sounds", "keyboard_sounds"];
  for (const category of soundCategories) {
    if (payload[category]) {
      const catObj = payload[category];
      for (const key in catObj) {
        const files = catObj[key];
        if (Array.isArray(files)) {
          files.forEach((soundFile) => {
            if (soundFile !== "") {
              checkFileExists(soundFile, `${category} [${key}] sound`);
            }
          });
        }
      }
    }
  }

  if (errors.length === 0) {
    console.log(
      `\x1b[32m✔ "${relativeThemeDir}" validated successfully!\x1b[0m`,
    );
    return true;
  } else {
    console.error(`\x1b[31m✘ "${relativeThemeDir}" validation failed:\x1b[0m`);
    errors.forEach((err) => {
      console.error(`\x1b[31m  - ${err}\x1b[0m`);
    });
    return false;
  }
}

function main() {
  const rootDir = process.cwd();
  let themeDirs = [];

  const args = process.argv.slice(2);

  if (args[0] === "lint") {
    const isFix = args.includes("--fix");
    const globPattern = "**/*.{json,css,txt,md,js}";
    const { execSync } = require("child_process");
    try {
      if (isFix) {
        console.log("Formatting and fixing code style...");
        execSync(`npx prettier --write "${globPattern}"`, { stdio: "inherit" });
        execSync(`npx eslint . --fix`, { stdio: "inherit" });
      } else {
        console.log("Checking formatting and code style...");
        try {
          const prettierOut = execSync(
            `npx prettier --check "${globPattern}"`,
            { stdio: ["ignore", "pipe", "pipe"], encoding: "utf8" },
          );
          console.log(prettierOut);
        } catch (err) {
          const cleanStdout = err.stdout ? err.stdout.toString() : "";
          const cleanStderr = err.stderr ? err.stderr.toString() : "";
          const modifiedStdout = cleanStdout.replace(
            "Run Prettier with --write to fix.",
            "Run npx pmd lint --fix to fix.",
          );
          const modifiedStderr = cleanStderr.replace(
            "Run Prettier with --write to fix.",
            "Run npx pmd lint --fix to fix.",
          );
          if (modifiedStdout) {
            console.log(modifiedStdout);
          }
          if (modifiedStderr) {
            console.error(modifiedStderr);
          }
          throw err;
        }
        execSync(`npx eslint .`, { stdio: "inherit" });
      }
      process.exit(0);
    } catch {
      process.exit(1);
    }
  }

  let targetFolder = null;
  let isBuildCmd = false;
  let isValidateOnly = args.includes("--validate");

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "build") {
      isBuildCmd = true;
      if (args[i + 1] && !args[i + 1].startsWith("-")) {
        targetFolder = args[i + 1];
        i++;
      }
    } else if (args[i] === "--validate") {
      isValidateOnly = true;
    } else if (!args[i].startsWith("-")) {
      if (!targetFolder) {
        targetFolder = args[i];
      }
    }
  }

  if (targetFolder) {
    const targetDir = path.resolve(rootDir, targetFolder);
    if (fs.existsSync(targetDir) && fs.lstatSync(targetDir).isDirectory()) {
      themeDirs = [targetDir];
    } else {
      console.error(
        `Error: Provided target is not a valid directory: "${targetFolder}"`,
      );
      process.exit(1);
    }
  } else {
    themeDirs = findThemeDirectories(rootDir);
  }

  if (themeDirs.length === 0) {
    console.log("No theme directory containing manifest.json was found.");
    process.exit(0);
  }

  let allValid = true;
  for (const themeDir of themeDirs) {
    if (isValidateOnly) {
      const isValid = validateTheme(themeDir);
      if (!isValid) {
        allValid = false;
      }
    } else if (isBuildCmd) {
      try {
        const AdmZip = require("adm-zip");
        const folderName = path.basename(themeDir);
        const zipPath = path.join(themeDir, `${folderName}.zip`);

        const zip = new AdmZip();
        zip.addLocalFolder(themeDir);

        const buffer = zip.toBuffer();
        fs.writeFileSync(zipPath, buffer);
        console.log(
          `\x1b[32m✔ "${folderName}" built successfully. (${path.relative(rootDir, zipPath)})\x1b[0m`,
        );
      } catch (err) {
        console.error(
          `\x1b[31m✘ Build packaging failed for "${path.basename(themeDir)}": ${err.message}\x1b[0m`,
        );
        allValid = false;
      }
    }
  }

  if (allValid) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();
