import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Sparkles, UtensilsCrossed, ArrowLeft, Star, ShieldCheck, Smartphone } from 'lucide-react';

export const metadata: Metadata = {
  title: 'الصفحة الرئيسية',
  description: 'قائمة مطعم تفاعلية بتقنية الواقع المعزز وتجربة طلب سلسة.',
  openGraph: {
    title: 'Restaurant AR Platform',
    description: 'قائمة مطعم تفاعلية بتقنية الواقع المعزز وتجربة طلب سلسة.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="container-app py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary px-4 py-2 rounded-full text-sm">
              <Sparkles className="w-4 h-4 text-accent" />
              تجربة الواقع المعزز للمطاعم
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">
              اكتشف أشهى الأطباق قبل الطلب
            </h1>
            <p className="text-lg text-primary-500">
              قائمة تفاعلية بتصميم فاخر، صور عالية الجودة، وتجربة AR تجعل اختيار طبقك أسهل وأمتع.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/menu" className="btn-primary">
                استعراض القائمة
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link href="/order" className="btn-secondary">
                مراجعة الطلب
              </Link>
            </div>
            <div className="flex items-center gap-4 text-sm text-primary-400">
              <span className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" />
                مئات الأطباق المميزة
              </span>
              <span>•</span>
              <span>صور احترافية</span>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1600&auto=format&fit=crop"
                alt="طبق فاخر"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-card p-4">
              <p className="text-sm text-primary-400">تقييم الزوار</p>
              <p className="text-2xl font-bold text-primary">4.9 ★</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="container-app py-10 md:py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6">
            <Smartphone className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2">تجربة موبايل مثالية</h3>
            <p className="text-primary-500">واجهة سريعة ومتجاوبة لتجربة طلب سلسة في المطعم.</p>
          </div>
          <div className="card p-6">
            <ShieldCheck className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2">دقة البيانات</h3>
            <p className="text-primary-500">معلومات محدثة لحظيًا عن الأسعار والتوفر.</p>
          </div>
          <div className="card p-6">
            <Star className="w-8 h-8 text-accent mb-4" />
            <h3 className="text-xl font-serif font-semibold mb-2">تصميم فاخر</h3>
            <p className="text-primary-500">أسلوب بصري دافئ يعكس هوية المطعم.</p>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="container-app py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm text-accent font-medium mb-3">منيو احترافي</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">كل طبق له قصة</h2>
            <p className="text-primary-500 mb-6">
              استعرض التفاصيل قبل الطلب مع وصف شامل، مكونات، ووقت التحضير المتوقع.
            </p>
            <Link href="/menu" className="btn-primary inline-flex">
              مشاهدة المنيو الآن
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-card">
            <Image
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop"
              alt="منيو احترافي"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-app py-12">
        <div className="card p-10 bg-gradient-to-br from-primary to-primary-800 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-serif font-bold mb-2">جاهز لتجربة مختلفة؟</h3>
              <p className="text-primary-200">ابدأ الطلب واستمتع بتقنية الواقع المعزز مباشرة.</p>
            </div>
            <Link href="/menu" className="btn-primary">
              ابدأ الآن
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
