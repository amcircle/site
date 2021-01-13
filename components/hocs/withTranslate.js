import { langs } from 'cms/langs';

function chooseTextLang(texts, lang) {
  if (!langs.includes(lang)) throw new Error('Can\'t choose unknown language for text translation!');

  const maxRecursion = {value: 5, counter: 0};

  const r = (texts) => {
    let translated = {...texts};
    if (maxRecursion.counter >= maxRecursion.value) throw new Error('Deep translation recursion!');

    Object.keys(texts).forEach((textKey) => {
      if (Object.keys(texts[textKey]).some( k => k == lang )) {
        translated[textKey] = texts[textKey][lang];
      } else {
        maxRecursion.counter++;
        translated[textKey] = r(texts[textKey]);
        maxRecursion.counter--;
      }
    });

    return translated;
  };

  return r(texts);
}

const withTranslate = (Content, texts) => {
  return props => {
    return (
      <Content texts={chooseTextLang(texts, props.lang)} {...props} />
    );
  };
};

export default withTranslate;
