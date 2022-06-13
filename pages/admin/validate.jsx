import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';

const Test = (props) => {
  const [data, setData] = useState('No result');

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        style={{ width: '100%' }}
        constraints={{facingMode: { exact: "environment" }} }
      />
      <p>{data}</p>
    </>
  );
};

// main app function
export default function Main() {
    return (
      <Test/>
    );
  }
  