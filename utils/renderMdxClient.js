import dynamic from 'next/dynamic';
import hydrate from 'next-mdx-remote/hydrate';
import { lunaComponents } from './luna/components';
import { getCustomComponents } from './customLunaComponents';

const Plot = dynamic(
  () => import('react-plotly.js'),
  { ssr: false}
);

export function renderMdxClient({filePath, source, lang}) {

  const customComponents = getCustomComponents(filePath, lang, Plot);

  const {
    components
  } = lunaComponents({
    components: customComponents,
    //reactPlotly: Plot
  });

  const content = hydrate(source, {components});

  return content;
}
