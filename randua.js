// contains the generator class and tests

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

var stats = require('./stats');

var randstat = function (obj) {
    var sum = 0,
        rand = Math.random(),
        ret = null;

    for (var key in obj) {
        sum += obj[key].usage;
        if (sum >= rand) {
            ret = key;
            break;
        }
    }

    return ret;
};

var uagen = function () {
    var platform, os, browser;

    var randomize = function () {
        var p, o, b;

        if (platform) {
            p = platform;
            if (os) {
                o = os;
                b = browser || randstat(stats.os[o].browser);
            } else {
                if (browser) {
                    b = browser;
                    o = randstat(stats.browser[b].os);
                } else {
                    o = randstat(stats.platform[p].os);
                    b = randstat(stats.os[o].browser);
                }
            }
        } else {
            if (os) {
                o = os;
                if (browser) {
                    b = browser;
                    p = randstat(stats.os[o].platform);
                } else {
                    p = randstat(stats.os[o].platform);
                    b = randstat(stats.platform[p].browser);
                }
            } else {
                if (browser) {
                    b = browser;
                    p = randstat(stats.browser[b].platform);
                    o = randstat(stats.platform[p].os);
                } else {
                    p = randstat(stats.platform);
                    o = randstat(stats.platform[p].os);
                    b = randstat(stats.os[o].browser);
                }
            }
        }

        return {
            platform: p,
            os: o,
            browser: b
        };
    };

    var make_string = function (info) {
        var str = '';

        switch (info.browser.name) {
        case 'firefox':
            str += 'Mozilla/5.0 (';
            str += info.os.version;
            str += '; ';
            if (info.locale) str += info.locale + '; ';
            str += 'rv:';
            str += info.browser.version;
            str += ') Gecko/';
            str += info.browser.engine;
            str += ' Firefox/';
            str += info.browser.version;
            break;
        case 'chrome':
            str += 'Mozilla/5.0 (';
            str += info.os.version;
            str += ') AppleWebKit/';
            str += info.browser.engine;
            str += ' (KHTML, like Gecko) Chrome/';
            str += info.browser.version;
            str += ' Safari/';
            str += info.browser.engine;
            break;
        case 'opera':
            // completely illogical
        default:
            console.log(info);
            str = 'to be implemented';
            break;
        }

        return str;
    };

    return {
        setPlatform: function (p) {
            if (!stats.platform[p])
                throw {};

            if (os && !stats.os[os].platform[p])
                throw {};

            if (browser && !stats.browser[browser].platform[p])
                throw {};

            platform = p;
        },
        setOs: function (o) {
            if (!stats.os[o])
                throw {};

            if (platform && !stats.platform[platform].os[o])
                throw {};

            if (browser && !stats.browser[browser].os[o])
                throw {};

            os = o;
        },
        setBrowser: function (b) {
            if (!stats.browser[b])
                throw {};

            if (platform && !stats.platform[platform].browser[b])
                throw {};

            if (os && !stats.os[os].browser[b])
                throw {};

            browser = b;
        },
        generate: function () {
            var br = randomize(),
                browser = stats.browser[br.browser],
                os = stats.os[br.os],
                info = {};

            info.platform = br.platform;

            info.browser = {};
            info.browser.name = br.browser;
            info.browser.version = randstat(browser.version);
            info.browser.engine = stats.engine[browser.engine](info);

            info.os = {};
            info.os.name = br.os;
            info.os.version = randstat(os.version);

            if (Math.random() <= browser.locale)
                info.locale = (typeof stats.locale.default === 'string') ?
                              stats.locale.default :
                              randstat(stats.locale.default);

            return make_string(info);
        }
    };
};

var gen = uagen();
// all firefox user agents(including mobile)
gen.setBrowser('firefox');
for (var i = 0; i < 4; i++) console.log(gen.generate());
// only desktop firefox user agents
gen.setPlatform('desktop');
for (var i = 0; i < 4; i++) console.log(gen.generate());
// only desktop/windows firefox user agents
gen.setOs('windows');
for (var i = 0; i < 4; i++) console.log(gen.generate());
