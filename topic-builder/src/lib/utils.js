const canvas = document.createElement("canvas");
const globals = {};

export function useTheme(theme) {
    globals.theme = theme;
}

export function measureText(text, size, fontFamily) {
    size = size || globals.theme.font.defaultSize;
    fontFamily = fontFamily || globals.theme.font.family;
    let ctx = canvas.getContext("2d");
    ctx.font = `${size}px ${fontFamily}`;
    let textSize = ctx.measureText(text);
    return { height: size, width: textSize.width };
}

export function removeItem(arr, func) {
    if (!arr) return arr;
    let idx = arr.findIndex(func);
    if (idx < 0) return arr;
    return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
}

export function removeIdx(arr, idx) {
    if (idx < 0) return arr;
    return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
}

export function updateItem(arr, findFunction, value) {
    if (!arr) return arr;
    let idx = arr.findIndex(findFunction);

    if (idx < 0) return arr;
    let state = arr[idx];

    if (typeof value === "function") {
        state = value(state);
    } else {
        state = value;
    }

    return [...arr.slice(0, idx), state, ...arr.slice(idx + 1)];
}

export function toggleItem(arr, item, findFunction = f => f === item) {
    let idx = arr.findIndex(findFunction);
    if (idx < 0) {
        return [...arr, item];
    } else {
        return removeIdx(arr, idx);
    }
}

export function addItemIfNot(arr, item, findFunction = f => f === item) {
    let idx = arr.findIndex(findFunction);
    if (idx < 0) {
        return [...arr, item];
    }
    return arr;
}

export function isShallowEqual(v, o) {
    for (let key in v) if (!(key in o) || v[key] !== o[key]) return false;

    for (let key2 in o) if (!(key2 in v) || v[key2] !== o[key2]) return false;

    return true;
}

export function arrayToMap(arr, key, val = v => v) {
    return arr.reduce((map, obj) => {
        let objKey = key(obj);
        map[objKey] = val(obj);
        return map;
    }, {});
}

export function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
}
