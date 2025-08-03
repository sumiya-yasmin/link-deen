import { useState } from 'react';
import { Input } from '@/components/ui/input';

import { useAuth } from '@/context/AuthContext';
import PeopleCard from '@/components/shared/PeopleCard';
import { useFollowers, useFollowing, useSearchedPeople, useSuggestedPeople } from '@/hooks/usePeopleApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PeoplePage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('followers');
  const [search, setSearch] = useState('');
  if (!user) return <p>No users found.</p>;
  const limit = 12;


  const { data: followersData, isLoading: loadingFollowers,
    hasNextPage: followersHasNextPage,
    isFetchingNextPage: followersFetchingNextPage,
    fetchNextPage: followersFetchNextPage, } = useFollowers(user?._id, limit)

    const allFollowersUsers = followersData?.pages?.flatMap((page)=> page.followers) ?? [];

    const { data: followingData, isLoading: loadingFollowing,
    hasNextPage: followingHasNextPage,
    isFetchingNextPage: followingFetchingNextPage,
    fetchNextPage: followingFetchNextPage, } = useFollowing(user?._id, limit)

    const allFollowingUsers = followingData?.pages?.flatMap((page)=> page.following) ?? [];


  const {
    data: suggestedData,
    isLoading: loadingSuggested,
    hasNextPage: suggestedHasNextPage,
    isFetchingNextPage: suggestedIsFetchingNextPage,
    fetchNextPage: suggestedFetchNextPage,
  } = useSuggestedPeople(limit);
  const allSuggestedUsers =
    suggestedData?.pages?.flatMap((page) => page.suggestedUsers) ?? [];

  const { data: searchedData, isLoading: loadingSearched,
    hasNextPage: searchedHasNextPage,
    isFetchingNextPage: searchedIsFetchingNextPage,
    fetchNextPage: searchedFetchNextPage,

  } =
    useSearchedPeople(search, limit);
  const allSearchedUsers = searchedData?.pages?.flatMap((page)=>page.users) ?? [];
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Discover People</h1>
          <p className="text-zinc-400">Connect with amazing people in your network</p>
        </div>
    <div className="p-4 max-w-5xl items-center justify-center flex flex-col mx-auto text-white">
      <div className="relative mb-8 min-w-full">
      <Input
        placeholder="Search People"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-12 py-3 bg-zinc-800/50 border-2 border-zinc-700/50 text-white placeholder-zinc-400 rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 backdrop-blur-sm transition-all duration-200"
      />
      </div>
      <div className="max-w-5xl mx-auto">
        {search && (
          <div className="mb-10">
            {!loadingSearched && searchedData && (
              <div>
              <h3 className="text-lg font-semibold mb-3 mt-3">
                Search Results
              </h3>
               <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
               </div>
            )}
            <PeopleCard
              users={allSearchedUsers}
              isLoading={loadingSearched}
               hasNextPage={searchedHasNextPage}
          isFetchingNextPage={searchedIsFetchingNextPage}
          fetchNextPage={searchedFetchNextPage}
            />
          </div>
        )}
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="mb-10"
        >
          <TabsList className="h-auto grid w-full grid-cols-2 mb-8 p-1 border border-zinc-700/40">
            <TabsTrigger value="followers"
            className="data-[state=active]:!bg-zinc-700/70 data-[state=active]:!text-white data-[state=active]:!font-medium !text-zinc-300 !font-medium py-3 rounded-lg transition-all duration-200 data-[state=active]:shadow-lg"
            >
              <div>

              Followers ({followersData?.pages[0]?.total || 0})
              </div>
            </TabsTrigger>
            <TabsTrigger value="following"
            className="data-[state=active]:!bg-zinc-700/70 data-[state=active]:!text-white data-[state=active]:!font-medium !text-zinc-300 !font-medium py-3 rounded-lg transition-all duration-200 data-[state=active]:shadow-lg"
            >
              <div className='flex justify-center items-center'>

              Following ({followingData?.pages[0]?.total || 0})
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="followers" >
                    <PeopleCard
          users={allFollowersUsers}
          isLoading={loadingFollowers}
          hasNextPage={followersHasNextPage}
          isFetchingNextPage={followersFetchingNextPage}
          fetchNextPage={followersFetchNextPage}
        />
          </TabsContent>

          <TabsContent value="following">
           <PeopleCard
          users={allFollowingUsers}
          isLoading={loadingFollowing}
          hasNextPage={followingHasNextPage}
          isFetchingNextPage={followingFetchingNextPage}
          fetchNextPage={followingFetchNextPage}
        />
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-12">
        <h3 className="font-semibold text-xl text-white mb-2 flex items-center gap-2">Suggested People</h3>
        <PeopleCard
          users={allSuggestedUsers}
          isLoading={loadingSuggested}
          hasNextPage={suggestedHasNextPage}
          isFetchingNextPage={suggestedIsFetchingNextPage}
          fetchNextPage={suggestedFetchNextPage}
        />
      </div>
    </div>
    </div>
    </div>
  );
};

export default PeoplePage;




