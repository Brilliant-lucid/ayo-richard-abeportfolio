
UPDATE public.hero SET
  eyebrow = 'Hello, I''m',
  heading = 'Ayo Richard Abe.',
  intro = 'Product Manager · Product Developer · Growth Marketer

I build and grow digital products that solve real-world problems. I combine product thinking, development skills, and growth strategies to create value, drive adoption, and scale impact.',
  cta_primary_label = 'View My Work',
  cta_primary_href = '/projects',
  cta_secondary_label = 'Let''s Connect',
  cta_secondary_href = '/contact';

UPDATE public.projects SET
  name = 'MeetMind AI Interviewer',
  role = 'Product Manager',
  category = 'Product Management',
  summary = 'AI-powered recruitment platform that automates first-round interviews through voice-based conversations, enabling recruiters to scale hiring with consistent evaluation.',
  description = 'MeetMind AI Interviewer is an AI-powered recruitment platform that automates first-round interviews through voice-based conversations. The platform enables recruiters to create structured interview sessions, define evaluation criteria, and receive standardized candidate assessments without conducting manual screening interviews.

The product was designed to help hiring teams scale recruitment processes while improving consistency, reducing operational costs, and accelerating hiring decisions.',
  problem = 'Recruiters spend a significant amount of time conducting repetitive first-round interviews, especially when hiring at scale. This creates several challenges:

• Excessive time spent on candidate screening
• Inconsistent evaluation standards across interviewers
• Scheduling bottlenecks between recruiters and candidates
• Delayed hiring decisions
• Increased recruitment costs
• Difficulty comparing candidates objectively

Organizations needed a scalable way to conduct structured interviews while maintaining fairness and consistency throughout the hiring process.',
  solution = 'MeetMind addresses these challenges through an AI-powered voice interviewer capable of conducting structured interviews on behalf of recruiters.

The platform allows recruiters to:
• Create customized interview workflows
• Define competency-based evaluation criteria
• Automate first-round candidate interviews
• Generate standardized interview reports
• Compare candidates using consistent scoring frameworks
• Reduce recruiter workload while improving screening efficiency

This enables organizations to interview more candidates in less time while maintaining a high-quality hiring process.',
  process = 'Product Discovery & Validation
• Identified recruitment workflow inefficiencies through market research
• Defined target customer segments and recruiter personas
• Conducted competitor analysis and market positioning research
• Validated recruiter pain points and hiring challenges

Product Strategy
• Co-developed the product vision and long-term roadmap
• Defined core value propositions for recruiters and hiring teams
• Prioritized features based on customer needs and business goals
• Established success metrics and product objectives

Requirements & Planning
• Created Product Requirements Documents (PRDs)
• Defined user stories and acceptance criteria
• Structured feature specifications and functional requirements
• Planned product milestones and release phases

Stakeholder Management
• Collaborated with engineering and business stakeholders
• Facilitated product discussions and feature prioritization
• Aligned product decisions with business objectives

Go-To-Market Strategy
• Developed pilot launch and validation strategy
• Designed early adopter acquisition framework
• Planned onboarding and feedback collection processes
• Defined initial monetization and pricing hypotheses

Key Features
• AI Voice Interviewer
• Automated Candidate Assessment
• Structured Interview Builder
• Recruiter Dashboard
• Interview Analytics & Reporting
• Candidate Scoring Framework
• Automated Interview Summaries
• Competency-Based Evaluation System',
  results = 'MeetMind demonstrates the ability to take a product from problem identification through validation, product strategy, roadmap planning, and go-to-market preparation. The project showcases end-to-end Product Management capabilities in building an AI-driven SaaS solution for modern recruitment teams.

Skills Demonstrated:
• Product Strategy, Discovery, Roadmapping, PRDs, Feature Prioritization, Stakeholder Management
• Market Research, Competitive Analysis, Customer Discovery, Go-To-Market Strategy, Positioning, Business Model Development
• Cross-Functional Collaboration, Strategic Planning, Decision Making, Process Design, Project Coordination
• Conversational AI Products, Recruitment Technology, Workflow Automation, AI-Powered User Experiences',
  tools = ARRAY['Product Strategy','PRDs','Roadmapping','Conversational AI','Recruitment Tech','GTM'],
  status = 'published',
  featured = true
WHERE slug = 'meetmind';

INSERT INTO public.blog_posts (title, slug, excerpt, category, content, status, published_at)
VALUES (
  'My HNG Internship Experience Review',
  'my-hng-internship-experience-review',
  'Reflections on returning to HNG, leading product on MeetMind, the challenges, lessons, and what I''d do differently.',
  'Reflection',
$$## Introduction

Joining HNG this year was a different experience for me because this was not my first time participating. I was also part of Cohort 13, so I came into this internship with a different mindset. Before the internship started, I felt I already had enough experience to take on multiple tracks at the same time. In fact, I initially planned to participate in several tracks because I believed I could handle the workload.

However, reality quickly set in. Between work responsibilities and other life commitments, I realized that trying to do everything at once was not the smartest approach. Just like in Cohort 13, I eventually had to focus on the main reason I joined. In Cohort 13, that was Marketing. This time, it was Product Management. Once I made that decision, I became more intentional about learning and contributing within the Product Management track.

## The Project I Worked On

During the internship, I worked on MeetMind, an Artificial Intelligence (AI) interviewer designed for recruiters. The idea behind the product was to help recruiters conduct structured interviews using AI, reducing the amount of manual effort required during the hiring process.

Out of all the products I saw during the internship, I honestly believe MeetMind was one of the most innovative. Many products were solving useful problems, but some felt like variations of tools that already existed. MeetMind stood out because it attempted to solve a real recruitment challenge in a unique way.

At the same time, I learned that the more innovative a product is, the harder it can be to build. Innovation sounds exciting until you have to deal with the realities of product development, technical limitations, team coordination, changing requirements, and deadlines. Our team faced many challenges throughout the internship, and there were times when it felt like we were always fighting an uphill battle. Despite that, we kept pushing. There was even a period when we reached the top rankings, which was a proud moment for the team.

## My Biggest Challenges

One of my biggest challenges was trying to do too much at once. I like learning, exploring, and contributing in different areas, so naturally I wanted to be involved in many things. Unfortunately, time is limited, and trying to spread myself across too many responsibilities affected my focus.

Another challenge was balancing internship activities with my personal and professional commitments outside HNG. There were moments when the workload became intense, and I had to make difficult decisions about where to invest my energy.

I also realized that Product Management is much more demanding than many people think. It is not just about writing documents or creating tickets. It involves communication, stakeholder management, problem-solving, prioritization, and constantly adapting to new information.

## Lessons I Learned

One of the biggest lessons I learned is the importance of focus. Being interested in many things is good, but knowing what deserves your attention at a particular moment is even more important.

I also learned the value of asking questions and seeking help early. Whenever our team faced challenges, the fastest progress usually happened when we involved mentors and experienced team members instead of trying to figure everything out alone.

Another lesson was the importance of continuous learning. Although I joined with some previous knowledge, I intentionally pushed myself to learn things outside my comfort zone. I interacted with technical concepts, learned more about product processes, and gained a better understanding of how different teams collaborate to build a product.

## Projects I Am Most Proud Of

The project I am most proud of is MeetMind. Despite the challenges, I am proud of the work our team accomplished. Building an AI-powered recruitment solution required collaboration between Product Managers, Backend Developers, Frontend Developers, Designers, and Quality Assurance team members.

I am also proud of how I continued showing up even when things became difficult. Sometimes success is not just about winning; it is about staying committed when circumstances become challenging.

## Mistakes I Made and How I Grew

One mistake I made was assuming I could successfully juggle too many responsibilities at the same time. While ambition is valuable, I learned that execution requires focus.

As the internship progressed, I became better at prioritization. Instead of trying to do everything, I focused on the activities that aligned most closely with my goals. This helped me become more effective and less overwhelmed.

I also learned that knowing something already does not mean there is nothing left to learn. There is always a deeper level of understanding available if you remain open-minded.

## Feedback on the Internship Experience

My experience this year was different from Cohort 13. At the beginning, I felt that some of the energy and excitement I remembered from the previous cohort was missing. The experience felt slower and less engaging initially.

However, as the internship progressed, things became more interesting. The challenges increased, the competition became more intense, and the overall experience improved. Although I personally preferred some aspects of Cohort 13, I still gained valuable experience from this cohort.

One thing HNG does exceptionally well is pushing people beyond what they think they can handle. The environment challenges participants to grow quickly, adapt rapidly, and continuously improve.

## Feedback for Mentors

The mentors played a significant role in the internship experience. Their guidance helped teams navigate challenges and avoid unnecessary mistakes.

One thing I appreciated was the willingness of mentors to share their knowledge and experience. Many of the lessons I learned came from mentor interactions rather than formal tasks alone.

## Advice for Future Interns

My advice to future interns is simple: come prepared.

You do not need to be an expert before joining, but having a solid foundation will help you significantly. HNG moves fast, and the learning curve can be steep.

Be ready to learn, ask questions, collaborate, and accept feedback. Most importantly, do not underestimate the pressure. HNG will challenge you. It will stretch your abilities and test your consistency.

If you embrace the process instead of resisting it, you will learn far more than you expect.

## What I Would Do Differently

If I were starting again, I would approach multiple tracks differently. Instead of beginning several tracks without a clear strategy, I would create a better plan for managing my time and responsibilities.

I would also spend more effort building relationships and networking with other participants. While I interacted with people throughout the internship, I believe I could have been more intentional about connecting with others.

Finally, I would focus on maintaining consistency from the beginning rather than adjusting midway through the internship.

## Conclusion

Overall, my HNG experience was challenging, educational, and rewarding. It pushed me to think differently, work under pressure, and improve my Product Management skills.

The journey was not always easy, but the lessons, experiences, and growth made it worthwhile. Looking back, I am grateful for the opportunity to contribute to MeetMind, learn from mentors and teammates, and continue developing as a Product Manager.

As for returning again as an intern, probably not. My next goal is to return in a different capacity, hopefully as a mentor, helping others navigate the same journey that helped shape mine.$$,
  'published',
  now()
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  category = EXCLUDED.category,
  content = EXCLUDED.content,
  status = 'published',
  published_at = COALESCE(public.blog_posts.published_at, now());
