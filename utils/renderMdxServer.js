import renderToString from 'next-mdx-remote/render-to-string';

import { lunaComponents } from './luna/components';
import remarkLuna from './luna/remark';
import rehypeLuna from './luna/rehype';
import { fetcher } from './contentImportsFetcher';
import { getCustomComponents } from './customLunaComponents';

export async function renderMdxServer({filePath, data, content, label}) {
  const customComponents = getCustomComponents(filePath, label);
  const { components } = lunaComponents({ components: customComponents });

  const meta = {...data};
  meta['imports'] = {};

  if (data.imports) {
    Object.keys(data.imports).forEach(async (imKey) => {
      meta.imports[imKey] = await fetcher({filePath, ...data.imports[imKey]});
    });

    await Promise.all(Object.values(meta.imports));
  }

  let bibliography = [];
  if (typeof meta['bibliography'] === 'string') {
    bibliography = await fetcher({filePath, file: meta['bibliography'], type: meta['bibliography'].split('.')[1]});
    bibliography = bibliography.bibliography;
  }

  const mdxSource = await renderToString(
    content,
    {
      components,
      scope: meta,
      mdxOptions: {
        remarkPlugins: [ [remarkLuna, { bibliography }] ],
        rehypePlugins: [ rehypeLuna ]
      }
    }
  );

  return { mdxSource, meta };
}
