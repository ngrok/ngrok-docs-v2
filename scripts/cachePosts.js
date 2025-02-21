"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var front_matter_1 = require("front-matter");
var fs = require("fs/promises");
var fs_1 = require("fs");
function walk(path, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var results;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readdir(path)];
                case 1:
                    results = _a.sent();
                    return [4 /*yield*/, Promise.all(results.map(function (fileOrDirectory) { return __awaiter(_this, void 0, void 0, function () {
                            var filePath, stat;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        filePath = "".concat(path, "/").concat(fileOrDirectory);
                                        return [4 /*yield*/, fs.stat(filePath)];
                                    case 1:
                                        stat = _a.sent();
                                        if (stat.isDirectory()) {
                                            return [2 /*return*/, walk(filePath, callback)];
                                        }
                                        else {
                                            return [2 /*return*/, callback(filePath, stat)];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/***
 * build a cache file for each content-type
 * walkPath: the path to read
 * filename: what to save the cache file as
 * urlPath: used for slugs, such as /docs, /posts, etc
 ***/
function cacheFile(walkPath, filename, urlPath) {
    return __awaiter(this, void 0, void 0, function () {
        var blogPosts, addFile;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blogPosts = [];
                    addFile = function (file) { return __awaiter(_this, void 0, void 0, function () {
                        var frontmatter, _a, url;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _a = front_matter_1.default;
                                    return [4 /*yield*/, fs.readFile(file, "utf-8")];
                                case 1:
                                    frontmatter = _a.apply(void 0, [_b.sent()]);
                                    url = "";
                                    //skip any .DS_Store files
                                    if (file.endsWith(".DS_Store")) {
                                        return [2 /*return*/];
                                        // is this an index.mdx file?
                                    }
                                    else if (file.endsWith("index.mdx")) {
                                        url = "".concat(urlPath, "/").concat(file.substring(walkPath.length + 1, file.length - "/index.mdx".length));
                                        // is this any other mdx file?
                                    }
                                    else if (file.endsWith(".mdx")) {
                                        url = "".concat(urlPath, "/").concat(file.substring(walkPath.length + 1, file.length - ".mdx".length));
                                    }
                                    blogPosts.push({
                                        attributes: frontmatter.attributes,
                                        body: "...",
                                        url: url.replace(/\/\//g, "/"),
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, walk(walkPath, addFile)];
                case 1:
                    _a.sent();
                    // sort by the date in frontmatter
                    blogPosts = blogPosts.sort(function (a, z) {
                        var _a, _b;
                        var aTime = new Date((_a = a.attributes.date) !== null && _a !== void 0 ? _a : "").getTime();
                        var zTime = new Date((_b = z.attributes.date) !== null && _b !== void 0 ? _b : "").getTime();
                        return aTime > zTime ? -1 : aTime === zTime ? 0 : 1;
                    });
                    return [4 /*yield*/, fs.writeFile(filename, JSON.stringify(blogPosts))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// for each content-type, we can generate a cache json file
function getContent() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // posts
                return [4 /*yield*/, cacheFile("./content/posts", "./content/blog-cache.json", "/blog")];
                case 1:
                    // posts
                    _a.sent();
                    // docs
                    return [4 /*yield*/, cacheFile("./content/docs", "./content/docs-cache.json", "/docs")];
                case 2:
                    // docs
                    _a.sent();
                    // pages
                    return [4 /*yield*/, cacheFile("./content/pages", "./content/page-cache.json", "")];
                case 3:
                    // pages
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
getContent();
if (process.argv.at(-1) === "watch") {
    (0, fs_1.watch)("./content", function (eventType, filename) {
        if (filename && filename.endsWith(".mdx")) {
            getContent();
        }
    });
}
