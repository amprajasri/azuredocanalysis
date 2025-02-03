import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loading = () => {
  return (
    <div className="loading">
      <ClipLoader size={150} color={"#123abc"} loading={true} />
      <p>Uploading and analyzing the document, please wait...</p>
    </div>
  );
};

export default Loading;
