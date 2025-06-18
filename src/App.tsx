import { VideoCard } from './components/VideoCard'
import { videoData } from './data'

function App() {
  const days = videoData.length
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-6xl font-extrabold tracking-tight mb-2">{days} Days Shader</h1>
        </header>

        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoData.map((shader) => (
              <VideoCard key={shader.id} shader={shader} />
            ))}
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500">
          <p>Built by koji &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  )
}

export default App
