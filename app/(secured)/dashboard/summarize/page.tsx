"use client";

import { client } from "@/api/client";
import { SetStateAction, useState } from "react";

import { CopyableContent } from "@/components/copyable-content";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CharacterCountTextarea } from "@/components/ui/character-count-textarea";
import { Skeleton } from "@/components/ui/skeleton";

export default function SummarizePage() {
  const [prompt, setPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await client.api.summarize.$post({
        json: {
          prompt,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Text Summarizer</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Summarize Text</CardTitle>
            <CardDescription>
              Enter text below to generate a concise summary.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <CharacterCountTextarea
                  id="prompt"
                  placeholder="Enter the text you want to summarize..."
                  value={prompt}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setPrompt(e.target.value)}
                  disabled={loading}
                  maxLength={4000}
                  className="min-h-[200px]"
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setPrompt("");
                  setSummary("");
                }}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={loading || !prompt}
              >
                {loading ? "Summarizing..." : "Summarize Text"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-6">
          {error && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md">
              {error}
            </div>
          )}

          <Card className="h-full">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>
                Copy this summary to use elsewhere.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[95%]" />
                  <Skeleton className="h-4 w-[85%]" />
                  <Skeleton className="h-4 w-[90%]" />
                </div>
              ) : summary ? (
                <CopyableContent content={summary} />
              ) : (
                <div className="text-muted-foreground text-center py-8">
                  Enter text and click Summarize to create a summary
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}