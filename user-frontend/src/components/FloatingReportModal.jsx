import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, Video, X, RefreshCcw } from "lucide-react";


// Simple in-app store to pass extracted report to ReportPage
const reportBus = {
  data: null,
  set(d) {
    this.data = d;
  },
  get() {
    return this.data;
  },
};
export { reportBus };

const API_BASE = import.meta.env.VITE_API_BASE;

const FloatingReportModal = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const [capturedVideos, setCapturedVideos] = useState([]);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewType, setPreviewType] = useState(""); // 'image' or 'video'
  const [previewIndex, setPreviewIndex] = useState(0);

  const [submitting, setSubmitting] = useState(false);

  // ---- Camera Controls ----
  const startCamera = async () => {
    setLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      alert("Camera access denied or unavailable");
    }
    setLoading(false);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // ---- Capture ----
  const capturePhoto = () => {
    if (recording || !videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const imageURL = URL.createObjectURL(blob);
      // Store both preview URL + blob for upload
      setCapturedImages((prev) => [...prev, { url: imageURL, blob }]);
    }, "image/jpeg", 0.92);
  };

  const startRecording = () => {
    if (capturedImages.length > 0 || !stream) return;
    setRecording(true);

    const chunks = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: "video/webm" });
      const videoURL = URL.createObjectURL(videoBlob);
      setCapturedVideos((prev) => [...prev, { url: videoURL, blob: videoBlob }]);
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const resetMedia = () => {
    setCapturedImages([]);
    setCapturedVideos([]);
    stopCamera();
    startCamera();
  };

  // ---- Backend Integration ----
  const finishAndNavigateWith = (payload, localPreviewUrl = null) => {
  const reportObj = {
    title: payload.issue_title || payload.title || "",
    description: payload.detailed_description || payload.description || "",
    category: payload.issue_category || payload.category || "Other",
    priority: payload.priority || "medium",
    mediaUrl: payload.media_url || "", // backend media url (if any)
    mediaKind: payload.mediaKind || payload.kind || "image",
    mediaPreviewUrl: localPreviewUrl,  // NEW → frontend photo/video preview
  };

  reportBus.set(reportObj);

  try {
    sessionStorage.setItem("reportData", JSON.stringify(reportObj));
  } catch (e) {
    console.warn("Could not save reportData to sessionStorage:", e);
  }

  setSubmitting(false);
  setIsOpen(false);
  stopCamera();

  navigate("/report", { state: { reportData: reportObj } });
};


  const uploadToBackend = async (file, kind, localPreviewUrl) => {
  const fd = new FormData();
  fd.append("file", file, kind === "image" ? "capture.jpg" : "capture.webm");
  fd.append("kind", kind);
  setSubmitting(true);
  try {
    const res = await fetch(`${API_BASE}/process`, { method: "POST", body: fd });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    const data = await res.json();
    finishAndNavigateWith(data, localPreviewUrl);
  } catch (e) {
    console.error(e);
    alert("Failed to analyze media.");
    setSubmitting(false);
    setIsOpen(false);
    stopCamera();
  }
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (recording) return;

  if (capturedImages.length > 0) {
    const { blob, url } = capturedImages[0];
    await uploadToBackend(blob, "image", url);
  } else if (capturedVideos.length > 0) {
    const { blob, url } = capturedVideos[0];
    await uploadToBackend(blob, "video", url);
  } else {
    alert("Capture a photo or record a video first.");
  }
};


  // ---- Modal Handlers ----
  const openModal = () => {
    setIsOpen(true);
    startCamera();
  };

  const closeModal = () => {
    setIsOpen(false);
    resetMedia();
  };

  const openPreview = (type, index) => {
    setPreviewType(type);
    setPreviewIndex(index);
    setPreviewOpen(true);
  };

  // ---- UI ----
  return (
    <>
      <Button
        size="lg"
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full btn-civic shadow-float z-40 border-2"
        aria-label="Quick Civic Report"
        onClick={openModal}
      >
        <Camera className="w-6 h-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50" role="dialog" aria-modal="true">
          <div className="bg-gradient-to-b from-zinc-900 via-gray-900 to-neutral-900 rounded-3xl shadow-2xl w-full max-w-lg p-6 md:p-10 relative border border-zinc-700/70" style={{ color: "#fff" }}>
            <button className="absolute top-4 right-4 text-gray-200 hover:text-gray-400" onClick={closeModal} aria-label="Close">
              <X className="w-7 h-7" />
            </button>

            <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-center">Civic Report: Capture Photo or Video</h2>
            <p className="text-gray-300 text-base mb-4 text-center">Capture multiple pieces of evidence and submit your incident report.</p>

            <div className="mb-4 relative">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg z-10">
                  <span className="text-lg text-gray-300">Loading camera...</span>
                </div>
              )}
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-44 md:h-60 rounded-lg border border-zinc-800 bg-black object-cover" aria-label="Live camera preview" />
            </div>

            <div className="flex gap-2 md:gap-4 mb-2 md:mb-4 justify-center">
              <Button onClick={capturePhoto} disabled={recording || !stream || loading} className="bg-primary text-white">
                <Camera className="mr-1 w-5 h-5" /> Capture Photo
              </Button>
              {recording ? (
                <Button onClick={stopRecording} className="bg-destructive text-white">
                  <Video className="mr-1 w-5 h-5" /> Stop Recording
                </Button>
              ) : (
                <Button onClick={startRecording} disabled={capturedImages.length > 0 || !stream || loading} className="bg-secondary text-white">
                  <Video className="mr-1 w-5 h-5" /> Start Recording
                </Button>
              )}
              <Button variant="ghost" onClick={resetMedia} className="text-gray-400" aria-label="Restart Camera">
                <RefreshCcw className="mr-1 w-5 h-5" /> Restart
              </Button>
            </div>

            {(capturedImages.length > 0 || capturedVideos.length > 0) && (
              <div className="mb-4">
                <ul className="list-disc list-inside space-y-2 text-white">
                  {capturedImages.map((img, idx) => (
                    <li key={`img-${idx}`}>
                      <button className="text-primary underline text-sm" onClick={() => openPreview("image", idx)}>
                        Image {idx + 1} (Tap to Preview)
                      </button>
                    </li>
                  ))}
                  {capturedVideos.map((vid, idx) => (
                    <li key={`vid-${idx}`}>
                      <button className="text-primary underline text-sm" onClick={() => openPreview("video", idx)}>
                        Video {idx + 1} (Tap to Preview)
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {previewOpen && (
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-60 p-4">
                <div className="relative bg-gray-900 rounded-lg p-4 max-w-lg w-full">
                  <button className="absolute top-2 right-2 text-gray-200 hover:text-gray-400" onClick={() => setPreviewOpen(false)} aria-label="Close Preview">
                    <X className="w-6 h-6" />
                  </button>
                  {previewType === "image" ? (
                    <img src={capturedImages[previewIndex].url} alt={`Preview ${previewIndex + 1}`} className="w-full h-auto rounded-lg" />
                  ) : (
                    <video controls src={capturedVideos[previewIndex].url} className="w-full h-auto rounded-lg" />
                  )}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 mb-2 text-center italic">
              {!capturedImages.length && !capturedVideos.length
                ? stream
                  ? "Tip: Hold device steady for best results."
                  : "Waiting for camera access. Grant permission above."
                : null}
            </div>

            <Button type="submit" className="w-full mt-2 bg-primary text-white font-semibold" disabled={(!capturedImages.length && !capturedVideos.length) || submitting} onClick={handleSubmit}>
              {submitting ? "Analyzing..." : "Submit Report"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingReportModal;
