import { useReducer } from 'react';
import {
  SearchInput,
  initialState,
  reducer,
} from './SearchInput';
import SearchResults from './SearchResults';

const SearchBlock = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <div className={`row justify-content-md-center ${state.searchActive ? 'mb-3' : 'mb-5'}`}>
        <div className='col col-lg-6'>
          <SearchInput
            lang={props.lang}
            type={props.type}
            searchCallback={({isOn, data, query}) => dispatch({type:'search',isOn,data})} />
        </div>
      </div>
      {!state.searchActive ? props.children : ''}
      {state.searchActive?
        <SearchResults
          searchState={state}
          lang={props.lang}
        />
      :''}
    </>
  );
};

export default SearchBlock;
