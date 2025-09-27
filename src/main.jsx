import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {App }from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { Search } from './Search.jsx'
// import { AppContext, AppProvider } from './AppContext.jsx'


createRoot(document.getElementById('root')).render(
   <BrowserRouter>
    <StrictMode>
    
      <Search>
      <App />
      </Search>
    
    
   
  </StrictMode>,
        
        </BrowserRouter>
 
)
