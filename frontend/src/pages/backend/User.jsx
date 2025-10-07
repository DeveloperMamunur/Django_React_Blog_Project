import { useEffect, useState } from "react";
import { userService } from "../../services/userService";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import { useAuth } from "../../hooks/useAuth";
import { isAdmin } from "../../utils/permissions";
import UserDetailsModal from "../../components/modals/UserDetailsModal";
import Pagination from "../../components/common/Pagination";

export default function User() {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openUserModal, setOpenUserModal] = useState(false);

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const onlyAdmin = isAdmin(currentUser);

    const columns = [
        { key: "id", header: "Id No" },
        { key: "username", header: "User Name" },
        { key: "email", header: "Email" },
        { key: "role", header: "Role" },
        { key: "is_active", header: "Status" },
        { key: "actions", header: "Actions" }, // ✅ match "actions"
    ];

    const PAGE_SIZE = 12;
    const getUsers = async (page=1) => {
        const data = await userService.getAllUser(page);
        setUsers(data.results);
        setCurrentPage(page)
        setTotalPages(Math.ceil(data.count / PAGE_SIZE))
    };

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

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="p-6">
            <div className="mb-6">
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
                    onPageChange={(page) => getUsers(page)}
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
