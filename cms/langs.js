const langs = ['ru', 'en'];
const defaultLang = 'ru';

function switchLang(lang) {
  return lang == langs[0] ? langs[1] : langs[0];
}

module.exports = {
  langs: langs,
  defaultLang: defaultLang,
  switchLang: switchLang
}
