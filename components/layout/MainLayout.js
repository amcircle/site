import Header from './Header';
import Footer from './Footer';

const MainLayout = props => {
  return (
    <div className='h-100 d-flex flex-column'>
      <div>
        <Header lang={props.lang} small={props.smallHeader} activePage={props.activePage} otherLangLink={props.otherLangLink}/>
        <div className='container my-5'>
          {props.children}
        </div>
      </div>
      <div className='mt-auto'>
        <Footer lang={props.lang} year={props.year}/>
      </div>
    </div>
  );
}

export default MainLayout;
