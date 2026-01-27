import React, { useEffect, useState, useCallback } from "react";

import { supabase } from "../supabase"; 

import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";

// اضافه کنید به وارد کردن های lucide-react:
import { Code, Award, Boxes, BookOpen } from "lucide-react";

// اضافه کنید به وارد کردن کامپوننت‌ها:
import CourseCard from "../components/CourseCard";

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);


function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// Helper function for AOS animations to avoid repetition
const getAosProps = (index) => {
  const animationType = ["fade-up-right", "fade-up", "fade-up-left"][index % 3];
  const duration = animationType === "fade-up" ? "1200" : "1000";
  return {
    "data-aos": animationType,
    "data-aos-duration": duration,
  };
};

// techStacks tetap sama
const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "React.js" },
  { icon: "vite.svg", language: "Python" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "Vite" },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);

  const getInitialItems = useCallback(() => (window.innerWidth < 768 ? 4 : 6), []);
  const [initialItems, setInitialItems] = useState(getInitialItems());

  useEffect(() => {
    AOS.init({
      once: true, // Animate elements only once for a cleaner experience
    });
  }, []);


  const fetchData = useCallback(async (showLoader = true) => {
  try {
    if (showLoader) {
      setLoading(true);
    }
    setError(null);
    
    // دریافت داده‌ها به صورت موازی
    const [projectsResponse, certificatesResponse, coursesResponse] = await Promise.all([
      supabase.from("projects").select("*").order('id', { ascending: true }),
      supabase.from("certificates").select("*").order('id', { ascending: true }), 
      supabase.from("courses").select("*").order('id', { ascending: true }), // ← این خط را اضافه کنید
    ]);

    // بررسی خطاها
    if (projectsResponse.error) throw projectsResponse.error;
    if (certificatesResponse.error) throw certificatesResponse.error;
    if (coursesResponse.error) throw coursesResponse.error; // ← این خط را اضافه کنید

    const projectData = projectsResponse.data || [];
    const certificateData = certificatesResponse.data || [];
    const courseData = coursesResponse.data || []; // ← این خط را اضافه کنید

    setProjects(projectData);
    setCertificates(certificateData);
    setCourses(courseData); // ← این خط را اضافه کنید

    // ذخیره در localStorage
    localStorage.setItem("projects", JSON.stringify(projectData));
    localStorage.setItem("certificates", JSON.stringify(certificateData));
    localStorage.setItem("courses", JSON.stringify(courseData)); // ← این خط را اضافه کنید
    
  } catch (error) {
    const errorMessage = `Error fetching data from Supabase: ${error.message}`;
    console.error(errorMessage);
    setError(errorMessage);
  } finally {
    if (showLoader) {
      setLoading(false);
    }
  }
}, []);


useEffect(() => {
  // همیشه داده‌های تازه را از سرور بگیر
  fetchData(true);

  const handleResize = () => {
    setInitialItems(getInitialItems());
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, [fetchData, getInitialItems]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
  if (type === 'projects') {
    setShowAllProjects(prev => !prev);
  } else if (type === 'certificates') {
    setShowAllCertificates(prev => !prev);
  } else if (type === 'courses') { // ← این بخش را اضافه کنید
    setShowAllCourses(prev => !prev);
  }
}, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);
  const displayedCourses = showAllCourses ? courses : courses.slice(0, initialItems);
  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden" id="Portofolio">
      {/* Header section - unchanged */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          <span style={{
            color: '#6366f1',
            backgroundImage: 'linear-gradient(45deg, #6366f1 10%, #a855f7 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Portfolio Showcase
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Navigate my path of professional growth. Discover projects that demonstrate my skills, certifications that validate my knowledge, and a commitment to never stop evolving.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section - unchanged */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          {/* Tabs remain unchanged */}
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(139, 92, 246, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(139, 92, 246, 0.2)",
                  "& .lucide": {
                    color: "#a78bfa",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Projects"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Certificates"
              {...a11yProps(1)}
            />
            <Tab
              icon={<BookOpen className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Courses"
              {...a11yProps(3)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Tech Stack"
              {...a11yProps(2)}
           
            />
          </Tabs>
        </AppBar>

        <div>
          <TabPanel value={value} index={0} dir={theme.direction}>
            {loading && <p className="text-center text-slate-400 py-10">Loading Projects...</p>}
            {error && <p className="text-center text-red-500 py-10">{error}</p>}
            {!loading && !error && projects.length === 0 && <p className="text-center text-slate-400 py-10">No projects found.</p>}
            {!loading && !error && projects.length > 0 && (
              <>
                <div className="container mx-auto flex justify-center items-center overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                    {displayedProjects.map((project, index) => (
                      <div key={project.id || index} {...getAosProps(index)}>
                        <CardProject
                          Img={project.Img}
                          Title={project.Title}
                          Description={project.Description}
                          Link={project.Link}
                          id={project.id}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {projects.length > initialItems && (
                  <div className="mt-6 w-full flex justify-start">
                    <ToggleButton
                      onClick={() => toggleShowMore('projects')}
                      isShowingMore={showAllProjects}
                    />
                  </div>
                )}
              </>
            )}
          </TabPanel> 
          <TabPanel value={value} index={3} dir={theme.direction}>
            {loading && <p className="text-center text-slate-400 py-10">Loading Courses...</p>}
            {error && <p className="text-center text-red-500 py-10">{error}</p>}
            {!loading && !error && courses.length === 0 && <p className="text-center text-slate-400 py-10">No courses found.</p>}
            {!loading && !error && courses.length > 0 && (
              <>
                <div className="container mx-auto flex justify-center items-center overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                    {displayedCourses.map((course, index) => (
                      <div key={course.id || index} {...getAosProps(index)}>
                        <CourseCard
                          imageUrl={course.image_url}
                          title={course.title}
                          category={course.category}
                          sessionDay={course.session_day}
                          deployedUrl={course.deployed_url}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {courses.length > initialItems && (
                  <div className="mt-6 w-full flex justify-start">
                    <ToggleButton
                      onClick={() => toggleShowMore('courses')}
                      isShowingMore={showAllCourses}
                    />
                  </div>
                )}
              </>
            )}
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            {loading && <p className="text-center text-slate-400 py-10">Loading Certificates...</p>}
            {error && <p className="text-center text-red-500 py-10">{error}</p>}
            {!loading && !error && certificates.length === 0 && <p className="text-center text-slate-400 py-10">No certificates found.</p>}
            {!loading && !error && certificates.length > 0 && (
              <>
                <div className="container mx-auto flex justify-center items-center overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                    {displayedCertificates.map((certificate, index) => (
                      <div key={certificate.id || index} {...getAosProps(index)}>
                        <Certificate ImgSertif={certificate.Img} />
                      </div>
                    ))}
                  </div>
                </div>
                {certificates.length > initialItems && (
                  <div className="mt-6 w-full flex justify-start">
                    <ToggleButton
                      onClick={() => toggleShowMore('certificates')}
                      isShowingMore={showAllCertificates}
                    />
                  </div>
                )}
              </>
            )}
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div key={index} {...getAosProps(index)}>
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </div>
      </Box>
    </div>
  );
}
