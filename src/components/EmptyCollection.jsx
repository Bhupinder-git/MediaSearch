import { Link } from 'react-router-dom';

// EmptyCollection — Shown when collection has no items
export default function EmptyCollection() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-text-muted mb-4">
        <span className="material-symbols-outlined text-[32px]">folder_open</span>
      </div>
      <h2 className="text-[20px] leading-7 tracking-[-0.01em] font-medium text-text-primary">
        Your collection is empty
      </h2>
      <p className="text-[14px] leading-[20px] text-text-secondary mt-2 mb-6">
        Explore photographs, videos, and motion studies to curate your personal archive.
      </p>
      <Link
        to="/search"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-lg text-[13px] leading-[16px] font-medium hover:bg-primary-container transition-colors shadow-sm"
      >
        <span className="material-symbols-outlined text-[18px]">search</span>
        <span>Start Exploring Media</span>
      </Link>
    </div>
  );
}
