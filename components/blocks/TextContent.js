const TextContent = props => {
  return (
    <div className='mx-auto text-content'>
      {props.children}
      <style jsx>{`
        div.text-content :global(img) {
          max-width: 100%;
        }
        div {
          max-width: 662px !important;
        }
        div :global(p) {
          line-height: 2rem;
        }
        div :global(.math) {
          page-break-inside: avoid;
          page-break-before: avoid;
        }
      `}</style>
    </div>
  );
}

export default TextContent;
