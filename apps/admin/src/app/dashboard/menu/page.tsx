'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  isAvailable: boolean;
  hasArModel: boolean;
  category: { id?: string; name: string; nameAr: string } | null;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  nameAr: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function MenuPage() {
  const router = useRouter();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');

  const fetchItems = () => {
    setLoading(true);
    fetch(`/api/admin/menu?page=${page}&limit=10`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setItems(data.data || []);
        setMeta(data.meta || null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data.data || []))
      .catch(() => setCategories([]));
  }, [page]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.nameAr.includes(search);
      const matchesAvailability =
        availability === 'all' ||
        (availability === 'available' && item.isAvailable) ||
        (availability === 'unavailable' && !item.isAvailable);
      const matchesCategory =
        !categoryFilter || item.category?.id === categoryFilter;
      return matchesSearch && matchesAvailability && matchesCategory;
    });
  }, [items, search, availability, categoryFilter]);

  const handleQuickSave = async (item: MenuItem) => {
    setSaving(item.id);
    try {
      const payload = {
        name: item.name,
        nameAr: item.nameAr,
        price: item.price,
        categoryId: item.category?.id || null,
        isAvailable: item.isAvailable,
      };
      const res = await fetch(`/api/admin/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      alert(`فشل الحفظ: ${message}`);
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return;
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      alert(`فشل الحذف: ${message}`);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <header className="admin-header">
        <div>
          <h1 className="admin-section-title">إدارة المنيو</h1>
          <p className="helper-text">تحكم سريع بالأسعار، التصنيفات، وحالة التوفر.</p>
        </div>
        <div className="admin-toolbar">
          <Link href="/dashboard/menu/new" className="btn btn-primary">+ إضافة عنصر</Link>
          <Link href="/dashboard" className="btn btn-outline">العودة للوحة التحكم</Link>
        </div>
      </header>

      <div className="admin-card" style={{ marginBottom: 16 }}>
        <div className="admin-toolbar">
          <input className="input" placeholder="بحث عن عنصر..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={availability} onChange={(e) => setAvailability(e.target.value)}>
            <option value="all">كل الحالات</option>
            <option value="available">متاح</option>
            <option value="unavailable">غير متاح</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">كل التصنيفات</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="admin-card">جارِ التحميل...</div>}
      {error && <div className="admin-card">خطأ: {error}</div>}

      {!loading && !error && (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>الاسم</th>
                <th>Name</th>
                <th>التصنيف</th>
                <th>السعر</th>
                <th>التوفر</th>
                <th>AR</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 20 }}>لا توجد عناصر</td></tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td><input className="input" value={item.nameAr} onChange={(e) => setItems((prev) => prev.map((row) => row.id === item.id ? { ...row, nameAr: e.target.value } : row))} /></td>
                    <td><input className="input" value={item.name} onChange={(e) => setItems((prev) => prev.map((row) => row.id === item.id ? { ...row, name: e.target.value } : row))} /></td>
                    <td>
                      <select value={item.category?.id || ''} onChange={(e) => {
                        const selected = categories.find((cat) => cat.id === e.target.value) || null;
                        setItems((prev) => prev.map((row) => row.id === item.id ? { ...row, category: selected } : row));
                      }}>
                        <option value="">— بدون تصنيف —</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className="input"
                        type="number"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => setItems((prev) => prev.map((row) => row.id === item.id ? { ...row, price: Number(e.target.value) } : row))}
                      />
                    </td>
                    <td>
                      <select value={item.isAvailable ? 'yes' : 'no'} onChange={(e) => setItems((prev) => prev.map((row) => row.id === item.id ? { ...row, isAvailable: e.target.value === 'yes' } : row))}>
                        <option value="yes">متاح</option>
                        <option value="no">غير متاح</option>
                      </select>
                    </td>
                    <td>{item.hasArModel ? <span className="badge badge-info">AR</span> : '—'}</td>
                    <td style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-secondary" onClick={() => handleQuickSave(item)} disabled={saving === item.id}>
                        {saving === item.id ? '...' : 'حفظ سريع'}
                      </button>
                      <button className="btn btn-outline" onClick={() => router.push(`/dashboard/menu/${item.id}/edit`)}>
                        تعديل كامل
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(item.id, item.nameAr)} disabled={saving === item.id}>
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {meta && meta.pages > 1 && (
            <div className="admin-toolbar" style={{ justifyContent: 'center', marginTop: 16 }}>
              <button className="btn btn-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>السابق</button>
              <span className="helper-text">صفحة {meta.page} من {meta.pages}</span>
              <button className="btn btn-secondary" disabled={page >= meta.pages} onClick={() => setPage(page + 1)}>التالي</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
