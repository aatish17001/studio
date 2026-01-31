"use client";

import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { summarizeCheckInHistory } from '@/ai/flows/check-in-history-summarizer';
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Sparkles, Bot } from 'lucide-react';

export function SummaryTab() {
  const { userProfile } = useAuth();
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSummary = async () => {
    if (!userProfile) return;

    setLoading(true);
    setError('');
    setSummary('');

    try {
      const q = query(
        collection(db, 'checkins'),
        where('userId', '==', userProfile.uid),
        orderBy('timestamp', 'desc'),
        limit(100) // Get last 100 check-ins
      );

      const querySnapshot = await getDocs(q);
      const checkIns = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          userId: data.userId as string,
          timestamp: (data.timestamp as Timestamp).toDate().toISOString(),
        };
      });

      if (checkIns.length === 0) {
        setSummary("You don't have any check-in history yet. Start by checking in!");
        setLoading(false);
        return;
      }

      const result = await summarizeCheckInHistory({
        userId: userProfile.uid,
        checkIns: checkIns,
      });

      setSummary(result.summary);
    } catch (e) {
      console.error('Error generating summary:', e);
      setError('Failed to generate summary. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6 space-y-6">
      <h1 className="text-3xl font-bold font-headline text-foreground">Your AI Summary</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personalized Fitness Insights</CardTitle>
          <CardDescription>
            Let our AI analyze your check-in history to find trends and offer suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGenerateSummary} disabled={loading} className="w-full sm:w-auto transition-transform hover:scale-105">
            <Sparkles className="mr-2 h-4 w-4" />
            {loading ? 'Analyzing...' : 'Generate My Summary'}
          </Button>
          
          {error && <p className="text-destructive">{error}</p>}
          
          {summary && (
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-primary">
                    <Bot /> AI Generated Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-foreground">{summary}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
