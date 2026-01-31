'use server';

/**
 * @fileOverview Summarizes user check-in history to identify trends and areas for improvement.
 *
 * - summarizeCheckInHistory - A function that generates a summary of a user's check-in history.
 * - SummarizeCheckInHistoryInput - The input type for the summarizeCheckInHistory function.
 * - SummarizeCheckInHistoryOutput - The return type for the summarizeCheckInHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCheckInHistoryInputSchema = z.object({
  userId: z.string().describe('The ID of the user whose check-in history is to be summarized.'),
  checkIns: z.array(z.object({
    userId: z.string(),
    timestamp: z.string(),
  })).describe('An array of check-in records for the user, including userId and timestamp.'),
});
export type SummarizeCheckInHistoryInput = z.infer<typeof SummarizeCheckInHistoryInputSchema>;

const SummarizeCheckInHistoryOutputSchema = z.object({
  summary: z.string().describe('A summary of the user\'s check-in history, highlighting trends and areas for improvement.'),
});
export type SummarizeCheckInHistoryOutput = z.infer<typeof SummarizeCheckInHistoryOutputSchema>;

export async function summarizeCheckInHistory(input: SummarizeCheckInHistoryInput): Promise<SummarizeCheckInHistoryOutput> {
  return summarizeCheckInHistoryFlow(input);
}

const summarizeCheckInHistoryPrompt = ai.definePrompt({
  name: 'summarizeCheckInHistoryPrompt',
  input: {schema: SummarizeCheckInHistoryInputSchema},
  output: {schema: SummarizeCheckInHistoryOutputSchema},
  prompt: `You are an AI assistant that summarizes a user's gym check-in history. Provide a concise summary of the user's attendance trends and suggest areas for improvement based on the data provided.

User ID: {{{userId}}}
Check-in History:
{{#each checkIns}}
- Timestamp: {{{timestamp}}}
{{/each}}
`,
});

const summarizeCheckInHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeCheckInHistoryFlow',
    inputSchema: SummarizeCheckInHistoryInputSchema,
    outputSchema: SummarizeCheckInHistoryOutputSchema,
  },
  async input => {
    const {output} = await summarizeCheckInHistoryPrompt(input);
    return output!;
  }
);
