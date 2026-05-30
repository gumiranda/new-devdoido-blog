/**
 * AI article generation prompt templates (M3.4).
 *
 * Merged with workspace-level `automationConfig.promptTemplate`.
 * Variables: {{transcript}}, {{title}}, {{channel}}, {{date}}.
 */

export const SYSTEM_PROMPT = `Você é um redator técnico especializado em SEO e AEO (Answer Engine Optimization). 
Escreva artigos de blog em português brasileiro que ranqueiem bem no Google e sejam citados por IAs como ChatGPT e Perplexity.

Regras:
- Título H1 cativante e otimizado para SEO (inclua palavra-chave principal)
- Meta description de até 160 caracteres com CTA implícito
- Primeiro parágrafo com answer box de 40-80 palavras resumindo o artigo
- Subtítulos H2 escaneáveis
- Parágrafos curtos (máximo 4 linhas)
- Use bullets, listas numeradas e blockquotes quando apropriado
- Inclua uma seção de FAQ com 3-5 perguntas no final (perguntas reais que as pessoas fazem no Google)
- Tom informal mas profissional — como se estivesse explicando para um colega
- Nunca use jargão desnecessário sem explicar
- Formate a resposta como JSON com as chaves: title, metaDescription, contentHtml, excerpt, answerBox, faq (array de {question, answer}), tags (array de strings)`;

export const DEFAULT_USER_PROMPT = `Escreva um artigo de blog a partir da transcrição de vídeo abaixo.

Transcrição:
{{transcript}}

Retorne APENAS um objeto JSON válido com as chaves:
{
  "title": "string",
  "metaDescription": "string (max 160 chars)",
  "contentHtml": "string (HTML do artigo completo)",
  "excerpt": "string (2-3 frases de gancho)",
  "answerBox": "string (40-80 palavras resumindo o artigo)",
  "faq": [{"question": "string", "answer": "string"}],
  "tags": ["string", ...]
}`;

/**
 * Merge the workspace custom prompt template with the system prompt.
 * The workspace template replaces {{transcript}} and other variables.
 */
export function buildPrompt(
  automationPromptTemplate?: string | null,
  transcript?: string,
  title?: string,
  channelName?: string,
): { system: string; user: string } {
  let userPrompt = automationPromptTemplate || DEFAULT_USER_PROMPT;

  userPrompt = userPrompt
    .replace(/{{transcript}}/g, transcript ?? "")
    .replace(/{{title}}/g, title ?? "Vídeo")
    .replace(/{{channel}}/g, channelName ?? "canal")
    .replace(/{{date}}/g, new Date().toLocaleDateString("pt-BR"));

  return { system: SYSTEM_PROMPT, user: userPrompt };
}
