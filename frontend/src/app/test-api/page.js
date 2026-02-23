"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TestApiPage() {
    const [status, setStatus] = useState("Testing...");
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function testApi() {
            try {
                const result = await api.get("/health");
                setData(result);
                setStatus("Success!");
            } catch (err) {
                setError(err.message);
                setStatus("Error caught correctly.");
            }
        }
        testApi();
    }, []);

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">API Utility Test</h1>
            <p>Status: <span className="font-mono bg-surface p-1 rounded">{status}</span></p>

            {data && (
                <div className="bg-green-900/20 border border-green-500 p-4 rounded-lg">
                    <p className="text-green-500 font-bold">Data received:</p>
                    <pre className="mt-2 text-sm">{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}

            {error && (
                <div className="bg-red-900/20 border border-red-500 p-4 rounded-lg">
                    <p className="text-red-500 font-bold">Error caught:</p>
                    <p className="mt-2 text-sm">{error}</p>
                </div>
            )}

            <div className="text-sm text-textMuted pt-4 border-t border-border">
                Check the browser console and network tab for more details.
            </div>
        </div>
    );
}
