"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ResponseMessage = function () {
    function ResponseMessage(msg) {
        (0, _classCallCheck3.default)(this, ResponseMessage);

        this.msg = msg;
    }

    (0, _createClass3.default)(ResponseMessage, [{
        key: "send",
        value: function send(content) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var _response = content.join("\n");

                if (_response.length < 2000) {
                    _this.msg.channel.send(_response);
                } else {
                    var partCount = Math.ceil(_response.length / 2000);
                    var resultSize = Math.ceil(content.length / partCount);

                    for (var i = 0; i < partCount; i++) {
                        var chunk = content.slice(i * resultSize, i * resultSize + resultSize);

                        _this.msg.channel.send(chunk.join("\n"));
                    }
                }

                resolve(content);
            });
        }
    }]);
    return ResponseMessage;
}();

exports.default = ResponseMessage;