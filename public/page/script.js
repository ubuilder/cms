// import Alpine from 'alpinejs'
// import morph from '@alpinejs/morph'

// window.Alpine = Alpine
// Alpine.plugin(morph)

// const queryStringToObject = (url) =>
//   [...new URLSearchParams(url.split("?")[1])].reduce(
//     (a, [k, v]) => ((a[k] = v), a),
//     {}
//   );

// const objectToQueryString = (obj) =>
//   Object.keys(obj).reduce((prev, curr, index) => {
//     const sign = index === 0 ? "?" : "&";
//     return prev + sign + curr + "=" + obj[curr];
//   }, "");

window.addEventListener("alpine:init", () => {
  Alpine.directive("page", (el) => {
    Alpine.bind(el, {
      "u-data"() {
        return {
          //
          filters: JSON.parse(new URL(location.href).searchParams.get('filters') ?? '{}') ?? {},
          async reload() {

            const filters = {}

            for(let filter in this.$data.filters) {
                if(this.$data.filters[filter].value === '') {
                    continue
                }
                filters[filter] = this.$data.filters[filter]
            }
            const newUrl =
              window.location.origin +
              window.location.pathname +
            '?filters=' + JSON.stringify(filters);
              
            window.history.replaceState(null, document.title, newUrl);

            const res = await fetch("?partial", {
              method: "POST",
              body: JSON.stringify({
                filters: filters
              }),
            });
            const json = await res.json();

            document.querySelector("[u-page]").outerHTML = json.html;
          },
        };
      },
    });

    Alpine.magic("page", (el) => {
      return {
        async reload() {
          const res = await fetch("?partial", {
            method: "POST",
            body: JSON.stringify({
              filters: {}
            }),
          });
          const json = await res.json();

          document.querySelector("[u-page]").outerHTML = json.html;
        },
      };
    });
  });
});
