import React, { useState, useEffect, useMemo, memo } from 'react';
import { supabase } from "../supabaseClient";
import { Loader2, Play, Maximize2, X, ArrowUpRight, Layers } from 'lucide-react';

// --- Sub-components for cleaner code ---

const FilterTab = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md border ${
      active
        ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
    }`}
  >
    {label}
  </button>
);
const ProjectCard = memo(({ item, onClick }) => {
  const isVideo = item.media_type === 'video';
  const isFeatured = item.featured; // Featured items span 2 columns

  return (
    <div
      onClick={() => onClick(item)}
      className={`group relative overflow-hidden rounded-3xl cursor-pointer bg-gray-900 border border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 ${
        isFeatured ? 'md:col-span-2 md:row-span-2' : 'col-span-1'
      }`}
    >
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full">
        {isVideo ? (
          <video
            src={item.media_url}
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            onMouseOver={(e) => e.target.play()}
            onMouseOut={(e) => e.target.pause()}
          />
        ) : (
          <img
            src={item.media_url}
            alt={item.title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        )}
      </div>

      {/* Overlay Gradient (Apple-style vignette) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

      {/* Content - Visible on Hover/Default */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end transform transition-transform duration-500">
        
        {/* Floating Category Badge */}
        <div className="absolute top-4 left-4 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-black bg-white/90 backdrop-blur-sm rounded-full uppercase">
            {item.category}
          </span>
        </div>

        {/* Play Icon for Video */}
        {isVideo && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
            <Play className="w-5 h-5 text-white fill-white ml-1" />
          </div>
        )}

        {/* Text Content */}
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight">
              {item.title}
            </h3>
            <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                <p className="text-gray-300 text-sm mt-2 line-clamp-2">
                    {item.description}
                </p>
                <div className="flex gap-2 mt-3">
                    {item.tools?.slice(0, 3).map((tool, i) => (
                        <span key={i} className="text-[10px] text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md">
                            {tool}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>
      
      {/* Interaction Icon */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
         <div className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform">
            <ArrowUpRight className="w-5 h-5" />
         </div>
      </div>
    </div>
  );
});

// --- Main Component ---

const CreativeGallery = memo(() => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // NOTE: Replace 'portfolio_gallery' with your actual table name if different
        const { data, error } = await supabase
          .from('portfolio_gallery') 
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        setItems(data || []);
        setFilteredItems(data || []);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  // Handle Filtering
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === activeCategory));
    }
  }, [activeCategory, items]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(items.map(i => i.category))];
    return cats.slice(0, 5); // Limit to 5 filters max
  }, [items]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto" id="work">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6" data-aos="fade-up">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2 text-indigo-400 font-medium tracking-widest text-xs uppercase">
            <Layers className="w-4 h-4" />
            <span>Visual Playground</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Creative Works</span>
          </h2>
          <p className="mt-4 text-gray-400 text-sm md:text-base leading-relaxed">
            A curated collection of my journey through pixels, motion, and brand storytelling. 
            Designed to leave a mark.
          </p>
        </div>

        {/* --- Filter Tabs --- */}
        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
          {categories.map(cat => (
            <FilterTab 
              key={cat} 
              label={cat} 
              active={activeCategory === cat} 
              onClick={() => setActiveCategory(cat)} 
            />
          ))}
        </div>
      </div>

      {/* --- Bento Grid Layout --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[300px] gap-6" data-aos="fade-up" data-aos-delay="100">
        {filteredItems.map((item) => (
          <ProjectCard key={item.id} item={item} onClick={setSelectedProject} />
        ))}
        
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500">
            No projects found in this category.
          </div>
        )}
      </div>

      {/* --- Detail Modal (Cinema Mode) --- */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-xl transition-opacity animate-fade-in"
            onClick={() => setSelectedProject(null)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-5xl bg-[#111] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl animate-scale-up flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 border border-white/10 text-white hover:bg-white hover:text-black transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media Side (Left/Top) */}
            <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative overflow-hidden group">
              {selectedProject.media_type === 'video' ? (
                <video 
                  src={selectedProject.media_url} 
                  controls 
                  autoPlay 
                  className="w-full h-full object-contain max-h-[60vh] md:max-h-full"
                />
              ) : (
                <img 
                  src={selectedProject.media_url} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-contain max-h-[60vh] md:max-h-full"
                />
              )}
            </div>

            {/* Info Side (Right/Bottom) */}
            <div className="w-full md:w-1/3 p-8 md:p-10 flex flex-col bg-gray-900/50 backdrop-blur-sm overflow-y-auto custom-scrollbar">
              <div className="mb-6">
                <span className="text-indigo-400 text-xs font-bold tracking-widest uppercase mb-2 block">
                  {selectedProject.category}
                </span>
                <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                  {selectedProject.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  {selectedProject.description}
                </p>
              </div>

              <div className="mt-auto space-y-6">
                <div>
                  <h4 className="text-white text-sm font-semibold mb-3 flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-gray-500" />
                    Tools Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tools?.map((tool, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full py-4 mt-4 bg-white text-black rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2 group">
                  View Full Project
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});

export default CreativeGallery;
