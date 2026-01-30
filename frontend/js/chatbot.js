/**
 * CloudDani AI Chatbot
 * Portfolio-aware intelligent assistant
 */

// ============================================
// Portfolio Knowledge Base
// ============================================
const PORTFOLIO_KNOWLEDGE = {
    personal: {
        name: "Danielle Washington",
        title: "Technical Documentation Writer & Developer Experience Advocate",
        location: "Philadelphia Metro Area",
        openToRelocation: true,
        email: "shakara.washington02@gmail.com",
        tagline: "I built a career across technology, education, entrepreneurship, and luxury retail centered on translation: turning complex systems, products, and ideas into experiences people can understand and trust.",
        focus: "Senior and staff level technical writing roles with documentation strategy and developer education initiatives",
        throughline: "Specialized in narrative-driven systems design — from developer platforms to consumer brands — where storytelling is used to drive adoption, learning, and decision-making. Brings founder-level ownership, product thinking, and narrative strategy into technical documentation and developer education."
    },
    
    experience: [
        {
            company: "Weaviate",
            role: "Technical Documentation Writer",
            period: "January 2025 – October 2025",
            location: "Remote",
            highlights: [
                "Drove documentation strategy for Weaviate's open-source vector database",
                "Owned end-to-end deployment documentation strategy",
                "Authored content on Day 0 to Day 2 operations, scaling, and optimization",
                "Reduced deployment friction for EKS users with the EKS Configurator tool"
            ],
            technologies: ["Kubernetes", "EKS", "Vector DB", "Developer Experience"]
        },
        {
            company: "Hewlett Packard Enterprise (HPE)",
            role: "Cloud Platform Information Developer, Documentation Tech Lead",
            period: "March 2022 – January 2025",
            location: "Remote",
            highlights: [
                "Led documentation strategy for HPE GreenLake Cloud Platform",
                "Architected developer portals using Redocly, Backstage, and Just the Docs",
                "Eliminated documentation technical debt through automated link checking",
                "Led cross-functional alignment sessions with platform developers"
            ],
            technologies: ["AWS", "Redocly", "Backstage", "GitHub Actions", "Hybrid Cloud"]
        },
        {
            company: "Gaia (formerly GaiaNet)",
            role: "Web3 Information Developer",
            period: "Contract",
            location: "Remote",
            highlights: [
                "Delivered comprehensive technical documentation for Web3 and AI platform",
                "Produced API documentation, integration guides, and tutorials",
                "Maintained consistency through style guides and templates"
            ],
            technologies: ["Web3", "API Documentation", "Developer Onboarding"]
        },
        {
            company: "Sarithm Inc. (HPE Contract)",
            role: "API Technical Writer",
            period: "August 2021 – February 2022",
            location: "Remote",
            highlights: [
                "Partnered with Scrum teams to document GreenLake Cloud Platform",
                "Created API reference content, user guides, and release notes"
            ],
            technologies: ["API Documentation", "Agile", "Cloud Platform"]
        }
    ],
    
    earlierExperience: [
        {
            company: "Home Fragrance & Storytelling Brand",
            role: "Founder & Operator",
            period: "2017 – 2021",
            highlights: [
                "Founded and operated a DTC brand built around narrative design, where each product line was anchored to destination-based stories and long-form content",
                "Designed and executed full brand strategy: product concept, narrative architecture, packaging voice, blog editorial calendar, and customer experience",
                "Wrote and published destination essays connecting sensory design to cultural and emotional storytelling",
                "Managed end-to-end operations: sourcing, manufacturing, pricing, marketing, fulfillment",
                "Developed early product-market fit through narrative-driven branding rather than paid acquisition"
            ],
            signals: ["Founder Mindset", "Product Storytelling", "Brand Systems", "Narrative Strategy"]
        },
        {
            company: "Spain (Children & Curriculum Design)",
            role: "English Teacher",
            period: "2016 – 2017",
            highlights: [
                "Designed and delivered structured lesson plans for children across multiple age groups in a multilingual environment",
                "Adapted curriculum to diverse learning styles, cultural contexts, and developmental stages",
                "Built foundational skills in pedagogy, instructional design, and learner-centric communication",
                "Developed expertise in explaining complex concepts simply and sequencing knowledge for retention"
            ],
            signals: ["Pedagogy", "Instructional Design", "Learner Empathy", "Communication Architecture"]
        },
        {
            company: "Luxury Jewelry Retail (High-End Department Store)",
            role: "Partnerships & Marketing",
            period: "2014 – 2016",
            highlights: [
                "Led brand partnerships and in-store marketing strategy for an independent luxury jewelry company",
                "Negotiated cross-brand collaborations with global beauty and luxury brands (SpaceNK, Jo Malone)",
                "Worked directly with fashion stylists to place products on models for in-store events",
                "Designed and executed partnership campaigns blending retail, events, and visual storytelling",
                "Operated at the intersection of sales, marketing, and partnerships"
            ],
            signals: ["Partnerships", "Negotiation", "Cross-Functional Influence", "Executive Communication"]
        }
    ],
    
    projects: [
        {
            name: "CloudDani Concierge",
            status: "In Progress",
            description: "AI-powered interactive résumé using RAG architecture with OpenAI GPT-4o and Pinecone vector database",
            technologies: ["OpenAI GPT-4o", "Pinecone", "RAG", "Python"],
            purpose: "Positions documentation as an intelligent, conversational layer"
        },
        {
            name: "EKS Configurator",
            status: "Live",
            description: "Web-based configurator that automates EKS cluster configuration for Weaviate deployments",
            technologies: ["Kubernetes", "EKS", "Streamlit", "Python"],
            link: "https://k8s-config-nzfndvmnwxppa6zegwocxm.streamlit.app/",
            purpose: "Bridges documentation and implementation, reducing deployment time"
        },
        {
            name: "CloudDani Portfolio",
            status: "Production",
            description: "Full-stack cloud resume built on AWS using serverless architecture",
            technologies: ["AWS S3", "CloudFront", "Lambda", "DynamoDB", "GitHub Actions"],
            purpose: "Documentation-focused portfolio showcasing cloud engineering skills"
        }
    ],
    
    skills: {
        core: [
            "Technical Documentation Strategy",
            "Developer Experience (DevEx)",
            "Documentation-as-Code",
            "API Documentation",
            "Developer Portals",
            "Technical Writing",
            "Content Strategy"
        ],
        tools: [
            "Redocly",
            "Backstage",
            "Just the Docs",
            "GitHub Actions",
            "Markdown",
            "Git",
            "CI/CD pipelines"
        ],
        technologies: [
            "AWS (S3, CloudFront, Lambda, DynamoDB, API Gateway)",
            "Kubernetes",
            "EKS",
            "Docker",
            "Python",
            "JavaScript",
            "HTML/CSS",
            "Vector Databases"
        ],
        specialties: [
            "Cloud Platform Documentation",
            "Kubernetes/Container Documentation",
            "AI/ML System Documentation",
            "Developer Onboarding",
            "Documentation Automation",
            "Cross-functional Collaboration"
        ]
    },
    
    speaking: [
        {
            title: "Technical Storytelling Webinar",
            organization: "3percentclub",
            type: "Guest Speaker",
            topics: ["Technical Writing Career Paths", "Creating Compelling Narratives", "Senior/Staff Level Roles"]
        }
    ],
    
    philosophy: {
        approach: "I think in terms of developer journeys, not just individual pages. I care about what developers are trying to do, where they get stuck, and how documentation can remove friction at every step.",
        values: [
            "Documentation as a core part of developer experience",
            "Treating documentation as product, not afterthought",
            "Developer-first thinking",
            "Reducing support burden through better docs",
            "Continuous improvement and iteration"
        ]
    },
    
    stats: {
        yearsExperience: "3+",
        projectsCompleted: "50+",
        majorPlatforms: "5+"
    }
};

// ============================================
// Chatbot State
// ============================================
let chatState = {
    isOpen: false,
    messages: [],
    isTyping: false
};

// ============================================
// Initialize Chatbot
// ============================================
function initChatbot() {
    createChatbotHTML();
    setupChatbotEventListeners();
    addWelcomeMessage();
}

// ============================================
// Create Chatbot HTML
// ============================================
function createChatbotHTML() {
    const chatbotHTML = `
        <!-- Chat Button -->
        <button class="chat-button" id="chatButton" aria-label="Open chat">
            <i class="fas fa-comments"></i>
            <span class="chat-button-badge" id="chatBadge"></span>
        </button>

        <!-- Chat Window -->
        <div class="chat-window" id="chatWindow">
            <!-- Chat Header -->
            <div class="chat-header">
                <div class="chat-header-info">
                    <div class="chat-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="chat-header-text">
                        <h3>CloudDani Assistant</h3>
                        <div class="chat-status">
                            <span class="status-dot"></span>
                            <span>Online</span>
                        </div>
                    </div>
                </div>
                <button class="chat-close" id="chatClose" aria-label="Close chat">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Chat Messages -->
            <div class="chat-messages" id="chatMessages">
                <!-- Welcome message will be added here -->
            </div>

            <!-- Typing Indicator -->
            <div class="typing-indicator" id="typingIndicator">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="typing-content">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>

            <!-- Quick Replies -->
            <div class="quick-replies" id="quickReplies">
                <!-- Quick reply buttons will be added here -->
            </div>

            <!-- Chat Input -->
            <div class="chat-input-area">
                <input 
                    type="text" 
                    class="chat-input" 
                    id="chatInput" 
                    placeholder="Ask me about Danielle's experience..."
                    autocomplete="off"
                />
                <button class="chat-send-btn" id="chatSendBtn" aria-label="Send message">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
}

// ============================================
// Setup Event Listeners
// ============================================
function setupChatbotEventListeners() {
    const chatButton = document.getElementById('chatButton');
    const chatClose = document.getElementById('chatClose');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatInput = document.getElementById('chatInput');
    
    chatButton.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    chatSendBtn.addEventListener('click', sendMessage);
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// ============================================
// Toggle Chat Window
// ============================================
function toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const chatButton = document.getElementById('chatButton');
    
    chatState.isOpen = !chatState.isOpen;
    
    if (chatState.isOpen) {
        chatWindow.classList.add('active');
        chatButton.classList.add('active');
        document.getElementById('chatInput').focus();
        scrollToBottom();
    } else {
        chatWindow.classList.remove('active');
        chatButton.classList.remove('active');
    }
}

// ============================================
// Add Welcome Message
// ============================================
function addWelcomeMessage() {
    const welcomeMsg = {
        type: 'bot',
        content: `Hi! I'm CloudDani's AI assistant. I can answer questions about Danielle's experience, projects, skills, and career journey. What would you like to know?`,
        time: getCurrentTime()
    };
    
    addMessage(welcomeMsg);
    
    // Add quick replies
    showQuickReplies([
        "Tell me about her experience",
        "What projects has she worked on?",
        "What are her key skills?",
        "How can I contact her?"
    ]);
}

// ============================================
// Send Message
// ============================================
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage({
        type: 'user',
        content: message,
        time: getCurrentTime()
    });
    
    input.value = '';
    hideQuickReplies();
    
    // Show typing indicator
    showTyping();
    
    // Generate response
    setTimeout(() => {
        const response = generateResponse(message);
        hideTyping();
        addMessage({
            type: 'bot',
            content: response.message,
            time: getCurrentTime()
        });
        
        if (response.quickReplies) {
            showQuickReplies(response.quickReplies);
        }
    }, 1000 + Math.random() * 1000); // Random delay for realism
}

// ============================================
// Generate AI Response
// ============================================
function generateResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Experience questions
    if (msg.includes('experience') || msg.includes('work') || msg.includes('job') || msg.includes('career')) {
        return {
            message: `Danielle has ${PORTFOLIO_KNOWLEDGE.stats.yearsExperience} years of experience in technical documentation and developer experience. Her recent roles include:

• **Weaviate** - Technical Documentation Writer (2025)
  Leading docs strategy for their vector database

• **HPE** - Documentation Tech Lead (2022-2025)  
  Led strategy for GreenLake Cloud Platform

• **Gaia** - Web3 Information Developer (Contract)
  Documentation for Web3 and AI platforms

Would you like to know more about a specific role?`,
            quickReplies: ["Tell me about Weaviate", "Tell me about HPE", "What about her projects?"]
        };
    }
    
    // Weaviate-specific
    if (msg.includes('weaviate')) {
        const weaviate = PORTFOLIO_KNOWLEDGE.experience[0];
        return {
            message: `At **Weaviate**, Danielle worked as a Technical Documentation Writer from ${weaviate.period}. Key achievements:

${weaviate.highlights.map(h => `• ${h}`).join('\n')}

Technologies: ${weaviate.technologies.join(', ')}`,
            quickReplies: ["What projects has she built?", "Tell me about HPE", "What are her skills?"]
        };
    }
    
    // HPE-specific
    if (msg.includes('hpe') || msg.includes('hewlett') || msg.includes('greenlake')) {
        const hpe = PORTFOLIO_KNOWLEDGE.experience[1];
        return {
            message: `At **HPE**, Danielle was a Cloud Platform Information Developer and Documentation Tech Lead from ${hpe.period}. Highlights:

${hpe.highlights.map(h => `• ${h}`).join('\n')}

She worked with: ${hpe.technologies.join(', ')}`,
            quickReplies: ["What about Weaviate?", "Tell me about her projects", "What are her skills?"]
        };
    }
    
    // Projects
    if (msg.includes('project') || msg.includes('built') || msg.includes('portfolio') || msg.includes('work sample')) {
        return {
            message: `Danielle has worked on several impressive projects:

**1. CloudDani Concierge** (In Progress)
AI-powered interactive résumé using GPT-4o and Pinecone
Tech: ${PORTFOLIO_KNOWLEDGE.projects[0].technologies.join(', ')}

**2. EKS Configurator** (Live)
Web tool for automating Kubernetes deployments
Tech: ${PORTFOLIO_KNOWLEDGE.projects[1].technologies.join(', ')}
[View Demo](${PORTFOLIO_KNOWLEDGE.projects[1].link})

**3. CloudDani Portfolio** (Production)
Serverless portfolio on AWS
Tech: ${PORTFOLIO_KNOWLEDGE.projects[2].technologies.join(', ')}

Which project interests you most?`,
            quickReplies: ["Tell me about the EKS Configurator", "What about the AI project?", "Her experience?"]
        };
    }
    
    // Skills
    if (msg.includes('skill') || msg.includes('technolog') || msg.includes('tool') || msg.includes('know')) {
        return {
            message: `Danielle's expertise spans several areas:

**Core Skills:**
${PORTFOLIO_KNOWLEDGE.skills.core.slice(0, 5).map(s => `• ${s}`).join('\n')}

**Technologies:**
${PORTFOLIO_KNOWLEDGE.skills.technologies.slice(0, 6).map(s => `• ${s}`).join('\n')}

**Specialties:**
${PORTFOLIO_KNOWLEDGE.skills.specialties.slice(0, 4).map(s => `• ${s}`).join('\n')}

She's particularly strong in documentation strategy and developer experience!`,
            quickReplies: ["What's her approach?", "Tell me about her projects", "How can I contact her?"]
        };
    }
    
    // Philosophy/Approach
    if (msg.includes('approach') || msg.includes('philosophy') || msg.includes('think') || msg.includes('style')) {
        return {
            message: `Danielle's approach to documentation is unique:

"${PORTFOLIO_KNOWLEDGE.philosophy.approach}"

**Key Values:**
${PORTFOLIO_KNOWLEDGE.philosophy.values.slice(0, 4).map(v => `• ${v}`).join('\n')}

She focuses on the entire developer journey, not just writing pages!`,
            quickReplies: ["What are her skills?", "Tell me about her projects", "How can I reach her?"]
        };
    }
    
    // Contact
    if (msg.includes('contact') || msg.includes('reach') || msg.includes('email') || msg.includes('connect') || msg.includes('hire')) {
        return {
            message: `You can reach Danielle:

📧 **Email:** ${PORTFOLIO_KNOWLEDGE.personal.email}
📍 **Location:** ${PORTFOLIO_KNOWLEDGE.personal.location}
✈️ Open to relocation

**Connect:**
• [LinkedIn](https://www.linkedin.com/in/danielle-washington-8b4644206)
• [GitHub](https://github.com/DanielleWashington/cloudresumechallenge)
• [Blog](https://blog.clouddani.com)

She's focused on ${PORTFOLIO_KNOWLEDGE.personal.focus}`,
            quickReplies: ["What's her experience?", "Tell me about her projects"]
        };
    }
    
    // Speaking
    if (msg.includes('speak') || msg.includes('presentation') || msg.includes('talk') || msg.includes('webinar')) {
        const speaking = PORTFOLIO_KNOWLEDGE.speaking[0];
        return {
            message: `Danielle has spoken at:

**${speaking.title}**
Organization: ${speaking.organization}
Topics: ${speaking.topics.join(', ')}

She shares insights on technical writing careers and creating compelling technical narratives!`,
            quickReplies: ["What are her skills?", "Tell me about her projects", "How can I contact her?"]
        };
    }
    
    // Stats
    if (msg.includes('statistic') || msg.includes('number') || msg.includes('how many') || msg.includes('how much')) {
        return {
            message: `Here are some quick stats:

📊 **${PORTFOLIO_KNOWLEDGE.stats.yearsExperience}** years of experience
📝 **${PORTFOLIO_KNOWLEDGE.stats.projectsCompleted}** documentation projects
🚀 **${PORTFOLIO_KNOWLEDGE.stats.majorPlatforms}** major platforms documented

She's worked with companies like Weaviate, HPE, and emerging Web3 startups!`,
            quickReplies: ["Tell me about her experience", "What projects has she built?"]
        };
    }
    
    // Default/Fallback
    return {
        message: `I can help you learn about Danielle's:
• Professional experience and career journey
• Technical projects and portfolio work
• Skills, technologies, and expertise
• Documentation philosophy and approach
• Contact information

What would you like to know more about?`,
        quickReplies: ["Her experience", "Her projects", "Her skills", "Contact info"]
    };
}

// ============================================
// Add Message to Chat
// ============================================
function addMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    
    const messageHTML = `
        <div class="message ${message.type}">
            <div class="message-avatar">
                <i class="fas fa-${message.type === 'bot' ? 'robot' : 'user'}"></i>
            </div>
            <div class="message-bubble">
                <div class="message-content">${formatMessage(message.content)}</div>
                <span class="message-time">${message.time}</span>
            </div>
        </div>
    `;
    
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    chatState.messages.push(message);
    scrollToBottom();
}

// ============================================
// Format Message (Markdown-like)
// ============================================
function formatMessage(text) {
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Links
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
    // Line breaks
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// ============================================
// Quick Replies
// ============================================
function showQuickReplies(replies) {
    const quickRepliesContainer = document.getElementById('quickReplies');
    quickRepliesContainer.innerHTML = '';
    
    replies.forEach(reply => {
        const button = document.createElement('button');
        button.className = 'quick-reply-btn';
        button.textContent = reply;
        button.addEventListener('click', () => {
            document.getElementById('chatInput').value = reply;
            sendMessage();
        });
        quickRepliesContainer.appendChild(button);
    });
    
    quickRepliesContainer.classList.add('active');
}

function hideQuickReplies() {
    document.getElementById('quickReplies').classList.remove('active');
}

// ============================================
// Typing Indicator
// ============================================
function showTyping() {
    chatState.isTyping = true;
    document.getElementById('typingIndicator').classList.add('active');
    scrollToBottom();
}

function hideTyping() {
    chatState.isTyping = false;
    document.getElementById('typingIndicator').classList.remove('active');
}

// ============================================
// Utility Functions
// ============================================
function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ============================================
// Initialize on DOM Load
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}

// ============================================
// Console Debug
// ============================================
console.log('%c💬 CloudDani Chatbot Loaded', 'font-size: 14px; font-weight: bold; color: #E50914;');
console.log('%cKnowledge Base:', 'font-size: 12px; color: #b3b3b3;');
console.log(PORTFOLIO_KNOWLEDGE);
