'use client';
import Spline from '@splinetool/react-spline';

export default function Home() {
  return (
    <main>
        <div className="absolute inset-0 z-0 pointer-events-none">
            <Spline scene="https://prod.spline.design/62nq4ZU3Y3GYcHUI/scene.splinecode" />
        </div>
    </main>
  );
}

