import { useState } from 'react';
import { Input } from '@/components/ui/input';

import { useAuth } from '@/context/AuthContext';
import PeopleCard, { UserIdList } from '@/components/shared/PeopleCard';
import { useSearchedPeople, useSuggestedPeople } from '@/hooks/usePeopleApi';
import { useGetProfileById } from '@/hooks/useProfileApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PeoplePage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('followers');
  const [search, setSearch] = useState('');
  if (!user) return <p>No users found.</p>;
  const limit = 12;

  const { data: profile, isLoading: isLoading } = useGetProfileById(user?._id);
  const {
    data: suggestedData,
    isLoading: loadingSuggested,
    hasNextPage: suggestedHasNextPage,
    isFetchingNextPage: suggestedIsFetchingNextPage,
    fetchNextPage: suggestedFetchNextPage,
  } = useSuggestedPeople(limit);
  const allSuggestedUsers =
    suggestedData?.pages?.flatMap((page) => page.suggestedUsers) ?? [];

  const { data: searchedData, isLoading: loadingSearched } =
    useSearchedPeople(search);
  console.log(searchedData);
  return (
    <div className="p-4 max-w-5xl items-center justify-center flex flex-col mx-auto text-white">
      <Input
        placeholder="Search People"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 bg-zinc-800 border border-zinc-700 text-white placeholder-gray-400 w-full"
      />
      <div className="max-w-5xl mx-auto">
        {search && (
          <div className="mb-8">
            {!loadingSearched && searchedData && (
              <h3 className="text-lg font-semibold mb-3 mt-3">
                Search Results
              </h3>
            )}
            <PeopleCard
              users={searchedData?.users ?? []}
              isLoading={loadingSearched}
            />
          </div>
        )}
        <Tabs
          value={tab}
          onValueChange={setTab}
          className="mt-4 bg-zinc-900 rounded-lg p-4 shadow"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="followers">
              Followers ({profile?.stats.followersCount || 0})
            </TabsTrigger>
            <TabsTrigger value="following">
              Following ({profile?.stats.followingCount || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="followers">
            <UserIdList
              userIds={profile?.stats.followers ?? []}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="following">
            <UserIdList
              userIds={profile?.stats.following ?? []}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Suggested People</h3>
        <PeopleCard
          users={allSuggestedUsers}
          isLoading={loadingSuggested}
          hasNextPage={suggestedHasNextPage}
          isFetchingNextPage={suggestedIsFetchingNextPage}
          fetchNextPage={suggestedFetchNextPage}
        />
      </div>
    </div>
  );
};

export default PeoplePage;
