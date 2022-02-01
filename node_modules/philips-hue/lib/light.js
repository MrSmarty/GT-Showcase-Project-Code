"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _philipsHue = require("./philips-hue");

var _philipsHue2 = _interopRequireDefault(_philipsHue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = require("debug")("philips-hue:light");


_philipsHue2.default.prototype.getLights = function () {
  return this.request({ path: "/lights" });
};

_philipsHue2.default.prototype.light = function (num) {
  return new Light(num, this);
};

var Light = function () {
  function Light() {
    var number = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var hue = arguments[1];

    _classCallCheck(this, Light);

    this.number = number;
    this.hue = hue;
  }

  _createClass(Light, [{
    key: "getInfo",
    value: function getInfo() {
      debug("light(" + this.number + ") getInfo");
      return this.hue.request({ path: "/lights/" + this.number });
    }
  }, {
    key: "setInfo",
    value: function setInfo(put_data) {
      debug("light(" + this.number + ") setInfo " + JSON.stringify(put_data));
      return this.hue.request({
        path: "/lights/" + this.number,
        method: "put",
        data: put_data
      });
    }
  }, {
    key: "setState",
    value: function setState(put_data) {
      debug("light(" + this.number + ") setState " + JSON.stringify(put_data));
      return this.hue.request({
        path: "/lights/" + this.number + "/state",
        method: "put",
        data: put_data
      });
    }
  }, {
    key: "on",
    value: function on() {
      return this.setState({ on: true });
    }
  }, {
    key: "off",
    value: function off() {
      return this.setState({ on: false });
    }
  }]);

  return Light;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9saWdodC5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBOzs7Ozs7OztBQURBLElBQU0sUUFBUSxRQUFRLE9BQVIsRUFBaUIsbUJBQWpCLENBQVI7OztBQUdOLHFCQUFJLFNBQUosQ0FBYyxTQUFkLEdBQTBCLFlBQVU7QUFDbEMsU0FBTyxLQUFLLE9BQUwsQ0FBYSxFQUFDLE1BQU0sU0FBTixFQUFkLENBQVAsQ0FEa0M7Q0FBVjs7QUFJMUIscUJBQUksU0FBSixDQUFjLEtBQWQsR0FBc0IsVUFBUyxHQUFULEVBQWE7QUFDakMsU0FBTyxJQUFJLEtBQUosQ0FBVSxHQUFWLEVBQWUsSUFBZixDQUFQLENBRGlDO0NBQWI7O0lBSWhCO0FBRUosV0FGSSxLQUVKLEdBQTRCO1FBQWhCLCtEQUFTLGlCQUFPO1FBQUosbUJBQUk7OzBCQUZ4QixPQUV3Qjs7QUFDMUIsU0FBSyxNQUFMLEdBQWMsTUFBZCxDQUQwQjtBQUUxQixTQUFLLEdBQUwsR0FBVyxHQUFYLENBRjBCO0dBQTVCOztlQUZJOzs4QkFPSztBQUNQLHVCQUFlLEtBQUssTUFBTCxjQUFmLEVBRE87QUFFUCxhQUFPLEtBQUssR0FBTCxDQUFTLE9BQVQsQ0FBaUIsRUFBQyxtQkFBaUIsS0FBSyxNQUFMLEVBQW5DLENBQVAsQ0FGTzs7Ozs0QkFLRCxVQUFTO0FBQ2YsdUJBQWUsS0FBSyxNQUFMLGtCQUF3QixLQUFLLFNBQUwsQ0FBZSxRQUFmLENBQXZDLEVBRGU7QUFFZixhQUFPLEtBQUssR0FBTCxDQUFTLE9BQVQsQ0FBaUI7QUFDdEIsMkJBQWlCLEtBQUssTUFBTDtBQUNqQixnQkFBUSxLQUFSO0FBQ0EsY0FBTSxRQUFOO09BSEssQ0FBUCxDQUZlOzs7OzZCQVNSLFVBQVM7QUFDaEIsdUJBQWUsS0FBSyxNQUFMLG1CQUF5QixLQUFLLFNBQUwsQ0FBZSxRQUFmLENBQXhDLEVBRGdCO0FBRWhCLGFBQU8sS0FBSyxHQUFMLENBQVMsT0FBVCxDQUFpQjtBQUN0QiwyQkFBaUIsS0FBSyxNQUFMLFdBQWpCO0FBQ0EsZ0JBQVEsS0FBUjtBQUNBLGNBQU0sUUFBTjtPQUhLLENBQVAsQ0FGZ0I7Ozs7eUJBU2Q7QUFDRixhQUFPLEtBQUssUUFBTCxDQUFjLEVBQUMsSUFBSSxJQUFKLEVBQWYsQ0FBUCxDQURFOzs7OzBCQUlDO0FBQ0gsYUFBTyxLQUFLLFFBQUwsQ0FBYyxFQUFDLElBQUksS0FBSixFQUFmLENBQVAsQ0FERzs7OztTQWxDRCIsImZpbGUiOiJsaWdodC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGRlYnVnID0gcmVxdWlyZShcImRlYnVnXCIpKFwicGhpbGlwcy1odWU6bGlnaHRcIik7XG5pbXBvcnQgSHVlIGZyb20gXCIuL3BoaWxpcHMtaHVlXCI7XG5cbkh1ZS5wcm90b3R5cGUuZ2V0TGlnaHRzID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHRoaXMucmVxdWVzdCh7cGF0aDogXCIvbGlnaHRzXCJ9KTtcbn07XG5cbkh1ZS5wcm90b3R5cGUubGlnaHQgPSBmdW5jdGlvbihudW0pe1xuICByZXR1cm4gbmV3IExpZ2h0KG51bSwgdGhpcyk7XG59O1xuXG5jbGFzcyBMaWdodHtcblxuICBjb25zdHJ1Y3RvcihudW1iZXIgPSAwLCBodWUpe1xuICAgIHRoaXMubnVtYmVyID0gbnVtYmVyO1xuICAgIHRoaXMuaHVlID0gaHVlO1xuICB9XG5cbiAgZ2V0SW5mbygpe1xuICAgIGRlYnVnKGBsaWdodCgke3RoaXMubnVtYmVyfSkgZ2V0SW5mb2ApO1xuICAgIHJldHVybiB0aGlzLmh1ZS5yZXF1ZXN0KHtwYXRoOiBgL2xpZ2h0cy8ke3RoaXMubnVtYmVyfWB9KTtcbiAgfVxuXG4gIHNldEluZm8ocHV0X2RhdGEpe1xuICAgIGRlYnVnKGBsaWdodCgke3RoaXMubnVtYmVyfSkgc2V0SW5mbyAke0pTT04uc3RyaW5naWZ5KHB1dF9kYXRhKX1gKTtcbiAgICByZXR1cm4gdGhpcy5odWUucmVxdWVzdCh7XG4gICAgICBwYXRoOiBgL2xpZ2h0cy8ke3RoaXMubnVtYmVyfWAsXG4gICAgICBtZXRob2Q6IFwicHV0XCIsXG4gICAgICBkYXRhOiBwdXRfZGF0YVxuICAgIH0pO1xuICB9XG5cbiAgc2V0U3RhdGUocHV0X2RhdGEpe1xuICAgIGRlYnVnKGBsaWdodCgke3RoaXMubnVtYmVyfSkgc2V0U3RhdGUgJHtKU09OLnN0cmluZ2lmeShwdXRfZGF0YSl9YCk7XG4gICAgcmV0dXJuIHRoaXMuaHVlLnJlcXVlc3Qoe1xuICAgICAgcGF0aDogYC9saWdodHMvJHt0aGlzLm51bWJlcn0vc3RhdGVgLFxuICAgICAgbWV0aG9kOiBcInB1dFwiLFxuICAgICAgZGF0YTogcHV0X2RhdGFcbiAgICB9KTtcbiAgfVxuXG4gIG9uKCl7XG4gICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe29uOiB0cnVlfSk7XG4gIH1cblxuICBvZmYoKXtcbiAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7b246IGZhbHNlfSk7XG4gIH1cbn1cbiJdfQ==