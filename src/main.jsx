import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./app/App.jsx";
import {BrowserRouter} from 'react-router-dom'
import { Search } from './Context/Search.jsx'
import { CountProvider } from "./Context/CountContext";

// import { AppContext, AppProvider } from './AppContext.jsx'


createRoot(document.getElementById('root')).render(
   <BrowserRouter>
    <StrictMode>
    
      <Search>
        
<CountProvider>
   <App />
</CountProvider>
     
      </Search>
    
    
   
  </StrictMode>,
        
        </BrowserRouter>
 
)
