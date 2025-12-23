import { useEffect, useState } from "react";
import { getUsers } from "../api/auth";
import CustomTable from "../components/Table";
import {
  TextField,
  Stack,
  Chip,
} from "@mui/material";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");

 

  //  Search
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();

    return (
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });


  useEffect(() => {
    getUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Failed to load users");
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2>Users</h2>

      {/* Top Controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 250 }}
        />
      </Stack>

      {/* Users Table */}
      <CustomTable
        columns={["Username", "Email", "Role"]}
        data={filteredUsers.map((u) => ({
          username: u.username,
          email: u.email,
          role: (
            <Chip
              label={u.role}
              color={
                u.role === "ADMIN"
                  ? "error"
                  : u.role === "TECHNICIAN"
                  ? "warning"
                  : "primary"
              }
              size="small"
            />
          ),
        }))}
      />
    </div>
  );
};

export default Users;
