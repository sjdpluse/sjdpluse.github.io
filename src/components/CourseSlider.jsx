import React, { useState, useEffect, useMemo, memo } from 'react';
import { supabase } from "../supabaseClient";
import { Loader2, Calendar, ExternalLink, Layers } from 'lucide-react';
import "aos/dist/aos.css";

// FilterTab component
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

// CourseCard component
const CourseCard = memo(({ item }) => {
  const handleClick = () => {
    if (!item.deployed_url) {
      alert("لینک دوره هنوز در دسترس نیست");
      return;
    }
    window.open(item.deployed_url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleClick}
      className="group relative overflow-hidden rounded-3xl cursor-pointer bg-gray-900 border border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10"
    >
      {/* Background Media */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end transform transition-transform duration-500">
        {/* Category Badge */}
        <div className="absolute top-4 left-4 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-black bg-white/90 backdrop-blur-sm rounded-full uppercase">
            {item.category}
          </span>
        </div>

        {/* Text Content */}
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1 leading-tight">
              {item.title}
            </h3>
            <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                <div className="flex items-center gap-2 mt-3">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span className="text-gray-300 text-sm">{item.session_day}</span>
                </div>
            </div>
        </div>
      </div>
      
      {/* Interaction Icon */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
         <div className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform">
            <ExternalLink className="w-5 h-5" />
         </div>
      </div>
    </div>
  );
});

// Main CourseSlider Component
const CourseSlider = memo(() => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .order('id', { ascending: false });

        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError('Failed to load courses. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Handle Filtering
  const filteredCourses = useMemo(() => {
    if (activeCategory === 'All') {
      return courses;
    } else {
      return courses.filter(item => item.category === activeCategory);
    }
  }, [activeCategory, courses]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = ['All', ...new Set(courses.map(i => i.category))];
    return cats.slice(0, 5);
  }, [courses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-400">
        <p>{error}</p>
        <p className="text-sm text-gray-400 mt-2">Check your Supabase RLS policies</p>
      </div>
    );
  }

  return (
    <section className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto" id="courses">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6" data-aos="fade-up">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 mb-2 text-indigo-400 font-medium tracking-widest text-xs uppercase">
            <Layers className="w-4 h-4" />
            <span>AI Learning Hub</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
            Educational <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Courses</span>
          </h2>
          <p className="mt-4 text-gray-400 text-sm md:text-base leading-relaxed">
            Explore my comprehensive AI courses designed to transform complex concepts into practical knowledge.
          </p>
        </div>

        {/* Filter Tabs */}
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

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[300px] gap-6" data-aos="fade-up" data-aos-delay="100">
        {filteredCourses.map((item) => (
          <CourseCard key={item.id} item={item} />
        ))}
        
        {filteredCourses.length === 0 && (
          <div className="col-span-full py-20 text-center text-gray-500">
            No courses found in this category.
          </div>
        )}
      </div>
    </section>
  );
});

export default CourseSlider;
