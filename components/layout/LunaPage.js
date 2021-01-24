import Page from 'components/layout/PageWithMath';

import Link from 'next/link';
import TextContent from 'components/blocks/TextContent';
import ArticleHead from 'components/blocks/ArticleHead';
import PrintButton from 'components/blocks/PrintButton';
import Logo from 'components/blocks/Logo';

import { makeAuthorsLinks } from 'components/blocks/ArticleHead';
import { makeAuthorsString, makeAuthorsTitle } from 'utils/authors';

const LunaPage = ({
  source,
  meta,
  lang,
  otherLangLink,
  texts,
  isSubOpened,
  sub,
  contentTitle,
  content,
  afterContent,
  contentType,
  textTranslations
}) => {
  const authorsTitle = makeAuthorsTitle(meta.authors, lang, textTranslations);
  const authorsString = makeAuthorsString(meta.authors, lang, textTranslations);
  const keywords = (meta.keywords ? meta.keywords : []).concat(authorsString.split(', '));
  const description = (meta.title ? meta.title + '; ' : '') +
    (meta.description ? meta.description + '; ' : '') +
    authorsTitle + ': ' +
    authorsString;

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
          <div className='d-print-none text-right'>
            <PrintButton />
          </div>
          {meta.description?<p className='my-2'>
            <small>
              <b>{texts['abstract']}: </b>
              {meta.description}
            </small>
          </p>:''}

          {meta.keywords?<p className='mt-2 mb-5'>
            <small>
              <b>{texts['keywords']}: </b>
              {meta.keywords.map((k,j) => <span key={j} className='badge badge-success mr-2'>{k}</span>)}
            </small>
          </p>:''}
          {content}
          {afterContent}
        </TextContent>
      </div>
    </Page>
  );
}

export default LunaPage;
