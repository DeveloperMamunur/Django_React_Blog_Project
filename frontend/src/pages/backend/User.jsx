import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { isAdmin } from "../../utils/permissions";
import UserDetailsModal from "../../components/modals/UserDetailsModal";
import Pagination from "../../components/common/Pagination";
import { Search } from "lucide-react";

export default function User() {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openUserModal, setOpenUserModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');

    const onlyAdmin = isAdmin(currentUser);

    const columns = [
        { key: "id", header: "Id No" },
        { key: "username", header: "User Name" },
        { key: "email", header: "Email" },
        { key: "role", header: "Role" },
        { key: "is_active", header: "Status" },
        { key: "actions", header: "Actions" },
    ];

    const roles = [
        { value: "ALL", label: "All" },
        { value: "ADMIN", label: "Admin" },
        { value: "AUTHOR", label: "Author" },
        { value: "USER", label: "User" },
    ];

    const PAGE_SIZE = 12;
    const getUsers = async (page = 1, search = "", role = "ALL") => {
        try {
        const data = await userService.getAllUser(page, { search, role });
            setUsers(data.results || []);
            setCurrentPage(page);
            setTotalPages(Math.ceil(data.count / PAGE_SIZE));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    
    useEffect(() => {
        getUsers(1,searchTerm, selectedRole);
    }, [searchTerm, selectedRole]);

    const handleStatus = async (usr) => {
        try {
            const updatedUser = await userService.toggleStatus(usr.id, {
                is_active: !usr.is_active,
            });
            setUsers((prev) =>
                prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            );
        } catch (error) {
            console.error("Error updating user status:", error);
            alert("Failed to update user status. Please try again.");
        }
    };

    const openUserDetailsModal = async (usr) => {
        try {
            const userDetails = await userService.getUserDetails(usr.id);
            setSelectedUser(userDetails);
            setOpenUserModal(true);
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    const closeUserDetailsModal = () => {
        setSelectedUser(null);
        setOpenUserModal(false);
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                {/* Search & Category Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                        <input
                        type="text"
                            placeholder="Search users by username, name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 dark:text-slate-100"
                        />
                    </div>
                    <div className="md:w-48">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-100 font-medium cursor-pointer"
                        >
                        {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                                {role.label}
                            </option>
                        ))}
                        </select>
                    </div>
                </div>
                <Table
                    columns={columns}
                    data={users}
                    renderCell={(col, value, row) => {
                        if (col.key === "is_active") {
                            return (
                                <Button
                                    variant={row.is_active ? "success" : "danger"}
                                    disabled={!onlyAdmin}
                                    onClick={() => handleStatus(row)}
                                >
                                    {row.is_active ? "✔ Active" : "❌ Inactive"}
                                </Button>
                            );
                        }
                        if (col.key === "actions") { // ✅ correct key
                            return (
                                <Button
                                    variant="info"
                                    onClick={() => openUserDetailsModal(row)}
                                >
                                    View
                                </Button>
                            );
                        }
                        return value;
                    }}
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => getUsers(page, searchTerm, selectedRole)}
                />
            </div>

            <UserDetailsModal
                user={selectedUser}
                isOpen={openUserModal}
                onClose={closeUserDetailsModal}
            />
        </div>
    );
}
