const emoji = require('remark-emoji');
const remarkMath = require('remark-math');
const remarkSlug = require('remark-slug');
// const remarkToc = require('remark-toc');
//const rehypeSlug = require('rehype-slug');
//const rehypeToc = require('@jsdevtools/rehype-toc');
const rehypeKatex = require('rehype-katex');
const rehypeHighlight = require('rehype-highlight');
const simplePlantUML = require('@akebifiky/remark-simple-plantuml');
const remarkTypograf = require('@mavrin/remark-typograf');
const langs = require('./cms/langs.js');

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [emoji, remarkMath, simplePlantUML, remarkTypograf, remarkSlug],
    rehypePlugins: [rehypeKatex, rehypeHighlight]
  }
});

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(withMDX({
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  i18n: {
    locales: langs.langs,
    defaultLocale: langs.defaultLang,
  },
}));
