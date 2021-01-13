import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import globby from 'globby';
import endsWith from 'lodash/endsWith';
import { langs, switchLang, defaultLang } from './langs';
import { links } from './menu';
import dateSortDesc from 'utils/dates';

function basicCheck({ locale, contentType, slug }) {
  if (locale && !langs.includes(locale)) return false;
  if (contentType && !links.filter(l => l.dynContent).map(l => l.text).includes(contentType)) return false;
  if (slug && slug.length > 10) return false;
  return true;
}

export function getContent({ locale, contentType, slug }) {
  const fileObj = {
    content: false,
    data: false,
    path: false,
    name: false
  };

  if (!basicCheck({ locale, contentType, slug })) return fileObj;

  const contentTopFolder = slug[0];
  const pathArray = [process.cwd(), 'content', contentType, contentTopFolder, locale, ...(slug.slice(1))];

  const fileFolder = path.join(...pathArray.slice(1));
  const fileFolderAbs = path.join(...pathArray);

  if (fs.existsSync(fileFolderAbs) && fs.lstatSync(fileFolderAbs).isDirectory()) {
    fileObj['path'] = path.join(fileFolder, 'index.mdx');
  } else {
    fileObj['path'] = fileFolder + '.mdx';
  }

  const fileAbsPath = path.join(process.cwd(), fileObj['path']);
  if (!fs.existsSync(fileAbsPath)) return fileObj;
  const { content, data } = matter(fs.readFileSync(fileAbsPath, 'utf8'));
  fileObj['content'] = content;
  fileObj['data'] = data;
  fileObj['name'] = contentTopFolder;

  return fileObj;
}

export function loadImports(from, file, type) {
  const fromFolder = path.dirname(from);
  const filePath = path.join(fromFolder, file);
  const fileAbsPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fileAbsPath)) return false;
  const content = fs.readFileSync(fileAbsPath, 'utf8')

  if (type == 'json') return JSON.parse(content);
  if (type == 'text' || type == 'txt') return content;
  if (type == 'yaml' || type == 'yml') {
    return matter('---\n' + content + '\n---')['data'];
  }
}

export async function getContentList({ locale, contentType, sub }) {
  if (!basicCheck({ locale, contentType })) return [];

  const searchPath = sub ? `/content/lectures/${sub}/${locale}/**/*.mdx` : `/content/${contentType}/**/${locale}/index.mdx`;

  const contentPaths = await globby(process.cwd() + searchPath, {expandDirectories: {extensions: ['mdx']}});

  const content = contentPaths.map((filePath) => {
    if (sub && endsWith(filePath, `${sub}/${locale}/index.mdx`)) return null;
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    const parsedPath = path.parse(filePath);
    if (sub) {
      const fileName = parsedPath.name;
      const interPath = parsedPath.dir.split(contentType+'/'+sub+'/'+locale+'/')[1];
      data['route'] = '/'+contentType+'/'+sub+'/'+(interPath ? interPath+'/' : '')+(fileName != 'index' ? fileName : '');
    } else {
      const folder = parsedPath.dir.split(`/content/${contentType}/`)[1].split('/')[0];
      data['route'] = '/'+contentType+'/'+folder;
    }
    return data;
  }).filter(c => !!c).sort((a,b) => dateSortDesc(a.published, b.published));

  return content;
}

export function findInOtherLanguage({ locale, contentType, slug }) {
  if (!basicCheck({ locale, contentType, slug })) return '/';

  const otherLang = switchLang(locale);

  console.log('otherLang', otherLang)

  if (!slug) return `${otherLang == defaultLang ? '' : '/'+otherLang}/${contentType}`;

  const contentTopFolder = slug[0];

  for (let i = 0; i < slug.length; i++) {
    const slugPart = slug.slice(1,-i);
    const pathBase = path.join(process.cwd(), 'content', contentType, contentTopFolder, otherLang, ...slugPart);
    if (fs.existsSync(pathBase + '.mdx') || fs.existsSync(path.join(pathBase, 'index.mdx'))) {
      return `${otherLang == defaultLang ? '' : '/'+otherLang}/${contentType}/${contentTopFolder}/${slugPart.join('/')}`;
    }
  }

  return `${otherLang == defaultLang ? '' : '/'+otherLang}/${contentType}`;
}
