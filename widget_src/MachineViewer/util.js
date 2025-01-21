import { markers } from "./meta_info";

export function makeCode(basket_data, code_config) {
  let as_function = code_config.as_function === undefined ? true : code_config.as_function;
  let default_tab = as_function ? "    " : "";
  let backend_name = code_config.backend_var_name;
  let code = as_function ? `def get_data(_backend_):` : '';
  code += "\n"
  let dict_keys = [];
  for (const line of basket_data) {
    if (line.includes(" = ")) {
      code += `${default_tab}${line}`;
      dict_keys.push(line.split(" = ")[0]);
    } else {
      code += `${default_tab}${line} = ${markers[line]}`;
      dict_keys.push(line);
    }
    code += "\n"
  }
  if (as_function) {
    code += `\n${default_tab}output = {\n`
    for (const key of dict_keys) {
      code += `${default_tab}    "${key}": ${key},`
      code += "\n"
    }
    code += `${default_tab}}\n`

    code += default_tab + "return output"
  }
  code = code.replace(/_backend_/gi, backend_name)
  return code
}

export function decideBlackWhite(hexCode) {
  let colorCode = hexCode.replace("#", "");
  let rgb = [colorCode.slice(0, 2), colorCode.slice(2, 4), colorCode.slice(4, 6)].map((d) => parseInt(d, 16));
  if ((rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114) > 186) return "#000000"; else return "#ffffff";
}

export function toPythonDatetime(datetime) {
  let dt = new Date(datetime);
  return 'datetime(' + [
    dt.getFullYear(),
    dt.getMonth(),
    dt.getDate(),
    dt.getHours(),
    dt.getMinutes(),
    dt.getSeconds(),
    dt.getMilliseconds()
  ].join(', ') + ')'
}