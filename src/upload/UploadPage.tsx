import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Select, MenuItem, InputLabel,
  FormControl, Alert, CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageRanges, setPageRanges] = useState("");
  const [colorMode, setColorMode] = useState<"bw" | "color">("bw");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileSelect = (selected: File | null) => {
    setFile(selected);
    setFileName(selected ? selected.name : "");
    setUploadSuccess(null);
    setErrorMessage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files?.[0] || null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0] || null;
    handleFileSelect(dropped);
  };

  const handleUpload = async () => {
    if (!file || !pageRanges.trim()) return;

    setIsUploading(true);
    setUploadSuccess(null);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("pageRanges", pageRanges);
    formData.append("colorMode", colorMode);

    const username = localStorage.getItem("username") || "guest";
    formData.append("username", username);
    formData.append("fileName", file.name);
    const jwt = localStorage.getItem("jwt");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${jwt}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");
      setUploadSuccess(true);
      setTimeout(() => navigate("/main/queue"), 1500);
    } catch (err: any) {
      setUploadSuccess(false);
      setErrorMessage(err.message || "Something went wrong during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const disabled = !file || !pageRanges.trim() || isUploading;

  return (
    <Box display="flex" justifyContent="center" alignItems="flex-start"
      sx={{ px: 2, pt: 4, pb: 4, minHeight: "100%", position: "relative", zIndex: 1 }}>
      <Box sx={{ width: "100%", maxWidth: 420 }}>

        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: "#f1f5f9", mb: 0.5 }}>
            Upload Document
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
            PDF · DOCX · JPG · PNG
          </Typography>
        </Box>

        {/* Feedback */}
        {uploadSuccess === true && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Upload successful — redirecting to queue...
          </Alert>
        )}
        {uploadSuccess === false && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage || "Upload failed"}
          </Alert>
        )}

        <Card>
          <CardContent sx={{ p: "24px !important" }}>

            {/* Drop Zone */}
            <Box
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              sx={{
                border: `2px dashed ${dragging ? "#3b82f6" : file ? "#22c55e" : "#1e2d47"}`,
                borderRadius: 2,
                p: "28px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                background: dragging ? "#3b82f610" : file ? "#22c55e08" : "transparent",
                transition: "all 0.2s ease",
                mb: 3,
                "&:hover": {
                  borderColor: file ? "#22c55e" : "#334155",
                  background: file ? "#22c55e08" : "#ffffff05",
                },
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                hidden
                accept=".pdf,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />

              {file ? (
                <>
                  <InsertDriveFileIcon sx={{ fontSize: 40, color: "#22c55e" }} />
                  <Typography sx={{ fontWeight: 600, color: "#22c55e", fontSize: 14, textAlign: "center" }}>
                    {fileName}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#475569" }}>
                    {(file.size / 1024).toFixed(1)} KB · tap to change
                  </Typography>
                </>
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize: 40, color: "#334155" }} />
                  <Typography sx={{ fontWeight: 500, color: "#64748b", fontSize: 14 }}>
                    Tap to browse or drag & drop
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#334155" }}>
                    Max 50 MB
                  </Typography>
                </>
              )}
            </Box>

            {/* Page Ranges */}
            <TextField
              fullWidth
              label="Page Ranges"
              placeholder="e.g. 1-3, 5, 10-12 or all"
              value={pageRanges}
              onChange={(e) => setPageRanges(e.target.value)}
              required
              disabled={isUploading}
              sx={{ mb: 2 }}
            />

            {/* Color Mode */}
            <FormControl fullWidth disabled={isUploading}>
              <InputLabel>Color Mode</InputLabel>
              <Select
                value={colorMode}
                label="Color Mode"
                onChange={(e) => setColorMode(e.target.value as "bw" | "color")}
                MenuProps={{
                  PaperProps: {
                    sx: { background: "#111827", border: "1px solid #1e2d47" },
                  },
                }}
              >
                <MenuItem value="bw">Black &amp; White</MenuItem>
                <MenuItem value="color">Color</MenuItem>
              </Select>
            </FormControl>

            {/* Submit */}
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, py: 1.3 }}
              disabled={disabled}
              onClick={handleUpload}
            >
              {isUploading ? (
                <><CircularProgress size={18} sx={{ mr: 1.5, color: "#fff" }} /> Uploading...</>
              ) : (
                "Upload & Continue →"
              )}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default UploadPage;
