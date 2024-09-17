export const timeStringCheck = (string) => {
    string = string.replace(/ /g, '');
    if (!/^\d{3,6}$/.test(string)) {
        return false;
    }
    let h;
    let m;
    let s;
    if (string.length <= 4) {
        h = Number(string.slice(0, -2));
        m = Number(string.slice(-2));
        s = 0;
    }
    else {
        h = Number(string.slice(0, -4));
        m = Number(string.slice(-4, -2));
        s = Number(string.slice(-2));
    }
    if (h < 0 || 24 < h || m < 0 || 59 < m || s < 0 || 59 < s)
        return false;
    return true;
};
export const timeStringToNumber = (oudstr) => {
    if (!timeStringCheck(oudstr)) {
        return -1;
    }
    oudstr = oudstr.replace(/ /g, '');
    if (oudstr.length <= 4) {
        return Number(oudstr.slice(0, -2)) * 3600 + Number(oudstr.slice(-2)) * 60;
    }
    else {
        return (Number(oudstr.slice(0, -4)) * 3600 +
            Number(oudstr.slice(-4, -2)) * 60 +
            Number(oudstr.slice(-2)));
    }
};
export const numberToTimeString = (number, format) => {
    if (format === 'HMM_space') {
        let hour = String(Math.floor(number / 3600));
        if (hour.length === 1)
            hour = '\u2007' + hour;
        return hour + String(Math.floor((number % 3600) / 60)).padStart(2, '0');
    }
    if (format === 'HMM') {
        return (Math.floor(number / 3600) +
            String(Math.floor((number % 3600) / 60)).padStart(2, '0'));
    }
    if (format === 'min_HH:MM') {
        return (Math.floor((number % 3600) / 60) +
            ':' +
            String(Math.floor((number % 3600) % 60)).padStart(2, '0'));
    }
    if (format === 'H:MM') {
        return (Math.floor((number % 86400) / 3600) +
            ':' +
            String(Math.floor(((number % 86400) % 3600) / 60)).padStart(2, '0'));
    }
    if (format === 'HH MM SS') {
        return (String(Math.floor(number / 3600)).padStart(2, '0') +
            ' ' +
            String(Math.floor((number % 3600) / 60)).padStart(2, '0') +
            ' ' +
            String(number % 60).padStart(2, '0'));
    }
    if (format === 'HMMSS') {
        return (Math.floor(number / 3600) +
            String(Math.floor((number % 3600) / 60)).padStart(2, '0') +
            String(number % 60).padStart(2, '0'));
    }
    return '';
};
export class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    static from(str) {
        let r = 0;
        let g = 0;
        let b = 0;
        if (/^[0-9a-fA-F]{8}$/.test(str)) {
            b = parseInt(str.slice(2, 4), 16);
            g = parseInt(str.slice(4, 6), 16);
            r = parseInt(str.slice(6, 8), 16);
        }
        else if (/^#[0-9a-fA-F]{6}$/.test(str)) {
            r = parseInt(str.slice(1, 3), 16);
            g = parseInt(str.slice(3, 5), 16);
            b = parseInt(str.slice(5, 7), 16);
        }
        else if (/^#[0-9a-fA-F]{3}$/.test(str)) {
            r = parseInt(str[1], 16);
            g = parseInt(str[2], 16);
            b = parseInt(str[3], 16);
        }
        return new this(r, g, b);
    }
    toHEXString() {
        return ('#' +
            this.r.toString(16).padStart(2, '0') +
            this.g.toString(16).padStart(2, '0') +
            this.b.toString(16).padStart(2, '0'));
    }
    toOudiaString() {
        return ('00' +
            this.b.toString(16).padStart(2, '0') +
            this.g.toString(16).padStart(2, '0') +
            this.r.toString(16).padStart(2, '0')).toUpperCase();
    }
    clone() {
        return new Color(this.r, this.g, this.b);
    }
}
export class Font {
    constructor() {
        this.height = 9;
        this.family = 'MS ゴシック';
        this.bold = false;
        this.italic = false;
    }
    static from(oudstr) {
        const result = new this();
        const props = oudstr.split(';');
        for (const prop of props) {
            const [key, val] = prop.split('=');
            switch (key) {
                case 'PointTextHeight':
                    result.height = Number(val);
                    break;
                case 'Facename':
                    result.family = val;
                    break;
                case 'Bold':
                    result.bold = val === '1';
                    break;
                case 'Italic':
                    result.italic = val === '1';
                    break;
            }
        }
        return result;
    }
    toOudiaString() {
        return ('PointTextHeight=' +
            this.height +
            ';Facename=' +
            this.family +
            (this.bold ? ';Bold=1' : '') +
            (this.italic ? ';Italic=1' : ''));
    }
    clone() {
        return Object.assign(new Font(), this);
    }
}
export function getTimetableStyle(station) {
    const n = (Number(station.timetableStyle.arrival[0]) << 3) +
        (Number(station.timetableStyle.arrival[1]) << 2) +
        (Number(station.timetableStyle.departure[0]) << 1) +
        Number(station.timetableStyle.departure[1]);
    switch (n) {
        case 3:
            return 'Jikokukeisiki_Hatsu';
        case 15:
            return 'Jikokukeisiki_Hatsuchaku';
        case 9:
            return 'Jikokukeisiki_KudariChaku';
        case 6:
            return 'Jikokukeisiki_NoboriChaku';
    }
    return 'Jikokukeisiki_Hatsu';
}
export function ColorToOudiaString(rgb) {
    return ('00' +
        rgb.b.toString(16).padStart(2, '0') +
        rgb.g.toString(16).padStart(2, '0') +
        rgb.r.toString(16).padStart(2, '0')).toUpperCase();
}
//# sourceMappingURL=Util.js.map