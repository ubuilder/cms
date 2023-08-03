
export function slugify(str, separator = '_') {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      if (str[i] === " " || str[i] === "-" || str[i] === "_") {
        result += separator;
        i++;
      }
      result += str[i].toLowerCase();
    }
    return result;
  } 