import { get_radian_names } from "./util";

export function format_parameter(param) {
  if (typeof param == 'number') {
    return get_radian_names(param)
  } else if (typeof param == 'string') {
    return param;
  } else if (param instanceof Object) {
    if (param, expr !== undefined) {
      return param.expr
    } else if (param.vector !== undefined && param.index !== undefined) {
      return `${param.vector}[${param.index}]`;
    }
  }
}