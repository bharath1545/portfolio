export const profile = {
  name: 'Bharath Bhat',
  location: 'Mangaluru, Karnataka, India',
  phone: '8971171986',
  email: 'bharathbhat87@gmail.com',
  linkedin: 'https://linkedin.com/in/bharath-bhat-153h',
  github: 'https://github.com/bharath1545',
  githubUser: 'bharath1545',
  resume: '/resume.pdf',
  portrait: '/me.jpeg' as string | null,
  positioning:
    'Aspiring VLSI and Semiconductor Engineer | Electronics and Communication Engineering | Embedded Systems Developer',
  summary:
    'Third-year ECE student at AJIET, Mangaluru (CGPA 8.2). Completed a one-month internship at NITK Surathkal. Experienced in Verilog HDL, ESP32-based IoT systems, and embedded hardware projects. First prize in CircuitX and Best Project Award at AJIET. Seeking opportunities in core electronics, VLSI, embedded systems, and software development.',
  roles: ['Embedded Systems', 'ESP32 IoT', 'Verilog designs', 'AI-integrated systems'],
}

export type Project = {
  slug: string
  title: string
  tags: string[]
  description: string
  room: string
  icon: string
}

export const projects: Project[] = [
  {
    slug: 'esp32-ai-weather-monitoring-system',
    title: 'ESP32 AI Weather Monitoring System',
    tags: ['ESP32', 'ThingSpeak', 'AI'],
    description:
      'ESP32-based weather monitoring with AI-assisted analysis; cloud data logging and visualization using ThingSpeak.',
    room: 'embedded',
    icon: '01',
  },
  {
    slug: 'esp32-ai-industrial-monitoring-system',
    title: 'ESP32 AI Industrial Monitoring System',
    tags: ['ESP32', 'ESP32-CAM', 'API Integration', 'AI'],
    description:
      'Monitors industrial parameters with AI-assisted analysis; API integration for data handling and remote monitoring.',
    room: 'embedded',
    icon: '02',
  },
  {
    slug: 'rc-plane-design-and-development',
    title: 'RC Plane Design and Development',
    tags: ['Motors', 'ESC', 'Servos', 'RF Module'],
    description:
      'Remote-controlled aircraft; designed the control mechanism for flight stability and movement.',
    room: 'hardware',
    icon: '03',
  },
  {
    slug: 'smart-queue-token-system',
    title: 'Smart Queue Token System',
    tags: ['Software'],
    description: 'Fully software-based smart token system to manage queues and reduce waiting time.',
    room: 'software',
    icon: '04',
  },
  {
    slug: 'ai-restaurant-service-bot',
    title: 'AI Restaurant Service Bot',
    tags: ['AI', 'API Integration'],
    description: 'AI-based bot to assist with customer orders; APIs enable automated interaction and service.',
    room: 'software',
    icon: '05',
  },
  {
    slug: 'height-measuring-system-using-ultrasonic-sensor',
    title: 'Height Measuring System using Ultrasonic Sensor',
    tags: ['Arduino', 'HC-SR04'],
    description: 'Improved accuracy through calibration and testing.',
    room: 'embedded',
    icon: '06',
  },
]

export type Door = {
  id: string
  number: string
  title: string
  short: string
  description: string
  color: string
  skills: string[]
  certifications?: string[]
}

export const doors: Door[] = [
  {
    id: 'vlsi',
    number: '01',
    title: 'VLSI and Digital Design',
    short: 'From logic fundamentals to RTL-to-GDS learning.',
    description: 'Verilog HDL, Xilinx, digital electronics, and computer architecture.',
    color: '#cf593e',
    skills: ['Verilog HDL', 'Xilinx', 'Digital Electronics', 'Computer Architecture'],
    certifications: [
      'VLSI Design Flow: RTL to GDS',
      'Verilog HDL Programming',
      'VLSI Design: Chip Design and Verilog Programming',
    ],
  },
  {
    id: 'embedded',
    number: '02',
    title: 'Embedded and IoT',
    short: 'Connected hardware, sensing, and embedded builds.',
    description: 'ESP32, cloud logging, monitoring, and an ultrasonic height-measuring system.',
    color: '#43826b',
    skills: ['Microcontrollers', 'ESP32', 'Arduino', 'ThingSpeak', 'Sensor Integration', 'API Integration'],
  },
  {
    id: 'software',
    number: '03',
    title: 'AI and Software',
    short: 'Software projects with AI-assisted and API-integrated systems.',
    description: 'A smart queue token system and an AI restaurant service bot.',
    color: '#7062b6',
    skills: ['Python', 'C', 'Artificial Intelligence'],
    certifications: ['AI for Beginners'],
  },
  {
    id: 'hardware',
    number: '04',
    title: 'Hardware and Radio',
    short: 'Aircraft control, radio, antennas, and hands-on exposure.',
    description: 'An RC plane build and a one-month internship at NITK Surathkal.',
    color: '#bd8032',
    skills: [],
  },
]

export const skillGroups = [
  {
    name: 'Programming',
    skills: ['C', 'Python', 'Assembly Language', 'HTML', 'CSS'],
  },
  { name: 'Hardware Description', skills: ['Verilog HDL'] },
  {
    name: 'Core Electronics',
    skills: ['Analog Electronics', 'Digital Electronics', 'Computer Architecture'],
  },
  {
    name: 'Embedded and IoT',
    skills: [
      'Microcontrollers',
      'ESP32',
      'Arduino',
      'ThingSpeak',
      'Sensor Integration',
      'API Integration',
      'Artificial Intelligence',
    ],
  },
  { name: 'Tools', skills: ['LTspice', 'Multisim', 'KiCad', 'Octave', 'Xilinx', 'Git', 'GitHub'] },
  { name: 'Soft skills', skills: ['Teamwork', 'Leadership', 'Problem Solving', 'Communication'] },
]

export const education = [
  {
    school: 'AJ Institute of Engineering and Technology',
    detail: 'B.E. Electronics and Communication Engineering · Mangaluru',
    score: 'CGPA 8.2/10',
    start: 'Sep 2024',
    end: 'Jun 2028',
  },
  {
    school: 'Dr. NSAM PU College',
    detail: 'Class XII · State Board',
    score: '91.5%',
  },
  {
    school: 'Chinmaya High School',
    detail: 'Class X · State Board',
    score: '95.36%',
  },
]

export const internship = {
  organization: 'NITK Surathkal',
  duration: 'One month',
  description:
    'Exposure to disaster monitoring vehicles, ham radio, 3D printing, antennas, and choke building.',
}

export const awards = [
  { title: 'First Prize', detail: 'CircuitX Competition · AJIET' },
  { title: 'Best Project Award', detail: 'AJIET' },
]

export const certifications = [
  { name: 'VLSI Design Flow: RTL to GDS', issuer: 'NPTEL', badge: 'Elite' },
  { name: 'Verilog HDL Programming', issuer: 'Udemy' },
  { name: 'VLSI Design: Chip Design and Verilog Programming', issuer: 'Infosys Springboard' },
  { name: 'Networking Essentials', issuer: 'Cisco Networking Academy' },
  { name: 'AI for Beginners', issuer: 'HP LIFE' },
  { name: 'Industry to Institute Forum 5.1', issuer: 'IEEE CAS' },
]

export const facts = [
  { value: '8.2', label: 'CGPA', detail: 'out of 10' },
  { value: '06', label: 'Projects', detail: 'listed projects' },
  { value: '06', label: 'Certifications', detail: 'listed certifications' },
  { value: '02', label: 'Awards', detail: 'listed awards' },
]

export const tooltips: Record<string, string> = Object.fromEntries(
  skillGroups.flatMap((group) =>
    group.skills.map((skill) => {
      const usedIn = projects.filter((project) => project.tags.includes(skill)).map((project) => project.title)
      return [
        skill,
        usedIn.length ? `Listed in: ${usedIn.join(' · ')}` : `Listed under ${group.name}.`,
      ]
    }),
  ),
)
