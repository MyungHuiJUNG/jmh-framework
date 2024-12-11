## Installed module

### Tabulator(그리드)

```
$ yarn add tabulator-tables
$ yarn add luxon
$ yarn add xlsx@https://cdn.sheetjs.com/xlsx-0.20.3/xlsx-0.20.3.tgz
```

- xlsx 참고: https://docs.sheetjs.com/docs/getting-started/installation/frameworks
- `quasar.config.js` 파일에 아래 설정 추가.

```
const path = require("path");

module.exports = configure(function (/* ctx */) {
  ...
    build: {
      ...
      alias: {
        "~": path.join(__dirname, "./node_modules"),
      },
      ...
    }
  ...
}
```
