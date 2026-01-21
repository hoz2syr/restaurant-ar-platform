'use client';

import { ErrorMessage } from '@/components/ui';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-app py-16">
      <ErrorMessage
        message={error.message || 'حدث خطأ غير متوقع'}
        onRetry={reset}
      />
    </div>
  );
}
