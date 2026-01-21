'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="admin-card">
      <h2 className="admin-section-title">حدث خطأ غير متوقع</h2>
  <p className="helper-text">{error.message}</p>
      <button className="btn btn-primary" onClick={reset}>
        إعادة المحاولة
      </button>
    </div>
  );
}
