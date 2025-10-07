import api from "./api";

export const reactionService = {
  async reactToBlog(blogId, reactionType) {
    const url = `/blog/blogs/${blogId}/reactions/`;
    const res = await api.post(
      url,
      { type: reactionType },
      { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
    );
    return res.data;
  },

  async getReactions(blogId) {
    const url = `/blog/blogs/${blogId}/reactions/`;
    const res = await api.get(url);
    return res.data; 
  },
};
