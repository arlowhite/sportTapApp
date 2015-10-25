// TODO import moment?

function momentDate() {
  return function (date, format) {
    if(!date){
      return '';
    }
    return moment(date).format(format);
  }
}

export default momentDate;
