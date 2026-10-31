/**
 * ============================================================================
 * HYBRID RAG RETRIEVER SERVICE — Omoikane Innovations
 * ============================================================================
 * Combines 768-dimensional dense vector embeddings (cosine similarity) from
 * Ollama (nomic-embed-text) with lexical keyword matching and exact product
 * boost. Pre-computed index is loaded from src/data/rag_vector_index.json.
 * ============================================================================
 */

import ragIndex from '@/data/rag_vector_index.json';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const OLLAMA_EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';

function dotProduct(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

function magnitude(a) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += a[i] * a[i];
  }
  return Math.sqrt(sum);
}

function cosineSimilarity(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  return dotProduct(a, b) / (magA * magB);
}

/**
 * Retrieves query embedding from local Ollama
 */
async function getQueryEmbedding(query) {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_EMBED_MODEL,
        prompt: query
      }),
      signal: AbortSignal.timeout(6000)
    });

    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data.embedding) ? data.embedding : null;
  } catch (err) {
    console.warn('[RAG Retriever] Local embedding call failed/timed out:', err.message);
    return null;
  }
}

/**
 * Lexical keyword score between query and a chunk
 */
function computeLexicalScore(queryLower, chunk) {
  let score = 0;
  const tokens = queryLower.split(/\s+/).filter(t => t.length > 2);

  // Match chunk keywords
  if (Array.isArray(chunk.keywords)) {
    for (const kw of chunk.keywords) {
      if (queryLower.includes(kw)) {
        score += 0.25;
      }
    }
  }

  // Match chunk section title
  const sectionLower = (chunk.section || '').toLowerCase();
  for (const token of tokens) {
    if (sectionLower.includes(token)) {
      score += 0.2;
    }
  }

  // Exact product model token matches
  const productTokens = ['ofc-x', 'ofc x', 'oesc', 'oesc-60', 'oesc-100', 'ogn-x', 'ogn x', 'ocom-x', 'ocom x'];
  for (const pt of productTokens) {
    if (queryLower.includes(pt) && (chunk.id.includes(pt.replace(/\s+/g, '_')) || sectionLower.includes(pt))) {
      score += 0.5;
    }
  }

  return score;
}

export const ragRetriever = {
  /**
   * Search for top matching passages
   * @param {string} rawQuery User's query
   * @param {number} topK Maximum passages to return (default 3)
   * @returns {Promise<{chunks: Array, hasVerifiedEvidence: boolean, topScore: number}>}
   */
  async retrieve(rawQuery, topK = 3) {
    if (!rawQuery || !rawQuery.trim()) {
      return { chunks: [], hasVerifiedEvidence: false, topScore: 0 };
    }

    const query = rawQuery.trim();
    const queryLower = query.toLowerCase();

    // 1. Get query embedding
    const queryEmbedding = await getQueryEmbedding(query);

    // 2. Score each chunk
    const scoredChunks = ragIndex.chunks.map(chunk => {
      let denseScore = 0;
      if (queryEmbedding && chunk.embedding && chunk.embedding.length > 0) {
        denseScore = cosineSimilarity(queryEmbedding, chunk.embedding);
      }

      const lexicalScore = computeLexicalScore(queryLower, chunk);
      
      // Combined hybrid score (0.65 dense semantic + 0.35 lexical boost)
      const combinedScore = (denseScore * 0.65) + (Math.min(lexicalScore, 1.0) * 0.35);

      return {
        ...chunk,
        denseScore,
        lexicalScore,
        score: combinedScore
      };
    });

    // 3. Rank descending
    scoredChunks.sort((a, b) => b.score - a.score);

    const topResults = scoredChunks.slice(0, topK);
    const topScore = topResults[0]?.score || 0;

    // Strict threshold: below 0.38 means the query is likely off-topic or unsupported
    const hasVerifiedEvidence = topScore >= 0.38;

    return {
      chunks: topResults,
      hasVerifiedEvidence,
      topScore,
      primarySource: topResults[0] ? {
        label: topResults[0].section,
        url: topResults[0].url,
        file: topResults[0].sourceFile
      } : null
    };
  }
};
