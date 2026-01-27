import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';

const CourseCard = ({ imageUrl, title, category, sessionDay, deployedUrl }) => {
  const handleClick = () => {
    if (!deployedUrl) {
      alert("لینک دوره هنوز در دسترس نیست");
      return;
    }
    // باز کردن لینک در تب جدید
    window.open(deployedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-lg border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-purple-500/20 hover:scale-105 cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>

      <div className="relative p-5 z-10">
        {/* تصویر و Badge دسته‌بندی */}
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full border border-white/10">
            <span className="text-xs font-medium text-white">{category}</span>
          </div>
        </div>
        
        {/* محتوای کارت */}
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent flex-1">
              {title}
            </h3>
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300 flex-shrink-0 ml-2" />
          </div>
          
          {/* اطلاعات جلسه */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-gray-400">
                {sessionDay}
              </span>
            </div>
            <span className="text-xs text-indigo-400 font-medium group-hover:text-indigo-300 transition-colors">
              باز کردن دوره →
            </span>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 border border-white/0 group-hover:border-purple-500/50 rounded-xl transition-colors duration-300 -z-50"></div>
    </div>
  );
};

export default CourseCard;
