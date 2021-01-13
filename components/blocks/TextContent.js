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
      `}</style>
    </div>
  );
}

export default TextContent;
