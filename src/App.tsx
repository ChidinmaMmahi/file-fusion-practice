import { Route, Routes } from 'react-router-dom'
import './App.css'
import { useEffect } from "react";
import { getAllFilesFromDB } from "../src/lib";
import { useFileStore } from "../src/store";
import { DraftModification, Home, Login, Register, SourcesReview } from './pages'
import { Header, MouseGlow } from './components'
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute'

function App() {
  const setFiles = useFileStore((state) => state.setFiles);

  useEffect(() => {
    const loadFiles = async () => {
      const storedFiles = await getAllFilesFromDB();
      setFiles(storedFiles);
    };

    loadFiles();
  }, [setFiles]);

  return (
    <div className='min-h-screen w-full flex flex-col bg-base'>
      <MouseGlow />
      <Header />
      <main className="flex-1 relative">
        <Routes>
          <Route element={<PublicOnlyRoute />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<Home />} />
            <Route path='/review' element={<SourcesReview />} />
            <Route path='/draft' element={<DraftModification />} />
            <Route path='/draft/:id' element={<DraftModification />} />
          </Route>
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
              <span className="text-6xl mb-4">404</span>
              <p className="text-lg">Page not found</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App
