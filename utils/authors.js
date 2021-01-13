export function makeAuthorsTitle(authors, lang, textTranslations) {
  if (Array.isArray(authors) && authors.length > 0) {
    return textTranslations['author'][lang] + (authors.length > 1 ? textTranslations['authorsPluralEnding'][lang] : '')
  }
  return textTranslations['author'][lang];
}
export function makeAuthorsString(authors, lang, textTranslations) {
  if (Array.isArray(authors) && authors.length > 0) {
    return authors.map(author => author.name[lang]).join(', ');
  }
  return '∞';
}
