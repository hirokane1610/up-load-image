import React, { useState, useRef } from 'react';
import { Input } from './components/Input';
import { Button } from './components/Button';
import { Card, CardContent, CardHeader, CardTitle } from './components/Card';

// モックアップの文字起こしと論点抽出の関数
const mockTranscribeAndAnalyze = (audioBlob: Blob): Promise<{ transcription: string, points: string[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transcription: "こんにちは。今日の会議では新製品の開発について話し合います。まず、市場調査の結果を共有しましょう。次に、製品の特徴について議論します。最後に、開発スケジュールを決定します。",
        points: ["市場調査の結果", "製品の特徴", "開発スケジュール"]
      });
    }, 2000);
  });
};

type Conversation = {
  speaker: string;
  text: string;
  point: string;
};

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [points, setPoints] = useState<string[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid video file.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    
    // 動画をビデオ要素にセット
    if (videoRef.current) {
      videoRef.current.src = URL.createObjectURL(file);
    }

    try {
      // 音声抽出（実際にはサーバーサイドで行う処理）
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await file.arrayBuffer();
      const audioSource = await audioContext.decodeAudioData(audioBuffer);
      
      // 音声データをBlobに変換（簡略化）
      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });

      // 文字起こしと論点抽出（モックアップ）
      const { transcription, points } = await mockTranscribeAndAnalyze(audioBlob);
      setTranscription(transcription);
      setPoints(points);

      // 会話形式に変換（簡略化）
      const conversations: Conversation[] = transcription.split('。').map((sentence, index) => ({
        speaker: index % 2 === 0 ? 'Speaker A' : 'Speaker B',
        text: sentence.trim(),
        point: points[Math.floor(index / 2) % points.length]
      })).filter(conv => conv.text !== '');

      setConversations(conversations);
    } catch (error) {
      console.error('Error processing video:', error);
      alert('Error processing video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Video Transcription App</h1>
      
      <div className="mb-4">
        <Input type="file" onChange={handleFileChange} accept="video/*" />
      </div>
      
      <Button onClick={handleUpload} disabled={!file || loading}>
        {loading ? 'Processing...' : 'Upload and Process'}
      </Button>

      {file && (
        <div className="mt-4">
          <video ref={videoRef} controls width="100%" height="auto" />
        </div>
      )}

      {transcription && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Transcription</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{transcription}</p>
          </CardContent>
        </Card>
      )}

      {points.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Discussion Points</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {conversations.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            {conversations.map((conv, index) => (
              <div key={index} className="mb-2">
                <strong>{conv.speaker}</strong> ({conv.point}): {conv.text}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default App;