import Link from 'next/link';

export function ExternalLink(props) {
  console.log(props.author)
  if (props.author.link) return <a href={props.author.link} target='_blank'>{props.children}</a>;
  return <>{props.children}</>;
}

export function makeAuthorsLinks(authors, lang) {
  if (Array.isArray(authors) && authors.length > 0) {
    return (
      <span>
        {authors.map((author, i) => (
          author.isMember ?
            <span key={author.nickname}>
              <Link href={`/about/${author.nickname}`}>
                <a>{author.name[lang]}</a>
              </Link>
              {i < authors.length-1 ? ', ' : ''}
            </span>
          : (
            <span key={author.nickname}>
              <ExternalLink author={author}>
                {author.name[lang]}
                {author.extra ? ` (${author.extra})` : ''}
              </ExternalLink>
              {i < authors.length-1 ? ', ' : ''}
            </span>
          )
        ))}
      </span>
    );
  }
  return '∞';
}

export function makeAuthorsAvatars(authors, lang) {
  const AvatarImage = props => (
    <img
      key={props.author.nickname + '-' + props.i}
      src={`/team-avatars/${props.author.avatar}`}
      alt={props.author.name[lang]}
      style={{width: '50px', height: '50px', cursor: 'pointer'}}
      className='rounded-circle my-3 mx-3' />
  );

  return (
    <div className='text-center'>
      {authors ? authors.map((author, i) =>
        (author.isMember ?
          <LangLink href={`/about/${author.nickname}`} lang={lang} key={author.nickname}>
            <a><AvatarImage author={author} i={i} /></a>
          </LangLink>
        : <ExternalLink author={author} key={author.nickname}>
            <AvatarImage author={author} i={i} />
          </ExternalLink>
        )
      ):''}
    </div>
  );
}

const ArticleHead = props => {
  const authorsLinks = makeAuthorsLinks(props.authors, props.lang);
  const avatars = makeAuthorsAvatars(props.authors, props.lang);

  return (
    <>
      <h1 className='font-weight-bolder text-center'>{props.title}</h1>
      <small className='d-block text-center mt-3'>
        {props.date ? <>{props.date} <br /></> : ''}
        {props.authorsTitle}: {authorsLinks}
      </small>
      {avatars}
    </>
  );
}

export default ArticleHead;
