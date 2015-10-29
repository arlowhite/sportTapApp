
function monkeyPatch () {
  var momentDateParseFormats = ['MMM-DD-YYYY', 'dddd, MMMM Do'];
  angular.module('material.components.datepicker')
  /**
   * Override mdDatepicker to use moment's isValid so that
   * bad dates such as "Oct 44" are marked invalid.
   *
   */
    .run(function (mdDatepickerDirective) {
      var ctrlProto = mdDatepickerDirective[0].controller.prototype;
      var INVALID_CLASS = 'md-datepicker-invalid';
      ctrlProto.handleInputEvent = function () {
        var inputString = this.inputElement.value;
        var momentDate = moment(inputString, momentDateParseFormats);
        var parsedDate = momentDate.toDate();
        this.dateUtil.setDateTimeToMidnight(parsedDate);

        if (inputString === '') {
          this.ngModelCtrl.$setViewValue(null);
          this.date = null;
          this.inputContainer.classList.remove(INVALID_CLASS);
        } else if (momentDate.isValid() &&
          this.dateUtil.isDateWithinRange(parsedDate, this.minDate, this.maxDate)) {
          this.ngModelCtrl.$setViewValue(parsedDate);
          this.date = parsedDate;
          this.inputContainer.classList.remove(INVALID_CLASS);

          this._needsRenderOnBlur = this.isFocused;
          if (!this.isFocused) {
            // Debounced after blur, Render now
            this.inputElement.value = this.dateLocale.formatDate(this.date);
            this.resizeInputElement();
          }
        } else {
          // If there's an input string, it's an invalid date.
          this.inputContainer.classList.toggle(INVALID_CLASS, inputString);
          this._needsRenderOnBlur = false;
        }
      };
      ctrlProto.setFocused = function (isFocused) {
        this.isFocused = isFocused;
        if (!isFocused && this._needsRenderOnBlur) {
          // Blur
          this.inputElement.value = this.dateLocale.formatDate(this.date);
          this.resizeInputElement();
          this._needsRenderOnBlur = false;
        }
      };
    });
}

export default monkeyPatch;
