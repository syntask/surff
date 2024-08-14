function HSLAtoString(v) {

    //Make sure values are within range
    if (v.h >= 360) v.h = 0;
    if (v.s >= 100) v.s = 100;
    if (v.l >= 100) v.l = 100;
    // If saturation is 0, set hue to 0
    if (v.s <= 0) v.h = 0;
    // if we have a alpha value, make sure its within range. Otherwise set it to 1
    if (v.a > 1){ v.a = 1 }else if (v.a < 0){ v.a = 0} else if (v.a === undefined){ v.a = 1}
    
    // Round values to 2 decimal places
    h = Math.round(v.h, 2);
    s = Math.round(v.s, 2);
    l = Math.round(v.l, 2);
    a = Math.round(v.a, 2);

    // If alpha is 1, return a hsl string. Otherwise return a hsla string
    if (a === 1) {
        return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
    } else {
        return 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
    }
}

function stringToHSLA(v) {
    // Accepts a string like 'hsl(120.23, 18.43435%, 50.23432%)' or 'hsla(120, 100%, 50%, 0.5)' and returns an object with h, s, l, and a values
    // Create a regex pattern to match the string
    var pattern = /hsla?\((\d+\.?\d*),\s*(\d+\.?\d*)%,\s*(\d+\.?\d*)%,?\s*(\d*\.?\d*)?\)/;
    // Match the pattern to the string
    var match = v.match(pattern);
    // If there is no match, return null
    if (!match) return null;
    // Create an object with h, s, and l values
    var obj = {
        h: parseFloat(match[1]),
        s: parseFloat(match[2]),
        l: parseFloat(match[3]),
    };
    // If there is an alpha value, add it to the object
    if (match[4]) obj.a = parseFloat(match[4]);
    // Return the object
    return obj;
}

function HSLAstringToHEXAstring(v) {
    // Accepts a string like 'hsl(120.23, 18.43435%, 50.23432%)' or 'hsla(120, 100%, 50%, 0.5)' and returns a hex string like '#FF0000' or '#FF000077'
    var pattern = /hsla?\((\d+\.?\d*),\s*(\d+\.?\d*)%,\s*(\d+\.?\d*)%,?\s*(\d*\.?\d*)?\)/;
    var match = v.match(pattern);
    if (!match) return null;

    var h = parseFloat(match[1]);
    var s = parseFloat(match[2]) / 100;
    var l = parseFloat(match[3]) / 100;
    var a = match[4] ? parseFloat(match[4]) : 1;

    function hslToRgb(h, s, l) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h / 360 + 1 / 3);
            g = hue2rgb(p, q, h / 360);
            b = hue2rgb(p, q, h / 360 - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    var [r, g, b] = hslToRgb(h, s, l);

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function alphaToHex(a) {
        var alpha = Math.round(a * 255);
        var hex = alpha.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    var hex = "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    if (a < 1) {
        hex += alphaToHex(a);
    }

    hex=hex.toUpperCase();

    return hex;
}