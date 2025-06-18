import { Shader } from '../types';

export const VideoCard: React.FC<{ shader: Shader }> = ({ shader }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">

      <div className="bg-black">
        <video
          key={shader.id}
          className="w-full h-auto"
          controls
          preload="metadata"
          playsInline
          autoPlay
          muted
          loop
        >
          <source src={shader.filePath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="p-4">
        <a href={shader.url} className="transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:text-blue-400 text-white block"><h3 className="text-lg font-bold truncate">{'ShaderToy link'}</h3></a>
      </div>
    </div>
  );
};
