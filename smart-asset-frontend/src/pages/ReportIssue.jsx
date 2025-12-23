import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Stack,
} from "@mui/material";

const ReportIssue = () => {
  const [assets, setAssets] = useState([]);
  const [asset, setAsset] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);

  /* ===== FETCH ASSIGNED ASSETS ===== */
  useEffect(() => {
    apiClient
      .get("my-assets/")
      .then((res) => {
        setAssets(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load assigned assets");
        setLoading(false);
      });
  }, [reload]);

  /* ===== SUBMIT ISSUE ===== */
  const handleSubmit = async () => {
    if (!asset || !issue.trim()) {
      alert("Please select an asset and describe the issue");
      return;
    }

    try {
      await apiClient.post("tickets/", {
        asset,
        issue_description: issue,
      });

      alert("Issue reported successfully");
      setAsset("");
      setIssue("");
      setReload((r) => !r);
    } catch (err) {
      alert("Failed to report issue");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 6,
      }}
    >
      <Card sx={{ width: 420 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={1}>
            Report an Issue
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
          >
            Report a problem with your assigned asset
          </Typography>

          <Stack spacing={2}>
            {/* Asset Dropdown */}
            <TextField
              select
              label="Select Asset"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              fullWidth
              required
            >
              {assets.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Issue Description */}
            <TextField
              label="Issue Description"
              multiline
              rows={4}
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              fullWidth
              required
            />

            {/* Actions */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => {
                  setAsset("");
                  setIssue("");
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                onClick={handleSubmit}
              >
                Submit Issue
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportIssue;
