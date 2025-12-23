import apiClient from "../api/apiClient";
import { useEffect, useState } from "react";
import CustomTable from "../components/Table";
import ModalForm from "../components/ModalForm";
import { Button,TextField,FormControl,InputLabel,Select,MenuItem,Stack } from "@mui/material";


const Assets = () =>{

    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reload, setReload] = useState(false);
    const [viewOnly, setViewOnly] = useState(false);

    // Modal state
    const[open,setOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    const isAdd = !editId && !viewOnly;




    const [page, setPage] = useState(1); // backend pages start at 1
    const PAGE_SIZE = 5;
    const [search,setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");

    
    // Sorting state
    const[sortField,setSortField] = useState("name"); // name | type | status
    const[sortOrder,setSortOrder] = useState("asc"); // asc | desc
    
    const [count, setCount] = useState(0);
    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);


    const [formData,setFormData] = useState({
        name:"",
        type:"",
        serial_number:"",
        purchase_date: "",
        warranty_expiry: "",
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 700); // debounce delay

        return () => clearTimeout(timeout);
        }, [searchInput]);


   

    useEffect(() => {
        setLoading(true);

        const ordering = sortOrder === "asc" ? sortField : `-${sortField}`;

        apiClient
            .get("assets/",{
                params: {
                    page: page,
                    search: search || undefined,
                    ordering: ordering,
                },
            })
            .then((res) => {
            setAssets(res.data.results); // DRF pagination
            setCount(res.data.count);
            setNext(res.data.next);
            setPrevious(res.data.previous);
            setLoading(false);
            setError(null);
            })
            .catch(() => {
            setError("Failed to load assets");
            setLoading(false);
            });
        }, [page,search, sortField, sortOrder,reload]);


    


    // Add new asset
    const handleAddAsset = async () => {
        try {
            const payload = {
            name: formData.name,
            type: formData.type,
            serial_number: formData.serial_number,
            purchase_date: formData.purchase_date || null,
            warranty_expiry: formData.warranty_expiry || null,
            };

            await apiClient.post("assets/", payload);

            setFormData({
            name: "",
            type: "",
            serial_number: "",
            purchase_date: "",
            warranty_expiry: "",
            });

            setOpen(false);
            setPage(1);
            alert("Asset added successfully")
        } catch (error) {
            console.error("CREATE ASSET ERROR:", error.response?.data);
            alert("Failed to create asset");
        }
    };

    // Edit Asset
    const handleEditClick = (asset) => {
        setEditId(asset.id);
        setFormData({
            name: asset.name,
            type: asset.type,
            serial_number: asset.serial_number,
            purchase_date: asset.purchase_date,
            warranty_expiry: asset.warranty_expiry,
            
        });
        setViewOnly(false);
        setOpen(true);
    };


    // Save edited asset
    const handleSaveEdit = async () => {
        try {
            await apiClient.patch(`assets/${editId}/`, formData);

            setReload(r => !r);
            setEditId(null);
            setOpen(false);
            alert("Asset edited Successfully")
        }catch{
            alert("Failed to edit asset")
        }
        
    };

    // View click handler
    const handleViewClick = (asset) => {
        setFormData({
            name: asset.name,
            type: asset.type,
            serial_number: asset.serial_number,
            purchase_date: asset.purchase_date || "",
            warranty_expiry: asset.warranty_expiry || "",
        });
        setViewOnly(true);
        setOpen(true);
        };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this item?")) return;
        
        try{
            await apiClient.delete(`assets/${id}/`);
            
             // If this was the last item on the page
            if (assets.length === 1 && page > 1) {
                setPage(page - 1);      // move to previous page
            } else {
                setReload((r) => !r);  // just refetch current page
            }
            alert(" Asset deleted Successfully")
            }catch{
                alert("Faild to delete asset")
            }
        
    };

    
    if (loading) return <p>Loading assets...</p>;
    if (error) return <p>{error}</p>;


    return(
        <div>
            <h2>Assets</h2>

            {/* Top controls: Search + Sort + Add */}
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>

                {/* Search input */}
                <TextField
                    label="Search assets..."
                    variant="outlined"
                    value={searchInput}
                    onChange={(e)=>{setSearchInput(e.target.value);
                        setPage(1);}}
                    sx={{ mb: 2, width: "250px" }}
                />

                {/* Sort field */}
                <FormControl sx={{ minWidth:150}}>
                    <InputLabel>Sort by</InputLabel>
                    <Select
                        label="Sort by"
                        value={sortField}
                        onChange={(e)=>{
                            setSortField(e.target.value);
                            setPage(1);
                        }}
                    >
                        <MenuItem value="name">Name</MenuItem>
                        <MenuItem value="type">Type</MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                    </Select>
                </FormControl>

                {/* Sort order toggle */}
                <Button
                    variant="outlined"
                    onClick={()=>
                        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc") )
                    }
                >
                    {sortOrder === "asc" ? "Asc ↑" : "Desc ↓"}
                </Button>

                {/* Add asset button */}
                <Button
                    variant="contained"
                    sx={{ ml: 2 }}
                    onClick={() => {
                        setEditId(null);
                        setViewOnly(false);
                        setFormData({
                            name:"",
                            type:"",
                            serial_number:"",
                            purchase_date: "",
                            warranty_expiry: "",
                        })
                        setOpen(true)
                    }}
                >
                    Add Asset
                </Button>
            </Stack>

            {/* Table */}
            <CustomTable
                columns={["Name","Type","Serial","Status","User","Actions"]}
                data={assets.map((a)=>(
                    {
                        name:a.name,
                        type:a.type,
                        serial_number:a.serial_number,
                        status:a.status,
                        user:a.user ? a.user : "—",
                        actions:(
                            <>
                                <Button size="small" onClick={() => handleViewClick(a)}>View</Button>
                                <Button size="small" onClick={() =>handleEditClick(a)} disabled={a.status === "ASSIGNED"}>Edit</Button>
                                <Button size="small" color="error" onClick={() =>handleDelete(a.id)}>Delete</Button>
                            </>
                        )
                    }
                ))}
            />

            {/* Pagination controls */}
            <Stack
                direction="row"
                spacing={2}
                sx = {{ mt: 2 }}
                alignItems="center"
            >
                <Button
                    variant="outlined"
                    onClick={() => setPage(page - 1)}
                    disabled={!previous}
                >
                    Previous
                </Button>
                <span>
                    Page {page} of {Math.ceil(count/PAGE_SIZE)}
                </span>
                <Button
                    variant="outlined"
                    onClick={()=>setPage(page+1)}
                    disabled={!next}
                >
                    Next
                </Button>
            </Stack>

            {/* Add Asset Modal */}
            <ModalForm
                open={open}
                title={viewOnly ? "View Asset": editId ? "Edit Asset" : "Add Asset"}
                onClose={() => {
                    setOpen(false);
                    setViewOnly(false);
                    setEditId(null);
                }}
                onSubmit={viewOnly ? null : editId ? handleSaveEdit : handleAddAsset}
            >


                <TextField
                    label="Name"
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={viewOnly}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Type</InputLabel>
                        <Select
                            value={formData.type}
                            label="Type"
                            disabled={viewOnly}
                            onChange={(e) =>
                            setFormData({ ...formData, type: e.target.value })
                            }
                        >
                            <MenuItem value="LAPTOP">Laptop</MenuItem>
                            <MenuItem value="MONITOR">Monitor</MenuItem>
                            <MenuItem value="KEYBOARD">Keyboard</MenuItem>
                            <MenuItem value="MOUSE">Mouse</MenuItem>
                            <MenuItem value="OTHER">Other</MenuItem>
                        </Select>
                </FormControl>

                <TextField
                    label="Serial Number"
                    fullWidth
                    sx={{ mb: 2 }}
                    disabled={!isAdd}
                    value={formData.serial_number}
                    onChange={
                        isAdd
                        ? (e) =>
                            setFormData({ ...formData, serial_number: e.target.value })
                        : undefined
                    }
                />


                <TextField
                    label="Purchase Date (Optional)"
                    type="date"
                    fullWidth
                    disabled={!isAdd}
                    sx={{ mb: 2 }}
                    slotProps={{ inputLabel: { shrink: true },}}
                    value={formData.purchase_date || ""}
                    onChange={
                        isAdd ? (e) =>
                                    setFormData({ ...formData, purchase_date: e.target.value })
                                : undefined
                    }
                />

                <TextField
                    label="Warranty Expiry (Optional)"
                    type="date"
                    fullWidth
                    disabled={!isAdd}
                    sx={{ mb: 2 }}
                    slotProps={{ inputLabel: { shrink: true }, }}
                    value={formData.warranty_expiry || ""}
                    onChange={
                        isAdd ? (e) =>
                                    setFormData({ ...formData, warranty_expiry: e.target.value })
                                : undefined
                    }
                />
            </ModalForm>

        </div>
    )
}

export default Assets