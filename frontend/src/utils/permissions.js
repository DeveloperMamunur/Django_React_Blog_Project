// utils/permissions.js

// Role checks
export const isAdmin = (user) => user?.role === "ADMIN";
export const isAuthor = (user) => user?.role === "AUTHOR";
export const isUser = (user) => user?.role === "USER";
export const isAdminOrAuthor = (user) => ["ADMIN", "AUTHOR"].includes(user?.role);



// Object-level permissions
export const canEditOrDeleteBlog = (user, blog) => {
    if (!user) return false;
    if (isAdmin(user)) return true;
    if (isAuthor(user)) return blog.author?.id === user.id;
    return false;
};

export const canTogglePublish = (user, blog) => {
    return canEditOrDeleteBlog(user, blog); // same as edit/delete
};

export const canEditOrDeleteObject = (user, obj) => {
    if (!user) return false;
    if (isAdmin(user)) return true;
    return obj.userId === user.id; // for Comment, Like, etc.
};
