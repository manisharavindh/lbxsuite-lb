const blogPosts = [
  {
    id: 'autonomous-ai-agents-reshaping-enterprise',
    title: 'Autonomous AI Agents Are Reshaping Enterprise Software — Here\'s What You Need to Know',
    excerpt: 'From automated customer support to self-healing infrastructure, autonomous agents are no longer science fiction. We break down the architectures, risks, and real-world ROI driving adoption in 2026.',
    coverImage: '/blog/ai-agents.png',
    category: 'Artificial Intelligence',
    author: 'Manish Aravindh',
    authorRole: 'Co-Founder & CTO',
    date: 'March 20, 2026',
    readTime: '8 min read',
    featured: true,
    tags: ['AI', 'Agents', 'Enterprise', 'Automation'],
    content: [
      {
        type: 'paragraph',
        text: 'The conversation around AI has shifted dramatically. Where 2024 was the year of large language models and chatbots, 2026 is the year of autonomous agents — software systems that don\'t just respond to prompts but independently plan, execute, and iterate on complex tasks.',
      },
      {
        type: 'heading',
        text: 'What Makes an Agent "Autonomous"?',
      },
      {
        type: 'paragraph',
        text: 'An autonomous agent goes beyond a simple LLM wrapper. It combines reasoning capabilities with tool use, memory, and goal-oriented planning. Think of it as the difference between a calculator and an accountant — one processes inputs, the other understands context, makes decisions, and takes action across multiple systems.',
      },
      {
        type: 'quote',
        text: 'The most transformative technology is invisible. Autonomous agents succeed when users forget they exist — when workflows simply work, faster and smarter than before.',
      },
      {
        type: 'heading',
        text: 'The Architecture Behind Modern AI Agents',
      },
      {
        type: 'paragraph',
        text: 'At LbxSuite, we\'ve deployed agent architectures for enterprise clients across healthcare, fintech, and e-commerce. The core pattern involves three layers:',
      },
      {
        type: 'list',
        items: [
          'Perception Layer — Ingests structured and unstructured data from APIs, documents, databases, and real-time streams.',
          'Reasoning Layer — An LLM-powered decision engine with chain-of-thought prompting, tool selection, and self-evaluation loops.',
          'Action Layer — Executes tasks through APIs, manages state, handles errors gracefully, and escalates to humans when confidence drops below threshold.',
        ],
      },
      {
        type: 'heading',
        text: 'Real-World ROI: Case Study',
      },
      {
        type: 'paragraph',
        text: 'One of our fintech clients deployed an autonomous compliance agent that monitors transaction patterns, flags anomalies, generates regulatory reports, and auto-files them with oversight bodies. The result: 73% reduction in compliance team workload and a 12x improvement in detection speed versus manual review.',
      },
      {
        type: 'paragraph',
        text: 'This isn\'t about replacing humans — it\'s about removing the cognitive burden of repetitive, high-volume decision-making so your team can focus on strategy and innovation.',
      },
      {
        type: 'heading',
        text: 'Risks and Guardrails',
      },
      {
        type: 'paragraph',
        text: 'Autonomous agents introduce new categories of risk: hallucinated actions, cascading errors in multi-step workflows, and the challenge of auditability. Our approach bakes in human-in-the-loop checkpoints, comprehensive logging, confidence scoring, and graceful degradation patterns.',
      },
      {
        type: 'paragraph',
        text: 'The key insight: autonomy is a spectrum, not a binary. The best agent systems let you dial the level of autonomy up or down based on task criticality and your organization\'s risk tolerance.',
      },
      {
        type: 'heading',
        text: 'What Comes Next',
      },
      {
        type: 'paragraph',
        text: 'We\'re seeing early signs of multi-agent orchestration — systems where specialized agents collaborate, negotiate, and divide labor on complex projects. Imagine a product development pipeline where a research agent, a design agent, and an engineering agent work in concert, each contributing their domain expertise.',
      },
      {
        type: 'paragraph',
        text: 'The companies investing in agent infrastructure today will have a compounding advantage over the next decade. The question isn\'t whether to adopt — it\'s how fast you can iterate.',
      },
    ],
  },
  {
    id: 'building-high-performance-web-apps-2026',
    title: 'Building High-Performance Web Apps in 2026: Our Technical Stack and Why It Matters',
    excerpt: 'React 19, edge computing, and AI-assisted development have fundamentally changed how we build for the web. Here\'s the stack we use at LbxSuite and the philosophy behind every choice.',
    coverImage: '/blog/web-dev.png',
    category: 'Software Engineering',
    author: 'Manish Aravindh',
    authorRole: 'Co-Founder & CTO',
    date: 'March 15, 2026',
    readTime: '6 min read',
    featured: false,
    tags: ['Web Development', 'React', 'Performance', 'Engineering'],
    content: [
      {
        type: 'paragraph',
        text: 'The web platform has matured enormously. Browsers ship features that used to require heavy frameworks, edge runtimes bring compute closer to users, and AI tooling has made developers 3-5x more productive. But with more options comes more complexity — and the need for strong technical opinions.',
      },
      {
        type: 'heading',
        text: 'Our Frontend Philosophy',
      },
      {
        type: 'paragraph',
        text: 'We build with React 19 and Vite because the ecosystem is unmatched in maturity, talent availability, and composability. Server components, streaming SSR, and the new compiler give us performance characteristics that rival hand-optimized vanilla JS — without the maintenance burden.',
      },
      {
        type: 'paragraph',
        text: 'For animation, we layer Framer Motion for declarative React animations and GSAP for complex, timeline-based sequences. The combination gives us the cinematic motion design our clients love without sacrificing bundle size discipline.',
      },
      {
        type: 'heading',
        text: 'The Edge-First Architecture',
      },
      {
        type: 'paragraph',
        text: 'Every application we ship is deployed to the edge by default. Static assets served from 300+ PoPs worldwide, API routes running in edge workers with sub-50ms cold starts, and database connections pooled at the edge. The user experience difference is dramatic — especially for global brands.',
      },
      {
        type: 'quote',
        text: 'Performance is a feature. A 100ms improvement in load time increases conversion by 1%. When you compound that across millions of users, the ROI is staggering.',
      },
      {
        type: 'heading',
        text: 'AI-Assisted Development',
      },
      {
        type: 'paragraph',
        text: 'AI coding assistants are now integral to our workflow, but not in the way most people assume. We don\'t use them to generate boilerplate — we use them for architectural validation, test generation, performance auditing, and code review. The human engineer remains the architect; AI handles the cognitive load of implementation details.',
      },
      {
        type: 'heading',
        text: 'Why This Matters for Clients',
      },
      {
        type: 'paragraph',
        text: 'Technical excellence compounds. A well-architected application is faster to iterate on, cheaper to maintain, more reliable under load, and easier to hand off to your internal team. We\'ve seen clients save 40-60% on year-two development costs simply because the foundation was right from day one.',
      },
    ],
  },
  {
    id: 'web3-creative-agency-future',
    title: 'Why Every Creative Agency Needs a Web3 Strategy in 2026',
    excerpt: 'Tokenized loyalty programs, on-chain content verification, and decentralized identity are no longer experimental. We explore how Web3 primitives are becoming essential tools for modern creative agencies.',
    coverImage: '/blog/web3.png',
    category: 'Web3 & Blockchain',
    author: 'Manish Aravindh',
    authorRole: 'Co-Founder & CTO',
    date: 'March 10, 2026',
    readTime: '7 min read',
    featured: false,
    tags: ['Web3', 'Blockchain', 'Creative', 'Strategy'],
    content: [
      {
        type: 'paragraph',
        text: 'Web3 has quietly matured past the hype cycle. While the NFT frenzy of 2021-2022 burned many, the underlying primitives — programmable ownership, decentralized identity, and on-chain verification — are now powering serious business applications.',
      },
      {
        type: 'heading',
        text: 'Beyond Speculation: Practical Web3',
      },
      {
        type: 'paragraph',
        text: 'At LbxSuite, we\'ve helped brands deploy tokenized loyalty programs where customers earn verifiable, transferable rewards. Unlike traditional points systems, these tokens exist in the customer\'s own wallet — no vendor lock-in, no deprecated accounts, and genuine ownership that builds brand loyalty.',
      },
      {
        type: 'quote',
        text: 'Web3 isn\'t about replacing the internet. It\'s about adding a layer of programmable trust and ownership that the current web fundamentally lacks.',
      },
      {
        type: 'heading',
        text: 'Content Authenticity in the AI Era',
      },
      {
        type: 'paragraph',
        text: 'As AI-generated content becomes indistinguishable from human-created work, provenance matters more than ever. On-chain content attestation lets creators prove authorship, timestamp their work, and establish verifiable chains of custody — all without relying on a centralized platform.',
      },
      {
        type: 'heading',
        text: 'Decentralized Identity for Brand Interactions',
      },
      {
        type: 'paragraph',
        text: 'Decentralized identity (DID) protocols are enabling privacy-preserving customer interactions where users share only what\'s necessary — verifying they\'re over 18 without revealing their birthdate, proving they\'re a customer without exposing purchase history. This is the future of ethical data collection.',
      },
      {
        type: 'heading',
        text: 'Our Web3 Development Approach',
      },
      {
        type: 'paragraph',
        text: 'We advocate for a pragmatic, hybrid approach. Not everything needs to be on-chain. We use blockchain where it adds genuine value — ownership, verification, interoperability — and traditional infrastructure everywhere else. This keeps costs predictable, UX smooth, and complexity manageable.',
      },
    ],
  },
  {
    id: 'design-systems-scale-digital-products',
    title: 'How Design Systems at Scale Transform Digital Products',
    excerpt: 'A well-crafted design system is the difference between a product that feels cohesive and one that feels cobbled together. Here\'s how we approach design systems at LbxSuite.',
    coverImage: '/blog/design.png',
    category: 'Design',
    author: 'Manish Aravindh',
    authorRole: 'Co-Founder & CTO',
    date: 'March 5, 2026',
    readTime: '5 min read',
    featured: false,
    tags: ['Design', 'UI/UX', 'Design Systems', 'Product'],
    content: [
      {
        type: 'paragraph',
        text: 'Every pixel communicates intention. When your button radius is different on the checkout page than the product page, or your heading hierarchy shifts between sections, users feel it — even if they can\'t articulate why. Design systems solve this at scale.',
      },
      {
        type: 'heading',
        text: 'What a Design System Actually Is',
      },
      {
        type: 'paragraph',
        text: 'It\'s not a Figma library. It\'s not a component library. A true design system is a living, versioned artifact that encodes your brand\'s visual language into reusable, composable primitives: color tokens, typography scales, spacing rhythms, motion curves, and interaction patterns.',
      },
      {
        type: 'quote',
        text: 'A design system is a product serving products. It needs the same rigor in architecture, documentation, and maintenance as any user-facing software.',
      },
      {
        type: 'heading',
        text: 'Our Token Architecture',
      },
      {
        type: 'paragraph',
        text: 'We structure design tokens in three tiers: global tokens (raw values like colors and sizes), semantic tokens (purpose-driven aliases like "surface-card" or "text-muted"), and component tokens (scoped overrides for specific elements). This layered approach lets us support theming, dark mode, and brand variants without duplicating components.',
      },
      {
        type: 'heading',
        text: 'Motion as a Design Token',
      },
      {
        type: 'paragraph',
        text: 'Most design systems stop at color and typography. We go further by tokenizing motion — defining easing curves, durations, and spring physics as first-class design decisions. This is why interactions across our products feel cohesive and intentional, not arbitrary.',
      },
      {
        type: 'heading',
        text: 'The Business Impact',
      },
      {
        type: 'paragraph',
        text: 'Design systems pay for themselves within the first quarter. Teams ship faster because decisions are pre-made. Handoff friction drops because designers and engineers share the same vocabulary. And brand consistency improves dramatically — especially as products grow and teams scale.',
      },
    ],
  },
  {
    id: 'video-content-strategy-ai-era',
    title: 'Video Content Strategy in the AI Era: What Brands Get Wrong',
    excerpt: 'AI can generate video at scale, but quantity without strategy is noise. Here\'s how we help brands develop video content frameworks that drive real engagement and conversions.',
    coverImage: '/blog/ai-agents.png',
    category: 'Creative Media',
    author: 'Manish Aravindh',
    authorRole: 'Co-Founder & CTO',
    date: 'February 28, 2026',
    readTime: '6 min read',
    featured: false,
    tags: ['Video', 'Content Strategy', 'AI', 'Creative'],
    content: [
      {
        type: 'paragraph',
        text: 'The barrier to video production has collapsed. AI tools can now generate b-roll, animate graphics, clone voices, and edit rough cuts in minutes. But here\'s what most brands miss: the hard part was never production — it was strategy.',
      },
      {
        type: 'heading',
        text: 'The Content Quantity Trap',
      },
      {
        type: 'paragraph',
        text: 'We see brands spinning up AI-generated content pipelines that produce dozens of videos per week. Engagement metrics look impressive for a quarter, then crater. Why? Because audiences develop content fatigue when every video feels formulaic. AI makes the formula faster to execute but doesn\'t solve the underlying strategic deficit.',
      },
      {
        type: 'quote',
        text: 'Content without strategy is just noise. Strategy without content is just a deck. You need both, and AI amplifies whichever one you have.',
      },
      {
        type: 'heading',
        text: 'Our Framework: Narrative Architecture',
      },
      {
        type: 'paragraph',
        text: 'Before we touch a timeline or prompt an AI tool, we build a Narrative Architecture for every client. This is a structured content strategy that defines: core story arcs, audience segments and their emotional drivers, content formats mapped to funnel stages, and distribution-specific formatting rules.',
      },
      {
        type: 'heading',
        text: 'Where AI Actually Helps',
      },
      {
        type: 'paragraph',
        text: 'AI excels at the production middle — transcription, rough assembly, color correction, format adaptation (turning a 16:9 interview into a 9:16 Reel), and performance analysis. The creative bookends — ideation and final polish — still benefit enormously from human taste and judgment.',
      },
      {
        type: 'heading',
        text: 'Measuring What Matters',
      },
      {
        type: 'paragraph',
        text: 'We track three tiers of video metrics: reach metrics (views, impressions), engagement metrics (watch time, shares, saves), and conversion metrics (click-through, sign-ups, revenue attribution). Most brands only track the first tier and wonder why their "viral" content doesn\'t move the needle.',
      },
    ],
  },
  {
    id: 'scaling-startups-technical-decisions',
    title: 'The Technical Decisions That Make or Break Scaling Startups',
    excerpt: 'We\'ve helped dozens of startups scale from MVP to millions of users. These are the five architectural decisions that separate the ones that succeed from the ones that stall.',
    coverImage: '/blog/web-dev.png',
    category: 'Software Engineering',
    author: 'Manish Aravindh',
    authorRole: 'Co-Founder & CTO',
    date: 'February 20, 2026',
    readTime: '9 min read',
    featured: false,
    tags: ['Startups', 'Scaling', 'Architecture', 'Engineering'],
    content: [
      {
        type: 'paragraph',
        text: 'Technical debt isn\'t inherently bad. At the seed stage, moving fast and breaking things is the right call. But somewhere between Product-Market Fit and Series A, the accumulated shortcuts start compounding. We\'ve seen it dozens of times: a startup hits traction, then stalls because the architecture can\'t handle the load, the team can\'t ship features fast enough, or the codebase has become a hairball that nobody dares refactor.',
      },
      {
        type: 'heading',
        text: 'Decision 1: Monolith First, Always',
      },
      {
        type: 'paragraph',
        text: 'Microservices at the seed stage is premature optimization that kills velocity. Start with a well-structured monolith, enforce module boundaries, and extract services only when you have the team size and operational maturity to manage distributed systems. We\'ve seen this advice ignored repeatedly, and it always costs 3-6 months of unnecessary infrastructure work.',
      },
      {
        type: 'heading',
        text: 'Decision 2: Invest in Observability Early',
      },
      {
        type: 'paragraph',
        text: 'Structured logging, distributed tracing, and basic alerting should be in place before you have your first production incident — not after. The cost of adding observability increases exponentially with system complexity. Bolt it in at the start when it\'s cheap.',
      },
      {
        type: 'quote',
        text: 'You can\'t optimize what you can\'t measure. Observability isn\'t overhead — it\'s the foundation of every performance improvement you\'ll ever make.',
      },
      {
        type: 'heading',
        text: 'Decision 3: Database Choice is a 10-Year Bet',
      },
      {
        type: 'paragraph',
        text: 'Your primary database is the hardest thing to migrate. Choose based on your data access patterns, not popularity. PostgreSQL is the right answer 80% of the time. For the other 20%, make sure you truly understand why you need something different.',
      },
      {
        type: 'heading',
        text: 'Decision 4: API Design is UX for Developers',
      },
      {
        type: 'paragraph',
        text: 'Whether it\'s a public API or an internal service boundary, the ergonomics of your API surface determine how fast your team (and your ecosystem) can build. Versioning strategy, error handling conventions, and documentation quality compound over time.',
      },
      {
        type: 'heading',
        text: 'Decision 5: Hire Senior Engineers Who Ship',
      },
      {
        type: 'paragraph',
        text: 'This isn\'t strictly a technical decision, but it\'s the most impactful one. A single senior engineer who understands production systems, makes pragmatic tradeoffs, and mentors juniors is worth more than five developers who can leetcode but have never scaled a system under load.',
      },
    ],
  },
];

export const categories = [
  'All',
  'Artificial Intelligence',
  'Software Engineering',
  'Web3 & Blockchain',
  'Design',
  'Creative Media',
];

export default blogPosts;
