import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { Image, Video, FolderTree, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [stats, setStats] = useState({
    portfolioItems: 0,
    images: 0,
    videos: 0,
    categories: 0,
    services: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [items, categories, services] = await Promise.all([
          api.getPortfolioItems(),
          api.getCategories(),
          api.getServices(),
        ]);

        const imageCount =
          items.results?.reduce(
            (sum, item) => sum + (item.pictures?.length || 0),
            0
          ) || 0;
        const videoCount =
          items.results?.reduce(
            (sum, item) => sum + (item.videos?.length || 0),
            0
          ) || 0;

        // Handle both array and paginated response formats for categories
        const categoriesCount = Array.isArray(categories)
          ? categories.length
          : categories?.count || 0;

        // Handle both array and paginated response formats for services
        const servicesCount = Array.isArray(services)
          ? services.length
          : services?.count || 0;

        setStats({
          portfolioItems: items?.count || 0,
          images: imageCount,
          videos: videoCount,
          categories: categoriesCount,
          services: servicesCount,
        });
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: "Portfolio Items",
      value: stats.portfolioItems,
      icon: Image,
      color: "text-primary",
    },
    {
      title: "Pictures",
      value: stats.images,
      icon: Image,
      color: "text-accent",
    },
    {
      title: "Videos",
      value: stats.videos,
      icon: Video,
      color: "text-purple-500",
    },
    {
      title: "Categories",
      value: stats.categories,
      icon: FolderTree,
      color: "text-green-500",
    },
    {
      title: "Services",
      value: stats.services,
      icon: Briefcase,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={cn("w-4 h-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
