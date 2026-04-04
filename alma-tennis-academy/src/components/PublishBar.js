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

        {/* Error */}
        {publishError && (
          <div className="pointer-events-auto bg-red-600 text-white rounded-2xl shadow-2xl px-6 py-4 max-w-lg"
            style={{ boxShadow: '0 8px 32px rgba(220,38,38,0.4)' }}>
            <p className="text-sm font-bold mb-2">❌ Failed to publish!</p>
            <p className="text-xs text-white/80 mb-3 whitespace-pre-line">{publishError}</p>
            <div className="text-xs bg-red-700 rounded-lg p-3 mb-3 space-y-1">
              <p className="font-bold">To fix this:</p>
              <p>1. Open <a href="https://console.firebase.google.com/project/alma-tennis-academy/firestore/rules" target="_blank" rel="noopener noreferrer" className="underline font-bold text-yellow-300">Firestore Rules (click here)</a></p>
              <p>2. Replace everything with:</p>
              <pre className="bg-red-800 rounded p-2 mt-1 font-mono text-[10px] whitespace-pre select-all">{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}</pre>
              <p>3. Click <strong>Publish</strong> in Firebase Console</p>
              <p>4. Come back and try <strong>Save & Publish</strong> again</p>
            </div>
            <button onClick={() => setPublishError('')}
              className="text-xs text-white/60 hover:text-white underline">Dismiss</button>
          </div>
        )}

        {/* Unpublished changes bar */}
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
                  <><span className="w-4 h-4 border-2 border-alma-green/30 border-t-alma-green rounded-full animate-spin" /> Publishing...</>
                ) : (
                  <>Save & Publish</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {success && !hasChanges && (
          <div className="pointer-events-auto bg-green-600 text-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-2 animate-[slideUp_0.3s_ease-out]">
            <span className="text-lg">✅</span>
            <span className="text-sm font-semibold">Published! All visitors can see your changes now.</span>
          </div>
        )}
      </div>
    </div>
  );
}
