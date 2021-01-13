import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';

export default function rehypeLuna() {
  const externalTransformers = [
    {plugin: rehypeKatex, options: []},
    {plugin: rehypeHighlight, options: []}
  ].map( ({plugin, options}) => {
    return plugin.call(this, ...options);
  }).filter(t => !!t);

  return (tree, file) => {
    externalTransformers.forEach(t => t(tree, file));
  }
}
