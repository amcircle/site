import Logo from '../blocks/Logo';
import Menu from './Menu';
import withTranslate from 'components/hocs/withTranslate';

const textTranslations = {
  contacts: {
    en: 'Contacts',
    ru: 'Контакты'
  },
  about: {
    en: 'About us',
    ru: 'О нас'
  },
  social: {
    en: 'Social networks',
    ru: 'Соц. сети'
  },
  shortInfo: {
    ru: 'Научный кружок прикладной математики, студенческая организация при кафедре прикладной математики РГУ нефти и газа имени И. М. Губкина.',
    en: 'Science circle of applied mathematics, a student organization at the Department of Applied Mathematics of the Gubkin Russian State University of Oil and Gas.'
  },
  licenseTitle: {
    ru: 'Лицензия',
    en: 'License'
  },
  license: {
    ru: 'Кроме случаев, где указано иное, материалы сайта доступны по лицензии ',
    en: 'Except where otherwise noted, content on this site is licensed under a '
  }
}

const Footer = withTranslate(props => {
  return(
    <div className='footer d-print-none'>
      <div className='container'>
        <div className='row'>
          <div className='col-md mr-5 py-4'>
            <h5>{props.texts['about']}</h5>
            <p>
              <small>{props.texts['shortInfo']}</small>
            </p>
            <p><small>{props.year} &copy; amcircle.science</small></p>
            <img src='/gubkin_logo.png' className='gubkin_logo' />
          </div>
          <div className='col-md mr-5 py-4'>
            <h5>{props.texts['licenseTitle']}</h5>
            <p>
              <small>
                {props.texts['license']}
                <a href='https://creativecommons.org/licenses/by/4.0/'>Creative Commons Attribution 4.0 International license</a>.
              </small>
            </p>
            <a href='https://creativecommons.org/licenses/by/4.0/'>
              <img src='/license/cc.svg' className='lic-pic' />
            </a>
          </div>
          <div className='col-md mr-5 py-4'>
            <h5>{props.texts['contacts']}</h5>
            <p><small><a href='mailto:team@amcircle.science'>team@amcircle.science</a></small></p>
            <p><small>+7 (985) 301-21-06</small></p>
            <p>
              <small>Россия, г. Москва, Ленинский проспект, 109, аудитория 1619.</small>
            </p>
          </div>
          <div className='col-md mr-5 py-4'>
            <h5>{props.texts['social']}</h5>
          </div>
        </div>
      </div>
      <style jsx>{`
        .footer {
          width: 100%;
          background-color: #212529;
          color: white;
          min-height: 200px;
        }

        .gubkin_logo {
          margin-top: 10px;
          margin-bottom: 10px;
          display: block;
          width: 100px;
        }

        .lic-pic {
          border-style: none;
        }
      `}</style>
    </div>
  );
}, textTranslations);

export default Footer;
