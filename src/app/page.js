// app/page.js or app/chat/page.js
'use client';
import AskInput from "./AskInput";
export default function HomePage() {
  return (
    <div className="mt-64">
      <div className="text-3xl w-full flex justify-center">What's on the agenda today?</div>
      <div className="mt-4 w-full flex justify-center">
        <AskInput />
      </div>
    </div>
  );
}