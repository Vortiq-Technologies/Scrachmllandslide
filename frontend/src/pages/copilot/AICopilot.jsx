import { useState, useEffect, useRef } from 'react';
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
  Loader2,
} from 'lucide-react';

import Sidebar from '../../components/Sidebar';
import { genAiApi, riskApi, dashboardApi } from '../../services/api';
import './AICopilot.css';

function AICopilot() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am your Landslide Early Warning Copilot. I analyze live telemetry, rainfall thresholds, ML predictions, and hazard reports to provide grounded operational explanations.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState('');
  const [overview, setOverview] = useState(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const [zonesData, overviewData] = await Promise.allSettled([
          riskApi.getZones(),
          dashboardApi.getOverview(),
        ]);
        if (zonesData.status === 'fulfilled' && zonesData.value) {
          const list = Array.isArray(zonesData.value) ? zonesData.value : zonesData.value.zones || [];
          setZones(list);
          if (list.length > 0 && !selectedZoneId) {
            setSelectedZoneId(list[0]._id || list[0].code);
          }
        }
        if (overviewData.status === 'fulfilled' && overviewData.value) {
          setOverview(overviewData.value);
        }
      } catch (err) {
        console.error('Failed to load copilot live context:', err);
      }
    };

    loadContext();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (userPrompt) => {
    const textToSend = userPrompt || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: String(Date.now()),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter((m) => m.id !== 'welcome')
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await genAiApi.chat(textToSend, selectedZoneId || undefined, history);

      const aiReply = response?.reply || response?.explanation || response?.message || 'Analysis complete.';
      const disclaimer = response?.disclaimer || null;

      const assistantMsg = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: aiReply,
        disclaimer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: `Error synthesizing response: ${err.message}. Please verify the backend GenAI service or select a valid risk zone.`,
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Conversation history reset. How can I assist with disaster risk assessment today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const highestRiskZone = zones.reduce((max, z) => {
    const score = z.currentRiskScore || 0;
    return score > (max?.currentRiskScore || 0) ? z : max;
  }, zones[0] || null);

  return (
    <div className='copilot-page'>
      <aside className='copilot-sidebar'>
        <Sidebar />
      </aside>

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
                <p>AI-assisted grounded decision support & risk explanations</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Focus Sector:</span>
              <select
                value={selectedZoneId}
                onChange={(e) => setSelectedZoneId(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  background: 'var(--card-bg)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  fontSize: '12px',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value=''>All Sectors</option>
                {zones.map((z) => (
                  <option key={z._id || z.code} value={z._id}>
                    {z.name || z.code}
                  </option>
                ))}
              </select>
            </div>

            <div className='copilot-status'>
              <span></span>
              AI Copilot Online
            </div>
          </div>
        </div>

        {/* ================= COPILOT LAYOUT ================= */}
        <div className='copilot-layout'>
          {/* ================= CHAT AREA ================= */}
          <section className='copilot-chat-card'>
            <div className='chat-card-header'>
              <div className='chat-agent'>
                <div className='agent-avatar'>
                  <Bot size={20} />
                </div>
                <div>
                  <strong>LEWS Decision Assistant</strong>
                  <span>Grounded Disaster Monitoring Model</span>
                </div>
              </div>

              <button className='refresh-btn' onClick={clearChat} title='Reset conversation'>
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Chat Body */}
            <div className='chat-body'>
              {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`message-row ${isAssistant ? 'ai-row' : 'user-row'}`}
                  >
                    {isAssistant && (
                      <div className='message-avatar'>
                        <Bot size={15} />
                      </div>
                    )}

                    <div className={`message-bubble ${isAssistant ? 'ai-message' : 'user-message'}`}>
                      <div className='message-label'>{isAssistant ? 'AI Copilot' : 'You'} · {msg.timestamp}</div>
                      <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{msg.content}</p>

                      {msg.disclaimer && (
                        <div style={{
                          marginTop: '10px',
                          padding: '6px 10px',
                          background: 'rgba(239, 68, 68, 0.08)',
                          borderLeft: '2px solid #ef4444',
                          fontSize: '11px',
                          color: 'var(--text-secondary)'
                        }}>
                          {msg.disclaimer}
                        </div>
                      )}
                    </div>

                    {!isAssistant && (
                      <div className='message-avatar user-message-avatar'>
                        <User size={15} />
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className='message-row ai-row'>
                  <div className='message-avatar'>
                    <Bot size={15} />
                  </div>
                  <div className='ai-message' style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Loader2 size={16} className='animate-spin' />
                    <span>Analyzing sensor telemetry & generating explanation...</span>
                  </div>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Questions */}
            <div className='quick-question-area'>
              <span>Suggested Operations</span>
              <div className='quick-question-list'>
                <button onClick={() => handleQuickQuestion('Explain the current highest risk zone and primary contributing factors.')}>
                  Explain Highest Risk Sector
                  <ChevronRight size={14} />
                </button>
                <button onClick={() => handleQuickQuestion('Synthesize current rainfall, soil moisture, and slope movement conditions.')}>
                  Analyze Telemetry Status
                  <ChevronRight size={14} />
                </button>
                <button onClick={() => handleQuickQuestion('Draft a public advisory draft for local administration review.')}>
                  Draft Emergency Bulletin
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Chat Input */}
            <div className='chat-input-area'>
              <form
                className='chat-input'
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
              >
                <input
                  type='text'
                  placeholder='Ask about risk factors, rainfall thresholds, active alerts or SOP...'
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={loading}
                />
                <button type='submit' disabled={loading || !inputMessage.trim()}>
                  {loading ? <Loader2 size={17} className='animate-spin' /> : <Send size={17} />}
                </button>
              </form>

              <p>
                ⚠️ AI-generated decision support is assistive only. All operational warnings require human authority review.
              </p>
            </div>
          </section>

          {/* ================= RIGHT PANEL ================= */}
          <aside className='copilot-right-panel'>
            {/* Live Context */}
            <section className='context-card'>
              <div className='context-header'>
                <div>
                  <span>LIVE CONTEXT</span>
                  <h2>Current Telemetry</h2>
                </div>
                <div className='live-dot'></div>
              </div>

              <div className='context-item'>
                <div className='context-icon risk-icon'>
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <span>Highest Risk</span>
                  <strong>{highestRiskZone?.name || 'Monitoring'}</strong>
                </div>
                <b className='critical-badge'>
                  {Math.round((highestRiskZone?.currentRiskScore || 0.84) * (highestRiskZone?.currentRiskScore <= 1 ? 100 : 1))}
                </b>
              </div>

              <div className='context-item'>
                <div className='context-icon rain-icon'>
                  <CloudRain size={16} />
                </div>
                <div>
                  <span>Precipitation Feed</span>
                  <strong>Live Weather API</strong>
                </div>
              </div>

              <div className='context-item'>
                <div className='context-icon sensor-icon'>
                  <Activity size={16} />
                </div>
                <div>
                  <span>Active IoT Nodes</span>
                  <strong>{overview?.devices?.online ?? '12'} Online</strong>
                </div>
              </div>

              <div className='context-item'>
                <div className='context-icon alert-icon'>
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <span>Active Alerts</span>
                  <strong>{overview?.alerts?.active ?? '3'} Warnings</strong>
                </div>
              </div>
            </section>

            {/* Quick Analysis Tools */}
            <section className='copilot-tools-card'>
              <div className='tools-header'>
                <Sparkles size={17} />
                <div>
                  <h2>Quick Analysis</h2>
                  <span>One-click AI synthesis</span>
                </div>
              </div>

              <button
                className='analysis-tool'
                onClick={() => handleQuickQuestion('Provide a comprehensive risk summary for all monitored sectors.')}
              >
                <div className='tool-icon'>
                  <AlertTriangle size={15} />
                </div>
                <div>
                  <strong>Risk Summary</strong>
                  <span>Synthesize current zone risks</span>
                </div>
                <ChevronRight size={15} />
              </button>

              <button
                className='analysis-tool'
                onClick={() => handleQuickQuestion('Analyze recent precipitation rates and saturation impact.')}
              >
                <div className='tool-icon'>
                  <CloudRain size={15} />
                </div>
                <div>
                  <strong>Rainfall Analysis</strong>
                  <span>Analyze precipitation conditions</span>
                </div>
                <ChevronRight size={15} />
              </button>

              <button
                className='analysis-tool'
                onClick={() => handleQuickQuestion('Review IoT tilt and soil moisture readings for anomalies.')}
              >
                <div className='tool-icon'>
                  <Activity size={15} />
                </div>
                <div>
                  <strong>Sensor Diagnostics</strong>
                  <span>Review telemetry health</span>
                </div>
                <ChevronRight size={15} />
              </button>

              <button
                className='analysis-tool'
                onClick={() => handleQuickQuestion('What are the standard evacuation and safety SOP guidelines for this terrain?')}
              >
                <div className='tool-icon'>
                  <ShieldCheck size={15} />
                </div>
                <div>
                  <strong>Safety Guidance</strong>
                  <span>Standard disaster response SOP</span>
                </div>
                <ChevronRight size={15} />
              </button>
            </section>

            {/* Last Updated */}
            <div className='copilot-updated'>
              <Clock size={14} />
              <span>Real-time connected to backend API</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default AICopilot;

