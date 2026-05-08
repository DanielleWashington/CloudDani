/**
 * CloudDani Concierge
 * AI-powered portfolio assistant — Claude Sonnet 4.6 via AWS Lambda + API Gateway
 */

// ============================================
// Concierge API Configuration
// Update CONCIERGE_API after creating the API Gateway endpoint
// ============================================
const CONCIERGE_API = 'https://q75k731zki.execute-api.us-east-1.amazonaws.com/chat';

// ============================================
// Conversation History (multi-turn context)
// Sent to the Lambda on each request so Claude remembers prior turns
// ============================================
let conversationHistory = [];

// ============================================
// Chatbot State
// ============================================
let chatState = {
    isOpen: false,
    messages: [],
    isTyping: false,
    isSending: false
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
                        <h3>CloudDani Concierge</h3>
                        <div class="chat-status">
                            <span class="status-dot"></span>
                            <span>Powered by Claude</span>
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
                    placeholder="Ask me about Danielle..."
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
    const chatClose  = document.getElementById('chatClose');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatInput  = document.getElementById('chatInput');

    chatButton.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', toggleChat);
    chatSendBtn.addEventListener('click', sendMessage);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
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
    addMessage({
        type: 'bot',
        content: `Hi! I'm the CloudDani Concierge — ask me anything about Danielle's career, projects, documentation philosophy, or how to get in touch.`,
        time: getCurrentTime()
    });

    showQuickReplies([
        "What did she do at Weaviate?",
        "Tell me about her projects",
        "What's her documentation philosophy?",
        "Is she available to hire?"
    ]);
}

// ============================================
// Send Message
// ============================================
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message || chatState.isSending) return;

    // Add user message to UI
    addMessage({ type: 'user', content: message, time: getCurrentTime() });
    input.value = '';
    hideQuickReplies();
    setLoading(true);

    try {
        const reply = await fetchConciergeResponse(message);
        addMessage({ type: 'bot', content: reply, time: getCurrentTime() });
    } catch (err) {
        console.error('Concierge error:', err.name, err.message, err);
        const detail = `${err.name}: ${err.message}`;
        addMessage({
            type: 'bot',
            content: `Sorry, I'm having trouble connecting right now. (${detail}) — You can reach Danielle directly at <a href="mailto:shakara.washington02@gmail.com">shakara.washington02@gmail.com</a>.`,
            time: getCurrentTime()
        });
    } finally {
        setLoading(false);
    }
}

// ============================================
// Fetch Response from Concierge API
// ============================================
async function fetchConciergeResponse(userMessage) {
    const MAX_HISTORY = 12; // keep last 12 messages (6 turns)

    const res = await fetch(CONCIERGE_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: userMessage,
            history: conversationHistory.slice(-MAX_HISTORY)
        })
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }

    const { reply } = await res.json();

    // Update conversation history for next turn
    conversationHistory.push(
        { role: 'user',      content: userMessage },
        { role: 'assistant', content: reply }
    );

    return reply;
}

// ============================================
// Loading State
// ============================================
function setLoading(loading) {
    chatState.isSending = loading;
    const sendBtn = document.getElementById('chatSendBtn');
    const input   = document.getElementById('chatInput');

    if (loading) {
        showTyping();
        sendBtn.disabled = true;
        input.disabled   = true;
    } else {
        hideTyping();
        sendBtn.disabled = false;
        input.disabled   = false;
        input.focus();
    }
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
// Format Message (light markdown)
// ============================================
function formatMessage(text) {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    text = text.replace(/\n/g, '<br>');
    return text;
}

// ============================================
// Quick Replies
// ============================================
function showQuickReplies(replies) {
    const container = document.getElementById('quickReplies');
    container.innerHTML = '';

    replies.forEach(reply => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply-btn';
        btn.textContent = reply;
        btn.addEventListener('click', () => {
            document.getElementById('chatInput').value = reply;
            sendMessage();
        });
        container.appendChild(btn);
    });

    container.classList.add('active');
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
    const container = document.getElementById('chatMessages');
    setTimeout(() => { container.scrollTop = container.scrollHeight; }, 100);
}

function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

// ============================================
// Initialize on DOM Load
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}

console.log('%c💬 CloudDani Concierge loaded — powered by Claude Sonnet 4.6', 'font-size: 13px; font-weight: bold; color: #E8135A;');
