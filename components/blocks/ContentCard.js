function cutDescription(desc, maxLen = 300) {
  if (!desc || typeof desc !== 'string') return undefined;

  const firstText = desc.slice(0,maxLen);
  const restText = desc.slice(maxLen);
  const beforeWhitespace = restText.indexOf(' ');
  const beforeDot = restText.indexOf('.');
  const lastPosition = beforeDot < 50 ? beforeDot : beforeWhitespace;
  return firstText + restText.slice(0, lastPosition) + ' ...';
}

const ContentCard = props => {

  return(
    <div className="col mb-4" key={props.index}>
      <div className={`card h-100 ${props.highlightFirst && props.index == 0 ? 'shadow-lg' : ''}`}>
        { props.image ?
          props.HeaderLink ?
            <props.HeaderLink><img src={props.image} className={props.imageOnTop ? 'card-img-top' : 'card-img'}
              alt={props.title} /></props.HeaderLink>
          : <img src={props.image} className={props.imageOnTop ? 'card-img-top' : 'card-img'}
            alt={props.title} />
        : ''}
        <div className={props.imageOnTop ? 'card-body' : 'card-img-overlay'}>
          <h5 className="card-title">
            {props.HeaderLink ? <props.HeaderLink>{props.title}</props.HeaderLink> : props.title}
          </h5>
          {props.Special ? props.Special : ''}
          <p className="card-text">{cutDescription(props.description)}</p>
          {props.Link ? props.Link : ''}
        </div>
        {props.Footer ?
        <div className="card-footer">
          {props.Footer}
        </div>
        : ''}
      </div>
      <style jsx>{`
        img {
          /*border-style: none;*/
          transition: height 5s ease;
          min-height: 50px;
        }
      `}</style>
    </div>
  );
}

export default ContentCard;
