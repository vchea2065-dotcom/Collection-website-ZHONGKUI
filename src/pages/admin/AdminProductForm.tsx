import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  Star,
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { Product } from '../../types';

interface AdminProductFormProps {
  initialProduct?: Product | null;
  onCancel: () => void;
  onSaved: () => void;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  initialProduct,
  onCancel,
  onSaved
}) => {
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name || '');
  const [category, setCategory] = useState(initialProduct?.category || 'Pokémon Cards');
  const [brand, setBrand] = useState(initialProduct?.brand || 'Pokémon TCG');
  const [price, setPrice] = useState<string>(initialProduct?.price?.toString() || '');
  const [discountPrice, setDiscountPrice] = useState<string>(initialProduct?.discountPrice?.toString() || '');
  const [stock, setStock] = useState<string>(initialProduct?.stock?.toString() || '1');
  const [condition, setCondition] = useState(initialProduct?.condition || 'PSA 10 Gem Mint');
  const [featured, setFeatured] = useState<boolean>(initialProduct?.featured || false);
  const [newArrival, setNewArrival] = useState<boolean>(initialProduct?.newArrival ?? true);
  const [rareCollection, setRareCollection] = useState<boolean>(initialProduct?.rareCollection || false);
  const [status, setStatus] = useState<'published' | 'draft' | 'sold_out'>(initialProduct?.status || 'published');
  const [description, setDescription] = useState(initialProduct?.description || '');

  // Images state
  const [images, setImages] = useState<string[]>(
    initialProduct?.images && initialProduct.images.length > 0
      ? initialProduct.images
      : initialProduct?.mainImage
      ? [initialProduct.mainImage]
      : []
  );
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [directImageUrl, setDirectImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Specifications state: array of { key, value }
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>(() => {
    if (initialProduct?.specifications) {
      return Object.entries(initialProduct.specifications).map(([key, value]) => ({
        key,
        value
      }));
    }
    return [
      { key: 'Grading Company', value: 'PSA' },
      { key: 'Grade', value: 'GEM MT 10' },
      { key: 'Set', value: 'Japanese Mysterious Mountains' },
      { key: 'Certification Number', value: '43875191' }
    ];
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories list
  const categoriesList = [
    'Pokémon Cards',
    'PSA Graded Cards',
    'Premium Diecast Cars',
    'INNO64',
    'LBWK',
    'Hot Wheels',
    'Gundam',
    'Anime Figures',
    'Rare Collection'
  ];

  // Presets for specifications
  const loadPresetSpecs = (type: 'pokemon' | 'diecast' | 'gundam') => {
    if (type === 'pokemon') {
      setSpecs([
        { key: 'Card Name', value: 'Charizard Holo' },
        { key: 'Set', value: 'Base Set 1st Edition' },
        { key: 'Card Number', value: '#4/102' },
        { key: 'Rarity', value: 'Holo Secret Rare' },
        { key: 'Grading Company', value: 'PSA' },
        { key: 'Grade', value: 'GEM MT 10' },
        { key: 'Certification Number', value: '98410294' },
        { key: 'Language', value: 'Japanese' }
      ]);
    } else if (type === 'diecast') {
      setSpecs([
        { key: 'Manufacturer', value: 'INNO64 / Inno Models' },
        { key: 'Car Model', value: 'Nissan Skyline GT-R R34 Nismo' },
        { key: 'Scale', value: '1:64' },
        { key: 'Material', value: 'Diecast Metal with Rubber Tires' },
        { key: 'Edition', value: 'Limited Production Run' },
        { key: 'Base Packaging', value: 'Collector Acrylic Case with Mirrored Base' }
      ]);
    } else if (type === 'gundam') {
      setSpecs([
        { key: 'Manufacturer', value: 'Bandai Spirits' },
        { key: 'Model', value: 'RX-78-2 Gundam' },
        { key: 'Scale / Grade', value: '1/60 Perfect Grade Unleashed' },
        { key: 'Special Features', value: 'LED Matrix, Metal Photo-Etched Parts' },
        { key: 'Finish', value: 'Museum Weathered Edition' }
      ]);
    }
  };

  // Handle Multer upload
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    setIsUploading(true);

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

      setImages(prev => [...prev, ...data.urls]);
    } catch (err: any) {
      setUploadError(err.message || 'Error uploading images');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add direct image URL
  const handleAddDirectUrl = () => {
    if (!directImageUrl.trim()) return;
    setImages(prev => [...prev, directImageUrl.trim()]);
    setDirectImageUrl('');
  };

  // Reorder image up/down
  const moveImage = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setImages(copy);

    if (mainImageIndex === index) {
      setMainImageIndex(target);
    } else if (mainImageIndex === target) {
      setMainImageIndex(index);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, idx) => idx !== index);
    setImages(newImages);
    if (mainImageIndex >= newImages.length) {
      setMainImageIndex(Math.max(0, newImages.length - 1));
    }
  };

  // Specifications row manipulation
  const addSpecRow = () => {
    setSpecs(prev => [...prev, { key: '', value: '' }]);
  };

  const updateSpecRow = (index: number, field: 'key' | 'value', text: string) => {
    setSpecs(prev =>
      prev.map((row, i) => (i === index ? { ...row, [field]: text } : row))
    );
  };

  const removeSpecRow = (index: number) => {
    setSpecs(prev => prev.filter((_, i) => i !== index));
  };

  // Save product to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !price || !category) {
      setFormError('Please fill in product name, category, and price.');
      return;
    }

    if (images.length === 0) {
      setFormError('Please upload or specify at least one product photograph.');
      return;
    }

    setIsSubmitting(true);

    const specsRecord: Record<string, string> = {};
    specs.forEach(s => {
      if (s.key.trim()) {
        specsRecord[s.key.trim()] = s.value.trim();
      }
    });

    const payload = {
      name,
      category,
      brand,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      stock: parseInt(stock, 10) || 1,
      condition,
      featured,
      newArrival,
      rareCollection,
      status,
      description,
      mainImage: images[mainImageIndex] || images[0],
      images,
      specifications: specsRecord
    };

    try {
      const url = isEditing ? `/api/products/${initialProduct!.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('zk_token')}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      onSaved();
    } catch (err: any) {
      setFormError(err.message || 'Error saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-[#151515]/10 pb-4">
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 text-xs font-mono text-[#858585] hover:text-[#151515]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>CANCEL & RETURN</span>
        </button>
        <h2 className="font-cinzel text-xl font-bold text-[#151515]">
          {isEditing ? `EDITING: ${initialProduct?.name}` : 'ADD NEW VAULT PRODUCT'}
        </h2>
      </div>

      {formError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Section 1: Core Details */}
        <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
          <h3 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#151515]">
            1. PRIMARY IDENTITY & CATEGORY
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[#858585] mb-1 font-medium">Product Title / Heading *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 2001 Japanese Pokémon 1st Edition Crystal Charizard Holo PSA 10"
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
              />
            </div>

            <div>
              <label className="block text-[#858585] mb-1 font-medium">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#858585] mb-1 font-medium">Brand / Guild *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Pokémon TCG, INNO64, Liberty Walk, Bandai..."
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#858585] mb-1 font-medium">Condition Certification *</label>
              <input
                type="text"
                required
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="PSA 10 Gem Mint, Brand New in Box, Mint 9..."
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Real Image Upload & Gallery Manager (PART 9) */}
        <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#151515]">
              2. PRODUCT IMAGERY SYSTEM (CLOUDINARY / LOCAL MULTER)
            </h3>
            <span className="text-[10px] font-mono text-[#858585]">
              JPG, PNG, WEBP (Max 10MB)
            </span>
          </div>

          {uploadError && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Multer Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#151515]/20 hover:border-[#B99A5B] bg-[#F7F7F5] p-6 text-center cursor-pointer transition-colors space-y-2"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFilesSelected}
              className="hidden"
            />
            <UploadCloud className="w-8 h-8 mx-auto text-[#B99A5B]" />
            <div className="text-xs font-semibold text-[#151515]">
              {isUploading ? 'Uploading to Vault Storage...' : 'Click to select pictures from your computer'}
            </div>
            <p className="text-[11px] text-[#858585]">
              Supports multi-picture selection. Files are stored and served immediately.
            </p>
          </div>

          {/* Alternative: Add Image URL / Seed Asset */}
          <div className="flex gap-2 items-center pt-1">
            <input
              type="text"
              value={directImageUrl}
              onChange={(e) => setDirectImageUrl(e.target.value)}
              placeholder="Or paste direct image URL (e.g. /assets/aistudio/screen_55416fe7.png)"
              className="flex-1 bg-[#F7F7F5] border border-[#151515]/15 p-2 text-[#151515]"
            />
            <button
              type="button"
              onClick={handleAddDirectUrl}
              className="px-4 py-2 bg-[#151515] text-white font-semibold hover:bg-[#B99A5B] transition-colors"
            >
              Add URL
            </button>
          </div>

          {/* Image Previews & Ordering */}
          {images.length > 0 && (
            <div className="pt-2 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#858585] block">
                UPLOADED IMAGES ({images.length}) · CLICK STAR TO SET PRIMARY DISPLAY IMAGE
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, idx) => {
                  const isMain = mainImageIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`relative bg-[#F7F7F5] border p-2 flex flex-col justify-between ${
                        isMain
                          ? 'border-[#B99A5B] ring-2 ring-[#B99A5B]/30'
                          : 'border-[#151515]/15'
                      }`}
                    >
                      <div className="aspect-square w-full flex items-center justify-center overflow-hidden mb-2">
                        <img
                          src={img}
                          alt={`Slot ${idx + 1}`}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#151515]/10">
                        <button
                          type="button"
                          onClick={() => setMainImageIndex(idx)}
                          className={`p-1 flex items-center gap-1 text-[10px] font-mono ${
                            isMain ? 'text-[#B99A5B] font-bold' : 'text-[#858585] hover:text-[#151515]'
                          }`}
                          title="Set as Main Cover"
                        >
                          <Star className={`w-3.5 h-3.5 ${isMain ? 'fill-current' : ''}`} />
                          <span>{isMain ? 'COVER' : 'MAKE COVER'}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveImage(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-[#858585] hover:text-[#151515] disabled:opacity-30"
                            title="Move left"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImage(idx, 'down')}
                            disabled={idx === images.length - 1}
                            className="p-1 text-[#858585] hover:text-[#151515] disabled:opacity-30"
                            title="Move right"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Remove picture"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Pricing, Stock & Flags */}
        <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
          <h3 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#151515]">
            3. PRICING, INVENTORY & VISIBILITY
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#858585] mb-1 font-medium">Regular Price (USD) *</label>
              <input
                type="number"
                step="any"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 18500"
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] font-mono focus:outline-none focus:border-[#B99A5B]"
              />
            </div>

            <div>
              <label className="block text-[#858585] mb-1 font-medium">Discount Price (USD, Optional)</label>
              <input
                type="number"
                step="any"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="e.g. 17200"
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] font-mono focus:outline-none focus:border-[#B99A5B]"
              />
            </div>

            <div>
              <label className="block text-[#858585] mb-1 font-medium">Inventory Stock Quantity *</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="1"
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] font-mono focus:outline-none focus:border-[#B99A5B]"
              />
            </div>

            <div>
              <label className="block text-[#858585] mb-1 font-medium">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-2.5 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
              >
                <option value="published">Published (Visible on store)</option>
                <option value="draft">Draft (Hidden from store)</option>
                <option value="sold_out">Sold Out / Archived</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center gap-6 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="accent-[#B99A5B] w-4 h-4"
                />
                <span className="font-medium text-[#151515]">Featured Collection</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newArrival}
                  onChange={(e) => setNewArrival(e.target.checked)}
                  className="accent-[#B99A5B] w-4 h-4"
                />
                <span className="font-medium text-[#151515]">New Arrival</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rareCollection}
                  onChange={(e) => setRareCollection(e.target.checked)}
                  className="accent-[#B99A5B] w-4 h-4"
                />
                <span className="font-medium text-[#151515]">Rare Vault Item</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Specifications Builder (PART 4 & PART 8) */}
        <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#151515]">
                4. SPECIFICATIONS SHEET BUILDER
              </h3>
              <p className="text-[11px] text-[#858585]">
                Card grading attributes (PSA / CGC), Diecast scale parameters, or Gundam technical details.
              </p>
            </div>

            {/* Template Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#858585] font-mono uppercase">TEMPLATES:</span>
              <button
                type="button"
                onClick={() => loadPresetSpecs('pokemon')}
                className="px-2 py-1 bg-[#F7F7F5] border border-[#151515]/10 hover:border-[#B99A5B] text-[10px] font-mono"
              >
                Pokémon Card
              </button>
              <button
                type="button"
                onClick={() => loadPresetSpecs('diecast')}
                className="px-2 py-1 bg-[#F7F7F5] border border-[#151515]/10 hover:border-[#B99A5B] text-[10px] font-mono"
              >
                Diecast Model
              </button>
              <button
                type="button"
                onClick={() => loadPresetSpecs('gundam')}
                className="px-2 py-1 bg-[#F7F7F5] border border-[#151515]/10 hover:border-[#B99A5B] text-[10px] font-mono"
              >
                Gundam
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {specs.map((row, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={row.key}
                  onChange={(e) => updateSpecRow(index, 'key', e.target.value)}
                  placeholder="Specification Name (e.g. Card Set, Scale, Grade)"
                  className="flex-1 bg-[#F7F7F5] border border-[#151515]/15 p-2 text-[#151515]"
                />
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) => updateSpecRow(index, 'value', e.target.value)}
                  placeholder="Value (e.g. PSA 10, 1:64, 43875191)"
                  className="flex-1 bg-[#F7F7F5] border border-[#151515]/15 p-2 text-[#151515]"
                />
                <button
                  type="button"
                  onClick={() => removeSpecRow(index)}
                  className="p-2 text-[#858585] hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSpecRow}
              className="text-xs font-semibold text-[#B99A5B] hover:underline flex items-center gap-1 pt-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Specification Field</span>
            </button>
          </div>
        </div>

        {/* Section 5: Description */}
        <div className="bg-white border border-[#151515]/10 p-6 space-y-4">
          <h3 className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#151515]">
            5. CURATORIAL DESCRIPTION & PROVENANCE
          </h3>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description of the collectible, authenticity highlights, provenance story, and preservation characteristics..."
            className="w-full bg-[#F7F7F5] border border-[#151515]/15 p-3 text-[#151515] focus:outline-none focus:border-[#B99A5B]"
          />
        </div>

        {/* Save & Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#151515]/10">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-[#151515]/20 text-xs font-semibold text-[#858585] hover:text-[#151515]"
            disabled={isSubmitting}
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-[#151515] hover:bg-[#B99A5B] text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>COMMITTING TO DATABASE...</span>
            ) : (
              <span>{isEditing ? 'SAVE PRODUCT CHANGES' : 'CREATE & PUBLISH PRODUCT'}</span>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
