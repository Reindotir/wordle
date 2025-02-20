"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shader = exports.Shader = exports.Pack = exports.Theme = void 0;
var Theme = /** @class */ (function () {
    function Theme(option) {
        if (option === void 0) { option = {}; }
        this._envSelector = "";
        this.mixins = {};
        if (typeof option === "string") {
            option = { name: option };
        }
        this.shader = exports.shader;
        this.name = "";
        this._name = "";
        this.autoInit = false;
        this.config = {};
        this.attachedPacks = [];
        this.setRulesLater = [];
        this.createNode();
        Object.assign(this, option);
        var style = document.querySelector("[data-theme=\"".concat(this.name, "\"]")) || null;
        if (style) {
            this.style = style;
            this.sheet = style.sheet;
        }
        else {
            this.sheet = null;
        }
        this._allowedMethods = ["restore", "_enableMethods",];
        this._originalMethods = {};
        this._savedTheme = null;
        this.deleted = false;
        var existed;
        if (this.autoInit) {
            existed = this.init();
        }
        if (existed) {
            return existed;
        }
    }
    Object.defineProperty(Theme.prototype, "envSelector", {
        get: function () {
            return this._envSelector;
        },
        set: function (vl) {
            if (vl && !vl.endsWith(" "))
                vl = vl + " ";
            this._envSelector = vl;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Theme.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (name) {
            var exist = document.querySelector("[data-theme=\"".concat(name, "\"]"));
            if (exist)
                return;
            if (this.style)
                this.style.setAttribute("data-theme", name);
            this._name = name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Theme.prototype, "theme", {
        get: function () {
            var _this = this;
            var _a, _b;
            var theme = {
                name: this.name,
                comps: {},
                option: {},
                config: this.config,
            };
            var oldStyle;
            if (!this.sheet) {
                oldStyle = this.style;
                this.style = document.createElement("style");
                this.style.disabled = true;
                (_a = document.querySelector("head")) === null || _a === void 0 ? void 0 : _a.appendChild(this.style);
                this.sheet = this.style.sheet;
                if (this.setThemeLater) {
                    this.theme = this.setThemeLater;
                }
                this.setRulesLater.forEach(function (rule) {
                    _this.add.apply(_this, rule);
                });
            }
            var rules = ((_b = this.sheet) === null || _b === void 0 ? void 0 : _b.cssRules) || [new CSSRule()];
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                var option = {};
                var selector = rule.selectorText;
                var styles = rule.style;
                var props = {};
                var onlyVars = true;
                for (var j = 0; j < styles.length; j++) {
                    var name_1 = styles[j];
                    if (!name_1.startsWith("--")) {
                        onlyVars = false;
                    }
                    props[name_1] = styles.getPropertyValue(name_1);
                }
                if (onlyVars) {
                    option.toVar = true;
                }
                theme.option[selector] = option;
                theme.comps[selector] = props;
            }
            if (oldStyle) {
                this.style.remove();
                this.style = oldStyle;
                this.sheet = null;
            }
            return theme;
        },
        set: function (theme) {
            if (!this.style) {
                this.setThemeLater = theme;
                return;
            }
            this.reset();
            for (var selector in theme.comps) {
                this.add(selector, theme.comps[selector], theme.option[selector]);
            }
            this.config = theme.config;
            if (!this.name)
                this.name = theme.name;
        },
        enumerable: false,
        configurable: true
    });
    Theme.prototype.createNode = function () {
        this.style = document.createElement("style");
        this.style.setAttribute("data-theme", this.name);
        this.style.themeLink = this;
    };
    Theme.prototype.init = function () {
        var _this = this;
        var _a;
        if (!this.name) {
            console.error("THEME MUST HAVE F NAME!");
            return;
        }
        var existed = document.querySelector("[data-theme=\"".concat(this.name, "\"]"));
        if (existed) {
            return existed.themeLink;
        }
        (_a = document.querySelector("head")) === null || _a === void 0 ? void 0 : _a.appendChild(this.style);
        this.sheet = this.style.sheet;
        if (this.setThemeLater) {
            this.theme = this.setThemeLater;
            this.setThemeLater = null;
        }
        this.setRulesLater.forEach(function (rule) {
            _this.add.apply(_this, rule);
        });
        this.setRulesLater = [];
    };
    Theme.prototype.restore = function (name, init) {
        if (init === void 0) { init = true; }
        this._enableMethods();
        this.name = name;
        this.createNode();
        if (this._savedTheme)
            this.theme = this._savedTheme;
        if (init)
            this.init();
    };
    Theme.prototype.attach = function (pack) {
        this.attachedPacks.push(pack);
    };
    Theme.prototype.detach = function (pack) {
        var toDel = -1;
        for (var i = 0; i <= this.attachedPacks.length; i++) {
            if (this.attachedPacks[i] === pack) {
                toDel = i;
                break;
            }
        }
        if (toDel === -1)
            this.attachedPacks.splice(toDel, 1);
    };
    Theme.prototype.env = function (selector) {
        var _this = this;
        var oldSel = this.envSelector;
        this.envSelector = selector;
        return function () {
            _this.envSelector = oldSel;
        };
    };
    Theme.prototype.add = function (selector, styles, option) {
        var _this = this;
        if (option === void 0) { option = {}; }
        if (!this.sheet) {
            this.setRulesLater.push([selector, styles, option]);
            return;
        }
        var op = {
            toVar: false,
            index: null,
            reWrite: false,
            global: false,
            sheet: this.sheet,
        };
        Object.assign(op, option);
        if (!op.global && !selector.startsWith("@")) {
            selector = this.envSelector + selector;
        }
        if (op.toVar === true) {
            styles = this.shader.toVar(styles);
        }
        if (op.reWrite) {
            this.removeAll(selector);
            op.index = this.sheet.cssRules.length;
        }
        if (selector.startsWith("@mixin")) {
            var name_2 = selector.split(" ")[1];
            exports.shader.mixins[name_2] = styles;
            return;
        }
        else if (selector.startsWith("@")) {
            var idx = op.sheet.insertRule("".concat(selector, " {}"), op.index);
            var rule_1 = op.sheet.cssRules[idx];
            for (var selector_1 in styles) {
                var value = styles[selector_1];
                this.add(selector_1, value, {
                    sheet: rule_1
                });
            }
            return;
        }
        var extender = {};
        for (var key in styles) {
            if (key === "@extend") {
                var rule_2 = this.find(styles[key]) || exports.shader.find(styles[key]);
                if (!rule_2)
                    continue;
                rule_2 = exports.shader.parse(rule_2.cssText);
                extender = __assign(__assign({}, extender), rule_2);
            }
            else if (key === "@include") {
                var rule_3 = this.mixins[styles[key]] || exports.shader.mixins[styles[key]];
                extender = __assign(__assign({}, extender), rule_3);
            }
        }
        styles = __assign(__assign({}, extender), styles);
        var nested = [];
        for (var key in styles) {
            if (key === "@extend" || key === "@include") {
                delete styles[key];
                continue;
            }
            if (typeof styles[key] !== "object")
                continue;
            var sel = void 0;
            if (key.startsWith("&")) {
                sel = selector + key.slice(1);
            }
            else {
                sel = selector + " " + key;
            }
            nested.push([sel, styles[key], { global: true }]);
            delete styles[key];
        }
        var rules = exports.shader.toString(styles);
        var rule = "".concat(selector, " ").concat(rules);
        if (!op.index)
            op.index = op.sheet.cssRules.length;
        op.sheet.insertRule(rule, op.index);
        nested.forEach(function (rule) {
            _this.add.apply(_this, rule);
        });
    };
    Theme.prototype.remove = function (selector) {
        var _a, _b, _c, _d;
        if (typeof selector === "string") {
            var rules = ((_a = this.sheet) === null || _a === void 0 ? void 0 : _a.cssRules) || [new CSSRule()];
            for (var i = 0; i < rules.length; i++) {
                var rule = rules[i];
                if (rule.selectorText === selector) {
                    (_b = this.sheet) === null || _b === void 0 ? void 0 : _b.deleteRule(i);
                    return true;
                }
            }
        }
        else if (isNaN(selector)) {
            var index = selector;
            var rules = ((_c = this.sheet) === null || _c === void 0 ? void 0 : _c.cssRules) || [new CSSRule()];
            if (index >= 0 && index < rules.length) {
                (_d = this.sheet) === null || _d === void 0 ? void 0 : _d.deleteRule(index);
                return true;
            }
        }
        return false;
    };
    Theme.prototype.removeAll = function (selector) {
        var _this = this;
        if (typeof selector !== "string")
            return;
        var matches = this.findAll(selector, "index");
        matches.forEach(function (index) {
            var _a;
            if (typeof index === "number") {
                (_a = _this.sheet) === null || _a === void 0 ? void 0 : _a.deleteRule(index);
            }
        });
    };
    Theme.prototype.find = function (selector) {
        if (!this.sheet)
            return null;
        var cureRule = null;
        for (var _i = 0, _a = this.sheet.cssRules; _i < _a.length; _i++) {
            var rule = _a[_i];
            if (cureRule)
                break;
            if (rule instanceof CSSStyleRule) {
                if (rule.selectorText === selector) {
                    cureRule = rule;
                }
            }
        }
        return cureRule;
    };
    Theme.prototype.findAll = function (selector, type) {
        var _a, _b;
        if (type === void 0) { type = "rule"; }
        var matches = [];
        var rules = ((_a = this.sheet) === null || _a === void 0 ? void 0 : _a.cssRules) || [new CSSRule()];
        for (var i = 0; i < rules.length; i++) {
            var rule = (_b = this.sheet) === null || _b === void 0 ? void 0 : _b.cssRules[i];
            if (rule.selectorText !== selector)
                return [];
            if (type === "rule") {
                matches.push(rule);
            }
            else if (type === "index") {
                matches.push(i);
            }
            else if (type === "text") {
                matches.push(rule.cssText);
            }
        }
        return matches;
    };
    Theme.prototype.reset = function () {
        if (!this.sheet)
            return;
        while (this.sheet.cssRules.length > 0) {
            this.sheet.deleteRule(0);
        }
    };
    Theme.prototype.active = function () {
        this.style.disabled = false;
    };
    Theme.prototype.disable = function () {
        this.style.disabled = true;
    };
    Theme.prototype._disableMethods = function () {
        var _this = this;
        Object.getOwnPropertyNames(Object.getPrototypeOf(this)).forEach(function (method) {
            if (typeof _this[method] === "function" &&
                method !== "constructor" &&
                !_this._allowedMethods.includes(method)) {
                _this._originalMethods[method] = _this[method](_this)[method] = function () {
                    console.error("Theme is deleted! To fix it call method restore.");
                    return null;
                };
            }
        });
    };
    Theme.prototype._enableMethods = function () {
        var _this = this;
        Object.keys(this._originalMethods).forEach(function (method) {
            _this[method] = _this._originalMethods[method];
        });
        this._originalMethods = {};
    };
    Theme.prototype.delete = function () {
        this._savedTheme = this.theme;
        if (this._savedTheme)
            delete this._savedTheme.name;
        this._disableMethods();
        this.deleted = true;
        this.style.remove();
        this.shader.delTheme(this.name);
        for (var _i = 0, _a = this.attachedPacks; _i < _a.length; _i++) {
            var pack = _a[_i];
            pack.del(this);
        }
    };
    Theme.prototype.save = function (name) {
        if (name === void 0) { name = this.name; }
        var theme = this.theme;
        theme.name = name;
        this.shader.saveTheme(theme);
        return theme;
    };
    Theme.prototype.copy = function (name, init) {
        if (name === void 0) { name = ""; }
        if (init === void 0) { init = false; }
        if (!name && init) {
            console.error("Can't init without name.");
            return;
        }
        return new Theme({
            name: name,
            theme: this.theme,
            autoInit: init
        });
    };
    return Theme;
}());
exports.Theme = Theme;
var Pack = /** @class */ (function () {
    function Pack(option) {
        if (option === void 0) { option = {}; }
        this.name = "";
        this.themes = [];
        this.shader = exports.shader;
        this.autoInit = false;
        this.config = {};
        Object.assign(this, option);
        var themes = __spreadArray([], this.themes, true);
        this.themes = [];
        this.add.apply(this, themes);
        if (this.autoInit)
            this.init();
    }
    Object.defineProperty(Pack.prototype, "pack", {
        get: function () {
            var pack = {
                name: this.name,
                themes: {},
                config: this.config,
            };
            this.themes.forEach(function (theme) {
                var themeObj = theme.theme;
                var key = themeObj.name;
                pack.themes[key] = themeObj;
            });
            return pack;
        },
        set: function (pack) {
            if (!this.name)
                this.name = pack.name;
            this.reset();
            for (var name_3 in pack.themes) {
                var theme = pack.themes[name_3];
                var themeClass = new Theme({
                    name: name_3,
                    theme: theme,
                });
                this.add(themeClass);
            }
            this.config = pack.config;
        },
        enumerable: false,
        configurable: true
    });
    Pack.prototype.add = function () {
        var _this = this;
        var themes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            themes[_i] = arguments[_i];
        }
        themes.forEach(function (theme) {
            for (var _i = 0, _a = _this.themes; _i < _a.length; _i++) {
                var themeClass = _a[_i];
                if (theme === themeClass)
                    return;
            }
            _this.themes.push(theme);
            theme.attach(_this);
        });
    };
    Pack.prototype.del = function () {
        var _this = this;
        var themes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            themes[_i] = arguments[_i];
        }
        themes.forEach(function (theme) {
            var toDel = -1;
            for (var i = 0; i <= _this.themes.length; i++) {
                if (_this.themes[i] === theme) {
                    theme.detach(_this);
                    toDel = i;
                    break;
                }
            }
            if (toDel !== -1)
                _this.themes.splice(toDel, 1);
        });
    };
    Pack.prototype.save = function (name) {
        if (name === void 0) { name = this.name; }
        var pack = this.pack;
        pack.name = name;
        this.shader.savePack(pack);
        return pack;
    };
    Pack.prototype.reset = function () {
        var _this = this;
        this.themes.forEach(function (theme) {
            theme.detach(_this);
        });
    };
    Pack.prototype.active = function () {
        this.themes.forEach(function (theme) {
            theme.active();
        });
    };
    Pack.prototype.disable = function () {
        this.themes.forEach(function (theme) {
            theme.disable();
        });
    };
    Pack.prototype.init = function () {
        this.themes.forEach(function (theme) {
            theme.init();
        });
    };
    Pack.prototype.delete = function (delThemes) {
        var _this = this;
        if (delThemes === void 0) { delThemes = false; }
        this.themes.forEach(function (theme) {
            theme.detach(_this);
            if (delThemes)
                theme.delete();
        });
        this.shader.delPack(this.name);
    };
    Pack.prototype.copy = function (name, init) {
        if (name === void 0) { name = ""; }
        if (init === void 0) { init = false; }
        return new Pack({
            name: name,
            pack: this.pack,
            autoInit: init,
        });
    };
    return Pack;
}());
exports.Pack = Pack;
var Shader = /** @class */ (function () {
    function Shader(conf) {
        if (conf === void 0) { conf = {}; }
        this.mixins = {};
        this.op = {
            themeKey: "shader-theme-store",
            packKey: "shader-pack-store",
        };
        Object.assign(this.op, conf);
        this.Theme = Theme;
        this.Pack = Pack;
        if (localStorage.getItem(this.op.themeKey) === null) {
            localStorage.setItem(this.op.themeKey, "{}");
        }
        if (localStorage.getItem(this.op.packKey) === null) {
            localStorage.setItem(this.op.packKey, "{}");
        }
    }
    Object.defineProperty(Shader.prototype, "themes", {
        get: function () {
            var themes = localStorage.getItem(this.op.themeKey);
            if (!themes)
                return null;
            return JSON.parse(themes);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shader.prototype, "packs", {
        get: function () {
            var packs = localStorage.getItem(this.op.packKey);
            if (!packs)
                return null;
            return JSON.parse(packs);
        },
        enumerable: false,
        configurable: true
    });
    Shader.prototype.toVar = function (oldPack) {
        var pack = {};
        for (var key in oldPack) {
            var newVar = key;
            if (key.slice(0, 2) !== "--" && typeof oldPack[key] === "string") {
                newVar = "--" + key;
            }
            pack[newVar] = oldPack[key];
        }
        return pack;
    };
    Shader.prototype.toString = function (styles) {
        var props = Object.entries(styles)
            .map(function (_a) {
            var key = _a[0], value = _a[1];
            return "\t".concat(key.replace(/([A-Z])/g, "-$1").toLowerCase(), ": ").concat(value, ";");
        })
            .join("\n");
        return "{\n ".concat(props, " \n}");
    };
    Shader.prototype.parse = function (cssText, type) {
        if (type === void 0) { type = "styles"; }
        var cssObject = {};
        var rules = cssText.replace(/\/\*[\s\S]*?\*\//g, "").match(/([^{]+)\s*\{([^}]+)\}/g);
        if (!rules)
            return cssObject;
        rules.forEach(function (rule) {
            var match = rule.match(/([^{]+)\s*\{([^}]+)\}/);
            if (!match)
                return;
            var selector = match[1], properties = match[2];
            var styles = properties.split(";").reduce(function (acc, prop) {
                var _a = prop.split(":").map(function (s) { return s.trim(); }), key = _a[0], value = _a[1];
                if (key && value) {
                    acc[key] = value;
                }
                return acc;
            }, {});
            cssObject[selector.trim()] = styles;
        });
        if (type === "styles") {
            for (var key in cssObject) {
                return cssObject[key];
            }
        }
        return cssObject;
    };
    Shader.prototype.find = function (selector) {
        var cureRule = null;
        for (var _i = 0, _a = document.styleSheets; _i < _a.length; _i++) {
            var sheet = _a[_i];
            if (cureRule)
                break;
            for (var _b = 0, _c = sheet.cssRules; _b < _c.length; _b++) {
                var rule = _c[_b];
                if (cureRule)
                    break;
                if (rule instanceof CSSStyleRule) {
                    if (rule.selectorText === selector) {
                        cureRule = rule;
                    }
                }
            }
        }
        return cureRule;
    };
    Shader.prototype.loadPack = function (name, init) {
        if (init === void 0) { init = false; }
        var pack = this.packs[name];
        if (!pack)
            return null;
        return new Pack({
            pack: pack,
            autoInit: init,
        });
    };
    Shader.prototype.savePack = function () {
        var _this = this;
        var Packs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            Packs[_i] = arguments[_i];
        }
        Packs.forEach(function (pack) {
            var packs = _this.packs;
            packs[pack.name] = pack.pack;
            console.log(packs);
            localStorage.setItem(_this.op.packKey, JSON.stringify(packs));
        });
    };
    Shader.prototype.delPack = function (name) {
        var packs = this.packs;
        delete packs[name];
        localStorage.setItem(this.op.packKey, JSON.stringify(packs));
    };
    Shader.prototype.hasPack = function (name) {
        if (this.packs[name])
            return true;
        return false;
    };
    Shader.prototype.loadTheme = function (name, init) {
        if (init === void 0) { init = false; }
        var theme = this.themes[name];
        if (!theme)
            return null;
        return new Theme({
            theme: theme,
            autoInit: init,
        });
    };
    Shader.prototype.saveTheme = function () {
        var _this = this;
        var themes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            themes[_i] = arguments[_i];
        }
        themes.forEach(function (theme) {
            var Themes = _this.themes;
            Themes[theme.name] = theme;
            localStorage.setItem(_this.op.themeKey, JSON.stringify(Themes));
        });
    };
    Shader.prototype.delTheme = function (themeName) {
        var themes = this.themes;
        delete themes[themeName];
        localStorage.setItem(this.op.themeKey, themes);
    };
    Shader.prototype.hasTheme = function (themeName) {
        var theme = this.themes[themeName];
        if (theme)
            return true;
        return false;
    };
    return Shader;
}());
exports.Shader = Shader;
exports.shader = new Shader();
