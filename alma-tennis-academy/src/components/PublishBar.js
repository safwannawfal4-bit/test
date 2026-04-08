import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePageContent } from '../context/PageContentContext';

export default function PublishBar() {
  const { isAdmin } = useAuth();
  const { hasChanges, publishing, publishError, setPublishError, publishAll, discardChanges } = usePageContent();
  const [success, setSuccess] = useState(false);

  if (!isAdmin) return null;
  if (!hasChanges && !publishError && !success) return null;

  const handlePublish = async () => {
    const res = await publishAll();
    if (res.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none">
      <div className="flex flex-col items-center gap-2 mb-6">

        {/* Warning: saved locally but not to Firestore */}
        {publishError && (
          <div className="pointer-events-auto bg-yellow-500 text-white rounded-2xl shadow-2xl px-6 py-4 max-w-lg text-center"
            style={{ boxShadow: '0 8px 32px rgba(200,150,0,0.4)' }}>
            <p className="text-sm font-bold mb-1">⚠️ Saved locally only</p>
            <p className="text-xs text-white/90 mb-2">{publishError}</p>
            <p className="text-xs text-white/70 mb-2">Your changes are saved on THIS device. To make them visible to all visitors, fix your Firestore database rules:</p>
            <a href="https://console.firebase.google.com/project/alma-tennis-academy/firestore/rules" target="_blank" rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-white text-yellow-700 rounded-lg text-xs font-bold hover:bg-yellow-50 transition-colors mb-2">
              Open Firestore Rules →
            </a>
            <button onClick={() => setPublishError('')} className="block mx-auto text-xs text-white/60 hover:text-white mt-1">Dismiss</button>
          </div>
        )}

        {/* Unpublished changes */}
        {hasChanges && !publishError && (
          <div className="pointer-events-auto bg-alma-green text-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 animate-[slideUp_0.3s_ease-out]"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Unpublished changes</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={discardChanges} disabled={publishing}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white border border-white/30 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50">
                Discard
              </button>
              <button onClick={handlePublish} disabled={publishing}
                className="px-6 py-2 text-sm font-bold bg-white text-alma-green rounded-xl hover:bg-alma-lime transition-all disabled:opacity-50 flex items-center gap-2">
                {publishing ? (
                  <><span className="w-4 h-4 border-2 border-alma-green/30 border-t-alma-green rounded-full animate-spin" /> Saving...</>
                ) : 'Save & Publish'}
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {success && !hasChanges && !publishError && (
          <div className="pointer-events-auto bg-green-600 text-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-2 animate-[slideUp_0.3s_ease-out]">
            <span className="text-lg">✅</span>
            <span className="text-sm font-semibold">Changes saved and published!</span>
          </div>
        )}
      </div>
    </div>
  );
}
