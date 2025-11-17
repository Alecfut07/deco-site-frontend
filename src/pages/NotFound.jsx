import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight">404</h1>
        <p className="text-muted-foreground">
          The page you're looking for could not be found.
        </p>
      </div>
      <Button asChild>
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
