
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const container = document.getElementById("root");
if (!container) throw new Error("No root element found");

createRoot(container).render(<App />);
