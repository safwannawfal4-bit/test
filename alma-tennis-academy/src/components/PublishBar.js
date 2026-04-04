import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePageContent } from '../context/PageContentContext';

export default function PublishBar() {
  const { isAdmin } = useAuth();
  const { hasChanges, publishing, publishAll, discardChanges } = usePageContent();
  const [result, setResult] = useState(null);

  if (!isAdmin || !hasChanges) return null;

  const handlePublish = async () => {
    const res = await publishAll();
    if (res.success) {
      setResult('published');
      setTimeout(() => setResult(null), 3000);
    } else {
      setResult('error');
      alert('Failed to publish: ' + res.error);
      setTimeout(() => setResult(null), 3000);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
      <div className="pointer-events-auto mb-6 bg-alma-green text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 animate-[slideUp_0.3s_ease-out]"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium">You have unpublished changes</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={discardChanges}
            disabled={publishing}
            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white border border-white/30 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50"
          >
            Discard
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="px-6 py-2 text-sm font-bold bg-white text-alma-green rounded-xl hover:bg-alma-lime transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {publishing ? (
              <>
                <span className="w-4 h-4 border-2 border-alma-green/30 border-t-alma-green rounded-full animate-spin" />
                Publishing...
              </>
            ) : result === 'published' ? (
              <>✓ Published!</>
            ) : (
              <>Save & Publish</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
