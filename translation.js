const fs = require("node:fs");
const csv = require("csv-parser");
const { lensPath, mergeDeepRight, reduceRight, set } = require("ramda");

// const translations = ["attributes", "common", "glossary"];
const translations = ["glossary"];

translations.forEach((translation) => {
  let english = [];
  let arabic = [];

  fs.createReadStream(`./${translation}.csv`)
    .pipe(csv())
    .on("data", (data) => {
      let path = data._key.split("_");
      let result = reduceRight((obj, next) => ({ [obj]: next }), {}, path);
      english.push(set(lensPath(path), data.en, result));
      arabic.push(set(lensPath(path), data.ar, result));
    })
    .on("end", () => {
      const englishJson = reduceRight(mergeDeepRight, {}, english);
      const arabicJson = reduceRight(mergeDeepRight, {}, arabic);

      fs.writeFileSync(
        `./en/${translation}.json`,
        JSON.stringify(englishJson, null, 2)
      );
      fs.writeFileSync(
        `./ar/${translation}.json`,
        JSON.stringify(arabicJson, null, 2)
      );
    });
});
