import {StrictMode, Component, ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

class TopLevelErrorBoundary extends Component<{children: ReactNode}, {error: any}> {
  state = { error: null };
  static getDerivedStateFromError(error: any) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, background: 'red', color: 'white', minHeight: '100vh', zIndex: 999999 }}>
          <h1>SUPER FATAL CRASH:</h1>
          <pre>{this.state.error.toString()}</pre>
          <pre>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TopLevelErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TopLevelErrorBoundary>
  </StrictMode>,
);
