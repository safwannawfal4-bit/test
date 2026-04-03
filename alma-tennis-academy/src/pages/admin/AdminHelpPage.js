import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useOrders } from '../../context/OrderContext';
import { useEnrollments } from '../../context/EnrollmentContext';
import { usePageContent } from '../../context/PageContentContext';

// Auto-generated knowledge base - this function scans the actual site state
// so the help chat always knows what's current without manual updates
function buildKnowledgeBase(data) {
  const { products, programs, orders, enrollments, language, theme, logoUrl, user } = data;

  return [
    {
      category: 'Getting Started',
      icon: '🚀',
      items: [
        { q: 'how do i use the admin panel', a: `Welcome to the Alma Tennis Academy admin panel! You're logged in as ${user?.name || 'Admin'}. Use the sidebar on the left to navigate between sections: Dashboard (📊), Products (🎾), Programs (📋), Orders (📦), Customers (👥), Staff & Tasks (🏢), Settings (⚙️), and this Help section (❓). Each section lets you manage a different part of your website.` },
        { q: 'what can i do here', a: 'You can: 1) Add/edit/delete products and programs with images, 2) View and manage customer orders, 3) Track customer enrollments in tennis classes, 4) Create employee accounts with custom permissions, 5) Assign tasks to employees, 6) Change the website colors, logo, and language, 7) Edit any text on the website by clicking on it when logged in, 8) View analytics and revenue data.' },
        { q: 'how do i get started', a: 'Start by: 1) Go to Settings (⚙️) to set your logo and choose your color palette, 2) Go to Products (🎾) to add your tennis equipment with images, 3) Go to Programs (📋) to add your tennis classes, 4) Visit your website and click any text to customize the wording. Everything saves automatically!' },
      ]
    },
    {
      category: 'Products',
      icon: '🎾',
      items: [
        { q: 'how do i add a product', a: 'Go to Products (🎾) in the sidebar, then click the "+ Add Product" button. Fill in the name, category, price, description, and features. You can also drag & drop an image. Click "Add Product" to save.' },
        { q: 'how do i edit a product', a: 'Go to Products (🎾), find the product in the table, and click "Edit" on the right side. The edit form will open with all the current details pre-filled. Make your changes and click "Save Changes".' },
        { q: 'how do i delete a product', a: 'Go to Products (🎾), find the product in the table, and click "Delete". You\'ll be asked to confirm before it\'s permanently removed.' },
        { q: 'how do i add images to products', a: 'When adding or editing a product, you\'ll see an image upload area at the top of the form. Either drag & drop an image onto it, or click to browse your files. The image uploads to Firebase Storage and appears on the product card automatically.' },
        { q: 'product status', a: `You currently have ${products.length} products in your catalog. ${products.filter(p => p.inStock).length} are in stock and ${products.filter(p => !p.inStock).length} are out of stock.` },
      ]
    },
    {
      category: 'Programs & Classes',
      icon: '📋',
      items: [
        { q: 'how do i add a program', a: 'Go to Programs (📋) in the sidebar, click "+ Add Program". Fill in the name, type (group/private/camp), age group, price, duration, schedule, level, description, and spots available. You can also add an image.' },
        { q: 'how does enrollment tracking work', a: 'When a customer purchases a program through checkout, an enrollment record is automatically created. You can see all enrollments on the Dashboard and on each customer\'s profile in the Customers section. The spots available count decreases automatically.' },
        { q: 'program status', a: `You have ${programs.length} programs. ${programs.filter(p => p.spotsAvailable > 0).length} have spots available. Total enrollments: ${enrollments.length} (${enrollments.filter(e => e.status === 'active').length} active).` },
      ]
    },
    {
      category: 'Orders',
      icon: '📦',
      items: [
        { q: 'how do i view orders', a: 'Go to Orders (📦) in the sidebar. You\'ll see all orders listed with customer name, total, and status. Click any order to expand it and see the full details including items, shipping address, and discount applied.' },
        { q: 'how do i change order status', a: 'In the Orders section, each order has a status dropdown (confirmed → processing → shipped → delivered). Simply select the new status and it saves automatically.' },
        { q: 'what payment methods are available', a: 'Customers can choose between Credit/Debit Card and Cash on Delivery (COD) at checkout. The payment method is shown on each order.' },
        { q: 'order status', a: `You have ${orders.length} total orders. Revenue: $${orders.reduce((s, o) => s + (o.total || 0), 0).toFixed(2)}. Status breakdown: ${orders.filter(o => o.status === 'confirmed').length} confirmed, ${orders.filter(o => o.status === 'processing').length} processing, ${orders.filter(o => o.status === 'shipped').length} shipped, ${orders.filter(o => o.status === 'delivered').length} delivered.` },
      ]
    },
    {
      category: 'Customers',
      icon: '👥',
      items: [
        { q: 'how do i view customers', a: 'Go to Customers (👥) in the sidebar. You\'ll see all registered customers with their name, email, order count, and total spent. Click any customer to expand their profile and see their order history and enrolled programs.' },
        { q: 'what is the member discount', a: 'All registered customers automatically get a 20% discount on everything. This encourages sign-ups. The discount shows in their cart and checkout. Guest visitors see a prompt to register to get the discount.' },
        { q: 'how do i search customers', a: 'At the top of the Customers page, there\'s a search bar. Type a name or email to filter the list instantly.' },
      ]
    },
    {
      category: 'Staff & Employees',
      icon: '🏢',
      items: [
        { q: 'how do i add an employee', a: 'Go to Staff & Tasks (🏢), click "+ Add Employee". Enter their name, email, password, and phone number. Then select which admin sections they can access by toggling the permission buttons (Dashboard, Products, Programs, Orders, Customers, Staff).' },
        { q: 'how do i change employee permissions', a: 'In Staff & Tasks, find the employee and click "Edit Access". Toggle the permission buttons on/off. Green = has access, gray = no access. Changes save automatically.' },
        { q: 'how do i assign tasks', a: 'In Staff & Tasks, click "+ Assign Task". Select the employee, enter a title, description, priority (low/medium/high), and due date. The task appears in the task list where you can track its status (pending → in-progress → completed).' },
        { q: 'how do i remove an employee', a: 'In Staff & Tasks, find the employee and click "Remove". This changes their role back to a regular customer - they lose access to the admin panel.' },
      ]
    },
    {
      category: 'Website Editing',
      icon: '✏️',
      items: [
        { q: 'how do i edit text on the website', a: 'When you\'re logged in as admin, visit any public page (Home, About, Contact, etc.). Hover over any text - you\'ll see a green "Edit" badge appear. Click to edit the text inline. Press Enter or click away to save. The change appears instantly for all visitors.' },
        { q: 'what text can i edit', a: 'Everything! Hero section (title, subtitle, stats, buttons), "Why Choose" section (icons, titles, descriptions), testimonials (names, roles, quotes), footer (all text), About page (story, coaches, values, stats), Contact page (address, phone, email, hours), and all page titles.' },
        { q: 'how do i edit icons/emojis', a: 'Icons and emojis are editable just like text. Hover over any emoji on the site, click it, and type a new emoji. For example, you can change the 🏆 icon in "Expert Coaches" to any other emoji.' },
        { q: 'how do i change the logo', a: `Go to Settings (⚙️) and scroll to the Logo section. Click "Upload Logo" to upload a PNG or SVG file. ${logoUrl ? 'You currently have a custom logo uploaded.' : 'You\'re currently using the default text logo.'} You can also remove the custom logo to go back to the default.` },
      ]
    },
    {
      category: 'Colors & Theme',
      icon: '🎨',
      items: [
        { q: 'how do i change the website colors', a: 'Go to Settings (⚙️) and scroll to the Color Palette section. You can: 1) Click a preset palette (Alma Green, Ocean Blue, etc.) to instantly change all colors, or 2) Use the custom color pickers to set each color individually. All visitors see the change in real-time.' },
        { q: 'what are the color presets', a: 'There are 8 presets: Alma Green (default), Ocean Blue, Royal Purple, Sunset Red, Midnight Gold, Coral Pink, Forest Teal, and Earth Tone. Each changes 7 color slots across the entire site.' },
        { q: 'current theme', a: `Your current colors: Primary: ${theme.primary}, Accent: ${theme.accent}, Background: ${theme.cream}. You can change these anytime in Settings.` },
      ]
    },
    {
      category: 'Language',
      icon: '🌐',
      items: [
        { q: 'how do i switch to arabic', a: 'Go to Settings (⚙️). At the top you\'ll see the Language section with English 🇬🇧 and Arabic 🇸🇦 buttons. Click Arabic to switch the entire website to Arabic with right-to-left layout. All visitors see the change instantly.' },
        { q: 'how does the translation work', a: 'Each language has its own separate content. When in Arabic mode, clicking text to edit changes the Arabic version. When in English mode, it changes the English version. You can customize both languages independently.' },
        { q: 'current language', a: `The website is currently set to ${language === 'ar' ? 'Arabic (العربية) with RTL layout' : 'English with LTR layout'}. You can change this in Settings.` },
      ]
    },
    {
      category: 'Checkout & Payments',
      icon: '💳',
      items: [
        { q: 'how does checkout work', a: 'Customers add items to their cart, then proceed to checkout. They fill in contact info, shipping address (with an interactive map to pin their delivery location), choose payment method (card or cash on delivery), and place the order. Registered members automatically get 20% off.' },
        { q: 'what is cash on delivery', a: 'Cash on Delivery (COD) lets customers pay when their order arrives at their door. The order is created with "COD" as the payment method so you know to collect payment on delivery.' },
        { q: 'how does the map work', a: 'At checkout, customers see an interactive map. They can search for their address, use their GPS location, or click directly on the map to drop a pin. The pin is draggable for precise positioning. The pin coordinates are saved with the order.' },
      ]
    },
    {
      category: 'Troubleshooting',
      icon: '🔧',
      items: [
        { q: 'permission error', a: 'If you see "Missing or insufficient permissions", go to Firebase Console → Firestore Database → Rules tab. Replace everything with:\n\nrules_version = \'2\';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /{document=**} {\n      allow read, write: if true;\n    }\n  }\n}\n\nClick Publish. Do the same for Storage → Rules. This fixes all permission errors.' },
        { q: 'products not saving', a: 'This is almost always a Firestore permissions issue. Follow the steps above to update your security rules. If you see an error message in the form, it will tell you exactly what went wrong.' },
        { q: 'images not uploading', a: 'Make sure your Firebase Storage rules allow writes. Go to Firebase Console → Storage → Rules and set: allow read, write: if true; Then try uploading again.' },
        { q: 'colors not saving', a: 'Same fix as above - update your Firestore security rules to allow all reads and writes.' },
        { q: 'site not loading', a: 'Check the browser console (F12 → Console tab) for error messages. Common issues: Firebase config is wrong, Firestore rules blocking reads, or network issues. Try refreshing the page.' },
      ]
    },
  ];
}

function findBestAnswer(query, knowledgeBase) {
  const q = query.toLowerCase().trim();
  let bestMatch = null;
  let bestScore = 0;

  for (const category of knowledgeBase) {
    for (const item of category.items) {
      const keywords = item.q.toLowerCase().split(/\s+/);
      const queryWords = q.split(/\s+/);
      let score = 0;

      for (const qw of queryWords) {
        if (qw.length < 2) continue;
        for (const kw of keywords) {
          if (kw.includes(qw) || qw.includes(kw)) score += 2;
        }
        if (item.a.toLowerCase().includes(qw)) score += 1;
        if (category.category.toLowerCase().includes(qw)) score += 1;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = { ...item, category: category.category, icon: category.icon };
      }
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

export default function AdminHelpPage() {
  const { user } = useAuth();
  const { products, programs } = useData();
  const { orders } = useOrders();
  const { enrollments } = useEnrollments();
  const { language, theme, logoUrl } = usePageContent();

  const [messages, setMessages] = useState([
    { role: 'bot', text: `Hi ${user?.name || 'there'}! 👋 I'm your Alma Tennis Academy assistant. Ask me anything about how to use the admin panel, manage products, handle orders, edit the website, and more. I automatically know about all your current data and settings!` }
  ]);
  const [input, setInput] = useState('');
  const [showTopics, setShowTopics] = useState(true);
  const chatEndRef = useRef(null);

  const knowledgeBase = buildKnowledgeBase({
    products, programs, orders, enrollments, language, theme, logoUrl, user,
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setShowTopics(false);

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);

    setTimeout(() => {
      const match = findBestAnswer(userMsg, knowledgeBase);
      if (match) {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: match.a,
          category: `${match.icon} ${match.category}`,
        }]);
      } else {
        const suggestions = knowledgeBase.slice(0, 4).map(c => c.items[0].q);
        setMessages(prev => [...prev, {
          role: 'bot',
          text: `I'm not sure about that. Try asking about one of these topics:\n\n${suggestions.map(s => `• "${s}"`).join('\n')}\n\nOr click a topic below for quick help.`,
        }]);
        setShowTopics(true);
      }
    }, 500);
  };

  const handleQuickTopic = (item, category) => {
    setShowTopics(false);
    setMessages(prev => [...prev,
      { role: 'user', text: item.q },
      { role: 'bot', text: item.a, category: `${category.icon} ${category.category}` },
    ]);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-alma-green mb-6">Help & Guide</h1>

      {/* Chat window */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        {/* Messages */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${
                msg.role === 'user'
                  ? 'bg-alma-green text-white rounded-2xl rounded-br-md px-4 py-3'
                  : 'bg-gray-50 text-alma-charcoal rounded-2xl rounded-bl-md px-4 py-3'
              }`}>
                {msg.category && (
                  <span className="text-xs font-medium text-alma-lime bg-alma-green/10 px-2 py-0.5 rounded-full mb-2 inline-block">
                    {msg.category}
                  </span>
                )}
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Quick topics */}
        {showTopics && (
          <div className="border-t border-gray-100 p-4 bg-gray-50/50">
            <p className="text-xs font-semibold text-alma-charcoal/40 mb-3 uppercase tracking-wide">Quick Topics</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {knowledgeBase.map(cat => (
                <button
                  key={cat.category}
                  onClick={() => handleQuickTopic(cat.items[0], cat)}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-alma-lime hover:shadow-sm transition-all text-left"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-xs font-medium text-alma-charcoal/70 truncate">{cat.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything... (e.g. 'how do I add a product?')"
              className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:border-alma-lime focus:ring-2 focus:ring-alma-lime/20 outline-none text-sm transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-5 py-3 bg-alma-green text-white rounded-xl font-medium text-sm hover:bg-alma-green-light transition-all disabled:opacity-40"
            >
              Send
            </button>
          </div>
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
            {['How do I add a product?', 'Change colors', 'Switch to Arabic', 'Permission error'].map(q => (
              <button
                key={q}
                onClick={() => { setInput(q); }}
                className="text-xs text-alma-charcoal/40 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
