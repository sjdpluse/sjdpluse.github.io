import React, { useState, useEffect, useMemo, memo } from 'react';
import { supabase } from "../supabaseClient";
import { Loader2, AlertTriangle, X, ExternalLink, Palette, Layers, Sparkles } from 'lucide-react';

const DesignsGallery = memo(() => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('designs') // تغییر جدول به designs
          .select('*')
          .order('created_at', { ascending: false });

        if (dbError) {
          throw dbError;
        }
        setDesigns(data || []);
      } catch (err) {
        setError('Failed to load designs. Check Supabase table "designs" and RLS policies.');
        console.error("Error fetching designs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDesigns();
  }, []);

  // فیلتر کردن بر اساس دسته‌بندی
  const filteredDesigns = useMemo(() => {
    if (activeCategory === 'all') return designs;
    return designs.filter(design => design.category === activeCategory);
  }, [designs, activeCategory]);

  // استخراج دسته‌بندی‌های منحصربه‌فرد
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(designs.map(design => design.category))];
    return cats.filter(Boolean);
  }, [designs]);

  const [designsCol1, designsCol2, designsCol3, designsCol4] = useMemo(() => {
    if (filteredDesigns.length === 0) return [[], [], [], []];
    
    // ایجاد پایه تصادفی
    const baseShuffle = [...filteredDesigns].sort(() => 0.5 - Math.random());

    // تابع ایجاد ستون با افست مختلف
    const createColumn = (offset) => {
      if (filteredDesigns.length === 0) return [];
      const effectiveOffset = offset % filteredDesigns.length;
      return [...baseShuffle.slice(effectiveOffset), ...baseShuffle.slice(0, effectiveOffset)];
    };

    // ایجاد 4 ستون با افست‌های مختلف
    return Array.from({ length: 4 }, (_, i) => createColumn(i * 2));
  }, [filteredDesigns]);

  const handleDesignClick = (design) => {
    setSelectedDesign(design);
  };

  const handleCloseDetail = () => {
    setSelectedDesign(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <Palette className="w-12 h-12 text-indigo-400 animate-pulse" />
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-gray-400 text-sm">Loading creative portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 my-8 text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  
  if (designs.length === 0) {
    return (
      <div className="text-center py-16">
        <Layers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-300">No designs found</h3>
        <p className="text-gray-500 mt-2">Add your first design to showcase your portfolio</p>
      </div>
    );
  }

  return (
    <div className="mt-16" data-aos="fade-up" data-aos-duration="1000">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Palette className="w-10 h-10 text-indigo-400" />
          <Sparkles className="w-8 h-8 text-purple-400" />
        </div>
        <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
          Creative Portfolio
        </h3>
        <p className="mt-3 text-gray-400 text-sm max-w-2xl mx-auto">
          A collection of my design works, posters, and visual projects showcasing creativity and attention to detail
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === category
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            {category === 'all' ? 'All Works' : category}
          </button>
        ))}
      </div>
      
      <div className="relative bg-gradient-to-br from-gray-900/40 to-gray-800/20 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/10 overflow-hidden min-h-[500px] transition-all duration-500">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-l from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-spin-slower"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-500/5 to-transparent rounded-full blur-2xl"></div>
        </div>
        
        {selectedDesign ? (
          <div className="relative w-full animate-fade-in">
            <button 
              onClick={handleCloseDetail} 
              className="absolute -top-4 -right-4 z-20 p-3 rounded-full bg-gray-800/70 hover:bg-gray-700/90 transition-all duration-300 hover:scale-110 shadow-lg"
              aria-label="Close detail view"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              {/* Design Image */}
              <div className="w-full lg:w-2/3">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/20 border border-white/10">
                  <img 
                    src={selectedDesign.image_url} 
                    alt={selectedDesign.title} 
                    className="w-full h-auto object-contain max-h-[600px] transition-transform duration-700 hover:scale-105" 
                    loading="lazy" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              
              {/* Design Details */}
              <div className="w-full lg:w-1/3 animate-blurry-in">
                <div className="bg-gray-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">{selectedDesign.title}</h3>
                    {selectedDesign.category && (
                      <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold">
                        {selectedDesign.category}
                      </span>
                    )}
                  </div>
                  
                  {selectedDesign.description && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Description
                      </h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{selectedDesign.description}</p>
                    </div>
                  )}
                  
                  {selectedDesign.tools && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-300 mb-3">Tools Used</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedDesign.tools.split(',').map((tool, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-gray-800/50 text-gray-300 rounded-lg text-xs">
                            {tool.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedDesign.project_url && (
                    <a
                      href={selectedDesign.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-105"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Project Details
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative group h-[500px] w-full max-w-7xl mx-auto overflow-x-auto overflow-y-hidden [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] custom-horizontal-scrollbar">
            <div className="flex justify-start md:justify-center gap-4 md:gap-6 h-full min-w-max px-4">
              {/* Design Columns */}
              {[designsCol1, designsCol2, designsCol3, designsCol4].map((col, colIndex) => (
                <div
                  key={colIndex}
                  className={`flex flex-col gap-6 group-hover:[animation-play-state:paused] ${colIndex % 2 === 0 ? 'animate-scroll-up' : 'animate-scroll-down'}`}
                  style={{ animationDuration: `${filteredDesigns.length * (3 + Math.random())}s` }}
                >
                  {[...col, ...col].map((design, index) => (
                    <div 
                      key={`${colIndex}-${design.id}-${index}`} 
                      onClick={() => handleDesignClick(design)} 
                      className="relative group/card w-48 h-64 md:w-56 md:h-72 rounded-2xl overflow-hidden shadow-xl cursor-pointer flex-shrink-0 transition-all duration-500 hover:!scale-105 hover:shadow-2xl hover:shadow-indigo-500/30 border border-white/10"
                    >
                      {/* Design Image */}
                      <img 
                        src={design.image_url} 
                        alt={design.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" 
                        loading="lazy" 
                      />
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-6 group-hover/card:translate-y-0 transition-transform duration-500">
                          <h3 className="text-white font-bold text-lg mb-2 drop-shadow-lg">{design.title}</h3>
                          {design.category && (
                            <p className="text-indigo-300 text-sm font-medium drop-shadow-md">{design.category}</p>
                          )}
                          {design.tools && (
                            <div className="mt-3 flex flex-wrap gap-1.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 delay-200">
                              {design.tools.split(',').slice(0, 2).map((tool, idx) => (
                                <span key={idx} className="px-2 py-1 bg-black/40 text-gray-300 text-xs rounded">
                                  {tool.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Hover Icon */}
                        <div className="absolute top-4 right-4 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-100">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      
                      {/* Corner Accent */}
                      <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-indigo-500/30 to-transparent rounded-br-2xl"></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Instruction Text */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="text-gray-500 text-sm animate-pulse">
                Click on any design to view details • Scroll horizontally for more
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default DesignsGallery;
