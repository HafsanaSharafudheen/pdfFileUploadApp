import React from 'react';
import UploadForm from '../../components/uploadForm';
import Header from '../../components/header';
import { useLocation } from 'react-router-dom';

function Home() {
    const location = useLocation();
    const { email } = location.state || {};
   
  return (
    <>
    <div>
    
        <Header  email={email}/>
    </div>
      <h1 className='text-centre'>WELCOME TO UploadMyPDF</h1>
      <p>Welcome to our platform! Upload your PDF files in just a few clicks and enjoy seamless document handling.</p>
      <UploadForm/>
    </>
  );
}

export default Home;
