import {
  Code2,
  Palette,
  BarChart3,
  Megaphone,
  ShieldCheck,
  Container,
  Brain,
  Cloud,
  Zap,
  ScanSearch,
  Lock,
  BadgeCheck,
} from 'lucide-react';

/* ──────────────────────────── Stats ──────────────────────────── */
export const stats = [
  { id: 1, value: 10000, suffix: '+', label: 'Active Jobs' },
  { id: 2, value: 5000, suffix: '+', label: 'Companies' },
  { id: 3, value: 20000, suffix: '+', label: 'Candidates' },
  { id: 4, value: 3000, suffix: '+', label: 'Hired This Month' },
];

/* ──────────────────────────── Categories ──────────────────────────── */
export const categories = [
  { id: 1, title: 'Software Development', icon: Code2, openings: 2340, color: '#338dff' },
  { id: 2, title: 'UI/UX Design', icon: Palette, openings: 1120, color: '#d946ef' },
  { id: 3, title: 'Data Science', icon: BarChart3, openings: 1540, color: '#10b981' },
  { id: 4, title: 'Marketing', icon: Megaphone, openings: 890, color: '#f59e0b' },
  { id: 5, title: 'Cyber Security', icon: ShieldCheck, openings: 760, color: '#ef4444' },
  { id: 6, title: 'DevOps', icon: Container, openings: 980, color: '#8b5cf6' },
  { id: 7, title: 'AI / ML', icon: Brain, openings: 1870, color: '#06b6d4' },
  { id: 8, title: 'Cloud Computing', icon: Cloud, openings: 1230, color: '#ec4899' },
];

/* ──────────────────────────── Featured Jobs ──────────────────────────── */
export const featuredJobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'Google',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg',
    salary: '₹12L – ₹25L PA',
    experience: '4-6 years',
    location: 'Pune, Maharashtra',
    type: 'Full-time',
    posted: '2 days ago',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    featured: true,
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'Figma',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/figma.svg',
    salary: '₹8L – ₹15L PA',
    experience: '3-5 years',
    location: 'Mumbai, Maharashtra',
    type: 'Remote',
    posted: '1 day ago',
    skills: ['Figma', 'Prototyping', 'Design Systems', 'User Research'],
    featured: true,
  },
  {
    id: 3,
    title: 'ML Engineer',
    company: 'OpenAI',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/openai.svg',
    salary: '₹15L – ₹30L PA',
    experience: '2+ years',
    location: 'Bangalore, Karnataka',
    type: 'Hybrid',
    posted: '3 days ago',
    skills: ['Python', 'PyTorch', 'LLMs', 'MLOps'],
    featured: false,
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'Amazon',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/amazonaws.svg',
    salary: '₹10L – ₹20L PA',
    experience: '3-6 years',
    location: 'Hyderabad, Telangana',
    type: 'Full-time',
    posted: '5 days ago',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD'],
    featured: false,
  },
  {
    id: 5,
    title: 'Full Stack Developer',
    company: 'Microsoft',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoft.svg',
    salary: '₹9L – ₹18L PA',
    experience: '3-5 years',
    location: 'Pune, Maharashtra',
    type: 'Hybrid',
    posted: '1 day ago',
    skills: ['React', 'C#', '.NET', 'Azure'],
    featured: true,
  },
  {
    id: 6,
    title: 'Data Analyst',
    company: 'Meta',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/meta.svg',
    salary: '₹6L – ₹12L PA',
    experience: '2-4 years',
    location: 'Hyderabad, Telangana',
    type: 'Remote',
    posted: '4 days ago',
    skills: ['SQL', 'Python', 'Tableau', 'Statistics'],
    featured: false,
  },
];

/* ──────────────────────────── Top Companies ──────────────────────────── */
export const topCompanies = [
  {
    id: 1,
    name: 'Google',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg',
    industry: 'Technology',
    openPositions: 142,
    rating: 4.8,
    description: 'Organizing the world\'s information',
  },
  {
    id: 2,
    name: 'Microsoft',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoft.svg',
    industry: 'Technology',
    openPositions: 198,
    rating: 4.7,
    description: 'Empowering every person and organization',
  },
  {
    id: 3,
    name: 'Amazon',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/amazonaws.svg',
    industry: 'E-commerce & Cloud',
    openPositions: 256,
    rating: 4.5,
    description: 'From A to Z, and everything in between',
  },
  {
    id: 4,
    name: 'Apple',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/apple.svg',
    industry: 'Technology',
    openPositions: 87,
    rating: 4.9,
    description: 'Think different, build different',
  },
  {
    id: 5,
    name: 'Meta',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/meta.svg',
    industry: 'Social Media',
    openPositions: 113,
    rating: 4.4,
    description: 'Building the future of connection',
  },
  {
    id: 6,
    name: 'Netflix',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/netflix.svg',
    industry: 'Entertainment',
    openPositions: 64,
    rating: 4.6,
    description: 'Entertainment reimagined',
  },
];

/* ──────────────────────────── Why Choose Us ──────────────────────────── */
export const features = [
  {
    id: 1,
    title: 'Fast Hiring',
    description: 'Get hired within 48 hours with our accelerated recruitment pipeline powered by smart algorithms.',
    icon: Zap,
    color: '#338dff',
  },
  {
    id: 2,
    title: 'AI Resume Matching',
    description: 'Our AI analyses your resume and matches you with the most relevant positions automatically.',
    icon: ScanSearch,
    color: '#d946ef',
  },
  {
    id: 3,
    title: 'Secure Platform',
    description: 'End-to-end encryption and SOC 2 compliance ensures your data remains private and secure.',
    icon: Lock,
    color: '#10b981',
  },
  {
    id: 4,
    title: 'Verified Companies',
    description: 'Every employer is verified through a rigorous multi-step process before posting jobs.',
    icon: BadgeCheck,
    color: '#f59e0b',
  },
];

/* ──────────────────────────── Testimonials ──────────────────────────── */
export const testimonials = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah',
    content: 'JobVerse completely transformed my job search. Within two weeks of signing up, I landed multiple interviews and received an offer from my dream company. The AI matching is incredibly accurate!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    role: 'Product Manager at Stripe',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus',
    content: 'The platform\'s interface is intuitive and the job recommendations are spot-on. I particularly love the salary transparency feature – it saved me so much time during negotiations.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Priya Sharma',
    role: 'Data Scientist at Meta',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Priya',
    content: 'As someone transitioning into data science, JobVerse helped me find companies that value diverse backgrounds. The resume builder and skills assessment tools are game-changers.',
    rating: 4,
  },
  {
    id: 4,
    name: 'Alex Rivera',
    role: 'UX Designer at Figma',
    avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex',
    content: 'I\'ve tried many job portals, but JobVerse stands out with its clean design and quality job listings. Every company is verified, so I never worry about scam postings.',
    rating: 5,
  },
];

/* ──────────────────────────── Navigation Links ──────────────────────────── */
export const navLinks = [
  { id: 1, label: 'Home', href: '#home' },
  { id: 2, label: 'Find Jobs', href: '#jobs' },
  { id: 3, label: 'Companies', href: '#companies' },
  { id: 4, label: 'About Us', href: '#about' },
  { id: 5, label: 'Contact', href: '#contact' },
];
