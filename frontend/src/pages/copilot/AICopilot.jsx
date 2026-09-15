import {
  Bot,
  Send,
  Sparkles,
  AlertTriangle,
  MapPin,
  CloudRain,
  Activity,
  ShieldCheck,
  Clock,
  User,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import './AICopilot.css';

function AICopilot() {
  return (
    <div className='copilot-page'>
      {/* ================= SIDEBAR ================= */}

      <aside className='copilot-sidebar'>
        <Sidebar />
      </aside>

      {/* ================= MAIN ================= */}

      <main className='copilot-main'>
        {/* ================= HEADER ================= */}

        <div className='copilot-header'>
          <div>
            <div className='copilot-title'>
              <div className='copilot-title-icon'>
                <Bot size={21} />
              </div>

              <div>
                <h1>AI Disaster Copilot</h1>
                <p>
                  AI-assisted insights for landslide monitoring and response
                </p>
              </div>
            </div>
          </div>

          <div className='copilot-status'>
            <span></span>
            AI Assistant Online
          </div>
        </div>

        {/* ================= COPILOT LAYOUT ================= */}

        <div className='copilot-layout'>
          {/* ================= CHAT AREA ================= */}

          <section className='copilot-chat-card'>
            {/* Chat Header */}

            <div className='chat-card-header'>
              <div className='chat-agent'>
                <div className='agent-avatar'>
                  <Bot size={20} />
                </div>

                <div>
                  <strong>LEWS AI Assistant</strong>

                  <span>Disaster Monitoring Copilot</span>
                </div>
              </div>

              <button className='refresh-btn'>
                <RefreshCw size={16} />
              </button>
            </div>

            {/* ================= CHAT BODY ================= */}

            <div className='chat-body'>
              {/* AI MESSAGE */}

              <div className='message-row ai-row'>
                <div className='message-avatar'>
                  <Bot size={15} />
                </div>

                <div className='ai-message'>
                  <div className='message-label'>AI Assistant</div>

                  <p>
                    Hello! I can help you understand current landslide
                    conditions, risk levels, sensor readings and alerts.
                  </p>

                  <p>What would you like to know?</p>
                </div>
              </div>

              {/* USER MESSAGE */}

              <div className='message-row user-row'>
                <div className='user-message'>
                  <p>Why is Zone A currently marked as critical?</p>
                </div>

                <div className='message-avatar user-message-avatar'>
                  <User size={15} />
                </div>
              </div>

              {/* AI RESPONSE */}

              <div className='message-row ai-row'>
                <div className='message-avatar'>
                  <Bot size={15} />
                </div>

                <div className='ai-message detailed-response'>
                  <div className='message-label'>AI Assistant</div>

                  <p>
                    Zone A is currently classified as
                    <strong> Critical </strong>
                    based on the available monitoring indicators.
                  </p>

                  <div className='ai-insight-list'>
                    <div>
                      <AlertTriangle size={14} />
                      <span>
                        Elevated landslide risk score: <strong>84/100</strong>
                      </span>
                    </div>

                    <div>
                      <CloudRain size={14} />
                      <span>Increased rainfall conditions detected</span>
                    </div>

                    <div>
                      <Activity size={14} />
                      <span>Ground movement indicators require attention</span>
                    </div>
                  </div>

                  <div className='ai-response-note'>
                    <ShieldCheck size={14} />

                    <span>
                      Field teams should follow official safety procedures and
                      current authority guidance.
                    </span>
                  </div>
                </div>
              </div>

              {/* QUICK QUESTION */}

              <div className='quick-question-area'>
                <span>Suggested questions</span>

                <div className='quick-question-list'>
                  <button>
                    What is the current highest-risk zone?
                    <ChevronRight size={14} />
                  </button>

                  <button>
                    Explain today's rainfall risk.
                    <ChevronRight size={14} />
                  </button>

                  <button>
                    Summarize active critical alerts.
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* ================= INPUT ================= */}

            <div className='chat-input-area'>
              <div className='chat-input'>
                <input
                  type='text'
                  placeholder='Ask about risk, alerts, sensors or field conditions...'
                />

                <button>
                  <Send size={17} />
                </button>
              </div>

              <p>
                AI-generated information should be reviewed by authorized
                personnel before operational decisions.
              </p>
            </div>
          </section>

          {/* ================= RIGHT PANEL ================= */}

          <aside className='copilot-right-panel'>
            {/* ================= CURRENT CONTEXT ================= */}

            <section className='context-card'>
              <div className='context-header'>
                <div>
                  <span>LIVE CONTEXT</span>
                  <h2>Current Situation</h2>
                </div>

                <div className='live-dot'></div>
              </div>

              <div className='context-item'>
                <div className='context-icon risk-icon'>
                  <AlertTriangle size={16} />
                </div>

                <div>
                  <span>Highest Risk</span>
                  <strong>Zone A</strong>
                </div>

                <b className='critical-badge'>84</b>
              </div>

              <div className='context-item'>
                <div className='context-icon rain-icon'>
                  <CloudRain size={16} />
                </div>

                <div>
                  <span>Rainfall</span>
                  <strong>Elevated</strong>
                </div>
              </div>

              <div className='context-item'>
                <div className='context-icon sensor-icon'>
                  <Activity size={16} />
                </div>

                <div>
                  <span>Sensor Network</span>
                  <strong>Online</strong>
                </div>
              </div>

              <div className='context-item'>
                <div className='context-icon alert-icon'>
                  <AlertTriangle size={16} />
                </div>

                <div>
                  <span>Active Alerts</span>
                  <strong>3 Alerts</strong>
                </div>
              </div>
            </section>

            {/* ================= QUICK TOOLS ================= */}

            <section className='copilot-tools-card'>
              <div className='tools-header'>
                <Sparkles size={17} />

                <div>
                  <h2>Quick Analysis</h2>
                  <span>Ask AI to analyze current data</span>
                </div>
              </div>

              <button className='analysis-tool'>
                <div className='tool-icon'>
                  <AlertTriangle size={15} />
                </div>

                <div>
                  <strong>Risk Summary</strong>
                  <span>Summarize current zone risks</span>
                </div>

                <ChevronRight size={15} />
              </button>

              <button className='analysis-tool'>
                <div className='tool-icon'>
                  <CloudRain size={15} />
                </div>

                <div>
                  <strong>Rainfall Analysis</strong>
                  <span>Analyze rainfall conditions</span>
                </div>

                <ChevronRight size={15} />
              </button>

              <button className='analysis-tool'>
                <div className='tool-icon'>
                  <Activity size={15} />
                </div>

                <div>
                  <strong>Sensor Analysis</strong>
                  <span>Review sensor conditions</span>
                </div>

                <ChevronRight size={15} />
              </button>

              <button className='analysis-tool'>
                <div className='tool-icon'>
                  <ShieldCheck size={15} />
                </div>

                <div>
                  <strong>Safety Guidance</strong>
                  <span>Get field safety information</span>
                </div>

                <ChevronRight size={15} />
              </button>
            </section>

            {/* ================= LAST UPDATED ================= */}

            <div className='copilot-updated'>
              <Clock size={14} />

              <span>Context updated 2 minutes ago</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default AICopilot;
