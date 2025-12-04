import React, { useState } from 'react';
import { 
  Wand2, 
  Download, 
  Maximize2, 
  Settings2, 
  Image as ImageIcon,
  Loader2,
  Trash2,
  Share2
} from 'lucide-react';
import { AspectRatio, ImageSize, GeneratedImage } from '../types';
import { generateImage } from '../services/geminiService';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('Buatkan saya iklan judi slot NEPTUNUSTOTO dengan tampilan warna hijau dan elegan');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gallery, setGallery] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const urls = await generateImage(prompt, aspectRatio, imageSize);
      
      const newImages: GeneratedImage[] = urls.map(url => ({
        id: crypto.randomUUID(),
        url,
        prompt,
        aspectRatio,
        size: imageSize,
        createdAt: Date.now(),
      }));

      setGallery(prev => [...newImages, ...prev]);
      // Automatically select the first new image
      if (newImages.length > 0) {
        setSelectedImage(newImages[0]);
      }
    } catch (error) {
      console.error("Generation failed", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imageUrl: string, id: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `nano-banana-pro-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string) => {
    setGallery(prev => prev.filter(img => img.id !== id));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
  };

  return (
    <div className="flex h-screen bg-emerald-950 text-emerald-50 overflow-hidden font-sans">
      {/* Sidebar Settings */}
      <aside className="w-80 border-r border-emerald-800/50 bg-emerald-900/20 backdrop-blur-md flex flex-col z-10">
        <div className="p-6 border-b border-emerald-800/50">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <Wand2 size={24} />
            <h1 className="text-xl font-bold tracking-tight text-white">Nano Studio</h1>
          </div>
          <p className="text-xs text-emerald-400/60 font-mono">gemini-3-pro-image-preview</p>
        </div>

        <div className="p-6 space-y-8 flex-1 overflow-y-auto">
          {/* Size Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-emerald-200">Resolution</label>
              <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full font-mono">Pro</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setImageSize(size)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    imageSize === size
                      ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-emerald-900/40 border-emerald-800 text-emerald-300 hover:border-emerald-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-emerald-200">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {(['1:1', '3:4', '4:3', '9:16', '16:9'] as AspectRatio[]).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 border flex flex-col items-center gap-1 ${
                    aspectRatio === ratio
                      ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                      : 'bg-emerald-900/40 border-emerald-800 text-emerald-300 hover:border-emerald-600'
                  }`}
                >
                  <span className={`border border-current rounded-sm ${
                    ratio === '1:1' ? 'w-3 h-3' :
                    ratio === '16:9' ? 'w-4 h-2.5' :
                    ratio === '9:16' ? 'w-2.5 h-4' :
                    ratio === '4:3' ? 'w-4 h-3' : 'w-3 h-4'
                  }`} />
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Info / Footer */}
        <div className="p-4 border-t border-emerald-800/50 bg-emerald-900/30">
          <div className="text-xs text-emerald-500/60 text-center">
            Powered by Google Gemini
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Gallery / Preview Area */}
        <div className="flex-1 p-6 overflow-hidden relative flex flex-col">
           {gallery.length === 0 ? (
             <div className="flex-1 flex flex-col items-center justify-center text-emerald-500/30">
               <ImageIcon size={64} className="mb-4 opacity-50" />
               <p className="text-lg font-medium">Ready to create masterpieces</p>
               <p className="text-sm">Configure your settings and describe your vision</p>
             </div>
           ) : (
             <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Main Preview */}
                <div className="flex-1 bg-emerald-900/20 rounded-2xl border border-emerald-500/10 flex items-center justify-center p-4 relative group">
                  {selectedImage ? (
                    <>
                      <img 
                        src={selectedImage.url} 
                        alt={selectedImage.prompt}
                        className="max-h-full max-w-full object-contain shadow-2xl rounded-lg"
                      />
                      <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button 
                          onClick={() => handleDownload(selectedImage.url, selectedImage.id)}
                          className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur text-white rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={20} />
                        </button>
                         <button 
                          onClick={() => handleDelete(selectedImage.id)}
                          className="p-2 bg-red-900/50 hover:bg-red-900/70 backdrop-blur text-red-200 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-md p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm">
                        <p className="line-clamp-2 text-white/90">{selectedImage.prompt}</p>
                        <div className="flex gap-4 mt-2 text-xs text-white/60">
                           <span>{selectedImage.size}</span>
                           <span>{selectedImage.aspectRatio}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-emerald-500/40">Select an image to view</div>
                  )}
                </div>

                {/* Thumbnail Strip (Vertical on desktop) */}
                <div className="w-32 flex flex-col gap-3 overflow-y-auto pr-2">
                  {gallery.map(img => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage?.id === img.id ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
             </div>
           )}
        </div>

        {/* Prompt Input Area */}
        <div className="p-6 bg-emerald-950/80 backdrop-blur-xl border-t border-emerald-800/50 z-20">
          <div className="max-w-4xl mx-auto w-full relative">
            <div className="relative group">
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500 ${isGenerating ? 'animate-pulse' : ''}`}></div>
              <div className="relative flex items-end gap-2 bg-emerald-900 rounded-xl p-2 border border-emerald-700 focus-within:border-emerald-500 transition-colors">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your imagination..."
                  className="flex-1 bg-transparent border-none text-emerald-50 placeholder-emerald-500/50 focus:ring-0 resize-none min-h-[50px] max-h-[120px] py-3 px-3 scrollbar-hide"
                  rows={2}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="mb-1 p-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isGenerating ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <span className="hidden sm:inline">Generate</span>
                      <Wand2 size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-xs text-emerald-500/60 px-2">
              <span>Press Enter to generate</span>
              <span>{prompt.length} chars</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
