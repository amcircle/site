import Head from 'next/head';
import Page from 'components/layout/PageWithMath';

import withLang from 'components/hocs/withLang';
import withTranslate from 'components/hocs/withTranslate';

import Link from 'next/link';
import ContentGrid from 'components/blocks/ContentGrid';
import { makeAuthorsLinks } from 'components/blocks/ArticleHead';
import { makeAuthorsString, makeAuthorsTitle } from 'utils/authors';

import { getContent, getContentList, findInOtherLanguage } from 'cms/content';
import { renderMdxServer } from 'utils/renderMdxServer';
import { renderMdxClient } from 'utils/renderMdxClient';

import LunaPage from 'components/layout/LunaPage';

const textTranslations = {
  pageName: {
    en: 'Lectures',
    ru: 'Лекции'
  },
  author: {
    en: 'Lecturer',
    ru: 'Лектор'
  },
  abstract: {
    en: 'Abstract',
    ru: 'Аннотация'
  },
  keywords: {
    en: 'Keywords',
    ru: 'Ключевые слова'
  },
  authorsPluralEnding: {
    en: 's',
    ru: 'ы'
  },
  readMore: {
    en: 'Open',
    ru: 'Открыть'
  }
};

const contentType = 'lectures';

function Lectures(props) {
  const { filePath, source, lang, contentList, texts } = props;

  const content = renderMdxClient({filePath, source, lang});

  return (
    <LunaPage {...props} contentType={contentType} textTranslations={textTranslations} content={content} afterContent={
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
    } />
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking' // See the "fallback" section below
  };
}

export async function getStaticProps(context) {

  const contextParams = {
     locale: context.locale,
     slug: context.params.slug,
     contentType
  };

  const { content, data, path: filePath, name: sub } = getContent(contextParams);

  if (!content) return { notFound: true };

  const isSubOpened = contextParams.slug.length > 1;
  const contentTitle = isSubOpened ? getContent({contentType, locale: context.locale, slug: [contextParams.slug[0]]}).data['title'] : null;

  const { mdxSource, meta } = await renderMdxServer({filePath, data, content, lang: context.locale});

  const otherLangLink = findInOtherLanguage(contextParams);

  const contentList = await getContentList({sub,...contextParams});

  return {
    props: {
      source: mdxSource,
      meta,
      otherLangLink,
      filePath,
      contentList,
      isSubOpened,
      sub,
      contentTitle
    },
  }
}

export default withLang(withTranslate(Lectures, textTranslations));
