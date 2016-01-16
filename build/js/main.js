"use strict";

$(function () {

    var App = function () {

        return {
            init: function init() {
                DummyModule.init();
            }
        };
    }()

    /**
     * Dummy Module Example
     */
    ,
        DummyModule = function () {
        return {
            init: function init() {
                // do something
            }
        };
    }();App.init();
});
