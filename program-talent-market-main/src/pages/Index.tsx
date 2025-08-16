import React, { useState, useEffect } from "react";
import FeaturedStudent from "@/components/FeaturedStudent";
import StudentDashboard from "@/components/StudentDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import HeroSection from "@/components/HeroSection";
import StatsGrid from "@/components/StatsGrid";
import TabNavigation from "@/components/TabNavigation";
import SearchFilters from "@/components/SearchFilters";
import ContentGrid from "@/components/ContentGrid";
import { mockStudents } from "@/data/mockStudents";
import { mockJobs, JobPosting } from "@/data/mockJobs";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/contexts/RoleContext";

const ALL_SKILLS = Array.from(
  new Set([...mockStudents.flatMap((s) => s.skills), ...mockJobs.flatMap((j) => j.skills)])
);

// Featured student data (could be rotated weekly)
const featuredStudent = {
  id: 1,
  name: "Alex Rivera",
  title: "Full-Stack Web Developer",
  avatarUrl: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=256&h=256&facepad=2&q=80",
  skills: ["Web Development", "Programming", "UI/UX Design"],
  quote: "Building amazing web experiences is my passion. Every line of code I write aims to create something that users will love and businesses will thrive with!",
  clientReview: {
    text: "Alex built our entire e-commerce platform from scratch and it's been a game-changer for our business. The site is fast, beautiful, and user-friendly. Sales increased by 40% in the first month!",
    clientName: "Sarah Johnson, Store Owner",
    rating: 5
  }
};

const Index: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"students" | "jobs">("students");
  const [jobs, setJobs] = useState<JobPosting[]>(mockJobs);
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { role } = useRole();

  // Handle tab switching from sidebar navigation
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state to prevent it from persisting
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, location.pathname]);

  console.log("Current activeTab:", activeTab);
  console.log("Filtered students count:", mockStudents.length);
  console.log("User role:", role);

  const filteredStudents = mockStudents.filter((student) => {
    const matchSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.title.toLowerCase().includes(search.toLowerCase()) ||
      student.skills.some((skill) =>
        skill.toLowerCase().includes(search.toLowerCase())
      );
    const matchSkill =
      !selectedSkill || student.skills.includes(selectedSkill);
    return matchSearch && matchSkill;
  }).sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price":
        const priceA = parseInt(a.price.replace(/[^\d]/g, ''));
        const priceB = parseInt(b.price.replace(/[^\d]/g, ''));
        return priceA - priceB;
      case "rating":
        return 0; // Could be implemented with actual rating data
      default:
        return 0;
    }
  });

  const filteredJobs = jobs.filter((job) => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(search.toLowerCase())
      );
    const matchSkill =
      !selectedSkill || job.skills.includes(selectedSkill);
    return matchSearch && matchSkill;
  });


  const handleClearFilters = () => {
    setSearch("");
    setSelectedSkill(null);
  };

  console.log("Rendering cards grid, activeTab:", activeTab, "filteredStudents:", filteredStudents.length);

  if (role === 'student') {
    return (
      <StudentDashboard 
        jobs={jobs}
        setActiveTab={setActiveTab}
      />
    );
  }

  if (role === 'admin') {
    return (
      <AdminDashboard 
        jobs={jobs}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-gradient-to-br from-primary/10 to-accent/20 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute bottom-32 right-1/3 w-96 h-96 bg-gradient-to-tl from-accent/15 to-primary/10 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-20 w-48 h-48 bg-gradient-to-tr from-primary/5 to-accent/10 rounded-full blur-2xl animate-pulse opacity-50" style={{ animationDelay: '4s' }}></div>
      </div>

      <HeroSection />

      <div className="max-w-6xl mx-auto w-full px-4 md:px-6 pb-16 relative z-10">
        {/* Featured Student Section */}
        <div className="mb-12 animate-fade-in">
          <FeaturedStudent 
            student={featuredStudent}
            onViewProfile={() => navigate(`/student/${featuredStudent.id}`)}
          />
        </div>

        {/* Browse Students Hero Section */}
        {activeTab === "students" && (
          <StatsGrid 
            studentsCount={mockStudents.length}
            skillsCount={ALL_SKILLS.length}
          />
        )}

        <TabNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          studentsCount={mockStudents.length}
          jobsCount={jobs.length}
        />

        <SearchFilters
          search={search}
          setSearch={setSearch}
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          activeTab={activeTab}
          allSkills={ALL_SKILLS}
          sortBy={sortBy}
          setSortBy={setSortBy}
          resultsCount={activeTab === "students" ? filteredStudents.length : filteredJobs.length}
        />

        <ContentGrid
          activeTab={activeTab}
          filteredStudents={filteredStudents}
          filteredJobs={filteredJobs}
          onStudentView={(id) => navigate(`/student/${id}`)}
          onJobView={(id) => navigate(`/job/${id}`)}
          onClearFilters={handleClearFilters}
        />
        
        {/* Enhanced Footer */}
        <footer className="text-center mt-24 pb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-transparent via-primary/10 to-transparent h-px mb-8"></div>
          <p className="text-muted-foreground text-sm opacity-80 font-medium">
            &copy; {new Date().getFullYear()} MyVillage Program &middot; All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
