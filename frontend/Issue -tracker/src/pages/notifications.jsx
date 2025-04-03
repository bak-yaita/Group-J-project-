import React from 'react';
import { toast } from 'react-toastify';
import Wrapper from '../components/wrapper';
import { ToastContainer } from 'react-toastify';

const notify = () => {
    return (
        <Wrapper>
            {toast.success("Issue status updated successfully!", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 })}
            {toast.error("Error updating issue status!", { position: toast.POSITION.TOP_RIGHT, autoClose: 5000 })}
        </Wrapper>
    );
}


  
  
  function App() {
    return (
      <div className="App">
        <button onClick={notify}>Show Toast</button>
        <ToastContainer />
      </div>
    );
  }
  

export default App;