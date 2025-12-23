import { useEffect, useState } from "react";
import CustomTable from "../components/Table";
import ModalForm from "../components/ModalForm";
import { Tabs, Tab } from "@mui/material";
import {
  Button,
  TextField,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { getMe } from "../api/auth";
import {
  getTickets,
  assignTechnician,
  updateTicketStatus,
} from "../api/tickets";
import apiClient from "../api/apiClient";

const Tickets = () => {
  /* ================= STATE ================= */

  const [tickets, setTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);

  const [tab, setTab] = useState("ACTIVE"); // ACTIVE | HISTORY

  // Search / Sort
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortField, setSortField] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  // Assign Technician Modal
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  
  // Navigate
  const navigate = useNavigate();


  /* FETCH USER  */

  useEffect(() => {
    getMe().then(setCurrentUser);
  }, []);

  /* FETCH TICKETS  */

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);

    const ordering =
      sortOrder === "asc" ? sortField : `-${sortField}`;


    const params = {
      page,
      search: search || undefined,
      ordering,
    };

    // ADMIN HISTORY MODE
    if (currentUser?.role === "ADMIN" && tab === "HISTORY") {
      params.all = true;
    }
    
    getTickets(params)
    .then((res) => {
      setTickets(res.data.results);
      setCount(res.data.count);
      setNext(res.data.next);
      setPrevious(res.data.previous);
      setLoading(false);
    })
    .catch(() => {
      setError("Failed to load tickets");
      setLoading(false);
    });
  }, [page, search, sortField, sortOrder, reload,tab,currentUser]);

  useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 700); // debounce delay

        return () => clearTimeout(timeout);
        }, [searchInput]);


  /* FETCH TECHNICIANS (ADMIN) */

  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      apiClient.get("accounts/users/").then((res) => {
        const techs = res.data.filter(
          (u) => u.role === "TECHNICIAN"
        );
        setTechnicians(techs);
      });
    }
  }, [currentUser]);


  /* ACTIONS  */


  // Assign technician (ADMIN)
  const handleAssignTechnician = async () => {
    if (!selectedTechnician) return;

    try {
      await assignTechnician(
        selectedTicket.id,
        selectedTechnician
      );
      setAssignOpen(false);
      setSelectedTechnician("");
      setReload((r) => !r);
    } catch {
      alert("Failed to assign technician");
    }
  };

  // Update status (TECHNICIAN)
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateTicketStatus(id, status);
      setReload((r) => !r);
    } catch {
      alert("Failed to update status");
    }
  };

  // Date formatting helper
  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString();
  };

  // status color
  const statusStyle = (status) => {
    if (status === "OPEN") return { color: "red", fontWeight: "bold" };
    if (status === "IN_PROGRESS") return { color: "orange" };
    if (status === "RESOLVED") return { color: "green" };
  };
  /*  RENDER  */

  if (loading) return <p>Loading tickets...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Repair Tickets</h2>

      {/* TOP CONTROLS */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search issue..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          sx={{ width: 250 }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            value={sortField}
            label="Sort by"
            onChange={(e) => setSortField(e.target.value)}
          >
            <MenuItem value="created_at">Created</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={() =>
            setSortOrder((p) => (p === "asc" ? "desc" : "asc"))
          }
        >
          {sortOrder === "asc" ? "Asc ↑" : "Desc ↓"}
        </Button>

        {currentUser?.role === "EMPLOYEE" && (
          <Button
            variant="contained"
            onClick={() => navigate("/report-issue")}
          >
            Raise Ticket
          </Button>
        )}

        {currentUser?.role === "ADMIN" && (
          <Tabs
            value={tab}
            onChange={(e, val) => {
              setTab(val);
              setPage(1);
            }}
            sx={{ mb: 2 }}
          >
            <Tab label="Active Tickets" value="ACTIVE" />
            <Tab label="History" value="HISTORY" />
          </Tabs>
        )}
      </Stack>

      {/* TABLE */}
      <CustomTable
        columns={[
          "Asset",
          "Reported By",
          "Issue",
          "Status",
          "Technician",
          "Opened On",
          "Assigned On",
          "Resolved On",
          "Actions",
        ]}
        data={tickets.map((t) => ({
          asset: t.asset_name,
          reported_by: t.reported_by_username,
          issue: t.issue_description,
          status: <span style={statusStyle(t.status)}>{t.status}</span>,
          technician: t.technician_username || "—",
          opened_on: formatDate(t.created_at),
          assigned_on: formatDate(t.assigned_at),
          resolved_on: formatDate(t.resolved_at),
          actions: (
            <>
              {currentUser?.role === "ADMIN" &&
                tab === "ACTIVE" &&
                !t.assigned_technician && (
                  <Button
                    size="small"
                    onClick={() => {
                      setSelectedTicket(t);
                      setAssignOpen(true);
                    }}
                  >
                    Assign
                  </Button>
              )}


              {currentUser?.role === "TECHNICIAN" && t.status !== "RESOLVED" && (
                <>
                  <Button
                    size="small"
                    onClick={() =>
                      handleStatusUpdate(t.id, "IN_PROGRESS")
                    }
                  >
                    In Progress
                  </Button>
                  <Button
                    size="small"
                    color="success"
                    onClick={() =>
                      handleStatusUpdate(t.id, "RESOLVED")
                    }
                  >
                    Resolve
                  </Button>
                </>
              )}

            </>
          ),
        }))}
      />



      {/* PAGINATION */}
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

     
      {/* ASSIGN TECHNICIAN MODAL */}
      <ModalForm
        open={assignOpen}
        title="Assign Technician"
        onClose={() => setAssignOpen(false)}
        onSubmit={handleAssignTechnician}
      >
        <FormControl fullWidth>
          <InputLabel>Technician</InputLabel>
          <Select
            value={selectedTechnician}
            label="Technician"
            onChange={(e) => setSelectedTechnician(e.target.value)}
          >
            {technicians.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {t.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ModalForm>
    </div>
  );
};

export default Tickets;
