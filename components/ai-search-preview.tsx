"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Sparkles, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { getUserTokenUsage, consumeTokens } from '@/lib/firebase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AnalysisResult {
  analysis: string;
  model: string;
  timestamp: string;
}

export default function AISearchPreview() {
  const [content, setContent] = useState('');
  const [analysisType, setAnalysisType] = useState('news');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [showOutOfTokens, setShowOutOfTokens] = useState(false);

  const handleAnalysis = async () => {
    if (!content.trim()) {
      setError('Please enter some content to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Enforce token limit before analysis
      const usageRes = await getUserTokenUsage();
      if (!usageRes.success) {
        throw new Error(usageRes.error || 'Unable to load token usage');
      }
      const usage = usageRes.data as any;
      const remaining = (usage.total || 0) - (usage.used || 0);
      if (remaining <= 0) {
        setShowOutOfTokens(true);
        return;
      }

      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          type: analysisType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze content');
      }

      setResult(data);

      // Consume one token on successful analysis
      await consumeTokens(1);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const getAnalysisTypeLabel = (type: string) => {
    switch (type) {
      case 'news':
        return 'News Article';
      case 'social_media':
        return 'Social Media';
      case 'general':
        return 'General Content';
      default:
        return 'Content';
    }
  };

  const getAnalysisTypeIcon = (type: string) => {
    switch (type) {
      case 'news':
        return <CheckCircle className="h-4 w-4" />;
      case 'social_media':
        return <AlertTriangle className="h-4 w-4" />;
      case 'general':
        return <Search className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Out of tokens dialog */}
      <AlertDialog open={showOutOfTokens} onOpenChange={setShowOutOfTokens}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>You're out of tokens</AlertDialogTitle>
            <AlertDialogDescription>
              You have run out of verification tokens. Please upgrade your plan to continue analyzing content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowOutOfTokens(false)}>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => (window.location.href = '/pricing')}>Upgrade Plan</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            AI Content Analysis
          </CardTitle>
          <CardDescription>
            Get instant AI-powered analysis of news articles, social media posts, and other content for credibility and factual accuracy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="analysis-type">Analysis Type</Label>
            <Select value={analysisType} onValueChange={setAnalysisType}>
              <SelectTrigger>
                <SelectValue placeholder="Select analysis type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="news">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    News Article
                  </div>
                </SelectItem>
                <SelectItem value="social_media">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Social Media
                  </div>
                </SelectItem>
                <SelectItem value="general">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    General Content
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content to Analyze</Label>
            <Textarea
              id="content"
              placeholder={`Paste or type the ${getAnalysisTypeLabel(analysisType).toLowerCase()} content here...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleAnalysis} 
            disabled={loading || !content.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle>Analysis Results</CardTitle>
                <Badge variant="secondary" className="flex items-center gap-1">
                  {getAnalysisTypeIcon(analysisType)}
                  {getAnalysisTypeLabel(analysisType)}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {new Date(result.timestamp).toLocaleTimeString()}
              </div>
            </div>
            <CardDescription>
              AI-powered analysis using {result.model}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="formatted">Formatted</TabsTrigger>
              </TabsList>
              <TabsContent value="analysis" className="mt-4">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-lg">
                    {result.analysis}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="formatted" className="mt-4">
                <div className="prose prose-sm max-w-none">
                  {result.analysis.split('\n').map((line, index) => {
                    if (line.match(/^\d+\./)) {
                      return (
                        <div key={index} className="mb-4">
                          <h4 className="font-semibold text-blue-600 mb-2">{line}</h4>
                        </div>
                      );
                    } else if (line.trim()) {
                      return (
                        <p key={index} className="mb-2 text-gray-700">
                          {line}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
