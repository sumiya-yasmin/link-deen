import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useEditProfile, useGetProfileById } from "@/hooks/useProfileApi";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
function EditProfile() {

  const {user} = useAuth();
  const { data: profile, isPending } = useGetProfileById(user?._id!);
  const editProfileMutation = useEditProfile();
  const [name, setName] = useState('');
   const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  useEffect(()=>{
    if(profile){
      setName(profile.name || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    editProfileMutation.mutate({ name, username, bio });
  };

  if (isPending) return <p>Loading profile...</p>;


  return (
     <>
      <div className="space-y-8 ">
      <Card className="md:min-w-xl">
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" value={name} onChange={(e)=> setName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  maxLength={300} />
                   <p className="text-right text-sm text-muted-foreground">{bio.length}/300</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
           <Button type="button" variant="ghost" >
              Cancel
            </Button>
          <Button type="submit" onClick={handleUpdate} disabled={editProfileMutation.isPending} className="">
              {editProfileMutation.isPending ? (
                <>
                 <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating...
                  </span>
                </>
              ) : (
                "Update Profile"
              )}
            </Button>
            </div>
        </CardContent>
      </Card>
      </div>
      </>
  )
}

export default EditProfile