import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import CustomTable from "../components/Table";
import ModalForm from "../components/ModalForm";
import {
  Stack,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const Inventory = () => {
  const role = localStorage.getItem("role");
  const [reload, setReload] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  // Modal
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    threshold: "",
  });

  /* ================= FETCH INVENTORY ================= */

  useEffect(() => {
    setLoading(true);

    const ordering =
      sortOrder === "asc" ? sortField : `-${sortField}`;

    apiClient
      .get("inventory/", {
        params: {
          page,
          search: search || undefined,
          ordering,
          low_stock: showLowStock ? "true" : undefined,
        },
      })
      .then((res) => {
        setItems(res.data.results);
        setCount(res.data.count);
        setNext(res.data.next);
        setPrevious(res.data.previous);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, search, sortField, sortOrder, showLowStock,reload]);

  useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 700); // debounce delay

        return () => clearTimeout(timeout);
        }, [searchInput]);

  /* ================= CRUD ================= */

  const handleAddItem = async () => {
    try {
      await apiClient.post("inventory/", {
        name: formData.name,
        quantity: Number(formData.quantity),
        threshold: Number(formData.threshold),
      });

      setOpen(false);
      setReload((r) => !r);
      alert("Item added successfully")
    } catch {
      alert("Failed to add item");
    }
  };

  const handleEditClick = (item) => {
    setEditId(item.id);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      threshold: item.threshold,
    });
    setOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await apiClient.patch(`inventory/${editId}/`, {
        name: formData.name,
        quantity: Number(formData.quantity),
        threshold: Number(formData.threshold),
      });

      setEditId(null);
      setOpen(false);
      setReload((r) => !r);
      alert("Edit item successfully")
    } catch {
      alert("Failed to update item");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await apiClient.delete(`inventory/${id}/`);
    // If this was the last item on the page
    if (items.length === 1 && page > 1) {
        setPage(page - 1);      // move to previous page
    } else {
        setReload((r) => !r);  // just refetch current page
    }
    alert(" Asset deleted Successfully")
    } catch {
      alert("Failed to delete item");
    }
  };

  if (loading) return <p>Loading inventory...</p>;

  return (
    <div>
      <h2>Inventory</h2>

      {/* ===== TOP CONTROLS ===== */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search inventory..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            setPage(1);
          }}
          sx={{ width: 250 }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            label="Sort by"
            value={sortField}
            onChange={(e) => {
              setSortField(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="quantity">Quantity</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          {sortOrder === "asc" ? "Asc ↑" : "Desc ↓"}
        </Button>

        {role === "ADMIN" && (
          <Button
            variant="contained"
            onClick={() => {
              setEditId(null);
              setFormData({ name: "", quantity: "", threshold: "" });
              setOpen(true);
            }}
          >
            Add Item
          </Button>
        )}

        <Button
          variant="contained"
          color={showLowStock ? "primary" : "error"}
          onClick={() => {
            setShowLowStock((prev) => !prev);
            setPage(1);
          }}
        >
          {showLowStock ? "Show All" : "Show Low Stock Only"}
        </Button>
      </Stack>

      {/* ===== TABLE ===== */}
      <CustomTable
        columns={["Name", "Quantity", "Threshold", "Status", "Actions"]}
        data={items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          threshold: item.threshold,
          status:
            item.quantity < item.threshold ? (
              <span style={{ color: "red", fontWeight: "bold" }}>
                Low Stock
              </span>
            ) : (
              "Ok"
            ),
          actions:
            role === "ADMIN" ? (
              <>
                <Button
                  size="small"
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </>
            ) : (
              "—"
            ),
        }))}
      />

      {/* ===== PAGINATION ===== */}
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

      {/* ===== MODAL ===== */}
      <ModalForm
        open={open}
        title={editId ? "Edit Inventory Item" : "Add Inventory Item"}
        onClose={() => setOpen(false)}
        onSubmit={editId ? handleSaveEdit : handleAddItem}
      >
        <TextField
          label="Item Name"
          fullWidth
          sx={{ mb: 2 }}
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
        />
        <TextField
          label="Quantity"
          type="number"
          fullWidth
          sx={{ mb: 2 }}
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
        />
        <TextField
          label="Threshold"
          type="number"
          fullWidth
          value={formData.threshold}
          onChange={(e) =>
            setFormData({ ...formData, threshold: e.target.value })
          }
        />
      </ModalForm>
    </div>
  );
};

export default Inventory;
