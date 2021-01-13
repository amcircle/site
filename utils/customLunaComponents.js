import path from 'path';

function transformUrl(page, url) {
  const fromFolder = path.join('/', path.dirname(page));
  return path.join(fromFolder, url);
}

function createNestedList(tree) {
  if (tree && tree.children && tree.children.length > 0) {
    return (<ol>
        {tree.children.map((h, i) => (<li key={i}><a href={'#'+h.id}>{h.value}</a>{createNestedList(h)}</li>))}
      </ol>);
  } else {
    return '';
  }
};

const Bibliography = props => {
  return (
    <>
      <ol>
        {props.bibrefs.map( (ref, i) => {
          const refData = JSON.parse(ref.ref)[0];
          console.log(refData.issued['date-parts']);
          const authors = refData.author.map(a => a.family + (a.given ? ' ' + a.given : '')).join(', ');
          const refDate = refData.issued ? '(' + refData.issued['date-parts'].map(d => d.reverse().join('.')).join(', ') + ')' : '';
          return (
            <li key={i} className='mb-3'><a name={ref.anchor} />
              {refDate} <a
                target='_blank'
                href={`https://scholar.google.com/scholar?q=${encodeURI(authors+'. '+refData.title)}`}>
                  {refData.title}
              </a>
              <br/>
              <small>
                <i>{authors}</i>
              </small>
              <br/>
              <small>
                {refData['container-title']}
              </small>
            </li>
          )
        })}
      </ol>
    </>
  );
};

const mediaSpacer = 'my-5';
const mediaCaptionSpacer = 'mt-n4 mb-5';

export function getCustomComponents(filePath, label, Plot) {
  return {
    img: (props) => {
      return <div className={mediaSpacer}><img src={transformUrl(filePath, props.src)} alt={props.alt} /></div>
    },
    code: (props) => <code {...{ ...props, ...{'className': `${props.className} ${mediaSpacer}`} }} />,
    ref: ({children, id, caption, type = 'generic'}, metaData) => {
      const refIndex = metaData['refs'][type] ? metaData['refs'][type].indexOf(id) + 1 : undefined;
      const refAnchorName = refIndex ? type + refIndex + '-anchor' : '';

      if (children) {
        if ((type == 'generic' || type == 'formula') && refIndex) {
          return (
            <div>
              <div className='position-relative d-flex align-items-center' style={
                {
                  marginTop: '-1em',
                  pageBreakInside: 'avoid'
                }
              } id={refAnchorName}>
                <div className='w-100'>{children}</div>
                <div style={{
                  position: 'absolute',
                  right:'0',
                }} className='katex'>{`(${refIndex})`}</div>
              </div>
              <div className={`text-center text-muted font-italic ${mediaCaptionSpacer}`}>{caption}</div>
            </div>
          );
        } else {
          return (
            <div id={refAnchorName}>
              {children}
              <div className={`w-100 text-muted text-center font-italic ${mediaCaptionSpacer}`}>
                {}
                {label[type] ? label[type] + ' ' : ''}{refIndex ? refIndex + '.' : ''}
                {caption ? caption : ''}
              </div>
            </div>
          );
        }
      } else {
        if (!refIndex) return <mark>[ERROR, no ref found: {id} {type}]</mark>;
        const refFormatted = (type => {
          switch(type) {
            case 'image':
            case 'table':
            case 'code':
              return refIndex;
            case 'formula':
            case 'generic':
              return `(${refIndex})`;
          }
        })(type)
        return <a href={`#${refAnchorName}`} className='katex'>{refFormatted}</a>
      }
    },
    bibref: ({children, id}, metaData) => {
      const refIndex = metaData['refs']['bibref'] ? metaData['refs']['bibref'].indexOf(id) + 1 : undefined;
      if (!refIndex) return <mark>[ERROR {id} bibref]</mark>;
      const refAnchorName = 'bibref' + refIndex + '-anchor';

      return <a href={`#${refAnchorName}`} className='katex'>{`[${refIndex}]`}</a>
    },
    bibliography: (props, metaData) => {
      if (metaData['bibliography'] && metaData['bibliography'].length > 0) {
        return (
          <div className='mt-5'>
            <b>{label['bibliography']}</b>
            <Bibliography {...props} bibrefs={metaData['bibliography']} />
          </div>
        );
      } else {
        return '';
      }
    },
    plot: (props) => Plot ? <div className={`text-center ${mediaSpacer}`}><Plot {... {...props, ...{'layout': {}}} }/></div> : <></>,
    video: (props) => <div className={`text-center ${mediaSpacer}`}><video src={transformUrl(filePath, props.src)} controls poster={props.poster} loop={props.loop}>{props.children}</video></div>,
    audio: (props) => <div className={`text-center ${mediaSpacer}`}><audio src={transformUrl(filePath, props.src)} controls loop={props.loop}>{props.children}</audio></div>,
    toc: (props, metaData) => <div className='mb-5'><b>{label['tocTitle']}</b>{createNestedList(metaData['toc'])}</div>,
    h1: (props) => <h2 className='mt-5 mb-2' {...props} />,
    h2: (props) => <h2 className='mt-5 mb-2' {...props} />,
    h3: (props) => <h3 className='mt-3 mb-2' {...props} />,
    h4: (props) => <h4 className='mt-1 mb-1' {...props} />,
    h5: (props) => <h5 className='mt-1 mb-1' {...props} />,
    h6: (props) => <h6 className='mt-1 mb-1' {...props} />,
    //h2: (props) => <h4 className='mt-5 mb-1' {...props} />,
    div: (props) => {
      if (props.className && props.className.includes('math')) {
        return <div {...{ ...props, ...{'className': `${props.className} ${mediaSpacer}`} }} />;
      } else {
        return <div {...props} />;
      }
    }
  };
}
