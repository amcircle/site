import Head from 'next/head';
import Page from 'components/layout/PageWithMath';

import withLang from 'components/hocs/withLang';
import withTranslate from 'components/hocs/withTranslate';

import Link from 'next/link';
import ContentGrid from 'components/blocks/ContentGrid';
import SearchBlock from 'components/blocks/SearchBlock';
import TextContent from 'components/blocks/TextContent';
import ArticleHead from 'components/blocks/ArticleHead';
import Logo from 'components/blocks/Logo';
//import dateSortDesc from 'utils/date_st';
import { makeAuthorsLinks } from 'components/blocks/ArticleHead';
import { makeAuthorsString, makeAuthorsTitle } from 'utils/authors';

import { getContent, getContentList, findInOtherLanguage } from 'cms/content';
import { renderMdxServer } from 'utils/renderMdxServer';
import { renderMdxClient } from 'utils/renderMdxClient';

const textTranslations = {
  pageName: {
    en: 'Lectures',
    ru: 'Лекции'
  },
  author: {
    en: 'Lecturer',
    ru: 'Лектор'
  },
  authorsPluralEnding: {
    en: 's',
    ru: 'ы'
  },
  readMore: {
    en: 'Open',
    ru: 'Открыть'
  },
  label: {
    image : {
      en: 'Picture',
      ru: 'Рисунок'
    },
    table: {
      en: 'Table',
      ru: 'Таблица'
    },
    code: {
      en: 'Code',
      ru: 'Листинг'
    },
    tocTitle: {
      en: 'Contents',
      ru: 'Содержимое'
    },
    bibliography: {
      en: 'Bibliography',
      ru: 'Библиография'
    },
  }
};

const contentType = 'lectures';

function Lectures({ source, meta, lang, otherLangLink, filePath, texts, contentList, isSubOpened, sub, contentTitle}) {
  const authorsTitle = makeAuthorsTitle(meta.authors, lang, textTranslations);
  const authorsString = makeAuthorsString(meta.authors, lang, textTranslations);
  const keywords = (meta.keywords ? meta.keywords : []).concat(authorsString.split(', '));
  const description = (meta.title ? meta.title + '; ' : '') +
    (meta.description ? meta.description + '; ' : '') +
    authorsTitle + ': ' +
    authorsString;

  const label = {...textTranslations.label};
  Object.keys(textTranslations.label).forEach(lKey => {
    label[lKey] = textTranslations.label[lKey][lang];
  });

  const content = renderMdxClient({filePath, source, label});

  return (
    <Page
      title={meta.title ? meta.title + ` | ${texts['pageName']}` : texts['pageName']}
      description={description}
      keywords={keywords}
      ogImage={meta.coverImage ? meta.coverImage : null}
      smallHeader={isSubOpened}
      otherLangLink={otherLangLink}>
      <h4 className='mx-auto my-5 text-center'>
        {isSubOpened ? (
          <div>
            <Logo small={true} />
            <Link href={`/${contentType}/${sub}`}>
              <a>← {contentTitle}</a>
            </Link>
          </div>
        ) : (
          <Link href={`/${contentType}`}>
            <a>← {texts['pageName']}</a>
          </Link>
        )}
      </h4>
      <div className='mb-5'>
        <ArticleHead
          title={meta.title}
          authors={meta.authors}
          lang={lang}
          authorsTitle={authorsTitle}
        />
      </div>
      <div>
        <TextContent>
          {content}
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
        </TextContent>
      </div>
    </Page>
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

  const label = {...textTranslations.label};
  Object.keys(textTranslations.label).forEach(lKey => {
    label[lKey] = textTranslations.label[lKey][contextParams.locale];
  });

  const { mdxSource, meta } = await renderMdxServer({filePath, data, content, label});

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
