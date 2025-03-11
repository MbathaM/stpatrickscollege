"use client";

import { SetStateAction, useState } from "react";
import { client } from "@/api/client";

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
import { CopyableContent } from "@/components/copyable-content";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "af", name: "Afrikaans" },
  { code: "zu", name: "Zulu" },
  { code: "xh", name: "Xhosa" },
];

export default function TranslatePage() {
  const [text, setText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("en");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await client.api.translate.$post({
        json: {
          text,
          sourceLanguage,
          targetLanguage,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to translate text");
      }

      const data = await response.json();
      setTranslation((data as { translation: string }).translation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Text Translator</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Translate Text</CardTitle>
            <CardDescription>
              Enter text and select languages to translate.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="text">Text to Translate</Label>
                <CharacterCountTextarea
                  id="text"
                  placeholder="Enter the text you want to translate..."
                  value={text}
                  onChange={(e: { target: { value: SetStateAction<string>; }; }) => setText(e.target.value)}
                  disabled={loading}
                  maxLength={2000}
                  className="min-h-[150px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="sourceLanguage">From</Label>
                  <Select
                    value={sourceLanguage}
                    onValueChange={setSourceLanguage}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="targetLanguage">To</Label>
                  <Select
                    value={targetLanguage}
                    onValueChange={setTargetLanguage}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setText("");
                  setTranslation("");
                }}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={loading || !text || !targetLanguage}
              >
                {loading ? "Translating..." : "Translate Text"}
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
              <CardTitle>Translation</CardTitle>
              <CardDescription>
                Copy this translation to use elsewhere.
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
              ) : translation ? (
                <CopyableContent content={translation} />
              ) : (
                <div className="text-muted-foreground text-center py-8">
                  Enter text and select languages to translate
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}