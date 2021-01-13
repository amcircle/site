import React, { useEffect, useRef } from 'react';
import Logo from '../blocks/Logo';
import Menu from './Menu';

const Header = props => {
  const headerDiv = useRef(null);

  const localState = {prevScrollpos: 0, topOffset: 0};

  const hideOnScroll = () => {
    let currentScrollPos = window.pageYOffset;
    let delta = localState.prevScrollpos - currentScrollPos;
    let newState = {isSticky: true};

    let headerHeight = headerDiv.current.offsetHeight * 0.5;

    if (currentScrollPos <= headerHeight) {
      localState['topOffset'] = 0;
    } else {
      if (delta < 0) {
        localState['prevScrollpos'] = currentScrollPos;
        localState['topOffset'] = -100;
      } else if (Math.abs(delta) > 30) {
        localState['prevScrollpos'] = currentScrollPos;
        localState['topOffset'] = 0;
      }
    }

    headerDiv.current.style.transform = `translateY(${localState.topOffset}%)`;
  }

  useEffect(() => {
    localState['prevScrollpos'] = window.pageYOffset;
    window.addEventListener('scroll', hideOnScroll);
    return () => window.removeEventListener('scroll', hideOnScroll);
  },[]);

  return (
    <div
    ref={headerDiv}
    className='sticky-top shadow-sm bg-white rounded d-print-none'>
      {!props.small ?
        <Logo lang={props.lang} />
      : ''}
      <Menu lang={props.lang} activePage={props.activePage} otherLangLink={props.otherLangLink} />
      <style jsx>{`
        div { transition: transform 300ms ease; }
      `}</style>
     </div>
  );
}

export default Header;
