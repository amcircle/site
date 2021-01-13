import { useRouter } from 'next/router';

const withLang = (Content) => {
  return props => {
    const router = useRouter();
    const lang = router.locale;
    return (
      <Content lang={lang} {...props} />
    );
  };
};

export default withLang;
