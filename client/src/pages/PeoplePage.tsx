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

 const {data: profile, isLoading: isLoading} = useGetProfileById(user?._id);
  const { data: suggested, isLoading: loadingSuggested } = useSuggestedPeople();
  const { data: searched, isLoading: loadingSearched } = useSearchedPeople(search);

  return (
       <div className='p-4'>
       <Input 
       placeholder='Search People'
       value={search}
       onChange={(e)=>setSearch(e.target.value)}
       className='mb-4 bg-dark-4 text-gray-300 '
       />
       {search && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Search Results</h3>
       <PeopleCard users={searched} isLoading={loadingSearched}/>
       </div>
       )}
        <Tabs value={tab} onValueChange={setTab} className="mt-4 bg-dark-4">
        <TabsList>
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
           <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Suggested People</h3>
          <PeopleCard users={suggested} isLoading={loadingSuggested}/>

           </div>
    </div>
  );
};

export default PeoplePage;



