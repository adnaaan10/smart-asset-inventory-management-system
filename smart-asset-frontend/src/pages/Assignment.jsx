import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import CustomTable from "../components/Table";
import ModalForm from "../components/ModalForm";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { getMe } from "../api/auth";


const Assignments = () => {

  const [assignments, setAssignments] = useState([]);
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);


  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  // Search & Sort
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortField, setSortField] = useState("date_assigned");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modal + Form
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    asset: "",
    user: "",
  });

  useEffect(() => {
    getMe().then(setCurrentUser);
  }, []);


  useEffect(() => {
    setLoading(true);

    const ordering =
      sortOrder === "asc" ? sortField : `-${sortField}`;

    apiClient
      .get("assignments/", {
        params: {
          page,
          search: search || undefined,
          ordering,
        },
      })
      .then((res) => {
        setAssignments(res.data.results);
        setCount(res.data.count);
        setNext(res.data.next);
        setPrevious(res.data.previous);
        setLoading(false);
        setError(null);
      })
      .catch(() => {
        setError("Failed to load assignments");
        setLoading(false);
      });
  }, [page, search, sortField, sortOrder, reload]);


  useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 700); // debounce delay

        return () => clearTimeout(timeout);
        }, [searchInput]);


  useEffect(() => {
    // Load only AVAILABLE assets
    apiClient
      .get("assets/", { params: { status: "AVAILABLE" } })
      .then((res) => setAssets(res.data.results))
      .catch(() => console.log("Failed to load assets"));

    // Load users
    apiClient
      .get("accounts/users/assignable/")
      .then((res) => setUsers(res.data))
      .catch(() => console.log("Failed to load users"));
  }, []);

  /* ================= HANDLERS ================= */

  const handleOpen = () => {
    setFormData({ asset: "", user: "" });
    setOpen(true);
  };

  const handleAssign = async () => {
    if (!formData.asset || !formData.user) return;

    try {
      await apiClient.post("assignments/", {
        asset: formData.asset,
        user: formData.user,
      });

      setOpen(false);
      setPage(1);
      setReload((r) => !r);
    } catch (err) {
      alert(
        err.response?.data?.asset ||
        "Failed to assign asset"
      );
    }
  };

  const handleReturn = async (id) => {
    try {
      await apiClient.post(`assignments/${id}/return_asset/`);
      setReload((r) => !r);
    } catch {
      alert("Failed to return asset");
    }
  };


  if (loading) return <p>Loading assignments...</p>;
  if (error) return <p>{error}</p>;


  return (
    <div>
      <h2>Assignments</h2>

      {/* Top Controls  */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search assignments..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1);
          }}
          sx={{ width: 250 }}
        />

        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            label="Sort by"
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="asset__name">Asset</MenuItem>
            <MenuItem value="user__username">User</MenuItem>
            <MenuItem value="status">Status</MenuItem>
            <MenuItem value="date_assigned">Assigned Date</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={() =>
            setSortOrder((prev) =>
              prev === "asc" ? "desc" : "asc"
            )
          }
        >
          {sortOrder === "asc" ? "Asc ↑" : "Desc ↓"}
        </Button>

        {currentUser?.role === "ADMIN" && (
          <Button variant="contained" onClick={handleOpen}>
            Assign Asset
          </Button>
        )}
      </Stack>

      {/* Assignments Table*/}
      <CustomTable
        columns={[
          "Asset",
          "User",
          "Status",
          "Assigned Date",
          "Actions",
        ]}
        data={assignments.map((a) => ({
          asset: a.asset_name,
          user: a.user_username,
          status: a.status,
          date_assigned: new Date(a.date_assigned).toLocaleString(),
          actions:
            currentUser?.role === "ADMIN" && a.status === "ACTIVE" ? (
              <Button
                size="small"
                color="error"
                onClick={() => handleReturn(a.id)}
              >
                Return
              </Button>
            ) : (
              "—"
            ),
        }))}
      />

      {/*Assign Modal*/}
      {currentUser?.role === "ADMIN" && (
        <ModalForm
          open={open}
          title="Assign Asset"
          onClose={() => setOpen(false)}
          onSubmit={handleAssign}
        >
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Asset</InputLabel>
            <Select
              label="Asset"
              value={formData.asset}
              onChange={(e) =>
                setFormData({ ...formData, asset: e.target.value })
              }
            >
              {assets.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>User</InputLabel>
            <Select
              label="User"
              value={formData.user}
              onChange={(e) =>
                setFormData({ ...formData, user: e.target.value })
              }
            >
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ModalForm>
      )}
      {/* Pagination */}
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setPage(page - 1)}
          disabled={!previous}
        >
          Previous
        </Button>

        <span>
          Page {page} of {Math.ceil(count / PAGE_SIZE)}
        </span>

        <Button
          variant="outlined"
          onClick={() => setPage(page + 1)}
          disabled={!next}
        >
          Next
        </Button>
      </Stack>
    </div>
  );
};

export default Assignments;
