function handlePrint() {
  window.print();
}

const PrintButton = props => {
  return (
    <h5 className='d-inline print-button' onClick={handlePrint}>
      🖨 <small className='text-muted'>PDF</small>
      <style jsx>{`
        .print-button {
          cursor: pointer;
        }
      `}</style>
    </h5>
  );
}

export default PrintButton;
