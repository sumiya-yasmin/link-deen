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
       <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Dark Mode</Label>
            {/* <Switch
              id="theme"
              checked={isDarkMode}
              onCheckedChange={handleThemeToggle}
            /> */}
          </div>
          <Button variant="outline" className="w-full md:w-auto" >
            Logout
          </Button>
        </CardContent>
      </Card>

  )}

  
export default Theme;