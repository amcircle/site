export const links = [
  {
    href: '/lectures',
    text: 'lectures',
    translation: {
      en: 'Lectures',
      ru: 'Лекции'
    },
    available: { en: true, ru: true },
    dynContent: true
  },
  {
    href: '/publications',
    text: 'publications',
    translation: {
      en: 'Publications',
      ru: 'Публикации'
    },
    available: { en: true, ru: true },
    dynContent: true
  },
  {
    href: '/guides',
    text: 'guides',
    translation: {
      en: 'Guides',
      ru: 'Пособия'
    },
    available: { en: true, ru: true },
    dynContent: true
  },
  {
    href: '/projects',
    text: 'projects',
    translation: {
      en: 'Projects',
      ru: 'Проекты'
    },
    available: { en: false, ru: true },
    dynContent: true
  },
  {
    href: '/blog',
    text: 'blog',
    translation: {
      en: 'Blog',
      ru: 'Блог'
    },
    available: { en: true, ru: true },
    dynContent: true
  },
  {
    href: '/about',
    text: 'about',
    translation: {
      en: 'About',
      ru: 'О нас'
    },
    available: { en: true, ru: true },
  },
];

export const linksTranslation = {};

links.forEach(l => {
  linksTranslation[l.text] = l.translation;
});
