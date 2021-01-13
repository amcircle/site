import Head from 'next/head';
import Page from 'components/layout/Page';

import withLang from 'components/hocs/withLang';
import withTranslate from 'components/hocs/withTranslate';

import Link from 'next/link';
import ContentGrid from 'components/blocks/ContentGrid';
import SearchBlock from 'components/blocks/SearchBlock';
//import dateSortDesc from 'utils/date_st';
import { makeAuthorsLinks } from 'components/blocks/ArticleHead';
import { makeAuthorsTitle } from 'utils/authors';
import { getContentList, findInOtherLanguage } from 'cms/content';

const textTranslations = {
  pageName: {
    en: 'Lectures',
    ru: 'Лекции'
  },
  description: {
    en: 'Lectures',
    ru: 'Лекции'
  },
  keywords: {
    en: ['Lectures'],
    ru: ['Лекции']
  },
  readMore: {
    en: 'Open',
    ru: 'Открыть'
  },
  author: {
    en: 'Lecturer',
    ru: 'Лектор'
  },
  authorsPluralEnding: {
    en: 's',
    ru: 'ы'
  }
};

const contentType = 'lectures';

function Lectures({ contentList, lang, otherLangLink, texts }) {
  return (
    <Page
      title={texts['pageName']}
      description={texts['description']}
      keywords={texts['keywords']}
      otherLangLink={otherLangLink}>
      <Page.Header>
        {texts['pageName']}
      </Page.Header>
      <SearchBlock lang={lang} type={contentType}>
        <ContentGrid
          content={contentList}
          highlightFirst={false}
          imageOnTop={true}
          HeaderLink={linkProps => (
            <Link href={linkProps.route}>
              <a>{linkProps.children}</a>
            </Link>
          )}
          Link={linkProps => (
            <Link href={linkProps.route}>
              <a>{texts['readMore']} →</a>
            </Link>
          )}
          Footer={footerProps => (
            <small>
              {makeAuthorsTitle(footerProps.meta.authors, lang, textTranslations)}:&nbsp;
              {makeAuthorsLinks(footerProps.meta.authors, lang, textTranslations)}
            </small>
          )}
        />
      </SearchBlock>
    </Page>
  );
}

export async function getStaticProps(context) {
  const contextParams = {
     locale: context.locale,
     contentType: 'lectures'
  };
  const otherLangLink = findInOtherLanguage(contextParams);
  const contentList = await getContentList(contextParams);

  return {
    props: {
      contentList,
      otherLangLink
    },
  }
}

export default withLang(withTranslate(Lectures, textTranslations));
