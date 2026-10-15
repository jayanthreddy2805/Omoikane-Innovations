import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { COMPANY_KNOWLEDGE_DOCUMENT } from '@/data/omoikaneKnowledge';
import { omiAssistantService } from '@/services/omiAssistantService';

/**
 * ============================================================================
 * GEMINI RAG CHAT API — Omoikane Innovations AI Assistant
 * ============================================================================
 * Uses Google Gemini (with model fallbacks) with the full company knowledge base
 * as context (RAG). Handles typos, varied phrasing, and all company queries.
 * Also gracefully falls back to local semantic knowledge engine if external API drops.
 */

const SYSTEM_PROMPT = `You are "Omi", the official AI assistant for Omoikane Innovations.

You answer questions exclusively about Omoikane Innovations using the official knowledge base provided below.
You are embedded on the company's official website at https://www.omoikaneinnovations.com/

=== OFFICIAL COMPANY KNOWLEDGE BASE ===
${COMPANY_KNOWLEDGE_DOCUMENT}
=== END OF KNOWLEDGE BASE ===

## YOUR STRICT RULES:

1. **Answer EVERY question** about the company — never say "I don't know" or give a fallback for legitimate company queries. Use the knowledge base to answer.

2. **Handle typos gracefully** — If the user types "comapny" they mean "company", "wt servies" means "what services". Understand the visitor's intent naturally.

3. **Use ONLY the knowledge base above** — Never invent: salaries, CEO/founder names, exact unpublished metrics (UAV flight range, payload, price, battery life).

4. **For questions about unpublished details** (e.g. exact salary figures, current vacancies count, CEO name, specific drone specs), explain that these specific figures are not published online and invite them to contact: info@omoikaneinnovations.com or +91-8861035848.

5. **Always answer company-related questions** — If someone asks anything about the company's work, products, technologies, careers, contact — answer it accurately and comprehensively from the knowledge base.

6. **Format responses clearly** — Use bullet points, bold headings, and concise paragraphs. Keep answers clean, readable, and professional.

7. **Stay in character** — You are Omi, Omoikane Innovations' official assistant. Be professional, polite, and helpful.

8. **Response structure** — Always end your response with a JSON block on the last line in this exact format:
{"suggestions":["suggestion1","suggestion2","suggestion3"],"source_label":"page name","source_url":"https://url"}

Choose suggestions that are natural follow-up questions the visitor might ask next.
Choose the source that best matches the answer you gave.

9. **Location** — The company is located in Bangalore, India ONLY.`;

let genAI = null;

function getGeminiClient() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

function parseGeminiResponse(rawText) {
  let text = rawText.trim();
  let suggestions = ["About Omoikane", "Products & Services", "Contact Team"];
  let sourceLabel = "About Us";
  let sourceUrl = "https://www.omoikaneinnovations.com/about-us/";

  const lines = text.split('\n');
  const lastLine = lines[lines.length - 1].trim();

  if (lastLine.startsWith('{') && lastLine.endsWith('}')) {
    try {
      const meta = JSON.parse(lastLine);
      if (meta.suggestions && Array.isArray(meta.suggestions)) {
        suggestions = meta.suggestions.slice(0, 3);
      }
      if (meta.source_label) sourceLabel = meta.source_label;
      if (meta.source_url) sourceUrl = meta.source_url;
      text = lines.slice(0, -1).join('\n').trim();
    } catch {
      // Keep defaults
    }
  }

  // Remove possible stray markdown backticks if wrapped in json block
  text = text.replace(/^```[\w]*\n?/gm, '').replace(/```$/gm, '').trim();

  return {
    text,
    suggestions,
    source: { label: sourceLabel, url: sourceUrl }
  };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [], resume } = body;

    // Handle resume upload analysis with proper PDF/DOCX extraction & AI evaluation
    if (resume && resume.fileName) {
      let extractedText = resume.fileText || "";

      if (resume.fileBase64 && (!extractedText || extractedText.length < 50)) {
        const ext = resume.fileName.substring(resume.fileName.lastIndexOf('.')).toLowerCase();
        try {
          const buffer = Buffer.from(resume.fileBase64, 'base64');
          if (ext === '.pdf') {
            const pdfParse = require('pdf-parse');
            const parsed = await pdfParse(buffer);
            if (parsed && parsed.text) {
              extractedText = parsed.text.trim();
            }
          } else if (ext === '.docx' || ext === '.doc') {
            const mammoth = require('mammoth');
            const result = await mammoth.extractRawText({ buffer });
            if (result && result.value) {
              extractedText = result.value.trim();
            }
          } else if (ext === '.txt') {
            extractedText = buffer.toString('utf-8');
          }
        } catch (parseErr) {
          console.warn('[Server Resume Parse Warning]:', parseErr.message);
        }
      }

      // Try AI-powered deep resume evaluation with Gemini
      if (extractedText && extractedText.length > 20) {
        try {
          const client = getGeminiClient();
          const resumePrompt = `You are an expert technical recruiter evaluating a candidate's resume for engineering career opportunities at Omoikane Innovations.

Candidate Resume Filename: "${resume.fileName}"
Extracted Resume Text:
"""
${extractedText.slice(0, 10000)}
"""

Official Omoikane Innovations Engineering Departments and Career Roles:
1. **Software Development** (https://www.omoikaneinnovations.com/software-development/):
   - Web Developer (App & Dashboard): React.js, Next.js, Node.js, Django, WebSockets, REST APIs, TypeScript, Telemetry dashboards
   - Python Developer (Product-Level): Python (OOP, async), FastAPI, Flask, Microservices, Docker, MQTT, WebSockets, Data pipelines
   - AI Developer: Machine learning, Deep learning, Computer vision (detection, tracking, segmentation), PyTorch, TensorFlow, OpenCV, ROS/ROS2, Edge AI, NVIDIA Jetson
   - Embedded Firmware Engineer: Embedded C/C++, STM32 microcontrollers, ARM Cortex, ESP32, RTOS, UART/SPI/I2C/CAN, Flight controller firmware

2. **Electronics Engineering** (https://www.omoikaneinnovations.com/electronics/):
   - Hardware Design Engineer: Circuit design, embedded hardware architecture, power management, schematics
   - PCB Design Engineer: Multi-layer PCB layout, high-speed routing, signal integrity, Altium Designer, KiCad, EMI/EMC
   - RF System Designer: RF circuit design, antenna design and tuning, telemetry modules, spectrum analysis
   - Test Engineer: Hardware validation, environmental testing, diagnostic test benches
   - Product Engineer: Hardware lifecycle management, manufacturing coordination, QA compliance

3. **Mechanical Engineering** (https://www.omoikaneinnovations.com/mechanical/):
   - 3D & 2D Mechanical Design Engineer: CAD modeling (SolidWorks, CATIA, Fusion 360), GD&T, 2D fabrication drawings, rapid prototyping
   - Enclosure & Product Design Engineer: Rugged IP-rated enclosures, aerospace alloys and composites, sealing systems
   - Mechanical Assembly & Integration Engineer: Electromechanical integration, airframe assembly, gimbal assembly
   - Structural & Thermal Analysis Engineer: FEA stress analysis, CFD aerodynamic modeling, thermal dissipation, ANSYS

Instructions:
1. Thoroughly analyze the candidate's resume text and extract all their actual technical skills, programming languages, libraries, CAD/hardware tools, and frameworks.
2. Group the detected skills cleanly by discipline.
3. Identify the best matching Omoikane Innovations role(s) with specific justifications connecting their background to what Omoikane builds (Aerospace UAVs, Defense surveillance, Embedded systems, etc.).
4. Note any complementary strengths or growth areas.
5. Provide direct links to the relevant career pages.
6. Note clearly that this matching is informational and guide them to apply officially via the website or at info@omoikaneinnovations.com.
7. The last line MUST be a JSON block:
{"suggestions":["How do I apply for the matched role?","What projects does Omoikane build?","Software development careers"],"source_label":"Careers Portal","source_url":"https://www.omoikaneinnovations.com/software-development/"}
`;

          for (const modelName of ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.7-flash']) {
            try {
              const model = client.getGenerativeModel({
                model: modelName,
                generationConfig: {
                  temperature: 0.2,
                  maxOutputTokens: 1200,
                },
              });
              const res = await model.generateContent(resumePrompt);
              const raw = res.response.text();
              if (raw && raw.trim()) {
                const parsed = parseGeminiResponse(raw);
                return NextResponse.json(
                  {
                    ...parsed,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  },
                  { status: 200 }
                );
              }
            } catch (gemErr) {
              console.warn(`[Gemini resume model ${modelName} error]:`, gemErr.message);
            }
          }
        } catch (aiErr) {
          console.warn('[Gemini resume evaluation error]:', aiErr.message);
        }
      }

      // Local fallback with real extracted text
      const resumeAnalysis = await omiAssistantService.analyzeResume(resume.fileName, extractedText);
      return NextResponse.json(
        {
          ...resumeAnalysis,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        { status: 200 }
      );
    }

    // Input validation
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json(
        {
          text: "Please ask me anything about Omoikane Innovations — our technologies, products, careers, or contact details!",
          suggestions: ["About Omoikane", "Products & Services", "Career Opportunities", "Contact Us"],
          source: null,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        { status: 200 }
      );
    }

    const trimmed = message.trim().slice(0, 1500);

    // List of candidate models to try in order of priority
    const candidateModels = [
      'gemini-3.5-flash',
      'gemini-3.8-flash',
      'gemini-3.7-flash',
      'gemini-3.6-flash'
    ];

    let geminiError = null;

    try {
      const client = getGeminiClient();

      // Format conversation history for Gemini chat
      const history = [];
      for (const turn of conversationHistory.slice(-6)) {
        if (turn.role === 'user' && turn.text) {
          history.push({ role: 'user', parts: [{ text: turn.text }] });
        } else if (turn.role === 'bot' && turn.text) {
          history.push({ role: 'model', parts: [{ text: turn.text }] });
        }
      }

      for (const modelName of candidateModels) {
        try {
          const model = client.getGenerativeModel({
            model: modelName,
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: {
              temperature: 0.2,
              topP: 0.8,
              maxOutputTokens: 1024,
            },
          });

          const chat = model.startChat({ history });
          const result = await chat.sendMessage(trimmed);
          const rawText = result.response.text();

          if (rawText && rawText.trim()) {
            const parsed = parseGeminiResponse(rawText);
            return NextResponse.json(
              {
                ...parsed,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              },
              { status: 200 }
            );
          }
        } catch (mErr) {
          console.warn(`[Gemini model ${modelName} warning]:`, mErr.message);
          geminiError = mErr;
          // Continue to next model candidate
        }
      }
    } catch (clientErr) {
      geminiError = clientErr;
    }

    // If Gemini models fail or rate limit, immediately fallback to local verified knowledge engine
    console.warn('[Gemini RAG fallback activated]:', geminiError?.message || 'Using local verified engine');
    const localResponse = await omiAssistantService.processMessage(trimmed);

    return NextResponse.json(
      {
        ...localResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      { status: 200 }
    );

  } catch (err) {
    console.error('[API /api/chat Final Catch]:', err);
    return NextResponse.json(
      {
        text: "Omoikane Innovations is a product-driven technology company focused on developing advanced embedded systems, autonomous platforms, and defense-grade solutions across Aerospace, Defense, Automotive, and Railways.\n\nFor direct inquiries, please reach out to **info@omoikaneinnovations.com** or call **+91-8861035848**.",
        suggestions: ["About Omoikane", "Products & Services", "Contact Us"],
        source: { label: "Contact Us", url: "https://www.omoikaneinnovations.com/contact-us/" },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      { status: 200 }
    );
  }
}
