import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import withTranslate from 'components/hocs/withTranslate';

const textTranslations = {
  search: {
    en: 'Search',
    ru: 'Поиск'
  }
}

export const initialState = {searchActive: false, searchResults: [], loading: false};

export function reducer(state, action) {
  switch (action.type) {
    case 'search':
      return {
        searchActive: action.isOn,
        loading: !action.data,
        searchResults: action.data ? action.data : state.searchResults
      };
    default:
      throw new Error();
  }
}

function fetcher(url) {
  return fetch(url).then(r => r.json());
}

export const SearchInput = withTranslate(props => {
  const searchType = props.type;
  const lang = props.lang;
  const router = useRouter();
  const query = router.query;
  const { data, error, isValidating } = useSWR(() => query.q ? `/api/search?s=${query.q}&lang=${lang}&type=${searchType}` : null, fetcher);

  function search(q) {
    // router.push({
    //   pathname: router.pathname,
    //   query: q ? {q} : null
    // });
  }

  useEffect(() => {
    if (props.searchCallback) props.searchCallback({
      query: query.q,
      data: data && !data.error ? data : undefined,
      isOn: query.q && query.q.length > 0
    });
  }, [query.q, data]);

  return (
    <div>
      <input
        className='form-control'
        type='text'
        value={query.q ? query.q : ''}
        placeholder={props.texts['search']}
        onChange={(e) => search(e.target.value)} />
        <span className="form-control-clear glyphicon glyphicon-remove form-control-feedback"></span>
    </div>
  );
}, textTranslations);
