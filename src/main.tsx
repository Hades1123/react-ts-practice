import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from './layout.tsx'
import './styles/style.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Layout />
  </StrictMode>,
)
