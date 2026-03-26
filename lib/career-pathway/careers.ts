import type { Career } from './types';

export const CAREERS: Career[] = [
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    cluster: 'technical',
    subtitle: 'Build the interfaces people see and interact with on websites and apps.',
    timeToFirstIncome: {
      min: 6,
      max: 18,
      unit: 'months'
    },
    entryDifficulty: 'low-medium',
    requiresCertification: false,
    degreeDependence: 'low',
    portfolioImportance: 'critical',
    entryDescription: 'You need a portfolio of 3–5 projects you built yourself — not tutorials, but things you made. A strong GitHub profile and the ability to talk through your code in an interview.',
    freeLearningPathQuality: 'excellent',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'medium',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI generates components and boilerplate quickly. Senior judgment on architecture, accessibility, performance, and what a user actually needs remains human work. Demand is high and growing.',
    incomeRanges: {
      us: {
        min: 55000,
        max: 95000
      },
      uk: {
        min: 32000,
        max: 65000
      },
      global_remote: {
        min: 18000,
        max: 55000
      }
    },
    earningCeiling: 'high',
    scoringWeights: {
      personalityTraits: [
        'tech-quick',
        'creative',
        'analytical'
      ],
      schoolSubjects: [
        'tech-cs',
        'maths-sciences',
        'art-design'
      ],
      selfEfficacySignals: [
        'build-website-app'
      ],
      problemPreferences: [
        'technical'
      ],
      workdayPreferences: [
        'building'
      ],
      conditionalAnswers: [
        'frontend',
        'fullstack'
      ],
      minHoursPerWeek: 10,
      idealHoursPerWeek: 20,
      maxIncomeUrgencyMonths: 18,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'earning-well',
        'remote-work',
        'clear-growth'
      ],
      aiPreferenceMatch: [
        'lean-into-ai',
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You said you believe you could build a website or app — and your interest in {problem} points directly here. As a Frontend Developer, you turn designs and logic into the actual interfaces people use every day.',
    whyItFitsFallback: 'You show a strong technical and creative signal. Frontend development is where visual thinking meets code — you build the part of technology that people actually touch.',
    dailyLifeDescription: 'A typical day involves writing HTML, CSS, and JavaScript (usually React or Vue) to build UI components, fixing browser bugs, reviewing designs with a designer, and collaborating with backend developers on API integration. You spend a lot of time in a code editor, browser dev tools, and Figma.',
    honestCaveat: 'AI tools (Copilot, Cursor) are genuinely useful here — they generate boilerplate fast. The skill isn\'t memorising syntax anymore; it\'s knowing when AI output is wrong and why. Build real projects, not just tutorials.',
    resources: {
      startHere: {
        title: 'The Odin Project — Foundations (start with "How This Course Will Work")',
        url: 'https://www.theodinproject.com/paths/foundations/courses/foundations',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'The Odin Project (free, full curriculum)',
          url: 'https://www.theodinproject.com',
          description: 'The most complete free frontend curriculum. Takes 6–12 months full-time.'
        },
        {
          title: 'freeCodeCamp — Responsive Web Design',
          url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
          description: 'Browser-based, no setup, starts from zero. Good alongside The Odin Project.'
        },
        {
          title: 'Frontend Mentor (portfolio projects)',
          url: 'https://www.frontendmentor.io',
          description: 'Real design briefs to build portfolio projects. Shows employers you can implement a design.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'What is a Front-End Developer? (Fireship)',
          url: 'https://www.youtube.com/watch?v=WG5ikvJ2TKA',
          description: 'Fast, honest explainer of what frontend development actually involves day-to-day.'
        }
      ]
    }
  },
  {
    id: 'backend-dev',
    title: 'Backend Developer',
    cluster: 'technical',
    subtitle: 'Build the servers, APIs, and databases that power every application behind the scenes.',
    timeToFirstIncome: {
      min: 9,
      max: 18,
      unit: 'months'
    },
    entryDifficulty: 'medium',
    requiresCertification: false,
    degreeDependence: 'low',
    portfolioImportance: 'critical',
    entryDescription: 'You need 2–3 deployed projects with working APIs, a database, and authentication. Employers want to see that you can build something that handles real data and real users — not just localhost demos.',
    freeLearningPathQuality: 'good',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'medium',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI writes boilerplate CRUD code well but struggles with complex system design — database schema decisions, security architecture, scaling strategies, and debugging production issues. The thinking work is safe; the typing work is not.',
    incomeRanges: {
      us: {
        min: 60000,
        max: 95000
      },
      uk: {
        min: 35000,
        max: 70000
      },
      global_remote: {
        min: 20000,
        max: 60000
      }
    },
    earningCeiling: 'high',
    scoringWeights: {
      personalityTraits: [
        'analytical',
        'tech-quick'
      ],
      schoolSubjects: [
        'maths-sciences',
        'tech-cs'
      ],
      selfEfficacySignals: [
        'build-website-app'
      ],
      problemPreferences: [
        'technical'
      ],
      workdayPreferences: [
        'building'
      ],
      conditionalAnswers: [
        'backend'
      ],
      minHoursPerWeek: 10,
      idealHoursPerWeek: 20,
      maxIncomeUrgencyMonths: 18,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'earning-well',
        'remote-work',
        'clear-growth'
      ],
      aiPreferenceMatch: [
        'lean-into-ai',
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You said you believe you could build a website or app — and your analytical mindset suits {problem} well. Backend development is where logic, data, and systems thinking come together to make everything work.',
    whyItFitsFallback: 'You show strong analytical and technical signals. Backend development is the engine room of every app — you design the logic, manage the data, and make things scale.',
    dailyLifeDescription: 'A typical day involves writing API endpoints, designing database schemas, debugging server-side issues, writing tests, and reviewing pull requests. You work in Node.js/Python/Go, use tools like Postman, database clients, and Docker, and spend time thinking about how data flows through a system.',
    honestCaveat: 'Backend development is where most of the logic lives. You won\'t see your work directly, but every product depends on it. Node.js and Python are the best starting points.',
    resources: {
      startHere: {
        title: 'The Odin Project — NodeJS Path (start with "Introduction to the Back End")',
        url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'The Odin Project — NodeJS (free, full curriculum)',
          url: 'https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs',
          description: 'Comprehensive backend curriculum using Node.js and Express. Builds on frontend foundations.'
        },
        {
          title: 'freeCodeCamp — Back End Development and APIs',
          url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/',
          description: 'Hands-on projects building APIs with Node.js and MongoDB. Free, browser-based.'
        },
        {
          title: 'roadmap.sh — Backend Developer Roadmap',
          url: 'https://roadmap.sh/backend',
          description: 'Visual guide showing every skill in order. Useful for tracking your progress.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'Backend web development - a complete overview (Fireship)',
          url: 'https://www.youtube.com/watch?v=XBu54nfzxAQ',
          description: 'Concise overview of what backend developers do and the technologies involved.'
        }
      ]
    }
  },
  {
    id: 'fullstack-dev',
    title: 'Full-Stack Developer',
    cluster: 'technical',
    subtitle: 'Build entire applications from the user interface to the server and database — the complete picture.',
    timeToFirstIncome: {
      min: 12,
      max: 24,
      unit: 'months'
    },
    entryDifficulty: 'high',
    requiresCertification: false,
    degreeDependence: 'low',
    portfolioImportance: 'critical',
    entryDescription: 'You need 2–3 complete, deployed applications with frontend, backend, database, and authentication. Each should solve a real problem. Employers want proof you can own an entire product, not just one layer.',
    freeLearningPathQuality: 'excellent',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'medium',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI accelerates both frontend and backend coding, but the ability to architect a complete system — deciding how pieces connect, what to build first, and where performance bottlenecks will appear — is deeply human. Full-stack developers who use AI well are more productive than ever.',
    incomeRanges: {
      us: {
        min: 70000,
        max: 120000
      },
      uk: {
        min: 40000,
        max: 85000
      },
      global_remote: {
        min: 25000,
        max: 70000
      }
    },
    earningCeiling: 'very-high',
    scoringWeights: {
      personalityTraits: [
        'tech-quick',
        'analytical'
      ],
      schoolSubjects: [
        'tech-cs',
        'maths-sciences'
      ],
      selfEfficacySignals: [
        'build-website-app'
      ],
      problemPreferences: [
        'technical'
      ],
      workdayPreferences: [
        'building'
      ],
      conditionalAnswers: [
        'fullstack'
      ],
      minHoursPerWeek: 10,
      idealHoursPerWeek: 20,
      maxIncomeUrgencyMonths: 24,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'earning-well',
        'remote-work',
        'clear-growth'
      ],
      aiPreferenceMatch: [
        'lean-into-ai',
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You said you believe you could build a website or app — and your draw to {problem} suggests you want to understand the whole system. Full-stack development gives you the power to build complete products from scratch.',
    whyItFitsFallback: 'You show strong technical and analytical signals. Full-stack development is the most versatile technical career — you can build anything, join any team, or launch your own product.',
    dailyLifeDescription: 'A typical day moves between frontend and backend tasks — you might build a React component in the morning, write an API endpoint after lunch, debug a database query, and review a deployment pipeline before end of day. You use a code editor, browser dev tools, terminal, database clients, and Git constantly.',
    honestCaveat: 'This takes longer because you\'re learning two disciplines. Start with frontend, add backend once you\'re comfortable. Don\'t try to learn both at once from scratch.',
    resources: {
      startHere: {
        title: 'The Odin Project — Full Stack JavaScript Path',
        url: 'https://www.theodinproject.com/paths/full-stack-javascript',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'The Odin Project — Full Stack JavaScript (free, complete)',
          url: 'https://www.theodinproject.com/paths/full-stack-javascript',
          description: 'The gold standard free full-stack curriculum. HTML/CSS → JavaScript → Node.js → React.'
        },
        {
          title: 'Full Stack Open (University of Helsinki)',
          url: 'https://fullstackopen.com/en/',
          description: 'Deep dive into React, Node, GraphQL, TypeScript. University-quality, completely free.'
        },
        {
          title: 'freeCodeCamp — Full Stack Certifications',
          url: 'https://www.freecodecamp.org',
          description: 'Multiple certifications covering responsive design, JavaScript algorithms, APIs, and more.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'How to become a Full Stack Developer (Fireship)',
          url: 'https://www.youtube.com/watch?v=rFP7rUYtOOg',
          description: 'Realistic breakdown of what full-stack means in practice and the learning path.'
        }
      ]
    }
  },
  {
    id: 'mobile-dev',
    title: 'Mobile App Developer',
    cluster: 'technical',
    subtitle: 'Build the apps people use on their phones every day — from idea to app store.',
    timeToFirstIncome: {
      min: 12,
      max: 24,
      unit: 'months'
    },
    entryDifficulty: 'medium-high',
    requiresCertification: false,
    degreeDependence: 'low',
    portfolioImportance: 'critical',
    entryDescription: 'You need 1–2 published apps (even simple ones) on the App Store or Google Play, plus source code on GitHub. Employers want to see that you understand the full lifecycle — building, testing, and shipping to a real store.',
    freeLearningPathQuality: 'good',
    remoteAvailability: 'high',
    aiDisplacementRisk: 'medium',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI helps generate UI code and boilerplate, but mobile development involves platform-specific quirks, performance tuning, and UX decisions that require hands-on judgment. The ecosystem moves fast — staying current is the real skill.',
    incomeRanges: {
      us: {
        min: 65000,
        max: 110000
      },
      uk: {
        min: 38000,
        max: 75000
      },
      global_remote: {
        min: 20000,
        max: 65000
      }
    },
    earningCeiling: 'high',
    scoringWeights: {
      personalityTraits: [
        'tech-quick',
        'creative'
      ],
      schoolSubjects: [
        'tech-cs',
        'maths-sciences'
      ],
      selfEfficacySignals: [
        'build-website-app'
      ],
      problemPreferences: [
        'technical'
      ],
      workdayPreferences: [
        'building'
      ],
      conditionalAnswers: [],
      minHoursPerWeek: 10,
      idealHoursPerWeek: 20,
      maxIncomeUrgencyMonths: 24,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'earning-well',
        'clear-growth'
      ],
      aiPreferenceMatch: [
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You said you believe you could build a website or app — and your interest in {problem} aligns with mobile development. You\'d build the apps people actually carry in their pockets.',
    whyItFitsFallback: 'You show strong technical and creative signals. Mobile development is tangible — you build something, put it on a phone, and watch people use it. That feedback loop is motivating.',
    dailyLifeDescription: 'A typical day involves writing Swift (iOS) or Kotlin (Android) or Dart (Flutter), testing on emulators and real devices, debugging layout issues across screen sizes, integrating APIs, and handling app store submissions. You use Xcode or Android Studio, Figma for designs, and spend time reading platform documentation.',
    honestCaveat: 'Pick one platform first — Android (Kotlin) if you already have an Android phone, iOS (Swift) if you have a Mac and iPhone. Cross-platform (Flutter/React Native) comes later.',
    resources: {
      startHere: {
        title: 'Flutter — Get Started (free, works on any OS)',
        url: 'https://docs.flutter.dev/get-started/install',
        timeMinutes: 20
      },
      learning: [
        {
          title: 'Flutter Official Codelabs (free)',
          url: 'https://docs.flutter.dev/codelabs',
          description: 'Hands-on guided projects from Google. The fastest way to build a cross-platform app.'
        },
        {
          title: 'Android Basics with Compose (Google, free)',
          url: 'https://developer.android.com/courses/android-basics-compose/course',
          description: 'Official Android course using Kotlin and Jetpack Compose. Comprehensive and free.'
        },
        {
          title: 'Develop in Swift Tutorials (Apple, free)',
          url: 'https://developer.apple.com/tutorials/develop-in-swift/',
          description: 'Apple\'s official SwiftUI tutorials. Requires a Mac.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'How to Start App Development? Complete Roadmap',
          url: 'https://www.youtube.com/watch?v=7nQsQ0rvYqQ',
          description: 'Beginner-friendly roadmap for getting into app development and choosing a practical path.'
        },
        {
          title: 'What Mobile Developers Need to Watch in 2026',
          url: 'https://www.youtube.com/watch?v=9ChTJedxIOI',
          description: 'Context on where mobile development is heading and what skills will matter next.'
        }
      ]
    }
  },
  {
    id: 'it-support',
    title: 'IT Support Specialist',
    cluster: 'technical',
    subtitle: 'Keep systems running, solve technical problems for users, and build the foundation for deeper tech careers.',
    timeToFirstIncome: {
      min: 3,
      max: 6,
      unit: 'months'
    },
    entryDifficulty: 'low',
    requiresCertification: true,
    certificationDetails: 'CompTIA A+ (~$250)',
    degreeDependence: 'low',
    portfolioImportance: 'low',
    entryDescription: 'Pass CompTIA A+ (~$250 for both exams) and you have a credible entry ticket. Set up a home lab (an old PC or virtual machines) to practice. Customer service experience is a genuine advantage here.',
    freeLearningPathQuality: 'good',
    remoteAvailability: 'medium',
    aiDisplacementRisk: 'low',
    humanJudgmentCentrality: 'medium-high',
    aiRealityDescription: 'AI chatbots handle tier-1 "have you tried restarting?" issues. But the moment a problem requires physical access, network diagnosis, or navigating an upset user, you need a human. IT support roles are expanding, not shrinking.',
    incomeRanges: {
      us: {
        min: 38000,
        max: 60000
      },
      uk: {
        min: 22000,
        max: 38000
      },
      global_remote: {
        min: 10000,
        max: 30000
      }
    },
    earningCeiling: 'moderate',
    scoringWeights: {
      personalityTraits: [
        'organised',
        'tech-quick'
      ],
      schoolSubjects: [
        'tech-cs',
        'maths-sciences'
      ],
      selfEfficacySignals: [
        'build-website-app',
        'explain-technical'
      ],
      problemPreferences: [
        'technical'
      ],
      workdayPreferences: [
        'building',
        'coordinating'
      ],
      conditionalAnswers: [],
      minHoursPerWeek: 5,
      idealHoursPerWeek: 15,
      maxIncomeUrgencyMonths: 6,
      requiresDegree: false,
      requiresCertBudget: true,
      requiresPaidTools: false,
      valuesMatch: [
        'stability',
        'clear-growth'
      ],
      aiPreferenceMatch: [
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You described yourself as {trait} and you need income relatively quickly. IT Support is one of the fastest entries into tech — and it\'s a proven launchpad for cybersecurity, cloud, and networking careers.',
    whyItFitsFallback: 'You show technical aptitude and want a stable, structured career path. IT support is the most accessible door into the technology industry, with clear certification-driven advancement.',
    dailyLifeDescription: 'A typical day involves responding to support tickets, troubleshooting hardware and software issues, setting up new employee workstations, managing user accounts in Active Directory, and documenting solutions in a knowledge base. You use remote desktop tools, ticketing systems (ServiceNow, Zendesk), and occasionally get hands-on with physical hardware.',
    honestCaveat: 'IT support is a real career but also a well-worn door into cybersecurity, networking, and cloud. Many people use it as a 6–12 month bridge while studying for their next cert.',
    resources: {
      startHere: {
        title: 'Professor Messer — CompTIA A+ Course (free YouTube series)',
        url: 'https://www.professormesser.com/free-a-plus-training/220-1101/220-1101-video/220-1101-training-course/',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'Professor Messer — CompTIA A+ (free, complete)',
          url: 'https://www.professormesser.com/free-a-plus-training/220-1101/220-1101-video/220-1101-training-course/',
          description: 'The best free A+ training available. Covers both 1101 and 1102 exams.'
        },
        {
          title: 'Google IT Support Professional Certificate (Coursera, auditable free)',
          url: 'https://www.coursera.org/professional-certificates/google-it-support',
          description: 'Google-backed cert covering networking, operating systems, security, and troubleshooting.'
        },
        {
          title: 'CompTIA A+ Exam Objectives (free PDF)',
          url: 'https://www.comptia.org/certifications/a',
          description: 'Official exam objectives — use this as your study checklist.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'HELPDESK - how to get started in IT (your first job)',
          url: 'https://www.youtube.com/watch?v=5xWnmUEi1Qw',
          description: 'Practical beginner overview of help desk work and how people break into IT support.'
        }
      ]
    }
  },
  {
    id: 'qa-engineer',
    title: 'QA / Test Engineer',
    cluster: 'technical',
    subtitle: 'Find bugs before users do — ensure software works correctly, reliably, and as expected.',
    timeToFirstIncome: {
      min: 6,
      max: 12,
      unit: 'months'
    },
    entryDifficulty: 'low-medium',
    requiresCertification: false,
    degreeDependence: 'low',
    portfolioImportance: 'moderate',
    entryDescription: 'Build a GitHub repo showing test plans, bug reports, and automated test scripts (even for a personal project). ISTQB Foundation certification helps but isn\'t required. Demonstrate systematic thinking in your interviews.',
    freeLearningPathQuality: 'good',
    remoteAvailability: 'high',
    aiDisplacementRisk: 'medium',
    humanJudgmentCentrality: 'medium-high',
    aiRealityDescription: 'AI can generate basic test cases and catch simple regressions. But understanding user intent, identifying edge cases that matter, and deciding what to test in the first place requires human judgment. QA engineers who write automation code are in higher demand than ever.',
    incomeRanges: {
      us: {
        min: 50000,
        max: 80000
      },
      uk: {
        min: 28000,
        max: 50000
      },
      global_remote: {
        min: 15000,
        max: 45000
      }
    },
    earningCeiling: 'high',
    scoringWeights: {
      personalityTraits: [
        'organised',
        'analytical'
      ],
      schoolSubjects: [
        'tech-cs',
        'maths-sciences'
      ],
      selfEfficacySignals: [
        'build-website-app',
        'data-sense'
      ],
      problemPreferences: [
        'technical'
      ],
      workdayPreferences: [
        'building',
        'analysing'
      ],
      conditionalAnswers: [],
      minHoursPerWeek: 10,
      idealHoursPerWeek: 20,
      maxIncomeUrgencyMonths: 12,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'stability',
        'clear-growth'
      ],
      aiPreferenceMatch: [
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You described yourself as {trait} — and that kind of systematic thinking is exactly what QA engineering demands. You\'d be the person who catches the bug before a million users hit it.',
    whyItFitsFallback: 'You show strong analytical and systematic signals. QA engineering is an underrated entry into tech — it teaches you how software works by learning how it breaks.',
    dailyLifeDescription: 'A typical day involves reviewing new features, writing test cases, executing manual tests, writing automated tests in Cypress or Playwright, filing bug reports with clear reproduction steps, and collaborating with developers on fixes. You use test management tools, browser dev tools, and spend time thinking about edge cases.',
    honestCaveat: 'Manual testing gets you in the door. Automation testing (Cypress, Playwright) doubles your salary. Learn the basics of JavaScript alongside QA.',
    resources: {
      startHere: {
        title: 'Ministry of Testing — 30 Days of Testing (free challenge)',
        url: 'https://www.ministryoftesting.com/30-days-of-testing',
        timeMinutes: 10
      },
      learning: [
        {
          title: 'Test Automation University (free)',
          url: 'https://testautomationu.applitools.com',
          description: 'Free courses on Cypress, Playwright, Selenium, and testing fundamentals.'
        },
        {
          title: 'The Odin Project — Testing JavaScript',
          url: 'https://www.theodinproject.com/lessons/node-path-javascript-testing-basics',
          description: 'Learn testing fundamentals as part of a broader JavaScript education.'
        },
        {
          title: 'Ministry of Testing — Beginner Resources',
          url: 'https://www.ministryoftesting.com/beginners',
          description: 'Curated resources for people new to software testing.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'What is Software Testing? Careers in QA (freeCodeCamp)',
          url: 'https://www.youtube.com/watch?v=jydYq7oAtD8',
          description: 'Practical introduction to software testing concepts and tools — the foundation of a QA engineering career.'
        }
      ]
    }
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    cluster: 'technical',
    subtitle: 'Protect organisations from hackers, data breaches, and security threats — one of the fastest-growing fields in tech.',
    timeToFirstIncome: {
      min: 9,
      max: 18,
      unit: 'months'
    },
    entryDifficulty: 'medium',
    requiresCertification: true,
    certificationDetails: 'CompTIA Security+ (~$400)',
    degreeDependence: 'low',
    portfolioImportance: 'moderate',
    entryDescription: 'Pass CompTIA Security+ (~$400) as your entry credential. Build a home lab with virtual machines to practice. TryHackMe and HackTheBox profiles showing completed challenges serve as your portfolio.',
    freeLearningPathQuality: 'good',
    remoteAvailability: 'high',
    aiDisplacementRisk: 'low',
    humanJudgmentCentrality: 'very-high',
    aiRealityDescription: 'AI helps with threat detection and log analysis, but attack surfaces keep expanding and attackers use AI too. The human skills — contextual judgment, incident response under pressure, understanding attacker psychology — are irreplaceable. This field has a massive talent shortage.',
    incomeRanges: {
      us: {
        min: 65000,
        max: 110000
      },
      uk: {
        min: 38000,
        max: 72000
      },
      global_remote: {
        min: 20000,
        max: 55000
      }
    },
    earningCeiling: 'very-high',
    scoringWeights: {
      personalityTraits: [
        'analytical',
        'tech-quick'
      ],
      schoolSubjects: [
        'tech-cs',
        'maths-sciences'
      ],
      selfEfficacySignals: [
        'build-website-app'
      ],
      problemPreferences: [
        'technical'
      ],
      workdayPreferences: [
        'building',
        'analysing'
      ],
      conditionalAnswers: [
        'cybersecurity'
      ],
      minHoursPerWeek: 10,
      idealHoursPerWeek: 20,
      maxIncomeUrgencyMonths: 18,
      requiresDegree: false,
      requiresCertBudget: true,
      requiresPaidTools: false,
      valuesMatch: [
        'earning-well',
        'stability',
        'clear-growth'
      ],
      aiPreferenceMatch: [
        'human-central',
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You described yourself as {trait} and you\'re drawn to technical problem-solving. Cybersecurity is where analytical thinking meets real stakes — you\'d be the person standing between an organisation and the people trying to break in.',
    whyItFitsFallback: 'You show strong analytical and technical signals. Cybersecurity has a massive talent gap — there are more open jobs than qualified people. It\'s one of the most recession-proof careers in tech.',
    dailyLifeDescription: 'A typical day involves monitoring security alerts in a SIEM dashboard, investigating suspicious activity, running vulnerability scans, reviewing firewall logs, writing incident reports, and staying current on new threats. You use tools like Wireshark, Nmap, Burp Suite, and various SIEM platforms.',
    honestCaveat: 'This is a certification-driven field. CompTIA Security+ (~$400) is the accepted entry ticket. Budget for this before you start — most employers won\'t hire without it.',
    resources: {
      startHere: {
        title: 'TryHackMe — Introduction to Cyber Security (free)',
        url: 'https://tryhackme.com/path/outline/introtocyber',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'TryHackMe — Pre-Security and Complete Beginner paths (free tiers)',
          url: 'https://tryhackme.com',
          description: 'Hands-on, browser-based cybersecurity training. The best way to learn by doing.'
        },
        {
          title: 'Professor Messer — CompTIA Security+ (free YouTube series)',
          url: 'https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/',
          description: 'Complete free video course covering the Security+ exam. Same quality as the A+ series.'
        },
        {
          title: 'Cybrary — Free cybersecurity courses',
          url: 'https://www.cybrary.it',
          description: 'Free courses on security fundamentals, ethical hacking, and incident response.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'Cyber Security In 7 Minutes',
          url: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
          description: 'Short beginner overview of cybersecurity roles, paths, and what the work looks like.'
        },
        {
          title: 'How to Get Into Cybersecurity for Beginners',
          url: 'https://www.youtube.com/watch?v=kVnvIBNiC58',
          description: 'Entry-level guidance on what cybersecurity involves and how to start learning it.'
        }
      ]
    }
  },
  {
    id: 'devops-cloud',
    title: 'DevOps / Cloud Engineer',
    cluster: 'technical',
    subtitle: 'Build and maintain the infrastructure that keeps applications running, scaling, and deploying reliably.',
    timeToFirstIncome: {
      min: 12,
      max: 24,
      unit: 'months'
    },
    entryDifficulty: 'high',
    requiresCertification: true,
    certificationDetails: 'AWS/Azure cert (~$150–300)',
    degreeDependence: 'low',
    portfolioImportance: 'high',
    entryDescription: 'You need a cloud certification (AWS Cloud Practitioner is the easiest start at ~$150), a GitHub with infrastructure-as-code projects (Terraform, Docker), and ideally some prior experience in development or system administration.',
    freeLearningPathQuality: 'moderate',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'low-medium',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI can write Terraform configs and Dockerfiles, but the architecture decisions — which services to use, how to handle failover, cost optimization, security posture — require deep contextual understanding. DevOps engineers who use AI are faster, but the judgment layer is growing more important.',
    incomeRanges: {
      us: {
        min: 75000,
        max: 130000
      },
      uk: {
        min: 45000,
        max: 90000
      },
      global_remote: {
        min: 25000,
        max: 70000
      }
    },
    earningCeiling: 'very-high',
    scoringWeights: {
      personalityTraits: [
        'analytical',
        'tech-quick'
      ],
      schoolSubjects: [
        'tech-cs',
        'maths-sciences'
      ],
      selfEfficacySignals: [
        'build-website-app'
      ],
      problemPreferences: [
        'technical'
      ],
      workdayPreferences: [
        'building'
      ],
      conditionalAnswers: [
        'devops'
      ],
      minHoursPerWeek: 10,
      idealHoursPerWeek: 20,
      maxIncomeUrgencyMonths: 24,
      requiresDegree: false,
      requiresCertBudget: true,
      requiresPaidTools: false,
      valuesMatch: [
        'earning-well',
        'remote-work',
        'clear-growth'
      ],
      aiPreferenceMatch: [
        'lean-into-ai',
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You described yourself as {trait} and you want a high-earning technical career. DevOps/Cloud engineering sits at the intersection of coding and infrastructure — you\'d be the person who makes sure everything stays up and scales.',
    whyItFitsFallback: 'You show strong technical and analytical signals with patience for a longer learning curve. DevOps/Cloud is one of the highest-paying technical paths — the supply of qualified engineers is well below demand.',
    dailyLifeDescription: 'A typical day involves writing infrastructure-as-code (Terraform, CloudFormation), managing CI/CD pipelines, monitoring application health with Datadog or Grafana, debugging deployment failures, optimizing cloud costs, and responding to production incidents. You live in the terminal, use Docker/Kubernetes daily, and work across AWS/Azure/GCP consoles.',
    honestCaveat: 'This is not an entry-level path. Most successful DevOps engineers started in either development or sysadmin. Build a foundation first.',
    resources: {
      startHere: {
        title: 'AWS Cloud Practitioner Essentials (free, official)',
        url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'AWS Cloud Practitioner Essentials (free)',
          url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/',
          description: 'Official AWS training for the entry-level cert. Free and comprehensive.'
        },
        {
          title: 'KodeKloud — DevOps Learning Path (free tier)',
          url: 'https://kodekloud.com',
          description: 'Hands-on labs for Docker, Kubernetes, Terraform, and CI/CD. The best practical training.'
        },
        {
          title: 'roadmap.sh — DevOps Roadmap',
          url: 'https://roadmap.sh/devops',
          description: 'Visual guide to every skill you need, in order. Bookmark and track your progress.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'DevOps Roadmap for Beginners',
          url: 'https://www.youtube.com/watch?v=_I94-tJlovg',
          description: 'Clear beginner introduction to the DevOps path, tools, and progression.'
        },
        {
          title: 'Cloud and DevOps Career Guide',
          url: 'https://www.youtube.com/watch?v=zG1cM9VSINg',
          description: 'Helpful overview of what cloud and DevOps work looks like in practice.'
        }
      ]
    }
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    cluster: 'data',
    subtitle: 'Turn raw data into clear insights that help businesses make better decisions.',
    timeToFirstIncome: {
      min: 6,
      max: 12,
      unit: 'months'
    },
    entryDifficulty: 'low-medium',
    requiresCertification: false,
    degreeDependence: 'low',
    portfolioImportance: 'high',
    entryDescription: 'You need 2–3 portfolio projects showing end-to-end analysis: take a real dataset, clean it, analyse it, visualise it, and explain what it means. SQL proficiency is non-negotiable. A Google Data Analytics Certificate on Coursera (auditable free) helps but isn\'t required.',
    freeLearningPathQuality: 'good',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'medium-high',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI can generate SQL queries and basic charts, but knowing which questions to ask, understanding business context, spotting when data is misleading, and communicating findings to non-technical stakeholders — that\'s all human. The best analysts use AI to move faster, not to replace thinking.',
    incomeRanges: {
      us: {
        min: 55000,
        max: 95000
      },
      uk: {
        min: 30000,
        max: 65000
      },
      global_remote: {
        min: 18000,
        max: 55000
      }
    },
    earningCeiling: 'high',
    scoringWeights: {
      personalityTraits: [
        'analytical',
        'organised'
      ],
      schoolSubjects: [
        'maths-sciences',
        'business-economics'
      ],
      selfEfficacySignals: [
        'data-sense'
      ],
      problemPreferences: [
        'data-analysis'
      ],
      workdayPreferences: [
        'analysing'
      ],
      conditionalAnswers: [
        'data-analyst'
      ],
      minHoursPerWeek: 10,
      idealHoursPerWeek: 20,
      maxIncomeUrgencyMonths: 12,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'earning-well',
        'clear-growth',
        'remote-work'
      ],
      aiPreferenceMatch: [
        'lean-into-ai',
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You said you have a sense for patterns in data — and your interest in {problem} confirms that. Data analysts are the people who turn numbers into narratives that drive real business decisions.',
    whyItFitsFallback: 'You show strong analytical and systematic signals. Data analysis is one of the most accessible high-paying careers — every company has data, and most don\'t know what to do with it.',
    dailyLifeDescription: 'A typical day involves writing SQL queries to pull data, cleaning messy datasets in Excel or Python, building dashboards in Tableau or Power BI, meeting with stakeholders to understand what they need, and presenting findings in clear, visual slides. You use SQL, spreadsheets, a visualisation tool, and increasingly Python.',
    honestCaveat: 'SQL, Excel/Google Sheets, and one visualisation tool (Tableau or Power BI) is the minimum stack. Python with pandas comes next. Build a portfolio with real datasets from Kaggle.',
    resources: {
      startHere: {
        title: 'Google Data Analytics Certificate — Course 1 Preview (free on Coursera)',
        url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'Google Data Analytics Professional Certificate (Coursera, auditable free)',
          url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
          description: 'Comprehensive intro to data analytics. Covers spreadsheets, SQL, Tableau, and R.'
        },
        {
          title: 'SQLBolt — Interactive SQL lessons (free)',
          url: 'https://sqlbolt.com',
          description: 'Learn SQL in your browser with interactive exercises. Takes about 4–6 hours total.'
        },
        {
          title: 'Kaggle — Free micro-courses and datasets',
          url: 'https://www.kaggle.com/learn',
          description: 'Short courses on Python, pandas, and data visualisation, plus real datasets for portfolio projects.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'Data Analyst Career Guide',
          url: 'https://www.youtube.com/watch?v=dJA7k58zlA8',
          description: 'Accessible overview of what data analysts do, what to learn, and how to get started.'
        },
        {
          title: 'How to Become a Data Analyst',
          url: 'https://www.youtube.com/watch?v=E8nynRXpX4A',
          description: 'Beginner-friendly breakdown of the learning path, tools, and entry expectations.'
        }
      ]
    }
  },
  {
    id: 'data-engineer',
    title: 'Data Engineer',
    cluster: 'data',
    subtitle: 'Build the pipelines and infrastructure that move, transform, and store data at scale.',
    timeToFirstIncome: {
      min: 18,
      max: 36,
      unit: 'months'
    },
    entryDifficulty: 'high',
    requiresCertification: false,
    degreeDependence: 'moderate',
    portfolioImportance: 'high',
    entryDescription: 'You need strong SQL, Python, and experience with at least one cloud platform (AWS, GCP, or Azure). Build a portfolio project that includes a data pipeline — extracting data from an API, transforming it, and loading it into a warehouse. Prior experience as a data analyst or backend developer is the most common entry path.',
    freeLearningPathQuality: 'moderate',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'low-medium',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI can write individual SQL transformations and pipeline code, but designing resilient data architectures, handling data quality at scale, and making tradeoffs between cost, speed, and accuracy requires deep engineering judgment. Data engineers are in extreme demand.',
    incomeRanges: {
      us: {
        min: 90000,
        max: 140000
      },
      uk: {
        min: 55000,
        max: 90000
      },
      global_remote: {
        min: 30000,
        max: 80000
      }
    },
    earningCeiling: 'very-high',
    scoringWeights: {
      personalityTraits: [
        'analytical',
        'tech-quick'
      ],
      schoolSubjects: [
        'maths-sciences',
        'tech-cs'
      ],
      selfEfficacySignals: [
        'data-sense',
        'build-website-app'
      ],
      problemPreferences: [
        'data-analysis'
      ],
      workdayPreferences: [
        'building',
        'analysing'
      ],
      conditionalAnswers: [
        'data-engineer'
      ],
      minHoursPerWeek: 10,
      idealHoursPerWeek: 20,
      maxIncomeUrgencyMonths: 36,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'earning-well',
        'clear-growth'
      ],
      aiPreferenceMatch: [
        'lean-into-ai',
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You said you have a sense for data and you\'re drawn to {problem}. Data engineering is where systems thinking meets data — you build the infrastructure that makes analytics, AI, and machine learning possible.',
    whyItFitsFallback: 'You show strong analytical and technical signals with patience for a longer learning curve. Data engineering is one of the highest-paying and most in-demand technical roles — it\'s the plumbing that every data-driven company needs.',
    dailyLifeDescription: 'A typical day involves writing Python and SQL to build ETL/ELT pipelines, debugging data quality issues, optimizing query performance, managing cloud infrastructure (AWS/GCP), orchestrating workflows with Airflow or dbt, and collaborating with data analysts and scientists on their data needs. You live in code editors, terminals, and cloud consoles.',
    honestCaveat: 'This is the infrastructure layer of data — pipelines, warehouses, orchestration. It pays extremely well but takes longer. Start as a data analyst if you want to get in the door faster.',
    resources: {
      startHere: {
        title: 'DataTalksClub — Data Engineering Zoomcamp (free, start with Week 1)',
        url: 'https://github.com/DataTalksClub/data-engineering-zoomcamp',
        timeMinutes: 20
      },
      learning: [
        {
          title: 'DataTalksClub — Data Engineering Zoomcamp (free)',
          url: 'https://github.com/DataTalksClub/data-engineering-zoomcamp',
          description: 'Complete free data engineering course covering Docker, Terraform, GCP, dbt, and Spark.'
        },
        {
          title: 'SQLBolt + Mode SQL Tutorial (free)',
          url: 'https://sqlbolt.com',
          description: 'Master SQL first — it\'s the foundation. SQLBolt for basics, Mode for intermediate/advanced.'
        },
        {
          title: 'roadmap.sh — Data Engineering Roadmap',
          url: 'https://roadmap.sh/data-engineer',
          description: 'Visual guide to every skill in order — useful for planning your learning path.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'What Does a Data Engineer Do?',
          url: 'https://www.youtube.com/watch?v=1nVGaNbvuXg',
          description: 'Straightforward introduction to data engineering work, systems, and the career path.'
        }
      ]
    }
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    cluster: 'design',
    subtitle: 'Design how digital products look and feel — making complex things intuitive for the people who use them.',
    timeToFirstIncome: {
      min: 6,
      max: 12,
      unit: 'months'
    },
    entryDifficulty: 'low-medium',
    requiresCertification: false,
    degreeDependence: 'none',
    portfolioImportance: 'critical',
    entryDescription: 'You need 2–3 case studies in a portfolio site showing your design process — not just final screens, but the research, wireframes, iterations, and rationale behind each decision. Figma is free and is the industry standard tool.',
    freeLearningPathQuality: 'good',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'medium',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI generates UI mockups and component variations quickly, but understanding user needs, conducting research, making accessibility decisions, and designing coherent systems requires deeply human empathy and judgment. Designers who use AI to speed up production are more valued.',
    incomeRanges: {
      us: {
        min: 55000,
        max: 95000
      },
      uk: {
        min: 32000,
        max: 65000
      },
      global_remote: {
        min: 18000,
        max: 55000
      }
    },
    earningCeiling: 'high',
    scoringWeights: {
      personalityTraits: [
        'creative',
        'people-reader'
      ],
      schoolSubjects: [
        'art-design',
        'tech-cs'
      ],
      selfEfficacySignals: [
        'design-pro'
      ],
      problemPreferences: [
        'design-ux'
      ],
      workdayPreferences: [
        'creating',
        'coordinating'
      ],
      conditionalAnswers: [
        'ui-design',
        'ux-design'
      ],
      minHoursPerWeek: 5,
      idealHoursPerWeek: 15,
      maxIncomeUrgencyMonths: 12,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'creative-freedom',
        'remote-work'
      ],
      aiPreferenceMatch: [
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You described yourself as {trait} and you\'re drawn to design and user experience. UI/UX design is where empathy meets visual craft — you\'d shape how people experience every digital product they use.',
    whyItFitsFallback: 'You show strong creative and empathetic signals. UI/UX design is one of the best-paying creative careers in tech — and every product team needs at least one good designer.',
    dailyLifeDescription: 'A typical day involves reviewing user research or analytics, sketching wireframes, building high-fidelity designs in Figma, presenting your work to stakeholders, collaborating with developers on implementation, and conducting usability tests. You spend most of your time in Figma, FigJam, and occasionally Miro for workshops.',
    honestCaveat: 'Figma is the industry standard tool and has a free tier. Learn it first. Your portfolio needs 2–3 case studies showing your design process, not just final screens.',
    resources: {
      startHere: {
        title: 'Google UX Design Certificate — Course 1 Preview (free on Coursera)',
        url: 'https://www.coursera.org/professional-certificates/google-ux-design',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'Google UX Design Professional Certificate (Coursera, auditable free)',
          url: 'https://www.coursera.org/professional-certificates/google-ux-design',
          description: 'Comprehensive UX curriculum from Google. Covers research, wireframing, prototyping, and testing.'
        },
        {
          title: 'Figma — Official tutorials and community (free)',
          url: 'https://www.figma.com/resources/learn-design/',
          description: 'Learn the industry-standard design tool directly. Free tier is fully featured.'
        },
        {
          title: 'Laws of UX (free reference)',
          url: 'https://lawsofux.com',
          description: 'Essential UX principles explained with real examples. Bookmark and revisit often.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'UI/UX Design Career Overview',
          url: 'https://www.youtube.com/watch?v=ODpB9-MCa5s',
          description: 'Good beginner explanation of UI/UX design work and what the field expects from you.'
        }
      ]
    }
  },
  {
    id: 'product-designer',
    title: 'Product Designer',
    cluster: 'design',
    subtitle: 'Design entire product experiences from research to interface — owning the user journey end-to-end.',
    timeToFirstIncome: {
      min: 9,
      max: 18,
      unit: 'months'
    },
    entryDifficulty: 'medium',
    requiresCertification: false,
    degreeDependence: 'none',
    portfolioImportance: 'critical',
    entryDescription: 'You need 2–3 deep case studies showing research, problem definition, wireframes, visual design, prototyping, and measurable outcomes. Product design portfolios must tell stories about business impact, not just pretty screens. Start by redesigning an existing product and documenting your reasoning.',
    freeLearningPathQuality: 'good',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'medium',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI accelerates visual exploration and prototyping, but product design is fundamentally about understanding people, business strategy, and tradeoffs. The strategic layer — deciding what to build and why — is becoming more important as AI handles more of the how.',
    incomeRanges: {
      us: {
        min: 70000,
        max: 115000
      },
      uk: {
        min: 40000,
        max: 80000
      },
      global_remote: {
        min: 22000,
        max: 60000
      }
    },
    earningCeiling: 'high',
    scoringWeights: {
      personalityTraits: [
        'creative',
        'analytical'
      ],
      schoolSubjects: [
        'art-design',
        'business-economics'
      ],
      selfEfficacySignals: [
        'design-pro',
        'data-sense'
      ],
      problemPreferences: [
        'design-ux'
      ],
      workdayPreferences: [
        'creating',
        'analysing'
      ],
      conditionalAnswers: [
        'product-design'
      ],
      minHoursPerWeek: 5,
      idealHoursPerWeek: 15,
      maxIncomeUrgencyMonths: 18,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'creative-freedom',
        'visible-impact'
      ],
      aiPreferenceMatch: [
        'human-central',
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You described yourself as {trait} and you\'re drawn to understanding both users and business outcomes. Product design is where creative skill meets strategic thinking — you\'d shape what gets built and how it works.',
    whyItFitsFallback: 'You show strong creative and analytical signals. Product design is the most strategic design role in tech — you don\'t just make things look good, you decide what the right thing to build is.',
    dailyLifeDescription: 'A typical day involves conducting user interviews, synthesising research into insights, creating wireframes and prototypes in Figma, collaborating with product managers and engineers on scope, running usability tests, and analysing product metrics to validate design decisions. You move between Figma, Notion, analytics dashboards, and video calls.',
    honestCaveat: 'Product design is UX + business strategy. You need to understand user research, not just visuals. The best free learning path is Google\'s UX Design Certificate (Coursera, auditable free).',
    resources: {
      startHere: {
        title: 'Google UX Design Certificate — Course 1 (free on Coursera)',
        url: 'https://www.coursera.org/professional-certificates/google-ux-design',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'Google UX Design Professional Certificate (Coursera, auditable free)',
          url: 'https://www.coursera.org/professional-certificates/google-ux-design',
          description: 'Start here. Covers the full UX process — research, design, prototyping, testing.'
        },
        {
          title: 'Figma — Learn Design (free)',
          url: 'https://www.figma.com/resources/learn-design/',
          description: 'Master the tool every product designer uses daily.'
        },
        {
          title: 'Nielsen Norman Group — UX Articles (free)',
          url: 'https://www.nngroup.com/articles/',
          description: 'The most authoritative source on UX research and design principles.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'What Product Designers Actually Do',
          url: 'https://www.youtube.com/watch?v=TDvfC6ybhXQ',
          description: 'Helpful overview of the product designer role, responsibilities, and collaboration.'
        },
        {
          title: 'How to Become a Product Designer',
          url: 'https://www.youtube.com/watch?v=F0bXN6aqACk',
          description: 'Beginner-facing explanation of the product design path and how to build toward it.'
        }
      ]
    }
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    cluster: 'design',
    subtitle: 'Create visual content — logos, social graphics, presentations, and brand materials — for businesses and individuals.',
    timeToFirstIncome: {
      min: 4,
      max: 10,
      unit: 'months'
    },
    entryDifficulty: 'low-medium',
    requiresCertification: false,
    degreeDependence: 'none',
    portfolioImportance: 'critical',
    entryDescription: 'You need a portfolio of 5–10 pieces showing range — logos, social media graphics, a brand identity project, maybe a poster or packaging concept. Canva gets you started, but learning Figma or Adobe Illustrator signals professionalism. Spec work (designed for fictional brands) is perfectly fine to start.',
    freeLearningPathQuality: 'excellent',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'medium-high',
    humanJudgmentCentrality: 'medium-high',
    aiRealityDescription: 'AI generates images, logos, and layouts faster every month. The graphic designers thriving are those who offer brand strategy, art direction, and creative judgment — not just production. Your value is in taste, consistency, and understanding a brand\'s voice visually.',
    incomeRanges: {
      us: {
        min: 35000,
        max: 70000
      },
      uk: {
        min: 22000,
        max: 45000
      },
      global_remote: {
        min: 8000,
        max: 35000
      }
    },
    earningCeiling: 'moderate',
    scoringWeights: {
      personalityTraits: [
        'creative',
        'organised'
      ],
      schoolSubjects: [
        'art-design'
      ],
      selfEfficacySignals: [
        'design-pro'
      ],
      problemPreferences: [
        'content-strategy',
        'design-ux'
      ],
      workdayPreferences: [
        'creating'
      ],
      conditionalAnswers: [],
      minHoursPerWeek: 5,
      idealHoursPerWeek: 15,
      maxIncomeUrgencyMonths: 10,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'creative-freedom',
        'remote-work'
      ],
      aiPreferenceMatch: [
        'lean-into-ai',
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You described yourself as {trait} and your creative signal is strong. Graphic design is where visual talent meets client needs — you\'d create the visual identity that brands depend on.',
    whyItFitsFallback: 'You show strong creative signals and visual sensibility. Graphic design is one of the most accessible creative careers — the tools are free or cheap, and every business needs visual content.',
    dailyLifeDescription: 'A typical day involves creating social media graphics, refining a logo concept, building presentation templates, reviewing brand guidelines, responding to client feedback, and exporting assets in multiple formats. You work in Figma, Canva, or Adobe Creative Suite, communicate via Slack or email, and manage projects in Notion or Trello.',
    honestCaveat: 'Graphic design is also a force-multiplier — designers who add social media, video, or no-code skills to their toolkit command significantly higher rates.',
    resources: {
      startHere: {
        title: 'Canva Design School — Getting Started (free)',
        url: 'https://www.canva.com/designschool/',
        timeMinutes: 10
      },
      learning: [
        {
          title: 'Canva Design School (free)',
          url: 'https://www.canva.com/designschool/',
          description: 'Learn design fundamentals and the Canva tool at the same time. Perfect starting point.'
        },
        {
          title: 'Figma — Learn Design (free)',
          url: 'https://www.figma.com/resources/learn-design/',
          description: 'Upgrade from Canva to the professional tool. Free tier is fully featured.'
        },
        {
          title: 'Envato Tuts+ — Graphic Design tutorials (free)',
          url: 'https://design.tutsplus.com',
          description: 'Thousands of free tutorials covering typography, color theory, logo design, and layout.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'Graphic Design Career Overview',
          url: 'https://www.youtube.com/watch?v=wOHpnFCucfc',
          description: 'Beginner introduction to graphic design as a career and the kind of work designers do.'
        }
      ]
    }
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    cluster: 'management',
    subtitle: 'Decide what gets built and why — the person who connects user needs, business goals, and engineering capacity.',
    timeToFirstIncome: {
      min: 12,
      max: 36,
      unit: 'months'
    },
    entryDifficulty: 'high',
    requiresCertification: false,
    degreeDependence: 'moderate',
    portfolioImportance: 'moderate',
    entryDescription: 'You need demonstrated cross-functional experience — not a portfolio of screens, but evidence that you\'ve identified a problem, prioritised a solution, and shipped something. Write product specs for real or fictional products. Most PMs transition from engineering, design, data, or customer-facing roles.',
    freeLearningPathQuality: 'moderate',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'low',
    humanJudgmentCentrality: 'very-high',
    aiRealityDescription: 'AI helps PMs analyse user data, draft specs, and summarise research. But the core of product management — prioritisation under uncertainty, stakeholder alignment, and strategic judgment about what to build next — is irreducibly human. AI makes good PMs faster, not replaceable.',
    incomeRanges: {
      us: {
        min: 90000,
        max: 150000
      },
      uk: {
        min: 55000,
        max: 95000
      },
      global_remote: {
        min: 30000,
        max: 80000
      }
    },
    earningCeiling: 'very-high',
    scoringWeights: {
      personalityTraits: [
        'organised',
        'people-reader',
        'analytical'
      ],
      schoolSubjects: [
        'business-economics',
        'tech-cs'
      ],
      selfEfficacySignals: [
        'project-track',
        'explain-technical'
      ],
      problemPreferences: [
        'project-mgmt',
        'docs-devrel'
      ],
      workdayPreferences: [
        'coordinating',
        'analysing'
      ],
      conditionalAnswers: [
        'product-manager'
      ],
      minHoursPerWeek: 10,
      idealHoursPerWeek: 20,
      maxIncomeUrgencyMonths: 36,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'earning-well',
        'visible-impact',
        'clear-growth'
      ],
      aiPreferenceMatch: [
        'human-central',
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You described yourself as {trait} and you\'re drawn to the intersection of people and strategy. Product management is about deciding what matters most and making it happen — across engineering, design, and business.',
    whyItFitsFallback: 'You show strong organisational, analytical, and interpersonal signals. Product management is one of the highest-paying careers in tech, and it rewards exactly this combination of skills.',
    dailyLifeDescription: 'A typical day involves reviewing user feedback and analytics, writing product specs or user stories, prioritising the backlog, running sprint planning with engineers, meeting with designers on upcoming features, aligning with leadership on strategy, and making tradeoff decisions about scope and timing. You live in Notion, Jira, Slack, and spreadsheets.',
    honestCaveat: 'PM is not a beginner role. Most PMs come from engineering, design, or data backgrounds. The fastest path in is to become a very strong engineer or analyst first, then transition.',
    resources: {
      startHere: {
        title: 'Product School — Free Product Management resources',
        url: 'https://productschool.com/resources',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'Product School — Free resources and webinars',
          url: 'https://productschool.com/resources',
          description: 'Free content from working PMs at top companies. Start with "The Product Book."'
        },
        {
          title: 'Lenny\'s Newsletter (free tier)',
          url: 'https://www.lennysnewsletter.com',
          description: 'The most respected product management newsletter. Practical, actionable, real-world.'
        },
        {
          title: 'Inspired by Marty Cagan (book)',
          url: 'https://www.svpg.com/inspired-how-to-create-tech-products-customers-love/',
          description: 'The definitive book on product management. Read this before applying to PM roles.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'Product Management Career Guide',
          url: 'https://www.youtube.com/watch?v=Dnh0jP-GA0o',
          description: 'Clear explanation of what product managers do and why the role is hard to enter directly.'
        },
        {
          title: 'A Day in the Life of a Product Manager',
          url: 'https://www.youtube.com/watch?v=5nAeyqNuZYU',
          description: 'Concrete look at the day-to-day work, meetings, and tradeoffs in product management.'
        }
      ]
    }
  },
  {
    id: 'project-manager',
    title: 'Project Manager (Digital/Tech)',
    cluster: 'management',
    subtitle: 'Keep projects on track, on budget, and on scope — the person who makes sure things actually get done.',
    timeToFirstIncome: {
      min: 6,
      max: 18,
      unit: 'months'
    },
    entryDifficulty: 'low-medium',
    requiresCertification: true,
    certificationDetails: 'PMP/CAPM (~$300–400)',
    degreeDependence: 'low',
    portfolioImportance: 'moderate',
    entryDescription: 'Get CAPM certification (~$300) as your entry credential, or Google Project Management Certificate (Coursera, auditable free) as a stepping stone. Document any project you\'ve managed — even volunteer, school, or personal — with timelines, outcomes, and what you learned.',
    freeLearningPathQuality: 'good',
    remoteAvailability: 'high',
    aiDisplacementRisk: 'low',
    humanJudgmentCentrality: 'very-high',
    aiRealityDescription: 'AI can generate project plans and status reports, but managing people, navigating conflicts, adjusting plans when reality changes, and keeping stakeholders aligned is fundamentally human work. Project managers who use AI for admin tasks free up time for the relationship and judgment work that matters.',
    incomeRanges: {
      us: {
        min: 65000,
        max: 105000
      },
      uk: {
        min: 38000,
        max: 68000
      },
      global_remote: {
        min: 20000,
        max: 55000
      }
    },
    earningCeiling: 'high',
    scoringWeights: {
      personalityTraits: [
        'organised',
        'people-reader'
      ],
      schoolSubjects: [
        'business-economics'
      ],
      selfEfficacySignals: [
        'project-track'
      ],
      problemPreferences: [
        'project-mgmt'
      ],
      workdayPreferences: [
        'coordinating'
      ],
      conditionalAnswers: [
        'project-manager'
      ],
      minHoursPerWeek: 5,
      idealHoursPerWeek: 15,
      maxIncomeUrgencyMonths: 18,
      requiresDegree: false,
      requiresCertBudget: true,
      requiresPaidTools: false,
      valuesMatch: [
        'stability',
        'clear-growth'
      ],
      aiPreferenceMatch: [
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You described yourself as {trait} and you\'re naturally drawn to keeping things organised and on track. Project management turns that instinct into a well-paid career — you\'d be the person who makes complex projects actually happen.',
    whyItFitsFallback: 'You show strong organisational and interpersonal signals. Project management is one of the most stable and transferable careers — every industry needs people who can keep projects on track.',
    dailyLifeDescription: 'A typical day involves running standup meetings, updating project timelines in Jira or Asana, following up on blockers with team members, preparing status reports for stakeholders, managing budgets and resource allocation, and facilitating retrospectives. You live in Jira, Asana, Slack, Google Sheets, and Confluence.',
    honestCaveat: 'PMP certification (~$300–400) is the industry standard. CAPM is the entry-level version. Start with CAPM if you don\'t have 3 years of experience. Asana, Jira, and Notion are the core tools.',
    resources: {
      startHere: {
        title: 'Google Project Management Certificate — Course 1 (free on Coursera)',
        url: 'https://www.coursera.org/professional-certificates/google-project-management',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'Google Project Management Professional Certificate (Coursera, auditable free)',
          url: 'https://www.coursera.org/professional-certificates/google-project-management',
          description: 'Complete project management training from Google. Covers Agile, Scrum, and traditional PM.'
        },
        {
          title: 'PMI — CAPM Exam Prep Resources',
          url: 'https://www.pmi.org/certifications/certified-associate-capm',
          description: 'Official CAPM certification info and study resources from PMI.'
        },
        {
          title: 'Atlassian Agile Coach (free)',
          url: 'https://www.atlassian.com/agile',
          description: 'Free guides on Agile, Scrum, and Kanban from the makers of Jira.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'What Does A Project Manager Do?',
          url: 'https://www.youtube.com/watch?v=YjOdqavaTxs',
          description: 'Beginner explainer of the project manager role, responsibilities, and core skills.'
        },
        {
          title: 'A Day in the Life of a Project Manager | Indeed',
          url: 'https://www.youtube.com/watch?v=AzQ3Xso7sLA',
          description: 'Concrete day-in-the-life view of what project management work looks like in practice.'
        }
      ]
    }
  },
  {
    id: 'b2b-saas-writer',
    title: 'B2B SaaS Content Writer',
    cluster: 'content',
    subtitle: 'Write long-form articles, case studies, and landing pages that help software companies attract and convert business customers.',
    timeToFirstIncome: {
      min: 3,
      max: 9,
      unit: 'months'
    },
    entryDifficulty: 'low',
    requiresCertification: false,
    degreeDependence: 'none',
    portfolioImportance: 'high',
    entryDescription: 'You need 2–3 published writing samples that read like real B2B content — not blog posts about your life, but articles explaining a business problem and solution. These can be spec pieces (written for a fake company). No degree, no tools to buy.',
    freeLearningPathQuality: 'excellent',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'medium-high',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI produces commodity blog posts at scale. Clients who want high-volume, low-quality content are already replacing writers with AI. The surviving value is expert-voiced, deeply researched, strategy-led content that AI cannot produce without a human expert to interview.',
    incomeRanges: {
      us: {
        min: 40000,
        max: 120000
      },
      uk: {
        min: 28000,
        max: 75000
      },
      global_remote: {
        min: 12000,
        max: 60000
      }
    },
    earningCeiling: 'high',
    scoringWeights: {
      personalityTraits: [
        'explainer',
        'analytical',
        'organised'
      ],
      schoolSubjects: [
        'english-languages',
        'business-economics'
      ],
      selfEfficacySignals: [
        'writing-paid',
        'explain-technical'
      ],
      problemPreferences: [
        'content-strategy'
      ],
      workdayPreferences: [
        'creating',
        'analysing'
      ],
      conditionalAnswers: [
        'b2b-saas',
        'seo-content',
        'b2b-content'
      ],
      minHoursPerWeek: 5,
      idealHoursPerWeek: 15,
      maxIncomeUrgencyMonths: 9,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'earning-well',
        'remote-work',
        'creative-freedom'
      ],
      aiPreferenceMatch: [
        'ai-as-tool',
        'human-central'
      ]
    },
    whyItFitsTemplate: 'You said you believe you could write clearly enough that people would pay for it — and you\'re drawn to {problem}. B2B SaaS Writing is exactly this: writing that explains complex software to the business buyers who pay for it.',
    whyItFitsFallback: 'You show a strong writing and analytical signal. B2B SaaS content is one of the highest-paying remote writing paths — it combines clear thinking, research, and persuasion.',
    dailyLifeDescription: 'A typical day involves researching a topic, interviewing a subject-matter expert or reading technical documentation, then drafting a long-form article (1,500–4,000 words) that explains a problem and positions a software product as the solution. You\'ll also revise based on client feedback and track how content performs.',
    honestCaveat: 'The low-end of this market (generic "10 tips" articles) is being taken by AI. The writers earning $0.50–$1.00+ per word are deeply researched, interview real experts, and bring strategic thinking. Start building a niche angle — cybersecurity, fintech, HR tech — early.',
    resources: {
      startHere: {
        title: 'The B2B Writing Institute — free intro guide',
        url: 'https://www.b2bwritinginstitute.com',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'Copyhackers — free articles on B2B and conversion writing',
          url: 'https://copyhackers.com',
          description: 'The best free resource on writing that persuades. Start with the "How to write for SaaS" tag.'
        },
        {
          title: 'Contently\'s The Content Strategist',
          url: 'https://contently.com/strategist/',
          description: 'Real examples of B2B content strategy in practice.'
        },
        {
          title: 'How to Become a SaaS Content Writer',
          url: 'https://nathanojaokomo.com/blog/saas-content-writer',
          description: 'Grounded article on what SaaS content writing involves, how to think about the work, and how to position yourself.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'How to Become a SaaS Content Writer',
          url: 'https://www.youtube.com/watch?v=iGa1ZvmCmW8',
          description: 'Practical overview of SaaS content writing, client work, and where the role sits in marketing.'
        }
      ]
    }
  },
  {
    id: 'technical-writer',
    title: 'Technical Writer',
    cluster: 'content',
    subtitle: 'Make complex technical information clear, accurate, and usable — documentation that people actually read.',
    timeToFirstIncome: {
      min: 6,
      max: 12,
      unit: 'months'
    },
    entryDifficulty: 'low-medium',
    requiresCertification: false,
    degreeDependence: 'none',
    portfolioImportance: 'high',
    entryDescription: 'You need 2–3 writing samples: a how-to guide, an API reference page, or documentation for an open-source project. Google\'s free Technical Writing courses (about 2 hours total) are the best starting point. Contributing to open-source documentation is the fastest way to build credibility.',
    freeLearningPathQuality: 'excellent',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'medium',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI generates drafts of documentation, but technical accuracy, understanding user context, structuring information for findability, and knowing what to document (and what not to) requires human judgment. The best technical writers test every procedure they document.',
    incomeRanges: {
      us: {
        min: 60000,
        max: 100000
      },
      uk: {
        min: 35000,
        max: 65000
      },
      global_remote: {
        min: 20000,
        max: 55000
      }
    },
    earningCeiling: 'high',
    scoringWeights: {
      personalityTraits: [
        'explainer',
        'organised'
      ],
      schoolSubjects: [
        'english-languages',
        'tech-cs'
      ],
      selfEfficacySignals: [
        'writing-paid',
        'explain-technical'
      ],
      problemPreferences: [
        'docs-devrel',
        'content-strategy'
      ],
      workdayPreferences: [
        'creating',
        'analysing'
      ],
      conditionalAnswers: [
        'tech-writing',
        'ux-writer',
        'dev-docs'
      ],
      minHoursPerWeek: 5,
      idealHoursPerWeek: 15,
      maxIncomeUrgencyMonths: 12,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'remote-work',
        'clear-growth',
        'stability'
      ],
      aiPreferenceMatch: [
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You said you can explain complex things clearly — and your interest in {problem} fits naturally. Technical writing is about making the complicated accessible, and companies pay well for people who can do it.',
    whyItFitsFallback: 'You show strong explanatory and organisational signals. Technical writing is one of the most stable, well-paying writing careers — and the demand far outstrips supply.',
    dailyLifeDescription: 'A typical day involves interviewing engineers about a feature, writing or updating documentation, testing procedures step-by-step, reviewing pull requests for docs changes, organising information architecture, and maintaining style guides. You use Markdown, Git, docs-as-code tools, and spend time reading source code and API specs.',
    honestCaveat: 'The best free learning path is Google\'s Technical Writing courses (free, about 2 hours total). Build 2–3 sample docs for a real open-source project to start your portfolio.',
    resources: {
      startHere: {
        title: 'Google Technical Writing — Course 1 (free, ~2 hours)',
        url: 'https://developers.google.com/tech-writing/one',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'Google Technical Writing Courses (free)',
          url: 'https://developers.google.com/tech-writing',
          description: 'Two free courses from Google. The best structured intro to technical writing available.'
        },
        {
          title: 'Write the Docs — Documentation Guide (free)',
          url: 'https://www.writethedocs.org/guide/',
          description: 'Community-driven guide to documentation best practices.'
        },
        {
          title: 'Good Docs Project (free templates)',
          url: 'https://thegooddocsproject.dev',
          description: 'Free, open-source templates for every type of technical document.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'Technical Writing Career Overview',
          url: 'https://www.youtube.com/watch?v=uHnIIeV8hZ0',
          description: 'Beginner-friendly explanation of technical writing work, deliverables, and required skills.'
        },
        {
          title: 'How to Become a Technical Writer',
          url: 'https://www.youtube.com/watch?v=RZF34wQEv0Y',
          description: 'Clear guidance on how to break into technical writing and build relevant samples.'
        }
      ]
    }
  },
  {
    id: 'seo-strategist',
    title: 'SEO Strategist',
    cluster: 'content',
    subtitle: 'Help websites rank higher in search results through technical optimization, content strategy, and data analysis.',
    timeToFirstIncome: {
      min: 6,
      max: 12,
      unit: 'months'
    },
    entryDifficulty: 'low-medium',
    requiresCertification: false,
    degreeDependence: 'none',
    portfolioImportance: 'high',
    entryDescription: 'You need a case study showing measurable results — take a real site (your own or a local business\'s), audit it, implement changes, and document the traffic/ranking improvements. Google Search Console and Google Analytics are free. Ahrefs has a free webmaster tool for your own site.',
    freeLearningPathQuality: 'excellent',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'medium-high',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI floods search with content, making strategic SEO more important, not less. The winners are those who combine technical SEO knowledge, original research, topical authority, and content that actually answers search intent better than AI-generated alternatives.',
    incomeRanges: {
      us: {
        min: 50000,
        max: 95000
      },
      uk: {
        min: 30000,
        max: 60000
      },
      global_remote: {
        min: 15000,
        max: 50000
      }
    },
    earningCeiling: 'high',
    scoringWeights: {
      personalityTraits: [
        'analytical',
        'organised'
      ],
      schoolSubjects: [
        'business-economics',
        'english-languages'
      ],
      selfEfficacySignals: [
        'writing-paid',
        'data-sense'
      ],
      problemPreferences: [
        'content-strategy'
      ],
      workdayPreferences: [
        'analysing',
        'creating'
      ],
      conditionalAnswers: [
        'seo-content',
        'b2b-content'
      ],
      minHoursPerWeek: 5,
      idealHoursPerWeek: 15,
      maxIncomeUrgencyMonths: 12,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'earning-well',
        'remote-work',
        'clear-growth'
      ],
      aiPreferenceMatch: [
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You said you have a sense for data and you\'re drawn to {problem}. SEO strategy is where analytical thinking meets content — you\'d figure out what people are searching for and make sure they find it.',
    whyItFitsFallback: 'You show strong analytical and writing signals. SEO is one of the most data-driven content careers — companies pay well for strategists who can prove that their work moves rankings and revenue.',
    dailyLifeDescription: 'A typical day involves auditing website performance in Google Search Console, researching keywords, analysing competitor content, writing content briefs for writers, checking technical SEO issues (site speed, mobile usability, structured data), and reporting on ranking changes. You use Google Search Console, Ahrefs or SEMrush, Google Sheets, and Screaming Frog.',
    honestCaveat: 'AI-generated content is flooding search results. The writers/strategists winning are those who combine real expertise, original research, and topical authority — not volume.',
    resources: {
      startHere: {
        title: 'Moz — Beginner\'s Guide to SEO (free)',
        url: 'https://moz.com/beginners-guide-to-seo',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'Moz — Beginner\'s Guide to SEO (free)',
          url: 'https://moz.com/beginners-guide-to-seo',
          description: 'The definitive free SEO resource. Covers everything from basics to technical SEO.'
        },
        {
          title: 'Ahrefs — Free SEO Training Course',
          url: 'https://ahrefs.com/academy/seo-training-course',
          description: 'Practical SEO training from one of the top SEO tool companies.'
        },
        {
          title: 'Google Search Central — SEO Documentation (free)',
          url: 'https://developers.google.com/search/docs',
          description: 'Official Google documentation on how search works and how to optimise for it.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'SEO for Beginners (Ahrefs)',
          url: 'https://www.youtube.com/watch?v=DvwS7cV9GmQ',
          description: 'Clear, practical introduction to SEO from the Ahrefs team.'
        },
        {
          title: 'SEO Career Guide',
          url: 'https://www.youtube.com/watch?v=xsVTqzratPs',
          description: 'Second perspective on SEO strategy, what the work involves, and how to grow into it.'
        }
      ]
    }
  },
  {
    id: 'social-media-manager',
    title: 'Social Media Manager / Strategist',
    cluster: 'marketing',
    subtitle: 'Plan, create, and analyse content for a brand\'s social media accounts to grow audience and drive business results.',
    timeToFirstIncome: {
      min: 3,
      max: 9,
      unit: 'months'
    },
    entryDifficulty: 'low',
    requiresCertification: false,
    degreeDependence: 'none',
    portfolioImportance: 'high',
    entryDescription: 'Manage a small account (your own or a local business\'s) and document the results. A one-page case study showing follower growth, engagement rate, or leads generated is enough to get early clients. No degree, no tools required (free tier of Buffer/Later is enough to start).',
    freeLearningPathQuality: 'excellent',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'medium',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI helps with captions, content calendars, and image generation. The strategic thinking — knowing what\'s on-brand, what a community responds to, and how content serves a business goal — remains a human judgment call.',
    incomeRanges: {
      us: {
        min: 35000,
        max: 70000
      },
      uk: {
        min: 22000,
        max: 45000
      },
      global_remote: {
        min: 8000,
        max: 36000
      }
    },
    earningCeiling: 'moderate',
    scoringWeights: {
      personalityTraits: [
        'creative',
        'people-reader',
        'organised'
      ],
      schoolSubjects: [
        'english-languages',
        'business-economics',
        'art-design'
      ],
      selfEfficacySignals: [
        'writing-paid',
        'design-pro'
      ],
      problemPreferences: [
        'content-strategy'
      ],
      workdayPreferences: [
        'creating',
        'coordinating'
      ],
      conditionalAnswers: [
        'b2b-content',
        'seo-content'
      ],
      minHoursPerWeek: 5,
      idealHoursPerWeek: 15,
      maxIncomeUrgencyMonths: 9,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'creative-freedom',
        'remote-work',
        'visible-impact'
      ],
      aiPreferenceMatch: [
        'lean-into-ai',
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You described yourself as {trait} and you\'re drawn to creative work. Social Media Management is where platform intuition meets business strategy — and many 18-year-olds already have the former, they just need to learn the latter.',
    whyItFitsFallback: 'You show a creative, communicative signal with practical accessibility requirements. Social media management is one of the most accessible digital careers — the gap between casual user and paid professional is strategy and analytics, not expensive qualifications.',
    dailyLifeDescription: 'A typical day involves scheduling content, writing captions, responding to comments and DMs, reviewing analytics to see what\'s working, ideating for the next content batch, and reporting results to the client or manager. You\'ll use scheduling tools (Buffer, Later, or native apps), Canva for graphics, and a spreadsheet or Notion for your content calendar.',
    honestCaveat: 'The difference between someone who posts for fun and someone who gets paid is understanding what the numbers mean and how content serves a business goal. Learn to read analytics from day one. Clients who just want "more followers" are the hardest to retain — prioritise clients who measure results in leads, sales, or community growth.',
    resources: {
      startHere: {
        title: 'Meta Blueprint — Introduction to Social Media Marketing (free)',
        url: 'https://www.facebook.com/business/learn',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'HubSpot Academy — Social Media Marketing Certification (free)',
          url: 'https://academy.hubspot.com/courses/social-media',
          description: 'Free, comprehensive, and gives you a certificate. Start here.'
        },
        {
          title: 'Buffer\'s free social media marketing library',
          url: 'https://buffer.com/resources',
          description: 'Practical guides on every platform, content strategy, and analytics.'
        },
        {
          title: 'Hootsuite Academy — Social Media Marketing Training (free)',
          url: 'https://education.hootsuite.com',
          description: 'Free courses on social strategy, content creation, and platform management from one of the industry\'s leading tools.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'Day in the Life of a Social Media Manager',
          url: 'https://www.youtube.com/watch?v=EJSKalcfHow',
          description: 'Real day-in-the-life look at content creation, scheduling, analytics, and client work.'
        }
      ]
    }
  },
  {
    id: 'video-editor',
    title: 'Video Editor',
    cluster: 'marketing',
    subtitle: 'Edit raw footage into polished videos for YouTube, social media, ads, and brands — a visual storytelling craft.',
    timeToFirstIncome: {
      min: 3,
      max: 9,
      unit: 'months'
    },
    entryDifficulty: 'low-medium',
    requiresCertification: false,
    degreeDependence: 'none',
    portfolioImportance: 'critical',
    entryDescription: 'You need a showreel of 3–5 edited videos demonstrating different styles — a YouTube video, a short-form social clip, and maybe a brand ad. Start by editing free stock footage or offering to edit for small creators for free (then paid). DaVinci Resolve is professional-grade and completely free.',
    freeLearningPathQuality: 'excellent',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'medium',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI automates simple cuts, generates captions, and handles colour correction. But pacing, storytelling, emotional tone, and knowing which moments to keep or cut is deeply human creative judgment. Editors who use AI for tedious tasks (transcription, rough cuts) are faster than ever.',
    incomeRanges: {
      us: {
        min: 35000,
        max: 75000
      },
      uk: {
        min: 22000,
        max: 45000
      },
      global_remote: {
        min: 8000,
        max: 35000
      }
    },
    earningCeiling: 'moderate',
    scoringWeights: {
      personalityTraits: [
        'creative',
        'tech-quick'
      ],
      schoolSubjects: [
        'art-design'
      ],
      selfEfficacySignals: [
        'design-pro'
      ],
      problemPreferences: [
        'content-strategy'
      ],
      workdayPreferences: [
        'creating'
      ],
      conditionalAnswers: [],
      minHoursPerWeek: 5,
      idealHoursPerWeek: 15,
      maxIncomeUrgencyMonths: 9,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'creative-freedom',
        'remote-work'
      ],
      aiPreferenceMatch: [
        'lean-into-ai',
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You described yourself as {trait} and you have a creative, visual sensibility. Video editing is where technical skill meets storytelling — you\'d shape how audiences experience content across every platform.',
    whyItFitsFallback: 'You show strong creative and technical signals. Video editing is one of the most in-demand creative skills — every YouTuber, brand, and content creator needs an editor, and the tools to start are free.',
    dailyLifeDescription: 'A typical day involves importing and organising footage, cutting and arranging clips on a timeline, adding transitions, music, and sound effects, colour grading, creating motion graphics and titles, exporting for different platforms, and communicating with clients on revisions. You work in DaVinci Resolve, Premiere Pro, or Final Cut, and use After Effects for motion graphics.',
    honestCaveat: 'You don\'t need expensive equipment. A phone + DaVinci Resolve (free) + one paying client is the entire starting stack.',
    resources: {
      startHere: {
        title: 'DaVinci Resolve — Official beginner tutorial (free)',
        url: 'https://www.blackmagicdesign.com/products/davinciresolve/training',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'DaVinci Resolve Training (free, official)',
          url: 'https://www.blackmagicdesign.com/products/davinciresolve/training',
          description: 'Official free training from Blackmagic. DaVinci Resolve is professional-grade and 100% free.'
        },
        {
          title: 'Editing in Premiere Pro (Adobe, free tutorials)',
          url: 'https://helpx.adobe.com/premiere-pro/tutorials.html',
          description: 'Official tutorials if you go the Adobe route. Many employers use Premiere.'
        },
        {
          title: 'No Film School — Editing articles (free)',
          url: 'https://nofilmschool.com/tags/editing',
          description: 'Industry insights on editing techniques, storytelling, and career advice.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'How to Become a Video Editor',
          url: 'https://www.youtube.com/watch?v=954L0eVIdaE',
          description: 'Practical beginner guide to getting started in video editing and building paid work.'
        }
      ]
    }
  },
  {
    id: 'digital-marketer',
    title: 'Digital Marketing Specialist',
    cluster: 'marketing',
    subtitle: 'Plan, execute, and optimise online marketing campaigns across SEO, paid ads, social media, email, and content to drive brand awareness, traffic, and sales.',
    timeToFirstIncome: {
      min: 4,
      max: 10,
      unit: 'months'
    },
    entryDifficulty: 'low-medium',
    requiresCertification: false,
    degreeDependence: 'none',
    portfolioImportance: 'high',
    entryDescription: 'You need case studies showing real results across at least two channels — run a paid ad campaign, grow a social account, improve a page\'s SEO ranking, or build an email sequence. Document what you did and what changed (traffic, conversions, engagement). HubSpot and Google certifications (both free) add credibility and show you understand the full picture, not just one channel.',
    freeLearningPathQuality: 'good',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'medium',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'AI optimises ad bidding and generates ad copy variations, but marketing strategy — understanding target audiences, allocating budgets across channels, interpreting what the data actually means, and creating campaigns that resonate — stays human. Marketers who understand AI tools are more efficient.',
    incomeRanges: {
      us: {
        min: 50000,
        max: 95000
      },
      uk: {
        min: 28000,
        max: 60000
      },
      global_remote: {
        min: 15000,
        max: 50000
      }
    },
    earningCeiling: 'high',
    scoringWeights: {
      personalityTraits: [
        'analytical',
        'organised',
        'creative'
      ],
      schoolSubjects: [
        'business-economics',
        'english-languages'
      ],
      selfEfficacySignals: [
        'data-sense',
        'project-track',
        'writing-paid'
      ],
      problemPreferences: [
        'content-strategy',
        'data-analysis'
      ],
      workdayPreferences: [
        'analysing',
        'coordinating',
        'creating'
      ],
      conditionalAnswers: [
        'b2b-saas',
        'seo-content'
      ],
      minHoursPerWeek: 5,
      idealHoursPerWeek: 15,
      maxIncomeUrgencyMonths: 10,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'earning-well',
        'remote-work',
        'clear-growth'
      ],
      aiPreferenceMatch: [
        'lean-into-ai',
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You\'re drawn to {problem} — and digital marketing is one of the few fields where creativity and data live in the same role. You plan campaigns, run them across SEO, social, email, and ads, then measure exactly what worked and why.',
    whyItFitsFallback: 'You show strong analytical and organisational signals. Digital marketing is one of the most data-driven, results-oriented careers — and every business needs someone who can turn ad spend into revenue.',
    dailyLifeDescription: 'A typical day spans multiple channels: checking SEO rankings and keyword performance, reviewing paid ad campaigns in Google Ads or Meta Ads Manager, scheduling social media content, analysing email open and click rates, pulling traffic data from Google Analytics, and reporting results to a client or manager. You are both creator and analyst — writing ad copy or captions in the morning, then interpreting conversion data in the afternoon. Tools vary but commonly include Google Analytics, Meta Business Suite, a CRM like HubSpot, an email platform like Mailchimp or Klaviyo, and SEO tools like Semrush or Ahrefs.',
    honestCaveat: 'You need ad budget to practice — use free Google Ads credits or manage a local small business account. Results-focused clients pay well; vanity-metric clients don\'t.',
    resources: {
      startHere: {
        title: 'Google Digital Marketing & E-commerce Certificate — Course 1 (free on Coursera)',
        url: 'https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'Google Digital Marketing Certificate (Coursera, auditable free)',
          url: 'https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce',
          description: 'Comprehensive digital marketing training from Google. Covers SEO, SEM, email, and analytics.'
        },
        {
          title: 'HubSpot Academy — Digital Marketing Certification (free)',
          url: 'https://academy.hubspot.com/courses/digital-marketing',
          description: 'Free certification covering inbound marketing, content strategy, and lead generation.'
        },
        {
          title: 'Google Skillshop — Ads Certifications (free)',
          url: 'https://skillshop.withgoogle.com',
          description: 'Official Google Ads certifications. Required by many employers and agencies.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'Digital Marketing Explained in 5 Minutes | Simplilearn',
          url: 'https://www.youtube.com/watch?v=bixR-KIJKYM',
          description: 'Quick overview of digital marketing channels and the different specialisations.'
        },
        {
          title: 'Digital Marketing Strategy and SEO | Ahrefs',
          url: 'https://www.youtube.com/watch?v=e8wJBq6vOAI',
          description: 'Useful second perspective from Ahrefs on how digital marketing and search-driven growth work.'
        }
      ]
    }
  },
  {
    id: 'email-marketer',
    title: 'Email Marketing Specialist',
    cluster: 'marketing',
    subtitle: 'Design, write, and optimise email campaigns that drive revenue — the marketing channel with the highest ROI.',
    timeToFirstIncome: {
      min: 3,
      max: 9,
      unit: 'months'
    },
    entryDifficulty: 'low',
    requiresCertification: false,
    degreeDependence: 'none',
    portfolioImportance: 'moderate',
    entryDescription: 'You need examples of email sequences you\'ve built — even for a personal project or fictional brand. Set up a Mailchimp or Klaviyo free account, build a welcome sequence and a promotional campaign, and screenshot the results. Understanding segmentation and A/B testing separates you from beginners.',
    freeLearningPathQuality: 'excellent',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'medium-high',
    humanJudgmentCentrality: 'medium-high',
    aiRealityDescription: 'AI generates email copy and subject lines, but understanding customer segments, designing automation flows that respond to behavior, and making strategic decisions about timing, frequency, and offer positioning requires human judgment. Email marketers who combine creative writing with data analysis thrive.',
    incomeRanges: {
      us: {
        min: 45000,
        max: 80000
      },
      uk: {
        min: 26000,
        max: 52000
      },
      global_remote: {
        min: 10000,
        max: 40000
      }
    },
    earningCeiling: 'moderate',
    scoringWeights: {
      personalityTraits: [
        'organised',
        'analytical'
      ],
      schoolSubjects: [
        'business-economics',
        'english-languages'
      ],
      selfEfficacySignals: [
        'writing-paid',
        'data-sense'
      ],
      problemPreferences: [
        'content-strategy'
      ],
      workdayPreferences: [
        'analysing',
        'creating'
      ],
      conditionalAnswers: [
        'b2b-saas',
        'seo-content'
      ],
      minHoursPerWeek: 5,
      idealHoursPerWeek: 15,
      maxIncomeUrgencyMonths: 9,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'remote-work',
        'stability',
        'earning-well'
      ],
      aiPreferenceMatch: [
        'lean-into-ai',
        'ai-as-tool'
      ]
    },
    whyItFitsTemplate: 'You described yourself as {trait} and you\'re drawn to measurable, strategic work. Email marketing has the highest ROI of any marketing channel — and it rewards exactly the blend of writing and data skills you show.',
    whyItFitsFallback: 'You show strong writing and analytical signals. Email marketing is consistently the highest-ROI marketing channel — businesses that understand this pay well for specialists who can prove results.',
    dailyLifeDescription: 'A typical day involves writing email copy, designing templates in Klaviyo or Mailchimp, setting up automated flows (welcome sequences, abandoned cart, post-purchase), segmenting subscriber lists, running A/B tests on subject lines, reviewing open/click/conversion rates, and reporting on revenue attribution. You use an email platform, analytics tools, and Google Sheets.',
    honestCaveat: 'Email ROI is still the highest of any marketing channel. Klaviyo/Mailchimp have free tiers — build flows for a real brand to show results.',
    resources: {
      startHere: {
        title: 'Mailchimp — Getting Started Guide (free)',
        url: 'https://mailchimp.com/help/getting-started-with-mailchimp/',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'HubSpot Academy — Email Marketing Certification (free)',
          url: 'https://academy.hubspot.com/courses/email-marketing',
          description: 'Free, comprehensive certification covering strategy, deliverability, and optimisation.'
        },
        {
          title: 'Klaviyo Academy (free)',
          url: 'https://www.klaviyo.com/academy',
          description: 'Learn the platform that e-commerce brands prefer. Free courses on flows and segmentation.'
        },
        {
          title: 'Really Good Emails — Inspiration gallery (free)',
          url: 'https://reallygoodemails.com',
          description: 'Curated collection of excellent emails. Study what works before you write your own.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'Email Marketing for Beginners',
          url: 'https://www.youtube.com/watch?v=WPQqMvr8D80',
          description: 'Beginner explanation of email marketing strategy, campaigns, and the skills employers value.'
        },
        {
          title: 'How Email Marketing Works in Practice',
          url: 'https://www.youtube.com/watch?v=94gHaHKmD4Q',
          description: 'Second practical guide covering email flows, metrics, and what the role looks like day to day.'
        }
      ]
    }
  },
  {
    id: 'ai-workflow',
    title: 'AI Workflow Specialist / AI Operations',
    cluster: 'ai-native',
    subtitle: 'Design and build AI-powered automations that transform how businesses operate — the newest career on this list.',
    timeToFirstIncome: {
      min: 3,
      max: 12,
      unit: 'months'
    },
    entryDifficulty: 'low-medium',
    requiresCertification: false,
    degreeDependence: 'none',
    portfolioImportance: 'high',
    entryDescription: 'You need 2–3 documented case studies of AI workflows you\'ve built — automated content pipelines, customer support bots, data processing flows, or AI-assisted decision systems. Use free tiers of tools like Make, Zapier, and OpenAI API. Document the business problem, your solution, and the measurable result.',
    freeLearningPathQuality: 'excellent',
    remoteAvailability: 'very-high',
    aiDisplacementRisk: 'low',
    humanJudgmentCentrality: 'high',
    aiRealityDescription: 'This role exists because of AI — you\'re the person who knows how to make AI tools work for a specific business context. The irony is that AI won\'t replace the people who understand how to deploy AI strategically. The demand is growing faster than any other role on this list.',
    incomeRanges: {
      us: {
        min: 55000,
        max: 110000
      },
      uk: {
        min: 32000,
        max: 70000
      },
      global_remote: {
        min: 18000,
        max: 60000
      }
    },
    earningCeiling: 'high',
    scoringWeights: {
      personalityTraits: [
        'tech-quick',
        'analytical',
        'creative',
        'organised'
      ],
      schoolSubjects: [
        'tech-cs',
        'maths-sciences'
      ],
      selfEfficacySignals: [
        'explain-technical',
        'data-sense',
        'build-website-app',
        'design-pro'
      ],
      problemPreferences: [
        'technical',
        'data-analysis'
      ],
      workdayPreferences: [
        'building',
        'analysing',
        'creating'
      ],
      conditionalAnswers: [],
      minHoursPerWeek: 5,
      idealHoursPerWeek: 15,
      maxIncomeUrgencyMonths: 12,
      requiresDegree: false,
      requiresCertBudget: false,
      requiresPaidTools: false,
      valuesMatch: [
        'remote-work',
        'earning-well',
        'clear-growth',
        'creative-freedom'
      ],
      aiPreferenceMatch: [
        'lean-into-ai'
      ]
    },
    whyItFitsTemplate: 'You said you want to lean into AI — and your interest in {problem} aligns perfectly. AI Workflow Specialists are the people who make AI actually useful for businesses, not just impressive in demos.',
    whyItFitsFallback: 'You show strong technical and analytical signals with an AI-forward mindset. This is the most future-facing career on this list — you\'d be building the systems that integrate AI into how businesses actually work.',
    dailyLifeDescription: 'A typical day involves designing automation flows in Make or Zapier, building custom AI agents with OpenAI or Claude APIs, testing prompts and fine-tuning outputs, documenting workflows for clients, analysing performance metrics, and staying current with new AI tools and capabilities. You work across API dashboards, no-code automation platforms, code editors (for API integrations), and communication tools.',
    honestCaveat: 'This is the most future-uncertain career on this list. The demand is real now, but the role is still being defined. Pair it with a second skill (writing, data, operations) for durability.',
    resources: {
      startHere: {
        title: 'Make (formerly Integromat) — Getting Started (free tier)',
        url: 'https://www.make.com/en/help/tutorials',
        timeMinutes: 15
      },
      learning: [
        {
          title: 'Make Academy (free)',
          url: 'https://academy.make.com',
          description: 'Learn automation fundamentals with Make — the most powerful free automation platform.'
        },
        {
          title: 'OpenAI API Documentation (free)',
          url: 'https://platform.openai.com/docs',
          description: 'Learn to build with the OpenAI API. Essential for any AI workflow specialist.'
        },
        {
          title: 'Zapier — Automation learning resources (free)',
          url: 'https://zapier.com/resources',
          description: 'Guides and tutorials on building automations that connect business tools.'
        }
      ],
      youtubeExplainers: [
        {
          title: 'How to Build & Sell AI Automations: Ultimate Beginner\'s Guide',
          url: 'https://www.youtube.com/watch?v=5TxSqvPbnWw',
          description: 'Beginner-facing introduction to AI automations, client value, and the skill stack behind the role.'
        }
      ]
    }
  }
];
