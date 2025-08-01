import API from "@/lib/axios"

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface SearchUsersParams extends PaginationParams {
  que: string;
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

export const getfollowers = async (userId : string, page =1, limit=10) => {
const res = await API.get(`/people/${userId}/followers`, {
  params: {
    page, limit,
  }
})
return res.data;
};

export const getfollowing = async (userId : string, page =1, limit=10) => {
const res = await API.get(`/people/${userId}/following`, {
  params: {
    page, limit,
  }
})
return res.data;
}