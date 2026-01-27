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
} from "@mui/material";

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [pageRanges, setPageRanges] = useState("");
  const [colorMode, setColorMode] = useState<"bw" | "color">("bw");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setFileName(selected ? selected.name : "");
  };

  const handleUpload = async () => {
    if (!file || !pageRanges.trim()) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("pageRanges", pageRanges);
    formData.append("colorMode", colorMode);

    const jwt = localStorage.getItem("jwt"); // or however you store it

    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: formData,
      });

      const data = await res.json();
      console.log("Upload response:", data);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };


  const disabled = !file || !pageRanges.trim();

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

          <Button variant="contained" component="label" fullWidth>
            Choose File
            <input
              type="file"
              hidden
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </Button>

          {fileName && (
            <Typography
              variant="body2"
              sx={{ mt: 1, color: "text.secondary" }}
            >
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
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
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
            Upload
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UploadPage;
