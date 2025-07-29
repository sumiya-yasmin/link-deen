import API from "@/lib/axios"


interface SearchUsersParams {
  que: string;
  page?: number;
  limit?: number;
}

export const getSuggestedUsers = async (page = 1, limit = 10) => {
    const res = await API.get('/people/suggested', {
        params: {
            page, limit
        },
    });
    return res.data;
}

export const getSearchedUsers = async ({que, page = 1, limit = 10}:SearchUsersParams) => {
  const response = await API.get('/people/search', {
    params: {
        que, page, limit
    },
  });

  return response.data;
}