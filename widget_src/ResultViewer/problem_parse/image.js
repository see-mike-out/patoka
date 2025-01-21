import { defualt_color } from "../../CircuitViewer/svg_utils/constants";

export function planImage(image_data, config) {
  let px_data = image_data.image_pixelized,
    mode = image_data.mode,
    size = image_data.image_size;

  let resolution = config?.resolution || 1;
  let width = size[0] * resolution, height = size[1] * resolution;

  let image_group = {
    type: "g",
    x: 0,
    y: 0,
    width,
    height,
    elem: []
  }

  for (let h = 0; h < px_data?.length; h++) {
    for (let w = 0; w < px_data[h]?.length; w++) {
      let pixel = {
        type: "rect",
        x: w * resolution,
        y: h * resolution,
        width: resolution,
        height: resolution,
        "stroke-width": 0,
      }
      let p = px_data[h][w];
      if (mode === "brightness") {
        pixel.fill = defualt_color;
        pixel["fill-opacity"] = (255-p[0]) / 255;
      } else if (mode === "rgb") {
        pixel.fill = `rgb(${p.map(d => d).join(", ")})`;
      }
      image_group.elem.push(pixel)
    }
  }


  let image = {
    type: "svg",
    width,
    height,
    viewBox: [0, 0, width, height],
    groups: {
      image_group
    }
  }

  return image;
}

export function parse1DImageProblem(counts, config) {
  if (!counts) return;

  // let states = Object.keys(counts);
  let states = Math.pow(2, Object.keys(counts)[0]?.length) || 0;
  let _dir = config?.dir;

  // configurations
  let _data_shape;
  let _width = config?.image_width, _height = config?.image_height;
  if (_width !== undefined && _height !== undefined) {
    _data_shape = [_width, _height, 1];
  } else if (_width !== undefined && _height === undefined) {
    _height = states / _width
    _data_shape = [_width, _height, 1];
  } else if (_width === undefined && _height !== undefined) {
    _width = states / _height
    _data_shape = [_width, _height, 1];
  } else {
    _data_shape = [Math.floor(states), 1, 1];
  }

  let dims = (_data_shape[0] * _data_shape[1] * _data_shape[2]) || 0;

  // reshape
  let data_shape;
  if (!_data_shape || _data_shape?.length < 2) {
    // width x height x brightness
    data_shape = [states, 1, 1];
  } else {
    // width x height x brightness
    data_shape = [_data_shape[0], _data_shape[1], 1];
  }

  let dir = _dir;
  if (!_dir) {
    dir = "row";
  }

  // image processing
  let magnitude = config?.magnitude;

  let n_shots = config?.n_shots || Object.values(counts).reduce((a, c) => a + c, 0);
  let psi_noisy = [];
  for (let bit in counts) {
    let bit_index = parseInt(bit, 2);
    if (bit_index < states && bit_index < dims) {
      let count = counts[bit];
      psi_noisy[bit_index] = Math.sqrt(count / n_shots) * magnitude;
    }
  }

  let image_pixelized = dims > 0 ? pixelize(psi_noisy, data_shape, dir) : [];
  let image_size = [data_shape[0], data_shape[1]];

  let image_data = {
    image: psi_noisy,
    image_pixelized,
    data_shape,
    image_size,
    mode: 'brightness',
    dir
  };
  let imagePlan = planImage(image_data, config);
  imagePlan.data = image_data;
  return imagePlan;
}

export function parse3DImageProblem(counts, config) {
  if (!counts) return;

  // configurations
  let _dir = config?.dir;
  let _data_shape;
  let states = Math.pow(2, Object.keys(counts)[0]?.length) || 0;
  let _width = config?.image_width, _height = config?.image_height;
  if (_width !== undefined && _height !== undefined) {
    _data_shape = [_width, _height, 3];
  } else if (_width !== undefined && _height === undefined) {
    _height = Math.floor(states / _width / 3)
    _data_shape = [_width, 3];
  } else if (_width === undefined && _height !== undefined) {
    _width = Matth.floor(states / _height / 3)
    _data_shape = [_width, _height, 3];
  } else {
    _data_shape = [Math.floor(states / 3), 1, 3];
  }

  let dims = (_data_shape[0] * _data_shape[1] * _data_shape[2]) || 0;

  // reshape
  let data_shape = _data_shape;
  let dir = _dir;
  if (!_dir) {
    dir = "row";
  }

  let magnitude = config?.magnitude;
  let n_shots = config?.n_shots || Object.values(counts).reduce((a, c) => a + c, 0);
  let psi_noisy = [];
  for (let bit in counts) {
    let bit_index = parseInt(bit, 2);
    if (bit_index < states && bit_index < dims) {
      let count = counts[bit];
      psi_noisy[bit_index] = Math.sqrt(count / n_shots) * magnitude;
    }
  }

  let c = 0;
  for (const a of psi_noisy) {
    if (!psi_noisy[c]) psi_noisy[c] = 0;
    c++;
  }


  let image_pixelized = dims > 0 ? pixelize(psi_noisy, data_shape, dir) : [];
  let image_size = [data_shape[0], data_shape[1]];

  let image_data = {
    image: psi_noisy,
    image_pixelized,
    data_shape,
    image_size,
    mode: 'rgb',
    dir
  };
  let imagePlan = planImage(image_data, config);
  imagePlan.data = image_data;
  return imagePlan;
}

function pixelize(image, shape, dir) {
  let pixelized = [];
  let width = shape[0];
  let height = shape[1]
  let px_dims = shape[2];
  let px_column_starts = [];
  let px_width = Math.floor(image.length / px_dims);
  for (let i = 0; i < px_dims; i++) {
    px_column_starts.push(px_width * i);
  }
  for (let i = 0; i < height; i++) {
    pixelized.push(Array.from(Array(width).keys()));
  }
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      pixelized[h][w] = [];
    }
  }
  for (let h = 0; h < height; h++) {
    for (let w = 0; w < width; w++) {
      pixelized[h][w] = []
      let s = dir === "row" ? h * width + w : w * height + h;
      for (let p = 0; p < px_dims; p++) {
        pixelized[h][w].push(image[px_column_starts[p] + s]);
      }
    }
  }
  return pixelized;
}