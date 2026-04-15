import { User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 py-3 px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        {/* Logo and Search removed per request */}
      </div>

      <div className="flex items-center gap-4">
        {/* Notification bell removed per request */}
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900">أحمد محمود</p>
            <p className="text-xs text-gray-500">مدير النظام</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-[--color-brand-primary] shadow-sm">
            <img 
              src="https://picsum.photos/seed/user1/100/100" 
              alt="User" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
