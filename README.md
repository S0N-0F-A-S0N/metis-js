# metis-js
JavaScript port of METIS graph partitioning library

If you just want the library - it's in the `/js` folder.

Relevant build parts are:
* `wasm.c`
* `em-build.sh`

## License
Please note that METIS itself is not licensed as part of this project, only the build files to create WASM and JS port.
Refer to METIS project for respective license details.

## Usage

You can use the library directly from a CDN like jsDelivr using an Import Map. This allows you to use standard ES modules without a build step.

### Example `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Cloth Demo</title>
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.module.min.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.182.0/examples/jsm/",
  "tweakpane": "https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js",
  "metis": "https://cdn.jsdelivr.net/gh/Usnul/metis-js@main/js/metis.js",
  "metis/wasm": "https://cdn.jsdelivr.net/gh/Usnul/metis-js@main/js/metis.wasm"
}}</script>
</head>
<body>
<!-- Your content here -->
<script type="module">
import * as THREE from 'three';
import * as Metis from 'metis';

// Example usage
console.log('Metis loaded:', Metis);
</script>
</body>
</html>
```

**Note:** The `metis` import points to the jsDelivr CDN. Ensure you are using the correct branch/tag (e.g. `@main` or `@master`).
