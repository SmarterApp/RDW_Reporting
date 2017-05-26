"use strict";
var Exam = (function () {
    function Exam() {
    }
    Object.defineProperty(Exam.prototype, "studentName", {
        get: function () {
            return this._studentName;
        },
        set: function (value) {
            this._studentName = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Exam.prototype, "date", {
        get: function () {
            return this._date;
        },
        set: function (value) {
            this._date = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Exam.prototype, "session", {
        get: function () {
            return this._session;
        },
        set: function (value) {
            this._session = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Exam.prototype, "enrolledGrade", {
        get: function () {
            return this._enrolledGrade;
        },
        set: function (value) {
            this._enrolledGrade = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Exam.prototype, "score", {
        get: function () {
            return this._score;
        },
        set: function (value) {
            this._score = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Exam.prototype, "level", {
        get: function () {
            return this._level;
        },
        set: function (value) {
            this._level = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Exam.prototype, "administrativeCondition", {
        get: function () {
            return this._administrativeCondition;
        },
        set: function (value) {
            this._administrativeCondition = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Exam.prototype, "completeness", {
        get: function () {
            return this._completeness;
        },
        set: function (value) {
            this._completeness = value;
        },
        enumerable: true,
        configurable: true
    });
    return Exam;
}());
exports.Exam = Exam;
