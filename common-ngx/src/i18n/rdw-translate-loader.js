"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var json_unflat_1 = require("json-unflat");
var http_loader_1 = require("@ngx-translate/http-loader");
var _ = require("lodash");
var core_1 = require("@angular/core");
var RdwTranslateLoader = (function () {
    function RdwTranslateLoader(http) {
        this.http = http;
        this.embeddedLanguages = ["en"];
        this.apiLoader = new http_loader_1.TranslateHttpLoader(this.http, '/api/translations/', '');
        this.uiLoader = new http_loader_1.TranslateHttpLoader(this.http, '/assets/i18n/', '.json');
    }
    RdwTranslateLoader.prototype.getTranslation = function (lang) {
        var uiObservable = this.embeddedLanguages.indexOf(lang) >= 0 ?
            this.uiLoader.getTranslation(lang) : rxjs_1.Observable.of({});
        var apiObservable = this.apiLoader.getTranslation(lang).catch(function () { return rxjs_1.Observable.of({}); });
        var translateObserver;
        var observable = new rxjs_1.Observable(function (observer) { return translateObserver = observer; });
        rxjs_1.Observable
            .forkJoin([uiObservable, apiObservable])
            .share()
            .subscribe(function (responses) {
            var merged = _.merge(responses[0], json_unflat_1.JsonUnFlat.unflat(responses[1]));
            translateObserver.next(merged);
            translateObserver.complete();
        });
        return observable;
    };
    ;
    RdwTranslateLoader = __decorate([
        core_1.Injectable()
    ], RdwTranslateLoader);
    return RdwTranslateLoader;
}());
exports.RdwTranslateLoader = RdwTranslateLoader;
