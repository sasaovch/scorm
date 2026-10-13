import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ScormProvider } from './scorm/ScormContext';
import Slide1Author from './slides/Slide1Author';
import Slide2Intro from './slides/Slide2Intro';
import Slide3FlatBuffers from './slides/Slide3FlatBuffers';
import Slide4WebTransport from './slides/Slide4WebTransport';
import Slide5ZeroAlloc from './slides/Slide5ZeroAlloc';
import Slide6Results from './slides/Slide6Results';
import Slide7Test from './slides/Slide7Test';

// HashRouter: SCORM-контент запускается из LMS или прямо из файла,
// поэтому истории по пути быть не должно — только по хешу.
export default function App() {
  return (
    <HashRouter>
      <ScormProvider>
        <main className="app">
          <Routes>
            <Route path="/" element={<Navigate to="/slide/1" replace />} />
            <Route path="/slide/1" element={<Slide1Author />} />
            <Route path="/slide/2" element={<Slide2Intro />} />
            <Route path="/slide/3" element={<Slide3FlatBuffers />} />
            <Route path="/slide/4" element={<Slide4WebTransport />} />
            <Route path="/slide/5" element={<Slide5ZeroAlloc />} />
            <Route path="/slide/6" element={<Slide6Results />} />
            <Route path="/slide/7" element={<Slide7Test />} />
            <Route path="*" element={<Navigate to="/slide/1" replace />} />
          </Routes>
        </main>
      </ScormProvider>
    </HashRouter>
  );
}
