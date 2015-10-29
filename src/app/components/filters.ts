
function momentDate() {
  return function (date: (string|Date), format: string) {
    if (!date) {
      return '';
    }
    return moment(date).format(format);
  };
}

export default momentDate;
