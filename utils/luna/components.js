/**
 * Generates luna-mdx components.
 * @param {Object} opts
 * @param {boolean} opts.components - custom components.
 * @param {boolean} opts.reactPlotly - react-plotly component.
 * @param {boolean} opts.bibliography - bibliography object.
 * @param {boolean} opts.bibFormatter - custom function (ref, Cite) which produces a text citation based on reference.
 * @param {boolean} opts.bibSort - custom citation sorting function.
 * @public
 */
function lunaComponents(opts) {
  const createNestedList = (tree) => {
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
          {props.bibrefs.map( (ref, i) => (
            <li key={i}><small><a name={ref.anchor} />{ref.ref}</small></li>
          ))}
        </ol>
      </>
    );
  };

  const Plot = opts.reactPlotly;

  const metaData = {refs: {}, headings: [], bibliography: [], toc: []};

  const userComponents = {...opts.components};

  const specComponents = {
    lunameta: ({data}, metaData) => {
      metaData['refs'] = data['refs'];
      metaData['headings'] = data['headings'];
      metaData['bibliography'] = data['bibliography'];
      metaData['toc'] = data['toc'];

      return (<></>);
    },
    print: (props) => <span>{props.value}</span>,
    row: (props) => <div className='row'>{props.children}</div>,
    col: (props) => <div className='col'>{props.children}</div>,
    bibliography: (props, metaData) => {
      if (metaData['bibliography'] && metaData['bibliography'].length > 0) {
        return (
          <div>
            <Bibliography {...props} bibrefs={metaData['bibliography']} />
          </div>
        );
      } else {
        return '';
      }
    },
    plot: (props) => Plot ? <Plot {...props}/> : <></>,
    video: (props) => <video src={props.src} controls poster={props.poster} loop={props.loop}>{props.children}</video>,
    audio: (props) => <audio src={props.src} controls loop={props.loop}>{props.children}</audio>,
    toc: (props, metaData) => <div>{createNestedList(metaData['toc'])}</div>,
    ref: ({children, id, caption, type = 'generic'}, metaData) => {
      const refIndex = metaData['refs'][type] ? metaData['refs'][type].indexOf(id) + 1 : undefined;
      if (!refIndex) return <mark>[ERROR, no ref found: {id} {type}]</mark>;
      const refAnchorName = type + refIndex + '-anchor';

      if (children) {
        if (type == 'generic' || type == 'formula') {
          return (
            <div className='' id={refAnchorName}>
              <div className=''>{children}</div>
              <div className=''>{`(${refIndex})`}</div>
              <div>{caption}</div>
            </div>
          );
        } else if (type == 'image' || type == 'table' || type == 'code') {
          return (
            <div id={refAnchorName}>
              {children}
              <div>
                {refIndex} {caption}
              </div>
            </div>
          );
        }
      } else {
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
        return <a href={`#${refAnchorName}`}>{refFormatted}</a>
      }
    },
    bibref: ({children, id}, metaData) => {
      const refIndex = metaData['refs']['bibref'] ? metaData['refs']['bibref'].indexOf(id) + 1 : undefined;
      if (!refIndex) return <mark>[ERROR {id} bibref]</mark>;
      const refAnchorName = 'bibref' + refIndex + '-anchor';

      return <a href={`#${refAnchorName}`}>{`[${refIndex}]`}</a>
    }
  };

  const componentsWithoutWrapper = {...specComponents, ...userComponents};

  const components = {};

  Object.keys(componentsWithoutWrapper).forEach(componentName => {
    components[componentName] = (props) => componentsWithoutWrapper[componentName](props, metaData);
  });

  return {
    metaData,
    components
  };
}

export { lunaComponents };
