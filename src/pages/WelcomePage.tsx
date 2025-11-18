import React, { useState, useEffect } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import about2Image from "../assets/about2.gif";
import AshafakImage from "../assets/Ashafak.jpg";
import BanuImage from "../assets/Banu.jpg";
import SauImage from "../assets/Sau.jpg";
import chameeraImage from "../assets/chameera.jpg";
import jawaImage from "../assets/jawa.jpg";
import nadunImage from "../assets/nadun.jpg";

const HEADER_H = 64;

interface TeamMember {
  name: string;
  image: string;
  role: string; // <-- added role/description field
}

export default function WelcomePage() {
  const [email, setEmail] = useState("");

  // ================= HERO IMAGE SLIDESHOW =================
  const heroImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1950&q=80",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1950&q=80",
    
  ];

  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroImages.length);
    }, 3000); // every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const team: TeamMember[] = [
    {
      name: "Ashfak Sazni",
      image: AshafakImage,
      role: "Project Lead contributing to all parts of the project, including frontend, backend, design, and coordination. Ensuring smooth workflow, innovation, and successful delivery.",
    },
    {
      name: "Rushdah Banu",
      image: BanuImage,
      role: "Working on all aspects of the project, focusing on backend development, database management, and integration with frontend, while supporting other modules.",
    },
    {
      name: "Mohommed Jawahar",
      image: jawaImage,
      role: "Contributing to all parts of the project while developing interactive frontend features. Supporting backend integration, design improvements, and overall functionality.",
    },
    {
      name: "Chameera",
      image: chameeraImage,
      role: "Ensuring quality across all parts of the project. Conducting testing, identifying issues, and supporting both frontend and backend development for smooth performance",
    },
    {
      name: "Saubhagya",
      image: SauImage,
      role: "Contributing to every module of the project, including content creation, UI guidance, and user communication. Supporting the team in all aspects for cohesive delivery.",
    },
    {
      name: "Nadun",
      image: nadunImage,
      role: "Ensuring quality across all parts of the project. Conducting testing, identifying issues, and supporting both frontend and backend development for smooth performance",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  const handleJoin = () => {
    if (email) {
      alert(`Email submitted: ${email}`);
      setEmail("");
    } else {
      alert("Please enter your email");
    }
  };

  return (
    <div className="bg-[#F3FAF6] text-gray-900 font-sans">
      {/* ================== NAVBAR ================== */}
      <header className="fixed top-0 w-full bg-[#1E293B] text-white flex justify-between items-center px-8 py-4 shadow-md z-50 h-16">
        <h1 className="font-bold text-xl md:text-2xl tracking-wide">
          Hostel Management System
        </h1>

        <nav className="flex gap-8 text-sm md:text-base">
          {["Home", "How it Works", "Features", "About Us"].map((text, i) => (
            <Link
              key={i}
              smooth
              to={`/#${text.toLowerCase().replace(/\s/g, "-")}`}
              className="font-medium hover:text-[#38BDF8] transition-colors duration-200"
            >
              {text}
            </Link>
          ))}
        </nav>
      </header>

      {/* ================== HERO SECTION ================== */}
      <section
        className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center text-center relative transition-all duration-1000"
        style={{
          backgroundImage: `url(${heroImages[currentHero]})`,
        }}
      >
        <div className="absolute inset-0 bg-[#0A1A33]/75"></div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl px-4 mt-16"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/Rajarata_logo.png/250px-Rajarata_logo.png"
            alt="Rajarata University Logo"
            className="w-28 h-28 mb-6 bg-white/80 rounded-full p-2 shadow-lg mx-auto"
          />
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-white">
            Hostel Management System
          </h1>
          <p className="text-lg text-[#E5E7EB]">
            Faculty of Technology, Rajarata University of Sri Lanka
          </p>
          <p className="mt-4 text-[#E5E7EB]/80">
            Your central portal for seamless hostel administration. Manage
            rooms, payments, and requests, or register to get started.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 text-lg font-semibold text-white bg-[#14B8A6] rounded-lg shadow-md hover:bg-[#10998d] transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 text-lg font-semibold text-[#2463A8] bg-white rounded-lg shadow-md hover:bg-[#E5E7EB] transition"
            >
              Register
            </Link>
          </div>
        </motion.div>
      </section>
      {/* ================== HOW IT WORKS ================== */}
      <section
        id="how-it-works"
        className="py-20 bg-[#F3FAF6] text-gray-900 scroll-mt-24"
        style={{ scrollMarginTop: HEADER_H + 16 }}
      >
        {/* Section Title */}
        <motion.h2
          className="text-3xl font-bold text-center mb-12 text-[#2463A8]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          How It Works
        </motion.h2>

        {/* Steps Container */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          {[
            {
              step: "01",
              title: "Register Account",
              text: "Create your account to start managing hostel details efficiently and securely.",
            },
            {
              step: "02",
              title: "Manage Information",
              text: "Update student details, assign rooms, and track changes with ease.",
            },
            {
              step: "03",
              title: "Track Occupancy",
              text: "Monitor occupancy status and optimize hostel resources seamlessly.",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center group 
                   hover:shadow-2xl transition-transform transform hover:-translate-y-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: i * 0.2 }}
            >
              {/* Step Number (Large, Colorful, Interactive on Hover) */}
              <div
                className="bg-[#14B8A6] text-white w-24 h-24 md:w-28 md:h-28 flex items-center justify-center 
                     text-4xl md:text-5xl font-extrabold rounded-full mb-6 shadow-lg 
                     transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#10998d]"
              >
                {s.step}
              </div>

              {/* Step Title */}
              <h3 className="text-2xl font-bold mb-3 text-[#2463A8]">
                {s.title}
              </h3>

              {/* Step Description */}
              <p className="text-gray-600 text-sm md:text-base max-w-xs">
                {s.text}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================== FEATURES ================== */}
      <section
        id="features"
        className="min-h-screen py-20 bg-[#E5E7EB] text-gray-900 scroll-mt-24"
        style={{ scrollMarginTop: HEADER_H + 16 }}
      >
        <motion.h2
          className="text-3xl font-bold text-center mb-10 text-[#2463A8]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Features
        </motion.h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            {
              icon: "📦",
              title: "Room Allocation",
              desc: "Manage and allocate rooms efficiently.",
            },
            {
              icon: "💳",
              title: "Online Payments",
              desc: "Handle secure digital payments easily.",
            },
            {
              icon: "🛠",
              title: "Maintenance",
              desc: "Request and track maintenance tasks.",
            },
            {
              icon: "🔔",
              title: "Notifications",
              desc: "Real-time updates for wardens and students.",
            },
            {
              icon: "👥",
              title: "Role Dashboards",
              desc: "Dedicated interfaces for each role.",
            },
            {
              icon: "📊",
              title: "Reports & Analytics",
              desc: "Visual data for better decision-making.",
            },
          ].map((f, idx) => (
            <motion.div
              key={idx}
              className="flex items-start space-x-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ delay: idx * 0.15 }}
            >
              <div className="text-4xl">{f.icon}</div>
              <div>
                <h3 className="text-2xl font-semibold text-[#2463A8]">
                  {f.title}
                </h3>
                <p className="mt-2 text-gray-600">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================== ABOUT US ================== */}
      <section
        id="about-us"
        className="bg-[#F3FAF6] text-gray-900 scroll-mt-24 relative overflow-hidden"
        style={{ scrollMarginTop: HEADER_H + 16 }}
      >
        <svg
          className="absolute -top-20 -left-20 w-80 opacity-20 rotate-45"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
        >
          <path
            fill="#14B8A6"
            d="M43.1,-77.8C55.7,-68.1,61.1,-51.1,67.6,-34.2C74.1,-17.2,81.8,-0.2,79.6,16.5C77.4,33.3,65.3,49.8,50.5,60.5C35.6,71.2,17.8,76.1,-1.2,77.5C-20.2,78.9,-40.4,76.7,-53.6,66.8C-66.9,56.9,-73.2,39.3,-77.2,22.3C-81.2,5.3,-82.9,-11.3,-78.7,-25.1C-74.4,-38.9,-64.3,-49.9,-52.4,-59.3C-40.5,-68.7,-26.7,-76.6,-12,-78.2C2.7,-79.8,16.4,-75.5,43.1,-77.8Z"
            transform="translate(100 100)"
          />
        </svg>

        <motion.div
          className="grid content-center gap-8 px-6 md:px-20 md:grid-cols-2 py-20 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="max-w-xl">
            <h1 className="text-4xl font-extrabold text-[#2463A8] mb-4">
              About Us
            </h1>
            <p className="mt-5 text-lg text-gray-700 leading-relaxed">
              We are a passionate student team dedicated to building a modern,
              efficient{" "}
              <span className="font-semibold text-[#14B8A6]">
                Hostel Management System
              </span>{" "}
              that simplifies hostel operations and enhances student life.
            </p>
            <p className="mt-4 text-gray-600 text-base leading-relaxed">
              Our system ensures smooth room allocation, payment management, and
              real-time notifications, making hostel administration seamless for
              both students and staff.
            </p>
            <div className="mt-8 flex gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-[#14B8A6]/10 text-[#14B8A6] px-4 py-2 rounded-lg font-medium shadow hover:shadow-lg transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Innovative
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-[#2463A8]/10 text-[#2463A8] px-4 py-2 rounded-lg font-medium shadow hover:shadow-lg transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3"
                  />
                </svg>
                Efficient
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 bg-[#38BDF8]/10 text-[#38BDF8] px-4 py-2 rounded-lg font-medium shadow hover:shadow-lg transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Reliable
              </motion.div>
            </div>
          </div>

          <div className="flex justify-center relative">
            <motion.img
              src={about2Image}
              alt="Our team working"
              className="w-full max-w-xl max-h-[55vh] rounded-3xl object-cover shadow-2xl transform hover:scale-105 transition duration-500"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
            />
            <motion.div
              className="absolute -top-8 -right-8 w-16 h-16 bg-[#14B8A6]/20 rounded-full flex items-center justify-center shadow-lg"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            >
              <svg
                className="w-8 h-8 text-[#14B8A6]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* ================== MEET OUR TEAM ================== */}
        <section className="bg-[#E5E7EB] py-12 relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              className="text-2xl sm:text-3xl font-extrabold text-center text-[#2463A8] mb-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              Meet Our Team
            </motion.h2>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {team.map((member, index) => (
                <motion.article
                  key={index}
                  className="group relative rounded-xl bg-white p-6 text-center shadow-md ring-1 ring-[#E5E7EB] overflow-hidden transition hover:shadow-lg transform hover:-translate-y-2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: index * 0.15 }}
                >
                  <div className="mx-auto aspect-square w-32 overflow-hidden rounded-full ring-4 ring-[#14B8A6]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="h-full w-full object-cover transform group-hover:scale-110 transition duration-500"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-[#2463A8]">
                    {member.name}
                  </h3>

                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-[#14B8A6]/95 text-white p-5 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <p className="font-semibold text-lg">{member.name}</p>
                    <p className="mt-2 text-sm">{member.role}</p>{" "}
                    {/* <-- customized description */}
                    <div className="flex justify-center gap-4 mt-4">
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-300 text-xl"
                      >
                        <FaFacebookF />
                      </a>
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-300 text-xl"
                      >
                        <FaInstagram />
                      </a>
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-300 text-xl"
                      >
                        <FaLinkedinIn />
                      </a>
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-300 text-xl"
                      >
                        <FaTwitter />
                      </a>
                      <a
                        href="https://youtube.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-300 text-xl"
                      >
                        <FaYoutube />
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      </section>

      {/* ================== FOOTER ================== */}
      <footer className="bg-[#0A1A33] text-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ABOUT */}
          <div>
            <h4 className="text-lg font-semibold text-[#14B8A6] mb-4">About</h4>
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Rajarata University of Sri Lanka
            </p>
            <p className="text-sm mt-2">
              Hostel Management System – central portal for hostel operations.
            </p>
            <p className="text-sm mt-2 italic text-[#38BDF8]">
              “Where management meets innovation.”
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h4 className="text-lg font-semibold text-[#14B8A6] mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {["Home", "How it Works", "Features", "About Us"].map(
                (link, idx) => (
                  <li key={idx}>
                    <Link
                      to={`/#${link.toLowerCase().replace(/\s/g, "-")}`}
                      className="hover:text-[#38BDF8] transition"
                    >
                      {link}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h4 className="text-lg font-semibold text-[#14B8A6] mb-4">
              Contact
            </h4>
            <p className="text-sm">
              Email:{" "}
              <a
                href="mailto:hostel.support@rusl.ac.lk"
                className="underline hover:text-[#38BDF8]"
              >
                hostel.support@rusl.ac.lk
              </a>
            </p>
            <p className="text-sm mt-2">Phone: +94-77 0300 424 </p>
            <p className="text-sm mt-2">
              Faculty of Technology, Rajarata University of Sri Lanka
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              {[
                {
                  icon: <FaFacebookF />,
                  url: "https://facebook.com",
                  color: "#1877F2",
                },
                {
                  icon: <FaInstagram />,
                  url: "https://instagram.com",
                  color: "#E4405F",
                },
                {
                  icon: <FaLinkedinIn />,
                  url: "https://linkedin.com",
                  color: "#0A66C2",
                },
                {
                  icon: <FaTwitter />,
                  url: "https://twitter.com",
                  color: "#1DA1F2",
                },
                {
                  icon: <FaYoutube />,
                  url: "https://youtube.com",
                  color: "#FF0000",
                },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-all shadow-md"
                  style={{ color: item.color }}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* JOIN COMMUNITY */}
          <div>
            <h4 className="text-lg font-semibold text-[#14B8A6] mb-4">
              Join Our Community
            </h4>
            <p className="text-gray-400 mb-4 text-sm">
              Subscribe to get updates about hostel features, events, and
              improvements.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:flex-1 px-3 py-2 rounded-md bg-[#0A1A33] text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#38BDF8] text-sm"
              />
              <button
                onClick={handleJoin}
                className="px-4 py-2 bg-[#14B8A6] rounded-md font-semibold hover:bg-[#10998d] transition text-white"
              >
                Join Now
              </button>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              Stay informed — new features, student updates, and events
              delivered to your inbox!
            </p>
          </div>
        </div>

        {/* SUB-FOOTER */}
        <div className="bg-[#08142A] border-t border-gray-700 py-4 flex flex-col items-center gap-2">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} Hostel Management System. All rights
            reserved.
          </p>
          <p className="text-gray-500 text-xs text-center">
            Designed & Developed by Team Smart Squad
          </p>
        </div>
      </footer>
    </div>
  );
}