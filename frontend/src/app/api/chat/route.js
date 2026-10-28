import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { COMPANY_KNOWLEDGE_DOCUMENT } from '@/data/omoikaneKnowledge';
import { omiAssistantService } from '@/services/omiAssistantService';

/**
 * ============================================================================
 * GROQ AI (LLAMA 3.3 70B) RAG CHAT API — Omoikane Innovations
 * ============================================================================
 * Powered by Meta's open-source Llama 3.3 70B on Groq LPUs.
 * Injected with the verified official Omoikane Innovations knowledge document.
 * Fast, open-source, highly accurate, and typo-tolerant.
 * Includes local semantic fallback engine if API key is unconfigured or rate-limited.
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

let groqClient = null;

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

function parseModelResponse(rawText) {
  let text = rawText.trim();
  let suggestions = ["About Omoikane", "Products & Services", "Contact Team"];
  let sourceLabel = "About Us";
  let sourceUrl = "https://www.omoikaneinnovations.com/about-us/";

  // Look for JSON block anywhere at the end of the text
  const jsonMatch = text.match(/\{[\s\S]*?"suggestions"[\s\S]*?"source_url"[\s\S]*?\}+/);
  if (jsonMatch) {
    try {
      let jsonStr = jsonMatch[0];
      while (jsonStr.endsWith('}}') && !jsonStr.includes('{{')) {
        jsonStr = jsonStr.slice(0, -1);
      }
      const meta = JSON.parse(jsonStr);
      if (meta.suggestions && Array.isArray(meta.suggestions)) {
        suggestions = meta.suggestions.slice(0, 3);
      }
      if (meta.source_label) sourceLabel = meta.source_label;
      if (meta.source_url) sourceUrl = meta.source_url;
      text = text.replace(jsonMatch[0], '').trim();
    } catch {
      text = text.replace(jsonMatch[0], '').trim();
    }
  }

  // Remove possible stray markdown backticks or remaining json code blocks
  text = text.replace(/```(?:json)?\s*\{[\s\S]*?\}\s*```/g, '').trim();
  text = text.replace(/^```[\w]*\n?/gm, '').replace(/```$/gm, '').trim();

  // Strip trailing "Next you might ask/explore" text since suggestions appear as UI buttons
  text = text.replace(/\n\s*---\s*\n\s*\*\*Next you might (?:want to )?(?:ask|explore):\*\*[\s\S]*?$/i, '').trim();

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

    // ────────────────────────────────────────────────────────────────────────
    // 1. RESUME ATTACHMENT PROCESSING (PDF / DOCX / TXT)
    // ────────────────────────────────────────────────────────────────────────
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

      // Try Groq Llama 3.3 for deep candidate skill extraction & role alignment
      const client = getGroqClient();
      if (client && extractedText && extractedText.length > 20) {
        try {
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

          for (const modelName of ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b']) {
            try {
              const completion = await client.chat.completions.create({
                model: modelName,
                messages: [{ role: 'user', content: resumePrompt }],
                temperature: 0.2,
                max_tokens: 1200,
              });

              const raw = completion.choices[0]?.message?.content || "";
              if (raw && raw.trim()) {
                const parsed = parseModelResponse(raw);
                return NextResponse.json(
                  {
                    ...parsed,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  },
                  { status: 200 }
                );
              }
            } catch (modelErr) {
              console.warn(`[Groq resume model ${modelName} warning]:`, modelErr.message);
            }
          }
        } catch (aiErr) {
          console.warn('[Groq resume evaluation error]:', aiErr.message);
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

    // ────────────────────────────────────────────────────────────────────────
    // 2. TEXT & VOICE QUERY PROCESSING
    // ────────────────────────────────────────────────────────────────────────
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

    // Candidate Groq models (High-performance open-source weights on Groq LPUs)
    const candidateModels = [
      'openai/gpt-oss-120b',
      'qwen/qwen3.8-27b',
      'openai/gpt-oss-20b'
    ];

    let groqError = null;
    const client = getGroqClient();

    if (client) {
      try {
        // Build conversation messages for Groq
        const messages = [
          { role: 'system', content: SYSTEM_PROMPT }
        ];

        for (const turn of conversationHistory.slice(-6)) {
          if (turn.role === 'user' && turn.text) {
            messages.push({ role: 'user', content: turn.text });
          } else if (turn.role === 'bot' && turn.text) {
            messages.push({ role: 'assistant', content: turn.text });
          }
        }

        messages.push({ role: 'user', content: trimmed });

        for (const modelName of candidateModels) {
          try {
            const completion = await client.chat.completions.create({
              model: modelName,
              messages,
              temperature: 0.2,
              max_tokens: 1024,
            });

            const rawText = completion.choices[0]?.message?.content || "";
            if (rawText && rawText.trim()) {
              const parsed = parseModelResponse(rawText);
              return NextResponse.json(
                {
                  ...parsed,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                },
                { status: 200 }
              );
            }
          } catch (mErr) {
            console.warn(`[Groq model ${modelName} warning]:`, mErr.message);
            groqError = mErr;
          }
        }
      } catch (err) {
        groqError = err;
      }
    }

    // Fallback: If Groq key is not set or network fails, use the local verified knowledge engine
    console.warn('[Groq fallback activated]:', groqError?.message || 'Using local verified engine');
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
