import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import { Upload, X } from 'lucide-react';

const originOptions = [
  { value: '', label: 'Pilih Asal Kopi' },
  { value: 'Aceh Gayo', label: 'Aceh Gayo' },
  { value: 'Toraja', label: 'Toraja' },
  { value: 'Bali Kintamani', label: 'Bali Kintamani' },
  { value: 'Flores Bajawa', label: 'Flores Bajawa' },
  { value: 'Jawa Barat', label: 'Jawa Barat' },
  { value: 'Papua Wamena', label: 'Papua Wamena' },
  { value: 'Lampung', label: 'Lampung' },
  { value: 'Bengkulu', label: 'Bengkulu' },
];

const roastOptions = [
  { value: '', label: 'Pilih Level Roasting' },
  { value: 'light', label: 'Light Roast' },
  { value: 'medium', label: 'Medium Roast' },
  { value: 'dark', label: 'Dark Roast' },
];

const ProductForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    origin: initialData?.origin || '',
    roastLevel: initialData?.roastLevel || '',
    price: initialData?.price || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData?.imageUrl || '');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      await onSubmit({
        ...formData,
        price: Number(formData.price),
        imageUrl
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nama Kopi"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Contoh: Arabica Gayo Premium"
        required
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Asal Kopi"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
          options={originOptions}
          required
        />
        <Select
          label="Level Roasting"
          name="roastLevel"
          value={formData.roastLevel}
          onChange={handleChange}
          options={roastOptions}
          required
        />
      </div>

      <Input
        label="Harga (Rp)"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        placeholder="Contoh: 150000"
        required
      />

      <Textarea
        label="Deskripsi"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Ceritakan tentang kopi ini..."
        rows={3}
        required
      />

      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Foto Produk
        </label>
        {imagePreview ? (
          <div className="relative w-full h-48 rounded-2xl overflow-hidden">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-coplace-orange/50 transition-colors">
            <Upload size={32} className="text-white/40 mb-2" />
            <span className="text-white/40 text-sm">Klik untuk upload foto</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          loading={loading || uploading}
          className="flex-1"
        >
          {initialData ? 'Update Produk' : 'Tambah Produk'}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            Batal
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;
