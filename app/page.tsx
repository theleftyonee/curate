"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ExternalLink, Calendar, Tag, ImageIcon, FileText, BookOpen } from "lucide-react"
import ParticleEffect from "../vercel-logo-particles"

interface MetadataResult {
  title: string
  description: string
  image?: string
  keywords: string[]
  category: string
  subcategory: string
  url: string
  extractedAt: string
  bodyContent?: string
  summary?: string
}

export default function CurateApp() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MetadataResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to process URL")
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-950 to-black text-gray-100 relative overflow-x-hidden">
      {/* Particle Background */}
      <ParticleEffect />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 -mt-20">
        {/* Header Section */}
        <div className="text-center mb-16 pt-8 md:pt-12">
          <p className="text-gray-200 text-2xl md:text-3xl lg:text-4xl max-w-3xl mx-auto font-light tracking-tight leading-relaxed">
            Link Archiving, Categorization & Summarization
          </p>
          <p className="text-gray-400 text-sm md:text-base mt-4 md:mt-5 font-light max-w-2xl mx-auto leading-relaxed">
            Automatically categorize, organize and summarize your links with intelligent metadata extraction
          </p>
        </div>

        {/* URL Input Form */}
        <Card className="max-w-4xl mx-auto mb-12 bg-gray-900/80 border border-gray-800/80 backdrop-blur-sm rounded-lg">
          <CardHeader className="pb-4 pt-5 px-6">
            <CardTitle className="text-gray-300 text-lg font-normal tracking-tight">
              Enter URL to Analyze
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="url"
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 h-11 bg-gray-950/80 border-gray-800 text-gray-200 placeholder-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700/50 transition-all duration-200 rounded-lg"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !url.trim()}
                className="h-11 bg-gray-800 hover:bg-gray-700 text-gray-200 shadow-sm hover:shadow transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed px-6 font-normal rounded-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Summarize"
                )}
              </Button>
            </form>
            {error && (
              <div className="mt-4 p-3 bg-red-950/50 border border-red-900/50 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Display */}
        {result && (
          <Card className="max-w-4xl mx-auto bg-gray-900/80 border border-gray-800/80 backdrop-blur-sm rounded-lg mb-12">
            <CardHeader className="border-b border-gray-800/80 px-6 py-5">
              <CardTitle className="text-gray-300 text-lg font-normal tracking-tight">
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Summary Section */}
              {result.summary && (
                <div className="border border-gray-800/80 rounded-lg p-5 bg-gray-950/80">
                  <h3 className="text-base font-medium text-gray-300 mb-3">
                    Summary
                  </h3>
                  <ul className="list-none space-y-2 text-gray-300 text-sm leading-relaxed">
                    {result.summary.split('\n').filter(line => line.trim()).map((line, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-gray-400 mr-1">•</span>
                        <span>{line.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metadata Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-950/80 border border-gray-800/80">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Title</h3>
                    <p className="text-gray-200 text-sm leading-relaxed">{result.title}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-950/80 border border-gray-800/80">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {result.description || <span className="text-gray-600 italic">No description available</span>}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-950/80 border border-gray-800/80">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Category</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gray-800 text-gray-200 px-2.5 py-1 text-xs font-normal border border-gray-700">
                        {result.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-gray-700 text-gray-300 bg-gray-900/50 px-2.5 py-1 text-xs font-normal"
                      >
                        {result.subcategory}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {result.image && (
                    <div className="p-4 rounded-lg bg-gray-950/80 border border-gray-800/80">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                        Preview Image
                      </h3>
                      <div className="relative overflow-hidden rounded-lg border border-gray-800/80 bg-gray-900/50">
                        <img
                          src={result.image || "/placeholder.svg"}
                          alt="Page preview"
                          className="w-full max-w-sm rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-lg bg-gray-950/80 border border-gray-800/80">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {result.keywords.length > 0 ? (
                        result.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="border-gray-700 text-gray-300 bg-gray-900/50 text-xs px-2 py-0.5 font-normal">
                            {keyword}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-600 text-sm italic">No keywords extracted</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-950/80 border border-gray-800/80">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Extracted At
                    </h3>
                    <p className="text-gray-300 text-sm">{new Date(result.extractedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Metadata Table */}
              <div className="border-t border-gray-800/80 pt-5">
                <h3 className="text-base font-medium text-gray-300 mb-4">
                  Detailed Information
                </h3>
                <div className="overflow-x-auto rounded-lg border border-gray-800/80 bg-gray-950/80">
                  <table className="w-full border-collapse">
                    <tbody className="text-sm">
                      <tr className="border-b border-gray-800/80">
                        <td className="py-3 px-4 font-medium text-gray-500 w-1/4 uppercase text-xs tracking-wider">URL</td>
                        <td className="py-3 px-4 text-gray-300 break-all">
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-gray-300 transition-colors duration-200"
                          >
                            {result.url}
                          </a>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-800/80">
                        <td className="py-3 px-4 font-medium text-gray-500 uppercase text-xs tracking-wider">Title</td>
                        <td className="py-3 px-4 text-gray-300">{result.title}</td>
                      </tr>
                      <tr className="border-b border-gray-800/80">
                        <td className="py-3 px-4 font-medium text-gray-500 uppercase text-xs tracking-wider">Description</td>
                        <td className="py-3 px-4 text-gray-300">{result.description || <span className="text-gray-600 italic">N/A</span>}</td>
                      </tr>
                      <tr className="border-b border-gray-800/80">
                        <td className="py-3 px-4 font-medium text-gray-500 uppercase text-xs tracking-wider">Category</td>
                        <td className="py-3 px-4 text-gray-300">{result.category}</td>
                      </tr>
                      <tr className="border-b border-gray-800/80">
                        <td className="py-3 px-4 font-medium text-gray-500 uppercase text-xs tracking-wider">Subcategory</td>
                        <td className="py-3 px-4 text-gray-300">{result.subcategory}</td>
                      </tr>
                      <tr className="border-b border-gray-800/80">
                        <td className="py-3 px-4 font-medium text-gray-500 uppercase text-xs tracking-wider">Image URL</td>
                        <td className="py-3 px-4 text-gray-300 break-all">{result.image || <span className="text-gray-600 italic">N/A</span>}</td>
                      </tr>
                      <tr className="border-b border-gray-800/80">
                        <td className="py-3 px-4 font-medium text-gray-500 uppercase text-xs tracking-wider">Keywords</td>
                        <td className="py-3 px-4 text-gray-300">{result.keywords.join(", ") || <span className="text-gray-600 italic">N/A</span>}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-500 uppercase text-xs tracking-wider">Extracted At</td>
                        <td className="py-3 px-4 text-gray-300">{new Date(result.extractedAt).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Body Content Preview */}
              {result.bodyContent && (
                <div className="border-t border-gray-800/80 pt-5">
                  <h3 className="text-base font-medium text-gray-300 mb-3">
                    Content Preview
                  </h3>
                  <div className="bg-gray-950/80 rounded-lg p-4 max-h-96 overflow-y-auto border border-gray-800/80 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900/50">
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {result.bodyContent.substring(0, 3000)}
                      {result.bodyContent.length > 3000 && (
                        <span className="text-gray-600 italic"> ...</span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
