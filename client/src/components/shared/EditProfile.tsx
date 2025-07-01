import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEditProfile } from "@/hooks/useProfileApi";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  defaultValues: {
    name: string;
    username: string;
    bio?: string;
  };
};

const EditProfileModal = ({ isOpen, onClose, defaultValues }: Props) => {
  const [name, setName] = useState(defaultValues.name);
  const [username, setUsername] = useState(defaultValues.username);
  const [bio, setBio] = useState(defaultValues.bio || "");

  const editProfileMutation = useEditProfile();

  
  useEffect(() => {
    if (isOpen) {
      setName(defaultValues.name);
      setUsername(defaultValues.username);
      setBio(defaultValues.bio || "");
    }
  }, [isOpen, defaultValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editProfileMutation.mutate(
      { name, username, bio },
      {
        onSuccess: () => {
          onClose(); 
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-3 text-white border-dark-4">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-dark-2 border-dark-4 text-white"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-dark-2 border-dark-4 text-white"
              placeholder="Your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              maxLength={300}
              className="bg-dark-2 border-dark-4 text-white resize-none"
              placeholder="Write something about yourself..."
            />
            <p className="text-sm text-gray-500 mt-1 text-right">{bio.length}/300</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={editProfileMutation.isPending}>
              {editProfileMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
