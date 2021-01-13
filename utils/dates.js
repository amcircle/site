import moment from 'moment';

const timePattern = 'DD.MM.YYYY HH:mm';

export default function dateSortDesc(a, b) {
  const date1 = moment(a, timePattern).toDate()
  const date2 = moment(b, timePattern).toDate()

  if (date1 > date2) return -1
  if (date1 < date2) return 1
  return 0
}

export function getYear(d) {
  return moment(d, timePattern).format('YYYY');
}

export function dateOfAccess(lang) {
  return moment().locale(lang).format('D-MMMM-YYYY');
}

export function dateForArticle(d) {
  return moment(d, timePattern).format('MM.YYYY');
}
