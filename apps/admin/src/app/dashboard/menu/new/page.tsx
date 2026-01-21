'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Category {
  id: string;
  name: string;
  nameAr: string;
}

export default function NewMenuItemPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    preparationTime: '',
    categoryId: '',
    isAvailable: true,
    hasArModel: false,
    arModelUrl: '',
    arModelUrlIos: '',
    arModelUrlAndroid: '',
    arThumbnail: '',
  });

  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleArImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('يرجى اختيار ملف صورة صالح لتوليد صورة AR.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة كبير جدًا. الحد الأقصى 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        arThumbnail: typeof reader.result === 'string' ? reader.result : '',
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (
        formData.hasArModel &&
        !formData.arModelUrl.trim() &&
        !formData.arModelUrlIos.trim() &&
        !formData.arModelUrlAndroid.trim()
      ) {
        throw new Error('يرجى إضافة رابط نموذج AR واحد على الأقل قبل التفعيل.');
      }

      const payload = {
        name: formData.name,
        nameAr: formData.nameAr,
        description: formData.description || undefined,
        descriptionAr: formData.descriptionAr || undefined,
        price: parseFloat(formData.price),
        preparationTime: formData.preparationTime ? parseInt(formData.preparationTime, 10) : undefined,
        categoryId: formData.categoryId || undefined,
        isAvailable: formData.isAvailable,
        hasArModel: formData.hasArModel,
        arModelUrl: formData.arModelUrl.trim() || undefined,
        arModelUrlIos: formData.arModelUrlIos.trim() || undefined,
        arModelUrlAndroid: formData.arModelUrlAndroid.trim() || undefined,
        arThumbnail: formData.arThumbnail || undefined,
      };

      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle validation errors
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.join('\n'));
        }
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      // Success - redirect to menu list
      router.push('/dashboard/menu');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="admin-header">
        <div>
          <h1 className="admin-section-title">إضافة عنصر جديد</h1>
          <p className="helper-text">أضف طبق جديد مع تفاصيل كاملة ودقيقة.</p>
        </div>
        <Link href="/dashboard/menu" className="btn btn-outline">العودة للقائمة</Link>
      </header>

      {error && (
        <div className="admin-card" style={{ border: '1px solid #fee2e2', color: '#b91c1c' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card" style={{ marginTop: 16, display: 'grid', gap: 16 }}>
        <div className="panel-grid">
          <div>
            <label className="helper-text">الاسم بالعربي *</label>
            <input className="input" name="nameAr" value={formData.nameAr} onChange={handleChange} required placeholder="برجر لحم" />
          </div>
          <div>
            <label className="helper-text">Name (English) *</label>
            <input className="input" name="name" value={formData.name} onChange={handleChange} required placeholder="Beef Burger" />
          </div>
        </div>

        <div>
          <label className="helper-text">الوصف بالعربي</label>
          <textarea className="input" name="descriptionAr" value={formData.descriptionAr} onChange={handleChange} rows={3} placeholder="برجر لحم طازج مع الجبن..." />
        </div>

        <div>
          <label className="helper-text">Description (English)</label>
          <textarea className="input" name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Fresh beef burger with cheese..." />
        </div>

        <div className="panel-grid">
          <div>
            <label className="helper-text">السعر (ر.س) *</label>
            <input className="input" type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" placeholder="25.00" />
          </div>
          <div>
            <label className="helper-text">وقت التحضير (دقائق)</label>
            <input className="input" type="number" name="preparationTime" value={formData.preparationTime} onChange={handleChange} min="1" placeholder="15" />
          </div>
        </div>

        <div>
          <label className="helper-text">التصنيف</label>
          <select className="input" name="categoryId" value={formData.categoryId} onChange={handleChange}>
            <option value="">— بدون تصنيف —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nameAr} ({cat.name})
              </option>
            ))}
          </select>
        </div>

        <label className="helper-text" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
          متاح للطلب
        </label>

        <div className="admin-card" style={{ border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: 8 }}>إعدادات الواقع المعزز (AR)</h3>
          <p className="helper-text" style={{ marginBottom: 12 }}>
            أضف صورة مرجعية للمنتج وروابط النماذج ثلاثية الأبعاد لتفعيل تجربة الواقع المعزز.
          </p>

          <label className="helper-text" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <input type="checkbox" name="hasArModel" checked={formData.hasArModel} onChange={handleChange} />
            تفعيل نموذج AR لهذا المنتج
          </label>

          <div className="panel-grid" style={{ marginBottom: 12 }}>
            <div>
              <label className="helper-text">AR Model URL (عام)</label>
              <input
                className="input"
                name="arModelUrl"
                value={formData.arModelUrl}
                onChange={handleChange}
                placeholder="https://cdn.example.com/models/burger.glb"
              />
            </div>
            <div>
              <label className="helper-text">AR Model URL (iOS - USDZ)</label>
              <input
                className="input"
                name="arModelUrlIos"
                value={formData.arModelUrlIos}
                onChange={handleChange}
                placeholder="https://cdn.example.com/models/burger.usdz"
              />
            </div>
            <div>
              <label className="helper-text">AR Model URL (Android - GLB)</label>
              <input
                className="input"
                name="arModelUrlAndroid"
                value={formData.arModelUrlAndroid}
                onChange={handleChange}
                placeholder="https://cdn.example.com/models/burger.glb"
              />
            </div>
          </div>

          <div>
            <label className="helper-text">صورة المنتج المرجعية (تصوير/رفع)</label>
            <input
              className="input"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleArImageChange}
            />
            {formData.arThumbnail && (
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <img
                  src={formData.arThumbnail}
                  alt="AR Thumbnail"
                  style={{ width: 96, height: 96, borderRadius: 12, objectFit: 'cover' }}
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setFormData((prev) => ({ ...prev, arThumbnail: '' }))}
                >
                  إزالة الصورة
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="admin-toolbar" style={{ justifyContent: 'flex-end' }}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'جارِ الحفظ...' : 'حفظ العنصر'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => router.push('/dashboard/menu')}>
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
