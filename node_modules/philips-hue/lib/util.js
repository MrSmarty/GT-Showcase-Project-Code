"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkResponse = checkResponse;
function checkResponse(res) {
  if (res instanceof Array) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = res[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var i = _step.value;

        if (i.error) throw new Error(JSON.stringify(i.error));
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
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztRQUFnQjtBQUFULFNBQVMsYUFBVCxDQUF1QixHQUF2QixFQUEyQjtBQUNoQyxNQUFHLGVBQWUsS0FBZixFQUFxQjs7Ozs7O0FBQ3RCLDJCQUFhLDZCQUFiLG9HQUFpQjtZQUFULGdCQUFTOztBQUNmLFlBQUcsRUFBRSxLQUFGLEVBQVMsTUFBTSxJQUFJLEtBQUosQ0FBVSxLQUFLLFNBQUwsQ0FBZSxFQUFFLEtBQUYsQ0FBekIsQ0FBTixDQUFaO09BREY7Ozs7Ozs7Ozs7Ozs7O0tBRHNCO0dBQXhCO0NBREsiLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBjaGVja1Jlc3BvbnNlKHJlcyl7XG4gIGlmKHJlcyBpbnN0YW5jZW9mIEFycmF5KXtcbiAgICBmb3IobGV0IGkgb2YgcmVzKXtcbiAgICAgIGlmKGkuZXJyb3IpIHRocm93IG5ldyBFcnJvcihKU09OLnN0cmluZ2lmeShpLmVycm9yKSk7XG4gICAgfVxuICB9XG59XG4iXX0=