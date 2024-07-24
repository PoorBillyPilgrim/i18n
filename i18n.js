const fs = require("node:fs");
const { keys } = require("ramda");

const transform = (obj) =>
  Object.entries(obj).reduce((a, [k, v]) => {
    return {
      ...a,
      [k]:
        typeof v == "string"
          ? `i18next.t("", ${v}, {ns: "attributes"})`
          : transform(v),
    };
  }, {});

fs.readFile("./en-original/attributes.json", (err, data) => {
  //   console.log(Object.entries(JSON.parse(data)));
  const result = transform(JSON.parse(data));
  console.log(result);
  const js = `import i18next from i18next;
  
  export default attributes = ${JSON.stringify(result)}
  `;
  fs.writeFile("./attributes-test.js", js, (err) => console.log(err));
  //   Object.entries(JSON.parse(data)).forEach(([k, v]) => {
  //     console.log(obj);
  //     let string = ""
  //     if (v === Object) {
  //         string += k
  //     } else {
  //     }
  //   });
});
