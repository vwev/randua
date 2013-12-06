// This file should contain usage statistics and other information needed to
// generate random user agents

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
var rand_range = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var rand_date = function (begin, end) {
    var year = (typeof end === 'undefined') ?
            begin :
            rand_range(begin, end);
    var month = rand_range(1, 12);
    var day = rand_range(0, (month % 2) ? 31 : 30);

    // format strings might be a nice touch
    return '' + year + ((month < 10) ? '0' + month : month) +
            ((day < 10) ? '0' + day : day);
};

module.exports.engine = {
    'gecko': function (info) {
        // firefox is the only gecko engine web browser supported for now
        var major = info.browser.version.split('.')[0];
        switch (major) {
        case '0':
            return rand_date(2004);
        case '1':
            return rand_date(2004, 2007);
        case '2':
        case '3':
            return rand_date(2006, 2008);
        case '4':
            return rand_date(2010, 2011);
        // starting with ~firefox 5, official builds have the same build date
        //
        // I'm guessing those that don't are Nightly/Aurora, software
        // distro builds or self compiled.
        //
        // random date at %2 chance, otherwise use common one
        default:
            return (Math.random() < 0.02) ? rand_date(2008, 2011) : "20100101";
        }
    },
    'webkit': function (info) {
        var version = info.browser.version.split('.'),
            major = version[0];
        switch (info.browser.name) {
        case 'chrome':
            return (function () {
                switch (major) {
                case '0':
                case '1':  return '525.19';
                case '2':  return '530.' + rand_range(4, 8);
                case '3':  return '532.0';
                case '4':  return '532.' + rand_range(0, 5);
                case '5':  return '533.' + rand_range(1, 4);
                case '6':  return '534.' + rand_range(1, 4);
                case '7':  return '534.' + rand_range(6, 10);
                case '8':  return '534.10';
                case '9':  return '534.' + rand_range(12, 14);
                case '10': return '534.' + rand_range(14, 17);
                case '11': return '534.' + rand_range(17, 24);
                case '12': return '534.30';
                case '13':
                case '14': return '535.1';
                case '15': return '535.2';
                case '16': return '535.7';
                case '17': return '535.11';
                case '18': return '535.19';
                case '19': return '536.3';
                case '20':
                case '21': return '536.6';
                case '22': return '537.4';
                case '23': return '537.11';
                case '24': return '537.' + rand_range(13, 17);
                // 25-26 unknown
                // 27-32 all seem to be 537.36
                default: return '537.36';
                }
            })();
        case 'safari':
            return (function () {
                switch (major) {
                case '6': return '536.26';
                case '5':
                    return (function () {
                        switch (version[1]) {
                        case '1': return '534.' + rand_range(40, 60);
                        case '0':
                            return (function () {
                                switch(version[2]) {
                                case '5': return '533.21.1';
                                case '4': return '533.20.25';
                                case '3':
                                    return (Math.random() < 0.5) ?
                                        '533.20.25' :
                                        '533.19.4';
                                case '2': return '';
                                default: return '';
                                }
                            })();
                        default: return '';
                        }
                    })();
                default: return '';
                }
            })();
        case 'presto':
            // this user agent is extremely inconsistent
            return 'foo';
        default: return 'zzz';
        }
    },
    'trident': function (info) {
        var major = info.browser.version.split('.')[0];
        switch (major) {
        case '10': return '6.0';
        case '9':  return '5.0';
        case '8':  return '4.0';
        default:   return null;
        }
    }
};

module.exports.locale = {
    default: {
	'en-US': { usage: 0.60 },
	'en-CA': { usage: 0.20 },
	'en-GB': { usage: 0.20 }
    },
    // we can randomize locales completely, could cause some pages to be
    // displayed in a foreign language
    code: {
        'en-US':    { usage: 0.40 },
        'en-GB':    { usage: 0.40 },
        'en-CA':    { usage: 0.20 }
        // todo with other languages
    }
};

module.exports.platform = {
    'desktop': {
        usage: 0.60,
        os: {
            'windows':  { usage: 0.90 },
            'osx':      { usage: 0.08 },
            'linux':    { usage: 0.01 },
            'freebsd':  { usage: 0.005 },
            'openbsd':  { usage: 0.005 }
        },
        browser: {
            // to be calculated
            'firefox':  { usage: 0.30 },
            'opera':    { usage: 0.30 },
            'chrome':   { usage: 0.30 },
            'safari':   { usage: 0.10 }
        }
    },
    'mobile': {
        usage: 0.35,
        os: {
            'android':  { usage: 1.00 }
        },
        browser: {
            'android':  { usage: 1.00 }
        }
    },
    // spiders but also scripts(HTTP libraries) and assorted HTTP tools
    // called it spider for lack of a better term
    'spider': {
        usage: 0.05,
        os: {
            'none':     { usage: 1.00 }
        },
        browser: {
            'wget':     { usage: 0.50 },
            'googlebot':{ usage: 0.50 }
        }
    }
};

module.exports.os = {
    'windows': {
        usage: 0.54,
        platform: {
            'desktop':  { usage: 1.00 }
        },
        browser: {
            'chrome':   { usage: 0.34 },
            'ie':       { usage: 0.32 },
            'firefox':  { usage: 0.23 },
            'safari':   { usage: 0.08 },
            'opera':    { usage: 0.03 }
        },
        version: {
            'Windows NT 6.3':               { usage: 0.05 }, // 8.1
            'Windows NT 6.2; WOW64':        { usage: 0.05 },
            'Windows NT 6.2; Win64; x64':   { usage: 0.05 },
            'Windows NT 6.2':               { usage: 0.05 }, // 8
            'Windows NT 6.2; WOW64':        { usage: 0.05 },
            'Windows NT 6.2; Win64; x64':   { usage: 0.10 },
            'Windows NT 6.1':               { usage: 0.10 }, // 7
            'Windows NT 6.1; WOW64':        { usage: 0.10 },
            'Windows NT 6.1; Win64; x64':   { usage: 0.15 },
            'Windows NT 6.0':               { usage: 0.10 }, // Vista
            'Windows NT 6.0; WOW64':        { usage: 0.05 },
            'Windows NT 6.0; Win64; x64':   { usage: 0.03 },
            'Windows NT 5.2':               { usage: 0.01 }, // XP 64
            'Windows NT 5.1':               { usage: 0.10 }, // XP
            'Windows NT 5.0':               { usage: 0.005 }, // 2000
            'Win98': { usage: 0.005 }   // heh
        }
    },
    'osx': {
        usage: 0.04,
        platform: {
            'desktop':  { usage: 1.00 }
        },
        browser: {
            'chrome':   { usage: 0.34 },
            'firefox':  { usage: 0.23 },
            'safari':   { usage: 0.08 },
            'opera':    { usage: 0.03 }
        },
        version: {

        }
    },
    'linux': {
        usage: 0.01,
        platform: {
            'desktop':  { usage: 1.00 }
        },
        browser: {
            'chrome':   { usage: 0.34 },
            'firefox':  { usage: 0.23 },
            'safari':   { usage: 0.08 },
            'opera':    { usage: 0.03 }
        }
    },
    'freebsd': {
        usage: 0.005,
        platform: {
            'desktop':  { usage: 1.00 }
        },
        browser: {
            'chrome':   { usage: 0.34 },
            'firefox':  { usage: 0.23 },
            'safari':   { usage: 0.08 },
            'opera':    { usage: 0.03 }
        }
    },
    'openbsd': {
        usage: 0.005,
        platform: {
            'desktop':  { usage: 1.00 }
        },
        browser: {
            'chrome':   { usage: 0.34 },
            'ie':       { usage: 0.32 },
            'firefox':  { usage: 0.23 },
            'safari':   { usage: 0.08 },
            'opera':    { usage: 0.03 }
        }
    },
    'android': {
        usage: 0.35,
        platform: {
            'mobile':   { usage: 1.00 }
        },
        browser: {
            'android':  { usage: 0.5 },
            'firefox':  { usage: 0.5 }
        },
        version: {
            'whatever': { usage: 1.00 }
        }
    },
    'none': {
        usage: 0.05,
        platform: {
            'spider':   { usage: 1.00 }
        },
        browser: {
            'wget':     { usage: 0.50 },
            'googlebot':{ usage: 0.50 }
        }
    }
};

module.exports.browser = {
    'firefox': {
        locale: 0.01,
        engine: 'gecko',
        platform: {
            'desktop':  { usage: 0.90 },
            'mobile':   { usage: 0.10 }
        },
        os: {
            'windows':  { usage: 0.60 },
            'osx':      { usage: 0.20 },
            'linux':    { usage: 0.02 },
            'freebsd':  { usage: 0.01 },
            'openbsd':  { usage: 0.01 },
            'android':  { usage: 0.085 },
            'ios':      { usage: 0.085 }
        },
        version: {
            '1.0':      { usage: 0.50 },
            '25.0':     { usage: 0.50 }
        }
    },
    'chrome': {
        locale: 0.00,
        engine: 'webkit',
        platform: {
            'desktop':  { usage: 0.90 },
            'mobile':   { usage: 0.10 }
        },
        os: {
            'windows':  { usage: 0.60 },
            'osx':      { usage: 0.20 },
            'linux':    { usage: 0.02 },
            'freebsd':  { usage: 0.01 },
            'openbsd':  { usage: 0.01 },
            'android':  { usage: 0.085 },
            'ios':      { usage: 0.085 }
        },
        version: {
            '32.0.1667.0': { usage: 0.50 },
            '32.0.1664.3': { usage: 0.25 },
            '6.0.416.0': { usage: 0.25}
        }
    },
    'ie': {
        locale: 0.01,
        engine: 'trident',
        platform: {
            'desktop':  { usage: 1.0 }
        },
        os: {
            'windows':  { usage: 1.0 },
        },
        version: {
            '10.0': { usage: 0.25 },
            '9.0': { usage: 0.25 },
            '8.0': { usage: 0.25 },
            '6.0': { usage: 0.25 }
        },
        extra: {
            // more subcategories should be required
            'SLCC2; Media Center PC 6.0; InfoPath.3; MS-RTC LM 8; Zune 4.7':
                { usage: 0.10 }
            // none: 0.90
        }

    },
    'android': {
        engine: 'webkit',
        platform: {
            'mobile':   { usage: 1.00 }
        },
        os: {
            'android':  { usage: 1.00 }
        }
    }
};
