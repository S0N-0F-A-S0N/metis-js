import { Pane } from 'tweakpane';

export class UI {
  constructor(config, onChangeCallback) {
    this.config = config;
    this.onChange = onChangeCallback;
    this.pane = new Pane();
    this.build(this.pane, this.config);
  }

  build(folder, obj) {
    for (const key in obj) {
      const value = obj[key];
      // Check if value is an object and not one of the special types Tweakpane handles (like {x,y} or {r,g,b})
      // Simple heuristic: if it has keys other than color/vector components, treat as folder
      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        !this.isVector(value) &&
        !this.isColor(key, value)
      ) {
        const subFolder = folder.addFolder({ title: key });
        this.build(subFolder, value);
      } else {
        const binding = folder.addBinding(obj, key);
        if (this.onChange) {
          binding.on('change', () => this.onChange());
        }
      }
    }
  }

  isVector(obj) {
    // Check for common vector structures
    const keys = Object.keys(obj);
    if (keys.length === 2 && 'x' in obj && 'y' in obj) return true;
    if (keys.length === 3 && 'x' in obj && 'y' in obj && 'z' in obj) return true;
    return false;
  }

  isColor(key, value) {
      // Tweakpane handles hex strings automatically.
      // If the config value is a hex string and key suggests color, it works.
      // But here we are just deciding if we should recurse.
      // If it's a primitive (string/number/boolean), we don't recurse.
      return typeof value !== 'object';
  }
}
