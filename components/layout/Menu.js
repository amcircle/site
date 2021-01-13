import Link from 'next/link';
import withTranslate from 'components/hocs/withTranslate';
import { langs, switchLang } from 'cms/langs';
import { links, linksTranslation } from 'cms/menu';

const textTranslations = {
  menu: linksTranslation,
  changeLanguage: {
    en: 'Русский',
    ru: 'English'
  }
};

const MenuLink = function({ href, active, children, localeIncluded = false }) {
  return (
    <li className="nav-item">
      <Link href={href} {...(localeIncluded ? {locale: false} : null)}>
        <a className={`nav-link ${ active ? 'active' : ''}`}>{children}</a>
      </Link>
      <style jsx>{`
        a.active {
          color: var(--primary);
          text-shadow: 0px 0px 1px var(--primary);
        }

        a {
          color: var(--gray);
        }
      `}</style>
    </li>
  );
};

const Menu = withTranslate(props => {

  const lang = props.lang;
  const activePage = props.activePage;
  const otherLang = switchLang(lang);
  const otherLangLink = props.otherLangLink;

  const activeLink = activePage ? links.find(l => activePage.includes(l.href)) : false;

  return (
    <ul className={`nav ${ props.vertical ? 'flex-column' : 'd-flex align-items-center justify-content-center'} py-2`}>
      {links.filter( l => l.available[lang]).map((l,i) => (
        <MenuLink href={l.href} active={l === activeLink} key={i}>{props.texts['menu'][l.text]}</MenuLink>
      ))}
      <MenuLink href={otherLangLink ? otherLangLink : '/'} localeIncluded={true}>
        <span className='font-weight-lighter'>{props.texts['changeLanguage']}</span>
      </MenuLink>
    </ul>
  );
}, textTranslations);

export default Menu;
