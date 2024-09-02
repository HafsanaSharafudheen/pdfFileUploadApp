import React from 'react';
import UploadForm from '../../components/uploadForm';
import Header from '../../components/header';
import { useLocation } from 'react-router-dom';
import './home.css';
function Home() {
    const location = useLocation();
    const { email } = location.state || {};
   
  return (
    <>
    
    <div>
    
        <Header  email={email}/>
    </div>
      <div className="container text-center mt-5">
      <h1 className="display-4 mb-4">WELCOME TO UploadMyPDF</h1>
      <p className="lead mb-5">
      Welcome to our platform! Upload your PDF files in just a few clicks and enjoy seamless document handling.
      </p>
      
      <UploadForm />
      
      </div>

    </>
  );
}

export default Home;
