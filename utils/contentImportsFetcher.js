import { loadImports } from 'cms/content';

export async function fetcher({filePath, file, type}) {
  console.log('fetcher file type', file, type);
  if (typeof file !== 'string') return file;
  if (file.includes('http')) {
    console.log('includes http')
    return fetch(file).then(r => r[type]());
  } else {
    console.log('not http')
    const importedFile = loadImports(filePath, file, type);
    return importedFile ? importedFile : false;
  }
}
