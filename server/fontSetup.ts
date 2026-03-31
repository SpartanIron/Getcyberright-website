import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

export function setupFonts(): void {
  try {
    const fontsDir = path.join(process.cwd(), "server", "fonts");
    const userFontsDir = path.join(process.env.HOME || "/home/runner", ".local", "share", "fonts");

    if (!fs.existsSync(fontsDir)) {
      return;
    }

    if (!fs.existsSync(userFontsDir)) {
      fs.mkdirSync(userFontsDir, { recursive: true });
    }

    const fontFiles = fs.readdirSync(fontsDir).filter(f => f.endsWith(".ttf") || f.endsWith(".otf"));
    let copied = 0;

    for (const fontFile of fontFiles) {
      const src = path.join(fontsDir, fontFile);
      const dest = path.join(userFontsDir, fontFile);
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
        copied++;
      }
    }

    if (copied > 0) {
      try {
        execSync("fc-cache -f 2>/dev/null", { env: { ...process.env, XDG_DATA_HOME: path.join(process.env.HOME || "/home/runner", ".local", "share") } });
      } catch {}
    }

    process.env.XDG_DATA_HOME = path.join(process.env.HOME || "/home/runner", ".local", "share");
  } catch (error: any) {
    console.warn(`[fonts] Font setup warning: ${error.message}`);
  }
}
