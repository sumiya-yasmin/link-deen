import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
function DangerZone() {
  return (
    <Card className="md:min-w-xs flex flex-col justify-center items-center">
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" className="w-full md:w-auto">
            Delete Account
          </Button>
        </CardContent>
      </Card>

  )}

  
export default DangerZone;