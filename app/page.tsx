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
    <div className="min-h-screen bg-black text-white relative">
      {/* Particle Background */}
      <ParticleEffect />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-0 -mt-20">
        {/* Header Section */}
        <div className="text-center mb-12 pt-0">
          <p className="text-gray-300 text-xl md:text-2xl max-w-2xl mx-auto font-light">
            Link Archiving, Categorization & Summarization
          </p>
          <p className="text-gray-500 text-sm mt-3 font-light">
            Automatically categorize, organize and summarize your links with intelligent metadata extraction
          </p>
        </div>

        {/* URL Input Form */}
        <Card className="max-w-4xl mx-auto mb-8 bg-gray-900/30 border-gray-700/50 backdrop-blur-md shadow-2xl transition-all duration-300 hover:bg-gray-900/40 hover:border-gray-600/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg font-light">Enter URL to Analyze</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-gray-800/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-cyan-400/50 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !url.trim()}
                className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed px-8"
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
              <div className="mt-4 p-4 bg-red-900/30 border border-red-700/50 rounded-lg backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Display */}
        {result && (
          <Card className="max-w-4xl mx-auto bg-gray-900/30 border-gray-700/50 backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="border-b border-gray-800/50">
              <CardTitle className="text-white flex items-center gap-2 font-light">
                <ExternalLink className="w-5 h-5 text-cyan-400" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Summary Section */}
              {result.summary && (
                <div className="border border-gray-800 rounded-lg p-5 bg-gray-900/50 backdrop-blur-md">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    Summary
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 text-sm leading-relaxed space-y-1">
                    {result.summary.split('\n').map((line, idx) => (
                      <li key={idx}>{line.trim()}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metadata Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Title</h3>
                    <p className="text-gray-300">{result.title}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {result.description || "No description available"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Category</h3>
                    <div className="flex gap-2">
                      <Badge className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg">
                        {result.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-gray-600/50 text-gray-300 bg-gray-800/30 backdrop-blur-sm"
                      >
                        {result.subcategory}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {result.image && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Preview Image
                      </h3>
                      <img
                        src={result.image || "/placeholder.svg"}
                        alt="Page preview"
                        className="w-full max-w-sm rounded-lg border border-gray-700"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.keywords.length > 0 ? (
                        result.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                            {keyword}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">No keywords extracted</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Extracted At
                    </h3>
                    <p className="text-gray-300 text-sm">{new Date(result.extractedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Metadata Table */}
              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Detailed Information
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <tbody className="text-sm">
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-4 font-medium text-gray-400 w-1/4">URL</td>
                        <td className="py-3 px-4 text-gray-300 break-all">
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            {result.url}
                          </a>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-4 font-medium text-gray-400">Title</td>
                        <td className="py-3 px-4 text-gray-300">{result.title}</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-4 font-medium text-gray-400">Description</td>
                        <td className="py-3 px-4 text-gray-300">{result.description || "N/A"}</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-4 font-medium text-gray-400">Category</td>
                        <td className="py-3 px-4 text-gray-300">{result.category}</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-4 font-medium text-gray-400">Subcategory</td>
                        <td className="py-3 px-4 text-gray-300">{result.subcategory}</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-4 font-medium text-gray-400">Image URL</td>
                        <td className="py-3 px-4 text-gray-300 break-all">{result.image || "N/A"}</td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="py-3 px-4 font-medium text-gray-400">Keywords</td>
                        <td className="py-3 px-4 text-gray-300">{result.keywords.join(", ") || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium text-gray-400">Extracted At</td>
                        <td className="py-3 px-4 text-gray-300">{new Date(result.extractedAt).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Body Content Preview */}
              {result.bodyContent && (
                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Content Preview</h3>
                  <div className="bg-gray-800/50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {result.bodyContent.substring(0, 1000)}
                      {result.bodyContent.length > 1000 && "..."}
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
