const fs = require('fs');

const content = fs.readFileSync('src/App.jsx', 'utf8');

function extractBetween(str, start, end) {
  const s = str.indexOf(start);
  if (s === -1) return null;
  const e = str.indexOf(end, s + start.length);
  if (e === -1) return null;
  return str.slice(s, e);
}

// Data to move
const dataExtracts = {
  Navbar: 'const [menu, setMenu] = React.useState(false);',
  Hero: extractBetween(content, 'const features = [', '  const products = ['),
  Products: extractBetween(content, 'const products = [', '  const projects = ['),
  Projects: extractBetween(content, 'const projects = [', '  const reasons = ['),
  WhyChooseUs: extractBetween(content, 'const reasons = [', '  const workflowSteps = ['),
  Workflow: extractBetween(content, 'const workflowSteps = [', '  const newsList = ['),
  News: extractBetween(content, 'const newsList = [', '  return ('),
  Footer: 'const { Phone, Mail, MapPin, ArrowUp } = require("lucide-react"); // just dummy data for footer to prevent undefined',
};

// Sections
const sections = {
  Navbar: extractBetween(content, '{/* ================= NAVBAR ================= */}', '{/* ================= HERO ================= */}'),
  Hero: extractBetween(content, '{/* ================= HERO ================= */}', '{/* ================= PRODUCTS ================= */}'),
  Products: extractBetween(content, '{/* ================= PRODUCTS ================= */}', '{/* ================= PROJECTS ================= */}'),
  Projects: extractBetween(content, '{/* ================= PROJECTS ================= */}', '{/* ================= WHY CHOOSE US ================= */}'),
  WhyChooseUs: extractBetween(content, '{/* ================= WHY CHOOSE US ================= */}', '{/* ================= WORKFLOW ================= */}'),
  Workflow: extractBetween(content, '{/* ================= WORKFLOW ================= */}', '{/* ================= NEWS ================= */}'),
  News: extractBetween(content, '{/* ================= NEWS ================= */}', '{/* ================= PARTNERS ================= */}'),
  Partners: extractBetween(content, '{/* ================= PARTNERS ================= */}', '{/* ================= FOOTER ================= */}'),
  Footer: extractBetween(content, '{/* ================= FOOTER ================= */}', '</>\n  );'),
};

const imports = {
  Navbar: 'import React from "react";\nimport { Menu, X, ChevronDown, Phone } from "lucide-react";',
  Hero: 'import React from "react";\nimport heroBg from "../assets/hero_bg.png";\nimport { ShieldCheck, Leaf, Sparkles, Users, CalendarCheck, BadgeCheck, Settings } from "lucide-react";',
  Products: 'import React from "react";\nimport { ArrowRight, Home, AlignJustify, ArrowRightLeft, Columns } from "lucide-react";',
  Projects: 'import React from "react";\nimport { ArrowRight } from "lucide-react";',
  WhyChooseUs: 'import React from "react";\nimport { BadgeCheck, Wrench, CircleDollarSign, Headphones, Phone } from "lucide-react";',
  Workflow: 'import React from "react";\nimport { MessageSquare, ClipboardList, FileSignature, Settings, ShieldCheck, ArrowRight } from "lucide-react";',
  News: 'import React from "react";\nimport { ArrowRight } from "lucide-react";',
  Partners: 'import React from "react";',
  Footer: 'import React from "react";\nimport { Phone, Mail, MapPin, ArrowUp } from "lucide-react";',
};

for (const key in sections) {
  if (Object.prototype.hasOwnProperty.call(sections, key)) {
    const jsx = sections[key];
    if (!jsx) continue;
    
    let componentCode = imports[key] + '\\n\\nexport default function ' + key + '() {\\n';
    
    if (dataExtracts[key]) {
      componentCode += '  ' + dataExtracts[key].trim() + '\\n\\n';
    } else if (key === 'Navbar') {
      componentCode += '  ' + dataExtracts['Navbar'] + '\\n\\n';
    }
    
    // For footer add floating button logic
    let jsxContent = jsx.trim();
    if (key === 'Footer') {
      const floatStr = extractBetween(content, '{/* ================= FLOATING BUTTON ================= */}', '</>');
      if (floatStr) jsxContent += '\\n\\n' + floatStr.trim();
    }

    componentCode += '  return (\\n    <>\\n      ' + jsxContent + '\\n    </>\\n  );\\n}\\n';
    
    fs.writeFileSync('src/components/' + key + '.jsx', componentCode.replace(/\\n/g, '\\n'));
  }
}

const newAppJsx = 'import React from "react";\\n' +
'import "./App.css";\\n' +
'import Navbar from "./components/Navbar";\\n' +
'import Hero from "./components/Hero";\\n' +
'import Products from "./components/Products";\\n' +
'import Projects from "./components/Projects";\\n' +
'import WhyChooseUs from "./components/WhyChooseUs";\\n' +
'import Workflow from "./components/Workflow";\\n' +
'import News from "./components/News";\\n' +
'import Partners from "./components/Partners";\\n' +
'import Footer from "./components/Footer";\\n\\n' +
'export default function App() {\\n' +
'  return (\\n' +
'    <>\\n' +
'      <Navbar />\\n' +
'      <Hero />\\n' +
'      <Products />\\n' +
'      <Projects />\\n' +
'      <WhyChooseUs />\\n' +
'      <Workflow />\\n' +
'      <News />\\n' +
'      <Partners />\\n' +
'      <Footer />\\n' +
'    </>\\n' +
'  );\\n' +
'}\\n';

fs.writeFileSync('src/App.jsx', newAppJsx.replace(/\\n/g, '\n'));
console.log('Successfully refactored App.jsx into components');
