const fs = require("node:fs");
const { keys, path, split } = require("ramda");
const { stringify } = require("csv-stringify/sync");

/**
 * Flatten object
 * { a: { b: { c: "hello", d: "there" }}} -> {"a.b.c": "hello", "a.b.d": "there"}
 */
const flatten = (obj, parentKey = "") => {
  if (parentKey !== "") parentKey += ".";
  let flattened = {};
  keys(obj).forEach(key => {
    if (typeof obj[key] === "object") {
      Object.assign(flattened, flatten(obj[key], parentKey + key));
    } else {
      flattened[parentKey + key] = obj[key];
    }
  });

  return flattened;
};

const translations = ["attributes", "common", "glossary"];

/**
 * Convert translation JSON files for patron-ui into CSV
 */
const convert = () => {
  translations.forEach(async translation => {
    fs.createReadStream(`./${translation}.json`).on("data", json => {
      const data = JSON.parse(json);
      let rows = [];
      for (const key of keys(data)) {
        // Get first level of keys
        const flattenedKeys = keys(flatten(data));

        for (const flattenedKey of flattenedKeys) {
          const value = path(split(".", flattenedKey), data);
          // stringify() accepts array of arrays, with each sub-array representing one row
          // each index in the row represents one column,
          // so first col is the flattened key e.g. 'app.diagnostics.data'
          // and the second col is the translation e.g. 'Date'
          rows.push([flattenedKey, value]);
        }
      }

      const csv = stringify(rows);
      fs.writeFileSync(`./csv/${translation}.csv`, csv);
    });
  });
};

// convert()

/** TEST */
const objs = {
  a: { b: { c: "hello" } },
  e: {
    f: {
      g: "there",
      h: "obi wan",
    },
  },
};

// keys(objs).forEach(key => console.log(keys(flatten(objs))));
console.log(keys(flatten(objs)));
/** END TEST */
