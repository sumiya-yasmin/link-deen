import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
function Theme() {
  return (
       <Card className="min-w-xs flex flex-col justify-center items-center">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Label htmlFor="theme">Dark Mode</Label>
        
          <Button variant="outline" className="w-full md:w-auto" >
            Switch Theme
          </Button>
        </CardContent>
      </Card>

  )}

  
export default Theme;