'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _clanRefresh = require('./lib/tasks/clanRefresh');

var _clanRefresh2 = _interopRequireDefault(_clanRefresh);

var _nodeCron = require('node-cron');

var _nodeCron2 = _interopRequireDefault(_nodeCron);

var _sqlize = require('./lib/database/sqlize');

var _sqlize2 = _interopRequireDefault(_sqlize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tasks = function () {
    function Tasks() {
        (0, _classCallCheck3.default)(this, Tasks);
    }

    (0, _createClass3.default)(Tasks, null, [{
        key: 'begin',
        value: function begin(client) {
            _nodeCron2.default.schedule('*/10 * * * *', function () {
                var task = new _clanRefresh2.default(_sqlize2.default, false);

                console.log("Beginning automated task run");
                task.run(0, client).then(function () {
                    console.log("Succesfully completed automated clan refresh");
                }).catch(function (e) {
                    console.log("An error occured with automated clan refresh");
                    console.log(e);
                });
            });
        }
    }]);
    return Tasks;
}();

exports.default = Tasks;