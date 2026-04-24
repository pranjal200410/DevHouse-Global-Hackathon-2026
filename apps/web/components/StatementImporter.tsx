"use client";

import { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";

interface ImportResult {
  source: string;
  importedCount: number;
  detections: Array<{
    merchant: string;
    amount: number;
    confidence: number;
  }>;
  totalNewSubscriptions: number;
}

export function StatementImporter() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const importCSV = async (csvContent: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/integrations/statement/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to import statement");
      }

      const { data } = await response.json();
      setResult(data as ImportResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import statement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please select a CSV file");
      return;
    }

    const content = await file.text();
    await importCSV(content);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.45)]">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-slate-100">Import Bank Statement</h3>
        </div>

        {!result && (
          <>
            <p className="text-sm text-slate-400">
              Upload your credit card or bank statement (CSV) to discover hidden subscriptions
            </p>

            <div className="space-y-3">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-slate-600 bg-slate-900/40 hover:border-slate-500"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-100">Drag and drop your CSV</p>
                    <p className="text-sm text-slate-400">or click to browse</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 text-emerald-400 hover:text-emerald-300 font-medium text-sm"
                >
                  Select File
                </button>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                <p className="text-xs text-slate-300">
                  <strong className="text-emerald-300">CSV Format:</strong> Date, Description, Amount (one transaction per line)
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Example: 2026-03-15, Netflix Subscription, 15.99
                </p>
              </div>
            </div>
          </>
        )}

        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-6">
            <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
            <p className="text-slate-300">Analyzing statement...</p>
          </div>
        )}

        {error && (
          <div className="flex gap-2 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-rose-300">Import Error</p>
              <p className="text-sm text-rose-200">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-emerald-100">
                  Found {result.totalNewSubscriptions} subscriptions
                </p>
                <p className="text-sm text-emerald-200">
                  {result.importedCount} new subscriptions imported
                </p>
              </div>
            </div>

            {result.detections && result.detections.length > 0 && (
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h4 className="font-medium text-slate-100 mb-3">Detected Subscriptions</h4>
                <div className="space-y-2">
                  {result.detections.map((detection, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-slate-900/60 p-3 rounded-lg border border-slate-700/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-100">{detection.merchant}</p>
                        <p className="text-sm text-slate-400">
                          ${detection.amount.toFixed(2)}/month
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Confidence</p>
                        <p className="font-semibold text-slate-100">
                          {Math.round(detection.confidence * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setResult(null);
                  setError(null);
                }}
                variant="secondary"
                className="flex-1"
              >
                Import Another Statement
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
