'use client';

import { useState } from 'react';

interface DownloadButtonProps {
  patternId: string;
}

export default function DownloadButton({ patternId }: DownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setDownloading(true);
    setError('');

    try {
      const response = await fetch(`/api/download/${patternId}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to download');
      }

      const { url, fileName } = await response.json();

      // Fetch the file from the signed URL
      const fileResponse = await fetch(url);
      if (!fileResponse.ok) {
        throw new Error('Failed to fetch file');
      }

      // Create blob URL and trigger download
      const blob = await fileResponse.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up blob URL
      URL.revokeObjectURL(blobUrl);

      setDownloading(false);
    } catch (err: any) {
      console.error('Download error:', err);
      setError(err.message || 'Download failed');
      setDownloading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {downloading ? 'Downloading...' : 'Download Pattern'}
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
