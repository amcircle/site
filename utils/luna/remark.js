import visit from 'unist-util-visit';
import startsWith from 'lodash/startsWith';
import endsWith from 'lodash/endsWith';
import emoji from 'remark-emoji';
import remarkMath from 'remark-math';
import remarkSlug from 'remark-slug';
import simplePlantUML from '@akebifiky/remark-simple-plantuml';
import remarkTypograf from '@mavrin/remark-typograf';
import githubSlugger from 'github-slugger';
import Cite from 'citation-js';

const slugs = githubSlugger();

function findMatches(regex, str, matches = []) {
   const res = regex.exec(str);
   res && matches.push(res) && findMatches(regex, str, matches);
   return matches;
}

function getAttrs(str) {
  const attrs = findMatches(/(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/g, str);
  return attrs.reduce((acc, a) => {
    return {...(a ? {[a[1]]: a[2]} : {}), ...acc};
  }, {});
}

function addRef(refs, {id, type}) {
  if (!refs[type] || !Array.isArray(refs[type])) refs[type] = [];
  refs[type].push(id);
}

function prepareToc(headersList) {
  const headerTree = (p, header) => {
    if (header.depth > p[p.length-1].depth) {
      if (!p[p.length-1].children) p[p.length-1].children = [];
      p[p.length-1].children.push(header);
      p.push(header);
    } else {
      p.pop();
      headerTree(p, header);
    }
  };

  let toc = {children:[], depth: 0};
  let tocPointer = [toc];

  headersList.forEach(header => {
    headerTree(tocPointer, header);
  });

  console.log('toc', toc)

  return toc;
}

export function prepareBibRefs(refsList, bibliography, bibFormatter, bibSort) {
  if (
    !refsList
    || !bibliography
    || !refsList['bibref']
    || refsList['bibref'].length == 0
    || bibliography.length == 0
  ) return [];

  const processedBibliography = bibliography.map(ref => {
    const cite = bibFormatter ? bibFormatter(ref, Cite) : ((ref) => {
      const refCite = new Cite(ref.ref);
      refCite.data[0].id = ref.id;
      return refCite.format('data');
    })(ref);

    return {
      id: ref.id,
      ref: cite
    }
  });

  const bibRefs = refsList['bibref'].filter((r,i,list) => list.indexOf(r) == i);
  const existingBibRefs = bibRefs.filter(ref => processedBibliography.find(br => br.id == ref));
  existingBibRefs.sort( (a,b) => {
    const bibref_a = processedBibliography.find(br => br.id == a);
    const bibref_b = processedBibliography.find(br => br.id == b);

    if (bibSort) {
      return bibSort(bibref_a, bibref_b);
    } else {
      if (bibref_a.ref > bibref_b.ref) return 1;
      if (bibref_a.ref < bibref_b.ref) return -1;
      return 0;
    }
  });

  return existingBibRefs.map((bib,i) => (
    {
      ref: processedBibliography.find(br => br.id == bib).ref,
      anchor: 'bibref' + (i+1) + '-anchor'
    }
  ));
}

function remarkLuna({bibliography, bibFormatter, bibSort}) {
  return (tree, file) => {
    slugs.reset();

    const refs = {};
    visit(tree, 'jsx', node => {
      const jsx = node.value;

      if (startsWith(jsx, '<ref') && !endsWith(jsx, '/>')) {
        // reference
        const attrs = getAttrs(jsx);
        const id = attrs['id'];
        const type = attrs['type'] ? attrs['type'] : 'generic';
        if (id) addRef(refs, {id, type});
      } else if (startsWith(jsx, '<bibref') && endsWith(jsx, '/>')) {
        // bib reference
        const attrs = getAttrs(jsx);
        const id = attrs['id'];
        const type = 'bibref';
        if (id) addRef(refs, {id, type});
      }

    });

    const headings = [];
    visit(tree, 'heading', node => {
      const depth = node.depth;

      let headingValue = '';
      visit(node, 'text', textNode => {
        console.log('text', textNode)
        headingValue += textNode.value;
      });

      const data = node.data || (node.data = {});
      const props = data.hProperties || (data.hProperties = {});
      const elId = props.id;

      const id = elId ? slugs.slug(elId, true) : slugs.slug(headingValue);

      data.id = id;
      props.id = id;

      headings.push({id, depth, value: headingValue});
    });

    const toc = prepareToc(headings);

    const bibliographyProcessed = prepareBibRefs(refs, bibliography, bibFormatter, bibSort);

    tree.children.unshift({
      type: 'jsx',
      value: `<lunameta data={${JSON.stringify({refs, headings, toc, bibliography: bibliographyProcessed})}} />`
    });
  }
}

export default function remarkLunaCaller(...opts) {
  const externalTransformers = [
    {plugin: emoji, options: [{emoticon: true}]},
    //{plugin: remarkSlug, options: []},
    {plugin: remarkLuna, options: opts},
    {plugin: remarkMath, options: []},
    {plugin: simplePlantUML, options: []},
    {plugin: remarkTypograf, options: []},
  ].map( ({plugin, options}) => {
    return plugin.call(this, ...options);
  }).filter(t => !!t);

  return (tree, file) => {
    externalTransformers.forEach(t => t(tree, file));
  }
}
