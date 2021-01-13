import Layout from './MainLayout';
import Head from 'next/head';
import { useRouter } from 'next/router';
import withTranslate from 'components/hocs/withTranslate';
import withLang from 'components/hocs/withLang';

const textTranslations = {
  siteNameShort: {
    en: 'AMCircle',
    ru: 'НКПМ'
  },
  siteName: {
    en: 'Science circle of applied mathematics',
    ru: 'Научный кружок прикладной математики'
  },
  langCountry: {
    en: 'US',
    ru: 'RU'
  }
}

const Page = withLang(withTranslate(props => {
  const router = useRouter();
  const activePage = router.asPath == '/' ? null : router.asPath;
  const lang = props.lang ? props.lang : router.locale;
  const year = 2020;

  const siteNameShort = props.texts['siteNameShort'];
  const title = `${props.title ? props.title + ' – ' : ''}${props.texts['siteNameShort']}`;
  const siteName = props.texts['siteName'];
  const description = `${props.description ? props.description + ' | ' : ''}${siteName}`;
  const keywords = (props.keywords ? props.keywords.concat([siteNameShort]) : [siteNameShort]).join(',');
  const langLocale = `${lang}_${props.texts['langCountry']}`
  const otherLangLink = props.otherLangLink;
  return (
    <div className='h-100'>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        { props.ogImage ?
          <meta property='og:image' content={props.ogImage} />
          : '' }
        <meta property='og:type' content='website' />
        <meta property='og:locale' content={langLocale} />
        <meta property='og:site_name' content={siteName} />
        <link rel='apple-touch-icon' sizes='57x57' href='/icon/apple-icon-57x57.png' />
        <link rel='apple-touch-icon' sizes='60x60' href='/icon/apple-icon-60x60.png' />
        <link rel='apple-touch-icon' sizes='72x72' href='/icon/apple-icon-72x72.png' />
        <link rel='apple-touch-icon' sizes='76x76' href='/icon/apple-icon-76x76.png' />
        <link rel='apple-touch-icon' sizes='114x114' href='/icon/apple-icon-114x114.png' />
        <link rel='apple-touch-icon' sizes='120x120' href='/icon/apple-icon-120x120.png' />
        <link rel='apple-touch-icon' sizes='144x144' href='/icon/apple-icon-144x144.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='/icon/apple-icon-152x152.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/icon/apple-icon-180x180.png' />
        <link rel='icon' type='image/png' sizes='192x192'  href='/icon/android-icon-192x192.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/icon/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='96x96' href='/icon/favicon-96x96.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/icon/favicon-16x16.png' />
        <link rel='manifest' href='/manifest.json' />
        <meta name='msapplication-TileColor' content='#ffffff' />
        <meta name='msapplication-TileImage' content='/icon/ms-icon-144x144.png' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <Layout lang={lang} year={year} smallHeader={props.smallHeader} activePage={activePage} otherLangLink={otherLangLink}>
        {props.children}
      </Layout>
    </div>
  );
}, textTranslations));

Page.Header = props => {
  return (
    <h1 className='font-weight-bolder text-center mx-auto my-5'>
      {props.children}
    </h1>
  );
}

export default Page;
