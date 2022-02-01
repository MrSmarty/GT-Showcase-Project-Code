"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var debug = require("debug")("philips-hue");

var PhilipsHue = function (_events$EventEmitter) {
  _inherits(PhilipsHue, _events$EventEmitter);

  function PhilipsHue() {
    _classCallCheck(this, PhilipsHue);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PhilipsHue).call(this));

    _this.devicetype = 'node-philips-hue';
    _this.bridge = null;
    _this.username = null;
    return _this;
  }

  _createClass(PhilipsHue, [{
    key: "login",
    value: function login(confFile) {
      var _this2 = this;

      if (typeof confFile !== "string") return Promise.reject("Argument Error: config file is missing");
      debug("login file: " + confFile);
      try {
        if (_fs2.default.statSync(confFile).isFile()) {
          var conf = require(confFile);
          this.bridge = conf.bridge;
          this.username = conf.username;
          this.devicetype = conf.devicetype;
          return Promise.resolve(conf);
        }
      } catch (err) {
        debug("config file not exists");
      }
      debug("generate config file " + confFile);
      return this.getBridges().then(function (bridges) {
        debug("found bridges: " + JSON.stringify(bridges));
        _this2.bridge = bridges[0];
        if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(_this2.bridge)) {
          throw "invalid bridge address \"" + _this2.bridge + "\"";
        }
        return _this2.auth(_this2.bridge);
      }).then(function (username) {
        _this2.username = username;
        var conf = { bridge: _this2.bridge, username: username, devicetype: _this2.devicetype };
        _fs2.default.writeFileSync(confFile, JSON.stringify(conf));
        return conf;
      });
    }
  }, {
    key: "getBridges",
    value: function getBridges() {
      debug("getBridges");
      return _axios2.default.get("https://www.meethue.com/api/nupnp").then(function (res) {
        (0, _util.checkResponse)(res.data);
        return res.data.map(function (i) {
          return i.internalipaddress;
        });
      });
    }
  }, {
    key: "auth",
    value: function auth(bridge) {
      debug("auth bridge: " + bridge);
      return (0, _axios2.default)({
        method: "post",
        url: "http://" + bridge + "/api",
        data: JSON.stringify({
          devicetype: this.devicetype
        })
      }).then(function (res) {
        debug(res.data);
        (0, _util.checkResponse)(res.data);
        return res.data[0].success.username;
      });
    }

    // Bridge API request

  }, {
    key: "request",
    value: function request(opts) {
      var url = "http://" + this.bridge + "/api/" + this.username;
      return (0, _axios2.default)({
        url: "" + url + opts.path,
        method: opts.method || 'get',
        data: opts.data ? JSON.stringify(opts.data) : null
      }).then(function (res) {
        debug(res.data);
        (0, _util.checkResponse)(res.data);
        return res.data;
      });
    }
  }]);

  return PhilipsHue;
}(_events2.default.EventEmitter);

exports.default = PhilipsHue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9waGlsaXBzLWh1ZS5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUdBOzs7Ozs7Ozs7O0FBRkEsSUFBTSxRQUFRLFFBQVEsT0FBUixFQUFpQixhQUFqQixDQUFSOztJQUllOzs7QUFFbkIsV0FGbUIsVUFFbkIsR0FBYTswQkFGTSxZQUVOOzt1RUFGTSx3QkFFTjs7QUFFWCxVQUFLLFVBQUwsR0FBa0Isa0JBQWxCLENBRlc7QUFHWCxVQUFLLE1BQUwsR0FBYyxJQUFkLENBSFc7QUFJWCxVQUFLLFFBQUwsR0FBZ0IsSUFBaEIsQ0FKVzs7R0FBYjs7ZUFGbUI7OzBCQVNiLFVBQVM7OztBQUNiLFVBQUcsT0FBTyxRQUFQLEtBQW9CLFFBQXBCLEVBQThCLE9BQU8sUUFBUSxNQUFSLENBQWUsd0NBQWYsQ0FBUCxDQUFqQztBQUNBLDZCQUFxQixRQUFyQixFQUZhO0FBR2IsVUFBRztBQUNELFlBQUcsYUFBRyxRQUFILENBQVksUUFBWixFQUFzQixNQUF0QixFQUFILEVBQWtDO0FBQ2hDLGNBQUksT0FBTyxRQUFRLFFBQVIsQ0FBUCxDQUQ0QjtBQUVoQyxlQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsQ0FGa0I7QUFHaEMsZUFBSyxRQUFMLEdBQWdCLEtBQUssUUFBTCxDQUhnQjtBQUloQyxlQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUFMLENBSmM7QUFLaEMsaUJBQU8sUUFBUSxPQUFSLENBQWdCLElBQWhCLENBQVAsQ0FMZ0M7U0FBbEM7T0FERixDQVNBLE9BQU0sR0FBTixFQUFVO0FBQ1IsY0FBTSx3QkFBTixFQURRO09BQVY7QUFHQSxzQ0FBOEIsUUFBOUIsRUFmYTtBQWdCYixhQUFPLEtBQ0osVUFESSxHQUVKLElBRkksQ0FFQyxtQkFBVztBQUNmLGtDQUF3QixLQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXhCLEVBRGU7QUFFZixlQUFLLE1BQUwsR0FBYyxRQUFRLENBQVIsQ0FBZCxDQUZlO0FBR2YsWUFBRyxDQUFFLHVDQUF1QyxJQUF2QyxDQUE0QyxPQUFLLE1BQUwsQ0FBOUMsRUFBNEQ7QUFDN0QsOENBQWlDLE9BQUssTUFBTCxPQUFqQyxDQUQ2RDtTQUEvRDtBQUdBLGVBQU8sT0FBSyxJQUFMLENBQVUsT0FBSyxNQUFMLENBQWpCLENBTmU7T0FBWCxDQUZELENBVUosSUFWSSxDQVVDLG9CQUFZO0FBQ2hCLGVBQUssUUFBTCxHQUFnQixRQUFoQixDQURnQjtBQUVoQixZQUFJLE9BQU8sRUFBQyxRQUFRLE9BQUssTUFBTCxFQUFhLFVBQVUsUUFBVixFQUFvQixZQUFZLE9BQUssVUFBTCxFQUE3RCxDQUZZO0FBR2hCLHFCQUFHLGFBQUgsQ0FBaUIsUUFBakIsRUFBMkIsS0FBSyxTQUFMLENBQWUsSUFBZixDQUEzQixFQUhnQjtBQUloQixlQUFPLElBQVAsQ0FKZ0I7T0FBWixDQVZSLENBaEJhOzs7O2lDQWtDSDtBQUNWLFlBQU0sWUFBTixFQURVO0FBRVYsYUFBTyxnQkFDSixHQURJLENBQ0EsbUNBREEsRUFFSixJQUZJLENBRUMsZUFBTztBQUNYLGlDQUFjLElBQUksSUFBSixDQUFkLENBRFc7QUFFWCxlQUFPLElBQUksSUFBSixDQUFTLEdBQVQsQ0FBYSxhQUFLO0FBQUMsaUJBQU8sRUFBRSxpQkFBRixDQUFSO1NBQUwsQ0FBcEIsQ0FGVztPQUFQLENBRlIsQ0FGVTs7Ozt5QkFVUCxRQUFPO0FBQ1YsOEJBQXNCLE1BQXRCLEVBRFU7QUFFVixhQUFPLHFCQUFNO0FBQ1gsZ0JBQVEsTUFBUjtBQUNBLHlCQUFlLGVBQWY7QUFDQSxjQUFNLEtBQUssU0FBTCxDQUFlO0FBQ25CLHNCQUFZLEtBQUssVUFBTDtTQURSLENBQU47T0FISyxFQU1KLElBTkksQ0FNQyxlQUFPO0FBQ2IsY0FBTSxJQUFJLElBQUosQ0FBTixDQURhO0FBRWIsaUNBQWMsSUFBSSxJQUFKLENBQWQsQ0FGYTtBQUdiLGVBQU8sSUFBSSxJQUFKLENBQVMsQ0FBVCxFQUFZLE9BQVosQ0FBb0IsUUFBcEIsQ0FITTtPQUFQLENBTlIsQ0FGVTs7Ozs7Ozs0QkFnQkosTUFBSztBQUNYLFVBQU0sa0JBQWdCLEtBQUssTUFBTCxhQUFtQixLQUFLLFFBQUwsQ0FEOUI7QUFFWCxhQUFPLHFCQUFNO0FBQ1gsa0JBQVEsTUFBTSxLQUFLLElBQUw7QUFDZCxnQkFBUSxLQUFLLE1BQUwsSUFBZSxLQUFmO0FBQ1IsY0FBTSxLQUFLLElBQUwsR0FBWSxLQUFLLFNBQUwsQ0FBZSxLQUFLLElBQUwsQ0FBM0IsR0FBd0MsSUFBeEM7T0FIRCxFQUlKLElBSkksQ0FJQyxlQUFPO0FBQ2IsY0FBTSxJQUFJLElBQUosQ0FBTixDQURhO0FBRWIsaUNBQWMsSUFBSSxJQUFKLENBQWQsQ0FGYTtBQUdiLGVBQU8sSUFBSSxJQUFKLENBSE07T0FBUCxDQUpSLENBRlc7Ozs7U0FyRU07RUFBbUIsaUJBQU8sWUFBUDs7a0JBQW5CIiwiZmlsZSI6InBoaWxpcHMtaHVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGV2ZW50cyBmcm9tIFwiZXZlbnRzXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgY3J5cHRvIGZyb20gXCJjcnlwdG9cIjtcbmltcG9ydCBheGlvcyBmcm9tIFwiYXhpb3NcIjtcbmNvbnN0IGRlYnVnID0gcmVxdWlyZShcImRlYnVnXCIpKFwicGhpbGlwcy1odWVcIik7XG5cbmltcG9ydCB7Y2hlY2tSZXNwb25zZX0gZnJvbSBcIi4vdXRpbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQaGlsaXBzSHVlIGV4dGVuZHMgZXZlbnRzLkV2ZW50RW1pdHRlcntcblxuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5kZXZpY2V0eXBlID0gJ25vZGUtcGhpbGlwcy1odWUnO1xuICAgIHRoaXMuYnJpZGdlID0gbnVsbDtcbiAgICB0aGlzLnVzZXJuYW1lID0gbnVsbDtcbiAgfVxuXG4gIGxvZ2luKGNvbmZGaWxlKXtcbiAgICBpZih0eXBlb2YgY29uZkZpbGUgIT09IFwic3RyaW5nXCIpIHJldHVybiBQcm9taXNlLnJlamVjdChcIkFyZ3VtZW50IEVycm9yOiBjb25maWcgZmlsZSBpcyBtaXNzaW5nXCIpO1xuICAgIGRlYnVnKGBsb2dpbiBmaWxlOiAke2NvbmZGaWxlfWApO1xuICAgIHRyeXtcbiAgICAgIGlmKGZzLnN0YXRTeW5jKGNvbmZGaWxlKS5pc0ZpbGUoKSl7XG4gICAgICAgIHZhciBjb25mID0gcmVxdWlyZShjb25mRmlsZSk7XG4gICAgICAgIHRoaXMuYnJpZGdlID0gY29uZi5icmlkZ2U7XG4gICAgICAgIHRoaXMudXNlcm5hbWUgPSBjb25mLnVzZXJuYW1lO1xuICAgICAgICB0aGlzLmRldmljZXR5cGUgPSBjb25mLmRldmljZXR5cGU7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoY29uZik7XG4gICAgICB9XG4gICAgfVxuICAgIGNhdGNoKGVycil7XG4gICAgICBkZWJ1ZyhcImNvbmZpZyBmaWxlIG5vdCBleGlzdHNcIik7XG4gICAgfVxuICAgIGRlYnVnKGBnZW5lcmF0ZSBjb25maWcgZmlsZSAke2NvbmZGaWxlfWApO1xuICAgIHJldHVybiB0aGlzXG4gICAgICAuZ2V0QnJpZGdlcygpXG4gICAgICAudGhlbihicmlkZ2VzID0+IHtcbiAgICAgICAgZGVidWcoYGZvdW5kIGJyaWRnZXM6ICR7SlNPTi5zdHJpbmdpZnkoYnJpZGdlcyl9YCk7XG4gICAgICAgIHRoaXMuYnJpZGdlID0gYnJpZGdlc1swXTtcbiAgICAgICAgaWYoISgvXlxcZHsxLDN9XFwuXFxkezEsM31cXC5cXGR7MSwzfVxcLlxcZHsxLDN9JC8udGVzdCh0aGlzLmJyaWRnZSkpKXtcbiAgICAgICAgICB0aHJvdyBgaW52YWxpZCBicmlkZ2UgYWRkcmVzcyBcIiR7dGhpcy5icmlkZ2V9XCJgO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmF1dGgodGhpcy5icmlkZ2UpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKHVzZXJuYW1lID0+IHtcbiAgICAgICAgdGhpcy51c2VybmFtZSA9IHVzZXJuYW1lO1xuICAgICAgICB2YXIgY29uZiA9IHticmlkZ2U6IHRoaXMuYnJpZGdlLCB1c2VybmFtZTogdXNlcm5hbWUsIGRldmljZXR5cGU6IHRoaXMuZGV2aWNldHlwZX07XG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMoY29uZkZpbGUsIEpTT04uc3RyaW5naWZ5KGNvbmYpKTtcbiAgICAgICAgcmV0dXJuIGNvbmY7XG4gICAgICB9KTtcbiAgfVxuXG4gIGdldEJyaWRnZXMoKXtcbiAgICBkZWJ1ZyhcImdldEJyaWRnZXNcIik7XG4gICAgcmV0dXJuIGF4aW9zXG4gICAgICAuZ2V0KFwiaHR0cHM6Ly93d3cubWVldGh1ZS5jb20vYXBpL251cG5wXCIpXG4gICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICBjaGVja1Jlc3BvbnNlKHJlcy5kYXRhKTtcbiAgICAgICAgcmV0dXJuIHJlcy5kYXRhLm1hcChpID0+IHtyZXR1cm4gaS5pbnRlcm5hbGlwYWRkcmVzc30pO1xuICAgICAgfSk7XG4gIH1cblxuICBhdXRoKGJyaWRnZSl7XG4gICAgZGVidWcoYGF1dGggYnJpZGdlOiAke2JyaWRnZX1gKTtcbiAgICByZXR1cm4gYXhpb3Moe1xuICAgICAgbWV0aG9kOiBcInBvc3RcIixcbiAgICAgIHVybDogYGh0dHA6Ly8ke2JyaWRnZX0vYXBpYCxcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgZGV2aWNldHlwZTogdGhpcy5kZXZpY2V0eXBlXG4gICAgICB9KVxuICAgIH0pLnRoZW4ocmVzID0+IHtcbiAgICAgIGRlYnVnKHJlcy5kYXRhKTtcbiAgICAgIGNoZWNrUmVzcG9uc2UocmVzLmRhdGEpO1xuICAgICAgcmV0dXJuIHJlcy5kYXRhWzBdLnN1Y2Nlc3MudXNlcm5hbWU7XG4gICAgfSk7XG4gIH1cblxuICAvLyBCcmlkZ2UgQVBJIHJlcXVlc3RcbiAgcmVxdWVzdChvcHRzKXtcbiAgICBjb25zdCB1cmwgPSBgaHR0cDovLyR7dGhpcy5icmlkZ2V9L2FwaS8ke3RoaXMudXNlcm5hbWV9YDtcbiAgICByZXR1cm4gYXhpb3Moe1xuICAgICAgdXJsOiBgJHt1cmx9JHtvcHRzLnBhdGh9YCxcbiAgICAgIG1ldGhvZDogb3B0cy5tZXRob2QgfHwgJ2dldCcsXG4gICAgICBkYXRhOiBvcHRzLmRhdGEgPyBKU09OLnN0cmluZ2lmeShvcHRzLmRhdGEpIDogbnVsbFxuICAgIH0pLnRoZW4ocmVzID0+IHtcbiAgICAgIGRlYnVnKHJlcy5kYXRhKTtcbiAgICAgIGNoZWNrUmVzcG9uc2UocmVzLmRhdGEpO1xuICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgIH0pO1xuICB9XG5cbn1cbiJdfQ==