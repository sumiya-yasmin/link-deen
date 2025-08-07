import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { useDeleteProfile } from '@/hooks/useProfileApi';
import { useAuth } from '@/context/AuthContext';
function DangerZone() {
  const { user } = useAuth();
  const deleteProfileMutation = useDeleteProfile(user?._id!);
  const handleDelete = () => {
    if (!user?._id) return;
    if (
      window.confirm(
        'Are you sure you want to delete your account? This cannot be undone.'
      )
    ) {
      deleteProfileMutation.mutate();
    }
  };
  return (
    <Card className="md:min-w-xs flex flex-col justify-center items-center">
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          variant="destructive"
          className="w-full md:w-auto bg-red-600"
          onClick={handleDelete}
          disabled={deleteProfileMutation.isPending}
        >
          {deleteProfileMutation.isPending ? 'Deleting....' : ' Delete Account'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default DangerZone;
