import React, { useState, useRef } from 'react';
import { UploadCloud, Copy, Check, Trash2, Image as ImageIcon, AlertCircle } from 'lucide-react';

export const AdminImageManager: React.FC = () => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([
    '/assets/aistudio/logo_zhong_kui_2849056d.png',
    '/assets/aistudio/screen_55416fe7.png',
    '/assets/aistudio/screen_5d4c2460.png',
    '/src/assets/images/diecast_inno64_gtr_1793761649676.jpg',
    '/src/assets/images/diecast_lbwk_supercar_1793761647485.jpg',
    '/src/assets/images/gundam_pg_unleashed_1793761650084.jpg',
    '/src/assets/images/anime_resin_statue_1793761649294.jpg'
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          ...(localStorage.getItem('zk_token') ? { Authorization: `Bearer ${localStorage.getItem('zk_token')}` } : {})
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setGalleryImages(prev => [...data.urls, ...prev]);
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#151515]/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#B99A5B] block mb-1">
            ASSET REPOSITORY
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-black text-[#151515]">
            PRODUCT IMAGE MANAGER
          </h1>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#151515]/20 hover:border-[#B99A5B] bg-white p-8 text-center cursor-pointer transition-colors space-y-3"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleUpload}
          className="hidden"
        />
        <UploadCloud className="w-10 h-10 mx-auto text-[#B99A5B]" />
        <div>
          <h3 className="font-semibold text-sm text-[#151515]">
            {isUploading ? 'Uploading & Processing Image Assets...' : 'Upload High-Resolution Product Photographs'}
          </h3>
          <p className="text-xs text-[#858585] mt-1">
            Drag & drop or select files from your computer (JPG, JPEG, PNG, WEBP).
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
        <h3 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#151515]">
          STORE ASSET CATALOG ({galleryImages.length} ASSETS)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {galleryImages.map((url, idx) => (
            <div key={idx} className="bg-[#F7F7F5] border border-[#151515]/10 p-2 space-y-2 group">
              <div className="aspect-square w-full bg-white flex items-center justify-center overflow-hidden border border-[#151515]/5">
                <img src={url} alt={`Asset ${idx + 1}`} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#151515]/10">
                <span className="text-[10px] font-mono text-[#858585] truncate max-w-[120px]">
                  {url.split('/').pop()}
                </span>
                <button
                  onClick={() => handleCopy(url)}
                  className="p-1 hover:text-[#B99A5B] transition-colors flex items-center gap-1 text-[10px] font-mono"
                  title="Copy path"
                >
                  {copiedUrl === url ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-[#858585]" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
