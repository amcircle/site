import Link from 'next/link';
import { makeAuthorsLinks } from '../blocks/ArticleHead';
import withTranslate from 'components/hocs/withTranslate';

const textTranslations = {
  nothingFound: {
    en: 'Nothing found',
    ru: 'Ничего не найдено'
  }
};

function markText(meta, matches, hasToBe) {
  let markedMeta = {};
  matches.forEach(m => {
    const key = m.key.includes('.') ? m.key.split('.')[1] : m.key;
    if (hasToBe.includes(key)) {
      markedMeta[key] = [];
      m.indices.forEach((ind, i) => {
        if (i == 0 && ind[0] != 0) {
          markedMeta[key].push(<span key={'f'+i}>{meta[key].substring(0,ind[0])}</span>);
        }

        if (i > 0 && Math.abs(m.indices[i-1][1]-ind[0]) > 1) {
          markedMeta[key].push(<span key={'prev'+i}>{meta[key].substring(m.indices[i-1][1]+1,ind[0])}</span>);
        }

        markedMeta[key].push(<mark key={'mark'+i}>{meta[key].substring(ind[0],ind[1]+1)}</mark>);

        if (i == m.indices.length - 1 && ind[1] != meta[key].length - 1) {
          markedMeta[key].push(<span key={'l'+i}>{meta[key].substring(ind[1]+1)}</span>);
        }
      });
    }
  });

  hasToBe.forEach(h => {
    if (!markedMeta[h]) markedMeta[h] = meta[h];
  });

  return markedMeta;
}

const SearchResults = withTranslate(props => {
  return (
    <div>
      <div style={{width:'50px', height:'50px', textAlign:'center'}} className='mx-auto'>
        <div className={`spinner-border ${props.searchState.loading ? 'd-block' : 'd-none'}`} role='status'>
          <span className='sr-only'>Loading...</span>
        </div>
      </div>
      {props.searchState.searchResults.length>0?props.searchState.searchResults.map((r,i) => {
        const {title, description} = markText(r.item.meta,r.matches, ['title','description']);
        return (
          <div key={r.item.meta.title+i}>
            <h4>
              <Link href={r.item.route}>
                <a>{title}</a>
              </Link>
            </h4>
            {r.item.meta.date || r.item.meta.authors ?
              <div className='mb-2'>
                <small className='text-muted'>
                  {r.item.meta.date ? r.item.meta.date + ' ' : ''}
                  {r.item.meta.authors ? makeAuthorsLinks(r.item.meta.authors, props.lang) : ''}
                </small>
              </div>
            : ''}
            <span>{description}</span>
            <div className='mt-2'>
              {r.item.meta.keywords?
                r.item.meta.keywords.map((k,j) => <span key={j} className='badge badge-success mr-2'>{k}</span>)
              :''}
            </div>
            <hr/>
          </div>
        )
      }):!props.searchState.loading?<h4 className='my-3 text-center'>{props.texts['nothingFound']}</h4>:''}
      <style jsx>{`
        div :global(mark) {
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
}, textTranslations);

export default SearchResults;
