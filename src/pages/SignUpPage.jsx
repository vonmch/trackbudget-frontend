// src/pages/SignUpPage.jsx (DEBUG VERSION)

import React from 'react';

function SignUpPage() {
  const handleClick = () => {
    alert("BUTTON CLICKED!");
    console.log("Button was clicked successfully.");
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Debug Test Page</h1>
      <button 
        onClick={handleClick}
        style={{
          padding: '20px', 
          fontSize: '20px', 
          backgroundColor: 'red', 
          color: 'white'
        }}
      >
        CLICK ME
      </button>
    </div>
  );
}

export default SignUpPage;