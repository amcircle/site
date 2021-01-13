import Link from 'next/link';
import Image from 'next/image';
import { motion, useCycle } from 'framer-motion';
import withTranslate from 'components/hocs/withTranslate';

const textTranslations = {
  logo: {
    en: 'Science circle\n of applied mathematics',
    ru: 'Научный кружок\n прикладной математики'
  }
}

const LogoText = withTranslate(props => {
  return (
    <h3 className={`
      font-weight-lighter
      w-auto
      text-center
      ${props.forPage ? 'd-sm-none mb-5' : 'd-none d-sm-block'}
    `}>
      {props.texts['logo']}
      <style jsx>{`
        h2 {
          white-space: pre-line;
        }
      `}</style>
    </h3>
  );
}, textTranslations);

const Logo = props => {
  const [hovered, cycleHover] = useCycle(false, true)
  return (
    <div className='logo mx-auto text-center'>
      <Link href='/'>
        <motion.div onHoverStart={cycleHover} onHoverEnd={cycleHover}>
          <motion.div animate={{rotateY: hovered ? 180 : 0}} transition={{duration: 0.5}}>
            <Image
              src='/amlogo6.png'
              width={40}
              height={64}
              alt='Amcircle logo'
              layout='fixed'
              className='d-block mx-auto pt-3 pb-2' />
          </motion.div>
          {!props.small ?
            <LogoText lang={props.lang} />
          :''}
        </motion.div>
      </Link>
      <style jsx>{`
        div {
          width: ${!props.small ? '300px' : '40px'};
        }

        .logo {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default Logo;
