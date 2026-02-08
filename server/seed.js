/**
 * LearnSphere Database Seed Script
 * Populates the database with realistic sample data.
 *
 * Usage:
 *   1. Ensure PostgreSQL is running and the database exists
 *   2. Run schema first:  npm run db:init
 *   3. Then seed:         npm run seed
 */
require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('./db');

const SALT_ROUNDS = 12;

// ── Users ────────────────────────────────────────────────────
const USERS = [
  { name: 'LearnSphere Admin', email: 'admin@learnsphere.com', password: 'Admin@123', role: 'admin', badge: 'Admin', points: 0 },
  { name: 'Jane Doe',          email: 'jane@learnsphere.com',  password: 'Instructor1!', role: 'instructor', badge: 'Expert', points: 200 },
  { name: 'Marcus Chen',       email: 'marcus@learnsphere.com', password: 'Instructor2!', role: 'instructor', badge: 'Mentor', points: 150 },
  { name: 'Alice Johnson',     email: 'alice@example.com',  password: 'Learner1!', role: 'learner', badge: 'Rising Star', points: 85 },
  { name: 'Bob Williams',      email: 'bob@example.com',    password: 'Learner2!', role: 'learner', badge: 'Explorer', points: 42 },
  { name: 'Sara Martinez',     email: 'sara@example.com',   password: 'Learner3!', role: 'learner', badge: 'Beginner', points: 15 },
  { name: 'David Kim',         email: 'david@example.com',  password: 'Learner4!', role: 'learner', badge: 'Quick Learner', points: 60 },
  { name: 'Emily Rodriguez',   email: 'emily@example.com',  password: 'Learner5!', role: 'learner', badge: 'Achiever', points: 110 },
];

// ── Courses ──────────────────────────────────────────────────
const COURSES = [
  {
    title: 'React Fundamentals',
    shortDescription: 'Master the core concepts of React including components, state, props, and hooks.',
    description: 'React is the most popular JavaScript library for building user interfaces. In this comprehensive course, you\'ll learn everything from JSX syntax to advanced patterns like custom hooks and context API.\n\nBy the end, you\'ll be able to build production-ready single-page applications with confidence.',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop',
    tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
    category: 'Development',
    difficulty: 'Beginner',
    published: true,
    instructor_index: 1,
    rating: 4.7,
    totalDuration: '6h 30m',
    lessons: [
      { title: 'Introduction to React', type: 'document', duration: '15 min', content: '# Introduction to React\n\nReact is a JavaScript library created by Facebook for building user interfaces.\n\n## Why React?\n\n- Component-based architecture\n- Virtual DOM for performance\n- Huge ecosystem and community\n- Used by companies like Netflix, Airbnb, and Instagram\n\n## Prerequisites\n\n- Basic HTML & CSS knowledge\n- JavaScript fundamentals (ES6+)\n- A code editor (VS Code recommended)\n\n## What You Will Learn\n\n- JSX syntax and expressions\n- Components and props\n- State management with hooks\n- Event handling\n- Conditional rendering\n- Lists and keys' },
      { title: 'JSX and Components', type: 'video', duration: '25 min', content: 'https://www.youtube.com/embed/Tn6-PIqc4UM' },
      { title: 'State and Props Deep Dive', type: 'document', duration: '20 min', content: '# State and Props\n\n## Props\n\nProps (short for properties) are read-only inputs passed from parent to child components.\n\n- Always flow from parent to child\n- Cannot be modified by the receiving component\n- Can be any JavaScript value\n\n## State\n\nState is mutable data managed within a component using the useState hook.\n\n- Triggers re-renders when updated\n- Should be kept minimal\n- Never mutate state directly\n\n## Key Differences\n\n- Props are external, state is internal\n- Props are read-only, state can change\n- Both trigger re-renders when changed' },
      { title: 'React Hooks Masterclass', type: 'video', duration: '35 min', content: 'https://www.youtube.com/embed/TNhaISOUy6Q' },
      { title: 'React Basics Quiz', type: 'quiz', duration: '10 min', content: '', quiz: [
        { text: 'What is JSX?', options: ['A database language', 'A syntax extension for JavaScript', 'A CSS framework', 'A testing library'], correctAnswer: 1 },
        { text: 'Which hook is used for state management in functional components?', options: ['useEffect', 'useContext', 'useState', 'useRef'], correctAnswer: 2 },
        { text: 'Props in React are:', options: ['Mutable by child', 'Read-only', 'Only strings', 'Optional'], correctAnswer: 1 },
        { text: 'What does the Virtual DOM do?', options: ['Replaces the real DOM', 'Optimizes UI updates by diffing', 'Stores data locally', 'Handles routing'], correctAnswer: 1 },
        { text: 'Which method triggers a re-render?', options: ['console.log()', 'Setting state', 'Calling a function', 'Importing a module'], correctAnswer: 1 },
      ]},
    ],
  },
  {
    title: 'Python for Data Science',
    shortDescription: 'Learn Python fundamentals and data analysis with pandas, NumPy, and matplotlib.',
    description: 'Python is the go-to language for data science and machine learning. This course covers everything from basic syntax to advanced data manipulation techniques.\n\nYou\'ll work with real-world datasets and learn to extract meaningful insights using industry-standard tools.',
    coverImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=500&fit=crop',
    tags: ['Python', 'Data Science', 'Pandas', 'NumPy'],
    category: 'Data Science',
    difficulty: 'Intermediate',
    published: true,
    instructor_index: 2,
    rating: 4.5,
    totalDuration: '8h 15m',
    lessons: [
      { title: 'Python Crash Course', type: 'document', duration: '30 min', content: '# Python Crash Course\n\nPython is a versatile, high-level programming language known for its readability.\n\n## Data Types\n\n- int, float, str, bool\n- list, tuple, dict, set\n\n## Control Flow\n\n- if/elif/else statements\n- for and while loops\n- List comprehensions\n\n## Functions\n\n- def keyword\n- Default parameters\n- *args and **kwargs\n- Lambda functions\n\n## Why Python for Data Science?\n\n- Rich ecosystem (NumPy, Pandas, scikit-learn)\n- Easy to learn and read\n- Large community and resources' },
      { title: 'NumPy Essentials', type: 'video', duration: '40 min', content: 'https://www.youtube.com/embed/QUT1VHiLmmI' },
      { title: 'Pandas DataFrames', type: 'document', duration: '35 min', content: '# Pandas DataFrames\n\n## What is a DataFrame?\n\nA two-dimensional, size-mutable, tabular data structure with labeled axes.\n\n## Creating DataFrames\n\n- From dictionaries\n- From CSV files\n- From SQL queries\n\n## Key Operations\n\n- Selecting columns and rows\n- Filtering data with conditions\n- Grouping and aggregation\n- Merging and joining\n\n## Data Cleaning\n\n- Handling missing values (dropna, fillna)\n- Removing duplicates\n- Data type conversion\n- String manipulation' },
      { title: 'Data Visualization with Matplotlib', type: 'video', duration: '30 min', content: 'https://www.youtube.com/embed/UO98lJQ3QGI' },
      { title: 'Python Data Science Quiz', type: 'quiz', duration: '10 min', content: '', quiz: [
        { text: 'Which library is used for numerical computing in Python?', options: ['Pandas', 'NumPy', 'Flask', 'Django'], correctAnswer: 1 },
        { text: 'What is a Pandas DataFrame?', options: ['A chart type', 'A 2D tabular data structure', 'A Python function', 'A file format'], correctAnswer: 1 },
        { text: 'Which method reads a CSV file in Pandas?', options: ['pd.open_csv()', 'pd.read_csv()', 'pd.load()', 'pd.import_csv()'], correctAnswer: 1 },
        { text: 'What does df.dropna() do?', options: ['Drops columns', 'Removes all data', 'Removes rows with missing values', 'Resets the index'], correctAnswer: 2 },
      ]},
    ],
  },
  {
    title: 'UX Design Principles',
    shortDescription: 'Understand user experience design from research to prototyping to testing.',
    description: 'Great design isn\'t just about aesthetics\u2014it\'s about solving real user problems. This course teaches you the fundamentals of UX design including user research, wireframing, prototyping, and usability testing.\n\nPerfect for designers, developers, and product managers who want to create user-centered products.',
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop',
    tags: ['UX', 'Design', 'Prototyping', 'User Research'],
    category: 'Design',
    difficulty: 'Beginner',
    published: true,
    instructor_index: 1,
    rating: 4.8,
    totalDuration: '5h 45m',
    lessons: [
      { title: 'What is UX Design?', type: 'document', duration: '20 min', content: '# What is UX Design?\n\nUser Experience (UX) design is the process of creating products that provide meaningful and relevant experiences to users.\n\n## Key Principles\n\n- User-centered design\n- Accessibility and inclusivity\n- Consistency and standards\n- Error prevention\n- Flexibility and efficiency\n\n## The UX Design Process\n\n1. Research & Discovery\n2. Define & Analyze\n3. Design & Prototype\n4. Test & Iterate\n\n## Career Opportunities\n\n- UX Designer\n- UX Researcher\n- Interaction Designer\n- Information Architect' },
      { title: 'User Research Methods', type: 'video', duration: '25 min', content: 'https://www.youtube.com/embed/V20uxScaGOw' },
      { title: 'Wireframing & Prototyping', type: 'document', duration: '30 min', content: '# Wireframing & Prototyping\n\n## Wireframes\n\nLow-fidelity visual guides representing the skeletal framework of a product.\n\n- Focus on layout and structure\n- No colors or detailed styling\n- Quick to create and iterate\n\n## Prototypes\n\nInteractive simulations of the final product.\n\n- Low-fidelity: paper or basic digital\n- High-fidelity: detailed, interactive\n\n## Tools\n\n- Figma (most popular)\n- Sketch\n- Adobe XD\n- InVision\n\n## Best Practices\n\n- Start with the user flow\n- Keep it simple initially\n- Test early and often\n- Document design decisions' },
      { title: 'Usability Testing', type: 'video', duration: '20 min', content: 'https://www.youtube.com/embed/BrVnBj3m_wQ' },
      { title: 'UX Design Quiz', type: 'quiz', duration: '10 min', content: '', quiz: [
        { text: 'What does UX stand for?', options: ['User Extension', 'User Experience', 'Ultra Experience', 'Unified Expression'], correctAnswer: 1 },
        { text: 'Which is NOT a UX research method?', options: ['User interviews', 'Surveys', 'Code review', 'Usability testing'], correctAnswer: 2 },
        { text: 'What is a wireframe?', options: ['Final design', 'A skeletal visual guide', 'A programming language', 'A color palette'], correctAnswer: 1 },
        { text: 'What is the primary goal of usability testing?', options: ['Find bugs', 'Evaluate user experience', 'Write documentation', 'Deploy the product'], correctAnswer: 1 },
      ]},
    ],
  },
  {
    title: 'Node.js Backend Development',
    shortDescription: 'Build scalable server-side applications with Node.js, Express, and PostgreSQL.',
    description: 'Learn to build robust backend APIs using Node.js and Express. This course covers RESTful API design, database integration with PostgreSQL, authentication with JWT, and deployment best practices.\n\nIdeal for frontend developers looking to become full-stack.',
    coverImage: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=500&fit=crop',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'API'],
    category: 'Development',
    difficulty: 'Intermediate',
    published: true,
    instructor_index: 2,
    rating: 4.6,
    totalDuration: '7h 20m',
    lessons: [
      { title: 'Introduction to Node.js', type: 'document', duration: '20 min', content: '# Introduction to Node.js\n\nNode.js is a JavaScript runtime built on Chrome\'s V8 engine that lets you run JavaScript on the server.\n\n## Why Node.js?\n\n- Non-blocking, event-driven architecture\n- Same language for frontend and backend\n- NPM\u2014the largest package ecosystem\n- Great for real-time applications\n\n## Setting Up\n\n- Install Node.js from nodejs.org\n- Verify: node -v and npm -v\n- Initialize project: npm init -y\n\n## Core Modules\n\n- fs (file system)\n- http (HTTP server)\n- path (file paths)\n- events (event emitter)' },
      { title: 'Express.js Fundamentals', type: 'video', duration: '35 min', content: 'https://www.youtube.com/embed/SccSCuHhOw0' },
      { title: 'RESTful API Design', type: 'document', duration: '25 min', content: '# RESTful API Design\n\n## REST Principles\n\n- Stateless communication\n- Resource-based URLs\n- Standard HTTP methods (GET, POST, PUT, DELETE)\n- Proper status codes\n\n## URL Structure\n\n- /api/users \u2014 collection\n- /api/users/:id \u2014 single resource\n- /api/users/:id/posts \u2014 nested resources\n\n## Best Practices\n\n- Use nouns, not verbs\n- Version your API\n- Handle errors consistently\n- Paginate large collections\n- Validate input data' },
      { title: 'Database Integration', type: 'video', duration: '30 min', content: 'https://www.youtube.com/embed/l8pRSuU81PU' },
      { title: 'Authentication with JWT', type: 'document', duration: '25 min', content: '# Authentication with JWT\n\n## What is JWT?\n\nJSON Web Token\u2014a compact, self-contained token for securely transmitting information between parties.\n\n## Structure\n\n- Header (algorithm, type)\n- Payload (claims, user data)\n- Signature (verification)\n\n## Implementation Steps\n\n1. Install jsonwebtoken and bcrypt\n2. Hash passwords on registration\n3. Compare on login, issue JWT\n4. Middleware to verify token\n5. Protect routes with middleware\n\n## Security Tips\n\n- Use strong secret keys\n- Set token expiration\n- Use HTTPS in production\n- Never store sensitive data in payload' },
      { title: 'Node.js Backend Quiz', type: 'quiz', duration: '10 min', content: '', quiz: [
        { text: 'Node.js is built on which JavaScript engine?', options: ['SpiderMonkey', 'V8', 'Chakra', 'JavaScriptCore'], correctAnswer: 1 },
        { text: 'Which framework is commonly used with Node.js for web servers?', options: ['Django', 'Flask', 'Express', 'Rails'], correctAnswer: 2 },
        { text: 'What does REST stand for?', options: ['Remote Execution Standard Technology', 'Representational State Transfer', 'Real-time Event Stream Technology', 'Resource Exchange Service Tool'], correctAnswer: 1 },
        { text: 'JWT tokens consist of how many parts?', options: ['2', '3', '4', '5'], correctAnswer: 1 },
        { text: 'Which HTTP method is used to update a resource?', options: ['GET', 'POST', 'PUT', 'DELETE'], correctAnswer: 2 },
      ]},
    ],
  },
  {
    title: 'Machine Learning Foundations',
    shortDescription: 'Get started with machine learning concepts, algorithms, and practical applications.',
    description: 'This course provides a solid foundation in machine learning. You\'ll learn about supervised and unsupervised learning, common algorithms, model evaluation, and real-world applications.\n\nNo advanced math required\u2014we focus on intuitive understanding and practical implementation.',
    coverImage: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop',
    tags: ['Machine Learning', 'AI', 'Python', 'scikit-learn'],
    category: 'Data Science',
    difficulty: 'Advanced',
    published: true,
    instructor_index: 2,
    rating: 4.4,
    totalDuration: '9h 10m',
    lessons: [
      { title: 'What is Machine Learning?', type: 'document', duration: '25 min', content: '# What is Machine Learning?\n\nMachine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.\n\n## Types of ML\n\n- Supervised Learning (labeled data)\n- Unsupervised Learning (unlabeled data)\n- Reinforcement Learning (reward-based)\n\n## Common Applications\n\n- Spam detection\n- Recommendation systems\n- Image recognition\n- Natural language processing\n- Fraud detection\n\n## The ML Pipeline\n\n1. Data collection\n2. Data preprocessing\n3. Feature engineering\n4. Model selection\n5. Training\n6. Evaluation\n7. Deployment' },
      { title: 'Supervised Learning Algorithms', type: 'video', duration: '40 min', content: 'https://www.youtube.com/embed/4qVRBYAdLAo' },
      { title: 'Unsupervised Learning', type: 'document', duration: '30 min', content: '# Unsupervised Learning\n\n## Overview\n\nFinds hidden patterns in data without predefined labels.\n\n## Clustering Algorithms\n\n- K-Means: partitions data into k clusters\n- DBSCAN: density-based clustering\n- Hierarchical: builds a tree of clusters\n\n## Dimensionality Reduction\n\n- PCA (Principal Component Analysis)\n- t-SNE for visualization\n- Autoencoders (neural networks)\n\n## Applications\n\n- Customer segmentation\n- Anomaly detection\n- Topic modeling\n- Data compression' },
      { title: 'Model Evaluation', type: 'video', duration: '25 min', content: 'https://www.youtube.com/embed/LbX4X71GOFs' },
      { title: 'ML Foundations Quiz', type: 'quiz', duration: '10 min', content: '', quiz: [
        { text: 'Which type of learning uses labeled data?', options: ['Unsupervised', 'Supervised', 'Reinforcement', 'Transfer'], correctAnswer: 1 },
        { text: 'K-Means is an example of:', options: ['Supervised learning', 'Reinforcement learning', 'Clustering algorithm', 'Regression'], correctAnswer: 2 },
        { text: 'What metric measures a classification model\'s accuracy?', options: ['MSE', 'R-squared', 'F1 Score', 'Learning rate'], correctAnswer: 2 },
        { text: 'Overfitting means the model:', options: ['Is too simple', 'Performs well on training data but poorly on new data', 'Has too few features', 'Needs more training time'], correctAnswer: 1 },
      ]},
    ],
  },
  {
    title: 'CSS Grid & Flexbox Mastery',
    shortDescription: 'Master modern CSS layout techniques with hands-on projects and examples.',
    description: 'Stop fighting with CSS layouts! This course teaches you both CSS Grid and Flexbox from the ground up with practical examples and real-world projects.\n\nYou\'ll build responsive layouts, complex grids, and learn when to use each technique.',
    coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=500&fit=crop',
    tags: ['CSS', 'Frontend', 'Responsive Design', 'Web Development'],
    category: 'Development',
    difficulty: 'Beginner',
    published: true,
    instructor_index: 1,
    rating: 4.9,
    totalDuration: '4h 50m',
    lessons: [
      { title: 'Flexbox Fundamentals', type: 'document', duration: '25 min', content: '# Flexbox Fundamentals\n\n## What is Flexbox?\n\nA one-dimensional layout method for arranging items in rows or columns.\n\n## Key Properties (Container)\n\n- display: flex\n- flex-direction: row | column\n- justify-content: flex-start | center | space-between\n- align-items: stretch | center | flex-start\n- flex-wrap: nowrap | wrap\n\n## Key Properties (Items)\n\n- flex-grow\n- flex-shrink\n- flex-basis\n- align-self\n- order\n\n## Use Cases\n\n- Navigation bars\n- Card layouts\n- Centering content\n- Equal height columns' },
      { title: 'Flexbox in Practice', type: 'video', duration: '30 min', content: 'https://www.youtube.com/embed/fYq5PXgSsbE' },
      { title: 'CSS Grid Layout', type: 'document', duration: '30 min', content: '# CSS Grid Layout\n\n## What is CSS Grid?\n\nA two-dimensional layout system that handles both columns and rows.\n\n## Defining a Grid\n\n- display: grid\n- grid-template-columns\n- grid-template-rows\n- grid-gap (gap)\n\n## Placing Items\n\n- grid-column: start / end\n- grid-row: start / end\n- grid-area\n- Named grid lines\n\n## Advanced Features\n\n- fr units (fractional)\n- minmax() function\n- auto-fit and auto-fill\n- Grid template areas\n\n## Grid vs Flexbox\n\n- Grid: 2D layouts\n- Flexbox: 1D alignment\n- Often used together!' },
      { title: 'Responsive Layouts', type: 'video', duration: '25 min', content: 'https://www.youtube.com/embed/srvUrASNj0s' },
      { title: 'CSS Layout Quiz', type: 'quiz', duration: '10 min', content: '', quiz: [
        { text: 'Flexbox is a ___-dimensional layout system.', options: ['One', 'Two', 'Three', 'Multi'], correctAnswer: 0 },
        { text: 'Which property creates a grid container?', options: ['display: flex', 'display: grid', 'display: block', 'display: table'], correctAnswer: 1 },
        { text: 'The "fr" unit in CSS Grid stands for:', options: ['Frame', 'Fraction', 'Free', 'Full-row'], correctAnswer: 1 },
        { text: 'Which property controls spacing between grid items?', options: ['margin', 'padding', 'gap', 'spacing'], correctAnswer: 2 },
      ]},
    ],
  },
  {
    title: 'TypeScript Essential Training',
    shortDescription: 'Add static typing to your JavaScript projects with TypeScript.',
    description: 'TypeScript brings type safety to JavaScript, catching errors before runtime. Learn type annotations, interfaces, generics, and how to integrate TypeScript into your existing projects.\n\nThis course is perfect for JavaScript developers ready to level up their code quality.',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=500&fit=crop',
    tags: ['TypeScript', 'JavaScript', 'Frontend', 'Types'],
    category: 'Development',
    difficulty: 'Intermediate',
    published: true,
    instructor_index: 1,
    rating: 4.6,
    totalDuration: '5h 30m',
    lessons: [
      { title: 'Why TypeScript?', type: 'document', duration: '15 min', content: '# Why TypeScript?\n\n## The Problem with JavaScript\n\n- No compile-time type checking\n- Runtime errors from type mismatches\n- Harder to refactor large codebases\n\n## Benefits of TypeScript\n\n- Catch errors during development\n- Better IDE support (autocomplete, refactoring)\n- Self-documenting code\n- Gradual adoption (valid JS is valid TS)\n\n## TypeScript vs JavaScript\n\n- TypeScript is a superset of JavaScript\n- Compiles down to plain JavaScript\n- All JavaScript code runs in TypeScript\n- Extra features: types, interfaces, enums, generics' },
      { title: 'Basic Types & Interfaces', type: 'video', duration: '30 min', content: 'https://www.youtube.com/embed/BwuLxPH8IDs' },
      { title: 'Generics & Advanced Types', type: 'document', duration: '25 min', content: '# Generics & Advanced Types\n\n## Why Generics?\n\nWrite reusable code that works with different types while maintaining type safety.\n\n## Generic Functions\n\n- function identity<T>(arg: T): T\n- Constrains with extends\n\n## Generic Interfaces & Classes\n\n- interface Container<T>\n- class Queue<T>\n\n## Advanced Types\n\n- Union types (A | B)\n- Intersection types (A & B)\n- Conditional types\n- Mapped types\n- Template literal types\n\n## Utility Types\n\n- Partial<T>, Required<T>\n- Pick<T, K>, Omit<T, K>\n- Record<K, V>\n- Readonly<T>' },
      { title: 'TypeScript with React', type: 'video', duration: '35 min', content: 'https://www.youtube.com/embed/FJDVKeh7RJI' },
      { title: 'TypeScript Quiz', type: 'quiz', duration: '10 min', content: '', quiz: [
        { text: 'TypeScript is a ___ of JavaScript.', options: ['Replacement', 'Superset', 'Subset', 'Alternative'], correctAnswer: 1 },
        { text: 'Which keyword defines an interface?', options: ['type', 'interface', 'class', 'struct'], correctAnswer: 1 },
        { text: 'Generics allow you to:', options: ['Write faster code', 'Create reusable typed components', 'Skip type checking', 'Use only strings'], correctAnswer: 1 },
        { text: 'What does Partial<T> do?', options: ['Removes all properties', 'Makes all properties optional', 'Makes all properties required', 'Converts to string'], correctAnswer: 1 },
      ]},
    ],
  },
  {
    title: 'Business Analytics Fundamentals',
    shortDescription: 'Learn to make data-driven business decisions with analytics and visualization.',
    description: 'Understand how businesses use data to make decisions. This course covers descriptive analytics, KPIs, dashboards, A/B testing, and communicating insights to stakeholders.\n\nNo coding required\u2014focused on concepts and tools.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
    tags: ['Business', 'Analytics', 'Dashboards', 'KPI'],
    category: 'Business',
    difficulty: 'Beginner',
    published: true,
    instructor_index: 2,
    rating: 4.3,
    totalDuration: '4h 15m',
    lessons: [
      { title: 'Introduction to Business Analytics', type: 'document', duration: '20 min', content: '# Business Analytics\n\n## What is Business Analytics?\n\nThe practice of iterative, methodical exploration of data to make better business decisions.\n\n## Types of Analytics\n\n- Descriptive: What happened?\n- Diagnostic: Why did it happen?\n- Predictive: What will happen?\n- Prescriptive: What should we do?\n\n## Key Concepts\n\n- KPIs (Key Performance Indicators)\n- ROI (Return on Investment)\n- Conversion rates\n- Customer lifetime value\n- Churn rate' },
      { title: 'Building Effective Dashboards', type: 'video', duration: '25 min', content: 'https://www.youtube.com/embed/K74_FNnlIF8' },
      { title: 'A/B Testing & Experiments', type: 'document', duration: '20 min', content: '# A/B Testing\n\n## What is A/B Testing?\n\nComparing two versions of something to determine which performs better.\n\n## Steps\n\n1. Define the hypothesis\n2. Create variants (A and B)\n3. Split traffic randomly\n4. Measure results\n5. Determine statistical significance\n\n## Common Tests\n\n- Landing page designs\n- Email subject lines\n- Pricing strategies\n- Feature rollouts\n\n## Pitfalls\n\n- Sample size too small\n- Testing too many variables\n- Stopping too early\n- Ignoring external factors' },
      { title: 'Business Analytics Quiz', type: 'quiz', duration: '10 min', content: '', quiz: [
        { text: 'Descriptive analytics answers which question?', options: ['What will happen?', 'What should we do?', 'What happened?', 'Why did it happen?'], correctAnswer: 2 },
        { text: 'KPI stands for:', options: ['Key Product Insight', 'Key Performance Indicator', 'Known Process Integration', 'Key Planning Index'], correctAnswer: 1 },
        { text: 'A/B testing compares:', options: ['Two databases', 'Two versions of something', 'Two programming languages', 'Two employees'], correctAnswer: 1 },
      ]},
    ],
  },
  // ── Paid Courses ───────────────────────────────────────────
  {
    title: 'Advanced React Patterns & Architecture',
    shortDescription: 'Master advanced React patterns including compound components, render props, and state machines.',
    description: 'Take your React skills to the next level with advanced design patterns used by top engineering teams. This premium course covers compound components, render props, custom hooks architecture, state machines with XState, and performance optimization patterns.\n\nIncludes real-world case studies from production applications.',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=500&fit=crop',
    tags: ['React', 'Advanced', 'Architecture', 'Design Patterns'],
    category: 'Development',
    difficulty: 'Advanced',
    published: true,
    instructor_index: 1,
    rating: 4.9,
    totalDuration: '12h 30m',
    access: 'On Payment',
    price: 49.99,
    lessons: [
      { title: 'Compound Components Pattern', type: 'document', duration: '30 min', content: '# Compound Components\n\nCompound components is a pattern where components work together to form a complete UI.\n\n## Why?\n\n- Flexible APIs\n- Implicit state sharing\n- Clean component interfaces\n\n## Implementation\n\n- React.createContext for shared state\n- Parent manages state\n- Children consume via context\n- Works great for Tabs, Accordion, Select components' },
      { title: 'Render Props & HOCs', type: 'video', duration: '40 min', content: 'https://www.youtube.com/embed/BcVAq3YFiuc' },
      { title: 'Custom Hooks Architecture', type: 'document', duration: '35 min', content: '# Custom Hooks Architecture\n\n## Building Reusable Hooks\n\n- Extract common logic\n- Compose hooks together\n- Handle loading, error, and data states\n\n## Patterns\n\n- useAsync for data fetching\n- useDebounce for input optimization\n- useLocalStorage for persistence\n- useMediaQuery for responsive logic\n\n## Testing Hooks\n\n- renderHook from testing-library\n- Mock dependencies\n- Test state transitions' },
      { title: 'State Machines with XState', type: 'video', duration: '45 min', content: 'https://www.youtube.com/embed/iDZUKFBTXoo' },
      { title: 'Advanced React Quiz', type: 'quiz', duration: '15 min', content: '', quiz: [
        { text: 'Compound components share state via:', options: ['Props drilling', 'React Context', 'Global variables', 'Redux only'], correctAnswer: 1 },
        { text: 'Which hook pattern handles async operations?', options: ['useEffect only', 'useAsync pattern', 'useState only', 'useRef'], correctAnswer: 1 },
        { text: 'State machines help with:', options: ['Styling components', 'Managing complex state transitions', 'Routing', 'API calls'], correctAnswer: 1 },
      ]},
    ],
  },
  {
    title: 'Full-Stack AI Applications with Python',
    shortDescription: 'Build production-ready AI-powered web applications from scratch.',
    description: 'Learn to build and deploy AI-powered applications using Python, FastAPI, and modern AI APIs. This premium course covers prompt engineering, RAG (Retrieval-Augmented Generation), vector databases, streaming responses, and deploying to production.\n\nBuild 3 complete projects including a chatbot, document Q&A system, and AI writing assistant.',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop',
    tags: ['AI', 'Python', 'Full-Stack', 'LLM', 'FastAPI'],
    category: 'AI & ML',
    difficulty: 'Advanced',
    published: true,
    instructor_index: 2,
    rating: 4.7,
    totalDuration: '15h 45m',
    access: 'On Payment',
    price: 79.99,
    lessons: [
      { title: 'AI Application Architecture', type: 'document', duration: '25 min', content: '# AI Application Architecture\n\n## Modern AI Stack\n\n- Frontend: React/Next.js\n- Backend: FastAPI / Node.js\n- AI: OpenAI / Anthropic APIs\n- Vector DB: Pinecone / Chroma\n- Deployment: Docker + Cloud\n\n## Key Concepts\n\n- Prompt engineering\n- Token management\n- Streaming responses\n- Rate limiting\n- Error handling for AI calls' },
      { title: 'Prompt Engineering Masterclass', type: 'video', duration: '45 min', content: 'https://www.youtube.com/embed/jC4v5AS4RIM' },
      { title: 'Building RAG Systems', type: 'document', duration: '40 min', content: '# Retrieval-Augmented Generation\n\n## What is RAG?\n\nCombine retrieval from a knowledge base with LLM generation for accurate, grounded answers.\n\n## Components\n\n1. Document ingestion & chunking\n2. Embedding generation\n3. Vector storage\n4. Similarity search\n5. Context injection into prompts\n6. LLM response generation\n\n## Best Practices\n\n- Chunk size matters (512-1024 tokens)\n- Use overlap between chunks\n- Rerank retrieved results\n- Include metadata in context' },
      { title: 'Vector Databases Deep Dive', type: 'video', duration: '35 min', content: 'https://www.youtube.com/embed/klTvEwg3oJ4' },
      { title: 'AI Applications Quiz', type: 'quiz', duration: '15 min', content: '', quiz: [
        { text: 'RAG stands for:', options: ['Random Access Generation', 'Retrieval-Augmented Generation', 'Real-time AI Gateway', 'Recursive Algorithm Generation'], correctAnswer: 1 },
        { text: 'Vector databases store:', options: ['SQL tables', 'JSON documents', 'Numerical embeddings', 'Plain text files'], correctAnswer: 2 },
        { text: 'Prompt engineering is about:', options: ['Building prompts UI', 'Crafting effective AI instructions', 'Training models from scratch', 'Database optimization'], correctAnswer: 1 },
      ]},
    ],
  },
  {
    title: 'System Design for Senior Engineers',
    shortDescription: 'Master system design interviews and build scalable distributed systems.',
    description: 'Prepare for system design interviews and learn to architect large-scale systems. Covers load balancing, caching, database sharding, message queues, microservices, and real-world case studies from Netflix, Uber, and Twitter.\n\nIncludes 10 complete system design walkthroughs.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop',
    tags: ['System Design', 'Architecture', 'Scalability', 'Distributed Systems'],
    category: 'Engineering',
    difficulty: 'Advanced',
    published: true,
    instructor_index: 1,
    rating: 4.8,
    totalDuration: '10h 20m',
    access: 'On Payment',
    price: 59.99,
    lessons: [
      { title: 'System Design Fundamentals', type: 'document', duration: '30 min', content: '# System Design Fundamentals\n\n## Why System Design?\n\n- Scale applications to millions of users\n- Handle high availability requirements\n- Make informed architectural decisions\n\n## Core Concepts\n\n- Horizontal vs vertical scaling\n- Load balancing strategies\n- Database replication & sharding\n- Caching layers (CDN, Redis)\n- Message queues (Kafka, RabbitMQ)\n\n## Design Process\n\n1. Clarify requirements\n2. Estimate scale\n3. Define API\n4. Design high-level architecture\n5. Deep dive into components\n6. Address bottlenecks' },
      { title: 'Load Balancing & Caching', type: 'video', duration: '35 min', content: 'https://www.youtube.com/embed/sCR3SAVdyCc' },
      { title: 'Database Scaling Strategies', type: 'document', duration: '30 min', content: '# Database Scaling\n\n## Replication\n\n- Master-slave replication\n- Multi-master replication\n- Read replicas\n\n## Sharding\n\n- Horizontal partitioning\n- Shard key selection\n- Consistent hashing\n\n## CAP Theorem\n\n- Consistency\n- Availability\n- Partition Tolerance\n- You can only have 2 of 3\n\n## NoSQL Options\n\n- Document stores (MongoDB)\n- Key-value stores (Redis)\n- Column stores (Cassandra)\n- Graph databases (Neo4j)' },
      { title: 'Microservices Architecture', type: 'video', duration: '40 min', content: 'https://www.youtube.com/embed/lL_j7ilk7rc' },
      { title: 'System Design Quiz', type: 'quiz', duration: '15 min', content: '', quiz: [
        { text: 'CAP theorem says you can achieve:', options: ['All three guarantees', 'Any two of three', 'Only one guarantee', 'None reliably'], correctAnswer: 1 },
        { text: 'Horizontal scaling means:', options: ['Adding more RAM', 'Adding more machines', 'Upgrading CPU', 'Using SSDs'], correctAnswer: 1 },
        { text: 'Redis is primarily used as:', options: ['A relational database', 'An in-memory cache/store', 'A message queue', 'A web server'], correctAnswer: 1 },
      ]},
    ],
  },
];

// ── Reviews ──────────────────────────────────────────────────
const REVIEWS = [
  { user_index: 3, course_index: 0, rating: 5, comment: 'Excellent course! The React hooks section was incredibly well explained.' },
  { user_index: 4, course_index: 0, rating: 4, comment: 'Great content. Would love more practice exercises.' },
  { user_index: 6, course_index: 0, rating: 5, comment: 'Finally understand React hooks. Thank you!' },
  { user_index: 3, course_index: 1, rating: 4, comment: 'Good introduction to data science. The Pandas section was very practical.' },
  { user_index: 7, course_index: 1, rating: 5, comment: 'Clear explanations and great examples. Highly recommended.' },
  { user_index: 4, course_index: 2, rating: 5, comment: 'Changed how I think about design. The research methods section was eye-opening.' },
  { user_index: 6, course_index: 2, rating: 5, comment: 'Perfect for beginners. Well-structured and engaging.' },
  { user_index: 7, course_index: 2, rating: 4, comment: 'Loved the wireframing exercises. Would like more advanced topics.' },
  { user_index: 3, course_index: 3, rating: 4, comment: 'Solid backend course. The JWT section was exactly what I needed.' },
  { user_index: 4, course_index: 3, rating: 5, comment: 'Best Node.js course I have taken. Very hands-on.' },
  { user_index: 7, course_index: 4, rating: 4, comment: 'Great ML overview. The intuitive explanations really help.' },
  { user_index: 3, course_index: 5, rating: 5, comment: 'CSS Grid finally makes sense! Incredible course.' },
  { user_index: 6, course_index: 5, rating: 5, comment: 'The best CSS layout course out there. Practical and clear.' },
  { user_index: 4, course_index: 6, rating: 4, comment: 'TypeScript is less scary now. Good pacing.' },
  { user_index: 7, course_index: 7, rating: 4, comment: 'Good business insights. Wish it was longer.' },
];

// ── Enrollments ──────────────────────────────────────────────
const ENROLLMENTS = [
  { user_index: 3, course_index: 0 },
  { user_index: 3, course_index: 1 },
  { user_index: 3, course_index: 3 },
  { user_index: 3, course_index: 5 },
  { user_index: 4, course_index: 0 },
  { user_index: 4, course_index: 2 },
  { user_index: 4, course_index: 3 },
  { user_index: 4, course_index: 6 },
  { user_index: 5, course_index: 0 },
  { user_index: 5, course_index: 5 },
  { user_index: 6, course_index: 0 },
  { user_index: 6, course_index: 2 },
  { user_index: 6, course_index: 5 },
  { user_index: 7, course_index: 1 },
  { user_index: 7, course_index: 2 },
  { user_index: 7, course_index: 3 },
  { user_index: 7, course_index: 4 },
  { user_index: 7, course_index: 7 },
];

// ══════════════════════════════════════════════════════════════
async function seed() {
  console.log('\n\x1b[36m\u2550\u2550\u2550 LearnSphere Database Seeder \u2550\u2550\u2550\x1b[0m\n');

  try {
    // ── 0. Migrations ─────────────────────────────────────────
    console.log('\x1b[33m▶ Running migrations...\x1b[0m');
    // Add type and correct_text columns to quiz_questions if they don't exist
    await db.query(`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'type') THEN
          ALTER TABLE quiz_questions ADD COLUMN type TEXT DEFAULT 'mcq' CHECK (type IN ('mcq', 'fill_blank'));
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'quiz_questions' AND column_name = 'correct_text') THEN
          ALTER TABLE quiz_questions ADD COLUMN correct_text TEXT DEFAULT '';
        END IF;
        -- Make options column nullable for fill_blank questions
        ALTER TABLE quiz_questions ALTER COLUMN options SET DEFAULT '{}';
      END $$;
    `);
    console.log('   ✅ Migrations complete');

    // ── 1. Users ──────────────────────────────────────────────
    console.log('\x1b[33m\u25B6 Creating users...\x1b[0m');
    const userIds = [];
    for (const u of USERS) {
      const existing = await db.query('SELECT id FROM users WHERE email = $1', [u.email]);
      if (existing.rows.length > 0) {
        userIds.push(existing.rows[0].id);
        console.log(`   \u2713 ${u.name} (${u.role}) \u2014 already exists`);
      } else {
        const hash = await bcrypt.hash(u.password, SALT_ROUNDS);
        const result = await db.query(
          `INSERT INTO users (name, email, password_hash, role, badge, points)
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
          [u.name, u.email, hash, u.role, u.badge, u.points]
        );
        userIds.push(result.rows[0].id);
        console.log(`   \u2705 ${u.name} (${u.role})`);
      }
    }

    // ── 2. Courses & Lessons ──────────────────────────────────
    console.log('\n\x1b[33m\u25B6 Creating courses...\x1b[0m');
    const courseIds = [];
    for (const c of COURSES) {
      const instructorId = userIds[c.instructor_index];
      const instructorName = USERS[c.instructor_index].name;

      const existing = await db.query(
        'SELECT id FROM courses WHERE title = $1 AND instructor_id = $2',
        [c.title, instructorId]
      );

      let courseId;
      if (existing.rows.length > 0) {
        courseId = existing.rows[0].id;
        console.log(`   \u2713 "${c.title}" \u2014 already exists`);
      } else {
        const result = await db.query(
          `INSERT INTO courses (title, short_description, description, cover_image, tags,
             category, difficulty, published, instructor_id, instructor_name, rating, total_duration,
             access, price)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id`,
          [c.title, c.shortDescription, c.description, c.coverImage, c.tags,
           c.category, c.difficulty, c.published, instructorId, instructorName, c.rating, c.totalDuration,
           c.access || 'Open', c.price || 0]
        );
        courseId = result.rows[0].id;
        console.log(`   \u2705 "${c.title}" (${c.lessons.length} lessons)`);

        for (let i = 0; i < c.lessons.length; i++) {
          const l = c.lessons[i];
          const lessonResult = await db.query(
            `INSERT INTO lessons (course_id, title, type, content, duration, sort_order)
             VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
            [courseId, l.title, l.type, l.content, l.duration, i + 1]
          );

          if (l.quiz && l.quiz.length > 0) {
            for (let qi = 0; qi < l.quiz.length; qi++) {
              const q = l.quiz[qi];
              await db.query(
                `INSERT INTO quiz_questions (lesson_id, text, options, correct_answer, sort_order)
                 VALUES ($1,$2,$3,$4,$5)`,
                [lessonResult.rows[0].id, q.text, q.options, q.correctAnswer, qi + 1]
              );
            }
          }
        }
      }
      courseIds.push(courseId);
    }

    // ── 3. Enrollments ────────────────────────────────────────
    console.log('\n\x1b[33m\u25B6 Creating enrollments...\x1b[0m');
    let enrollCount = 0;
    for (const e of ENROLLMENTS) {
      const userId = userIds[e.user_index];
      const courseId = courseIds[e.course_index];
      const existing = await db.query(
        'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
        [userId, courseId]
      );
      if (existing.rows.length === 0) {
        const daysAgo = Math.floor(Math.random() * 30) + 1;
        await db.query(
          `INSERT INTO enrollments (user_id, course_id, enrolled_date, start_date)
           VALUES ($1, $2, NOW() - ($3 || ' days')::interval, NOW() - ($4 || ' days')::interval)`,
          [userId, courseId, daysAgo, Math.max(daysAgo - 2, 0)]
        );
        enrollCount++;
      }
    }
    console.log(`   \u2705 ${enrollCount} enrollments created`);

    // ── 4. Lesson progress ────────────────────────────────────
    console.log('\n\x1b[33m\u25B6 Creating lesson progress...\x1b[0m');
    let progressCount = 0;
    for (const e of ENROLLMENTS) {
      const userId = userIds[e.user_index];
      const courseId = courseIds[e.course_index];
      const lessons = await db.query(
        'SELECT id FROM lessons WHERE course_id = $1 ORDER BY sort_order',
        [courseId]
      );
      const completionRate = 0.4 + Math.random() * 0.4;
      const lessonsToComplete = Math.floor(lessons.rows.length * completionRate);
      for (let i = 0; i < lessonsToComplete; i++) {
        const lid = lessons.rows[i].id;
        const existing = await db.query(
          'SELECT id FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2',
          [userId, lid]
        );
        if (existing.rows.length === 0) {
          const daysAgo = Math.floor(Math.random() * 20) + 1;
          await db.query(
            `INSERT INTO lesson_progress (user_id, lesson_id, course_id, completed, completed_at)
             VALUES ($1, $2, $3, true, NOW() - ($4 || ' days')::interval)`,
            [userId, lid, courseId, daysAgo]
          );
          progressCount++;
        }
      }
    }
    console.log(`   \u2705 ${progressCount} lesson completions recorded`);

    // ── 5. Reviews ────────────────────────────────────────────
    console.log('\n\x1b[33m\u25B6 Creating reviews...\x1b[0m');
    let reviewCount = 0;
    for (const r of REVIEWS) {
      const userId = userIds[r.user_index];
      const courseId = courseIds[r.course_index];
      const existing = await db.query(
        'SELECT id FROM reviews WHERE user_id = $1 AND course_id = $2',
        [userId, courseId]
      );
      if (existing.rows.length === 0) {
        const daysAgo = Math.floor(Math.random() * 14) + 1;
        await db.query(
          `INSERT INTO reviews (user_id, course_id, rating, comment, created_at)
           VALUES ($1, $2, $3, $4, NOW() - ($5 || ' days')::interval)`,
          [userId, courseId, r.rating, r.comment, daysAgo]
        );
        reviewCount++;
      }
    }
    console.log(`   \u2705 ${reviewCount} reviews created`);

    // ── Summary ───────────────────────────────────────────────
    console.log('\n\x1b[32m\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\x1b[0m');
    console.log('   \x1b[32m\uD83C\uDF89 Database seeded successfully!\x1b[0m');
    console.log('\x1b[32m\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\x1b[0m');
    console.log('\n\x1b[36mLogin credentials:\x1b[0m');
    for (const u of USERS) {
      console.log(`   ${u.role.padEnd(12)} ${u.email.padEnd(28)} ${u.password}`);
    }
    console.log('');

    await db.pool.end();
    process.exit(0);
  } catch (error) {
    console.error('\n\x1b[31m\u274C Seed failed:\x1b[0m', error.message);
    console.error(error.stack);
    await db.pool.end();
    process.exit(1);
  }
}

seed();
