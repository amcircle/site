import path from 'path';
import { langs, defaultLang } from './langs';
import { contentFolder } from './contentFolder';

export default function genSiteLink(currentPath, href) {
  const fileAbsPath = path.join(process.cwd(), path.dirname(currentPath), href);
  const filePath = fileAbsPath.split(contentFolder)[1];
  const lang = langs.find(l => filePath.includes(`/${l}/`));
  const fileUrlWithLang = (defaultLang == lang ? '' : `/${lang}`) + filePath.replace(`/${lang}`, '');
  return fileUrlWithLang.includes('index.mdx') ? fileUrlWithLang.replace('index.mdx', '') : fileUrlWithLang.replace('.mdx', '')
}
