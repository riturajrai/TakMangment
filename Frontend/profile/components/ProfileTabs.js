'use client';

export default function ProfileTabs({ activeSection, onTabClick }) {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      <button
        onClick={() => onTabClick('name')}
        className={`flex-1 py-3 px-4 text-sm font-medium text-center transition-colors duration-200 ${
          activeSection === 'name'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        Name
      </button>
      <button
        onClick={() => onTabClick('email')}
        className={`flex-1 py-3 px-4 text-sm font-medium text-center transition-colors duration-200 ${
          activeSection === 'email'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        Email
      </button>
      <button
        onClick={() => onTabClick('other')}
        className={`flex-1 py-3 px-4 text-sm font-medium text-center transition-colors duration-200 ${
          activeSection === 'other'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        Other Information
      </button>
    </div>
  );
}