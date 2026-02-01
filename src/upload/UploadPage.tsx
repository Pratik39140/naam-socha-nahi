import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  CircularProgress,
} from "@mui/material";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageRanges, setPageRanges] = useState("");
  const [colorMode, setColorMode] = useState<"bw" | "color">("bw");

  // NEW STATE
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setFileName(selected ? selected.name : "");
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

    const jwt = localStorage.getItem("jwt");

    try {
      const res = await fetch("http://10.92.74.104:3000/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      setUploadSuccess(true);
    } catch (err: any) {
      console.error("Upload failed:", err);
      setUploadSuccess(false);
      setErrorMessage(err.message || "Something went wrong during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const disabled = !file || !pageRanges.trim() || isUploading;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ px: 2 }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 2,
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upload Document
          </Typography>

          {/* SUCCESS / ERROR FEEDBACK */}
          {uploadSuccess === true && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Upload successful. Proceed to payment.
            </Alert>
          )}

          {uploadSuccess === false && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage || "Upload failed"}
            </Alert>
          )}

          <Button variant="contained" component="label" fullWidth disabled={isUploading}>
            Choose File
            <input
              type="file"
              hidden
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </Button>

          {fileName && (
            <Typography variant="body2" sx={{ mt: 1, color: "text.secondary" }}>
              Selected: {fileName}
            </Typography>
          )}

          <TextField
            fullWidth
            label="Page Ranges"
            margin="normal"
            placeholder="e.g. 1-3,5,10-12"
            value={pageRanges}
            onChange={(e) => setPageRanges(e.target.value)}
            required
            disabled={isUploading}
          />

          <FormControl fullWidth sx={{ mt: 2 }} disabled={isUploading}>
            <InputLabel>Color Mode</InputLabel>
            <Select
              value={colorMode}
              label="Color Mode"
              onChange={(e) => setColorMode(e.target.value as "bw" | "color")}
            >
              <MenuItem value="bw">Black & White</MenuItem>
              <MenuItem value="color">Color</MenuItem>
            </Select>
          </FormControl>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={disabled}
            onClick={handleUpload}
          >
            {isUploading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UploadPage;
