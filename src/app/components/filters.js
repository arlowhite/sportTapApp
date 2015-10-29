// TODO import moment?
define(["require", "exports"], function (require, exports) {
    function momentDate() {
        return function (date, format) {
            if (!date) {
                return '';
            }
            return moment(date).format(format);
        };
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = momentDate;
});
//# sourceMappingURL=filters.js.map