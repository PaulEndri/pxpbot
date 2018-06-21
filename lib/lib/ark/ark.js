'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _sourcequery = require('sourcequery');

var _sourcequery2 = _interopRequireDefault(_sourcequery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var timeoutBuffer = 3000;
var ArkServer = '45.35.132.58';
var ArkPort = '20716';
var query = new _sourcequery2.default(timeoutBuffer);

query.open(ArkServer, ArkPort);

var Ark = function () {
    function Ark() {
        (0, _classCallCheck3.default)(this, Ark);
    }

    (0, _createClass3.default)(Ark, null, [{
        key: 'handle',
        value: function handle(ctx, message) {
            var parameter = ctx[1];

            if (Ark[parameter] !== undefined && parameter != 'handle') {
                return Ark[parameter](ctx, message);
            }

            return Promise.resolve("Invalid Parameter");
        }
    }, {
        key: 'players',
        value: function players(ctx, message) {
            var players = ["Players active on Pixelpub Server:"];

            return new Promise(function (resolve, reject) {
                query.getPlayers(function (error, playerList) {

                    if (error) {
                        return reject(error);
                    }

                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = playerList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var player = _step.value;

                            players.push('\t- ' + player.name + ' - Online for ' + Math.round(parseFloat(player.online) / 60) + ' minutes');
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    if (players.length === 1) {
                        players.push("\t- No players available at this time");
                    }

                    resolve(players);
                });
            });
        }
    }, {
        key: 'server',
        value: function server(ctx, message) {

            return new Promise(function (resolve, reject) {
                query.getInfo(function (error, information) {
                    if (error) {
                        return reject(error);
                    }

                    query.getRules(function (error, rules) {
                        if (error) {
                            return reject(error);
                        }

                        var worldTime = void 0;

                        try {
                            worldTime = rules.find(function (r) {
                                return r.name === 'DayTime_s';
                            }).value.toString();
                            worldTime = worldTime.length === 3 ? worldTime + "0" : worldTime;
                            worldTime = worldTime.substring(0, 2) + ":" + worldTime.substring(2);
                        } catch (e) {
                            worldTime = 'Unknown';
                        }

                        var serverInformation = ["Information on the Pixelpub Ark: Survival Evolved Server", '\tServer Name: ' + information.name, '\tMap: ' + information.map, '\tPlayers: ' + information.players + '/' + information.maxplayers, '\tWorld Time: ' + worldTime, '\tDedicated: ' + (information.servertype === "d" ? "Yes" : "No"), '\tPlatform: ' + (information.environment === "w" ? "Windows" : information.environment === "l" ? "Linux" : "Mac")];

                        resolve(serverInformation);
                    });
                });
            });
        }
    }]);
    return Ark;
}();

exports.default = Ark;