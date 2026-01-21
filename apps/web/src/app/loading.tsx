import { PageLoader } from '@/components/ui';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <PageLoader />
    </div>
  );
}
