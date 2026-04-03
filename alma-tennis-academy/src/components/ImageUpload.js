import { useState, useRef } from 'react';

export default function ImageUpload({ currentUrl, onFileSelect }) {
  const [preview, setPreview] = useState(currentUrl || '');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-alma-green mb-1">Image</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          dragOver ? 'border-alma-lime bg-alma-lime/10' : 'border-gray-200 hover:border-alma-lime/50'
        }`}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="mx-auto max-h-40 rounded-lg object-contain" />
        ) : (
          <div className="py-4">
            <div className="text-3xl mb-2">📷</div>
            <p className="text-sm text-alma-charcoal/50">Drag & drop an image or click to browse</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
      {preview && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setPreview(''); onFileSelect(null); }}
          className="text-xs text-red-400 hover:text-red-600 mt-1"
        >
          Remove image
        </button>
      )}
    </div>
  );
}
