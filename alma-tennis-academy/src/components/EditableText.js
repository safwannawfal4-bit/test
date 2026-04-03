import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePageContent } from '../context/PageContentContext';

export default function EditableText({ contentKey, as: Tag = 'span', className = '', children }) {
  const { isAdmin } = useAuth();
  const { content, updateContent } = usePageContent();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  const displayText = content[contentKey] ?? children;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (!isAdmin) {
    return <Tag className={className}>{displayText}</Tag>;
  }

  if (editing) {
    const isLong = displayText.length > 80;
    return (
      <div className="relative inline-block w-full">
        {isLong ? (
          <textarea
            ref={inputRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={() => { updateContent(contentKey, value); setEditing(false); }}
            onKeyDown={e => { if (e.key === 'Escape') setEditing(false); }}
            rows={4}
            className={`${className} w-full bg-white border-2 border-alma-lime rounded-lg px-3 py-2 outline-none resize-y`}
          />
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onBlur={() => { updateContent(contentKey, value); setEditing(false); }}
            onKeyDown={e => {
              if (e.key === 'Enter') { updateContent(contentKey, value); setEditing(false); }
              if (e.key === 'Escape') setEditing(false);
            }}
            className={`${className} bg-white border-2 border-alma-lime rounded-lg px-3 py-1 outline-none w-full`}
          />
        )}
      </div>
    );
  }

  return (
    <Tag
      className={`${className} relative group/edit cursor-pointer`}
      onClick={() => { setValue(displayText); setEditing(true); }}
    >
      {displayText}
      <span className="absolute -top-2 -right-2 opacity-0 group-hover/edit:opacity-100 transition-opacity bg-alma-lime text-alma-green text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm pointer-events-none z-20">
        Edit
      </span>
      <span className="absolute inset-0 border-2 border-transparent group-hover/edit:border-alma-lime/40 rounded transition-all pointer-events-none" />
    </Tag>
  );
}
